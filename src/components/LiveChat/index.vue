<template>
  <div class="components LiveChat flex-v">
    <span>All chat</span>
    <div class="flex-item flex-v">
      <!-- <div class="TopGift">
        <div v-if="LastGift !== null">
          <a><img :src="LastGift.userIcon" class="centerLabel cover" alt=""></a>
          <div><img :src="LastGift.giftImg" class="centerLabel contain" alt=""></div>
          <span>*{{LastGift.giftNum}}</span>
        </div>
      </div> -->
      <div class="flex-item">
        <div>
          <ScrollY :Size="`normal`" ref="ChatScroll">
            <div class="ChatList">
              <div v-for="(item, index) in ChatList" :key="index">
                <span class="ChatTips" v-if="item.type === 'system'">{{item.text}}</span>
                <span class="ChatTips" v-if="item.type === 'comming'"><a>{{item.userName}}</a> <em> comming</em></span>
                <span class="ChatTips" v-if="item.type === 'shutup'"><a>{{item.blockUserName}}</a> <em> has been banned.</em></span>
                <span class="ChatTips" v-if="item.type === 'unshutup' && item.blockUserId - 0 === UserInfo.id - 0"><em>You can take the floor now.</em></span>
                <!-- <span class="ChatTips" v-if="item.type === 'exit'"><a>{{item.userName}}</a> exit</span> -->
                <div class="flex-h" v-if="item.type === 'text'">
                  <div class="UserIcon">
                    <a>
                      <img :src="item.userIcon" class="centerLabel cover" alt="">
                    </a>
                  </div>
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
    <div class="SendContainer flex-h">
      <a>
        <img :src="UserInfo !== null ? UserInfo.picPath2 : null" class="centerLabel cover" alt="">
      </a>
      <div class="flex-item">
        <span>{{UserInfo !== null ? UserInfo.nick : null}}</span>
        <div class="Input">
          <el-input class="LiveChatInput" type="textarea" :autosize="{ minRows: 1, maxRows: 6}" :placeholder="IsShutUp ? `You've been silenced` : 'say something'" v-model="Message" @input="ChatInput" @focus="IsSendChatMsg = true" @blur="IsSendChatMsg = false"></el-input>
        </div>
        <!-- <textarea :disabled="IsShutUp" cols="30" rows="1" :placeholder="IsShutUp ? `You've been silenced` : 'say something'" v-model="Message" class="LiveInput" @input="Message = Message.substring(0, 200)" @focus="IsSendChatMsg = true" @blur="IsSendChatMsg = false; CaretIndex = GetCursortPosition(`LiveInput`)"></textarea> -->
        <div class="flex-h">
          <a class="iconfont iconbiaoqing" @click="ShowEmoji = !ShowEmoji">
            <!-- emoji表情盒子 -->
            <!-- <div class="EmojiBoxer" ref="EmojiBoxer">
              <VEmojiPicker :pack="pack" @select="selectEmoji" />
            </div> -->
          </a>
          <div class="flex-item"></div>
          <span>{{Message.length}}/200</span>
          <a class="SendBtn" @click="SendMsg(Message)">
            <i class="iconfont icontuiguang centerLabel"></i>
          </a>
        </div>
        <div class="LiveChatEmojiBoxer" :style="{display: ShowEmoji ? 'block' : 'none'}" ref="EmojiBoxer">
          <VEmojiPicker :pack="pack" @select="selectEmoji" />
        </div>
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
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
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
    }
  },
  data () {
    return {
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
      'GetChatRoomShutupList'
    ]),
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
