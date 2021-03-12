<template>
  <div class="components NewVideoPlayerList flex-v" :style="{maxHeight: `${MaxHeight + 42}px`}">
    <div class="Title">
      <span>{{PlaylistInfo.name}}</span>
    </div>
    <div class="SubInfo">
      <a>{{PlaylistInfo.userName}}</a>
      <span>{{PlaylistInfo.videoNum}}/{{PlaylistInfo.maxCount}}</span>
    </div>
    <div class="MoreSet flex-h">
      <a class="iconfont" :class="{'iconvideo-xunhuanbofang': PlayerType === 1, 'iconsuijibofang-2': PlayerType === 2, 'icondangexunhuanbofang': PlayerType === 3}" @click="CutType"></a>
      <div class="flex-item"></div>
      <a class="iconfont icontianjia2" v-if="PlaylistInfo.collectStatus - 0 === 0 && (UserInfo === null || (UserInfo !== null && UserInfo.id !== PlaylistInfo.userId))" @click="ToSavePlaylist"></a>
      <a class="iconfont iconyichu1" v-if="PlaylistInfo.collectStatus - 0 === 1" @click="ToRemovePlaylist"></a>
    </div>
    <div class="ListContainer flex-item">
      <div class="HideListDom">
        <div v-for="(item, index) in PageList" :key="index">
          <div>
            <div class="HideListDomItem"></div>
          </div>
        </div>
      </div>
      <div class="ShowListDom">
        <ul v-if="PageList.length <= MaxListNum">
          <li v-for="(item, index) in PageList" :key="index" class="flex-h">
            <span class="iconfont iconbofang" v-if="ActiveId === item.videoM"></span>
            <span v-else>{{index + 1}}</span>
            <div class="flex-item">
              <VideoListItemH :Item="item" :SelfLink="false" @LinkClick="CutList(item)"></VideoListItemH>
            </div>
          </li>
        </ul>
        <ScrollY Size="small" v-else ref="PlaylistScroll">
          <ul>
            <li v-for="(item, index) in PageList" :key="index" class="flex-h" :class="`Playlist-${item.videoM}`">
              <span class="iconfont iconbofang" v-if="ActiveId === item.videoM"></span>
              <span v-else>{{index + 1}}</span>
              <div class="flex-item">
                <VideoListItemH :Item="item" :SelfLink="false" @LinkClick="CutList(item)"></VideoListItemH>
              </div>
            </li>
          </ul>
        </ScrollY>
      </div>
    </div>
  </div>
</template>

