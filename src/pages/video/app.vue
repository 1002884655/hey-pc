<template>
  <div id="app" :class="{'WhitePage': ShowError}">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange" @NetSpeedTestEnd="NetSpeedTestEnd" :Show="!IsFullWindow">
      <div class="PlayPageContainer flex-h" style="width: calc(100% - 200px); min-width: 1000px; margin: 0 auto; padding-bottom: 30px; padding-top: 69px; position: relative; overflow: visible;" ref="PlayPageContainer" v-if="MediaInfo !== null && MediaInfo.video !== null && !ShowError">

        <!-- 稍后观看列表区域 -->
        <!-- <div class="WatchLaterContainer" v-if="WatchLaterVideoList.length">
          <VideoPlayerList ref="WatchLaterList" Title="Watch later" :List="WatchLaterVideoList" @Change="VideoPlayerListChange"></VideoPlayerList>
        </div> -->

        <!-- 收藏列表区域 -->
        <!-- <div class="WatchLaterContainer" v-if="VideoCollectList.length">
          <VideoPlayerList ref="WatchLaterList" :List="VideoCollectList" @Change="VideoPlayerListChange"></VideoPlayerList>
        </div> -->

        <!-- 片单列表区域 -->
        <!-- <div class="WatchLaterContainer" v-if="MyPieceGroupSubList.length">
          <VideoPlayerList ref="WatchLaterList" :List="MyPieceGroupSubList" @Change="VideoPlayerListChange"></VideoPlayerList>
        </div> -->

        <!-- 专辑列表区域 -->
        <!-- <div class="WatchLaterContainer" v-if="VideoAlbumSubList.length">
          <VideoPlayerList ref="WatchLaterList" :List="VideoAlbumSubList" @Change="VideoPlayerListChange"></VideoPlayerList>
        </div> -->

        <!-- 左侧内容 -->
        <div class="PageLeft flex-item">

          <!-- 播放区域 -->
          <div class="PlayerContainer flex-h">
            <div class="flex-item">

              <!-- 播放器 -->
              <div class="PlayerArea">
                <div>
                  <div v-if="!IsPrivacy && IsFree" class="PlayerBorder" :class="{'active': IsMiniPlayer && MiniLock, 'IsFullWindow': IsFullWindow, 'DragPlayerBorder': IsMiniPlayer && MiniLock}">
                    <HeyPornPlayer :IsFree="IsFree" ref="HeyPornPlayer" :class="{'mini': IsMiniPlayer && MiniLock, 'ShowMiniClose': IsMiniPlayer}" v-if="MediaSrcList.length && CapacityActiveIndex !== null" @Start="PlayerStart" :OnFocus="PlayerFocus" :activeIndex="CapacityActiveIndex" :srcList="MediaSrcList" :FrontPath="MediaInfo.video.gifPath" @TriggerFullWindow="TriggerFullWindow" :IsFullWindow="IsFullWindow" @ExitMini="ExitMini" @Next="NextMedia" @PositionChange="PlayerDrag" @PositionChangeEnd="PlayerDragEnd" @Ended="PlayerEnded"></HeyPornPlayer>
                  </div>
                  <div v-if="IsPrivacy" class="IsPrivacy">
                    <div class="centerLabel">
                      <i class="iconfont iconsuo1"></i>
                      <span>Privacy Video</span>
                    </div>
                  </div>
                  <div v-if="!IsFree" class="IsFree">
                    <HeyPornPlayer :IsFree="IsFree" ref="HeyPornPlayer" :class="{'mini': IsMiniPlayer && MiniLock, 'ShowMiniClose': IsMiniPlayer}" v-if="MediaSrcList.length && CapacityActiveIndex !== null" @Start="PlayerStart" :OnFocus="PlayerFocus" :activeIndex="CapacityActiveIndex" :srcList="MediaSrcList" :FrontPath="MediaInfo.video.gifPath" @TriggerFullWindow="TriggerFullWindow" :IsFullWindow="IsFullWindow" @ExitMini="ExitMini" @Next="NextMedia" @PositionChange="PlayerDrag" @PositionChangeEnd="PlayerDragEnd" @Ended="PlayerEnded"></HeyPornPlayer>
                    <!-- <ProvedVideoPlayer v-if="ProvedVideoSrc !== null" :Src="ProvedVideoSrc"></ProvedVideoPlayer> -->
                    <div class="Layer" :class="{'active': ShowPayLayer}">
                      <div class="centerLabel">
                        <div class="Cover">
                          <img :src="MediaInfo.video.frontPath || MediaInfo.video.front" class="centerLabel cover" alt="">
                        </div>
                        <span>{{MediaInfo.video.title}}</span>
                        <a v-if="UserInfo === null || UserInfo.userType - 0 === 1" @click="ToPayForVideo" :class="{'active': !PayLock}">$ {{MediaInfo.video.price}}</a>
                      </div>
                      <!-- <a class="iconfont" :class="[ShowPayLayer ? 'iconjiantouright' : 'iconjiantouleft']" @click="ShowPayLayer = !ShowPayLayer"></a> -->
                    </div>
                  </div>
                </div>
              </div>

              <!-- 播放区域底部信息 -->
              <div class="BottomInfo flex-h">
                <a :class="{'active': HasLiked}" @click="GaveLikeForVideo"><i class="iconfont icondianzan"></i><span>{{LikeNum}}</span></a>
                <a :class="{'active': HasCollected}" @click="AddTo" class="Collect"><i class="iconfont iconshoucang-"></i><span>{{CollectNum}}</span></a>
                <a @click="ShareVideo"><i class="iconfont iconfenxiang"></i><span>Share</span></a>
                <a class="AddTo" @click="SaveTo">
                  <i class="iconfont iconyemian"></i>
                  <span>Save to</span>
                </a>
                <div class="flex-item"></div>
                <a href="#CommentMarkId"><i class="iconfont iconpinglun-"></i><span>Comment</span></a>
              </div>
            </div>

          </div>

          <!-- 推荐及评论 -->
          <div class="RecommendAndComment flex-h">
            <div class="flex-item">

              <!-- 视频更多信息 -->
              <div class="VideoMoreInfo">
                <VideoMoreInfo :MediaInfo="MediaInfo" @ToLogin="$refs.MainPage.Login()" ref="VideoMoreInfo" @JoinFansClub="JoinFansClub"></VideoMoreInfo>
              </div>

              <!-- 演职员表 -->
              <!-- <PlayerActorList :MediaInfo="MediaInfo"></PlayerActorList> -->

              <!-- 推荐列表 -->
              <!-- <PlayerRecommendX :List="VideoRecommendList.slice(10, 8)" v-if="VideoRecommendList.slice(10, 8).length"></PlayerRecommendX> -->

              <!-- 评论列表 -->
              <div class="CommentListContainer">
                <PlayerComment ref="PlayerComment" @ToLogin="$refs.MainPage.Login()" :data="MediaInfo.video"></PlayerComment>
              </div>

              <!-- 推荐列表 -->
              <PlayerRecommendX :List="VideoRecommendList.slice(10, 8)" v-if="VideoRecommendList.slice(10, 8).length"></PlayerRecommendX>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="PageRight">

          <!-- 播放器右侧推荐区域 -->
          <div class="PlayerRecommend">
            <!-- <div class="flex-item">
              <div>
                <ScrollY :Size="`small`">
                  <span class="NextVideoTitle" v-if="!WatchLaterVideoList.length && !VideoCollectList.length && !MyPieceGroupSubList.length && !VideoAlbumSubList.length">Up next</span>
                  <div v-else style="width: 100%; height: 10px;"></div>
                  <PlayerRecommendY v-if="VideoRecommendList.length" :List="VideoRecommendList.slice(0, 10)"></PlayerRecommendY>
                </ScrollY>
              </div>
            </div> -->
            <NewVideoPlayerList ref="NewVideoPlayerList" v-if="MediaInfo !== null && (ToolClass.GetUrlParams('type') - 0 === 2 || ToolClass.GetUrlParams('type') - 0 === 4)" :UpId="MediaInfo.video.upId" :MaxHeight="RightHeight" @Change="VideoPlayerListChange" @Login="$refs.MainPage.Login()"></NewVideoPlayerList>
          </div>

          <!-- Hot List -->
          <div class="HotList">
            <div class="Title flex-h">
              <span class="flex-item">Liked list</span>
              <!-- <a>All</a> -->
            </div>
            <PlayerRecommendY :List="HotVideoListForDay"></PlayerRecommendY>
          </div>

        </div>

      </div>

      <div class="ShowCanNotPay" v-if="ShowCanNotPay && MediaInfo !== null">
        <div class="centerLabel">
          <div class="Title flex-h">
            <span class="flex-item">Heypron</span>
            <a class="iconfont iconguanbi" @click="ShowCanNotPay = false"></a>
          </div>
          <div class="Content">
            <div>
              <span>Pay now to support</span>
              <a>{{MediaInfo.video.upName}}</a>
            </div>
            <div class="flex-h">
              <div class="Img">
                <div>
                  <img :src="MediaInfo.video.frontPath" class="centerLabel cover" alt="">
                </div>
              </div>
              <div class="flex-item flex-v">
                <span>{{MediaInfo.video.title}}</span>
                <span>${{MediaInfo.video.price}}</span>
                <div class="flex-item"></div>
                <a @click="ToBuyVideo" :class="{'active': !PayLock}">Pay now ${{MediaInfo.video.price}}</a>
              </div>
            </div>
            <span class="Tips">A charge will appear on your statement as settlement bill.</span>
            <span class="Tips">*All purchases are final and in US$ unless otherwise stated. See terms and conditions.</span>
          </div>
        </div>
      </div>

      <!-- 404页面 -->
      <div class="ErrorContainer" v-if="ShowError">
        <ErrorPage></ErrorPage>
      </div>

      <!-- 片单操作弹窗 -->
      <PlaylistSetPopup ref="PlaylistSetPopup" v-if="UserInfo !== null && ShowPlaylistSetPopup" :Ids="[CollectId]" @Close="ShowPlaylistSetPopup = false"></PlaylistSetPopup>

      <SaveToFavorites ref="SaveToFavorites" :Ids="CollectId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false" @Change="FavoriteChange"></SaveToFavorites>

      <SaveToPlaylist ref="SaveToPlaylist" :Ids="[CollectId]" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false" :ShowSaveToWatchLater="true"></SaveToPlaylist>

      <!-- 转移收藏夹弹窗 -->
      <VideoCollectFolderMove v-if="ShowAddFolderPopup" :CollectId="CollectId" @Close="ShowAddFolderPopup = false" @Success="HasCollected = true; CollectNum += 1"></VideoCollectFolderMove>

    </MainPage>

    <PayForFansClubPopup :PageUserInfo="PageUserInfo" v-if="ShowPayForFansClubPopup" @Close="ShowPayForFansClubPopup = false" @Join="$refs.VideoMoreInfo.JoinClubStatus = 1"></PayForFansClubPopup>
  </div>
