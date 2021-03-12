<template>
  <div class="components UserForMyPhotoFavoritesSubList flex-v">

    <!-- 封面 -->
    <div class="Front flex-h">
      <div class="Img">
        <a>
          <img v-if="FavoritesIndex !== null" :src="PhotoAlbum[FavoritesIndex].cover" class="centerLabel cover" alt="">
        </a>
      </div>
      <div class="flex-item flex-v">
        <span class="flex-item">{{FavoritesIndex !== null ? PhotoAlbum[FavoritesIndex].title : ''}}</span>
        <span class="iconfont iconchakan">{{FavoritesIndex !== null ? ` ${PhotoAlbum[FavoritesIndex].viewNum}` : ''}}</span>
        <div>
          <a v-if="PhotoAlbum[FavoritesIndex]" :href="`./upload.html?type=photo&album=${PhotoAlbum[FavoritesIndex].id}`" target="_self">upload photo</a>
        </div>
      </div>
    </div>

    <!-- 顶部批量操作栏 -->
    <div class="flex-h Top">
      <!-- <a class="iconfont iconpaixu Sort">
        <span>Sort</span>
        <ul class="SortList">
          <li @click="CutSort(1)" :class="{'active': PageData.sort === 1}">Add date (from early to late)</li>
          <li @click="CutSort(2)" :class="{'active': PageData.sort === 2}">Add date (from late to early)</li>
          <li @click="CutSort(3)" :class="{'active': PageData.sort === 3}">Views (from high to low)</li>
        </ul>
      </a> -->
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
      <a v-if="!ProcessingBatchStatus" @click="ProcessingBatchStatus = true">Batch editing</a>
    </div>

    <div class="flex-item">
      <div>
        <ScrollY>

          <!-- 列表数据为空 -->
          <span class="ListIsNone" v-if="ListIsNone">There's no photo here</span>

          <!-- 列表 -->
          <ul class="List">
            <li v-for="(item, index) in AblumPhotos" :key="index" :class="{'ProcessingBatch': ProcessingBatchStatus, 'active': item.active}">
              <a class="Img">
                <img :src="item.photoPath" class="centerLabel contain" alt="" @click="LinkToPlayer(index)">
                <div class="SelectLayer" @click="SelectVideoItem(item, index)">
                  <a class="iconfont" :class="[item.active ? 'iconyitianjia' : 'iconyuan']"></a>
                </div>
                <div class="Layer flex-h">
                  <div>
                    <a class="iconfont iconchakan"> {{item.viewNum}}</a>
                  </div>
                  <div>
                    <!-- <a class="iconfont iconshoucang-"> 999</a> -->
                  </div>
                  <div>
                    <a class="iconfont iconsandian1"></a>
                    <div class="Tips">
                      <a @click="CoverItem(item)">
                        <i class="iconfont iconfengmian"></i>
                        <span>Cover</span>
                      </a>
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
              </a>
              <!-- <a class="Title" @click="LinkToPlayer(item)">{{item.title}}</a>
              <div class="flex-h">
                <a class="flex-item" @click="LinkToPlayer(item)">{{item.userName}}</a>
              </div>
              <div class="flex-h">
                <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
                <span>· {{item.upTime | changeTime}}</span>
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
              </div> -->
            </li>
          </ul>

          <!-- 分页器 -->
          <div class="Pagination" v-if="TotalItem">
            <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="TotalItem" @current-change="PageChange"></el-pagination>
          </div>

          <!-- 转移收藏夹弹窗 -->
          <PhotosAlbumMove v-if="ShowMoveFolderPopup" Title="Move to gallery" @NewFolder="ShowMoveFolderPopup = false; $emit('NewFolder')" @Change="FolderMoveChange" @Close="ShowMoveFolderPopup = false" :DefaultIndex="ActiveIndex"></PhotosAlbumMove>

          <!-- 查看大图 -->
          <BigImgList v-if="ShowBigImgList" :List="CurrentBigImgList" :ActiveIndex="CurrentBigImgActiveIndex" @Close="ShowBigImgList = false"></BigImgList>

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
import PhotosAlbumMove from '../PhotosAlbumMove'
import BigImgList from '../BigImgList'
import Popup from '../Popup'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyPhotoFavoritesSubList',
  props: ['data'],
  data () {
    return {
      ShowBigImgList: false,
      CurrentBigImgList: [],
      CurrentBigImgActiveIndex: 0,
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
      PhotoAlbum: x => x.PhotoAlbum, // 用户所有视频收藏夹列表
      AblumPhotos: x => x.AblumPhotos // 收藏夹下视频列表
    }),
    SelectAllVideoStatus () { // 全选状态
      let Bool = true
      this.AblumPhotos.map((item) => {
        if (!item.active) {
          Bool = false
          return false
        }
      })
      return Bool
    },
    SelectNum () { // 选择数量
      let Num = 0
      this.AblumPhotos.map((item) => {
        Num = item.active ? Num + 1 : Num
      })
      return Num
    }
  },
  components: {
    'el-pagination': Pagination,
    ScrollY,
    PhotosAlbumMove,
    Popup,
    BigImgList
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetAblumPhotos',
      'MoveAlbumPhotos',
      'RemoveAblumPhotos',
      'ChangeCoverPhotoAlbum'
    ]),
    ...mapUserMutations([
      'TriggerPhotoAlbumSubListItem',
      'SelectAllPhotoAlbumSubList',
      'EditPhotoAlbum'
    ]),
    CoverItem (item) { // 设为封面
      if (!this.DataLock) {
        this.DataLock = true
        this.ChangeCoverPhotoAlbum({ params: { photoAlbumId: this.ToolClass.GetUrlParams('gallery'), cover: item.photoPath } }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'successfully set'
          })
          this.EditPhotoAlbum({ index: this.FavoritesIndex, name: 'cover', value: item.photoPath })
          this.DataLock = false // 数据解锁
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false // 数据解锁
        })
      }
    },
    DeleteCollectItem (item) { // 点击删除单个视频
      this.CurrentItem = item
      this.ToolClass.Confirm('Delete photo', 'Are you sure to delete this photo', () => { }, (close) => {
        this.DeleteItemSure(close)
      })
    },
    DeleteItemSure (callback = () => {}) { // 确认删除单个视频
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        this.RemoveAblumPhotos({ params: { ids: this.CurrentItem.id } }).then(() => {
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
    LinkToPlayer (index) {
      this.CurrentBigImgList = []
      this.AblumPhotos.map((item) => {
        this.CurrentBigImgList.push({ src: item.photoPath, id: item.id })
      })
      this.CurrentBigImgActiveIndex = index
      this.ShowBigImgList = true
    },
    CheckFavoritesIndex () { // 查验收藏夹索引值
      this.PhotoAlbum.map((item, index) => {
        if (item.id - 0 === this.ToolClass.GetUrlParams('gallery') - 0) {
          this.FavoritesIndex = index
        }
      })
    },
    FolderMoveChange (e) { // 转移专辑成功回调
      if (!this.DataLock && this.SelectNum && e !== this.ActiveIndex) {
        this.DataLock = true // 数据锁定
        let Arr = []
        this.AblumPhotos.map((item) => {
          if (item.active) {
            Arr.push(item.id)
          }
        })
        this.MoveAlbumPhotos({
          params: { accountId: this.UserInfo.id, ids: Arr.join(','), photoAlbumId: this.PhotoAlbum[e].id }
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
      this.SelectVideoItem(item, index)
      this.SelectFolderIndex = this.ActiveIndex
      this.ShowMoveFolderPopup = true
    },
    MoveToOtherFolder () { // 转移至其他专辑
      if (this.SelectNum) {
        this.SelectFolderIndex = this.ActiveIndex
        this.ShowMoveFolderPopup = true
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Please select at least one video'
        })
      }
    },
    PlayAll () { // 播放全部
      if (this.AblumPhotos.length) {
        window.open(`./video.html?key=${this.AblumPhotos[0].videoM}&type=3&gallery=${this.ToolClass.GetUrlParams('gallery')}`, '_self')
      }
    },
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetVideoCollect()
      }
    },
    SelectAllVideo () { // 全选视频
      this.SelectAllPhotoAlbumSubList(!this.SelectAllVideoStatus)
    },
    DeleteArrSure (callback = () => { }) { // 确认批量取消收藏视频
      if (!this.DataLock && this.SelectNum) {
        this.DataLock = true // 数据锁定
        let Arr = []
        this.AblumPhotos.map((item) => {
          if (item.active) {
            Arr.push(item.id)
          }
        })
        this.RemoveAblumPhotos({ params: { accountId: this.UserInfo.id, ids: Arr.join(',') } }).then(() => {
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
        this.ToolClass.Confirm('Delete photos', 'Are you sure to delete these photos', () => { }, (close) => {
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
      this.TriggerPhotoAlbumSubListItem(index)
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
        let Params = { ...this.PageData, accountId: this.UserInfo.id, photoAlbumId: this.ToolClass.GetUrlParams('gallery') }
        this.GetAblumPhotos({ params: Params }).then((res) => {
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
