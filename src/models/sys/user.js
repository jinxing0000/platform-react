import { query as queryUsers, queryCurrent,getUserList,saveUserInfo,getUserInfoById,editUserInfo,deleteUserByIds } from '@/services/sys/user';
import { message } from 'antd';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    userList: {
      list: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 1, 
      },
    },
    userInfo:{}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      response.user.avatar="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png";
      yield put({
        type: 'saveCurrentUser',
        payload: response.user,
      });
    },
    // 获取用户list
    *getUserList({ payload }, { call, put }) {
      const result = yield call(getUserList, payload);
      yield put({
          type: 'updateUserList',
          payload: {
            list: result.data.list,
            pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
          },
      });
  },
  //新增用户信息
  *saveUserInfo({ payload }, { call, put }){
    let roleIdList=payload.roleIdList;
    let roleList=new Array();
    let role;
    for(let i=0;i<roleIdList.length;i++){
      role=new Object();
      role.roleId=roleIdList[i];
      roleList[i]=role;
    }
    payload.roleIdList=roleList;
    const result = yield call(saveUserInfo, payload);
    message.success("新增用户成功！！", 10);
  },
  *editUserInfo({ payload }, { call, put }){
    let roleIdList=payload.roleIdList;
    let roleList=new Array();
    let role;
    for(let i=0;i<roleIdList.length;i++){
      role=new Object();
      role.roleId=roleIdList[i];
      roleList[i]=role;
    }
    payload.roleIdList=roleList;
    const result = yield call(editUserInfo, payload);
    message.success("修改用户成功！！", 10);
  },
  *deleteUserByIds({ payload }, { call, put }){
    const result = yield call(deleteUserByIds, payload);
    message.success("删除用户成功！！", 10);
  },
  *getRoleInfoById({ payload }, { call, put }){
      const result = yield call(getRoleInfoById, payload);
      yield put({
          type: 'setRoleInfo',
          payload: result.data
      });
      return result.data.menuIdList;
  }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    updateUserList(state, { payload }) {
      return { ...state, userList: payload };
    },
    setRoleInfo(state, { payload }){
      return { ...state, userInfo: payload };
    }
  },
};
