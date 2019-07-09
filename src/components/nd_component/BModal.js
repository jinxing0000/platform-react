import React from 'react';
import { Modal, Button, Spin } from 'antd';
import { connect } from 'dva';

@connect(
  ({ loading, item }) => ({
    loading,
    item,
  }),
  null,
  null,
  { withRef: true }
)
export default class BModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.form = React.createRef();
  }

  alertModal(data) {
    this._showModal(data);
  }

  _showModal(data) {
    this.setState({
      visible: true,
      ...data,
    });
  }

  _handleCancel() {
    Object.keys(this.state).map(item => {
      if (item === 'visible') {
        this.setState({
          [item]: false,
        });
      } else {
        this.setState({
          [item]: null,
        });
      }
    });
  }

  clearData(loading) {
    Object.keys(this.state).map(item => {
      if (item === 'visible') {
        this.setState({
          [item]: !loading,
        });
      } else if (loading) {
        this.setState({
          [item]: null,
        });
      }
    });
  }

  _handleSubmit() {
    this.form.current.validateFields((err, values) => {
      if (!err) {
        this.state.apply &&
          this.state.apply(values, loading => {
            this.clearData(loading);
          });
      }
    });
  }

  render() {
    const { readonly, isFooter } = this.state;
    const { loading } = this.props;
    const footer = [
      <Button
        key="cancel"
        disabled={this.state.loading ? loading.effects[this.state.loading] || false : false}
        onClick={e => this._handleCancel(e)}
      >
        {readonly ? '关闭' : '取消'}
      </Button>,
    ];

    footer.push(
      <Button
        key="submit"
        disabled={this.state.loading ? loading.effects[this.state.loading] || false : false}
        type="primary"
        onClick={(err, values) => this._handleSubmit(err, values)}
      >
        {this.state.btnSubTitle || '暂存'}
      </Button>
    );
    return (
      <Modal
        title={this.state.title}
        visible={this.state.visible}
        onOk={(err, values) => this._handleSubmit(err, values)}
        onCancel={e => this._handleCancel(e)}
        width={this.state.width ? this.state.width : 700}
        footer={isFooter ? null : footer}
        maskClosable={false}
        destroyOnClose
      >
        <Spin spinning={this.state.loading ? loading.effects[this.state.loading] || false : false}>
          {this.state.component ? (
            <this.state.component ref={this.form} item={this.props.item} {...this.state} />
          ) : null}
        </Spin>
      </Modal>
    );
  }
}
