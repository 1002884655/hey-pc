<template>
  <div class="components UserForMySubscription flex-h">

    <div class="Left">
      <nav>
        <a v-for="(item, index) in NavList" :key="index" @click="CutNav(index)" class="flex-h" :class="{'active': ActiveIndex === index}">
          <span class="flex-item">{{item.Name}}</span>
          <span>{{item.Num}}</span>
        </a>
      </nav>
    </div>

    <div class="flex-item">

      <!-- 我订阅的用户列表 -->
      <ul v-show="ActiveIndex === 0">
        <li v-for="(item, index) in MySubscribeList" :key="index" class="flex-h">
          <div class="Icon">
            <a :href="`./userspace.html?key=${item.userId}`" target="_self">
              <img :src="item.picPath3" class="centerLabel cover" alt="">
            </a>
          </div>
          <div class="flex-item">
            <div>
              <a :href="`./userspace.html?key=${item.userId}`" target="_self">{{item.userName}}</a>
              <i class="iconfont iconnan" v-if="item.sex - 0"></i>
              <i class="iconfont iconnv" v-else></i>
            </div>
            <span>{{item.description}}</span>
          </div>
          <a :class="{'active': item.Active}" @click="TriggerSubUser(!!item.Active, item.userId, index)">{{item.Active ? 'subscribe' : 'unsubscribe'}}</a>
        </li>
      </ul>

      <!-- 分页器 -->
      <div class="Pagination" v-if="ActiveIndex === 0 && MySubTotal !== null && MySubTotal !== 0">
        <el-pagination background :page-size="MySubPageData.pageSize" :current-page="MySubPageData.pageNum" layout="prev, pager, next, jumper" :total="MySubTotal" @current-change="MySubPageChange"></el-pagination>
      </div>

      <!-- 订阅我的用户列表 -->
      <ul v-show="ActiveIndex === 1">
        <li v-for="(item, index) in SubscribeForMeList" :key="index" class="flex-h">
          <div class="Icon">
            <a :href="`./userspace.html?key=${item.userId}`" target="_self">
              <img :src="item.picPath3" class="centerLabel cover" alt="">
            </a>
          </div>
          <div class="flex-item">
            <div>
              <a :href="`./userspace.html?key=${item.userId}`" target="_self">{{item.userName}}</a>
              <i class="iconfont iconnan" v-if="item.sex - 0"></i>
              <i class="iconfont iconnv" v-else></i>
            </div>
            <span>{{item.description}}</span>
          </div>
          <a :class="{'active': !item.subscribeStatus}" @click="TriggerSubUser(!item.subscribeStatus, item.userId, index)">{{item.subscribeStatus ? 'unsubscribe' : 'subscribe'}}</a>
        </li>
      </ul>

      <!-- 分页器 -->
      <div class="Pagination" v-if="ActiveIndex === 1 && SubForMeTotal !== null && SubForMeTotal !== 0">
        <el-pagination background :page-size="SubForMePageData.pageSize" :current-page="SubForMePageData.pageNum" layout="prev, pager, next, jumper" :total="SubForMeTotal" @current-change="SubForMePageChange"></el-pagination>
      </div>

    </div>

  </div>
</template>

