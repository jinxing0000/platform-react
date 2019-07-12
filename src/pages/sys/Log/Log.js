import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col,Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message,Input } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Log.less';
const { Item: FormItem } = Form;
const { confirm } = Modal;



@connect(({ log, loading }) => ({
  log,
  getLogListLoading: loading.effects['log/getLogList'],
}))
@Form.create()
class Log extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      params: {page:1,limit:10},
    };
  }

  //页面初始化加载
  componentDidMount() {
    this.getLogList(this.state.params);
  }
  //获取用户list数据
  getLogList(params){
    const { dispatch } = this.props;
    dispatch({
      type: 'log/getLogList',
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
      this.getLogList(values);
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
    this.getLogList(searchParams);
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
    this.getLogList(searchParams);
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
              {getFieldDecorator('userName',{initialValue: params.userName,})(<Input placeholder="请输入用户名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="操作名">
              {getFieldDecorator('operation',{initialValue: params.operation,})(<Input placeholder="请输入操作名" />)}
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
      log: { logList},
      getLogListLoading,
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
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        textWrap: 'ellipsis',
        width: 100,
      },
      {
        title: '用户操作',
        dataIndex: 'operation',
        key: 'operation',
        textWrap: 'ellipsis',
        width:100
      },

      {
        title: '请求方法',
        key: 'method',
        dataIndex: 'method',
        textWrap: 'ellipsis',
        width:200
      },
      {
        title: '请求参数',
        dataIndex: 'params',
        key: 'params',
        textWrap: 'ellipsis',
        width:300
      },
      {
        title: '执行时长',
        dataIndex: 'time',
        key: 'time',
        textWrap: 'ellipsis',
        width:60
      },

      {
        title: 'ip地址',
        key: 'ip',
        dataIndex: 'ip',
        textWrap: 'ellipsis',
        width:100
      },
      {
        title: '创建时间',
        key: 'createDate',
        dataIndex: 'createDate',
        textWrap: 'ellipsis',
        width:100
      },
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList} style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div className={styles.tableListOperator}>
          </div>
          <StandardTable
            rowKey="userId"
            defaultExpandAllRows
            loading={getLogListLoading}
            selectedRows={true}
            data={logList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default Log;