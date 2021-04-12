<template>
  <div class="components SgsStep1">
    <i class="iconfont iconyouxiang"></i>
    <span>Welcome {{UserInfo.nick}}! Please confirm your email.</span>
    <!-- <span>Check your inbox or <a>resend the email confirmation.</a></span> -->
    <span>We have set the confirmation link to the. following email:</span>
    <span v-if="!IsEditEmail">{{UserInfo.email}}</span>
    <div class="Form">
      <input type="text" placeholder="Enter your eamil" v-model="NewEmail" v-if="IsEditEmail">
      <div>
        <input type="text" v-model="EmailCode">
        <span v-if="TimeCounts !== 60">{{TimeCounts > 9 ? TimeCounts : `0${TimeCounts}`}}s</span>
        <a v-else @click="SendCode">Send again</a>
      </div>
      <a @click="CheckCode" :class="{'active': !DataLock && EmailCode !== ''}">Submit</a>
      <span v-if="!IsEditEmail">If this is wrong, please <a @click="ToChangeEmail">change the email address.</a></span>
      <span v-else><a @click="CancelChangeEmail">cancel</a></span>
    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapSgsActions } = createNamespacedHelpers('sgs')
export default {
  name: 'SgsStep1',
  props: {
    SgsType: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      IsEditEmail: false,
      Timer: null,
      TimeCounts: 60,
      DataLock: false,
      EmailCode: '',
      NewEmail: ''
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
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
      'SendEmailCode',
      'CheckEmailCode',
      'ChangeEmail'
    ]),
    Init () {
      if (this.UserInfo !== null) {
        this.SendCode()
      }
    },
    CancelChangeEmail () { // 取消修改邮箱
      this.IsEditEmail = false
      window.clearInterval(this.Timer)
      this.TimeCounts = 60
      this.EmailCode = ''
      this.NewEmail = ''
    },
    ToChangeEmail () { // 修改邮箱
      this.IsEditEmail = true
      window.clearInterval(this.Timer)
      this.TimeCounts = 60
      this.EmailCode = ''
    },
    CheckCode () { // 校验验证码
      if (!this.DataLock && this.EmailCode !== '') {
        this.DataLock = true
        this.CheckEmailCode({ params: { accountId: this.UserInfo.id, code: this.EmailCode, certType: this.SgsType } }).then(() => {
          this.DataLock = false
          this.$emit('Success')
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    SendCode () { // 发送邮箱验证码
      if (this.TimeCounts === 60) {
        this.TimeCounts = 59
        window.clearInterval(this.Timer)
        this.Timer = window.setInterval(() => {
          if (this.TimeCounts > 0) {
            this.TimeCounts--
          } else {
            window.clearInterval(this.Timer)
            this.TimeCounts = 60
          }
        }, 1000)
        if (this.IsEditEmail) {
          this.ChangeEmail({ params: { accountId: this.UserInfo.id, email: this.NewEmail } }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            window.clearInterval(this.Timer)
            this.TimeCounts = 60
          })
        } else {
          this.SendEmailCode({ params: { accountId: this.UserInfo.id } }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            window.clearInterval(this.Timer)
            this.TimeCounts = 60
          })
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
