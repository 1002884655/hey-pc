<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange" :HideFooter="true">
      <div class="Container flex-v" v-if="UserInfo !== null">

        <div class="ContainerTop"></div>

        <div class="flex-item flex-h">

          <!-- 菜单栏 -->
          <div class="MenuListContainer">
            <ScrollY Size="small">
              <div class="UserInfo">
                <div class="flex-h">
                  <div class="Icon">
                    <a>
                      <img :src="UserInfo.picPath2" class="centerLabel cover" alt="">
                    </a>
                    <i class="iconfont iconzhaopian1" @click="ShowImageCropping = true"></i>
                  </div>
                  <span class="flex-item"><a>{{UserInfo.nick}}</a></span>
                </div>
                <ul class="flex-h">
                  <li class="flex-item">
                    <span>{{SubscribeNum}}</span>
                    <span>Followers</span>
                  </li>
                  <li class="flex-item">
                    <span>{{MySubscribeNum}}</span>
                    <span>Following</span>
                  </li>
                  <li class="flex-item">
                    <span>{{MyVideoNum}}</span>
                    <span>Videos</span>
                  </li>
                </ul>
              </div>

              <nav class="MenuList">
                <a v-for="(item, index) in UserTabList" :key="index" v-if="item.Show" :class="{'active': CurrentMenuId === item.Id - 0}">
                  <div class="flex-h" @click="MenuCut(item)">
                    <i class="iconfont" :class="item.Icon"></i>
                    <span class="flex-item">{{item.Value}}</span>
                  </div>
                </a>
              </nav>

              <span class="MenuTitle"></span>

              <nav class="CreativeList">
                <a v-for="(item, index) in CreativeList" :key="index" v-if="item.Show" :class="{'active': CurrentMenuId === item.Id - 0, 'Parent': item.Child.length}">
                  <div class="flex-h" @click="MenuCut(item)">
                    <i class="iconfont" :class="item.Icon"></i>
                    <span class="flex-item">{{item.Value}}</span>
                  </div>
                  <ul v-show="item.ShowChild">
                    <li v-for="(subItem, subIndex) in item.Child" :key="subIndex" @click="SubMenuCut(subItem)" :class="{'active': CurrentMenuId === subItem.Id - 0}">{{subItem.Value}}</li>
                  </ul>
                </a>
                <a @click="ShowChangePassword">
                  <div class="flex-h">
                    <i class="iconfont iconshezhi"></i>
                    <span class="flex-item">Settings</span>
                  </div>
                </a>
              </nav>
            </ScrollY>
          </div>

          <!-- 侧滑栏 -->
          <div class="SwiperMenu"></div>

          <!-- 内容栏 -->
          <div class="CutContainer flex-item" v-if="CurrentMenuId !== null">

            <!-- 我的信息 -->
            <div v-if="CurrentMenuId - 0 === 1">
              <UserForMyInformation></UserForMyInformation>
            </div>

            <!-- 我的推广 -->
            <div v-if="CurrentMenuId - 0 === 2">
              <UserForPromotion></UserForPromotion>
            </div>

            <!-- 我的收藏 -->
            <div v-if="CurrentMenuId - 0 === 3">
              <UserForMyCollection></UserForMyCollection>
            </div>

            <!-- 观看记录 -->
            <div v-if="CurrentMenuId - 0 === 4">
              <UserForRecord></UserForRecord>
            </div>

            <!-- 稍后观看 -->
            <div v-if="CurrentMenuId - 0 === 5">
              <UserForWatchLater></UserForWatchLater>
            </div>

            <!-- 我的片单 -->
            <div v-if="CurrentMenuId - 0 === 6">
              <UserForMySheet></UserForMySheet>
            </div>

            <!-- 我的专辑 -->
            <div v-if="CurrentMenuId - 0 === 7">
              <UserForMyAlbum></UserForMyAlbum>
            </div>

            <!-- 激活粉丝俱乐部 -->
            <div v-if="CurrentMenuId - 0 === 15 && UserInfo.userType - 0 > 1">
              <UserForClubSetting></UserForClubSetting>
            </div>

            <!-- 我的视频管理 -->
            <div v-if="CurrentMenuId - 0 === 8">
              <UserForMyVideoManagement></UserForMyVideoManagement>
            </div>

            <!-- 我的图片 -->
            <div v-if="CurrentMenuId - 0 === 9">
              <UserForMyPhoto></UserForMyPhoto>
            </div>

          </div>

        </div>

      </div>

      <!-- 图片裁剪 -->
      <ImageCropping ref="ImageCropping" v-if="ShowImageCropping" @Close="ShowImageCropping = false"></ImageCropping>

      <!-- 未登录 -->
      <div class="NeedLogin" v-if="UserInfo === null">
        <span>You need to be logged in to continue accessing this page!</span>
        <a @click="$refs.MainPage.Login()">To Login</a>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：个人主页
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2020/05/19
  备注： 无