<script>
/*
*/
import VideoListItemH from '../VideoListItemH'
import ScrollY from '../ScrollY'
import { createNamespacedHelpers } from 'vuex'
const { mapActions: mapPlaylistActions } = createNamespacedHelpers('playlist')
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'NewVideoPlayerList',
  props: {
    MaxHeight: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      PlayedArr: [],
      ActiveId: this.ToolClass.GetUrlParams('key'),
      MaxListNum: 5,
      Timer: null,
      PageData: {
        pageNum: 1,
        pageSize: 200
      },
      DataLock: false,
      PlaylistInfo: {},
      Type: this.ToolClass.GetUrlParams('type') - 0,
      PageList: [], // 列表数据
      PlayerType: 1 // 播放模式： 1-顺序播放 2-随机播放 3-循环单集播放
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    VideoListItemH,
    ScrollY
  },
  created () {
    this.HeightInit()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapPlaylistActions([
      'GetPlaylistChildList',
      'GetPlaylistInfoById',
      'RemoveSavePlaylist',
      'SavePlaylist'
    ]),
    ...mapUserActions([
      'GetWatchLaterVideoList'
    ]),
    ToSavePlaylist () { // 收藏片单
      if (this.UserInfo !== null) {
        if (this.DataLock) return
        this.DataLock = true
        this.SavePlaylist({ params: { groupId: this.PlaylistInfo.id, accountId: this.UserInfo.id } }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'add successfully!'
          })
          this.PlaylistInfo.collectStatus = 1
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      } else {
        this.$emit('Login')
      }
    },
    ToRemovePlaylist () { // 移除收藏片单
      if (this.DataLock) return
      this.DataLock = true
      this.RemoveSavePlaylist({ params: { accountId: this.UserInfo.id, groupId: this.PlaylistInfo.id } }).then(() => {
        this.$notify.success({
          title: 'success',
          message: 'remove successfully!'
        })
        this.PlaylistInfo.collectStatus = 0
        this.DataLock = false
        close()
      }).catch(() => {
        this.DataLock = false
      })
    },
    Next () { // 下一个
      if (this.PlayerType === 1 || this.PlayerType === 3) { // 顺序播放 or 单集循环播放
        let Index = null
        this.PageList.map((item, index) => {
          if (item.videoM === this.ActiveId) {
            Index = index + 1 < this.PageList.length ? index + 1 : 0
          }
        })
        this.CutList(this.PageList[Index])
      } else if (this.PlayerType === 2) { // 随机播放
        this.PlayedArr.push(this.ActiveId)
        let Arr = []
        this.PageList.map((item) => {
          let Bool = true
          this.PlayedArr.map((subItem) => {
            if (item.videoM === subItem) {
              Bool = false
            }
          })
          if (Bool) {
            Arr.push({ ...item })
          }
        })
        if (Arr.length) {
          let Num = Math.floor(Arr.length * Math.random())
          this.CutList(Arr[Num])
          this.$refs.PlaylistScroll.ScrollTo(document.getElementsByClassName(`Playlist-${Arr[Num].videoM}`)[0].offsetTop)
        } else {
          this.PlayedArr = []
          this.Next()
        }
      }
    },
    CutList (item) { // 切换播放视频
      if (this.ActiveId !== item.videoM) {
        this.ToolClass.ChangeUrlParams([{ name: 'key', value: item.videoM }])
        this.$emit('Change', item)
        this.ActiveId = item.videoM
      }
    },
    HeightInit () {
      window.clearInterval(this.Timer)
      this.Timer = window.setInterval(() => {
        if (document.getElementsByClassName('HideListDomItem')[0]) {
          window.clearInterval(this.Timer)
          let ItemHeight = document.getElementsByClassName('HideListDomItem')[0].getBoundingClientRect().height
          this.MaxListNum = Math.floor((this.MaxHeight + 42 - 80 - 2) / (ItemHeight + 10))
          let OnResizeFun = window.onresize
          window.onresize = () => {
            OnResizeFun()
            this.MaxListNum = Math.floor((this.MaxHeight + 42 - 80 - 2) / (ItemHeight + 10))
          }
        }
      }, 50)
    },
    UserInfoChange () { // 初始化
      if (this.Type === 2) { // 稍后观看列表模式
        if (this.UserInfo !== null) {
          this.GetWatchLaterVideoList({ params: { pageNum: 1, pageSize: 100, accountId: this.UserInfo.id } }).then((res) => {
            this.PlaylistInfo = {
              name: 'Watch Later',
              userName: this.UserInfo.name,
              maxCount: 100,
              videoNum: res.data.data.list.length
            }
            this.PageList = res.data.data.list || []
          })
        }
      } else if (this.Type === 4) { // 片单模式，请求片单信息以及片单下视频列表
        let PlaylistId = this.ToolClass.GetUrlParams('sheet') - 0
        if (PlaylistId) {
          let Params = { id: PlaylistId }
          if (this.UserInfo !== null) {
            Params.accountId = this.UserInfo.id
          }
          this.GetPlaylistInfoById({ params: { ...Params } }).then((res) => {
            this.PlaylistInfo = res.data.data || {}
          })
          this.GetPlaylistChildList({ params: { ...this.PageData, groupId: PlaylistId } }).then((res) => {
            this.PageList = res.data.data.list || []
          })
        }
      }
    },
    CutType () { // 切换播放顺序
      this.PlayerType = this.PlayerType === 1 ? 2 : this.PlayerType === 2 ? 3 : 1
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
