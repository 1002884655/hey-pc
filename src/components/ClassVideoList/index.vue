<template>
  <div class="components ClassVideoList">

    <!-- 非搜索页模式 -->
    <ul v-if="!IsSearch">
      <li v-for="(item, index) in PageList" :key="index">
        <MainVideoListItem :data="item" :WatchLater="item.WatchLater" :Index="index" :ShowGif="ShowGifIndex === index" StyleType="Default" :MoreTipsAlign="(index + 1) % 5 === 0 ? 'left' : 'right'" @ShowGifIndex="ToShowGifIndex" @TriggerWatchLater="TriggerWatchLater" @NeedLogin="$emit('NeedLogin')" @SaveToFavorite="SaveToFavorite(item)" @SaveToPlaylist="OpenSaveToPlaylist(item)"></MainVideoListItem>
      </li>
    </ul>

    <!-- 搜索页模式 -->
    <ul v-else>
      <li v-for="(item, index) in PageList" class="SearchList" :key="index">
        <MainVideoListItem :data="item" :WatchLater="item.WatchLater" :Index="index" :ShowGif="ShowGifIndex === index" StyleType="Default" :MoreTipsAlign="(index + 1) % 4 === 0 ? 'left' : 'right'" @ShowGifIndex="ToShowGifIndex" @TriggerWatchLater="TriggerWatchLater" @NeedLogin="$emit('NeedLogin')" @SaveToFavorite="SaveToFavorite(item)" @SaveToPlaylist="OpenSaveToPlaylist(item)"></MainVideoListItem>
      </li>
    </ul>

    <SaveToFavorites ref="SaveToFavorites" :Ids="CurrentId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false"></SaveToFavorites>

    <SaveToPlaylist ref="SaveToPlaylist" :Ids="[CurrentId]" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false"></SaveToPlaylist>

    <!-- 无数据状态 -->
    <span class="NoData" v-if="IsSearch && !HasNextPage && !SearchVideoList.length">No search results available</span>
    <span class="NoData" v-if="!IsSearch && !HasNextPage && !ClassVideoList.length">No search results available</span>

    <!-- 下一页 -->
    <div class="NextPage" v-if="TotalNum !== null">
      <el-pagination background :page-size="20" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="TotalNum" @current-change="PageChange"></el-pagination>
    </div>

  </div>
</template>

