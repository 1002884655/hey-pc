<template>
  <div class="components MessageForMessage">
    <span>System notification</span>
    <ul>
      <li v-for="(item, index) in SystemMsg" :key="index">
        <div class="Top">
          <span>{{item.title}}</span>
          <span v-if="item.createTime !== null">{{ToolClass.FilterTimer(item.createTime)}}</span>
        </div>
        <span>{{item.content}} <a v-if="item.address !== null" :href="item.address">{{item.address}}</a></span>
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
  name: 'MessageForMessage',
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
      SystemMsg: x => x.SystemMsg // 系统消息
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
      'GetSystemMsg'
    ]),
    ...mapUserMutations([
      'EmptySystemMsg'
    ]),
    Init () {
      this.EmptySystemMsg()
      this.ToGetPageList()
    },
    PageChange (e) {
      this.EmptySystemMsg()
      this.PageData.pageNum = e
      this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
      this.ToGetPageList()
    },
    ToGetPageList () { // 获取分页列表
      if (this.DataLock) return
      this.DataLock = true
      this.GetSystemMsg({ params: { ...this.PageData, accountId: this.UserInfo.id } }).then((res) => {
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
