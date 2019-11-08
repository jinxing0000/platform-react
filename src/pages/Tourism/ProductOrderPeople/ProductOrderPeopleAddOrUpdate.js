import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree, message } from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
const { TreeNode } = Tree;

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ productOrderPeople }) => ({ productOrderPeople }))
export default class ProductOrderPeopleAddOrUpdate extends Component {
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="订单id">
          {form.getFieldDecorator('orderId', {
            rules: [{ required: true, message: '请输入订单id' }],
            initialValue: record.orderId ? record.orderId : null,
          })(<Input placeholder="请输入订单id" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="游客姓名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入游客姓名' }],
            initialValue: record.name ? record.name : null,
          })(<Input placeholder="请输入游客姓名" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="身份证号">
          {form.getFieldDecorator('cardNumber', {
            rules: [{ required: true, message: '请输入身份证号' }],
            initialValue: record.cardNumber ? record.cardNumber : null,
          })(<Input placeholder="请输入身份证号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {form.getFieldDecorator('mobile', {
            rules: [{ required: true, message: '请输入手机号码' }],
            initialValue: record.mobile ? record.mobile : null,
          })(<Input placeholder="请输入手机号码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
          {form.getFieldDecorator('sex', {
            rules: [{ required: true, message: '请输入性别' }],
            initialValue: record.sex ? record.sex : null,
          })(<Input placeholder="请输入性别" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="出生日期">
          {form.getFieldDecorator('birthDate', {
            rules: [{ required: true, message: '请输入出生日期' }],
            initialValue: record.birthDate ? record.birthDate : null,
          })(<Input placeholder="请输入出生日期" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年龄">
          {form.getFieldDecorator('age', {
            rules: [{ required: true, message: '请输入年龄' }],
            initialValue: record.age ? record.age : null,
          })(<Input placeholder="请输入年龄" />)}
        </FormItem>
      </Form>
    );
  }
}
