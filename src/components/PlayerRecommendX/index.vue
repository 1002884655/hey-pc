<template>
  <div class="components PlayerRecommendX">
    <div class="Title flex-h">
      <span class="flex-item">Recommended For You</span>
      <a>More</a>
    </div>
    <ul>
      <li v-for="(item, index) in PageList" :key="index">
        <MainVideoListItem :data="item" :WatchLater="item.WatchLater" :Index="index" :ShowGif="ShowGifIndex === index" StyleType="Default" :MoreTipsAlign="(index + 1) % 4 === 0 ? 'left' : 'right'" @ShowGifIndex="ToShowGifIndex" @TriggerWatchLater="TriggerWatchLater" @NeedLogin="$emit('NeedLogin')" @SaveToFavorite="SaveToFavorite(item)" @SaveToPlaylist="SaveToPlaylist(item)"></MainVideoListItem>
      </li>
    </ul>

    <!-- 收藏夹弹窗 -->
    <VideoCollectFolderMove v-if="ShowAddFolderPopup" :CollectId="CurrentId" @Close="ShowAddFolderPopup = false"></VideoCollectFolderMove>

    <!-- 片单弹窗 -->
    <UserForMySheetVideosCopy v-if="ShowMoveFolderPopup" Title="Copy to other playlist" @Change="MoveToSheet" @Close="ShowMoveFolderPopup = false"></UserForMySheetVideosCopy>
  </div>
</template>

<script>
/*
  页面名称：播放器推荐列表组件（水平列表）
  创建人：许成祥
  创建时间：2020/02/10
  最近修改人：许成祥
  最近修改日期：2020/03/25
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import MainVideoListItem from '../MainVideoListItem'
import VideoCollectFolderMove from '../VideoCollectFolderMove'
import UserForMySheetVideosCopy from '../UserForMySheetVideosCopy'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'PlayerRecommendX',
  props: ['List'],
  data () {
    return {
      CurrentId: null,
      ShowAddFolderPopup: false,
      ShowMoveFolderPopup: false,
      PageList: [],
      DataLock: false, // 数据锁
      ShowGifIndex: null // 当前显示Gif索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo,
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    })
  },
  components: {
    MainVideoListItem,
    VideoCollectFolderMove,
    UserForMySheetVideosCopy
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
      'CancelWatchLater',
      'AddPieceGroupSubItem'
    ]),
    MoveToSheet (e) { // 添加到片单回调
      if (!this.DataLock) {
        this.DataLock = true
        this.AddPieceGroupSubItem({
          params: { accountId: this.UserInfo.id, videoIds: this.CurrentId, groupIds: this.MyPieceGroupList[e].id }
        }).then((res) => {
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
          this.$notify.success({
            title: 'success',
            message: 'Copy of success!'
          })
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
        })
      }
    },
    SaveToFavorite (item) { // 添加收藏
      this.CurrentId = item.videoId
      this.ShowAddFolderPopup = true
    },
    SaveToPlaylist (item) { // 添加播单
      this.CurrentId = item.videoId
      this.ShowMoveFolderPopup = true
    },
    TriggerWatchLater (e) {
      if (e.type === 'Add') {
        this.PageList[e.index].WatchLater = true
        this.$notify.success({ title: 'success', message: 'has been added' })
      } else {
        this.PageList[e.index].WatchLater = false
        this.$notify.success({ title: 'success', message: 'has been removed' })
      }
    },
    ToShowGifIndex (e) {
      this.ShowGifIndex = e
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
