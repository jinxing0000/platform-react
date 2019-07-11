import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/sys/user/sessionInfo');
}

export async function getUserList(params) {
  let paramsStr="";
  for (var index in params){
    if(typeof(params[index]) !== "undefined"){
      paramsStr+=index+"="+params[index]+"&";
    }
  }
  return request(`/api/sys/user/list?`+paramsStr);
}
export async function saveUserInfo(params) {
  debugger;
  return request(`/api/sys/user/save`,{
      method: 'POST',
      data: {
        ...params,
      },
    });
}
export async function editUserInfo(params) {
  return request(`/api/sys/user/update`,{
      method: 'PUT',
      data: {
        ...params,
      },
    });
}
export async function deleteUserByIds(params) {
  return request(`/api/sys/user/delete`,{
      method: 'DELETE',
      data: params,
    });
}
export async function getUserInfoById(roleId) {
  return request(`/api/sys/user/info?roleId=${roleId}`);
}
