<template>
  <div class="components UserForMyAlbumNavSubList flex-v">

    <!-- 封面 -->
    <div class="Front flex-h">
      <div class="Img">
        <a>
          <img v-if="FavoritesIndex !== null" :src="VideoAlbumList[FavoritesIndex].cover" class="centerLabel contain" alt="">
        </a>
      </div>
      <div class="flex-item flex-v">
        <span>{{FavoritesIndex !== null ? VideoAlbumList[FavoritesIndex].name : ''}}</span>
        <span class="flex-item">{{FavoritesIndex !== null ? VideoAlbumList[FavoritesIndex].description : ''}}</span>
        <div>
          <a @click="PlayAll" :style="{backgroundColor: VideoAlbumSubList.length ? '#e2041b' : '#ccc'}">Play all</a>
        </div>
      </div>
    </div>

    <!-- 顶部批量操作栏 -->
    <div class="flex-h Top" v-if="VideoAlbumSubList.length">
      <a class="iconfont iconpaixu Sort">
        <span>Sort</span>
        <ul class="SortList">
          <li @click="CutSort(1)" :class="{'active': PageData.orderBy === 1}">Add date (from early to late)</li>
          <li @click="CutSort(2)" :class="{'active': PageData.orderBy === 2}">Add date (from late to early)</li>
          <li @click="CutSort(3)" :class="{'active': PageData.orderBy === 3}">Views (from high to low)</li>
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
            <span>Move</span>
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
            <li v-for="(item, index) in VideoAlbumSubList" :key="index" :style="{zIndex: VideoAlbumSubList.length - index}" :class="{'ProcessingBatch': ProcessingBatchStatus, 'active': item.active}">
              <a class="Img">
                <img :src="item.frontPath" class="centerLabel cover" alt="" @click="LinkToPlayer(item)">
                <div class="SelectLayer" @click="SelectVideoItem(item, index)">
                  <a class="iconfont" :class="[item.active ? 'iconyitianjia' : 'iconyuan']"></a>
                </div>
                <span v-if="item.capacity">{{JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}} {{ToolClass.DateFormat(item.length)}}</span>
              </a>
              <div class="Content">
                <a class="Title" @click="LinkToPlayer(item)">{{item.title}}</a>
                <div class="flex-h">
                  <a class="flex-item" :href="`./userspace.html?key=${item.upId}`" target="_self">{{item.upName}}</a>
                </div>
                <div class="flex-h">
                  <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
                  <span>· {{item.upTime | changeTime}}</span>
                  <a class="More iconfont iconsandian1"></a>
                  <div class="Tips">
                    <a @click="AddToWatchLater(item)">
                      <i class="iconfont iconshaohouguankan"></i>
                      <span>Watch Later</span>
                    </a>
                    <a @click="CancelCollectItem(item, index)">
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

          <!-- 转移专辑弹窗 -->
          <UserForMyAlbumVideosMove v-if="ShowMoveFolderPopup" Title="Move to other album" @FolderAdd="FolderAdd" @Change="FolderMoveChange" @Close="ShowMoveFolderPopup = false" :DefaultIndex="ActiveIndex"></UserForMyAlbumVideosMove>

          <MoveToOtherAlbum ref="MoveToOtherAlbum" :Pid="ToolClass.GetUrlParams('album')" :Ids="CurrentId" v-if="ShowMoveToOtherAlbum && UserInfo !== null" @Close="ShowMoveToOtherAlbum = false" @Change="ListChange"></MoveToOtherAlbum>

        </ScrollY>
      </div>
    </div>

  </div>
</template>

