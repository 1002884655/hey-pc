<template>
  <div class="components NewAccountOperation" v-show="Show">
    <div class="centerLabel">
      <div class="Title flex-h">
        <span class="flex-item">{{ReturnTitle()}}</span>
        <a class="iconfont iconguanbi" @click="ClosePopup"></a>
      </div>

      <!-- 登录 -->
      <div class="Form" v-if="Type === 1">

        <div class="LineTitle flex-h">
          <span class="flex-item">Username or email address</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.SignIn.AccountTips !== null}">
          <input type="text" class="flex-item" v-model="FormData.SignIn.Account" @input="CheckAccount">
          <i class="iconfont icondui Success" v-if="FormData.SignIn.AccountCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.SignIn.AccountTips !== null"></i>
        </div>
        <span class="Tips">{{FormData.SignIn.AccountTips}}</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">Password</span>
          <a @click="ForgetPassword">Forget your password?</a>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.SignIn.PasswordTips !== null}">
          <input :type="FormData.SignIn.ShowPassword ? 'text' : 'password'" class="flex-item" v-model="FormData.SignIn.Password" @input="InputCheckPassword">
          <i class="iconfont icondui Success" v-if="FormData.SignIn.PasswordCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.SignIn.PasswordTips !== null"></i>
          <a v-if="!FormData.SignIn.ShowPassword" class="iconfont iconxianshi" @click="FormData.SignIn.ShowPassword = true"></a>
          <a v-else class="iconfont iconziyuan" @click="FormData.SignIn.ShowPassword = false"></a>
        </div>
        <span class="Tips">{{FormData.SignIn.PasswordTips}}</span>

        <a class="NextStep" :class="{'active': CheckNextActive()}" @click="NextStep">{{DataLock ? 'Loading...' : 'Sign in'}}</a>

        <div class="LineText">
          <span>New to HeyPorn?</span>
          <a @click="ToCreateAccount">Create account.</a>
        </div>

        <span class="LineTextTips">we'll nevel post without your permission.you agree to our <a href="./privacy.html" target="_self">privacy</a> and <a href="./item.html" target="_self">item</a></span>

      </div>

      <!-- 注册 -->
      <div class="Form" v-if="Type === 2">

        <div class="LineTitle flex-h">
          <span class="flex-item">Email address</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.CreateAccount.EmailTips !== null}">
          <input type="text" class="flex-item" placeholder="Email address" v-model="FormData.CreateAccount.Email" @input="InputCheckEmail">
          <i class="iconfont icondui Success" v-if="FormData.CreateAccount.EmailCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.CreateAccount.EmailTips !== null"></i>
        </div>
        <span class="Tips">{{FormData.CreateAccount.EmailTips}}</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">Username</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.CreateAccount.UsernameTips !== null}">
          <input type="text" class="flex-item" placeholder="Username (6+ characters)" v-model="FormData.CreateAccount.Username" @input="InputCheckUsername">
          <i class="iconfont icondui Success" v-if="FormData.CreateAccount.UsernameCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.CreateAccount.UsernameTips !== null"></i>
        </div>
        <span class="Tips">{{FormData.CreateAccount.UsernameTips}}</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">Password</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.CreateAccount.PasswordTips !== null}">
          <input :type="FormData.CreateAccount.ShowPassword ? 'text' : 'password'" class="flex-item" placeholder="Password (6+ characters)" v-model="FormData.CreateAccount.Password" @input="InputCheckPassword">
          <i class="iconfont icondui Success" v-if="FormData.CreateAccount.PasswordCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.CreateAccount.PasswordTips !== null"></i>
          <a v-if="!FormData.CreateAccount.ShowPassword" class="iconfont iconxianshi" @click="FormData.CreateAccount.ShowPassword = true"></a>
          <a v-else class="iconfont iconziyuan" @click="FormData.CreateAccount.ShowPassword = false"></a>
        </div>
        <span class="Tips">{{FormData.CreateAccount.PasswordTips}}</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">Confirm password</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.CreateAccount.PasswordAgainTips !== null}">
          <input :type="FormData.CreateAccount.ShowPassword ? 'text' : 'password'" class="flex-item" placeholder="Password (6+ characters)" v-model="FormData.CreateAccount.PasswordAgain" @input="InputCheckPasswordAgain">
          <i class="iconfont icondui Success" v-if="FormData.CreateAccount.PasswordAgainCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.CreateAccount.PasswordAgainTips !== null"></i>
          <a v-if="!FormData.CreateAccount.ShowPassword" class="iconfont iconxianshi" @click="FormData.CreateAccount.ShowPassword = true"></a>
          <a v-else class="iconfont iconziyuan" @click="FormData.CreateAccount.ShowPassword = false"></a>
        </div>
        <span class="Tips">{{FormData.CreateAccount.PasswordAgainTips}}</span>

        <a class="NextStep" :class="{'active': CheckNextActive()}" @click="NextStep">{{DataLock ? 'Loading...' : 'Create account'}}</a>

        <div class="LineText">
          <span>I already have an account?</span>
          <a @click="ToSignIn">To sign in.</a>
        </div>

        <span class="LineTextTips">By clicking "Sign up for HeyPorn". you agree to our <a href="./privacy.html" target="_self">privacy</a> and <a href="./item.html" target="_self">item</a></span>

      </div>

      <!-- 邮箱验证 -->
      <div class="Form" v-if="Type === 3">

        <span class="TextTips">Enter your user account's verified email address and we'll send code to confirm that this email belongs to you.</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">Email address</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.CheckEmail.EmailTips !== null}">
          <input type="text" class="flex-item" v-model="FormData.CheckEmail.Email" @input="InputCheckEmail">
          <i class="iconfont icondui Success" v-if="FormData.CheckEmail.EmailCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.CheckEmail.EmailTips !== null"></i>
        </div>
        <span class="Tips">{{FormData.CheckEmail.EmailTips}}</span>

        <a class="NextStep" :class="{'active': CheckNextActive()}" @click="NextStep">{{DataLock ? 'Loading...' : 'Send code to email'}}</a>

        <div class="LineText">
          <span>I remember my password?</span>
          <a @click="ToSignIn">To sign in.</a>
        </div>

      </div>

      <!-- 验证码验证 -->
      <div class="Form" v-if="Type === 4">

        <span class="TextTips">Let us know this Email belongs to you.We've sent email to {{FormData.CheckEmail.Email}}.</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">Code</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.CheckCode.CodeTips !== null}">
          <input type="text" class="flex-item" v-model="FormData.CheckCode.Code" @input="InputCheckCode">
          <i class="iconfont icondui Success" v-if="FormData.CheckCode.CodeCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.CheckCode.CodeTips !== null"></i>
          <span v-if="CodeTimeNum - 0 !== 60">{{CodeTimeNum}}s</span>
        </div>
        <span class="Tips">{{FormData.CheckCode.CodeTips}}</span>

        <span class="ResetCode" v-if="CodeTimeNum - 0 === 60">Didn't get the captcha? <a @click="ResendCode">Resend</a></span>

        <a class="NextStep" :class="{'active': CheckNextActive()}" @click="NextStep">{{DataLock ? 'Loading...' : 'Next'}}</a>

        <div class="LineText">
          <span>I remember my password?</span>
          <a @click="ToSignIn">To sign in.</a>
        </div>

      </div>

      <!-- 重置密码 -->
      <div class="Form" v-if="Type === 5">

        <div class="LineTitle flex-h">
          <span class="flex-item">Password</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.ResetPassword.PasswordTips !== null}">
          <input :type="FormData.ResetPassword.ShowPassword ? 'text' : 'password'" class="flex-item" placeholder="Password(6+ characters)" v-model="FormData.ResetPassword.Password" @input="InputCheckPassword">
          <i class="iconfont icondui Success" v-if="FormData.ResetPassword.PasswordCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.ResetPassword.PasswordTips !== null"></i>
          <a v-if="!FormData.ResetPassword.ShowPassword" class="iconfont iconxianshi" @click="FormData.ResetPassword.ShowPassword = true"></a>
          <a v-else class="iconfont iconziyuan" @click="FormData.ResetPassword.ShowPassword = false"></a>
        </div>
        <span class="Tips">{{FormData.ResetPassword.PasswordTips}}</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">Confirm password</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.ResetPassword.PasswordAgainTips !== null}">
          <input :type="FormData.ResetPassword.ShowPassword ? 'text' : 'password'" class="flex-item" placeholder="Password(6+ characters)" v-model="FormData.ResetPassword.PasswordAgain" @input="InputCheckPasswordAgain">
          <i class="iconfont icondui Success" v-if="FormData.ResetPassword.PasswordAgainCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.ResetPassword.PasswordAgainTips !== null"></i>
          <a v-if="!FormData.ResetPassword.ShowPassword" class="iconfont iconxianshi" @click="FormData.ResetPassword.ShowPassword = true"></a>
          <a v-else class="iconfont iconziyuan" @click="FormData.ResetPassword.ShowPassword = false"></a>
        </div>
        <span class="Tips">{{FormData.ResetPassword.PasswordAgainTips}}</span>

        <a class="NextStep" :class="{'active': CheckNextActive()}" @click="NextStep">{{DataLock ? 'Loading...' : 'Go Now'}}</a>

        <div class="LineText">
          <span>I remember my password?</span>
          <a @click="ToSignIn">To sign in.</a>
        </div>

      </div>

      <!-- 修改密码 -->
      <div class="Form" v-if="Type === 6">

        <div class="LineTitle flex-h">
          <span class="flex-item">Current Password</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.ChangePassword.OldPasswordTips !== null}">
          <input :type="FormData.ChangePassword.ShowPassword ? 'text' : 'password'" class="flex-item" placeholder="Password(6+ characters)" v-model="FormData.ChangePassword.OldPassword" @input="InputCheckPassword">
          <i class="iconfont icondui Success" v-if="FormData.ChangePassword.OldPasswordCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.ChangePassword.OldPasswordTips !== null"></i>
          <a v-if="!FormData.ChangePassword.ShowPassword" class="iconfont iconxianshi" @click="FormData.ChangePassword.ShowPassword = true"></a>
          <a v-else class="iconfont iconziyuan" @click="FormData.ChangePassword.ShowPassword = false"></a>
        </div>
        <span class="Tips">{{FormData.ChangePassword.OldPasswordTips}}</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">New Password</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.ChangePassword.NewPasswordTips !== null}">
          <input :type="FormData.ChangePassword.ShowPassword ? 'text' : 'password'" class="flex-item" placeholder="Password(6+ characters)" v-model="FormData.ChangePassword.NewPassword" @input="InputCheckPassword('newpassword')">
          <i class="iconfont icondui Success" v-if="FormData.ChangePassword.NewPasswordCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.ChangePassword.NewPasswordTips !== null"></i>
          <a v-if="!FormData.ChangePassword.ShowPassword" class="iconfont iconxianshi" @click="FormData.ChangePassword.ShowPassword = true"></a>
          <a v-else class="iconfont iconziyuan" @click="FormData.ChangePassword.ShowPassword = false"></a>
        </div>
        <span class="Tips">{{FormData.ChangePassword.NewPasswordTips}}</span>

        <div class="LineTitle flex-h">
          <span class="flex-item">Confirm password</span>
        </div>
        <div class="flex-h InputContainer" :class="{'Error': FormData.ChangePassword.NewPasswordAgainTips !== null}">
          <input :type="FormData.ChangePassword.ShowPassword ? 'text' : 'password'" class="flex-item" placeholder="Password(6+ characters)" v-model="FormData.ChangePassword.NewPasswordAgain" @input="InputCheckPasswordAgain">
          <i class="iconfont icondui Success" v-if="FormData.ChangePassword.NewPasswordAgainCheckStatus"></i>
          <i class="iconfont icontanhao Error" v-if="FormData.ChangePassword.NewPasswordAgainTips !== null"></i>
          <a v-if="!FormData.ChangePassword.ShowPassword" class="iconfont iconxianshi" @click="FormData.ChangePassword.ShowPassword = true"></a>
          <a v-else class="iconfont iconziyuan" @click="FormData.ChangePassword.ShowPassword = false"></a>
        </div>
        <span class="Tips">{{FormData.ChangePassword.NewPasswordAgainTips}}</span>

        <a class="NextStep" :class="{'active': CheckNextActive()}" @click="NextStep">{{DataLock ? 'Loading...' : 'Save'}}</a>

      </div>

      <!-- 修改密码成功 -->
      <div class="Form" v-if="Type === 7">
        <div class="CenterBox">
          <span class="BigTitle">Password Changed</span>
          <i class="iconfont iconqueren"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
