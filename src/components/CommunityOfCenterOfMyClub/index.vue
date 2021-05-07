<template>
  <div class="components CommunityOfCenterOfMyClub">
    <ul>
      <li v-for="(item, index) in PageList" :key="index" class="flex-h">
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
      </li>
    </ul>

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
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityOfCenterOfMyClub',
  props: ['data'],
  data () {
    return {
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
      'GetMyClubMembers',
      'RevokeExitFansClub',
      'ExitFansClub'
    ]),
    Init () {
      this.ToGetMyClubMembers()
    },
    PageChange (e) {
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetMyClubMembers()
      }
    },
    ToGetMyClubMembers () { // 获取粉丝团成员
      if (this.DataLock) return
      this.DataLock = true
      this.GetMyClubMembers({ params: { ...this.PageData, accountId: this.UserInfo.id } }).then((res) => {
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
