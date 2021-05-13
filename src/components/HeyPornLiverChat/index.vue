<template>
  <div class="components HeyPornLiverChat flex-v">

    <!-- nav -->
    <nav class="ChatNav">
      <a v-for="(item, index) in NavList" :key="index" :class="{'active': CurrentNavId === item.id}" @click="CutNav(item)">{{item.name}}</a>
      <span v-if="CurrentNavId === 3">({{ToolClass.ReturnViews(RoomUserCounts)}})</span>
    </nav>

    <!-- content -->
    <div class="flex-item Content">

      <!-- All chat -->
      <div v-show="CurrentNavId === 1" class="AllChat">
        <ScrollY ref="AllChatScroll" Size="small">
          <ul class="ChatList">
            <li v-for="(item, index) in ChatList" :key="index" :class="{'active': item.type === 'gift'}">
              <span v-if="item.type === 'text'"><a :href="`./userspace.html?key=${item.userId}`">{{item.userName}}</a>{{item.text}}</span>
              <span v-if="item.type === 'comming'"><a :href="`./userspace.html?key=${item.userId}`">{{item.userName}}</a> comming</span>
              <div class="flex-h" v-if="item.type === 'gift'">
                <a>{{item.userName}}</a>
                <span class="flex-item">send</span>
                <img :src="item.giftImg" height="20px" alt="">
                <span>* {{item.giftNum}}</span>
              </div>
            </li>
          </ul>
        </ScrollY>
      </div>

      <!-- HeyDollar -->
      <div v-show="CurrentNavId === 2" class="HeyDollar">
        <div class="flex-v">
          <ul class="Nav flex-h">
            <li class="flex-item" style="flex: 3; -webkit-flex: 3;">Gift</li>
            <!-- <li class="flex-item">Number</li> -->
            <li class="flex-item" style="flex: 2; -webkit-flex: 2;">User</li>
            <li class="flex-item" style="flex: 2; -webkit-flex: 2;">HeyDollar</li>
            <li class="flex-item" style="flex: 2; -webkit-flex: 2;">Time</li>
          </ul>
          <div class="flex-item">
            <div>
              <ScrollY ref="GiftsScroll" Size="small">
                <ul class="GiftList">
                  <li v-for="(item, index) in GiftsRankList" :key="index" class="flex-h">
                    <span class="flex-item" style="flex: 3; -webkit-flex: 3;" :title="`${item.giftName} * ${item.amount}`">{{item.giftName}} * {{item.amount}}</span>
                    <!-- <span class="flex-item">{{item.amount}}</span> -->
                    <a class="flex-item" style="flex: 2; -webkit-flex: 2;">{{item.userName}}</a>
                    <span class="flex-item" style="flex: 2; -webkit-flex: 2;">{{item.customer}}</span>
                    <span class="flex-item" style="flex: 2; -webkit-flex: 2;">{{ToolClass.DateFormatYear(item.createTime, 'hh:mm')}}</span>
                  </li>
                </ul>
              </ScrollY>
            </div>
          </div>
        </div>
      </div>

      <!-- Users -->
      <div v-show="CurrentNavId === 3" class="UsersList">
        <div class="flex-v">
          <ul class="Nav flex-h">
            <li class="flex-item">User</li>
            <!-- <li class="flex-item">HeyDollar</li> -->
          </ul>
          <div class="flex-item">
            <div>
              <ScrollY ref="UsersScroll" Size="small">
                <ul class="GiftList">
                  <li v-for="(item, index) in RoomUserList" :key="index" class="flex-h">
                    <a :href="`./userspace.html?key=${item.accountId}`" class="flex-item">{{item.name}}</a>
                  </li>
                </ul>
              </ScrollY>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- send -->
    <div class="SendContent" v-show="CurrentNavId === 1 && !IsChatClose">
      <div class="flex-h">
        <input type="text" v-model="Message" placeholder="say something" class="flex-item" @focus="IsSendChatMsg = true" @blur="IsSendChatMsg = false">
        <a class="iconfont iconbiaoqing EmojyIcon" @click="ShowEmoji = !ShowEmoji"></a>
        <a class="iconfont icontuiguang SendIcon" @click="SendMsg"></a>
      </div>
    </div>

    <div class="LiveChatEmojiBoxer" :style="{display: ShowEmoji ? 'block' : 'none'}" ref="EmojiBoxer">
      <VEmojiPicker :pack="pack" @select="selectEmoji" />
    </div>

  </div>
</template>