</template>

<script>
/*
  页面名称：视频播放页
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2020/04/13
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import MainPage from '../../components/MainPage'
import ScrollY from '../../components/ScrollY'
import PlaylistSetPopup from '../../components/PlaylistSetPopup'
import PlayerRecommendY from '../../components/PlayerRecommendY'
import PlayerRecommendX from '../../components/PlayerRecommendX'
import VideoMoreInfo from '../../components/VideoMoreInfo'
import PlayerActorList from '../../components/PlayerActorList'
import PlayerComment from '../../components/PlayerComment'
import HeyPornPlayer from '../../components/HeyPornPlayer'
import ErrorPage from '../../components/ErrorPage'
import VideoCollectFolderMove from '../../components/VideoCollectFolderMove'
import VideoPlayerList from '../../components/VideoPlayerList'
import Popup from '../../components/Popup'
import SaveToFavorites from '../../components/SaveToFavorites'
import SaveToPlaylist from '../../components/SaveToPlaylist'
import PayForFansClubPopup from '../../components/PayForFansClubPopup'
import ProvedVideoPlayer from '../../components/ProvedVideoPlayer'
import NewVideoPlayerList from '../../components/NewVideoPlayerList'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapState: mapMediaState, mapActions: mapMediaActions, mapMutations: mapMediaMutations } = createNamespacedHelpers('media')
const { mapActions: mapPlaylistActions } = createNamespacedHelpers('playlist')
export default {
  components: {
    MainPage,
    ScrollY,
    PlayerRecommendY,
    PlayerRecommendX,
    VideoMoreInfo,
    PlayerActorList,
    PlayerComment,
    HeyPornPlayer,
    ErrorPage,
    VideoCollectFolderMove,
    VideoPlayerList,
    Popup,
    SaveToFavorites,
    SaveToPlaylist,
    PayForFansClubPopup,
    ProvedVideoPlayer,
    NewVideoPlayerList,
    PlaylistSetPopup
  },
  data () {
    return {
      VideoIds: [],
      ShowPlaylistSetPopup: false,
      RightHeight: 0,
      RightHeightTimer: null,
      ProvedVideoSrc: null,
      PageUserInfo: null,
      ShowPayForFansClubPopup: false,
      ShowCanNotPay: false,
      PayLock: false,
      ShowPayLayer: true,
      ShowSaveToFavorites: false,
      ShowSaveToPlaylist: false,
      IsFree: false,
      IsPrivacy: false,
      WatchLaterNum: 0, // 用户稍后观看列表数量
      ShowAddList: false, // 显隐添加到弹窗状态
      CurrentFolderName: '', // 新建片单名称
      CurrentFolderDesc: '', // 新建片单介绍
      ShowEditFolderPopup: false, // 显隐新建片单弹窗
      HasAddtoWatchLater: false, // 是否加到过稍后观看
      VideoPlayerIsStart: false, // 视频开始播放
      CollectId: null, // 收藏id
      ShowAddFolderPopup: false, // 显隐添加收藏状态
      HasCollected: false, // 是否已收藏
      HasLiked: false, // 是否已点赞
      LikeNum: null, // 点赞数
      CollectNum: null, // 收藏数
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
      UserInfo: x => x.UserInfo, // 用户信息
      WatchLaterVideoList: x => x.WatchLaterVideoList, // 稍后观看列表
      MyPieceGroupList: x => x.MyPieceGroupList, // 用户所有视频片单列表
      MyPieceGroupSubList: x => x.MyPieceGroupSubList, // 片单下视频列表
      VideoCollectList: x => x.VideoCollectList, // 收藏夹下视频列表
      VideoAlbumSubList: x => x.VideoAlbumSubList // 专辑下视频列表
    }),
    ...mapMediaState({
      MediaInfo: x => x.MediaInfo, // 视频信息
      VideoRecommendList: x => x.VideoRecommendList, // 推荐视频列表
      HotVideoListForDay: x => x.HotVideoListForDay // 视频日排行
    })
  },
  created () {
    this.ToolClass.WindowClick(() => {
      this.PlayerFocus = false
    })
    window.clearInterval(this.Timer)
    this.Timer = null
  },
  mounted () {
    this.$nextTick(() => {
      this.MainPageScroll()
      this.$refs.MainPage.ShowLeftMenu = true
      this.WindowResizeInit()
    })
  },
  methods: {
    ...mapMediaActions([
      'GetAccountVideoCollection',
      'GetMediaInfoById',
      'GetVideoRecommend',
      'GetHotVideoListForDay'
    ]),
    ...mapMediaMutations([
      'EmptyAccountVideoCollection',
      'EditMediaInfo'
    ]),
    ...mapUserActions([
      'CreateOrder',
      'PayForVideo',
      'UserGaveLikeForVideo',
      'AddCollect',
      'GetVideoStatus',
      'GetWatchLaterVideoList',
      'VideoWatched',
      'VideoFinshed',
      'GetPieceGroupSubList',
      'GetVideoCollect',
      'GetAlbumPageVideos',
      'GetPieceGroup',
      'AddPieceGroupSubItem',
      'DeletePieceGroupSubItem',
      'AddWatchLater',
      'AddPieceGroup',
      'CancelWatchLater',
      'CancelVideoCollectForPlay',
      'GetWatchLaterNum'
    ]),
    ...mapUserMutations([
      'TriggerPieceGroupList'
    ]),
    ...mapPlaylistActions([
      'SaveToDefaultPlaylist',
      'RemoveFromDefaultPlaylist'
    ]),
    WindowResizeInit () {
      window.clearInterval(this.RightHeightTimer)
      this.RightHeightTimer = window.setInterval(() => {
        if (document.getElementsByClassName('PlayerArea')[0]) {
          window.clearInterval(this.RightHeightTimer)
          this.RightHeight = document.getElementsByClassName('PlayerArea')[0].getBoundingClientRect().height
          window.onresize = () => {
            this.RightHeight = document.getElementsByClassName('PlayerArea')[0].getBoundingClientRect().height
          }
        }
      }, 50)
    },
    JoinFansClub (e) {
      this.PageUserInfo = { ...e }
      this.ShowPayForFansClubPopup = true
    },
    ToBuyVideo () {
      if (this.UserInfo === null) {
        this.$refs.MainPage.Login()
        return false
      }
      // this.$notify.error({
      //   title: 'error',
      //   message: 'The payment function has not yet been opened, so stay tuned'
      // })
      if (this.PayLock) return
      this.PayLock = true
      this.CreateOrder({
        params: {
          accountId: this.UserInfo.id,
          productId: this.MediaInfo.video.videoId,
          orderMoney: this.MediaInfo.video.price,
          productType: 2
        }
      }).then((res) => {
        this.PayLock = false
        // window.location.href = `./order.html?orderId=${res.data.data.orderNo}`
        window.localStorage.OrderBackUrl = window.location.href
        window.localStorage.OrderType = 'pay'
        window.location.href = res.data.data.payUrl
      }).then((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
        this.PayLock = false
      })
    },
    ToPayForVideo () {
      if (this.UserInfo === null) {
        this.$refs.MainPage.Login()
      } else {
        this.ToBuyVideo()
      }
    },
    FavoriteChange (e) { // 收藏状态更新
      if (e.Type === 'AddVideo') { // 收藏
        this.CollectNum += 1
        this.HasCollected = true
      } else if (e.Type === 'Remove') { // 取消收藏
        this.CollectNum -= 1
        this.HasCollected = false
      }
    },
    AddTo () { // 添加到
      if (this.UserInfo !== null) { // 用户已登录
        // this.VideoIds = [this.MediaInfo.video.videoId]
        // this.ShowPlaylistSetPopup = true
        if (!this.DataLock) {
          this.DataLock = true
          if (this.HasCollected) {
            this.RemoveFromDefaultPlaylist({ params: { accountId: this.UserInfo.id, videoId: this.MediaInfo.video.videoId } }).then(() => {
              this.$notify.success({
                title: 'success',
                message: 'removed video'
              })
              this.CollectNum--
              this.HasCollected = false
              this.DataLock = false
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false
            })
          } else {
            this.SaveToDefaultPlaylist({ params: { accountId: this.UserInfo.id, videoId: this.MediaInfo.video.videoId } }).then((res) => {
              this.$notify.success({
                title: 'success',
                message: 'saved video'
              })
              this.CollectNum++
              this.HasCollected = true
              this.DataLock = false
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false
            })
          }
        }
      } else { // 用户未登录
        this.$refs.MainPage.Login()
      }
    },
    SaveTo () {
      if (this.UserInfo !== null) {
        this.CollectId = this.MediaInfo.video.videoId
        this.ShowPlaylistSetPopup = true
      } else {
        this.$refs.MainPage.Login()
      }
    },
    EditFolderPopupSure () { // 编辑片单确认操作
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        if (this.CurrentFolderName !== '') { // 片单名称判空
          let Bool = true
          this.MyPieceGroupList.map((item) => {
            if (item.name === this.CurrentFolderName) {
              Bool = false
            }
          })
          if (Bool) {
            this.AddPieceGroup({ data: { name: this.CurrentFolderName, accountId: this.UserInfo.id, description: this.CurrentFolderDesc } }).then(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
              this.ShowAddList = true
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
              this.ShowAddList = true
            })
          } else {
            this.$notify.error({
              title: 'error',
              message: 'Name already exists'
            })
          }
        }
      }
    },
    AddToWatchLater () { // 添加到稍后观看
      if (!this.DataLock) {
        this.DataLock = true
        if (!this.HasAddtoWatchLater) { // 添加
          this.AddWatchLater({ params: { videoId: this.MediaInfo.video.videoId, accountId: this.UserInfo.id } }).then((res) => {
            this.DataLock = false // 数据解锁
            if (res.data.code - 0 === 2056) {
              this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                close()
                window.open(`./users.html?type=5`, '_self')
              }, 'Immediately to')
            }
            if (res.data.code - 0 === 0) {
              this.$notify.success({
                title: 'success',
                message: 'successfully added!'
              })
              this.HasAddtoWatchLater = true
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
        } else { // 取消添加
          this.CancelWatchLater({ params: { videoId: this.MediaInfo.video.videoId, accountId: this.UserInfo.id } }).then((res) => {
            this.$notify.success({
              title: 'success',
              message: 'successfully cancel!'
            })
            this.HasAddtoWatchLater = false
            this.DataLock = false // 数据解锁
          }).catch((res) => {
            this.DataLock = false // 数据解锁
          })
        }
      }
    },
    AddtoSheet (item, index) { // 添加到片单
      if (!this.DataLock) {
        this.DataLock = true
        if (!item.Active) { // 添加
          this.AddPieceGroupSubItem({
            params: { accountId: this.UserInfo.id, videoIds: this.MediaInfo.video.videoId, groupIds: item.id }
          }).then(() => {
            this.DataLock = false
            this.TriggerPieceGroupList({ index, value: !item.Active })
            this.$notify.success({
              title: 'success',
              message: 'Successfully added!'
            })
          }).catch((res) => {
            this.DataLock = false
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
          })
        } else { // 取消
          this.DeletePieceGroupSubItem({
            params: { accountId: this.UserInfo.id, videoIds: this.MediaInfo.video.videoId, groupId: item.id }
          }).then(() => {
            this.DataLock = false
            this.TriggerPieceGroupList({ index, value: !item.Active })
            this.$notify.success({
              title: 'success',
              message: 'Successfully delete!'
            })
          }).catch((res) => {
            this.DataLock = false
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
          })
        }
      }
    },
    PlayerStart () { // 视频播放开始
      if (!this.VideoPlayerIsStart) {
        this.VideoPlayerIsStart = true
        if (this.ToolClass.GetUrlParams('type') - 0 === 2) {
          this.VideoWatched({
            params: { videoId: this.MediaInfo.video.videoId, accountId: this.UserInfo.id }
          })
        }
      }
    },
    PlayerEnded () { // 视频播放结束
      this.VideoFinshed({
        params: { videoId: this.MediaInfo.video.videoId, accountId: this.UserInfo.id }
      }).then(() => {
        // if (this.$refs.WatchLaterList) {
        //   this.$refs.WatchLaterList.Next()
        // } else {
        //   window.location.href = `../video.html?key=${this.VideoRecommendList[0].videoM}`
        // }
        if (this.ToolClass.GetUrlParams('type') - 0 === 2 || this.ToolClass.GetUrlParams('type') - 0 === 4) {
          this.$refs.NewVideoPlayerList.Next()
        }
      }).catch(() => {
        // if (this.$refs.WatchLaterList) {
        //   this.$refs.WatchLaterList.Next()
        // } else {
        //   window.location.href = `../video.html?key=${this.VideoRecommendList[0].videoM}`
        // }
        if (this.ToolClass.GetUrlParams('type') - 0 === 2 || this.ToolClass.GetUrlParams('type') - 0 === 4) {
          this.$refs.NewVideoPlayerList.Next()
        }
      })
    },
    VideoPlayerListChange (e) { // 播单发生改变
      this.ToGetMediaInfo().then(() => {
        this.$refs.HeyPornPlayer.Cut()
        this.$refs.PlayerComment.Init()
        this.ToGetVideoRecommend() // 获取推荐视频
      })
    },
    ToCollectVideo () { // 收藏视频
      if (this.UserInfo !== null) { // 用户已登录
        if (this.HasCollected) { // 取消收藏
          if (!this.DataLock) {
            this.DataLock = true
            this.CancelVideoCollectForPlay({
              params: { videoId: this.MediaInfo.video.videoId, accountId: this.UserInfo.id }
            }).then(() => {
              this.$notify.success({
                title: 'success',
                message: 'Cancel the success!'
              })
              this.CollectNum = this.CollectNum > 0 ? this.CollectNum - 1 : 0
              this.HasCollected = false
              this.DataLock = false
            }).catch(() => {
              this.DataLock = false
            })
          }
        } else { // 收藏
          this.CollectId = this.MediaInfo.video.videoId
          this.ShowSaveToFavorites = true
        }
      } else { // 用户未登录
        this.$refs.MainPage.Login()
      }
    },
    ShareVideo () { // 分享视频
      this.$copyText(window.location.href)
      this.$notify.success({
        title: 'success',
        message: 'Copy the current address successfully!'
      })
    },
    ToGetVideoStatus () { // 获取视频是否收藏或喜欢
      this.GetVideoStatus({ params: { accountId: this.UserInfo.id, videoId: this.MediaInfo.video.videoId } }).then((res) => {
        if (res.data.code - 0 === 0) {
          this.HasCollected = res.data.data.collectStatus - 0 === 1
          this.HasLiked = res.data.data.likeStatus - 0 === 1
        }
      })
    },
    DataSubmit (callback) { // 数据提交
      if (this.UserInfo !== null) {
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定，防止多次触发
          callback()
        }
      } else {
        this.$refs.MainPage.Login()
      }
    },
    GaveLikeForVideo () { // 用户点赞
      if (!this.HasLiked) {
        this.DataSubmit(() => {
          this.UserGaveLikeForVideo({
            params: {
              accountId: this.UserInfo.id,
              videoId: this.MediaInfo.video.videoId
            }
          }).then(() => {
            this.HasLiked = true
            this.LikeNum += 1
            this.DataLock = false // 数据解锁
          })
        })
      }
    },
    PlayerDrag (e) { // 播放器拖拽
      let DragPlayerBorder = document.getElementsByClassName('DragPlayerBorder')[0]
      if (DragPlayerBorder) {
        let X = this.CurrentPlayerPosition[0] - e[0]
        let Y = this.CurrentPlayerPosition[1] - e[1]
        X = X < 8 ? 8 : X
        X = X > document.body.clientWidth - 400 ? document.body.clientWidth - 400 : X
        Y = Y < 0 ? 0 : Y
        Y = Y > document.body.clientHeight - 68 - 225 ? document.body.clientHeight - 68 - 225 : Y
        this.PlayerPositionDifferenceValue = [X, Y]
        DragPlayerBorder.style.right = `${this.PlayerPositionDifferenceValue[0]}px`
        DragPlayerBorder.style.bottom = `${this.PlayerPositionDifferenceValue[1]}px`
      }
    },
    PlayerDragEnd () { // 播放器拖拽停止
      this.CurrentPlayerPosition = this.PlayerPositionDifferenceValue.slice(0)
    },
    MainPageScroll () { // 页面滚动监听
      window.clearInterval(this.Timer)
      this.Timer = window.setInterval(() => {
        if (this.$refs.PlayPageContainer) {
          window.clearInterval(this.Timer)
          this.Timer = null
          this.CurrentPlayerPosition = [18, document.body.clientHeight - 68 - 225]
          let MainContainerWidth = this.$refs.PlayPageContainer.getBoundingClientRect().width
          let ScrollTopNum = (MainContainerWidth * 0.76 - 30) * 0.5625
          let HeyScroll = document.getElementById('MainPageScroll').firstElementChild
          HeyScroll.onscroll = () => {
            this.IsMiniPlayer = HeyScroll.scrollTop >= ScrollTopNum
            if (HeyScroll.scrollTop <= 400) {
              this.MiniLock = true
            }
          }
        }
      }, 30)
    },
    ToGetMediaInfo (callback = () => { }) { // 获取视频信息
      return new Promise((resolve, reject) => {
        this.GetMediaInfoById({
          id: this.ToolClass.GetUrlParams('key'),
          params: { accountId: this.UserInfo !== null ? this.UserInfo.id : null }
        }).then((res) => {
          if (this.MediaInfo !== null && this.MediaInfo.video !== null) {
            callback()
            this.$nextTick(() => {
              if (this.$refs.NewVideoPlayerList) {
                this.$refs.NewVideoPlayerList.UserInfoChange()
              }
            })
            // this.IsFree = this.MediaInfo.payVideo - 0 === 0 || (this.MediaInfo.payVideo - 0 === 1 && this.MediaInfo.payStatus - 0 === 1)
            this.IsFree = this.MediaInfo.video.playName !== '' && this.MediaInfo.video.playName !== null
            if (this.IsFree) {
              if (this.UserInfo === null) { // 游客状态下记录本地播放历史
                if (!this.$localStorage.get('heypornplayhistory')) {
                  this.$localStorage.set('heypornplayhistory', '[]')
                }
                let History = JSON.parse(this.$localStorage.get('heypornplayhistory'))
                let Key = this.ToolClass.GetUrlParams('key') - 0
                History.map((item, index) => {
                  if (Key === item.videoId - 0) {
                    History.splice(index, 1)
                  }
                })
                History.unshift({ ...this.MediaInfo.video, time: Date.now() })
                this.$localStorage.set('heypornplayhistory', JSON.stringify(History.slice(0, 100)))
              }
              if (res.data.code - 0 !== 2031) {
                this.IsPrivacy = false
                let Arr = []
                for (let n in JSON.parse(this.MediaInfo.video.capacity)) {
                  if (JSON.parse(this.MediaInfo.video.capacity)[n] - 0) {
                    Arr.push({
                      name: this.MediaInfo.video.title,
                      src: `${this.MediaInfo.video.videoPath}${n}/${this.MediaInfo.video.playName}.m3u8`,
                      id: n,
                      value: n - 0 === 1 ? '360P' : n - 0 === 2 ? '576P' : n - 0 === 4 ? '720P' : n - 0 === 8 ? '1080P' : n - 0 === 16 ? '2K' : n - 0 === 32 ? '4K' : '-P'
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
            } else { // 付费视频
              // this.MediaSrcList = [{
              //   name: this.MediaInfo.video.title,
              //   src: `${this.MediaInfo.video.videoPath}1/paid.m3u8`,
              //   id: 1,
              //   value: '360P'
              // }]
              // this.CapacityActiveIndex = 0
              // this.ProvedVideoSrc = `${this.MediaInfo.video.videoPath}1/paid.m3u8`
              if (res.data.code - 0 !== 2031) {
                let Arr = []
                for (let n in JSON.parse(this.MediaInfo.video.capacity)) {
                  if (JSON.parse(this.MediaInfo.video.capacity)[n] - 0) {
                    Arr.push({
                      name: this.MediaInfo.video.title,
                      src: `${this.MediaInfo.video.videoPath}${n}/paid.m3u8`,
                      id: n,
                      value: n - 0 === 1 ? '360P' : n - 0 === 2 ? '576P' : n - 0 === 4 ? '720P' : n - 0 === 8 ? '1080P' : n - 0 === 16 ? '2K' : n - 0 === 32 ? '4K' : '-P'
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
              }
            }
            this.$refs.VideoMoreInfo.UserInfoChange()
            this.LikeNum = this.MediaInfo.video.likeNum || 0
            this.CollectNum = this.MediaInfo.video.collectNum || 0
            this.EmptyAccountVideoCollection()
            this.GetAccountVideoCollection({ videoId: this.MediaInfo.video.videoId, upId: this.MediaInfo.video.upId })
            if (this.UserInfo !== null) {
              this.ToGetVideoStatus()
            } else {
              this.HasCollected = false
              this.HasLiked = false
            }
            resolve()
          } else {
            this.ShowError = true
          }
        })
      })
    },
    InitVideoInfo () {
      if (this.ToolClass.GetUrlParams('type') !== false) {
        let Type = this.ToolClass.GetUrlParams('type') - 0
        if (Type === 2) { // 稍后观看状态时请求稍后观看列表
          this.GetWatchLaterVideoList({ params: { pageNum: 1, pageSize: 100, accountId: this.UserInfo !== null ? this.UserInfo.id : null } }).then(() => {
            if (this.ToolClass.GetUrlParams('key') === false && this.WatchLaterVideoList.length) {
              this.ToolClass.ChangeUrlParams([{ name: 'key', value: this.WatchLaterVideoList[0].videoM }])
            }
            this.ToGetMediaInfo(() => {
              this.ToGetVideoRecommend() // 获取推荐视频
            })
          })
        }
        if (Type === 3) { // 收藏列表播放状态时请求收藏列表下视频列表
          this.GetVideoCollect({ params: { pageNum: 1, pageSize: 200, accountId: this.UserInfo !== null ? this.UserInfo.id : null, categoryId: this.ToolClass.GetUrlParams('favorites') - 0 } }).then(() => {
            if (this.ToolClass.GetUrlParams('key') === false && this.VideoCollectList.length) {
              this.ToolClass.ChangeUrlParams([{ name: 'key', value: this.VideoCollectList[0].videoM }])
            }
            this.ToGetMediaInfo(() => {
              this.ToGetVideoRecommend() // 获取推荐视频
            })
          })
        }
        if (Type === 4) { // 片单播放状态时请求片单下视频列表
          this.GetPieceGroupSubList({ params: { pageNum: 1, pageSize: 200, groupId: this.ToolClass.GetUrlParams('sheet') - 0 } }).then(() => {
            if (this.ToolClass.GetUrlParams('key') === false && this.MyPieceGroupSubList.length) {
              this.ToolClass.ChangeUrlParams([{ name: 'key', value: this.MyPieceGroupSubList[0].videoM }])
            }
            this.ToGetMediaInfo(() => {
              this.ToGetVideoRecommend() // 获取推荐视频
            })
          })
        }
        if (Type === 5) { // 专辑播放状态时请求专辑下视频列表
          this.GetAlbumPageVideos({ params: { pageNum: 1, pageSize: 200, albumId: this.ToolClass.GetUrlParams('album') - 0 } }).then(() => {
            if (this.ToolClass.GetUrlParams('key') === false && this.VideoAlbumSubList.length) {
              this.ToolClass.ChangeUrlParams([{ name: 'key', value: this.VideoAlbumSubList[0].videoM }])
            }
            this.ToGetMediaInfo(() => {
              this.ToGetVideoRecommend() // 获取推荐视频
            })
          })
        }
      } else {
        this.ToGetMediaInfo(() => {
          this.ToGetVideoRecommend() // 获取推荐视频
        })
      }
    },
    UserInfoChange () { // 用户登录信息更新
      if (this.$refs.NewVideoPlayerList) {
        this.$refs.NewVideoPlayerList.UserInfoChange()
      }
      if (this.UserInfo !== null) {
        this.GetPieceGroup({ params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 255 } }) // 获取用户片单列表
        this.GetWatchLaterNum({ params: { accountId: this.UserInfo.id } }).then((res) => { // 获取用户稍后观看列表数量
          this.WatchLaterNum = res.data.data - 0 || 0
        })
        // let Type = this.ToolClass.GetUrlParams('type') - 0
        // if (Type === 2) { // 稍后观看状态时请求稍后观看列表
        //   this.GetWatchLaterVideoList({ params: { pageNum: 1, pageSize: 100, accountId: this.UserInfo.id } })
        // }
        // if (Type === 3) { // 收藏列表播放状态时请求收藏列表下视频列表
        //   this.GetVideoCollect({ params: { pageNum: 1, pageSize: 200, accountId: this.UserInfo.id, categoryId: this.ToolClass.GetUrlParams('favorites') - 0 } })
        // }
        // if (Type === 4) { // 片单播放状态时请求片单下视频列表
        //   this.GetPieceGroupSubList({ params: { pageNum: 1, pageSize: 200, groupId: this.ToolClass.GetUrlParams('sheet') - 0 } }).then(() => {
        //     if (this.ToolClass.GetUrlParams('key') === false && this.MyPieceGroupSubList.length) {
        //       this.ToolClass.ChangeUrlParams([{ name: 'key', value: this.MyPieceGroupSubList[0].videoM }])
        //       this.ToGetMediaInfo()
        //       this.ToGetVideoRecommend() // 获取推荐视频
        //     }
        //   })
        // }
        // if (Type === 5) { // 专辑播放状态时请求专辑下视频列表
        //   this.GetAlbumPageVideos({ params: { pageNum: 1, pageSize: 200, albumId: this.ToolClass.GetUrlParams('album') - 0 } }).then(() => {
        //     if (this.ToolClass.GetUrlParams('key') === false && this.VideoAlbumSubList.length) {
        //       this.ToolClass.ChangeUrlParams([{ name: 'key', value: this.VideoAlbumSubList[0].videoM }])
        //       this.ToGetMediaInfo()
        //       this.ToGetVideoRecommend() // 获取推荐视频
        //     }
        //   })
        // }
      } else {
        // this.ToGetMediaInfo()
        // this.ToGetVideoRecommend() // 获取推荐视频
      }
      // if (this.ToolClass.GetUrlParams('key') !== false) {
      //   this.ToGetMediaInfo().then(() => {
      //     this.ToGetVideoRecommend() // 获取推荐视频
      //   })
      // }
      this.InitVideoInfo()
      this.GetHotVideoListForDay().then(() => {
      }) // 获取视频日排行
    },
    ToGetVideoRecommend () { // 获取推荐视频
      let Params = {
        pageNum: 1,
        pageSize: 40,
        videoId: this.MediaInfo.video.videoId
      }
      if (this.UserInfo !== null) {
        Params.accountId = this.UserInfo.id
      }
      this.GetVideoRecommend({ ...Params })
    },
    NextMedia () { // 下一个视频
      if (this.VideoRecommendList.length && this.ToolClass.GetUrlParams('type') === false) {
        window.location.href = `./video.html?key=${this.VideoRecommendList[0].videoM}`
      } else { // 稍后播放列表
        this.$refs.NewVideoPlayerList.Next()
      }
    },
    ExitMini () { // 退出mini模式
      this.MiniLock = false
      this.IsMiniPlayer = false
    },
    TriggerFullWindow () { // 切换全窗口模式
      this.IsFullWindow = !this.IsFullWindow
      if (this.IsFullWindow) {
        this.$refs.MainPage.ShowLeftMenu = false
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
