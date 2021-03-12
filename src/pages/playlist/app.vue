<template>
  <div id="app">
    <MainPage @UserInfoChange="UserInfoChange">
      <div class="PageContainer flex-h">

        <!-- 左侧栏 -->
        <div class="Left" id="LeftMenu" v-if="UserInfo !== null">

          <!-- 我创建的片单 -->
          <MyCreatePlaylist ref="MyCreatePlaylist" @IsNull="IsNull =true" @NoData="$refs.MySavePlaylist.OtherNoData()" @Cut="CreateCut" @Edit="EditPlaylist" @AllTo="AllTo"></MyCreatePlaylist>

          <!-- 创建片单 -->
          <a class="CreateBtn" @click="CreateNewPlaylist">
            <i class="iconfont iconchuangjianbaoguo"></i>
            <span>Create new playlist</span>
          </a>

          <!-- 我收藏的片单 -->
          <MySavePlaylist ref="MySavePlaylist" @IsNull="IsNull =true" @NoData="$refs.MyCreatePlaylist.OtherNoData()" @Cut="SaveCut" @AllTo="AllTo"></MySavePlaylist>

        </div>

        <!-- 右侧内容 -->
        <div class="flex-item" v-if="UserInfo !== null && !IsNull">
          <PlaylistContent ref="PlaylistContent" @AllAddTo="AllAddTo" @EditPlaylist="EditPlaylist"></PlaylistContent>
        </div>

        <!-- 片单操作弹窗 -->
        <PlaylistSetPopup ref="PlaylistSetPopup" v-if="UserInfo !== null && ShowPlaylistSetPopup" :Ids="VideoIds" :AddFromGroup="CurrentAddFromGroup" :GroupItem="CurrentPlaylistItem" @Close="SetPopupClose"></PlaylistSetPopup>

      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：片单页面
  备注： 无
*/
import MainPage from '../../components/MainPage'
import MyCreatePlaylist from '../../components/MyCreatePlaylist'
import MySavePlaylist from '../../components/MySavePlaylist'
import PlaylistContent from '../../components/PlaylistContent'
import PlaylistSetPopup from '../../components/PlaylistSetPopup'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
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
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    Init () { // 初始化

    },
    AllAddTo (e) { // 批量添加至片单
      let Arr = []
      e.map((item) => {
        Arr.push(item.videoId)
      })
      this.VideoIds = Arr
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
      this.ShowPlaylistSetPopup = true
      this.$nextTick(() => {
        this.$refs.PlaylistSetPopup.IsAdd = true
      })
    },
    EditPlaylist (e) { // 编辑片单
      this.CurrentPlaylistItem = { ...e }
      this.ShowPlaylistSetPopup = true
      this.$nextTick(() => {
        this.$refs.PlaylistSetPopup.IsAdd = true
      })
    },
    CreateCut (e) { // 创建片单列表切换
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
