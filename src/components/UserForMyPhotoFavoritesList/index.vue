<template>
  <div class="components UserForMyPhotoFavoritesList">

    <!-- 新增分类按钮 -->
    <a class="AddClass" v-if="PhotoAlbum.length < 21" @click="AddNewFolder">
      <i class="iconfont iconjia"></i>
      <span>New folder</span>
    </a>

    <!-- 收藏夹列表 -->
    <ul class="FavoritesList">
      <li v-for="(item, index) in PhotoAlbum" :style="{zIndex: PhotoAlbum.length - index}" :class="{'active': ActiveIndex === index}" :key="index" class="flex-h">
        <i class="iconfont iconwenjianjia1" @click="CutList(item, index)"></i>
        <i class="iconfont iconwenjianjia11" @click="CutList(item, index)"></i>
        <span class="flex-item" @click="CutList(item, index)">{{item.title}}</span>
        <i class="iconfont iconsandian1"></i>
        <div class="Tips">
          <a @click="EditFolder(item, index)">Edit</a>
          <a @click="DeleteFolder(item, index)">Delete</a>
        </div>
        <span class="Num">{{item.photoNum}}</span>
      </li>
    </ul>

    <!-- 编辑\新建专辑弹窗 -->
    <Popup theme="black" :show="ShowEditFolderPopup" type="confirm" :title="EditFolderPopupType === 'edit' ? 'Gallery Information' : 'New gallery'" @Close="ShowEditFolderPopup = false" @Sure="EditFolderPopupSure">
      <div class="EditFolderPopupContent">

        <span>Title</span>
        <div>
          <el-input type="text" v-model="CurrentGalleryInfo.Name" maxlength="32" show-word-limit></el-input>
        </div>

        <span>Category</span>
        <div v-if="PhotoTypes.length">
          <el-select v-model="CurrentGalleryInfo.Category" placeholder="select">
            <el-option v-for="item in PhotoTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>

        <span>Label</span>
        <div>
          <el-select class="LabelSelect" v-model="Labels" multiple filterable allow-create default-first-option placeholder="Press enter to generate the label" no-data-text="Each label has a maximum of 30 characters"></el-select>
        </div>

        <span>Privacy</span>
        <div>
          <el-select v-model="CurrentGalleryInfo.Privacy" placeholder="select">
            <el-option v-for="item in PrivacyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

      </div>
    </Popup>

    <!-- 删除专辑弹窗 -->
    <Popup theme="black" :show="ShowDeleteFolderPopup" type="confirm" title="Confirm" @Close="ShowDeleteFolderPopup = false" @Sure="DeleteFolderPopupSure">
      <div class="DeleteFolderPopupContent">
        <span>Are you sure to delete this album called '<b>{{CurrentGalleryInfo.Name}}</b>'?</span>
      </div>
    </Popup>

  </div>
</template>

