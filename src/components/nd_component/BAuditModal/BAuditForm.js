import React from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col } from 'antd';
import BTypeSelect from '../BTypeSelect';

const { TextArea } = Input;
@Form.create()
@connect(({ loading, item }) => ({
  item,
  itemLoading: loading.effects['item/getItem'],
}))
export default class BAuditForm extends React.Component {
  constructor(props) {
    super(props);
    this.data = props.data || {};
  }

  _handleSubmit(e) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(err, values);
      }
    });
  }

  componentWillReceiveProps(props) {
    if (props.data) {
      this.data = props.data;
    }
    if (!props.data) {
      this.data = {};
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      item: { item },
      extraOneFieldElm,
      isCommentRequired,
    } = this.props;
    return (
      <div>
        <Form layout="horizontal" onSubmit={e => this._handleSubmit(e)}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={
                  item &&
                  item.state === '02' &&
                  (item.subState === '0122' || item.subState === '0123')
                    ? '评审意见:'
                    : item && item.state === '02' && item.subState === '01'
                    ? '复审意见:'
                    : '审核意见'
                }
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                {getFieldDecorator('approveCode', {
                  rules: [
                    {
                      required: true,
                      message: '该项必填',
                    },
                  ],
                })(
                  <BTypeSelect
                    type={this.props.approveCode ? this.props.approveCode : 'approve-normal-code'}
                  />
                )}
              </Form.Item>
            </Col>
            {!extraOneFieldElm ? null : (
              <Col span={24}>
                <Form.Item
                  label={extraOneFieldElm.label}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator(extraOneFieldElm.fieldName, {
                    initialValue: extraOneFieldElm.initialValue,
                    rules: [{ required: true, message: '该项必填' }],
                  })(
                    <Input
                      style={{ width: '100%' }}
                      type="number"
                      placeholder="请输入"
                      addonAfter="万元"
                    />
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
          {!isCommentRequired ? (
            <Row gutter={24} style={{ marginTop: 10 }}>
              <Col span={24}>
                <Form.Item label="审核意见" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('comment', {})(
                    <TextArea
                      rows={3}
                      placeholder={
                        item &&
                        item.state === '02' &&
                        (item.subState === '0122' || item.subState === '0123')
                          ? '请输入评审意见:'
                          : '请输入审核意见:'
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Row gutter={24} style={{ marginTop: 10 }}>
              <Col span={24} style={{ marginLeft: -5 }}>
                <Form.Item label="审核意见" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('comment', {
                    rules: [
                      {
                        required: isCommentRequired,
                        message: '该项必填',
                      },
                    ],
                  })(<TextArea placeholder="请输入审核意见:" />)}
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </div>
    );
  }
}
