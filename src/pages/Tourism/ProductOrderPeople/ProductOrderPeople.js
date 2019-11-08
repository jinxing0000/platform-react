import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Icon,
  Button,
  Divider,
  Tooltip,
  Popconfirm,
  Modal,
  message,
  Input,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ProductOrderPeople.less';
import ProductOrderPeopleAddOrUpdate from './ProductOrderPeopleAddOrUpdate';
const { Item: FormItem } = Form;
const { confirm } = Modal;

@connect(({ productOrderPeople, loading, user }) => ({
  productOrderPeople,
  user,
  getListLoading: loading.effects['productOrderPeople/getPageList'],
  saveLoading: loading.effects['productOrderPeople/saveInfo'],
  editLoading: loading.effects['productOrderPeople/editInfo'],
  deleteByIdsLoading: loading.effects['productOrderPeople/deleteByIds'],
}))
@Form.create()
class ProductOrderPeople extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      params: { page: 1, limit: 10 },
    };
  }

  //页面初始化加载
  componentDidMount() {
    this.getList(this.state.params);
  }
  //获取旅游产品订单出行人员表list数据
  getList(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'productOrderPeople/getPageList',
      payload: params,
    });
  }
  //条件查询list
  handleSearch = e => {
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
      this.getList(values);
    });
  };
  //重置查询条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { params } = this.state;
    form.resetFields();
    let searchParams = { page: params.page, limit: params.limit };
    this.setState({
      params: searchParams,
    });
    this.getList(searchParams);
  };
  //新增修改旅游产品订单出行人员表信息
  handleSaveInfo = (fields, callback) => {
    const { dispatch } = this.props;
    const id = fields.id;
    let url = '';
    //判断为新增
    if (id == null) {
      url = 'productOrderPeople/saveInfo';
    }
    //修改
    else {
      url = 'productOrderPeople/editInfo';
    }
    dispatch({
      type: url,
      payload: fields,
    }).then(({ code }) => {
      if (code === 0) {
        callback('ok');
        this.getList(this.state.params);
      }
    });
  };
  //删除旅游产品订单出行人员表
  deleteByIds(ids) {
    const { dispatch } = this.props;
    dispatch({
      type: 'productOrderPeople/deleteByIds',
      payload: ids,
    }).then(({ code }) => {
      if (code === 0) {
        this.getList(this.state.params);
      }
    });
  }
  //批量删除旅游产品订单出行人员表信息
  batchDelete() {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      message.error('请选择删除数据行！！');
      return;
    }
    let ids = new Array();
    for (var i = 0; i < selectedRows.length; i++) {
      ids[i] = selectedRows[i].id;
    }
    let userPage = this;
    confirm({
      title: '您确定要删除所选数据行?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        userPage.deleteByIds(ids);
      },
      onCancel() {},
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
    this.getList(searchParams);
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
    const { params } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name', { initialValue: params.name })(
                <Input placeholder="请输入名称" />
              )}
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
      productOrderPeople: { productOrderPeopleList },
      user: { currentUser },
      getListLoading,
      saveLoading,
      editLoading,
      deleteByIdsLoading,
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
        title: '订单id',
        dataIndex: 'orderId',
        key: 'orderId',
      },
      {
        title: '游客姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '身份证号',
        dataIndex: 'cardNumber',
        key: 'cardNumber',
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '出生日期',
        dataIndex: 'birthDate',
        key: 'birthDate',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {currentUser.permsSet &&
              currentUser.permsSet.includes('tourism:productOrderPeople:update') && (
                <Tooltip placement="bottom" title="编辑">
                  <Icon
                    type="edit"
                    style={{ fontSize: '15px' }}
                    onClick={() => {
                      window.modal.current.getWrappedInstance().alertModal({
                        title: '编辑',
                        loading: 'productOrderPeople/editInfo',
                        btnSubTitle: '修改',
                        component: ProductOrderPeopleAddOrUpdate,
                        record,
                        apply: this.handleSaveInfo,
                      });
                    }}
                  />
                </Tooltip>
              )}
            {currentUser.permsSet &&
              currentUser.permsSet.includes('tourism:productOrderPeople:update') && (
                <Divider type="vertical" />
              )}
            {currentUser.permsSet &&
              currentUser.permsSet.includes('tourism:productOrderPeople:delete') && (
                <Popconfirm
                  title="确认删除吗？"
                  okText="删除"
                  cancelText="取消"
                  onConfirm={() => {
                    let ids = new Array();
                    ids[0] = record.id;
                    this.deleteByIds(ids);
                  }}
                >
                  <a>
                    <Tooltip placement="bottom" title="删除">
                      <Icon type="delete" style={{ fontSize: '15px', color: '#EE4000' }} />
                    </Tooltip>
                  </a>
                </Popconfirm>
              )}
          </Fragment>
        ),
      },
    ];
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div className={styles.tableListOperator}>
            {currentUser.permsSet &&
              currentUser.permsSet.includes('tourism:productOrderPeople:save') && (
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => {
                    window.modal.current.getWrappedInstance().alertModal({
                      title: '新增',
                      btnSubTitle: '新增',
                      loading: 'productOrderPeople/saveInfo',
                      component: ProductOrderPeopleAddOrUpdate,
                      record: {},
                      apply: this.handleSaveInfo,
                    });
                  }}
                >
                  新增
                </Button>
              )}
            {currentUser.permsSet &&
              currentUser.permsSet.includes('tourism:productOrderPeople:delete') && (
                <Button
                  icon="delete"
                  type="danger"
                  onClick={() => {
                    this.batchDelete();
                  }}
                >
                  批量删除
                </Button>
              )}
          </div>
          <StandardTable
            rowKey="id"
            defaultExpandAllRows
            loading={getListLoading || saveLoading || editLoading || deleteByIdsLoading}
            selectedRows={true}
            data={productOrderPeopleList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}
export default ProductOrderPeople;
