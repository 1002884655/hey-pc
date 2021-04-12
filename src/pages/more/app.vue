<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange">
      <div>
        <div class="PageContainer">

          <!-- nav -->
          <div class="NavContainer" v-if="Type !== 'playlist'">
            <IndexClassNav></IndexClassNav>
          </div>

          <!-- 标题 -->
          <div class="Title">
            <span>{{Type === 'mostliked' ? 'Most liked' : Type === 'recommend' ? 'Recommended' : Type === 'featuredvideos' ? 'Popular' : 'Newest'}}</span>
          </div>

          <!-- 过滤器 -->
          <!-- <div class="Filter flex-h" v-if="Type === 'mostliked' || Type === 'featuredvideos'">
            <nav class="flex-item">
              <a v-for="(item, index) in NavList" :key="index" :class="{'active': item.Id - 0 === CurrentNavId - 0}" @click="CutNav(item)">{{item.Name}}</a>
            </nav>
            <span></span>
          </div> -->

          <!-- 过渡 -->
          <ul class="LoadingList1" v-if="(Type === 'mostliked' || Type === 'recommend' || Type === 'featuredvideos' || Type === 'newest') && !PageList.length">
            <li v-for="(item, index) in 15" :key="index">
              <div class="Img"></div>
              <div class="LineContainer">
                <div class="Line"></div>
                <div class="Line"></div>
                <div class="Line"></div>
              </div>
            </li>
          </ul>

          <!-- 列表 -->
          <ul class="List1" v-if="(Type === 'mostliked' || Type === 'recommend' || Type === 'featuredvideos' || Type === 'newest') && PageList.length">
            <li v-for="(item, index) in PageList" :style="{zIndex: PageList.length - index}" :key="index">
              <MainVideoListItem :data="item" :WatchLater="item.WatchLater" :Index="index" :ShowGif="ShowIndex === index" StyleType="Default" :MoreTipsAlign="(index + 1) % 5 === 0 ? 'left' : 'right'" @ShowGifIndex="ShowGifIndex" @TriggerWatchLater="ToAddWatchLater" @NeedLogin="$refs.MainPage.Login()" @SaveToFavorite="AddToMyFavorite(item)" @SaveToPlaylist="AddToMyPlaylist(item)"></MainVideoListItem>
            </li>
          </ul>

          <ul class="List2" v-if="Type === 'playlist' && PageList.length">
            <li v-for="(item, index) in PageList" :key="index">
              <a class="Img" :href="`./video.html?type=4&sheet=${item.id}`" target="_self">
                <img :src="item.cover" class="centerLabel cover" alt="">
                <div class="Layer">
                  <div class="centerLabel">
                    <span>{{item.videoNum}}</span>
                    <i class="iconfont iconpiandan"></i>
                  </div>
                </div>
                <div class="PlayAll">
                  <a class="Bg" :href="`./video.html?type=4&sheet=${item.id}`" target="_self"></a>
                  <a class="centerLabel" :href="`./video.html?type=4&sheet=${item.id}`" target="_self">
                    <i class="iconfont iconbofang"></i>
                    <span>PLAY ALL</span>
                  </a>
                </div>
              </a>
              <div>
                <div class="Title flex-h">
                  <a class="flex-item" :href="`./video.html?type=4&sheet=${item.id}`" target="_self">{{item.name}}</a>
                  <a class="iconfont iconsandian1" @click.stop="PlaylistItemClick(index)"></a>
                  <div class="Tips PlaylistItem">
                    <a @click="AddToMyFavoriteSheet(item)">Save playlist</a>
                  </div>
                  <!-- <span></span> -->
                </div>
                <a :href="`./userspace.html?key=${item.upId}`" target="_self">{{item.upName}}</a>
                <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
              </div>
            </li>
          </ul>

          <!-- 分页器 -->
          <div class="Pagination" v-if="Total">
            <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
          </div>

          <!-- 片单操作弹窗 -->
          <PlaylistSetPopup ref="PlaylistSetPopup" v-if="UserInfo !== null && ShowSaveToPlaylist" :Ids="[CollectId]" @Close="ShowSaveToPlaylist = false"></PlaylistSetPopup>

          <!-- 收藏夹弹窗 -->
          <VideoCollectFolderMove v-if="ShowAddFolderPopup" :CollectId="CollectId" @Close="ShowAddFolderPopup = false"></VideoCollectFolderMove>

          <!-- 片单弹窗 -->
          <UserForMySheetVideosCopy v-if="ShowMoveFolderPopup" Title="Copy to other sheet" @Change="MoveToSheet" @Close="ShowMoveFolderPopup = false"></UserForMySheetVideosCopy>

          <SaveToFavorites ref="SaveToFavorites" :Ids="CollectId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false"></SaveToFavorites>

          <!-- <SaveToPlaylist ref="SaveToPlaylist" :Ids="[CollectId]" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false"></SaveToPlaylist> -->

        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  more页面
