<template>
  <div class="components SaveToPlaylist">
    <div class="centerLabel">
      <div class="Title flex-h">
        <span class="flex-item">{{Type === 'Save' ? Title : 'New playlist'}}</span>
        <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
      </div>
      <div class="Content" v-if="Type === 'Save'" :style="{height: MyPieceGroupList.length <= 6 ? 'auto' : '240px'}">
        <ul class="List" v-if="MyPieceGroupList.length <= 5">
          <li class="flex-h" v-if="ShowSaveToWatchLater" :class="{'active': HasWatchLater}" @click="ToSaveToWatchLater">
            <i class="iconfont iconweigouxuan"></i>
            <i class="iconfont icongouxuan"></i>
            <span class="flex-item">Watch later</span>
            <span>{{WatchLaterNum}}/100</span>
          </li>
          <li v-for="(item, index) in MyPieceGroupList" :key="index" class="flex-h" :class="{'active': item.Active}" @click="SaveToPlaylist(item, index)">
            <i class="iconfont iconweigouxuan"></i>
            <i class="iconfont icongouxuan"></i>
            <span class="flex-item">{{item.name}}</span>
            <span>{{item.defaults - 0 === 1 ? item.videoNum : `${item.videoNum}/255`}}</span>
          </li>
        </ul>
        <ScrollY Size="small" v-if="MyPieceGroupList.length > 5">
          <ul class="List">
            <li class="flex-h" v-if="ShowSaveToWatchLater" :class="{'active': HasWatchLater}" @click="ToSaveToWatchLater">
              <i class="iconfont iconweigouxuan"></i>
              <i class="iconfont icongouxuan"></i>
              <span class="flex-item">Watch later</span>
              <span>{{WatchLaterNum}}/100</span>
            </li>
            <li v-for="(item, index) in MyPieceGroupList" :key="index" class="flex-h" :class="{'active': item.Active}" @click="SaveToPlaylist(item, index)">
              <i class="iconfont iconweigouxuan"></i>
              <i class="iconfont icongouxuan"></i>
              <span class="flex-item">{{item.name}}</span>
              <span>{{item.defaults - 0 === 1 ? item.videoNum : `${item.videoNum}/255`}}</span>
            </li>
          </ul>
        </ScrollY>
      </div>
      <div class="Bottom" v-if="Type === 'Save'">
        <a @click="Type = 'Add'" class="Add">
          <i class="iconfont iconic_join_dialing_norm"></i>
          <span>New playlist</span>
        </a>
      </div>
      <div class="Form" v-if="Type === 'Add'">
        <span>Playlist title <em>(Limit 32 characters)</em></span>
        <div class="flex-h">
          <input type="text" placeholder="Enter up to 32 characters" v-model="NewPlaylistName" class="flex-item" @input="NewPlaylistName = NewPlaylistName.substring(0, 32)">
          <span>{{NewPlaylistName.length}}/32</span>
        </div>
        <span style="margin-top: 20px;">Playlist description</span>
        <div class="Textarea">
          <textarea placeholder="Enter description" cols="30" rows="3" v-model="NewPlaylistDesc" @input="NewPlaylistDesc = NewPlaylistDesc.substring(0, 256)"></textarea>
          <div><span>{{NewPlaylistDesc.length}}/256</span></div>
        </div>
        <div class="Agreement flex-h">
          <a class="iconfont" :class="[Agree ? 'icongouxuan active' : 'iconweigouxuan']" @click="Agree = !Agree"></a>
          <span class="flex-item">You are creating a public playlists.</span>
        </div>
        <div class="FormBottom">
          <a @click="Type = 'Save'; NewPlaylistName = ''">Cancel</a>
          <a @click="NewPlaylist">Save</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
  添加到收藏
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import ScrollY from '../ScrollY'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'SaveToPlaylist',
  props: {
    ShowSaveToWatchLater: {
      default: false
    },
    Title: {
      default: 'Save to playlist'
    },
    Pid: {
      default: null
    },
    Ids: { // 收藏ids
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      WatchLaterNum: 0,
      HasWatchLater: false,
      Agree: false,
      NewPlaylistDesc: '', // 新建片单简介
      NewPlaylistName: '', // 新建片单名称
      Type: 'Save', // 类型 Save-添加 Add-新增片单
      NextIndex: null, // 上一个选择索引值
      DataLock: false // 数据锁
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      MyPieceGroupList: x => x.MyPieceGroupList // 用户所有视频片单列表
    })
  },
  components: {
    ScrollY
  },
  created () {
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetPieceGroup',
      'AddPieceGroup',
      'AddPieceGroupSubItem',
      'CheckPlaylist',
      'AddWatchLater',
      'CancelWatchLater',
      'GetWatchLaterNum'
    ]),
    ...mapUserMutations([
      'EditPieceGroupList'
    ]),
    Init () { // 初始化
      if (this.ShowSaveToWatchLater) {
        this.GetWatchLaterNum({ params: { accountId: this.UserInfo.id } }).then((res) => {
          this.WatchLaterNum = res.data.data
        })
      }
      if (this.MyPieceGroupList.length) {
        this.MyPieceGroupList.map((item) => {
          item.Active = false
        })
      }
      this.GetPieceGroup({ params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 255 } }).then(() => {
        this.MyPieceGroupList.map((item, index) => {
          item.Active = false
          if (this.Pid !== null && item.id - 0 === this.Pid - 0) {
            this.NextIndex = index
          }
        })
        if (this.Ids.length === 1) { // 单个视频添加
          this.CheckPlaylist({ params: { pageNum: 1, pageSize: 255, accountId: this.UserInfo.id, videoId: this.Ids[0] } }).then((res) => {
            let Arr = res.data.data.list || []
            Arr.map((item, index) => {
              if (item.exist - 0) {
                this.EditPieceGroupList({ index, name: 'Active', value: true })
              }
            })
          })
        } else { // 批量添加
          this.MyPieceGroupList.map((item) => {
            if (item.id - 0 === this.Pid - 0) {
              item.Active = true
            }
          })
        }
      })
    },
    ToSaveToWatchLater () {
      if (this.DataLock) return
      this.DataLock = true
      if (this.HasWatchLater) { // 取消添加到稍后观看
        this.CancelWatchLater({ params: { videoId: this.Ids[0], accountId: this.UserInfo.id } }).then((res) => {
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.WatchLaterNum = this.WatchLaterNum >= 100 ? 100 : this.WatchLaterNum + 1
          this.HasWatchLater = false
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      } else { // 添加到稍后观看
        this.AddWatchLater({ params: { videoId: this.Ids[0], accountId: this.UserInfo.id } }).then((res) => {
          this.$notify.success({
            title: 'success',
            message: res.data.msg
          })
          this.HasWatchLater = true
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    NewPlaylist () { // 新建片单
      if (this.NewPlaylistName !== '') {
        if (this.Agree) {
          if (!this.DataLock) {
            this.DataLock = true
            this.AddPieceGroup({ data: { name: this.NewPlaylistName, accountId: this.UserInfo.id, description: this.NewPlaylistDesc } }).then((res) => {
              this.$emit('Change', { Type: 'AddPlaylist' })
              this.$notify.success({
                title: 'success',
                message: res.data.msg
              })
              this.Type = 'Save'
              this.NewPlaylistName = ''
              this.NewPlaylistDesc = ''
              this.DataLock = false // 数据解锁
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false
            })
          }
        } else {
          this.$notify.error({
            title: 'error',
            message: 'The playlist name cannot be empty'
          })
        }
      }
    },
    SaveToPlaylist (item, index) { // 添加到片单
      if (!this.DataLock) {
        this.DataLock = true
        if (item.Active) { // 取消
          this.AddPieceGroupSubItem({ params: { videoIds: this.Ids.join(','), accountId: this.UserInfo.id, cGroupIds: this.MyPieceGroupList[index].id } }).then(() => {
            this.$emit('Change', { Type: 'Remove', Ids: this.Ids, Pid: this.MyPieceGroupList[index].id })
            this.EditPieceGroupList({ index, name: 'Active', value: false })
            this.EditPieceGroupList({ index, name: 'videoNum', value: this.MyPieceGroupList[index].videoNum - this.Ids.length })
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        } else { // 添加
          if (this.Pid === null) { // 批量添加
            this.AddPieceGroupSubItem({ params: { videoIds: this.Ids.join(','), accountId: this.UserInfo.id, groupIds: this.MyPieceGroupList[index].id } }).then(() => {
              this.$emit('Change', { Type: 'Add', Ids: this.Ids, Pid: this.MyPieceGroupList[index].id })
              this.EditPieceGroupList({ index, name: 'Active', value: true })
              this.EditPieceGroupList({ index, name: 'videoNum', value: this.MyPieceGroupList[index].videoNum + this.Ids.length })
              this.DataLock = false
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false
            })
          } else { // 批量移动
            this.AddPieceGroupSubItem({ params: { videoIds: this.Ids.join(','), accountId: this.UserInfo.id, groupIds: this.MyPieceGroupList[index].id, cGroupIds: this.MyPieceGroupList[this.NextIndex].id } }).then(() => {
              this.$emit('Change', { Type: 'Move', Ids: this.Ids, Pid: this.MyPieceGroupList[index].id })
              this.EditPieceGroupList({ index: this.NextIndex, name: 'Active', value: false })
              this.EditPieceGroupList({ index: this.NextIndex, name: 'videoNum', value: this.MyPieceGroupList[this.NextIndex].videoNum - this.Ids.length })
              this.EditPieceGroupList({ index, name: 'Active', value: true })
              this.EditPieceGroupList({ index, name: 'videoNum', value: this.MyPieceGroupList[index].videoNum + this.Ids.length })
              this.NextIndex = index
              this.DataLock = false
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
              this.DataLock = false
            })
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
