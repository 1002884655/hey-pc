<template>
  <div class="components UserForMyAlbumVideosMove">
    <Popup theme="black" :show="true" :ShowBottom="ShowPopupBottomBtn" type="confirm" :title="SubTitle === null ? Title : SubTitle" @Close="$emit('Close')" @Sure="MoveFolderPopupSure">
      <div class="MoveFolderPopupContent flex-v" v-if="!ShowAddNew">

        <div class="flex-item">
          <div>
            <ScrollY Size="small">
              <!-- 专辑列表 -->
              <ul>
                <li v-for="(item, index) in VideoAlbumList" :key="index" @click="CutMoveFolder(item, index)" class="flex-h" :class="{'active': SelectFolderIndex === index}">
                  <a class="iconfont" :class="[SelectFolderIndex === index ? 'iconyitianjia' : 'iconyuan']"></a>
                  <span class="flex-item">{{item.name}}</span>
                  <span>{{item.defaults - 0 === 1 ? item.videoNum : `${item.videoNum}/255`}}</span>
                </li>
              </ul>
            </ScrollY>
          </div>
        </div>

        <!-- 新建专辑 -->
        <div class="AddFolder" @click="ShowAddFolder">
          <i class="iconfont iconjia"></i>
          <span>New album</span>
        </div>

      </div>
      <div class="AddNew" v-else>
        <div class="Title">
          <span>Album title</span>
          <span>(Limit 80 characters)</span>
        </div>
        <div class="Form">
          <input type="text" placeholder="Enter up to 80 characters" v-model="NewFolderName">
        </div>
        <div class="Title">
          <span>Album Introduction </span>
          <span>(Limit 256 characters)</span>
        </div>
        <div class="Form">
          <textarea cols="30" rows="5" placeholder="Enter up to 256 characters" v-model="NewFolderDesc"></textarea>
        </div>
        <div class="Bottom flex-h">
          <a class="flex-item" @click="CancelAddNew">cancel</a>
          <a class="flex-item" @click="AddFolder">save</a>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
/*
  页面名称：专辑视频移动组件
  创建人：许成祥
  创建时间：2020/05/26
  最近修改人：许成祥
  最近修改日期：2020/05/26
  备注： 无
*/
import ScrollY from '../ScrollY'
import Vue from 'vue'
import { Notification } from 'element-ui'
import Popup from '../Popup'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyAlbumVideosMove',
  props: {
    DefaultIndex: { // 默认选中索引值
      default: null,
      type: Number
    },
    Title: { // 弹窗标题
      default: 'Copy',
      type: String
    },
    CollectId: { // 收藏id
      default: null,
      type: Number
    }
  },
  data () {
    return {
      SubTitle: null, // 弹窗标题：默认显示props中的Title
      ShowPopupBottomBtn: true, // 是否显示弹窗底部按钮
      ShowAddNew: false, // 显隐新建状态
      NewFolderDesc: '', // 新建专辑简介
      NewFolderName: '', // 新建专辑名称
      DataLock: false, // 数据锁
      SelectFolderIndex: null, // 选择转移专辑索引值
      ShowMoveFolderPopup: true // 显隐转移至专辑弹窗
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoAlbumList: x => x.VideoAlbumList // 用户所有视频专辑列表
    })
  },
  components: {
    Popup,
    ScrollY
  },
  created () {
    if (this.VideoAlbumList.length) {
      this.SelectFolderIndex = this.DefaultIndex
    } else {
      this.GetVideoAlbum({ params: { accountId: this.UserInfo.id } })
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetVideoAlbum',
      'CreateVideoAlbum',
      'MoveAlbumVideos'
    ]),
    CancelAddNew () { // 取消新增专辑
      this.SubTitle = null // 弹窗标题：默认显示props中的Title
      this.ShowAddNew = false // 显隐新建状态
      this.ShowPopupBottomBtn = true // 是否显示弹窗底部按钮
      this.NewFolderDesc = ''
      this.NewFolderName = ''
    },
    ShowAddFolder () { // 显示新建弹窗
      this.SubTitle = 'Sheet Information' // 弹窗标题：默认显示props中的Title
      this.ShowPopupBottomBtn = false // 是否显示弹窗底部按钮
      this.ShowAddNew = true // 显隐新建状态
    },
    AddCollect () { // 添加到专辑
      if (!this.DataLock && this.SelectFolderIndex !== null) {
        this.DataLock = true
        this.MoveAlbumVideos({
          params: {
            ids: this.CollectId,
            accountId: this.UserInfo.id,
            albumId: this.VideoAlbumList[this.SelectFolderIndex].id,
            sourceAlbumId: this.VideoAlbumList[this.DefaultIndex].id
          }
        }).then(() => {
          this.DataLock = false
          this.$notify.success({
            title: 'success',
            message: 'Add of success!'
          })
          this.GetVideoAlbum({ params: { accountId: this.UserInfo.id } }).then(() => {
            this.$emit('Close')
          })
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
          this.$emit('Close')
        })
      }
    },
    MoveFolderPopupSure () { // 转移至专辑
      if (this.CollectId !== null) {
        this.AddCollect()
      } else {
        this.$emit('Change', this.SelectFolderIndex)
      }
    },
    CutMoveFolder (item, index) { // 选择转移专辑
      this.SelectFolderIndex = index
    },
    AddFolder () { // 新建专辑
      if (!this.DataLock && this.NewFolderName !== '') {
        this.DataLock = true // 数据锁定
        this.CreateVideoAlbum({ data: { name: this.NewFolderName, accountId: this.UserInfo.id, description: this.NewFolderDesc } }).then(() => {
          this.NewFolderName = ''
          if (this.SelectFolderIndex !== null && this.SelectFolderIndex !== 0) {
            this.SelectFolderIndex += 1
          }
          this.CancelAddNew()
          this.$emit('FolderAdd')
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
