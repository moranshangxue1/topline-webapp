<template>
  <div class="search">
    <!-- 搜索框 -->
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
    >
    <div slot="action" @click="onSearch">搜索</div>
  </van-search>
  <!-- /搜索框 -->
  <!-- 联想建议 -->
  <van-cell-group>
    <van-cell title="单元格" icon="search" />
    <van-cell title="单元格" icon="search" />
  </van-cell-group>
    <!-- /联想建议 -->
  </div>
</template>

<script>
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: ''
    }
  },
  methods: {
    onSeaarch () {
      console.log('onSearch')
    }
  }
}
</script>

<style>

</style>
