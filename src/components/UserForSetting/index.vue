<template>
  <div class="components UserForSetting">

    <!-- nav -->
    <nav class="NavList">
      <a v-for="(item, index) in NavList" :key="index" :class="{'active': NavActiveIndex === index}" @click="CutNav(index)">{{item.Value}}</a>
    </nav>

    <!-- content -->
    <div class="CutContent">

      <!-- Information -->
      <div class="UserSettingForInformation" v-if="NavActiveIndex - 0 === 0">
        <UserSettingForInformation></UserSettingForInformation>
      </div>

      <!-- Security center -->
      <div class="UserSettingForSecurityCenter" v-if="NavActiveIndex - 0 === 1">
        <span class="NoOpen">The function is not open yet</span>
        <!-- <UserSettingForSecurityCenter></UserSettingForSecurityCenter> -->
      </div>

      <!-- Pay -->
      <div class="UserSettingForPay" v-if="NavActiveIndex - 0 === 2">
        <UserSettingForPay></UserSettingForPay>
      </div>

      <!-- Privacy Settings -->
      <div class="UserSettingForPrivacySettings" v-if="NavActiveIndex - 0 === 3">
        <UserSettingForPrivacySettings></UserSettingForPrivacySettings>
      </div>

      <!-- Preferences -->
      <div class="UserSettingForPreferences" v-if="NavActiveIndex - 0 === 4">
        <UserSettingForPreferences></UserSettingForPreferences>
      </div>

    </div>
  </div>
</template>

<script>
/*
  页面名称：用户中心-Setting组件
  创建人：许成祥
  创建时间：2020/01/07
  最近修改人：许成祥
  最近修改日期：2020/01/09
  备注： 无
*/
import UserSettingForInformation from '../UserSettingForInformation'
import UserSettingForSecurityCenter from '../UserSettingForSecurityCenter'
import UserSettingForPay from '../UserSettingForPay'
import UserSettingForPrivacySettings from '../UserSettingForPrivacySettings'
import UserSettingForPreferences from '../UserSettingForPreferences'
export default {
  name: 'UserForSetting',
  props: ['data'],
  data () {
    return {
      NavActiveIndex: this.ToolClass.GetUrlParams('ustype') === false ? 0 : this.ToolClass.GetUrlParams('ustype') - 0, // nav索引值
      NavList: [ // nav列表
        { Value: 'Information', Id: '1' },
        { Value: 'Security center', Id: '2' },
        { Value: 'Pay', Id: '3' },
        { Value: 'Privacy Settings', Id: '4' },
        { Value: 'Preferences', Id: '5' }
      ]
    }
  },
  computed: {
  },
  components: {
    UserSettingForInformation,
    UserSettingForSecurityCenter,
    UserSettingForPay,
    UserSettingForPrivacySettings,
    UserSettingForPreferences
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    CutNav (index) { // 切换nav
      this.NavActiveIndex = index
      window.history.replaceState({}, '', `?type=6&ustype=${index}`) // 同步url参数
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
