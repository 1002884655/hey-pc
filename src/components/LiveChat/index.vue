<template>
  <div class="components LiveChat flex-v">
    <span>All chat</span>

    <!-- 聊天列表 -->
    <div class="flex-item flex-v">
      <div class="flex-item">
        <div>
          <ScrollY :Size="`normal`" ref="ChatScroll">
            <div class="ChatList">
              <div v-for="(item, index) in ChatList" :key="index">
                <span class="ChatTips" v-if="item.type === 'system'">{{item.text}}</span>
                <span class="ChatTips" v-if="item.type === 'comming'"><a>{{item.userName}}</a> <em> comming</em></span>
                <span class="ChatTips" v-if="item.type === 'shutup'"><a>{{item.blockUserName}}</a> <em> has been banned.</em></span>
                <span class="ChatTips" v-if="item.type === 'unshutup' && item.blockUserId - 0 === UserInfo.id - 0"><em>You can take the floor now.</em></span>
                <div class="flex-h" v-if="item.type === 'text'">
                  <!-- <div class="UserIcon">
                    <a>
                      <img :src="item.userIcon" class="centerLabel cover" alt="">
                    </a>
                  </div> -->
                  <div class="flex-item">
                    <span><a>{{item.userName}}</a>: {{item.text}}</span>
                  </div>
                </div>
                <div class="flex-h active" v-if="item.type === 'gift'">
                  <div class="UserIcon">
                    <a>
                      <img :src="item.userIcon" class="centerLabel cover" alt="">
                    </a>
                  </div>
                  <div class="flex-item">
                    <span><a>{{item.userName}}</a></span>
                    <span>sended a gift</span>
                  </div>
                  <div class="Img">
                    <img :src="item.giftImg" class="centerLabel contain" alt="">
                  </div>
                  <span>*{{item.giftNum}}</span>
                </div>
              </div>
            </div>
          </ScrollY>
        </div>
      </div>
    </div>

    <!-- 礼物 -->
    <div class="GiftsContainer">
      <div class="flex-h Title">
        <span>Send Tips</span>
        <div class="flex-item"></div>
        <img src="../../assets/img/coin.png" height="20" alt="">
        <span>{{UserInfo.rechargeCurrency || 0}}hc</span>
        <a @click="ToRecharge">+</a>
      </div>
      <div class="GiftsList flex-h">
        <div class="flex-item">
          <div>
            <ul :style="{position: ShowMoreGifts ? 'relative' : 'absolute'}">
              <li v-for="(item, index) in GiftList" :key="index">
                <a @click.stop="CheckGiftItem(item, $event)">
                  <img :src="item.imgPath1" class="centerLabel contain" alt="">
                </a>
              </li>
            </ul>
          </div>
        </div>
        <a class="iconfont" :class="[ShowMoreGifts ? 'iconjiantoudown' : 'iconjiantouup']" @click="ShowMoreGifts = !ShowMoreGifts"></a>
      </div>
    </div>

    <!-- 礼物详情 -->
    <div class="GiftItemDetail" v-if="GiftItemDetail.id" :style="{left: `${GiftDetailX}px`, top: `${GiftDetailY}px`}" @click.stop="() => {}">
      <div class="Name flex-h">
        <div class="Img">
          <img :src="GiftItemDetail.imgPath1" class="centerLabel contain" alt="">
        </div>
        <div class="flex-item">
          <span>{{GiftItemDetail.name}}</span>
          <div>
            <img src="../../assets/img/coin.png" alt="">
            <span>{{GiftNum - 0 ? GiftItemDetail.currency * GiftNum : GiftItemDetail.currency}}</span>
          </div>
        </div>
      </div>
      <div class="Num flex-h">
        <a class="flex-item" :class="{'active': GiftNum - 0 === 10}" @click="GiftNum = 10">10</a>
        <a class="flex-item" :class="{'active': GiftNum - 0 === 50}" @click="GiftNum = 50">50</a>
        <a class="flex-item" :class="{'active': GiftNum - 0 === 99}" @click="GiftNum = 99">99</a>
        <a class="flex-item" :class="{'active': GiftNum - 0 === 999}" @click="GiftNum = 999">999</a>
        <input type="text" class="flex-item" placeholder="enter" v-model="GiftNum">
        <a class="flex-item" @click="ToSendGift">send</a>
      </div>
    </div>

    <!-- 信息发送 -->
    <div class="SendContainer">
      <div class="flex-h">
        <div class="flex-item">
          <el-input class="LiveChatInput" type="input" :placeholder="IsShutUp ? `You've been silenced` : 'say something'" v-model="Message" @input="ChatInput" @focus="IsSendChatMsg = true" @blur="IsSendChatMsg = false"></el-input>
        </div>
        <a class="iconfont iconbiaoqing EmojiIcon" @click="ShowEmoji = !ShowEmoji"></a>
        <a class="iconfont icontuiguang SendBtn" @click="SendMsg(Message)"></a>
      </div>
      <div class="LiveChatEmojiBoxer" :style="{display: ShowEmoji ? 'block' : 'none'}" ref="EmojiBoxer">
        <VEmojiPicker :pack="pack" @select="selectEmoji" />
      </div>
    </div>

  </div>
