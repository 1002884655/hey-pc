<template>
  <div class="components VideoPlayerList">
    <div class="flex-h">
      <span class="flex-item">{{Title}} · {{List.length}} videos</span>
      <a class="iconfont" :class="{'iconvideo-xunhuanbofang': PlayerType === 1, 'iconsuijibofang-2': PlayerType === 2, 'icondangexunhuanbofang': PlayerType === 3}" @click="CutType"></a>
    </div>
    <div class="SwiperContainer">
      <a class="Left WatchLaterSwiperLeft">
        <i class="iconfont iconjiantouleft centerLabel"></i>
      </a>
      <a class="Right WatchLaterSwiperRight">
        <i class=" iconfont iconjiantouright centerLabel"></i>
      </a>
      <div class="Swiper">
        <swiper :options="options" ref="WatchLaterSwiper">
          <swiper-slide v-for="(item, index) in List" :key="index" :class="{'active': ActiveIndex === index}">
            <div class="Img" @mouseover="ShowIndex = index" @mouseout="ShowIndex = null">
              <a @click="CutItem(item, index)">
                <img :src="item.frontPath ? item.frontPath : item.front" class="centerLabel cover" alt="">
                <img v-if="item.videoPath !== null && ShowIndex === index" :src="`${item.gifPath}Image1/index.gif`" class="centerLabel cover Gif" alt="">
                <span v-if="item.capacity">{{JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}} {{ToolClass.DateFormat(item.length)}}</span>
              </a>
            </div>
            <a @click="CutItem(item, index)">{{item.title}}</a>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
/*
  页面名称：播单组件
  创建人：许成祥
  创建时间：2020/05/20
  最近修改人：许成祥
  最近修改日期：2020/05/20
  备注： 无
*/
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'VideoPlayerList',
  props: {
    List: { // 列表
      default: () => {
        return []
      },
      type: Array
    },
    Title: {
      default: 'Player list',
      type: String
    }
  },
  data () {
    return {
      ActiveIndex: null, // 选中索引值
      ShowIndex: null, // 当前显示gif索引值
      PlayerType: 1, // 播放模式： 1-顺序播放 2-随机播放 3-循环单集播放
      PlayerInitArr: [], // 原始播放数组
      PlayerRandomArr: [], // 随机播放数组
      RandomIndex: null, // 随机数组索引值
      options: {
        slidesPerView: 9,
        slidesPerGroup: 9,
        spaceBetween: 10,
        initialSlide: null,
        navigation: {
          nextEl: `.WatchLaterSwiperRight`,
          prevEl: `.WatchLaterSwiperLeft`
        }
      }
    }
  },
  computed: {
    WatchLaterSwiper () {
      return this.$refs.WatchLaterSwiper.swiper
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  created () {
    this.List.map((item, index) => {
      if (item.videoM === this.ToolClass.GetUrlParams('key')) {
        this.ActiveIndex = index
        this.options.initialSlide = index
      }
    })
    this.PlayerInitArr = this.List.slice(0) // 构建原始播放数组
    this.PlayerRandomArr = this.List.slice(0)
    this.PlayerRandomArr.sort(() => { // 构建随机播放数组
      return 0.5 - Math.random()
    })
    this.CheckRandomIndex()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    CutType () { // 切换播放顺序
      this.PlayerType = this.PlayerType === 1 ? 2 : this.PlayerType === 2 ? 3 : 1
    },
    CutItem (item, index) { // 点击切换视频
      this.ActiveIndex = index
      history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'key', item.videoM))
      this.CheckRandomIndex()
      this.$emit('Change', item.videoId)
    },
    CheckRandomIndex () { // 检测随机数组索引值
      let Id = this.ToolClass.GetUrlParams('key')
      this.PlayerRandomArr.map((item, index) => {
        if (item.videoM === Id) {
          this.RandomIndex = index
        }
      })
    },
    CheckInitIndex () { // 检测原始数组索引值
      let Id = this.ToolClass.GetUrlParams('key')
      this.PlayerInitArr.map((item, index) => {
        if (item.videoM === Id) {
          this.ActiveIndex = index
        }
      })
    },
    Next () { // 下一个
      if (this.PlayerType === 1 || this.PlayerType === 3) { // 顺序播放 or 单集循环播放
        this.ActiveIndex = this.ActiveIndex < this.List.length - 1 ? this.ActiveIndex + 1 : 0
        history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'key', this.PlayerInitArr[this.ActiveIndex].videoM))
        this.CheckRandomIndex()
        this.WatchLaterSwiper.slideTo(this.ActiveIndex, 300, false)
      } else if (this.PlayerType === 2) { // 随机播放
        this.RandomIndex = this.RandomIndex < this.PlayerRandomArr.length - 1 ? this.RandomIndex + 1 : 0
        history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'key', this.PlayerRandomArr[this.RandomIndex].videoM))
        this.CheckInitIndex()
        this.WatchLaterSwiper.slideTo(this.ActiveIndex, 300, false)
      }
      this.$emit('Change', this.PlayerInitArr[this.ActiveIndex].videoM)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
