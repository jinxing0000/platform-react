import request from '@/utils/request';

export async function getPageList(params) {
    let paramsStr="";
    for (var index in params){
        if(typeof(params[index]) !== "undefined"){
            paramsStr+=index+"="+params[index]+"&";
        }
    }
    return request(`/api/tourism/productInfo/getPageList?`+paramsStr);
}
export async function saveInfo(params) {
    return request(`/api/tourism/productInfo/save`,{
        method: 'POST',
        data: {
            ...params,
        },
    });
}
export async function editInfo(params) {
    return request(`/api/tourism/productInfo/update`,{
        method: 'PUT',
        data: {
            ...params,
        },
    });
}
export async function deleteByIds(params) {
    return request(`/api/tourism/productInfo/delete`,{
        method: 'DELETE',
        data: params,
    });
}
export async function getInfoById(id) {
    return request(`/api/tourism/productInfo/info?id=${id}`);
}
