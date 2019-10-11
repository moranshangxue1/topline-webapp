<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

import request from '@/utils/request'
request({
  method: 'GET',
  url: '/app/v1_0/channels'
}).then(res => {
  console.log(res)
})
export default {
  name: 'App'
}
</script>

<style>

</style>
