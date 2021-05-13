<template>
  <div class="components PlaylistContent">

    <!-- 历史记录 -->
    <UserHistory v-if="Type === 'history'" @AddToPlaylist="AddToPlaylist"></UserHistory>

    <!-- 历史记录 -->
    <UserWatchlater v-if="Type === 'watchLater'" @AddToPlaylist="AddToPlaylist"></UserWatchlater>

    <!-- 封面信息 -->
    <div class="FrontInfo" v-if="ShowPlaylist">
      <div class="flex-h">
        <div class="Front">
          <div>
            <img :src="PlaylistInfo.cover" class="centerLabel cover" alt="">
            <a v-if="PageList.length" :href="`./video.html?key=${PageList[0].videoM}&type=4&sheet=${ToolClass.GetUrlParams('id')}`">
              <i class="iconfont iconbofang"></i>
              <span>PLAY ALL</span>
            </a>
          </div>
        </div>
        <div class="flex-item">
          <div class="NameInfo">
            <div class="Title">
              <span :title="PlaylistInfo.name">{{PlaylistInfo.name}}</span>
            </div>
            <!-- <div class="Tips">{{PlaylistInfo.name}}</div> -->
          </div>
          <div class="flex-h">
            <div class="flex-item">
              <div>
                <span :title="PlaylistInfo.description">{{PlaylistInfo.description}}</span>
              </div>
            </div>
            <!-- <i class="iconfont iconjiantoudown" :title="PlaylistInfo.description" v-if="PlaylistInfo.description !== '' && PlaylistInfo.description !== null"></i> -->
            <!-- <div class="DescInfo">{{PlaylistInfo.description}}</div> -->
          </div>
          <span>{{PlaylistInfo.videoNum}} videos · {{ToolClass.ReturnViews(PlaylistInfo.playNum === undefined ? PlaylistInfo.displayNum : PlaylistInfo.playNum)}} views · {{ToolClass.DateFormatYear(PlaylistInfo.updateTime, 'English')}}</span>
          <span>{{PlaylistInfo.username}} In the {{ToolClass.DateFormatYear(PlaylistInfo.createTime, 'YY:MM:DD')}} created</span>
          <div class="flex-h">
            <span>{{PlaylistInfo.visible - 0 === 1 ? 'Private' : 'Public'}}</span>
            <span v-if="PlaylistInfo.fee - 0 === 1">Price: $ {{PlaylistInfo.price}}</span>
            <div class="flex-item"></div>
            <a class="iconfont iconbianji" v-if="Type === 'created'" @click="$emit('EditPlaylist', PlaylistInfo)"></a>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="ListContainer" v-if="ShowPlaylist">

      <!-- 操作栏 -->
      <div class="flex-h ListSet">
        <a class="Sort">
          <i class="iconfont iconpaixu1"></i>
          <span>Sort</span>
          <ul>
            <li :class="{'active': PageData.sort - 0 === 1}" @click="CutSort(1)">Date added (newest)</li>
            <li :class="{'active': PageData.sort - 0 === 2}" @click="CutSort(2)">Date added (oldest)</li>
            <li :class="{'active': PageData.sort - 0 === 3}" @click="CutSort(3)">Most popular</li>
          </ul>
        </a>
        <div class="flex-item"></div>
        <a class="Cancel" v-if="!IsListEdit" @click="IsListEdit = true">
          <span>Edit</span>
        </a>
        <a class="Cancel" v-if="IsListEdit" @click="CancelEdit">
          <span>Cancel</span>
        </a>
      </div>

      <!-- 列表栏 -->
      <ul class="List">
        <li v-for="(item, index) in PageList" :key="index" class="flex-h" :style="{zIndex: PageList.length - index}">
          <div class="Select" v-if="IsListEdit">
            <a class="iconfont centerLabel" :class="[item.active ? 'iconyitianjia active' : 'iconyuan']" @click="SelectItem(item)"></a>
          </div>
          <div class="Img">
            <a :href="`./video.html?type=4&key=${item.videoM}&sheet=${PlaylistInfo.id}`" target="_self">
              <img :src="item.front" class="centerLabel cover" alt="">
              <span>{{item.capacity && JSON.parse(item.capacity)[8] - 0 ? 'HD' : ''}} {{ToolClass.DateFormat(item.length)}}</span>
            </a>
          </div>
          <div class="flex-item flex-v">
            <div>
              <a :href="`./video.html?type=4&key=${item.videoM}&sheet=${PlaylistInfo.id}`" target="_self">{{item.title}}</a>
            </div>
            <div class="flex-item"></div>
            <div>
              <a :href="`./userspace.html?key=${item.userId}`" target="_self">{{item.userName}}</a>
            </div>
            <div>
              <span>{{ToolClass.ReturnViews(item.displayNum)}} views</span>
              <!-- <img v-if="item.payVideo - 0 === 1" src="../../assets/img/price.png" alt=""> -->
              <span v-if="item.payVideo - 0 === 1">${{item.price}}</span>
            </div>
          </div>
          <div class="More" v-if="!IsListEdit">
            <div class="centerLabel">
              <a class="iconfont iconsandian1"></a>
              <ul>
                <li class="flex-h" @click="ToAddWatchLater(item)">
                  <i class="iconfont iconshaohouguankan" style="font-size: 16px"></i>
                  <span class="flex-item">Save to Watch later</span>
                </li>
                <li class="flex-h" @click="$emit('ItemAddTo', item)">
                  <i class="iconfont iconyewumokuailiebiao"></i>
                  <span class="flex-item">Save to playlist</span>
                </li>
                <li class="flex-h" v-if="Type === 'created'" @click="RemoveItemFromPlaylist(item, index)">
                  <i class="iconfont iconshanchu"></i>
                  <span class="flex-item">Remove from playlist</span>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>

      <div class="NextPage">
        <a v-if="HasNextPage" @click="GetPageList">Load more</a>
        <span v-if="!HasNextPage && PageList.length">Load all</span>
      </div>

      <!-- 占位元素 -->
      <div style="height: 62px"></div>

    </div>

    <!-- 底部操作栏 -->
    <div class="BottomSet" v-if="IsListEdit && ShowPlaylist" :style="{position: BottomFixed ? 'fixed' : 'absolute', left: BottomFixed ? `${BottomLeft}px` : `0`, width: `${BottomWidth}px`}">
      <div class="flex-h">
        <a class="Select" @click="SelectAll">
          <i class="iconfont" :class="[IsSelectAll ? 'iconyitianjia active' : 'iconyuan']"></i>
          <span>All</span>
        </a>
        <a class="AddTo" @click="AllAddTo">
          <i class="iconfont icontianjia"></i>
          <span>Add to</span>
        </a>
        <a class="Remove" @click="AllRemoveFromPlaylist" v-if="Type === 'created' || (Type === 'save' && PlaylistInfo.defaults - 0 === 1)">
          <i class="iconfont iconshanchu1"></i>
          <span>Remove from playlist</span>
        </a>
      </div>
    </div>

  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const UserHistory = () => import('@/components/UserHistory')
