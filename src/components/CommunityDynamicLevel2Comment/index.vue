<template>
  <div class="components CommunityDynamicLevel2Comment">

    <!-- 评论列表 -->
    <ul class="Level1CommentList">
      <li v-for="(item, index) in PageList" :key="index" class="flex-h">
        <a class="Icon" :href="`./userspace.html?key=${item.userId}`">
          <img :src="item.picPath1" class="centerLabel cover" alt="">
        </a>
        <div class="flex-item">
          <div class="Name">
            <a :href="`./userspace.html?key=${item.userId}`">{{item.userName}}</a>
            <span>{{item.createTime | changeTime}}</span>
          </div>
          <div class="Content">
            <span><a v-if="item.atName !== null" :href="`./userspace.html?key=${item.atId}`">{{`@${item.atName}`}}</a>{{item.content}}</span>
          </div>
          <div class="Tab">
            <a @click="TriggerLevel2Input(index)">Reply</a>
            <a class="iconfont iconshanchu1 Delete" v-if="UserInfo !== null && (UserInfo.id === item.userId || UserInfo.id === MsgUserId)" @click="DeleteItem(item, index)"></a>
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
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityDynamicLevel2Comment',
  props: {
    Data: {
      default: () => {
        return {}
      },
      type: Object
    },
    MsgId: {
      default: null,
      type: Number
    },
    MsgUserId: {
      default: null,
      type: Number
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
      ShowLevel2CommentList: false, // 显隐二级评论列表
      Level2CommentList: [] // 二级评论列表
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    })
  },
  components: {
    VEmojiPicker
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
      'GetDynamicLevel2Comment',
      'PushDynamicLevel1Comment',
      'DeleteUserComment',
      'DeleteOtherUserComment'
    ]),
    Init () { // 初始化
      this.PageData.pageNum = 1
      this.PageList = []
      this.ToGetDynamicLevel2Comment()
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
        } else if (this.UserInfo.id === this.MsgUserId) { // 发推人删除别人的评论
          this.DeleteOtherUserComment({ params: { commentId: item.id, accountId: this.UserInfo.id, msgId: this.MsgId } }).then((res) => {
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
          msgId: this.MsgId,
          parentId: this.Data.id,
          atId: item.id,
          atName: item.userName
        }
      }).then((res) => {
        this.$notify.success({
          title: 'success',
          message: res.data.msg
        })
        this.Level2CommentText = ''
        this.DataLock = false
        this.$emit('NumChange', 1)
        this.Init()
      }).catch(() => {
        this.DataLock = false
      })
    },
    NextPage () {
      if (!this.HasNextPage) return
      this.PageData.pageNum += 1
      this.ToGetDynamicLevel2Comment()
    },
    ToGetDynamicLevel2Comment () { // 请求二级评论列表
      if (this.DataLock) return
      this.DataLock = true
      this.GetDynamicLevel2Comment({ params: { ...this.PageData, commentId: this.Data.id } }).then((res) => {
        this.PageData.pageNum = res.data.data.pageNum
        this.HasNextPage = res.data.data.hasNextPage
        let Arr = res.data.data.list || []
        Arr.map((item) => {
          this.PageList.push({ ...item, ShowLevel2Input: false })
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
