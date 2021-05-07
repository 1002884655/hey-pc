<template>
  <div id="app">
    <MainPage ref="MainPage" :HideFooter="true" @UserInfoChange="Init">
      <div class="PageContainer">

        <div class="LiveContainer flex-h">
          <div class="flex-item">
            <div class="LivePlayer">
              <span class="Blocked centerLabel" v-if="IsGetOut">You've been blocked</span>
              <span class="Blocked centerLabel" v-if="IsStop">The host is off the air</span>
              <div id="PlayerContainer" v-if="UserInfo !== null"></div>
            </div>
            <div class="LiveBottom flex-h">
              <a>
                <i class="iconfont iconfenxiang"></i>
                <span>Share</span>
              </a>
              <a>
                <i class="iconfont iconshouji-"></i>
                <span>App down</span>
              </a>
              <div class="flex-item">
              </div>
              <!-- <div class="GiftsListContainer" v-if="UserInfo === null || (UserInfo !== null && UserInfo.userType - 0 === 1)">
                <LiveGifts :List="GiftList" @Trigger="TriggerGifts" @Close="CurrentGiftIndex = null; CurrentGift = null"></LiveGifts>
                <div v-if="CurrentGift !== null && CurrentGiftIndex !== null" class="Detail" :style="{left: `${GiftDetailLeft[CurrentGiftIndex]}px`}">
                  <div class="Name flex-h">
                    <div class="Img">
                      <img :src="CurrentGift.imgPath1" class="centerLabel contain" alt="">
                    </div>
                    <div class="flex-item">
                      <span>{{CurrentGift.name}}</span>
                      <div>
                        <img src="../../assets/img/coin.png" alt="">
                        <span>{{CurrentGift.GiftNum - 0 ? CurrentGift.currency * CurrentGift.GiftNum : CurrentGift.currency}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="Num flex-h">
                    <a class="flex-item" :class="{'active': CurrentGift.GiftNum - 0 === 10}" @click="CurrentGift.GiftNum = 10">10</a>
                    <a class="flex-item" :class="{'active': CurrentGift.GiftNum - 0 === 50}" @click="CurrentGift.GiftNum = 50">50</a>
                    <a class="flex-item" :class="{'active': CurrentGift.GiftNum - 0 === 99}" @click="CurrentGift.GiftNum = 99">99</a>
                    <a class="flex-item" :class="{'active': CurrentGift.GiftNum - 0 === 999}" @click="CurrentGift.GiftNum = 999">999</a>
                    <input type="text" class="flex-item" placeholder="enter" v-model="CurrentGift.GiftNum">
                    <a class="flex-item" @click="ToSendGift">send</a>
                  </div>
                </div>
              </div> -->
            </div>
            <!-- <div class="BalanceInfo" v-if="UserInfo !== null && UserInfo.userType - 0 === 1">
              <span>Balance:</span>
              <span class="Amount">{{UserInfo.rechargeCurrency || 0}}</span>
              <img src="../../assets/img/coin.png" alt="">
              <a @click="UserInfo !== null ? ShowRechargePopup = true : $refs.MainPage.Login()">Recharge</a>
            </div> -->
          </div>
          <div class="ChatContainer">
            <!-- 线下 -->
            <LiveChat ref="LiveChat" v-if="Token !== null && !IsGetOut && !IsStop" :GiftList="GiftList" :Token="Token" :Appkey="'bmdehs6pbahqs'" :ChatRoomId="`${UserId}`" @ToRecharge="ShowRechargePopup = true" @NeedLogin="$refs.MainPage.Login()" @GetOut="GetOut" @Stop="Stop"></LiveChat>

            <!-- 线上 -->
            <!-- <LiveChat ref="LiveChat" v-if="Token !== null && !IsGetOut && !IsStop" :GiftList="GiftList" :Token="Token" :Appkey="'qd46yzrfqxyxf'" :ChatRoomId="`${UserId}`" @ToRecharge="ShowRechargePopup = true" @NeedLogin="$refs.MainPage.Login()" @GetOut="GetOut" @Stop="Stop"></LiveChat> -->
          </div>
        </div>

        <div class="OtherInfo flex-h" v-if="LiveRoomInfo !== null">
          <div class="flex-item">
            <span class="LiveName">{{LiveRoomInfo.roomName}}</span>
            <span class="TotalNum">{{TotalMember}} watching now</span>
            <div class="flex-h" v-if="LiverInfo !== null">
              <a class="UserIcon">
                <img :src="LiverInfo.picPath2" class="centerLabel cover" alt="">
              </a>
              <div class="flex-item">
                <a>{{LiverInfo.nick}}</a>
                <span>{{LiverInfo.description}}</span>
              </div>
              <a class="Follow" :class="{'active': !HasSubscribe}" @click="ToSubscribe">{{HasSubscribe ? 'Unfollow' : 'Follow'}}</a>
            </div>
          </div>
          <div class="LiveList">
            <span>Living</span>
            <ul>
              <li v-for="(item, index) in LivingList" :key="index">
                <a :href="`./live.html?user=${item.accountId}&room=${item.id}`">
                  <img :src="item.sourcePath" class="centerLabel cover" alt="">
                  <span class="Price" :class="{'active': item.freeType === 1}">{{item.freeType === 0 ? 'Free' : 'Gold'}}</span>
                  <div class="Info">
                    <div class="flex-h">
                      <span class="flex-item">{{item.roomName}}</span>
                      <i class="iconfont iconrenwu1"></i>
                      <span>{{item.totalMember || 0}}</span>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style="height: 500px"></div>

        <RechargePopup v-if="ShowRechargePopup" @Close="ShowRechargePopup = false"></RechargePopup>

      </div>
    </MainPage>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const LiveGifts = () => import('@/components/LiveGifts')
const LiveChat = () => import('@/components/LiveChat')
const RechargePopup = () => import('@/components/RechargePopup')
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapActions: mapLiveActions } = createNamespacedHelpers('live')
export default {
  components: {
    MainPage,
    LiveChat,
    RechargePopup,
    LiveGifts
  },
  data () {
    return {
      GetRoomInfoTimer: null,
      CurrentGiftIndex: null,
      GiftDetailLeft: [-265, -210, -155, -100, -45, 10],
      CurrentGift: null,
      VideoControlTimer: null,
      LivingList: [],
      ShowRechargePopup: false,
      IsStop: false,
      TotalMember: 0,
      PrizeTimer: null,
      HasSubscribe: false,
      LiverInfo: null,
      LiveRoomInfo: null,
      IsGetOut: false,
      DataLock: false,
      LivePlayer: null,
      GiftList: [],
      Token: null,
      LiveRoomId: this.ToolClass.GetUrlParams('room'),
      UserId: this.ToolClass.GetUrlParams('user') || 2923
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserMutations([
      'EditUserInfo'
    ]),
    ...mapUserActions([
      'GetLiveRoomList',
      'GetUserLiveUrl',
      'GetGiftList',
      'GetUserLiveToken',
      'PostLiveGift',
      'GetChatRoomBlockList',
      'GetAccountBasicInfo',
      'AccountSubscribe',
      'CheckSubscribe',
      'Unsubscribe',
      'GetLiveRoomInfo'
    ]),
    ...mapLiveActions([
      'GetChatRoomUsersList'
    ]),
    TriggerGifts (e) {
      if (!this.GiftList[e.index].active) {
        this.GiftList.map((item, index) => {
          if (index !== e.index) {
            item.active = false
          } else {
            item.active = true
          }
        })
      } else {
        this.GiftList[e.index].active = false
      }
      if (this.GiftList[e.index].active) { // 展开礼物详情
        this.CurrentGift = { ...e }
        this.CurrentGiftIndex = e.index % 6
      } else { // 关闭礼物详情
        this.CurrentGiftIndex = null
        this.CurrentGift = null
      }
    },
    ToSubscribe () { // 去订阅
      if (this.UserInfo !== null) {
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定
          if (!this.HasSubscribe) { // 订阅
            this.AccountSubscribe({
              params: { subId: this.LiverInfo.id, accountId: this.UserInfo.id, channel: 2, roomCount: this.LiveRoomInfo.id }
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
              params: { subId: this.LiverInfo.id, accountId: this.UserInfo.id }
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
      }
    },
    GetOut () { // 拉黑
      this.LivePlayer.destroy()
      this.IsGetOut = true
    },
    Stop () { // 下播
      this.LivePlayer.destroy()
      this.IsStop = true
    },
    ToSendGift () {
      if (this.UserInfo !== null) {
        if (this.UserInfo.userType - 0 === 1) {
          if (this.DataLock || !(this.CurrentGift.GiftNum - 0) || this.LiveRoomId === null) return
          if (this.UserInfo.rechargeCurrency - 0 < this.CurrentGift.GiftNum * this.CurrentGift.currency) {
            this.$notify.error({ title: 'error', message: 'Your balance is insufficient!' })
            this.ShowRechargePopup = true
            return false
          }
          this.DataLock = true
          this.PostLiveGift({
            data: {
              accountId: this.UserInfo.id,
              giftId: this.CurrentGift.id,
              liveRoomId: this.LiveRoomId,
              num: this.CurrentGift.GiftNum
            }
          }).then(() => {
            this.EditUserInfo({ name: 'rechargeCurrency', value: this.UserInfo.rechargeCurrency - this.CurrentGift.GiftNum * this.CurrentGift.currency })
            this.$refs.LiveChat.SendGift({
              id: this.CurrentGift.id,
              num: this.CurrentGift.GiftNum,
              currency: this.CurrentGift.currency,
              img1: this.CurrentGift.imgPath1,
              img2: this.CurrentGift.imgPath2,
              img3: this.CurrentGift.imgPath3,
              name: this.CurrentGift.name,
              svgPath: this.CurrentGift.svgPath
            })
            this.DataLock = false
          }).catch(() => {
            this.DataLock = false
          })
        }
      } else {
        this.$refs.MainPage.Login()
      }
    },
    ScriptInit (callback = () => { }) { // 初始化直播&聊天室js
      let HtmlHead = document.getElementsByTagName('head')[0]
      let Script = document.createElement('script')
      Script.src = 'https://sdk-release.qnsdk.com/qiniu-web-player-1.2.3.js'
      HtmlHead.appendChild(Script)
      Script.onload = () => {
        callback()
      }
    },
    ToGetRoomInfo () {
      window.clearInterval(this.GetRoomInfoTimer)
      this.GetRoomInfoTimer = window.setInterval(() => {
        this.GetChatRoomUsersList({ params: { chatRoomId: this.UserId } }).then((res) => {
          this.TotalMember = res.data.data.members.length
        })
      }, 3000)
    },
    Init () {
      this.VideoControlTimer = window.setInterval(() => {
        if (document.getElementsByClassName('qplayer-time').length > 0) {
          window.clearInterval(this.VideoControlTimer)
          document.getElementsByClassName('qplayer-time')[0].style.display = 'none'
        }
      }, 100)
      this.GetLiveRoomList({ params: { pageNum: 1, pageSize: 5 } }).then((res) => {
        this.LivingList = res.data.data.list || []
      })
      this.GiftList = []
      this.GetGiftList().then((res) => {
        let Arr = res.data.data || []
        Arr.map((item) => {
          this.GiftList.push({ ...item, GiftNum: 10, active: false })
        })
        // window.setTimeout(() => {
        //   let MoreGiftList = document.getElementsByClassName('MoreGiftList')[0]
        //   MoreGiftList.style.top = `-${Math.ceil((this.GiftList.length - 6) / 6) * 60 + 10}px`
        // }, 100)
      })
      this.GetChatRoomBlockList({ params: { chatRoomId: this.UserId } }).then((res) => {
        let Bool = true
        res.data.data.members.map((item) => {
          if (item.accountId - 0 === this.UserId - 0) {
            Bool = false
          }
        })
        if (!Bool) {
          this.IsGetOut = true
          return false
        }
        let GetInfoParams = { accountId: this.ToolClass.GetUrlParams('user') }
        if (this.UserInfo !== null) {
          GetInfoParams.userId = this.UserInfo.id
        }
        this.ToGetRoomInfo()
        // this.GetLiveRoomInfo({ params: { ...GetInfoParams } }).then((res) => {
        //   this.TotalMember = res.data.data.totalMember
        // })
        this.ScriptInit(() => {
          this.GetUserLiveUrl({ params: { liveRoomId: this.ToolClass.GetUrlParams('room'), userId: this.ToolClass.GetUrlParams('user') } }).then((res) => {
            this.LiveRoomInfo = res.data.data || null
            this.GetAccountBasicInfo({ params: { id: this.UserId } }).then((res) => {
              this.LiverInfo = res.data.data || null
              if (this.UserInfo !== null) {
                this.CheckSubscribe({ params: { subId: this.LiverInfo.id, accountId: this.UserInfo.id } }).then((res) => {
                  if (res.data.code - 0 === 0) {
                    this.HasSubscribe = !!res.data.data.subscribeStatus
                  }
                })
              }
            })
            this.LiveRoomId = res.data.data.id
            this.LivePlayer = new window.QPlayer({
              url: res.data.data.hlsPlay,
              container: document.getElementById('PlayerContainer'),
              autoplay: true,
              defaultViewConfig: {
                noControls: true // 不渲染控件
              }
            })
          }).catch(() => {
            this.IsStop = true
          })
        })
        if (this.UserInfo !== null) {
          this.GetUserLiveToken({ params: { userId: this.UserInfo.id, name: this.UserInfo.nick, portrait: this.UserInfo.picPath2 } }).then((res) => {
            this.Token = res.data.data.token || null
          })
        }
      })
      if (this.UserInfo !== null) {

      } else {
        this.$refs.MainPage.Login()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
