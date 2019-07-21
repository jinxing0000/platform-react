import { getPageList,saveInfo,getInfoById,editInfo,deleteByIds } from '@/services/tourism/productPic';
import { message } from 'antd';

export default {
    namespace: 'productPic',
    state: {
        productPicList: {
            list: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 1,
            },
        },
        productPicInfo:{}
    },

    effects: {
        // 获取旅游产品图片信息表list
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
        //新增旅游产品图片信息表信息
        *saveInfo({ payload }, { call, put }){
            const result = yield call(saveInfo, payload);
            if(result.code===0){
                message.success("新增成功！！");
            }else{
                message.error(result.msg);
            }
            return result;
        },
        //修改旅游产品图片信息表信息
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
            return { ...state, productPicList: payload };
        },
        setInfo(state, { payload }){
            return { ...state, productPicInfo: payload?payload:{}};
        }
    },
};