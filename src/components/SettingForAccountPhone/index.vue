<template>
  <div class="components SettingForAccountPhone SettingFormInput">
    <div class="Form">
      <div class="Line">
        <span>Phone number</span>
        <div>
          <input type="text" placeholder="add a phone number" v-model="FormData.mobile">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h">
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
  name: 'SettingForAccountPhone',
  props: ['data'],
  data () {
    return {
      FormData: {
        mobile: ''
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
    this.$emit('TitleChange', 'CHANGE PHONE NUMBER')
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
      'ChangePhone'
    ]),
    Init () {
      this.FormData.mobile = this.UserInfo.mobile
    },
    CheckForm () {
      if (this.FormData.mobile === this.UserInfo.mobile) {
        this.$emit('Cancel')
        return false
      }
      if (this.FormData.mobile === '') {
        this.$notify.error({
          title: 'error',
          message: 'The mobile cannot be empty'
        })
        return false
      }
      return true
    },
    EditInfo () {
      if (!this.DataLock && this.CheckForm()) {
        this.DataLock = true
        this.ChangePhone({ params: { accountId: this.UserInfo.id, phoneNumber: this.FormData.mobile } }).then(() => {
          this.EditUserInfo({ name: 'mobile', value: this.FormData.mobile })
          this.$notify.success({
            title: 'success',
            message: 'The telephone number has been modified'
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