<script>
/*
  页面名称：我的图集列表
  创建人：许成祥
  创建时间：2020/05/21
  最近修改人：许成祥
  最近修改日期：2020/05/21
  备注： 无
*/
import Vue from 'vue'
import Popup from '../Popup'
import { Pagination, Notification, Input, Select, Option } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyPhotoFavoritesList',
  props: ['data'],
  data () {
    return {
      CurrentGalleryInfo: { // 当前操作图集信息
        Name: '',
        Category: '',
        Label: null,
        Privacy: ''
      },
      PrivacyList: [ // 隐私设置列表
        { label: 'Public Visible to everyone', value: '1' },
        { label: 'Private Only visible to yourself', value: '2' },
        { label: 'Visible only to subscriptions and fans', value: '3' },
        { label: 'Only visible to fans', value: '4' }
      ],
      ShowDeleteFolderPopup: false, // 显隐删除专辑弹窗
      CurrentFolderName: null, // 当前操作收藏夹名称
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
      PhotoAlbum: x => x.PhotoAlbum, // 用户所有图集列表
      PhotoTypes: x => x.PhotoTypes // 图片分类
    }),
    Labels: { // 兴趣转换
      get: function () {
        return this.CurrentGalleryInfo.Label !== null ? this.CurrentGalleryInfo.Label.split(',') || [] : []
      },
      set: function (val) {
        val = val.slice(0, 10)
        val.map((item, index) => {
          val[index] = item.replace(/(^\s*)|(\s*$)/g, '').substring(0, 30)
        })
        this.CurrentGalleryInfo.Label = val.join(',') === '' ? null : val.join(',')
      }
    }
  },
  components: {
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
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
      'GetPhotoAlbum',
      'GetPhotoServiceType',
      'CreatePhotoAlbum',
      'RemovePhotoAlbum',
      'EditPhotoAlbum'
    ]),
    ...mapUserMutations([
      ''
    ]),
    Init () {
      this.GetPhotoServiceType()
      this.GetPhotoAlbum({ // 获取用户收藏夹
        params: { accountId: this.UserInfo.id }
      }).then(() => {
        let Folder = this.ToolClass.GetUrlParams('gallery')
        if (this.PhotoAlbum.length) { // 收藏夹不为空时，匹配索引值
          if (Folder !== false) {
            this.PhotoAlbum.map((item, index) => {
              if (item.id - 0 === Folder - 0) {
                this.ActiveIndex = index
              }
            })
            this.ActiveIndex = this.ActiveIndex || 0
            this.ToolClass.ChangeUrlParams([
              { name: 'gallery', value: this.PhotoAlbum[this.ActiveIndex].id }
            ])
          } else {
            this.ToolClass.ChangeUrlParams([
              { name: 'gallery', value: this.PhotoAlbum[0].id }
            ])
          }
        }
        if (!this.PhotoAlbum.length || Folder === false) {
          this.ActiveIndex = 0
        }
        this.$emit('AxiosEnd')
      }).catch(() => {
        this.ActiveIndex = 0
      })
    },
    EditFolder (item, index) { // 编辑收藏夹名称
      this.CurrentGalleryInfo.Name = item.title
      this.CurrentFolderName = item.title
      this.CurrentGalleryInfo.Category = item.photoServiceTypeId
      this.Labels = item.labels.split(',')
      this.CurrentGalleryInfo.Privacy = `${item.visible}`
      this.CurrentFolderId = item.id
      this.EditFolderPopupType = 'edit'
      this.CurrentFolderIndex = index
      this.ShowEditFolderPopup = true
    },
    CutList (item, index) { // 切换收藏夹
      if (!this.DataLock && this.ActiveIndex !== index) {
        this.ActiveIndex = index
        this.ToolClass.ChangeUrlParams([
          { name: 'gallery', value: item === null ? this.PhotoAlbum[0].id : item.id },
          { name: 'pages', value: 1 }
        ])
        this.$emit('Change', item)
      }
    },
    DeleteFolder (item, index) { // 删除收藏夹
      this.CurrentGalleryInfo.Name = item.name
      this.CurrentFolderId = item.id
      this.CurrentFolderIndex = index
      this.ShowDeleteFolderPopup = true
    },
    DeleteFolderPopupSure () { // 删除专辑确认逻辑
      if (!this.DataLock) {
        this.DataLock = true
        this.RemovePhotoAlbum({
          params: { params: { photoAlbumId: this.CurrentFolderId } },
          index: this.CurrentFolderIndex
        }).then(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteFolderPopup = false
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
          if (this.CurrentGalleryInfo.Name !== '') { // 专辑名称判空
            this.CreatePhotoAlbum({ data: { title: this.CurrentGalleryInfo.Name, photoServiceTypeId: this.CurrentGalleryInfo.Category, visible: this.CurrentGalleryInfo.Privacy - 0, labels: this.CurrentGalleryInfo.Label, upId: this.UserInfo.id } }).then(() => {
              this.GetPhotoAlbum({ // 获取用户收藏夹
                params: { accountId: this.UserInfo.id }
              })
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
          if (this.CurrentGalleryInfo.Name !== '') { // 专辑名称判空
            let Data = { id: this.CurrentFolderId, photoServiceTypeId: this.CurrentGalleryInfo.Category, labels: this.CurrentGalleryInfo.Label, visible: this.CurrentGalleryInfo.Privacy - 0, accountId: this.UserInfo.id }
            if (this.CurrentFolderName !== this.CurrentGalleryInfo.Name) {
              Data.title = this.CurrentGalleryInfo.Name
            }
            this.EditPhotoAlbum({ data: Data }).then(() => {
              this.GetPhotoAlbum({ // 获取用户收藏夹
                params: { accountId: this.UserInfo.id }
              })
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
      this.CurrentGalleryInfo.Name = ''
      this.CurrentGalleryInfo.Category = ''
      this.CurrentGalleryInfo.Label = null
      this.CurrentGalleryInfo.Privacy = ''
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
