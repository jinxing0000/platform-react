import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col,Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message,Input } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Role.less';
import RoleAddOrUpdate from './RoleAddOrUpdate';
const { Item: FormItem } = Form;
const { confirm } = Modal;



@connect(({ role, loading,user }) => ({
  role,
  user,
  getRoleListLoading: loading.effects['role/getRoleList'],
  saveRoleLoading: loading.effects['role/saveRoleInfo'],
  editRoleLoading: loading.effects['role/editRoleInfo'],
  deleteRoleByIdsLoading: loading.effects['role/deleteRoleByIds'],
}))
@Form.create()
class Role extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      params: {page:1,limit:10},
    };
  }

  //页面初始化加载
  componentDidMount() {
    this.getRoleList(this.state.params);
  }
  //获取角色list数据
  getRoleList(params){
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getRolePageList',
      payload: params,
    });
  } 
   //查询角色list
  handleSearch= e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { params } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        page: params.page,
        limit: params.limit,
      };
      this.setState({
        params: values,
      });
      this.getRoleList(values);
    });
  };
  //重置查询条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { params } = this.state;
    form.resetFields();
    let searchParams = {page:params.page,limit:params.limit}
    this.setState({
      params: searchParams,
    });
    this.getRoleList(searchParams);
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
    .then(({code}) => {
      if(code===0){
        callback('ok');
        this.getRoleList(this.state.params);
      }
    });
  };
  //删除部门
  deleteRoleByIds(ids){
    const { dispatch } = this.props;
    dispatch({
      type: "role/deleteRoleByIds",
      payload: ids,
    })
    .then(({code}) => {
      if(code===0){
        this.getRoleList(this.state.params);
      }
    });
  }
  //批量删除角色信息
  batchDeleteRole(){
    const {selectedRows} = this.state;
    if(selectedRows.length===0){
      message.error("请选择角色！！", 10);
       return ;
    }
    let ids=new Array();
    for(var i=0;i<selectedRows.length;i++){
      ids[i]=selectedRows[i].roleId;
    }
    let rolePage=this;
    confirm({
      title: '您确定要删除所选角色?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        rolePage.deleteRoleByIds(ids);
      },
      onCancel() {
          
      },
    });
  }



  // 翻页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { params } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const searchParams = {
      ...params,
      ...filters,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    if (sorter.field) {
      searchParams.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.setState({
      params: searchParams,
    });
    this.getRoleList(searchParams);
  };


  //按照id获取部门数据
  getDeptInfoById(id){
    const { dispatch,deptTreeList,deptInfo } = this.props;
    dispatch({
      type: "dept/getDeptInfoById",
      payload: id,
    }).then(() => {
      window.modal.current.getWrappedInstance().alertModal({
        title: '编辑角色',
        loading: 'role/editRoleInfo',
        btnSubTitle: '修改',
        component: DeptAddOrUpdate,
        deptTreeList,
        deptInfo,
        apply: this.handleAdd,
      });
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
   
   renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {params }= this.state; 
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('roleName',{initialValue: params.roleName,})(<Input placeholder="请输入角色名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="角色编码">
              {getFieldDecorator('roleCode',{initialValue: params.roleCode})(<Input placeholder="请输入角色编码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  } 
  render() {
    const {
      role: { roleList,deptInfo },
      user:{ currentUser },
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
            { currentUser.permsSet && currentUser.permsSet.includes('sys:role:update') &&
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
            }
            { currentUser.permsSet && currentUser.permsSet.includes('sys:role:update') &&
            <Divider type="vertical" />
            }
            { currentUser.permsSet && currentUser.permsSet.includes('sys:role:delete') &&
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
            }
          </Fragment>
        ),
      },
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div className={styles.tableListOperator}>
          { currentUser.permsSet && currentUser.permsSet.includes('sys:role:save') &&
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
            }
            { currentUser.permsSet && currentUser.permsSet.includes('sys:role:delete') &&
            <Button
              icon="delete"
              type="danger"
              onClick={() => {
                  this.batchDeleteRole();
              }}
            >
              批量删除
            </Button>
            }
          </div>
          <StandardTable
            rowKey="roleId"
            defaultExpandAllRows
            loading={getRoleListLoading||saveRoleLoading||editRoleLoading||deleteRoleByIdsLoading}
            selectedRows={true}
            data={roleList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default Role;