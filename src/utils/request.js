/**
 * axios 请求相关操作封装到这来
 *
 */
import axios from 'axios'
import jsonBig from 'json-bigint'
// 在非组件模块中使用容器就直接加载即可
// 这里获取到的 store 和在组件中的this.$store 是一个东西
import store from '@/store'

// axios.create 方法返回一个请求对象， 这个请求对象的功能和axios的功能是一样的
// 也就是说我们复制了一个axios
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/'
})
/**
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */
request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {} // 换了一个转化方法 使得 计算更精确 保证id不失真
}]
/**
 * 请求拦截器，请求到ad后台之前拦截 */
request.interceptors.request.use(function (config) {
  // 在发起请求做一些业务处理
  // config是要发送请求的配置信息
  const user = store.state.user
  if (user) {
    // Authorization 是后端要求的名字 不能瞎写
    // 数据值 "Bearer空格token" 也是后端要求的数格式，不能瞎写
    // 注意 、、空格不能少
    config.headers['Authorization'] = `Bearer ${user.token}` // 统一注入token 到headers属性 因为所有要求接口要求的token格式是一样的
  }
  // 统一注入token 到headers属性 因为所有接口的要求
  return config
}, function (error) {
  return Promise.reject(error)
})
/**
 * 响应拦截器 */
// 导出这个请求对象，哪里需要发请求，哪里就加载使用
export default request
