<template>
  <div class="components SaveToFavorites">
    <div class="centerLabel">
      <div class="Title flex-h">
        <span class="flex-item">{{Type === 'Save' ? Title : 'New favorite'}}</span>
        <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
      </div>
      <div class="Content" v-if="Type === 'Save'" :style="{height: VideoCollectCategoryList.length <= 6 ? 'auto' : '240px'}">
        <ul class="List" v-if="VideoCollectCategoryList.length <= 6">
          <li v-for="(item, index) in VideoCollectCategoryList" :key="index" class="flex-h" :class="{'active': item.Active}" @click="SaveToFavorite(item, index)">
            <i class="iconfont iconweigouxuan"></i>
            <i class="iconfont icongouxuan"></i>
            <span class="flex-item">{{item.name}}</span>
            <span>{{item.defaults - 0 === 1 ? `${item.videoNum}/999` : `${item.videoNum}/255`}}</span>
          </li>
        </ul>
        <ScrollY Size="small" v-if="VideoCollectCategoryList.length > 6">
          <ul class="List">
            <li v-for="(item, index) in VideoCollectCategoryList" :key="index" class="flex-h" :class="{'active': item.Active}" @click="SaveToFavorite(item, index)">
              <i class="iconfont iconweigouxuan"></i>
              <i class="iconfont icongouxuan"></i>
              <span class="flex-item">{{item.name}}</span>
              <span>{{item.defaults - 0 === 1 ? `${item.videoNum}/999` : `${item.videoNum}/255`}}</span>
            </li>
          </ul>
        </ScrollY>
      </div>
      <div class="Bottom" v-if="Type === 'Save'">
        <a @click="Type = 'Add'" class="Add">
          <i class="iconfont iconic_join_dialing_norm"></i>
          <span>New favorite</span>
        </a>
      </div>
      <div class="Form" v-if="Type === 'Add'">
        <span>Favorite title <em>(Limit 80 characters)</em></span>
        <div class="flex-h">
          <input type="text" placeholder="Enter up to 80 characters" v-model="NewFavoriteName" class="flex-item" @input="NewFavoriteName = NewFavoriteName.substring(0, 80)">
          <span>{{NewFavoriteName.length}}/80</span>
        </div>
        <div class="FormBottom">
          <a @click="Type = 'Save'; NewFavoriteName = ''">Cancel</a>
          <a @click="NewFavorite">Save</a>
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
  name: 'SaveToFavorites',
  props: {
    Title: {
      default: 'Save to favorites'
    },
    Ids: { // 收藏ids
      default: null
    },
    Pid: { // 收藏夹id
      default: null
    }
  },
  data () {
    return {
      NewFavoriteName: '', // 新建收藏夹名称
      Type: 'Save', // 类型 Save-添加 Add-新增收藏夹
      NextIndex: null, // 上一个选择索引值
      DataLock: false // 数据锁
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoCollectCategoryList: x => x.VideoCollectCategoryList // 用户所有视频收藏夹列表
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
      'GetVideoCollectCategory',
      'AddVideoCollectCategory',
      'AddVideoCollect',
      'CheckCategory',
      'CancelVideoCollect',
      'RemoveVideoCollect'
    ]),
    ...mapUserMutations([
      'EditVideoCollectCategory'
    ]),
    NewFavorite () { // 新增收藏夹
      if (!this.DataLock) {
        if (this.NewFavoriteName !== '') {
          this.DataLock = true
          this.AddVideoCollectCategory({ params: { name: this.NewFavoriteName, accountId: this.UserInfo.id } }).then((res) => {
            this.$emit('Change', { Type: 'AddFavorite' })
            this.$notify.success({
              title: 'success',
              message: res.data.msg
            })
            this.Type = 'Save'
            if (this.NextIndex > 0) {
              this.NextIndex += 1
            }
            this.NewFavoriteName = ''
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        } else {
          this.$notify.error({
            title: 'error',
            message: 'The favorite name cannot be empty'
          })
        }
      }
    },
    Init () { // 初始化
      this.GetVideoCollectCategory({ params: { accountId: this.UserInfo.id } }).then(() => {
        this.VideoCollectCategoryList.map((item, index) => {
          if (item.Active) {
            this.EditVideoCollectCategory({ index, name: 'Active', value: false })
          }
        })
        if (`${this.Ids}`.split(',').length > 1) {
          this.VideoCollectCategoryList.map((item, index) => {
            if (item.id - 0 === this.Pid - 0) {
              this.EditVideoCollectCategory({ index, name: 'Active', value: true })
              this.NextIndex = index
            }
          })
        }
        this.CheckList()
      })
    },
    CheckList () {
      if (`${this.Ids}`.split(',').length === 1) {
        this.DataLock = true
        this.CheckCategory({ params: { accountId: this.UserInfo.id, videoId: this.Ids } }).then((res) => {
          let Arr = res.data.data || []
          Arr.map((item, index) => {
            if (item.exist - 0) {
              this.NextIndex = index
              this.EditVideoCollectCategory({ index, name: 'Active', value: true })
            }
          })
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    SaveToFavorite (item, index) { // 保存到收藏
      if (!this.DataLock) {
        this.DataLock = true
        if (`${this.Ids}`.split(',').length === 1) {
          if (item.Active) { // 取消收藏
            this.CancelVideoCollect({ params: { videoIds: this.Ids, accountId: this.UserInfo.id } }).then(() => {
              this.$emit('Change', { Type: 'Remove', Id: this.Ids, Pid: this.VideoCollectCategoryList[this.NextIndex].id })
              this.EditVideoCollectCategory({ index: this.NextIndex, name: 'Active', value: false })
              this.EditVideoCollectCategory({ index: this.NextIndex, name: 'videoNum', value: this.VideoCollectCategoryList[this.NextIndex].videoNum - 1 })
              this.NextIndex = null
              this.DataLock = false
            }).catch(() => {
              this.DataLock = false
            })
          } else { // 收藏
            if (this.NextIndex !== null) {
              this.AddVideoCollect({
                params: {
                  videoId: this.Ids,
                  accountId: this.UserInfo.id,
                  categoryId: item.id,
                  oldCategoryId: this.VideoCollectCategoryList[this.NextIndex].id
                }
              }).then(() => {
                this.$emit('Change', { Type: 'AddVideo', Id: this.Ids, Pid: this.VideoCollectCategoryList[index].id })
                this.EditVideoCollectCategory({ index: this.NextIndex, name: 'Active', value: false })
                this.EditVideoCollectCategory({ index: this.NextIndex, name: 'videoNum', value: this.VideoCollectCategoryList[this.NextIndex].videoNum - 1 })
                this.EditVideoCollectCategory({ index, name: 'Active', value: true })
                this.EditVideoCollectCategory({ index, name: 'videoNum', value: this.VideoCollectCategoryList[index].videoNum + 1 })
                this.NextIndex = index
                this.DataLock = false
              }).catch(() => {
                this.DataLock = false
              })
            } else {
              this.AddVideoCollect({
                params: {
                  videoId: this.Ids,
                  accountId: this.UserInfo.id,
                  categoryId: item.id
                }
              }).then(() => {
                this.$emit('Change', { Type: 'AddVideo', Id: this.Ids, Pid: this.VideoCollectCategoryList[index].id })
                this.EditVideoCollectCategory({ index, name: 'Active', value: true })
                this.EditVideoCollectCategory({ index, name: 'videoNum', value: this.VideoCollectCategoryList[index].videoNum + 1 })
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
        } else { // 转移
          if (!item.Active) {
            this.RemoveVideoCollect({ params: { ids: this.Ids, accountId: this.UserInfo.id, categoryId: item.id } }).then(() => {
              this.$emit('Change', { Type: 'MoveVideos', Id: this.Ids, Pid: this.VideoCollectCategoryList[index].id })
              this.EditVideoCollectCategory({ index: this.NextIndex, name: 'Active', value: false })
              this.EditVideoCollectCategory({ index: this.NextIndex, name: 'videoNum', value: this.VideoCollectCategoryList[this.NextIndex].videoNum - `${this.Ids}`.split(',').length })
              this.EditVideoCollectCategory({ index, name: 'Active', value: true })
              this.EditVideoCollectCategory({ index, name: 'videoNum', value: this.VideoCollectCategoryList[index].videoNum + `${this.Ids}`.split(',').length })
              this.NextIndex = index
              this.DataLock = false
            }).catch(() => {
              this.DataLock = false
            })
          } else {
            this.DataLock = false
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
