import Axios from 'axios'
import Api from '../../util/Api'

export default {
  namespaced: true,
  state: {
    HomeBannerList: [], // 首页banner
    HomeChannelList: [], // 首页频道列表
    HomePieceGroupList: [], // 首页播单列表
    HotVideoList: [], // 热门视频列表
    FeaturedVideoList: [], // 精选视频列表
    VideoDetails: null, // 编辑视频信息
    MediaInfo: null, // 视频信息
    CommentList: [], // 视频评论列表
    TotalCommentCounts: 0, // 视频总评论数
    VideoRecommendList: [], // 推荐视频列表
    HotVideoListForDay: [], // 视频日排行
    AccountVideoCollectionList: [] // 用户上传视频集合
  },
  mutations: {
    EmptyCommentList (state) { // 清空评论数据
      state.CommentList = []
    },
    EditMediaInfo (state, data) { // 修改视频信息
      state.MediaInfo = { ...state.MediaInfo, ...data }
    },
    SetMediaInfo (state, data) { // 写入视频信息
      state.MediaInfo = data || null
    },
    TriggerMainCommentText (state, data) { // 显隐全部主评论内容
      state.CommentList[data].ShowAllText = !state.CommentList[data].ShowAllText
    },
    TriggerSubCommentText (state, data) { // 显隐全部2级评论内容
      state.CommentList[data[0]].List[data[1]].ShowAllText = !state.CommentList[data[0]].List[data[1]].ShowAllText
    },
    AddMainComment (state, data) { // 静态增加视频评论内容
      state.TotalCommentCounts += 1
      state.CommentList.unshift({
        UserIcon: 'self',
        UserName: 'self',
        CreateDate: Date.now(),
        LikesCounts: 0,
        ShowReplyList: false,
        Text: data.content,
        Id: data.id,
        ReplyNum: 0,
        PageNum: 1,
        List: [],
        ShowAllText: false
      })
    },
    SetCommentList (state, data) { // 赋值评论数据
      data = data.list || []
      data.map((item) => {
        state.CommentList.push({
          UserIcon: item.picPath1,
          UserName: item.accountName,
          CreateDate: item.createTime,
          LikesCounts: item.likeNum,
          ShowReplyList: false,
          Text: item.content,
          Id: item.id,
          ReplyNum: item.replyNum,
          PageNum: 1,
          List: [],
          ShowAllText: false
        })
      })
    },
    SetTotalCommentCounts (state, data) { // 赋值评论总数
      state.TotalCommentCounts = data || 0
    },
    PushSubCommentList (state, data) { // 插入二级回复列表
      let index = data.location
      data.data.list.map((item) => {
        state.CommentList[index].List.unshift({
          UserIcon: item.picPath1,
          UserName: item.accountName,
          AccountId: item.accountId,
          CreateDate: item.createTime,
          LikesCounts: item.likeNum,
          Text: item.content,
          Id: item.id,
          ReplyName: item.atName,
          ReplyId: item.atId,
          ShowAllText: false
        })
      })
    },
    UpdateLevel1PageNum (state, data) { // 更新一级评论分页数
      data.setNum(state.CommentList[data.index].PageNum)
    },
    AddSubComment (state, data) { // 静态插入一二级评论回复
      state.CommentList[data.index].ReplyNum += 1
      state.CommentList[data.index].List.push({
        UserIcon: 'self',
        UserName: 'self',
        CreateDate: Date.now(),
        LikesCounts: 0,
        Text: data.data.content,
        Id: 'self',
        ReplyName: data.data.level - 0 === 1 ? null : data.data.atName,
        ReplyId: data.data.level - 0 === 1 ? null : data.data.atId
      })
    },
    AddVideoRecommend (state, data) { // 插入推荐视频数据
      data = data.list || []
      state.VideoRecommendList = []
      data.map((item) => {
        state.VideoRecommendList.push({ ...item, WatchLater: false })
      })
    },
    EmptyVideoRecommend (state) { // 清空推荐视频数据
      state.VideoRecommendList = []
    },
    EditVideoRecommend (state, data) { // 编辑推荐视频数据
      state.VideoRecommendList[data.index][data.name] = data.value
    },
    AddHotVideoListForDay (state, data) { // 插入视频日排行数据
      state.HotVideoListForDay = data || []
    },
    AddAccountVideoCollection (state, data) { // 插入用户上传视频集合数据
      let Arr = (data || []).slice(0, 8)
      state.AccountVideoCollectionList = []
      Arr.map((item) => {
        state.AccountVideoCollectionList.push({ ...item, WatchLater: false })
      })
    },
    EditAccountVideoCollection (state, data) { // 编辑用户上传视频集合数据
      state.AccountVideoCollectionList[data.index][data.name] = data.value
    },
    EmptyAccountVideoCollection (state, data) { // 清空用户上传视频集合数据
      state.AccountVideoCollectionList = []
    },
    UpdateVideoDetails (state, data) { // 更新编辑视频信息
      state.VideoDetails = data || null
    },
    UpdateFeaturedVideoList (state, data) { // 更新精选视频列表
      state.FeaturedVideoList = []
      data.list.map((item) => {
        state.FeaturedVideoList.push({ ...item, WatchLater: false })
      })
    },
    EmptyFeaturedVideoList (state) { // 清空精选视频列表
      state.FeaturedVideoList = []
    },
    UpdateHotVideoList (state, data) { // 更新热门视频列表
      state.HotVideoList = []
      data.list.map((item) => {
        state.HotVideoList.push({ ...item, WatchLater: false })
      })
    },
    EmptyHotdVideoList (state) { // 清空热门视频列表
      state.HotVideoList = []
    },
    UpdateHomePieceGroupList (state, data) { // 更新热门视频列表
      state.HomePieceGroupList = data.list || []
    },
    UpdateHomeChannelList (state, data) { // 更新首页频道列表
      state.HomeChannelList = data || []
    },
    UpdateHomeBannerList (state, data) { // 更新首页banner
      state.HomeBannerList = data || []
    }
  },
  actions: {
    GetIndexLiveHls (context, payload) { // 获取首页直播流
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetIndexLiveHls.method,
          url: Api.Video.GetIndexLiveHls.url,
          ...payload
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetTestVideoInfo (context, payload) { // 获取播放视频信息（管理员）
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetTestVideoInfo.method,
          url: Api.Video.GetTestVideoInfo.url + payload.urlData,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch((res) => {
          reject(res)
        })
      })
    },
    PopularMore (context, payload) { // 最受欢迎视频列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.PopularMore.method,
          url: Api.Video.PopularMore.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch((res) => {
          reject(res)
        })
      })
    },
    NewestMore (context, payload) { // 最新视频列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.NewestMore.method,
          url: Api.Video.NewestMore.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch((res) => {
          reject(res)
        })
      })
    },
    MostLikeMore (context, payload) { // 最多播放视频列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.MostLikeMore.method,
          url: Api.Video.MostLikeMore.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetHomeBanner (context, payload) { // 获取首页banner
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetHomeBanner.method,
          url: Api.Video.GetHomeBanner.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('UpdateHomeBannerList', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetHomeChannel (context, payload) { // 获取首页频道列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetHomeChannel.method,
          url: Api.Video.GetHomeChannel.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('UpdateHomeChannelList', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetHomePieceGroup (context, payload) { // 获取首页播单列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetHomePieceGroup.method,
          url: Api.Video.GetHomePieceGroup.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('UpdateHomePieceGroupList', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetHotVideoList (context, payload) { // 获取热门视频列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetHotVideoList.method,
          url: Api.Video.GetHotVideoList.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('UpdateHotVideoList', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetFeaturedVideoList (context, payload) { // 获取精选视频列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetFeaturedVideoList.method,
          url: Api.Video.GetFeaturedVideoList.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('UpdateFeaturedVideoList', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetVideoDetails (context, payload) { // 获取编辑视频信息
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetVideoDetails.method,
          url: Api.Video.GetVideoDetails.url,
          ...payload
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('UpdateVideoDetails', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetAccountVideoCollection (context, payload) { // 获取用户上传视频集合
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetAccountVideoCollection.method,
          url: Api.Video.GetAccountVideoCollection.url,
          params: { ...payload }
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('AddAccountVideoCollection', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetHotVideoListForDay (context, payload) { // 获取视频日排行
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetHotVideoListForDay.method,
          url: Api.Video.GetHotVideoListForDay.url,
          params: { ...payload }
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('AddHotVideoListForDay', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetVideoRecommend (context, payload) { // 获取推荐视频
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetVideoRecommend.method,
          url: Api.Video.GetVideoRecommend.url,
          params: { ...payload }
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('AddVideoRecommend', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    SubmitSubComment (context, payload) { // 提交一二级评论
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.SubmitSubComment.method,
          url: Api.Video.SubmitSubComment.url,
          data: { ...payload.data }
        }).then(res => {
          if (res.data.code - 0 === 0 && payload.index !== undefined) {
            context.commit('AddSubComment', payload)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetSubCommentList (context, payload) { // 获取二级评论列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetCommentList.method,
          url: Api.Video.GetCommentList.url,
          params: { ...(payload.query || {}) },
          data: { ...(payload.data || {}) }
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('PushSubCommentList', { data: res.data.data, location: payload.location })
            resolve(res)
          } else {
            reject(res)
          }
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetCommentTotalCounts (context, payload) { // 获取视频评论列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetCommentTotalCounts.method,
          url: Api.Video.GetCommentTotalCounts.url,
          params: { ...payload }
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('SetTotalCommentCounts', res.data.data.totalCount)
            resolve(res)
          } else {
            reject(res)
          }
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetCommentList (context, payload) { // 获取视频评论列表
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetCommentList.method,
          url: Api.Video.GetCommentList.url,
          params: { ...(payload.query || {}) },
          data: { ...(payload.data || {}) }
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('SetCommentList', res.data.data)
            resolve(res)
          } else {
            reject(res)
          }
        }).catch((res) => {
          reject(res)
        })
      })
    },
    SubmitCommentForVideo (context, payload) { // 提交视频评论
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.SubmitCommentForVideo.method,
          url: Api.Video.SubmitCommentForVideo.url,
          data: { ...payload }
        }).then(res => {
          if (res.data.code - 0 === 0) {
            context.commit('AddMainComment', { ...payload, id: res.data.data.id })
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetMediaInfoById (context, payload) { // 通过id获取视频信息
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.Video.GetMediaInfoById.method,
          url: Api.Video.GetMediaInfoById.url + payload.id,
          params: { ...payload.params }
        }).then(res => {
          if (res.data.code - 0 === 0 || res.data.code - 0 === 2031) {
            context.commit('SetMediaInfo', res.data.data)
          }
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    }
  }
}
