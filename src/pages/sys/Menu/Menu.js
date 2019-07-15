import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Menu.less';
import MenuAddOrUpdate from './MenuAddOrUpdate';



@connect(({ menu, loading }) => ({
  menu,
  getMenuTreeListLoading: loading.effects['menu/getMenuTreeList'],
  saveMenuLoading: loading.effects['menu/saveMenuInfo'],
  editMenuLoading: loading.effects['menu/editMenuInfo'],
  deleteMenuByIdLoading: loading.effects['menu/deleteMenuById'],
}))
@Form.create()
class Menu extends PureComponent {

  state = {
      
  };

  //页面初始化加载
  componentDidMount() {
    const { dispatch } = this.props;
    this.handleSearch();
  }

   //查询部门tree
   handleSearch () {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'menu/getMenuTreeList',
    });
  };
  //新增修改部门
  handleSaveMenuInfo = (fields, callback) => {
    debugger;
    const { dispatch } = this.props;
    const menuId=fields.menuId;
    let url="";
    //判断为新增
    if(menuId==null){
      url="menu/saveMenuInfo";
    }
    //修改
    else{
      url="menu/editMenuInfo";
    }
    dispatch({
      type: url,
      payload: fields,
    })
    .then(({code}) => {
      if(code===0){
        callback('ok');
        this.handleSearch();
      }
    });
  };
  //删除部门
  deleteMenuById(id){
    const { dispatch } = this.props;
    dispatch({
      type: "menu/deleteMenuById",
      payload: id,
    })
    .then(({code}) => {
      if(code===0){
        this.handleSearch();
      }
    });
  }
  render() {
    const {
      menu: { menuTreeList},
      getMenuTreeListLoading,
      saveMenuLoading,
      editMenuLoading,
      deleteMenuByIdLoading
    } = this.props;
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: record => {
          switch (record) {
            case '0':
              return <span>目录</span>;
              break;
            case '1':
              return <span>菜单</span>;
              break;
            case '2':
              return <span>按钮</span>;
              break;
            default:
              break;
          }
        },
      },
      {
        title: '排序',
        dataIndex: 'orderNum',
        key: 'orderNum',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {/*<Tooltip placement="bottom" title="查看">*/}
            {/*<Icon type="eye-o" style={{ fontSize: '15px' }} />*/}
            {/*</Tooltip>*/}
            {/*<Divider type="vertical" />*/}
            <Tooltip placement="bottom" title="编辑菜单">
              <Icon
                type="edit"
                style={{ fontSize: '15px' }}
                onClick={() => {
                  window.modal.current.getWrappedInstance().alertModal({
                    title: '编辑菜单',
                    loading: 'menu/editMenuInfo',
                    btnSubTitle: '修改',
                    component: MenuAddOrUpdate,
                    menuTreeList,
                    record,
                    apply: this.handleSaveMenuInfo,
                  });
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除这个菜单？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => {
                this.deleteMenuById(record.menuId);
              }}
            >
              <a>
                <Tooltip placement="bottom" title="删除">
                  <Icon type="delete" style={{ fontSize: '15px', color: '#EE4000' }} />
                </Tooltip>
              </a>
            </Popconfirm>
           
          </Fragment>
      
        ),
      },
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                window.modal.current.getWrappedInstance().alertModal({
                  title: '新增菜单',
                  btnSubTitle: '新增',
                  loading: 'menu/saveMenuInfo',
                  component: MenuAddOrUpdate,
                  menuTreeList,
                  record: {type:"1"},
                  apply: this.handleSaveMenuInfo,
                });
              }}
            >
               新增
            </Button>
          </div>
          <StandardTable
            rowKey="menuId"
            defaultExpandAllRows={false}
            loading={getMenuTreeListLoading||saveMenuLoading||editMenuLoading||deleteMenuByIdLoading}
            selectedRows={false}
            data={menuTreeList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            pagination={false}
          />
        </div>
      </Card>
    );
  }
}

export default Menu;