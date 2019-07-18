import request from '@/utils/request';

export async function getPageList(params) {
    let paramsStr="";
    for (var index in params){
        if(typeof(params[index]) !== "undefined"){
            paramsStr+=index+"="+params[index]+"&";
        }
    }
    return request(`/api/base/supplierInfo/getPageList?`+paramsStr);
}
export async function saveInfo(params) {
    return request(`/api/base/supplierInfo/save`,{
        method: 'POST',
        data: {
            ...params,
        },
    });
}
export async function editInfo(params) {
    return request(`/api/base/supplierInfo/update`,{
        method: 'PUT',
        data: {
            ...params,
        },
    });
}
export async function deleteByIds(params) {
    return request(`/api/base/supplierInfo/delete`,{
        method: 'DELETE',
        data: params,
    });
}
export async function disablingByIds(params) {
    return request(`/api/base/supplierInfo/disabling`,{
        method: 'PUT',
        data: params,
    });
}
export async function enablingByIds(params) {
    return request(`/api/base/supplierInfo/enabling`,{
        method: 'PUT',
        data: params,
    });
}
export async function getInfoById(id) {
    return request(`/api/base/supplierInfo/info?id=${id}`);
}
