<template>
  <div class="components SettingForAccountEmail SettingFormInput">
    <div class="Form" v-if="Step === 1">
      <span>Step 1/2</span>
      <span>Please enter your new E-mail address</span>
      <div class="Line">
        <span>New email</span>
        <div>
          <input type="text" placeholder="New email" v-model="FormData.newEmail">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h" v-if="Step === 1">
      <span class="flex-item">We will send a verification email to your new email address</span>
      <a class="active" :class="{'active': !DataLock}" @click="NextStep">{{DataLock ? 'Loading...' : 'NEXT'}}</a>
    </div>

    <div class="Form" v-if="Step === 2">
      <span>Step 2/2</span>
      <span>Please enter verification code</span>
      <div class="Line">
        <span>Verification code</span>
        <div>
          <input type="text" placeholder="Add verification code" v-model="FormData.code">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h" v-if="Step === 2">
      <span class="flex-item">{{Tips}}</span>
      <a class="active" :class="{'active': !DataLock}" @click="EditInfo">{{DataLock ? 'Loading...' : 'SAVE'}}</a>
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
  name: 'SettingForAccountEmail',
  props: ['data'],
  data () {
    return {
      FormData: {
        newEmail: '',
        code: ''
      },
      DataLock: false,
      Step: 1,
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
    this.$emit('TitleChange', 'CHANGE EMAIL')
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
      'SendCode',
      'ChangeEamil'
    ]),
    Init () {
      this.FormData.newEmail = this.UserInfo.email
    },
    NextStep () {
      if (this.FormData.newEmail === this.UserInfo.email) {
        // this.$emit('Cancel')
        return false
      }
      if (!this.ToolClass.CheckEmail(this.FormData.newEmail)) {
        this.$notify.error({
          title: 'error',
          message: 'Please enter the correct email address'
        })
        return false
      }
      // if (this.FormData.code === '') {
      //   this.$notify.error({
      //     title: 'error',
      //     message: 'Please enter the code'
      //   })
      //   return false
      // }
      if (!this.DataLock) {
        this.DataLock = true
        this.SendCode({ params: { accountId: this.UserInfo.id, email: this.FormData.newEmail } }).then(() => {
          this.Step = 2
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
    CheckForm () {
      if (this.FormData.name === this.UserInfo.name) {
        this.$emit('Cancel')
        return false
      }
      if (this.FormData.name === '') {
        this.$notify.error({
          title: 'error',
          message: 'The user name cannot be empty'
        })
        return false
      }
      return true
    },
    EditInfo () {
      if (!this.DataLock && this.CheckForm()) {
        this.DataLock = true
        this.ChangeEamil({ params: { accountId: this.UserInfo.id, code: this.FormData.code, email: this.FormData.email } }).then(() => {
          this.EditUserInfo({ name: 'email', value: this.FormData.newEmail })
          this.$notify.success({
            title: 'success',
            message: 'The email has been modified'
          })
          this.DataLock = false
          this.$emit('Cancel')
        }).catch((res) => {
          this.Tips = res.data.msg
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
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
