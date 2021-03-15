<template>
  <div class="components PlaylistContent">

    <!-- 封面信息 -->
    <div class="FrontInfo">
      <div class="flex-h">
        <div class="Front">
          <div>
            <img :src="PlaylistInfo.cover" class="centerLabel cover" alt="">
            <a v-if="PageList.length" :href="`./video.html?key=${PageList[0].videoM}&type=4&sheet=${ToolClass.GetUrlParams('id')}`">
              <i class="iconfont iconbofang"></i>
              <span>Play all</span>
            </a>
          </div>
        </div>
        <div class="flex-item">
          <div class="NameInfo">
            <span>{{PlaylistInfo.name}}</span>
            <div>{{PlaylistInfo.name}}</div>
          </div>
          <div>
            <span>{{PlaylistInfo.description}}</span>
            <i class="iconfont iconjiantoudown" v-if="PlaylistInfo.description !== '' && PlaylistInfo.description !== null"></i>
            <div class="DescInfo">{{PlaylistInfo.description}}</div>
          </div>
          <span>{{PlaylistInfo.videoNum}} videos · {{ToolClass.ReturnViews(PlaylistInfo.playNum)}} views · {{ToolClass.DateFormatYear(PlaylistInfo.updateTime, 'YY:MM:DD')}}</span>
          <span>Teuginmarting In the {{ToolClass.DateFormatYear(PlaylistInfo.createTime, 'YY:MM:DD')}} created</span>
          <div class="flex-h">
            <span>{{PlaylistInfo.visible - 0 === 1 ? 'Public' : 'Privacy'}}</span>
            <span v-if="PlaylistInfo.fee - 0 === 1">Price: $ {{PlaylistInfo.price}}</span>
            <div class="flex-item"></div>
            <a class="iconfont iconbianji" v-if="Type === 'created'" @click="$emit('EditPlaylist', PlaylistInfo)"></a>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="ListContainer">

      <!-- 操作栏 -->
      <div class="flex-h ListSet">
        <a class="Sort">
          <i class="iconfont iconpaixu"></i>
          <span>Sort</span>
          <ul>
            <li :class="{'active': PageData.sort - 0 === 1}" @click="CutSort(1)">Date added (newest)</li>
            <li :class="{'active': PageData.sort - 0 === 2}" @click="CutSort(2)">Date added (oldest)</li>
            <li :class="{'active': PageData.sort - 0 === 3}" @click="CutSort(3)">Most popular</li>
          </ul>
        </a>
        <div class="flex-item"></div>
        <a class="Cancel" v-if="Type === 'created' && !IsListEdit" @click="IsListEdit = true">
          <span>Edit</span>
        </a>
        <a class="Cancel" v-if="Type === 'created' && IsListEdit" @click="CancelEdit">
          <span>Cancel</span>
          <i class="iconfont iconjiantouright"></i>
        </a>
      </div>

      <!-- 列表栏 -->
      <ul class="List">
        <li v-for="(item, index) in PageList" :key="index" class="flex-h" :style="{zIndex: PageList.length - index}">
          <div class="Select" v-if="Type === 'created' && IsListEdit">
            <a class="iconfont iconyitianjia centerLabel" :class="{'active': item.active}" @click="SelectItem(item)"></a>
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
              <span>{{ToolClass.ReturnViews(item.playNum)}} views</span>
              <img v-if="item.payVideo - 0 === 1" src="../../assets/img/price.png" alt="">
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
                <li class="flex-h" @click="$emit('AllAddTo', [item])">
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
        <span v-else>Load all</span>
      </div>

      <!-- 占位元素 -->
      <div style="height: 62px"></div>

    </div>

    <!-- 底部操作栏 -->
    <div class="BottomSet" v-if="Type === 'created' && IsListEdit">
      <div class="flex-h">
        <a class="Select" @click="SelectAll">
          <i class="iconfont iconyitianjia" :class="{'active': IsSelectAll}"></i>
          <span>All</span>
        </a>
        <a class="AddTo" @click="AllAddTo">
          <i class="iconfont icontianjia"></i>
          <span>Add to</span>
        </a>
        <a class="Remove" @click="AllRemoveFromPlaylist">
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
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapState: mapPlaylistState, mapActions: mapPlaylistActions } = createNamespacedHelpers('playlist')
const { mapActions: mapWatchLaterActions } = createNamespacedHelpers('watchlater')
export default {
  name: 'PlaylistContent',
  props: {
  },
  data () {
    return {
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
      Type: null // 片单类型：created-自建片单 save-收藏片单
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
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapPlaylistActions([
      'GetPlaylistChildList',
      'RemoveFromPlaylist'
    ]),
    ...mapWatchLaterActions([
      'AddWatchLater'
    ]),
    Init (target = null) { // 初始化
      this.Type = this.ToolClass.GetUrlParams('type')
      this.UpdatePlaylistInfo(target)
      this.PageData.pageNum = 1
      this.HasNextPage = true
      this.PageList = []
      this.DataLock = false
      this.IsListEdit = false
      this.GetPageList() // 获取列表
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
          message: 'add successfully!'
        })
        this.DataLock = false
      }).catch(() => {
        this.DataLock = false
      })
    },
    RemoveItemFromPlaylist (item, index) { // 移除单个视频
      if (this.DataLock) return
      this.DataLock = true
      this.ToolClass.Confirm('Confirm', `Are you sure to remove this video?`, () => { this.DataLock = false }, (close) => {
        this.RemoveFromPlaylist({ params: { videoIds: item.videoId, accountId: this.UserInfo.id, groupId: this.PlaylistInfo.id } }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'remove successfully!'
          })
          this.PageList.splice(index, 1)
          this.DataLock = false
          close()
        })
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
        this.ToolClass.Confirm('Confirm', `Are you sure to remove these video?`, () => { this.DataLock = false }, (close) => {
          this.RemoveFromPlaylist({ params: { videoIds: Arr.join(','), accountId: this.UserInfo.id, groupId: this.PlaylistInfo.id } }).then(() => {
            this.$notify.success({
              title: 'success',
              message: 'remove successfully!'
            })
            this.PageList.map((item, index) => {
              if (item.active) {
                this.PageList.splice(index, 1)
              }
            })
            this.DataLock = false
            this.CancelEdit()
            close()
          })
        })
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Please select videos'
        })
        this.DataLock = false
      }
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
        this.GetPlaylistChildList({ params: { ...this.PageData, groupId: this.ToolClass.GetUrlParams('id') } }).then((res) => {
          let Arr = res.data.data.list || []
          Arr.map((item) => {
            this.PageList.push({ ...item, active: false })
          })
          this.IsSelectAll = false
          this.HasNextPage = res.data.data.hasNextPage
          this.PageData.pageNum += 1
          this.DataLock = false
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
