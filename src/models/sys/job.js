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
  },

  effects: {
    // 获取定时任务
    *getJobList({ payload }, { call, put }) {
      const result = yield call(getJobList, payload);
      if(result.code===0){
        yield put({
          type: 'updateJobList',
          payload: {
            list: result.data.list,
            pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
          },
        });
      }else{
        message.error(result.msg);
      }
  },
  //新增定时任务信息
  *saveJobInfo({ payload }, { call, put }){
    const result = yield call(saveJobInfo, payload);
    if(result.code===0){
      message.success("新增成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  //修改定时任务信息
  *editJobInfo({ payload }, { call, put }){
    const result = yield call(editJobInfo, payload);
    if(result.code===0){
      message.success("修改成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  *deleteJobByIds({ payload }, { call, put }){
    const result = yield call(deleteJobByIds, payload);
    if(result.code===0){
      message.success("删除成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  *runJobByIds({ payload }, { call, put }){
    const result = yield call(runJobByIds, payload);
    if(result.code===0){
      message.success("定时任务执行成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  *pauseJobByIds({ payload }, { call, put }){
    const result = yield call(pauseJobByIds, payload);
    if(result.code===0){
      message.success("定时任务暂停成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  *resumeJobByIds({ payload }, { call, put }){
    const result = yield call(resumeJobByIds, payload);
    if(result.code===0){
      message.success("定时任务恢复成功！！");
    }else{
      message.error(result.msg);
    }
    return result;
  },
  },

  reducers: {
    updateJobList(state, { payload }) {
      return { ...state, jobList: payload };
    },
  },
};