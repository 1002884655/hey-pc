<template>
  <div class="components SettingForAccountTwitter SettingFormInput">
    <div class="Form">
      <div class="Line">
        <span>Twitter</span>
        <div>
          <input type="text" placeholder="Twitter" v-model="FormData.twitter">
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
  name: 'SettingForAccountTwitter',
  props: ['data'],
  data () {
    return {
      FormData: {
        twitter: ''
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
    this.$emit('TitleChange', 'CHANGE TWITTER')
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
      this.FormData.twitter = this.UserInfo.twitter
    },
    CheckForm () {
      if (this.FormData.twitter === this.UserInfo.twitter) {
        this.$emit('Cancel')
        return false
      }
      if (this.FormData.twitter === '') {
        this.$notify.error({
          title: 'error',
          message: 'The twitter cannot be empty'
        })
        return false
      }
      return true
    },
    EditInfo () {
      if (!this.DataLock && this.CheckForm()) {
        this.DataLock = true
        this.ChangeHomepage({ params: { accountId: this.UserInfo.id, twitter: this.FormData.twitter, facebook: this.UserInfo.facebook } }).then(() => {
          this.EditUserInfo({ name: 'twitter', value: this.FormData.twitter })
          this.$notify.success({
            title: 'success',
            message: 'The twitter has been modified'
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
