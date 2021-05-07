<template>
  <div class="components SettingForAccount">
    <ul v-show="EditType === null">
      <li>
        <span>Account info</span>
        <div>
          <a class="flex-h" @click="CutEditType(1, 'CHANGE USERNAME')">
            <div class="flex-item">
              <span>Username</span>
              <span>Username</span>
            </div>
            <i class="iconfont iconjiantouright"></i>
          </a>
          <a class="flex-h" @click="CutEditType(2, 'CHANGE EMAIL')">
            <div class="flex-item">
              <span>Email</span>
              <span>3242552626266@foxmail.com</span>
            </div>
            <i class="iconfont iconjiantouright"></i>
          </a>
          <a class="flex-h" @click="CutEditType(3, 'CHANGE PHONENUMBER')">
            <div class="flex-item">
              <span>Phone number</span>
              <span>1241****1231</span>
            </div>
            <i class="iconfont iconjiantouright"></i>
          </a>
        </div>
      </li>
      <li>
        <span>Linked</span>
        <div>
          <a class="flex-h" @click="CutEditType(4, 'CHANGE TWITTER')">
            <div class="flex-item">
              <span>Twitter</span>
              <span>https://twitter.com/9887645ajg355</span>
            </div>
            <i class="iconfont iconjiantouright"></i>
          </a>
          <a class="flex-h" @click="CutEditType(5, 'CHANGE FACEBOOK')">
            <div class="flex-item">
              <span>Facebook</span>
              <span>https://facebook.com/9887645ajg355</span>
            </div>
            <i class="iconfont iconjiantouright"></i>
          </a>
        </div>
      </li>
      <li>
        <span>Linked accounts</span>
        <div>
          <a class="flex-h" @click="CutEditType(6, 'CHANGE PASSWORD')">
            <div class="flex-item">
              <span>Password</span>
            </div>
            <i class="iconfont iconjiantouright"></i>
          </a>
        </div>
      </li>
    </ul>

    <!-- 修改用户名 -->
    <div v-if="EditType - 0 === 1">
      <SettingForAccountUserName @TitleChange="TitleChange"></SettingForAccountUserName>
    </div>

    <!-- 修改邮箱 -->
    <div v-if="EditType - 0 === 2">
      <SettingForAccountEmail @TitleChange="TitleChange"></SettingForAccountEmail>
    </div>

    <!-- 修改手机号 -->
    <div v-if="EditType - 0 === 3">
      <SettingForAccountPhone @TitleChange="TitleChange"></SettingForAccountPhone>
    </div>

    <!-- 修改推特 -->
    <div v-if="EditType - 0 === 4">
      <SettingForAccountTwitter @TitleChange="TitleChange"></SettingForAccountTwitter>
    </div>

    <!-- 修改脸书 -->
    <div v-if="EditType - 0 === 5">
      <SettingForAccountFacebook @TitleChange="TitleChange"></SettingForAccountFacebook>
    </div>

    <!-- 修改密码 -->
    <div v-if="EditType - 0 === 6">
      <SettingForAccountPassword @TitleChange="TitleChange"></SettingForAccountPassword>
    </div>
  </div>
</template>

<script>
/*
*/
const SettingForAccountUserName = () => import('@/components/SettingForAccountUserName')
const SettingForAccountEmail = () => import('@/components/SettingForAccountEmail')
const SettingForAccountPhone = () => import('@/components/SettingForAccountPhone')
const SettingForAccountTwitter = () => import('@/components/SettingForAccountTwitter')
const SettingForAccountFacebook = () => import('@/components/SettingForAccountFacebook')
const SettingForAccountPassword = () => import('@/components/SettingForAccountPassword')
export default {
  name: 'SettingForAccount',
  props: ['data'],
  data () {
    return {
      EditType: null
    }
  },
  computed: {
  },
  components: {
    SettingForAccountUserName,
    SettingForAccountEmail,
    SettingForAccountPhone,
    SettingForAccountTwitter,
    SettingForAccountFacebook,
    SettingForAccountPassword
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    CutEditType (type, name) {
      this.EditType = type
      this.$emit('TitleChange', name)
    },
    Cancel () {
      this.EditType = null
      this.$emit('TitleChange', 'Account')
    },
    TitleChange (e) {
      this.$emit('TitleChange', e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
