import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree ,message} from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
const { TreeNode } = Tree;

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ productPic }) => ({ productPic }))
export default class ProductPicAddOrUpdate extends Component {
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
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品id">
                {form.getFieldDecorator('productId', {
                    rules: [{ required: true, message: '请输入产品id' }],
                    initialValue: record.productId ? record.productId : null,
                })(<Input placeholder="请输入产品id" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片路径">
                {form.getFieldDecorator('picPath', {
                    rules: [{ required: true, message: '请输入图片路径' }],
                    initialValue: record.picPath ? record.picPath : null,
                })(<Input placeholder="请输入图片路径" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片类型">
                {form.getFieldDecorator('picType', {
                    rules: [{ required: true, message: '请输入图片类型' }],
                    initialValue: record.picType ? record.picType : null,
                })(<Input placeholder="请输入图片类型" />)}
            </FormItem>
            </Form>
        );
    }
}