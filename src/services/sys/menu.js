import request from '@/utils/request';

export async function queryCurrent() {
    return request('/api/sys/menu/nav');
}
export async function getMenuTreeList() {
    return request('/api/sys/menu/list');
}
export async function saveMenuInfo(params) {
    return request(`/api/sys/menu/save`,{
        method: 'POST',
        data: {
          ...params,
        },
      });
}
export async function editMenuInfo(params) {
    return request(`/api/sys/menu/update`,{
        method: 'PUT',
        data: {
          ...params,
        },
      });
}
export async function deleteMenuById(menuId) {
    return request(`/api/sys/menu/delete?menuId=${menuId}`,{
        method: 'DELETE',
      });
}