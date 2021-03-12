<template>
  <div class="components PlayerMainComment">
    <div class="CommentTopic">
      <textarea cols="30" rows="4" placeholder="Add a comment…" v-model="MainCommentValue" class="TopicInput" @focus="MainCommentFocus" @blur="MainCommentInputIndex = GetCursortPosition(`TopicInput`)"></textarea>
      <div class="flex-h">
        <div class="flex-item">
          <div>
            <a class="iconfont iconbiaoqing MainTopicEmoji" @click="ShowEmoji('MainTopicEmoji', 'MainCommentValue', true)"></a>
          </div>
        </div>
        <a @click="MainCommentSubmit" :class="{'active': MainCommentValue.length}">Comment</a>
      </div>
    </div>

    <!-- emoji表情盒子 -->
    <div class="EmojiBoxer" ref="MainEmojiBoxer" :class="{'active': ShowEmojiBoxer}" :style="{left: `${EmojiPosition.left}px`, top: `${EmojiPosition.top}px`}">
      <VEmojiPicker :pack="pack" @select="selectEmoji" />
    </div>
  </div>
</template>

<script>
/*
  页面名称：视频播放页-主评论输入框
  创建人：许成祥
  创建时间：2020/04/08
  最近修改人：许成祥
  最近修改日期：2020/04/08
  备注： 无
*/
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapState: mapMediaState, mapActions: mapMediaActions, mapMutations: mapMediaMutations } = createNamespacedHelpers('media')
export default {
  name: 'PlayerMainComment',
  props: ['data'],
  data () {
    return {
      pack: packData,
      CommentPage: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 1
      },
      ShowEmojiBoxer: false, // 显隐表情盒子
      NextCommentPageUnlock: true, // 下一页一级评论锁定状态
      IsLoadAll: false, // 一级评论是否加载完毕
      Level2ShowReplyUnlock: true, // 锁定展开二级回复列表状态
      ShowReplyIndex: null,
      ShowSubReplyIndex: [null, null],
      SubAtName: null,
      SubAtId: null,
      SubCommentContent: '', // 一二级评论回复内容
      CutOrderByUnLock: true, // 切换评论排序方式锁定状态
      CommentUnLock: true, // 评论锁定状态
      SubCommentUnLock: true, // 一二级评论锁定状态
      SubCommentInputIndex: 0, // 一二级评论文本光标位置
      MainCommentInputIndex: 0, // 视频评论文本光标位置
      EmojiPosition: {
        left: 0,
        top: 0
      },
      MainCommentValue: '' // 视频评论内容
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    }),
    ...mapMediaState({
      CommentList: x => x.CommentList,
      TotalCommentCounts: x => x.TotalCommentCounts
    })
  },
  components: {
    VEmojiPicker
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapMediaActions([
      'SubmitCommentForVideo',
      'GetCommentList',
      'GetCommentTotalCounts',
      'GetSubCommentList',
      'SubmitSubComment'
    ]),
    ...mapMediaMutations([
      'UpdateLevel1PageNum',
      'AddSubComment',
      'EmptyCommentList'
    ]),
    CutOrderBy (num) { // 切换评论排序方式
      if (this.CommentPage.orderBy - 0 !== num) {
        if (this.CutOrderByUnLock) {
          this.CutOrderByUnLock = false
          this.CommentPage.orderBy = num
          this.CommentPage.pageNum = 1
          this.IsLoadAll = false
          this.EmptyCommentList()
          this.NextCommentPage()
        }
      }
    },
    Init () { // 初始化
      this.NextCommentPage()
      this.GetCommentTotalCounts({ videoId: this.data.videoId })
      document.getElementById('app').onscroll = () => {
        this.ShowEmojiBoxer = false
      }
    },
    SubmitReply (index, atId, atName, id) { // 一二级评论回复提交
      if (this.UserInfo !== null) { // 已登录，执行业务逻辑
        if (this.SubCommentUnLock) {
          this.SubCommentUnLock = false
          this.SubmitSubComment({
            data: {
              atId: atId || '',
              atName: atName || '',
              parentId: id === 'self' ? '' : id,
              // parentId: id,
              commentId: this.UserInfo.id,
              content: this.SubCommentContent,
              videoId: this.data.videoId,
              level: 2
            },
            index
          }).then(() => {
            this.SubCommentUnLock = true
            this.SubCommentContent = ''
            this.ShowReplyIndex = null
            this.ShowSubReplyIndex = [null, null]
          }).catch(() => {
            this.SubCommentUnLock = true
          })
        }
      } else { // 未登录，去登录
        this.$emit('ToLogin')
      }
    },
    MainCommentFocus () { // 主评论输入框获得焦点
      this.ShowEmojiBoxer = false
      this.ShowReplyIndex = null
      this.ShowSubReplyIndex = [null, null]
    },
    ShowEmoji (target, value, bool) { // 点击选择表情按钮，显示表情盒子
      if (bool) { // 主评论选择表情时，清空一二级评论数据
        this.ShowReplyIndex = null
        this.ShowSubReplyIndex = [null, null]
      }
      this.EmojiPosition.left = document.getElementsByClassName(target)[0].getBoundingClientRect().left + 20
      this.EmojiPosition.top = document.getElementsByClassName(target)[0].getBoundingClientRect().top + 20
      this.ShowEmojiBoxer = true
    },
    selectEmoji (emoji) { // 选择表情
      if (this.ShowReplyIndex === null && this.ShowSubReplyIndex[0] === null && this.ShowSubReplyIndex[1] === null) { // 主评论输入表情
        this.MainCommentValue = this.MainCommentValue.substring(0, this.MainCommentInputIndex) + emoji.emoji + this.MainCommentValue.substring(this.MainCommentInputIndex)
        this.SetCaretPosition(document.getElementsByClassName('TopicInput')[0], this.MainCommentInputIndex)
      } else { // 一二级评论回复输入表情
        this.SubCommentContent = this.SubCommentContent.substring(0, this.SubCommentInputIndex) + emoji.emoji + this.SubCommentContent.substring(this.SubCommentInputIndex)
        if (this.ShowReplyIndex !== null) { // 一级评论回复
          this.SetCaretPosition(document.getElementsByClassName(`SubInput${this.ShowReplyIndex}`)[0], this.SubCommentInputIndex)
        } else {
          this.SetCaretPosition(document.getElementsByClassName(`SubInput${this.ShowSubReplyIndex[0]}-${this.ShowSubReplyIndex[1]}`)[0], this.SubCommentInputIndex)
        }
      }
      this.ShowEmojiBoxer = false
    },
    GetCursortPosition (ctrl) { // 获取光标位置
      ctrl = document.getElementsByClassName(ctrl)[0]
      let CaretPos = 0
      if (document.selection) {
        ctrl.focus()
        let Sel = document.selection.createRange()
        Sel.moveStart('character', -ctrl.value.length)
        CaretPos = Sel.text.length
      } else if (ctrl.selectionStart || ctrl.selectionStart === '0') {
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
    NextCommentPage () { // 下一页一级评论
      if (!this.DataLock) {
        this.$emit('TriggerCommentDataLock', true)
        if (!this.IsLoadAll) {
          this.GetCommentList({
            query: { ...this.CommentPage },
            data: { videoId: this.data.videoId, level: 1 }
          }).then((res) => {
            this.$emit('TriggerCommentDataLock', false)
            this.CutOrderByUnLock = true
            if (this.CommentList.length < res.data.data.total - 0) {
              this.CommentPage.pageNum += 1
              this.IsLoadAll = false
            } else {
              this.IsLoadAll = true
            }
          }).catch(() => {
            this.CutOrderByUnLock = true
            this.$emit('TriggerCommentDataLock', false)
          })
        }
      }
    },
    MainCommentSubmit () { // 视频评论提交
      if (this.UserInfo !== null) { // 用户已登录方可评论
        if (this.CommentUnLock) {
          if (this.MainCommentValue !== '') { // 评论不为空方可提交
            this.CommentUnLock = false // 锁定提交评论状态
            this.SubmitCommentForVideo({
              commentId: this.UserInfo.id,
              videoId: this.data.videoId,
              content: this.MainCommentValue
            }).then((res) => {
              this.CommentUnLock = true // 解锁提交评论状态
              if (res.data.code - 0 === 0) {
                this.MainCommentValue = ''
              }
            })
          }
        }
      } else { // 用户未登录，去登录
        this.$emit('ToLogin')
      }
    },
    TriggerReplyList (item, index) { // 展开一级评论回复列表
      if (this.Level2ShowReplyUnlock) {
        if (!item.ShowReplyList) { // 展开
          if (item.List.length) { // 已加载部分二级评论
            item.ShowReplyList = true
          } else { // 二级评论首次加载
            this.Level2ShowReplyUnlock = false
            this.GetSubCommentList({
              query: { pageNum: item.PageNum, pageSize: 10 },
              data: { videoId: this.data.videoId, parentId: item.Id, level: 2 },
              location: index
            }).then((res) => {
              this.Level2ShowReplyUnlock = true
              item.ShowReplyList = true
              if (item.List.length < res.data.data.total) {
                this.UpdateLevel1PageNum({ index, setNum: (target) => { target += 1 } })
              }
            }).catch(() => {
              this.Level2ShowReplyUnlock = true
            })
          }
        } else { // 收起
          item.ShowReplyList = false
        }
      }
    },
    TriggerReplyInput (index) { // 回复一级评论
      this.ShowSubReplyIndex = [null, null]
      if (this.ShowReplyIndex === index) { // 收起
        this.ShowReplyIndex = null
      } else { // 展开
        this.SubCommentContent = ''
        this.ShowReplyIndex = index
        window.setTimeout(() => {
          document.getElementsByClassName(`SubInput${index}`)[0].focus()
        }, 13)
      }
    },
    TriggerSubReplyInput (index, subIndex, atName, atId) { // 回复二级评论
      this.ShowReplyIndex = null
      this.SubAtName = atName
      this.SubAtId = atId
      if (this.ShowSubReplyIndex[0] !== null && this.ShowSubReplyIndex[1] !== null && this.ShowSubReplyIndex[0] - 0 === index && this.ShowSubReplyIndex[1] - 0 === subIndex) {
        this.ShowSubReplyIndex = [null, null]
      } else {
        this.SubCommentContent = ''
        this.ShowSubReplyIndex = [index, subIndex]
        window.setTimeout(() => {
          document.getElementsByClassName(`SubInput${index}-${subIndex}`)[0].focus()
        }, 13)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
