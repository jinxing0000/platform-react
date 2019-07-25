import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, logout } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    captchaimg: '',
    code: 0,
    msg: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const result = yield call(fakeAccountLogin, payload);
      const response = result.data;
      // Login successfully
      if (response.code === 0) {
        localStorage.removeItem('token');
        const token = result.response.headers.get('Authorization');
        localStorage.setItem('token', token);
        response.currentAuthority = 'user';
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     redirect = null;
        //   }
        // }
        // yield put(routerRedux.replace(redirect || '/'));
        yield put(routerRedux.push('/home'));
      } else {
        response.currentAuthority = 'guest';
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      reloadAuthorized();
    },

    *getCaptcha({ payload }, { call, put }) {
      // 获取验证码之前，先清空 token
      localStorage.removeItem('token');
      const response = yield call(getFakeCaptcha, payload);
      const token = response.response.headers.get('Authorization');
      if (response.data.code === 0) {
        const img = response.data.img;
        localStorage.setItem('token', token);
        yield put({
          type: 'setCaptcha',
          payload: 'data:image/JPEG;base64,' + img,
        });
      } else {
        message.error(response.data.msg);
      }
    },

    *logout({ payload }, { call, put }) {
      const response = yield call(logout, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: 'guest',
            code: 0,
          },
        });
        reloadAuthorized();
        const { redirect } = getPageQuery();
        // redirect
        if (window.location.pathname !== '/user/login' && !redirect) {
          yield put(
            routerRedux.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: window.location.href,
              }),
            })
          );
        }
      } else {
        message.error(response.msg);
        yield put({
          type: 'changeLogoutStatus',
          payload: response,
        });
      }
    },
    //会话失效跳转到登陆页面
    *sessionInvalidation({ payload }, { call, put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: 'guest',
          code: 0,
        },
      });
      reloadAuthorized();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        code: payload.code,
        msg: payload.msg,
      };
    },
    setCaptcha(state, { payload }) {
      return { ...state, captchaimg: payload };
    },
    changeLogoutStatus(state, { payload }) {
      return { ...state, code: payload.code, msg: payload.msg };
    },
  },
};
