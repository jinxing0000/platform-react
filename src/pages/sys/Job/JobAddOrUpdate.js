import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree ,message} from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
const { TreeNode } = Tree;

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ }) => ({  }))
export default class JobAddOrUpdate extends Component {
  state = {
    checkedKeys: [],
  };
  componentDidMount() {
    const { record, dispatch , } = this.props;
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
    const { form, record,} = this.props;
    debugger;
    return (
        <Form onSubmit={this.okHandler}>
                {form.getFieldDecorator('jobId', {
                initialValue: record.jobId ? record.jobId : null,
                })(<Input type="hidden" />)}
                {form.getFieldDecorator('status', {
                initialValue: record.status ? record.status : 0,
                })(<Input type="hidden" />)}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="bean名称">
                {form.getFieldDecorator('beanName', {
                    rules: [{ required: true, message: 'bean名称' }],
                    initialValue: record.beanName ? record.beanName : null,
                })(<Input placeholder="bean名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="方法名称">
                {form.getFieldDecorator('methodName', {
                    rules: [{ required: true, message: '方法名称' }],
                    initialValue: record.methodName ? record.methodName : null,
                })(<Input placeholder="方法名称" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参数">
                {form.getFieldDecorator('params', {
                    rules: [{ required: false, message: '参数' }],
                    initialValue: record.params ? record.params : null,
                })(<Input placeholder="参数" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="cron表达式">
                {form.getFieldDecorator('cronExpression', {
                    rules: [{ required: true, message: 'cron表达式' }],
                    initialValue: record.cronExpression ? record.cronExpression : null,
                })(<Input placeholder="例如：0 0 12 * * ?" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
                {form.getFieldDecorator('remark', {
                    rules: [{ required: false, message: '备注' }],
                    initialValue: record.remark ? record.remark : null,
                })(<Input placeholder="备注" />)}
                </FormItem>
          </Form>
    );
  }
}