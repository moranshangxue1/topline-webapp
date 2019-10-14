
// 1.接口重用
// 2.接口维护
// 用户接口请求模块
import request from '@/utils/request'

/** 登录 */
export function login (user) {
  return request({
    // method 用来请求方法，这是axios 的固定API 不能瞎写
    method: 'POST',
    // url 用来指定请求路径
    url: '/app/v1_0/authorizations',
    // // data 是 axios 请求要求的字段名，用来传请求体数据的
    data: user
  })
}
