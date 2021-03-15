<template>
  <div class="components MainNav flex-h" :class="{'active': MainNavBgActive, 'Black': ShowBlackBg}">

    <a class="MenuIcon iconfont" v-if="ShowHeaderMenu" :class="[ShowMenu ? 'iconcaidanyincang' : 'iconcaidanzhankai']" @click="CutMenu"></a>

    <!-- 主logo -->
    <a class="MainLogo" href="./index.html"><img src="../../assets/img/logo3x.png" alt="Heyporn"></a>

    <!-- 主导航 -->
    <nav class="MainNavList">
      <a v-for="(item, index) in MainNavList" :key="index" :href="item.Href" :class="{'active': MainNavActiveIndex === index}"><i class="iconfont" v-if="item.Icon !== undefined" :class="item.Icon"></i>{{item.Name}}</a>
    </nav>

    <div class="centerLabel">
      <!-- 主搜索 -->
      <div class="MainSearch">

        <!-- 搜索框 -->
        <div class="MainSearchBorder flex-h" :class="{'active': MainNavBgActive}">
          <input type="text" style="display:none">
          <div class="flex-item">
            <input type="search" autocomplete="new-password" v-model="MainSearchKey" :placeholder="SearchRandomKey" @focus="ShowSearchHistory = true; ShowBlackBg = true" @blur="MainSearchBlur">
          </div>
          <a class="iconfont iconsousuo" @click="MainSearch"></a>
        </div>

        <!-- 搜索历史及推荐搜索 -->
        <div class="MainSearchHistory" v-show="ShowSearchHistory">
          <div class="flex-h" v-if="(UserInfo !== null && HistorySearchList.length) || (UserInfo === null && LocalSearchHistory.length)">
            <span class="flex-item">HISTORY</span>
            <a class="iconfont iconqingkong" v-if="UserInfo === null" @click="EmptySearchHistory"></a>
          </div>

          <!-- 搜索历史列表 -->
          <ul class="MainSearchHistoryList">

            <!-- 用户搜索历史 -->
            <li v-for="(item, index) in HistorySearchList" :key="index" v-if="UserInfo !== null && index < 10" class="flex-h">
              <a class="flex-item" :href="`./search.html?key=${item.content}`" :title="item.content">{{item.content}}</a>
            </li>

            <!-- 本地搜索历史 -->
            <li v-for="(item, index) in LocalSearchHistory" :key="index" v-if="UserInfo === null && index < 10" class="flex-h">
              <a class="flex-item" :href="`./search.html?key=${item}`" :title="item">{{item}}</a>
            </li>
          </ul>

          <div class="flex-h">
            <span class="flex-item">POPULAR SEARCH</span>
          </div>

          <!-- 推荐搜索列表 -->
          <ul class="MainPopularSearchList">
            <li v-for="(item, index) in SearchRankingList" :key="index" v-if="(UserInfo === null && index < 10 - LocalSearchHistory.length) || (UserInfo !== null && index < 10 - HistorySearchList.length)" class="flex-h">
              <span>{{index + 1}}</span>
              <a class="flex-item" :href="`./search.html?key=${item.name}`" :title="item.name">{{item.name}}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 发布按钮 -->
      <a class="MainPostMedia" v-if="UserInfo === null || (UserInfo !== null && UserInfo.userType - 0 !== 1) " href="./upload.html" target="_self" :class="{'active': MainNavBgActive}">Upload</a>
    </div>

    <div class="flex-item"></div>

    <!-- 消息通知 -->
    <a class="iconfont icontongzhi- MainUserMsg" :class="{'active': MainMsgType !== null}" @click="LinkToMsg"></a>

    <!-- 观看历史 -->
    <div class="WatchHistory">
      <a class="iconfont iconlishijilu" @click="CheckHistory"></a>

      <!-- 观看历史列表 -->
      <div>
        <div v-if="UserInfo !== null">
          <span>Video</span>
          <div class="WatchHistoryList">
            <ScrollY Size="small">

              <!-- 用户观看历史 -->
              <div class="List">
                <span v-if="TodayHistoryArr.length">Today</span>
                <ul>
                  <li v-for="(item, index) in TodayHistoryArr" :key="index" class="flex-h">
                    <div class="Img" @mouseover="ShowTodayHistoryIndex = index" @mouseout="ShowTodayHistoryIndex = null">
                      <a :href="`./video.html?key=${item.VideoM}`" target="_self">
                        <img :src="item.Img" class="centerLabel cover" alt="">
                        <img v-if="item.Gif !== null && ShowTodayHistoryIndex === index" :src="`${item.Gif}`" class="centerLabel cover Gif" alt="">
                        <span><b v-if="item.Capacity !== null">{{JSON.parse(item.Capacity)[8] - 0 ? 'HD' : ''}}</b> {{ToolClass.DateFormat(item.TotalTimeTamp)}}</span>
                      </a>
                    </div>
                    <div class="flex-item flex-v">
                      <div>
                        <a :href="`./video.html?key=${item.VideoM}`" target="_self" :title="item.Name">{{item.Name}}</a>
                      </div>
                      <span><a :href="`./userspace.html?key=${item.UpId}`" target="_self">{{item.UpName}}</a> {{item.ViewingDate | changeTime}}</span>
                      <div>
                        <img v-if="item.payVideo - 0 === 1" src="../../assets/img/price.png" alt="">
                        <span v-if="item.payVideo - 0 === 1">${{item.price}}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <span v-if="AgoHistoryArr.length">Ago</span>
                <ul>
                  <li v-for="(item, index) in AgoHistoryArr" :key="index" class="flex-h">
                    <div class="Img" @mouseover="ShowAgoHistoryIndex = index" @mouseout="ShowAgoHistoryIndex = null">
                      <a :href="`./video.html?key=${item.VideoM}`" target="_self">
                        <img :src="item.Img" class="centerLabel cover" alt="">
                        <img v-if="item.Gif !== null && ShowAgoHistoryIndex === index" :src="`${item.Gif}`" class="centerLabel cover Gif" alt="">
                      </a>
                    </div>
                    <div class="flex-item flex-v">
                      <div class="flex-item">
                        <a :href="`./video.html?key=${item.VideoM}`" target="_self" :title="item.Name">{{item.Name}}</a>
                      </div>
                      <span><a :href="`./userspace.html?key=${item.UpId}`" target="_self">{{item.UpName}}</a> {{item.ViewingDate | changeTime}}</span>
                      <div>
                        <img v-if="item.payVideo - 0 === 1" src="../../assets/img/price.png" alt="">
                        <span v-if="item.payVideo - 0 === 1">${{item.price}}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

            </ScrollY>
          </div>
          <div class="Bottom">
            <a @click="CheckHistory">view more</a>
          </div>
        </div>
        <div v-else>
          <a>view history</a>
        </div>
      </div>
    </div>

    <!-- 用户选项 -->
    <div class="MainUser" v-if="UserInfo !== null">

      <!-- 用户头像 -->
      <a class="MainUserIcon" href="./users.html?type=3">
        <a><img :src="UserInfo.picPath1" class="centerLabel cover" alt=""></a>
        <i class="iconfont iconxiala"></i>
      </a>

      <!-- 用户选项板 -->
      <div class="MainUserOptions">

        <!-- 用户基本信息 -->
        <div class="MainUserBasicInfo flex-h">
          <a href="./users.html?type=3"><img :src="UserInfo.picPath2" class="centerLabel" alt=""></a>
          <div class="flex-item">
            <a href="./users.html?type=3">{{UserInfo.nick}}</a>
            <!-- <span>{{UserInfo.email}}</span>
            <span>{{UserInfo.mobile || 'No mobile information'}}</span> -->
          </div>
        </div>

        <!-- 用户个人中心选项 -->
        <nav class="MainUserCenterOptions">
          <div>
            <a href="./wallet.html" class="flex-h">
              <i class="iconfont iconwodeqianbao"></i>
              <span class="flex-item">Wallet</span>
            </a>
          </div>
          <div>
            <a href="./userspace.html" class="flex-h">
              <i class="iconfont icongerenkongjian"></i>
              <span class="flex-item">Hey channel</span>
            </a>
            <a href="./users.html" class="flex-h">
              <i class="iconfont icontouxiang"></i>
              <span class="flex-item">Profile</span>
            </a>
            <a href="./users.html?type=15" class="flex-h" v-if="UserInfo.userType - 0 !== 1">
              <i class="iconfont iconjihuo"></i>
              <span class="flex-item">Fansclub Center</span>
            </a>
          </div>
          <div>
            <!-- <a href="./users.html?type=3" class="flex-h">
              <i class="iconfont iconshoucang-"></i>
              <span class="flex-item">Favorite</span>
            </a> -->
            <a href="./users.html?type=4" class="flex-h">
              <i class="iconfont iconlishijilu1"></i>
              <span class="flex-item">History</span>
            </a>
            <a href="./users.html?type=5" class="flex-h">
              <i class="iconfont iconshaohouguankan"></i>
              <span class="flex-item">Watch later</span>
            </a>
            <a href="./playlist.html" class="flex-h">
              <i class="iconfont icondanye"></i>
              <span class="flex-item">Playlist</span>
            </a>
            <!-- <a href="./users.html?type=7" class="flex-h">
              <i class="iconfont iconzhuanji"></i>
              <span class="flex-item">Album</span>
            </a> -->
          </div>
          <div>
            <a href="./users.html?type=8" class="flex-h">
              <i class="iconfont iconshipinliebiao"></i>
              <span class="flex-item">Video studio</span>
            </a>
            <!-- <a href="./users.html?type=9" class="flex-h">
              <i class="iconfont iconxiangji"></i>
              <span class="flex-item">Photo studio</span>
            </a> -->
            <a href="./users.html?type=2" class="flex-h" v-if="UserInfo.userType - 0 === 4">
              <i class="iconfont icontuiguang"></i>
              <span class="flex-item">Promotion</span>
            </a>
          </div>
          <div>
            <!-- <a class="flex-h">
              <i class="iconfont iconshezhi1"></i>
              <span class="flex-item">Set</span>
            </a> -->
            <a @click="SighOut" class="flex-h">
              <i class="iconfont icontuichudenglu"></i>
              <span class="flex-item">Sign Out</span>
            </a>
          </div>
        </nav>

        <!-- 登录 -->
        <!-- <a @click="$emit('Login')" v-if="UserInfo === null">Sigh In</a> -->
      </div>
    </div>
    <a class="ToLogin" v-if="UserInfo === null && ShowToLoginBtn" @click="$emit('Login')" :class="{'active': MainNavBgActive}">
      <i class="iconfont icondenglu-1"></i>
      <span>Sign in</span>
    </a>
  </div>
