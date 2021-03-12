<template>
  <div class="components MessageForComment">
    <nav>
      <a v-for="(item, index) in NavList" :key="index" :class="{'active': CurrentNavId === item.Id}" @click="CutNav(item.Id)">{{item.Name}}</a>
    </nav>

    <ul>
      <li v-for="(item, index) in PageList" :key="index" :style="{zIndex: PageList.length - index}" class="flex-h">
        <div class="flex-item flex-h">
          <div class="Icon">
            <a :href="`./userspace.html?key=${item.accountId}`">
              <img :src="item.picPath2" class="centerLabel cover" alt="">
            </a>
          </div>
          <div class="flex-item">
            <div>
              <div class="Top">
                <a :href="`./userspace.html?key=${item.accountId}`">{{item.userName}}</a>
                <span>reply to your {{item.type - 0 === 1 || item.type - 0 === 3 ? 'comment' : item.type - 0 === 2 ? 'video' : 'dynamic'}}</span>
              </div>
              <span>{{item.content}}</span>
              <div class="Time">
                <span>{{ToolClass.FilterTimer(item.createTime)}}</span>
                <a @click="TriggerReply(item, index)">Reply</a>
              </div>
              <div class="ReplyArea" v-if="item.ShowReply">
                <textarea cols="30" rows="3" v-model="ReplyText"></textarea>
                <div class="flex-h">
                  <a>
                    <i class="iconfont iconbiaoqing"></i>
                    <div>
                      <VEmojiPicker :pack="PackData" @select="SelectEmoji" />
                    </div>
                  </a>
                  <div class="flex-item"></div>
                  <a @click="ToComment(item)">Comment</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ParentTarget">
          <span v-if="item.type - 0 !== 2">{{item.replyContent}}</span>
          <div class="Img" v-else>
            <img :src="item.frontPath" width="100%" alt="">
            <a class="iconfont iconbofang centerLabel" :href="`./video.html?key=${item.videoM}`"></a>
          </div>
        </div>
      </li>
    </ul>

    <!-- 下一页 -->
    <div class="NextPage" v-if="Total !== null">
      <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
    </div>

  </div>
</template>

<script>
/*
  消息通知-评论
*/
import Vue from 'vue'
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
import { createNamespacedHelpers } from 'vuex'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
Vue.prototype.$notify = Notification
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
const { mapActions: mapMediaActions } = createNamespacedHelpers('media')
export default {
  name: 'MessageForComment',
  props: ['data'],
  data () {
    return {
      DataLock: false,
      PageList: ['', '', '', ''],
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') - 0 || 1,
        pageSize: 10
      },
      Total: null,
      ReplyText: '',
      PackData: packData,
      CurrentNavId: null,
      NavList: [
        { Name: 'Video', Id: 'video' },
        { Name: 'Social', Id: 'social' }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      NoticeForMyVideoComment: x => x.NoticeForMyVideoComment, // 视频评论列表
      NoticeForMyDynamicComment: x => x.NoticeForMyDynamicComment // 动态评论列表
    })
  },
  components: {
    VEmojiPicker,
    'el-pagination': Pagination
  },
  created () {
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetNoticeForMyVideoComment',
      'GetNoticeForMyDynamicComment',
      'PushDynamicLevel1Comment'
    ]),
    ...mapMediaActions([
      'SubmitSubComment'
    ]),
    Init () {
      let Comment = this.ToolClass.GetUrlParams('comment')
      if (Comment !== false) {
        if (Comment === 'setting') {
          this.CurrentNavId = Comment
        } else {
          this.NavList.map((item) => {
            if (Comment === item.Id) {
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
      this.ToolClass.ChangeUrlParams([{ name: 'comment', value: this.CurrentNavId }])
      if (!(this.ToolClass.GetUrlParams('pages') - 0)) {
        this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
      }
      this.ToGetPageList()
    },
    ToComment (item) { // 回复
      if (this.DataLock || this.ReplyText === '') return
      this.DataLock = true
      if (item.type === 1 || item.type === 2) { // 回复我的视频评论
        this.SubmitSubComment({
          data: {
            atId: item.accountId,
            atName: item.userName,
            parentId: item.parentId - 0 ? item.parentId : item.id,
            commentId: this.UserInfo.id,
            content: this.ReplyText,
            videoId: item.videoId,
            level: 2
          }
        }).then((res) => {
          this.$notify.success({ title: 'success', message: res.data.msg })
          item.ShowReply = false
          this.ReplyText = ''
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({ title: 'error', message: res.data.msg })
          this.DataLock = false
        })
      } else { // 回复我评论的消息
        this.PushDynamicLevel1Comment({
          data: {
            accountId: this.UserInfo.id,
            content: this.ReplyText,
            msgId: item.msgId,
            parentId: item.parentId - 0 ? item.parentId : item.id,
            atId: item.accountId,
            atName: item.userName
          }
        }).then((res) => {
          this.$notify.success({ title: 'success', message: res.data.msg })
          item.ShowReply = false
          this.ReplyText = ''
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({ title: 'error', message: res.data.msg })
          this.DataLock = false
        })
      }
    },
    TriggerReply (item, index) { // 显隐回复框
      if (item.ShowReply) {
        item.ShowReply = false
        this.ReplyText = ''
      } else {
        this.PageList.map((cItem) => {
          cItem.ShowReply = false
        })
        this.ReplyText = ''
        item.ShowReply = true
      }
    },
    PageChange (e) {
      this.PageList = []
      this.PageData.pageNum = e
      this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
      this.ToGetPageList()
    },
    GetList (foo = () => { }, res) { // 获取列表公用方法
      foo.then((res) => {
        if (this.CurrentNavId === 'video') {
          let Arr = []
          this.NoticeForMyVideoComment.map((item) => {
            Arr.push({ ...item, ShowReply: false })
          })
          this.PageList = Arr
        }
        if (this.CurrentNavId === 'social') {
          let Arr = []
          this.NoticeForMyDynamicComment.map((item) => {
            Arr.push({ ...item, ShowReply: false })
          })
          this.PageList = Arr
        }
        this.Total = res.data.data.total
        this.PageData.pageNum = res.data.data.pageNum
        this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
        this.DataLock = false
      }).catch((res) => {
        this.DataLock = false
      })
    },
    ToGetPageList () { // 获取分页列表
      if (this.DataLock) return
      this.DataLock = true
      if (this.CurrentNavId === 'video') {
        this.GetList(this.GetNoticeForMyVideoComment({ params: { ...this.PageData, accountId: this.UserInfo.id } }))
      }
      if (this.CurrentNavId === 'social') {
        this.GetList(this.GetNoticeForMyDynamicComment({ params: { ...this.PageData, accountId: this.UserInfo.id } }))
      }
    },
    SelectEmoji (emoji) { // 选择表情
      this.ReplyText += emoji.emoji
    },
    CutNav (id) { // 切换nav
      if (this.DataLock) return
      this.CurrentNavId = id
      this.PageData.pageNum = 1
      this.Total = null
      this.PageList = []
      this.ToolClass.ChangeUrlParams([{ name: 'comment', value: this.CurrentNavId }, { name: 'pages', value: 1 }])
      this.ToGetPageList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
