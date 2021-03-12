<template>
  <div class="components MoveToOtherAlbum">
    <div class="centerLabel">
      <div class="Title flex-h">
        <span class="flex-item">{{Type === 'Save' ? 'Move to other album' : 'New album'}}</span>
        <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
      </div>
      <div class="Content" v-if="Type === 'Save'" :style="{height: VideoAlbumList.length <= 6 ? 'auto' : '240px'}">
        <ul class="List" v-if="VideoAlbumList.length <= 6">
          <li v-for="(item, index) in VideoAlbumList" :key="index" class="flex-h" :class="{'active': item.MoveActive}" @click="MoveToOtherAlbum(item, index)">
            <i class="iconfont iconweigouxuan"></i>
            <i class="iconfont icongouxuan"></i>
            <span class="flex-item">{{item.name}}</span>
            <span>{{item.defaults - 0 === 1 ? item.videoNum : `${item.videoNum}/255`}}</span>
          </li>
        </ul>
        <ScrollY Size="small" v-if="VideoAlbumList.length > 6">
          <ul class="List">
            <li v-for="(item, index) in VideoAlbumList" :key="index" class="flex-h" :class="{'active': item.MoveActive}" @click="MoveToOtherAlbum(item, index)">
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
          <span>New album</span>
        </a>
      </div>
      <div class="Form" v-if="Type === 'Add'">
        <span>Album title <em>(Limit 32 characters)</em></span>
        <div class="flex-h">
          <input type="text" placeholder="Enter up to 32 characters" v-model="NewAlbumName" class="flex-item" @input="NewAlbumName = NewAlbumName.substring(0, 32)">
          <span>{{NewAlbumName.length}}/32</span>
        </div>
        <span style="margin-top: 20px;">Album description</span>
        <div class="Textarea">
          <textarea placeholder="Enter description" cols="30" rows="3" v-model="NewAlbumDesc" @input="NewAlbumDesc = NewAlbumDesc.substring(0, 256)"></textarea>
          <div><span>{{NewAlbumDesc.length}}/256</span></div>
        </div>
        <div class="FormBottom">
          <a @click="Type = 'Save'; NewAlbumName = ''">Cancel</a>
          <a @click="NewAlbum">Save</a>
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
  name: 'MoveToOtherAlbum',
  props: {
    Title: {
      default: 'Save to album'
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
      NewAlbumDesc: '', // 新建片单简介
      NewAlbumName: '', // 新建片单名称
      Type: 'Save', // 类型 Save-添加 Add-新增片单
      NextIndex: null, // 上一个选择索引值
      DataLock: false // 数据锁
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoAlbumList: x => x.VideoAlbumList // 用户所有视频专辑列表
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
      'GetVideoAlbum',
      'CreateVideoAlbum',
      'MoveAlbumVideos'
    ]),
    ...mapUserMutations([
      'EditVideoAlbumList'
    ]),
    Init () { // 初始化
      this.GetVideoAlbum({ params: { accountId: this.UserInfo.id } }).then(() => { // 获取专辑列表
        this.VideoAlbumList.map((item, index) => {
          if (this.Pid - 0 === item.id - 0) {
            this.EditVideoAlbumList({ index, name: 'MoveActive', value: true })
            this.NextIndex = index
          }
        })
      })
    },
    NewAlbum () {
      if (!this.DataLock) {
        this.DataLock = true
        this.CreateVideoAlbum({ data: { name: this.NewAlbumName, accountId: this.UserInfo.id, description: this.NewAlbumDesc } }).then(() => {
          this.NextIndex += 1
          this.Type = 'Save'
          this.NewAlbumName = ''
          this.NewAlbumDesc = ''
          this.DataLock = false // 数据解锁
        }).catch(() => {
          this.DataLock = false // 数据解锁
        })
      }
    },
    MoveToOtherAlbum (item, index) {
      if (!this.DataLock && !item.MoveActive) {
        this.DataLock = true
        this.MoveAlbumVideos({ params: { ids: this.Ids.join(','), accountId: this.UserInfo.id, albumId: item.id, sourceAlbumId: this.Pid } }).then(() => {
          this.$emit('Change', { Type: 'Move' })
          this.EditVideoAlbumList({ index: this.NextIndex, name: 'MoveActive', value: false })
          this.EditVideoAlbumList({ index: this.NextIndex, name: 'videoNum', value: this.VideoAlbumList[this.NextIndex].videoNum - this.Ids.length })
          this.EditVideoAlbumList({ index, name: 'MoveActive', value: true })
          this.EditVideoAlbumList({ index, name: 'videoNum', value: this.VideoAlbumList[index].videoNum + this.Ids.length })
          this.NextIndex = index
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
