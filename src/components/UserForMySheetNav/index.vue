<template>
  <div class="components UserForMySheetNav flex-v">

    <span>{{MyPieceGroupList.length}} playlist</span>

    <div class="flex-item">
      <ScrollY Size="small">
        <div class="Menu">
          <!-- 新增分类按钮 -->
          <a class="AddClass" @click="AddNewFolder">
            <i class="iconfont iconjia"></i>
            <span style="margin-left: 10px;">New playlist</span>
          </a>

          <!-- 片单列表 -->
          <ul class="FavoritesList">
            <li v-for="(item, index) in MyPieceGroupList" :style="{zIndex: MyPieceGroupList.length - index}" :class="{'active': ActiveIndex === index}" :key="index" class="flex-h">
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

    <!-- 编辑\新建片单弹窗 -->
    <Popup theme="black" :show="ShowEditFolderPopup" type="confirm" :title="EditFolderPopupType === 'edit' ? 'Playlist Information' : 'New playlist'" @Close="ShowEditFolderPopup = false" @Sure="EditFolderPopupSure">
      <div class="EditFolderPopupContent">
        <span><em>*</em> Playlist title</span>
        <div class="flex-h">
          <div class="flex-item">
            <input type="text" autofocus="autofocus" v-model="CurrentFolderName" @input="CurrentFolderName = CurrentFolderName.substring(0, 32)">
          </div>
          <span>{{CurrentFolderName.length}}/32</span>
        </div>
        <span style="margin-top: 20px;">playlists description</span>
        <div class="flex-h">
          <div class="flex-item">
            <textarea cols="30" rows="3" v-model="CurrentFolderDesc" @input="CurrentFolderDesc = CurrentFolderDesc.substring(0, 256)"></textarea>
          </div>
          <span>{{CurrentFolderDesc.length}}/256</span>
        </div>
        <div class="Agreement flex-h" v-if="EditFolderPopupType === 'add'">
          <a class="iconfont" :class="[Agree ? 'icongouxuan active' : 'iconweigouxuan']" @click="Agree = !Agree"></a>
          <span class="flex-item">You are creating a public playlists.</span>
        </div>
      </div>
    </Popup>

    <!-- 删除片单弹窗 -->
    <Popup theme="black" :show="ShowDeleteFolderPopup" type="confirm" title="Confirm" @Close="ShowDeleteFolderPopup = false" @Sure="DeleteFolderPopupSure">
      <div class="DeleteFolderPopupContent">
        <span>Are you sure to delete this sheet called '<b>{{CurrentFolderName}}</b>'?</span>
      </div>
    </Popup>

  </div>
</template>

