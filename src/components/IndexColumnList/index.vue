<template>
  <div class="components IndexColumnList">
    <div class="flex-h">
      <span class="Title">{{Title}}</span>
      <div class="flex-item" v-if="!ShowCutNav"></div>
      <nav class="flex-item" v-if="ShowCutNav">
        <!-- <a v-for="(item, index) in CutList" :key="index" :class="{'active': index === ActiveIndex}" @click="CutItem(item, index)">{{item.name}}</a> -->
      </nav>
      <a @click="Refresh" v-if="List.length > 10">refresh</a>
      <a @click="$emit('LinkToMore')">+ more</a>
    </div>
    <ul class="LoadingList" v-if="!List.length">
      <li v-for="(item, index) in 10" :key="index">
        <div class="Img"></div>
        <div class="LineContainer">
          <div class="Line"></div>
          <div class="Line"></div>
          <div class="Line"></div>
        </div>
      </li>
    </ul>
    <ul class="List" v-if="List.length">
      <li v-for="(item, index) in PageList" :style="{zIndex: PageList.length - index}" :key="index">
        <MainVideoListItem :data="item" :WatchLater="item.WatchLater" :Index="index" :ShowGif="ShowIndex === index" StyleType="Default" :MoreTipsAlign="(index + 1) % 5 === 0 ? 'left' : 'right'" @ShowGifIndex="ShowGifIndex" @TriggerWatchLater="ToAddWatchLater" @NeedLogin="$emit('NeedLogin')" @SaveToFavorite="AddToMyFavorite(item)" @SaveToPlaylist="AddToMyPlaylist(item)"></MainVideoListItem>
      </li>
    </ul>
  </div>
</template>

<script>
/*
  页面名称：首页栏目组件
  创建人：许成祥
  创建时间：2020/06/22
  最近修改人：许成祥
  最近修改日期：2020/06/22
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import MainVideoListItem from '../MainVideoListItem'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'IndexColumnList',
  props: {
    DataLock: {
      default: false,
      type: Boolean
    },
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
      PageDataLock: false,
      ArrPos: [0, 10],
      Step: 1,
      ShowIndex: null, // 当前显示gif索引值
      ActiveIndex: 0,
      CutList: [{ name: 'Hot day', id: '1' }, { name: 'Hot week', id: '2' }, { name: 'Hot month', id: '3' }]
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
    MainVideoListItem
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'AddCollect',
      'AddWatchLater',
      'CancelWatchLater'
    ]),
    ShowGifIndex (e) {
      this.ShowIndex = e
    },
    Refresh () { // 换一换
      if (this.List.length >= 30) {
        this.ArrPos = this.Step === 1 ? [10, 20] : this.Step === 2 ? [20, 30] : [0, 10]
        this.Step = this.Step === 1 ? 2 : this.Step === 2 ? 3 : 1
      } else {
        this.ArrPos = this.Step === 1 ? [10, 20] : [0, 10]
        this.Step = this.Step === 1 ? 2 : 1
      }
    },
    CheckLogin (callback) { // 检验登录
      if (this.UserInfo !== null) { // 用户已登录
        callback()
      } else { // 用户未登录
        this.$emit('NeedLogin')
      }
    },
    AddToMyFavorite (item) { // 添加到收藏
      this.CheckLogin(() => {
        this.$emit('AddToMyFavorite', item.videoId)
      })
    },
    AddToMyPlaylist (item) { // 添加到播单
      this.CheckLogin(() => {
        this.$emit('AddToMyPlaylist', item.videoId)
      })
    },
    AddToWatchLater (item, index) { // 添加稍后观看（不取消）
      this.CheckLogin(() => {
        if (!this.PageDataLock) {
          this.PageDataLock = true // 数据锁定
          this.AddWatchLater({ params: { videoId: item.videoId, accountId: this.UserInfo.id } }).then((res) => {
            this.PageDataLock = false // 数据解锁
            if (res.data.code - 0 === 2056) {
              this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                close()
                window.open(`./users.html?type=5`, '_self')
              }, 'Immediately to')
            }
            if (res.data.code - 0 === 0) {
              this.PageList[index].WatchLater = true
              this.$emit('Notify', { type: 'success', value: res.data.msg })
            }
          }).catch((res) => {
            if (res.data.code - 0 === 2056) {
              this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                close()
                window.open(`./users.html?type=5`, '_self')
              }, 'Immediately to')
            }
            this.PageDataLock = false // 数据解锁
          })
        }
      })
    },
    ToAddWatchLater (e) { // 添加稍后观看（可取消）
      if (e.type === 'Add') {
        this.PageList[e.index].WatchLater = true
        this.$notify.success({ title: 'success', message: 'has been added' })
      } else {
        this.PageList[e.index].WatchLater = false
        this.$notify.success({ title: 'success', message: 'has been removed' })
      }
    },
    CutItem (item, index) {
      if (!this.DataLock && this.ActiveIndex !== index) {
        this.ArrPos = [0, 10]
        this.Step = 1
        this.$emit('Change', item.id)
        this.ActiveIndex = index
      }
    },
    LinkToMedia (id) { // 跳转到视频页
      window.open(`./video.html?key=${id}`, '_self')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
