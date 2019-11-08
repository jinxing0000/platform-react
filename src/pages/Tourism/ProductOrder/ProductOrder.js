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
  Select,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ProductOrder.less';
import ProductOrderAddOrUpdate from './ProductOrderAddOrUpdate';
import { routerRedux } from 'dva/router';
const { Item: FormItem } = Form;
const { confirm } = Modal;

@connect(({ productOrder, loading, user }) => ({
  productOrder,
  user,
  getListLoading: loading.effects['productOrder/getPageList'],
  saveLoading: loading.effects['productOrder/saveInfo'],
  editLoading: loading.effects['productOrder/editInfo'],
  deleteByIdsLoading: loading.effects['productOrder/deleteByIds'],
}))
@Form.create()
class ProductOrder extends PureComponent {
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
  //获取旅游产品订单信息表list数据
  getList(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'productOrder/getPageList',
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
  //新增修改旅游产品订单信息表信息
  handleSaveInfo = (fields, callback) => {
    const { dispatch } = this.props;
    const id = fields.id;
    let url = '';
    //判断为新增
    if (id == null) {
      url = 'productOrder/saveInfo';
    }
    //修改
    else {
      url = 'productOrder/editInfo';
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
  //删除旅游产品订单信息表
  deleteByIds(ids) {
    const { dispatch } = this.props;
    dispatch({
      type: 'productOrder/deleteByIds',
      payload: ids,
    }).then(({ code }) => {
      if (code === 0) {
        this.getList(this.state.params);
      }
    });
  }
  //批量删除旅游产品订单信息表信息
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
            <FormItem label="产品名称">
              {getFieldDecorator('productName', { initialValue: params.productName })(
                <Input placeholder="请输入产品名称" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="渠道商名称">
              {getFieldDecorator('channelMerchantsName', {
                initialValue: params.channelMerchantsName,
              })(<Input placeholder="请输入渠道商名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('contactsName', {
                initialValue: params.contactsName,
              })(<Input placeholder="请输入联系人" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系手机号">
              {getFieldDecorator('contactNumber', {
                initialValue: params.contactNumber,
              })(<Input placeholder="请输入联系手机号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="供应商名称">
              {getFieldDecorator('supplierName', {
                initialValue: params.supplierName,
              })(<Input placeholder="请输入供应商名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('state', {
                initialValue: params.state,
              })(
                <Select style={{ width: '100%' }}>
                  <Select.Option key="0" value="0">
                    全部
                  </Select.Option>
                  <Select.Option key="01" value="01">
                    未处理
                  </Select.Option>
                  <Select.Option key="02" value="02">
                    未出行
                  </Select.Option>
                  <Select.Option key="03" value="03">
                    已完成
                  </Select.Option>
                  <Select.Option key="04" value="04">
                    已取消
                  </Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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

  goToOrderDetailsPage(id) {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/order/orderList/orderDetails',
        query: {
          id: id,
        },
      })
    );
  }

  render() {
    const {
      productOrder: { productOrderList },
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
      // {
      //   title: '产品id',
      //   dataIndex: 'productId',
      //   key: 'productId',
      // },
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
      },
      // {
      //   title: '产品引导图',
      //   dataIndex: 'productGuidePicUrl',
      //   key: 'productGuidePicUrl',
      // },
      // {
      //   title: '订单类型',
      //   dataIndex: 'orderType',
      //   key: 'orderType',
      //   render: record => {
      //     switch (record) {
      //       case '1':
      //         return <span>旅游产品订单</span>;
      //         break;
      //       default:
      //         break;
      //     }
      //   },
      // },
      {
        title: '成人数量/人',
        dataIndex: 'adultNumber',
        key: 'adultNumber',
      },
      {
        title: '儿童数量/人',
        dataIndex: 'childrenNumber',
        key: 'childrenNumber',
      },
      {
        title: '单房差数量/间',
        dataIndex: 'singleRoomNumber',
        key: 'singleRoomNumber',
      },
      {
        title: '订单总价/元',
        dataIndex: 'orderTotal',
        key: 'orderTotal',
      },
      {
        title: '出发时间',
        dataIndex: 'setOutDate',
        key: 'setOutDate',
      },
      {
        title: '联系人',
        dataIndex: 'contactsName',
        key: 'contactsName',
      },
      {
        title: '联系手机号',
        dataIndex: 'contactNumber',
        key: 'contactNumber',
      },
      // {
      //   title: '邮箱',
      //   dataIndex: 'email',
      //   key: 'email',
      // },
      // {
      //   title: '留言信息',
      //   dataIndex: 'leavingMessage',
      //   key: 'leavingMessage',
      // },
      {
        title: '渠道商名称',
        dataIndex: 'channelMerchantsName',
        key: 'channelMerchantsName',
      },
      // {
      //   title: '供应商名称',
      //   dataIndex: 'supplierName',
      //   key: 'supplierName',
      // },
      {
        title: '成交价格/元',
        dataIndex: 'transactionPrice',
        key: 'transactionPrice',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: record => {
          switch (record) {
            case '01':
              return <span>未处理</span>;
              break;
            case '02':
              return <span>未出行</span>;
              break;
            case '03':
              return <span>已完成</span>;
              break;
            case '04':
              return <span>已取消</span>;
              break;
            default:
              break;
          }
        },
      },
      // {
      //   title: '渠道商id',
      //   dataIndex: 'channelMerchantsId',
      //   key: 'channelMerchantsId',
      // },
      // {
      //   title: '供应商id',
      //   dataIndex: 'supplierId',
      //   key: 'supplierId',
      // },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {currentUser.permsSet && currentUser.permsSet.includes('tourism:productOrder:handle') && (
              <Tooltip placement="bottom" title="处理">
                <Icon
                  type="edit"
                  style={{ fontSize: '15px' }}
                  onClick={() => {
                    this.goToOrderDetailsPage(record.id);
                  }}
                />
              </Tooltip>
            )}
            {currentUser.permsSet &&
              currentUser.permsSet.includes('tourism:productOrder:handle') && (
                <Divider type="vertical" />
              )}
            {currentUser.permsSet &&
              currentUser.permsSet.includes('tourism:productOrder:complete') && (
                <Tooltip placement="bottom" title="处理">
                  <Icon
                    type="edit"
                    style={{ fontSize: '15px' }}
                    onClick={() => {
                      window.modal.current.getWrappedInstance().alertModal({
                        title: '编辑',
                        loading: 'productOrder/editInfo',
                        btnSubTitle: '修改',
                        component: ProductOrderAddOrUpdate,
                        record,
                        apply: this.handleSaveInfo,
                      });
                    }}
                  />
                </Tooltip>
              )}
            {currentUser.permsSet &&
              currentUser.permsSet.includes('tourism:productOrder:complete') && (
                <Divider type="vertical" />
              )}
            {currentUser.permsSet && currentUser.permsSet.includes('tourism:productOrder:cancel') && (
              <Popconfirm
                title="确认取消订单吗？"
                okText="取消"
                cancelText="不取消"
                onConfirm={() => {
                  let ids = new Array();
                  ids[0] = record.id;
                  this.deleteByIds(ids);
                }}
              >
                <a>
                  <Tooltip placement="bottom" title="取消订单">
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
            {currentUser.permsSet && currentUser.permsSet.includes('tourism:productOrder:save') && (
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  window.modal.current.getWrappedInstance().alertModal({
                    title: '新增',
                    btnSubTitle: '新增',
                    loading: 'productOrder/saveInfo',
                    component: ProductOrderAddOrUpdate,
                    record: {},
                    apply: this.handleSaveInfo,
                  });
                }}
              >
                新增
              </Button>
            )}
            {currentUser.permsSet && currentUser.permsSet.includes('tourism:productOrder:delete') && (
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
            data={productOrderList}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}
export default ProductOrder;
