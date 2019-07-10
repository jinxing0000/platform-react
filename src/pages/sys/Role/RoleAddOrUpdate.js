import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree ,message} from 'antd';
const { TreeNode } = Tree;

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ role,menu }) => ({ role,menu }))
export default class RoleAddOrUpdate extends Component {
  state = {
    checkedKeys: [],
  };
  componentDidMount() {
    const { record, dispatch , role: {roleInfo }} = this.props;
    // dispatch({
    //   type: 'role/findMenuListById',
    //   payload: record.roleId,
    // }).then(menuIdList => {
    //   if (menuIdList) {
    //     this.onTreeCheck(menuIdList);
    //   }
    // });
    dispatch({
      type: 'menu/getMenuTreeList',
    });
    if(record.roleId!=null){
      dispatch({
        type: 'role/getRoleInfoById',
        payload: record.roleId,
      })
      .then(menuIdList => {
        this.onTreeCheck(menuIdList);
        });
    }
  }
  onTreeCheck = (checkedKeys,record) => {
    if (checkedKeys) {
      if (!Array.isArray(checkedKeys)) {
        const { checked } = checkedKeys;
        // record.selectMenuIdListLength=checked.length;
        this.setState({ checkedKeys: checked });
      } else {
        // record.selectMenuIdListLength=checkedKeys.length;
        this.setState({ checkedKeys: checkedKeys});
      }
    }
  };
  okHandler = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        const dataToSubmit = {
          menuIdList: this.state.checkedKeys,
          ...fields,
        };
        this.props.onSubmit(err, dataToSubmit);
      }
    });
  };
  renderTreeNodes = data => {
    if (data) {
      return data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.menuId} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        } else {
          return <TreeNode title={item.name} key={item.menuId} dataRef={item} />;
        }
      });
    }
  };
  render() {
    const { form, record, menuTreeData, menu: {menuTreeList},role: {roleInfo },} = this.props;
    return (
          <Form onSubmit={this.okHandler}>
            {form.getFieldDecorator('roleId', {
              initialValue: record.roleId ? record.roleId : null,
            })(<Input type="hidden" />)}
            {/* {form.getFieldDecorator('menuIdList', {
              initialValue: this.state.checkedKeys,
            })(<Input type="hidden" placeholder="请选择菜单"/>)} */}
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色编码">
              {form.getFieldDecorator('roleCode', {
                rules: [{ required: true, message: '请输入角色编码' }],
                initialValue: record.roleCode ? record.roleCode : null,
              })(<Input placeholder="请输入角色编码" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
              {form.getFieldDecorator('roleName', {
                rules: [{ required: true, message: '请输入角色名称' }],
                initialValue: record.roleName ? record.roleName : null,
              })(<Input placeholder="请输入角色名称" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
              {form.getFieldDecorator('remark', {
                rules: [{ required: false, message: '请输入备注' }],
                initialValue: record.remark ? record.remark : null,
              })(<Input placeholder="请输入备注" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="选择菜单">
            {form.getFieldDecorator('menuIdList', {
                rules: [{ required: false, message: '选择菜单' }],
                initialValue: this.state.checkedKeys,
              })(<Input placeholder="请选择菜单" type="hidden"/>)}
              <Tree
                showLine
                checkable
                checkStrictly={true}
                checkedKeys={this.state.checkedKeys}
                onCheck={this.onTreeCheck}
                >
                {this.renderTreeNodes(menuTreeList.list)}
              </Tree>
            </FormItem>
          </Form>
    );
  }
}