</template>

<script>
/*
  页面名称：页头组件
  创建人：许成祥
  创建时间：2019/12/19
  最近修改人：许成祥
  最近修改日期：2020/05/14
  备注： 无
*/
import ScrollY from '../ScrollY'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapState: mapSearchState, mapActions: mapSearchActions } = createNamespacedHelpers('search')
export default {
  name: 'demo',
  props: {
    ShowHeaderMenu: {
      default: true,
      type: Boolean
    },
    MainNavActiveIndex: { // 主导航选中状态索引值
      type: Number,
      default: -1
    },
    MainNavBgActive: { // MainNav背景板透明开关：true-非透明 false-透明
      type: Boolean,
      default: true
    },
    IsSearch: { // 是否为搜索页
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      MainMsgType: null,
      WebSocket: null,
      ShowToLoginBtn: false,
      ShowMenu: false,
      IsAli: window.location.hostname === '121.40.96.72' || window.location.hostname === 'v.f5.cn',
      ShowTodayHistoryIndex: null,
      ShowAgoHistoryIndex: null,
      TodayHistoryArr: [], // 今日浏览记录
      AgoHistoryArr: [], // 以前浏览记录
      DataLock: false, // 数据锁定状态
      ShowBlackBg: false, // 显隐黑色背景
      MainNavList: [ // 主导航数据
        { Name: 'Live', Href: './livelist.html' },
        { Name: 'Ranking', Href: './ranking.html' },
        { Name: 'Download', Href: './download.html', Icon: 'iconshouji-' }
      ],
      MainSearchKey: this.IsSearch ? this.ToolClass.GetUrlParams('key') === false ? '' : decodeURI(this.ToolClass.GetUrlParams('key')) : '', // 主搜索关键词
      LocalSearchHistory: JSON.parse(this.$localStorage.get('heypornsearchhistory')) || [], // 本地搜索记录
      LocalViewHistory: JSON.parse(this.$localStorage.get('heypornviewhistory')) || [], // 本地观看记录
      ShowSearchHistory: false // 显隐搜索历史列表
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      AllViewingHistory: x => x.AllViewingHistory, // 观看记录
      HistorySearchList: x => x.HistorySearchList, // 历史搜索记录
      SearchRankingList: x => x.SearchRankingList // 推荐搜索
    }),
    ...mapSearchState({
      SearchRandomKey: x => x.SearchRandomKey // 随机搜索词
    })
  },
  components: {
    ScrollY
  },
  created () {
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
      this.ToolClass.DocumentKeyDown((e) => { // 绑定回车键搜索功能
        if (e.keyCode === 13) { // Enter键
          if (this.ShowSearchHistory) { // 搜索
            window.location.href = `./search.html?key=${this.MainSearchKey || this.SearchRandomKey}`
          }
        }
      })
    })
  },
  methods: {
    ...mapUserActions([
      'DeleteViewingHistory', // 删除用户观看历史
      'GetAllViewingHistory', // 获取用户观看历史
      'GetHistorySearchList', // 获取用户搜索历史
      'CheckIp',
      'Logout' // 登出
    ]),
    ...mapUserMutations([
      'ClearAllViewingHistory', // 清空用户观看记录
      'ClearHistorySearchList', // 清空用户搜索记录
      'SetHistorySearchList', // 设置用户搜索记录
      'SetUserInfo' // 设置用户信息
    ]),
    ...mapSearchActions([
      'GetRandomSearchKey' // 获取随机搜索词
    ]),
    MsgReaded () { // 消息已读
      this.MainMsgType = null
    },
    LinkToMsg () { // 去消息中心
      if (this.MainMsgType === null || this.MainMsgType === 'system') { // 默认跳转至系统消息页面
        window.location.href = `./message.html?type=messages`
      } else if (this.MainMsgType === 'comment') {
        window.location.href = `./message.html?type=comment`
      } else if (this.MainMsgType === 'like') {
        window.location.href = `./message.html?type=like`
      } else {
        window.location.href = `./message.html?type=messages`
      }
    },
    WebSocketInit () {
      if (typeof (WebSocket) !== 'undefined') {
        // this.WebSocket = new WebSocket(`wss://209.127.186.82/api/connect/${this.$localStorage.get('heypornid')}`)
        this.WebSocket = new WebSocket(`ws://209.127.181.50/api/connect/${this.$localStorage.get('heypornid')}`)
        this.WebSocket.onopen = () => {
          window.setInterval(() => {
            this.WebSocket.send('ok')
          }, 60 * 1000)
        }
        this.WebSocket.onerror = () => {
          console.log('socket error')
        }
        this.WebSocket.onmessage = (res) => {
          let Data = JSON.parse(res.data)
          console.log(Data)
          if (Data !== null) {
            if (Data.code !== undefined) { // count接口查询结果
              if (Data.data.commentCnt - 0) {
                this.MainMsgType = 'comment'
              } else if (Data.data.likeCnt - 0) {
                this.MainMsgType = 'like'
              } else if (Data.data.systemCnt - 0) {
                this.MainMsgType = 'system'
              }
            } else { // socket返回结果
              this.MainMsgType = 'system'
            }
          }
        }
      }
    },
    CutMenu () { // 显隐菜单
      this.ShowMenu = !this.ShowMenu
      this.$emit('MenuChange', this.ShowMenu)
    },
    CheckHistory () { // 点击历史记录
      if (this.UserInfo !== null) {
        window.location.href = `./users.html?type=4`
      } else {
        this.$emit('Login')
      }
    },
    MainSearch () { // 主搜索事件
      let Tag = decodeURI(this.ToolClass.GetUrlParams('tag'))
      if (Tag === 'false' || Tag === '') {
        window.location.href = `./search.html?key=${this.MainSearchKey || this.SearchRandomKey}`
      } else {
        window.location.href = `./search.html?tag=${this.ToolClass.GetUrlParams('tag')}&key=${this.MainSearchKey || this.SearchRandomKey}`
      }
    },
    Init () { // 初始化
      this.CheckIp().then((res) => {
        if (res.data.data.flag - 0 === 1) {
          if (window.location.pathname.indexOf('neterror.html') <= -1) {
            window.location.href = `./neterror.html`
          }
        } else {
          if (this.$localStorage.get('heypornid') === null || this.$localStorage.get('heypornid') === 'null') {
            this.ShowToLoginBtn = true
          }
          this.GetRandomSearchKey()
        }
      }).catch(() => {
        if (this.$localStorage.get('heypornid') === null || this.$localStorage.get('heypornid') === 'null') {
          this.ShowToLoginBtn = true
        }
        this.GetRandomSearchKey()
      })
    },
    EmptySearchHistory () { // 清空本地搜索历史
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定（防多次触发）
        this.LocalSearchHistory = []
        this.$localStorage.set('heypornsearchhistory', JSON.stringify(this.LocalSearchHistory))
        this.DataLock = false // 数据解锁
      }
    },
    DeleteViewHistory (type, item, index) { // 删除观看历史
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定（防多次触发）
        if (type - 0 === 0) { // 删除用户观看历史
          this.DeleteViewingHistory({ params: { ids: item.Id, Index: index } }).then(() => {
            this.DataLock = false // 数据解锁
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        } else { // 删除本地观看历史
          this.LocalViewHistory.splice(index, 1)
          this.$localStorage.set('heypornviewhistory', JSON.stringify(this.LocalViewHistory))
          this.DataLock = false // 数据解锁
        }
      }
    },
    ToGetAllViewingHistory () { // 获取用户观看历史
      this.GetAllViewingHistory({ params: { pageNum: 1, pageSize: 10, accountId: this.UserInfo.id } }).then(() => { // 获取用户观看历史
        this.DataLock = false // 数据解锁
        let aDate = new Date(Date.now())
        let CurrentTimeTamp = new Date(aDate.getFullYear(), aDate.getMonth(), aDate.getDate(), 0, 0, 0).getTime()
        this.TodayHistoryArr = []
        this.AgoHistoryArr = []
        this.AllViewingHistory.map((item) => {
          if (item.ViewingDate >= CurrentTimeTamp) {
            this.TodayHistoryArr.push(item)
          } else {
            this.AgoHistoryArr.push(item)
          }
        })
      }).catch(() => {
        this.DataLock = false // 数据解锁
      })
    },
    UserInfoChange () { // 用户信息更新
      if (this.UserInfo !== null) { // 用户登录（获取用户搜索历史、观看历史）
        // this.WebSocketInit()
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定（防多次触发）
          this.GetHistorySearchList({ params: { accountId: this.UserInfo.id } }).then(() => { // 获取用户搜索历史
            this.ToGetAllViewingHistory()
          }).catch(() => {
            this.ToGetAllViewingHistory()
            // this.GetAllViewingHistory({ pageNum: 1, pageSize: 6, accountId: this.UserInfo.id }).then(() => { // 获取用户观看历史
            //   this.DataLock = false // 数据解锁
            // }).catch(() => {
            //   this.DataLock = false // 数据解锁
            // })
          })
        }
      } else { // 用户登出（删除用户搜索历史、观看历史）
        this.ClearAllViewingHistory() // 清空用户观看记录
        this.ClearHistorySearchList() // 清空用户搜索记录
        this.ShowToLoginBtn = true
        if (!this.DataLock) {
          this.DataLock = true // 数据锁定（防多次触发）
          this.GetHistorySearchList().then(() => { // 获取推荐搜索
            this.DataLock = false // 数据解锁
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        }
      }
    },
    MainSearchBlur () { // 主搜索框失去焦点
      window.setTimeout(() => {
        this.ShowSearchHistory = false
      }, 100)
      if (!this.MainNavBgActive) {
        this.ShowBlackBg = false
      }
    },
    SighOut () { // 登出
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定（防多次触发）
        this.Logout({ params: { token: this.$localStorage.get('heypornid') } }).then(() => {
          this.DataLock = false // 数据解锁
          this.SetUserInfo(null) // store用户信息清空
          this.$localStorage.set('heypornid', null) // 移除localStorage中token信息
          this.$emit('UserInfoChange')
        }).catch(() => {
          this.DataLock = false // 数据解锁
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
