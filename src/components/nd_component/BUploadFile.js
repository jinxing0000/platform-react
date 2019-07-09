import React from 'react';
import { Button, Upload, Icon, message } from 'antd';
import request from '../../utils/request';

export default class BUploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileid: this.props.value ? this.props.value.id : '',
      fileList: this.props.value
        ? [
            {
              uid: this.props.value.id,
              name: this.props.value.name,
              status: 'done',
              url: this.props.value.url,
            },
          ]
        : [],
    };
    this.uploadfile = '/api/sys/enclosure/uploadFile';
  }

  componentWillReceiveProps(props) {
    if (props.value) {
      let data = undefined;
      if (Array.isArray(props.value)) {
        if (props.value.length > 0) {
          data = props.value[0];
        } else {
          data = props.value;
        }
      } else {
        data = props.value;
      }
      this.state = {
        fileid: data ? data.id : '',
        fileList: data
          ? [
              {
                uid: data.id,
                name: data.name,
                status: 'done',
                url: data.url,
              },
            ]
          : [],
      };
    } else {
      this.state = {
        fileid: '',
        fileList: [],
      };
    }
  }
  render() {
    const token = localStorage.getItem('authorization');
    return (
      <div>
        <Upload
          name="file"
          withCredentials="true"
          action={this.props.fileUrl || this.uploadfile}
          headers={{
            authorization: token,
          }}
          fileList={this.state.fileList}
          data={{
            ...this.props.fileConfig,
          }}
          multiple={this.props.multiple || false}
          onChange={info => {
            if (info.file.status) {
              if (info.file.status === 'done') {
                const {
                  code,
                  sysEnclosureEntity: { id },
                  msg,
                } = info.file.response;
                if (msg === 'success') {
                  message.success(`${info.file.name} 上传成功`);
                  this.setState({
                    fileid: id,
                  });
                  this.props.onChange && this.props.onChange(id);
                } else {
                  message.error(`${info.file.name} 上传失败`);
                  this.setState({
                    fileList: [],
                  });
                  return;
                }
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
                this.setState({
                  fileList: [],
                });
                return;
              }
              this.setState({
                fileList: info.fileList,
              });
            }
          }}
          onRemove={file => {
            if (this.props.readOnly) {
              message.warn('该文件不支持删除');
              return false;
            }
            if (this.props.removeUrl) {
              const { fileid } = this.state;
              request(this.props.removeUrl + fileid, {
                method: 'DELETE',
              }).then(data => {
                if (data.success) {
                  this.props.onChange && this.props.onChange(data);
                  this.setState({
                    fileid: '',
                  });
                }
              });
            } else {
              this.setState({
                fileid: '',
              });
            }
          }}
        >
          {this.state.fileid ? null : (
            <Button style={{ borderRadius: 10 }} size="small">
              <Icon type="upload" />
              上传文件
            </Button>
          )}
        </Upload>
        {this.props.extraInfo ? <p>{this.props.extraInfo}</p> : ''}
      </div>
    );
  }
}