<script>
/*
  页面名称：视频分类主页-视频列表
  创建人：许成祥
  创建时间：2020/01/02
  最近修改人：许成祥
  最近修改日期：2020/04/11
  备注： 无
*/
import Vue from 'vue'
import { Notification, Pagination } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
import MainVideoListItem from '../MainVideoListItem'
import SaveToFavorites from '../SaveToFavorites'
import SaveToPlaylist from '../SaveToPlaylist'
Vue.prototype.$notify = Notification
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
const { mapState: mapSearchState, mapActions: mapSearchActions, mapMutations: mapSearchMutations } = createNamespacedHelpers('search')
export default {
  name: 'ClassVideoList',
  props: ['DataLock', 'IsSearch'],
  data () {
    return {
      ShowSaveToPlaylist: false,
      ShowSaveToFavorites: false,
      PageList: [],
      CurrentId: null,
      ShowAddFolderPopup: false,
      ShowMoveFolderPopup: false,
      PageDataLock: false,
      ShowWatchLaterAlert: true,
      ShowGifIndex: null, // 当前显示Gif索引值
      PageData: { // 请求数据分页
        pageNum: this.ToolClass.GetUrlParams('pages') === false ? 1 : this.ToolClass.GetUrlParams('pages') - 0,
        pageSize: 20
      },
      Filter: null,
      TotalNum: null, // 总条数
      HasNextPage: true // 是否有下一页
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    }),
    ...mapSearchState({
      ClassVideoList: x => x.ClassVideoList, // 分类视频列表
      SearchVideoList: x => x.SearchVideoList // 搜索视频列表
    })
  },
  components: {
    'el-pagination': Pagination,
    MainVideoListItem,
    SaveToFavorites,
    SaveToPlaylist
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'AddWatchLater',
      'CancelWatchLater',
      'AddPieceGroupSubItem'
    ]),
    ...mapSearchMutations([
      'EmptyClassVideoList',
      'EmptySearchVideoList',
      'EditSearchVideoList',
      'EditClassVideoList'
    ]),
    ...mapSearchActions([
      'GetClassVideoList',
      'GetSearchVideoList'
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
    SaveToFavorite (item) { // 添加收藏
      if (this.UserInfo !== null) {
        this.CurrentId = item.videoId
        this.ShowSaveToFavorites = true
      } else {
        this.$emit('NeedLogin')
      }
    },
    OpenSaveToPlaylist (item) { // 添加播单
      if (this.UserInfo !== null) {
        this.CurrentId = item.videoId
        this.ShowSaveToPlaylist = true
      } else {
        this.$emit('NeedLogin')
      }
    },
    TriggerWatchLater (e) {
      if (e.type === 'Add') {
        this.PageList[e.index].WatchLater = true
        this.$notify.success({ title: 'success', message: 'has been added' })
      } else {
        this.PageList[e.index].WatchLater = false
        this.$notify.success({ title: 'success', message: 'has been removed' })
      }
    },
    ToShowGifIndex (e) {
      this.ShowGifIndex = e
    },
    LinkToMedia (id) { // 跳转到视频页
      window.open(`./video.html?key=${id}`, '_self')
    },
    ToAddWatchLater (item, index) { // 添加稍后观看
      if (this.UserInfo !== null) { // 用户已登录
        if (!this.PageDataLock) {
          this.PageDataLock = true // 数据锁定
          if (item.WatchLater) { // 取消添加稍后观看
            this.CancelWatchLater({
              params: { videoId: item.videoM, accountId: this.UserInfo.id }
            }).then((res) => {
              this.$notify.success({
                title: 'success',
                message: 'has been removed'
              })
              if (this.IsSearch) {
                this.EditSearchVideoList({ index, name: 'WatchLater', value: false })
              } else {
                this.EditClassVideoList({ index, name: 'WatchLater', value: false })
              }
              this.PageDataLock = false // 数据解锁
            }).catch((res) => {
              this.PageDataLock = false // 数据解锁
            })
          } else { // 添加稍后观看
            this.AddWatchLater({ params: { videoId: item.videoM, accountId: this.UserInfo.id } }).then((res) => {
              this.$notify.success({
                title: 'success',
                message: res.data.msg
              })
              if (this.IsSearch) {
                this.EditSearchVideoList({ index, name: 'WatchLater', value: true })
              } else {
                this.EditClassVideoList({ index, name: 'WatchLater', value: true })
              }
              this.PageDataLock = false // 数据解锁
            }).catch((res) => {
              if (res.data.code - 0 === 2056) {
                this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                  close()
                  window.open(`./users.html?type=5`, '_self')
                }, 'Immediately to')
              }
              this.PageDataLock = false // 数据解锁
            })
          }
        }
      } else { // 用户未登录
        this.$emit('NeedLogin')
      }
    },
    PageChange (e) {
      // window.location.href = this.ToolClass.ChangeUrlArg(window.location.href, 'pages', e)
      this.PageData.pageNum = e
      this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
      this.Init(this.Filter)
    },
    Init (e) { // 数据初始化
      if (!this.DataLock) {
        this.$emit('TriggerDataLock', true) // Video数据锁锁定（防多次触发）
        this.EmptyClassVideoList() // 清空列表
        this.EmptySearchVideoList() // 清空列表
        this.PageList = []
        this.PageData.pageNum = this.ToolClass.GetUrlParams('pages') === false ? 1 : this.ToolClass.GetUrlParams('pages') - 0
        this.HasNextPage = true
        this.Filter = e
        this.GetList()
      }
    },
    Change (e) { // 数据更新
      if (!this.DataLock) {
        this.$emit('TriggerDataLock', true) // Video数据锁锁定（防多次触发）
        this.EmptyClassVideoList() // 清空列表
        this.EmptySearchVideoList() // 清空列表
        this.PageData.pageNum = 1
        this.HasNextPage = true
        this.Filter = e
        this.GetList()
      }
    },
    GetNextPage () { // 获取下一页数据
      if (!this.DataLock && this.HasNextPage) {
        this.$emit('TriggerDataLock', true) // Video数据锁锁定（防多次触发）
        this.GetList()
      }
    },
    SetLocalStorageSearchHistory (key) { // 设置本地搜索历史
      if (this.IsSearch && key !== '') {
        let Heypornsearchhistory = JSON.parse(this.$localStorage.get('heypornsearchhistory')) || []
        if (this.PageData.pageNum === 1 && this.UserInfo === null) {
          if (Heypornsearchhistory.length && Heypornsearchhistory[0] !== key) {
            Heypornsearchhistory.map((item, index) => {
              if (item === key) {
                Heypornsearchhistory.splice(index, 1)
              }
            })
            Heypornsearchhistory.unshift(key)
            this.$localStorage.set('heypornsearchhistory', JSON.stringify(Heypornsearchhistory))
          }
          if (!Heypornsearchhistory.length) {
            Heypornsearchhistory.unshift(key)
            this.$localStorage.set('heypornsearchhistory', JSON.stringify(Heypornsearchhistory))
          }
        }
      }
    },
    GetList () { // 获取列表数据
      if (this.IsSearch) { // 搜索
        let Key = this.ToolClass.GetUrlParams('key') === false ? '' : decodeURI(this.ToolClass.GetUrlParams('key'))
        this.GetSearchVideoList({
          params: { ...this.PageData, orderBy: this.Filter.OrderBy || 1 },
          data: { ...this.Filter.SearchParams, keyword: this.IsSearch ? Key : '', userId: this.UserInfo === null ? null : this.UserInfo.id, labelName: decodeURI(this.ToolClass.GetUrlParams('tag')) === 'false' ? '' : decodeURI(this.ToolClass.GetUrlParams('tag')) }
        }).then((res) => {
          if (res.data.code - 0 === 0) {
            this.PageList = this.SearchVideoList.slice(0) || []
            this.SetLocalStorageSearchHistory(Key) // 设置本地搜索历史
            this.TotalNum = res.data.data.total - 0
            this.PageData.pageNum = res.data.data.pageNum
            history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'pages', this.PageData.pageNum))
          } else if (res.data.code - 0 === 2001) {
            this.HasNextPage = false
          }
          this.$emit('TriggerDataLock', false) // Video数据锁锁定（防多次触发）
        }).catch(() => {
          this.$emit('TriggerDataLock', false) // Video数据锁锁定（防多次触发）
        })
      } else {
        this.GetClassVideoList({
          params: { ...this.PageData, orderBy: this.Filter.OrderBy || 1 },
          data: { ...this.Filter.SearchParams, keyword: this.IsSearch ? decodeURI(this.ToolClass.GetUrlParams('key')) : '' }
        }).then((res) => {
          if (res.data.code - 0 === 0) {
            this.PageList = this.ClassVideoList.slice(0) || []
            this.SetLocalStorageSearchHistory() // 设置本地搜索历史
            this.TotalNum = res.data.data.total - 0
            this.PageData.pageNum = res.data.data.pageNum
            history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'pages', this.PageData.pageNum))
          }
          this.$emit('TriggerDataLock', false) // Video数据锁锁定（防多次触发）
        }).catch(() => {
          this.$emit('TriggerDataLock', false) // Video数据锁锁定（防多次触发）
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
