<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange">
      <div class="MainContainer">
        <div class="Title">
          <span>All live</span>
          <span>{{Total}} {{Total > 1 ? 'anchors' : 'anchor'}} online</span>
        </div>

        <div class="NoDataContainer" v-if="NoData">
          <i class="iconfont iconwushuju"></i>
          <span>There is currently no online anchor</span>
        </div>

        <ul>
          <li v-for="(item, index) in PageList" :key="index">
            <a :href="`./live.html?user=${item.accountId}&room=${item.id}`">
              <img :src="item.sourcePath" class="centerLabel cover" alt="">
              <span class="Price" :class="{'active': item.freeType === 1}">{{item.freeType === 0 ? 'Free' : 'Gold'}}</span>
              <div class="Info">
                <div class="flex-h">
                  <span class="flex-item">{{item.roomName}}</span>
                  <i class="iconfont iconrenwu1"></i>
                  <span>{{item.totalMember || 0}}</span>
                </div>
              </div>
            </a>
          </li>
        </ul>

        <!-- 分页器 -->
        <div class="Pagination" v-if="Total">
          <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
*/
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
import { Pagination } from 'element-ui'
import MainPage from '@/components/MainPage'
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    'el-pagination': Pagination,
    MainPage
  },
  data () {
    return {
      NoData: false,
      PageList: [],
      PageData: {
        pageSize: 15,
        pageNum: this.ToolClass.GetUrlParams('pages') - 0 || 1
      },
      Total: 0
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
      'GetLiveRoomList'
    ]),
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.UserInfoChange()
      }
    },
    UserInfoChange () { // 用户登录逻辑回调
      if (this.DataLock) return
      this.DataLock = true
      this.GetLiveRoomList({ params: { ...this.PageData } }).then((res) => {
        if (res.data.data !== null) {
          this.PageList = res.data.data.list || []
          this.Total = res.data.data.total
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: res.data.data.pageNum }])
        } else {
          this.Total = 0
        }
        this.NoData = !this.PageList.length
        this.DataLock = false
      }).catch((res) => {
        this.DataLock = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
