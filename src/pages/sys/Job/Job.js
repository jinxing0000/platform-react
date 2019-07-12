import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col,Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message,Input } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Job.less';
import JobAddOrUpdate from './JobAddOrUpdate';
const { Item: FormItem } = Form;
const { confirm } = Modal;



@connect(({ job, loading }) => ({
  job,
  getJobListLoading: loading.effects['job/getJobList'],
  saveJobLoading: loading.effects['job/saveJobInfo'],
  editJobLoading: loading.effects['job/editJobInfo'],
  deleteJobByIdsLoading: loading.effects['job/deleteJobByIds'],
  runJobByIdsLoading: loading.effects['job/runJobByIds'],
  pauseJobByIdsLoading: loading.effects['job/pauseJobByIds'],
  resumeJobByIdsLoading: loading.effects['job/resumeJobByIds'],
}))
@Form.create()
class Job extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      params: {page:1,limit:10},
    };
  }

  //页面初始化加载
  componentDidMount() {
    this.getJobList(this.state.params);
  }
  //获取用户list数据
  getJobList(params){
    const { dispatch } = this.props;
    dispatch({
      type: 'job/getJobList',
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
      this.getJobList(values);
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
    this.getJobList(searchParams);
  };
  //新增修改用户信息
  handleSaveJobInfo = (fields,callback) => {
    const { dispatch } = this.props;
    const jobId=fields.jobId;
    let url="";
    //判断为新增
    if(jobId==null){
      url="job/saveJobInfo";
    }
    //修改
    else{
      url="job/editJobInfo";
    }
    dispatch({
      type: url,
      payload: fields,
    })
    .then(() => {
      callback('ok');
      this.getJobList(this.state.params);
    });
  };
  //删除定时任务
  deleteJobByIds(ids){
    const { dispatch } = this.props;
    dispatch({
      type: "job/deleteJobByIds",
      payload: ids,
    })
    .then(() => {
      this.getJobList(this.state.params);
    });
  }
  //批量删除定时任务信息
  batchDeleteJob(){
    const {selectedRows} = this.state;
    if(selectedRows.length===0){
      message.error("请选择定时任务！！", 10);
       return ;
    }
    let ids=new Array();
    for(var i=0;i<selectedRows.length;i++){
      ids[i]=selectedRows[i].jobId;
    }
    let userPage=this;
    confirm({
      title: '您确定要删除所选定时任务?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        userPage.deleteJobByIds(ids);
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
    this.getJobList(searchParams);
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
            <FormItem label="bean名称">
              {getFieldDecorator('beanName',{initialValue: params.beanName,})(<Input placeholder="请输入bean名称" />)}
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
  //执行任务
  runJob(){
    const {selectedRows} = this.state;
    const { dispatch } = this.props;
    if(selectedRows.length===0){
      message.error("请选择定时任务！！", 10);
       return ;
    }
    let ids=new Array();
    for(var i=0;i<selectedRows.length;i++){
      ids[i]=selectedRows[i].jobId;
    }
    let userPage=this;
    confirm({
      title: '您确定要执行所选定时任务吗?',
      okText: '执行',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
            type: "job/runJobByIds",
            payload: ids,
        })
        .then(() => {
            userPage.getJobList(userPage.state.params);
        });
      },
      onCancel() {
        
      },
    });
  }

  pauseJob(){
    const {selectedRows} = this.state;
    const { dispatch } = this.props;
    if(selectedRows.length===0){
      message.error("请选择定时任务！！", 10);
       return ;
    }
    let ids=new Array();
    for(var i=0;i<selectedRows.length;i++){
      ids[i]=selectedRows[i].jobId;
    }
    let userPage=this;
    confirm({
      title: '您确定要暂停所选定时任务吗?',
      okText: '暂停',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
            type: "job/pauseJobByIds",
            payload: ids,
          })
          .then(() => {
            userPage.getJobList(userPage.state.params);
          });
      },
      onCancel() {
        
      },
    });
  }

  resumeJob(){
    const {selectedRows} = this.state;
    const { dispatch } = this.props;
    if(selectedRows.length===0){
      message.error("请选择定时任务！！", 10);
       return ;
    }
    let ids=new Array();
    for(var i=0;i<selectedRows.length;i++){
      ids[i]=selectedRows[i].jobId;
    }
    let userPage=this;
    confirm({
      title: '您确定恢复所选定时任务吗?',
      okText: '恢复',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
            type: "job/resumeJobByIds",
            payload: ids,
          })
          .then(() => {
            userPage.getJobList(userPage.state.params);
          });
      },
      onCancel() {
        
      },
    });
  }


  render() {
    const {
      job: { jobList},
      getJobListLoading,
      saveJobLoading,
      editJobLoading,
      deleteJobByIdsLoading,
      runJobByIdsLoading,
      pauseJobByIdsLoading,
      resumeJobByIdsLoading
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
            title: 'bean名称',
            dataIndex: 'beanName',
            key: 'beanName',
          },
          {
            title: '方法名称',
            dataIndex: 'methodName',
            key: 'methodName',
          },
          {
            title: '参数',
            dataIndex: 'params',
            key: 'params',
          },
          {
            title: 'cron表达式',
            dataIndex: 'cronExpression',
            key: 'cronExpression',
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: record => {
                switch (record) {
                  case 0:
                    return <span>正常</span>;
                    break;
                  case 1:
                    return <span>暂停</span>;
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
                    title: '编辑定时任务',
                    loading: 'role/editJobInfo',
                    btnSubTitle: '修改',
                    component: JobAddOrUpdate,
                    record,
                    apply: this.handleSaveJobInfo,
                  });
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除这个定时任务吗？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => {
                let ids=new Array();
                ids[0]=record.jobId;
                this.deleteJobByIds(ids);
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
                  title: '新增定时任务',
                  btnSubTitle: '新增',
                  loading: 'job/saveJobInfo',
                  component: JobAddOrUpdate,
                  record: {},
                  apply: this.handleSaveJobInfo,
                });
              }}
            >
              新增
            </Button>
            <Button
              icon="delete"
              type="danger"
              onClick={() => {
                  this.batchDeleteJob();
              }}
            >
              批量删除
            </Button>
            <Button
              type="primary"
              onClick={() => {
                  this.runJob();
              }}
            >
              执行任务
            </Button>
            <Button
              type="primary"
              onClick={() => {
                  this.pauseJob();
              }}
            >
              暂停任务
            </Button>
            <Button
              type="primary"
              onClick={() => {
                  this.resumeJob();
              }}
            >
              恢复任务
            </Button>
          </div>
          <StandardTable
            rowKey="jobId"
            defaultExpandAllRows
            loading={getJobListLoading||saveJobLoading||editJobLoading||deleteJobByIdsLoading||runJobByIdsLoading||pauseJobByIdsLoading||resumeJobByIdsLoading}
            selectedRows={true}
            data={jobList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default Job;