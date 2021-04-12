
import Api from '../../util/Api'
import ToolClass from '../../util/PublicMethod'

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    GetSgsDictList (context, payload) { // 获取认证相关字典列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.GetSgsDictList, context, payload, 0)
      })
    },
    GetSgsInfo (context, payload) { // 获取认证信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.GetSgsInfo, context, payload, 0)
      })
    },
    SendEmailCode (context, payload) { // 发送邮箱验证码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.SendEmailCode, context, payload, 0)
      })
    },
    CheckEmailCode (context, payload) { // 校验邮箱验证码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.CheckEmailCode, context, payload, 0)
      })
    },
    ChangeEmail (context, payload) { // 修改邮箱
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.ChangeEmail, context, payload, 0)
      })
    },
    SecondSgs (context, payload) { // 第二步认证
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.SecondSgs, context, payload, 0)
      })
    },
    GetCountryList (context, payload) { // 获取国家列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.GetCountryList, context, payload, 0)
      })
    },
    ThirdSgs (context, payload) { // 第三步认证
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.ThirdSgs, context, payload, 0)
      })
    },
    ConfirmSgs (context, payload) { // 确认认证
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.ConfirmSgs, context, payload, 0)
      })
    },
    StopSgs (context, payload) { // 终止认证
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.StopSgs, context, payload, 0)
      })
    },
    ResetSgs (context, payload) { // 重置认证（第三步）
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Sgs.ResetSgs, context, payload, 0)
      })
    }
  }
}
