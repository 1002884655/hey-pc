<template>
  <div class="components UserForMyPhotoManagement">
    <ScrollY>
      <div class="SubContainer">

        <!-- 图集列表 -->
        <ul class="PhotoAlbumList" v-show="!ShowPhotoList">
          <li v-for="(item, index) in PhotoAlbum" :key="index">
            <a @click="ToAblumDetail(item)">
              <img :src="item.cover" class="centerLabel cover" alt="">
              <div class="Layer">
                <div>
                  <span>{{item.title}}</span>
                  <span>{{item.photoNum}} pictures</span>
                </div>
              </div>
            </a>
          </li>
        </ul>

        <!-- 图集详情 -->
        <div class="AblumDetail" v-if="ShowPhotoList">
          <div class="flex-h Header">
            <a @click="ReturnAblumList" class="iconfont iconjiantouleft"></a>
            <span class="flex-item">{{CurrentAblumName}}</span>
            <a v-if="!IsBatch" @click="IsBatch = true">Batch editing</a>
            <a v-if="IsBatch" class="iconfont iconyitianjia" :class="{'active': SelectAll}" @click="ToSelectAll"> Select all</a>
            <a v-if="IsBatch" class="iconfont iconshanchu1" @click="DeletePhotos"> Delete</a>
            <a v-if="IsBatch" class="iconfont iconwenjianjia11" @click="MovePhotos"> Move</a>
            <a v-if="IsBatch" @click="IsBatch = false">Back</a>
          </div>
          <ul class="List">
            <li v-for="(item, index) in PagePhotoList" :key="index">
              <a :class="{'IsBatch' : IsBatch}">
                <img :src="item.photoPath" class="centerLabel contain" alt="">
                <div class="ImgLayer" @click="ShowBigImg(item, index)"></div>
                <div class="Layer flex-h">
                  <div class="flex-item">
                    <a @click="SetCover(item)" class="iconfont iconfengmian centerLabel"></a>
                  </div>
                  <div class="flex-item">
                    <a @click="DeleteItem(item)" class="iconfont iconshanchu1 centerLabel"></a>
                  </div>
                  <div class="flex-item">
                    <a @click="MoveItem(item)" class="iconfont iconwenjianjia11 centerLabel"></a>
                  </div>
                </div>
                <div class="BatchLayer" @click="TriggerPhotoItem(item)">
                  <a class="iconfont iconyitianjia" :class="{'active': item.active}"></a>
                </div>
              </a>
            </li>
          </ul>

          <!-- 分页器 -->
          <div class="Pagination" v-if="Total && PagePhotoList.length">
            <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
          </div>
        </div>

        <Popup theme="black" :show="ShowMoveItemPopup" title="Move to" type="confirm" @Close="ShowMoveItemPopup = false" @Sure="MoveItemSure">
          <div class="MoveItemPopupContainer">
            <ScrollY Size="small">
              <nav class="List">
                <a class="flex-h" v-for="(item, index) in PhotoAlbum" :key="index" @click="CurrentMoveAblumId = item.id - 0" :class="{'active': CurrentMoveAblumId - 0 === item.id - 0}">
                  <i class="iconfont iconyitianjia"></i>
                  <span class="flex-item">{{item.title}}</span>
                </a>
              </nav>
            </ScrollY>
          </div>
        </Popup>

        <!-- 查看大图 -->
        <BigImgList v-if="ShowBigImgList" :List="CurrentBigImgList" :ActiveIndex="CurrentBigImgActiveIndex" @Close="ShowBigImgList = false"></BigImgList>

      </div>
    </ScrollY>
  </div>
</template>

