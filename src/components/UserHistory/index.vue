<template>
  <div class="components UserHistory">
    <div class="Title flex-h">
      <span class="flex-item">History</span>
      <a>
        <i class="iconfont iconsandian" @click.stop="ShowMore = true"></i>
        <ul v-show="ShowMore">
          <li @click="ClearAllRecords">
            <i class="iconfont iconshanchu1"></i>
            <span>Clear all watch history</span>
          </li>
        </ul>
      </a>
    </div>
    <div class="List">
      <div v-for="(item, index) in PageList" :key="index">
        <span>{{ReturnTime(item.Time)}}</span>
        <ul>
          <li v-for="(subItem, subIndex) in item.List" :key="subIndex" class="flex-h">
            <div class="Img">
              <a @mouseover="ShowGifId = subItem.videoId" @mouseout="ShowGifId = null" :href="`./video.html?key=${subItem.videoM}`" target="_self">
                <img :src="subItem.frontPath" class="centerLabel cover" alt="">
                <img v-if="subItem.videoPath !== null && ShowGifId === subItem.videoId" :src="`${subItem.gifPath}Image1/index.gif`" class="Gif centerLabel cover" alt="">
                <span v-if="subItem.capacity"><b>{{JSON.parse(subItem.capacity)[8] - 0 ? 'HD' : ''}}</b> {{ToolClass.DateFormat(subItem.length)}}</span>
              </a>
            </div>
            <div class="flex-item flex-v">
              <div class="flex-item">
                <a :href="`./video.html?key=${subItem.videoM}`" target="_self">{{subItem.title}}</a>
              </div>
              <span><a :href="`./userspace.html?key=${subItem.upId}`" target="_self">{{subItem.upName}}</a></span>
              <div style="margin-top: 10px">
                <span>{{ToolClass.ReturnViews(subItem.displayNum)}} views</span>
                <span v-if="subItem.payVideo - 0 === 1">${{subItem.price}}</span>
              </div>
            </div>
            <div class="Delete">
              <a class="centerLabel">
                <i class="iconfont iconsandian" @click.stop="ShowItemMoreId = subItem.videoId"></i>
                <ul v-show="ShowItemMoreId === subItem.videoId">
                  <li @click="$emit('AddToPlaylist', subItem)">
                    <i class="iconfont iconyewumokuailiebiao"></i>
                    <span>Save to playlist</span>
                  </li>
                  <li @click="DeleteItem(index, subItem, subIndex)">
                    <i class="iconfont iconshanchu"></i>
                    <span>Remove from watch history</span>
                  </li>
                </ul>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="More">
      <div>
        <a class="iconfont iconjiantou1" v-if="HasNextPage" @click="ToGetViewingHistory"></a>
      </div>
    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserHistory',
  props: ['data'],
  data () {
    return {
      ShowMore: false,
      ShowGifId: null,
      ShowItemMoreId: null,
      PageData: {
        pageNum: 1,
        pageSize: 20
      },
      DataLock: false,
      HasNextPage: true,
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
    this.TimeArrInit()
    this.ToGetViewingHistory()
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
      'GetViewingHistory',
      'DeleteViewingHistory',
      'DeleteAllHistory'
    ]),
    ...mapUserMutations([
      'ClearViewingHistory'
    ]),
    ClearAllRecords () { // 清除当前所有记录
      if (!this.DataLock) {
        this.ToolClass.Confirm('Clear history?', 'Your HeyPorn history will be cleared from all HeyPorn apps on all devices.', () => { }, (close) => {
          this.DataLock = true
          let ids = []
          this.PageList.map((item) => {
            item.List.map((subItem) => {
              ids.push(subItem.id)
            })
          })
          this.DeleteAllHistory({ params: { accountId: this.UserInfo.id } }).then(() => {
            this.$notify.success({
              title: 'success',
              message: 'Deleted successfully!'
            })
            close()
            this.DataLock = false
            this.PageData = { pageNum: 1, pageSize: 20 }
            this.HasNextPage = false
            this.PageList = []
          }).catch(() => {
            this.DataLock = false
          })
        }, 'clear history')
      }
    },
    DeleteItem (index, subItem, subIndex) {
      if (!this.DataLock) {
        this.DataLock = true
        this.DeleteViewingHistory({
          params: { ids: subItem.id }
        }).then(() => {
          this.PageList[index].List.splice(subIndex, 1)
          if (!this.PageList[index].List.length) {
            this.PageList.splice(index, 1)
          }
          this.$notify.success({
            title: 'success',
            message: 'Deleted successfully!'
          })
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    ToGetViewingHistory () { // 去获取历史记录
      if (!this.DataLock) {
        this.DataLock = true
        this.GetViewingHistory({
          params: { ...this.PageData, accountId: this.UserInfo.id }
        }).then((res) => {
          this.PushTimeList(res.data.data.list || [])
          this.HasNextPage = res.data.data.hasNextPage
          if (this.HasNextPage) {
            this.PageData.pageNum += 1
          }
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    PushTimeList (list = []) {
      list.map((item) => {
        if (this.PageList.length) {
          if (new Date(item.createTimeStamp).setHours(0, 0, 0, 0) === new Date(this.PageList[this.PageList.length - 1].List[this.PageList[this.PageList.length - 1].List.length - 1].createTimeStamp).setHours(0, 0, 0, 0)) {
            this.PageList[this.PageList.length - 1].List.push({ ...item })
          } else {
            this.PageList.push({ Time: new Date(item.createTimeStamp).setHours(0, 0, 0, 0), List: [{ ...item }] })
          }
        } else {
          this.PageList.push({ Time: new Date(item.createTimeStamp).setHours(0, 0, 0, 0), List: [{ ...item }] })
        }
      })
    },
    TimeArrInit () {
      let TodayTime = new Date(new Date().toLocaleDateString()).getTime() // 今天零点时间戳
      let YesterdayTime = TodayTime - 1000 * 60 * 60 * 24 // 昨天零点时间戳
      this.TimeArr = [TodayTime, YesterdayTime] // 时间节点数据
    },
    ReturnTime (time) {
      if (time === this.TimeArr[0]) {
        return 'Today'
      } else if (time >= this.TimeArr[1]) {
        return 'Yestoday'
      } else {
        return this.ToolClass.DateFormatYear(time, 'YY:MM:DD')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
