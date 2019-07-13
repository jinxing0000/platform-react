import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col,Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message,Input } from 'antd';
import { routerRedux } from 'dva/router';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Job.less';
import JobAddOrUpdate from './JobAddOrUpdate';
const { Item: FormItem } = Form;
const { confirm } = Modal;



@connect(({ jobLog, loading }) => ({
    jobLog,
    getJobLogListLoading: loading.effects['jobLog/getJobLogList'],
}))
@Form.create()
class JobLog extends PureComponent {

  constructor(props) {
    super(props);
    const params=this.props.location.params;
    this.state = {
      selectedRows: [],
      params: {page:1,limit:10,jobId:params.jobId},
    };
  }

  //页面初始化加载
  componentDidMount() {
    this.getJobLogList(this.state.params);
  }
  //获取日志list数据
  getJobLogList(params){
    const { dispatch } = this.props;
    dispatch({
      type: 'jobLog/getJobLogList',
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
      this.getJobLogList(values);
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
    this.getJobLogList(searchParams);
  };



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
    this.getJobLogList(searchParams);
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

  goJobList(){
    this.props.dispatch(routerRedux.push({ 
      pathname: '/system/job/jobList',
    }))
  }


  render() {
    const {
      jobLog: { jobLogList},
      getJobLogListLoading,
    } = this.props;
    const columns = [
        {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            render: (record, text, index) => {
              return <span>{index + 1}</span>;
            },
            textWrap: 'ellipsis',
            width: 50,
          },
          {
            title: 'bean名称',
            dataIndex: 'beanName',
            key: 'beanName',
            textWrap: 'ellipsis',
            width: 200,
          },
          {
            title: '方法名称',
            dataIndex: 'methodName',
            key: 'methodName',
            textWrap: 'ellipsis',
            width: 200,
          },
          {
            title: '参数',
            dataIndex: 'params',
            key: 'params',
            textWrap: 'ellipsis',
            width: 300,
          },
          {
            title: '执行时间',
            dataIndex: 'createTime',
            key: 'createTime',
            textWrap: 'ellipsis',
            width: 120,
          },
          {
            title: '执行状态',
            dataIndex: 'status',
            key: 'status',
            textWrap: 'ellipsis',
            width: 80,
            render: record => {
                switch (record) {
                  case 0:
                    return <span>成功</span>;
                    break;
                  case 1:
                    return <span>失败</span>;
                    break;
                  default:
                    break;
                }
              },
          },
          {
            title: '错误信息',
            dataIndex: 'error',
            key: 'error',
            textWrap: 'ellipsis',
            width: 250,
          },
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList} style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
        {/* <div className={styles.tableListForm}>{this.renderSimpleForm()}</div> */}
          <div className={styles.tableListOperator}>
          <Button
              icon="left-circle"
              onClick={() => {
                this.goJobList();
              }}
            >
              返回
            </Button>
          </div>
          <StandardTable
            rowKey="logId"
            defaultExpandAllRows
            loading={getJobLogListLoading}
            selectedRows={true}
            data={jobLogList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default JobLog;