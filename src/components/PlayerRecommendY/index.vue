<template>
  <div class="components PlayerRecommendY">
    <ul>
      <li v-for="(item, index) in List" :key="index" class="flex-h" @mouseover="ShowGifIndex = index" @mouseout="ShowGifIndex = null">
        <div class="Img">
          <a :title="item.title">
            <img :src="item.frontPath" class="centerLabel cover" alt="">
            <img v-if="item.videoPath !== null && ShowGifIndex === index" @click="LinkToMedia(item.videoM)" :src="`${item.gifPath}Image1/index.gif`" class="Gif centerLabel cover" alt="">
            <span class="Length Capacity"><b>{{JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}}</b> {{ToolClass.DateFormat(item.length)}}</span>
            <div></div>
            <a class="iconfont WatchLater" :class="[item.WatchLater ? 'icondui active' : 'iconshaohouguankan1']" @click="ToAddWatchLater(item)"></a>
            <span class="WatchLaterTips" :class="{'active': item.WatchLater}">{{item.WatchLater ? 'ADDED' : 'WATCH LATER'}}</span>
          </a>
        </div>
        <div class="flex-item flex-v">
          <div style="margin-bottom: 3px;" :title="item.title">
            <a :href="`./video.html?key=${item.videoM}`" class="Title" target="_self">{{item.title}}</a>
          </div>
          <a :href="`./userspace.html?key=${item.upId}`" class="UpName" target="_self">{{item.upName}}</a>
          <div class="Bottom flex-h">
            <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
            <!-- <a class="iconfont iconbofang" :href="`./video.html?key=${item.videoM}`" target="_self"></a> -->
            <!-- <span class="flex-item">{{item.upTime | changeTime}}</span> -->
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/*
  页面名称：播放器右侧推荐列表组件
  创建人：许成祥
  创建时间：2020/01/17
  最近修改人：许成祥
  最近修改日期：2020/04/11
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'PlayerRecommendY',
  props: ['List'],
  data () {
    return {
      PageList: [],
      DataLock: false, // 数据锁
      ShowGifIndex: null // 当前显示Gif索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    })
  },
  components: {
    // Tooltip
  },
  created () {
    this.PageList = []
    this.List.map((item) => {
      this.PageList.push({ ...item, WatchLater: false })
    })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'AddWatchLater',
      'CancelWatchLater'
    ]),
    LinkToMedia (id) { // 跳转到视频页
      window.open(`./video.html?key=${id}`, '_self')
    },
    ToAddWatchLater (item, index) { // 添加稍后观看
      if (this.UserInfo !== null) { // 用户已登录
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定
          if (item.WatchLater) { // 取消添加稍后观看
            this.CancelWatchLater({
              params: { videoId: item.videoId, accountId: this.UserInfo.id }
            }).then((res) => {
              this.$notify.success({
                title: 'success',
                message: 'has been removed'
              })
              item.WatchLater = false
              this.DataLock = false // 数据解锁
            }).catch((res) => {
              this.DataLock = false // 数据解锁
            })
          } else { // 添加稍后观看
            this.AddWatchLater({ params: { videoId: item.videoId, accountId: this.UserInfo.id } }).then((res) => {
              this.$notify.success({
                title: 'success',
                message: res.data.msg
              })
              item.WatchLater = true
              this.DataLock = false // 数据解锁
            }).catch((res) => {
              if (res.data.code - 0 === 2056) {
                this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                  close()
                  window.open(`./users.html?type=5`, '_self')
                }, 'Immediately to')
              }
              this.DataLock = false // 数据解锁
            })
          }
        }
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
