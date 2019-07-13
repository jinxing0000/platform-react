import request from '@/utils/request';

export async function getJobLogList(params) {
  let paramsStr="";
  for (var index in params){
    if(typeof(params[index]) !== "undefined"){
      paramsStr+=index+"="+params[index]+"&";
    }
  }
  return request(`/api/sys/scheduleLog/list?`+paramsStr);
}