<script>
/*
  页面名称：我的片单导航
  创建人：许成祥
  创建时间：2020/05/25
  最近修改人：许成祥
  最近修改日期：2020/05/25
  备注： 无
*/
import Vue from 'vue'
import ScrollY from '../ScrollY'
import Popup from '../Popup'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMySheetNav',
  props: ['data'],
  data () {
    return {
      Agree: false,
      CurrentFolderDesc: '', // 当前编辑片单简介
      ShowDeleteFolderPopup: false, // 显隐删除片单弹窗
      CurrentFolderName: '', // 当前操作片单名称
      CurrentFolderId: null, // 当前操作片单id
      CurrentFolderIndex: null, // 当前操作片单索引值
      ShowEditFolderPopup: false, // 显隐编辑片单弹窗
      EditFolderPopupType: null, // 编辑、新建片单弹窗类型
      DataLock: false, // 数据锁
      ActiveIndex: null // 选中索引值
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    })
  },
  components: {
    'el-pagination': Pagination,
    Popup,
    ScrollY
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
      'GetPieceGroup',
      'AddPieceGroup',
      'DeletePieceGroup',
      'RenamePieceGroup'
    ]),
    ...mapUserMutations([
      ''
    ]),
    Init () {
      this.GetPieceGroup({ // 获取用户片单
        params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 255 }
      }).then(() => {
        let Folder = this.ToolClass.GetUrlParams('sheet')
        if (this.MyPieceGroupList.length) { // 片单不为空时，匹配索引值
          if (Folder !== false) {
            this.MyPieceGroupList.map((item, index) => {
              if (item.id - 0 === Folder - 0) {
                this.ActiveIndex = index
              }
            })
            this.ActiveIndex = this.ActiveIndex || 0
            this.ToolClass.ChangeUrlParams([
              { name: 'sheet', value: this.MyPieceGroupList[this.ActiveIndex].id }
            ])
          } else {
            this.ToolClass.ChangeUrlParams([
              { name: 'sheet', value: this.MyPieceGroupList[0].id }
            ])
          }
        }
        if (!this.MyPieceGroupList.length || Folder === false) {
          this.ActiveIndex = 0
        }
        if (this.MyPieceGroupList.length) {
          this.$emit('Change', this.MyPieceGroupList[this.ActiveIndex])
        }
        this.$emit('AxiosEnd')
      }).catch(() => {
        this.ActiveIndex = 0
      })
    },
    EditFolder (item, index) { // 编辑片单名称
      this.CurrentFolderName = item.name
      this.CurrentFolderDesc = item.description
      this.CurrentFolderId = item.id
      this.EditFolderPopupType = 'edit'
      this.CurrentFolderIndex = index
      this.ShowEditFolderPopup = true
    },
    CutList (item, index) { // 切换片单
      if (!this.DataLock && this.ActiveIndex !== index) {
        this.ActiveIndex = index
        this.ToolClass.ChangeUrlParams([
          { name: 'sheet', value: item === null ? null : item.id },
          { name: 'pages', value: 1 }
        ])
        this.$emit('Change', item)
      }
    },
    DeleteFolder (item, index) { // 删除片单
      this.CurrentFolderName = item.name
      this.CurrentFolderId = item.id
      this.CurrentFolderIndex = index
      this.ShowDeleteFolderPopup = true
    },
    DeleteFolderPopupSure () { // 删除片单确认逻辑
      if (!this.DataLock) {
        this.DataLock = true
        this.DeletePieceGroup({
          params: { params: { id: this.CurrentFolderId, accountId: this.UserInfo.id } },
          index: this.CurrentFolderIndex
        }).then(() => {
          this.DataLock = false // 数据解锁
          this.ShowDeleteFolderPopup = false
          if (this.CurrentFolderIndex === this.ActiveIndex) { // 删除选中片单
            this.CutList(null, 0)
          } else if (this.CurrentFolderIndex < this.ActiveIndex) { // 删除选中片单之前的片单
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
      let Folder = this.ToolClass.GetUrlParams('sheet')
      this.MyPieceGroupList.map((item, index) => {
        if (item.id - 0 === Folder - 0) {
          this.ActiveIndex = index
        }
      })
      this.ActiveIndex = this.ActiveIndex || 0
    },
    EditFolderPopupSure () { // 编辑片单确认操作
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        if (this.EditFolderPopupType === 'add') { // 新建片单
          if (this.CurrentFolderName !== '' && this.Agree) { // 片单名称判空
            this.AddPieceGroup({ data: { name: this.CurrentFolderName, accountId: this.UserInfo.id, description: this.CurrentFolderDesc } }).then(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
              this.CheckActiveIndex()
              this.$emit('FolderChange')
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
            })
          }
        } else if (this.EditFolderPopupType === 'edit') { // 编辑片单
          if (this.CurrentFolderName !== '') { // 片单名称判空
            this.RenamePieceGroup({ params: { data: { id: this.CurrentFolderId, name: this.CurrentFolderName, accountId: this.UserInfo.id, description: this.CurrentFolderDesc } }, index: this.CurrentFolderIndex }).then(() => {
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false // 数据解锁
              this.ShowEditFolderPopup = false
            })
          }
        }
      }
    },
    AddNewFolder () { // 新建片单
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
