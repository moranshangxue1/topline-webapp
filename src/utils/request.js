/**
 * axios 请求相关操作封装到这来
 *
 */
import axios from 'axios'

// axios.create 方法返回一个请求对象， 这个请求对象的功能和axios的功能是一样的
// 也就是说我们复制了一个axios
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/'
})
/**
 * 请求拦截器 */

/**
 * 响应拦截器 */
// 导出这个请求对象，哪里需要发请求，哪里就加载使用
export default request
