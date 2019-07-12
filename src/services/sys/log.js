import request from '@/utils/request';

export async function getLogList(params) {
  let paramsStr="";
  for (var index in params){
    if(typeof(params[index]) !== "undefined"){
      paramsStr+=index+"="+params[index]+"&";
    }
  }
  return request(`/api/sys/log/list?`+paramsStr);
}
