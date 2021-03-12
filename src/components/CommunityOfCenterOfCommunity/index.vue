<template>
  <div class="components CommunityOfCenterOfCommunity">
    <ul class="List">
      <li v-for="(item, index) in PageList" :key="index" :style="{zIndex: PageList.length - index}">
        <CommunityItem :Data="item" @Like="Like(item, index)" @NeedLogin="$emit('NeedLogin')" :Index="index" :PageUserId="PageUserInfo.id" @Delete="DeleteItem(index)" @NumChange="NumChange"></CommunityItem>
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
</template>

<script>
/*
  社交页面中间部分组件-社区部分
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import CommunityItem from '../CommunityItem'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityOfCenterOfCommunity',
  props: ['data'],
  data () {
    return {
      DataLock: false,
      PageData: {
        pageNum: 1,
        pageSize: 15
      },
      PageList: [],
      HasNextPage: true,
      PageUserInfo: null
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      OtherUserInfo: x => x.OtherUserInfo // 其他用户信息
    })
  },
  components: {
    CommunityItem
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
      'GetUserDynamic',
      'DynamicLike'
    ]),
    Init () { // 初始化
      this.PageUserInfo = this.OtherUserInfo === null ? this.UserInfo : this.OtherUserInfo
      this.ToGetUserDynamic() // 获取动态列表
    },
    NumChange (e) { // 评论数改变
      this.PageList[e.index].replyNum += e.Num
    },
    DeleteItem (index) { // 删除动态
      this.PageList.splice(index, 1)
    },
    ToGetUserDynamic () { // 获取动态列表
      this.GetUserDynamic({ params: { ...this.PageData, accountId: this.PageUserInfo.id } }).then((res) => {
        this.PageData.pageNum = res.data.data.pageNum - 0
        this.HasNextPage = res.data.data.hasNextPage
        let Arr = res.data.data.list || []
        Arr.map((item) => {
          this.PageList.push({ ...item, Liked: false, Subscribed: null })
        })
        this.DataLock = false
      }).catch(() => {
        this.DataLock = false
      })
    },
    NextPage () { // 下一页
      if (this.DataLock || !this.HasNextPage) return
      this.DataLock = true
      this.PageData.pageNum += 1
      this.ToGetUserDynamic()
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
