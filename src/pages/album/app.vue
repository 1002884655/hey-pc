<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange">
      <div class="MainContainer">

        <!-- 封面信息 -->
        <div class="SheetCover flex-h" v-if="OtherUserAlbumInfo !== null">

          <div class="Img">
            <a>
              <img :src="OtherUserAlbumInfo.cover" class="centerLabel cover" alt="">
              <div class="RightLayer">
                <span class="centerLabel">
                  <span>{{Total}}</span>
                  <i class="iconfont iconshipinliebiao"></i>
                </span>
              </div>
            </a>
          </div>

          <div class="flex-item flex-v">
            <div class="flex-item">
              <span>{{OtherUserAlbumInfo.name}}</span>
              <span>{{OtherUserAlbumInfo.description}}</span>
              <span>Creator：<a :href="`./userspace.html?key=${OtherUserAlbumInfo.accountId}`" target="_self">{{OtherUserAlbumInfo.upName}}</a></span>
            </div>
            <div class="Bottom" v-if="VideoAlbumSubList.length">
              <a class="PlayAll" @click="PlayAll">PLAY ALL</a>
              <a class="Like" :class="{'active': OtherUserAlbumInfo.collectStatus}" @click="ToCollectPieceGroup">
                <i class="iconfont iconshoucang-"></i>
                <span> {{OtherUserAlbumInfo.collectNum}}</span>
              </a>
              <a class="Share iconfont iconfenxiang1"> share</a>
            </div>
          </div>

        </div>

        <div class="Sort">
          <a>
            <i class="iconfont iconpaixu"></i>
            <span>Sort</span>
            <ul class="SortList">
              <li @click="CutSort(1)" :class="{'active': PageData.sort === 1}">Add date (from early to late)</li>
              <li @click="CutSort(2)" :class="{'active': PageData.sort === 2}">Add date (from late to early)</li>
              <li @click="CutSort(3)" :class="{'active': PageData.sort === 3}">Views (from high to low)</li>
            </ul>
          </a>
        </div>

        <!-- 列表 -->
        <ul class="List">
          <li v-for="(item, index) in VideoAlbumSubList" :key="index">
            <MainVideoListItem :data="item" :WatchLater="item.WatchLater" :Index="index" :ShowGif="ShowGifIndex === index" StyleType="Default" :MoreTipsAlign="(index + 1) % 5 === 0 ? 'left' : 'right'" @ShowGifIndex="ToShowGifIndex" @TriggerWatchLater="TriggerWatchLater" @NeedLogin="$refs.MainPage.Login()" @SaveToFavorite="OpenSaveToFavorite(item)" @SaveToPlaylist="OpenSaveToPlaylist(item)"></MainVideoListItem>
          </li>
        </ul>

        <!-- 分页器 -->
        <div class="Pagination" v-if="Total">
          <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
        </div>

        <SaveToFavorites ref="SaveToFavorites" :Ids="CurrentId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false"></SaveToFavorites>

        <SaveToPlaylist ref="SaveToPlaylist" :Ids="[CurrentId]" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false"></SaveToPlaylist>

      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：专辑详情页面
  创建人：许成祥
  创建时间：2020/06/10
  最近修改人：许成祥
  最近修改日期：2020/06/10
  备注： 无
