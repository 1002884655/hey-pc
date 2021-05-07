<template>
  <div id="app">
    <MainPage @UserInfoChange="Init">
      <div class="MainContainer">

        <!-- 步骤 -->
        <div class="StepStatus" v-if="UserInfo !== null && CurrentStep !== null && CurrentStep - 0 < 4">
          <div class="StepItem" :class="{'active': CurrentStep >= 1}">
            <span>1</span>
            <span>Email Verification</span>
          </div>
          <div class="StepLine" :class="{'active': CurrentStep >= 2}"></div>
          <div class="StepItem" :class="{'active': CurrentStep >= 2}">
            <span>2</span>
            <span>Profile Settings</span>
          </div>
          <div class="StepLine" :class="{'active': CurrentStep >= 3}"></div>
          <div class="StepItem" :class="{'active': CurrentStep >= 3}">
            <span>3</span>
            <span>Identification</span>
          </div>
        </div>

        <!-- 认证内容 -->
        <div class="SgsContainer" v-if="UserInfo !== null && SgsInfo !== null">
          <div class="StepContent" v-if="CurrentStep === 1">
            <SgsStep1 @Success="CurrentStep = 2" :SgsType="SgsType" :SgsInfo="SgsInfo"></SgsStep1>
          </div>
          <div class="StepContent" v-if="CurrentStep === 2">
            <SgsStep2 @Success="CurrentStep = 3" :SgsType="SgsType" :SgsInfo="SgsInfo"></SgsStep2>
          </div>
          <div class="StepContent" v-if="CurrentStep === 3">
            <SgsStep3 @Success="CurrentStep = 4" :SgsInfo="SgsInfo"></SgsStep3>
          </div>
          <div class="StepContent" v-if="CurrentStep === 4">

            <!-- 认证中 -->
            <div class="SgsStatus" v-if="SgsInfo.certAudit - 0  === 0">
              <i class="iconfont iconshangchuanzhong" style="color: #0592FF;"></i>
              <span>Request subnitted. Please wait for approval.</span>
              <span>Your request has been submitted. After it is approved, we will inform you by message and email.</span>
              <a href="./index.html">Back</a>
            </div>

            <!-- 已认证 -->
            <div class="SgsStatus" v-if="SgsInfo.certAudit - 0  === 1">
              <i class="iconfont icontongguo" style="color: #259F57;"></i>
              <span>A user can authenticate only one identity</span>
              <a href="./index.html">Back</a>
            </div>

            <!-- 认证失败 -->
            <div class="SgsStatus" v-if="SgsInfo.certAudit - 0  === 2">
              <i class="iconfont iconweitongguo" style="color: #FA595C;"></i>
              <span>authentication failure</span>
              <a href="./auth.html">Back</a>
              <a @click="ToStopSgs">Termination request</a>
              <a @click="ToResetSgs">To request</a>
            </div>

          </div>
        </div>

        <SgsStatusPopup v-if="ShowSgsTypeErrorPopup" :SgsTypeError="ShowSgsTypeErrorPopup" :SgsInfo="SgsInfo" @Close="ShowSgsTypeErrorPopup = false"></SgsStatusPopup>

      </div>
    </MainPage>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const SgsStep1 = () => import('@/components/SgsStep1')
const SgsStep2 = () => import('@/components/SgsStep2')
const SgsStep3 = () => import('@/components/SgsStep3')
const SgsStatusPopup = () => import('@/components/SgsStatusPopup')
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapSgsActions } = createNamespacedHelpers('sgs')
export default {
  components: {
    MainPage,
    SgsStep1,
    SgsStep2,
    SgsStep3,
    SgsStatusPopup
  },
  data () {
    return {
      CurrentStep: null,
      SgsType: null,
      SgsInfo: null,
      DataLock: false,
      ShowSgsTypeErrorPopup: false
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
    ...mapSgsActions([
      'GetSgsInfo',
      'StopSgs',
      'ResetSgs'
    ]),
    ToStopSgs () { // 终止认证
      if (!this.DataLock) {
        this.DataLock = true
        this.StopSgs({ params: { accountId: this.UserInfo.id } }).then(() => {
          this.DataLock = false
          window.location.href = `./index.html`
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    ToResetSgs () { // 重新认证
      if (!this.DataLock) {
        this.DataLock = true
        this.ResetSgs({ params: { accountId: this.UserInfo.id } }).then(() => {
          this.DataLock = false
          this.Init()
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    Init () { // 初始化
      if (this.UserInfo !== null) {
        this.SgsTypeInit() // 认证角色初始化
        this.GetSgsInfo({ params: { accountId: this.UserInfo.id } }).then((res) => {
          this.SgsInfo = { ...this.SgsInfo, ...res.data.data }
          this.CurrentStep = res.data.data.certStatus === null || res.data.data.certStatus - 0 === 0 ? 1 : res.data.data.certStatus - 0
          if (this.SgsInfo.auditConfirm === null || this.SgsInfo.auditConfirm - 0 === 0) { // 未认证完成
          } else { // 认证已完成

          }
          if (this.SgsInfo.certType - 0 !== 0 && this.SgsType - 0 !== this.SgsInfo.certType - 0) {
            this.ToolClass.ChangeUrlParams([{ name: 'type', value: this.SgsInfo.certType - 0 === 5 ? 'model' : this.SgsInfo.certType - 0 === 4 ? 'star' : 'studio' }])
            this.ShowSgsTypeErrorPopup = true
          }
        })
      }
    },
    SgsTypeInit () { // 认证角色初始化
      if (this.ToolClass.GetUrlParams('type') === 'model') {
        this.SgsType = 5
      } else if (this.ToolClass.GetUrlParams('type') === 'star') {
        this.SgsType = 4
      } else {
        this.SgsType = 2
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
