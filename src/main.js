import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'amfe-flexible/index.js'
import store from './store'
import { NavBar, Field, Button, Cell, CellGroup, toast } from 'vant'
import './styles/index.less'
// 表单验证
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate' // 核心组件
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证中文语言包
import * as rules from 'vee-validate/dist/rules'// 验证规则

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}

// 注册为全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue
  .use(NavBar)
  .use(Field)
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(toast)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
