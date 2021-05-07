<template>
  <div class="components CommunityOfCenterOfFollow">

    <ul>
      <li v-for="(item, index) in MySubscribeList" :key="index" class="flex-h">
        <div class="Icon">
          <a :href="`./userspace.html?key=${item.userId}`" target="_self">
            <img :src="item.picPath2" class="centerLabel" alt="">
          </a>
        </div>
        <div class="flex-item">
          <div class="Name">
            <a :href="`./userspace.html?key=${item.userId}`" target="_self">{{item.userName}}</a>
            <i class="iconfont iconnan" v-if="item.sex - 0 === 1"></i>
            <i class="iconfont iconnv" v-if="item.sex - 0 === 2"></i>
          </div>
          <span>{{item.description}}</span>
        </div>
        <a :class="{'active': item.Active}" @click="TriggerItem(item, index)">{{item.Active ? 'Subscribers' : 'Subscribed'}}</a>
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
  页面名称：社交页面中间部分组件-该用户订阅的
  创建人：许成祥
  创建时间：2020/06/17
  最近修改人：许成祥
  最近修改日期：2020/06/17
  备注： 无
*/
import Vue from 'vue'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'CommunityOfCenterOfFollow',
  props: ['data'],
  data () {
    return {
      Total: 0,
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') !== false ? this.ToolClass.GetUrlParams('pages') - 0 : 1,
        pageSize: 20
      },
      DataLock: false // 数据锁
    }
  },
  computed: {
    ...mapUserState({
      MySubscribeList: x => x.MySubscribeList // 该用户订阅列表
    })
  },
  components: {
    'el-pagination': Pagination
  },
  created () {
    this.ToGetMySubscribeInfo()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetMySubscribeInfo',
      'Unsubscribe',
      'AccountSubscribe'
    ]),
    ...mapUserMutations([
      'EditMySubscribeList'
    ]),
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetMySubscribeInfo()
      }
    },
    ToSheetDetail (item) { // 去片单详情页
      window.open(`./album.html?key=${this.data.id}&album=${item.id}`, '_self')
    },
    PlayAll (item) { // 播放全部
      if (item.videoNum) {
        window.open(`./video.html?type=5&album=${item.id}`, '_self')
      }
    },
    TriggerItem (item, index) { // 订阅、取消订阅
      if (!this.DataLock) {
        this.DataLock = true
        if (item.Active) { // 订阅
          this.AccountSubscribe({
            params: { subId: item.userId, accountId: this.data.id }
          }).then(() => {
            this.EditMySubscribeList({ Index: index, Active: false })
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({ title: 'error', message: res.data.msg })
            this.DataLock = false
          })
        } else { // 取消订阅
          this.Unsubscribe({
            params: { subId: item.userId, accountId: this.data.id }
          }).then(() => {
            this.EditMySubscribeList({ Index: index, Active: true })
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({ title: 'error', message: res.data.msg })
            this.DataLock = false
          })
        }
      }
    },
    ToGetMySubscribeInfo () { // 获取用户订阅列表
      if (!this.DataLock) {
        this.DataLock = true
        this.GetMySubscribeInfo({
          params: { accountId: this.data.id, ...this.PageData }
        }).then((res) => {
          this.PageData.pageNum = res.data.data.pageNum || 1
          this.Total = res.data.data.total - 0
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
          this.DataLock = false
        }).catch(() => {
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
