<template>
  <div id="app">
    <MainPage :HideFooter="true" @UserInfoChange="Init">
      <div class="Content">
        <div class="flex-h" v-if="CanLive">

          <!-- 直播区域 -->
          <div class="flex-item">
            <HeyPornLiver ref="HeyPornLiver" @Start="LiveStart" @Stop="LiveStop"></HeyPornLiver>
          </div>

          <!-- 聊天室区域 -->
          <div class="ChatContainer">
            <!-- 线下 -->
            <HeyPornLiverChat ref="HeyPornLiverChat" :Appkey="'bmdehs6pbahqs'" @UserCountsChange="UserCountsChange"></HeyPornLiverChat>

            <!-- 线上 -->
            <!-- <HeyPornLiverChat ref="HeyPornLiverChat" :Appkey="'qd46yzrfqxyxf'" @UserCountsChange="UserCountsChange"></HeyPornLiverChat> -->
          </div>

        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
import MainPage from '@/components/MainPage'
import { createNamespacedHelpers } from 'vuex'
// import * as QNRTC from 'pili-rtc-web'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const HeyPornLiver = () => import('@/components/HeyPornLiver')
const HeyPornLiverChat = () => import('@/components/HeyPornLiverChat')
export default {
  components: {
    MainPage,
    HeyPornLiver,
    HeyPornLiverChat
  },
  provide () {
    return {
      testName: '123456'
    }
  },
  data () {
    return {
      CanLive: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    Init () {
      if (this.UserInfo !== null && this.UserInfo.userType - 0 !== 1) {
        this.CanLive = true
      }
    },
    LiveStart (e) {
      this.$refs.HeyPornLiverChat.Init(e)
    },
    LiveStop () {
      this.$refs.HeyPornLiverChat.Stop()
    },
    UserCountsChange (e) {
      this.$refs.HeyPornLiver.UserCounts = e
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
