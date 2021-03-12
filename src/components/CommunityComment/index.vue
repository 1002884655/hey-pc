<template>
  <div class="components CommunityComment">

    <!-- 主评论框 -->
    <div class="Level1Input">
      <textarea cols="30" rows="3" @focus="$emit('Level1InputFocus')" v-model="Level1CommentText" @input="Level1CommentText = Level1CommentText.substring(0, 280)"></textarea>
      <div class="flex-h">
        <a class="iconfont iconbiaoqing TopicEmoji">
          <div>
            <VEmojiPicker :pack="PackData" @select="SelectLevel1Emoji" />
          </div>
        </a>
        <div class="flex-item"></div>
        <a @click="PushLevel1Comment">{{Level1PushLoading ? 'Loading...' : 'Tweet'}}</a>
      </div>
    </div>

    <!-- 评论列表 -->
    <ul class="Level1CommentList">
      <li v-for="(item, index) in List" :key="index" class="flex-h">
        <a class="Icon">
          <img :src="item.picPath1" class="centerLabel cover" alt="">
        </a>
        <div class="flex-item">
          <div class="Name">
            <a>{{item.userName}}</a>
          </div>
          <div class="Content">
            <span>{{item.content}}</span>
          </div>
          <div class="Tab" @click="Level2CommentText = ''; $emit('TriggerLevel2Input', index)">
            <a>Reply</a>
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
              <a>Tweet</a>
            </div>
          </div>

          <!-- 显隐二级评论按钮 -->
          <div class="TriggerLevel2CommentList" v-if="item.replyNum">
            <a @click="TriggerLevel2CommentList(item)">
              <i class="iconfont" :class="[ShowLevel2CommentList ? 'iconshixinjiantouup' : 'iconshixinjiantoudown']"></i>
              <span>{{ShowLevel2CommentList ? 'Hide reply' : 'View reply'}}</span>
            </a>
          </div>

          <!-- 二级评论列表 -->
          <div class="Level2CommentList" v-if="ShowLevel2CommentList">
            <CommunitySubComment :Data="item"></CommunitySubComment>
          </div>
          <!-- <ul class="Level2CommentList" v-if="ShowLevel2CommentList">
            <li v-for="(subItem, subIndex) in Level2CommentList" :key="subIndex" class="flex-h">
              <a class="Icon">
                <img :src="subItem.picPath1" class="centerLabel cover" alt="">
              </a>
              <div class="flex-item">
                <div class="Name">
                  <a>{{subItem.userName}}</a>
                </div>
                <div class="Content">
                  <span>{{subItem.content}}</span>
                </div>
                <div class="Tab" @click="TriggerLevel2Reply(subIndex)">
                  <a>Reply</a>
                </div>

                <div class="Level2Input" v-if="subItem.ShowLevel2Input">
                  <textarea cols="30" rows="3" v-model="Level2CommentText" @input="Level2CommentText = Level2CommentText.substring(0, 280)"></textarea>
                  <div class="flex-h">
                    <a class="iconfont iconbiaoqing TopicEmoji">
                      <div>
                        <VEmojiPicker :pack="PackData" @select="SelectLevel2Emoji" />
                      </div>
                    </a>
                    <div class="flex-item"></div>
                    <a>Tweet</a>
                  </div>
                </div>

              </div>
            </li>
          </ul> -->

        </div>
      </li>
    </ul>

    <!-- 下一页 -->
    <div class="NextPage" v-if="HasNextPage && List.length">
      <a @click="$emit('NextPage')">
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
import CommunitySubComment from '../CommunitySubComment'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityComment',
  props: {
    Data: {
      default: () => {
        return {}
      },
      type: Object
    },
    List: {
      default: () => {
        return []
      },
      type: Array
    },
    HasNextPage: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      Level2CommentText: '', // 二级评论内容
      DataLock: false, // 数据锁
      Level1CommentText: '', // 一级评论内容
      PackData: packData,
      EmojiPosition: {
        left: 0,
        top: 0
      },
      PageData: {
        pageNum: 1,
        pageSize: 10
      },
      SubHasNextPage: true,
      ShowLevel2CommentList: false, // 显隐二级评论列表
      Level2CommentList: [], // 二级评论列表
      Level1PushLoading: false, // 一级评论加载状态
      ShowEmojiBoxer: false // 显隐表情盒子
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    })
  },
  components: {
    VEmojiPicker,
    CommunitySubComment
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'PushDynamicLevel1Comment',
      'GetDynamicLevel2Comment'
    ]),
    TriggerLevel2Reply (index) { // 显隐二级评论列表中回复框
      if (this.Level2CommentList[index].ShowLevel2Input) {
        this.Level2CommentText = ''
        this.Level2CommentList[index].ShowLevel2Input = false
      } else {
        this.Level2CommentList.map((thisItem, thisIndex) => {
          thisItem.ShowLevel2Input = thisIndex === index
        })
      }
    },
    TriggerLevel2CommentList (item) { // 显隐二级评论列表
      if (this.DataLock) return
      this.DataLock = true
      if (this.ShowLevel2CommentList) {
        this.ShowLevel2CommentList = false
        this.DataLock = false
      } else {
        if (this.Level2CommentList.length) {
          this.ShowLevel2CommentList = true
          this.DataLock = false
        } else {
          this.GetDynamicLevel2Comment({ params: { ...this.PageData, commentId: item.id } }).then((res) => {
            this.PageData.pageNum = res.data.data.pageNum
            this.SubHasNextPage = res.data.data.hasNextPage
            let Arr = res.data.data.list || []
            Arr.map((item) => {
              this.Level2CommentList.push({ ...item, ShowLevel2Input: false })
            })
            this.DataLock = false
          }).catch(() => {
            this.DataLock = false
          })
        }
      }
    },
    PushLevel1Comment () { // 发送一级评论
      if (this.Level1CommentText === '') {
        this.$notify.error({
          title: 'error',
          message: 'Comment content cannot be empty!'
        })
        return false
      }
      if (this.DataLock) return
      this.DataLock = true
      this.Level1PushLoading = true
      this.PushDynamicLevel1Comment({
        data: { accountId: this.UserInfo.id, content: this.Level1CommentText, msgId: this.Data.id }
      }).then((res) => {
        this.$notify.success({
          title: 'success',
          message: res.data.msg
        })
        this.$emit('Level1CommentChange', 1)
        this.Level1CommentText = ''
        this.DataLock = false
        this.Level1PushLoading = false
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
        this.DataLock = false
        this.Level1PushLoading = false
      })
    },
    SelectLevel1Emoji (emoji) { // 选择表情
      this.Level1CommentText += emoji.emoji
    },
    SelectLevel2Emoji (emoji) { // 选择表情
      this.Level2CommentText += emoji.emoji
    },
    ShowEmoji (target, value, bool) { // 点击选择表情按钮，显示表情盒子
      this.EmojiPosition.left = document.getElementsByClassName(target)[0].getBoundingClientRect().left + 20
      this.EmojiPosition.top = document.getElementsByClassName(target)[0].getBoundingClientRect().top + 20
      this.ShowEmojiBoxer = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
