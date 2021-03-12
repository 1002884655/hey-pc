<template>
  <div class="components BigImgList">
    <div class="flex-h">
      <div class="flex-item flex-v">
        <!-- 展示区 -->
        <div class="flex-item" ref="MediaShowArea">
          <!-- <a class="iconfont " :class="{'iconquanping--': !IsFullScreen, 'iconsuoxiao': IsFullScreen}" @click="CutFullScreen"></a> -->
          <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
          <div ref="FullPopupShowArea" class="ShowArea">

            <!-- 测试图片尺寸 -->
            <img v-if="Type === 'Photo' && !ImgIsReady" class="TestSizeImg" :src="List[CurrentIndex].src" @load="TestSizeImgOnload" alt="">

            <!-- 实际展示图片 -->
            <img v-if="Type === 'Photo' && ImgIsReady" :src="List[CurrentIndex].src" class="centerLabel" :class="{'contain': ImgIsBigger}" alt="">

            <!-- 上一个 -->
            <a class="Prev iconfont iconjiantouleft" @click="PrevMedia"></a>

            <!-- 下一个 -->
            <a class="Next iconfont iconjiantouright" @click="NextMedia"></a>
          </div>
        </div>

        <!-- 预览列表 -->
        <div class="PreviewList">
          <swiper :options="options" ref="FullPopupSwiper">
            <swiper-slide v-for="(item, index) in List" :key="index">
              <div :class="{'active': CurrentIndex === index}">
                <a @click="CutSwiper(index)">
                  <div v-if="CurrentIndex !== index"></div>
                  <img :src="item.src" class="centerLabel contain" alt="">
                </a>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
  页面名称：社区页面-全窗口展示弹窗
  创建人：许成祥
  创建时间：2020/04/02
  最近修改人：许成祥
  最近修改日期：2020/04/02
  备注： 无
*/
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'BigImgList',
  props: {
    Type: { // 展示类型：Photo-图片集 Video-视频集
      default: 'Photo',
      type: String
    },
    List: { // 数据列表
      default: () => {
        return [
          { src: 'http://t7.baidu.com/it/u=3616242789,1098670747&fm=79&app=86&f=JPEG?w=900&h=1350', id: '1' },
          { src: 'http://b-ssl.duitang.com/uploads/item/201608/18/20160818235812_PysQ8.png', id: 'a' },
          { src: 'http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853', id: '2' },
          { src: 'http://t7.baidu.com/it/u=2046080325,1937962445&fm=79&app=86&f=JPEG?w=1280&h=854', id: '3' },
          { src: 'http://t9.baidu.com/it/u=1191830543,2058173977&fm=79&app=86&f=JPEG?w=1280&h=1920', id: '4' },
          { src: 'http://t9.baidu.com/it/u=2236363868,3488383685&fm=79&app=86&f=JPEG?w=1280&h=1775', id: '5' },
          { src: 'http://t7.baidu.com/it/u=1079087352,3259825475&fm=79&app=86&f=JPEG?w=1280&h=1725', id: '6' },
          { src: 'http://pic1.win4000.com/wallpaper/b/55597435bb036.jpg', id: '7' },
          { src: 'http://attach.bbs.miui.com/forum/201111/21/205700txzuacubbcy91u99.jpg', id: '8' }
        ]
      },
      type: Array
    },
    ActiveIndex: { // 查看索引值
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      IsFullScreen: false, // 是否全屏模式
      CurrentIndex: this.ActiveIndex,
      ShowAreaWidth: 0,
      ShowAreaHeight: 0,
      ImgIsBigger: false,
      ImgIsReady: false,
      options: {
        slidesPerView: 8,
        centeredSlides: true,
        spaceBetween: 10
      }
    }
  },
  computed: {
    FullPopupSwiper () {
      return this.$refs.FullPopupSwiper.swiper
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.ShowAreaWidth = this.$refs.FullPopupShowArea.getBoundingClientRect().width
      this.ShowAreaHeight = this.$refs.FullPopupShowArea.getBoundingClientRect().height
      this.FullPopupSwiper.slideTo(this.ActiveIndex, 300, false)
    })
  },
  methods: {
    TestSizeImgOnload () { // 测试图片加载完成
      let ImgWidth = document.getElementsByClassName('TestSizeImg')[0].getBoundingClientRect().width
      let ImgHeight = document.getElementsByClassName('TestSizeImg')[0].getBoundingClientRect().height
      if (this.ShowAreaWidth < ImgWidth || this.ShowAreaHeight < ImgHeight) {
        this.ImgIsBigger = true
      }
      this.ImgIsReady = true
    },
    PrevMedia () { // 上一个媒体文件
      if (this.Type === 'Photo') { // 上一张图片
        if (this.CurrentIndex > 0) {
          this.ImgIsReady = false
          this.ImgIsBigger = false
          this.CurrentIndex -= 1
          this.FullPopupSwiper.slideTo(this.CurrentIndex, 300, false)
        }
      } else { // 上一个视频

      }
    },
    NextMedia () { // 下一个媒体文件
      if (this.Type === 'Photo') { // 下一张图片
        if (this.CurrentIndex < this.List.length - 1) {
          this.ImgIsReady = false
          this.ImgIsBigger = false
          this.CurrentIndex += 1
          this.FullPopupSwiper.slideTo(this.CurrentIndex, 300, false)
        }
      } else { // 下一个视频

      }
    },
    CutSwiper (index) { // 切换
      this.ImgIsReady = false
      this.ImgIsBigger = false
      this.CurrentIndex = index
      this.FullPopupSwiper.slideTo(index, 300, false)
    },
    CutFullScreen () { // 切换全屏
      if (this.Type === 'Photo') { // 图片切换全屏
        this.FullScreen(this.$refs.MediaShowArea)
      } else { // 视频切换全屏

      }
    },
    FullScreen (el) {
      this.IsFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
      if (!this.IsFullScreen) { // 进入全屏,多重短路表达式
        (el.requestFullscreen && el.requestFullscreen()) ||
          (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
          (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen())
      } else { // 退出全屏,三目运算符
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
        if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        }
        if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
      this.IsFullScreen = !this.IsFullScreen
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
