<template>
  <div class="components ProvedVideoPlayer">
    <video style="object-fit: contain;" id="ProvedVideo" class="video-js vjs-default-skin vjs-big-play-centered" preload="auto" muted>
      <source :src="Src" type="application/x-mpegURL">
    </video>
  </div>
</template>

<script>
/*
*/
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import 'videojs-flash'
import 'videojs-contrib-hls'
export default {
  name: 'ProvedVideoPlayer',
  props: {
    Src: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      VideoJs: null // videojs实例对象初始化
    }
  },
  computed: {
  },
  components: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.VideoJsInit()
    })
  },
  methods: {
    VideoJsInit () { // videojs初始化
      this.VideoJs = videojs('ProvedVideo', {
        autoplay: true,
        bigPlayButton: false,
        posterImage: false,
        controlBar: false,
        muted: true,
        loop: true
      }, function () { })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
