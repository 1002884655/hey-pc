<template>
  <div class="components UserForPromotion">
    <ScrollY>

      <div class="Container">

        <!-- 未认证为明星用户 -->
        <span v-if="UserInfo.userType - 0 !== 4" class="centerLabel">You are not a star user, temporarily unable to promote</span>

        <!-- 明星用户 -->
        <div v-else>

          <div class="PromotionUrl">
            <span>{{PromoteUrl}}</span>
            <a @click="CopyUrl">Copy</a>
          </div>
          <span>You have invited {{PromoteTotalCount}} {{PromoteTotalCount - 1 ? 'users' : 'user'}}</span>

          <ul>
            <li v-for="(item, index) in PromoteCountForMonth" :key="index">
              <a class="flex-h" @click="CutMonth(item, index)">
                <span class="flex-item">{{ReturnMonthData(item.sortTime, item.count)}}</span>
                <i class="iconfont iconjiantoudown" v-if="item.Show"></i>
                <i class="iconfont iconjiantouup" v-else></i>
              </a>
              <ul v-if="item.Show">
                <li v-for="(subItem, subIndex) in PromoteMonthList" :key="subIndex">
                  <a :href="`./userspace.html?key=${subItem.id}`" target="_self">
                    <img :src="subItem.picPath2" class="centerLabel cover" alt="">
                  </a>
                  <a :href="`./userspace.html?key=${subItem.id}`" target="_self" :title="subItem.name">{{subItem.name}}</a>
                </li>
                <li v-if="SubHasNextPage"><span @click="More">MORE</span></li>
              </ul>
            </li>
          </ul>

          <!-- 分页器 -->
          <div class="Pagination" v-if="Total">
            <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
          </div>

        </div>

      </div>

    </ScrollY>
  </div>
</template>

<script>
/*
  推广
*/
import Vue from 'vue'
import { Pagination, Notification } from 'element-ui'
import ScrollY from '../../components/ScrollY'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForPromotion',
  props: ['data'],
  data () {
    return {
      CurrnetMonthIndex: null, // 当前操作月份索引值
      Total: 0, // 列表总数
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') - 0 || 1,
        pageSize: 15
      },
      SubPageData: {
        pageNum: 1,
        pageSize: 20
      },
      SubHasNextPage: true,
      DataLock: false, // 数据锁
      PromoteTotalCount: 0, // 推广总人数
      PromoteUrl: null // 推广链接
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      PromoteCountForMonth: x => x.PromoteCountForMonth, // 每月推广人数列表
      PromoteMonthList: x => x.PromoteMonthList // 每月推广详情列表
    })
  },
  components: {
    'el-pagination': Pagination,
    ScrollY
  },
  created () {
    if (this.UserInfo.userType - 0 === 4) {
      this.GetPromoteUrl({ params: { referrerUserId: this.UserInfo.id } }).then((res) => { // 获取推广链接
        this.PromoteUrl = res.data.data
      })
      this.GetPromoteTotalCount({ params: { referrerUserId: this.UserInfo.id } }).then((res) => { // 获取推广总人数
        this.PromoteTotalCount = res.data.data - 0
      })
      this.EmptyPromoteCountForMonth()
      this.ToGetPromoteCountForMonth()
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetPromoteUrl',
      'GetPromoteTotalCount',
      'GetPromoteCountForMonth',
      'GetPromoteMonthList'
    ]),
    ...mapUserMutations([
      'EditPromoteCountForMonth',
      'EmptyPromoteCountForMonth',
      'EmptyPromoteMonthList'
    ]),
    ReturnMonthData (time, num) { // 返回每月注册数据
      let Month = time.substring(5) - 0
      let Year = time.substring(0, 4)
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
      return `${Text} , ${Year} ; ${num}`
    },
    More () { // 更多详情
      this.ToGetPromoteMonthList()
    },
    CutMonth (item, index) { // 切换月份
      if (!this.DataLock) {
        if (!item.Show) { // 展开月详情
          if (this.CurrnetMonthIndex !== null) {
            this.EditPromoteCountForMonth({ index: this.CurrnetMonthIndex, name: 'Show', value: false })
          }
          this.CurrnetMonthIndex = index
          this.EmptyPromoteMonthList()
        }
        this.EditPromoteCountForMonth({ index, name: 'Show', value: !item.Show })
        if (item.Show) { // 展开月详情
          this.SortTime = item.sortTime
          this.SubPageData = {
            pageNum: 1,
            pageSize: 20
          }
          this.SubHasNextPage = true
          this.ToGetPromoteMonthList()
        }
      }
    },
    CopyUrl () { // 复制推广链接
      this.$copyText(this.PromoteUrl)
      this.$notify.success({ title: 'success', message: 'Copy success' })
    },
    PageChange (e) { // 页码改变
      this.PageData.pageNum = e
      this.EmptyPromoteCountForMonth()
      this.ToGetPromoteCountForMonth()
    },
    ToGetPromoteMonthList () { // 获取每月推广详情列表
      if (!this.DataLock) {
        this.DataLock = true
        this.GetPromoteMonthList({
          params: { ...this.SubPageData, referrerUserId: this.UserInfo.id, sortTime: this.SortTime }
        }).then((res) => {
          this.SubHasNextPage = res.data.data.hasNextPage
          this.SubPageData.pageNum = res.data.data.pageNum - 0 + 1
          this.DataLock = false
        }).catch((res) => {
          this.DataLock = false
        })
      }
    },
    ToGetPromoteCountForMonth () { // 获取每月推广人数列表
      if (!this.DataLock) {
        this.DataLock = true
        this.GetPromoteCountForMonth({
          params: { ...this.PageData, referrerUserId: this.UserInfo.id }
        }).then((res) => {
          this.Total = res.data.data.total - 0
          this.PageData.pageNum = res.data.data.pageNum - 0
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: res.data.data.pageNum || 1 }])
          this.DataLock = false
        }).catch((res) => {
          this.DataLock = false
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
