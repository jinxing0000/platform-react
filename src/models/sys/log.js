import { getLogList } from '@/services/sys/log';
import { message } from 'antd';

export default {
  namespace: 'log',

  state: {
    logList: {
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
    *getLogList({ payload }, { call, put }) {
      const result = yield call(getLogList, payload);
      if(result.code===0){
        yield put({
          type: 'updateLogList',
          payload: {
            list: result.data.list,
            pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
          },
      });
      }else{
        message.error(result.msg);
      }
    },
  },

  reducers: {
    updateLogList(state, { payload }) {
      return { ...state, logList: payload };
    },
  },
};
