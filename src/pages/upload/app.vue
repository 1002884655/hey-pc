<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange">

      <div class="MainContainer" ref="MainContainer" v-if="!ShowLogin && !IsLoaded">

        <!-- 上传类型切换菜单 -->
        <nav class="UploadTypeNav flex-h">
          <a class="flex-item" v-for="(item, index) in UploadTypeNav" :key="index" :class="{'active': CutIndex === index}" @click="CutNav(index)">{{item.Name}}</a>
        </nav>

        <!-- 上传页面 -->
        <div class="UploadContainer">

          <!-- 上传视频 -->
          <div v-if="CutIndex === 0 && UserInfo !== null">
            <UploadForVideo @Uploaded="Uploaded"></UploadForVideo>
          </div>

          <!-- 上传图片 -->
          <!-- <div v-if="CutIndex === 1 && UserInfo !== null">
            <UploadForPhoto @Uploaded="Uploaded"></UploadForPhoto>
          </div> -->

        </div>

      </div>

      <div class="MainContainer" ref="MainContainer" v-if="!ShowLogin && IsLoaded">
        <div class="SuccessContainer">
          <i class="iconfont iconfabuchenggong-3"></i>
          <span>Uploaded successfully</span>
          <span>(Jump to homepage in {{Timetamp}} seconds)</span>
          <div>
            <a href="./index.html">Jump now</a>
            <a class="active" @click="ContinueUploading">Continue uploading</a>
          </div>
        </div>
      </div>

      <!-- 未登录时需登录 -->
      <div v-if="ShowLogin" class="ErrorContainer">
        <span class="centerLabel">You need to <a @click="$refs.MainPage.Login()">login</a></span>
      </div>

    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：视频、图片上传页
  创建人：许成祥
  创建时间：2020/04/20
  最近修改人：许成祥
  最近修改日期：2020/04/20
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const UploadForVideo = () => import('@/components/UploadForVideo')
const UploadForPhoto = () => import('@/components/UploadForPhoto')
Vue.prototype.$notify = Notification
const { mapState: mapUserState } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage,
    UploadForVideo,
    UploadForPhoto
  },
  data () {
    return {
      Timer: null, // 定时器
      Timetamp: 5, // 跳转倒计时
      IsLoaded: false, // 是否为上传成功状态
      ShowLogin: false, // 是否显示需要登录
      CutIndex: this.ToolClass.GetUrlParams('type') === 'photo' ? 1 : 0, // 页面显示类型
      UploadTypeNav: [ // 上传类型切换导航
        { Name: 'UPLOAD VIDEO' }
        // { Name: 'POST PHOTOS' }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  created () {
    window.clearInterval(this.Timer)
    this.Timer = null
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ContinueUploading () { // 继续上传
      window.clearInterval(this.Timer)
      this.Timer = null
      this.IsLoaded = false
      this.Timetamp = 5
    },
    Uploaded (e) { // 上传成功回调
      this.IsLoaded = true
      window.clearInterval(this.Timer)
      this.Timer = null
      this.Timer = window.setInterval(() => {
        if (this.Timetamp > 1) {
          this.Timetamp -= 1
        } else {
          window.location.href = './index.html'
          // window.clearInterval(this.Timer)
          // this.Timer = null
          // this.IsLoaded = false
          // this.Timetamp = 5
        }
      }, 1000)
    },
    UserInfoChange () { // 用户信息更新
      this.ShowLogin = this.UserInfo === null
    },
    CutNav (index) { // 切换上传类型
      if (index !== this.CutIndex) {
        this.CutIndex = index
        history.replaceState('type', '', `./upload.html?type=${index === 1 ? 'photo' : 'video'}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
