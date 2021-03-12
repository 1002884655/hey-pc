<template>
  <div class="components CommunityDynamicLevel1Comment">

    <!-- 评论列表 -->
    <ul class="Level1CommentList">
      <li v-for="(item, index) in PageList" :key="index" class="flex-h">
        <a class="Icon" :href="`./userspace.html?key=${item.userId}`">
          <img :src="item.picPath1" class="centerLabel cover">
        </a>
        <div class="flex-item">
          <div class="Name">
            <a :href="`./userspace.html?key=${item.userId}`">{{item.userName}}</a>
            <span>{{item.createTime | changeTime}}</span>
          </div>
          <div class="Content">
            <span>{{item.content}}</span>
          </div>
          <div class="Tab">
            <a @click="TriggerLevel2Input(index)">Reply</a>
            <a class="iconfont iconshanchu1 Delete" v-if="UserInfo !== null && (UserInfo.id === item.userId || UserInfo.id === Data.userId)" @click="DeleteItem(item, index)"></a>
          </div>

          <!-- 2级评论框 -->
          <div class="Level2Input" v-if="item.ShowLevel2Input">
            <textarea cols="30" rows="3" v-model="Level2CommentText" @input="Level2CommentText = Level2CommentText.substring(0, 280)"></textarea>
            <div class="flex-h">
              <a class="iconfont iconbiaoqing TopicEmoji">
                <div>
                  <VEmojiPicker :pack="PackData" @select="SelectLevel2Emoji" />
                </div>
              </a>
              <div class="flex-item"></div>
              <a @click="PushLevel2Comment(item, index)">Tweet</a>
            </div>
          </div>

          <!-- 显隐二级评论按钮 -->
          <div class="TriggerLevel2CommentList" v-if="item.replyNum">
            <a @click="TriggerLevel2CommentList(item)">
              <i class="iconfont" :class="[item.ShowLevel2CommentList ? 'iconshixinjiantouup' : 'iconshixinjiantoudown']"></i>
              <span>{{item.ShowLevel2CommentList ? 'Hide reply' : 'View reply'}}</span>
            </a>
          </div>

          <!-- 二级评论列表 -->
          <div class="Level2CommentList" v-if="item.ShowLevel2CommentList">
            <CommunityDynamicLevel2Comment :ref="`CommunityDynamicLevel2Comment${item.id}`" :Data="item" :MsgUserId="Data.userId" :MsgId="Data.id" @NeedLogin="$emit('NeedLogin')" @NumChange="NumChange"></CommunityDynamicLevel2Comment>
          </div>

        </div>
      </li>
    </ul>

    <!-- 下一页 -->
    <div class="NextPage" v-if="HasNextPage && PageList.length">
      <a @click="NextPage">
        <i class="iconfont iconshixinjiantoudown"></i>
        <span>Show more replies</span>
      </a>
    </div>

  </div>
</template>

<script>
/*
  动态页面-评论组件
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
import CommunityDynamicLevel2Comment from '../CommunityDynamicLevel2Comment'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityDynamicLevel1Comment',
  props: {
    Data: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      PageList: [],
      Level2CommentText: '', // 二级评论内容
      DataLock: false, // 数据锁
      PackData: packData,
      PageData: {
        pageNum: 1,
        pageSize: 10
      },
      HasNextPage: true,
      Level2CommentList: [] // 二级评论列表
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    })
  },
  components: {
    VEmojiPicker,
    CommunityDynamicLevel2Comment
  },
  created () {
    this.Init() // 初始化
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetDynamicLevel1Comment',
      'PushDynamicLevel1Comment',
      'DeleteUserComment',
      'DeleteOtherUserComment'
    ]),
    Init () { // 初始化
      this.PageData.pageNum = 1
      this.PageList = []
      this.ToGetDynamicLevel1Comment()
    },
    DeleteItem (item, index) { // 删除评论
      if (this.DataLock) return
      this.ToolClass.Confirm('Delete comment', 'Are you sure to delete this comment', () => { }, (close) => {
        this.DataLock = true
        if (this.UserInfo.id === item.userId) { // 用户删除自己的评论
          this.DeleteUserComment({ params: { commentId: item.id, accountId: this.UserInfo.id } }).then((res) => {
            close()
            this.$notify.success({
              title: 'success',
              message: res.data.msg
            })
            this.DataLock = false
            this.PageList.splice(index, 1)
          }).catch((res) => {
            close()
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        } else if (this.UserInfo.id === this.Data.userId) { // 发推人删除别人的评论
          this.DeleteOtherUserComment({ params: { commentId: item.id, accountId: this.UserInfo.id, msgId: this.Data.id } }).then((res) => {
            close()
            this.$notify.success({
              title: 'success',
              message: res.data.msg
            })
            this.DataLock = false
            this.PageList.splice(index, 1)
          }).catch((res) => {
            close()
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        }
      })
    },
    NumChange (e) { // 评论数变化
      this.$emit('NumChange', e)
    },
    PushLevel2Comment (item, index) { // 发送二级评论
      if (this.UserInfo === null) {
        this.$emit('NeedLogin')
        return false
      }
      if (this.Level2CommentText === '') {
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
          content: this.Level2CommentText,
          msgId: this.Data.id,
          parentId: item.id
        }
      }).then((res) => {
        this.$notify.success({
          title: 'success',
          message: res.data.msg
        })
        this.Level2CommentText = ''
        item.ShowLevel2CommentList = false
        window.setTimeout(() => {
          item.ShowLevel2CommentList = true
        }, 100)
        this.$emit('NumChange', 1)
        this.DataLock = false
      }).catch(() => {
        this.DataLock = false
      })
    },
    TriggerLevel2Input (index) { // 显隐2级评论框
      if (this.PageList[index].ShowLevel2Input) {
        this.Level2CommentText = ''
        this.PageList[index].ShowLevel2Input = false
      } else {
        this.PageList.map((thisItem, thisIndex) => {
          thisItem.ShowLevel2Input = thisIndex === index
        })
      }
    },
    TriggerLevel2CommentList (item) { // 显隐2级评论列表
      item.ShowLevel2CommentList = !item.ShowLevel2CommentList
    },
    NextPage () {
      if (this.DataLock || !this.HasNextPage) return
      this.PageData.pageNum += 1
      this.ToGetDynamicLevel1Comment()
    },
    ToGetDynamicLevel1Comment () { // 请求一级评论列表
      if (this.DataLock) return
      this.DataLock = true
      this.GetDynamicLevel1Comment({ params: { ...this.PageData, msgId: this.Data.id } }).then((res) => {
        this.PageData.pageNum = res.data.data.pageNum
        this.HasNextPage = res.data.data.hasNextPage
        let Arr = res.data.data.list || []
        Arr.map((item) => {
          this.PageList.push({ ...item, ShowLevel2Input: false, ShowLevel2CommentList: false })
        })
        this.DataLock = false
      }).catch(() => {
        this.DataLock = false
      })
    },
    SelectLevel2Emoji (emoji) { // 选择表情
      this.Level2CommentText += emoji.emoji
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
