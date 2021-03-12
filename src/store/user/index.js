import Axios from 'axios'
import Api from '../../util/Api'
import ToolClass from '../../util/PublicMethod'

export default {
  namespaced: true,
  state: {
    NoticeForMyFans: [], // 我的粉丝通知
    MyVideoLikeList: [], // 我的视频点赞列表
    NoticeForMyDynamicComment: [], // 我的动态评论
    NoticeForMyVideoComment: [], // 我的视频评论
    SystemMsg: [], // 系统消息
    NoticeForMyCommentLike: [], // 我的评论点赞列表
    NoticeForMyDynamicLike: [], // 我的动态点赞列表
    NoticeForMyVideoLike: [], // 我的视频点赞列表
    UserDynamicList: [], // 用户动态列表
    PromoteMonthList: [], // 每月推广详情列表
    PromoteCountForMonth: [], // 每月推广人数列表
    CollectAlbumList: [], // 用户收藏专辑列表
    OtherUserAlbumInfo: null, // 其他用户专辑信息
    CollectForSheetList: [], // 收藏片单列表
    AblumPhotos: [], // 图集下图片列表
    OtherUserSheetInfo: null, // 其他用户片单信息
    VideoAlbumSubList: [], // 视频专辑下视频列表
    MyPieceGroupSubList: [], // 我的片单下视频列表
    MyPieceGroupList: [], // 我的片单列表
    WatchLaterVideoList: [], // 稍后观看列表
    MySubscribeList: [], // 我订阅的用户列表
    SubscribeForMeList: [], // 订阅我的用户列表
    VideoCollectList: [], // 收藏夹下视频列表
    VideoCollectCategoryList: [], // 用户所有收藏夹列表
    PhotoTypes: [], // 图片分类
    PhotoAlbum: [], // 用户图片专辑
    VideoAlbumList: [], // 用户视频专辑列表
    ServiceTypeList: [], // 视频分类列表
    TopActiveFansList: [], // 活跃粉丝列表
    OtherUserInfo: null, // 其他用户信息
    UserInfo: null, // 用户信息
    HistorySearchList: [], // 历史搜索记录
    SearchRankingList: [], // 搜索排名
    LikeTypes: [], // 偏好列表
    UserLikes: [], // 用户偏好
    CollectionList: {
      Positive: [],
      Trailer: [],
      User: [],
      Channel: [],
      Moving: []
    },
    AreaList: { // 地区列表
      FirstClass: [],
      SecondClass: [],
      ThirdClass: []
    },
    LoveList: [], // 用户喜好列表
    AllViewingHistory: [], // 全部观看历史
    ViewingHistory: [], // 观看历史
    EarlierViewingHistory: [] // 更早观看历史
  },
  mutations: {
    UpdateUserCollectionList (state, data) { // 更新用户收藏记录
      if (data.Type - 0 === 1) { // Positive
        state.CollectionList.Positive.splice(data.Index, 1)
      } else if (data.Type - 0 === 2) { // Trailer
        state.CollectionList.Trailer.splice(data.Index, 1)
      } else if (data.Type - 0 === 3) { // User
        state.CollectionList.User.splice(data.Index, 1)
      } else if (data.Type - 0 === 4) { // Channel
        state.CollectionList.Channel.splice(data.Index, 1)
      } else if (data.Type - 0 === 5) { // Moving
        state.CollectionList.Moving.splice(data.Index, 1)
      }
    },
    ClearAllViewingHistory (state) { // 清空用户观看历史
      state.AllViewingHistory = []
    },
    ClearViewingHistory (state) { // 清空用户观看历史
      state.ViewingHistory = []
      state.EarlierViewingHistory = []
    },
    SetUserInfo (state, data) { // 设置用户信息
      state.UserInfo = data === null ? null : { ...data }
    },
    EditUserInfo (state, data) {
      state.UserInfo[data.name] = data.value
    },
    SetAllViewingHistory (state, data) { // 赋值用户观看历史
      let aData = data.list || []
      aData.map((item) => {
        state.AllViewingHistory.push({
          Id: item.id,
          Img: item.frontPath,
          Type: item.funcType,
          ViewingDate: new Date(item.createTime).getTime(),
          Name: item.title,
          ViewingTimeTamp: null,
          TotalTimeTamp: item.length,
          VideoId: item.videoId,
          VideoM: item.videoM,
          VideoChildrenId: item.videoChildrenId,
          UpName: item.upName,
          UpId: item.upId,
          Gif: item.videoPath === null ? null : item.videoPath + 'Image1/index.gif',
          Capacity: item.capacity
        })
      })
    },
    EmptyViewingHistory (state) { // 清空用户观看历史
      state.ViewingHistory = []
    },
    SetViewingHistory (state, data) { // 赋值用户观看历史
      let aData = data.list || []
      aData.map((item) => {
        state.ViewingHistory.push({ ...item, WatchLater: false })
        // if (new Date(item.createTime).getTime() >= Date.now() - 24 * 60 * 60 * 1000 * 7) {
        //   state.ViewingHistory.push({
        //     Id: item.id,
        //     Img: item.frontPath,
        //     Type: item.funcType,
        //     ViewingDate: new Date(item.createTime).getTime(),
        //     Name: item.title,
        //     ViewingTimeTamp: null,
        //     TotalTimeTamp: null,
        //     VideoId: item.videoId,
        //     VideoChildrenId: item.videoChildrenId
        //   })
        // } else {
        //   state.EarlierViewingHistory.push({
        //     Id: item.id,
        //     Img: item.frontPath,
        //     Type: item.funcType,
        //     ViewingDate: new Date(item.createTime).getTime(),
        //     Name: item.title,
        //     ViewingTimeTamp: null,
        //     TotalTimeTamp: null,
        //     VideoId: item.videoId,
        //     VideoChildrenId: item.videoChildrenId
        //   })
        // }
      })
    },
    ClearUserCollectionList (state, data) { // 清空用户收藏记录
      if (data - 0 === 0) { // Positive
        state.CollectionList.Positive = []
      } else if (data - 0 === 1) { // Trailer
        state.CollectionList.Trailer = []
      } else if (data - 0 === 2) { // User
        state.CollectionList.User = []
      } else if (data - 0 === 3) { // Channel
        state.CollectionList.Channel = []
      } else if (data - 0 === 4) { // Moving
        state.CollectionList.Moving = []
      }
    },
    SetUserLikeTypes (state, data) { // 赋值偏好列表
      state.LikeTypes = []
      for (let n in data) {
        state.LikeTypes.push({ TypeName: data[n][0].name, List: data[n].slice(1) })
      }
    },
    SetHistorySearchList (state, data) { // 写入历史搜索记录
      if (data.historyList !== undefined) {
        state.HistorySearchList = []
        data.historyList.map((item) => {
          if (item !== null && item.content.trim()) {
            state.HistorySearchList.push(item)
          }
        })
      }
      if (data.rankingList !== undefined) {
        state.SearchRankingList = data.rankingList || []
      }
    },
    ClearHistorySearchList (state) { // 清空历史搜索记录
      state.HistorySearchList = []
    },
    SetAreaList (state, data) { // 赋值地区列表
      let aData = data.data || []
      if (data.type - 0 === 1) { // 一级地区
        state.AreaList.FirstClass = aData
      } else if (data.type - 0 === 2) { // 二级地区
        state.AreaList.SecondClass = aData
      } else if (data.type - 0 === 3) { // 三级地区
        state.AreaList.ThirdClass = aData
      }
    },
    SetUserLoveType (state, data) { // 赋值用户喜好类型
      state.LoveList = [{ id: null, name: 'Keep secret' }, ...data] || [{ id: null, name: 'Keep secret' }]
    },
    SetUserLikes (state, data) { // 赋值用户偏好
      state.UserLikes = data || []
    },
    UpdateViewingHistory (state, data) { // 更新用户观看历史
      state.ViewingHistory.map((item, index) => {
        if (item.Id === data.ids) {
          state.ViewingHistory.splice(index, 1)
          return false
        }
      })
      state.EarlierViewingHistory.map((item, index) => {
        if (item.Id === data.ids) {
          state.EarlierViewingHistory.splice(index, 1)
          return false
        }
      })
      state.AllViewingHistory.map((item, index) => {
        if (item.Id === data.ids) {
          state.AllViewingHistory.splice(index, 1)
          return false
        }
      })
    },
    UpdateOtherUserInfo (state, data) { // 更新其他用户基本信息
      state.OtherUserInfo = { ...data }
    },
    UpdateServiceTypeList (state, data) { // 更新视频分类信息
      state.ServiceTypeList = []
      data = data || []
      data.map((item) => {
        state.ServiceTypeList.push({ ...item, active: false })
      })
    },
    EditServiceTypeList (state, data) { // 修改视频分类信息
      state.ServiceTypeList[data.index].active = data.active
    },
    UpdatePhotoAlbum (state, data) { // 更新用户图片专辑
      state.PhotoAlbum = data || []
    },
    UpdatePhotoTypes (state, data) { // 更新图片分类信息
      state.PhotoTypes = []
      data = data || []
      data.map((item) => {
        state.PhotoTypes.push({ ...item, active: false })
      })
    },
    EditPhotoTypes (state, data) { // 修改图片分类信息
      state.PhotoTypes[data.index].active = data.active
    },
    UpdateVideoCollectCategory (state, data) { // 更新用户所有视频收藏夹
      let Arr = data || []
      Arr.map((item) => {
        item.Active = false
      })
      state.VideoCollectCategoryList = Arr
    },
    EditVideoCollectCategory (state, data) { // 编辑用户视频收藏夹
      state.VideoCollectCategoryList[data.index][data.name] = data.value
    },
    PushVideoCollectCategory (state, data) { // 新增用户视频收藏夹
      state.VideoCollectCategoryList.splice(1, 0, data)
    },
    SpliceVideoCollectCategory (state, data) { // 删除用户视频收藏夹
      state.VideoCollectCategoryList.splice(data, 1)
    },
    EditVideoCollectCategoryItem (state, data) { // 编辑用户视频收藏夹
      state.VideoCollectCategoryList[data.index].name = data.params.params.name
    },
    UpdateVideoCollectList (state, data) { // 更新收藏夹下视频列表
      data = data.list || []
      let Data = []
      data.map((item) => {
        Data.push({ ...item, active: false })
      })
      state.VideoCollectList = [...Data]
    },
    TriggerVideoCollectListItem (state, data) { // 选择专辑视频
      state.VideoCollectList[data].active = !state.VideoCollectList[data].active
    },
    SelectAllVideoCollectList (state, data) { // 全选专辑视频
      state.VideoCollectList.map((item) => {
        item.active = data
      })
    },
    UpdateMySubscribeList (state, data) { // 更新我订阅的用户列表
      data = data.list || []
      state.MySubscribeList = []
      data.map((item) => {
        state.MySubscribeList.push({ ...item, Active: false })
      })
    },
    EditMySubscribeList (state, data) { // 修改我订阅的用户列表
      state.MySubscribeList[data.Index].Active = data.Active
    },
    UpdateSubscribeForMeList (state, data) { // 更新订阅我的用户列表
      state.SubscribeForMeList = data.list || []
    },
    EditSubscribeForMeList (state, data) { // 修改订阅我的用户列表
      state.SubscribeForMeList[data.Index].subscribeStatus = data.Active
    },
    UpdateWatchLaterVideoList (state, data) { // 更新稍后观看列表
      state.WatchLaterVideoList = data.list || []
    },
    EditWatchLaterVideoList (state, data) { // 修改稍后观看列表
      if (data !== null) {
        state.WatchLaterVideoList.splice(data, 1)
      }
    },
    TriggerPieceGroupList (state, data) { // 选中/取消选中片单
      state.MyPieceGroupList[data.index].Active = data.value || false
      state.MyPieceGroupList[data.index].videoNum = data.value ? state.MyPieceGroupList[data.index].videoNum + 1 : state.MyPieceGroupList[data.index].videoNum - 1
    },
    UploadPieceGroupList (state, data) { // 更新用户片单
      data = data.list || []
      state.MyPieceGroupList = []
      data.map((item) => {
        state.MyPieceGroupList.push({ ...item, Active: false })
      })
    },
    EditPieceGroupList (state, data) { // 编辑用户片单
      state.MyPieceGroupList[data.index][data.name] = data.value
    },
    AddPieceGroupList (state, data) { // 新建用户片单
      state.MyPieceGroupList.unshift({ ...data, Active: false })
    },
    DeletePieceGroupList (state, data) { // 删除用户片单
      state.MyPieceGroupList.splice(data, 1)
    },
    RenamePieceGroupList (state, data) { // 用户片单重命名
      state.MyPieceGroupList[data.index].name = data.params.data.name
    },
    UploadPieceGroupSubList (state, data) { // 更新用户片单列表下视频列表
      data = data.list || []
      let Data = []
      data.map((item) => {
        Data.push({ ...item, active: false, WatchLater: false })
      })
      state.MyPieceGroupSubList = [...Data]
    },
    EditPieceGroupSubList (state, data) { // 编辑用户片单列表下视频列表
      state.MyPieceGroupSubList[data.index][data.name] = data.value
    },
    TriggerPieceGroupSubListItem (state, data) { // 选择片单视频
      state.MyPieceGroupSubList[data].active = !state.MyPieceGroupSubList[data].active
    },
    SelectAllPieceGroupSubList (state, data) { // 全选片单视频
      state.MyPieceGroupSubList.map((item) => {
        item.active = data
      })
    },
    UpdateVideoAlbumList (state, data) { // 更新用户视频专辑信息
      data = data || []
      let Data = []
      data.map((item) => {
        Data.push({ ...item, active: false, MoveActive: false })
      })
      state.VideoAlbumList = [...Data]
    },
    EditVideoAlbumList (state, data) { // 编辑用户视频专辑信息
      state.VideoAlbumList[data.index][data.name] = data.value
    },
    AddVideoAlbumList (state, data) { // 新建用户视频专辑
      state.VideoAlbumList.unshift({ ...data, videoNum: 0 })
      state.VideoAlbumList[0].id = state.VideoAlbumList[0].data.videoAlbumId
    },
    RemoveVideoAlbumListItem (state, data) { // 删除用户视频专辑
      state.VideoAlbumList.splice(data, 1)
    },
    EditVideoAlbumListItem (state, data) { // 编辑用户视频专辑
      state.VideoAlbumList[data.index].name = data.data.data.name
    },
    UploadVideoAlbumSubList (state, data) { // 更新视频专辑下视频列表
      data = data.list || []
      let Data = []
      data.map((item) => {
        Data.push({ ...item, active: false, WatchLater: false })
      })
      state.VideoAlbumSubList = [...Data]
    },
    EditVideoAlbumSubList (state, data) { // 编辑视频专辑下视频列表
      state.VideoAlbumSubList[data.index][data.name] = data.value
    },
    EmptyVideoAlbumSubList (state) { // 清空视频专辑下视频列表
      state.VideoAlbumSubList = []
    },
    TriggerVideoAlbumSubListItem (state, data) { // 选择视频专辑下视频
      state.VideoAlbumSubList[data].active = !state.VideoAlbumSubList[data].active
    },
    SelectAllVideoAlbumSubList (state, data) { // 全选视频专辑
      state.VideoAlbumSubList.map((item) => {
        item.active = data
      })
    },
    UpdateOtherUserSheetInfo (state, data) { // 赋值其他用户片单信息
      state.OtherUserSheetInfo = data || null
    },
    UpdateOtherUserAlbumInfo (state, data) { // 赋值其他用户专辑信息
      state.OtherUserAlbumInfo = data || null
    },
    EditOtherUserSheetInfo (state, data) { // 修改其他用户片单信息
      state.OtherUserSheetInfo = { ...state.OtherUserSheetInfo, ...data }
    },
    EditOtherUserAlbumInfo (state, data) { // 修改其他用户专辑信息
      state.OtherUserAlbumInfo = { ...state.OtherUserAlbumInfo, ...data }
    },
    UpdateAblumPhotos (state, data) { // 更新图集下图片
      data = data.list || []
      state.AblumPhotos = []
      data.map((item) => {
        state.AblumPhotos.push({ ...item, active: false })
      })
    },
    TriggerPhotoAlbumSubListItem (state, data) { // 选择图集下图片
      state.AblumPhotos[data].active = !state.AblumPhotos[data].active
    },
    SelectAllPhotoAlbumSubList (state, data) { // 全选图集
      state.AblumPhotos.map((item) => {
        item.active = data
      })
    },
    UpdateCollectForSheetList (state, data) { // 修改其他用户片单信息
      state.CollectForSheetList = data.list || []
    },
    UpDateCollectAlbumList (state, data) { // 更新用户收藏专辑
      state.CollectAlbumList = data.list || []
    },
    DeletePhotoAlbum (state, data) { // 删除用户图片专辑
      state.PhotoAlbum.splice(data, 1)
    },
    EditPhotoAlbum (state, data) { // 编辑图片专辑
      state.PhotoAlbum[data.index][data.name] = data.value
    },
    UpdatePromoteCountForMonth (state, data) { // 更新每月推广人数列表
      data = data.list || []
      data.map((item) => {
        item.Show = false
      })
      state.PromoteCountForMonth = data || []
    },
    EmptyPromoteCountForMonth (state, data) { // 清空每月推广人数列表
      state.PromoteCountForMonth = []
    },
    EditPromoteCountForMonth (state, data) { // 编辑每月推广人数列表
      state.PromoteCountForMonth[data.index][data.name] = data.value
    },
    UpdatePromoteMonthList (state, data) { // 更新每月推广详情列表
      data = data.list || []
      data.map((item) => {
        state.PromoteMonthList.push(item)
      })
    },
    EmptyPromoteMonthList (state, data) { // 清空每月推广详情列表
      state.PromoteMonthList = []
    },
    UpdateUserDynamicList (state, data) { // 更新用户动态列表
      data = data.list || []
      data.map((item) => {
        state.UserDynamicList.push({ ...item })
      })
    },
    EmptyUserDynamicList (state, data) { // 清空用户动态列表
      state.UserDynamicList = []
    },
    UpdateNoticeForMyVideoLike (state, data) { // 更新我的视频点赞列表
      state.NoticeForMyVideoLike = data.list || []
    },
    UpdateNoticeForMyDynamicLike (state, data) { // 更新我的动态点赞列表
      state.NoticeForMyDynamicLike = data.list || []
    },
    UpdateNoticeForMyCommentLike (state, data) { // 更新我的评论点赞列表
      state.NoticeForMyCommentLike = data.list || []
    },
    UpdateSystemMsg (state, data) { // 更新系统消息
      state.SystemMsg = data.list || []
    },
    EmptySystemMsg (state) { // 清空系统消息
      state.SystemMsg = []
    },
    UpdateNoticeForMyVideoComment (state, data) { // 更新我的视频评论
      state.NoticeForMyVideoComment = data.list || []
    },
    EmptyNoticeForMyVideoComment (state) { // 清空我的视频评论
      state.NoticeForMyVideoComment = []
    },
    UpdateNoticeForMyDynamicComment (state, data) { // 更新我的动态评论
      state.NoticeForMyDynamicComment = data.list || []
    },
    EmptyNoticeForMyDynamicComment (state) { // 清空我的动态评论
      state.NoticeForMyDynamicComment = []
    },
    UpdateNoticeForMyFans (state, data) { // 更新我的粉丝通知
      state.NoticeForMyFans = data.list || []
    },
    EmptyNoticeForMyFans (state) { // 清空我的粉丝通知
      state.NoticeForMyFans = []
    },
    EditNoticeForMyFans (state, data) { // 编辑我的粉丝通知
      state.NoticeForMyFans[data.index][data.name] = data.value
    }
  },
  actions: {
    GetMyVideoList (context, payload) { // 获取我的上传视频列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetMyVideoList, context, payload, 0)
      })
    },
    GetOtherVideoList (context, payload) { // 获取别人的上传视频列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetOtherVideoList, context, payload, 0)
      })
    },
    CheckIp (context, payload) { // 校验ip地址
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CheckIp, context, payload, 0)
      })
    },
    GetDownloadUrl (context, payload) { // 获取下载链接
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.Common.GetDownloadUrl, context, payload, 0)
      })
    },
    GetLiveRoomBillDetail (context, payload) { // 获取直播收入详情
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetLiveRoomBillDetail, context, payload, 0)
      })
    },
    GetPayCard (context, payload) { // 获取信用卡
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPayCard, context, payload, 0)
      })
    },
    BindBankCard (context, payload) { // 绑定银行卡
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.BindBankCard, context, payload, 0)
      })
    },
    GetUserBindCard (context, payload) { // 获取用户绑定银行卡列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserBindCard, context, payload, 0)
      })
    },
    GetPayInfoCity (context, payload) { // 获取支付城市代码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPayInfoCity, context, payload, 0)
      })
    },
    GetPayInfoCountry (context, payload) { // 获取支付国家代码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPayInfoCountry, context, payload, 0)
      })
    },
    PayForOrder (context, payload) { // 支付订单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.PayForOrder, context, payload, 0)
      })
    },
    GetOrderInfo (context, payload) { // 获取订单信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetOrderInfo, context, payload, 0)
      })
    },
    CreateOrder (context, payload) { // 创建订单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CreateOrder, context, payload, 0)
      })
    },
    CashMoney (context, payload) { // 提现
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CashMoney, context, payload, 0)
      })
    },
    GetRechargeList (context, payload) { // 获取充值列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetRechargeList, context, payload, 0)
      })
    },
    GetWithdrawList (context, payload) { // 获取提现列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetWithdrawList, context, payload, 0)
      })
    },
    GetIncomeList (context, payload) { // 获取收入列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetIncomeList, context, payload, 0)
      })
    },
    GetFansIncomeList (context, payload) { // 获取粉丝收入列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetFansIncomeList, context, payload, 0)
      })
    },
    GetLiveIncomeList (context, payload) { // 获取直播收入列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetLiveIncomeList, context, payload, 0)
      })
    },
    GetExpenseBill (context, payload) { // 获取消费记录
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetExpenseBill, context, payload, 0)
      })
    },
    PayForHeyCoin (context, payload) { // 充值虚拟币
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.PayForHeyCoin, context, payload, 0)
      })
    },
    GetHeyCoinList (context, payload) { // 获取虚拟币商品列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetHeyCoinList, context, payload, 0)
      })
    },
    GetMyClubMembers (context, payload) { // 获取粉丝团成员
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetMyClubMembers, context, payload, 0)
      })
    },
    GetUserFollowingClubs (context, payload) { // 获取用户加入的粉丝团
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserFollowingClubs, context, payload, 0)
      })
    },
    SetFansClubPrice (context, payload) { // 设置粉丝团价格
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.SetFansClubPrice, context, payload, 0)
      })
    },
    GetFansClubSetPrice (context, payload) { // 获取粉丝团价格设置区间
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetFansClubSetPrice, context, payload, 0)
      })
    },
    RevokeExitFansClub (context, payload) { // 撤销退出付费粉丝团
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RevokeExitFansClub, context, payload, 0)
      })
    },
    ExitFansClub (context, payload) { // 退出付费粉丝团
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.ExitFansClub, context, payload, 0)
      })
    },
    JoinFansClub (context, payload) { // 加入付费粉丝团
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.JoinFansClub, context, payload, 0)
      })
    },
    GetLiveRoomInfo (context, payload) { // 获取直播间信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetLiveRoomInfo, context, payload, 0)
      })
    },
    GetChatRoomBlockList (context, payload) { // 获取聊天室黑名单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetChatRoomBlockList, context, payload, 0)
      })
    },
    GetChatRoomShutupList (context, payload) { // 获取聊天室禁言名单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetChatRoomShutupList, context, payload, 0)
      })
    },
    GetLiveRoomList (context, payload) { // 获取直播间列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetLiveRoomList, context, payload, 0)
      })
    },
    PostLiveGift (context, payload) { // 发直播礼物
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.PostLiveGift, context, payload, 0)
      })
    },
    GetUserLiveToken (context, payload) { // 获取用户直播token
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserLiveToken, context, payload, 0)
      })
    },
    GetGiftList (context, payload) { // 获取直播礼物列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetGiftList, context, payload, 0)
      })
    },
    GetRangeOfPrice (context, payload) { // 获取视频价格范围
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetRangeOfPrice, context, payload, 0)
      })
    },
    PayForVideo (context, payload) { // 购买视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.PayForVideo, context, payload, 0)
      })
    },
    GetUserLiveUrl (context, payload) { // 获取用户直播地址
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserLiveUrl, context, payload, 0)
      })
    },
    GetNoticeCount (context, payload) { // 获取通知数量
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetNoticeCount, context, payload, 0)
      })
    },
    GetNoticeForMyFans (context, payload) { // 获取我的粉丝通知
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetNoticeForMyFans, context, payload, 0, 'UpdateNoticeForMyFans')
      })
    },
    MsgReaded (context, payload) { // 消息已读
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.MsgReaded, context, payload, 0)
      })
    },
    GetMyVideoLikeList (context, payload) { // 获取我的视频点赞列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetMyVideoLikeList, context, payload, 0)
      })
    },
    GetNoticeForMyDynamicComment (context, payload) { // 获取我的动态评论
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetNoticeForMyDynamicComment, context, payload, 0, 'UpdateNoticeForMyDynamicComment')
      })
    },
    GetNoticeForMyVideoComment (context, payload) { // 获取我的视频评论
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetNoticeForMyVideoComment, context, payload, 0, 'UpdateNoticeForMyVideoComment')
      })
    },
    GetSystemMsg (context, payload) { // 获取系统消息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetSystemMsg, context, payload, 0, 'UpdateSystemMsg')
      })
    },
    GetNoticeForMyCommentLike (context, payload) { // 获取我的评论点赞
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetNoticeForMyCommentLike, context, payload, 0, 'UpdateNoticeForMyCommentLike')
      })
    },
    GetNoticeForMyDynamicLike (context, payload) { // 获取我的动态点赞
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetNoticeForMyDynamicLike, context, payload, 0, 'UpdateNoticeForMyDynamicLike')
      })
    },
    GetNoticeForMyVideoLike (context, payload) { // 获取我的视频点赞
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetNoticeForMyVideoLike, context, payload, 0, 'UpdateNoticeForMyVideoLike')
      })
    },
    GetUserRanking (context, payload) { // 获取用户排行榜
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserRanking, context, payload, 0)
      })
    },
    PushDynamic (context, payload) { // 发推
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.PushDynamic, context, payload, 2062)
      })
    },
    GetMyDynamic (context, payload) { // 获取我的相关动态
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetMyDynamic, context, payload, 0)
      })
    },
    DynamicLike (context, payload) { // 动态点赞
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DynamicLike, context, payload, 0)
      })
    },
    DeleteOtherUserComment (context, payload) { // 发推人删除其他用户的评论
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DeleteOtherUserComment, context, payload, 0)
      })
    },
    DeleteUserComment (context, payload) { // 用户删除自己的评论
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DeleteUserComment, context, payload, 0)
      })
    },
    DeleteUserDynamic (context, payload) { // 用户删除动态
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DeleteUserDynamic, context, payload, 2064)
      })
    },
    PushDynamicLevel1Comment (context, payload) { // 发送动态一级评论
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.PushDynamicLevel1Comment, context, payload, 0)
      })
    },
    GetDynamicLevel1Comment (context, payload) { // 获取动态一级评论
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetDynamicLevel1Comment, context, payload, 0)
      })
    },
    GetDynamicLevel2Comment (context, payload) { // 获取动态二级评论
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetDynamicLevel2Comment, context, payload, 0)
      })
    },
    GetUserDynamic (context, payload) { // 获取用户动态
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserDynamic, context, payload, 0, 'UpdateUserDynamicList')
      })
    },
    CheckPlaylist (context, payload) { // 校验片单视频是否存在
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CheckPlaylist, context, payload, 0)
      })
    },
    CheckCategory (context, payload) { // 校验视频收藏是否存在
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CheckCategory, context, payload, 0)
      })
    },
    UploadBackground (context, payload) { // 上传背景图
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.UploadBackground, context, payload, 0)
      })
    },
    ChangePassword (context, payload) { // 修改密码
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.ChangePassword, context, payload, 0)
      })
    },
    NewRegister (context, payload) { // 新版本注册
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.NewRegister, context, payload, 0)
      })
    },
    NewLogin (context, payload) { // 新版本登录
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.NewLogin, context, payload, 0)
      })
    },
    CheckEmailExist (context, payload) { // 校验邮箱是否存在
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CheckEmailExist, context, payload, 0)
      })
    },
    CheckUserNameExist (context, payload) { // 校验用户名是否存在
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CheckUserNameExist, context, payload, 0)
      })
    },
    GetPromoteMonthList (context, payload) { // 获取每月推广详情列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPromoteMonthList, context, payload, 0, 'UpdatePromoteMonthList')
      })
    },
    GetPromoteCountForMonth (context, payload) { // 获取每月推广人数列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPromoteCountForMonth, context, payload, 0, 'UpdatePromoteCountForMonth')
      })
    },
    GetPromoteTotalCount (context, payload) { // 获取推广总人数
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPromoteTotalCount, context, payload, 0)
      })
    },
    GetPromoteUrl (context, payload) { // 获取推广链接
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPromoteUrl, context, payload, 0)
      })
    },
    RemovePhotoAlbum (context, payload) { // 删除图片专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RemovePhotoAlbum, context, payload.params, 3018, 'DeletePhotoAlbum', payload.index)
      })
    },
    EditPhotoAlbum (context, payload) { // 编辑图片专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.EditPhotoAlbum, context, payload, 3022)
      })
    },
    GetWatchLaterNum (context, payload) { // 获取稍后观看列表数量
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetWatchLaterNum, context, payload, 0)
      })
    },
    GetAlbumPage (context, payload) { // 获取用户收藏专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetAlbumPage, context, payload, 0, 'UpDateCollectAlbumList')
      })
    },
    RemoveCollectVideoAlbum (context, payload) { // 移除收藏专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RemoveCollectVideoAlbum, context, payload, 0)
      })
    },
    CollectVideoAlbum (context, payload) { // 收藏专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CollectVideoAlbum, context, payload, 0)
      })
    },
    GetVideoAlbumDetails (context, payload) { // 获取专辑详情
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetVideoAlbumDetails, context, payload, 0, 'UpdateOtherUserAlbumInfo')
      })
    },
    GetAlbumPageVideos (context, payload) { // 获取专辑下视频列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetAlbumPageVideos, context, payload, 0, 'UploadVideoAlbumSubList')
      })
    },
    GetCollectForSheet (context, payload) { // 获取收藏片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetCollectForSheet, context, payload, 0, 'UpdateCollectForSheetList')
      })
    },
    EditVideoDetails (context, payload) { // 移动图集
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.EditVideoDetails, context, payload, 0)
      })
    },
    MoveAlbumPhotos (context, payload) { // 移动图集
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.MoveAlbumPhotos, context, payload, 3025)
      })
    },
    ChangeCoverPhotoAlbum (context, payload) { // 更换图集封面
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.ChangeCoverPhotoAlbum, context, payload, 3022)
      })
    },
    RemoveAblumPhotos (context, payload) { // 删除图集下图片
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RemoveAblumPhotos, context, payload, 3012)
      })
    },
    GetAblumPhotos (context, payload) { // 获取图集下图片
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetAblumPhotos, context, payload, 0, 'UpdateAblumPhotos')
      })
    },
    RemoveCollectPieceGroup (context, payload) { // 取消收藏片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RemoveCollectPieceGroup, context, payload, 0)
      })
    },
    CollectPieceGroup (context, payload) { // 收藏片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CollectPieceGroup, context, payload, 0)
      })
    },
    GetOtherUserPieceGroup (context, payload) { // 获取其他用户片单信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetOtherUserPieceGroup, context, payload, 0, 'UpdateOtherUserSheetInfo')
      })
    },
    CancelWatchLater (context, payload) { // 取消视频添加稍后观看
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CancelWatchLater, context, payload, 0)
      })
    },
    MoveAlbumVideos (context, payload) { // 移动视频到专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.MoveAlbumVideos, context, payload, 2020)
      })
    },
    RemoveAlbumSubVideos (context, payload) { // 删除视频专辑下视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RemoveAlbumSubVideos, context, payload, 2022)
      })
    },
    GetPageVideosByAlbum (context, payload) { // 获取视频专辑下视频列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPageVideosByAlbum, context, payload, 0, 'UploadVideoAlbumSubList')
      })
    },
    EditVideoAlbum (context, payload) { // 编辑用户视频专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.EditVideoAlbum, context, payload.data, 2025, 'EditVideoAlbumListItem', payload)
      })
    },
    RemoveAlbumVideos (context, payload) { // 删除用户视频专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RemoveAlbumVideos, context, payload.params, 2017, 'RemoveVideoAlbumListItem', payload.index)
      })
    },
    CreateVideoAlbum (context, payload) { // 新建用户视频专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CreateVideoAlbum, context, payload, 0, 'AddVideoAlbumList', payload.data, true)
      })
    },
    GetVideoAlbum (context, payload) { // 获取用户视频专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetVideoAlbum, context, payload, 0, 'UpdateVideoAlbumList')
      })
    },
    AddPieceGroupSubItem (context, payload) { // 添加用户片单列表下视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.AddPieceGroupSubItem, context, payload, 0)
      })
    },
    DeletePieceGroupSubItem (context, payload) { // 删除用户片单列表下视频列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DeletePieceGroupSubItem, context, payload, 0)
      })
    },
    GetPieceGroupSubList (context, payload) { // 获取用户片单列表下视频列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPieceGroupSubList, context, payload, 0, 'UploadPieceGroupSubList')
      })
    },
    RenamePieceGroup (context, payload) { // 用户片单重命名
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RenamePieceGroup, context, payload.params, 0, 'RenamePieceGroupList', payload)
      })
    },
    DeletePieceGroup (context, payload) { // 删除用户片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DeletePieceGroup, context, payload.params, 0, 'DeletePieceGroupList', payload.index)
      })
    },
    AddPieceGroup (context, payload) { // 新建用户片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.AddPieceGroup, context, payload, 0, 'AddPieceGroupList')
      })
    },
    GetPieceGroup (context, payload) { // 获取用户片单
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPieceGroup, context, payload, 0, 'UploadPieceGroupList')
      })
    },
    VideoWatched (context, payload) { // 视频已看
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.VideoWatched, context, payload, 0)
      })
    },
    VideoFinshed (context, payload) { // 视频已看完
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.VideoFinshed, context, payload, 0)
      })
    },
    AddWatchLater (context, payload) { // 添加稍后观看视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.AddWatchLater, context, payload, 0)
      })
    },
    DeleteWatchLaterVideo (context, payload) { // 删除稍后观看视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DeleteWatchLaterVideo, context, payload.params, 0, 'EditWatchLaterVideoList', payload.index)
      })
    },
    GetWatchLaterVideoList (context, payload) { // 获取稍后观看列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetWatchLaterVideoList, context, payload, 0, 'UpdateWatchLaterVideoList')
      })
    },
    GetSubscribeInfo (context, payload) { // 获取订阅我的用户列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetSubscribeInfo, context, payload, 0, 'UpdateSubscribeForMeList')
      })
    },
    GetMySubscribeInfo (context, payload) { // 获取我订阅的用户列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetMySubscribeInfo, context, payload, 0, 'UpdateMySubscribeList')
      })
    },
    Unsubscribe (context, payload) { // 取消订阅某个人
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.Unsubscribe, context, payload, 0)
      })
    },
    CheckSubscribe (context, payload) { // 检查是否订阅某人
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CheckSubscribe, context, payload, 0)
      })
    },
    AccountSubscribe (context, payload) { // 订阅
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.AccountSubscribe, context, payload, 0)
      })
    },
    GetAccountSubscribe (context, payload) { // 统计订阅量
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetAccountSubscribe, context, payload, 0)
      })
    },
    AddVideoCollect (context, payload) { // 添加视频收藏
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.AddVideoCollect, context, payload, 0)
      })
    },
    CancelVideoCollectForPlay (context, payload) { // 用户取消视频收藏
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CancelVideoCollectForPlay, context, payload, 0)
      })
    },
    CancelVideoCollect (context, payload) { // 用户取消视频收藏
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CancelVideoCollect, context, payload, 0)
      })
    },
    RemoveVideoCollect (context, payload) { // 转移用户视频收藏夹
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.RemoveVideoCollect, context, payload, 0)
      })
    },
    GetVideoCollect (context, payload) { // 获取收藏夹下视频列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetVideoCollect, context, payload, 0, 'UpdateVideoCollectList')
      })
    },
    EditVideoCollectCategory (context, payload) { // 删除用户视频收藏夹
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.EditVideoCollectCategory, context, payload.params, 0, 'EditVideoCollectCategoryItem', payload)
      })
    },
    DeleteVideoCollectCategory (context, payload) { // 删除用户视频收藏夹
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DeleteVideoCollectCategory, context, payload.params, 0, 'SpliceVideoCollectCategory', payload.index)
      })
    },
    AddVideoCollectCategory (context, payload) { // 新建用户视频收藏夹
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.AddVideoCollectCategory, context, payload, 0, 'PushVideoCollectCategory')
      })
    },
    GetVideoCollectCategory (context, payload) { // 获取用户所有视频收藏夹
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetVideoCollectCategory, context, payload, 0, 'UpdateVideoCollectCategory')
      })
    },
    UploadPhotos (context, payload) { // 上传图片
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.UploadPhotos, context, payload, 3009)
      })
    },
    CreatePhotoAlbum (context, payload) { // 创建图片专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CreatePhotoAlbum, context, payload, 3014)
      })
    },
    GetPhotoServiceType (context, payload) { // 获取图片分类
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPhotoServiceType, context, payload, 0, 'UpdatePhotoTypes')
      })
    },
    GetPhotoAlbum (context, payload) { // 获取用户图片专辑
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetPhotoAlbum, context, payload, 0, 'UpdatePhotoAlbum')
      })
    },
    EditUploadVideos (context, payload) { // 编辑用户上传视频信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.EditUploadVideos, context, payload, 2010)
      })
    },
    GetServiceType (context, payload) { // 获取视频分类
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetServiceType, context, payload, 0, 'UpdateServiceTypeList')
      })
    },
    UserRemoveVideos (context, payload) { // 用户删除上传视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.UserRemoveVideos, context, payload, 2012)
      })
    },
    UserUploadVideos (context, payload) { // 用户上传视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.UserUploadVideos, context, payload, 2009)
      })
    },
    MergeUploadVideo (context, payload) { // 合并视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.MergeUploadVideo, context, payload, 2058)
      })
    },
    CheckVideoChunk (context, payload) { // 校验已上传视频分片
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CheckVideoChunk, context, payload, 0)
      })
    },
    CheckVideoMd5 (context, payload) { // 校验视频上传MD5
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.CheckVideoMd5, context, payload, 0)
      })
    },
    UploadVideoChunk (context, payload) { // 用户分段上传视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.UploadVideoChunk, context, payload, 2009)
      })
    },
    GetVideoStatus (context, payload) { // 获取视频收藏喜欢状态
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetVideoStatus, context, payload, 0)
      })
    },
    UserGaveLikeForVideo (context, payload) { // 用户点赞视频
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.UserGaveLikeForVideo, context, payload, 0)
      })
    },
    GetAccountBasicInfo (context, payload) { // 获取其他用户基本信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetAccountBasicInfo, context, payload, 0, 'UpdateOtherUserInfo')
      })
    },
    AddCollect (context, payload) { // 添加收藏
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.AddCollect, context, payload, 0)
      })
    },
    DeleteViewingHistory (context, payload) { // 删除用户观看历史
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.DeleteViewingHistory, context, payload, 0, 'UpdateViewingHistory', payload)
      })
    },
    Logout (context, payload) { // 登出
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.Logout, context, payload, 1030)
      })
    },
    UpdateBase64 (context, payload) { // 上传base64图片
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.UpdateBase64, context, payload, 0)
      })
    },
    EditUserLikes (context, payload) { // 设置用户偏好
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.EditUserLikes, context, payload, 0)
      })
    },
    UpdateUserInfo (context, payload) { // 更新用户信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.UpdateUserInfo, context, payload, 1032)
      })
    },
    GetUserLoveType (context, payload) { // 获取用户喜好类型
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserLoveType, context, {}, 0, 'SetUserLoveType')
      })
    },
    GetUserLikes (context, payload) { // 获取用户偏好
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserLikes, context, payload, 0, 'SetUserLikes')
      })
    },
    GetLikeTypes (context, payload) { // 获取偏好列表
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetLikeTypes, context, {}, 0, 'SetUserLikeTypes')
      })
    },
    GetViewingHistory (context, payload) { // 获取用户观看历史
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetViewingHistory, context, payload, 0, 'SetViewingHistory')
      })
    },
    GetAllViewingHistory (context, payload) { // 获取用户全部观看历史
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetViewingHistory, context, payload, 0, 'SetAllViewingHistory')
      })
    },
    ResetCheckCode (context, payload) { // 找回密码校验验证码
      return new Promise((resolve, reject) => {
        // ToolClass.Axios(resolve, reject, Api.User.ResetCheckCode, context, payload, 0)
        Axios({
          method: Api.User.ResetCheckCode.method,
          url: Api.User.ResetCheckCode.url,
          params: { ...payload }
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    ResetPassword (context, payload) { // 重置密码
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.User.ResetPassword.method,
          url: Api.User.ResetPassword.url,
          params: { ...payload }
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    ForgotPassword (context, payload) { // 找回密码
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.User.ForgotPassword.method,
          url: Api.User.ForgotPassword.url,
          params: { ...payload }
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    Login (context, payload) { // 用户登录
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.User.Login.method,
          url: Api.User.Login.url,
          params: { ...payload }
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    SendCode (context, payload) { // 发送验证码
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.User.SendCode.method,
          url: Api.User.SendCode.url,
          params: { ...payload }
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    Register (context, payload) { // 注册账户
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.User.Register.method,
          url: Api.User.Register.url,
          params: { ...payload }
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    CheckRegCode (context, payload) { // 校验注册账户验证码
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.User.CheckRegCode.method,
          url: Api.User.CheckRegCode.url,
          params: { ...payload }
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    CheckAccountStatus (context, payload) { // 校验账户是否能注册
      return new Promise((resolve, reject) => {
        Axios({
          method: Api.User.CheckAccountStatus.method,
          url: Api.User.CheckAccountStatus.url,
          params: { ...payload }
        }).then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
      })
    },
    GetUserInfoByToken (context, payload) { // 根据token获取用户信息
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetUserInfoByToken, context, payload, 0, 'SetUserInfo')
      })
    },
    GetHistorySearchList (context, payload) { // 获取用户搜索历史
      return new Promise((resolve, reject) => {
        ToolClass.Axios(resolve, reject, Api.User.GetHistorySearchList, context, payload, 0, 'SetHistorySearchList')
      })
    },
    GetAreaList (context, payload) { // 获取地区列表
      return new Promise((resolve, reject) => {
        let Other = {}
        let Taregt = null
        if (payload.type - 0 === 1) { // 一级地区
          Taregt = Api.User.GetAreaForFirstClass
          Other = {}
        } else if (payload.type - 0 === 2) { // 二级地区
          Taregt = Api.User.GetAreaForSecondClass
          Other = { params: { countryCode: payload.code || null } }
        } else if (payload.type - 0 === 3) { // 三级地区
          Taregt = Api.User.GetAreaForThirdClass
          Other = { params: { stateCode: payload.code || null } }
        }
        ToolClass.Axios(resolve, reject, Taregt, context, Other, 0, 'SetAreaList', { type: payload.type }, true)
      })
    }
  }
}
