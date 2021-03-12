<template>
  <div class="components IndexPlayList" v-if="List.length">
    <div class="flex-h">
      <span class="Title">{{Title}}</span>
      <div class="flex-item"></div>
      <a @click="Refresh">refresh</a>
      <a href="./more.html?type=playlist" target="_self">+ more</a>
    </div>
    <ul>
      <li v-for="(item, index) in PageList" :key="index" :style="{zIndex: PageList.length - index}">
        <a class="Img">
          <img :src="item.cover" class="centerLabel cover" alt="">
          <div class="Layer">
            <div class="centerLabel">
              <span>{{item.videoNum}}</span>
              <i class="iconfont iconshipinliebiao"></i>
            </div>
          </div>
          <div class="PlayAll">
            <a class="Bg" :href="`./sheet.html?key=${item.upId}&sheet=${item.id}`" target="_self"></a>
            <a class="centerLabel" :href="`./video.html?type=4&sheet=${item.id}`" target="_self">
              <i class="iconfont iconbofang"></i>
              <span>Play All</span>
            </a>
          </div>
        </a>
        <div>
          <div class="Title flex-h">
            <a class="flex-item" :href="`./sheet.html?key=${item.upId}&sheet=${item.id}`" target="_self">{{item.name}}</a>
            <a class="iconfont iconsandian1">
              <div class="Tips" :class="{'Left': (index + 1) % 5 === 0}">
                <a class="flex-h" @click="AddToMyFavorite(item)">
                  <i class="iconfont iconshoucang-"></i>
                  <span>Save to favorite</span>
                </a>
              </div>
            </a>
            <span></span>
          </div>
          <a :href="`./userspace.html?key=${item.upId}`" target="_self">{{item.upName}}</a>
          <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/*
  页面名称：首页播单组件
  创建人：许成祥
  创建时间：2020/06/28
  最近修改人：许成祥
  最近修改日期：2020/06/28
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'IndexPlayList',
  props: {
    Title: {
      default: 'Title',
      type: String
    },
    List: {
      default: () => {
        return []
      },
      type: Array
    },
    ShowCutNav: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      ArrPos: [0, 10],
      Step: 1
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    }),
    PageList () {
      return this.List.slice(this.ArrPos[0], this.ArrPos[1]) || []
    }
  },
  components: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
    ]),
    AddToMyFavorite (item) { // 添加到收藏
      this.CheckLogin(() => {
        this.$emit('AddToMyFavorite', item.id)
      })
    },
    CheckLogin (callback) { // 检验登录
      if (this.UserInfo !== null) { // 用户已登录
        callback()
      } else { // 用户未登录
        this.$emit('NeedLogin')
      }
    },
    Refresh () { // 换一换
      this.ArrPos = this.Step === 1 ? [10, 20] : this.Step === 2 ? [20, 30] : [0, 10]
      this.Step = this.Step === 1 ? 2 : this.Step === 2 ? 3 : 1
    },
    CutItem (item, index) {
      this.$emit('Change', item.id)
      this.ActiveIndex = index
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
