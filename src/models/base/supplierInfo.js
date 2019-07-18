import { getPageList,saveInfo,getInfoById,editInfo,deleteByIds,disablingByIds,enablingByIds } from '@/services/base/supplierInfo';
import { message } from 'antd';

export default {
    namespace: 'supplierInfo',
    state: {
        supplierInfoList: {
            list: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 1,
            },
        },
        supplierInfoInfo:{}
    },

    effects: {
        // 获取供应商信息表list
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
        //新增供应商信息表信息
        *saveInfo({ payload }, { call, put }){
            const result = yield call(saveInfo, payload);
            if(result.code===0){
                message.success("新增成功！！供应商登陆用户密码均为联系人手机号码！！");
            }else{
                message.error(result.msg);
            }
            return result;
        },
        //修改供应商信息表信息
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
        *disablingByIds({ payload }, { call, put }){
            const result = yield call(disablingByIds, payload);
            if(result.code===0){
                message.success("供应商禁用成功！！");
            }else{
                message.error(result.msg);
            }
            return result;
        },
        *enablingByIds({ payload }, { call, put }){
            const result = yield call(enablingByIds, payload);
            if(result.code===0){
                message.success("供应商启用成功！！");
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
            return { ...state, supplierInfoList: payload };
        },
        setInfo(state, { payload }){
            return { ...state, supplierInfoInfo: payload?payload:{}};
        }
    },
};
