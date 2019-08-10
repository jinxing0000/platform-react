import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree ,message} from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
const { TreeNode } = Tree;

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ dic }) => ({ dic }))
export default class DicAddOrUpdate extends Component {
    state = {
        checkedKeys: [],
    };
    componentDidMount() {
        const { record, dispatch} = this.props;
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
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字典code">
                {form.getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入字典code' }],
                    initialValue: record.code ? record.code : null,
                })(<Input placeholder="请输入字典code" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字典名称">
                {form.getFieldDecorator('value', {
                    rules: [{ required: true, message: '请输入字典名称' }],
                    initialValue: record.value ? record.value : null,
                })(<Input placeholder="请输入字典名称" />)}
            </FormItem>
            {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级字典code">
                {form.getFieldDecorator('parentCode', {
                    rules: [{ required: true, message: '请输入父级字典code' }],
                    initialValue: record.parentCode ? record.parentCode : null,
                })(<Input placeholder="请输入父级字典code" />)}
            </FormItem> */}
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序号">
                {form.getFieldDecorator('sort', {
                    rules: [{ required: true, message: '请输入排序号' }],
                    initialValue: record.sort ? record.sort : null,
                })(<Input placeholder="请输入排序号" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
                {form.getFieldDecorator('remarks', {
                    rules: [{ required: false, message: '请输入备注' }],
                    initialValue: record.remarks ? record.remarks : null,
                })(<Input placeholder="请输入备注" />)}
            </FormItem>
            </Form>
        );
    }
}