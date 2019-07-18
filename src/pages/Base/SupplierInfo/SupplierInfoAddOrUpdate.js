import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree ,message} from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
const { TreeNode } = Tree;

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ supplierInfo }) => ({ supplierInfo }))
export default class SupplierInfoAddOrUpdate extends Component {
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
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col span={12}>
                    {record.id ? (
                        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="供应商名称">
                        {form.getFieldDecorator('supplierName', {
                            rules: [{ required: true, message: '请输入供应商名称' }],
                            initialValue: record.supplierName ? record.supplierName : null,
                        })(<Input placeholder="请输入供应商名称" disabled={true} />)}
                        </FormItem>
                    ):(
                        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="供应商名称">
                            {form.getFieldDecorator('supplierName', {
                                rules: [{ required: true, message: '请输入供应商名称' }],
                                initialValue: record.supplierName ? record.supplierName : null,
                            })(<Input placeholder="请输入供应商名称" />)}
                        </FormItem>
                    )}
                    </Col>
                    <Col span={12}>
                        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="法人代表">
                            {form.getFieldDecorator('legalPerson', {
                                rules: [{ required: true, message: '请输入法人代表' }],
                                initialValue: record.legalPerson ? record.legalPerson : null,
                            })(<Input placeholder="请输入法人代表" />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col span={12}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系人">
                        {form.getFieldDecorator('contactsName', {
                            rules: [{ required: true, message: '请输入联系人' }],
                            initialValue: record.contactsName ? record.contactsName : null,
                        })(<Input placeholder="请输入联系人" />)}
                    </FormItem>
                    </Col>
                    <Col span={12}>
                    {record.id ? (
                         <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系电话">
                         {form.getFieldDecorator('contactNumber', {
                             rules: [{ required: true, message: '请输入联系电话' }],
                             initialValue: record.contactNumber ? record.contactNumber : null,
                         })(<Input placeholder="请输入联系电话" disabled={true}/>)}
                        </FormItem>
                    ):(
                        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系电话">
                        {form.getFieldDecorator('contactNumber', {
                            rules: [{ required: true, message: '请输入联系电话' }],
                            initialValue: record.contactNumber ? record.contactNumber : null,
                        })(<Input placeholder="请输入联系电话" />)}
                       </FormItem>
                    )}
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col span={12}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="统一社会信用代码">
                        {form.getFieldDecorator('creditCode', {
                            rules: [{ required: false, message: '请输入统一社会信用代码' }],
                            initialValue: record.creditCode ? record.creditCode : null,
                        })(<Input placeholder="请输入统一社会信用代码" />)}
                    </FormItem>
                    </Col>
                    <Col span={12}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="注册资金">
                        {form.getFieldDecorator('registeredFunds', {
                            rules: [{ required: false, message: '请输入注册资金' }],
                            initialValue: record.registeredFunds ? record.registeredFunds : null,
                        })(<Input placeholder="请输入注册资金" />)}
                    </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col>
                    <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="供应商地址">
                        {form.getFieldDecorator('supplierAddress', {
                            rules: [{ required: false, message: '请输入供应商地址' }],
                            initialValue: record.supplierAddress ? record.supplierAddress : null,
                        })(<Input placeholder="请输入供应商地址" />)}
                    </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col>
                  <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="备注">
                    {form.getFieldDecorator('remarks', {
                        rules: [{ required: false, message: '请输入备注' }],
                        initialValue: record.remarks ? record.remarks : null,
                    })(<Input placeholder="请输入备注" />)}
                </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}