<script>
/*
  页面名称：我的视频专辑下列表
  创建人：许成祥
  创建时间：2020/05/26
  最近修改人：许成祥
  最近修改日期：2020/05/26
  备注： 无
*/
import Vue from 'vue'
import ScrollY from '../ScrollY'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import UserForMyAlbumVideosMove from '../UserForMyAlbumVideosMove'
import MoveToOtherAlbum from '../MoveToOtherAlbum'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyAlbumNavSubList',
  props: ['data'],
  data () {
    return {
      CurrentId: [],
      ShowMoveToOtherAlbum: false,
      ShowMoveFolderPopup: false, // 显隐转移至专辑弹窗
      ProcessingBatchStatus: false, // 批处理状态
      ParentParams: null, // 专辑参数
      PageData: {
        orderBy: 1,
        pageNum: this.ToolClass.GetUrlParams('pages') !== false ? this.ToolClass.GetUrlParams('pages') - 0 : 1,
        pageSize: 20
      },
      ListIsNone: false, // 列表请求后为空
      TotalItem: 0, // 列表总数
      DataLock: false, // 数据锁
      FavoritesIndex: null, // 专辑选中索引值
      ActiveIndex: null // 选中索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoAlbumList: x => x.VideoAlbumList, // 用户所有视频专辑列表
      VideoAlbumSubList: x => x.VideoAlbumSubList // 专辑下视频列表
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
    UserForMyAlbumVideosMove,
    MoveToOtherAlbum
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetPageVideosByAlbum',
      'RemoveAlbumSubVideos',
      'CancelVideoCollect',
      'MoveAlbumVideos',
      'AddWatchLater'
    ]),
    ...mapUserMutations([
      'TriggerVideoAlbumSubListItem',
      'SelectAllVideoAlbumSubList'
    ]),
    ListChange (e) {
      if (e.Type === 'Move') {
        this.ToGetPageVideosByAlbum()
      }
    },
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
    FolderAdd () {
      this.CheckFavoritesIndex()
      this.$emit('Change')
    },
    CutSort (num) { // 切换排序
      this.PageData.orderBy = num
      this.ToGetPageVideosByAlbum()
    },
    Init () {
      this.CheckFavoritesIndex()
      this.ToGetPageVideosByAlbum()
    },
    LinkToPlayer (item) {
      window.open(`./video.html?key=${item.videoM}&type=5&album=${this.ToolClass.GetUrlParams('album')}`, '_self')
    },
    CheckFavoritesIndex () { // 查验专辑索引值
      this.VideoAlbumList.map((item, index) => {
        if (item.id - 0 === this.ToolClass.GetUrlParams('album') - 0) {
          this.FavoritesIndex = index
        }
      })
    },
    FolderMoveChange (e) { // 转移专辑成功回调
      if (!this.DataLock && this.SelectNum && e !== this.ActiveIndex) {
        this.DataLock = true // 数据锁定
        let Arr = []
        this.VideoAlbumSubList.map((item) => {
          if (item.active) {
            Arr.push(item.videoId)
          }
        })
        this.MoveAlbumVideos({
          params: { accountId: this.UserInfo.id, ids: Arr.join(','), albumId: this.VideoAlbumList[e].id, sourceAlbumId: this.ToolClass.GetUrlParams('album') - 0 }
        }).then((res) => {
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
          this.ProcessingBatchStatus = false
          this.$notify.success({
            title: 'success',
            message: 'Move of success!'
          })
          this.ToGetPageVideosByAlbum()
        }).catch((res) => {
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
        })
      } else {
        this.ShowMoveFolderPopup = false
      }
    },
    MoveItemToOtherFolder (item, index) { // 转移单个视频至其他专辑
      // this.SelectVideoItem(item, index)
      // this.SelectFolderIndex = this.ActiveIndex
      // this.ShowMoveFolderPopup = true
      this.CurrentId = [item.videoId]
      this.ShowMoveToOtherAlbum = true
    },
    MoveToOtherFolder () { // 转移至其他专辑
      if (this.SelectNum) {
        // this.SelectFolderIndex = this.ActiveIndex
        // this.ShowMoveFolderPopup = true
        let Arr = []
        this.VideoAlbumSubList.map((item) => {
          if (item.active) {
            Arr.push(item.videoId)
          }
        })
        this.CurrentId = Arr
        this.ShowMoveToOtherAlbum = true
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Please select at least one video'
        })
      }
    },
    PlayAll () { // 播放全部
      if (this.VideoAlbumSubList.length) {
        window.open(`./video.html?key=${this.VideoAlbumSubList[0].videoM}&type=5&album=${this.ToolClass.GetUrlParams('album')}`, '_self')
      }
    },
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetPageVideosByAlbum()
      }
    },
    SelectAllVideo () { // 全选视频
      this.SelectAllVideoAlbumSubList(!this.SelectAllVideoStatus)
    },
    CancelCollectItem (item) { // 取消专辑下单个视频
      this.ToolClass.Confirm('Delete video', 'Are you sure to delete this video', () => { }, (close) => {
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定
          this.RemoveAlbumSubVideos({ params: { accountId: this.UserInfo.id, ids: item.videoId, albumId: this.ToolClass.GetUrlParams('album') - 0 } }).then(() => {
            this.DataLock = false // 数据解锁
            close()
            this.ToGetPageVideosByAlbum()
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        }
      })
    },
    CancelCollect () { // 取消专辑下视频
      if (!this.DataLock) {
        if (this.SelectNum) {
          this.ToolClass.Confirm('Delete videos', 'Are you sure to delete these videos', () => { }, (close) => {
            this.DataLock = true // 数据锁定
            let Arr = []
            this.VideoAlbumSubList.map((item) => {
              if (item.active) {
                Arr.push(item.videoId)
              }
            })
            this.RemoveAlbumSubVideos({ params: { accountId: this.UserInfo.id, ids: Arr.join(','), albumId: this.ToolClass.GetUrlParams('album') - 0 } }).then(() => {
              this.DataLock = false // 数据解锁
              close()
              this.ProcessingBatchStatus = false
              this.ToGetPageVideosByAlbum()
            }).catch(() => {
              this.DataLock = false // 数据解锁
            })
          })
        } else {
          this.$notify.error({
            title: 'error',
            message: 'Please select at least one video'
          })
        }
      }
    },
    SelectVideoItem (item, index) { // 选择专辑下的视频
      this.TriggerVideoAlbumSubListItem(index)
    },
    Change (params) { // 切换专辑时触发列表改变
      this.CheckFavoritesIndex()
      this.ParentParams = params
      this.ProcessingBatchStatus = false
      this.PageData.pageNum = 1
      this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
      this.ToGetPageVideosByAlbum()
    },
    ToGetPageVideosByAlbum () { // 获取专辑下视频列表
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        this.ListIsNone = false
        this.GetPageVideosByAlbum({ params: { ...this.PageData, accountId: this.UserInfo.id, albumId: this.ToolClass.GetUrlParams('album') - 0, pageNum: this.PageData.pageNum || 1 } }).then((res) => {
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
