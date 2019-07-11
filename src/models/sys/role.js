import { getRoleList,saveRoleInfo,getRoleInfoById,editRoleInfo,deleteRoleByIds,getRolePageList } from '@/services/sys/role';
import { message } from 'antd';

export default {
  namespace: 'role',

  state: {
    roleList: {
        list: [],
        pagination: {
          current: 1,
          total: 0,
          pageSize: 1, 
        },
    },
    roleInfo:{}
  },

  effects: {
    // 获取角色list
    *getRolePageList({ payload }, { call, put }) {
        debugger;
        const result = yield call(getRoleList, payload);
        yield put({
            type: 'updateRoleList',
            payload: {
              list: result.data.list,
              pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
            },
        });
    },
    *saveRoleInfo({ payload }, { call, put }){
      const parentId=payload.parentId;
      if(parentId==null){
        payload.parentId="0";
      }
      const result = yield call(saveRoleInfo, payload);
      message.success("新增角色成功！！", 10);
    },
    *editRoleInfo({ payload }, { call, put }){
      const result = yield call(editRoleInfo, payload);
      message.success("修改角色成功！！", 10);
    },
    *deleteRoleByIds({ payload }, { call, put }){
      const result = yield call(deleteRoleByIds, payload);
      message.success("删除角色成功！！", 10);
    },
    *getRoleInfoById({ payload }, { call, put }){
        const result = yield call(getRoleInfoById, payload);
        yield put({
            type: 'setRoleInfo',
            payload: result.data
        });
        return result.data.menuIdList;
    },
    //角色列表                          
    *getRoleList({ payload }, { call, put }){
      const result = yield call(getRoleList, payload);
      yield put({
        type: 'setRoleList',
        payload: result.data
      });
    }
  },

  reducers: {
    updateRoleList(state, { payload }) {
        return { ...state, roleList: payload };
    },
    setRoleInfo(state, { payload }){
      return { ...state, roleInfo: payload };
    },
    setRoleList(state, { payload }){
      return { ...state, roleList: payload };
    }
  },
};
