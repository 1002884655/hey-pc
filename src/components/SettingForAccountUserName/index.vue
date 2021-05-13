<template>
  <div class="components SettingForAccountUserName SettingFormInput">
    <div class="Form">
      <div class="Line">
        <span>Username</span>
        <div>
          <input type="text" placeholder="Username" v-model="FormData.name">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h">
      <span class="flex-item"><a href="https://www.heyporn.com/userspace.html">https://www.heyporn.com/userspace.html</a></span>
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
  name: 'SettingForAccountUserName',
  props: ['data'],
  data () {
    return {
      FormData: {
        name: ''
      },
      DataLock: false
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
    this.$emit('TitleChange', 'CHANGE USERNAME')
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
      'ChangeUserName'
    ]),
    Init () {
      this.FormData.name = this.UserInfo.name
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
        this.ChangeUserName({ params: { accountId: this.UserInfo.id, username: this.FormData.name } }).then(() => {
          this.EditUserInfo({ name: 'name', value: this.FormData.name })
          this.$notify.success({
            title: 'success',
            message: 'The username is saved'
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
