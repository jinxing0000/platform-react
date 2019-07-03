import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Icon, Button, Divider, Tooltip, Popconfirm } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Dept.less';



@connect(({ dept, loading }) => ({
  dept,
  getDeptTreeListLoading: loading.effects['dept/getTreeList'],
}))
@Form.create()
class Dept extends PureComponent {

  state = {
    formValues: {},
  };

  //页面初始化加载
  componentDidMount() {
    const { dispatch } = this.props;
    this.handleSearch();
  }

   //查询部门tree
   handleSearch = e => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'dept/getDeptTreeList',
    });
  };

  render() {
    const {
      dept: { deptTreeList },
      getDeptTreeListLoading
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
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '部门编号',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '排序号',
        dataIndex: 'orderNum',
        key: 'orderNum',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {/*<Tooltip placement="bottom" title="查看">*/}
            {/*<Icon type="eye-o" style={{ fontSize: '15px' }} />*/}
            {/*</Tooltip>*/}
            {/*<Divider type="vertical" />*/}
            <Tooltip placement="bottom" title="编辑">
              <Icon
                type="edit"
                style={{ fontSize: '15px' }}
                onClick={() => {
                  window.modal.current.getWrappedInstance().alertModal({
                    title: '编辑部门',
                    loading: 'department/updateDepartmentInfo',
                    btnSubTitle: '保存',
                    component: DepartmentForm,
                    deptList,
                    record,
                    apply: this.handleAdd,
                  });
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除这个部门？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => {
                this.delDepartment(record.deptId);
              }}
            >
              <a>
                <Tooltip placement="bottom" title="删除">
                  <Icon type="delete" style={{ fontSize: '15px', color: '#EE4000' }} />
                </Tooltip>
              </a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  window.modal.current.getWrappedInstance().alertModal({
                    title: '新建部门',
                    btnSubTitle: '保存',
                    loading: 'department/saveDepartmentInfo',
                    component: DepartmentForm,
                    deptList,
                    record: {},
                    apply: this.handleAdd,
                  });
                }}
              >
                新建
              </Button>
            </div>
            <StandardTable
              rowKey="deptId"
              defaultExpandAllRows
              loading={getDeptTreeListLoading}
              selectedRows={false}
              data={deptTreeList}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
    );
  }
}

export default Dept;