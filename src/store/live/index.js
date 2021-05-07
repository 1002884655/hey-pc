
import Api from '../../util/Api'
import ToolClass from '../../util/PublicMethod'

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    GetLiverRoomToken (context, payload) { // 获取直播房间token
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.GetLiverRoomToken, context, payload, 0)
      })
    },
    CreateLiveRoom (context, payload) { // 创建直播房间
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.CreateLiveRoom, context, payload, 0)
      })
    },
    LiveStart (context, payload) { // 开播
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.LiveStart, context, payload, 0)
      })
    },
    LiveStop (context, payload) { // 下播
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.LiveStop, context, payload, 0)
      })
    },
    CreateChatRoom (context, payload) { // 创建直播间聊天室
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.CreateChatRoom, context, payload, 0)
      })
    },
    GetLivingRoomInfo (context, payload) { // 获取正在直播的房间信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.GetLivingRoomInfo, context, payload, 0)
      })
    },
    CloseLiveChatRoom (context, payload) { // 销毁直播聊天室
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.CloseLiveChatRoom, context, payload, 0)
      })
    },
    GetLiveRoomGiftsDetailsList (context, payload) { // 获取直播间礼物打赏详情列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.GetLiveRoomGiftsDetailsList, context, payload, 0)
      })
    },
    GetChatRoomUsersList (context, payload) { // 获取聊天室用户列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Live.GetChatRoomUsersList, context, payload, 0)
      })
    }
  }
}