</template>

<script>
/*
  直播-聊天室
*/
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
import { createNamespacedHelpers } from 'vuex'
import ScrollY from '../ScrollY'
import { Input } from 'element-ui'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'LiveChat',
  props: {
    Token: {
      default: null,
      type: String
    },
    Appkey: {
      default: null,
      type: String
    },
    ChatRoomId: {
      default: null,
      type: String
    },
    GiftList: {
      default: () => {
        return []
      },
      type: Array
    }
  },
  data () {
    return {
      GiftNum: 10,
      GiftItemDetail: {},
      GiftDetailX: -500,
      GiftDetailY: -500,
      ShowMoreGifts: false,
      EmojiTimer: null,
      ChatRoom: null,
      IsSendChatMsg: false,
      ShowEmoji: false,
      StartChatTime: 0,
      IsShutUp: false,
      CaretIndex: 0,
      pack: packData,
      Message: '',
      DataLock: false,
      LastGift: null,
      ChatList: [
        // { type: 'system', userName: null, userId: null, userIcon: null, text: 'Welcome to live chat!Remember to guard your privacy and abide our community Guidelines.', giftImg: null, giftNum: null }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    })
  },
  components: {
    ScrollY,
    VEmojiPicker,
    'el-input': Input
  },
  created () {
    this.Init() // 初始化
  },
  mounted () {
    this.$nextTick(() => {
      this.ToolClass.WindowClick(() => {
        this.ResetGiftItemDetail()
      })
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
    ...mapUserMutations([
      'EditUserInfo'
    ]),
    ...mapUserActions([
      'GetChatRoomShutupList',
      'PostLiveGift'
    ]),
    ToSendGift () {
      if (this.UserInfo !== null) {
        if (this.UserInfo.userType - 0 === 1) {
          if (this.DataLock || !(this.GiftNum - 0) || this.ToolClass.GetUrlParams('room') === false) return
          if (this.UserInfo.rechargeCurrency - 0 < this.GiftNum * this.GiftItemDetail.currency) {
            this.$notify.error({ title: 'error', message: 'Your balance is insufficient!' })
            this.$emit('ToRecharge')
            return false
          }
          this.DataLock = true
          this.PostLiveGift({
            data: {
              accountId: this.UserInfo.id,
              giftId: this.GiftItemDetail.id,
              liveRoomId: this.ToolClass.GetUrlParams('room'),
              num: this.GiftNum
            }
          }).then(() => {
            this.EditUserInfo({ name: 'rechargeCurrency', value: this.UserInfo.rechargeCurrency - this.GiftNum * this.GiftItemDetail.currency })
            this.SendGift({
              id: this.GiftItemDetail.id,
              num: this.GiftNum,
              currency: this.GiftItemDetail.currency,
              img1: this.GiftItemDetail.imgPath1,
              img2: this.GiftItemDetail.imgPath2,
              img3: this.GiftItemDetail.imgPath3,
              name: this.GiftItemDetail.name,
              svgPath: this.GiftItemDetail.svgPath
            })
            this.DataLock = false
            this.ResetGiftItemDetail()
          }).catch(() => {
            this.DataLock = false
          })
        }
      } else {
        this.$emit('NeedLogin')
      }
    },
    CheckGiftItem (item, e) {
      this.GiftItemDetail = { ...item }
      this.GiftDetailX = e.target.getBoundingClientRect().left - 340 + 35
      this.GiftDetailY = e.target.getBoundingClientRect().top - 110
    },
    ResetGiftItemDetail () {
      this.GiftItemDetail = {}
      this.GiftDetailX = -500
      this.GiftDetailY = -500
    },
    ToRecharge () {
      if (this.UserInfo !== null) {
        this.$emit('ToRecharge')
      } else {
        this.$emit('NeedLogin')
      }
    },
    ChatInput () {
      this.Message = this.Message.substring(0, 200)
    },
    Init () { // 初始化
      this.EmojiTimer = window.setInterval(() => {
        if (document.getElementById('InputSearch')) {
          window.clearInterval(this.EmojiTimer)
          document.getElementById('InputSearch').style.display = 'none'
        }
      }, 100)
      this.GetChatRoomShutupList({ params: { chatRoomId: this.ChatRoomId } }).then((res) => {
        let Bool = true
        res.data.data.members.map((item) => {
          if (item.accountId - 0 === this.UserInfo.id - 0) {
            Bool = false
          }
        })
        if (!Bool) {
          this.IsShutUp = true
        }
        this.ScriptInit() // 初始化聊天室js
      })
    },
    GetCursortPosition (ctrl) { // 获取光标位置
      ctrl = document.getElementsByClassName(ctrl)[0]
      let CaretPos = 0
      if (document.selection) {
        ctrl.focus()
        let Sel = document.selection.createRange()
        Sel.moveStart('character', -ctrl.value.length)
        CaretPos = Sel.text.length
      } else if (ctrl.selectionStart !== undefined && (ctrl.selectionStart || ctrl.selectionStart === '0')) {
        CaretPos = ctrl.selectionStart
      }
      return CaretPos
    },
    SetCaretPosition (ctrl, pos) { // 设置光标位置
      if (ctrl.setSelectionRange) {
        ctrl.focus()
        ctrl.setSelectionRange(pos, pos)
      } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
      }
    },
    selectEmoji (emoji) { // 选择表情
      this.Message = (this.Message + emoji.emoji).substring(0, 200)
      this.ShowEmoji = false
      // if (this.IsShutUp) return
      // this.Message = this.Message.substring(0, this.CaretIndex) + emoji.emoji + this.Message.substring(this.CaretIndex)
      // this.SetCaretPosition(document.getElementsByClassName('LiveInput')[0], this.CaretIndex)
    },
    SendGift (target) { // 送礼物
      if (this.ChatRoom !== null) {
        const _that = this
        this.ChatRoom.send({
          messageType: 'HP:Chatroom:Gift', // 填写开发者定义的 messageType
          content: { // 填写开发者定义的消息内容
            id: target.id,
            imgPath1: target.img1,
            imgPath2: target.img2,
            imgPath3: target.img3,
            name: target.name,
            currency: target.currency,
            number: target.num,
            svgPath: target.svgPath,
            user: {
              name: this.UserInfo.nick,
              id: this.UserInfo.id,
              portrait: this.UserInfo.picPath2
            }
          },
          pushData: '' // Push 通知时附加信息, 可不填
        }).then(function (message) {
          _that.AddMsg({
            type: 'gift',
            userName: _that.UserInfo.nick,
            userId: _that.UserInfo.id,
            blockUserId: null,
            userIcon: _that.UserInfo.picPath2,
            text: null,
            giftImg: target.img2,
            giftNum: target.num,
            svgPath: target.svgPath
          })
          _that.DataLock = false
          _that.Message = ''
        })
      }
    },
    SendMsg (Msg) { // 发送消息
      if (this.UserInfo !== null) {
        if (this.DataLock || this.Message === '' || this.IsShutUp || this.ChatRoom === null) return
        // this.Message = ''
        this.ShowEmoji = false
        this.DataLock = true
        const _that = this
        this.ChatRoom.send({
          messageType: 'RC:TxtMsg', // 填写开发者定义的 messageType
          content: { // 填写开发者定义的消息内容
            messageName: 'TextMessage',
            content: Msg,
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
          _that.AddMsg({
            type: 'text',
            userName: _that.UserInfo.nick,
            userId: _that.UserInfo.id,
            blockUserId: null,
            userIcon: _that.UserInfo.picPath2,
            text: _that.Message,
            giftImg: null,
            giftNum: null,
            svgPath: null
          })
          _that.DataLock = false
          _that.Message = ''
        })
      } else {
        this.$emit('NeedLogin')
      }
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
    ChatInit () { // 聊天室初始化
      const _that = this
      this.RongIMLib = window.RongIMLib
      this.ChatTarget = this.RongIMLib.init({ appkey: this.Appkey }, null, { navi: 'navsg01.cn.ronghub.com' })
      this.ChatTarget.connect({ token: this.Token }).then(function (user) {
        _that.ChatRoom = _that.ChatTarget.ChatRoom.get({ id: _that.ChatRoomId })
        _that.ChatRoom.join({ count: -1 }).then(function () {
          _that.StartChatTime = Date.now()
          _that.ChatRoom.send({
            messageType: 'HP:Chatroom:Welcome', // 填写开发者定义的 messageType
            content: { // 填写开发者定义的消息内容
              accountId: _that.UserInfo.id,
              accountName: _that.UserInfo.nick,
              user: {
                name: _that.UserInfo.nick,
                id: _that.UserInfo.id,
                portrait: _that.UserInfo.picPath2
              }
            },
            pushData: '' // Push 通知时附加信息, 可不填
          }).then(function (message) {
            _that.AddMsg({
              type: 'comming',
              userName: _that.UserInfo.nick,
              userId: _that.UserInfo.id,
              blockUserId: null,
              userIcon: _that.UserInfo.picPath2,
              text: null,
              giftImg: null,
              giftNum: null,
              svgPath: null
            })
            _that.DataLock = false
            _that.Message = ''
          })
          _that.ChatTarget.watch({
            message: function (e) {
              console.log('new msg:', e.message)
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
        this.$refs.ChatScroll.ScrollBottom()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