const UserWatchlater = () => import('@/components/UserWatchlater')
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapState: mapPlaylistState, mapActions: mapPlaylistActions } = createNamespacedHelpers('playlist')
const { mapActions: mapWatchLaterActions } = createNamespacedHelpers('watchlater')
export default {
  name: 'PlaylistContent',
  props: {
  },
  data () {
    return {
      ShowPlaylist: false,
      FixedHeight: 0,
      BottomWidth: 0,
      BottomLeft: 0,
      BottomFixed: true,
      PlaylistInfo: {}, // 片单信息
      PageData: {
        pageNum: 1,
        pageSize: 10,
        sort: 1
      },
      PageList: [],
      HasNextPage: true,
      DataLock: false,
      IsSelectAll: false, // 是否全选
      IsListEdit: false, // 编辑模式
      Type: this.ToolClass.GetUrlParams('type') // 片单类型：created-自建片单 save-收藏片单
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    }),
    ...mapPlaylistState({
      MyCreatedPlaylist: x => x.MyCreatedPlaylist // 我创建的片单列表
    })
  },
  components: {
    UserHistory,
    UserWatchlater
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.BottomInit()
      this.ToolClass.WindowResize(() => {
        this.BottomInit()
      })
    })
  },
  methods: {
    ...mapPlaylistActions([
      'GetPlaylistInfoById',
      'GetPlaylistChildList',
      'RemoveFromPlaylist'
    ]),
    ...mapWatchLaterActions([
      'AddWatchLater'
    ]),
    Init (target = null) { // 初始化
      if (target !== 'history' && target !== 'watchLater') {
        this.ShowPlaylist = true
        this.Type = this.ToolClass.GetUrlParams('type')
        this.UpdatePlaylistInfo(target)
        this.PageData.pageNum = 1
        this.HasNextPage = true
        this.PageList = []
        this.DataLock = false
        this.IsListEdit = false
        this.GetPageList() // 获取列表
      } else {
        this.ShowPlaylist = false
        this.Type = target
      }
    },
    AddToPlaylist (e) {
      this.$emit('ItemAddTo', { ...e, id: e.videoId })
    },
    PageScroll (top) { // 页面滚动事件
      this.BottomFixed = top <= this.FixedHeight
    },
    PageScrollInit () { // 页面滚动初始化
      if (document.getElementById('PageContainer')) {
        this.FixedHeight = document.getElementById('PageContainer').getBoundingClientRect().height + 78 + 10 - window.innerHeight
      }
    },
    BottomInit () { // 底部操作栏初始化
      if (document.getElementsByClassName('PlaylistContent')[0]) {
        this.BottomWidth = document.getElementsByClassName('PlaylistContent')[0].getBoundingClientRect().width
        this.BottomLeft = document.getElementsByClassName('PlaylistContent')[0].getBoundingClientRect().left
      }
    },
    CutSort (type) { // 切换排序
      this.PageData.sort = type || 1
      this.PageData.pageNum = 1
      this.HasNextPage = true
      this.PageList = []
      this.DataLock = false
      this.IsListEdit = false
      this.GetPageList() // 获取列表
    },
    ToAddWatchLater (item) { // 添加稍后观看
      if (this.DataLock) return
      this.DataLock = true
      this.AddWatchLater({ params: { videoId: item.videoId, accountId: this.UserInfo.id } }).then(() => {
        this.$notify.success({
          title: 'success',
          message: 'Saved to Watch later'
        })
        this.DataLock = false
      }).catch(() => {
        this.DataLock = false
      })
    },
    RemoveItemFromPlaylist (item, index) { // 移除单个视频
      if (this.DataLock) return
      this.DataLock = true
      this.RemoveFromPlaylist({ params: { videoIds: item.videoId, accountId: this.UserInfo.id, groupId: this.PlaylistInfo.id } }).then((res) => {
        this.$notify.success({
          title: 'success',
          message: res.data.msg
        })
        this.PageList.splice(index, 1)
        this.UpdatePlayNum()
        this.$emit('VideoRemove', 1)
        this.DataLock = false
      })
    },
    AllRemoveFromPlaylist () { // 批量移除视频
      if (this.DataLock) return
      this.DataLock = true
      let Arr = []
      this.PageList.map((item) => {
        if (item.active) {
          Arr.push(item.videoId)
        }
      })
      if (Arr.length) {
        this.RemoveFromPlaylist({ params: { videoIds: Arr.join(','), accountId: this.UserInfo.id, groupId: this.PlaylistInfo.id } }).then((res) => {
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          let aArr = []
          this.PageList.map((item) => {
            if (!item.active) {
              aArr.push({ ...item })
            }
          })
          this.PageList = aArr
          this.UpdatePlayNum()
          this.DataLock = false
          this.$emit('VideoRemove', { counts: Arr.length, type: this.PlaylistInfo.defaults - 0 === 1 ? 'save' : 'create' })
        })
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Please select videos'
        })
        this.DataLock = false
      }
    },
    ItemAddTo (item) {
      this.$emit('ItemAddTo', item)
    },
    AllAddTo () { // 批量添加至片单
      let Arr = []
      this.PageList.map((item) => {
        if (item.active) {
          Arr.push(item)
        }
      })
      if (Arr.length) {
        this.$emit('AllAddTo', Arr)
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Please select videos'
        })
      }
    },
    UpdatePlaylistInfo (target = null) { // 更新当前片单信息
      if (target !== null) {
        if (this.PlaylistInfo.cover !== undefined) {
          this.PlaylistInfo.cover = null
        }
        if (this.ToolClass.GetUrlParams('type') === 'created') {
          this.MyCreatedPlaylist.map((item) => {
            if (item.id - 0 === this.ToolClass.GetUrlParams('id') - 0) {
              this.PlaylistInfo = { ...item }
            }
          })
        } else {
          this.PlaylistInfo = { ...target }
        }
      }
      this.UpdatePlayNum()
    },
    UpdatePlayNum () { // 更新播放量
      this.GetPlaylistInfoById({ params: { id: this.PlaylistInfo.id } }).then((res) => {
        this.PlaylistInfo.playNum = res.data.data.totalDisplayNum
      })
    },
    CancelEdit () {
      this.IsListEdit = false
      this.PageList.map((item) => {
        item.active = false
      })
      this.IsSelectAll = false
    },
    SelectItem (item) { // 选择视频
      item.active = !item.active
      this.CheckSelectAll()
    },
    CheckSelectAll () { // 校验全选
      let Bool = true
      this.PageList.map((item) => {
        if (item.active === false) {
          Bool = false
        }
      })
      this.IsSelectAll = Bool
    },
    SelectAll () { // 全选
      if (this.IsSelectAll) {
        this.PageList.map((item) => {
          item.active = false
        })
      } else {
        this.PageList.map((item) => {
          item.active = true
        })
      }
      this.IsSelectAll = !this.IsSelectAll
    },
    GetPageList () { // 获取列表
      if (!this.DataLock && this.HasNextPage) {
        this.DataLock = true
        this.BottomFixed = true
        this.GetPlaylistChildList({ params: { ...this.PageData, groupId: this.ToolClass.GetUrlParams('id') } }).then((res) => {
          let Arr = res.data.data.list || []
          Arr.map((item) => {
            this.PageList.push({ ...item, active: false })
          })
          this.IsSelectAll = false
          this.HasNextPage = res.data.data.hasNextPage
          this.PageData.pageNum += 1
          this.DataLock = false
          this.$nextTick(() => {
            this.PageScrollInit()
          })
        }).catch((res) => {
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
