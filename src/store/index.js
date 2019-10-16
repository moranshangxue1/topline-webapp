import Vue from 'vue'
import Vuex from 'vuex'
import { getItem } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储用户相关信息 （包括token）
    user: getItem('user')
    // user: null
  },
  mutations: {
    // 参数1：默认参数state
    // 参数2：默认参数
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {

  }
})
