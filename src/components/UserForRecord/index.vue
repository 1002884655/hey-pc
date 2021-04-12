<template>
  <div class="components UserForRecord">
    <ScrollY>
      <div class="PageContainer">

        <span class="NoData" v-if="!ViewingHistory.length">You didn't watch any videos</span>

        <!-- 头部按钮 -->
        <div class="Header">
          <a @click="ClearAllRecords" v-if="ViewingHistory.length">Clear all records</a>
        </div>

        <!-- 时间轴 -->
        <div class="TimeLine">
          <div v-for="(item, index) in TimeList" :key="index" :class="{'active': item.List.length}">
            <span>{{item.Name}}</span>
            <div v-for="(subItem, subIndex) in item.List" :key="`${index}-${subIndex}`" class="flex-h">
              <div class="Img">
                <a @mouseover="ShowGifId = subItem.videoId" @mouseout="ShowGifId = null" :href="`./video.html?key=${subItem.videoM}`" target="_self">
                  <img :src="subItem.frontPath" class="centerLabel cover" alt="">
                  <img v-if="subItem.videoPath !== null && ShowGifId === subItem.videoId" :src="`${subItem.gifPath}Image1/index.gif`" class="Gif centerLabel cover" alt="">
                  <span v-if="subItem.capacity"><b>{{JSON.parse(subItem.capacity)[8] - 0 ? 'HD' : ''}}</b> {{ToolClass.DateFormat(subItem.length)}}</span>
                </a>
              </div>
              <span class="PlayTime">{{CreateTime(subItem.createTimeStamp)}}</span>
              <div class="flex-item flex-v">
                <div class="flex-item">
                  <a :href="`./video.html?key=${subItem.videoM}`" target="_self">{{subItem.title}}</a>
                </div>
                <span><a :href="`./userspace.html?key=${subItem.upId}`" target="_self">{{subItem.upName}}</a></span>
                <div style="margin-top: 10px">
                  <span>{{ToolClass.ReturnViews(subItem.displayNum)}} views</span>
                  <img v-if="subItem.payVideo - 0 === 1" src="../../assets/img/price.png" alt="">
                  <span v-if="subItem.payVideo - 0 === 1">${{subItem.price}}</span>
                </div>
              </div>
              <div class="Delete">
                <a class="iconfont iconqingkong centerLabel" @click="ToDeleteViewingHistory(subItem.id, index, subIndex)"></a>
              </div>
            </div>
          </div>
        </div>

        <div class="More">
          <div>
            <a class="iconfont iconjiantou1" v-if="HasNextPage" @click="ToGetViewingHistory"></a>
          </div>
        </div>

      </div>
    </ScrollY>
  </div>
</template>

<script>
/*
  页面名称：观看记录
  创建人：许成祥
  创建时间：2020/06/04
  最近修改人：许成祥
  最近修改日期：2020/06/04
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import ScrollY from '../../components/ScrollY'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForRecord',
  props: ['data'],
  data () {
    return {
      ShowGifId: null,
      PageData: {
        pageNum: 1,
        pageSize: 20
      },
      DataLock: false,
      HasNextPage: true,
      TimeArr: [], // 时间节点数据
      TimeList: [] // 时间轴
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      ViewingHistory: x => x.ViewingHistory // 用户观看历史
    })
  },
  components: {
    ScrollY
  },
  created () {
    this.CreateTimeList()
    this.ToGetViewingHistory()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetViewingHistory',
      'DeleteViewingHistory'
    ]),
    ...mapUserMutations([
      'ClearViewingHistory'
    ]),
    ClearAllRecords () { // 清除当前所有记录
      if (!this.DataLock) {
        this.ToolClass.Confirm('Clear history?', 'Your HeyPorn history will be cleared from all HeyPorn apps on all devices.', () => { }, (close) => {
          this.DataLock = true
          let ids = []
          this.TimeList.map((item) => {
            item.List.map((subItem) => {
              ids.push(subItem.id)
            })
          })
          this.DeleteViewingHistory({
            params: { ids: ids.join(',') }
          }).then((res) => {
            this.$notify.success({
              title: 'success',
              message: 'Deleted successfully!'
            })
            close()
            this.DataLock = false
            this.CreateTimeList()
            this.PageData = { pageNum: 1, pageSize: 20 }
            this.HasNextPage = true
            this.ToGetViewingHistory()
          }).catch(() => {
            this.DataLock = false
          })
        }, 'clear history')
      }
    },
    ToDeleteViewingHistory (id, index, subIndex) { // 删除播放记录
      if (!this.DataLock) {
        this.DataLock = true
        this.DeleteViewingHistory({
          params: { ids: id }
        }).then((res) => {
          this.TimeList[index].List.splice(subIndex, 1)
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
    CreateTime (time) { // 生成观看时间
      if (time >= this.TimeArr[1]) { // 昨天以后，显示具体时间
        let hh = new Date(time).getHours()
        let mm = new Date(time).getMinutes()
        return `${hh > 9 ? hh : '0' + hh}:${mm > 9 ? mm : '0' + mm}`
      } else { // 昨天以前，显示日期
        let YY = new Date(time).getFullYear()
        let MM = new Date(time).getMonth() + 1
        let DD = new Date(time).getDate()
        return `${YY}-${MM > 9 ? MM : '0' + MM}-${DD > 9 ? DD : '0' + DD}`
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
    FindTimeParent (time) { // 寻找时间父节点
      let Index = null
      let Bool = true
      this.TimeArr.map((item, index) => {
        if (time >= item && Bool) {
          Index = index
          Bool = false
        }
      })
      return Index
    },
    CreateTimeList () { // 创建时间轴
      let TodayTime = new Date(new Date().toLocaleDateString()).getTime() // 今天零点时间戳
      let YesterdayTime = TodayTime - 1000 * 60 * 60 * 24 // 昨天零点时间戳
      let LastWeekTime = TodayTime - 1000 * 60 * 60 * 24 * 7 // 7天前零点时间戳
      let LastMonthTime = TodayTime - 1000 * 60 * 60 * 24 * 30 // 30天前零点时间戳
      this.TimeArr = [TodayTime, YesterdayTime, LastWeekTime, LastMonthTime, 0] // 时间节点数据
      this.TimeList = [ // 时间轴
        { Time: TodayTime, Name: 'Today', List: [] }, // 今日观看列表
        { Time: YesterdayTime, Name: 'Yesterday', List: [] }, // 昨日观看列表
        { Time: LastWeekTime, Name: 'Last week', List: [] }, // 7天内观看列表
        { Time: LastMonthTime, Name: 'Last month', List: [] }, // 30天内观看列表
        { Time: 0, Name: 'A month ago', List: [] } // 30天之前观看列表
      ]
    },
    PushTimeList (arr) { // 添加时间轴
      arr.map((item) => {
        this.TimeList[this.FindTimeParent(item.createTimeStamp)].List.push(item)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
