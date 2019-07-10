import React, { Component } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
const FormItem = Form.Item;

@Form.create()
export default class MenuAddOrUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMenu: false,
    };
  }
  componentDidMount() {
    const {
      record: { type },
    } = this.props;
    this.selectMenuType(type);
  }
  selectMenuType = value => {
    if (value === '2') {
      this.setState({
        selectMenu: false,
      });
    } else {
      this.setState({
        selectMenu: true,
      });
    }
  };
  okHandler = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        const dataToSubmit = { ...fields };
        this.props.onSubmit(err, dataToSubmit);
      }
    });
  };

  render() {
    const { form, record,menuTreeList } = this.props;
    const { selectMenu } = this.state;
    const currentMenu = value => {
        if (value && value !== '0') {
          return value;
        } else if (value && value === '0') {
          return '根目录';
        } else {
          return null;
        }
    };
    return (
      <Form layout="horizontal" onSubmit={this.okHandler}>
        {form.getFieldDecorator('menuId', {
          initialValue: record.menuId ? record.menuId : null,
        })(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入类型' }],
            initialValue: record.type ? record.type : null,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择菜单类型"
              onChange={this.selectMenuType}
            >
              <Select.Option key="0" value="0">
                目录
              </Select.Option>
              <Select.Option key="1" value="1">
                菜单
              </Select.Option>
              <Select.Option key="2" value="2">
                按钮
              </Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '菜单名称' }],
            initialValue: record.name ? record.name : null,
          })(<Input placeholder="菜单名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级菜单">
          {form.getFieldDecorator('parentId', {
            rules: [{ required: false, message: '请输入父级菜单' }],
            initialValue: record.parentId ? currentMenu(record.parentId) : null,
          })(<BTreeSelect placeholder="请选择父级菜单" data={menuTreeList.list} />)}
        </FormItem>
        {/* 类型位 1 才可选择 */}
        {selectMenu ? (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单路由">
            {form.getFieldDecorator('path', {
              rules: [{ required: false, message: '菜单路由' }],
              initialValue: record.path ? record.path : null,
            })(<Input placeholder="菜单路由" />)}
          </FormItem>
        ) : null}

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="授权标识">
          {form.getFieldDecorator('perms', {
            rules: [{ required: false, message: '授权标识' }],
            initialValue: record.perms ? record.perms : null,
          })(<Input placeholder="授权标识" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图标">
          {form.getFieldDecorator('icon', {
            rules: [{ required: false, message: '图标' }],
            initialValue: record.icon ? record.icon : null,
          })(<Input placeholder="图标" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
          {form.getFieldDecorator('orderNum', {
            rules: [{ required: true, message: '排序' }],
            initialValue: record.orderNum ? record.orderNum : null,
          })(<Input placeholder="排序" />)}
        </FormItem>
      </Form>
    );
  }
}
