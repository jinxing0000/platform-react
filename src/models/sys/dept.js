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
        yield put({
            type: 'updateDeptTreeList',
            payload: {
              list: result.data,
              pagination: { current: 1, total: 3, pageSize: 10 },
            },
        });
    },
    *saveDeptInfo({ payload }, { call, put }){
      const parentId=payload.parentId;
      if(parentId==null){
        payload.parentId="0";
      }
      const result = yield call(saveDeptInfo, payload);
      message.success("新增部门成功！！", 10);
    },
    *editDeptInfo({ payload }, { call, put }){
      if(payload.parentId==='根部门'){
        payload.parentId="0";
      }
      const result = yield call(editDeptInfo, payload);
      message.success("修改部门成功！！", 10);
    },
    *deleteDeptById({ payload }, { call, put }){
      const result = yield call(deleteDeptById, payload);
      message.success("删除部门成功！！", 10);
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
