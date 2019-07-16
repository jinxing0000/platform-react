import { getDeptTreeList,saveDeptInfo,editDeptInfo,deleteDeptById,getDeptInfoById } from '@/services/sys/dept';
import { message } from 'antd';

export default {
  namespace: 'dept',

  state: {
    deptTreeList: {
        list: [],
        pagination: {
          current: 1,
          total: 0,
          pageSize: 10, 
        },
    },
    deptInfo:{}
  },

  effects: {
    // 获取部门list
    *getDeptTreeList({ payload }, { call, put }) {
        const result = yield call(getDeptTreeList, payload);
        if(result.code===0){
          yield put({
            type: 'updateDeptTreeList',
            payload: {
              list: result.data,
              pagination: { current: 1, total: 3, pageSize: 10 },
            },
          });
        }else {
          message.error(result.msg);
        }
    },
    *saveDeptInfo({ payload }, { call, put }){
      const parentId=payload.parentId;
        if(parentId==null){
          payload.parentId="0";
        }
        const result = yield call(saveDeptInfo, payload);
        if(result.code===0){
          message.success('新增成功！！');
        }else{
          message.error(result.msg);
        }
        return result;
    },
    *editDeptInfo({ payload }, { call, put }){
      if(payload.parentId==='根部门'){
        payload.parentId="0";
      }
      const result = yield call(editDeptInfo, payload);
      if(result.code===0){
        message.success('修改成功！！');
      }else{
        message.error(result.msg);
      }
      return result;
    },
    *deleteDeptById({ payload }, { call, put }){
      const result = yield call(deleteDeptById, payload);
      if(result.code===0){
        message.success('删除成功！！');
      }else{
        message.error(result.msg);
      }
      return result;
    },
    *getDeptInfoById({ payload }, { call, put }){
      const result = yield call(getDeptInfoById, payload);
      yield put({
        type: 'setDeptInfo',
        payload: result.data,
    });
    }
  },

  reducers: {
    updateDeptTreeList(state, { payload }) {
        return { ...state, deptTreeList: payload };
    },
    setDeptInfo(state, { payload }){
      return { ...state, deptInfo: payload };
    }
  },
};
