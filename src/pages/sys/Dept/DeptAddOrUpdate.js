import React, { Component } from 'react';
import { Form, Input } from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';



const FormItem = Form.Item;
@Form.create()
export default class DeptAddOrUpdate extends Component {
  render() {
    const { form, record, deptTreeList } = this.props;
    const currentDept = value => {
      if (value && value !== '0') {
        return value;
      } else if (value && value === '0') {
        return '一级部门';
      } else {
        return null;
      }
    };
    return (
      <Form>
        {form.getFieldDecorator('salt', {
          initialValue: record.salt ? record.salt : null,
        })(<Input type="hidden" />)}
        {form.getFieldDecorator('deptId', {
          initialValue: record.deptId ? record.deptId : null,
        })(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入部门名称' }],
            initialValue: record.name ? record.name : null,
          })(<Input placeholder="请输入部门名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级部门">
          {form.getFieldDecorator('parentId', {
            rules: [{ required: false, message: '请选择上级部门' }],
            initialValue: currentDept(record.parentId),
          })(<BTreeSelect data={deptTreeList.list} placeholder="请选择上级部门" />)}
        </FormItem>
        {record.userId ? null : (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门编号">
            {form.getFieldDecorator('code', {
              rules: [{ required: true, message: '部门编号' }],
              initialValue: record.code ? record.code : null,
            })(<Input placeholder="请输入部门编号" />)}
          </FormItem>
        )}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
          {form.getFieldDecorator('orderNum', {
            rules: [{ required: true, message: '请输入排序' }],
            initialValue: record.orderNum ? record.orderNum : null,
          })(<Input placeholder="请输入排序" />)}
        </FormItem>
      </Form>
    );
  }
}