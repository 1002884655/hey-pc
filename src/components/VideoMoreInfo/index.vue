<template>
  <div class="components VideoMoreInfo">

    <!-- 标题 -->
    <div class="Title flex-h">
      <span>{{MediaInfo.video.title}}</span>
    </div>

    <div class="flex-h">
      <div class="flex-item">

        <!-- 附加信息 -->
        <div class="SubInfo flex-h">
          <span>{{ToolClass.ReturnViews(MediaInfo.video.displayNum)}} views</span>
          <span>{{MediaInfo.video.upTime | changeTime}}</span>
        </div>

        <!-- 标签&分类信息 -->
        <div class="TagAndClassList">
          <a v-for="(item, index) in TagAndClassArr" v-if="index < 5 || ShowMoreTag" class="Item" :href="`./search.html?${item.Type === 'tag' ? 'tag' : 'key'}=${item.Name}`" target="_self" :class="{'Tag': item.Type === 'tag', 'Class': item.Type === 'class'}" :key="index">{{item.Name}}</a>
          <a class="iconfont iconjia- Trigger" v-if="!ShowMoreTag && TagAndClassArr.length > 5" @click="ShowMoreTag = !ShowMoreTag"></a>
        </div>

      </div>
      <!-- <a v-if="MediaInfo.payVideo - 0 === 1 && MediaInfo.video.videoPath === ''" @click="ToPayForVideo" :class="{'active': !PayLock}">Paid {{MediaInfo.video.price}} to watch</a> -->
    </div>

    <!-- 视频操作项 -->
    <!-- <div class="flex-h VideoShareLine">
      <span>{{ToolClass.ReturnViews(MediaInfo.video.displayNum)}} views</span>
      <span>{{TotalCommentCounts}} comments</span>
      <div class="flex-item"></div>
      <a :class="{'active': HasLiked}"><i class="iconfont icondianzan" @click="GaveLikeForVideo"></i><span>{{LikeNum}}</span></a>
      <a :class="{'active': HasCollected}"><i class="iconfont iconshoucang-" @click="CollectVideo"></i><span>{{CollectNum}}</span></a>
      <a @click="ShowMainComment = !ShowMainComment"><i class="iconfont iconpinglun-"></i><span>comment</span></a>
      <a @click="ShareVideo"><i class="iconfont iconfenxiang"></i></a>
    </div> -->

    <!-- 主评论输入框 -->
    <div class="MainCommentContainer" v-show="ShowMainComment">
      <PlayerMainComment></PlayerMainComment>
    </div>

    <!-- 信息列表 -->
    <!-- <ul class="InfoList">
      <li class="flex-h">
        <span>Introduction:</span>
        <div class="flex-item">
          <span>{{MediaInfo.video.description}}</span>
        </div>
      </li>
      <li class="flex-h">
        <span>Up Name:</span>
        <div class="flex-item">
          <span><a :href="`./userspace.html?key=${MediaInfo.video.upId}`" target="_self">{{MediaInfo.video.upName}}</a></span>
        </div>
      </li>
      <li class="flex-h" style="margin-bottom: 0" v-if="MediaInfo.labelList !== null && MediaInfo.labelList.length">
        <span>Tag:</span>
        <div class="flex-item">
          <a v-for="(item, index) in MediaInfo.labelList" :key="index" :href="`./search.html?tag=${item.name}`" target="_self">{{item.name}}</a>
        </div>
      </li>
      <li class="flex-h" style="margin-bottom: 0" v-if="MediaInfo.serviceTypeList !== null && MediaInfo.serviceTypeList.length">
        <span>Class:</span>
        <div class="flex-item">
          <a v-for="(item, index) in MediaInfo.serviceTypeList" :key="index" :href="`./search.html?key=${item.name}`" target="_self">{{item.name}}</a>
        </div>
      </li>
      <li class="flex-h" v-if="ShowMoreInfo" style="margin-bottom: 0">
        <span>Upload Time:</span>
        <div class="flex-item">
          <span>{{MediaInfo.video.upTime | changeTime}}</span>
        </div>
      </li>
    </ul> -->
    <!-- 演员表 -->
    <!-- <div class="ActorList flex-h">
      <div class="flex-item">
        <a v-for="(item, index) in 30" :key="index">{{index}}</a>
      </div>
    </div> -->
    <!-- <div class="TriggerMoreInfo">
      <a @click="ShowMoreInfo = !ShowMoreInfo"><span>{{ShowMoreInfo ? 'Show Less' : 'Show More'}}</span><i class="iconfont" :class="[ShowMoreInfo ? 'iconjiantouup' : 'iconjiantoudown']"></i></a>
    </div> -->

    <!-- 上传者信息 -->
    <div class="UpUserInfo flex-h" v-if="OtherUserInfo !== null">
      <div class="Icon">
        <a :href="`./userspace.html?key=${MediaInfo.video.upId}`" target="_self">
          <img :src="OtherUserInfo.picPath2" class="centerLabel cover" alt="">
        </a>
      </div>
      <div class="flex-item">
        <div class="flex-h">
          <span class="flex-item"><a :href="`./userspace.html?key=${MediaInfo.video.upId}`" target="_self">{{MediaInfo.video.upName}}</a></span>
        </div>
        <div class="Desc"><span :class="{'active': ShowMoreDesc}">{{OtherUserInfo.description || 'No introduction'}}</span></div>
        <div class="TriggerMoreDesc" v-if="OtherUserInfo.description !== undefined && OtherUserInfo.description !== null && OtherUserInfo.description.length > 100">
          <a @click="ShowMoreDesc = !ShowMoreDesc"><span>{{ShowMoreDesc ? 'Show Less' : 'Show More'}}</span><i class="iconfont" :class="[ShowMoreDesc ? 'iconjiantouup' : 'iconjiantoudown']"></i></a>
        </div>
      </div>
      <a v-if="(UserInfo === null || UserInfo.userType - 0 === 1) && (OtherUserInfo.id !== UserInfo.id && OtherUserInfo.fanClubAllow - 0 === 1 && JoinClubStatus !== 1)" :class="{'active': UserInfo === null || (OtherUserInfo.fanClubAllow - 0 === 1 && JoinClubStatus - 0 !== 1)}" @click="TriggerBecomeFans">{{UserInfo === null ? 'Become a Fan' : JoinClubStatus - 0 === 1 ? 'Quit the fans club' : 'Become a Fan'}}</a>
      <a v-if="OtherUserInfo.id !== UserInfo.id" :class="{'active': UserInfo === null || !HasSubscribe}" @click="ToSubscribe">{{UserInfo === null ? 'Follow' : HasSubscribe ? 'Unfollow' : 'Follow'}}</a>
    </div>

    <!-- 上传者相关视频 -->
    <ul class="UpUserOtherVideoList" id="CommentMarkId">
      <li v-for="(item, index) in AccountVideoCollectionList" :key="index">
        <MainVideoListItem :data="item" :WatchLater="item.WatchLater" :Index="index" :ShowGif="ShowGifIndex === index" StyleType="Default" :MoreTipsAlign="(index + 1) % 4 === 0 ? 'left' : 'right'" @ShowGifIndex="ToShowGifIndex" @TriggerWatchLater="TriggerWatchLater" @NeedLogin="$emit('NeedLogin')" @SaveToFavorite="OpenSaveToFavorite(item)" @SaveToPlaylist="OpenSaveToPlaylist(item)"></MainVideoListItem>
      </li>
    </ul>

    <SaveToFavorites ref="SaveToFavorites" :Ids="CurrentId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false"></SaveToFavorites>

    <SaveToPlaylist ref="SaveToPlaylist" :Ids="[CurrentId]" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false"></SaveToPlaylist>

    <!-- <PayForFansClubPopup :PageUserInfo="OtherUserInfo" v-if="ShowPayForFansClubPopup" @Close="ShowPayForFansClubPopup = false" @Join="JoinClubStatus = 1"></PayForFansClubPopup> -->

  </div>
