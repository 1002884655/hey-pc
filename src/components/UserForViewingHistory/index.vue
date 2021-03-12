<template>
  <div class="components UserForViewingHistory">

    <!-- Play recently -->
    <div class="PlayRecently flex-h">
      <span class="flex-item">Play recently</span>
      <el-switch v-model="FilterFlower" active-color="#E2041B" inactive-color="#ccc"></el-switch>
      <span>Filter flower</span>
    </div>

    <!-- Play recently列表 -->
    <ul class="PlayRecentlyList" v-if="ViewingHistory.length">
      <li v-for="(item, index) in ViewingHistory" :key="index" v-if="!(item.Type - 0 === 1 && FilterFlower)">
        <a class="Img">
          <img :src="item.Img" class="centerLabel cover" alt="">
          <div class="Layer">
            <a class="iconfont iconbofang centerLabel" :href="`./video.html?key=${item.videoM}`" target="_self"></a>
            <i class="iconfont iconqingkong" @click="DeleteItem(item, index)"></i>
          </div>
        </a>
        <a class="Title" :href="`./video.html?key=${item.videoM}`" target="_self" :title="item.Name">{{item.Name}}</a>
      </li>
    </ul>

    <div class="NoData" v-else>
      <span>You have no recent viewing record.</span>
    </div>

    <!-- Earlier -->
    <div class="Earlier" v-if="EarlierViewingHistory.length">
      <span class="flex-item">Earlier</span>
    </div>

    <!-- Earlier列表 -->
    <ul class="EarlierList" v-if="EarlierViewingHistory.length">
      <li v-for="(item, index) in EarlierViewingHistory" :key="index" v-if="!(item.Type - 0 === 1 && FilterFlower)">
        <a class="Img">
          <img :src="item.Img" class="centerLabel cover" alt="">
          <div class="Layer">
            <a class="iconfont iconbofang centerLabel" :href="`./video.html?key=${item.videoM}`" target="_self"></a>
            <i class="iconfont iconqingkong" @click="DeleteItem(item, index)"></i>
          </div>
        </a>
        <a class="Title" :href="`./video.html?key=${item.videoM}`" target="_self" :title="item.Name">{{item.Name}}</a>
      </li>
    </ul>

    <div class="LoadMore" v-if="ViewingHistory.length || EarlierViewingHistory.length">
      <a v-if="HasNextPage" @click="GetList">{{DataLock ? 'Loading...' : 'Load More'}}</a>
      <span v-else>Load All</span>
    </div>

    <!-- Recommend -->
    <div class="Recommend" v-if="!ViewingHistory.length && !EarlierViewingHistory.length">
      <span class="flex-item">Recommend for you</span>
    </div>

    <!-- Recommend列表 -->
    <ul class="RecommendList" v-if="!ViewingHistory.length && !EarlierViewingHistory.length">
      <li v-for="(item, index) in VideoRecommendList" :key="index">
        <a class="Img" @mouseover="ShowIndex = index" @mouseout="ShowIndex = null" :href="`./video.html?key=${item.videoM}`" target="_self">
          <img :src="item.frontPath" class="centerLabel cover" alt="">
          <img v-if="item.videoPath !== null && ShowIndex === index" :src="`${item.gifPath}Image1/index.gif`" class="Gif centerLabel cover" alt="">
        </a>
        <a class="Title" :href="`./video.html?key=${item.videoM}`" target="_self" :title="item.title">{{item.title}}</a>
      </li>
    </ul>

  </div>
</template>

<script>
/*
  页面名称：用户中心-ViewingHistory组件
  创建人：许成祥
  创建时间：2020/01/07
  最近修改人：许成祥
  最近修改日期：2020/04/27
  备注： 无
*/
import { Switch } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapState: mapMediaState, mapActions: mapMediaActions } = createNamespacedHelpers('media')
export default {
  name: 'UserForViewingHistory',
  props: ['data'],
  data () {
    return {
      ShowIndex: null,
      FilterFlower: true, // 过滤片花开关
      PageData: {
        pageNum: 1,
        pageSize: 10
      },
      DataLock: false, // 数据锁
      HasNextPage: true // 是否有下一页
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo,
      ViewingHistory: x => x.ViewingHistory,
      EarlierViewingHistory: x => x.EarlierViewingHistory
    }),
    ...mapMediaState({
      VideoRecommendList: x => x.VideoRecommendList // 推荐视频列表
    })
  },
  components: {
    'el-switch': Switch
  },
  created () {
    this.ClearViewingHistory() // 清空页面播放历史数据
    this.GetList() // 获取播放历史数据
    this.GetVideoRecommend({ pageNum: 1, pageSize: 5 }) // 获取推荐列表
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetViewingHistory',
      'DeleteViewingHistory'
    ]),
    ...mapUserMutations([
      'ClearViewingHistory'
    ]),
    ...mapMediaActions([
      'GetVideoRecommend'
    ]),
    DeleteItem (item, index) { // 删除历史
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定（防多次触发）
        this.DeleteViewingHistory({
          params: {
            ids: item.Id
          }
        }).then((res) => {
          this.DataLock = false // 数据解锁
        }).catch(() => {
          this.DataLock = false // 数据解锁
        })
      }
    },
    GetList () { // 获取列表数据
      if (!this.DataLock && this.HasNextPage) {
        this.DataLock = true // 数据锁定（防多次触发）
        this.GetViewingHistory({ params: { ...this.PageData, accountId: this.UserInfo.id } }).then((res) => {
          if (res.data.code - 0 === 0) {
            this.HasNextPage = res.data.data.hasNextPage
            this.PageData.pageNum = this.HasNextPage ? this.PageData.pageNum + 1 : this.PageData.pageNum
          }
          this.DataLock = false // 数据解锁
        }).catch(() => {
          this.DataLock = false // 数据解锁
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
