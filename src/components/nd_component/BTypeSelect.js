import { Cascader, Select } from 'antd';
import React, { Component } from 'react';
import request from '../../utils/request';

const { Option } = Select;
export default class BTypeSelect extends Component {
  state = {
    value: [],
    loading: true,
  };

  componentDidMount() {
    if (this.props.type) {
      request(`/api/sys/dict/findListByTypeInTree/${this.props.type}`).then(data => {
        if (data && data.success) {
          if (data.data.length === 0) {
            return;
          }
          if (this.props.abnormalCancelGuar) {
            const sliceArr = data.data.slice(-5);
            this.setState({
              value: sliceArr,
              loading: false,
            });
          } else if (this.props.filterStr) {
            let filterData = [];
            if (this.props.filterStr instanceof Array) {
              for (let i of this.props.filterStr) {
                filterData.push(...data.data.filter(v => v.value === i)[0].children);
              }
              localStorage.setItem('bettem&Dict&Select', JSON.stringify(filterData));
            } else {
              filterData = data.data.filter(v => v.value === this.props.filterStr)[0].children;
            }
            this.setState({
              value: filterData,
              loading: false,
            });
          } else {
            this.setState({
              value: data.data,
              loading: false,
            });
          }
        }
      });
    }
  }

  componentWillUnmount = () => {
    this.setState = (state, callback) => {};
  };

  onChange(value) {
    let valueX = value;
    if (this.props.multi && value) {
      valueX = value.join(',');
    }
    this.props.onChange && this.props.onChange(valueX);
  }

  displayRender(label) {
    return label[label.length - 1];
  }

  /*
   * displayRender(BOOL)判读输入框显示
   * value(array:string)默认值
   * multi(BOOL)判读选择框类型
   *
   * */
  render() {
    const attribute = {};
    if (this.props.displayRender) {
      attribute.displayRender = this.displayRender;
    }

    let { value } = this.props;
    if (this.props.multi && value) {
      value = value.split(',');
    }
    return (
      <div>
        {this.props.multi ? (
          <Cascader
            {...this.props}
            options={this.state.value}
            changeOnSelect={this.props.changeOnSelect ? this.props.changeOnSelect : false}
            allowClear
            onChange={selectedOptions => this.onChange(selectedOptions)}
            placeholder={this.props.placeholder || '请选择'}
            value={value}
            filedNames={{
              label: 'name',
              value: 'value',
              children: 'children',
            }}
            {...attribute}
          />
        ) : (
          <Select
            placeholder={this.props.placeholder || '请选择'}
            onChange={value => this.onChange(value)}
            style={{ width: '100%' }}
            allowClear
            {...this.props}
            value={this.state.loading ? undefined : value || undefined}
          >
            {this.state.value.map((item, index) => {
              return (
                <Option key={item.id} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        )}
      </div>
    );
  }
}
