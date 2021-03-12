<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange">
      <div class="Container flex-h" style="padding-top: 90px; width: 72%; min-width: 1100px; margin: 0 auto; position: relative; overflow: visible; padding-bottom: 20px; align-items: flex-start;" v-if="UserInfo !== null">

        <!-- 左侧菜单 -->
        <div class="Menu">
          <div class="Title">
            <span>Notification</span>
          </div>
          <nav>
            <a v-for="(item, index) in NavList" :key="index" class="flex-h" :class="{'active': item.Id === CurrentNavId}" @click="CutNav(item.Id)">
              <span class="flex-item">{{item.Name}}</span>
              <span>{{item.Count > 99 ? '99+' : item.Count}}</span>
            </a>
          </nav>
          <!-- <a :class="{'active': CurrentNavId === 'setting' }" @click="CutNav('setting')">setting</a> -->
        </div>

        <!-- 右侧内容 -->
        <div class="flex-item">

          <div v-if="CurrentNavId === 'comment'">
            <MessageForComment></MessageForComment>
          </div>

          <!-- <div v-if="CurrentNavId === '@you'">
            <MessageForAtYou></MessageForAtYou>
          </div> -->

          <div v-if="CurrentNavId === 'like'">
            <MessageForLike></MessageForLike>
          </div>

          <div v-if="CurrentNavId === 'messages'">
            <MessageForMessage></MessageForMessage>
          </div>

          <div v-if="CurrentNavId === 'follow'">
            <MessageForFollow></MessageForFollow>
          </div>

          <div v-if="CurrentNavId === 'setting'">
            <MessageForSetting></MessageForSetting>
          </div>

        </div>

      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  消息通知
*/
import MainPage from '../../components/MainPage'
import { createNamespacedHelpers } from 'vuex'
const MessageForComment = () => import('../../components/MessageForComment')
const MessageForAtYou = () => import('../../components/MessageForAtYou')
const MessageForLike = () => import('../../components/MessageForLike')
const MessageForMessage = () => import('../../components/MessageForMessage')
const MessageForSetting = () => import('../../components/MessageForSetting')
const MessageForFollow = () => import('../../components/MessageForFollow')
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage,
    MessageForComment,
    MessageForAtYou,
    MessageForLike,
    MessageForMessage,
    MessageForFollow,
    MessageForSetting
  },
  data () {
    return {
      CurrentNavId: null,
      NavList: [
        { Name: 'follow', Id: 'follow', Count: 0 },
        { Name: 'comment', Id: 'comment', Count: 0 },
        // { Name: '@you', Id: '@you', Count: 0 },
        { Name: 'like', Id: 'like', Count: 0 },
        { Name: 'messages', Id: 'messages', Count: 0 }
      ],
      DataLock: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'MsgReaded',
      'GetNoticeCount'
    ]),
    Init () {
      let Type = this.ToolClass.GetUrlParams('type')
      if (Type !== false) {
        if (Type === 'setting') {
          this.CurrentNavId = Type
        } else {
          this.NavList.map((item) => {
            if (Type === item.Id) {
              this.CurrentNavId = item.Id
            }
          })
          if (this.CurrentNavId === null) {
            this.CurrentNavId = this.NavList[0].Id
          }
        }
      } else {
        this.CurrentNavId = this.NavList[0].Id
      }
      this.ToolClass.ChangeUrlParams([{ name: 'type', value: this.CurrentNavId }])
    },
    CutNav (id) { // 切换nav
      this.CurrentNavId = id
      this.ToolClass.ChangeUrlParams([{ name: 'type', value: this.CurrentNavId }], true)
      this.CheckReaded()
    },
    CheckReaded () { // 校验已读
      let Type = this.ToolClass.GetUrlParams('type')
      this.MsgReaded({ params: { accountId: this.UserInfo.id, type: Type === 'message' ? 0 : Type === 'comment' ? 2 : Type === 'like' ? 1 : Type === 'follow' ? 5 : 0 } }).then(() => {
        this.NavList.map((item) => {
          if (item.Id === Type) {
            item.Count = 0
          }
        })
        let Bool = true
        this.NavList.map((item) => {
          if (item.Count !== 0) {
            Bool = false
          }
        })
        if (Bool) {
          this.$refs.MainPage.MsgReaded()
        }
      })
    },
    UserInfoChange () {
      this.Init()
      if (this.UserInfo !== null) {
        this.GetNoticeCount({ params: { accountId: this.UserInfo.id } }).then((res) => { // 获取通知数量
          this.NavList.map((item) => {
            if (item.Id === 'follow') {
              item.Count = res.data.data.followCnt - 0
            }
            if (item.Id === 'comment') {
              item.Count = res.data.data.commentCnt - 0
            }
            if (item.Id === 'like') {
              item.Count = res.data.data.likeCnt - 0
            }
            if (item.Id === 'messages') {
              item.Count = res.data.data.systemCnt - 0
            }
          })
          this.CheckReaded()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
