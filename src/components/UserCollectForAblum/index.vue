<template>
  <div class="components UserCollectForAblum">

    <!-- 收藏夹列表 -->
    <ul class="FavoritesList">
      <li v-for="(item, index) in CollectAlbumList" :style="{zIndex: CollectAlbumList.length - index}" :class="{'active': ActiveIndex === index}" :key="index" class="flex-h">
        <i class="iconfont iconwenjianjia1" @click="CutList(item, index)"></i>
        <i class="iconfont iconwenjianjia11" @click="CutList(item, index)"></i>
        <span class="flex-item" @click="CutList(item, index)">{{item.name}}</span>
        <i class="iconfont iconsandian1"></i>
        <div class="Tips">
          <a @click="DeleteFolder(item, index)">Delete</a>
        </div>
        <span class="Num">{{item.videoNum}}</span>
      </li>
    </ul>

    <span class="NoData" v-if="NoData">You don't have a album collection</span>

  </div>
</template>

<script>
/*
  页面名称：我的专辑收藏夹列表
  创建人：许成祥
  创建时间：2020/06/10
  最近修改人：许成祥
  最近修改日期：2020/06/10
  备注： 无
*/
import Vue from 'vue'
import Popup from '../Popup'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserCollectForAblum',
  props: ['data'],
  data () {
    return {
      NoData: false, // 无数据状态
      ShowDeleteFolderPopup: false, // 显隐删除专辑弹窗
      CurrentFolderName: '', // 当前操作收藏夹名称
      CurrentFolderId: null, // 当前操作收藏夹id
      CurrentFolderIndex: null, // 当前操作收藏夹索引值
      ShowEditFolderPopup: false, // 显隐编辑收藏夹弹窗
      EditFolderPopupType: null, // 编辑、新建专辑弹窗类型
      DataLock: false, // 数据锁
      ActiveIndex: null // 选中索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      CollectAlbumList: x => x.CollectAlbumList // 用户所有收藏片单列表
    })
  },
  components: {
    'el-pagination': Pagination,
    Popup
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
      'GetAlbumPage',
      'RemoveCollectVideoAlbum'
    ]),
    ...mapUserMutations([
      ''
    ]),
    Init () {
      this.GetAlbumPage({ // 获取用户收藏夹
        params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 256 }
      }).then(() => {
        if (this.CollectAlbumList.length) {
          if (this.ToolClass.GetUrlParams('album') !== false) {
            let Bool = true
            this.CollectAlbumList.map((item, index) => {
              if (item.id - 0 === this.ToolClass.GetUrlParams('album') - 0) {
                this.ActiveIndex = index
                this.$emit('Change')
                Bool = false
              }
            })
            if (Bool) {
              if (this.CurrentFolderIndex !== null) {
                this.ActiveIndex = this.CurrentFolderIndex < this.CollectAlbumList.length ? this.CurrentFolderIndex : this.CurrentFolderIndex - 1
                this.ToolClass.ChangeUrlParams([{ name: 'album', value: this.CollectAlbumList[this.ActiveIndex].id }, { name: 'pages', value: 1 }])
                this.$emit('Change')
              }
            }
          } else {
            this.ActiveIndex = 0
            this.ToolClass.ChangeUrlParams([{ name: 'album', value: this.CollectAlbumList[0].id }, { name: 'pages', value: 1 }])
            this.$emit('Change')
          }
        } else {
          this.NoData = true
        }
      })
    },
    CutList (item, index) { // 切换收藏夹
      if (!this.DataLock && this.ActiveIndex !== index) {
        this.ActiveIndex = index
        this.ToolClass.ChangeUrlParams([
          { name: 'album', value: item === null ? null : item.id },
          { name: 'pages', value: 1 }
        ])
        this.$emit('Change', item)
      }
    },
    DeleteFolder (item, index) { // 删除收藏夹
      this.CurrentFolderName = item.name
      this.CurrentFolderId = item.id
      this.CurrentFolderIndex = index
      this.ToolClass.Confirm('Delete album', `Are you sure to delete this album called '${this.CurrentFolderName}'?`, () => { }, (close) => {
        this.DeleteFolderPopupSure(close)
      })
    },
    DeleteFolderPopupSure (callback = () => {}) { // 删除专辑确认逻辑
      if (!this.DataLock) {
        this.DataLock = true
        this.RemoveCollectVideoAlbum({
          params: { albumId: this.CurrentFolderId, accountId: this.UserInfo.id }
        }).then(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteFolderPopup = false
          callback()
          this.Init()
        }).catch(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteFolderPopup = false
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