<script>
/*
*/
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
const { mapActions: mapLiveActions } = createNamespacedHelpers('live')
const ScrollY = () => import('@/components/ScrollY')
export default {
  name: 'HeyPornLiverChat',
  props: {
    Appkey: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      IsSendChatMsg: false,
      ShowEmoji: false,
      pack: packData,
      RoomUserList: [],
      RoomUserCounts: 0,
      GetRoomInfoTimer: null,
      IsChatClose: true,
      GiftsRankList: [],
      GiftsRankTimer: null,
      Token: '',
      ChatTarget: null,
      RongIMLib: null,
      ChatRoom: null,
      LiveRoomInfo: null,
      CurrentNavId: 1,
      NavList: [
        { id: 1, name: 'All chat' },
        { id: 2, name: 'HeyDollar' },
        { id: 3, name: 'Users' }
      ],
      DataLock: false,
      Message: '',
      ChatList: []
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    VEmojiPicker,
    ScrollY
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.ToolClass.DocumentKeyDown((e) => { // 绑定回车键发送聊天消息功能
        if (e.keyCode === 13) { // Enter键
          if (this.IsSendChatMsg) { // 发送
            this.SendMsg(this.Message)
          }
        }
      })
    })
  },
  methods: {
    ...mapUserActions([
      'GetUserLiveToken'
    ]),
    ...mapLiveActions([
      'CreateChatRoom',
      'CloseLiveChatRoom',
      'GetLiveRoomGiftsDetailsList',
      'GetChatRoomUsersList'
    ]),
    Init (e) {
      this.ChatList = []
      this.LiveRoomInfo = { ...e }
      this.GetUserLiveToken({ params: { userId: this.UserInfo.id, name: this.UserInfo.nick, portrait: this.UserInfo.picPath2 } }).then((res) => {
        this.Token = res.data.data.token || null
        this.CreateChatRoom({ params: { chatRoomId: this.LiveRoomInfo.id, chatRoomName: this.LiveRoomInfo.roomName } }).then((res) => { // 申请创建直播聊天室房间
          this.ScriptInit() // 初始化聊天室js
        })
      })
    },
    selectEmoji (emoji) { // 选择表情
      this.Message = (this.Message + emoji.emoji).substring(0, 200)
    },
    Stop () { // 下播
      this.SendMsg('', true, () => {
        this.CloseLiveChatRoom({ params: { chatRoomId: this.UserInfo.id } }).then(() => {
          this.IsChatClose = true
          window.clearInterval(this.GiftsRankTimer)
          this.RoomUserList = []
          this.RoomUserCounts = 0
          this.GiftsRankList = []
          this.ChatList = [{ ...this.ChatList[this.ChatList.length - 1] }]
          this.CurrentNavId = 1
        }).catch(() => {
          this.IsChatClose = true
        })
      })
    },
    ScriptInit () { // 初始化聊天室js
      let HtmlHead = document.getElementsByTagName('head')[0]
      let Script = document.createElement('script')
      Script.src = 'https://cdn.ronghub.com/RongIMLib-3.0.5-dev.js'
      HtmlHead.appendChild(Script)
      Script.onload = () => {
        this.ChatInit() // 聊天室初始化
      }
    },
    ToGetRoomInfo () {
      window.clearInterval(this.GetRoomInfoTimer)
      if (!this.IsChatClose) {
        this.GetRoomInfoTimer = window.setInterval(() => {
          if (!this.IsChatClose) {
            this.GetChatRoomUsersList({ params: { chatRoomId: this.ChatRoom.id } }).then((res) => {
              this.RoomUserCounts = res.data.data.members.length
              this.RoomUserList = res.data.data.members || []
              this.$emit('UserCountsChange', this.RoomUserCounts)
            })
          } else {
            window.clearInterval(this.GetRoomInfoTimer)
          }
        }, 3000)
      }
    },
    ToGetLiveRoomGiftsDetailsList () { // 获取直播间礼物打赏排行榜
      window.clearInterval(this.GiftsRankTimer)
      if (!this.IsChatClose) {
        this.GetLiveRoomGiftsDetailsList({ data: { pageNum: 1, pageSize: 10000, liveRomeId: this.LiveRoomInfo.id, type: 1 } }).then((res) => {
          this.GiftsRankList = res.data.data.list || []
        })
        this.GiftsRankTimer = window.setInterval(() => {
          if (!this.IsChatClose) {
            this.GetLiveRoomGiftsDetailsList({ data: { pageNum: 1, pageSize: 10000, liveRomeId: this.LiveRoomInfo.id, type: 1 } }).then((res) => {
              this.GiftsRankList = res.data.data.list || []
            })
          } else {
            window.clearInterval(this.GiftsRankTimer)
          }
        }, 3000)
      }
    },
    ChatInit () { // 聊天室初始化
      const _that = this
      this.RongIMLib = window.RongIMLib
      this.ChatTarget = this.RongIMLib.init({ appkey: this.Appkey }, null, { navi: 'navsg01.cn.ronghub.com' })
      this.ChatTarget.connect({ token: this.Token }).then(function () {
        _that.IsChatClose = false
        _that.ToGetLiveRoomGiftsDetailsList()
        _that.ToGetRoomInfo()
        _that.ChatRoom = _that.ChatTarget.ChatRoom.get({ id: `${_that.UserInfo.id}` })
        _that.ChatRoom.join({ count: -1 }).then(function () {
          _that.StartChatTime = Date.now()
          _that.ChatTarget.watch({
            message: function (e) {
              if (e.message.content.user.id - 0 !== _that.UserInfo.id - 0) {
                console.log(`聊天室消息监听`)
                _that.AddMsg({
                  type: _that.ReturnMsgType(e.message.messageType),
                  userName: e.message.content.user.name,
                  userId: e.message.content.user.id,
                  blockUserId: e.message.content.accountId || null,
                  blockUserName: e.message.content.accountName || null,
                  userIcon: e.message.content.user.portrait || null,
                  text: e.message.content.content || null,
                  giftImg: e.message.content.imgPath1 || null,
                  giftNum: e.message.content.number || null,
                  svgPath: e.message.content.svgPath,
                  sendTime: e.message.sentTime
                })
              }
            }
          })
        })
      }).catch(function (error) {
        console.log('error', error.code, error.msg)
      })
    },
    ReturnMsgType (type) { // 返回消息类型
      switch (type) {
        case 'RC:TxtMsg':
          return 'text'
        case 'HP:Chatroom:Gift':
          return 'gift'
        case 'HP:Chatroom:Welcome':
          return 'comming'
        case 'HP:Chatroom:User:Quit':
          return 'exit'
        case 'HP:Chatroom:Block':
          return 'getout'
        case 'HP:Chatroom:Gag':
          return 'shutup'
        case 'HP:Chatroom:UnGag':
          return 'unshutup'
        case 'HP:Chatroom:CloseLive':
          return 'stop'
        default:
          return 'text'
      }
    },
    AddMsg (msg) { // 增加聊天室信息
      console.log(`msg is`, msg)
      this.ChatList.push({ ...msg })
      if (msg.type === 'stop') {
        this.$emit('Stop')
        return false
      }
      if (msg.type === 'gift') {
        this.LastGift = { ...msg }
      }
      if (msg.type === 'shutup' && msg.blockUserId - 0 === this.UserInfo.id - 0 && msg.sendTime >= this.StartChatTime) { // 禁言
        this.IsShutUp = true
        this.$emit('ShutUp')
      }
      if (msg.type === 'unshutup' && msg.blockUserId - 0 === this.UserInfo.id - 0 && msg.sendTime >= this.StartChatTime) { // 禁言
        this.IsShutUp = false
        this.$emit('UnShutUp')
      }
      if (msg.type === 'getout' && msg.blockUserId - 0 === this.UserInfo.id - 0 && msg.sendTime >= this.StartChatTime) { // 拉黑
        this.$emit('GetOut')
      }
      this.ChatList = this.ChatList.slice(-200)
      this.$nextTick(() => {
        this.$refs.AllChatScroll.ScrollBottom()
      })
    },
    SendMsg (Msg = null, IsClose = false, callback = () => { }) { // 发送消息
      if (this.DataLock || (this.Message === '' && !IsClose) || this.ChatRoom === null) return
      this.ShowEmoji = false
      this.DataLock = true
      const _that = this
      this.ChatRoom.send({
        messageType: IsClose ? 'HP:Chatroom:CloseLive' : 'RC:TxtMsg', // 填写开发者定义的 messageType
        content: { // 填写开发者定义的消息内容
          messageName: 'TextMessage',
          content: this.Message,
          accountId: this.UserInfo.id,
          accountName: this.UserInfo.nick,
          user: {
            name: this.UserInfo.nick,
            id: this.UserInfo.id,
            portrait: this.UserInfo.picPath2
          }
        },
        pushData: '' // Push 通知时附加信息, 可不填
      }).then(function (message) {
        console.log(`发送消息监听`)
        _that.AddMsg({
          type: 'text',
          userName: _that.UserInfo.nick,
          userId: _that.UserInfo.id,
          blockUserId: null,
          userIcon: _that.UserInfo.picPath2,
          text: IsClose ? 'The live broadcast is over.' : _that.Message,
          giftImg: null,
          giftNum: null,
          svgPath: null
        })
        _that.DataLock = false
        _that.Message = ''
        callback()
      }).catch((e) => {
        console.log(e.msg)
        _that.DataLock = false
      })
    },
    CutNav (item) {
      this.CurrentNavId = item.id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
