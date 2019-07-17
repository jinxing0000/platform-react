import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Layout, message ,Modal,Form,Input } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';


const { Header } = Layout;
const { Item: FormItem } = Form;
@connect(({ user, loading }) => ({
  user,
  modifyPasswordLoading: loading.effects['user/modifyPassword'],
}))
@Form.create()
class HeaderView extends Component {
  state = {
    visible: true,
    modifyPassword:false,
    passwordMap:{

    }
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings/base');
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
    if(key === 'modifyPassword'){
       this.openModifyPassword();
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  openModifyPassword(){
    this.setState({modifyPassword:true});
  }

  modifyPassword= e =>{
    const { passwordMap } = this.state;
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        passwordMap: values,
      });
      if(values.password!==values.newPassword){
        message.error("两次新密码不一致！！");
        return ;
      }
      dispatch({
        type: 'user/modifyPassword',
        payload: values,
      })
      .then(({code}) => {
        if(code===0){
          this.setState({modifyPassword:false});
          window.g_app._store.dispatch({
            type: 'login/sessionInvalidation',
          });
        }
      });
    });
  }

  cancelModifyPassword = e => {
    this.setState({modifyPassword:false});
  }

  render() {
    const { isMobile, handleMenuCollapse, setting,login } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { passwordMap }= this.state; 
    const { navTheme, layout, fixedHeader } = setting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    if(login.code!=0){
      message.error(login.msg);
    }
    const HeaderDom = visible ? (
      <Header
        style={{ padding: 0, width, zIndex: 2 }}
        className={fixedHeader ? styles.fixedHeader : ''}
      >
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        )}
          <Modal
          title="修改密码"
          visible={this.state.modifyPassword}
          onOk={this.modifyPassword}
          onCancel={this.cancelModifyPassword}
          okText="修改密码"
        >
          <FormItem label="原密码" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('oldPassword',{rules: [{ required: true, message: '请输入原密码' }],initialValue: passwordMap.oldPassword,},)(<Input placeholder="请输入原密码" type="password"/>)}
          </FormItem>
          <FormItem label="新密码" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('password',{rules: [{ required: true, message: '请输入新密码' }],initialValue: passwordMap.password,})(<Input placeholder="请输入新密码" type="password"/>)}
          </FormItem>
          <FormItem label="确认密码" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('newPassword',{rules: [{ required: true, message: '请输入确认密码' }],initialValue: passwordMap.newPassword,})(<Input placeholder="请输入确认密码" type="password"/>)}
          </FormItem>
        </Modal>
      </Header>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect(({ user, global, setting, loading,login }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  setting,
  login
}))(HeaderView);
