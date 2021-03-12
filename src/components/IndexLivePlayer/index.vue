<template>
  <div class="components IndexLivePlayer">
    <img src="" class="centerLabel cover Bg" alt="">
    <div class="LiverPlayerContainer" id="LiverPlayerContainer">
      <video v-if="Hls !== null" id="LiverPlayer" width="100%" height="100%" style="object-fit: contain;" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" muted>
        <source :src="Hls" type="application/x-mpegURL">
      </video>
    </div>
    <div class="PlayerLayer">
      <a class="centerLabel" :href="`./live.html?user=${LiveInfo.accountId}&room=${LiveInfo.id}`">Enter the live room</a>
    </div>
  </div>
</template>

<script>
/*
*/
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import 'videojs-flash'
import 'videojs-contrib-hls'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapMediaActions } = createNamespacedHelpers('media')
export default {
  name: 'IndexLivePlayer',
  props: ['data'],
  data () {
    return {
      LiveInfo: {},
      Hls: null,
      LivePlayer: null,
      PlayerOptions: {
        // headers: { 'DIY': '123', 'Referer': '*.heyporn.com/*' },
        autoplay: false, // 自动播放
        bigPlayButton: false, // 画中播放按钮
        posterImage: false, // 显隐封面图片
        controlBar: true, // 显隐控制条
        showPausedAdImg: false, // 显示暂停广告位
        fluid: false,
        muted: true,
        playbackRates: ['0.5', '1.0', '1.5', '2.0'] // 倍速播放设置
      }
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
  },
  created () {
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapMediaActions([
      'GetIndexLiveHls'
    ]),
    Init () {
      this.GetIndexLiveHls({ params: { streamType: 2 } }).then((res) => {
        this.Hls = res.data.data.hlsPlay
        this.LiveInfo = res.data.data || {}
        this.$nextTick(() => {
          this.LivePlayer = videojs('LiverPlayer', { ...this.PlayerOptions }, function () {
            document.getElementsByClassName('vjs-control-bar')[0].style.display = 'none'
          })
        })
      })
    },
    Play () {
      videojs('LiverPlayer').play()
    },
    Pause () {
      videojs('LiverPlayer').pause()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
