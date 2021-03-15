<template>
  <div class="components CommunityOfCenterOfSheet">

    <ul>
      <li v-for="(item, index) in PageList" :key="index">
        <a class="Img">
          <img :src="item.cover" class="centerLabel cover" @click="ToSheetDetail(item)" alt="">
          <div class="RightLayer" @click="ToSheetDetail(item)">
            <span class="centerLabel">
              <span>{{item.videoNum}}</span>
              <i class="iconfont iconshipinliebiao"></i>
            </span>
          </div>
          <div class="Layer" v-if="item.videoNum">
            <span class="centerLabel" @click="PlayAll(item)">
              <i class="iconfont iconbofang2"></i>
              <span>Play all</span>
            </span>
          </div>
        </a>
        <a class="Title" @click="ToSheetDetail(item)">{{item.name}}</a>
      </li>
    </ul>

    <!-- 分页器 -->
    <div class="Pagination" v-if="PageList.length">
      <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
    </div>

  </div>
</template>

<script>
/*
  页面名称：社交页面中间部分组件-片单部分
  创建人：许成祥
  创建时间：2020/06/03
  最近修改人：许成祥
  最近修改日期：2020/06/03
  备注： 无
*/
import { Pagination } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
const { mapActions: mapPlaylistActions } = createNamespacedHelpers('playlist')
export default {
  name: 'CommunityOfCenterOfSheet',
  props: ['data'],
  data () {
    return {
      PageList: [],
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') === false ? 1 : this.ToolClass.GetUrlParams('pages') - 0,
        pageSize: 20
      },
      Total: 0,
      DataLock: false // 数据锁
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户所有视频片单列表
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    })
  },
  components: {
    'el-pagination': Pagination
  },
  created () {
    this.PageList = []
    this.ToGetPieceGroup()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetPieceGroup'
    ]),
    ...mapPlaylistActions([
      'GetOtherUserPlaylist'
    ]),
    ToSheetDetail (item) { // 去片单详情页
      window.open(`./sheet.html?key=${this.ToolClass.GetUrlParams('key') || this.UserInfo.id}&sheet=${item.id}`, '_self')
    },
    PlayAll (item) { // 播放全部
      if (item.videoNum) {
        window.open(`./video.html?type=4&sheet=${item.id}`, '_self')
      }
    },
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetPieceGroup()
      }
    },
    ToGetPieceGroup () { // 获取用户片单
      if (!this.DataLock) {
        this.DataLock = true
        if (this.UserInfo === null || (this.UserInfo !== null && this.ToolClass.GetUrlParams('key') !== false && this.ToolClass.GetUrlParams('key') - 0 !== this.UserInfo.id - 0)) {
          this.GetOtherUserPlaylist({
            params: { accountId: this.ToolClass.GetUrlParams('key'), ...this.PageData }
          }).then((res) => {
            // this.MyPieceGroupList = res.data.data.list
            this.PageList = res.data.data.list || []
            this.Total = res.data.data.total
            this.PageData.pageNum = res.data.data.pageNum
            this.ToolClass.ChangeUrlParams([{ name: 'pages', value: res.data.data.pageNum }])
            this.DataLock = false
          }).catch(() => {
            this.DataLock = false
          })
        } else {
          this.GetPieceGroup({
            params: { accountId: this.ToolClass.GetUrlParams('key') !== false ? this.ToolClass.GetUrlParams('key') : this.UserInfo.id, ...this.PageData }
          }).then((res) => {
            // this.MyPieceGroupList = res.data.data.list
            this.PageList = res.data.data.list || []
            this.Total = res.data.data.total
            this.PageData.pageNum = res.data.data.pageNum
            this.ToolClass.ChangeUrlParams([{ name: 'pages', value: res.data.data.pageNum }])
            this.DataLock = false
          }).catch(() => {
            this.DataLock = false
          })
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
