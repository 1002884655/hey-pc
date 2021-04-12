<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange" :Show="!ShowFullPopup">
      <div class="PageContainer" v-if="GetOtherUserInfoEnd && PageUserInfo !== null">

        <!-- 用户存在 -->
        <div>

          <!-- 背景图 -->
          <div class="TopBg">
            <div>
              <img v-if="PageUserInfo.backgroundPath !== null" :src="PageUserInfo.backgroundPath" class="centerLabel cover" alt="">
              <img v-else src="../../assets/img/bg.jpg" class="centerLabel cover" alt="">
              <div>
                <a class="EditBgImg iconfont iconxiangji" v-if="ShowEditBgImg" @click="ShowBgCropping = true"></a>
                <div>
                  <div class="flex-h">
                    <div class="UserIcon">
                      <div>
                        <img :src="PageUserInfo.picPath3" class="centerLabel cover" alt="">
                      </div>
                      <a class="iconfont iconxiangji" v-if="ShowEditBgImg" @click="ShowImageCropping = true"></a>
                    </div>
                    <span>{{PageUserInfo.nick}}</span>
                    <i class="iconfont iconnan" v-if="PageUserInfo.sex - 0 === 1"></i>
                    <i class="iconfont iconnv" v-if="PageUserInfo.sex - 0 === 2"></i>
                    <a class="EditUserName iconfont iconbianji2" v-if="ShowEditBgImg" href="./users.html" target="_self"></a>
                    <div class="flex-item"></div>
                    <a class="Subscribers" v-if="(UserInfo === null && PageUserInfo.fanClubAllow === 1) || (UserInfo !== null && PageUserInfo.userType - 0 !== 1 && UserInfo.id !== PageUserInfo.id && PageUserInfo.fanClubAllow === 1 && JoinClubStatus - 0 !== 1)" @click="TriggerFansClub" :class="{'active': JoinClubStatus !== 1}">{{JoinClubStatus === 1 ? 'Quit the fans club' : 'Become a Fan'}}</a>
                    <a class="Subscribers" v-if="!ShowEditBgImg" :class="{'active': UserInfo === null || !HasSubscribe}" @click="ToSubscribe">{{UserInfo === null ? 'Follow' : HasSubscribe ? 'Unfollow' : 'Follow'}}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- nav -->
        <div class="NavContainer">
          <div class="flex-h">
            <nav class="flex-item">
              <a v-for="(item, index) in NavList" :key="index" :class="{'active': CurrentNavId - 0 === item.Id - 0}" @click="CutNav(item.Id)">{{item.Name}}</a>
            </nav>
            <ul v-if="!ShowEditBgImg">
              <!-- <li>
                <span></span>
                <span>Views</span>
              </li> -->
              <li>
                <span>{{SubscribeNum}}</span>
                <span>Followers</span>
              </li>
              <li>
                <span>{{MySubscribeNum}}</span>
                <span>Following</span>
              </li>
              <li>
                <span>{{FansNum}}</span>
                <span>Fans</span>
              </li>
            </ul>
            <div v-else>
              <a :class="{'active': CurrentNavId - 0 === 8}" @click="CutNav(8)">
                <span>{{SubscribeNum}}</span>
                <span>Followers</span>
              </a>
              <a :class="{'active': CurrentNavId - 0 === 9}" @click="CutNav(9)">
                <span>{{MySubscribeNum}}</span>
                <span>Following</span>
              </a>
              <a :class="{'active': CurrentNavId - 0 === 10}" @click="CutNav(10)">
                <span>{{ClubNum}}</span>
                <span>Club</span>
              </a>
              <a :class="{'active': CurrentNavId - 0 === 11}" @click="CutNav(11)">
                <span>{{FansNum}}</span>
                <span>Fans</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 切换内容 -->
        <div class="Content">

          <ul class="UserTipsInfo" v-if="PageUserInfo.twitter !== null || PageUserInfo.facebook !== null || PageUserInfo.domain !== null">
            <li class="flex-h" v-if="PageUserInfo.twitter !== null">
              <i class="iconfont icontuite"></i>
              <a :href="PageUserInfo.twitter" target="_self">{{PageUserInfo.twitter}}</a>
            </li>
            <li class="flex-h" v-if="PageUserInfo.facebook !== null">
              <i class="iconfont icontian_facebook"></i>
              <a :href="PageUserInfo.facebook" target="_self">{{PageUserInfo.facebook}}</a>
            </li>
            <li class="flex-h" v-if="PageUserInfo.domain !== null">
              <i class="iconfont iconzuzhi"></i>
              <a :href="PageUserInfo.domain" target="_self">{{PageUserInfo.domain}}</a>
            </li>
          </ul>

          <!-- 视频 -->
          <div v-if="CurrentNavId - 0 === 1 || CurrentNavId - 0 === 2">
            <CommunityOfCenterOfVideos :data="PageUserInfo" @NeedLogin="$refs.MainPage.Login()"></CommunityOfCenterOfVideos>
          </div>

          <!-- 片单 -->
          <div v-if="CurrentNavId - 0 === 3">
            <CommunityOfCenterOfSheet></CommunityOfCenterOfSheet>
          </div>

          <!-- 专辑 -->
          <div v-if="CurrentNavId - 0 === 7">
            <CommunityOfCenterOfAblum></CommunityOfCenterOfAblum>
          </div>

          <!-- 图片 -->
          <div v-if="CurrentNavId - 0 === 4">
            <CommunityOfCenterOfPhoto></CommunityOfCenterOfPhoto>
          </div>

          <!-- 社区 -->
          <div v-if="CurrentNavId - 0 === 5">
            <CommunityOfCenterOfCommunity @NeedLogin="$refs.MainPage.Login()"></CommunityOfCenterOfCommunity>
          </div>

          <!-- 关于 -->
          <div v-if="CurrentNavId - 0 === 6">
            <CommunityOfCenterOfAbout></CommunityOfCenterOfAbout>
          </div>

          <div v-if="CurrentNavId - 0 > 7" class="flex-h">
            <div class="Menu">
              <a :class="{'active': CurrentNavId - 0 === 8}" @click="CutNav(8)">Followers</a>
              <a :class="{'active': CurrentNavId - 0 === 9}" @click="CutNav(9)">Following</a>
              <a :class="{'active': CurrentNavId - 0 === 10}" @click="CutNav(10)">Club</a>
              <a :class="{'active': CurrentNavId - 0 === 11}" @click="CutNav(11)">Fans</a>
            </div>
            <div class="flex-item">
              <div>

                <!-- 该用户订阅的 -->
                <div v-if="CurrentNavId === 9 && ShowEditBgImg">
                  <CommunityOfCenterOfFollow :data="PageUserInfo"></CommunityOfCenterOfFollow>
                </div>

                <!-- 订阅该用户的 -->
                <div v-if="CurrentNavId === 8 && ShowEditBgImg">
                  <CommunityOfCenterOfSubscribers :data="PageUserInfo"></CommunityOfCenterOfSubscribers>
                </div>

                <!-- 我的粉丝团 -->
                <div v-if="CurrentNavId === 10">
                  <CommunityOfCenterOfFollowingClubs></CommunityOfCenterOfFollowingClubs>
                </div>

                <!-- 我加入的粉丝团 -->
                <div v-if="CurrentNavId === 11">
                  <CommunityOfCenterOfMyClub></CommunityOfCenterOfMyClub>
                </div>

              </div>
            </div>
          </div>

        </div>

        <ImageCropping ref="ImageCropping" v-if="ShowImageCropping" @Close="ShowImageCropping = false" @Change="UserSomeInfoChange"></ImageCropping>

        <BgCropping ref="BgCropping" v-if="ShowBgCropping" @Close="ShowBgCropping = false" @Change="UserSomeInfoChange"></BgCropping>

      </div>
    </MainPage>
    <PayForFansClubPopup :PageUserInfo="PageUserInfo" v-if="ShowPayForFansClubPopup" @NeedLogin="$refs.MainPage.Login()" @Close="ShowPayForFansClubPopup = false" @Join="JoinClubStatus = 1"></PayForFansClubPopup>
  </div>
