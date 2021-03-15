<template>
  <div class="components MainVideoListItem">
    <div class="Img" @mouseover="$emit('ShowGifIndex', Index)" @mouseout="$emit('ShowGifIndex', null)">
      <img :src="data.frontPath || data.front" class="centerLabel cover" @click="LinkToPlayer" alt="">
      <img v-if="data.gifPath !== null && ShowGif" @click="LinkToPlayer" :src="`${data.gifPath}Image1/index.webp`" class="centerLabel cover" alt="">
      <a class="iconfont WatchLater" :class="[WatchLater ? 'icondui active' : 'iconshaohouguankan1']" @click="TriggerWatchLater"></a>
      <span class="WatchLaterTips" :class="{'active': WatchLater}">{{WatchLater ? 'ADDED' : 'WATCH LATER'}}</span>
      <!-- <img src="../../assets/img/shoufei.png" class="PayIcon" alt="" v-if="data.payVideo !== undefined && data.payVideo === 1"> -->
      <span class="Capacity"><em v-if="data.capacity">{{JSON.parse(data.capacity)[8] - 0 ? 'HD' : ''}}</em> {{ToolClass.DateFormat(data.length)}}</span>
    </div>
    <div class="ItemContent" :class="{'Default': StyleType === 'Default'}">
      <div class="Title flex-h">
        <div class="flex-item">
          <a @click="LinkToPlayer" :title="data.title">{{data.title}}</a>
        </div>
        <span></span>
        <a class="iconfont iconsandian1"></a>
        <div class="More" :class="{'Left': MoreTipsAlign === 'left'}">
          <a class="flex-h" @click="ToWatchLater">
            <i class="iconfont iconshaohouguankan"></i>
            <span>Save to Watch later</span>
          </a>
          <!-- <a class="flex-h" @click="$emit('SaveToFavorite')">
            <i class="iconfont iconshoucang-"></i>
            <span>Save to favorite</span>
          </a> -->
          <a class="flex-h" @click="$emit('SaveToPlaylist')">
            <i class="iconfont iconyemian"></i>
            <span>Save to playlist</span>
          </a>
        </div>
      </div>
      <div class="Line flex-h" v-if="StyleType === 'Default'">
        <div class="flex-item">
          <a :href="`./userspace.html?key=${data.upId}`" target="_self" :title="data.upName">{{data.upName}}</a>
        </div>
      </div>
      <div class="Line flex-h">
        <div class="flex-item">
          <span>{{ToolClass.ReturnViews(data.displayNum || data.displayNum)}} views</span>
        </div>
        <img v-if="data.payVideo !== undefined && data.payVideo === 1" src="../../assets/img/price.png" alt="">
        <span style="font-weight: bold;" v-if="data.payVideo !== undefined && data.payVideo === 1">${{data.price || 0}}</span>
      </div>
    </div>
  </div>
</template>

<script>
/*
  视频列表item
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'MainVideoListItem',
  props: {
    PlaylistId: {
      default: null,
      type: Number
    },
    data: {
      default: null,
      type: Object
    },
    Index: {
      default: null,
      type: Number
    },
    ShowGif: {
      default: false,
      type: Boolean
    },
    WatchLater: {
      default: false,
      type: Boolean
    },
    StyleType: {
      default: 'Default',
      type: String
    },
    MoreTipsAlign: {
      default: 'right',
      type: String
    }
  },
  data () {
    return {
      DataLock: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
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
    LinkToPlayer () {
      if (this.PlaylistId !== null) {
        window.open(`./video.html?key=${this.data.videoM}&type=4&sheet=${this.PlaylistId}`, '_self')
      } else {
        window.open(`./video.html?key=${this.data.videoM}`, '_self')
      }
    },
    ToWatchLater () {
      if (this.UserInfo !== null) {
        if (!this.DataLock) {
          this.DataLock = true
          this.AddWatchLater({ params: { videoId: this.data.videoId, accountId: this.UserInfo.id } }).then((res) => {
            this.DataLock = false // 数据解锁
            if (res.data.code - 0 === 2056) {
              this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                close()
                window.open(`./users.html?type=5`, '_self')
              }, 'Immediately to')
            }
            if (res.data.code - 0 === 0) {
              this.$emit('TriggerWatchLater', { type: 'Add', index: this.Index })
            }
          }).catch((res) => {
            if (res.data.code - 0 === 2056) {
              this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                close()
                window.open(`./users.html?type=5`, '_self')
              }, 'Immediately to')
            }
            this.DataLock = false // 数据解锁
          })
        }
      } else {
        this.$emit('NeedLogin')
      }
    },
    TriggerWatchLater () {
      if (this.UserInfo !== null) {
        if (!this.DataLock) {
          this.DataLock = true
          if (this.WatchLater) { // 取消稍后观看
            this.CancelWatchLater({
              params: { videoId: this.data.videoId, accountId: this.UserInfo.id }
            }).then((res) => {
              this.DataLock = false // 数据解锁
              this.$emit('TriggerWatchLater', { type: 'Cancel', index: this.Index })
            }).catch((res) => {
              this.DataLock = false // 数据解锁
            })
          } else { // 添加稍后观看
            this.AddWatchLater({ params: { videoId: this.data.videoId, accountId: this.UserInfo.id } }).then((res) => {
              this.DataLock = false // 数据解锁
              if (res.data.code - 0 === 2056) {
                this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                  close()
                  window.open(`./users.html?type=5`, '_self')
                }, 'Immediately to')
              }
              if (res.data.code - 0 === 0) {
                this.$emit('TriggerWatchLater', { type: 'Add', index: this.Index })
              }
            }).catch((res) => {
              if (res.data.code - 0 === 2056) {
                this.ToolClass.Confirm('Confirm', 'The number of watch later lists has reached its maximum!', () => { }, (close) => {
                  close()
                  window.open(`./users.html?type=5`, '_self')
                }, 'Immediately to')
              }
              this.DataLock = false // 数据解锁
            })
          }
        }
      } else {
        this.$emit('NeedLogin')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
