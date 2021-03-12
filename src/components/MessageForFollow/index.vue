<template>
  <div class="components MessageForFollow">
    <span>Follow</span>
    <ul>
      <li v-for="(item, index) in NoticeForMyFans" :key="index" class="flex-h">
        <a class="Icon" :href="`./userspace.html?key=${item.userId}`">
          <img :src="item.picPath2" class="centerLabel cover" alt="">
        </a>
        <div class="flex-item flex-h">
          <div class="flex-item">
            <a :href="`./userspace.html?key=${item.userId}`">{{item.userName}}</a>
            <span>followed you</span>
            <span>{{ToolClass.FilterTimer(item.createTime)}}</span>
          </div>
          <a :class="{'active': !item.subscribeStatus}" @click="TriggerFollow(item, index)">{{item.subscribeStatus - 0 ? 'Followed' : 'Follow'}}</a>
        </div>
      </li>
    </ul>

    <!-- 下一页 -->
    <div class="NextPage" v-if="Total !== null">
      <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
/*
  消息通知-系统通知
*/
import { createNamespacedHelpers } from 'vuex'
import { Pagination } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'MessageForFollow',
  props: ['data'],
  data () {
    return {
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') - 0 || 1,
        pageSize: 10
      },
      Total: null
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      NoticeForMyFans: x => x.NoticeForMyFans // 粉丝通知
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
      'GetNoticeForMyFans',
      'AccountSubscribe',
      'Unsubscribe'
    ]),
    ...mapUserMutations([
      'EmptyNoticeForMyFans',
      'EditNoticeForMyFans'
    ]),
    Init () {
      this.EmptyNoticeForMyFans()
      this.ToGetPageList()
    },
    TriggerFollow (item, index) { // 关注、取消关注
      if (this.DataLock) return
      this.DataLock = true
      if (!item.subscribeStatus) { // 关注
        this.AccountSubscribe({ params: { subId: item.userId, accountId: this.UserInfo.id } }).then((res) => {
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.EditNoticeForMyFans({ index, name: 'subscribeStatus', value: 1 })
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      } else { // 取消关注
        this.Unsubscribe({ params: { subId: item.userId, accountId: this.UserInfo.id } }).then((res) => {
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.EditNoticeForMyFans({ index, name: 'subscribeStatus', value: 0 })
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    PageChange (e) {
      this.EmptyNoticeForMyFans()
      this.PageData.pageNum = e
      this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
      this.ToGetPageList()
    },
    ToGetPageList () { // 获取分页列表
      if (this.DataLock) return
      this.DataLock = true
      this.GetNoticeForMyFans({ params: { ...this.PageData, accountId: this.UserInfo.id } }).then((res) => {
        this.Total = res.data.data.total
        this.PageData.pageNum = res.data.data.pageNum
        this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
        this.DataLock = false
      }).catch((res) => {
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
