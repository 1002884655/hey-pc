<template>
  <div class="components CommunitySubComment">

    <!-- 主评论框 -->
    <div class="Level2Input">
      <textarea cols="30" rows="3"></textarea>
      <div class="flex-h">
        <a class="iconfont iconbiaoqing TopicEmoji">
          <div>
            <VEmojiPicker :pack="PackData" @select="SelectEmoji" />
          </div>
        </a>
        <div class="flex-item"></div>
        <a>Tweet</a>
      </div>
    </div>

    <!-- 评论列表 -->
    <ul class="Level2CommentList">
      <li v-for="(item, index) in List" :key="index" class="flex-h">
        <a class="Icon">
          <img src="" class="centerLabel cover" alt="">
        </a>
        <div class="flex-item">
          <div class="Name">
            <a>{{item.userName}}</a>
          </div>
          <div class="Content">
            <span>{{item.content}}</span>
          </div>
          <div class="Tab">
            <a>Replay</a>
          </div>
          <div class="Level2Input" v-if="false">
            <textarea cols="30" rows="3"></textarea>
            <div class="flex-h">
              <a class="iconfont iconbiaoqing TopicEmoji">
                <div>
                  <VEmojiPicker :pack="PackData" @select="SelectEmoji" />
                </div>
              </a>
              <div class="flex-item"></div>
              <a>Tweet</a>
            </div>
          </div>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
/*
  动态页面-评论组件
*/
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
export default {
  name: 'CommunitySubComment',
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
    }
  },
  data () {
    return {
      PackData: packData,
      EmojiPosition: {
        left: 0,
        top: 0
      },
      ShowEmojiBoxer: false // 显隐表情盒子
    }
  },
  computed: {
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
    SelectEmoji (emoji) { // 选择表情
      console.log(emoji)
      this.ShowEmojiBoxer = false
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
