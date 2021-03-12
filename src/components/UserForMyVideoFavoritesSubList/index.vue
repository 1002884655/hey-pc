<template>
  <div class="components UserForMyVideoFavoritesSubList flex-v">

    <!-- 封面 -->
    <div class="Front flex-h">
      <div class="Img">
        <a>
          <img v-if="FavoritesIndex !== null" :src="VideoCollectCategoryList[FavoritesIndex].cover" class="centerLabel contain" alt="">
        </a>
      </div>
      <div class="flex-item flex-v">
        <span class="flex-item">{{FavoritesIndex !== null ? VideoCollectCategoryList[FavoritesIndex].name : ''}}</span>
        <div>
          <a @click="PlayAll" :style="{backgroundColor: VideoCollectList.length ? '#e2041b' : '#ccc'}">Play all</a>
        </div>
      </div>
    </div>

    <!-- 顶部批量操作栏 -->
    <div class="flex-h Top" v-if="VideoCollectList.length">
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
          <a class="UnCollect" @click="CancelCollect">
            <i class="iconfont iconqingkong"></i>
            <span>Delete</span>
          </a>
          <a class="MoveTo" @click="MoveToOtherFolder">
            <i class="iconfont iconwenjianjia2"></i>
            <span>Move to</span>
          </a>
          <a class="Back" @click="ProcessingBatchStatus = false">
            <span>Back</span>
            <i class="iconfont iconjiantouright"></i>
          </a>
        </div>
      </div>
      <a v-if="!ProcessingBatchStatus">Clean up invalid videos</a>
      <a v-if="!ProcessingBatchStatus" @click="ProcessingBatchStatus = true">Batch editing</a>
    </div>

    <div class="flex-item">
      <div>
        <ScrollY>

          <!-- 列表数据为空 -->
          <span class="ListIsNone" v-if="ListIsNone">There's no video here</span>

          <!-- 列表 -->
          <ul class="List">
            <li v-for="(item, index) in VideoCollectList" :key="index" :class="{'ProcessingBatch': ProcessingBatchStatus, 'active': item.active}">
              <a class="Img">
                <img :src="item.front" class="centerLabel cover" alt="" @click="LinkToPlayer(item)">
                <div class="SelectLayer" @click="SelectVideoItem(item, index)">
                  <a class="iconfont" :class="[item.active ? 'iconyitianjia' : 'iconyuan']"></a>
                </div>
                <span>{{JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}} {{ToolClass.DateFormat(item.length)}}</span>
              </a>
              <div class="Content">
                <a class="Title" @click="LinkToPlayer(item)" :title="item.title">{{item.title}}</a>
                <div class="flex-h">
                  <a :href="`./userspace.html?key=${item.userId}`" target="_self">{{item.userName}}</a>
                </div>
                <div class="flex-h">
                  <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
                  <!-- <span>· {{item.upTime | changeTime}}</span> -->
                  <a class="More iconfont iconsandian1"></a>
                  <div class="Tips">
                    <a @click="DeleteCollectItem(item)">
                      <i class="iconfont iconqingkong"></i>
                      <span>Delete</span>
                    </a>
                    <a @click="MoveItemToOtherFolder(item, index)">
                      <i class="iconfont iconwenjianjia2"></i>
                      <span>Move</span>
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

          <SaveToFavorites ref="SaveToFavorites" Title="Move to favorites" :Ids="CurrentId" :Pid="ToolClass.GetUrlParams('favorites')" v-if="ShowSaveToFavorites && UserInfo !== null" @Close="ShowSaveToFavorites = false" @Change="VideoListChange"></SaveToFavorites>

        </ScrollY>
      </div>

    </div>

  </div>
</template>

