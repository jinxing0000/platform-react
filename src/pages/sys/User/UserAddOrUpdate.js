import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree ,message} from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
const { TreeNode } = Tree;

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ role,menu,dept }) => ({ role,menu,dept }))
export default class UserAddOrUpdate extends Component {
  state = {
    checkedKeys: [],
  };
  componentDidMount() {
    const { record, dispatch , role: {roleList },dept: {deptList} } = this.props;
    dispatch({
      type: 'dept/getDeptTreeList',
    });
    dispatch({
      type: 'role/getRoleList',
    });
    if(record.userId!=null){
    //   dispatch({
    //     type: 'role/getRoleInfoById',
    //     payload: record.roleId,
    //   })
    //   .then(menuIdList => {
    //     this.onTreeCheck(menuIdList);
    //     });
    }
  }
  onTreeCheck = (checkedKeys,record) => {
    if (checkedKeys) {
      if (!Array.isArray(checkedKeys)) {
        const { checked } = checkedKeys;
        this.setState({ checkedKeys: checked });
      } else {
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
    const { form, record, role: { roleList },dept: {deptTreeList}} = this.props;
    return (
          <Form onSubmit={this.okHandler}>
            {form.getFieldDecorator('userId', {
                initialValue: record.userId ? record.userId : null,
            })(<Input type="hidden" />)}
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
                {form.getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
                initialValue: record.username ? record.username : null,
                })(<Input placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属部门">
                {form.getFieldDecorator('deptId', {
                rules: [{ required: true, message: '请输入所属部门' }],
                initialValue: record.deptId ? record.deptId : null,
                })(<BTreeSelect data={deptTreeList.list} placeholder="请选择所属部门" />)}
            </FormItem>
            {record.userId ? null : (
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
                {form.getFieldDecorator('password', {
                    rules: [{ required: true, message: '密码至少6位' }],
                    initialValue: record.password ? record.password : null,
                })(<Input placeholder="请输入密码" />)}
                </FormItem>
            )}
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="真实姓名">
                {form.getFieldDecorator('nickName', {
                rules: [{ required: true, message: '请输入真实姓名' }],
                initialValue: record.nickName ? record.nickName : null,
                })(<Input placeholder="请输入真实姓名" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
                {form.getFieldDecorator('email', {
                rules: [{ required: true, message: '请输入邮箱' }],
                initialValue: record.email ? record.email : null,
                })(<Input placeholder="请输入邮箱" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
                {form.getFieldDecorator('mobile', {
                rules: [{ required: true, message: '请输入手机号' }],
                initialValue: record.mobile ? record.mobile : null,
                })(<Input placeholder="请输入手机号" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
                {form.getFieldDecorator('roleIdList', {
                rules: [{ required: true, message: '请输入角色' }],
                initialValue: record.roleIdList ? record.roleIdList : [],
                })(
                <Select mode="multiple" style={{ width: '100%' }}>
                    {roleList.list.map(item => (
                    <Select.Option key={item.roleId} value={item.roleId}>
                        {item.roleName}
                    </Select.Option>
                    ))}
                </Select>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
                {form.getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择状态' }],
                initialValue: record.status ? record.status : null,
                })(
                <Select style={{ width: '100%' }}>
                    <Select.Option key="00" value="00">
                    正常
                    </Select.Option>
                    <Select.Option key="01" value="01">
                    禁用
                    </Select.Option>
                </Select>
                )}
            </FormItem>
          </Form>
    );
  }
}