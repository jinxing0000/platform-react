import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Role.less';
import RoleAddOrUpdate from './RoleAddOrUpdate';



@connect(({ role, loading }) => ({
  role,
  getRoleListLoading: loading.effects['role/getRoleList'],
  saveRoleLoading: loading.effects['role/saveRoleInfo'],
  editRoleLoading: loading.effects['role/editRoleInfo'],
  deleteRoleByIdsLoading: loading.effects['role/deleteRoleByIds'],
}))
@Form.create()
class Role extends PureComponent {

  state = {
    formValues: {},
    edit:false,
    params:{page:1,limit:10}
  };

  //页面初始化加载
  componentDidMount() {
    const { dispatch } = this.props;
    this.handleSearch(this.state.params);
  }

   //查询角色list
   handleSearch(params) {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'role/getRoleList',
      payload: params,
    });
  };
  //新增修改部门
  handleSaveRoleInfo = (fields,callback) => {
    const { dispatch } = this.props;
    const roleId=fields.roleId;
    let url="";
    //判断为新增
    if(roleId==null){
      url="role/saveRoleInfo";
    }
    //修改
    else{
      url="role/editRoleInfo";
    }
    dispatch({
      type: url,
      payload: fields,
    })
    .then(() => {
      callback('ok');
      this.handleSearch(this.state.params);
    });
  };
  //删除部门
  deleteRoleByIds(id){
    const { dispatch } = this.props;
    dispatch({
      type: "role/deleteRoleByIds",
      payload: id,
    })
    .then(() => {
      this.handleSearch(this.state.params);
    });
  }

  // 翻页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.handleSearch(params);
  };


  //按照id获取部门数据
  getDeptInfoById(id){
    const { dispatch,deptTreeList,deptInfo } = this.props;
    dispatch({
      type: "dept/getDeptInfoById",
      payload: id,
    }).then(() => {
      window.modal.current.getWrappedInstance().alertModal({
        title: '编辑部门',
        loading: 'dept/editDeptInfo',
        btnSubTitle: '修改',
        component: DeptAddOrUpdate,
        deptTreeList,
        deptInfo,
        apply: this.handleAdd,
      });
    });
  }

   closeModal=()=>{
     this.setState({
       edit:false
     })
   }
   onOK=()=>{
     this.setState({
       edit:true
     })
   }
  render() {
    const {
      role: { roleList,deptInfo },
      getRoleListLoading,
      saveRoleLoading,
      editRoleLoading,
      deleteRoleByIdsLoading
    } = this.props;
    const{edit} =this.state;
    const columns = [
    {
        title: '序号',
        dataIndex: 'num',
        key: 'num',
        render: (record, text, index) => {
            return <span>{index + 1}</span>;
        },
     },
    {
        title: '角色编码',
        dataIndex: 'roleCode',
        key: 'roleCode',
    },
    {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
    },  
    {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
    },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {/*<Tooltip placement="bottom" title="查看">*/}
            {/*<Icon type="eye-o" style={{ fontSize: '15px' }} />*/}
            {/*</Tooltip>*/}
            {/*<Divider type="vertical" />*/}
            <Tooltip placement="bottom" title="编辑">
              <Icon
                type="edit"
                style={{ fontSize: '15px' }}
                onClick={() => {
                  window.modal.current.getWrappedInstance().alertModal({
                    title: '编辑部门',
                    loading: 'role/editRoleInfo',
                    btnSubTitle: '修改',
                    component: RoleAddOrUpdate,
                    record,
                    apply: this.handleSaveRoleInfo,
                  });
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除这个角色吗？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => {
                let ids=new Array();
                ids[0]=record.roleId;
                this.deleteRoleByIds(ids);
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
      // <PageHeaderWrapper title="部门管理">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                window.modal.current.getWrappedInstance().alertModal({
                  title: '新增角色',
                  btnSubTitle: '新增',
                  loading: 'role/saveRoleInfo',
                  component: RoleAddOrUpdate,
                  record: {},
                  apply: this.handleSaveRoleInfo,
                });
              }}
            >
              新增
            </Button>
          </div>
          <StandardTable
            rowKey="roleId"
            defaultExpandAllRows
            loading={getRoleListLoading||saveRoleLoading||editRoleLoading||deleteRoleByIdsLoading}
            selectedRows={false}
            data={roleList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
      // <Modal visible={edit} onCancel={this.closeModal} onOk={this.onOk} component={DeptAddOrUpdate} >
          
      // </Modal>
    //</PageHeaderWrapper>
    );
  }
}

export default Role;