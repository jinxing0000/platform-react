import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree, message } from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
const { TreeNode } = Tree;

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ productOrder }) => ({ productOrder }))
export default class ProductOrderAddOrUpdate extends Component {
  state = {
    checkedKeys: [],
  };
  componentDidMount() {
    const { record, dispatch } = this.props;
  }
  okHandler = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        const dataToSubmit = {
          ...fields,
        };
        this.props.onSubmit(err, dataToSubmit);
      }
    });
  };
  render() {
    const { form, record } = this.props;
    return (
      <Form onSubmit={this.okHandler}>
        {form.getFieldDecorator('id', {
          initialValue: record.id ? record.id : null,
        })(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品id">
          {form.getFieldDecorator('productId', {
            rules: [{ required: true, message: '请输入产品id' }],
            initialValue: record.productId ? record.productId : null,
          })(<Input placeholder="请输入产品id" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品名称">
          {form.getFieldDecorator('productName', {
            rules: [{ required: true, message: '请输入产品名称' }],
            initialValue: record.productName ? record.productName : null,
          })(<Input placeholder="请输入产品名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品引导图">
          {form.getFieldDecorator('productGuidePicUrl', {
            rules: [{ required: true, message: '请输入产品引导图' }],
            initialValue: record.productGuidePicUrl ? record.productGuidePicUrl : null,
          })(<Input placeholder="请输入产品引导图" />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="订单类型，1为旅游产品订单"
        >
          {form.getFieldDecorator('orderType', {
            rules: [{ required: true, message: '请输入订单类型，1为旅游产品订单' }],
            initialValue: record.orderType ? record.orderType : null,
          })(<Input placeholder="请输入订单类型，1为旅游产品订单" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="成人数量">
          {form.getFieldDecorator('adultNumber', {
            rules: [{ required: true, message: '请输入成人数量' }],
            initialValue: record.adultNumber ? record.adultNumber : null,
          })(<Input placeholder="请输入成人数量" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="儿童数量">
          {form.getFieldDecorator('childrenNumber', {
            rules: [{ required: true, message: '请输入儿童数量' }],
            initialValue: record.childrenNumber ? record.childrenNumber : null,
          })(<Input placeholder="请输入儿童数量" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="单房差数量">
          {form.getFieldDecorator('singleRoomNumber', {
            rules: [{ required: true, message: '请输入单房差数量' }],
            initialValue: record.singleRoomNumber ? record.singleRoomNumber : null,
          })(<Input placeholder="请输入单房差数量" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="订单总价">
          {form.getFieldDecorator('orderTotal', {
            rules: [{ required: true, message: '请输入订单总价' }],
            initialValue: record.orderTotal ? record.orderTotal : null,
          })(<Input placeholder="请输入订单总价" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实际成交价格">
          {form.getFieldDecorator('transactionPrice', {
            rules: [{ required: true, message: '请输入实际成交价格' }],
            initialValue: record.transactionPrice ? record.transactionPrice : null,
          })(<Input placeholder="请输入实际成交价格" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="出发时间">
          {form.getFieldDecorator('setOutDate', {
            rules: [{ required: true, message: '请输入出发时间' }],
            initialValue: record.setOutDate ? record.setOutDate : null,
          })(<Input placeholder="请输入出发时间" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系人">
          {form.getFieldDecorator('contactsName', {
            rules: [{ required: true, message: '请输入联系人' }],
            initialValue: record.contactsName ? record.contactsName : null,
          })(<Input placeholder="请输入联系人" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系手机号">
          {form.getFieldDecorator('contactNumber', {
            rules: [{ required: true, message: '请输入联系手机号' }],
            initialValue: record.contactNumber ? record.contactNumber : null,
          })(<Input placeholder="请输入联系手机号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入邮箱' }],
            initialValue: record.email ? record.email : null,
          })(<Input placeholder="请输入邮箱" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="留言信息">
          {form.getFieldDecorator('leavingMessage', {
            rules: [{ required: true, message: '请输入留言信息' }],
            initialValue: record.leavingMessage ? record.leavingMessage : null,
          })(<Input placeholder="请输入留言信息" />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="状态，0为未提交，1为待处理，2为处理完成"
        >
          {form.getFieldDecorator('state', {
            rules: [{ required: true, message: '请输入状态，0为未提交，1为待处理，2为处理完成' }],
            initialValue: record.state ? record.state : null,
          })(<Input placeholder="请输入状态，0为未提交，1为待处理，2为处理完成" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="渠道商id">
          {form.getFieldDecorator('channelMerchantsId', {
            rules: [{ required: true, message: '请输入渠道商id' }],
            initialValue: record.channelMerchantsId ? record.channelMerchantsId : null,
          })(<Input placeholder="请输入渠道商id" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="渠道商名称">
          {form.getFieldDecorator('channelMerchantsName', {
            rules: [{ required: true, message: '请输入渠道商名称' }],
            initialValue: record.channelMerchantsName ? record.channelMerchantsName : null,
          })(<Input placeholder="请输入渠道商名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="供应商id">
          {form.getFieldDecorator('supplierId', {
            rules: [{ required: true, message: '请输入供应商id' }],
            initialValue: record.supplierId ? record.supplierId : null,
          })(<Input placeholder="请输入供应商id" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="供应商名称">
          {form.getFieldDecorator('supplierName', {
            rules: [{ required: true, message: '请输入供应商名称' }],
            initialValue: record.supplierName ? record.supplierName : null,
          })(<Input placeholder="请输入供应商名称" />)}
        </FormItem>
      </Form>
    );
  }
}
