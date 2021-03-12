
import Api from '../../util/Api'
import ToolClass from '../../util/PublicMethod'

export default {
  namespaced: true,
  state: {
    WatchLaterList: [] // 稍后观看列表
  },
  mutations: {
  },
  actions: {
    AddWatchLater (context, payload) { // 添加稍后观看
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.WatchLater.AddWatchLater, context, payload, 0)
      })
    }
  }
}
