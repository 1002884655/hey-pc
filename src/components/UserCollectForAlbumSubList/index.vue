<template>
  <div class="components UserCollectForAlbumSubList flex-v">

    <!-- 封面 -->
    <div class="Front flex-h">
      <div class="Img">
        <a>
          <img v-if="FavoritesIndex !== null" :src="CollectAlbumList[FavoritesIndex].cover" class="centerLabel contain" alt="">
        </a>
      </div>
      <div class="flex-item flex-v">
        <span class="flex-item">{{FavoritesIndex !== null ? CollectAlbumList[FavoritesIndex].name : ''}}</span>
        <div>
          <a @click="PlayAll" :style="{backgroundColor: VideoAlbumSubList.length ? '#e2041b' : '#ccc'}">PLAY ALL</a>
        </div>
      </div>
    </div>

    <!-- 顶部批量操作栏 -->
    <div class="flex-h Top" v-if="VideoAlbumSubList.length">
      <a class="iconfont iconpaixu Sort">
        <span>Sort</span>
        <ul class="SortList">
          <li @click="CutSort(1)" :class="{'active': PageData.sort === 1}">Add date (from early to late)</li>
          <li @click="CutSort(2)" :class="{'active': PageData.sort === 2}">Add date (from late to early)</li>
          <li @click="CutSort(3)" :class="{'active': PageData.sort === 3}">Views (from high to low)</li>
        </ul>
      </a>
      <div class="flex-item">
        <div v-if="ProcessingBatchStatus">
          <a class="SelectAll" @click="SelectAllVideo" :class="{'active': SelectAllVideoStatus}">
            <span>Select all</span>
          </a>
          <a class="MoveTo" @click="AddToPlaylist(null)">
            <i class="iconfont iconwenjianjia2"></i>
            <span>Save to my Playlist</span>
          </a>
          <a class="Back" @click="ProcessingBatchStatus = false">
            <span>Back</span>
            <i class="iconfont iconjiantouright"></i>
          </a>
        </div>
      </div>
      <!-- <a v-if="!ProcessingBatchStatus">Clean up invalid videos</a> -->
      <a v-if="!ProcessingBatchStatus" @click="ProcessingBatchStatus = true">Batch editing</a>
    </div>

    <div class="flex-item">
      <div>
        <ScrollY>

          <!-- 列表数据为空 -->
          <span class="ListIsNone" v-if="ListIsNone">There's no video here</span>

          <!-- 列表 -->
          <ul class="List">
            <li v-for="(item, index) in VideoAlbumSubList" :key="index" :class="{'ProcessingBatch': ProcessingBatchStatus, 'active': item.active}">
              <a class="Img">
                <img :src="item.frontPath" class="centerLabel cover" alt="" @click="LinkToPlayer(item)">
                <div class="SelectLayer" @click="SelectVideoItem(item, index)">
                  <a class="iconfont" :class="[item.active ? 'iconyitianjia' : 'iconyuan']"></a>
                </div>
                <!-- <span v-if="item.capacity">{{JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}} {{ToolClass.DateFormat(item.length)}}</span> -->
              </a>
              <div class="Content">
                <a class="Title" @click="LinkToPlayer(item)">{{item.title}}</a>
                <div class="flex-h">
                  <a class="flex-item" @click="LinkToPlayer(item)">{{item.userName}}</a>
                </div>
                <div class="flex-h">
                  <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
                  <!-- <span>· {{item.upTime | changeTime}}</span> -->
                  <a class="More iconfont iconsandian1"></a>
                  <div class="Tips">
                    <a @click="AddToWatchLater(item)">
                      <i class="iconfont iconshaohouguankan"></i>
                      <span>Watch Later</span>
                    </a>
                    <a @click="AddToFavorite(item, index)">
                      <i class="iconfont iconshoucang-"></i>
                      <span>Save to my Favorite</span>
                    </a>
                    <a @click="AddToPlaylist(item, index)">
                      <i class="iconfont iconyemian"></i>
                      <span>Save to my Playlist</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- 分页器 -->
          <div class="Pagination" v-if="TotalItem">
            <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="TotalItem" @current-change="PageChange"></el-pagination>
          </div>

          <!-- 转移收藏夹弹窗 -->
          <VideoCollectFolderMove v-if="ShowMoveFolderPopup" Title="Move to Favorites" @Close="ShowMoveFolderPopup = false" @Change="FolderMoveChange"></VideoCollectFolderMove>

          <!-- 转移片单弹窗 -->
          <UserForMySheetVideosCopy v-if="ShowMoveSheetPopup" Title="Copy to other album" @Change="SheetMoveChange" @Close="ShowMoveSheetPopup = false"></UserForMySheetVideosCopy>

          <SaveToFavorites ref="SaveToFavorites" :Ids="CurrentId" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false"></SaveToFavorites>

          <SaveToPlaylist ref="SaveToPlaylist" :Ids="CurrentId" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false"></SaveToPlaylist>

        </ScrollY>
      </div>

    </div>

  </div>
