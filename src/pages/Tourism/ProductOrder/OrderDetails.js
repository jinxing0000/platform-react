import React, { Component } from 'react';
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

@Form.create()
@connect(({ productOrder, loading }) => ({
  productOrder,
  saveLoading: loading.effects['productInfo/saveInfo'],
  editLoading: loading.effects['productInfo/editInfo'],
  getInfoByIdLoading: loading.effects['productOrder/getInfoById'],
}))
export default class OrderDetails extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    record: {},
    productInfo: {},
    productOrderInfo: {},
    productOrderPeopleList: [],
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
            productOrderPeopleList: data.productOrderPeopleList,
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
  //返回产品列表页面
  goToProductList = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/tourism/productInfo/list',
        query: {
          record: {},
        },
      })
    );
  };

  render() {
    const { form, saveLoading, getInfoByIdLoading, editLoading } = this.props;
    const {
      record,
      previewVisible,
      previewImage,
      productCharacteristicEditorState,
      travelInfoEditorState,
      productInfo,
      productOrderInfo,
    } = this.state;
    return (
      <Form onSubmit={this.okHandler}>
        <Card
          title="产品信息"
          className={styles.card}
          bordered={false}
          loading={getInfoByIdLoading || saveLoading || editLoading}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={12}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="产品名称">
                {form.getFieldDecorator('productName', {
                  initialValue: productInfo.productName ? productInfo.productName : null,
                })(<Input placeholder="请输入产品名称" disabled="disabled" />)}
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
                })(<Input placeholder="请输入成人价格" addonAfter="元" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="儿童价格">
                {form.getFieldDecorator('childrenPrice', {
                  initialValue: productInfo.childrenPrice ? productInfo.childrenPrice : null,
                })(<Input placeholder="请输入儿童价格" addonAfter="元" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单房差">
                {form.getFieldDecorator('singleRoomPrice', {
                  initialValue: productInfo.singleRoomPrice ? productInfo.singleRoomPrice : null,
                })(<Input placeholder="请输入单房差" addonAfter="元" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="咨询电话">
                {form.getFieldDecorator('contactNumber', {
                  initialValue: productInfo.contactNumber ? productInfo.contactNumber : null,
                })(<Input placeholder="请输入咨询电话" disabled="disabled" />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card
          title="订单信息"
          className={styles.card}
          bordered={false}
          loading={getInfoByIdLoading || saveLoading || editLoading}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="成人">
                {form.getFieldDecorator('adultNumber', {
                  initialValue: productOrderInfo.adultNumber ? productOrderInfo.adultNumber : null,
                })(<Input placeholder="请输入成人人数" addonAfter="人" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="儿童">
                {form.getFieldDecorator('childrenNumber', {
                  initialValue: productOrderInfo.childrenNumber
                    ? productOrderInfo.childrenNumber
                    : null,
                })(<Input placeholder="请输入儿童人数" addonAfter="人" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单房差">
                {form.getFieldDecorator('singleRoomNumber', {
                  initialValue: productOrderInfo.singleRoomNumber
                    ? productOrderInfo.singleRoomNumber
                    : null,
                })(<Input placeholder="请输入单房差间数" addonAfter="间" disabled="disabled" />)}
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
                })(<Input placeholder="请输入联系人" disabled="disabled" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单房差">
                {form.getFieldDecorator('singleRoomNumber', {
                  initialValue: productOrderInfo.singleRoomNumber
                    ? productOrderInfo.singleRoomNumber
                    : null,
                })(<Input placeholder="请输入单房差间数" addonAfter="间" disabled="disabled" />)}
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
        </Card>
        <Card
          title="订单出行人"
          className={styles.card}
          bordered={false}
          loading={getInfoByIdLoading || saveLoading || editLoading}
        ></Card>
        <Card
          title=""
          className={styles.card}
          bordered={false}
          loading={getInfoByIdLoading || saveLoading || editLoading}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10}></Col>
            <Col span={14}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.goToProductList}>
                返回
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}
