<template>
  <div id="app">
    <MainPage ref="MainPage" :ShowHeaderMenu="false" :MainNavBgActive="MainNavBgActive" @UserInfoChange="UserInfoChange" @MainPageScroll="MainPageScroll" @NetSpeedTestEnd="NetSpeedTestEnd" :HideFooter="false">
      <div class="MainPage">

        <!-- Banner -->
        <div class="IndexBannerContainer" :style="{width: `100%`, height: `${ScreenHeight}px`}">
          <div>
            <IndexBanner ref="IndexBanner" v-if="NetSpeed && HomeBannerList.length" :list="HomeBannerList" @NeedLogin="$refs.MainPage.Login()" :NetSpeed="NetSpeed" @CollectVideo="ToCollectVideo"></IndexBanner>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="IndexLeftMenu" :class="{'active': MainNavBgActive}">
          <nav>
            <a v-for="(item, index) in ClassNavList" :key="index" @click="LinkTo(item.Url)">
              <i class="iconfont" :class="item.Icon"></i>
              <span>{{item.Name}}</span>
            </a>
          </nav>
        </div>

        <!-- 分类 -->
        <div class="ClassList">
          <a :href="`./videoindex.html`">All</a>
          <a v-for="(item, index) in ClassList" v-if="item.level - 0 === 3" :key="index" :href="`./videoindex.html?types=${item.id}`">{{item.name}}</a>
          <!-- <a class="More" @click="HideSomeNav = !HideSomeNav">{{HideSomeNav ? '+ More Categories' : '- Less Categories'}}</a> -->
        </div>

        <!-- 栏目 -->
        <div class="ColumnContainer">
          <div>
            <!-- <IndexRecommedColumnList Title="Recommended" @LinkToMore="LinkToMore('recommend')" @AddToMyFavorite="AddToMyFavorite" @AddToMyPlaylist="AddToMyPlaylist" @Notify="PageNotify" :ShowCutNav="false" :List="VideoRecommendList" @NeedLogin="$refs.MainPage.Login()">
              <IndexLivePlayer ref="IndexLivePlayer"></IndexLivePlayer>
            </IndexRecommedColumnList> -->
            <IndexColumnList Title="Recommended" @LinkToMore="LinkToMore('recommend')" @AddToMyFavorite="AddToMyFavorite" @AddToMyPlaylist="AddToMyPlaylist" @Notify="PageNotify" :ShowCutNav="false" :List="VideoRecommendList" @NeedLogin="$refs.MainPage.Login()"></IndexColumnList>
          </div>
          <div>
            <IndexColumnList Title="Most liked" @LinkToMore="LinkToMore('mostliked')" @AddToMyFavorite="AddToMyFavorite" @AddToMyPlaylist="AddToMyPlaylist" @Notify="PageNotify" :DataLock="DataLock" :List="HotVideoList" @Change="HotChange" @NeedLogin="$refs.MainPage.Login()"></IndexColumnList>
          </div>
          <div>
            <IndexColumnList Title="Popular" @LinkToMore="LinkToMore('featuredvideos')" @AddToMyFavorite="AddToMyFavorite" @AddToMyPlaylist="AddToMyPlaylist" @Notify="PageNotify" :DataLock="DataLock" :List="FeaturedVideoList" @Change="FeaturedChange" @NeedLogin="$refs.MainPage.Login()"></IndexColumnList>
          </div>
          <div>
            <IndexColumnList @LinkToMore="LinkToMore('newest')" @AddToMyFavorite="AddToMyFavorite" @AddToMyPlaylist="AddToMyPlaylist" @Notify="PageNotify" Title="Newest" :ShowCutNav="false" :List="ClassVideoList" @NeedLogin="$refs.MainPage.Login()"></IndexColumnList>
          </div>
          <!-- <div>
            <IndexChannel Title="Hot Channel" :List="HomeChannelList"></IndexChannel>
          </div> -->
          <div v-if="HomePieceGroupList.length">
            <IndexPlayList @AddToMyFavorite="AddToMyFavoriteSheet" Title="Favourite playlists" :List="HomePieceGroupList"></IndexPlayList>
          </div>
        </div>

        <!-- 分页器 -->
        <!-- <div class="Pagination" v-if="TotalNum !== null">
          <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="TotalNum" @current-change="PageChange"></el-pagination>
        </div> -->

        <SaveToFavorites ref="SaveToFavorites" :Ids="CollectId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false"></SaveToFavorites>

        <SaveToPlaylist ref="SaveToPlaylist" :Ids="[CollectId]" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false"></SaveToPlaylist>

        <div style="width: 100%; height: 50px"></div>

      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：主站首页
  创建人：许成祥
  创建时间：2019/12/19
  最近修改人：许成祥
  最近修改日期：2020/03/10
  备注： 无
