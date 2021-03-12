<template>
  <div class="components UserForMyVideoManagement flex-v">

    <!-- 头部操作栏 -->
    <div class="Header flex-h">
      <nav class="flex-item" v-if="!ShowSearch">
        <a v-for="(item, index) in NavList" :key="index" :class="{'active': item.Id - 0 === CurrentMenuId - 0}" @click="CutMenu(item)">{{item.Value}}</a>
      </nav>
      <a class="iconfont iconsousuo" v-if="!ShowSearch" @click="TriggerSearch(true)"></a>
      <div class="flex-item" v-if="ShowSearch">
        <div class="Search flex-h">
          <input type="text" class="flex-item" v-model="SearchKey">
          <a @click="ToSearch"><i class="iconfont iconsousuo"></i></a>
        </div>
      </div>
      <a class="iconfont iconguanbi" v-if="ShowSearch" @click="TriggerSearch(false)"></a>
    </div>

    <div class="flex-item">
      <div>
        <ScrollY>

          <div class="SubContainer">

            <!-- 列表 -->
            <ul class="List">
              <li v-for="(item, index) in VideoAlbumSubList" :key="index" class="flex-h">
                <div class="Img">
                  <a @click="ToVideoPage(item)">
                    <img :src="item.frontPath" class="centerLabel cover" alt="">
                    <span>{{ToolClass.DateFormat(item.length)}}</span>
                  </a>
                </div>
                <div class="flex-item flex-v">
                  <div class="flex-item">
                    <a @click="ToVideoPage(item)">{{item.title}}</a>
                  </div>
                  <span v-if="item.status - 0 !== 3">{{item.status - 0 === 0 ? 'have already uploaded' : item.status - 0 === 1 ? 'under review' : 'transcoding failure'}}</span>
                  <div class="Bottom">
                    <span class="iconfont iconchakan"> {{item.displayNum}}</span>
                    <span class="iconfont icondianzan"> {{item.likeNum}}</span>
                    <span class="iconfont iconshoucang-"> {{item.collectNum}}</span>
                    <span class="iconfont iconpinglun-"> {{item.commentNum}}</span>
                  </div>
                </div>
                <div class="Operation flex-h">
                  <a :href="`./upload.html?type=video&key=${item.videoId}`" target="_self">Edit</a>
                  <a @click="ToDeleteItem(item)">Delete</a>
                </div>
              </li>
            </ul>

            <!-- 分页器 -->
            <div class="Pagination" v-if="Total && VideoAlbumSubList.length">
              <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
            </div>

          </div>

        </ScrollY>
      </div>
    </div>

  </div>
</template>

