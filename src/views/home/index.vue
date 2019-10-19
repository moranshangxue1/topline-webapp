<template>
  <div class="home">
      <!-- 导航栏 -->
    <van-nav-bar
        title="首页"
        fixed
    />
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <van-tabs v-model="active" animated swipeable>
        <van-tab
            :title="channel.name"
            v-for="channel in channels"
            :key="channel.id"
        >
        <!-- 下拉刷新
        v-model="isLoade" 控制下拉刷新的loading状态
        @refresh 下拉刷新的时候回触发的事件
        -->

        <van-pull-refresh v-model="channel.isPullDownloading" @refresh="onRefresh">
              <!-- 文章列表 -->
            <!-- loading 控制上拉加载更多的loading效果
            finished 控制是否已加载结束
            finished-text 加载结束的提示文本
            @load="onLoad" 上拉加载更多触发事件
            列表组件会在初始化的时候自动触发 load事件从而调用onLoad方法
             -->
            <van-list
                v-model="channel.loading"
                :finished="channel.finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
            <!-- 具体内容 -->
                <van-cell
                  v-for="(article,index) in channel.articles"
                  :key="index"
                  :title="article.title"
                >
                <div slot="label">
                    <van-grid :border="false" :column-num="3">
                      <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                        <van-image
                          width="100"
                          height="100"
                          lazy-load
                          src="https://img.yzcdn.cn/vant/cat.jpeg"
                        />
                      </van-grid-item>
                    </van-grid>
                    <div class="article-info">
                      <div class="meta">
                        <span>{{ article.aut_name }}</span>
                        <span>{{ article.comm_count }}评论</span>
                        <span>{{ article.pubdate | relativeTime }}</span>
                      </div>      <van-icon name="close" />
                    </div>
                  </div>
                </van-cell>
            </van-list>
            <!-- /文章列表 -->
        </van-pull-refresh>
        </van-tab>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 频道管理 -->
    <van-popup
      v-model="isChannelShow"
      round
      position="bottom"
      :style="{ height: '95%' }"
      closeable
      close-icon-position="top-left"
    >
    <div class="channel-container">
      <van-cell title="我的频道" :border="false">
        <van-button type="danger" size="mini">编辑</van-button>
      </van-cell>
      <van-grid :gutter="10">
        <van-grid-item
          v-for="(channel,index) in channels"
          :key="index"
          :text="channel.name"
        />
      </van-grid>
      <van-cell title="推荐频道" :border="false" />
      <van-grid :gutter="10">
        <van-grid-item
          v-for="value in 8"
          :key="value"
          text="文字"
        />
      </van-grid>
    </div>
    </van-popup>
    <!-- /频道管理 -->
  </div>
</template>

<script>
import { getDefaultChannels, getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      list: [],
      loading: false,
      finished: false,
      channels: [], // 我的频道列表
      isChannelShow: true, // 频道管理
      allChannels: [] // 所有的频道列表数据
    }
  },
  created () {
    // 获取我的频道
    this.loadChannels()
    // 获取所有频道
    this.loadAllChannels()
  },
  methods: {
    // 上拉加载更多
    async onLoad () {
      const activeChannel = this.channels[this.active]
      // 1.请求获取数据
      const { data } = await getArticles({
        // 注意：channel_id、timestamp、with_top 都是后端要求指定的数据字段名称，不能随便写
        channel_id: activeChannel.id, // 频道id
        // a: 3 b: 2
        // 4    3
        // 这里的这个时间戳就好比当前频道下一页的页码
        timestamp: activeChannel.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // 2.将数据添加到当前频道 .articles中
      // activeChannel.articles = activeChannel.articles.concat(data.data.results)
      activeChannel.articles.push(...data.data.results)
      // 3.结束当前频道 .load = false
      activeChannel.loading = false
      // 4.判断是否还有数据
      if (data.data.pre_timestamp) {
        // 更新获取下一页数据的页码时间戳
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        // 如过没有下一页数据了，就意味着后面没有数据了
        activeChannel.finished = true
      }
    },
    // onLoad () {
    //   // 当前激活的频道对象
    //   const activeChannel = this.channels[this.active]
    //   // 异步更新数据
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       activeChannel.articles.push(activeChannel.articles.length + 1)
    //     }
    //     // 加载状态结束
    //     // 每次数据加载完毕，列表组件都会判断数据是否满足一屏了
    //     // 如果当前数据不满足一屏，它就继续onLoad
    //     // 本次不终止，它不会继续加载更多
    //     activeChannel.loading = false

    //     // 数据全部加载完成
    //     if (activeChannel.articles.length >= 40) {
    //       activeChannel.articles.finished = true
    //     }
    //   }, 500)
    // },
    // 2. 加载我的频道列表
    async loadChannels () {
      const { data } = await getDefaultChannels()
      const channels = data.data.channels
      // this.channels = data.data.channels
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多的 loading 状态
        channel.timestamp = null // 存储获取频道下一页的时间戳
        channel.isPullDownloading = false // 存储频道的下拉刷新loading状态
      })
      this.channels = channels
    },
    // 下拉刷新
    async onRefresh () {
      // 获取当期激活的频道对象
      const activeChannel = this.channels[this.active]

      // 1. 请求获取最新推荐的文章列表
      const { data } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(), // 下拉刷新永远都是在获取最新推荐的文章列表，所以传递当前最新时间戳
        with_top: 1
      })

      // 2. 将数据添加到文章列表顶部
      activeChannel.articles.unshift(...data.data.results)

      // 3. 关闭下拉刷新的 loading 状态
      activeChannel.isPullDownLoading = false

      // 4. 提示
      this.$toast('刷新成功')
    },
    //  获取所有频道
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    }
  }
}
</script>

<style lang="less" scoped>
  .home {
    .article-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .meta span {
      margin-right: 10px;
    }
  }
    .van-tabs /deep/ .van-tabs__wrap--scrollable {
    position: fixed;
    top: 46px;
    left: 0;
    right: 16px;
    z-index: 2;
    right: 15px;
    }
    /deep/ .van-tabs__content {
    margin-top: 90px;
  }
  }
  .channel-container {
    padding-top: 30px;
  }
</style>
