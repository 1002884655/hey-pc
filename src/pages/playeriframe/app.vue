<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange" @NetSpeedTestEnd="NetSpeedTestEnd" :Show="false" :HideFooter="true">
      <div class="PageContainer">
        <HeyPornPlayer ref="HeyPornPlayer" :class="{'mini': IsMiniPlayer && MiniLock, 'ShowMiniClose': IsMiniPlayer}" v-if="MediaSrcList.length && CapacityActiveIndex !== null" :OnFocus="PlayerFocus" :activeIndex="CapacityActiveIndex" :srcList="MediaSrcList" :IsFullWindow="IsFullWindow"></HeyPornPlayer>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：播放器嵌入页
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2019/12/30
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const HeyPornPlayer = () => import('@/components/HeyPornPlayer')
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapMediaActions } = createNamespacedHelpers('media')
export default {
  components: {
    MainPage,
    HeyPornPlayer
  },
  data () {
    return {
      MediaInfo: null,
      PageUserInfo: null,
      ShowPayForFansClubPopup: false,
      ShowCanNotPay: false,
      PayLock: false,
      ShowPayLayer: true,
      ShowSaveToFavorites: false,
      ShowSaveToPlaylist: false,
      IsFree: false,
      IsPrivacy: false,
      ShowAddList: false, // 显隐添加到弹窗状态
      ShowEditFolderPopup: false, // 显隐新建片单弹窗
      HasAddtoWatchLater: false, // 是否加到过稍后观看
      VideoPlayerIsStart: false, // 视频开始播放
      CollectId: null, // 收藏id
      ShowError: false, // 显示404页面
      IsMiniPlayer: false, // 播放器mini模式开关
      DataLock: false, // 数据锁
      MediaSrcList: [], // 视频链接数据
      CapacityActiveIndex: null, // 适配清晰度索引值
      CurrentCapacity: null, // 当前适配清晰度
      IsFullWindow: false, // 全窗口模式状态
      CurrentNetSpeed: null, // 当前网速（粗略值）
      MiniLock: true,
      Timer: null,
      CurrentPlayerPosition: [18, 10], // 当前播放器位置：right, bottom
      PlayerPositionDifferenceValue: [0, 0], // 播放器位移差值
      PlayerFocus: false // 播放器获得焦点状态
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapMediaActions([
      'GetTestVideoInfo'
    ]),
    ToGetMediaInfo (callback = () => { }) { // 获取视频信息
      this.GetTestVideoInfo({
        urlData: this.ToolClass.GetUrlParams('key'),
        params: { accountId: this.UserInfo.id }
      }).then((res) => {
        this.MediaInfo = res.data.data || null
        if (this.MediaInfo !== null && this.MediaInfo.video !== null) {
          callback()
          this.IsFree = this.MediaInfo.payVideo - 0 === 0 || (this.MediaInfo.payVideo - 0 === 1 && this.MediaInfo.payStatus - 0 === 1)
          if (this.IsFree) {
            if (res.data.code - 0 !== 2031) {
              this.IsPrivacy = false
              let Arr = []
              for (let n in JSON.parse(this.MediaInfo.video.capacity)) {
                if (JSON.parse(this.MediaInfo.video.capacity)[n] - 0) {
                  Arr.push({
                    name: this.MediaInfo.video.title,
                    src: `${this.MediaInfo.video.videoPath}${n}/${this.MediaInfo.video.playName}.m3u8`,
                    id: n,
                    value: n - 0 === 1 ? '360P' : n - 0 === 2 ? '576P' : n - 0 === 4 ? '720P' : n - 0 === 8 ? '1080P' : n - 0 === 16 ? '4K' : '-P'
                  })
                }
              }
              if (this.CurrentNetSpeed !== null) { // 清晰度适配
                this.CurrentCapacity = this.MatchingCapacity(JSON.parse(this.MediaInfo.video.capacity), this.CurrentNetSpeed)
                Arr.map((item, index) => { // 默认清晰度索引
                  if (item.id - 0 === this.CurrentCapacity - 0) {
                    this.CapacityActiveIndex = index
                  }
                })
              }
              this.MediaSrcList = Arr
            } else { // 私密视频
              this.IsPrivacy = true
            }
          }
        } else {
          this.ShowError = true
        }
      })
    },
    UserInfoChange () {
      if (this.UserInfo !== null) {
        this.ToGetMediaInfo()
      }
    },
    MatchingCapacity (target, speed) { // 匹配清晰度
      let CurrentCapacity = 4 // 默认 720p
      let CurrentIndex = 0
      let Arr = []
      if (speed <= 70) { // 360p
        CurrentCapacity = 1
        CurrentIndex = 0
      } else if (speed > 70 && speed <= 179) { // 576p
        CurrentCapacity = 2
        CurrentIndex = 1
      } else if (speed > 179 && speed <= 280) { // 720p
        CurrentCapacity = 4
        CurrentIndex = 2
      } else if (speed > 280) { // 1080p
        CurrentCapacity = 8
        CurrentIndex = 3
      }
      if (target[`${CurrentCapacity}`] - 0 === 0) { // 匹配清晰度无资源，取最佳清晰度
        for (let n in target) {
          Arr.push({ name: n, value: target[n] })
        }
        for (let n = CurrentIndex; n >= 0; n--) {
          if (Arr[n].value - 0) {
            return Arr[n].name
          }
        }
      }
      return CurrentCapacity
    },
    NetSpeedTestEnd (e) { // 网速测试结束回调
      this.CurrentNetSpeed = e
      if (this.MediaInfo !== null && this.MediaInfo.video !== null && this.CurrentCapacity === null) {
        this.CurrentCapacity = this.MatchingCapacity(JSON.parse(this.MediaInfo.video.capacity), this.CurrentNetSpeed)
        if (this.MediaSrcList.length && this.CapacityActiveIndex === null) {
          this.MediaSrcList.map((item, index) => { // 默认清晰度索引
            if (item.id - 0 === this.CurrentCapacity - 0) {
              this.CapacityActiveIndex = index
            }
          })
          if (this.CapacityActiveIndex === null) {
            this.CapacityActiveIndex = 0
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
