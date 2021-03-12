<template>
  <div class="components MessageForLike">
    <nav v-show="!ShowDetail">
      <a v-for="(item, index) in NavList" :key="index" :class="{'active': CurrentNavId === item.Id}" @click="CutNav(item.Id, item.Text)">{{item.Name}}</a>
    </nav>

    <ul v-show="!ShowDetail">
      <li v-for="(item, index) in PageList" :key="index" :style="{zIndex: PageList.length - index}" class="flex-h">
        <div class="flex-item">
          <ul>
            <li>
              <div class="flex-h">
                <a v-for="(subItem, subIndex) in item.list" :key="subIndex" :href="`./userspace.html?key=${subItem.accountId}`">
                  <img :src="subItem.picPath2" class="centerLabel cover" alt="">
                </a>
                <a class="More" v-if="item.list.length > 5" @click="ShowMoreLike(item)">
                  <i class="iconfont iconsandian1"></i>
                </a>
                <div class="flex-item">
                  <div>
                    <span v-if="item.list.length > 1"><a :href="`./userspace.html?key=${item.list[0].accountId}`">{{item.list[0].userName}}</a> and {{item.list.length - 1}} others liked your {{CurrentNavText}}</span>
                    <span v-else><a :href="`./userspace.html?key=${item.list[0].accountId}`">{{item.list[0].userName}}</a> liked your {{CurrentNavText}}</span>
                  </div>
                </div>
              </div>
              <span>{{ToolClass.FilterTimer(item.createTime)}}</span>
            </li>
          </ul>
        </div>
        <div class="ParentTarget">
          <span v-if="CurrentNavId === 'social'">{{item.content}}</span>
          <span v-if="CurrentNavId === 'comment'">{{item.comment}}</span>
          <div class="Img" v-if="CurrentNavId === 'video'">
            <img :src="item.frontPath" width="100%" alt="">
            <a class="iconfont iconbofang centerLabel" :href="`./video.html?key=${item.videoM}`"></a>
          </div>
        </div>
      </li>
    </ul>

    <div class="LikeDetail" v-if="ShowDetail">
      <div class="Top">
        <a class="iconfont iconjiantouleft" @click="ShowDetail = false"></a>
        <span><a :href="`./userspace.html?key=${CurrentTarget.list[0].accountId}`">{{CurrentTarget.list[0].userName}}</a> and {{CurrentTarget.list.length - 1}} others liked your {{CurrentNavText}}</span>
      </div>
      <ul>
        <li v-for="(item, index) in SubPageList" :key="index">
          <div class="flex-h">
            <a v-for="(subItem, subIndex) in item.List" :key="subIndex" :href="`./userspace.html?key=${subItem.accountId}`">
              <img :src="subItem.picPath2" class="centerLabel cover" alt="">
            </a>
            <div class="flex-item">
              <div>
                <span v-if="item.List.length > 1"><a :href="`./userspace.html?key=${item.List[0].accountId}`">{{item.List[0].userName}}</a> and {{item.List.length - 1}} others liked your {{CurrentNavText}}</span>
                <span v-else><a :href="`./userspace.html?key=${item.List[0].accountId}`">{{item.List[0].userName}}</a> liked your {{CurrentNavText}}</span>
              </div>
            </div>
          </div>
          <span>{{item.Date}}</span>
        </li>
      </ul>
      <div class="MoreLike">
        <a v-if="SubHasNextPage" @click="MoreLikeDetail">Load More</a>
        <span v-else>Load All</span>
      </div>
    </div>

    <!-- 下一页 -->
    <div class="NextPage" v-if="Total !== null" v-show="!ShowDetail">
      <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
    </div>

  </div>
</template>