<script>
/*
  页面名称：视频管理
  创建人：许成祥
  创建时间：2020/06/09
  最近修改人：许成祥
  最近修改日期：2020/06/09
  备注： 无
*/
import Vue from 'vue'
import ScrollY from '../ScrollY'
import { Pagination, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import Popup from '../Popup'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyVideoManagement',
  props: ['data'],
  data () {
    return {
      PageData: {
        pageNum: 1,
        pageSize: 20,
        title: null,
        status: null // 0-已上传 1-审核中 3-已发布 5-转码失败
      },
      CurrentVideoId: null, // 当前操作视频id
      ShowDeleteItemPopup: false, // 显隐删除视频弹窗
      Total: 0, // 列表总数
      SearchKey: '', // 搜索关键词
      ShowSearch: false, // 显隐搜索框
      DataLock: false, // 数据锁
      CurrentMenuId: this.ToolClass.GetUrlParams('submenu') === false || this.ToolClass.GetUrlParams('submenu') - 0 === 0 ? 1 : this.ToolClass.GetUrlParams('submenu') - 0, // 当前选中菜单id
      NavList: [ // 菜单列表
        { Value: 'All', Id: '1' },
        { Value: 'Unpublished', Id: '2' },
        { Value: 'Published', Id: '3' }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoAlbumSubList: x => x.VideoAlbumSubList // 视频列表
    })
  },
  components: {
    'el-pagination': Pagination,
    ScrollY,
    Popup
  },
  created () {
    this.MenuInit()
    this.EmptyVideoAlbumSubList()
    this.ToGetPageVideosByAlbum()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetPageVideosByAlbum',
      'RemoveAlbumSubVideos'
    ]),
    ...mapUserMutations([
      'EmptyVideoAlbumSubList'
    ]),
    ToDeleteItem (item) { // 删除视频
      this.CurrentVideoId = item.videoId
      this.ToolClass.Confirm('Delete video', 'Are you sure to delete this video', () => { }, (close) => {
        this.DeleteItemSure(close)
      })
    },
    DeleteItemSure (callback = () => { }) { // 确认删除视频
      if (!this.DataLock) {
        this.DataLock = true
        this.RemoveAlbumSubVideos({
          params: { ids: this.CurrentVideoId }
        }).then((res) => {
          this.ShowDeleteItemPopup = false
          this.DataLock = false
          callback()
          this.ToGetPageVideosByAlbum()
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    ToVideoPage (item) { // 去播放页
      if (item.status - 0 === 3) {
        window.open(`./video.html?key=${item.videoM}`, '_self')
      }
    },
    PageChange (e) {
      if (!this.DataLock) {
        this.PageData.pageNum = e
        this.ToGetPageVideosByAlbum()
      }
    },
    TriggerSearch (bool) { // 显隐搜索
      if (!this.DataLock) {
        this.ShowSearch = bool
        this.EmptyVideoAlbumSubList()
        if (bool) { // 显示
        } else { // 隐藏
          this.PageData.pageNum = 1
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
          this.PageData.status = this.CurrentMenuId - 0 === 1 ? null : this.CurrentMenuId - 0 === 2 ? 1 : 3
          this.ToGetPageVideosByAlbum()
        }
      }
    },
    ToSearch () { // 搜索
      if (!this.DataLock && this.SearchKey !== '') {
        this.PageData.pageNum = 1
        this.PageData.status = null
        this.ToolClass.ChangeUrlParams([{ name: 'pages', value: 1 }])
        this.ToGetPageVideosByAlbum()
      }
    },
    ToGetPageVideosByAlbum () { // 获取视频列表
      if (!this.DataLock) {
        this.DataLock = true
        let Params = {}
        this.PageData.title = this.ShowSearch ? this.SearchKey : null
        this.PageData.status = this.CurrentMenuId - 0 === 1 ? null : this.CurrentMenuId - 0 === 2 ? 1 : 3
        for (let n in this.PageData) {
          if (this.PageData[n] !== null && this.PageData[n] !== '') {
            Params[n] = this.PageData[n]
          }
        }
        this.GetPageVideosByAlbum({
          params: { ...Params, accountId: this.UserInfo.id }
        }).then((res) => {
          this.PageData.pageNum = res.data.data.pageNum
          this.Total = res.data.data.total
          this.ToolClass.ChangeUrlParams([{ name: 'pages', value: this.PageData.pageNum }])
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    MenuInit () { // 菜单初始化
      if (this.ToolClass.GetUrlParams('submenu') === false) {
        this.ToolClass.ChangeUrlParams([{ name: 'submenu', value: 1 }])
      }
    },
    CutMenu (item) { // 切换菜单
      if (!this.DataLock) {
        this.CurrentMenuId = item.Id
        this.PageData.pageNum = 1
        this.Total = 0
        this.PageData.status = item.Id - 0 === 1 ? null : item.Id - 0 === 2 ? 1 : 3
        this.ToolClass.ChangeUrlParams([{ name: 'submenu', value: item.Id }, { name: 'pages', value: 1 }])
        this.EmptyVideoAlbumSubList()
        this.ToGetPageVideosByAlbum()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
