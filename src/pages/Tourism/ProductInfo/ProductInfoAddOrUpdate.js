import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Tree,
  message,
  Card,
  Upload,
  Modal,
  Icon,
  Spin,
  InputNumber,
  DatePicker,
  Button,
} from 'antd';
import { routerRedux } from 'dva/router';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
import styles from './ProductInfo.less';
import { getTimeDistance } from '@/utils/utils';
const { TreeNode } = Tree;
import moment from 'moment';

const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ productInfo, loading }) => ({
  productInfo,
  saveLoading: loading.effects['productInfo/saveInfo'],
  editLoading: loading.effects['productInfo/editInfo'],
  getInfoByIdLoading: loading.effects['productInfo/getInfoById'],
}))
export default class ProductInfoAddOrUpdate extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    record: {
      lineType: '2',
      tripDays: 2,
      tripNightNum: 1,
      startDate: '2019-07-23',
      startingCity: '晋中市',
      picList: [],
    },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    let record = this.props.location.query;
    if (record && record.id) {
      dispatch({
        type: 'productInfo/getInfoById',
        payload: record.id,
      }).then(({ code, data }) => {
        if (code === 0) {
          this.setState({ record: data });
        }
      });
    }
  }
  //校验图片数据
  checkImageList = (rule, value, callback) => {
    const { form } = this.props;
    const { picList } = this.state.record;
    if (picList.length === 0 && value.length === 0) {
      callback('error');
    } else {
      callback();
    }
  };

  okHandler = e => {
    const { dispatch, form } = this.props;
    const { picList } = this.state.record;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      values.picList = picList;
      if (!err) {
        if (picList.length === 0) {
          message.error('请上传产品图片！！');
          return;
        }
        let id = values.id;
        let url = '';
        //判断为新增
        if (id == null) {
          url = 'productInfo/saveInfo';
        }
        //修改
        else {
          url = 'productInfo/editInfo';
        }
        //保存数据
        dispatch({
          type: url,
          payload: values,
        }).then(({ code }) => {
          if (code === 0) {
            this.goToProductList();
          }
        });
      }
    });
  };
  //关闭大图展示框
  handleCancel = () => this.setState({ previewVisible: false });
  //查看大图
  handlePreview = async file => {
    this.setState({
      previewImage: file.thumbUrl,
      previewVisible: true,
    });
  };
  //上传文件
  handleChange = info => {
    const { fileList, file } = info;
    const { record } = this.state;
    //后端成功返回数据
    if (file.status === 'done') {
      const { msg, code, fileUrl, minioPath } = file.response;
      if (code === 0) {
        for (let i = 0; i < fileList.length; i++) {
          if (file.uid === fileList[i].uid) {
            fileList[i].thumbUrl = fileUrl;
            fileList[i].minioPath = minioPath;
          }
        }
        record.picList = fileList;
        this.setState({ record: record });
        message.success('上传文件成功！！');
      } else {
        //去掉没上传成功的
        for (let i = 0; i < fileList.length; i++) {
          if (file.uid === fileList[i].uid) {
            fileList.splice(i, 1);
          }
        }
        record.picList = fileList;
        this.setState({ record: record });
        message.error('上传文件失败！！' + msg);
      }
    }
    //正在上传
    if (file.status === 'uploading') {
      record.picList = fileList;
      this.setState({ record: record });
    }
  };
  //删除图片
  handleRemove = info => {
    const { record } = this.state;
    const picList = record.picList;
    for (let i = 0; i < picList.length; i++) {
      if (info.uid === picList[i].uid) {
        picList.splice(i, 1);
      }
    }
    record.picList = picList;
    this.setState({ record: record });
    message.success('删除文件成功！！');
  };
  //上传之前校验文件类型
  handleBeforeUpload = file => {
    const isJPG =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJPG) {
      message.error('只能上传图片类型！！例如：jpg、png、gif');
    }
    return isJPG;
  };
  //返回产品列表页面
  goToProductList = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/tourism/productInfo/list',
        query: {
          record: {},
        },
      })
    );
  };

  render() {
    const { form, saveLoading, getInfoByIdLoading, editLoading } = this.props;
    const { record, previewVisible, previewImage } = this.state;
    return (
      <Form onSubmit={this.okHandler}>
        {form.getFieldDecorator('id', {
          initialValue: record.id ? record.id : null,
        })(<Input type="hidden" />)}
        <Card
          title="产品基本信息"
          className={styles.card}
          bordered={false}
          loading={getInfoByIdLoading || saveLoading || editLoading}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={12}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="产品名称">
                {form.getFieldDecorator('productName', {
                  rules: [{ required: true, message: '请输入产品名称' }],
                  initialValue: record.productName ? record.productName : null,
                })(<Input placeholder="请输入产品名称" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="线路类型">
                {form.getFieldDecorator('lineType', {
                  rules: [{ required: true, message: '请输入线路类型' }],
                  initialValue: record.lineType ? record.lineType : null,
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option key="1" value="1">
                      一日游
                    </Select.Option>
                    <Select.Option key="2" value="2">
                      国内游
                    </Select.Option>
                    <Select.Option key="3" value="3">
                      赴台游
                    </Select.Option>
                    <Select.Option key="4" value="4">
                      出境游
                    </Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="出发城市">
                {form.getFieldDecorator('startingCity', {
                  rules: [{ required: true, message: '请输入出发城市' }],
                  initialValue: record.startingCity ? record.startingCity : null,
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option key="太原市" value="太原市">
                      太原市
                    </Select.Option>
                    <Select.Option key="晋中市" value="晋中市">
                      晋中市
                    </Select.Option>
                    <Select.Option key="大同市" value="大同市">
                      大同市
                    </Select.Option>
                    <Select.Option key="朔州市" value="朔州市">
                      朔州市
                    </Select.Option>
                    <Select.Option key="忻州市" value="忻州市">
                      忻州市
                    </Select.Option>
                    <Select.Option key="阳泉市" value="阳泉市">
                      阳泉市
                    </Select.Option>
                    <Select.Option key="吕梁市" value="吕梁市">
                      吕梁市
                    </Select.Option>
                    <Select.Option key="长治市" value="长治市">
                      长治市
                    </Select.Option>
                    <Select.Option key="晋城市" value="晋城市">
                      晋城市
                    </Select.Option>
                    <Select.Option key="临汾市" value="临汾市">
                      临汾市
                    </Select.Option>
                    <Select.Option key="运城市" value="运城市">
                      运城市
                    </Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="行程天数">
                {form.getFieldDecorator('tripDays', {
                  rules: [{ required: true, message: '请输入行程天数' }],
                  initialValue: record.tripDays ? record.tripDays : null,
                })(<InputNumber min={1} max={30} defaultValue={1} style={{ width: '85%' }} />)}
                <span className="ant-form-text"> 天</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="行程晚数">
                {form.getFieldDecorator('tripNightNum', {
                  rules: [{ required: true, message: '请输入行程晚数' }],
                  initialValue: record.tripNightNum ? record.tripNightNum : null,
                })(<InputNumber min={1} max={30} defaultValue={1} style={{ width: '85%' }} />)}
                <span className="ant-form-text">晚</span>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="开始日期">
                {form.getFieldDecorator('startDate', {
                  rules: [{ required: true, message: '请输入日期范围开始' }],
                  initialValue: record.startDate ? moment(record.startDate, 'YYYY-MM-DD') : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="结束日期">
                {form.getFieldDecorator('endDate', {
                  rules: [{ required: true, message: '请输入日期范围结束' }],
                  initialValue: record.endDate ? moment(record.endDate, 'YYYY-MM-DD') : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="成人价格">
                {form.getFieldDecorator('adultPrice', {
                  rules: [{ required: true, message: '请输入成人价格' }],
                  initialValue: record.adultPrice ? record.adultPrice : null,
                })(<Input placeholder="请输入成人价格" addonAfter="元" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="儿童价格">
                {form.getFieldDecorator('childrenPrice', {
                  rules: [{ required: true, message: '请输入儿童价格' }],
                  initialValue: record.childrenPrice ? record.childrenPrice : null,
                })(<Input placeholder="请输入儿童价格" addonAfter="元" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单房差">
                {form.getFieldDecorator('singleRoomPrice', {
                  rules: [{ required: true, message: '请输入单房差' }],
                  initialValue: record.singleRoomPrice ? record.singleRoomPrice : null,
                })(<Input placeholder="请输入单房差" addonAfter="元" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="咨询电话">
                {form.getFieldDecorator('contactNumber', {
                  rules: [{ required: true, message: '请输入咨询电话' }],
                  initialValue: record.contactNumber ? record.contactNumber : null,
                })(<Input placeholder="请输入咨询电话" />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card
          title="产品展示图"
          className={styles.card}
          bordered={false}
          loading={getInfoByIdLoading || saveLoading || editLoading}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {form.getFieldDecorator('picList', {
              rules: [
                { validator: this.checkImageList, message: '请上传产品展示图', type: 'array' },
              ],
              initialValue: record.picList.length !== 0 ? record.picList : [],
            })(
              <div className="clearfix">
                <Upload
                  action="/api/sys/file/uploadFile"
                  headers={{
                    authorization: localStorage.getItem('token'),
                  }}
                  listType="picture-card"
                  fileList={record.picList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                  onRemove={this.handleRemove}
                  beforeUpload={this.handleBeforeUpload}
                  multiple={true}
                >
                  {record.picList.length >= 5 ? null : (
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">上传</div>
                    </div>
                  )}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                  width={1300}
                >
                  <img alt="example" style={{ width: '100%', height: '100%' }} src={previewImage} />
                </Modal>
              </div>
            )}
          </FormItem>
        </Card>
        <Card
          title="产品特色"
          className={styles.card}
          bordered={false}
          loading={getInfoByIdLoading || saveLoading || editLoading}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品特色">
            {form.getFieldDecorator('productCharacteristic', {
              rules: [{ required: true, message: '请输入产品特色' }],
              initialValue: record.productCharacteristic ? record.productCharacteristic : null,
            })(<Input placeholder="请输入产品特色" />)}
          </FormItem>
        </Card>
        <Card title="行程介绍" className={styles.card} bordered={false}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="行程介绍"
            loading={getInfoByIdLoading || saveLoading || editLoading}
          >
            {form.getFieldDecorator('travelInfo', {
              rules: [{ required: true, message: '请输入行程介绍' }],
              initialValue: record.travelInfo ? record.travelInfo : null,
            })(<Input placeholder="请输入行程介绍" />)}
          </FormItem>
        </Card>
        <Card title="费用包含" className={styles.card} bordered={false}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="费用包含"
            loading={getInfoByIdLoading || saveLoading || editLoading}
          >
            {form.getFieldDecorator('costInclusion', {
              rules: [{ required: true, message: '请输入费用包含' }],
              initialValue: record.costInclusion ? record.costInclusion : null,
            })(<Input placeholder="请输入费用包含" />)}
          </FormItem>
        </Card>
        <Card title="费用不含" className={styles.card} bordered={false}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="费用不含"
            loading={getInfoByIdLoading || saveLoading || editLoading}
          >
            {form.getFieldDecorator('costExcluded', {
              rules: [{ required: true, message: '请输入费用不含' }],
              initialValue: record.costExcluded ? record.costExcluded : null,
            })(<Input placeholder="请输入费用不含" />)}
          </FormItem>
        </Card>
        <Card title="预定须知" className={styles.card} bordered={false}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="预定须知"
            loading={getInfoByIdLoading || saveLoading || editLoading}
          >
            {form.getFieldDecorator('reservationNotes', {
              rules: [{ required: true, message: '请输入预定须知' }],
              initialValue: record.reservationNotes ? record.reservationNotes : null,
            })(<Input placeholder="请输入预定须知" />)}
          </FormItem>
        </Card>
        <Card title="退改规则" className={styles.card} bordered={false}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="退改规则"
            loading={getInfoByIdLoading || saveLoading || editLoading}
          >
            {form.getFieldDecorator('returnRules', {
              rules: [{ required: true, message: '请输入退改规则' }],
              initialValue: record.returnRules ? record.returnRules : null,
            })(<Input placeholder="请输入退改规则" />)}
          </FormItem>
        </Card>
        <Card
          title=""
          className={styles.card}
          bordered={false}
          loading={getInfoByIdLoading || saveLoading || editLoading}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10}></Col>
            <Col span={14}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.goToProductList}>
                返回
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}
