<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange">
      <div class="MainContainer">
        <div class="PayStatus">

          <!-- 支付成功 -->
          <div>
            <i class="iconfont iconfabuchenggong-3 Success"></i>
            <span>Finished</span>
            <!-- <ul>
              <li class="flex-h">
                <span class="flex-item">Price</span>
                <span>${{ToolClass.GetUrlParams('priceAmount') || 0}}</span>
              </li>
              <li class="flex-h">
                <span class="flex-item">Order</span>
                <span>{{ToolClass.GetUrlParams('referenceID') || null}}</span>
              </li>
            </ul> -->
            <a @click="GoBack">Back</a>
            <span class="Tips">Retum after {{TimerNum}}s</span>
          </div>

        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
*/
import { Select, Option } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    'el-select': Select,
    'el-option': Option,
    MainPage
  },
  data () {
    return {
      Timer: null,
      TimerNum: 5
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
    ...mapUserActions([
    ]),
    Init () {
      window.clearInterval(this.Timer)
      this.Timer = window.setInterval(() => {
        if (this.TimerNum > 0) {
          this.TimerNum--
        } else {
          this.GoBack()
        }
      }, 1000)
    },
    GoBack () {
      if (window.localStorage.OrderBackUrl) {
        window.location.href = window.localStorage.OrderBackUrl
      }
    },
    UserInfoChange () { // 用户信息更新
      if (this.UserInfo !== null) {
        this.Init()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
