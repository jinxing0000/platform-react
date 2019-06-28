import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    captchaimg:"",
    code:0,
    msg:""
  },



  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // Login successfully
      if (response.code === 0) {
        response.currentAuthority="admin";
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }else{
        response.currentAuthority="guest";
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      reloadAuthorized();
    },

    *getCaptcha({ payload }, { call,put }) {
      // 获取验证码之前，先清空 token
      localStorage.removeItem('verifyCodeToken');
      const response=yield call(getFakeCaptcha, payload);
      const token=response.response.headers.get("Authorization");
      const img=response.data.img;
      localStorage.setItem('verifyCodeToken', token);
      yield put({
        type: 'setCaptcha',
        payload:'data:image/JPEG;base64,'+img,
      });
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: 'guest',
          code:0
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
        msg:payload.msg
      };
    },
    setCaptcha(state,{payload}){
      return {...state,captchaimg:payload};
    }
  },
};
