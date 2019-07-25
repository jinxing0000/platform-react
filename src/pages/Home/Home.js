import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Icon,
  Button,
  Divider,
  Tooltip,
  Popconfirm,
  Modal,
  message,
  Input,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Home.less';
const { Item: FormItem } = Form;
const { confirm } = Modal;

@connect(({ loading, user }) => ({
  user,
}))
@Form.create()
class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //页面初始化加载
  componentDidMount() {}
  render() {
    const {
      user: { currentUser },
    } = this.props;
    return <Card bordered={false}></Card>;
  }
}
export default Home;
