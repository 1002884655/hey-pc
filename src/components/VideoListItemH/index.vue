<template>
  <div class="components VideoListItemH flex-h">
    <div class="Img">
      <a :title="Item.title" @mouseover="ShowGif = true" @mouseout="ShowGif = false">
        <img :src="Item.front" class="centerLabel cover" alt="" @click="LinkTo(`./video.html?key=${Item.videoM}`)">
        <img v-if="Item.videoPath !== null && ShowGif" :src="`${Item.gifPath}Image1/index.gif`" class="Gif centerLabel cover" alt="" @click="LinkTo(`./video.html?key=${Item.videoM}`)">
        <span class="Length Capacity" v-if="Item.capacity"><b>{{JSON.parse(Item.capacity)[8] - 0 ? 'HD' : ''}}</b> {{ToolClass.DateFormat(Item.length)}}</span>
        <div></div>
        <a class="iconfont WatchLater" :class="[WatchLater ? 'icondui active' : 'iconshaohouguankan1']" @click="ToAddWatchLater"></a>
        <span class="WatchLaterTips" :class="{'active': WatchLater}">{{WatchLater ? 'ADDED' : 'WATCH LATER'}}</span>
      </a>
    </div>
    <div class="flex-item flex-v">
      <div style="margin-bottom: 3px;" :title="Item.title">
        <a @click="LinkTo(`./video.html?key=${Item.videoM}`)" class="Title" target="_self">{{Item.title}}</a>
      </div>
      <a :href="`./userspace.html?key=${Item.userId}`" class="UpName" target="_self">{{Item.userName}}</a>
      <div class="Bottom">
        <span>{{ToolClass.ReturnViews(Item.displayNum)}} views</span>
        <img v-if="Item.payVideo !== undefined && Item.payVideo - 0 === 1" src="../../assets/img/price.png" alt="">
        <span v-if="Item.payVideo !== undefined && Item.payVideo - 0 === 1">${{Item.price}}</span>
      </div>
      <div class="flex-item"></div>
      <!-- <div class="Price" v-if="Item.payVideo !== undefined && Item.payVideo - 0 === 1">
        <img src="../../assets/img/price.png" alt="">
        <span>${{Item.price}}</span>
      </div> -->
    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'VideoListItemH',
  props: {
    Item: {
      default: null,
      type: Object
    },
    SelfLink: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      WatchLater: false,
      DataLock: false,
      ShowGif: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
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
      'AddWatchLater',
      'CancelWatchLater'
    ]),
    ToAddWatchLater () {
      if (this.DataLock) return
      this.DataLock = true
      if (this.WatchLater) { // 取消稍后观看
        this.CancelWatchLater({ params: { videoId: this.Item.videoId, accountId: this.UserInfo.id } }).then(() => {
          this.WatchLater = false
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      } else { // 添加稍后观看
        this.AddWatchLater({ params: { videoId: this.Item.videoId, accountId: this.UserInfo.id } }).then(() => {
          this.WatchLater = true
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    LinkTo (url) {
      if (this.SelfLink) {
        window.location.href = url
      } else {
        this.$emit('LinkClick')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
