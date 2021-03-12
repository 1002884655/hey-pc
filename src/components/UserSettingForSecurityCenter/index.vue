<template>
  <div class="components UserSettingForSecurityCenter">

    <!-- 绑定状态列表 -->
    <ul class="BindList">
      <li class="flex-h">
        <span>
          <i class="iconfont iconshouji-"></i>
          <span>Phone</span>
        </span>
        <div class="flex-item">
          <span>{{UserInfo.mobileBinding - 0 === 0 ? 'unbind' : 'binded'}}</span>
        </div>
        <a>{{UserInfo.mobileBinding - 0 === 0 ? 'bind' : 'unbind'}}</a>
      </li>
      <li class="flex-h">
        <span>
          <i class="iconfont iconhebingxingzhuang"></i>
          <span>Email</span>
        </span>
        <div class="flex-item">
          <span>{{UserInfo.emailBinding - 0 === 0 ? 'unbind' : 'binded'}}</span>
        </div>
        <a>{{UserInfo.emailBinding - 0 === 0 ? 'bind' : 'unbind'}}</a>
      </li>
      <li class="flex-h">
        <span>
          <i class="iconfont iconmima"></i>
          <span>Password</span>
        </span>
        <div class="flex-item">
          <span>{{UserInfo.pwdStatus - 0 === 0 ? 'unbind' : 'binded'}}</span>
        </div>
        <a>{{UserInfo.pwdStatus - 0 === 0 ? 'bind' : 'modification'}}</a>
      </li>
    </ul>

    <!-- 手机绑定 -->
    <div class="BindPhone BindItem">
      <span>Mobile phone binding</span>

      <div>
        <span class="Title"></span>
        <input type="text" placeholder="Please enter your phone number">
        <span class="Tips">tips</span>
      </div>

      <div>
        <span class="Title">we've send a code to +86 111****2222</span>
        <input type="text" placeholder="Please enter the mobile phone verification code">
        <span class="Tips">tips</span>
        <span class="Resend">Don't receive the code? <a>Resend</a> 99s</span>
      </div>

      <div>
        <span class="Success"><i class="iconfont iconqueren"></i></span>
        <span class="Status">Successfully!</span>
      </div>

      <a class="Next">Next</a>
    </div>

    <!-- 邮箱绑定 -->
    <div class="BindEmail BindItem">
      <span>Email binding</span>

      <div>
        <span class="Title"></span>
        <input type="text" placeholder="Please enter your email">
        <span class="Tips">tips</span>
      </div>

      <div>
        <span class="Title">we've send a code to +86 111****2222</span>
        <input type="text" placeholder="Please enter the email verification code">
        <span class="Tips">tips</span>
        <span class="Resend">Don't receive the code? <a>Resend</a> 99s</span>
      </div>

      <div>
        <span class="Success"><i class="iconfont iconqueren"></i></span>
        <span class="Status">Successfully!</span>
      </div>

      <a class="Next">Next</a>
    </div>

    <!-- 密码绑定 -->
    <div class="BindPassword BindItem">
      <span>Passwords amend</span>

      <div>
        <span class="Title"></span>
        <input type="text" placeholder="Please enter old password">
        <span class="Tips">tips</span>
      </div>

      <div>
        <span class="Title"></span>
        <input type="text" placeholder="Please enter new password">
        <span class="Tips">tips</span>
      </div>

      <div>
        <span class="Success"><i class="iconfont iconqueren"></i></span>
        <span class="Status">Successfully!</span>
      </div>

      <a class="Next">Next</a>
    </div>

  </div>
</template>

<script>
/*
  页面名称：个人中心-用户设置-SecurityCenter
  创建人：许成祥
  创建时间：2020/01/09
  最近修改人：许成祥
  最近修改日期：2020/01/17
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
export default {
  name: 'UserSettingForSecurityCenter',
  props: ['data'],
  data () {
    return {
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
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
