<template>
  <div class="components UserForWatchLater flex-v">

    <div class="flex-h Title">
      <span class="flex-item">Watch later ({{WatchLaterVideoList.length}}/100)</span>
      <a v-if="WatchLaterVideoList.length" :href="`./video.html?key=${WatchLaterVideoList[0].videoM}&type=2`" target="_self">Play all</a>
      <a v-if="WatchLaterVideoList.length" @click="RemoveVideo('watched')">Remove watched video</a>
      <a v-if="WatchLaterVideoList.length" @click="RemoveVideo('all')">Remove all video</a>
    </div>

    <div class="flex-item">
      <ScrollY>
        <span class="NoData" v-if="AxiosEnd && !WatchLaterVideoList.length">You did not add any video</span>
        <ul class="List">
          <li v-for="(item, index) in WatchLaterVideoList" :key="index" :style="{zIndex: WatchLaterVideoList.length - index}" class="flex-h">
            <div class="Img">
              <a @mouseover="ShowGifIndex = index" @mouseout="ShowGifIndex = null" :href="`./video.html?key=${item.videoM}&type=2`" target="_self">
                <img :src="item.front" class="centerLabel cover" alt="">
                <img v-if="item.videoPath !== null && ShowGifIndex === index" :src="`${item.gifPath}Image1/index.gif`" class="Gif centerLabel cover" alt="">
                <span><b v-if="item.capacity">{{JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}}</b> {{ToolClass.DateFormat(item.length)}}</span>
              </a>
            </div>
            <div class="flex-item flex-v">
              <div class="flex-item">
                <a :href="`./video.html?key=${item.videoM}&type=2`" target="_self">{{item.title}}</a>
              </div>
              <div class="flex-h">
                <a :href="`./userspace.html?key=${item.userId}`" target="_self">{{item.userName}}</a>
                <div class="flex-item"></div>
                <span>{{item.status - 0 === 0 ? '' : item.status - 0 === 1 ? 'Watched' : 'Finished'}}</span>
              </div>
            </div>
            <div class="More">
              <a class="iconfont iconsandian1 centerLabel"></a>
              <div class="MoreTab">
                <ul>
                  <li class="flex-h" @click="DeleteItem(item, index)">
                    <i class="iconfont iconqingkong"></i>
                    <span class="flex-item">Removed to watch later</span>
                  </li>
                  <li class="flex-h" @click="ToCollectVideo(item.videoId)">
                    <i class="iconfont iconshoucang-"></i>
                    <span class="flex-item">Save to favorites</span>
                  </li>
                  <li class="flex-h" @click="CurrentId = item.videoId; ShowSaveToPlaylist = true">
                    <i class="iconfont iconyemian"></i>
                    <span class="flex-item">Save to playlist</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </ScrollY>
    </div>

    <SaveToFavorites ref="SaveToFavorites" :Ids="CurrentId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false"></SaveToFavorites>

    <SaveToPlaylist ref="SaveToPlaylist" :Ids="[CurrentId]" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false"></SaveToPlaylist>

  </div>
</template>

<script>
/*
  页面名称：稍后观看
  创建人：许成祥
  创建时间：2020/05/19
  最近修改人：许成祥
  最近修改日期：2020/05/19
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import ScrollY from '../ScrollY'
import VideoCollectFolderMove from '../VideoCollectFolderMove'
import UserForMySheetVideosCopy from '../UserForMySheetVideosCopy'
import SaveToFavorites from '../SaveToFavorites'
import SaveToPlaylist from '../SaveToPlaylist'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForWatchLater',
  props: ['data'],
  data () {
    return {
      ShowSaveToPlaylist: false,
      ShowSaveToFavorites: false,
      CurrentId: null, // 当前操作id
      AxiosEnd: false, // 请求数据状态
      CollectId: null, // 收藏id
      ShowMoveFolderPopup: false, // 显隐添加到片单状态
      ShowAddFolderPopup: false, // 显隐添加收藏状态
      DataLock: false, // 数据锁
      ShowGifIndex: null // 当前显示Gif索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      WatchLaterVideoList: x => x.WatchLaterVideoList, // 稍后观看列表
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    })
  },
  components: {
    ScrollY,
    VideoCollectFolderMove,
    UserForMySheetVideosCopy,
    SaveToFavorites,
    SaveToPlaylist
  },
  created () {
    this.GetWatchLaterVideoList({ params: { pageNum: 1, pageSize: 100, accountId: this.UserInfo.id } }).then(() => {
      this.AxiosEnd = true
    }).catch(() => {
      this.AxiosEnd = true
    })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetWatchLaterVideoList',
      'DeleteWatchLaterVideo',
      'AddPieceGroupSubItem'
    ]),
    ...mapUserMutations([
      ''
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
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
        })
      }
    },
    RemoveVideo (type) { // 清除视频
      if (!this.DataLock) {
        this.ToolClass.Confirm('Delete videos', 'Are you sure to delete these videos?', () => { }, (close) => {
          this.DataLock = true // 数据锁定
          let ids = []
          this.WatchLaterVideoList.map((item) => {
            if (type === 'watched') { // 清除已观看视频
              if (item.status - 0 === 2) {
                ids.push(item.id)
              }
            } else { // 清除所有视频
              ids.push(item.id)
            }
          })
          if (ids.length) {
            this.DeleteWatchLaterVideo({
              params: { params: { ids: ids.join(','), accountId: this.UserInfo.id } },
              index: null
            }).then(() => {
              close()
              this.GetWatchLaterVideoList({ params: { pageNum: 1, pageSize: 100, accountId: this.UserInfo.id } }).then(() => {
                this.AxiosEnd = true
                this.DataLock = false // 数据解锁
              }).catch(() => {
                this.AxiosEnd = true
                this.DataLock = false // 数据解锁
              })
            })
          } else {
            close()
            this.DataLock = false // 数据解锁
          }
        }, 'Delete')
      }
    },
    ToCollectVideo (id) { // 添加收藏
      this.CurrentId = id
      this.ShowSaveToFavorites = true
    },
    DeleteItem (item, index) { // 删除视频
      if (!this.DataLock) {
        this.ToolClass.Confirm('Delete video', 'Are you sure to delete this video?', () => { }, (close) => {
          this.DataLock = true // 数据锁定
          this.DeleteWatchLaterVideo({
            params: { params: { ids: item.id, accountId: this.UserInfo.id } },
            index
          }).then(() => {
            this.$notify.success({
              title: 'success',
              message: 'video removed'
            })
            close()
            this.DataLock = false // 数据解锁
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        }, 'Delete')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
