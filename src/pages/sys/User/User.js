import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col,Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message,Input } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './User.less';
import UserAddOrUpdate from './UserAddOrUpdate';
const { Item: FormItem } = Form;
const { confirm } = Modal;



@connect(({ user, loading }) => ({
  user,
  getUserListLoading: loading.effects['user/getUserList'],
  saveUserLoading: loading.effects['user/saveUserInfo'],
  editUserLoading: loading.effects['user/editUserInfo'],
  deleteUserByIdsLoading: loading.effects['user/deleteUserByIds'],
}))
@Form.create()
class User extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      params: {page:1,limit:10},
    };
  }

  //页面初始化加载
  componentDidMount() {
    this.getUserList(this.state.params);
  }
  //获取用户list数据
  getUserList(params){
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserList',
      payload: params,
    });
  } 
   //条件查询list
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
      this.getUserList(values);
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
    this.getUserList(searchParams);
  };
  //新增修改用户信息
  handleSaveUserInfo = (fields,callback) => {
    debugger;
    const { dispatch } = this.props;
    const userId=fields.userId;
    let url="";
    //判断为新增
    if(userId==null){
      url="user/saveUserInfo";
    }
    //修改
    else{
      url="user/editUserInfo";
    }
    dispatch({
      type: url,
      payload: fields,
    })
    .then(({code}) => {
      if(code===0){
        callback('ok');
        this.getUserList(this.state.params);
      }
    });
  };
  //删除用户
  deleteUserByIds(ids){
    const { dispatch } = this.props;
    dispatch({
      type: "user/deleteUserByIds",
      payload: ids,
    })
    .then(({code}) => {
      if(code===0){
        this.getUserList(this.state.params);
      }
    });
  }
  //批量删除用户信息
  batchDeleteUser(){
    const {selectedRows} = this.state;
    if(selectedRows.length===0){
      message.error("请选择用户！！", 10);
       return ;
    }
    let ids=new Array();
    for(var i=0;i<selectedRows.length;i++){
      ids[i]=selectedRows[i].userId;
    }
    let userPage=this;
    confirm({
      title: '您确定要删除所选用户?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        userPage.deleteUserByIds(ids);
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
    this.getUserList(searchParams);
  };

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
            <FormItem label="用户名">
              {getFieldDecorator('username',{initialValue: params.userName,})(<Input placeholder="请输入用户名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickName',{initialValue: params.nickName,})(<Input placeholder="请输入昵称" />)}
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
      user: { userList},
      getUserListLoading,
      saveUserLoading,
      editUserLoading,
      deleteUserByIdsLoading
    } = this.props;
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
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
    },  
    {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
    },
    {
        title: '手机号',
        key: 'mobile',
        dataIndex: 'mobile',
    },
    {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: record => {
          switch (record) {
            case '00':
              return <span>禁用</span>;
              break;
            case '01':
              return <span>正常</span>;
              break;
            default:
              break;
          }
        },
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
                    title: '编辑用户',
                    loading: 'user/editUserInfo',
                    btnSubTitle: '修改',
                    component: UserAddOrUpdate,
                    record,
                    apply: this.handleSaveUserInfo,
                  });
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除这个用户吗？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => {
                let ids=new Array();
                ids[0]=record.userId;
                this.deleteUserByIds(ids);
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
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                window.modal.current.getWrappedInstance().alertModal({
                  title: '新增用户',
                  btnSubTitle: '新增',
                  loading: 'user/saveUserInfo',
                  component: UserAddOrUpdate,
                  record: {},
                  apply: this.handleSaveUserInfo,
                });
              }}
            >
              新增
            </Button>
            <Button
              icon="delete"
              type="danger"
              onClick={() => {
                  this.batchDeleteUser();
              }}
            >
              批量删除
            </Button>
          </div>
          <StandardTable
            rowKey="userId"
            defaultExpandAllRows
            loading={getUserListLoading||saveUserLoading||editUserLoading||deleteUserByIdsLoading}
            selectedRows={true}
            data={userList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default User;