</template>

<script>
/*
  页面名称：视频更多信息组件（视频播放页）
  创建人：许成祥
  创建时间：2020/01/17
  最近修改人：许成祥
  最近修改日期：2020/04/11
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import PlayerMainComment from '../PlayerMainComment'
import { createNamespacedHelpers } from 'vuex'
import MainVideoListItem from '../MainVideoListItem'
import VideoCollectFolderMove from '../VideoCollectFolderMove'
import UserForMySheetVideosCopy from '../UserForMySheetVideosCopy'
import SaveToFavorites from '../SaveToFavorites'
import SaveToPlaylist from '../SaveToPlaylist'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
const { mapState: mapMediaState, mapActions: mapMediaActions, mapMutations: mapMediaMutations } = createNamespacedHelpers('media')
export default {
  name: 'VideoMoreInfo',
  props: ['MediaInfo'],
  data () {
    return {
      JoinClubStatus: 0,
      HasSubscribe: false,
      PayLock: false,
      ShowSaveToFavorites: false,
      ShowSaveToPlaylist: false,
      CurrentId: null,
      ShowGifIndex: null,
      ShowMoreTag: false,
      TagAndClassArr: [],
      ShowUpCollectionIndex: null,
      ShowMainComment: false, // 显隐主评论输入框
      HasCollected: false, // 是否已收藏
      HasLiked: false, // 是否已点赞
      LikeNum: null, // 点赞数
      CollectNum: null, // 收藏数
      DataLock: false, // 数据锁
      ShowMoreDesc: false, // 显隐更多介绍
      ShowMoreInfo: false // 显隐更多信息
    }
  },
  computed: {
    ...mapMediaState({
      TotalCommentCounts: x => x.TotalCommentCounts,
      AccountVideoCollectionList: x => x.AccountVideoCollectionList
    }),
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      OtherUserInfo: x => x.OtherUserInfo, // 其他用户信息
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    })
  },
  components: {
    PlayerMainComment,
    MainVideoListItem,
    VideoCollectFolderMove,
    UserForMySheetVideosCopy,
    SaveToFavorites,
    SaveToPlaylist
  },
  created () {
    this.GetAccountBasicInfo({ params: { id: this.MediaInfo.video.upId } }).then(() => {
      this.CheckSubscribe({
        params: { subId: this.OtherUserInfo.id, accountId: this.UserInfo.id }
      }).then((res) => {
        if (res.data.code - 0 === 0) {
          this.HasSubscribe = !!res.data.data.subscribeStatus
          this.JoinClubStatus = res.data.data.becomeFanStatus - 0
        }
      })
    })
    let TagArr = this.MediaInfo.labelList || []
    let ClassArr = this.MediaInfo.serviceTypeList || []
    TagArr.map((item) => {
      this.TagAndClassArr.push({
        Name: item.name,
        Id: item.labelId,
        Type: 'tag'
      })
    })
    ClassArr.map((item) => {
      this.TagAndClassArr.push({
        Name: item.name,
        Id: item.serviceTypeId,
        Type: 'class'
      })
    })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'PayForVideo',
      'GetAccountBasicInfo',
      'UserGaveLikeForVideo',
      'AddCollect',
      'GetVideoStatus',
      'AddWatchLater',
      'CancelWatchLater',
      'CheckSubscribe',
      'AccountSubscribe',
      'Unsubscribe',
      'AddPieceGroupSubItem',
      'RevokeExitFansClub',
      'ExitFansClub'
    ]),
    ...mapMediaActions([
      'GetAccountVideoCollection'
    ]),
    ...mapMediaMutations([
      'EmptyAccountVideoCollection',
      'EditAccountVideoCollection'
    ]),
    TriggerBecomeFans () {
      if (this.DataLock) return
      this.DataLock = true
      if (this.JoinClubStatus - 0 === 0) { // 未加入粉丝团
        this.$emit('JoinFansClub', this.OtherUserInfo)
        this.DataLock = false
      } else if (this.JoinClubStatus - 0 === 1) { // 已加入粉丝团
        this.ToExitFansClub()
      } else if (this.JoinClubStatus - 0 === 2) { // 已退出粉丝团
        this.ToRevokeExitFansClub()
      }
    },
    ToExitFansClub () { // 退出粉丝团
      this.ExitFansClub({ params: { accountId: this.UserInfo.id, subId: this.OtherUserInfo.id } }).then(() => {
        this.$notify.success({
          title: 'success',
          message: 'Exit of success!'
        })
        this.JoinClubStatus = 2
        this.DataLock = false
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.message
        })
        this.DataLock = false
      })
    },
    ToRevokeExitFansClub () { // 撤销退出粉丝团
      this.RevokeExitFansClub({ params: { accountId: this.UserInfo.id, subId: this.OtherUserInfo.id } }).then(() => {
        this.$notify.success({
          title: 'success',
          message: 'Join of success!'
        })
        this.JoinClubStatus = 1
        this.DataLock = false
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.message
        })
        this.DataLock = false
      })
    },
    ToSubscribe () {
      if (this.UserInfo !== null) {
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定
          if (!this.HasSubscribe) { // 订阅
            this.AccountSubscribe({
              params: { subId: this.OtherUserInfo.id, accountId: this.UserInfo.id }
            }).then((res) => {
              if (res.data.code - 0 === 0) {
                this.HasSubscribe = true
                // this.HasSubscribe = !!(res.data.data.subscribeStatus - 0)
                // this.JoinClubStatus = res.data.data.becomeFanStatus - 0
                this.$notify.success({
                  title: 'success',
                  message: 'Subscribe of success!'
                })
              } else {
                this.$notify.error({
                  title: 'error',
                  message: res.data.msg
                })
              }
              this.DataLock = false // 数据解锁
            }).catch((res) => {
              console.log(res)
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false // 数据解锁
            })
          } else {
            this.Unsubscribe({
              params: { subId: this.OtherUserInfo.id, accountId: this.UserInfo.id }
            }).then((res) => {
              if (res.data.code - 0 === 0) {
                this.HasSubscribe = false
                this.$notify.success({
                  title: 'success',
                  message: 'Unsubscribe of success!'
                })
              } else {
                this.$notify.error({
                  title: 'error',
                  message: res.data.msg
                })
              }
              this.DataLock = false // 数据解锁
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false // 数据解锁
            })
          }
        }
      } else {
        this.$refs.MainPage.Login()
      }
    },
    ToPayForVideo () {
      if (this.UserInfo === null) {
        this.$emit('NeedLogin')
        return false
      }
      if (this.PayLock) return
      this.PayLock = true
      this.PayForVideo({ data: { accountId: this.UserInfo.id, videoAlbumId: this.MediaInfo.video.albumId, videoId: this.MediaInfo.video.albumId } }).then(() => {
        this.PayLock = false
        window.setTimeout(() => {
          window.location.reload()
        }, 300)
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
        this.PayLock = false
      })
    },
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
    OpenSaveToFavorite (item) { // 添加收藏
      this.CurrentId = item.videoId
      this.ShowSaveToFavorites = true
    },
    OpenSaveToPlaylist (item) { // 添加播单
      this.CurrentId = item.videoId
      this.ShowSaveToPlaylist = true
    },
    TriggerWatchLater (e) {
      if (e.type === 'Add') {
        this.EditAccountVideoCollection({ index: e.index, name: 'WatchLater', value: true })
        this.$notify.success({ title: 'success', message: 'has been added' })
      } else {
        this.EditAccountVideoCollection({ index: e.index, name: 'WatchLater', value: false })
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
              this.EditAccountVideoCollection({ index, name: 'WatchLater', value: false })
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
              this.EditAccountVideoCollection({ index, name: 'WatchLater', value: true })
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
    },
    LinkToMedia (id) { // 跳转到视频页
      window.open(`./video.html?key=${id}`, '_self')
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
    UserInfoChange () { // 用户信息更新
      if (this.UserInfo !== null) {
        this.ToGetVideoStatus()
      } else {
        this.HasCollected = false
        this.HasLiked = false
      }
    },
    DataSubmit (callback) { // 数据提交
      if (this.UserInfo !== null) {
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定，防止多次触发
          callback()
        }
      } else {
        this.$emit('ToLogin')
      }
    },
    CollectVideo () { // 收藏视频
      if (!this.HasCollected) {
        this.DataSubmit(() => {
          this.AddCollect({
            data: {
              accountId: this.UserInfo.id,
              collectType: 1,
              workId: this.MediaInfo.video.videoId
            }
          }).then(() => {
            this.HasCollected = true
            this.CollectNum += 1
            this.DataLock = false // 数据解锁
          })
        })
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
