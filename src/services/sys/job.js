import request from '@/utils/request';

export async function getJobList(params) {
  let paramsStr="";
  for (var index in params){
    if(typeof(params[index]) !== "undefined"){
      paramsStr+=index+"="+params[index]+"&";
    }
  }
  return request(`/api/sys/schedule/list?`+paramsStr);
}
export async function saveJobInfo(params) {
  debugger;
  return request(`/api/sys/schedule/save`,{
      method: 'POST',
      data: {
        ...params,
      },
    });
}
export async function editJobInfo(params) {
  return request(`/api/sys/schedule/update`,{
      method: 'PUT',
      data: {
        ...params,
      },
    });
}
export async function deleteJobByIds(params) {
  return request(`/api/sys/schedule/delete`,{
      method: 'DELETE',
      data: params,
    });
}
export async function runJobByIds(params) {
    return request(`/api/sys/schedule/run`,{
        method: 'PUT',
        data: params,
      });
}
export async function pauseJobByIds(params) {
    return request(`/api/sys/schedule/pause`,{
        method: 'PUT',
        data: params,
      });
}
export async function resumeJobByIds(params) {
    return request(`/api/sys/schedule/resume`,{
        method: 'PUT',
        data: params,
      });
}