import React from 'react';
import { Modal, Button } from 'antd';
import BAuditForm from './BAuditForm';

export default class BAuditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      extraOneFieldElm: null,
    };
  }

  componentDidMount() {
    this.auditForm = React.createRef();
  }

  alertModalAudit(data) {
    this._showModal(data);
  }

  _showModal(data) {
    this.setState({
      visible: true,
      ...data,
    });
    const { extraOneFieldElm } = data;
    if (extraOneFieldElm) {
      this.setState({
        extraOneFieldElm,
      });
    }
  }

  _handleCancel() {
    this.setState({
      visible: false,
      loading: false,
      approveCode: null,
    });
  }

  clearData(loading) {
    if (loading) {
      this.setState({
        visible: false,
        loading: false,
        approveCode: null,
      });
    } else {
      this.setState({
        visible: true,
        loading: false,
      });
    }
  }

  _handleSubmit(err, values) {
    this.auditForm.current.validateFields((err, values) => {
      if (!err) {
        if (values.comment === undefined) {
          values.comment = '';
        }
        this.setState({
          loading: true,
        });
        this.state.apply(values, loading => {
          this.clearData(loading);
        });
      }
    });
  }

  render() {
    const { readonly, extraOneFieldElm, isCommentRequired } = this.state;
    const footer = [
      <Button key="cancel" onClick={e => this._handleCancel(e)}>
        取消
      </Button>,
    ];
    if (!readonly) {
      footer.push(
        <Button
          key="submit"
          type="primary"
          loading={this.state.loading}
          onClick={(err, values) => this._handleSubmit(err, values)}
        >
          {this.state.buttonTitle || '审核'}
        </Button>
      );
    }
    return (
      <Modal
        title={this.state.title}
        visible={this.state.visible}
        onOk={(err, values) => this._handleSubmit(err, values)}
        onCancel={e => this._handleCancel(e)}
        key={this.state.data && this.state.data.categoryid ? this.state.data.categoryid : ''}
        footer={footer}
        maskClosable={false}
        destroyOnClose
      >
        <BAuditForm
          onSubmit={(err, values) => this._handleSubmit(err, values)}
          ref={this.auditForm}
          isCommentRequired={isCommentRequired}
          approveCode={this.state.approveCode}
          extraOneFieldElm={extraOneFieldElm}
        />
      </Modal>
    );
  }
}
