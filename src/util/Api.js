
const prefix = process.env.NODE_ENV === 'production' ? '/api' : '/api'

const $api = {
  Setting: { // 设置相关
    ChangeUserName: { // 修改username登录名
      method: 'post',
      url: `${prefix}/account/changeUsername`
    },
    SendCode: { // 发送修改邮箱验证码
      method: 'post',
      url: `${prefix}/account/sendEmail`
    },
    ChangeEamil: { // 校验验证码，并修改邮箱
      method: 'post',
      url: `${prefix}/account/checkEmailCode`
    },
    ChangePhone: { // 修改电话
      method: 'post',
      url: `${prefix}/account/changePhone`
    },
    ChangeHomepage: { // 修改社交主页链接
      method: 'post',
      url: `${prefix}/account/changeSocialHomepage`
    },
    ChangePassword: { // 修改密码
      method: 'post',
      url: `${prefix}/account/changePassword`
    },
    SendForgetCode: { // 发送修改忘记密码时的验证码
      method: 'post',
      url: `${prefix}/account/sendForgot`
    },
    ChangeForgetPassword: { // 忘记密码时，修改密码
      method: 'post',
      url: `${prefix}/account/changePwd`
    },
    GetAuthInfo: { // 获取用户认证信息
      method: 'get',
      url: `${prefix}/account/getAuthInfo`
    },
    ChangeAuthInfo: { // 修改用户认证信息
      method: 'post',
      url: `${prefix}/account/changeInfo`
    }
  },
  Live: { // 直播相关
    GetLiverRoomToken: { // 获取直播房间token
      method: 'post',
      url: `${prefix}/liveRtc/getRoomToken`
    },
    CreateLiveRoom: { // 创建直播房间
      method: 'post',
      url: `${prefix}/liveBroadcast/createRoom`
    },
    LiveStart: { // 开播
      method: 'post',
      url: `${prefix}/liveBroadcast/startRoom`
    },
    LiveStop: { // 下播
      method: 'post',
      url: `${prefix}/liveBroadcast/statisticsRoom`
    },
    CreateChatRoom: { // 创建直播间聊天室
      method: 'post',
      url: `${prefix}/im/chatRoom/create`
    },
    GetLivingRoomInfo: { // 获取正在直播的房间信息
      method: 'get',
      url: `${prefix}/liveBroadcast/getRoom`
    },
    CloseLiveChatRoom: { // 销毁直播聊天室
      method: 'post',
      url: `${prefix}/im/chatRoom/destroy`
    },
    GetLiveRoomGiftsDetailsList: { // 获取直播间礼物打赏详情列表
      method: 'post',
      url: `${prefix}/bill/liveRoomDetailPage`
    },
    GetChatRoomUsersList: { // 获取聊天室用户列表
      method: 'post',
      url: `${prefix}/im/chatRoom/getMembers`
    }
  },
  Sgs: {
    GetSgsDictList: { // 获取认证相关字典列表
      method: 'post',
      url: `${prefix}/sys/dictList`
    },
    GetSgsInfo: { // 获取认证信息
      method: 'post',
      url: `${prefix}/accountAuth/get`
    },
    SendEmailCode: { // 发送邮箱验证码
      method: 'post',
      url: `${prefix}/accountAuth/sendCode`
    },
    CheckEmailCode: { // 校验邮箱验证码
      method: 'post',
      url: `${prefix}/accountAuth/checkCode`
    },
    ChangeEmail: { // 修改邮箱
      method: 'post',
      url: `${prefix}/accountAuth/changeEmail`
    },
    SecondSgs: { // 第二步认证
      method: 'post',
      url: `${prefix}/accountAuth/secondStep`
    },
    GetCountryList: { // 获取国家列表
      method: 'post',
      url: `${prefix}/order/getCountryCode`
    },
    ThirdSgs: { // 第三步认证
      method: 'post',
      url: `${prefix}/accountAuth/thirdStep`
    },
    ConfirmSgs: { // 确认认证
      method: 'post',
      url: `${prefix}/accountAuth/confirm`
    },
    StopSgs: { // 终止认证
      method: 'post',
      url: `${prefix}/accountAuth/stop`
    },
    ResetSgs: { // 重置认证（第三步）
      method: 'post',
      url: `${prefix}/accountAuth/reset`
    }
  },
  Playlist: { // 片单相关
    GetPlaylistMaxNum: { // 获取片单数量上限
      method: 'get',
      url: `${prefix}/pieceGroup/getUpperNum`
    },
    GetUserPlaylistIncludeFavorite: { // 获取用户片单（包括默认收藏片单）
      method: 'get',
      url: `${prefix}/pieceGroup/listNameGroup`
    },
    GetPlaylist: { // 获取用户片单列表
      method: 'get',
      url: `${prefix}/pieceGroup/listGroup`
    },
    GetSavePlaylist: { // 获取用户收藏片单列表
      method: 'post',
      url: `${prefix}/collectPieceGroup/groupPage`
    },
    GetPlaylistChildList: { // 获取片单下列表
      method: 'post',
      url: `${prefix}/videoPiece/videoPage`
    },
    GetCheckPlaylist: { // 获取校验收藏片单
      method: 'get',
      url: `${prefix}/pieceGroup/checkGroup`
    },
    AddToPlaylist: { // 添加视频到片单
      method: 'post',
      url: `${prefix}/videoPiece/add`
    },
    RemoveFromPlaylist: { // 从片单移除视频
      method: 'post',
      url: `${prefix}/videoPiece/cancel`
    },
    AddPlaylist: { // 添加片单
      method: 'post',
      url: `${prefix}/pieceGroup/add`
    },
    EditPlaylist: { // 编辑片单
      method: 'post',
      url: `${prefix}/pieceGroup/edit`
    },
    CopyAllToPlaylist: { // 整体添加视频到片单
      method: 'post',
      url: `${prefix}/videoPiece/move`
    },
    DeletePlaylist: { // 删除片单
      method: 'post',
      url: `${prefix}/pieceGroup/remove`
    },
    RemoveSavePlaylist: { // 移除收藏片单
      method: 'post',
      url: `${prefix}/collectPieceGroup/remove`
    },
    GetPlaylistInfoById: { // 获取片单信息
      method: 'get',
      url: `${prefix}/pieceGroup/get`
    },
    SavePlaylist: { // 收藏片单
      method: 'post',
      url: `${prefix}/collectPieceGroup/add`
    },
    GetOtherUserPlaylist: { // 获取其他用户片单（过滤隐私片单）
      method: 'get',
      url: `${prefix}/pieceGroup/viewGroup`
    },
    SaveToDefaultPlaylist: { // 添加到默认片单
      method: 'post',
      url: `${prefix}/videoPiece/addDefault`
    },
    RemoveFromDefaultPlaylist: { // 从默认片单中移除视频
      method: 'post',
      url: `${prefix}/videoPiece/cancelDefault`
    }
  },
  WatchLater: { // 稍后观看相关
    AddWatchLater: { // 添加稍后观看
      method: 'post',
      url: `${prefix}/watch/addPlay`
    }
  },
  Video: { // 视频及相关信息
    GetIndexLiveHls: { // 获取首页直播流
      method: 'get',
      url: `${prefix}/liveBroadcast/getRandomLiveBroadcast`
    },
    GetTestVideoInfo: { // 获取播放视频信息（管理员）
      method: 'get',
      url: `${prefix}/video/testPlay/`
    },
    MostLikeMore: { // 最多播放视频列表
      method: 'post',
      url: `${prefix}/home/mostLike/more`
    },
    NewestMore: { // 最新视频列表
      method: 'post',
      url: `${prefix}/home/newest/more`
    },
    PopularMore: { // 最受欢迎视频列表
      method: 'post',
      url: `${prefix}/home/popular/more`
    },
    GetAccountVideoCollection: { // 获取用户上传视频集合
      method: 'post',
      url: `${prefix}/video/getAccountVideoCollection`
    },
    GetHotVideoListForDay: { // 获取视频日排行
      method: 'post',
      url: `${prefix}/video/dayTop`
    },
    GetVideoRecommend: { // 获取推荐视频
      method: 'post',
      url: `${prefix}/video/recommend`
    },
    GetMediaInfoById: { // 通过id获取视频信息
      method: 'get',
      url: `${prefix}/video/`
    },
    GetCommentList: { // 获取视频评论列表
      method: 'post',
      url: `${prefix}/comment/getPageList`
    },
    GetCommentTotalCounts: { // 获取视频总评论数（包括一二级评论）
      method: 'post',
      url: `${prefix}/comment/total`
    },
    SubmitCommentForVideo: { // 提交视频评论
      method: 'post',
      url: `${prefix}/comment/save`
    },
    SubmitSubComment: { // 提交一二级评论
      method: 'post',
      url: `${prefix}/comment/saveReply`
    },
    GetSearchVideoList: { // 获取搜索视频列表
      method: 'post',
      url: `${prefix}/video/search`
    },
    GetClassVideoList: { // 获取分类视频列表
      method: 'post',
      url: `${prefix}/video/pageList`
    },
    GetVideoRankingList: { // 视频搜索排名
      method: 'get',
      url: `${prefix}/video/searchRanking`
    },
    GetSearchFilter: { // 获取搜索过滤器
      method: 'get',
      url: `${prefix}/video/getSearchTypes`
    },
    GetVideoDetails: { // 获取编辑视频信息
      method: 'post',
      url: `${prefix}/account/getVideoDetails`
    },
    GetFeaturedVideoList: { // 获取精选视频列表
      method: 'post',
      url: `${prefix}/home/featured`
    },
    GetHotVideoList: { // 获取热门视频列表
      method: 'post',
      url: `${prefix}/home/popular`
    },
    GetHomePieceGroup: { // 获取首页片单列表
      method: 'post',
      url: `${prefix}/home/pieceGroup`
    },
    GetHomeChannel: { // 获取首页频道列表
      method: 'get',
      url: `${prefix}/home/channel`
    },
    GetHomeBanner: { // 获取首页banner
      method: 'get',
      url: `${prefix}/home/banner`
    }
  },
  Common: {
    GetDownloadUrl: { // 获取下载链接
      method: 'get',
      url: `${prefix}/download/getUrl`
    },
    RandomSearchKey: { // 获取随机搜索关键词
      method: 'get',
      url: `${prefix}/video/randomTitle`
    },
    GetSearchAutoComple: { // 搜索补全
      method: 'get',
      url: `${prefix}/video/searchCompletion`
    }
  },
  User: { // 用户及相关信息
    GetMyVideoList: { // 获取我的上传视频列表
      method: 'post',
      url: `${prefix}/account/myVideoPageList`
    },
    GetOtherVideoList: { // 获取别人的上传视频列表
      method: 'post',
      url: `${prefix}/account/viewVideoPageList`
    },
    CheckIp: { // 校验ip地址
      method: 'get',
      url: `${prefix}/home/validateCN`
    },
    CheckVideoMd5: { // 校验视频上传MD5
      method: 'get',
      url: `${prefix}/account/checkIdentifier`
    },
    MergeUploadVideo: { // 合并视频
      method: 'post',
      url: `${prefix}/account/mergeFile`
    },
    CheckVideoChunk: { // 校验已上传视频分片
      method: 'get',
      url: `${prefix}/account/checkChunk`
    },
    UploadVideoChunk: { // 分段上传视频
      method: 'post',
      url: `${prefix}/account/chunk`
    },
    GetLiveRoomBillDetail: { // 获取直播收入详情
      method: 'post',
      url: `${prefix}/bill/liveRoomDetailPage`
    },
    GetPayCard: { // 获取信用卡
      method: 'post',
      url: `${prefix}/creditCard/get`
    },
    BindBankCard: { // 绑定银行卡
      method: 'post',
      url: `${prefix}/accountBankCard/bind`
    },
    GetUserBindCard: { // 获取用户绑定银行卡列表
      method: 'post',
      url: `${prefix}/accountBankCard/list`
    },
    GetPayInfoCity: { // 获取支付城市代码
      method: 'post',
      url: `${prefix}/order/getStateCode`
    },
    GetPayInfoCountry: { // 获取支付国家代码
      method: 'post',
      url: `${prefix}/order/getCountryCode`
    },
    PayForOrder: { // 支付订单
      method: 'post',
      url: `${prefix}/order/payment`
    },
    GetOrderInfo: { // 获取订单信息
      method: 'post',
      url: `${prefix}/order/getOrder`
    },
    CreateOrder: { // 创建订单
      method: 'post',
      url: `${prefix}/order/createOrder`
    },
    CashMoney: { // 提现
      method: 'post',
      url: `${prefix}/account/cash`
    },
    GetRechargeList: { // 获取充值列表
      method: 'post',
      url: `${prefix}/bill/rechargePage`
    },
    GetWithdrawList: { // 获取提现列表
      method: 'post',
      url: `${prefix}/bill/withdrawsPage`
    },
    GetIncomeList: { // 获取收入列表
      method: 'post',
      url: `${prefix}/bill/incomePage`
    },
    GetFansIncomeList: { // 获取粉丝收入列表
      method: 'post',
      url: `${prefix}/bill/fanClubPage`
    },
    GetLiveIncomeList: { // 获取直播收入列表
      method: 'post',
      url: `${prefix}/bill/liveRecordPage`
    },
    GetExpenseBill: { // 获取消费记录
      method: 'post',
      url: `${prefix}/bill/expensesPage`
    },
    PayForHeyCoin: { // 充值虚拟币
      method: 'post',
      url: `${prefix}/account/heyCoin/recharge`
    },
    GetHeyCoinList: { // 获取虚拟币商品列表
      method: 'post',
      url: `${prefix}/product/pageList`
    },
    GetMyClubMembers: { // 获取粉丝团成员
      method: 'post',
      url: `${prefix}/account/getFansPage`
    },
    GetUserFollowingClubs: { // 获取用户加入的粉丝团
      method: 'post',
      url: `${prefix}/account/getClubPage`
    },
    SetFansClubPrice: { // 设置粉丝团价格
      method: 'post',
      url: `${prefix}/account/setFanPrice`
    },
    GetFansClubSetPrice: { // 获取粉丝团价格设置区间
      method: 'post',
      url: `${prefix}/account/getFansPrice`
    },
    RevokeExitFansClub: { // 撤销退出付费粉丝团
      method: 'post',
      url: `${prefix}/account/revoke`
    },
    ExitFansClub: { // 退出付费粉丝团
      method: 'post',
      url: `${prefix}/account/exitClub`
    },
    JoinFansClub: { // 加入付费粉丝团
      method: 'post',
      url: `${prefix}/account/becomeClubFan`
    },
    GetLiveRoomInfo: { // 获取直播间信息
      method: 'get',
      url: `${prefix}/liveBroadcast/getRoom`
    },
    GetChatRoomBlockList: { // 获取聊天室黑名单
      method: 'post',
      url: `${prefix}/im/chatRoom/user/blockList`
    },
    GetChatRoomShutupList: { // 获取聊天室禁言名单
      method: 'post',
      url: `${prefix}/im/chatRoom/user/gagList`
    },
    GetLiveRoomList: { // 获取直播间列表
      method: 'get',
      url: `${prefix}/liveBroadcast/getLiveRoom`
    },
    PostLiveGift: { // 发直播礼物
      method: 'post',
      url: `${prefix}/live/gift/reward`
    },
    GetUserLiveToken: { // 获取用户直播token
      method: 'post',
      url: `${prefix}/im/user/getToken`
    },
    GetGiftList: { // 获取直播礼物列表
      method: 'get',
      url: `${prefix}/live/gift/get`
    },
    GetRangeOfPrice: { // 获取视频价格范围
      method: 'post',
      url: `${prefix}/account/getPrice`
    },
    PayForVideo: { // 购买视频
      method: 'post',
      url: `${prefix}/account/payVideo`
    },
    GetUserLiveUrl: { // 获取用户直播地址
      method: 'post',
      url: `${prefix}/liveBroadcast/HLSPlay`
    },
    MsgReaded: { // 消息已读
      method: 'post',
      url: `${prefix}/notice/read`
    },
    GetUserRanking: { // 获取用户排行榜
      method: 'post',
      url: `${prefix}/account/accountRank`
    },
    PushDynamic: { // 发推
      method: 'post',
      url: `${prefix}/pushM`
    },
    GetMyDynamic: { // 获取我的相关动态
      method: 'post',
      url: `${prefix}/pushM/pageList`
    },
    DynamicLike: { // 动态点赞
      method: 'post',
      url: `${prefix}/pushM/like`
    },
    DeleteOtherUserComment: { // 发推人删除其他用户的评论
      method: 'post',
      url: `${prefix}/pushM/comment/delete`
    },
    DeleteUserComment: { // 用户删除自己的评论
      method: 'post',
      url: `${prefix}/pushM/comment/remove`
    },
    DeleteUserDynamic: { // 用户删除动态
      method: 'post',
      url: `${prefix}/pushM/remove`
    },
    PushDynamicLevel1Comment: { // 发送动态一级评论
      method: 'post',
      url: `${prefix}/pushM/comment`
    },
    GetDynamicLevel1Comment: { // 获取动态一级评论
      method: 'post',
      url: `${prefix}/pushM/comment/pageList`
    },
    GetDynamicLevel2Comment: { // 获取动态二级评论
      method: 'post',
      url: `${prefix}/pushM/comment/childPageList`
    },
    GetUserDynamic: { // 获取用户动态
      method: 'post',
      url: `${prefix}/pushM/personalPageList`
    },
    CheckPlaylist: { // 校验片单视频是否存在
      method: 'get',
      url: `${prefix}/pieceGroup/checkGroup`
    },
    UploadBackground: { // 上传背景图
      method: 'post',
      url: `${prefix}/account/uploadBackground`
    },
    ChangePassword: { // 修改密码
      method: 'post',
      url: `${prefix}/account/changePassword`
    },
    NewRegister: { // 新版本注册
      method: 'post',
      url: `${prefix}/account/registerV2`
    },
    NewLogin: { // 新版本登录
      method: 'post',
      url: `${prefix}/account/loginV2`
    },
    CheckUserNameExist: { // 校验用户名是否存在
      method: 'get',
      url: `${prefix}/account/checkName`
    },
    CheckEmailExist: { // 校验邮箱是否存在
      method: 'get',
      url: `${prefix}/account/checkEmail`
    },
    GetPromoteCountForMonth: { // 获取每月推广人数列表
      method: 'post',
      url: `${prefix}/account/referrerCount`
    },
    GetPromoteMonthList: { // 获取每月推广详情列表
      method: 'post',
      url: `${prefix}/account/referrerList`
    },
    GetPromoteTotalCount: { // 获取推广总人数
      method: 'post',
      url: `${prefix}/account/referrerTotalCount`
    },
    GetPromoteUrl: { // 获取推广链接
      method: 'post',
      url: `${prefix}/account/promoteUrl`
    },
    GetVideoStatus: { // 获取视频收藏喜欢状态
      method: 'post',
      url: `${prefix}/account/getVideoStatus`
    },
    CheckAccountStatus: { // 校验账户是否能注册
      method: 'post',
      url: `${prefix}/account/checkInfo`
    },
    CheckRegCode: { // 校验注册账户验证码
      method: 'post',
      url: `${prefix}/account/checkCode`
    },
    Register: { // 注册账户
      method: 'post',
      url: `${prefix}/account/register`
    },
    SendCode: { // 发送验证码
      method: 'post',
      url: `${prefix}/account/resendCode`
    },
    Login: { // 登录
      method: 'post',
      url: `${prefix}/account/login`
    },
    Logout: { // 登出
      method: 'post',
      url: `${prefix}/account/logout`
    },
    GetUserInfoByToken: { // 根据token获取用户信息
      method: 'post',
      url: `${prefix}/account/getAccountInfo`
    },
    ForgotPassword: { // 找回密码
      method: 'post',
      url: `${prefix}/account/retrievePassword`
    },
    GetAlbumPageVideos: { // 获取专辑下视频列表
      method: 'post',
      url: `${prefix}/account/getAlbumPageVideos`
    },
    ResetCheckCode: { // 找回密码校验验证码
      method: 'post',
      url: `${prefix}/account/resetCheckCode`
    },
    ResetPassword: { // 重置密码
      method: 'post',
      url: `${prefix}/account/setPassword`
    },
    GetHistorySearchList: { // 获取用户搜索历史
      method: 'get',
      url: `${prefix}/video/searchFocus`
    },
    GetViewingHistory: { // 获取用户观看历史
      method: 'post',
      url: `${prefix}/account/playHistory`
    },
    DeleteViewingHistory: { // 删除用户观看历史
      method: 'post',
      url: `${prefix}/account/removePlayHistory`
    },
    DeleteAllHistory: { // 删除用户全部观看历史
      method: 'post',
      url: `${prefix}/account/removeAllPlayHistory`
    },
    GetAreaForFirstClass: { // 获取一级地区
      method: 'post',
      url: `${prefix}/area/countryList`
    },
    GetAreaForSecondClass: { // 获取二级地区
      method: 'post',
      url: `${prefix}/area/stateList`
    },
    GetAreaForThirdClass: { // 获取三级地区
      method: 'post',
      url: `${prefix}/area/cityList`
    },
    GetUserLoveType: { // 获取用户喜好类型
      method: 'post',
      url: `${prefix}/account/getLoveType`
    },
    UpdateUserInfo: { // 更新用户信息
      method: 'post',
      url: `${prefix}/account/update`
    },
    UpdateBase64: { // 上传base64图片
      method: 'post',
      url: `${prefix}/account/uploadPic`
    },
    GetLikeTypes: { // 获取偏好列表
      method: 'post',
      url: `${prefix}/account/likeTypes`
    },
    AddCollect: { // 添加收藏
      method: 'post',
      url: `${prefix}/account/saveCollect`
    },
    GetUserLikes: { // 获取用户偏好
      method: 'post',
      url: `${prefix}/account/getLikes`
    },
    EditUserLikes: { // 设置用户偏好
      method: 'post',
      url: `${prefix}/account/setLike`
    },
    GetAccountBasicInfo: { // 获取其他用户基本信息
      method: 'post',
      url: `${prefix}/account/getAccountBasicInfo`
    },
    UserGaveLikeForVideo: { // 用户点赞视频
      method: 'post',
      url: `${prefix}/account/saveVideoLike`
    },
    UserUploadVideos: { // 用户上传视频
      method: 'post',
      url: `${prefix}/account/uploadVideos`
    },
    UserRemoveVideos: { // 用户删除上传视频
      method: 'post',
      url: `${prefix}/account/removeVideos`
    },
    GetServiceType: { // 获取视频分类
      method: 'post',
      url: `${prefix}/account/getServiceType`
    },
    GetVideoAlbum: { // 获取用户视频专辑
      method: 'post',
      url: `${prefix}/account/getVideoAlbum`
    },
    CreateVideoAlbum: { // 创建视频专辑
      method: 'post',
      url: `${prefix}/account/createVideoAlbum`
    },
    RemoveAlbumVideos: { // 删除视频专辑
      method: 'post',
      url: `${prefix}/account/removeAlbumVideos`
    },
    EditVideoAlbum: { // 编辑视频专辑
      method: 'post',
      url: `${prefix}/account/editVideoAlbum`
    },
    GetPageVideosByAlbum: { // 获取视频专辑下视频列表
      method: 'post',
      url: `${prefix}/account/getPageVideos`
    },
    RemoveAlbumSubVideos: { // 删除视频专辑下视频
      method: 'post',
      url: `${prefix}/account/batchRemoveAlbumVideos`
    },
    MoveAlbumVideos: { // 移动视频到专辑
      method: 'post',
      url: `${prefix}/account/moveAlbumVideos`
    },
    EditUploadVideos: { // 编辑用户上传视频信息
      method: 'post',
      url: `${prefix}/account/editUploadVideosPc`
    },
    GetPhotoAlbum: { // 获取用户图片专辑
      method: 'post',
      url: `${prefix}/account/getPhotoAlbum`
    },
    GetPhotoServiceType: { // 获取图片分类
      method: 'post',
      url: `${prefix}/account/getPhotoServiceType`
    },
    CreatePhotoAlbum: { // 创建图片专辑
      method: 'post',
      url: `${prefix}/account/createPhotoAlbum`
    },
    UploadPhotos: { // 上传图片
      method: 'post',
      url: `${prefix}/account/uploadPhotos`
    },
    CheckCategory: { // 校验视频收藏信息
      method: 'get',
      url: `${prefix}/videoCollectCategory/checkCategory`
    },
    GetVideoCollectCategory: { // 获取用户所有视频收藏夹
      method: 'get',
      url: `${prefix}/videoCollectCategory/get`
    },
    AddVideoCollectCategory: { // 新建用户视频收藏夹
      method: 'post',
      url: `${prefix}/videoCollectCategory/add`
    },
    EditVideoCollectCategory: { // 修改用户视频收藏夹
      method: 'post',
      url: `${prefix}/videoCollectCategory/rename`
    },
    DeleteVideoCollectCategory: { // 删除用户视频收藏夹
      method: 'post',
      url: `${prefix}/videoCollectCategory/remove`
    },
    RemoveVideoCollect: { // 转移用户视频收藏夹
      method: 'post',
      url: `${prefix}/videoCollect/move`
    },
    CancelVideoCollect: { // 用户取消视频收藏
      method: 'post',
      url: `${prefix}/videoCollect/cancel`
    },
    CancelVideoCollectForPlay: { // 用户取消视频收藏
      method: 'post',
      url: `${prefix}/videoCollect/cancelCollect`
    },
    AddVideoCollect: { // 添加视频收藏
      method: 'post',
      url: `${prefix}/videoCollect/collect`
    },
    GetVideoCollect: { // 获取收藏夹下视频列表
      method: 'post',
      url: `${prefix}/videoCollect/videoPage`
    },
    GetAccountSubscribe: { // 统计订阅量
      method: 'post',
      url: `${prefix}/accountSubscribe/countSubscribe`
    },
    AccountSubscribe: { // 订阅
      method: 'post',
      url: `${prefix}/accountSubscribe/subscribe`
    },
    CheckSubscribe: { // 检查是否订阅某人
      method: 'post',
      url: `${prefix}/accountSubscribe/checkSubscribe`
    },
    Unsubscribe: { // 取消订阅某个人
      method: 'post',
      url: `${prefix}/accountSubscribe/unsubscribe`
    },
    GetMySubscribeInfo: { // 获取我订阅的用户列表
      method: 'post',
      url: `${prefix}/accountSubscribe/getMySubscribeInfo`
    },
    GetSubscribeInfo: { // 获取订阅我的用户列表
      method: 'post',
      url: `${prefix}/accountSubscribe/getSubscribeInfo`
    },
    GetWatchLaterVideoList: { // 获取稍后观看列表
      method: 'post',
      url: `${prefix}/watch/videoPage`
    },
    DeleteWatchLaterVideo: { // 删除稍后观看视频
      method: 'post',
      url: `${prefix}/watch/remove`
    },
    AddWatchLater: { // 添加稍后观看视频
      method: 'post',
      url: `${prefix}/watch/addPlay`
    },
    VideoWatched: { // 视频已看
      method: 'post',
      url: `${prefix}/watch/watched`
    },
    VideoFinshed: { // 视频已看完
      method: 'post',
      url: `${prefix}/watch/finished`
    },
    GetPieceGroup: { // 获取用户片单列表
      method: 'get',
      url: `${prefix}/pieceGroup/listGroup`
    },
    AddPieceGroup: { // 新建用户片单
      method: 'post',
      url: `${prefix}/pieceGroup/add`
    },
    DeletePieceGroup: { // 删除用户片单
      method: 'post',
      url: `${prefix}/pieceGroup/remove`
    },
    RenamePieceGroup: { // 用户片单重命名
      method: 'post',
      url: `${prefix}/pieceGroup/edit`
    },
    GetOtherUserPieceGroup: { // 获取其他用户片单信息
      method: 'get',
      url: `${prefix}/pieceGroup/get`
    },
    GetPieceGroupSubList: { // 获取用户片单列表下视频列表
      method: 'post',
      url: `${prefix}/videoPiece/videoPage`
    },
    DeletePieceGroupSubItem: { // 删除用户片单列表下视频列表
      method: 'post',
      url: `${prefix}/videoPiece/cancel`
    },
    AddPieceGroupSubItem: { // 添加用户片单列表下视频列表
      method: 'post',
      url: `${prefix}/videoPiece/add`
    },
    CancelWatchLater: { // 取消视频添加稍后观看
      method: 'post',
      url: `${prefix}/watch/cancel`
    },
    CollectPieceGroup: { // 收藏片单
      method: 'post',
      url: `${prefix}/collectPieceGroup/add`
    },
    GetCollectForSheet: { // 获取收藏片单
      method: 'post',
      url: `${prefix}/collectPieceGroup/groupPage`
    },
    RemoveCollectPieceGroup: { // 取消收藏片单
      method: 'post',
      url: `${prefix}/collectPieceGroup/remove`
    },
    GetAblumPhotos: { // 获取图集下图片
      method: 'post',
      url: `${prefix}/account/getPagePhotos`
    },
    RemoveAblumPhotos: { // 删除图集下图片
      method: 'post',
      url: `${prefix}/account/removePhotos`
    },
    ChangeCoverPhotoAlbum: { // 更换图集封面
      method: 'post',
      url: `${prefix}/account/changeCoverPhotoAlbum`
    },
    MoveAlbumPhotos: { // 移动图片
      method: 'post',
      url: `${prefix}/account/moveAlbumPhotos`
    },
    EditVideoDetails: { // 编辑视频信息
      method: 'post',
      url: `${prefix}/account/editVideoDetails`
    },
    GetVideoAlbumDetails: { // 获取专辑详情
      method: 'post',
      url: `${prefix}/account/getVideoAlbumDetails`
    },
    CollectVideoAlbum: { // 收藏专辑
      method: 'post',
      url: `${prefix}/collectVideoAlbum/add`
    },
    RemoveCollectVideoAlbum: { // 移除收藏专辑
      method: 'post',
      url: `${prefix}/collectVideoAlbum/remove`
    },
    GetAlbumPage: { // 获取用户收藏专辑
      method: 'post',
      url: `${prefix}/collectVideoAlbum/albumPage`
    },
    GetWatchLaterNum: { // 获取稍后观看列表数量
      method: 'get',
      url: `${prefix}/watch/total`
    },
    EditPhotoAlbum: { // 编辑图集
      method: 'post',
      url: `${prefix}/account/editPhotoAlbum`
    },
    RemovePhotoAlbum: { // 删除图集
      method: 'post',
      url: `${prefix}/account/removePhotoAlbum`
    },
    GetNoticeForMyVideoLike: { // 获取我的视频点赞
      method: 'post',
      url: `${prefix}/notice/likeVideo`
    },
    GetNoticeForMyDynamicLike: { // 获取我的动态点赞
      method: 'post',
      url: `${prefix}/notice/likeDynamic`
    },
    GetNoticeForMyCommentLike: { // 获取我的评论点赞
      method: 'post',
      url: `${prefix}/notice/likeComment`
    },
    GetSystemMsg: { // 获取系统消息
      method: 'post',
      url: `${prefix}/notice/system`
    },
    GetNoticeForMyVideoComment: { // 获取我的视频评论
      method: 'post',
      url: `${prefix}/notice/commentVideo`
    },
    GetNoticeForMyDynamicComment: { // 获取我的动态评论
      method: 'post',
      url: `${prefix}/notice/commentDynamic`
    },
    GetMyVideoLikeList: { // 获取我的视频点赞列表
      method: 'post',
      url: `${prefix}/notice/likeVideoAccountList`
    },
    GetNoticeForMyFans: { // 获取我的粉丝通知
      method: 'post',
      url: `${prefix}/notice/follow`
    },
    GetNoticeCount: { // 获取通知数量
      method: 'post',
      url: `${prefix}/notice/count`
    }
  }
}

export default $api
