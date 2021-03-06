import Axios from 'axios'
import Api from '../../util/Api'

export default {
  namespaced: true,
  state: {
    VideoRankingList: [], // 视频搜索排名
    SearchVideoList: [], // 搜索视频列表
    ClassVideoList: [], // 分类视频列表
    SearchRandomKey: '' // 随机搜索词
  },
  mutations: {
    SetRandomSearchKey (state, data) { // 写入随机搜索关键词
      state.SearchRandomKey = data.title || ''
    },
    SetSearchVideoList (state, data) { // 写入搜索视频
      let Arr = data || []
      Arr.map((item) => {
        state.SearchVideoList.push({ ...item, WatchLater: false })
      })
    },
    EditSearchVideoList (state, data) { // 编辑搜索视频
      state.SearchVideoList[data.index][data.name] = data.value
    },
    EmptySearchVideoList (state) { // 清空搜索视频
      state.SearchVideoList = []
    },
    SetVideoRankingList (state, data) { // 写入视频搜索排名
      state.VideoRankingList = data || []
    },
    SetClassVideoList (state, data) { // 写入分类视频列表
      let Arr = data || []
      Arr.map((item) => {
        state.ClassVideoList.push({ ...item, WatchLater: false })
      })
    },
    EditClassVideoList (state, data) { // 编辑分类视频
      state.ClassVideoList[data.index][data.name] = data.value
    },
    EmptyClassVideoList (state) { // 清空分类视频列表
      state.ClassVideoList = []
    }
  },
  actions: {
    GetRandomSearchKey (context) { // 获取随机搜索关键词
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Common.RandomSearchKey.method,
          url: Api.Common.RandomSearchKey.url
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('SetRandomSearchKey', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetSearchFilter (context) { // 获取搜索过滤器
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetSearchFilter.method,
          url: Api.Video.GetSearchFilter.url
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetSearchVideoList (context, payload) { // 获取搜索视频
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetSearchVideoList.method,
          url: Api.Video.GetSearchVideoList.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('SetSearchVideoList', res.data.data.list)
          } else {
            context.commit('EmptySearchVideoList')
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetVideoRankingList (context, payload) { // 视频搜索排名
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetVideoRankingList.method,
          url: Api.Video.GetVideoRankingList.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('SetVideoRankingList', res.data.data.list)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetClassVideoList (context, payload) { // 获取分类视频列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetClassVideoList.method,
          url: Api.Video.GetClassVideoList.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('SetClassVideoList', res.data.data.list)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    }
  }
}
