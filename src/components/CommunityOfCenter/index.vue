<template>
  <div class="components CommunityOfCenter">
    <nav class="CenterNav">
      <a v-for="(item, index) in NavList" ref="CommunityMainNavItem" :key="index" :class="{'active': CurrentId === item.Id - 0}" @click="CutNav(item, index)">{{item.Name}}</a>
      <div class="ActiveLine" ref="ActiveLine" v-if="AnimiteCalcEnd && CurrentIndex !== null" :style="{left: `${AnimiteArr[CurrentIndex].left}px`, width: `${AnimiteArr[CurrentIndex].width}px`}"></div>
    </nav>
    <nav class="HideNav" v-if="UserInfo !== null && UserInfo.id === CurrentUserId">
      <a :class="{'active': CurrentId === 8}" @click="CutNav({Id: 8}, null)">My subscription</a>
      <a :class="{'active': CurrentId === 9}" @click="CutNav({Id: 9}, null)">Subscribe to me</a>
    </nav>
    <div>

      <!-- 视频 -->
      <div v-if="CurrentId === 2">
        <CommunityOfCenterOfVideos :data="data"></CommunityOfCenterOfVideos>
      </div>

      <!-- 片单 -->
      <div v-if="CurrentId === 3">
        <CommunityOfCenterOfSheet></CommunityOfCenterOfSheet>
      </div>

      <!-- 专辑 -->
      <div v-if="CurrentId === 7">
        <CommunityOfCenterOfAblum></CommunityOfCenterOfAblum>
      </div>

      <!-- 图片 -->
      <div v-if="CurrentId === 4">
        <CommunityOfCenterOfPhoto></CommunityOfCenterOfPhoto>
      </div>

      <!-- 社区 -->
      <div v-if="CurrentId === 5">
        <CommunityOfCenterOfCommunity></CommunityOfCenterOfCommunity>
      </div>

      <!-- 关于 -->
      <div v-if="CurrentId === 6">
        <CommunityOfCenterOfAbout></CommunityOfCenterOfAbout>
      </div>

      <!-- 该用户订阅的 -->
      <div v-if="CurrentId === 8">
        <CommunityOfCenterOfFollow></CommunityOfCenterOfFollow>
      </div>

      <!-- 订阅该用户的 -->
      <div v-if="CurrentId === 9">
        <CommunityOfCenterOfSubscribers></CommunityOfCenterOfSubscribers>
      </div>

    </div>
  </div>
</template>

<script>
/*
  页面名称：社交页面中间部分组件
  创建人：许成祥
  创建时间：2020/03/13
  最近修改人：许成祥
  最近修改日期：2020/04/13
  备注： 无
*/
import CommunityOfCenterOfHome from '../../components/CommunityOfCenterOfHome'
import CommunityOfCenterOfVideos from '../../components/CommunityOfCenterOfVideos'
import CommunityOfCenterOfPhoto from '../../components/CommunityOfCenterOfPhoto'
import CommunityOfCenterOfCommunity from '../../components/CommunityOfCenterOfCommunity'
import CommunityOfCenterOfSheet from '../../components/CommunityOfCenterOfSheet'
import CommunityOfCenterOfAbout from '../../components/CommunityOfCenterOfAbout'
import CommunityOfCenterOfAblum from '../../components/CommunityOfCenterOfAblum'
import CommunityOfCenterOfSubscribers from '../../components/CommunityOfCenterOfSubscribers'
import CommunityOfCenterOfFollow from '../../components/CommunityOfCenterOfFollow'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
export default {
  name: 'CommunityOfCenter',
  props: ['data'],
  data () {
    return {
      CurrentUserId: this.ToolClass.GetUrlParams('key') === false ? null : this.ToolClass.GetUrlParams('key') - 0, // 当前用户id
      CurrentIndex: null, // 当前选中索引值
      CurrentId: this.ToolClass.GetUrlParams('type') === false ? 2 : this.ToolClass.GetUrlParams('type') - 0, // 当前选中id
      NavList: [
        { Name: 'Home', Id: '1' },
        { Name: 'Videos', Id: '2' },
        { Name: 'Playlist', Id: '3' },
        { Name: 'Ablum', Id: '7' },
        { Name: 'Photo', Id: '4' },
        { Name: 'Community', Id: '5' },
        { Name: 'About', Id: '6' }
      ],
      AnimiteCalcEnd: false, // 动画轨迹是否生成
      AnimiteArr: [] // 动画轨迹
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    CommunityOfCenterOfHome,
    CommunityOfCenterOfVideos,
    CommunityOfCenterOfPhoto,
    CommunityOfCenterOfCommunity,
    CommunityOfCenterOfSheet,
    CommunityOfCenterOfAbout,
    CommunityOfCenterOfAblum,
    CommunityOfCenterOfSubscribers,
    CommunityOfCenterOfFollow
  },
  created () {
    this.NavList.map((item, index) => {
      if (item.Id - 0 === this.CurrentId) {
        this.CurrentIndex = index
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.CreateAnimite()
    })
  },
  methods: {
    CutNav (item, index) { // 切换nav
      this.CurrentId = item.Id - 0
      this.ToolClass.ChangeUrlParams([{ name: 'type', value: this.CurrentId }, { name: 'pages', value: 1 }])
      this.CurrentIndex = index
    },
    CreateAnimite () { // 绘制切换动画轨迹
      let CutNavList = this.$refs.CommunityMainNavItem
      let LeftArr = []
      let WidthArr = []
      let CurrentLeft = 0
      CutNavList.map((item, index) => {
        CurrentLeft += item.getBoundingClientRect().width + 20
        LeftArr.push(CurrentLeft)
        WidthArr.push(item.getBoundingClientRect().width)
      })
      LeftArr.unshift(0)
      LeftArr.splice(LeftArr.length - 1, 1)
      LeftArr.map((item, index) => {
        this.AnimiteArr.push({ width: WidthArr[index], left: item })
      })
      this.AnimiteCalcEnd = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
