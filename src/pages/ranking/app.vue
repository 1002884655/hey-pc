<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange">
      <div class="Container">
        <div class="Title">
          <img src="../../assets/img/paihang.png" alt="">
          <span>{{ReturnMonth()}}. Rank</span>
        </div>
        <ul>
          <li v-for="(item, index) in PageList" :key="index" class="flex-h">
            <img v-if="index === 0" src="../../assets/img/paihang-4.png" alt="">
            <img v-if="index === 1" src="../../assets/img/paihang-5.png" alt="">
            <img v-if="index === 2" src="../../assets/img/paihang-3.png" alt="">
            <span v-if="index > 2">{{index + 1}}</span>
            <a class="Icon" :href="`./userspace.html?key=${item.userId}`">
              <img :src="item.picPath3" class="centerLabel cover" alt="">
            </a>
            <div class="flex-item">
              <a :href="`./userspace.html?key=${item.userId}`">{{item.username}}</a>
              <span>{{item.videoNum}} videos</span>
            </div>
            <a :class="{'active': !item.subscribeStatus}" @click="TriggerFollowed(item)">{{item.subscribeStatus ? 'Unfollowed' : 'Followed'}}</a>
          </li>
        </ul>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  排行页面
*/
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage
  },
  data () {
    return {
      PageList: [],
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
      'GetUserRanking',
      'AccountSubscribe',
      'Unsubscribe'
    ]),
    Init () {
      let Params = {}
      if (this.UserInfo !== null) Params.accountId = this.UserInfo.id
      this.GetUserRanking({ params: { ...Params } }).then((res) => {
        this.PageList = res.data.data || []
      })
    },
    TriggerFollowed (item) {
      if (this.DataLock) return
      if (this.UserInfo !== null) {
        this.DataLock = true
        if (item.subscribeStatus) { // 取消订阅
          this.Unsubscribe({ params: { subId: item.userId, accountId: this.UserInfo.id } }).then((res) => {
            this.$notify.success({
              title: 'success',
              message: res.data.msg
            })
            item.subscribeStatus = 0
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        } else { // 订阅
          this.AccountSubscribe({ params: { subId: item.userId, accountId: this.UserInfo.id } }).then((res) => {
            this.$notify.success({
              title: 'success',
              message: res.data.msg
            })
            item.subscribeStatus = 1
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        }
      } else {
        this.$refs.MainPage.Login()
      }
    },
    ReturnMonth () { // 返回月份
      let Month = new Date(Date.now()).getMonth() + 1
      let Text = null
      switch (Month) {
        case 1:
          Text = 'Jan'
          break
        case 2:
          Text = 'Feb'
          break
        case 3:
          Text = 'Mar'
          break
        case 4:
          Text = 'Apr'
          break
        case 5:
          Text = 'May'
          break
        case 6:
          Text = 'Jun'
          break
        case 7:
          Text = 'Jul'
          break
        case 8:
          Text = 'Aug'
          break
        case 9:
          Text = 'Sept'
          break
        case 10:
          Text = 'Oct'
          break
        case 11:
          Text = 'Nov'
          break
        case 12:
          Text = 'Dec'
          break
        default:
          Text = ''
      }
      return Text
    },
    UserInfoChange () {
      this.Init()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
