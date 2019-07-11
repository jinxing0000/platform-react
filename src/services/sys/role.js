import request from '@/utils/request';

export async function getRolePageList(params) {
    let paramsStr="";
    for (var index in params){
      if(typeof(params[index]) !== "undefined"){
        paramsStr+=index+"="+params[index]+"&";
      }
    }
    return request(`/api/sys/role/list?`+paramsStr);
}
export async function getRoleList(params) {
  let paramsStr="";
  for (var index in params){
    if(typeof(params[index]) !== "undefined"){
      paramsStr+=index+"="+params[index]+"&";
    }
  }
  return request(`/api/sys/role/list?`+paramsStr);
}
export async function saveRoleInfo(params) {
    return request(`/api/sys/role/save`,{
        method: 'POST',
        data: {
          ...params,
        },
      });
}
export async function editRoleInfo(params) {
    return request(`/api/sys/role/update`,{
        method: 'PUT',
        data: {
          ...params,
        },
      });
}
export async function deleteRoleByIds(params) {
    return request(`/api/sys/role/delete`,{
        method: 'DELETE',
        data: params,
      });
}
export async function getRoleInfoById(roleId) {
    return request(`/api/sys/role/info?roleId=${roleId}`);
}