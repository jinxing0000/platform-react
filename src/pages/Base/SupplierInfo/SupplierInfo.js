import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col,Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message,Input } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SupplierInfo.less';
import SupplierInfoAddOrUpdate from './SupplierInfoAddOrUpdate';
const { Item: FormItem } = Form;
const { confirm } = Modal;



@connect(({ supplierInfo, loading,user }) => ({
    supplierInfo,
    user,
    getListLoading: loading.effects['supplierInfo/getPageList'],
    saveLoading: loading.effects['supplierInfo/saveInfo'],
    editLoading: loading.effects['supplierInfo/editInfo'],
    deleteByIdsLoading: loading.effects['supplierInfo/deleteByIds'],
    disablingByIdsLoading: loading.effects['supplierInfo/disablingByIds'],
    enablingByIdsLoading: loading.effects['supplierInfo/enablingByIds'],
}))
@Form.create()
class SupplierInfo extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            params: {page:1,limit:10},
        };
    }

    //页面初始化加载
    componentDidMount() {
        this.getList(this.state.params);
    }
    //获取供应商信息表list数据
    getList(params){
        const { dispatch } = this.props;
        dispatch({
            type: 'supplierInfo/getPageList',
            payload: params,
        });
    }
    //条件查询list
    handleSearch= e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        const { params } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
        const values = {
        ...fieldsValue,
            page: params.page,
            limit: params.limit,
        };
        this.setState({
            params: values,
        });
        this.getList(values);
        });
    };
    //重置查询条件
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        const { params } = this.state;
        form.resetFields();
        let searchParams = {page:params.page,limit:params.limit}
        this.setState({
            params: searchParams,
        });
        this.getList(searchParams);
    };
    //新增修改供应商信息表信息
    handleSaveInfo = (fields,callback) => {
        const { dispatch } = this.props;
        const id=fields.id;
        let url="";
        //判断为新增
        if(id==null){
            url="supplierInfo/saveInfo";
        }
        //修改
        else{
            url="supplierInfo/editInfo";
        }
        dispatch({
            type: url,
            payload: fields,
        })
        .then(({code}) => {
            if(code===0){
            callback('ok');
            this.getList(this.state.params);
        }
    });
    };
    //删除供应商信息表
    deleteByIds(ids){
        const { dispatch } = this.props;
        dispatch({
            type: "supplierInfo/deleteByIds",
            payload: ids,
        })
        .then(({code}) => {
            if(code===0){
            this.getList(this.state.params);
        }
        });
    }
    //批量删除供应商信息表信息
    batchDelete(){
        const {selectedRows} = this.state;
        if(selectedRows.length===0){
            message.error("请选择删除数据行！！");
            return ;
        }
        let ids=new Array();
        for(var i=0;i<selectedRows.length;i++){
            ids[i]=selectedRows[i].id;
        }
        let userPage=this;
        confirm({
            title: '您确定要删除所选数据行?',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                userPage.deleteByIds(ids);
            },
            onCancel() {

            },
        });
    }

    //批量禁用供应商
    disablingByIds(){
        const {selectedRows} = this.state;
        const { dispatch } = this.props;
        if(selectedRows.length===0){
            message.error("请选择供应商！！");
            return ;
        }
        let ids=new Array();
        for(var i=0;i<selectedRows.length;i++){
            ids[i]=selectedRows[i].id;
        }
        let userPage=this;
        confirm({
            title: '您确定要禁用所选供应商吗?',
            okText: '禁用',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: "supplierInfo/disablingByIds",
                    payload: ids,
                })
                .then(({code}) => {
                    if(code===0){
                        userPage.getList(userPage.state.params);
                    }
                });
            },
            onCancel() {

            },
        });
    }


    //批量启用供应商
    enablingByIds(){
        const {selectedRows} = this.state;
        const { dispatch } = this.props;
        if(selectedRows.length===0){
            message.error("请选择供应商！！");
            return ;
        }
        let ids=new Array();
        for(var i=0;i<selectedRows.length;i++){
            ids[i]=selectedRows[i].id;
        }
        let userPage=this;
        confirm({
            title: '您确定要启用所选供应商吗?',
            okText: '启用',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: "supplierInfo/enablingByIds",
                    payload: ids,
                })
                .then(({code}) => {
                    if(code===0){
                        userPage.getList(userPage.state.params);
                    }
                });
            },
            onCancel() {

            },
        });
    }

    // 翻页
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { params } = this.state;
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});
        const searchParams = {
            ...params,
            ...filters,
            page: pagination.current,
            limit: pagination.pageSize,
        };
        if (sorter.field) {
            searchParams.sorter = `${sorter.field}_${sorter.order}`;
        }
        this.setState({
            params: searchParams,
        });
        this.getList(searchParams);
    };

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };
    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const {params }= this.state;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="供应商名称">
                            {getFieldDecorator('supplierName',{initialValue: params.supplierName,})(<Input placeholder="请输入供应商名称" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="联系人">
                            {getFieldDecorator('contactsName',{initialValue: params.contactsName,})(<Input placeholder="请输入联系人" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="联系电话">
                            {getFieldDecorator('contactNumber',{initialValue: params.contactNumber,})(<Input placeholder="请输入联系电话" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                    查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                    重置
                            </Button>
                            </span>
                    </Col>
                </Row>
            </Form>
        );
    }
    render() {
        const {
            supplierInfo: { supplierInfoList},
            user:{ currentUser },
            getListLoading,
            saveLoading,
            editLoading,
            deleteByIdsLoading,
            disablingByIdsLoading,
            enablingByIdsLoading
        } = this.props;
        const columns = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                render: (record, text, index) => {
                return <span>{index + 1}</span>;
                },
            },
            {
                title: '供应商名称',
                dataIndex: 'supplierName',
                key: 'supplierName',
            },
            {
                title: '法人代表',
                dataIndex: 'legalPerson',
                key: 'legalPerson',
            },
            {
                title: '联系人',
                dataIndex: 'contactsName',
                key: 'contactsName',
            },
            {
                title: '联系电话',
                dataIndex: 'contactNumber',
                key: 'contactNumber',
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'creditCode',
                key: 'creditCode',
            },
            {
                title: '注册资金',
                dataIndex: 'registeredFunds',
                key: 'registeredFunds',
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: record => {
                    switch (record) {
                      case '00':
                        return <span>禁用</span>;
                        break;
                      case '01':
                        return <span>正常</span>;
                        break;
                      default:
                        break;
                    }
                  },
            },
            {
            title: '操作',
                render: (text, record) => (
            <Fragment>
                { currentUser.permsSet && currentUser.permsSet.includes('base:supplierInfo:update') &&
                <Tooltip placement="bottom" title="编辑">
                    <Icon
                        type="edit"
                        style={{ fontSize: '15px' }}
                        onClick={() => {
                            window.modal.current.getWrappedInstance().alertModal({
                            title: '编辑',
                            loading: 'supplierInfo/editInfo',
                            btnSubTitle: '修改',
                            component: SupplierInfoAddOrUpdate,
                            record,
                            apply: this.handleSaveInfo,
                            width:900
                        });
                        }}
                    />
                </Tooltip>
                }
                {currentUser.permsSet && currentUser.permsSet.includes('base:supplierInfo:update') &&
                < Divider type="vertical" />
                }
                {currentUser.permsSet && currentUser.permsSet.includes('base:supplierInfo:delete') &&
                < Popconfirm
                    title="确认删除吗？"
                    okText="删除"
                    cancelText="取消"
                    onConfirm={() => {
                    let ids=new Array();
                    ids[0]=record.id;
                    this.deleteByIds(ids);
                    }}
                >
                    <a>
                    <Tooltip placement="bottom" title="删除">
                    <Icon type="delete" style={{fontSize: '15px', color: '#EE4000'}} />
                    </Tooltip>
                    </a>
                 </Popconfirm>
                }
            </Fragment>
        ),
        },
    ];
        return (
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                    <div className={styles.tableListOperator}>
                        {currentUser.permsSet && currentUser.permsSet.includes('base:supplierInfo:save') &&
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => {
                                window.modal.current.getWrappedInstance().alertModal({
                                title: '新增',
                                btnSubTitle: '新增',
                                loading: 'supplierInfo/saveInfo',
                                component: SupplierInfoAddOrUpdate,
                                record: {},
                                apply: this.handleSaveInfo,
                                width:900
                            });
                            }}
                        >
                            新增
                        </Button>
                        }
                        {currentUser.permsSet && currentUser.permsSet.includes('base:supplierInfo:delete') &&
                        <Button
                            icon="delete"
                            type="danger"
                            onClick={() => {
                                this.batchDelete();
                            }}
                        >
                            批量删除
                        </Button>
                        }
                        {currentUser.permsSet && currentUser.permsSet.includes('base:supplierInfo:disabling') &&
                        <Button
                            onClick={() => {
                                this.disablingByIds();
                            }}
                        >
                            禁用
                        </Button>
                        }
                        {currentUser.permsSet && currentUser.permsSet.includes('base:supplierInfo:enabling') &&
                        <Button
                            onClick={() => {
                                this.enablingByIds();
                            }}
                        >
                            启用
                        </Button>
                        }
                    </div>
                    <StandardTable
                        rowKey="id"
                        defaultExpandAllRows
                        loading={getListLoading||saveLoading||editLoading||deleteByIdsLoading||disablingByIdsLoading||enablingByIdsLoading}
                        selectedRows={true}
                        data={supplierInfoList}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                    />
                </div>
            </Card>
        );
        }
    }
export default SupplierInfo;