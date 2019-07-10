import request from '@/utils/request';

export async function getRoleList({page,limit}) {
    debugger;
    return request(`/api/sys/role/list?page=${page}&limit=${limit}`);
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