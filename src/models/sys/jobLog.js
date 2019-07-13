import { getJobLogList } from '@/services/sys/jobLog';
import { message } from 'antd';

export default {
  namespace: 'jobLog',

  state: {
    jobLogList: {
      list: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 1, 
      },
    },
  },

  effects: {
    // 获取日志list
    *getJobLogList({ payload }, { call, put }) {
      const result = yield call(getJobLogList, payload);
      yield put({
          type: 'updateJobLogList',
          payload: {
            list: result.data.list,
            pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
          },
      });
    },
  },

  reducers: {
    updateJobLogList(state, { payload }) {
      return { ...state, jobLogList: payload };
    },
  },
};
