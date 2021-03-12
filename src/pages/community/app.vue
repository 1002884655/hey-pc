<template>
  <div id="app">
    <MainPage @UserInfoChange="UserInfoChange" :MainNavActiveIndex="null">
      <div class="Container flex-h">

        <!-- 用户信息 -->
        <div class="UserInfo" v-if="UserInfo !== null">

          <div class="Info">
            <div class="Bg">
              <img :src="UserInfo.backgroundPath" class="centerLabel cover" alt="">
            </div>
            <div class="Name flex-h">
              <div class="Icon">
                <img :src="UserInfo.picPath3" class="centerLabel cover" alt="">
              </div>
              <div class="flex-item">
                <span>{{UserInfo.nick}}</span>
                <i class="iconfont iconnan" v-if="UserInfo.sex - 0 === 1"></i>
                <i class="iconfont iconnv" v-if="UserInfo.sex - 0 === 2"></i>
              </div>
            </div>
            <div class="Fans flex-h">
              <div class="flex-item">
                <span>{{SubscribeNum}}</span>
                <span>Followers</span>
              </div>
              <div class="flex-item">
                <span>{{MySubscribeNum}}</span>
                <span>Followings</span>
              </div>
              <div class="flex-item">
                <span>{{DynamicNum}}</span>
                <span>Dynamic</span>
              </div>
            </div>
          </div>

        </div>

        <!-- 动态区域 -->
        <div class="flex-item">

          <!-- 发表动态栏 -->
          <div class="PushDynamic" v-if="UserInfo !== null">
            <span>What's happening?</span>
            <textarea cols="30" rows="5" v-model="DynamicText" @input="DynamicText = DynamicText.substring(0, 280)"></textarea>
            <div class="flex-h">
              <a class="iconfont iconbiaoqing TopicEmoji">
                <div>
                  <VEmojiPicker :pack="PackData" @select="SelectLevel1Emoji" />
                </div>
              </a>
              <div class="flex-item">
                <span>{{DynamicText.length}}/280</span>
              </div>
              <a @click="ToPushDynamic">Share</a>
            </div>
          </div>

          <!-- 动态列表 -->
          <ul class="List">
            <li v-for="(item, index) in PageList" :key="index">
              <CommunityItem :Data="item" @Like="Like(item, index)" :Index="index" :PageUserId="UserInfo.id" @Delete="DeleteItem(index)" @NumChange="NumChange"></CommunityItem>
            </li>
          </ul>

          <!-- 下一页 -->
          <div class="NextPage">
            <a @click="NextPage" v-if="HasNextPage && PageList.length">
              <i class="iconfont iconshixinjiantoudown"></i>
              <span>Show more</span>
            </a>
            <span v-if="!HasNextPage">Load all</span>
          </div>

        </div>

        <!-- 广告位 -->
        <!-- <div class="Adv"></div> -->

      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  社区动态
*/
import VEmojiPicker from 'v-emoji-picker'
import packData from 'v-emoji-picker/data/emojis.json'
import MainPage from '../../components/MainPage'
import CommunityItem from '../../components/CommunityItem'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage,
    CommunityItem,
    VEmojiPicker
  },
  data () {
    return {
      DynamicText: '',
      PackData: packData,
      SubscribeNum: 0,
      MySubscribeNum: 0,
      DynamicNum: 0,
      PageList: [],
      DataLock: false,
      PageData: {
        pageNum: 1,
        pageSize: 15
      },
      HasNextPage: true
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
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
      'GetMyDynamic',
      'DynamicLike',
      'GetAccountSubscribe',
      'PushDynamic'
    ]),
    ToPushDynamic () { // 发推
      if (this.DynamicText === '') {
        this.$notify.error({
          title: 'error',
          message: 'Dynamic content cannot be empty!'
        })
        return false
      }
      if (this.DataLock) return
      this.DataLock = true
      this.PushDynamic({
        data: {
          accountId: this.UserInfo.id,
          content: this.DynamicText
        }
      }).then((res) => {
        this.$notify.success({
          title: 'success',
          message: res.data.msg
        })
        this.PageList.unshift({
          id: res.data.data,
          content: this.DynamicText,
          likeNum: 0,
          replyNum: 0,
          shareNum: 0,
          userId: this.UserInfo.id,
          userName: this.UserInfo.nick,
          picPath1: this.UserInfo.picPath1,
          createTime: Date.now()
        })
        this.DynamicText = ''
        this.DynamicNum += 1
        this.DataLock = false
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
        this.DataLock = false
      })
    },
    SelectLevel1Emoji (emoji) { // 选择表情
      this.DynamicText += emoji.emoji
    },
    NextPage () { // 下一页
      if (this.DataLock || !this.HasNextPage) return
      this.PageData.pageNum += 1
      this.ToGetMyDynamic()
    },
    NumChange (e) { // 评论数改变
      this.PageList[e.index].replyNum += e.Num
    },
    DeleteItem (index) { // 删除动态
      this.PageList.splice(index, 1)
      this.DynamicNum -= 1
    },
    ToGetMyDynamic () { // 获取我的相关动态
      if (this.DataLock) return
      this.DataLock = true
      this.GetMyDynamic({ params: { ...this.PageData, accountId: this.UserInfo.id } }).then((res) => {
        this.PageData.pageNum = res.data.data.pageNum - 0
        this.HasNextPage = res.data.data.hasNextPage
        let Arr = res.data.data.list || []
        Arr.map((item) => {
          this.PageList.push({ ...item, Liked: false, Subscribed: null })
        })
        this.DataLock = false
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
        this.DataLock = false
      })
    },
    UserInfoChange () { // 用户信息更新回调
      if (this.UserInfo !== null) {
        this.ToGetMyDynamic() // 获取我的相关动态
        this.GetAccountSubscribe({
          params: { accountId: this.UserInfo.id }
        }).then((res) => {
          if (res.data.code - 0 === 0) {
            this.SubscribeNum = res.data.data.subscribe - 0
            this.MySubscribeNum = res.data.data.mySubscribe - 0
            this.DynamicNum = res.data.data.dynamicNum - 0
          }
        })
      }
    },
    Like (item, index) { // 点赞
      if (this.UserInfo === null) {
        this.$emit('NeedLogin')
        return false
      }
      if (item.Liked || this.DataLock) return
      this.DataLock = true
      this.DynamicLike({ params: { msgId: item.id, accountId: this.UserInfo.id } }).then(() => {
        item.Liked = true
        item.likeNum += 1
        this.DataLock = false
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
        this.DataLock = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
