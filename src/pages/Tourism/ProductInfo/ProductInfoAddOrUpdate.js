import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select, Tree ,message,Card,Upload,Modal,Icon } from 'antd';
import BTreeSelect from '../../../components/nd_component/BTreeSelect';
import styles from './ProductInfo.less';
const { TreeNode } = Tree;


function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }



const { Item: FormItem } = Form;
const Option = Select.Option;
@Form.create()
@connect(({ productInfo }) => ({ productInfo }))
export default class ProductInfoAddOrUpdate extends Component {
    state = {
        previewVisible: false,
        previewImage:'',
        record:{},
        fileList:[

        ]
    };
    componentDidMount() {
        const { record, dispatch} = this.props;
    }
    okHandler = () => {
        this.props.form.validateFields((err, fields) => {
            if (!err) {
            const dataToSubmit = {
                ...fields,
            };
            this.props.onSubmit(err, dataToSubmit);
            }
        });
    };
    //关闭大图展示框
    handleCancel = () => this.setState({ previewVisible: false });
    //查看大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
    };
    //上传文件
    handleChange = (info) => {
        const {fileList,file} =info;
        //后端成功返回数据
        if(file.status === 'done'){
            const { msg,code,fileUrl,minioPath } = file.response;
            if(code===0){
                for(let i=0;i<fileList.length;i++){
                    if (file.uid === fileList[i].uid) {
                        fileList[i].thumbUrl=fileUrl;
                        fileList[i].minioPath=minioPath;
                    }
                }
                this.setState({ fileList:fileList });
                message.success("上传文件成功！！");
            }else{
                //去掉没上传成功的
                for (let i = 0; i < info.fileList.length; i++) {
                    if (file.uid === fileList[i].uid) {
                      fileList.splice(i, 1);
                    }
                }
                this.setState({ fileList: fileList});
                message.error("上传文件失败！！"+msg);
            }
        }
        //正在上传
        if(file.status === 'uploading'){
            this.setState({ fileList:fileList });
        }
    };
    //删除图片
    handleRemove = (info) =>{
        const {fileList} = this.state;
        for (let i = 0; i < fileList.length; i++) {
            if (info.uid === fileList[i].uid) {
              fileList.splice(i, 1);
            }
        }
        this.setState({ fileList:fileList });
        message.success("删除文件成功！！");
    }

    render() {
        const {  form} = this.props;
        const {record,previewVisible,previewImage,fileList} = this.state;
        return (
            <Form onSubmit={this.okHandler}>
                {form.getFieldDecorator('id', {
                    initialValue: record.id ? record.id : null,
                })(<Input type="hidden" />)}
                <Card title="产品基本信息" className={styles.card} bordered={false}>
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
                                    rules: [{ required: true, message: '请输入线路类型，1为一日游，2为国内游，3为赴台游，4为出境游' }],
                                    initialValue: record.lineType ? record.lineType : null,
                                })(<Input placeholder="请输入线路类型，1为一日游，2为国内游，3为赴台游，4为出境游" />)}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="出发城市">
                                {form.getFieldDecorator('startingCity', {
                                    rules: [{ required: true, message: '请输入出发城市' }],
                                    initialValue: record.startingCity ? record.startingCity : null,
                                })(<Input placeholder="请输入出发城市" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col span={6}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="行程天数">
                                    {form.getFieldDecorator('tripDays', {
                                        rules: [{ required: true, message: '请输入行程天数' }],
                                        initialValue: record.tripDays ? record.tripDays : null,
                                    })(<Input placeholder="请输入行程天数" />)}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="行程晚数">
                                    {form.getFieldDecorator('tripNightNum', {
                                        rules: [{ required: true, message: '请输入行程晚数' }],
                                        initialValue: record.tripNightNum ? record.tripNightNum : null,
                                    })(<Input placeholder="请输入行程晚数" />)}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="开始日期">
                                {form.getFieldDecorator('startDate', {
                                    rules: [{ required: true, message: '请输入日期范围开始' }],
                                    initialValue: record.startDate ? record.startDate : null,
                                })(<Input placeholder="请输入日期范围开始" />)}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="结束日期">
                                    {form.getFieldDecorator('endDate', {
                                        rules: [{ required: true, message: '请输入日期范围结束' }],
                                        initialValue: record.endDate ? record.endDate : null,
                                    })(<Input placeholder="请输入日期范围结束" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col span={6}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="成人价格">
                                {form.getFieldDecorator('adultPrice', {
                                    rules: [{ required: true, message: '请输入成人价格' }],
                                    initialValue: record.adultPrice ? record.adultPrice : null,
                                })(<Input placeholder="请输入成人价格" />)}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="儿童价格">
                                {form.getFieldDecorator('childrenPrice', {
                                    rules: [{ required: true, message: '请输入儿童价格' }],
                                    initialValue: record.childrenPrice ? record.childrenPrice : null,
                                })(<Input placeholder="请输入儿童价格" />)}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单房差">
                                {form.getFieldDecorator('singleRoomPrice', {
                                    rules: [{ required: true, message: '请输入单房差' }],
                                    initialValue: record.singleRoomPrice ? record.singleRoomPrice : null,
                                })(<Input placeholder="请输入单房差" />)}
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
                <Card title="产品展示图" className={styles.card} bordered={false}>
                    <div className="clearfix">
                        <Upload
                        action="/api/sys/file/uploadFile"
                        headers={{
                            authorization: localStorage.getItem("token"),
                        }}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        onRemove={this.handleRemove}
                        multiple={true}
                        >
                        {fileList.length >= 5 ? null : 
                           <div>
                           <Icon type="plus" />
                           <div className="ant-upload-text">上传</div>
                         </div>
                        }
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </div>
                </Card>
                <Card title="产品特色" className={styles.card} bordered={false}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品特色">
                        {form.getFieldDecorator('productCharacteristic', {
                            rules: [{ required: true, message: '请输入产品特色' }],
                            initialValue: record.productCharacteristic ? record.productCharacteristic : null,
                        })(<Input placeholder="请输入产品特色" />)}
                    </FormItem>
                </Card>
                <Card title="行程介绍" className={styles.card} bordered={false}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="行程介绍">
                        {form.getFieldDecorator('travelInfo', {
                            rules: [{ required: true, message: '请输入行程介绍' }],
                            initialValue: record.travelInfo ? record.travelInfo : null,
                        })(<Input placeholder="请输入行程介绍" />)}
                    </FormItem>
                </Card>
                <Card title="费用包含" className={styles.card} bordered={false}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="费用包含">
                        {form.getFieldDecorator('costInclusion', {
                            rules: [{ required: true, message: '请输入费用包含' }],
                            initialValue: record.costInclusion ? record.costInclusion : null,
                        })(<Input placeholder="请输入费用包含" />)}
                    </FormItem>
                </Card>
                <Card title="费用不含" className={styles.card} bordered={false}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="费用不含">
                        {form.getFieldDecorator('costExcluded', {
                            rules: [{ required: true, message: '请输入费用不含' }],
                            initialValue: record.costExcluded ? record.costExcluded : null,
                        })(<Input placeholder="请输入费用不含" />)}
                    </FormItem>
                </Card>
                <Card title="预定须知" className={styles.card} bordered={false}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="预定须知">
                        {form.getFieldDecorator('reservationNotes', {
                            rules: [{ required: true, message: '请输入预定须知' }],
                            initialValue: record.reservationNotes ? record.reservationNotes : null,
                        })(<Input placeholder="请输入预定须知" />)}
                    </FormItem>
                </Card>
                <Card title="退改规则" className={styles.card} bordered={false}>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退改规则">
                        {form.getFieldDecorator('returnRules', {
                            rules: [{ required: true, message: '请输入退改规则' }],
                            initialValue: record.returnRules ? record.returnRules : null,
                        })(<Input placeholder="请输入退改规则" />)}
                    </FormItem>
                </Card>
            </Form>
        );
    }
}