*/
import Vue from 'vue'
import { Notification, Pagination } from 'element-ui'
import MainPage from '../../components/MainPage'
import MockData from '../../util/MockData'
import IndexBanner from '../../components/IndexBanner'
import IndexClassNav from '../../components/IndexClassNav'
import IndexColumnList from '../../components/IndexColumnList'
import IndexRecommedColumnList from '../../components/IndexRecommedColumnList'
import IndexLivePlayer from '../../components/IndexLivePlayer'
import IndexChannel from '../../components/IndexChannel'
import IndexPlayList from '../../components/IndexPlayList'
import SaveToFavorites from '../../components/SaveToFavorites'
import SaveToPlaylist from '../../components/SaveToPlaylist'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapState: mapMediaState, mapActions: mapMediaActions, mapMutations: mapMediaMutations } = createNamespacedHelpers('media')
const { mapState: mapSearchState, mapActions: mapSearchActions, mapMutations: mapSearchMutations } = createNamespacedHelpers('search')
export default {
  components: {
    'el-pagination': Pagination,
    MainPage,
    IndexBanner,
    IndexClassNav,
    IndexColumnList,
    IndexChannel,
    IndexPlayList,
    SaveToFavorites,
    SaveToPlaylist,
    IndexRecommedColumnList,
    IndexLivePlayer
  },
  data () {
    return {
      PageData: {
        pageNum: 1,
        pageSize: 30
      },
      TotalNum: null,
      ShowSaveToPlaylist: false,
      ShowSaveToFavorites: false,
      HideSomeNav: true, // 隐藏部分nav
      ClassList: [], // 分类列表
      ClassNavList: [ // 分类nav数据
        { Name: 'Home', Icon: 'iconshouye', Url: './index.html' },
        { Name: 'Video', Icon: 'iconshipin', Url: './videoindex.html' },
        { Name: 'Playlist', Icon: 'iconliebiao', Url: './more.html?type=playlist' },
        // { Name: 'Social', Icon: 'iconshequ', Url: './community.html' },
        { Name: 'Live', Icon: 'iconzhibo', Url: './livelist.html' }
        // { Name: 'Live', Icon: 'iconzhibo', Url: null },
        // { Name: 'Photo', Icon: 'iconzhaopian1', Url: null }
      ],
      ScrollTimer: null, // 滚动计时器
      DataLock: false, // 数据锁
      HotType: 1, // 热门视频排序类型
      FeaturedType: 1, // 精选视频排序类型
      ScreenHeight: document.body.clientHeight, // 屏幕高度
      CollectId: null, // 收藏id
      NetSpeed: 0, // 网速估算值
      MainNavBgActive: false, // MainNav背景板透明开关：true-非透明 false-透明
      ColumnList: this.ArrayRegroup(window.HomeVideoList || MockData.HomeVideoList, 'order') // 主页分类数据
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      ViewingHistory: x => x.ViewingHistory, // 用户浏览历史列表
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    }),
    ...mapSearchState({
      ClassVideoList: x => x.ClassVideoList // 最新视频列表
    }),
    ...mapMediaState({
      HomeBannerList: x => x.HomeBannerList, // banner列表
      VideoRecommendList: x => x.VideoRecommendList, // 推荐视频列表
      FeaturedVideoList: x => x.FeaturedVideoList, // 精选视频列表
      HomePieceGroupList: x => x.HomePieceGroupList, // 首页播单列表
      HomeChannelList: x => x.HomeChannelList, // 首页频道列表
      HotVideoList: x => x.HotVideoList // 热门视频列表
    })
  },
  created () {
    this.GetSearchFilter().then((res) => { // 获取分类
      if (res.data.code - 0 === 0) {
        this.ClassList = res.data.data.typeList.slice(1) || []
      }
    })
    this.ToGetFeaturedVideoList()
    this.ToGetHotVideoList()
    this.ToGetVideoRecommend()
    this.GetHomePieceGroup({ params: { pageNum: 1, pageSize: 30 } })
    this.GetHomeChannel({ params: { size: 8 } })
    this.GetHomeBanner()
    this.ToGetClassVideoList()
  },
  mounted () {
    this.$nextTick(() => {
      window.onresize = () => {
        this.ScreenHeight = document.body.clientHeight // 屏幕高度
      }
    })
  },
  methods: {
    ...mapMediaActions([
      'GetFeaturedVideoList',
      'GetHotVideoList',
      'GetVideoRecommend',
      'GetHomePieceGroup',
      'GetHomeChannel',
      'GetHomeBanner',
      'GetClassVideoList'
    ]),
    ...mapMediaMutations([
      'EmptyFeaturedVideoList',
      'EmptyHotdVideoList',
      'EmptyVideoRecommend'
    ]),
    ...mapUserActions([
      'AddWatchLater',
      'CancelWatchLater',
      'GetViewingHistory',
      'AddPieceGroupSubItem',
      'CollectPieceGroup'
    ]),
    ...mapSearchActions([
      'GetClassVideoList',
      'GetSearchFilter'
    ]),
    ...mapSearchMutations([
      'EmptyClassVideoList'
    ]),
    ...mapUserMutations([
      'EmptyViewingHistory'
    ]),
    PageChange () {
      window.open('./videoindex.html?pages=2', '_self')
    },
    LinkTo (url) {
      if (url !== null) {
        window.open(url, '_self')
      }
    },
    LinkToMore (type) { // 去更多页面
      if (type === 'history') {
        if (this.UserInfo !== null) {
          window.open('./users.html?type=4', '_self')
        } else {
          this.$refs.MainPage.Login()
        }
      } else {
        window.open(`./more.html?type=${type}`, '_self')
      }
    },
    AddToMyFavoriteSheet (e) { // 播单添加到收藏
      if (!this.DataLock) {
        this.DataLock = true
        this.CollectPieceGroup({
          params: { groupId: e, accountId: this.UserInfo.id }
        }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'Collect of success!'
          })
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    AddToMyFavorite (e) { // 添加到收藏
      this.CollectId = e
      this.ShowSaveToFavorites = true
    },
    MoveToSheet (e) { // 添加到片单回调
      if (!this.DataLock) {
        this.DataLock = true
        this.AddPieceGroupSubItem({
          params: { accountId: this.UserInfo.id, videoIds: this.CollectId, groupIds: this.MyPieceGroupList[e].id }
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
    AddToMyPlaylist (e) { // 添加到播单
      this.CollectId = e
      this.ShowSaveToPlaylist = true
    },
    PageNotify (e) { // 页面通知
      if (e.type === 'success') {
        this.$notify.success({
          title: 'success',
          message: e.value
        })
      } else {
        this.$notify.error({
          title: 'error',
          message: e.value
        })
      }
    },
    ToGetClassVideoList () { // 获取浏览历史列表
      this.EmptyClassVideoList()
      this.GetClassVideoList({ params: { ...this.PageData }, data: {} }).then((res) => {
        this.TotalNum = res.data.data.total - 0
      })
    },
    HotChange (e) { // 热门视频排序切换
      this.HotType = e - 0
      this.ToGetHotVideoList()
    },
    FeaturedChange (e) { // 精选视频排序切换
      this.FeaturedType = e - 0
      this.ToGetFeaturedVideoList()
    },
    ToGetVideoRecommend () { // 获取推荐视频
      this.EmptyVideoRecommend()
      this.GetVideoRecommend({ pageNum: 1, pageSize: 30 })
    },
    ToGetHotVideoList () { // 获取热门视频
      this.EmptyHotdVideoList()
      window.setTimeout(() => {
        this.GetHotVideoList({ params: { pageNum: 1, pageSize: 30, type: this.HotType } })
      }, 300)
    },
    ToGetFeaturedVideoList () { // 获取精选视频
      this.EmptyFeaturedVideoList()
      window.setTimeout(() => {
        this.GetFeaturedVideoList({ params: { pageNum: 1, pageSize: 30, type: this.FeaturedType } })
      }, 300)
    },
    ToCollectVideo (e) { // 收藏视频
      this.CollectId = e
      this.ShowAddFolderPopup = true
    },
    MainPageScroll (e) { // 页面滚动事件
      window.clearTimeout(this.ScrollTimer)
      this.ScrollTimer = window.setTimeout(() => {
        this.MainNavBgActive = e >= document.body.clientHeight / 2 // 页面滚动距离>=100时，MainNav背景色非透明，反之透明
        // if (this.MainNavBgActive) {
        //   this.$refs.IndexLivePlayer.Play()
        //   this.$refs.IndexBanner.Pause()
        // } else {
        //   this.$refs.IndexLivePlayer.Pause()
        //   this.$refs.IndexBanner.Play()
        // }
      }, 300)
    },
    NetSpeedTestEnd (e) { // 网速估算结束回调
      this.NetSpeed = e
    },
    UserInfoChange () { // 用户信息更新
    },
    ArrayRegroup (arr, key) { // 一维数组转二维数组
      let aArray = []
      let aBool = true
      for (let n = 0; n < arr.length; n++) {
        if (aArray.length) {
          aBool = true
          for (let a = 0; a < aArray.length; a++) {
            if (arr[n][key] === aArray[a].id) {
              aArray[a].list.push(arr[n])
              aBool = false
            }
          }
          if (aBool) {
            aArray.push({ id: arr[n][key], list: [arr[n]] })
          }
        } else {
          aArray.push({ id: arr[n][key], list: [arr[n]] })
        }
      }
      return aArray
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
