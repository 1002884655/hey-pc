<template>
  <div class="components UserForMyAlbumNav flex-v">

    <span>{{VideoAlbumList.length}} albums</span>

    <div class="flex-item">
      <ScrollY Size="small">
        <div class="Menu">
          <!-- 新增分类按钮 -->
          <a class="AddClass" @click="AddNewFolder">
            <i class="iconfont iconjia"></i>
            <span style="margin-left: 10px;">New album</span>
          </a>

          <!-- 专辑列表 -->
          <ul class="FavoritesList">
            <li v-for="(item, index) in VideoAlbumList" :style="{zIndex: VideoAlbumList.length - index}" :class="{'active': ActiveIndex === index}" :key="index" class="flex-h">
              <i class="iconfont iconwenjianjia1" @click="CutList(item, index)"></i>
              <i class="iconfont iconwenjianjia11" @click="CutList(item, index)"></i>
              <span class="flex-item" @click="CutList(item, index)">{{item.name}}</span>
              <i class="iconfont iconsandian1"></i>
              <div class="Tips">
                <a @click="EditFolder(item, index)">Edit</a>
                <a @click="DeleteFolder(item, index)">Delete</a>
              </div>
              <span class="Num">{{item.videoNum}}</span>
            </li>
          </ul>
        </div>

      </ScrollY>

    </div>

    <!-- 编辑\新建专辑弹窗 -->
    <Popup theme="black" :show="ShowEditFolderPopup" type="confirm" :title="EditFolderPopupType === 'edit' ? 'album Information' : 'New album'" @Close="ShowEditFolderPopup = false" @Sure="EditFolderPopupSure">
      <div class="EditFolderPopupContent">
        <span><em>*</em> album name</span>
        <div class="flex-h">
          <div class="flex-item">
            <input type="text" autofocus="autofocus" v-model="CurrentFolderName" @input="CurrentFolderName = CurrentFolderName.substring(0, 32)">
          </div>
          <span>{{CurrentFolderName.length}}/32</span>
        </div>
        <span style="margin-top: 20px;">album description</span>
        <div class="flex-h">
          <div class="flex-item">
            <textarea cols="30" rows="3" v-model="CurrentFolderDesc" @input="CurrentFolderDesc = CurrentFolderDesc.substring(0, 256)"></textarea>
          </div>
          <span>{{CurrentFolderDesc.length}}/256</span>
        </div>
      </div>
    </Popup>

  </div>
</template>

<script>
/*
  页面名称：我的专辑导航
  创建人：许成祥
  创建时间：2020/05/25
  最近修改人：许成祥
  最近修改日期：2020/05/25
  备注： 无
*/
import ScrollY from '../ScrollY'
import Popup from '../Popup'
import { Pagination } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyAlbumNav',
  props: ['data'],
  data () {
    return {
      CurrentFolderDesc: '', // 当前编辑专辑简介
      ShowDeleteFolderPopup: false, // 显隐删除专辑弹窗
      CurrentFolderName: '', // 当前操作专辑名称
      CurrentFolderId: null, // 当前操作专辑id
      CurrentFolderIndex: null, // 当前操作专辑索引值
      ShowEditFolderPopup: false, // 显隐编辑专辑弹窗
      EditFolderPopupType: null, // 编辑、新建专辑弹窗类型
      DataLock: false, // 数据锁
      ActiveIndex: null // 选中索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoAlbumList: x => x.VideoAlbumList // 用户所有视频专辑列表
    })
  },
  components: {
    'el-pagination': Pagination,
    Popup,
    ScrollY
  },
  created () {
    this.GetVideoAlbum({ // 获取用户专辑
      params: { accountId: this.UserInfo.id }
    }).then(() => {
      let Folder = this.ToolClass.GetUrlParams('album')
      if (this.VideoAlbumList.length) { // 专辑不为空时，匹配索引值
        if (Folder !== false) {
          this.VideoAlbumList.map((item, index) => {
            if (item.id - 0 === Folder - 0) {
              this.ActiveIndex = index
            }
          })
          this.ActiveIndex = this.ActiveIndex || 0
          this.ToolClass.ChangeUrlParams([
            { name: 'album', value: this.VideoAlbumList[this.ActiveIndex].id }
          ])
        } else {
          this.ToolClass.ChangeUrlParams([
            { name: 'album', value: this.VideoAlbumList[0].id }
          ])
        }
      }
      if (!this.VideoAlbumList.length || Folder === false) {
        this.ActiveIndex = 0
      }
      if (this.VideoAlbumList.length) {
        this.$emit('Change', this.VideoAlbumList[this.ActiveIndex])
      }
      this.$emit('AxiosEnd')
    }).catch(() => {
      this.ActiveIndex = 0
    })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetVideoAlbum',
      'CreateVideoAlbum',
      'RemoveAlbumVideos',
      'EditVideoAlbum'
    ]),
    ...mapUserMutations([
      ''
    ]),
    EditFolder (item, index) { // 编辑专辑名称
      this.CurrentFolderName = item.name
      this.CurrentFolderDesc = item.description || ''
      this.CurrentFolderId = item.id
      this.EditFolderPopupType = 'edit'
      this.CurrentFolderIndex = index
      this.ShowEditFolderPopup = true
    },
    CutList (item, index) { // 切换专辑
      if (!this.DataLock && this.ActiveIndex !== index) {
        this.ActiveIndex = index
        this.ToolClass.ChangeUrlParams([
          { name: 'album', value: item === null ? null : item.id },
          { name: 'pages', value: 1 }
        ])
        this.$emit('Change', item)
      }
    },
    DeleteFolder (item, index) { // 删除专辑
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
        this.RemoveAlbumVideos({
          params: { params: { albumId: this.CurrentFolderId } },
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
          this.$emit('FolderChange')
        }).catch(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteFolderPopup = false
        })
      }
    },
    CheckActiveIndex () { // 查验选中索引值
      let Folder = this.ToolClass.GetUrlParams('album')
      this.VideoAlbumList.map((item, index) => {
        if (item.id - 0 === Folder - 0) {
          this.ActiveIndex = index
        }
      })
      this.ActiveIndex = this.ActiveIndex || 0
    },
    EditFolderPopupSure () { // 编辑专辑确认操作
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        if (this.EditFolderPopupType === 'add') { // 新建专辑
          if (this.CurrentFolderName !== '') { // 专辑名称判空
            this.CreateVideoAlbum({ data: { name: this.CurrentFolderName, accountId: this.UserInfo.id, description: this.CurrentFolderDesc } }).then(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
              this.CheckActiveIndex()
              this.$emit('FolderChange')
            }).catch(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
            })
          }
        } else if (this.EditFolderPopupType === 'edit') { // 编辑专辑
          if (this.CurrentFolderName !== '') { // 专辑名称判空
            this.EditVideoAlbum({ data: { data: { id: this.CurrentFolderId, name: this.CurrentFolderName, accountId: this.UserInfo.id, description: this.CurrentFolderDesc } }, index: this.CurrentFolderIndex }).then(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
            }).catch(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
            })
          }
        }
      }
    },
    AddNewFolder () { // 新建专辑
      this.CurrentFolderName = ''
      this.CurrentFolderDesc = ''
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
