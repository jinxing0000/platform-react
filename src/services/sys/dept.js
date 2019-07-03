import request from '@/utils/request';

export async function getDeptTreeList() {
    return request(`/api/sys/dept/list`);
}


