<template>
  <div class="components MainPage">

    <div class="TestLine"></div>

    <!-- 页头 -->
    <MainNav ref="MainNav" v-show="Show" :MainNavActiveIndex="MainNavActiveIndex" @Login="Login" @UserInfoChange="UserInfoChange" :MainNavBgActive="MainNavBgActive" :IsSearch="IsSearch" @MenuChange="LeftMenuChange" :ShowHeaderMenu="ShowHeaderMenu"></MainNav>

    <!-- 账号操作（登录、注册、设置密码、找回密码） -->
    <NewAccountOperation ref="NewAccountOperation" @UserInfoChange="UserInfoChange" @RegEnd="ShowEditMoreUserInfo = true"></NewAccountOperation>

    <!-- 完善个人信息 -->
    <EditMoreUserInfo ref="EditMoreUserInfo" v-if="ShowEditMoreUserInfo" @Close="ShowEditMoreUserInfo = false"></EditMoreUserInfo>

    <!-- 网速估算组件 -->
    <NetSpeedTest @TestEnd="NetSpeedTestEnd"></NetSpeedTest>

    <!-- 认证状态弹窗 -->
    <SgsStatusPopup v-if="ShowSgsPopup" :SgsInfo="SgsInfo" @Close="ShowSgsPopup = false"></SgsStatusPopup>

    <!-- 左侧菜单 -->
    <div class="MainLeftMenu" :class="{'active': ShowLeftMenu}">
      <nav>
        <a v-for="(item, index) in ClassNavList" :key="index" @click="LinkTo(item.Url)">
          <i class="iconfont" :class="item.Icon"></i>
          <span>{{item.Name}}</span>
        </a>
      </nav>
    </div>

    <!-- 正文 -->
    <div class="MainContainer">
      <ScrollY @ScrollTop="MainPageScroll" :RefId="`MainPageScroll`">
        <div class="SubMainContainer" :style="{minHeight: `${WindowHeight}px`}">
          <slot></slot>
          <div style="width: 100%; height: 92px;"></div>
        </div>
        <div class="SubMainFooter">
          <PageFooter v-if="!HideFooter"></PageFooter>
        </div>
      </ScrollY>
    </div>
  </div>
</template>

<script>
/*
  页面名称：页面主框架（页头、页脚、内容slot）
  创建人：许成祥
  创建时间：2019/12/19
  最近修改人：许成祥
  最近修改日期：2020/03/25
  备注： 无
*/
import MainNav from '../MainNav'
import ScrollY from '../ScrollY'
import NewAccountOperation from '../NewAccountOperation'
import SgsStatusPopup from '../SgsStatusPopup'
import EditMoreUserInfo from '../EditMoreUserInfo'
import NetSpeedTest from '../NetSpeedTest'
import PageFooter from '../PageFooter'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapSgsActions } = createNamespacedHelpers('sgs')
export default {
  name: 'MainPage',
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
    },
    Show: {
      type: Boolean,
      default: true
    },
    HideFooter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      SgsInfo: null,
      ShowSgsPopup: false,
      WindowHeight: document.body.clientHeight,
      ShowLeftMenu: false,
      ShowEditMoreUserInfo: false,
      ClassNavList: [ // 分类nav数据
        { Name: 'Home', Icon: 'iconshouye', Url: './index.html' },
        { Name: 'Video', Icon: 'iconshipin', Url: './videoindex.html' },
        { Name: 'Playlist', Icon: 'iconliebiao', Url: './more.html?type=playlist' },
        // { Name: 'Social', Icon: 'iconshequ', Url: './community.html' },
        { Name: 'Live', Icon: 'iconzhibo', Url: './livelist.html' }
        // { Name: 'Live', Icon: 'iconzhibo', Url: null },
        // { Name: 'Photo', Icon: 'iconzhaopian1', Url: null }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    MainNav,
    ScrollY,
    PageFooter,
    NetSpeedTest,
    NewAccountOperation,
    EditMoreUserInfo,
    SgsStatusPopup
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      window.onresize = () => {
        this.WindowHeight = document.body.clientHeight // 屏幕高度
      }
      this.Init()
    })
  },
  methods: {
    ...mapSgsActions([
      'GetSgsInfo'
    ]),
    LeftMenuChange (e) {
      this.ShowLeftMenu = e
    },
    LinkTo (url) {
      if (url !== null) {
        window.open(url, '_self')
      }
    },
    Init () { // 初始化
    },
    MsgReaded () { // 消息已读
      this.$refs.MainNav.MsgReaded()
    },
    ChangeLoginType (num) { // 修改登录弹窗类型
      this.$refs.NewAccountOperation.Type = num - 0 || 1
    },
    Login () { // 登录
      this.$refs.NewAccountOperation.Show = true
    },
    UserInfoChange () { // 用户信息更新
      this.$refs.MainNav.UserInfoChange()
      this.$emit('UserInfoChange')
      if (this.UserInfo !== null) {
        this.GetSgsInfo({ params: { accountId: this.UserInfo.id } }).then((res) => {
          this.SgsInfo = res.data.data
          if (this.SgsInfo.auditConfirm - 0 !== 1) {
            if (this.SgsInfo.certStatus - 0 === 0 || (this.SgsInfo.certStatus - 0 === 4 && this.SgsInfo.certAudit - 0 === 0) || window.location.pathname.indexOf('sgs.html') > -1) { // 未认证or认证中 不需要弹窗
              this.ShowSgsPopup = false
            } else {
              if (this.SgsInfo.certStatus - 0 < 4) { // 未认证完成
                if (window.localStorage.heypornsgshistory !== undefined) {
                  let SgsArr = JSON.parse(window.localStorage.heypornsgshistory)
                  let Bool = false
                  SgsArr.map((item) => {
                    if (item.id - 0 === this.UserInfo.id - 0) {
                      Bool = true
                      if (item.time !== this.ToolClass.DateFormatYear(Date.now(), 'YY:MM:DD')) {
                        this.ShowSgsPopup = true
                      }
                    }
                  })
                  if (!Bool) {
                    this.ShowSgsPopup = true
                  }
                } else {
                  this.ShowSgsPopup = true
                }
              } else {
                this.ShowSgsPopup = true
              }
            }
          }
        })
      }
    },
    NetSpeedTestEnd (e) { // 网速估算结束回调
      this.$emit('NetSpeedTestEnd', e)
    },
    MainPageScroll (e) { // 页面滚动回调
      this.$emit('MainPageScroll', e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