*/
import MainPage from '../../components/MainPage'
import ScrollY from '../../components/ScrollY'
import UserForWatchLater from '../../components/UserForWatchLater'
import UserForRecord from '../../components/UserForRecord'
import UserForMyCollection from '../../components/UserForMyCollection'
import UserForMySheet from '../../components/UserForMySheet'
import UserForMyAlbum from '../../components/UserForMyAlbum'
import UserForMyPhoto from '../../components/UserForMyPhoto'
import UserForMyVideoManagement from '../../components/UserForMyVideoManagement'
import UserForMyPhotoManagement from '../../components/UserForMyPhotoManagement'
import UserForMyInformation from '../../components/UserForMyInformation'
import UserForPromotion from '../../components/UserForPromotion'
import UserForClubSetting from '../../components/UserForClubSetting'
import ImageCropping from '../../components/ImageCropping'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage,
    ScrollY,
    UserForWatchLater,
    UserForMyCollection,
    UserForMySheet,
    UserForMyAlbum,
    UserForMyPhoto,
    UserForRecord,
    UserForMyVideoManagement,
    UserForMyPhotoManagement,
    UserForMyInformation,
    UserForPromotion,
    ImageCropping,
    UserForClubSetting
  },
  data () {
    return {
      ShowImageCropping: false, // 显隐截图组件
      MyVideoNum: 0,
      SubscribeNum: 0, // 我的粉丝
      MySubscribeNum: 0, // 我订阅别人的数量
      UserTabActiveIndex: null, // 用户选项索引值
      CurrentMenuId: this.ToolClass.GetUrlParams('type') === false || this.ToolClass.GetUrlParams('type') - 0 === 0 ? 1 : this.ToolClass.GetUrlParams('type') - 0,
      UserTabType: null, // 用户选项类型： 'UserTab'-UserTabList, 'Creative'-CreativeList
      UserTabList: [ // 用户选项列表
        { Value: 'Profile', Id: '1', Icon: 'icontouxiang', Child: [], Show: true },
        { Value: 'Promotion', Id: '2', Icon: 'icontuiguang', Child: [], Show: false },
        // { Value: 'Favorite', Id: '3', Icon: 'iconshoucang-', Child: [], Show: true },
        { Value: 'History', Id: '4', Icon: 'iconlishijilu1', Child: [], Show: true },
        { Value: 'Watch later', Id: '5', Icon: 'iconshaohouguankan', Child: [], Show: true },
        // { Value: 'Playlist', Id: '6', Icon: 'icondanye', Child: [], Show: true },
        // { Value: 'Album', Id: '7', Icon: 'iconzhuanji', Child: [], Show: true },
        { Value: 'Wallet', Id: '16', Icon: 'iconwodeqianbao', Child: [], Show: true, Url: './wallet.html' },
        { Value: 'Fansclub Center', Id: '15', Icon: 'iconjihuo', Child: [], Show: false }
      ],
      CreativeList: [ // 创作中心数据
        { Value: 'Video studio', Id: '8', Icon: 'iconshipinliebiao', Child: [], Show: true },
        { Value: 'Photo studio', Id: '9', Icon: 'icontuji', Child: [], Show: false },
        { Value: 'Live management', Id: '10', Icon: 'iconlive', Child: [], Show: false },
        { Value: 'Interactive management', Id: '11', Icon: 'iconhudong', Child: [], Show: false },
        { Value: 'Subscription management', Id: '12', Icon: 'icondingyue1', Child: [], Show: false },
        { Value: 'Fan management', Id: '13', Icon: 'iconfensi', Child: [], Show: false },
        { Value: 'Revenue management', Id: '14', Icon: 'iconshouyi', Child: [], Show: false }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  created () {
    this.MenuInit()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetAccountSubscribe'
    ]),
    ShowChangePassword () { // 显示修改密码弹窗
      this.$refs.MainPage.ChangeLoginType(6)
      this.$refs.MainPage.Login()
    },
    MenuInit () { // 菜单初始化
      this.UserTabList.map((item) => {
        if (item.Child.length) {
          item.Child.map((subItem, subIndex) => {
            if (subItem.Id - 0 === this.CurrentMenuId) {
              item.ShowChild = true
            }
          })
        }
      })
      this.CreativeList.map((item) => {
        if (item.Child.length) {
          item.Child.map((subItem, subIndex) => {
            if (subItem.Id - 0 === this.CurrentMenuId) {
              item.ShowChild = true
            }
          })
        }
      })
    },
    SubMenuCut (subItem) { // 子菜单切换
      this.CurrentMenuId = subItem.Id - 0
      this.ToolClass.ChangeUrlParams([{ name: 'type', value: subItem.Id }], true)
    },
    MenuCut (item) { // 菜单切换
      if (item.Url !== undefined) {
        window.location.href = item.Url
      } else {
        if (item.Child.length) {
          item.ShowChild = !item.ShowChild
        } else {
          this.CurrentMenuId = item.Id - 0
          this.ToolClass.ChangeUrlParams([{ name: 'type', value: item.Id }], true)
        }
      }
    },
    UserInfoChange () { // 用户登录逻辑完成回调
      if (this.UserInfo !== null) {
        if (this.UserInfo.userType - 0 > 1) {
          this.UserTabList.map((item) => {
            if (item.Id - 0 === 15) {
              item.Show = true
            }
          })
        }
        this.GetAccountSubscribe({
          params: { accountId: this.UserInfo.id }
        }).then((res) => {
          if (res.data.code - 0 === 0) {
            this.SubscribeNum = res.data.data.subscribe - 0
            this.MySubscribeNum = res.data.data.mySubscribe - 0
            this.MyVideoNum = res.data.data.videos - 0
          }
        })
        this.UserTabList.map((item) => { // 用户是明星时，显示推广选项
          if (item.Id - 0 === 2 && this.UserInfo.userType - 0 === 4) {
            item.Show = true
          }
        })
      }
    },
    CutUserTab (item, index) { // 切换用户选项
      if (item.Id - 0 !== 1) {
        this.UserTabActiveIndex = index
        window.history.replaceState({}, '', `?type=${index}`) // 同步url参数
      } else {
        window.location.href = `./userspace.html`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
