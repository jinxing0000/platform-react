import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Tree,
  message,
  Card,
  Upload,
  Modal,
  Icon,
  Spin,
  InputNumber,
  DatePicker,
  Button,
  Tooltip,
  Divider,
  Popconfirm,
} from 'antd';
import { routerRedux } from 'dva/router';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
import styles from './ProductOrder.less';
import { getTimeDistance } from '@/utils/utils';
const { TreeNode } = Tree;
import moment from 'moment';
const { Item: FormItem } = Form;
const Option = Select.Option;

// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';
import ProductOrderPeopleAddOrUpdate from '../ProductOrderPeople/ProductOrderPeopleAddOrUpdate';
import StandardTable from '../../../components/StandardTable';

@Form.create()
@connect(({ productOrder, loading }) => ({
  productOrder,
  handleOrderByIdLoading: loading.effects['productInfo/handleOrderById'],
  completeOrderByIdLoading: loading.effects['productInfo/completeOrderById'],
  cancelOrderByIdLoading: loading.effects['productInfo/cancelOrderById'],
  getInfoByIdLoading: loading.effects['productOrder/getInfoById'],
}))
export default class OrderDetails extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    record: {},
    productInfo: {},
    productOrderInfo: {},
    productOrderPeople: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    let record = this.props.location.query;
    if (record && record.id) {
      dispatch({
        type: 'productOrder/getInfoById',
        payload: record.id,
      }).then(({ code, data }) => {
        if (code === 0) {
          this.setState({
            record: data,
            productInfo: data.productInfo,
            productOrderInfo: data.productOrderInfo,
            productOrderPeople: { list: data.productOrderPeopleList },
          });
        }
      });
    }
  }

  okHandler = e => {
    const { dispatch, form } = this.props;
    const { picList } = this.state.record;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      values.travelInfo = values.travelInfo.toHTML();
      values.productCharacteristic = values.productCharacteristic.toHTML();
      values.costInclusion = values.costInclusion.toHTML();
      values.costExcluded = values.costExcluded.toHTML();
      values.reservationNotes = values.reservationNotes.toHTML();
      values.returnRules = values.returnRules.toHTML();
      values.picList = picList;
      if (!err) {
        if (picList.length === 0) {
          message.error('请上传产品图片！！');
          return;
        }
        if (values.productCharacteristic === '<p></p>') {
          message.error('请输入产品特色！！');
          return;
        }
        if (values.travelInfo === '<p></p>') {
          message.error('请输入产品简介！！');
          return;
        }
        let id = values.id;
        let url = '';
        //判断为新增
        if (id == null) {
          url = 'productInfo/saveInfo';
        }
        //修改
        else {
          url = 'productInfo/editInfo';
        }
        //保存数据
        dispatch({
          type: url,
          payload: values,
        }).then(({ code }) => {
          if (code === 0) {
            this.goToProductList();
          }
        });
      }
    });
  };
  //返回订单列表页面
  goToOrderList = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/order/orderList',
        query: {
          record: {},
        },
      })
    );
  };
  //订单处理
  orderHandle = () => {
    const { productOrderInfo } = this.state;
    let orderId = productOrderInfo.id;
    let state = productOrderInfo.state;
    if (state === '02') {
      message.error('订单已经处理，请勿重复操作！！');
      return;
    } else if (state !== '01') {
      message.error('只有未处理的订单才能处理！！');
      return;
    }
    const { dispatch } = this.props;
    //处理订单
    dispatch({
      type: 'productOrder/handleOrderById',
      payload: { id: orderId },
    }).then(({ code }) => {
      if (code === 0) {
        this.goToOrderList();
      }
    });
  };

  //订单完成
  orderComplete = () => {
    const { productOrderInfo } = this.state;
    let orderId = productOrderInfo.id;
    let state = productOrderInfo.state;
    let transactionPrice = productOrderInfo.transactionPrice;
    if (!transactionPrice) {
      message.error('请输入实际成交价格！！');
      return;
    }
    if (state === '03') {
      message.error('订单已经完成，请勿重复操作！！');
      return;
    } else if (state !== '02') {
      message.error('只有未出行的订单才能处理！！');
      return;
    }
    const { dispatch } = this.props;
    //完成订单;
    dispatch({
      type: 'productOrder/completeOrderById',
      payload: { id: orderId, transactionPrice: transactionPrice },
    }).then(({ code }) => {
      if (code === 0) {
        this.goToOrderList();
      }
    });
  };

  setOrderTransactionPrice = e => {
    const { productOrderInfo } = this.state;
    let transactionPrice = e.target.value;
    productOrderInfo.transactionPrice = transactionPrice;
    this.setState({
      productOrderInfo: productOrderInfo,
    });
  };

  //订单取消
  orderCancel = () => {
    const { productOrderInfo } = this.state;
    let orderId = productOrderInfo.id;
    let state = productOrderInfo.state;
    if (state === '04') {
      message.error('订单已经取消，请勿重复操作！！');
      return;
    } else if (state !== '01') {
      message.error('只有未处理的订单才能处理！！');
      return;
    }
    const { dispatch } = this.props;
    //处理订单
    dispatch({
      type: 'productOrder/cancelOrderById',
      payload: { id: orderId },
    }).then(({ code }) => {
      if (code === 0) {
        this.goToOrderList();
      }
    });
  };

  render() {
    const {
      form,
      getInfoByIdLoading,
      handleOrderByIdLoading,
      completeOrderByIdLoading,
      cancelOrderByIdLoading,
    } = this.props;
    const {
      record,
      previewVisible,
      previewImage,
      productCharacteristicEditorState,
      travelInfoEditorState,
      productInfo,
      productOrderInfo,
      productOrderPeople,
    } = this.state;
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
      //   title: '订单id',
      //   dataIndex: 'orderId',
      //   key: 'orderId',
      // },
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
    ];

    return (
      <Form onSubmit={this.okHandler}>
        <Card
          title="产品信息"
          className={styles.card}
          bordered={false}
          loading={
            getInfoByIdLoading ||
            handleOrderByIdLoading ||
            completeOrderByIdLoading ||
            cancelOrderByIdLoading
          }
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={12}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="产品名称">
                {form.getFieldDecorator('productName', {
                  initialValue: productInfo.productName ? productInfo.productName : null,
                })(<Input placeholder="产品名称" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="线路类型">
                {form.getFieldDecorator('lineType', {
                  initialValue: productInfo.lineType ? productInfo.lineType : null,
                })(
                  <Select style={{ width: '100%' }} disabled="disabled">
                    <Select.Option key="1" value="1">
                      一日游
                    </Select.Option>
                    <Select.Option key="2" value="2">
                      国内游
                    </Select.Option>
                    <Select.Option key="3" value="3">
                      赴台游
                    </Select.Option>
                    <Select.Option key="4" value="4">
                      出境游
                    </Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="出发城市">
                {form.getFieldDecorator('startingCity', {
                  initialValue: productInfo.startingCity ? productInfo.startingCity : null,
                })(
                  <Select style={{ width: '100%' }} disabled="disabled">
                    <Select.Option key="太原市" value="太原市">
                      太原市
                    </Select.Option>
                    <Select.Option key="晋中市" value="晋中市">
                      晋中市
                    </Select.Option>
                    <Select.Option key="大同市" value="大同市">
                      大同市
                    </Select.Option>
                    <Select.Option key="朔州市" value="朔州市">
                      朔州市
                    </Select.Option>
                    <Select.Option key="忻州市" value="忻州市">
                      忻州市
                    </Select.Option>
                    <Select.Option key="阳泉市" value="阳泉市">
                      阳泉市
                    </Select.Option>
                    <Select.Option key="吕梁市" value="吕梁市">
                      吕梁市
                    </Select.Option>
                    <Select.Option key="长治市" value="长治市">
                      长治市
                    </Select.Option>
                    <Select.Option key="晋城市" value="晋城市">
                      晋城市
                    </Select.Option>
                    <Select.Option key="临汾市" value="临汾市">
                      临汾市
                    </Select.Option>
                    <Select.Option key="运城市" value="运城市">
                      运城市
                    </Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="行程天数">
                {form.getFieldDecorator('tripDays', {
                  initialValue: productInfo.tripDays ? productInfo.tripDays : null,
                })(
                  <InputNumber
                    min={1}
                    max={30}
                    defaultValue={1}
                    style={{ width: '85%' }}
                    disabled="disabled"
                  />
                )}
                <span className="ant-form-text"> 天</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="行程晚数">
                {form.getFieldDecorator('tripNightNum', {
                  initialValue: productInfo.tripNightNum ? productInfo.tripNightNum : null,
                })(
                  <InputNumber
                    min={1}
                    max={30}
                    defaultValue={1}
                    style={{ width: '85%' }}
                    disabled="disabled"
                  />
                )}
                <span className="ant-form-text">晚</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="开始日期">
                {form.getFieldDecorator('startDate', {
                  initialValue: productInfo.startDate
                    ? moment(productInfo.startDate, 'YYYY-MM-DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="结束日期">
                {form.getFieldDecorator('endDate', {
                  initialValue: productInfo.endDate
                    ? moment(productInfo.endDate, 'YYYY-MM-DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} disabled="disabled" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="成人价格">
                {form.getFieldDecorator('adultPrice', {
                  initialValue: productInfo.adultPrice ? productInfo.adultPrice : null,
                })(<Input placeholder="成人价格" addonAfter="元" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="儿童价格">
                {form.getFieldDecorator('childrenPrice', {
                  initialValue: productInfo.childrenPrice ? productInfo.childrenPrice : null,
                })(<Input placeholder="儿童价格" addonAfter="元" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单房差">
                {form.getFieldDecorator('singleRoomPrice', {
                  initialValue: productInfo.singleRoomPrice ? productInfo.singleRoomPrice : null,
                })(<Input placeholder="单房差" addonAfter="元" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="咨询电话">
                {form.getFieldDecorator('contactNumber', {
                  initialValue: productInfo.contactNumber ? productInfo.contactNumber : null,
                })(<Input placeholder="咨询电话" disabled="disabled" />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card
          title="订单信息"
          className={styles.card}
          bordered={false}
          loading={
            getInfoByIdLoading ||
            handleOrderByIdLoading ||
            completeOrderByIdLoading ||
            cancelOrderByIdLoading
          }
        >
          {form.getFieldDecorator('id', {
            initialValue: productOrderInfo.id ? productOrderInfo.id : null,
          })(<Input type="hidden" />)}
          {form.getFieldDecorator('state', {
            initialValue: productOrderInfo.state ? productOrderInfo.state : null,
          })(<Input type="hidden" />)}
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="成人">
                {form.getFieldDecorator('adultNumber', {
                  initialValue: productOrderInfo.adultNumber ? productOrderInfo.adultNumber : null,
                })(<Input placeholder="成人人数" addonAfter="人" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="儿童">
                {form.getFieldDecorator('childrenNumber', {
                  initialValue: productOrderInfo.childrenNumber
                    ? productOrderInfo.childrenNumber
                    : null,
                })(<Input placeholder="儿童人数" addonAfter="人" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单房差">
                {form.getFieldDecorator('singleRoomNumber', {
                  initialValue: productOrderInfo.singleRoomNumber
                    ? productOrderInfo.singleRoomNumber
                    : null,
                })(<Input placeholder="单房差间数" addonAfter="间" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="订单总金额">
                {form.getFieldDecorator('orderTotal', {
                  initialValue: productOrderInfo.orderTotal ? productOrderInfo.orderTotal : null,
                })(<Input placeholder="订单总金额" addonAfter="元" disabled="disabled" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="出发日期">
                {form.getFieldDecorator('setOutDate', {
                  initialValue: productOrderInfo.setOutDate
                    ? moment(productOrderInfo.setOutDate, 'YYYY-MM-DD')
                    : null,
                })(<DatePicker style={{ width: '100%' }} disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系人">
                {form.getFieldDecorator('contactsName', {
                  initialValue: productOrderInfo.contactsName
                    ? productOrderInfo.contactsName
                    : null,
                })(<Input placeholder="联系人" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系电话">
                {form.getFieldDecorator('contactNumber', {
                  initialValue: productOrderInfo.contactNumber
                    ? productOrderInfo.contactNumber
                    : null,
                })(<Input placeholder="联系电话" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="邮箱">
                {form.getFieldDecorator('email', {
                  initialValue: productOrderInfo.email ? productOrderInfo.email : null,
                })(<Input placeholder="邮箱" disabled="disabled" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="渠道商名称">
                {form.getFieldDecorator('channelMerchantsName', {
                  initialValue: productOrderInfo.channelMerchantsName
                    ? productOrderInfo.channelMerchantsName
                    : null,
                })(<Input placeholder="渠道商名称" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="供应商名称">
                {form.getFieldDecorator('supplierName', {
                  initialValue: productOrderInfo.supplierName
                    ? productOrderInfo.supplierName
                    : null,
                })(<Input placeholder="供应商名称" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="客户留言">
                {form.getFieldDecorator('leavingMessage', {
                  initialValue: productOrderInfo.leavingMessage
                    ? productOrderInfo.leavingMessage
                    : null,
                })(<Input placeholder="客户留言" disabled="disabled" />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card
          title="订单出行人"
          className={styles.card}
          bordered={false}
          loading={
            getInfoByIdLoading ||
            handleOrderByIdLoading ||
            completeOrderByIdLoading ||
            cancelOrderByIdLoading
          }
        >
          <StandardTable
            rowKey="id"
            defaultExpandAllRows
            loading={
              getInfoByIdLoading ||
              handleOrderByIdLoading ||
              completeOrderByIdLoading ||
              cancelOrderByIdLoading
            }
            selectedRows={false}
            data={productOrderPeople}
            columns={columns}
            pagination={false}
          />
        </Card>
        <Card
          title="订单操作"
          className={styles.card}
          bordered={false}
          loading={
            getInfoByIdLoading ||
            handleOrderByIdLoading ||
            completeOrderByIdLoading ||
            cancelOrderByIdLoading
          }
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="订单状态">
                {form.getFieldDecorator('state', {
                  initialValue: productOrderInfo.state ? productOrderInfo.state : null,
                })(
                  <Select style={{ width: '100%' }} disabled="disabled">
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
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="订单总金额">
                {form.getFieldDecorator('orderTotal', {
                  initialValue: productOrderInfo.orderTotal ? productOrderInfo.orderTotal : null,
                })(<Input placeholder="订单总金额" addonAfter="元" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="实际成交价格">
                {form.getFieldDecorator('transactionPrice', {
                  initialValue: productOrderInfo.transactionPrice
                    ? productOrderInfo.transactionPrice
                    : null,
                })(
                  <Input
                    placeholder="输入实际成交价格"
                    addonAfter="元"
                    onBlur={this.setOrderTransactionPrice}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10}></Col>
            <Col span={14}>
              <Popconfirm
                title="确定要处理订单吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  this.orderHandle();
                }}
              >
                <Button style={{ marginLeft: 8 }} type="primary">
                  处理订单
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定要完成订单吗？"
                okText="完成"
                cancelText="取消"
                onConfirm={() => {
                  this.orderComplete();
                }}
              >
                <Button style={{ marginLeft: 8 }} type="primary">
                  完成订单
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定要取消订单吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  this.orderCancel();
                }}
              >
                <Button style={{ marginLeft: 8 }} type="primary">
                  取消订单
                </Button>
              </Popconfirm>
              <Button style={{ marginLeft: 8 }} onClick={this.goToOrderList}>
                返回订单
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}
