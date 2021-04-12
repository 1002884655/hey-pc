<template>
  <div class="components CommunityOfCenterOfVideos">

    <ul class="PageList">
      <li v-for="(item, index) in ClassVideoList" :key="index" :style="{zIndex: ClassVideoList.length - index}">
        <MainVideoListItem :data="item" :WatchLater="item.WatchLater" :Index="index" :ShowGif="ShowIndex === index" StyleType="Community" :MoreTipsAlign="(index + 1) % 5 === 0 ? 'left' : 'right'" @ShowGifIndex="ShowGifIndex" @TriggerWatchLater="TriggerWatchLater" @NeedLogin="$emit('NeedLogin')" @SaveToFavorite="OpenSaveToFavorite(item)" @SaveToPlaylist="OpenSaveToPlaylist(item)"></MainVideoListItem>
      </li>
    </ul>

    <!-- 片单操作弹窗 -->
    <PlaylistSetPopup ref="PlaylistSetPopup" v-if="UserInfo !== null && ShowSaveToPlaylist" :Ids="[CurrentId]" @Close="ShowSaveToPlaylist = false"></PlaylistSetPopup>

    <SaveToFavorites ref="SaveToFavorites" :Ids="CurrentId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false"></SaveToFavorites>

    <!-- <SaveToPlaylist ref="SaveToPlaylist" :Ids="[CurrentId]" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false"></SaveToPlaylist> -->

    <!-- 分页器 -->
    <div class="Pagination" v-if="ClassVideoList.length">
      <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
/*
  页面名称：社交页面中间部分组件-视频部分
  创建人：许成祥
  创建时间：2020/03/26
  最近修改人：许成祥
  最近修改日期：2020/04/03
  备注： 无
*/
import Vue from 'vue'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import MainVideoListItem from '../MainVideoListItem'
import PlaylistSetPopup from '../PlaylistSetPopup'
import SaveToFavorites from '../SaveToFavorites'
import SaveToPlaylist from '../SaveToPlaylist'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
const { mapState: mapSearchState, mapActions: mapSearchActions, mapMutations: mapSearchMutations } = createNamespacedHelpers('search')
export default {
  name: 'CommunityOfCenterOfVideos',
  props: ['data'],
  data () {
    return {
      ClassVideoList: [],
      ShowSaveToPlaylist: false,
      ShowSaveToFavorites: false,
      ShowAddFolderPopup: false,
      ShowMoveFolderPopup: false,
      CurrentId: null,
      ShowIndex: null, // 当前显示gif索引值
      DataLock: false, // 数据锁
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') === false ? 1 : this.ToolClass.GetUrlParams('pages') - 0,
        pageSize: 20
      },
      Total: 0,
      HasNextPage: true
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    }),
    ...mapSearchState({
      // ClassVideoList: x => x.ClassVideoList // 视频列表信息
    })
  },
  components: {
    'el-pagination': Pagination,
    MainVideoListItem,
    SaveToFavorites,
    SaveToPlaylist,
    PlaylistSetPopup
  },
  created () {
    this.EmptyClassVideoList()
    this.GetPageList()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'AddPieceGroupSubItem',
      'GetMyVideoList',
      'GetOtherVideoList'
    ]),
    ...mapSearchActions([
      'GetClassVideoList'
    ]),
    ...mapSearchMutations([
      'EmptyClassVideoList',
      'EditClassVideoList'
    ]),
    MoveToSheet (e) { // 添加到片单回调
      if (!this.DataLock) {
        this.DataLock = true
        this.AddPieceGroupSubItem({
          params: { accountId: this.UserInfo.id, videoIds: this.CurrentId, groupIds: this.MyPieceGroupList[e].id }
        }).then((res) => {
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
          this.$notify.success({
            title: 'success',
            message: 'Copy of success!'
          })
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
        })
      }
    },
    OpenSaveToFavorite (item) { // 添加收藏
      this.CurrentId = item.videoId
      this.ShowSaveToFavorites = true
    },
    OpenSaveToPlaylist (item) { // 添加播单
      this.CurrentId = item.videoId
      this.ShowSaveToPlaylist = true
    },
    TriggerWatchLater (e) {
      if (e.type === 'Add') {
        this.ClassVideoList[e.index].WatchLater = true
        // this.EditClassVideoList({ index: e.index, name: 'WatchLater', value: true })
        this.$notify.success({ title: 'success', message: 'Saved to watch later' })
      } else {
        this.ClassVideoList[e.index].WatchLater = false
        // this.EditClassVideoList({ index: e.index, name: 'WatchLater', value: false })
        this.$notify.success({ title: 'success', message: 'Removed from watch later' })
      }
    },
    ShowGifIndex (e) {
      this.ShowIndex = e
    },
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.GetPageList()
      }
    },
    GetPageList () { // 获取列表数据
      if (!this.DataLock) { // 数据请求解锁状态方可请求
        this.DataLock = true // 数据锁定，防止多次触发
        this.EmptyClassVideoList()
        if (this.UserInfo !== null && this.UserInfo.id - 0 === this.data.id) {
          this.GetMyVideoList({ params: { ...this.PageData, accountId: this.UserInfo.id } }).then((res) => {
            let Arr = res.data.data.list || []
            Arr.map((item) => {
              item.WatchLater = false
            })
            this.ClassVideoList = [...Arr]
            this.PageData.pageNum = res.data.data.pageNum
            this.Total = res.data.data.total
            this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
            this.DataLock = false // 数据解锁
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        } else {
          this.GetOtherVideoList({ params: { ...this.PageData, accountId: this.data.id } }).then((res) => {
            let Arr = res.data.data.list || []
            Arr.map((item) => {
              item.WatchLater = false
            })
            this.ClassVideoList = [...Arr]
            this.PageData.pageNum = res.data.data.pageNum
            this.Total = res.data.data.total
            this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
            this.DataLock = false // 数据解锁
          }).catch(() => {
            this.DataLock = false // 数据解锁
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
