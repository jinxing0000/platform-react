import { TreeSelect } from 'antd';
import React, { PureComponent, Component } from 'react';

const TreeNode = TreeSelect.TreeNode;

export default class BTreeSelect extends Component {
  renderTreeNodes = data => {
    if (data) {
      return data.map(item => {
        if (item.children) {
          return (
            <TreeNode
              title={item.name}
              key={item.deptId || item.menuId || item.id}
              value={item[this.props.VType] || item.deptId || item.menuId || item.id}
            >
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        } else {
          return (
            <TreeNode
              title={item.name}
              key={item.menuId || item.deptId || item.id}
              value={item[this.props.VType] || item.deptId || item.menuId || item.id}
            />
          );
        }
      });
    }
  };

  onChange = value => {
    this.props.onChange(value);
  };

  render() {
    return (
      <TreeSelect
        treeNodeFilterProp="title"
        showSearch
        value={this.props.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        style={{ width: '100%' }}
        onChange={this.onChange}
        allowClear
        placeholder={this.props.placeholder || '请选择部门'}
      >
        {this.renderTreeNodes(this.props.data)}
      </TreeSelect>
    );
  }
}
