
import Api from '../../util/Api'
import ToolClass from '../../util/PublicMethod'

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    ChangeUserName (context, payload) { // 修改username登录名
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.ChangeUserName, context, payload, 0)
      })
    },
    SendCode (context, payload) { // 发送修改邮箱验证码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.SendCode, context, payload, 0)
      })
    },
    ChangeEamil (context, payload) { // 校验验证码，并修改邮箱
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.ChangeEamil, context, payload, 0)
      })
    },
    ChangePhone (context, payload) { // 修改电话
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.ChangePhone, context, payload, 0)
      })
    },
    ChangeHomepage (context, payload) { // 修改社交主页链接
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.ChangeHomepage, context, payload, 0)
      })
    },
    ChangePassword (context, payload) { // 修改密码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.ChangePassword, context, payload, 0)
      })
    },
    SendForgetCode (context, payload) { // 发送修改忘记密码时的验证码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.SendForgetCode, context, payload, 0)
      })
    },
    ChangeForgetPassword (context, payload) { // 忘记密码时，修改密码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.ChangeForgetPassword, context, payload, 0)
      })
    },
    GetAuthInfo (context, payload) { // 获取用户认证信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.GetAuthInfo, context, payload, 0)
      })
    },
    ChangeAuthInfo (context, payload) { // 修改用户认证信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Setting.ChangeAuthInfo, context, payload, 0)
      })
    }
  }
}
