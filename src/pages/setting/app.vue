<template>
  <div id="app">
    <MainPage @UserInfoChange="Init" :HideFooter="true">
      <div class="PageContainer flex-h">

        <!-- 左侧菜单 -->
        <div class="LeftMenu" v-if="UserInfo !== null">
          <ul>
            <li v-for="(item, index) in MenuList" :key="index">
              <a @click="CutParent(item)" :class="{'active': item.id === CurrentPid}">{{item.name}}</a>
              <div v-show="CurrentPid === item.id">
                <a v-for="(subItem, subIndex) in item.child" :key="subIndex" :class="{'active': subItem.id === CurrentMenuId}" @click="CutMenu(subItem)">
                  <i class="iconfont" :class="subItem.icon"></i>
                  <span>{{subItem.name}}</span>
                </a>
              </div>
            </li>
          </ul>
        </div>

        <!-- 右侧内容 -->
        <div class="RightContent flex-item" v-if="UserInfo !== null">
          <div class="Title flex-h">
            <span class="flex-item">{{CurrentMenuName}}</span>
            <a v-if="ShowCancel" @click="Cancel">Cancel</a>
          </div>

          <!-- 用户具体信息 -->
          <div v-if="CurrentMenuId === 2">
            <SettingForProfile ref="SettingForProfile"></SettingForProfile>
          </div>

          <!-- 账号信息 -->
          <div v-if="CurrentMenuId === 3">
            <SettingForAccount ref="SettingForAccount" @TitleChange="TitleChange"></SettingForAccount>
          </div>

          <!-- 粉丝俱乐部 -->
          <div v-if="CurrentMenuId === 4">
            <SettingForFanClub ref="SettingForFanClub"></SettingForFanClub>
          </div>

        </div>

      </div>
    </MainPage>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MainPage from '@/components/MainPage'
const SettingForProfile = () => import('@/components/SettingForProfile')
const SettingForAccount = () => import('@/components/SettingForAccount')
const SettingForFanClub = () => import('@/components/SettingForFanClub')
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage,
    SettingForProfile,
    SettingForAccount,
    SettingForFanClub
  },
  data () {
    return {
      ShowCancel: false,
      CurrentMenuName: null,
      CurrentMenuId: null,
      CurrentPid: null,
      MenuList: [
        { name: 'SETTINGS', id: 1, child: [{ name: 'Profile', id: 2, icon: 'iconyonghu', pid: 1 }, { name: 'Account', id: 3, icon: 'iconzhanghu', pid: 1 }, { name: 'Fan Club', id: 4, icon: 'iconjulebushenhe', pid: 1 }, { name: 'Notifications', id: 5, icon: 'icontongzhi1', pid: 1 }] },
        { name: 'YOUR CHANNEL', id: 6, child: [] },
        { name: 'WALLET', id: 7, child: [] },
        { name: 'VIDEO STUDIO', id: 8, child: [] },
        { name: 'LIVE STUDIO', id: 9, child: [] },
        { name: 'MODEL PROJECT', id: 10, child: [] }
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
    ]),
    Init () {
    },
    Cancel () {
      if (this.$refs.SettingForAccount) {
        this.$refs.SettingForAccount.Cancel()
      }
      this.ShowCancel = false
    },
    MenuInit () {
      let UrlId = this.ToolClass.GetUrlParams('id') - 0
      if (UrlId) {
        let Bool = false
        this.MenuList.map((item) => {
          item.child.map((cItem) => {
            if (cItem.id - 0 === UrlId) {
              Bool = true
              this.CurrentPid = cItem.pid
              this.CurrentMenuId = cItem.id
              this.CurrentMenuName = cItem.name
            }
          })
        })
        if (!Bool) {
          this.CurrentPid = 1
          this.CurrentMenuId = 2
          this.CurrentMenuName = 'Profile'
          this.ToolClass.ChangeUrlParams([{ name: 'id', value: 2 }])
        }
      } else {
        this.CurrentPid = 1
        this.CurrentMenuId = 2
        this.CurrentMenuName = 'Profile'
        this.ToolClass.ChangeUrlParams([{ name: 'id', value: 2 }])
      }
    },
    TitleChange (e) {
      this.CurrentMenuName = e
      this.ShowCancel = true
    },
    CutParent (item) {
      if (item.child.length && item.id !== this.CurrentPid) {
        this.CurrentPid = item.id
        this.ShowCancel = false
      }
    },
    CutMenu (item) {
      if (item.id !== this.CurrentMenuId) {
        this.CurrentPid = item.pid
        this.CurrentMenuId = item.id
        this.CurrentMenuName = item.name
        this.ShowCancel = false
        this.ToolClass.ChangeUrlParams([{ name: 'id', value: item.id }])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
