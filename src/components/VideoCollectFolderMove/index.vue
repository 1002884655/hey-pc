<template>
  <div class="components VideoCollectFolderMove">
    <Popup theme="black" :show="true" :ShowBottom="ShowPopupBottomBtn" type="confirm" :title="SubTitle === null ? Title : SubTitle" @Close="$emit('Close')" @Sure="MoveFolderPopupSure">
      <div class="MoveFolderPopupContent flex-v" v-if="!ShowAddNew">

        <div class="flex-item">
          <div>
            <ScrollY Size="small">
              <!-- 片单列表 -->
              <ul>
                <li v-for="(item, index) in VideoCollectCategoryList" :key="index" @click="CutMoveFolder(item, index)" class="flex-h" :class="{'active': SelectFolderIndex === index}">
                  <a class="iconfont" :class="[SelectFolderIndex === index ? 'iconyitianjia' : 'iconyuan']"></a>
                  <span class="flex-item">{{item.name}}</span>
                  <span>{{item.defaults - 0 === 1 ? item.videoNum : `${item.videoNum}/255`}}</span>
                </li>
              </ul>
            </ScrollY>
          </div>
        </div>

        <!-- 新建片单 -->
        <div class="AddFolder" @click="ShowAddFolder">
          <i class="iconfont iconjia"></i>
          <span>New favorites</span>
        </div>

      </div>
      <div class="AddNew" v-else>
        <div class="Title">
          <span>Favorites title</span>
          <span>(Limit 80 characters)</span>
        </div>
        <div class="Form">
          <input type="text" placeholder="Enter up to 80 characters" v-model="NewFolderName">
        </div>
        <!-- <div class="Title">
          <span>Favorites Introduction </span>
          <span>(Limit 256 characters)</span>
        </div>
        <div class="Form">
          <textarea cols="30" rows="5" placeholder="Enter up to 256 characters" v-model="NewFolderDesc"></textarea>
        </div> -->
        <div class="Bottom flex-h">
          <a class="flex-item" @click="CancelAddNew">cancel</a>
          <a class="flex-item" @click="AddFolder">save</a>
        </div>
      </div>
    </Popup>

    <Popup v-if="false" theme="black" :show="true" type="confirm" :title="Title" @Close="$emit('Close')" @Sure="MoveFolderPopupSure">
      <div class="MoveFolderPopupContent">

        <!-- 收藏夹列表 -->
        <ul>
          <li v-for="(item, index) in VideoCollectCategoryList" :key="index" @click="CutMoveFolder(item, index)" class="flex-h" :class="{'active': SelectFolderIndex === index}">
            <a class="iconfont" :class="[SelectFolderIndex === index ? 'iconyitianjia' : 'iconyuan']"></a>
            <span class="flex-item">{{item.name}}</span>
            <span>{{item.defaults - 0 === 1 ? item.videoNum : `${item.videoNum}/255`}}</span>
          </li>
        </ul>

        <!-- 新建收藏夹 -->
        <div class="AddFolder flex-h" v-if="VideoCollectCategoryList.length < 11">
          <input type="text" class="flex-item" placeholder="Enter up to 32 characters" v-model="NewFolderName">
          <a @click="AddFolder">New</a>
        </div>

      </div>
    </Popup>
  </div>
</template>

<script>
/*
  页面名称：视频收藏转移组件
  创建人：许成祥
  创建时间：2020/05/12
  最近修改人：许成祥
  最近修改日期：2020/05/12
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
  name: 'VideoCollectFolderMove',
  props: {
    DefaultIndex: { // 默认选中索引值
      default: null,
      type: Number
    },
    Title: { // 弹窗标题
      default: 'Save to Favorites',
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
      NewFolderDesc: '', // 新建片单简介
      NewFolderName: '', // 新建片单名称
      DataLock: false, // 数据锁
      SelectFolderIndex: null, // 选择转移专辑索引值
      ShowMoveFolderPopup: true // 显隐转移至专辑弹窗
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoCollectCategoryList: x => x.VideoCollectCategoryList // 用户所有视频收藏夹列表
    })
  },
  components: {
    Popup,
    ScrollY
  },
  created () {
    if (!this.VideoCollectCategoryList.length) {
      this.GetVideoCollectCategory({ params: { accountId: this.UserInfo.id } })
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetVideoCollectCategory',
      'AddVideoCollectCategory',
      'AddVideoCollect'
    ]),
    CancelAddNew () { // 取消新增片单
      this.SubTitle = null // 弹窗标题：默认显示props中的Title
      this.ShowAddNew = false // 显隐新建状态
      this.ShowPopupBottomBtn = true // 是否显示弹窗底部按钮
      this.NewFolderDesc = ''
      this.NewFolderName = ''
    },
    ShowAddFolder () { // 显示新建弹窗
      this.SubTitle = 'Favorites Information' // 弹窗标题：默认显示props中的Title
      this.ShowPopupBottomBtn = false // 是否显示弹窗底部按钮
      this.ShowAddNew = true // 显隐新建状态
    },
    AddCollect () { // 添加收藏
      if (!this.DataLock && this.SelectFolderIndex !== null) {
        this.DataLock = true
        this.AddVideoCollect({
          params: {
            videoId: this.CollectId,
            accountId: this.UserInfo.id,
            categoryId: this.VideoCollectCategoryList[this.SelectFolderIndex].id
          }
        }).then(() => {
          this.DataLock = false
          this.$notify.success({
            title: 'success',
            message: 'Collection of success!'
          })
          this.GetVideoCollectCategory({ params: { accountId: this.UserInfo.id } }).then(() => {
            this.$emit('Close')
          })
          this.$emit('Success')
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
    AddFolder () { // 新建收藏夹
      if (!this.DataLock && this.NewFolderName !== '') {
        this.DataLock = true // 数据锁定
        this.AddVideoCollectCategory({ params: { name: this.NewFolderName, accountId: this.UserInfo.id } }).then(() => {
          this.NewFolderName = ''
          if (this.SelectFolderIndex !== null && this.SelectFolderIndex !== 0) {
            this.SelectFolderIndex += 1
          }
          this.CancelAddNew()
          this.$emit('FolderAdd')
          this.DataLock = false // 数据解锁
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
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
