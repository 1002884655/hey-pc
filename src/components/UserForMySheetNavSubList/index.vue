<template>
  <div class="components UserForMySheetNavSubList flex-v">

    <!-- 封面 -->
    <div class="Front flex-h">
      <div class="Img">
        <a>
          <img v-if="FavoritesIndex !== null" :src="MyPieceGroupList[FavoritesIndex].cover" class="centerLabel contain" alt="">
        </a>
      </div>
      <div class="flex-item flex-v">
        <span>{{FavoritesIndex !== null ? MyPieceGroupList[FavoritesIndex].name : ''}}</span>
        <span class="flex-item">{{FavoritesIndex !== null ? MyPieceGroupList[FavoritesIndex].description : ''}}</span>
        <div>
          <a @click="PlayAll" :style="{backgroundColor: MyPieceGroupSubList.length ? '#e2041b' : '#ccc'}">Play all</a>
        </div>
      </div>
    </div>

    <!-- 顶部批量操作栏 -->
    <div class="flex-h Top" v-if="MyPieceGroupSubList.length">
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
            <span>Copy</span>
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
            <li v-for="(item, index) in MyPieceGroupSubList" :key="index" :class="{'ProcessingBatch': ProcessingBatchStatus, 'active': item.active}">
              <a class="Img">
                <img :src="item.front" class="centerLabel cover" alt="" @click="LinkToPlayer(item)">
                <!-- <div class="Layer">
                  <a class="iconfont iconshoucang- Collect active" @click="CancelCollectItem(item)"></a>
                </div> -->
                <div class="SelectLayer" @click="SelectVideoItem(item, index)">
                  <a class="iconfont" :class="[item.active ? 'iconyitianjia' : 'iconyuan']"></a>
                </div>
                <span>{{JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}} {{ToolClass.DateFormat(item.length)}}</span>
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

          <!-- 转移片单弹窗 -->
          <UserForMySheetVideosCopy v-if="ShowMoveFolderPopup" Title="Copy to other sheet" @FolderAdd="FolderAdd" @Change="FolderMoveChange" @Close="ShowMoveFolderPopup = false" :DefaultIndex="ActiveIndex"></UserForMySheetVideosCopy>

          <SaveToPlaylist ref="SaveToPlaylist" :Pid="ToolClass.GetUrlParams('sheet')" Title="Move to playlist" :Ids="CurrentId" v-if="ShowSaveToPlaylist && UserInfo !== null" @Close="ShowSaveToPlaylist = false" @Change="ListChange"></SaveToPlaylist>

        </ScrollY>
      </div>
    </div>

  </div>
</template>

