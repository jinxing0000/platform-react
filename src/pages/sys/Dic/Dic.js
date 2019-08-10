import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col,Card, Form, Icon, Button, Divider, Tooltip, Popconfirm, Modal,message,Input } from 'antd';
import { routerRedux } from 'dva/router';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Dic.less';
import DicAddOrUpdate from './DicAddOrUpdate';
const { Item: FormItem } = Form;
const { confirm } = Modal;



@connect(({ dic, loading,user }) => ({
    dic,
    user,
    getListLoading: loading.effects['dic/getPageList'],
    saveLoading: loading.effects['dic/saveInfo'],
    editLoading: loading.effects['dic/editInfo'],
    deleteByIdsLoading: loading.effects['dic/deleteByIds'],
}))
@Form.create()
class Dic extends PureComponent {

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
    //获取数据字典表list数据
    getList(params){
        const { dispatch } = this.props;
        dispatch({
            type: 'dic/getPageList',
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
    //新增修改数据字典表信息
    handleSaveInfo = (fields,callback) => {
        const { dispatch } = this.props;
        const id=fields.id;
        let url="";
        //判断为新增
        if(id==null){
            url="dic/saveInfo";
        }
        //修改
        else{
            url="dic/editInfo";
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
    //删除数据字典表
    deleteByIds(ids){
        const { dispatch } = this.props;
        dispatch({
            type: "dic/deleteByIds",
            payload: ids,
        })
        .then(({code}) => {
            if(code===0){
            this.getList(this.state.params);
        }
        });
    }
    //批量删除数据字典表信息
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
                        <FormItem label="字典code">
                            {getFieldDecorator('code',{initialValue: params.code,})(<Input placeholder="请输入字典code" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem label="字典名称">
                            {getFieldDecorator('value',{initialValue: params.value,})(<Input placeholder="请输入字典value" />)}
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

    goAttributeDicList(record) {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/system/dic/attributeDicList',
            query: {
              parentCode: record.code,
            },
          })
        );
    }


    render() {
        const {
            dic: { dicList},
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
                title: '字典code',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '字典名称',
                dataIndex: 'value',
                key: 'value',
            },
            // {
            //     title: '父级字典code',
            //     dataIndex: 'parentCode',
            //     key: 'parentCode',
            // },
            {
                title: '排序号',
                dataIndex: 'sort',
                key: 'sort',
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
            },
            {
            title: '操作',
                render: (text, record) => (
            <Fragment>
                { currentUser.permsSet && currentUser.permsSet.includes('sys:dic:update') &&
                <Tooltip placement="bottom" title="编辑">
                    <Icon
                        type="edit"
                        style={{ fontSize: '15px' }}
                        onClick={() => {
                            window.modal.current.getWrappedInstance().alertModal({
                            title: '编辑',
                            loading: 'dic/editInfo',
                            btnSubTitle: '修改',
                            component: DicAddOrUpdate,
                            record,
                            apply: this.handleSaveInfo,
                        });
                        }}
                    />
                </Tooltip>
                }
                {currentUser.permsSet && currentUser.permsSet.includes('sys:dic:update') &&
                < Divider type="vertical" />
                }
                {currentUser.permsSet && currentUser.permsSet.includes('sys:dic:delete') &&
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
                <Button type="link" onClick={() => this.goAttributeDicList(record)}>
                 属性维护
                </Button>
            </Fragment>
        ),
        },
    ];
        return (
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                    <div className={styles.tableListOperator}>
                        {currentUser.permsSet && currentUser.permsSet.includes('sys:dic:save') &&
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => {
                                window.modal.current.getWrappedInstance().alertModal({
                                title: '新增',
                                btnSubTitle: '新增',
                                loading: 'dic/saveInfo',
                                component: DicAddOrUpdate,
                                record: {},
                                apply: this.handleSaveInfo,
                            });
                            }}
                        >
                            新增
                        </Button>
                        }
                        {currentUser.permsSet && currentUser.permsSet.includes('sys:dic:delete') &&
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
                        data={dicList}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                    />
                </div>
            </Card>
        );
        }
    }
export default Dic;