<script>
/*
  页面名称：图片管理
  创建人：许成祥
  创建时间：2020/06/09
  最近修改人：许成祥
  最近修改日期：2020/06/09
  备注： 无
*/
import Vue from 'vue'
import ScrollY from '../ScrollY'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import Popup from '../Popup'
import BigImgList from '../BigImgList'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyPhotoManagement',
  props: ['data'],
  data () {
    return {
      CurrentBigImgActiveIndex: null, // 当前大图索引
      CurrentBigImgList: [], // 当前大图队列
      ShowBigImgList: false, // 显隐查看大图
      PagePhotoList: [], // 页面显示图集下图片列表
      ShowMoveItemPopup: false, // 显隐移动弹窗
      ShowDeleteItemPopup: false, // 显隐删除弹窗
      IsBatch: false, // 是否批量处理
      PageData: {
        pageNum: this.ToolClass.GetUrlParams('pages') === false ? 1 : this.ToolClass.GetUrlParams('pages') - 0,
        pageSize: 20
      },
      CurrentMoveAblumId: null, // 当前选中移动图集id
      CurrentPhotoId: null, // 当前操作图片id
      CurrentAblumName: '', // 当前查看图集名称
      ShowPhotoList: this.ToolClass.GetUrlParams('ablum') === false ? false : this.ToolClass.GetUrlParams('ablum') - 0, // 显隐图片列表状态
      Total: 0 // 列表总数
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      PhotoAlbum: x => x.PhotoAlbum, // 图集列表
      AblumPhotos: x => x.AblumPhotos // 图集下图片列表
    }),
    SelectAll () {
      let Bool = true
      this.PagePhotoList.map((item) => {
        if (!item.active) {
          Bool = false
        }
      })
      return Bool
    }
  },
  components: {
    'el-pagination': Pagination,
    ScrollY,
    Popup,
    BigImgList
  },
  created () {
    this.GetPhotoAlbum({
      params: { accountId: this.UserInfo.id }
    }).then(() => {
      if (this.ToolClass.GetUrlParams('ablum') !== false) {
        this.PhotoAlbum.map((item) => {
          if (item.id - 0 === this.ToolClass.GetUrlParams('ablum') - 0) {
            this.CurrentAblumName = item.title
          }
        })
      }
    })
    if (this.ToolClass.GetUrlParams('ablum') !== false) {
      this.CurrentMoveAblumId = this.ToolClass.GetUrlParams('ablum') - 0
      this.ToGetAblumPhotos()
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetPhotoAlbum',
      'GetAblumPhotos',
      'RemoveAblumPhotos',
      'ChangeCoverPhotoAlbum',
      'MoveAlbumPhotos'
    ]),
    ShowBigImg (item, index) { // 查看大图
      this.CurrentBigImgList = []
      this.AblumPhotos.map((item) => {
        this.CurrentBigImgList.push({ src: item.photoPath, id: item.id })
      })
      this.CurrentBigImgActiveIndex = index
      this.ShowBigImgList = true
    },
    MovePhotos () { // 批量移动图片
      let Arr = []
      this.PagePhotoList.map((item) => {
        if (item.active) {
          Arr.push(item.id)
        }
      })
      if (Arr.length) {
        this.CurrentPhotoId = Arr.join(',')
        this.CurrentMoveAblumId = this.ToolClass.GetUrlParams('ablum') - 0
        this.ShowMoveItemPopup = true
      }
    },
    DeletePhotos () { // 批量删除图片
      let Arr = []
      this.PagePhotoList.map((item) => {
        if (item.active) {
          Arr.push(item.id)
        }
      })
      if (Arr.length) {
        this.CurrentPhotoId = Arr.join(',')
        this.ShowDeleteItemPopup = true
      }
    },
    ToSelectAll () { // 全选
      let Bool = !this.SelectAll
      this.PagePhotoList.map((item) => {
        item.active = Bool
      })
    },
    TriggerPhotoItem (item) { // 选中图片
      item.active = !item.active
    },
    ReturnAblumList () { // 返回图集列表
      this.ToolClass.ChangeUrlParams([{ name: 'type', value: this.ToolClass.GetUrlParams('type') }], true)
      this.ShowPhotoList = false
      this.IsBatch = false
      this.GetPhotoAlbum({
        params: { accountId: this.UserInfo.id }
      })
    },
    DeleteItemSure (callback = () => { }) { // 确认删除图片
      if (!this.DataLock) {
        this.DataLock = true
        this.RemoveAblumPhotos({
          params: { ids: this.CurrentPhotoId }
        }).then((res) => {
          this.ShowDeleteItemPopup = false
          this.DataLock = false
          callback()
          this.ToGetAblumPhotos()
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    SetCover (item) { // 设置封面
      if (!this.DataLock) {
        this.DataLock = true
        this.CurrentPhotoId = item.id
        this.ChangeCoverPhotoAlbum({
          params: { photoAlbumId: this.ToolClass.GetUrlParams('ablum') - 0, cover: item.photoPath }
        }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'successfully set!'
          })
          this.DataLock = false
          this.ToGetAblumPhotos()
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    DeleteItem (item) { // 删除图片
      this.CurrentPhotoId = item.id
      this.ToolClass.Confirm('Delete photo', 'Are you sure to delete this photo', () => { }, (close) => {
        this.DeleteItemSure(close)
      })
    },
    MoveItemSure () { // 确认移动图片
      if (!this.DataLock) {
        this.DataLock = true
        this.MoveAlbumPhotos({
          params: { photoAlbumId: this.CurrentMoveAblumId - 0, ids: this.CurrentPhotoId, accountId: this.UserInfo.id }
        }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'move success!'
          })
          this.ShowMoveItemPopup = false
          this.DataLock = false
          this.ToGetAblumPhotos()
        }).catch((res) => {
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    MoveItem (item) { // 移动图片
      this.CurrentPhotoId = item.id
      this.CurrentMoveAblumId = this.ToolClass.GetUrlParams('ablum') - 0
      this.ShowMoveItemPopup = true
    },
    PageChange (e) { // 页码改变
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetAblumPhotos()
      }
    },
    ToGetAblumPhotos () { // 获取图集下图片
      if (!this.DataLock) {
        this.DataLock = true
        this.GetAblumPhotos({
          params: { ...this.PageData, accountId: this.UserInfo.id, photoAlbumId: this.ToolClass.GetUrlParams('ablum') - 0 }
        }).then((res) => {
          this.PagePhotoList = []
          this.AblumPhotos.map((item) => {
            this.PagePhotoList.push({ ...item, active: false })
          })
          this.ShowPhotoList = true
          this.PageData.pageNum = res.data.data.pageNum
          this.Total = res.data.data.total
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    ToAblumDetail (item) { // 查看图集详情
      this.CurrentAblumName = item.title
      this.CurrentMoveAblumId = item.id
      this.ToolClass.ChangeUrlParams([{ name: 'ablum', value: item.id }, { name: 'pages', value: 1 }])
      this.ToGetAblumPhotos()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
