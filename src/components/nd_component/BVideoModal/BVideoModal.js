import React from 'react';
import { Modal } from 'antd';
import { Player, BigPlayButton, LoadingSpinner, ControlBar, PlayToggle } from 'video-react';
import '../../../../node_modules/video-react/dist/video-react.css';
import style from './style.less';

export default class BAuditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {}

  alertModalVideo(data) {
    this._showModal(data);
  }

  _showModal(data) {
    if (data) {
      this.setState({
        visible: true,
        ...data,
      });
    }
  }

  _handleCancel() {
    this.clearData();
  }

  clearData() {
    this.setState({
      visible: false,
    });
  }

  _handleSubmit(err, values) {
    this.auditForm.current.validateFields((err, values) => {
      if (!err) {
        this.state.apply(values, () => {
          this.clearData();
        });
      }
    });
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        onOk={(err, values) => this._handleSubmit(err, values)}
        onCancel={e => this._handleCancel(e)}
        width={1000}
        footer={null}
        maskClosable={false}
        destroyOnClose
        className={style.videoModal}
      >
        <Player style={{ width: '100%', height: '100%' }} src={this.state.url} autoPlay>
          <BigPlayButton position="center" />
          <LoadingSpinner />
        </Player>
      </Modal>
    );
  }
}
