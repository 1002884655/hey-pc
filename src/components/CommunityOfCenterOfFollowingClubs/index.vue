<template>
  <div class="components CommunityOfCenterOfFollowingClubs">
    <ul>
      <li v-for="(item, index) in PageList" :key="index" :style="{zIndex: PageList.length - index}" class="flex-h">
        <div class="Icon">
          <a :href="`./userspace.html?key=${item.accountId}`" target="_self">
            <img :src="item.picPath2" class="centerLabel" alt="">
          </a>
        </div>
        <div class="flex-item">
          <div class="Name">
            <a :href="`./userspace.html?key=${item.accountId}`" target="_self">{{item.userName}}</a>
            <i class="iconfont iconnan" v-if="item.sex - 0 === 1"></i>
            <i class="iconfont iconnv" v-if="item.sex - 0 === 2"></i>
          </div>
          <span>{{item.description}}</span>
        </div>
        <a :class="{'active' : item.status - 0 !== 1}">
          <span>{{item.status - 0 === 1 ? 'Joining' : 'Exiting'}}</span>
          <i class="iconfont iconjiantoudown"></i>
          <ul v-if="item.status - 0 !== 0 && item.status - 0 !== 3">
            <li v-if="item.status - 0 === 1" @click="TriggerFansClub(item, index)">Exit the club</li>
            <li v-if="item.status - 0 === 2" @click="TriggerFansClub(item, index)">Cancel exit the club</li>
          </ul>
        </a>
      </li>
    </ul>

    <PayForFansClubPopup :PageUserInfo="PageUserInfo" v-if="ShowPayForFansClubPopup" @Close="ShowPayForFansClubPopup = false" @Join="JoinClub"></PayForFansClubPopup>

    <!-- 分页器 -->
    <div class="Pagination" v-if="Total">
      <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
/*
  我加入的粉丝团
*/
import { Pagination } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import PayForFansClubPopup from '../../components/PayForFansClubPopup'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityOfCenterOfFollowingClubs',
  props: ['data'],
  data () {
    return {
      PageUserInfo: null,
      ShowPayForFansClubPopup: false,
      PageList: [],
      PageData: {
        pageNum: 1,
        pageSize: 15
      },
      Total: 0,
      DataLock: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    'el-pagination': Pagination,
    PayForFansClubPopup
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
      'GetUserFollowingClubs',
      'RevokeExitFansClub',
      'ExitFansClub'
    ]),
    Init () {
      this.ToGetUserFollowingClubs()
    },
    JoinClub () {
      this.PageList.map((item) => {
        if (item.id - 0 === this.PageUserInfo.id - 0) {
          item.status = 1
        }
      })
    },
    TriggerFansClub (item, index) {
      if (item.status - 0 === 1) { // 已加入粉丝团
        this.ToolClass.Confirm('Exit the club', `After revoking the current logout, the fan club remaining in the ${item.userName} will continue to be automatically renewed after the end of the month.`, () => { }, (close) => {
          this.ToExitFansClub(item, index, close)
        })
      } else if (item.status - 0 === 2) { // 已退出粉丝团
        this.PageUserInfo = { ...item }
        this.ShowPayForFansClubPopup = true
      }
    },
    ToRevokeExitFansClub (item, index) { // 撤销退出粉丝团
      if (this.DataLock) return
      this.DataLock = true
      this.RevokeExitFansClub({ params: { accountId: this.UserInfo.id, subId: item.accountId } }).then(() => {
        this.$notify.success({
          title: 'success',
          message: 'Join of success!'
        })
        item.status = 1
        this.DataLock = false
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.message
        })
        this.DataLock = false
      })
    },
    ToExitFansClub (item, index, callback = () => { }) { // 退出粉丝团
      if (this.DataLock) return
      this.DataLock = true
      this.ExitFansClub({ params: { accountId: this.UserInfo.id, subId: item.accountId } }).then((res) => {
        callback()
        // this.$notify.success({
        //   title: 'success',
        //   message: 'Exit of success!'
        // })
        item.status = 2
        this.DataLock = false
        window.localStorage.OrderBackUrl = window.location.href
        window.localStorage.OrderType = 'exit'
        window.location.href = res.data.data.cancelUrl
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.message
        })
        this.DataLock = false
      })
    },
    PageChange (e) {
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetUserFollowingClubs()
      }
    },
    ToGetUserFollowingClubs () { // 获取我加入的粉丝团
      if (this.DataLock) return
      this.DataLock = true
      this.GetUserFollowingClubs({ params: { ...this.PageData, accountId: this.UserInfo.id } }).then((res) => {
        this.DataLock = false
        this.Total = res.data.data.total - 0
        this.PageList = res.data.data.list || []
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.message
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