<script>
/*
  页面名称：我的视频片单下列表
  创建人：许成祥
  创建时间：2020/05/25
  最近修改人：许成祥
  最近修改日期：2020/05/25
  备注： 无
*/
import Vue from 'vue'
import ScrollY from '../ScrollY'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import UserForMySheetVideosCopy from '../UserForMySheetVideosCopy'
import SaveToPlaylist from '../SaveToPlaylist'
import Popup from '../Popup'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMySheetNavSubList',
  props: ['data'],
  data () {
    return {
      ShowSaveToPlaylist: false,
      CurrentId: null,
      CurrentItem: null, // 当前操作item
      ShowDeleteItemPopup: false, // 显隐删除单个视频弹窗
      ShowMoveFolderPopup: false, // 显隐转移至片单弹窗
      ProcessingBatchStatus: false, // 批处理状态
      ParentParams: null, // 片单参数
      PageData: {
        sort: 1,
        pageNum: this.ToolClass.GetUrlParams('pages') !== false ? this.ToolClass.GetUrlParams('pages') - 0 : 1,
        pageSize: 20
      },
      ListIsNone: false, // 列表请求后为空
      TotalItem: 0, // 列表总数
      DataLock: false, // 数据锁
      FavoritesIndex: null, // 片单选中索引值
      ActiveIndex: null // 选中索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      MyPieceGroupList: x => x.MyPieceGroupList, // 用户所有视频片单列表
      MyPieceGroupSubList: x => x.MyPieceGroupSubList // 片单下视频列表
    }),
    SelectAllVideoStatus () { // 全选状态
      let Bool = true
      this.MyPieceGroupSubList.map((item) => {
        if (!item.active) {
          Bool = false
          return false
        }
      })
      return Bool
    },
    SelectNum () { // 选择数量
      let Num = 0
      this.MyPieceGroupSubList.map((item) => {
        Num = item.active ? Num + 1 : Num
      })
      return Num
    }
  },
  components: {
    'el-pagination': Pagination,
    ScrollY,
    UserForMySheetVideosCopy,
    Popup,
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
      'GetPieceGroupSubList',
      'DeletePieceGroupSubItem',
      'CancelVideoCollect',
      'AddPieceGroupSubItem',
      'AddWatchLater'
    ]),
    ...mapUserMutations([
      'TriggerPieceGroupSubListItem',
      'SelectAllPieceGroupSubList'
    ]),
    ListChange (e) {
      if (e.Type === 'Move') {
        this.ToGetPieceGroupSubList()
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
    DeleteItemSure (callback = () => { }) { // 确认删除单个视频
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        this.DeletePieceGroupSubItem({ params: { accountId: this.UserInfo.id, videoIds: this.CurrentItem.videoId, groupId: this.ToolClass.GetUrlParams('sheet') - 0 } }).then(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteItemPopup = false
          callback()
          this.ToGetPieceGroupSubList()
          this.$emit('ListChange')
        }).catch(() => {
          this.DataLock = false // 数据解锁
        })
      }
    },
    FolderAdd () {
      this.CheckFavoritesIndex()
      this.$emit('Change')
    },
    CutSort (num) { // 切换排序
      this.PageData.sort = num
      this.ToGetPieceGroupSubList()
    },
    Init () {
      this.CheckFavoritesIndex()
      this.ToGetPieceGroupSubList()
    },
    LinkToPlayer (item) {
      window.open(`./video.html?key=${item.videoM}&type=4&sheet=${this.MyPieceGroupList[this.FavoritesIndex].id}`, '_self')
    },
    CheckFavoritesIndex () { // 查验片单索引值
      this.MyPieceGroupList.map((item, index) => {
        if (item.id - 0 === this.ToolClass.GetUrlParams('sheet') - 0) {
          this.FavoritesIndex = index
        }
      })
    },
    FolderMoveChange (e) { // 转移片单成功回调
      if (!this.DataLock && this.SelectNum && e !== this.ActiveIndex) {
        this.DataLock = true // 数据锁定
        let Arr = []
        this.MyPieceGroupSubList.map((item) => {
          if (item.active) {
            Arr.push(item.videoId)
          }
        })
        this.AddPieceGroupSubItem({
          params: { accountId: this.UserInfo.id, videoIds: Arr.join(','), groupIds: this.MyPieceGroupList[e].id }
        }).then((res) => {
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
          this.ProcessingBatchStatus = false
          this.$notify.success({
            title: 'success',
            message: 'Copy of success!'
          })
          this.ToGetPieceGroupSubList()
          this.$emit('ListChange')
        }).catch((res) => {
          this.DataLock = false // 数据解锁
          this.ShowMoveFolderPopup = false
        })
      } else {
        this.ShowMoveFolderPopup = false
      }
    },
    MoveItemToOtherFolder (item, index) { // 转移单个视频至其他片单
      // this.SelectVideoItem(item, index)
      // this.SelectFolderIndex = this.ActiveIndex
      // this.ShowMoveFolderPopup = true
      this.CurrentId = [item.videoId]
      this.ShowSaveToPlaylist = true
    },
    MoveToOtherFolder () { // 转移至其他片单
      if (this.SelectNum) {
        // this.SelectFolderIndex = this.ActiveIndex
        // this.ShowMoveFolderPopup = true
        let Arr = []
        this.MyPieceGroupSubList.map((item) => {
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
    },
    PlayAll () { // 播放全部
      if (this.MyPieceGroupSubList.length) {
        window.open(`./video.html?key=${this.MyPieceGroupSubList[0].videoM}&type=4&sheet=${this.ToolClass.GetUrlParams('sheet')}`, '_self')
      }
    },
    PageChange (e) { // 改变页码
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetPieceGroupSubList()
      }
    },
    SelectAllVideo () { // 全选视频
      this.SelectAllPieceGroupSubList(!this.SelectAllVideoStatus)
    },
    CancelCollectItem (item) { // 取消片单下单个视频
      this.CurrentItem = item
      this.ToolClass.Confirm('Delete video', 'Are you sure to delete this video', () => { }, (close) => {
        this.DeleteItemSure(close)
      })
    },
    CancelCollect () { // 取消片单下视频
      if (!this.DataLock) {
        if (this.SelectNum) {
          this.ToolClass.Confirm('Delete videos', 'Are you sure to delete these videos', () => { }, (close) => {
            this.DataLock = true // 数据锁定
            let Arr = []
            this.MyPieceGroupSubList.map((item) => {
              if (item.active) {
                Arr.push(item.videoId)
              }
            })
            this.DeletePieceGroupSubItem({ params: { accountId: this.UserInfo.id, videoIds: Arr.join(','), groupId: this.ToolClass.GetUrlParams('sheet') - 0 } }).then(() => {
              this.DataLock = false // 数据解锁
              close()
              this.ToGetPieceGroupSubList()
              this.$emit('ListChange')
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
    SelectVideoItem (item, index) { // 选择片单下的视频
      this.TriggerPieceGroupSubListItem(index)
    },
    Change (params) { // 切换片单时触发列表改变
      this.CheckFavoritesIndex()
      this.ParentParams = params
      this.ProcessingBatchStatus = false
      this.PageData.pageNum = 1
      this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
      this.ToGetPieceGroupSubList()
    },
    ToGetPieceGroupSubList () { // 获取片单下视频列表
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        this.ListIsNone = false
        this.GetPieceGroupSubList({ params: { ...this.PageData, accountId: this.UserInfo.id, groupId: this.ToolClass.GetUrlParams('sheet') - 0, pageNum: this.PageData.pageNum || 1 } }).then((res) => {
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