<script>
/*
  页面名称：用户中心-MySubscription组件
  创建人：许成祥
  创建时间：2020/01/07
  最近修改人：许成祥
  最近修改日期：2020/05/13
  备注： 无
*/
import { Pagination } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMySubscription',
  props: ['data'],
  data () {
    return {
      DataLock: false, // 数据锁
      ActiveIndex: this.ToolClass.GetUrlParams('subtype') !== false ? this.ToolClass.GetUrlParams('subtype') - 0 : 0, // nav选中索引值
      NavList: [ // nav列表
        { Name: 'My subscription', Id: 0, Num: 0 },
        { Name: 'Subscribe to me', Id: 1, Num: 0 }
      ],
      MySubPageData: { // 我订阅的用户数据请求参数
        pageNum: this.ToolClass.GetUrlParams('pages') - 0 ? this.ToolClass.GetUrlParams('pages') - 0 : 1,
        pageSize: 10
      },
      MySubTotal: null, // 我订阅的用户总数
      SubForMePageData: { // 订阅我的用户数据请求参数
        pageNum: this.ToolClass.GetUrlParams('pages') - 0 ? this.ToolClass.GetUrlParams('pages') - 0 : 1,
        pageSize: 10
      },
      SubForMeTotal: null // 订阅我的用户总数
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      MySubscribeList: x => x.MySubscribeList, // 我订阅的用户列表
      SubscribeForMeList: x => x.SubscribeForMeList // 订阅我的用户列表
    })
  },
  components: {
    'el-pagination': Pagination
  },
  created () {
    this.ToGetMySubscribeInfo() // 获取我订阅的用户列表
    this.ToGetSubscribeInfo() // 获取订阅我的用户列表
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetMySubscribeInfo',
      'GetSubscribeInfo',
      'AccountSubscribe',
      'Unsubscribe'
    ]),
    ...mapUserMutations([
      'EditMySubscribeList',
      'EditSubscribeForMeList'
    ]),
    TriggerSubUser (Bool, id, index) { // 订阅、取消订阅用户
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        if (!Bool) { // 取消订阅
          this.Unsubscribe({
            params: { subId: id, accountId: this.UserInfo.id }
          }).then(() => {
            if (this.ActiveIndex === 0) { // 我订阅的用户操作
              this.EditMySubscribeList({ Index: index, Active: true })
            } else if (this.ActiveIndex === 1) { // 订阅我的用户操作
              this.EditSubscribeForMeList({ Index: index, Active: false })
            }
            this.DataLock = false // 数据解锁
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        } else { // 订阅
          this.AccountSubscribe({
            params: { subId: id, accountId: this.UserInfo.id }
          }).then(() => {
            if (this.ActiveIndex === 0) { // 我订阅的用户操作
              this.EditMySubscribeList({ Index: index, Active: false })
            } else if (this.ActiveIndex === 1) { // 订阅我的用户操作
              this.EditSubscribeForMeList({ Index: index, Active: true })
            }
            this.DataLock = false // 数据解锁
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        }
      }
    },
    ToGetMySubscribeInfo () { // 获取我订阅的用户列表
      this.GetMySubscribeInfo({
        params: { ...this.MySubPageData, accountId: this.UserInfo.id }
      }).then((res) => {
        if (res.data.code - 0 === 0) {
          this.MySubTotal = res.data.data.total - 0
          this.MySubPageData.pageNum = res.data.data.pageNum
          this.NavList[0].Num = this.MySubTotal
          history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'pages', this.MySubPageData.pageNum))
        }
        this.DataLock = false // 数据解锁
      }).catch(() => {
        this.DataLock = false // 数据解锁
      })
    },
    ToGetSubscribeInfo () { // 获取订阅我的用户列表
      this.GetSubscribeInfo({
        params: { ...this.SubForMePageData, accountId: this.UserInfo.id }
      }).then((res) => {
        if (res.data.code - 0 === 0) {
          this.SubForMeTotal = res.data.data.total - 0
          this.SubForMePageData.pageNum = res.data.data.pageNum
          this.NavList[1].Num = this.SubForMeTotal
          history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'pages', this.SubForMePageData.pageNum))
        }
        this.DataLock = false // 数据解锁
      }).catch(() => {
        this.DataLock = false // 数据解锁
      })
    },
    SubForMePageChange (e) { // 订阅我的用户页码改变
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        this.SubForMePageData.pageNum = e
        history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'pages', e))
        this.ToGetSubscribeInfo()
      }
    },
    MySubPageChange (e) { // 我订阅的用户页码改变
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        this.MySubPageData.pageNum = e
        history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'pages', e))
        this.ToGetMySubscribeInfo()
      }
    },
    CutNav (index) { // 切换nav
      this.ActiveIndex = index
      history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'subtype', this.ActiveIndex))
      if (index === 0) {
        history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'pages', this.MySubPageData.pageNum))
      } else if (index === 1) {
        history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'pages', this.SubForMePageData.pageNum))
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
