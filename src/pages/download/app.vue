<template>
  <div id="app">
    <MainPage ref="MainPage" :MainNavBgActive="false">
      <div class="Container">
        <img src="../../assets/img/download.jpg" class="centerLabel cover" alt="">
        <div>
          <span>HeyPorn</span>
          <span>Don't miss every night</span>
          <div class="Link flex-h">
            <div class="QrCode">
              <img src="../../assets/img/qrcode.png" width="100%" alt="">
            </div>
            <div class="flex-item">
              <a :href="IosUserLink">
                <div class="flex-h">
                  <i class="iconfont iconpingguo"></i>
                  <div class="flex-item">
                    <span>IOS</span>
                    <span>Download</span>
                  </div>
                </div>
              </a>
              <a :href="AndroidUserLink">
                <div class="flex-h">
                  <i class="iconfont iconanzhuo" style="font-size: 35px;"></i>
                  <div class="flex-item">
                    <span>Android</span>
                    <span>Download</span>
                  </div>
                </div>
              </a>
            </div>
            <div class="flex-item">
              <a @click="Download('ios')">
                <div class="flex-h">
                  <i class="iconfont iconpingguo"></i>
                  <div class="flex-item">
                    <span style="font-size: 16px">Heypron for creator</span>
                    <span>Download</span>
                  </div>
                </div>
              </a>
              <a @click="Download('android')">
                <div class="flex-h">
                  <i class="iconfont iconanzhuo" style="font-size: 35px;"></i>
                  <div class="flex-item">
                    <span style="font-size: 16px">Heypron for creator</span>
                    <span>Download</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：协议页面
  创建人：许成祥
  创建时间：2020/04/11
  最近修改人：许成祥
  最近修改日期：2020/04/11
  备注： 无
*/
import MainPage from '../../components/MainPage'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage
  },
  data () {
    return {
      AndroidUserLink: null,
      IosUserLink: null
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
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
      'GetDownloadUrl'
    ]),
    Init () {
      this.GetDownloadUrl({ params: { channelType: 1, platformType: 1 } }).then((res) => {
        this.AndroidUserLink = res.data.data.url
      })
      this.GetDownloadUrl({ params: { channelType: 1, platformType: 2 } }).then((res) => {
        this.IosUserLink = res.data.data.url
      })
    },
    Download (type) {
      if (this.UserInfo !== null) {
        if (this.UserInfo.userType - 0 !== 1) { // 主播身份才可以下载
          if (type === 'ios') {
            this.GetDownloadUrl({ params: { channelType: 2, platformType: 2 } }).then((res) => {
              window.location.href = res.data.data.url
            })
          } else {
            this.GetDownloadUrl({ params: { channelType: 2, platformType: 1 } }).then((res) => {
              window.location.href = res.data.data.url
            })
          }
        } else {
          this.ToolClass.Popup('alert', '', 'Only creators can download the creators APP. If you want to be a creator, please contact us. E-mail: Heystar@heypron')
        }
      } else {
        this.$refs.MainPage.Login()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
