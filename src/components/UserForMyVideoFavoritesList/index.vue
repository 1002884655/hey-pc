<template>
  <div class="components UserForMyVideoFavoritesList">

    <!-- 新增分类按钮 -->
    <a class="AddClass" v-if="VideoCollectCategoryList.length < 11" @click="AddNewFolder">
      <i class="iconfont iconjia"></i>
      <span style="margin-left: 10px;">New favorite list</span>
    </a>

    <!-- 收藏夹列表 -->
    <ul class="FavoritesList">
      <li v-for="(item, index) in VideoCollectCategoryList" :style="{zIndex: VideoCollectCategoryList.length - index}" :class="{'active': ActiveIndex === index}" :key="index" class="flex-h">
        <i class="iconfont iconwenjianjia1" @click="CutList(item, index)"></i>
        <i class="iconfont iconwenjianjia11" @click="CutList(item, index)"></i>
        <span class="flex-item" @click="CutList(item, index)">{{item.name}}</span>
        <i class="iconfont iconsandian1" v-if="index !== 0"></i>
        <div class="Tips" v-if="index !== 0">
          <a @click="EditFolder(item, index)">Edit</a>
          <a @click="DeleteFolder(item, index)">Delete</a>
        </div>
        <span class="Num">{{item.videoNum}}</span>
      </li>
    </ul>

    <!-- 编辑\新建专辑弹窗 -->
    <Popup :show="ShowEditFolderPopup" type="confirm" title="Favorites title(Limit 80 characters)" @Close="ShowEditFolderPopup = false" @Sure="EditFolderPopupSure">
      <div class="EditFolderPopupContent">
        <div class="Form flex-h">
          <input type="text" placeholder="Enter up to 80 characters" class="flex-item" v-model="CurrentFolderName" @input="CurrentFolderName = CurrentFolderName.substring(0, 32)">
          <span>{{CurrentFolderName.length}}/80</span>
        </div>
        <!-- <div class="Bottom flex-h">
          <a class="flex-item" @click="ShowEditFolderPopup = false">cancel</a>
          <a class="flex-item" @click="EditFolderPopupSure">save</a>
        </div> -->
      </div>
    </Popup>

  </div>
</template>

<script>
/*
  页面名称：我的视频收藏夹列表
  创建人：许成祥
  创建时间：2020/05/21
  最近修改人：许成祥
  最近修改日期：2020/05/21
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
  name: 'UserForMyVideoFavoritesList',
  props: ['data'],
  data () {
    return {
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
      VideoCollectCategoryList: x => x.VideoCollectCategoryList // 用户所有视频收藏夹列表
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
      'GetVideoCollectCategory',
      'AddVideoCollectCategory',
      'DeleteVideoCollectCategory',
      'EditVideoCollectCategory'
    ]),
    ...mapUserMutations([
      ''
    ]),
    Init () {
      this.GetVideoCollectCategory({ // 获取用户收藏夹
        params: { accountId: this.UserInfo.id }
      }).then(() => {
        let Folder = this.ToolClass.GetUrlParams('favorites')
        if (this.VideoCollectCategoryList.length) { // 收藏夹不为空时，匹配索引值
          if (Folder !== false) {
            this.VideoCollectCategoryList.map((item, index) => {
              if (item.id - 0 === Folder - 0) {
                this.ActiveIndex = index
              }
            })
            this.ActiveIndex = this.ActiveIndex || 0
            this.ToolClass.ChangeUrlParams([
              { name: 'favorites', value: this.VideoCollectCategoryList[this.ActiveIndex].id }
            ])
          } else {
            this.ToolClass.ChangeUrlParams([
              { name: 'favorites', value: this.VideoCollectCategoryList[0].id }
            ])
          }
        }
        if (!this.VideoCollectCategoryList.length || Folder === false) {
          this.ActiveIndex = 0
        }
        this.$emit('AxiosEnd')
      }).catch(() => {
        this.ActiveIndex = 0
      })
    },
    EditFolder (item, index) { // 编辑收藏夹名称
      this.CurrentFolderName = item.name
      this.CurrentFolderId = item.id
      this.EditFolderPopupType = 'edit'
      this.CurrentFolderIndex = index
      this.ShowEditFolderPopup = true
    },
    CutList (item, index) { // 切换收藏夹
      if (!this.DataLock && this.ActiveIndex !== index) {
        this.ActiveIndex = index
        this.ToolClass.ChangeUrlParams([
          { name: 'favorites', value: item === null ? null : item.id },
          { name: 'pages', value: 1 }
        ])
        this.$emit('Change', item)
      }
    },
    DeleteFolder (item, index) { // 删除收藏夹
      this.CurrentFolderName = item.name
      this.CurrentFolderId = item.id
      this.CurrentFolderIndex = index
      this.ToolClass.Confirm('Delete video', `Are you sure to delete this video called '${this.CurrentFolderName}'?`, () => { }, (close) => {
        this.DeleteFolderPopupSure(close)
      })
    },
    DeleteFolderPopupSure (callback = () => {}) { // 删除专辑确认逻辑
      if (!this.DataLock) {
        this.DataLock = true
        this.DeleteVideoCollectCategory({
          params: { params: { id: this.CurrentFolderId, accountId: this.UserInfo.id } },
          index: this.CurrentFolderIndex
        }).then(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteFolderPopup = false
          callback()
          if (this.CurrentFolderIndex === this.ActiveIndex) { // 删除选中专辑
            this.CutList(null, 0)
          } else if (this.CurrentFolderIndex < this.ActiveIndex) { // 删除选中专辑之前的专辑
            this.ActiveIndex -= 1
          }
        }).catch(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteFolderPopup = false
        })
      }
    },
    EditFolderPopupSure () { // 编辑收藏夹确认操作
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        if (this.EditFolderPopupType === 'add') { // 新建专辑
          if (this.CurrentFolderName !== '') { // 专辑名称判空
            this.AddVideoCollectCategory({ params: { name: this.CurrentFolderName, accountId: this.UserInfo.id } }).then(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
            }).catch((res) => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
            })
          }
        } else if (this.EditFolderPopupType === 'edit') { // 编辑专辑
          if (this.CurrentFolderName !== '') { // 专辑名称判空
            this.EditVideoCollectCategory({ params: { params: { id: this.CurrentFolderId, name: this.CurrentFolderName, accountId: this.UserInfo.id } }, index: this.CurrentFolderIndex }).then(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
            }).catch((res) => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
            })
          }
        }
      }
    },
    AddNewFolder () { // 新建收藏夹
      this.CurrentFolderName = ''
      this.CurrentFolderId = null
      this.EditFolderPopupType = 'add'
      this.ShowEditFolderPopup = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
