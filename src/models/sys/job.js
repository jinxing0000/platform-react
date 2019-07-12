import {getJobList,saveJobInfo,editJobInfo,deleteJobByIds,runJobByIds,pauseJobByIds,resumeJobByIds } from '@/services/sys/job';
import { message } from 'antd';

export default {
  namespace: 'job',

  state: {
    jobList: {
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
    // 获取定时任务
    *getJobList({ payload }, { call, put }) {
      const result = yield call(getJobList, payload);
      yield put({
          type: 'updateJobList',
          payload: {
            list: result.data.list,
            pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
          },
      });
  },
  //新增用户信息
  *saveJobInfo({ payload }, { call, put }){
    const result = yield call(saveJobInfo, payload);
    message.success("新增定时任务成功！！", 10);
  },
  *editJobInfo({ payload }, { call, put }){
    const result = yield call(editJobInfo, payload);
    message.success("修改定时任务成功！！", 10);
  },
  *deleteJobByIds({ payload }, { call, put }){
    const result = yield call(deleteJobByIds, payload);
    message.success("删除定时任务成功！！", 10);
  },
  *runJobByIds({ payload }, { call, put }){
    const result = yield call(runJobByIds, payload);
    message.success("定时任务执行成功！！", 10);
  },
  *pauseJobByIds({ payload }, { call, put }){
    const result = yield call(pauseJobByIds, payload);
    message.success("定时任务暂停成功！！", 10);
  },
  *resumeJobByIds({ payload }, { call, put }){
    const result = yield call(resumeJobByIds, payload);
    message.success("定时任务恢复成功！！", 10);
  },
  },

  reducers: {
    updateJobList(state, { payload }) {
      return { ...state, jobList: payload };
    },
  },
};