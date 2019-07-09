import React from 'react';
import { Modal, message } from 'antd';
import style from './BVideoModal/style.less';

export default class BAuditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  alertModalOffice(data) {
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
    // console.log('this.state', this.state);
    return (
      <Modal
        visible={this.state.visible}
        title={
          this.state.attachment &&
          (this.state.attachment.attachmentName || this.state.attachment.name)
        }
        onOk={(err, values) => this._handleSubmit(err, values)}
        onCancel={e => this._handleCancel(e)}
        width={1000}
        style={{ zIndex: 9999 }}
        footer={null}
        maskClosable={false}
        destroyOnClose
        className={style.videoModal}
      >
        <Foo attachment={this.state.attachment} />
      </Modal>
    );
  }
}

class Foo extends React.Component {
  componentDidMount() {
    if (this.props.attachment) {
      this.openOffice();
    }
  }

  typeSwitch(type) {
    if (type.includes('application/msword') || type.includes('application/octet-stream')) {
      return 'doc';
    } else if (type.includes('application/pdf')) {
      return 'pdf';
    } else {
      return '';
    }
  }
  openOffice() {
    const data = this.props.attachment;
    // console.log(this.props);
    console.log(window.DocsAPI);
    const fileType = this.typeSwitch(data.contentType);
    if (!fileType) {
      return false;
    }
    const config = {
      document: {
        fileType: fileType,
        permissions: {
          comment: false,
          download: true,
          edit: false,
          print: true,
          review: false,
        },
        key: data.id,
        title: data.fileName || data.name,
        url: `http://MINIO:9000${data.url}`,
      },
      documentType: 'text',
      height: '600',
      editorConfig: {
        lang: 'zh-CN',
        mode: 'view',
        customization: {
          chat: false,
          commentAuthorOnly: false,
          compactToolbar: false,
          customer: {
            address: '南中环体育路',
            info: '百得科技',
            logo: 'http://bettem.com/content/images/logo.png',
            mail: 'b@bettem.com',
            name: 'Bettem',
            www: 'bettem.com',
          },
          feedback: {
            url: 'https://example.com',
            visible: false,
          },
          forcesave: false,
          logo: {
            image: 'http://bettem.com/content/images/logo.png',
            imageEmbedded: 'http://bettem.com/content/images/logo.png',
            url: 'http://bettem.com',
          },
          showReviewChanges: false,
          zoom: 100,
        },
      },
    };
    if (window.DocsAPI) {
      new window.DocsAPI.DocEditor('officePlace', config);
    } else {
      message.error('office插件出错,请更换浏览器!');
    }
  }

  render() {
    return <div id="officePlace" style={{ height: 1000 }} />;
  }
}