</template>

<script>
/*
  页面名称：个人社交主页
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2020/04/09
  备注： 无
*/
import MainPage from '../../components/MainPage'
import PayForFansClubPopup from '../../components/PayForFansClubPopup'
import CommunityOfCenterOfHome from '../../components/CommunityOfCenterOfHome'
import CommunityOfCenterOfVideos from '../../components/CommunityOfCenterOfVideos'
import CommunityOfCenterOfPhoto from '../../components/CommunityOfCenterOfPhoto'
import CommunityOfCenterOfCommunity from '../../components/CommunityOfCenterOfCommunity'
import CommunityOfCenterOfSheet from '../../components/CommunityOfCenterOfSheet'
import CommunityOfCenterOfAbout from '../../components/CommunityOfCenterOfAbout'
import CommunityOfCenterOfAblum from '../../components/CommunityOfCenterOfAblum'
import CommunityOfCenterOfSubscribers from '../../components/CommunityOfCenterOfSubscribers'
import CommunityOfCenterOfFollow from '../../components/CommunityOfCenterOfFollow'
import CommunityOfCenterOfFollowingClubs from '../../components/CommunityOfCenterOfFollowingClubs'
import CommunityOfCenterOfMyClub from '../../components/CommunityOfCenterOfMyClub'
import ImageCropping from '../../components/ImageCropping'
import BgCropping from '../../components/BgCropping'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage,
    PayForFansClubPopup,
    CommunityOfCenterOfHome,
    CommunityOfCenterOfVideos,
    CommunityOfCenterOfPhoto,
    CommunityOfCenterOfCommunity,
    CommunityOfCenterOfSheet,
    CommunityOfCenterOfAbout,
    CommunityOfCenterOfAblum,
    CommunityOfCenterOfSubscribers,
    CommunityOfCenterOfFollow,
    CommunityOfCenterOfFollowingClubs,
    CommunityOfCenterOfMyClub,
    ImageCropping,
    BgCropping
  },
  data () {
    return {
      ClubNum: 0,
      ShowPayForFansClubPopup: false,
      ShowBgCropping: false,
      ShowImageCropping: false,
      CurrentNavId: this.ToolClass.GetUrlParams('type') === false ? 2 : this.ToolClass.GetUrlParams('type') - 0, // 当前选中id
      NavList: [
        { Name: 'Home', Id: '1' },
        { Name: 'Videos', Id: '2' },
        { Name: 'Playlist', Id: '3' },
        { Name: 'Album', Id: '7' },
        // { Name: 'Photo', Id: '4' },
        { Name: 'Community', Id: '5' },
        { Name: 'About', Id: '6' }
      ],
      DataLock: false, // 数据锁
      JoinClubStatus: 0, // 加入粉丝俱乐部状态：0-未加入 1-已加入 2-已退出
      HasSubscribe: true, // 是否订阅过此用户
      FansNum: 0, // 视频数量
      SubscribeNum: 0, // 我的粉丝
      MySubscribeNum: 0, // 我订阅别人的数量
      ShowEditBgImg: false, // 显隐编辑背景图
      ShowCropper: false, // 显隐截图组件
      ShowFullPopup: false, // 显隐全窗口展示弹窗
      GetOtherUserInfoEnd: false, // 获取其他用户信息状态
      PageUserInfo: null // 社交用户信息
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      OtherUserInfo: x => x.OtherUserInfo // 其他用户信息
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.MainPage.ShowLeftMenu = true
    })
  },
  methods: {
    ...mapUserActions([
      'GetAccountBasicInfo',
      'GetAccountSubscribe',
      'AccountSubscribe',
      'CheckSubscribe',
      'Unsubscribe',
      'RevokeExitFansClub',
      'ExitFansClub'
    ]),
    ToRevokeExitFansClub () { // 撤销退出粉丝团
      if (this.DataLock) return
      this.DataLock = true
      this.RevokeExitFansClub({ params: { accountId: this.UserInfo.id, subId: this.PageUserInfo.id } }).then(() => {
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
    ToExitFansClub () { // 退出粉丝团
      if (this.DataLock) return
      this.DataLock = true
      this.ExitFansClub({ params: { accountId: this.UserInfo.id, subId: this.PageUserInfo.id } }).then((res) => {
        // this.$notify.success({
        //   title: 'success',
        //   message: 'Exit of success!'
        // })
        this.JoinClubStatus = 2
        this.DataLock = false
        window.localStorage.OrderBackUrl = window.location.href
        window.localStorage.OrderType = 'exit'
        window.location.href = res.data.data.cancelUrl
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.message
        })
        this.DataLock = false
      })
    },
    TriggerFansClub () {
      if (this.JoinClubStatus === 0) { // 未加入粉丝团
        this.ShowPayForFansClubPopup = true
      } else if (this.JoinClubStatus === 1) { // 已加入粉丝团
        this.ToExitFansClub()
      } else if (this.JoinClubStatus === 2) { // 已退出粉丝团
        // this.ToRevokeExitFansClub()
        this.ShowPayForFansClubPopup = true
      }
    },
    ToSubscribe () { // 去订阅
      if (this.UserInfo !== null) {
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定
          if (!this.HasSubscribe) { // 订阅
            this.AccountSubscribe({
              params: { subId: this.PageUserInfo.id, accountId: this.UserInfo.id }
            }).then((res) => {
              if (res.data.code - 0 === 0) {
                this.HasSubscribe = true
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
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false // 数据解锁
            })
          } else {
            this.Unsubscribe({
              params: { subId: this.PageUserInfo.id, accountId: this.UserInfo.id }
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
    UserSomeInfoChange () {
      this.PageUserInfo = { ...this.UserInfo }
    },
    CutNav (id) { // 切换nav
      if (this.CurrentNavId - 0 !== id - 0) {
        this.CurrentNavId = id
        this.ToolClass.ChangeUrlParams([{ name: 'type', value: id }, { name: 'pages', value: 1 }])
      }
    },
    UserInfoChange () { // 用户信息更新回调
      let Bool = !!this.ToolClass.GetUrlParams('key')
      if (Bool) { // 地址栏id参数有效
        if (this.UserInfo !== null) {
          if (this.UserInfo.id - 0 === this.ToolClass.GetUrlParams('key') - 0) {
            this.ShowEditBgImg = true
          }
        } else {
          this.ShowEditBgImg = false
        }
        this.GetAccountBasicInfo({ params: { id: this.ToolClass.GetUrlParams('key') } }).then(() => {
          this.PageUserInfo = this.OtherUserInfo !== null ? { ...this.OtherUserInfo } : null
          this.ToGetAccountSubscribe()
          if (this.PageUserInfo.id - 0 !== this.UserInfo.id) {
            this.CheckSubscribe({
              params: { subId: this.PageUserInfo.id, accountId: this.UserInfo.id }
            }).then((res) => {
              if (res.data.code - 0 === 0) {
                this.HasSubscribe = !!res.data.data.subscribeStatus
                this.JoinClubStatus = res.data.data.becomeFanStatus - 0
              }
            })
          }
          this.GetOtherUserInfoEnd = true
        }).catch(() => {
          this.GetOtherUserInfoEnd = true
        })
      } else { // 地址栏id参数无效
        this.ShowEditBgImg = this.UserInfo !== null
        this.PageUserInfo = this.UserInfo !== null ? { ...this.UserInfo } : null
        this.ToGetAccountSubscribe()
        this.GetOtherUserInfoEnd = true
      }
    },
    ToGetAccountSubscribe () {
      this.GetAccountSubscribe({
        params: { accountId: this.PageUserInfo.id }
      }).then((res) => {
        if (res.data.code - 0 === 0) {
          this.SubscribeNum = res.data.data.subscribe - 0
          this.MySubscribeNum = res.data.data.mySubscribe - 0
          this.FansNum = res.data.data.fanNum - 0
          this.ClubNum = res.data.data.clubNum - 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