/*
  账号操作组件（登录、注册、设置密码、找回密码）
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'NewAccountOperation',
  props: {
  },
  data () {
    return {
      FormData: { // 表单数据
        SignIn: { // 登录
          Account: '', // 账号
          AccountTips: null,
          AccountCheckStatus: false,
          ShowPassword: false, // 显隐密码
          Password: '', // 密码
          PasswordTips: null,
          PasswordCheckStatus: false
        },
        CreateAccount: { // 注册
          Email: '', // 邮箱
          EmailTips: null,
          EmailCheckStatus: false,
          Username: '', // 用户名
          UsernameTips: null,
          UsernameCheckStatus: false,
          ShowPassword: false,
          Password: '', // 密码
          PasswordTips: null,
          PasswordCheckStatus: false,
          PasswordAgain: '', // 确认密码
          PasswordAgainTips: null,
          PasswordAgainCheckStatus: false
        },
        CheckEmail: { // 邮箱验证
          Email: '', // 邮箱
          EmailTips: null,
          EmailCheckStatus: false
        },
        CheckCode: { // 验证码验证
          Code: '', // 验证码
          CodeTips: null,
          CodeCheckStatus: false
        },
        ResetPassword: { // 重置密码
          ShowPassword: false, // 显隐密码
          Password: '', // 密码
          PasswordCheckStatus: false,
          PasswordTips: null,
          PasswordAgain: '', // 确认密码
          PasswordAgainTips: null,
          PasswordAgainCheckStatus: false
        },
        ChangePassword: { // 修改密码
          ShowPassword: false, // 显隐密码
          OldPassword: '', // 原密码
          OldPasswordCheckStatus: false,
          OldPasswordTips: null,
          NewPassword: '', // 新密码
          NewPasswordCheckStatus: false,
          NewPasswordTips: null,
          NewPasswordAgain: '', // 新密码确认
          NewPasswordAgainCheckStatus: false,
          NewPasswordAgainTips: null
        }
      },
      CodeLock: false, // 发送验证码数据锁
      CodeTimer: null, // 验证码计时器
      CodeTimeNum: 60, // 验证码倒计时计数
      InputCheckTimer: null, // 输入校验计时器
      NextActive: false, // 下一步按钮状态
      DataLock: false, // 数据锁
      Show: false, // 显隐弹窗
      Type: 1 // 类型 1-登录 2-注册 3-邮箱验证 4-验证码验证 5-重置密码 6-修改密码 7-修改密码完成
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
    this.Init() // 初始化
  },
  mounted () {
    this.$nextTick(() => {
      this.ToolClass.DocumentKeyDown((e) => { // 绑定回车键下一步功能
        if (e.keyCode === 13) { // Enter键
          if (this.Show) {
            this.NextStep()
          }
        }
      })
      window.setTimeout(() => {
        if (this.FormData.SignIn.Account !== '') {
          this.FormData.SignIn.AccountCheckStatus = true
          this.FormData.SignIn.AccountTips = null
        }
        if (this.FormData.SignIn.Password !== '') {
          let PasswordTips = this.RuleForPassword(this.FormData.SignIn.Password)
          if (PasswordTips === 'legal') { // 格式合法
            this.FormData.SignIn.PasswordCheckStatus = true
            this.FormData.SignIn.PasswordTips = null
          } else {
            this.FormData.SignIn.PasswordCheckStatus = false
            this.FormData.SignIn.PasswordTips = PasswordTips
          }
        }
      }, 300)
    })
  },
  methods: {
    ...mapUserActions([
      'ChangePassword', // 修改密码
      'ResetPassword', // 重置密码
      'ResetCheckCode', // 校验邮箱验证码
      'ForgotPassword', // 忘记密码发送验证码
      'NewRegister', // 新版本注册
      'NewLogin', // 新版本登录
      'GetUserInfoByToken', // token获取用户信息
      'CheckUserNameExist', // 校验用户名是否存在
      'CheckEmailExist' // 校验邮箱是否存在
    ]),
    Init () { // 初始化
      if (this.$localStorage.get('heypornid') !== null) { // 检测本地localStorage是否存有用户token信息（heypornid）
        this.GetUserInfoCommand() // 根据token获取用户信息
      } else { // 无token
        this.$emit('UserInfoChange') // 组件抛出“用户信息更新”回调
      }
    },
    InputCheckCode () { // 输入验证码校验
      if (this.Type === 4) {
        this.FormData.CheckCode.CodeCheckStatus = this.FormData.CheckCode.Code !== ''
      }
    },
    ForgetPassword () { // 忘记密码
      this.ResetFormData(this.FormData.CheckEmail)
      this.Type = 3
      this.ResetFormData(this.FormData.SignIn)
    },
    CheckStepActive (target) { // 校验某一步是否可以下一步
      let Bool = true
      for (let key in target) {
        if (key.indexOf('Status') !== -1 && target[key] === false) {
          Bool = false
        }
      }
      return Bool
    },
    CheckNextActive () { // 校验是否可以下一步
      if (this.Type === 1) {
        return this.CheckStepActive(this.FormData.SignIn) && !this.DataLock
      } else if (this.Type === 2) {
        return this.CheckStepActive(this.FormData.CreateAccount) && !this.DataLock
      } else if (this.Type === 3) {
        return this.CheckStepActive(this.FormData.CheckEmail) && !this.DataLock
      } else if (this.Type === 4) {
        return this.CheckStepActive(this.FormData.CheckCode) && !this.DataLock
      } else if (this.Type === 5) {
        return this.CheckStepActive(this.FormData.ResetPassword) && !this.DataLock
      } else if (this.Type === 6) {
        return this.CheckStepActive(this.FormData.ChangePassword) && !this.DataLock
      }
    },
    InputCheckPasswordAgain () { // 校验再次输入密码
      window.clearTimeout(this.InputCheckTimer)
      if (this.Type === 2) { // 注册
        if (this.FormData.CreateAccount.Password === '') { // 密码为空
          this.FormData.CreateAccount.PasswordCheckStatus = false
          this.FormData.CreateAccount.PasswordTips = 'Please set the password first'
        }
        if (this.FormData.CreateAccount.PasswordAgainTips !== null || this.FormData.CreateAccount.PasswordAgainCheckStatus) {
          this.FormData.CreateAccount.PasswordAgainTips = 'Checking...'
        }
        this.FormData.CreateAccount.PasswordAgainCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.CreateAccount.PasswordAgain === this.FormData.CreateAccount.Password) {
            this.FormData.CreateAccount.PasswordAgainCheckStatus = true
            this.FormData.CreateAccount.PasswordAgainTips = null
          } else {
            this.FormData.CreateAccount.PasswordAgainTips = 'Password is different'
          }
        }, 500)
      } else if (this.Type === 5) { // 重置密码
        if (this.FormData.ResetPassword.Password === '') { // 密码为空
          this.FormData.ResetPassword.PasswordCheckStatus = false
          this.FormData.ResetPassword.PasswordTips = 'Please set the password first'
        }
        if (this.FormData.ResetPassword.PasswordAgainTips !== null || this.FormData.ResetPassword.PasswordAgainCheckStatus) {
          this.FormData.ResetPassword.PasswordAgainTips = 'Checking...'
        }
        this.FormData.ResetPassword.PasswordAgainCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.ResetPassword.PasswordAgain === this.FormData.ResetPassword.Password) {
            this.FormData.ResetPassword.PasswordAgainCheckStatus = true
            this.FormData.ResetPassword.PasswordAgainTips = null
          } else {
            this.FormData.ResetPassword.PasswordAgainTips = 'Password is different'
          }
        }, 500)
      } else if (this.Type === 6) { // 修改密码
        if (this.FormData.ChangePassword.NewPassword === '') { // 密码为空
          this.FormData.ChangePassword.NewPasswordCheckStatus = false
          this.FormData.ChangePassword.NewPasswordTips = 'Please set the password first'
        }
        if (this.FormData.ChangePassword.NewPasswordAgainTips !== null || this.FormData.ChangePassword.NewPasswordAgainCheckStatus) {
          this.FormData.ChangePassword.NewPasswordAgainTips = 'Checking...'
        }
        this.FormData.ChangePassword.NewPasswordAgainCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.ChangePassword.NewPasswordAgain === this.FormData.ChangePassword.NewPassword) {
            this.FormData.ChangePassword.NewPasswordAgainCheckStatus = true
            this.FormData.ChangePassword.NewPasswordAgainTips = null
          } else {
            this.FormData.ChangePassword.NewPasswordAgainTips = 'Password is different'
          }
        }, 500)
      }
    },
    InputCheckUsername () { // 输入校验用户名
      window.clearTimeout(this.InputCheckTimer)
      if (this.Type === 2) { // 注册
        if (this.FormData.CreateAccount.UsernameTips !== null || this.FormData.CreateAccount.UsernameCheckStatus) {
          this.FormData.CreateAccount.UsernameTips = 'Checking...'
        }
        this.FormData.CreateAccount.UsernameCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.CreateAccount.Username.length < 6 || this.FormData.CreateAccount.Username.length > 18) { // 用户名字符长度校验不通过
            this.FormData.CreateAccount.UsernameTips = 'The username should be between 6 and 18 digits long'
          } else { // 用户名字符长度校验通过
            // let Reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/
            let Reg = /^[a-zA-Z0-9]{1,20}$/
            if (Reg.test(this.FormData.CreateAccount.Username)) { // 用户名格式校验通过
              this.CheckUserNameExist({ params: { name: this.FormData.CreateAccount.Username } }).then((res) => {
                if (res.data.data - 0) { // 存在此用户名
                  this.FormData.CreateAccount.UsernameTips = 'User name has been registered'
                } else { // 不存在此用户名
                  this.FormData.CreateAccount.UsernameCheckStatus = true
                  this.FormData.CreateAccount.UsernameTips = null
                }
              })
            } else { // 用户名格式校验不通过
              this.FormData.CreateAccount.UsernameTips = 'Username must be numbers and letters'
            }
          }
        }, 500)
      }
    },
    InputCheckEmail () { // 输入校验邮箱
      window.clearTimeout(this.InputCheckTimer)
      if (this.Type === 2) { // 注册
        if (this.FormData.CreateAccount.EmailTips !== null || this.FormData.CreateAccount.EmailCheckStatus) { // 已走校验逻辑的状态下显示“校验中”状态
          this.FormData.CreateAccount.EmailTips = 'Checking...'
        }
        this.FormData.CreateAccount.EmailCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.CreateAccount.Email !== '') {
            if (this.ToolClass.CheckEmail(this.FormData.CreateAccount.Email)) { // 校验邮箱是否可以注册
              this.CheckEmailExist({ params: { email: this.FormData.CreateAccount.Email } }).then((res) => {
                if (res.data.data - 0) { // 存在此邮箱
                  this.FormData.CreateAccount.EmailCheckStatus = false
                  this.FormData.CreateAccount.EmailTips = 'Email has been registered'
                } else { // 不存在此邮箱
                  this.FormData.CreateAccount.EmailCheckStatus = true
                  this.FormData.CreateAccount.EmailTips = null
                }
              })
            } else { // 邮箱格式校验不通过
              this.FormData.CreateAccount.EmailCheckStatus = false
              this.FormData.CreateAccount.EmailTips = 'Invalid email format'
            }
          } else {
            this.FormData.CreateAccount.EmailCheckStatus = false
            this.FormData.CreateAccount.EmailTips = null
          }
        }, 500)
      } else if (this.Type === 3) { // 邮箱验证
        if (this.FormData.CheckEmail.EmailTips !== null || this.FormData.CheckEmail.EmailCheckStatus) { // 已走校验逻辑的状态下显示“校验中”状态
          this.FormData.CheckEmail.EmailTips = 'Checking...'
        }
        this.FormData.CheckEmail.EmailCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.CheckEmail.Email !== '') {
            if (this.ToolClass.CheckEmail(this.FormData.CheckEmail.Email)) { // 校验邮箱是否可以注册
              this.CheckEmailExist({ params: { email: this.FormData.CheckEmail.Email } }).then((res) => {
                if (res.data.data - 0) { // 存在此邮箱
                  this.FormData.CheckEmail.EmailCheckStatus = true
                  this.FormData.CheckEmail.EmailTips = null
                } else { // 不存在此邮箱
                  this.FormData.CheckEmail.EmailTips = 'Email does not exist'
                }
              })
            } else { // 邮箱格式校验不通过
              this.FormData.CheckEmail.EmailTips = 'Invalid email format'
            }
          } else {
            this.FormData.CheckEmail.EmailTips = null
          }
        }, 500)
      }
    },
    ClosePopup () { // 关闭弹窗
      this.Show = false
      this.Type = 1
      for (let n in this.FormData) {
        this.ResetFormData(this.FormData[n])
      }
    },
    ToSignIn () { // 去登录
      this.ResetFormData(this.FormData.SignIn) // 重置登录数据
      this.Type = 1
      if (this.Type === 2) { // 创建账号步骤--->登录
        this.ResetFormData(this.FormData.CreateAccount) // 重置创建账号数据
      } else if (this.Type === 3) { // 邮箱验证--->登录
        this.ResetFormData(this.FormData.CheckEmail) // 重置邮箱验证数据
      } else if (this.Type === 4) { // 验证码验证--->登录
        this.ResetFormData(this.FormData.CheckEmail) // 重置邮箱验证数据
        this.ResetFormData(this.FormData.CheckCode) // 重置验证码验证数据
      } else if (this.Type === 5) { // 重置密码--->登录
        this.ResetFormData(this.FormData.CheckEmail) // 重置邮箱验证数据
        this.ResetFormData(this.FormData.CheckCode) // 重置验证码验证数据
        this.ResetFormData(this.FormData.ResetPassword) // 重置重置密码数据
      }
    },
    ToCreateAccount () { // 去创建账号
      this.ResetFormData(this.FormData.CreateAccount) // 重置创建账号数据
      this.Type = 2
      this.ResetFormData(this.FormData.SignIn) // 重置登录数据
    },
    InputCheckPassword (type) { // 校验密码格式
      window.clearTimeout(this.InputCheckTimer)
      if (this.Type === 1) { // 登录
        if (this.FormData.SignIn.Account === '') { // 账号为空时
          this.FormData.SignIn.AccountCheckStatus = false
          this.FormData.SignIn.AccountTips = 'The account cannot be empty'
        }
        if (this.FormData.SignIn.PasswordTips !== null || this.FormData.SignIn.PasswordCheckStatus) {
          this.FormData.SignIn.PasswordTips = 'Checking...'
        }
        this.FormData.SignIn.PasswordCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.SignIn.Password !== '') { // 密码不为空时
            let PasswordTips = this.RuleForPassword(this.FormData.SignIn.Password)
            if (PasswordTips === 'legal') { // 格式合法
              this.FormData.SignIn.PasswordCheckStatus = true
              this.FormData.SignIn.PasswordTips = null
            } else {
              this.FormData.SignIn.PasswordCheckStatus = false
              this.FormData.SignIn.PasswordTips = PasswordTips
            }
          } else { // 密码为空时
            this.FormData.SignIn.PasswordCheckStatus = false
            this.FormData.SignIn.PasswordTips = null
          }
        }, 500)
      } else if (this.Type === 2) { // 注册
        if (this.FormData.CreateAccount.PasswordTips !== null || this.FormData.CreateAccount.PasswordCheckStatus) {
          this.FormData.CreateAccount.PasswordTips = 'Checking...'
        }
        this.FormData.CreateAccount.PasswordCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.CreateAccount.Password !== '') { // 密码不为空时
            let PasswordTips = this.RuleForPassword(this.FormData.CreateAccount.Password)
            if (PasswordTips === 'legal') { // 格式合法
              this.FormData.CreateAccount.PasswordCheckStatus = true
              this.FormData.CreateAccount.PasswordTips = null
              if (this.FormData.CreateAccount.PasswordAgain !== '') {
                this.InputCheckPasswordAgain()
              }
            } else {
              this.FormData.CreateAccount.PasswordCheckStatus = false
              this.FormData.CreateAccount.PasswordTips = PasswordTips
            }
          } else { // 密码为空时
            this.FormData.CreateAccount.PasswordCheckStatus = false
            this.FormData.CreateAccount.PasswordTips = null
          }
        }, 500)
      } else if (this.Type === 5) { // 重置密码
        if (this.FormData.ResetPassword.PasswordTips !== null || this.FormData.ResetPassword.PasswordCheckStatus) {
          this.FormData.ResetPassword.PasswordTips = 'Checking...'
        }
        this.FormData.ResetPassword.PasswordCheckStatus = false
        this.InputCheckTimer = window.setTimeout(() => {
          if (this.FormData.ResetPassword.Password !== '') { // 密码不为空时
            let PasswordTips = this.RuleForPassword(this.FormData.ResetPassword.Password)
            if (PasswordTips === 'legal') { // 格式合法
              this.FormData.ResetPassword.PasswordCheckStatus = true
              this.FormData.ResetPassword.PasswordTips = null
            } else {
              this.FormData.ResetPassword.PasswordCheckStatus = false
              this.FormData.ResetPassword.PasswordTips = PasswordTips
            }
          } else { // 密码为空时
            this.FormData.ResetPassword.PasswordCheckStatus = false
            this.FormData.ResetPassword.PasswordTips = null
          }
        }, 500)
      } else if (this.Type === 6) { // 修改密码密码
        if (type === 'newpassword') { // 新密码校验
          if (this.FormData.ChangePassword.NewPasswordTips !== null || this.FormData.ChangePassword.NewPasswordCheckStatus) {
            this.FormData.ChangePassword.NewPasswordTips = 'Checking...'
          }
          this.FormData.ChangePassword.NewPasswordCheckStatus = false
          this.InputCheckTimer = window.setTimeout(() => {
            if (this.FormData.ChangePassword.NewPassword !== '') { // 密码不为空时
              let NewPasswordTips = this.RuleForPassword(this.FormData.ChangePassword.NewPassword)
              if (NewPasswordTips === 'legal') { // 格式合法
                if (this.FormData.ChangePassword.NewPassword !== this.FormData.ChangePassword.OldPassword) {
                  this.FormData.ChangePassword.NewPasswordCheckStatus = true
                  this.FormData.ChangePassword.NewPasswordTips = null
                } else {
                  this.FormData.ChangePassword.NewPasswordCheckStatus = false
                  this.FormData.ChangePassword.NewPasswordTips = 'The old and new passwords cannot be the same'
                }
              } else {
                this.FormData.ChangePassword.NewPasswordCheckStatus = false
                this.FormData.ChangePassword.NewPasswordTips = NewPasswordTips
              }
            } else { // 密码为空时
              this.FormData.ChangePassword.NewPasswordCheckStatus = false
              this.FormData.ChangePassword.NewPasswordTips = null
            }
          }, 500)
        } else { // 原密码校验
          if (this.FormData.ChangePassword.OldPasswordTips !== null || this.FormData.ChangePassword.OldPasswordCheckStatus) {
            this.FormData.ChangePassword.OldPasswordTips = 'Checking...'
          }
          this.FormData.ChangePassword.OldPasswordCheckStatus = false
          this.InputCheckTimer = window.setTimeout(() => {
            if (this.FormData.ChangePassword.OldPassword !== '') { // 密码不为空时
              let OldPasswordTips = this.RuleForPassword(this.FormData.ChangePassword.OldPassword)
              if (OldPasswordTips === 'legal') { // 格式合法
                this.FormData.ChangePassword.OldPasswordCheckStatus = true
                this.FormData.ChangePassword.OldPasswordTips = null
              } else {
                this.FormData.ChangePassword.OldPasswordCheckStatus = false
                this.FormData.ChangePassword.OldPasswordTips = OldPasswordTips
              }
            } else { // 密码为空时
              this.FormData.ChangePassword.OldPasswordCheckStatus = false
              this.FormData.ChangePassword.OldPasswordTips = null
            }
          }, 500)
        }
      }
    },
    RuleForPassword (target) { // 密码格式校验
      // let Reg = /^[0-9a-zA-Z]*$/
      // if (!Reg.test(target)) { // 非字母+数字组合
      //   return 'Password must be numbers and letters'
      // }
      if (target.length < 6 || target.length > 18) { // 长度6-18位
        return 'The password should be between 6 and 18 digits long'
      }
      return 'legal' // 格式合法
    },
    CheckAccount () { // 校验账户是否存在
      window.clearTimeout(this.InputCheckTimer)
      this.InputCheckTimer = window.setTimeout(() => {
        if (this.FormData.SignIn.Account !== '') {
          this.FormData.SignIn.AccountCheckStatus = true
          this.FormData.SignIn.AccountTips = null
          // if (this.FormData.SignIn.AccountTips !== null || this.FormData.SignIn.AccountCheckStatus) {
          //   this.FormData.SignIn.AccountTips = 'Checking...'
          // }
          // this.FormData.SignIn.AccountCheckStatus = false
          // this.InputCheckTimer = window.setTimeout(() => {
          //   if (this.ToolClass.CheckEmail(this.FormData.SignIn.Account)) { // 邮箱校验
          //     this.CheckEmailExist({ params: { email: this.FormData.SignIn.Account } }).then((res) => {
          //       if (res.data.data - 0) { // 存在此邮箱
          //         this.FormData.SignIn.AccountCheckStatus = true
          //         this.FormData.SignIn.AccountTips = null
          //       } else { // 不存在此邮箱
          //         this.FormData.SignIn.AccountCheckStatus = false
          //         this.FormData.SignIn.AccountTips = 'Email does not exist'
          //       }
          //     })
          //   } else { // 用户名校验
          //     if (this.FormData.SignIn.Account.length >= 6 && this.FormData.SignIn.Account.length <= 18) {
          //       let Reg = /^[0-9a-zA-Z]*$/
          //       if (Reg.test(this.FormData.SignIn.Account)) { // 非字母+数字组合
          //         this.CheckUserNameExist({ params: { name: this.FormData.SignIn.Account } }).then((res) => {
          //           if (res.data.data - 0) { // 存在此用户名
          //             this.FormData.SignIn.AccountCheckStatus = true
          //             this.FormData.SignIn.AccountTips = null
          //           } else { // 不存在此用户名
          //             this.FormData.SignIn.AccountTips = 'Username does not exist'
          //           }
          //         })
          //       } else {
          //         this.FormData.SignIn.AccountTips = 'Username must be numbers and letters'
          //       }
          //     } else {
          //       this.FormData.SignIn.AccountTips = 'The username should be between 6 and 18 digits long'
          //     }
          //   }
          // }, 500)
        } else {
          window.clearTimeout(this.InputCheckTimer)
          this.FormData.SignIn.AccountCheckStatus = false
          if (this.FormData.SignIn.Password !== '') { // 密码不为空时提示“账号不能为空”
            this.FormData.SignIn.AccountTips = 'The account cannot be empty'
          } else {
            this.FormData.SignIn.AccountTips = null
          }
        }
      }, 500)
    },
    ResetFormData (target) { // 重置表单数据
      for (let key in target) {
        if (key.indexOf('Show') !== -1 || key.indexOf('Status') !== -1) {
          target[key] = false
        } else if (key.indexOf('Tips') !== -1) {
          target[key] = null
        } else {
          target[key] = ''
        }
      }
    },
    GetUserInfoCommand (callback) { // 根据token获取用户信息
      this.DataLock = true // 数据请求状态锁定（防多次触发）
      this.GetUserInfoByToken({ // 根据token获取用户信息
        params: { token: this.$localStorage.get('heypornid') }
      }).then(() => {
        if (this.UserInfo === null) { // 用户信息获取失败
          this.$localStorage.remove('heypornid') // 移除token
        }
        this.DataLock = false //  // 数据请求状态解除锁定
        this.$emit('UserInfoChange') // 组件抛出“用户信息更新”回调
        if (callback !== undefined) {
          callback() // 回调
        }
      }).catch(() => { // 获取用户信息报错
        this.DataLock = false //  // 数据请求状态解除锁定
        this.$emit('UserInfoChange') // 组件抛出“用户信息更新”回调
      })
    },
    ToLogin (type) { // 去登录
      this.NewLogin({ data: { info: this.FormData.SignIn.Account, password: this.FormData.SignIn.Password } }).then((res) => {
        this.GetUserInfoByToken({ // 根据token获取用户信息
          params: { token: res.data.data.token }
        }).then((subRes) => {
          this.$notify.success({ title: 'success', message: res.data.msg })
          this.$emit('UserInfoChange') // 组件抛出“用户信息更新”回调
          this.DataLock = false //  // 数据请求状态解除锁定
          if (type === 'FormReg') {
            this.$emit('RegEnd')
          }
          this.ClosePopup()
        }).catch((subRes) => { // 获取用户信息报错
          this.$notify.error({ title: 'error', message: subRes.data.msg })
          this.$emit('UserInfoChange') // 组件抛出“用户信息更新”回调
          this.DataLock = false //  // 数据请求状态解除锁定
        })
        this.$localStorage.set('heypornid', res.data.data.token) // token写入本地
      }).catch((res) => {
        this.$notify.error({ title: 'error', message: res.data.msg })
        this.FormData.SignIn.PasswordCheckStatus = false
        this.FormData.SignIn.PasswordTips = res.data.msg
        this.DataLock = false
      })
    },
    SetCodeInterval () { // 验证码倒计时
      window.clearInterval(this.CodeTimer)
      this.CodeTimer = window.setInterval(() => {
        if (this.CodeTimeNum - 0) {
          this.CodeTimeNum = this.CodeTimeNum - 1 > 9 ? `${this.CodeTimeNum - 1}` : `0${this.CodeTimeNum - 1}`
        } else {
          window.clearInterval(this.CodeTimer)
          this.CodeTimeNum = 60
        }
      }, 1000)
    },
    ResendCode () { // 发送验证码
      if (!this.CodeLock) {
        this.CodeLock = true
        this.ForgotPassword({ info: this.FormData.CheckEmail.Email }).then((res) => {
          if (res.data.code - 0 === 1026) { // 发送成功
            this.ResetFormData(this.FormData.CheckCode)
            this.Type = 4
            this.SetCodeInterval() // 验证码倒计时
          } else {
            this.$notify.error({ title: 'error', message: res.data.msg })
          }
          this.CodeLock = false
          this.DataLock = false
        }).catch((res) => {
          this.CodeLock = false
          this.DataLock = false
          this.$notify.error({ title: 'error', message: res.data.msg })
        })
      }
    },
    NextStep () { // 下一步
      if (this.CheckNextActive() && !this.DataLock) {
        this.DataLock = true
        if (this.Type === 1) { // 登录
          this.ToLogin() // 去登录
        } else if (this.Type === 2) { // 注册
          let Data = {
            email: this.FormData.CreateAccount.Email,
            name: this.FormData.CreateAccount.Username,
            password: this.FormData.CreateAccount.Password,
            rePassword: this.FormData.CreateAccount.PasswordAgain
          }
          if (this.ToolClass.GetUrlParams('referrerUserId') !== false) {
            Data.referrerUserId = this.ToolClass.GetUrlParams('referrerUserId')
          }
          this.NewRegister({ data: Data }).then((res) => { // 新版本注册
            this.$notify.success({ title: 'success', message: 'Register successfully' })
            this.FormData.SignIn.Account = this.FormData.CreateAccount.Email
            this.FormData.SignIn.Password = this.FormData.CreateAccount.Password
            this.ToLogin('FormReg') // 去登录
          }).catch((res) => {
            this.$notify.error({ title: 'error', message: res.data.msg })
            this.DataLock = false
          })
        } else if (this.Type === 3) { // 邮箱验证
          this.ResendCode() // 发送验证码
        } else if (this.Type === 4) { // 验证码验证
          this.ResetCheckCode({ info: this.FormData.CheckEmail.Email, checkCode: this.FormData.CheckCode.Code }).then((res) => {
            if (res.data.code - 0 === 1025) { // 验证码通过
              this.Type = 5
              this.ResetFormData(this.FormData.CheckCode)
            } else if (res.data.code - 0 === 1020 || res.data.code - 0 === 1024) { // 验证码错误or失效
              this.FormData.CheckCode.CodeCheckStatus = false
              this.FormData.CheckCode.CodeTips = 'Invalid or incorrect'
            } else { // 其他错误
              this.$notify.error({ title: 'error', message: res.data.msg })
            }
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({ title: 'error', message: res.data.msg })
            this.DataLock = false
          })
        } else if (this.Type === 5) { // 重置密码
          this.ResetPassword({
            info: this.FormData.CheckEmail.Email,
            password: this.FormData.ResetPassword.Password
          }).then((res) => {
            if (res.data.code - 0 === 1029) { // 重置密码成功
              this.$notify.success({ title: 'success', message: 'Reset successfully' })
              this.Type = 1
              this.ResetFormData(this.FormData.ResetPassword)
              this.ResetFormData(this.FormData.CheckEmail)
            } else { // 其他错误
              this.$notify.error({ title: 'error', message: res.data.msg })
            }
            this.DataLock = false // 数据请求状态解锁
          }).catch(() => {
            this.DataLock = false // 数据请求状态解锁
          })
        } else if (this.Type === 6) { // 修改密码
          this.ChangePassword({
            data: {
              oldPassword: this.FormData.ChangePassword.OldPassword,
              password: this.FormData.ChangePassword.NewPassword,
              rePassword: this.FormData.ChangePassword.NewPasswordAgain,
              userId: this.UserInfo.id
            }
          }).then((res) => {
            this.Type = 7
            this.ResetFormData(this.FormData.ChangePassword)
            this.DataLock = false // 数据请求状态解锁
          }).catch((res) => {
            this.$notify.error({ title: 'error', message: res.data.msg })
            this.DataLock = false // 数据请求状态解锁
          })
        }
      }
    },
    ReturnTitle () { // 返回标题
      let Title = ''
      switch (this.Type) {
        case 1:
          Title = 'Sign in to HeyPorn'
          break
        case 2:
          Title = 'Create account'
          break
        case 3:
          Title = 'Reset your password'
          break
        case 4:
          Title = 'Reset your password'
          break
        case 5:
          Title = 'Reset your password'
          break
        case 6:
          Title = 'Change password'
          break
        default:
          Title = ''
      }
      return Title
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
