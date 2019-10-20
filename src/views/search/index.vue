<template>
  <div class="search">
    <!-- 搜索框 -->
    <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
      @input="onSearchInput"
    >
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell
        icon="search"
        v-for="(item, index) in searchSuggestions"
        :key="index"
      >
       <div v-html="item" slot="title"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      searchSuggestions: [] // 联想建议列表
    }
  },

  methods: {
    onSearch () {
      console.log('onSearch')
    },

    async onSearchInput () {
      const searchText = this.searchText.trim()
      if (!searchText) {
        return
      }

      const { data } = await getSearchSuggestions({
        q: this.searchText
      })

      const searchSuggestions = data.data.options

      // 根据一个字符串创建一个正则表达式对象
      const reg = new RegExp(searchText, 'g')

      searchSuggestions.forEach((item, index) => {
        searchSuggestions[index] = item.replace(reg, '<span style="color: red">' + searchText + '</span>')
      })

      this.searchSuggestions = searchSuggestions
    }
  }
}
</script>

<style>

</style>
