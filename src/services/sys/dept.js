import request from '@/utils/request';

export async function getDeptTreeList() {
    return request(`/api/sys/dept/list`);
}

export async function saveDeptInfo(params) {
    return request(`/api/sys/dept/save`,{
        method: 'POST',
        data: {
          ...params,
        },
      });
}
export async function editDeptInfo(params) {
    return request(`/api/sys/dept/update`,{
        method: 'PUT',
        data: {
          ...params,
        },
      });
}
export async function deleteDeptById(deptId) {
    return request(`/api/sys/dept/delete?deptId=${deptId}`,{
        method: 'DELETE',
      });
}
export async function getDeptInfoById(deptId) {
  return request(`/api/sys/dept/info?deptId=${deptId}`);
}