<script>
/*
  消息通知-点赞
*/
import { createNamespacedHelpers } from 'vuex'
import { Pagination } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'MessageForLike',
  props: ['data'],
  data () {
    return {
      SubPageList: [], // 详情列表
      SubHasNextPage: true,
      CurrentTarget: null,
      ShowDetail: false, // 显隐点赞详情
      PageList: [], // 页面列表数据
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') - 0 || 1,
        pageSize: 10
      },
      SubPageData: {
        pageNum: 1,
        pageSize: 2
      },
      Total: null,
      CurrentNavId: null,
      CurrentNavText: null,
      NavList: [
        { Name: 'Video', Id: 'video', Text: 'video' },
        { Name: 'Comment', Id: 'comment', Text: 'reply' },
        { Name: 'Social', Id: 'social', Text: 'dynamic' }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      NoticeForMyVideoLike: x => x.NoticeForMyVideoLike, // 视频点赞列表
      NoticeForMyDynamicLike: x => x.NoticeForMyDynamicLike, // 动态点赞列表
      NoticeForMyCommentLike: x => x.NoticeForMyCommentLike // 评论点赞列表
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
      'GetNoticeForMyVideoLike',
      'GetNoticeForMyDynamicLike',
      'GetNoticeForMyCommentLike',
      'GetMyVideoLikeList'
    ]),
    Init () {
      let Like = this.ToolClass.GetUrlParams('like')
      if (Like !== false) {
        this.NavList.map((item) => {
          if (Like === item.Id) {
            this.CurrentNavId = item.Id
            this.CurrentNavText = item.Text
          }
        })
        if (this.CurrentNavId === null) {
          this.CurrentNavId = this.NavList[0].Id
          this.CurrentNavText = this.NavList[0].Text
        }
      } else {
        this.CurrentNavId = this.NavList[0].Id
        this.CurrentNavText = this.NavList[0].Text
      }
      this.ToolClass.ChangeUrlParams([{ name: 'like', value: this.CurrentNavId }])
      if (!(this.ToolClass.GetUrlParams('pages') - 0)) {
        this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
      }
      this.ToGetPageList()
    },
    MoreLikeDetail () {
      if (this.DataLock || !this.SubHasNextPage) return
      this.SubPageData.pageNum += 1
      this.ToGetSubPageList()
    },
    ShowMoreLike (item) { // 显示更多点赞
      if (this.DataLock) return
      this.CurrentTarget = item
      this.SubPageList = []
      this.SubPageData.pageNum = 1
      this.SubHasNextPage = true
      this.ShowDetail = true
      this.ToGetSubPageList()
    },
    ToGetSubPageList () { // 获取详情列表
      if (this.DataLock || !this.SubHasNextPage) return
      this.DataLock = true
      this.GetMyVideoLikeList({ params: { videoId: this.CurrentTarget.videoId, ...this.SubPageData } }).then((res) => {
        // this.SubPageList = [...res.data.data.list]
        let Arr = res.data.data.list
        Arr.map((item) => {
          if (this.SubPageList.length) {
            if (this.ToolClass.FilterTimer(item.createTime) === this.SubPageList[this.SubPageList.length - 1].Date) {
              this.SubPageList[this.SubPageList.length - 1].List.push({ ...item })
            } else {
              this.SubPageList.push({ Date: this.ToolClass.FilterTimer(item.createTime), List: [{ ...item }] })
            }
          } else {
            this.SubPageList.push({ Date: this.ToolClass.FilterTimer(item.createTime), List: [{ ...item }] })
          }
        })
        this.SubHasNextPage = res.data.data.hasNextPage
        this.SubPageData.pageNum = res.data.data.pageNum
        this.DataLock = false
      }).catch(() => {
        this.DataLock = false
      })
    },
    PageChange (e) {
      this.PageList = []
      this.PageData.pageNum = e
      this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
      this.ToGetPageList()
    },
    GetList (foo = () => { }, res) { // 获取列表公用方法
      foo.then((res) => {
        if (this.CurrentNavId === 'video') {
          this.PageList = [...this.NoticeForMyVideoLike]
        }
        if (this.CurrentNavId === 'comment') {
          this.PageList = [...this.NoticeForMyCommentLike]
        }
        if (this.CurrentNavId === 'social') {
          this.PageList = [...this.NoticeForMyDynamicLike]
        }
        this.Total = res.data.data.total
        this.PageData.pageNum = res.data.data.pageNum
        this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
        this.DataLock = false
      }).catch((res) => {
        this.DataLock = false
      })
    },
    ToGetPageList () { // 获取分页列表
      if (this.DataLock) return
      this.DataLock = true
      if (this.CurrentNavId === 'video') {
        this.GetList(this.GetNoticeForMyVideoLike({ params: { ...this.PageData, accountId: this.UserInfo.id } }))
      }
      if (this.CurrentNavId === 'comment') {
        this.GetList(this.GetNoticeForMyCommentLike({ params: { ...this.PageData, accountId: this.UserInfo.id } }))
      }
      if (this.CurrentNavId === 'social') {
        this.GetList(this.GetNoticeForMyDynamicLike({ params: { ...this.PageData, accountId: this.UserInfo.id } }))
      }
    },
    CutNav (id, text) { // 切换nav
      if (this.DataLock) return
      this.CurrentNavId = id
      this.CurrentNavText = text
      this.PageData.pageNum = 1
      this.Total = null
      this.PageList = []
      this.ToolClass.ChangeUrlParams([{ name: 'like', value: this.CurrentNavId }, { name: 'pages', value: 1 }])
      this.ToGetPageList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
