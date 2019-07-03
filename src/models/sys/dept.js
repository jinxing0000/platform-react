import { getDeptTreeList } from '@/services/sys/dept';

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
  },

  effects: {
    // 获取部门list
    *getDeptTreeList({ payload }, { call, put }) {
        const list = yield call(getDeptTreeList, payload);
        debugger;
        yield put({
            type: 'updateDeptTreeList',
            payload: {
              list: list,
              pagination: { current: 1, total: 3, pageSize: 10 },
            },
        });
    },
  },

  reducers: {
    updateDeptTreeList(state, { payload }) {
        return { ...state, deptTreeList: payload };
    },
  },
};
