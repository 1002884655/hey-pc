<template>
  <div class="components CommunityItem">
    <div class="flex-h">
      <div class="Icon" @click="ToolClass.LinkTo(`./userspace.html?key=${Data.userId}`)">
        <img :src="Data.picPath1" class="centerLabel cover" alt="">
      </div>
      <div class="flex-item">
        <div class="Title flex-h">
          <div class="flex-item">
            <a :href="`./userspace.html?key=${Data.userId}`">{{Data.userName}}</a>
            <span>{{Data.createTime | changeTime}}</span>
          </div>
          <a @mouseover="ToCheckSubscribe">
            <i class="iconfont iconjiantoudown"></i>
            <nav class="Tips">
              <a v-if="UserInfo !== null && UserInfo.id !== Data.userId && Subscribed !== null" @click="TriggerSubscribed">{{Subscribed === true ? 'Unfollowed' : 'Followed'}} <em>@{{Data.userName}}</em></a>
              <a v-if="UserInfo !== null && UserInfo.id !== Data.userId && Subscribed === null">...</a>
              <a v-if="UserInfo !== null && UserInfo.id === Data.userId" @click="DeleteItem">Delete</a>
            </nav>
          </a>
        </div>
        <div class="Content">
          <span>{{Data.content}}</span>
        </div>
        <div class="Tab">
          <a @click="$emit('Like')" :class="{'active': Data.Liked}">
            <i class="iconfont icondianzan"></i>
            <span>{{Data.likeNum}}</span>
          </a>
          <a @click="ShowComment = !ShowComment">
            <i class="iconfont iconpinglun-"></i>
            <span>{{Data.replyNum + NewCommentCount}}</span>
          </a>
          <!-- <a>
            <i class="iconfont iconfenxiang-"></i>
            <span>{{Data.shareNum}}</span>
          </a> -->
        </div>
      </div>
    </div>

    <!-- 主评论框 -->
    <div class="Level1Input" v-if="ShowComment">
      <textarea cols="30" rows="3" v-model="Level1CommentText" @input="Level1CommentText = Level1CommentText.substring(0, 280)"></textarea>
      <div class="flex-h">
        <a class="iconfont iconbiaoqing TopicEmoji">
          <div>
            <VEmojiPicker :pack="PackData" @select="SelectLevel1Emoji" />
          </div>
        </a>
        <div class="flex-item"></div>
        <a @click="PushComment">Tweet</a>
      </div>
    </div>

    <!-- 评论 -->
    <div class="CommentContainer" v-if="ShowComment">
      <CommunityDynamicLevel1Comment :ref="`CommunityDynamicLevel1Comment${Data.id}`" :Data="Data" @NeedLogin="$emit('NeedLogin')" @NumChange="NumChange"></CommunityDynamicLevel1Comment>
    </div>

  </div>
</template>

<script>
/*
  动态 item
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
import CommunityDynamicLevel1Comment from '../CommunityDynamicLevel1Comment'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityItem',
  props: {
    Data: {
      default: () => {
        return {}
      },
      type: Object
    },
    Index: {
      default: null
    }
  },
  data () {
    return {
      Subscribed: null,
      PackData: packData,
      Level1CommentText: '',
      PageData: {
        pageNum: 1,
        pageSize: 10
      },
      NewCommentCount: 0,
      HasNextPage: true,
      DataLock: false,
      ShowComment: false,
      CommentList: []
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo,
      OtherUserInfo: x => x.OtherUserInfo // 其他用户信息
    })
  },
  components: {
    VEmojiPicker,
    CommunityDynamicLevel1Comment
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetDynamicLevel1Comment',
      'PushDynamicLevel1Comment',
      'DeleteUserDynamic',
      'DeleteOtherUserComment',
      'CheckSubscribe',
      'AccountSubscribe',
      'Unsubscribe'
    ]),
    TriggerSubscribed () { // 订阅、取消订阅用户
      if (this.DataLock) return
      this.DataLock = true
      if (this.Subscribed) { // 取消订阅用户
        this.Unsubscribe({ params: { subId: this.Data.userId, accountId: this.UserInfo.id } }).then((res) => {
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.Subscribed = false
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      } else { // 订阅用户
        this.AccountSubscribe({ params: { subId: this.Data.userId, accountId: this.UserInfo.id } }).then((res) => {
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.Subscribed = true
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
    ToCheckSubscribe () { // 检查是否订阅某人
      if (this.UserInfo === null || this.UserInfo.id === this.Data.userId || this.Subscribed !== null) return
      this.CheckSubscribe({ params: { subId: this.Data.userId, accountId: this.UserInfo.id } }).then((res) => {
        this.Subscribed = !!(res.data.data.subscribeStatus - 0)
      })
    },
    NumChange (e) { // 评论数变化
      this.$emit('NumChange', { index: this.Index, Num: e })
    },
    DeleteItem () { // 删除动态
      if (this.DataLock) return
      this.ToolClass.Confirm('Delete dynamic', 'Are you sure to delete this dynamic', () => { }, (close) => {
        this.DataLock = true
        this.DeleteUserDynamic({ params: { msgId: this.Data.id, accountId: this.UserInfo.id } }).then((res) => {
          close()
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.DataLock = false
          this.$emit('Delete')
        }).catch((res) => {
          close()
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      })
    },
    SelectLevel1Emoji (emoji) { // 选择表情
      this.Level1CommentText += emoji.emoji
    },
    PushComment () { // 发表主评论
      if (this.UserInfo === null) {
        this.$emit('NeedLogin')
        return false
      }
      if (this.Level1CommentText === '') {
        this.$notify.error({
          title: 'error',
          message: 'Comment content cannot be empty!'
        })
        return false
      }
      if (this.DataLock) return
      this.DataLock = true
      this.PushDynamicLevel1Comment({
        data: {
          accountId: this.UserInfo.id,
          content: this.Level1CommentText,
          msgId: this.Data.id
        }
      }).then((res) => {
        this.$notify.success({
          title: 'success',
          message: res.data.msg
        })
        this.Level1CommentText = ''
        if (this.ShowComment) {
          this.$refs[`CommunityDynamicLevel1Comment${this.Data.id}`].Init()
        } else {
          this.ShowComment = true
        }
        this.$emit('NumChange', { index: this.Index, Num: 1 })
        this.DataLock = false
      }).catch(() => {
        this.DataLock = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
