import request from '@/utils/request';

export async function getPageList(params) {
    let paramsStr="";
    for (var index in params){
        if(typeof(params[index]) !== "undefined"){
            paramsStr+=index+"="+params[index]+"&";
        }
    }
    return request(`/api/sys/dic/getPageList?`+paramsStr);
}
export async function saveInfo(params) {
    return request(`/api/sys/dic/save`,{
        method: 'POST',
        data: {
            ...params,
        },
    });
}
export async function editInfo(params) {
    return request(`/api/sys/dic/update`,{
        method: 'PUT',
        data: {
            ...params,
        },
    });
}
export async function deleteByIds(params) {
    return request(`/api/sys/dic/delete`,{
        method: 'DELETE',
        data: params,
    });
}
export async function getInfoById(id) {
    return request(`/api/sys/dic/info?id=${id}`);
}