*/
import Vue from 'vue'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
import MainPage from '../../components/MainPage'
import IndexClassNav from '../../components/IndexClassNav'
import VideoCollectFolderMove from '../../components/VideoCollectFolderMove'
import UserForMySheetVideosCopy from '../../components/UserForMySheetVideosCopy'
import MainVideoListItem from '../../components/MainVideoListItem'
import SaveToFavorites from '../../components/SaveToFavorites'
import SaveToPlaylist from '../../components/SaveToPlaylist'
import PlaylistSetPopup from '../../components/PlaylistSetPopup'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapState: mapMediaState, mapActions: mapMediaActions, mapMutations: mapMediaMutations } = createNamespacedHelpers('media')
const { mapState: mapSearchState, mapActions: mapSearchActions, mapMutations: mapSearchMutations } = createNamespacedHelpers('search')
export default {
  components: {
    'el-pagination': Pagination,
    MainPage,
    IndexClassNav,
    VideoCollectFolderMove,
    UserForMySheetVideosCopy,
    MainVideoListItem,
    SaveToFavorites,
    SaveToPlaylist,
    PlaylistSetPopup
  },
  data () {
    return {
      ShowSaveToPlaylist: false,
      ShowSaveToFavorites: false,
      CollectId: null,
      ShowAddFolderPopup: false,
      ShowMoveFolderPopup: false,
      ShowIndex: null,
      DataLock: false,
      TypeList: ['mostliked', 'recommend', 'featuredvideos', 'playlist', 'newest'],
      PageList: [],
      Type: this.ToolClass.GetUrlParams('type') || 'mostliked',
      CurrentNavId: '1',
      NavList: [
        { Name: 'Hot day', Id: '1' },
        { Name: 'Hot week', Id: '2' },
        { Name: 'Hot month', Id: '3' }
      ],
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') || 1,
        pageSize: 15
      },
      Total: 0
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      ViewingHistory: x => x.ViewingHistory, // 用户浏览历史列表
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    }),
    ...mapMediaState({
      VideoRecommendList: x => x.VideoRecommendList, // 推荐视频列表
      FeaturedVideoList: x => x.FeaturedVideoList, // 精选视频列表
      HomePieceGroupList: x => x.HomePieceGroupList, // 首页播单列表
      HotVideoList: x => x.HotVideoList // 热门视频列表
    }),
    ...mapSearchState({
      ClassVideoList: x => x.ClassVideoList // 分类视频列表
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.MainPage.ShowLeftMenu = true
      this.ToolClass.WindowClick(() => {
        let ItemArr = document.getElementsByClassName('PlaylistItem')
        for (let n = 0; n < ItemArr.length; n++) {
          ItemArr[n].style.display = 'none'
        }
      })
    })
  },
  methods: {
    ...mapMediaActions([
      'GetFeaturedVideoList',
      'GetHotVideoList',
      'GetVideoRecommend',
      'GetHomePieceGroup',
      'PopularMore',
      'NewestMore',
      'MostLikeMore'
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
    ...mapUserMutations([
      'EmptyViewingHistory'
    ]),
    ...mapSearchMutations([
      'EmptyClassVideoList',
      'EditClassVideoList'
    ]),
    ...mapSearchActions([
      'GetClassVideoList'
    ]),
    PlaylistItemClick (index) {
      document.getElementsByClassName('PlaylistItem')[index].style.display = 'block'
    },
    ToAddWatchLater (e) { // 添加稍后观看（可取消）
      if (e.type === 'Add') {
        this.PageList[e.index].WatchLater = true
        this.$notify.success({ title: 'success', message: 'Saved to watch later' })
      } else {
        this.PageList[e.index].WatchLater = false
        this.$notify.success({ title: 'success', message: 'Removed from watch later' })
      }
    },
    ShowGifIndex (e) {
      this.ShowIndex = e
    },
    AddToMyFavoriteSheet (item) { // 播单添加到收藏
      if (!this.DataLock) {
        this.DataLock = true
        this.CollectPieceGroup({
          params: { groupId: item.id, accountId: this.UserInfo.id }
        }).then(() => {
          this.$notify.success({
            title: 'success',
            message: `Saved ${item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}`
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
    CutNav (item) {
      if (!this.DataLock && this.CurrentNavId - 0 !== item.Id - 0) {
        this.CurrentNavId = item.Id
        this.PageData.pageNum = 1
        this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
        if (this.Type === 'mostliked') { // 热门视频
          this.ToMostLikeMore()
        } else if (this.Type === 'recommend') { // 推荐视频
          this.ToGetVideoRecommend()
        } else if (this.Type === 'featuredvideos') { // 精选视频
          this.ToPopularMore()
        }
      }
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
    AddToMyFavorite (item) {
      this.CollectId = item.videoId
      this.ShowSaveToFavorites = true
    },
    AddToMyPlaylist (item) {
      this.CollectId = item.videoId
      this.ShowSaveToPlaylist = true
    },
    PageChange (e) {
      this.PageData.pageNum = e
      if (this.Type === 'mostliked') { // 热门视频
        this.ToMostLikeMore()
      } else if (this.Type === 'recommend') { // 推荐视频
        this.ToGetVideoRecommend()
      } else if (this.Type === 'featuredvideos') { // 精选视频
        this.ToPopularMore()
      } else if (this.Type === 'playlist') { // 首页片单
        this.ToGetHomePieceGroup()
      } else if (this.Type === 'newest') { // 最新视频
        this.ToNewestMore()
      }
    },
    CheckLogin (callback) { // 检验登录
      if (this.UserInfo !== null) { // 用户已登录
        callback()
      } else { // 用户未登录
        this.$emit('NeedLogin')
      }
    },
    AddToWatchLater (item, index) { // 添加稍后观看（不取消）
      this.CheckLogin(() => {
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定
          this.AddWatchLater({ params: { videoId: item.videoId, accountId: this.UserInfo.id } }).then((res) => {
            this.DataLock = false // 数据解锁
            if (res.data.code - 0 === 2056) {
              this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                close()
                window.open(`./users.html?type=5`, '_self')
              }, 'Immediately to')
            }
            if (res.data.code - 0 === 0) {
              this.PageList[index].WatchLater = true
              this.$notify.success({
                title: 'success',
                message: res.data.msg
              })
            }
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
      })
    },
    Init () {
      let Bool = true
      this.TypeList.map((item) => {
        if (item === this.ToolClass.GetUrlParams('type')) {
          Bool = false
        }
      })
      if (Bool) {
        this.ToolClass.ChangeUrlParams([{ name: 'type', value: this.TypeList[0] }, { name: 'pages', value: 1 }])
      }
      if (this.ToolClass.GetUrlParams('pages') === false) {
        this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
      }
      if (this.Type === 'mostliked') { // 热门视频
        this.ToMostLikeMore()
      } else if (this.Type === 'recommend') { // 推荐视频
        this.ToGetVideoRecommend()
      } else if (this.Type === 'featuredvideos') { // 精选视频
        this.ToPopularMore()
      } else if (this.Type === 'playlist') { // 首页片单
        this.ToGetHomePieceGroup()
      } else if (this.Type === 'newest') { // 最新视频
        this.ToNewestMore()
      }
    },
    ToMostLikeMore () { // 最多播放视频列表
      if (!this.DataLock) {
        this.DataLock = true
        this.PageList = []
        this.MostLikeMore({ params: { ...this.PageData } }).then((res) => {
          this.Total = res.data.data.total
          this.PageData.pageNum = res.data.data.pageNum
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum || 1 }])
          let Arr = res.data.data.list || []
          Arr.map((item) => {
            item.WatchLater = false
          })
          this.PageList = Arr || []
          this.DataLock = false
        }).catch((res) => {
          this.DataLock = false
        })
      }
    },
    ToNewestMore () { // 最新视频列表
      if (!this.DataLock) {
        this.DataLock = true
        this.PageList = []
        this.NewestMore({ params: { ...this.PageData } }).then((res) => {
          this.Total = res.data.data.total
          this.PageData.pageNum = res.data.data.pageNum
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum || 1 }])
          let Arr = res.data.data.list || []
          Arr.map((item) => {
            item.WatchLater = false
          })
          this.PageList = Arr || []
          this.DataLock = false
        }).catch((res) => {
          this.DataLock = false
        })
      }
    },
    ToPopularMore () { // 最受欢迎视频列表
      if (!this.DataLock) {
        this.DataLock = true
        this.PageList = []
        this.PopularMore({ params: { ...this.PageData } }).then((res) => {
          this.Total = res.data.data.total
          this.PageData.pageNum = res.data.data.pageNum
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum || 1 }])
          let Arr = res.data.data.list || []
          Arr.map((item) => {
            item.WatchLater = false
          })
          this.PageList = Arr || []
          this.DataLock = false
        }).catch((res) => {
          this.DataLock = false
        })
      }
    },
    ToGetHomePieceGroup () { // 获取首页片单
      if (!this.DataLock) {
        this.DataLock = true
        this.PageList = []
        this.GetHomePieceGroup({ params: { ...this.PageData } }).then((res) => {
          this.Total = res.data.data.total
          this.PageData.pageNum = res.data.data.pageNum
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum || 1 }])
          this.PageList = this.HomePieceGroupList.slice(0)
          this.DataLock = false
        }).catch((res) => {
          this.DataLock = false
        })
      }
    },
    ToGetHotVideoList (orderBy = 4) { // 获取热门视频
      if (!this.DataLock) {
        this.DataLock = true
        this.PageList = []
        this.EmptyClassVideoList()
        window.setTimeout(() => {
          this.GetClassVideoList({
            params: { ...this.PageData, orderBy },
            data: {}
          }).then((res) => {
            this.Total = res.data.data.total
            this.PageData.pageNum = res.data.data.pageNum
            this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum || 1 }])
            this.PageList = this.ClassVideoList.slice(0)
            this.DataLock = false
          }).catch((res) => {
            this.DataLock = false
          })
        }, 300)
      }
    },
    ToGetVideoRecommend () { // 获取推荐视频
      if (!this.DataLock) {
        this.DataLock = true
        this.PageList = []
        window.setTimeout(() => {
          this.GetVideoRecommend({ ...this.PageData }).then((res) => {
            this.Total = res.data.data.total
            this.PageData.pageNum = res.data.data.pageNum
            this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum || 1 }])
            this.PageList = this.VideoRecommendList.slice(0)
            this.DataLock = false
          }).catch((res) => {
            this.DataLock = false
          })
        }, 300)
      }
    },
    ToGetFeaturedVideoList () { // 获取精选视频
      if (!this.DataLock) {
        this.DataLock = true
        this.PageList = []
        this.EmptyClassVideoList()
        window.setTimeout(() => {
          this.GetClassVideoList({
            params: { ...this.PageData, orderBy: 2 },
            data: {}
          }).then((res) => {
            this.Total = res.data.data.total
            this.PageData.pageNum = res.data.data.pageNum
            this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum || 1 }])
            this.PageList = this.ClassVideoList.slice(0)
            this.DataLock = false
          }).catch((res) => {
            this.DataLock = false
          })
          // this.GetFeaturedVideoList({ params: { ...this.PageData, type: this.CurrentNavId } }).then((res) => {
          //   this.Total = res.data.data.total
          //   this.PageData.pageNum = res.data.data.pageNum
          //   this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum || 1 }])
          //   this.PageList = this.FeaturedVideoList.slice(0)
          //   this.DataLock = false
          // }).catch((res) => {
          //   this.DataLock = false
          // })
        }, 300)
      }
    },
    UserInfoChange () {
      this.Init()
    },
    LinkToMedia (id) { // 跳转到视频页
      window.open(`./video.html?key=${id}`, '_self')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
