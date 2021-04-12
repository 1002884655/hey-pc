<template>
  <div id="app">
    <MainPage :HideFooter="true">
      <div class="PageContainer">
        <div class="centerLabel">
          <input type="text" v-model="Msg" style="color: #333">
          <a @click="SendMsg">Send</a>
        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：协议页面
  创建人：许成祥
  创建时间：2020/04/11
  最近修改人：许成祥
  最近修改日期：2020/04/11
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const { mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage
  },
  data () {
    return {
      Msg: ''
    }
  },
  computed: {
  },
  created () {
    let Token = 'JRzfE5wPYuZoQiyKwMooCi5bwORzgeCf@pusy.cn.rongnav.com;pusy.cn.rongcfg.com'
    window.RongIMLib.RongIMClient.init('bmdehs6pbahqs', null, { appkey: 'bmdehs6pbahqs', token: Token, navi: '' })
    window.RongIMLib.RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        // status 标识当前连接状态
        switch (status) {
          case window.RongIMLib.ConnectionStatus.CONNECTED:
            console.log('链接成功')
            break
          case window.RongIMLib.ConnectionStatus.CONNECTING:
            console.log('正在链接')
            break
          case window.RongIMLib.ConnectionStatus.DISCONNECTED:
            console.log('断开连接')
            break
          case window.RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            console.log('其他设备登录')
            break
          case window.RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            console.log('域名不正确')
            break
          case window.RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            console.log('网络不可用')
            break
        }
      }
    })
    window.RongIMLib.RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function (message) {
        console.log('新消息 ' + message.targetId + ':' + JSON.stringify(message))
      }
    })
    window.RongIMLib.RongIMClient.connect(Token, {
      onSuccess: function (userId) {
        console.log('链接成功，用户id：' + userId)
        window.RongIMLib.RongIMClient.getInstance().joinChatRoom('1', 10, {
          onSuccess: function () {
            // 加入聊天室成功
            console.log('加入聊天室成功')
          },
          onError: function (error) {
            // 加入聊天室失败
            console.log(error)
          }
        })
      },
      onTokenIncorrect: function () {
        console.log('token无效')
      },
      onError: function (errorCode) {
        console.log(errorCode)
      }
    }, null)
  },
  mounted () {
    this.$nextTick(() => {
      this.Init()
    })
  },
  methods: {
    ...mapUserActions([
      'GetUserLiveUrl'
    ]),
    SendMsg () {
      if (this.Msg === '') return
      window.RongIMLib.RongIMClient.getInstance().sendMessage(window.RongIMLib.ConversationType.CHATROOM, '1', new window.RongIMLib.TextMessage({ content: this.Msg, extra: '附加信息' }), {
        onSuccess: function (message) {
          // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
          console.log('Send successfully')
          this.Msg = ''
        },
        onError: function (errorCode, message) {
          switch (errorCode) {
            case window.RongIMLib.ErrorCode.TIMEOUT:
              break
            case window.RongIMLib.ErrorCode.UNKNOWN:
              break
            case window.RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
              break
            case window.RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
              break
            case window.RongIMLib.ErrorCode.NOT_IN_GROUP:
              break
            case window.RongIMLib.ErrorCode.NOT_IN_CHATROOM:
              break
          }
          console.log('发送失败: ' + errorCode)
        }
      })
    },
    Init () {
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
