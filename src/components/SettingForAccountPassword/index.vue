<template>
  <div class="components SettingForAccountPassword SettingFormInput">
    <div class="Form" v-if="Step === null">
      <div class="Line">
        <span>Old password</span>
        <div>
          <input type="password" placeholder="Add old password" v-model="FormData.OldPassword">
        </div>
      </div>
      <span class="Tips">{{OldPasswordTips}}</span>
      <div class="Line">
        <span>New password</span>
        <div>
          <input type="password" placeholder="Add new password" v-model="FormData.NewPassword">
        </div>
      </div>
      <span class="Tips">{{NewPasswordTips}}</span>
      <div class="Line">
        <span>Confirm new password</span>
        <div>
          <input type="password" placeholder="Add new password again" v-model="FormData.NewPasswordAgain">
        </div>
      </div>
      <span class="Tips">{{NewPasswordAgainTips}}</span>
    </div>
    <div class="Bottom flex-h" v-if="Step === null">
      <span class="flex-item"><a @click="ToForgetPassword">Forget your password?</a></span>
      <a class="active" :class="{'active': !DataLock}" @click="ToChangePassword">{{DataLock ? 'Loading...' : 'SAVE'}}</a>
    </div>

    <div class="Form" v-if="Step === 1">
      <span>Step 1/2</span>
      <span>Please enter verification code</span>
      <div class="Line">
        <span>Verification code</span>
        <div>
          <input type="text" placeholder="Add verification code" v-model="FormData.code">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h" v-if="Step === 1">
      <span class="flex-item">We will send a verification email to your new email address</span>
      <a class="active" :class="{'active': !DataLock}" @click="NextStep">{{DataLock ? 'Loading...' : 'NEXT'}}</a>
    </div>

    <div class="Form" v-if="Step === 2">
      <span>Step 2/2</span>
      <span>Please enter new password</span>
      <div class="Line">
        <span>New password</span>
        <div>
          <input type="password" placeholder="Add new password" v-model="FormData.NewPassword">
        </div>
      </div>
      <span class="Tips">{{NewPasswordTips}}</span>
      <div class="Line">
        <span>Confirm new password</span>
        <div>
          <input type="password" placeholder="Add new password again" v-model="FormData.NewPasswordAgain">
        </div>
      </div>
      <span class="Tips">{{NewPasswordAgainTips}}</span>
    </div>
    <div class="Bottom flex-h" v-if="Step === 2">
      <span class="flex-item"></span>
      <a class="active" :class="{'active': !DataLock}" @click="ToChangePasswordByCode">{{DataLock ? 'Loading...' : 'SAVE'}}</a>
    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapActions: mapSettingActions } = createNamespacedHelpers('setting')
export default {
  name: 'SettingForAccountPassword',
  props: ['data'],
  data () {
    return {
      Step: null,
      OldPasswordTips: null,
      NewPasswordTips: null,
      NewPasswordAgainTips: null,
      FormData: {
        OldPassword: '',
        NewPassword: '',
        NewPasswordAgain: '',
        code: ''
      },
      DataLock: false,
      Tips: null
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
    this.$emit('TitleChange', 'CHANGE PASSWORD')
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserMutations([
      'EditUserInfo'
    ]),
    ...mapSettingActions([
      'ChangePassword',
      'SendForgetCode',
      'ChangeForgetPassword'
    ]),
    Init () {
      this.FormData.facebook = this.UserInfo.facebook
    },
    ToChangePasswordByCode () {
      if (!this.DataLock && this.CheckForm(false)) {
        this.DataLock = true
        this.ChangeForgetPassword({ params: { accountId: this.UserInfo.id, code: this.FormData.code, password: this.FormData.NewPassword, rePassword: this.FormData.NewPasswordAgain } }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'Password changed'
          })
          this.DataLock = false
          this.$emit('Cancel')
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    NextStep () {
      if (this.FormData.code === '') {
        this.$notify.error({
          title: 'error',
          message: 'The code cannot be empty'
        })
        return false
      }
      this.Step = 2
    },
    ToForgetPassword () {
      if (!this.DataLock) {
        this.DataLock = true
        this.Step = 1
        this.SendForgetCode({ params: { accountId: this.UserInfo.id } }).then(() => {
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    CheckForm (checkOld = true) {
      if (checkOld) {
        if (this.FormData.OldPassword === '') {
          this.OldPasswordTips = 'this is required'
          return false
        } else if (this.FormData.OldPassword.length < 6 || this.FormData.OldPassword.length > 18) {
          this.OldPasswordTips = 'Password format error'
          return false
        } else {
          this.OldPasswordTips = null
        }
      }
      if (this.FormData.NewPassword === '') {
        this.NewPasswordTips = 'this is required'
        return false
      } else {
        this.NewPasswordTips = null
      }
      if (this.FormData.NewPasswordAgain === '') {
        this.NewPasswordAgainTips = 'this is required'
        return false
      } else {
        this.NewPasswordAgainTips = null
      }
      if (this.FormData.NewPassword !== this.FormData.NewPasswordAgain) {
        this.NewPasswordAgainTips = 'Password is different'
        return false
      }
      return true
    },
    ToChangePassword () {
      if (!this.DataLock && this.CheckForm()) {
        this.DataLock = true
        this.ChangePassword({ data: { userId: this.UserInfo.id, oldPassword: this.FormData.OldPassword, password: this.FormData.NewPassword, rePassword: this.FormData.NewPasswordAgain } }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'Password changed'
          })
          this.DataLock = false
          this.$emit('Cancel')
        }).catch((res) => {
          if (res.data.code - 0 === 1015) {
            this.OldPasswordTips = res.data.msg
          } else {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
          }
          this.DataLock = false
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