*/
import Vue from 'vue'
import MainVideoListItem from '../../components/MainVideoListItem'
import SaveToFavorites from '../../components/SaveToFavorites'
import SaveToPlaylist from '../../components/SaveToPlaylist'
import { createNamespacedHelpers } from 'vuex'
import { Pagination, Notification } from 'element-ui'
import MainPage from '../../components/MainPage'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
Vue.prototype.$notify = Notification
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  components: {
    'el-pagination': Pagination,
    MainPage,
    MainVideoListItem,
    SaveToFavorites,
    SaveToPlaylist
  },
  data () {
    return {
      ShowSaveToPlaylist: false,
      ShowSaveToFavorites: false,
      ShowGifIndex: null,
      CollectNum: 0,
      ShowMoveFolderPopup: false,
      CurrentId: null,
      ShowAddFolderPopup: false,
      PageData: {
        sort: this.ToolClass.GetUrlParams('sort') !== false ? this.ToolClass.GetUrlParams('sort') - 0 : 1,
        pageNum: this.ToolClass.GetUrlParams('pages') !== false ? this.ToolClass.GetUrlParams('pages') - 0 : 1,
        pageSize: 20
      },
      Total: 0,
      DataLock: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      OtherUserAlbumInfo: x => x.OtherUserAlbumInfo, // 其他用户片单信息
      VideoAlbumList: x => x.VideoAlbumList, // 用户所有视频片单列表
      MyPieceGroupList: x => x.MyPieceGroupList, // 用户所有视频片单列表
      VideoAlbumSubList: x => x.VideoAlbumSubList // 片单下视频列表
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetAlbumPageVideos',
      'GetVideoAlbumDetails',
      'AddPieceGroupSubItem',
      'CollectVideoAlbum',
      'RemoveCollectVideoAlbum'
    ]),
    ...mapUserMutations([
      'EditOtherUserAlbumInfo',
      'EditVideoAlbumSubList'
    ]),
    TriggerWatchLater (e) {
      if (e.type === 'Add') {
        this.EditVideoAlbumSubList({ index: e.index, name: 'WatchLater', value: true })
        this.$notify.success({ title: 'success', message: 'Saved to watch later' })
      } else {
        this.EditVideoAlbumSubList({ index: e.index, name: 'WatchLater', value: false })
        this.$notify.success({ title: 'success', message: 'Removed from watch later' })
      }
    },
    OpenSaveToFavorite (item) {
      this.CurrentId = item.videoId
      this.ShowSaveToFavorites = true
    },
    OpenSaveToPlaylist (item) {
      this.CurrentId = item.videoId
      this.ShowSaveToPlaylist = true
    },
    ToShowGifIndex (e) {
      this.ShowGifIndex = e
    },
    LoginCheck (callback) { // 登录校验
      if (this.UserInfo === null) {
        this.$refs.MainPage.Login()
      } else {
        callback()
      }
    },
    ToCollectPieceGroup () { // 去收藏片单
      this.LoginCheck(() => {
        if (!this.DataLock) {
          this.DataLock = true
          if (this.OtherUserAlbumInfo.collectStatus) { // 取消收藏
            this.RemoveCollectVideoAlbum({
              params: { albumId: this.OtherUserAlbumInfo.id, accountId: this.UserInfo.id }
            }).then(() => {
              this.$notify.success({
                title: 'success',
                message: 'Remove of success!'
              })
              this.EditOtherUserAlbumInfo({ collectStatus: 0 })
              this.DataLock = false
            }).catch(() => {
              this.DataLock = false
            })
          } else { // 收藏
            this.CollectVideoAlbum({
              params: { albumId: this.OtherUserAlbumInfo.id, accountId: this.UserInfo.id }
            }).then(() => {
              this.$notify.success({
                title: 'success',
                message: 'Collect of success!'
              })
              this.EditOtherUserAlbumInfo({ collectStatus: 1 })
              this.DataLock = false
            }).catch(() => {
              this.DataLock = false
            })
          }
        }
      })
    },
    MoveToSheet (e) { // 添加到片单回调
      this.LoginCheck(() => {
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
      })
    },
    LinkToPlayer (item) {
      window.open(`./video.html?key=${item.videoM}&type=5&album=${this.ToolClass.GetUrlParams('album')}`, '_self')
    },
    PlayAll () { // 播放全部
      if (this.VideoAlbumSubList.length) {
        window.open(`./video.html?key=${this.VideoAlbumSubList[0].videoM}&type=5&album=${this.ToolClass.GetUrlParams('album')}`, '_self')
      }
    },
    CutSort (num) { // 切换排序
      this.PageData.sort = num
      this.ToolClass.ChangeUrlParams([{ name: 'sort', value: num }])
      this.ToGetPieceGroupSubList()
    },
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetPieceGroupSubList()
      }
    },
    ToGetPieceGroupSubList () { // 获取片单下视频列表
      if (!this.DataLock) {
        this.DataLock = true
        this.GetAlbumPageVideos({ params: { ...this.PageData, albumId: this.ToolClass.GetUrlParams('album') } }).then((res) => {
          this.PageData.pageNum = res.data.data.pageNum
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: res.data.data.pageNum }])
          this.Total = res.data.data.total
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    UserInfoChange () { // 用户登录逻辑回调
      let album = this.ToolClass.GetUrlParams('album')
      // let AccountId = this.ToolClass.GetUrlParams('key')
      if (album !== false) {
        this.GetVideoAlbumDetails({ params: { albumId: album } })
        this.ToGetPieceGroupSubList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
