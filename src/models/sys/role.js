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
        const result = yield call(getRoleList, payload);
        if(result.code===0){
          yield put({
            type: 'updateRoleList',
            payload: {
              list: result.data.list,
              pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
            },
          });
        }else{
          message.error(result.msg);
        }
    },
    *saveRoleInfo({ payload }, { call, put }){
      const parentId=payload.parentId;
      if(parentId==null){
        payload.parentId="0";
      }
      const result = yield call(saveRoleInfo, payload);
      if(result.code===0){
        message.success("新增成功！！");
      }else{
        message.error(result.msg);
      }
      return result;
    },
    *editRoleInfo({ payload }, { call, put }){
      const result = yield call(editRoleInfo, payload);
      if(result.code===0){
        message.success("修改成功！！");
      }else{
        message.error(result.msg);
      }
      return result;
    },
    *deleteRoleByIds({ payload }, { call, put }){
      const result = yield call(deleteRoleByIds, payload);
      if(result.code===0){
        message.success("删除成功！！");
      }else{
        message.error(result.msg);
      }
      return result;
    },
    *getRoleInfoById({ payload }, { call, put }){
        const result = yield call(getRoleInfoById, payload);
        if(result.code===0){
          yield put({
            type: 'setRoleInfo',
            payload: result.data
          });
          return result.data.menuIdList;
        }
    },
    //角色列表                          
    *getRoleList({ payload }, { call, put }){
      const result = yield call(getRoleList, payload);
      if(result.code===0){
        yield put({
          type: 'setRoleList',
          payload: result.data
        });
      }
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
