<template>
  <div class="components ErrorPage">

    <!-- 404 -->
    <div class="Error flex-h">

      <!-- 404code -->
      <div class="flex-item">
        <span>404</span>
        <span>Sorry, this video is gone…</span>
      </div>

      <!-- 推荐视频 -->
      <div class="RecommendVideo" v-if="VideoRecommendList.length">
        <span>Recommend Video</span>
        <a :href="`./video.html?key=${VideoRecommendList[0].videoM}`">
          <img :src="VideoRecommendList[0].frontPath" class="centerLabel cover" alt="">
          <img v-if="VideoRecommendList[0].videoPath !== null" :src="`${VideoRecommendList[0].gifPath}Image1/index.gif`" class="centerLabel cover Gif" alt="">
          <i class="iconfont iconbofang centerLabel" v-if="VideoRecommendList[0].videoPath === null"></i>
        </a>
        <div>
          <a :href="`./index.html`">Back homepage</a>
          <a @click="Feedback">Feedback</a>
        </div>
      </div>
    </div>

    <!-- 热门视频列表 -->
    <div class="PopVideoList" v-if="HotVideoListForDay.length">
      <span>Pop Video</span>
      <ul>
        <li v-for="(item, index) in HotVideoListForDay.slice(0, 6)" :key="index">
          <a class="Img" :href="`./video.html?key=${item.videoM}`">
            <img :src="item.frontPath" class="centerLabel cover" alt="">
            <img v-if="item.videoPath !== null" :src="`${item.gifPath}Image1/index.gif`" class="centerLabel cover Gif" alt="">
            <i class="iconfont iconbofang centerLabel" v-if="item.videoPath === null"></i>
          </a>
          <a class="Title" :href="`./video.html?key=${item.videoM}`" :title="item.title">{{item.title}}</a>
          <div class="flex-h">
            <span class="flex-item">{{ToolClass.ReturnViews(item.displayNum)}} views</span>
            <span>{{item.scoreStr}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/*
  页面名称：404页面
  创建人：许成祥
  创建时间：2020/03/10
  最近修改人：许成祥
  最近修改日期：2020/04/03
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapMediaState, mapActions: mapMediaActions } = createNamespacedHelpers('media')
export default {
  name: 'ErrorPage',
  props: ['data'],
  data () {
    return {
    }
  },
  computed: {
    ...mapMediaState({
      VideoRecommendList: x => x.VideoRecommendList, // 推荐视频列表
      HotVideoListForDay: x => x.HotVideoListForDay // 热门视频列表
    })
  },
  components: {
  },
  created () {
    this.GetVideoRecommend({ pageNum: 1, pageSize: 1 })
    this.GetHotVideoListForDay({ limit: 6 })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapMediaActions([
      'GetVideoRecommend',
      'GetHotVideoListForDay'
    ]),
    Feedback () { // 返回上一页
      window.history.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
