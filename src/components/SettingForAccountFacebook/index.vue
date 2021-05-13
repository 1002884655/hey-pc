<template>
  <div class="components SettingForAccountFacebook SettingFormInput">
    <div class="Form">
      <div class="Line">
        <span>Facebook</span>
        <div>
          <input type="text" placeholder="Facebook" v-model="FormData.facebook">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h">
      <span class="flex-item"></span>
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
  name: 'SettingForAccountFacebook',
  props: ['data'],
  data () {
    return {
      FormData: {
        facebook: ''
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
    this.$emit('TitleChange', 'CHANGE FACEBOOK')
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
      'ChangeHomepage'
    ]),
    Init () {
      this.FormData.facebook = this.UserInfo.facebook
    },
    CheckForm () {
      if (this.FormData.facebook === this.UserInfo.facebook) {
        this.$emit('Cancel')
        return false
      }
      if (this.FormData.facebook === '') {
        this.$notify.error({
          title: 'error',
          message: 'The facebook cannot be empty'
        })
        return false
      }
      return true
    },
    EditInfo () {
      if (!this.DataLock && this.CheckForm()) {
        this.DataLock = true
        this.ChangeHomepage({ params: { accountId: this.UserInfo.id, facebook: this.FormData.facebook, twitter: this.UserInfo.twitter } }).then(() => {
          this.EditUserInfo({ name: 'facebook', value: this.FormData.facebook })
          this.$notify.success({
            title: 'success',
            message: 'The facebook has been modified'
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
