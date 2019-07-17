import { query as queryUsers, queryCurrent,getUserList,saveUserInfo,getUserInfoById,editUserInfo,deleteUserByIds,initUserPassword,modifyPassword } from '@/services/sys/user';
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
      if(response.code===0){
        response.data.avatar="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png";
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }else{
        message.error(response.msg);
      }
      return response;
    },
    // 获取用户list
    *getUserList({ payload }, { call, put }) {
      const result = yield call(getUserList, payload);
      if(result.code===0){
        yield put({
          type: 'updateUserList',
          payload: {
            list: result.data.list,
            pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
          },
        });
      }else{
        message.error(result.msg);
      }
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
    if(result.code===0){
      message.success("新增用户！！");
    }else{
      message.error(result.msg);
    }
    return result;
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
    if(result.code===0){
      message.success("修改成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  *deleteUserByIds({ payload }, { call, put }){
    const result = yield call(deleteUserByIds, payload);
    if(result.code===0){
      message.success("删除成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  *initUserPassword({ payload }, { call, put }){
    const result = yield call(initUserPassword, payload);
    if(result.code===0){
      message.success("重置成功！！重置密码为：123456",10);
    }else{
      message.error(result.msg);
    }
    return result;
  },
  *modifyPassword({ payload }, { call, put }){
    const result = yield call(modifyPassword, payload);
    if(result.code===0){
      message.success("密码修改成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  *getUserInfoById({ payload }, { call, put }){
      const result = yield call(getUserInfoById, payload);
      if(result.code===0){
        const userInfo=result.data;
        const roleList=userInfo.roleIdList;
        let roleIdList=new Array();
        for(let i=0;i<roleList.length;i++){
          roleIdList[i]=roleList[i].roleId;
        }
        userInfo.roleIdList=roleIdList;
        yield put({
            type: 'setUserInfo',
            payload: userInfo
        });
      }else{
        message.error(result.msg);
      }
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
    setUserInfo(state, { payload }){
      return { ...state, userInfo: payload?payload:{}};
    }
  },
};