</template>

<script>
/*
  页面名称：我的片单收藏夹下列表
  创建人：许成祥
  创建时间：2020/06/10
  最近修改人：许成祥
  最近修改日期：2020/06/10
  备注： 无
*/
import Vue from 'vue'
import ScrollY from '../ScrollY'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import SaveToFavorites from '../SaveToFavorites'
import SaveToPlaylist from '../SaveToPlaylist'
import VideoCollectFolderMove from '../VideoCollectFolderMove'
import UserForMySheetVideosCopy from '../UserForMySheetVideosCopy'
import Popup from '../Popup'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserCollectForAlbumSubList',
  props: ['data'],
  data () {
    return {
      ShowSaveToPlaylist: false,
      ShowSaveToFavorites: false,
      ShowMoveSheetPopup: false, // 显隐转移至我的片单弹窗
      CurrentId: null, // 当前操作id
      CurrentItem: null, // 当前操作对象
      ShowMoveFolderPopup: false, // 显隐转移至我的收藏弹窗
      ProcessingBatchStatus: false, // 批处理状态
      ParentParams: null, // 收藏夹参数
      PageData: {
        sort: 1,
        pageNum: this.ToolClass.GetUrlParams('pages') !== false ? this.ToolClass.GetUrlParams('pages') - 0 : 1,
        pageSize: 20
      },
      ListIsNone: false, // 列表请求后为空
      TotalItem: 0, // 列表总数
      DataLock: false, // 数据锁
      FavoritesIndex: null, // 收藏夹选中索引值
      ActiveIndex: null // 选中索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      CollectForSheetList: x => x.CollectForSheetList, // 用户所有片单收藏夹列表
      CollectAlbumList: x => x.CollectAlbumList, // 用户所有收藏片单列表
      VideoAlbumSubList: x => x.VideoAlbumSubList, // 专辑收藏夹下视频列表
      MyPieceGroupList: x => x.MyPieceGroupList, // 用户所有视频片单列表
      VideoCollectCategoryList: x => x.VideoCollectCategoryList // 用户所有视频收藏夹列表
    }),
    SelectAllVideoStatus () { // 全选状态
      let Bool = true
      this.VideoAlbumSubList.map((item) => {
        if (!item.active) {
          Bool = false
          return false
        }
      })
      return Bool
    },
    SelectNum () { // 选择数量
      let Num = 0
      this.VideoAlbumSubList.map((item) => {
        Num = item.active ? Num + 1 : Num
      })
      return Num
    }
  },
  components: {
    'el-pagination': Pagination,
    ScrollY,
    VideoCollectFolderMove,
    Popup,
    UserForMySheetVideosCopy,
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
      'GetAlbumPageVideos',
      'RemoveVideoCollect',
      'AddPieceGroupSubItem',
      'AddVideoCollect',
      'AddWatchLater'
    ]),
    ...mapUserMutations([
      'TriggerVideoAlbumSubListItem',
      'SelectAllVideoAlbumSubList'
    ]),
    AddToWatchLater (item) { // 添加到稍后观看
      if (!this.DataLock) {
        this.DataLock = true
        this.AddWatchLater({
          params: { videoId: item.videoId, accountId: this.UserInfo.id }
        }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'add successfully!'
          })
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
    SheetMoveChange (e) { // 添加到我的片单
      if (!this.DataLock) {
        this.DataLock = true
        this.AddPieceGroupSubItem({
          params: { videoIds: this.CurrentId, accountId: this.UserInfo.id, groupIds: this.MyPieceGroupList[e].id }
        }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'add successfully!'
          })
          this.ShowMoveSheetPopup = false
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.ShowMoveSheetPopup = false
          this.DataLock = false
        })
      }
    },
    FolderMoveChange (e) { // 添加到我的收藏
      if (!this.DataLock) {
        this.DataLock = true
        this.AddVideoCollect({
          params: { videoId: this.CurrentId, accountId: this.UserInfo.id, categoryId: this.VideoCollectCategoryList[e].id }
        }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'add successfully!'
          })
          this.ShowMoveFolderPopup = false
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.ShowMoveFolderPopup = false
          this.DataLock = false
        })
      }
    },
    AddToFavorite (item, index) { // 添加到我的收藏
      if (item !== undefined) { // 单个添加
        this.CurrentId = item.videoId
      } else { // 批量添加
        let Arr = []
        this.VideoAlbumSubList.map((item) => {
          if (item.active) {
            Arr.push(item.videoId)
          }
        })
        this.CurrentId = Arr.join(',')
      }
      this.ShowSaveToFavorites = true
    },
    AddToPlaylist (item, index) { // 添加到我的片单
      if (item !== null) { // 单个添加
        this.CurrentId = [item.videoId]
        this.ShowSaveToPlaylist = true
      } else { // 批量添加
        if (this.SelectNum) {
          let Arr = []
          this.VideoAlbumSubList.map((item) => {
            if (item.active) {
              Arr.push(item.videoId)
            }
          })
          this.CurrentId = Arr
          this.ShowSaveToPlaylist = true
        } else {
          this.$notify.error({
            title: 'error',
            message: 'Please select at least one video'
          })
        }
      }
    },
    CutSort (num) {
      this.PageData.sort = num
      this.ToGetVideoCollect()
    },
    Init () {
      this.CheckFavoritesIndex()
      this.ToGetVideoCollect()
    },
    LinkToPlayer (item) {
      window.open(`./video.html?key=${item.videoM}&type=5&album=${this.CollectAlbumList[this.FavoritesIndex].id}`, '_self')
    },
    CheckFavoritesIndex () { // 查验收藏夹索引值
      this.CollectAlbumList.map((item, index) => {
        if (item.id - 0 === this.ToolClass.GetUrlParams('album') - 0) {
          this.FavoritesIndex = index
        }
      })
    },
    PlayAll () { // 播放全部
      if (this.VideoAlbumSubList.length) {
        window.open(`./video.html?key=${this.VideoAlbumSubList[0].videoM}&type=5&album=${this.ToolClass.GetUrlParams('album')}`, '_self')
      }
    },
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetVideoCollect()
      }
    },
    SelectAllVideo () { // 全选视频
      this.SelectAllVideoAlbumSubList(!this.SelectAllVideoStatus)
    },
    SelectVideoItem (item, index) { // 选择专辑下的视频
      this.TriggerVideoAlbumSubListItem(index)
    },
    Change (params) { // 切换收藏夹时触发列表改变
      this.CheckFavoritesIndex()
      this.ParentParams = params
      this.ProcessingBatchStatus = false
      this.PageData.pageNum = 1
      this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
      this.ToGetVideoCollect()
    },
    ToGetVideoCollect () { // 获取收藏夹下视频列表
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        this.ListIsNone = false
        this.GetAlbumPageVideos({ params: { albumId: this.ToolClass.GetUrlParams('album'), ...this.PageData } }).then((res) => {
          this.PageData.pageNum = res.data.data.pageNum || 1
          this.TotalItem = res.data.data.total - 0
          this.ListIsNone = this.TotalItem === 0
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
          this.DataLock = false // 数据解锁
        }).catch(() => {
          this.DataLock = false // 数据解锁
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
