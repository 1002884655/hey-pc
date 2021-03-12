<template>
  <div class="components IndexBanner">

    <!-- 播放器 -->
    <div class="BannerPlayer">
      <img src="../../assets/img/indexlivebg.jpg" class="centerLabel cover Bg" alt="">
      <div :style="{width: PlayerType === 'live' && LiveType - 0 === 1 ? `${LiveWidth}px` : '100%'}">
        <video v-if="BannerArr.length" style="object-fit: cover;" id="IndexBannerVideo" class="video-js vjs-default-skin vjs-big-play-centered" preload="auto" muted>
          <source :src="BannerArr[ActiveIndex]" type="application/x-mpegURL">
        </video>
        <div v-if="PlayerType === 'live' && LiveType - 0 === 1" class="PlayerLayer">
          <div><img src="../../assets/img/playerlayer.png" class="centerLabel cover" alt=""></div>
          <div><img src="../../assets/img/playerlayer-right.png" class="centerLabel cover" alt=""></div>
        </div>
      </div>
    </div>

    <!-- 焦点标题 -->
    <div class="BannerTitle" v-if="PlayerType !== 'live'">
      <span class="Title">{{list[ActiveIndex].title}}</span>
      <span class="Desc">{{list[ActiveIndex].description}}</span>
      <div>
        <a :href="`./video.html?key=${list[ActiveIndex].videoM}`"><i class="iconfont iconbofang"></i><span>Play</span></a>
        <a @click="CollectVideo(list[ActiveIndex].videoId)"><i class="iconfont iconjia"></i><span>Collect</span></a>
      </div>
    </div>

    <!-- 焦点图 -->
    <ul class="BannerFocusPic">
      <li v-for="(item, index) in PageList" :key="index" :class="{'active': ActiveIndex === index}" @click="CutBanner(index, item.type)">
        <a>
          <img :src="item.frontPath" class="centerLabel cover" alt="">
        </a>
      </li>
    </ul>

  </div>
</template>

<script>
/*
  页面名称：首页banner
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2020/05/12
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import 'videojs-flash'
import 'videojs-contrib-hls'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
const { mapActions: mapMediaActions } = createNamespacedHelpers('media')
export default {
  name: 'IndexBanner',
  props: ['list', 'NetSpeed'],
  data () {
    return {
      LiveType: null,
      LiveWidth: document.body.clientHeight * 9 / 16,
      PlayerType: 'live',
      DataLock: false, // 数据请求状态锁
      VideoJs: null, // videojs实例对象初始化
      PageList: [],
      BannerArr: [], // banner数据
      ActiveIndex: 0 // 当前索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    })
  },
  components: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.Init()
    })
  },
  methods: {
    ...mapUserActions([
      'AddCollect'
    ]),
    ...mapMediaActions([
      'GetIndexLiveHls'
    ]),
    Init () { // 初始化（匹配最佳适配清晰度视频轮播地址）
      let WindowResize = window.onresize
      window.onresize = () => {
        WindowResize()
        this.LiveWidth = document.body.clientHeight * 9 / 16
      }
      this.PageList = []
      this.list.map((item) => {
        this.PageList.push({ ...item, type: 'video' })
      })
      this.GetIndexLiveHls({ params: { streamType: 2 } }).then((res) => {
        if (res.data.code - 0 === 0) {
          this.LiveType = res.data.data.screenType - 0
          this.PageList.unshift({ ...res.data.data, type: 'live', capacity: '{}', frontPath: res.data.data.sourcePath })
        }
        let Arr = []
        this.PageList.map((item, index) => {
          if (item.type === 'video') {
            Arr.push(`${item.videoPath}/${item.link}/${this.ToolClass.MatchingCapacity(JSON.parse(item.capacity), this.NetSpeed)}/${item.playName}.m3u8`)
          } else {
            Arr.push(item.hlsPlay)
          }
        })
        this.BannerArr = Arr || []
        this.PlayerType = this.PageList[0].type
        this.$nextTick(() => {
          this.VideoJsInit() // videojs初始化
        })
      })
    },
    VideoJsInit () { // videojs初始化
      let _that = this
      this.VideoJs = videojs('IndexBannerVideo', {
        autoplay: true,
        bigPlayButton: false,
        posterImage: false,
        controlBar: false,
        muted: true
      }, function () {
        this.on('ended', function () {
          _that.ActiveIndex = _that.ActiveIndex + 1 < _that.BannerArr.length ? _that.ActiveIndex + 1 : 0
          _that.VideoJs.off('timeupdate') // 移除timeupdate事件
          _that.PlayerType = _that.PageList[_that.ActiveIndex].type
          _that.VideoJs.src([{ type: 'application/x-mpegURL', src: _that.BannerArr[_that.ActiveIndex] }])
          // _that.VideoJs.play()
        })
        this.on('error', function () {
          console.log(`liver error`)
          // if (_that.PageList[_that.ActiveIndex].type === 'live') {
          //   this.GetIndexLiveHls({ params: { streamType: 2 } }).then((res) => {
          //     if (res.data.code - 0 === 0) {
          //       _that.BannerArr[0] = res.data.data.hlsPlay
          //       this.play()
          //     }
          //   })
          // }
        })
        this.on('abort', function () {
          console.log(`liver abort`)
        })
      })
    },
    Play () {
      videojs('IndexBannerVideo').play()
    },
    Pause () {
      videojs('IndexBannerVideo').pause()
    },
    CutBanner (index, type) { // 切换banner
      this.PlayerType = type
      this.ActiveIndex = index
      this.VideoJs.off('timeupdate') // 移除timeupdate事件
      this.VideoJs.src([{ type: 'application/x-mpegURL', src: this.BannerArr[this.ActiveIndex] }])
      this.VideoJs.play()
    },
    CollectVideo (id) { // 收藏视频
      if (this.UserInfo !== null) { // 用户已登录
        this.$emit('CollectVideo', id)
      } else { // 用户未登录
        this.$emit('NeedLogin')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
