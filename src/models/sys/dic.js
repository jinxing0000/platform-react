import { getPageList,saveInfo,getInfoById,editInfo,deleteByIds } from '@/services/sys/dic';
import { message } from 'antd';

export default {
    namespace: 'dic',
    state: {
        dicList: {
            list: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 1,
            },
        },
        dicInfo:{}
    },

    effects: {
        // 获取数据字典表list
        *getPageList({ payload }, { call, put }) {
            const result = yield call(getPageList, payload);
            if(result.code===0){
                yield put({
                    type: 'updateList',
                    payload: {
                        list: result.data.list,
                        pagination: { current: result.data.currPage, total: result.data.totalCount, pageSize: result.data.pageSize },
                    },
                });
            }else{
                message.error(result.msg);
            }
        },
        //新增数据字典表信息
        *saveInfo({ payload }, { call, put }){
            const result = yield call(saveInfo, payload);
            if(result.code===0){
                message.success("新增成功！！");
            }else{
                message.error(result.msg);
            }
            return result;
        },
        //修改数据字典表信息
        *editInfo({ payload }, { call, put }){
            const result = yield call(editInfo, payload);
            if(result.code===0){
                message.success("修改成功！！");
            }else{
                message.error(result.msg);
            }
            return result;
        },
        *deleteByIds({ payload }, { call, put }){
            const result = yield call(deleteByIds, payload);
            if(result.code===0){
                message.success("删除成功！！");
            }else{
                message.error(result.msg);
            }
            return result;
        },
        *getInfoById({ payload }, { call, put }){
            const result = yield call(getInfoById, payload);
            if(result.code===0){
                yield put({
                    type: 'setInfo',
                    payload: result.data
                });
            }else{
                message.error(result.msg);
            }
        }
    },

    reducers: {
        updateList(state, { payload }) {
            return { ...state, dicList: payload };
        },
        setInfo(state, { payload }){
            return { ...state, dicInfo: payload?payload:{}};
        }
    },
};
