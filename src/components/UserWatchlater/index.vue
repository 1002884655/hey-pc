<template>
  <div class="components UserWatchlater">
    <div class="Title flex-h">
      <span>Watch later({{PageList.length}}/{{PageData.pageSize}})</span>
      <a class="PlayAll" v-if="PageList.length" :href="`./video.html?key=${PageList[0].videoM}&type=2`" target="_self">PLAY ALL</a>
      <div class="flex-item"></div>
      <a class="More">
        <i class="iconfont iconsandian" @click.stop="ShowMore = true"></i>
        <ul v-show="ShowMore">
          <li @click="ClearAllRecords">
            <i class="iconfont iconshanchu1"></i>
            <span>Remove watched videos</span>
          </li>
        </ul>
      </a>
    </div>
    <div class="List">
      <ul>
        <li v-for="(item, index) in PageList" :key="index" class="flex-h">
          <div class="Img">
            <a @mouseover="ShowGifId = item.videoId" @mouseout="ShowGifId = null" :href="`./video.html?key=${item.videoM}`" target="_self">
              <img :src="item.front" class="centerLabel cover" alt="">
              <img v-if="item.videoPath !== null && ShowGifId === item.videoId" :src="`${item.gifPath}Image1/index.gif`" class="Gif centerLabel cover" alt="">
              <span v-if="item.capacity"><b>{{JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}}</b> {{ToolClass.DateFormat(item.length)}}</span>
            </a>
          </div>
          <div class="flex-item flex-v">
            <div class="flex-item">
              <a :href="`./video.html?key=${item.videoM}`" target="_self">{{item.title}}</a>
            </div>
            <span><a :href="`./userspace.html?key=${item.upId}`" target="_self">{{item.userName}}</a></span>
            <div style="margin-top: 10px">
              <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
              <span v-if="item.payVideo - 0 === 1">${{item.price}}</span>
            </div>
          </div>
          <div class="Delete">
            <a class="centerLabel">
              <i class="iconfont iconsandian" @click.stop="ShowItemMoreId = item.videoId"></i>
              <ul v-show="ShowItemMoreId === item.videoId">
                <li @click="$emit('AddToPlaylist', item)">
                  <i class="iconfont iconyewumokuailiebiao"></i>
                  <span>Save to playlist</span>
                </li>
                <li @click="DeleteItem(item, index)">
                  <i class="iconfont iconshanchu"></i>
                  <span>Remove from watch later</span>
                </li>
              </ul>
            </a>
          </div>
        </li>
      </ul>
    </div>

    <div class="More">
      <div>
        <a class="iconfont iconjiantou1" v-if="HasNextPage" @click="ToGetWatchLaterVideoList"></a>
      </div>
    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'UserWatchlater',
  props: ['data'],
  data () {
    return {
      ShowMore: false,
      ShowGifId: null,
      ShowItemMoreId: null,
      PageData: {
        pageNum: 1,
        pageSize: 100
      },
      DataLock: false,
      HasNextPage: false,
      PageList: [],
      TimeArr: []
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      ViewingHistory: x => x.ViewingHistory // 用户观看历史
    })
  },
  components: {
  },
  created () {
    this.ToGetWatchLaterVideoList()
  },
  mounted () {
    this.$nextTick(() => {
      this.ToolClass.WindowClick(() => {
        this.ShowMore = false
        this.ShowItemMoreId = null
      })
    })
  },
  methods: {
    ...mapUserActions([
      'GetWatchLaterVideoList',
      'DeleteWatchLaterVideo'
    ]),
    ClearAllRecords () { // 清除当前所有记录
      if (!this.DataLock) {
        this.ToolClass.Confirm('Remove watched videos?', 'This will remove all watched videos from Watch later.', () => { }, (close) => {
          this.DataLock = true
          let ids = []
          this.PageList.map((item) => {
            if (item.status) {
              ids.push(item.id)
            }
          })
          if (ids.length) {
            this.DeleteWatchLaterVideo({ params: { params: { ids: ids.join(','), accountId: this.UserInfo.id } }, index: null }).then((res) => {
              this.$notify.success({
                title: 'success',
                message: res.data.msg
              })
              ids.map((item) => {
                this.PageList.map((subItem, subIndex) => {
                  if (subItem.id - 0 === item - 0) {
                    this.PageList.splice(subIndex, 1)
                  }
                })
              })
              close()
              this.DataLock = false
            }).catch(() => {
              this.DataLock = false
            })
          } else {
            close()
            this.DataLock = false
          }
        }, 'Remove')
      }
    },
    DeleteItem (item, index) {
      if (!this.DataLock) {
        this.DataLock = true
        this.DeleteWatchLaterVideo({ params: { params: { ids: item.id, accountId: this.UserInfo.id } }, index: null }).then((res) => {
          this.PageList.splice(index, 1)
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    ToGetWatchLaterVideoList () { // 去获取稍后观看列表
      if (!this.DataLock) {
        this.DataLock = true
        this.GetWatchLaterVideoList({
          params: { ...this.PageData, accountId: this.UserInfo.id }
        }).then((res) => {
          let Arr = res.data.data.list || []
          Arr.map((item) => {
            if (item.videoId !== null) {
              this.PageList.push({ ...item })
            }
          })
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
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
