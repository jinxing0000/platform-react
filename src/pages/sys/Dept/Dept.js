import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Dept.less';
import DeptAddOrUpdate from './DeptAddOrUpdate';



@connect(({ dept, loading }) => ({
  dept,
  getDeptTreeListLoading: loading.effects['dept/getTreeList'],
  saveDeptLoading: loading.effects['dept/saveDeptInfo'],
  editDeptLoading: loading.effects['dept/editDeptInfo'],
  deleteDeptByIdLoading: loading.effects['dept/deleteDeptById'],
}))
@Form.create()
class Dept extends PureComponent {

  state = {
    formValues: {},
    edit:false
  };

  //页面初始化加载
  componentDidMount() {
    const { dispatch } = this.props;
    this.handleSearch();
  }

   //查询部门tree
   handleSearch = e => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'dept/getDeptTreeList',
    });
  };
  //新增修改部门
  handleSaveDeptInfo = (fields, callback) => {
    const { dispatch } = this.props;
    const deptId=fields.deptId;
    let url="";
    //判断为新增
    if(deptId==null){
      url="dept/saveDeptInfo";
    }
    //修改
    else{
      url="dept/editDeptInfo";
    }
    dispatch({
      type: url,
      payload: fields,
    })
    .then(() => {
      callback('ok');
    });
  };
  //删除部门
  deleteDeptById(id){
    const { dispatch } = this.props;
    dispatch({
      type: "dept/deleteDeptById",
      payload: id,
    })
    .then(() => {
      this.handleSearch();
    });
  }
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
      dept: { deptTreeList,deptInfo },
      getDeptTreeListLoading,
      saveDeptLoading,
      editDeptLoading,
      deleteDeptByIdLoading
    } = this.props;
    const{edit} =this.state;
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '部门编号',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '排序号',
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
            <Tooltip placement="bottom" title="编辑">
              <Icon
                type="edit"
                style={{ fontSize: '15px' }}
                onClick={() => {
                  window.modal.current.getWrappedInstance().alertModal({
                    title: '编辑部门',
                    loading: 'dept/editDeptInfo',
                    btnSubTitle: '修改',
                    component: DeptAddOrUpdate,
                    deptTreeList,
                    record,
                    apply: this.handleSaveDeptInfo,
                  });
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除这个部门？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => {
                this.deleteDeptById(record.deptId);
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
                  title: '新增部门',
                  btnSubTitle: '新增',
                  loading: 'dept/saveDeptInfo',
                  component: DeptAddOrUpdate,
                  deptTreeList,
                  record: {},
                  apply: this.handleSaveDeptInfo,
                });
                this.onOK;
              }}
            >
              新建
            </Button>
          </div>
          <StandardTable
            rowKey="deptId"
            defaultExpandAllRows={false}
            loading={getDeptTreeListLoading||saveDeptLoading||editDeptLoading||deleteDeptByIdLoading}
            selectedRows={false}
            data={deptTreeList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            pagination={false}
          />
        </div>
      </Card>
      // <Modal visible={edit} onCancel={this.closeModal} onOk={this.onOk} component={DeptAddOrUpdate} >
          
      // </Modal>
    //</PageHeaderWrapper>
    );
  }
}

export default Dept;