<script>
/*
  页面名称：我的视频收藏夹下列表
  创建人：许成祥
  创建时间：2020/05/22
  最近修改人：许成祥
  最近修改日期：2020/05/22
  备注： 无
*/
import Vue from 'vue'
import ScrollY from '../ScrollY'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import SaveToFavorites from '../SaveToFavorites'
import Popup from '../Popup'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyVideoFavoritesSubList',
  props: ['data'],
  data () {
    return {
      FavoritesTitle: null,
      CurrentId: '',
      ShowSaveToFavorites: false,
      ShowDeleteArrPopup: false, // 显隐批量删除视频弹窗
      CurrentItem: null, // 当前操作对象
      ShowDeleteItemPopup: false, // 显隐删除单个视频弹窗
      ShowMoveFolderPopup: false, // 显隐转移至专辑弹窗
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
      VideoCollectCategoryList: x => x.VideoCollectCategoryList, // 用户所有视频收藏夹列表
      VideoCollectList: x => x.VideoCollectList // 收藏夹下视频列表
    }),
    SelectAllVideoStatus () { // 全选状态
      let Bool = true
      this.VideoCollectList.map((item) => {
        if (!item.active) {
          Bool = false
          return false
        }
      })
      return Bool
    },
    SelectNum () { // 选择数量
      let Num = 0
      this.VideoCollectList.map((item) => {
        Num = item.active ? Num + 1 : Num
      })
      return Num
    }
  },
  components: {
    'el-pagination': Pagination,
    ScrollY,
    Popup,
    SaveToFavorites
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetVideoCollect',
      'RemoveVideoCollect',
      'CancelVideoCollect'
    ]),
    ...mapUserMutations([
      'TriggerVideoCollectListItem',
      'SelectAllVideoCollectList'
    ]),
    VideoListChange (e) {
      if (e.Type !== 'AddFavorite') {
        this.ToGetVideoCollect()
      }
    },
    DeleteCollectItem (item) { // 点击删除单个视频
      this.CurrentItem = item
      this.ToolClass.Confirm('Delete video', 'Are you sure to delete this video', () => { }, (close) => {
        this.DeleteItemSure(close)
      })
    },
    DeleteItemSure (callback = () => { }) { // 确认删除单个视频
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        this.CancelVideoCollect({ params: { accountId: this.UserInfo.id, videoIds: this.CurrentItem.videoId, categoryId: this.ToolClass.GetUrlParams('favorites') } }).then(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteItemPopup = false
          callback()
          this.ToGetVideoCollect()
          this.$emit('Change')
        }).catch(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteItemPopup = false
        })
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
      window.open(`./video.html?key=${item.videoM}&type=3&favorites=${this.VideoCollectCategoryList[this.FavoritesIndex].id}`, '_self')
    },
    CheckFavoritesIndex () { // 查验收藏夹索引值
      this.VideoCollectCategoryList.map((item, index) => {
        if (item.id - 0 === this.ToolClass.GetUrlParams('favorites') - 0) {
          this.FavoritesIndex = index
        }
      })
    },
    FolderMoveChange (e) { // 转移专辑成功回调
      if (!this.DataLock && this.SelectNum && e !== this.ActiveIndex) {
        this.DataLock = true // 数据锁定
        let Arr = []
        this.VideoCollectList.map((item) => {
          if (item.active) {
            Arr.push(item.id)
          }
        })
        this.RemoveVideoCollect({
          params: { accountId: this.UserInfo.id, ids: Arr.join(','), categoryId: this.VideoCollectCategoryList[e].id }
        }).then((res) => {
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
          this.ToGetVideoCollect()
          this.$emit('Change')
        }).catch((res) => {
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
        })
      } else {
        this.ShowMoveFolderPopup = false
      }
    },
    MoveItemToOtherFolder (item, index) { // 转移至其他专辑
      this.CurrentItem = item
      this.CurrentId = item.videoId
      this.FavoritesTitle = 'Save to favorites'
      this.ShowSaveToFavorites = true
      // this.SelectVideoItem(item, index)
      // this.SelectFolderIndex = this.ActiveIndex
      // this.ShowMoveFolderPopup = true
    },
    MoveToOtherFolder () { // 转移至其他专辑
      if (this.SelectNum) {
        // this.SelectFolderIndex = this.ActiveIndex
        // this.ShowMoveFolderPopup = true
        let Arr = []
        this.VideoCollectList.map((item) => {
          if (item.active) {
            Arr.push(item.id)
          }
        })
        this.CurrentId = Arr.join(',')
        this.FavoritesTitle = 'Move to favorites'
        this.ShowSaveToFavorites = true
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Please select at least one video'
        })
      }
    },
    PlayAll () { // 播放全部
      if (this.VideoCollectList.length) {
        window.open(`./video.html?key=${this.VideoCollectList[0].videoM}&type=3&favorites=${this.ToolClass.GetUrlParams('favorites')}`, '_self')
      }
    },
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetVideoCollect()
      }
    },
    SelectAllVideo () { // 全选视频
      this.SelectAllVideoCollectList(!this.SelectAllVideoStatus)
    },
    DeleteArrSure (callback = () => { }) { // 确认批量取消收藏视频
      if (!this.DataLock && this.SelectNum) {
        this.DataLock = true // 数据锁定
        let Arr = []
        this.VideoCollectList.map((item) => {
          if (item.active) {
            Arr.push(item.videoId)
          }
        })
        this.CancelVideoCollect({ params: { accountId: this.UserInfo.id, videoIds: Arr.join(',') } }).then(() => {
          this.ShowDeleteArrPopup = false
          this.DataLock = false // 数据解锁
          callback()
          this.ToGetVideoCollect()
          this.$emit('Change')
        }).catch(() => {
          this.ShowDeleteArrPopup = false
          this.DataLock = false // 数据解锁
        })
      }
    },
    CancelCollect () { // 取消收藏视频
      if (this.SelectNum) {
        this.ToolClass.Confirm('Delete videos', 'Are you sure to delete these videos', () => { }, (close) => {
          this.DeleteArrSure(close)
        })
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Please select at least one video'
        })
      }
    },
    SelectVideoItem (item, index) { // 选择专辑下的视频
      this.TriggerVideoCollectListItem(index)
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
        let Params = { ...this.PageData, accountId: this.UserInfo.id, pageNum: this.PageData.pageNum || 1 }
        if (this.ParentParams === null || this.ParentParams.defaults - 0 === 1) { // 默认收藏夹
          Params.defaults = 1
        } else { // 指定收藏夹
          Params.categoryId = this.ParentParams.id
        }
        this.GetVideoCollect({ params: Params }).then((res) => {
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
