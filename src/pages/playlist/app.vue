<template>
  <div id="app">
    <MainPage @UserInfoChange="UserInfoChange" @MainPageScroll="MainPageScroll">
      <div class="PageContainer flex-h" id="PageContainer">

        <!-- 左侧栏 -->
        <div class="Left" id="LeftMenu" v-if="UserInfo !== null">

          <!-- 历史记录 & 稍后观看 -->
          <ul class="HistoryAndWatchLater">
            <li @click="CutMenu('watchLater')" :class="{'active': PageType === 'watchLater'}">
              <span>Watch later</span>
            </li>
            <li @click="CutMenu('history')" :class="{'active': PageType === 'history'}">
              <span>History</span>
            </li>
          </ul>

          <!-- 我创建的片单 -->
          <MyCreatePlaylist ref="MyCreatePlaylist" @TriggerClose="TriggerCreatePlaylistClose" @IsNull="IsNull =true" @NoData="$refs.MySavePlaylist.OtherNoData()" @Cut="CreateCut" @Edit="EditPlaylist" @AllTo="AllTo"></MyCreatePlaylist>

          <!-- 创建片单 -->
          <a class="CreateBtn" @click="CreateNewPlaylist" v-if="ShowCreateList">
            <i class="iconfont iconchuangjianbaoguo"></i>
            <span>Create new playlist</span>
          </a>

          <div class="Line"></div>

          <!-- 我收藏的片单 -->
          <MySavePlaylist ref="MySavePlaylist" @IsNull="IsNull =true" @NoData="$refs.MyCreatePlaylist.OtherNoData()" @Cut="SaveCut" @AllTo="AllTo"></MySavePlaylist>

        </div>

        <!-- 右侧内容 -->
        <div class="flex-item" v-if="UserInfo !== null && !IsNull && PageType !== null">
          <PlaylistContent ref="PlaylistContent" @AllAddTo="AllAddTo" @ItemAddTo="ItemAddTo" @EditPlaylist="EditPlaylist" @VideoRemove="VideoRemove"></PlaylistContent>
        </div>

        <!-- 片单操作弹窗 -->
        <PlaylistSetPopup ref="PlaylistSetPopup" v-if="UserInfo !== null && ShowPlaylistSetPopup" :ShowWatchLater="ShowWatchLater" :Ids="VideoIds" :AddFromGroup="CurrentAddFromGroup" :GroupItem="CurrentPlaylistItem" @Close="SetPopupClose" @CutNewest="CutNewest" @DefaultPlaylistChange="DefaultPlaylistChange"></PlaylistSetPopup>

      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：片单页面
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const MyCreatePlaylist = () => import('@/components/MyCreatePlaylist')
const MySavePlaylist = () => import('@/components/MySavePlaylist')
const PlaylistContent = () => import('@/components/PlaylistContent')
const PlaylistSetPopup = () => import('@/components/PlaylistSetPopup')
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapState: mapPlaylistState, mapActions: mapPlaylistActions } = createNamespacedHelpers('playlist')
export default {
  components: {
    MainPage,
    MyCreatePlaylist,
    MySavePlaylist,
    PlaylistContent,
    PlaylistSetPopup
  },
  data () {
    return {
      PageType: null,
      MaxNum: 0,
      ShowWatchLater: true,
      ShowCreateList: true,
      VideoIds: [],
      IsNull: false, // 是否空数据
      CurrentAddFromGroup: null, // 当前整体添加视频到片单，原片单对象
      CurrentPlaylistItem: null, // 当前编辑片单对象
      ShowPlaylistSetPopup: false // 显隐片单操作弹窗
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    }),
    ...mapPlaylistState({
      MyCreatedPlaylist: x => x.MyCreatedPlaylist // 我创建的片单列表
    })
  },
  created () {
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapPlaylistActions([
      'GetPlaylistMaxNum'
    ]),
    Init () { // 初始化
      this.PageType = this.ToolClass.GetUrlParams('type')
      this.GetPlaylistMaxNum().then((res) => {
        this.MaxNum = res.data.data - 0
      })
    },
    MainPageScroll (e) {
      this.$refs.PlaylistContent.PageScroll(e)
    },
    VideoRemove (e) {
      if (e.type === 'create') {
        this.$refs.MyCreatePlaylist.VideoRemove(e.counts)
      } else {
        this.$refs.MySavePlaylist.VideoRemove(e.counts)
      }
    },
    DefaultPlaylistChange (e) {
      this.$refs.MySavePlaylist.PageList[0].videoNum = e
    },
    CutNewest (e) {
      this.$refs.MyCreatePlaylist.CutList(e)
    },
    TriggerCreatePlaylistClose (e) {
      this.ShowCreateList = e
    },
    ItemAddTo (e) { // 单个添加至片单
      this.VideoIds = [e.id]
      this.ShowWatchLater = true
      this.ShowPlaylistSetPopup = true
    },
    AllAddTo (e) { // 批量添加至片单
      let Arr = []
      e.map((item) => {
        Arr.push(item.videoId)
      })
      this.VideoIds = Arr
      this.ShowWatchLater = false
      this.ShowPlaylistSetPopup = true
    },
    SetPopupClose (e) { // 片单操作弹窗关闭
      this.ShowPlaylistSetPopup = false
      this.CurrentPlaylistItem = null
      this.CurrentAddFromGroup = null
      this.VideoIds = []
      if (e !== undefined) {
        if (e === 'add') {
          this.$refs.PlaylistContent.CancelEdit()
        } else {
          this.$refs.PlaylistContent.Init()
        }
      } else {
        this.$refs.PlaylistContent.UpdatePlaylistInfo()
      }
    },
    AllTo (e) { // 整体添加视频到片单
      this.CurrentAddFromGroup = { ...e }
      this.ShowPlaylistSetPopup = true
    },
    CreateNewPlaylist () { // 新建片单
      if (this.MyCreatedPlaylist.length < this.MaxNum) {
        this.ShowPlaylistSetPopup = true
        this.$nextTick(() => {
          this.$refs.PlaylistSetPopup.IsAdd = true
        })
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Quantity exceeding limit'
        })
      }
    },
    EditPlaylist (e) { // 编辑片单
      this.CurrentPlaylistItem = { ...e }
      this.ShowPlaylistSetPopup = true
      this.$nextTick(() => {
        this.$refs.PlaylistSetPopup.IsAdd = true
      })
    },
    CutMenu (type) {
      this.$refs.MySavePlaylist.CurrentId = null
      this.$refs.MyCreatePlaylist.CurrentId = null
      this.$refs.MySavePlaylist.CurrentId = null
      this.ToolClass.ChangeUrlParams([{ name: 'type', value: type }], true)
      this.PageType = type
      this.$refs.PlaylistContent.Init(type)
    },
    CreateCut (e) { // 创建片单列表切换
      this.PageType = e
      this.$refs.MySavePlaylist.CurrentId = null
      this.$refs.PlaylistContent.Init(e)
    },
    SaveCut (e) { // 收藏片单列表切换
      this.$refs.MyCreatePlaylist.CurrentId = null
      this.$refs.PlaylistContent.Init(e)
    },
    UserInfoChange () {
      if (this.UserInfo !== null) {
        this.Init()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
