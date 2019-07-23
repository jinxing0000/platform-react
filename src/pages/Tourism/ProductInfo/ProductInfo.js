import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col,Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message,Input } from 'antd';
import { routerRedux } from 'dva/router';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ProductInfo.less';
import ProductInfoAddOrUpdate from './ProductInfoAddOrUpdate';
const { Item: FormItem } = Form;
const { confirm } = Modal;



@connect(({ productInfo, loading,user }) => ({
    productInfo,
    user,
    getListLoading: loading.effects['productInfo/getPageList'],
    saveLoading: loading.effects['productInfo/saveInfo'],
    editLoading: loading.effects['productInfo/editInfo'],
    deleteByIdsLoading: loading.effects['productInfo/deleteByIds'],
}))
@Form.create()
class ProductInfo extends PureComponent {

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
    //获取旅游产品信息表list数据
    getList(params){
        const { dispatch } = this.props;
        dispatch({
            type: 'productInfo/getPageList',
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
    //新增修改旅游产品信息表信息
    handleSaveInfo = (fields,callback) => {
        const { dispatch } = this.props;
        const id=fields.id;
        let url="";
        //判断为新增
        if(id==null){
            url="productInfo/saveInfo";
        }
        //修改
        else{
            url="productInfo/editInfo";
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
    //删除旅游产品信息表
    deleteByIds(ids){
        const { dispatch } = this.props;
        dispatch({
            type: "productInfo/deleteByIds",
            payload: ids,
        })
        .then(({code}) => {
            if(code===0){
            this.getList(this.state.params);
        }
        });
    }
    //批量删除旅游产品信息表信息
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
                        <FormItem label="产品名称">
                            {getFieldDecorator('productName',{initialValue: params.name,})(<Input placeholder="请输入产品名称" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
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

    goToAddOrUpdatePage(id){
        this.props.dispatch(routerRedux.push({ 
            pathname: '/tourism/productInfoAddOrUpdate',
            params: {
                id:id
            }
        }))
    }
    render() {
        const {
            productInfo: { productInfoList},
            user:{ currentUser },
            getListLoading,
            saveLoading,
            editLoading,
            deleteByIdsLoading
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
                title: '产品名称',
                dataIndex: 'productName',
                key: 'productName',
            },
            // {
            //     title: '产品引导图地址',
            //     dataIndex: 'productGuidePicUrl',
            //     key: 'productGuidePicUrl',
            // },
            {
                title: '线路类型',
                dataIndex: 'lineType',
                key: 'lineType',
                render: record => {
                    switch (record) {
                      case '1':
                        return <span> 一日游</span>;
                        break;
                      case '2':
                        return <span>国内游</span>;
                        break;
                    case '3':
                        return <span>赴台游</span>;
                        break;
                    case '4':
                        return <span>出境游</span>;
                        break;
                    default:
                        break;
                    }
                  },
            },
            {
                title: '出发城市',
                dataIndex: 'startingCity',
                key: 'startingCity',
            },
            {
                title: '行程天数',
                dataIndex: 'tripDays',
                key: 'tripDays',
                render: (val, item, index) => (
                        <span>{item.tripDays}天{item.tripNightNum}晚</span>
                ),
            },
            // {
            //     title: '行程晚数',
            //     dataIndex: 'tripNightNum',
            //     key: 'tripNightNum',
            // },
            {
                title: '日期范围',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (val, item, index) => (
                    <span>{item.startDate}至{item.endDate}</span>
                ),
            },
            // {
            //     title: '日期范围结束',
            //     dataIndex: 'endDate',
            //     key: 'endDate',
            // },
            {
                title: '成人价格',
                dataIndex: 'adultPrice',
                key: 'adultPrice',
            },
            {
                title: '儿童价格',
                dataIndex: 'childrenPrice',
                key: 'childrenPrice',
            },
            {
                title: '单房差',
                dataIndex: 'singleRoomPrice',
                key: 'singleRoomPrice',
            },
            // {
            //     title: '产品特色',
            //     dataIndex: 'productCharacteristic',
            //     key: 'productCharacteristic',
            // },
            // {
            //     title: '行程介绍',
            //     dataIndex: 'travelInfo',
            //     key: 'travelInfo',
            // },
            // {
            //     title: '费用包含',
            //     dataIndex: 'costInclusion',
            //     key: 'costInclusion',
            // },
            // {
            //     title: '费用不含',
            //     dataIndex: 'costExcluded',
            //     key: 'costExcluded',
            // },
            // {
            //     title: '预定须知',
            //     dataIndex: 'reservationNotes',
            //     key: 'reservationNotes',
            // },
            // {
            //     title: '退改规则',
            //     dataIndex: 'returnRules',
            //     key: 'returnRules',
            // },
            {
                title: '咨询电话',
                dataIndex: 'contactNumber',
                key: 'contactNumber',
            },
            // {
            //     title: '供应商id',
            //     dataIndex: 'supplierId',
            //     key: 'supplierId',
            // },
            // {
            //     title: '供应商名称',
            //     dataIndex: 'supplierName',
            //     key: 'supplierName',
            // },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: record => {
                    switch (record) {
                      case '0':
                        return <span>未上架</span>;
                        break;
                      case '1':
                        return <span>上架中</span>;
                        break;
                      case '2':
                        return <span>已下架</span>;
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
                { currentUser.permsSet && currentUser.permsSet.includes('tourism:productInfo:update') &&
                <Tooltip placement="bottom" title="编辑">
                    <Icon
                        type="edit"
                        style={{ fontSize: '15px' }}
                        onClick={() => {
                            this.goToAddOrUpdatePage(record.id);
                        }}
                    />
                </Tooltip>
                }
                {currentUser.permsSet && currentUser.permsSet.includes('tourism:productInfo:update') &&
                < Divider type="vertical" />
                }
                {currentUser.permsSet && currentUser.permsSet.includes('tourism:productInfo:delete') &&
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
                        {currentUser.permsSet && currentUser.permsSet.includes('tourism:productInfo:save') &&
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => {
                                this.goToAddOrUpdatePage();
                            }}
                        >
                            新增
                        </Button>
                        }
                        {currentUser.permsSet && currentUser.permsSet.includes('tourism:productInfo:delete') &&
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
                    </div>
                    <StandardTable
                        rowKey="id"
                        defaultExpandAllRows
                        loading={getListLoading||saveLoading||editLoading||deleteByIdsLoading}
                        selectedRows={true}
                        data={productInfoList}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                    />
                </div>
            </Card>
        );
        }
    }
export default ProductInfo;