<template>
  <div class="components PlaylistSetPopup">
    <div class="centerLabel">

      <!-- 顶部栏 -->
      <div class="flex-h Top">
        <span class="flex-item">{{IsAdd ? GroupItem === null ? 'New Playlist' : 'Edit Playlist' : 'Save to'}}</span>
        <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
      </div>

      <!-- 内容 -->
      <div class="Content" :style="{height: [(ShowWatchLater && PageList.length <= 6) || (!ShowWatchLater && PageList.length <= 7) ? 'auto' : '300px']}" v-if="Ids.length || AddFromGroup !== null" v-show="!IsAdd">
        <ul class="List" v-if="ShowWatchLater && PageList.length <= 6 || (!ShowWatchLater && PageList.length <= 7)">
          <li class="flex-h" v-if="AddFromGroup === null && ShowWatchLater" @click="TriggerWatchLater">
            <a class="iconfont" :class="[HasAddedToWatchLater ? 'iconyitianjia active' : 'iconyuan']"></a>
            <span class="flex-item" :class="{'active': HasAddedToWatchLater}">Watch later</span>
            <span>({{WatchLaterNum}}/100)</span>
            <i class="iconfont iconicon_huabanfuben" style="opacity: 0"></i>
          </li>
          <li v-for="(item, index) in PageList" :key="index" class="flex-h" @click="Cut(item, index)" :style="{display: PlaylistId - 0 === item.id - 0 && item.defaults - 0 === 1 ? 'none' : 'flex'}">
            <a class="iconfont" :class="[item.exist - 0 === 1 ? 'iconyitianjia active' : 'iconyuan']"></a>
            <span class="flex-item" :class="{'active': item.exist - 0 === 1}">{{item.name}}</span>
            <span>({{item.videoNum}}{{item.defaults - 0 === 0 ? `/${item.maxCount}` : ''}})</span>
            <i class="iconfont" :class="[item.visible - 0 === 1 ? 'iconicon_huabanfuben' : 'icongongkai']"></i>
          </li>
        </ul>
        <ScrollY Size="small" v-else>
          <ul class="List">
            <li class="flex-h" v-if="AddFromGroup === null && ShowWatchLater" @click="TriggerWatchLater">
              <a class="iconfont" :class="[HasAddedToWatchLater ? 'iconyitianjia active' : 'iconyuan']"></a>
              <span class="flex-item" :class="{'active': HasAddedToWatchLater}">Watch later</span>
              <span>({{WatchLaterNum}}/100)</span>
              <i class="iconfont iconicon_huabanfuben" style="opacity: 0"></i>
            </li>
            <li v-for="(item, index) in PageList" :key="index" class="flex-h" @click="Cut(item, index)" :style="{display: PlaylistId - 0 === item.id - 0 && item.defaults - 0 === 1 ? 'none' : 'flex'}">
              <a class="iconfont" :class="[item.exist - 0 === 1 ? 'iconyitianjia active' : 'iconyuan']"></a>
              <span class="flex-item" :class="{'active': item.exist - 0 === 1}">{{item.name}}</span>
              <span>({{item.videoNum}}{{item.defaults - 0 === 0 ? `/${item.maxCount}` : ''}})</span>
              <i class="iconfont" :class="[item.visible - 0 === 1 ? 'iconicon_huabanfuben' : 'icongongkai']"></i>
            </li>
          </ul>
        </ScrollY>
      </div>

      <!-- 新建按钮 -->
      <a class="NewBtn" v-if="!IsAdd" @click="ToAdd">
        <i class="iconfont iconjia"></i>
        <span>New Playlist</span>
      </a>

      <!-- 新建片单 -->
      <div class="NewPlaylistContainer" v-if="IsAdd">
        <span>Title <em>*</em></span>
        <div class="Line flex-h">
          <div class="flex-item">
            <input type="text" placeholder="Add a title" v-model="FormData.name" @input="FormData.name = FormData.name.substring(0, 150)">
          </div>
          <span>({{FormData.name.length}}/150)</span>
        </div>
        <span>Description</span>
        <div class="Line">
          <textarea cols="30" rows="3" placeholder="Add a playlist Description" v-model="FormData.description" @input="FormData.description = FormData.description.substring(0, 500)"></textarea>
          <div>
            <span>({{FormData.description.length}}/500)</span>
          </div>
        </div>
        <!-- <span>Private</span> -->
        <div class="Line" style="margin-top: 20px;">
          <el-select style="width: 100%;" class="InputNoBorder" v-model="FormData.visible">
            <el-option v-for="item in VisibleList" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="Bottom flex-h">
          <a class="flex-item" @click="Cancel">Cancel</a>
          <a class="flex-item" :class="{'active': FormData.name !== '' && !DataLock}" @click="Save">Save</a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
/*
  我创建的片单
*/
import ScrollY from '../ScrollY'
import { Select, Option } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
const { mapState: mapPlaylistState, mapActions: mapPlaylistActions, mapMutations: mapPlaylistMutations } = createNamespacedHelpers('playlist')
export default {
  name: 'PlaylistSetPopup',
  props: {
    ShowWatchLater: {
      default: true,
      type: Boolean
    },
    Ids: { // 视频id集合
      default: () => {
        return []
      },
      type: Array
    },
    GroupItem: { // 编辑片单对象
      default: null,
      type: Object
    },
    AddFromGroup: { // 整体添加视频到片单
      default: null,
      type: Object
    }
  },
  data () {
    return {
      PlaylistId: this.ToolClass.GetUrlParams('id'),
      MaxNum: 0,
      WatchLaterNum: 0,
      HasAddedToWatchLater: false,
      VisibleList: [ // 隐私设置列表
        { value: 'Public, Visible to everyone', id: 0 },
        { value: 'Private, Only visible to yourself', id: 1 }
      ],
      Timer: null,
      IsAdd: false,
      PageList: [],
      DataLock: false,
      FormData: {
        description: '',
        free: 0,
        visible: 0,
        price: 0,
        name: ''
      }
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
    'el-select': Select,
    'el-option': Option,
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
      'AddWatchLater',
      'CancelWatchLater',
      'GetWatchLaterNum'
    ]),
    ...mapPlaylistActions([
      'GetPlaylist',
      'GetCheckPlaylist',
      'AddToPlaylist',
      'RemoveFromPlaylist',
      'AddPlaylist',
      'EditPlaylist',
      'CopyAllToPlaylist',
      'GetUserPlaylistIncludeFavorite',
      'SaveToDefaultPlaylist',
      'RemoveFromDefaultPlaylist',
      'GetPlaylistMaxNum'
    ]),
    ...mapPlaylistMutations([
      'EditMyCreatedPlaylist',
      'AddMyCreatedPlaylist'
    ]),
    Init () { // 初始化
      this.GetPlaylistMaxNum().then((res) => {
        this.MaxNum = res.data.data - 0
      })
      window.clearTimeout(this.Timer)
      if (this.AddFromGroup === null && this.ShowWatchLater) {
        this.GetWatchLaterNum({ params: { accountId: this.UserInfo.id } }).then((res) => {
          this.WatchLaterNum = res.data.data
        })
      }
      if (this.AddFromGroup === null) {
        if (this.GroupItem === null && this.Ids.length) { // 添加收藏模式
          this.PageList = []
          if (this.Ids.length === 1) {
            this.GetUserPlaylistIncludeFavorite({ params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 2000000 } }).then((res) => {
              res.data.data.list.map((item) => {
                this.PageList.push({ ...item })
              })
            })
          } else {
            if (!this.MyCreatedPlaylist.length) {
              this.GetPlaylist({ params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 2000000 } }).then(() => {
                this.MyCreatedPlaylist.map((item) => {
                  this.PageList.push({ ...item, exist: 0 })
                })
              })
            } else {
              this.MyCreatedPlaylist.map((item) => {
                this.PageList.push({ ...item, exist: 0 })
              })
            }
          }
        } else if (this.GroupItem === null && !this.Ids.length) { // 新增片单模式
          // console.log(123)
        } else if (this.GroupItem !== null && !this.Ids.length) { // 编辑片单模式
          this.FormData = {
            description: this.GroupItem.description,
            free: this.GroupItem.free,
            visible: this.GroupItem.visible - 0,
            price: this.GroupItem.price,
            name: this.GroupItem.name
          }
        }
      } else { // 整体移动视频到其他片单
        if (!this.MyCreatedPlaylist.length) {
          this.GetPlaylist({ params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 2000000 } }).then(() => {
            this.MyCreatedPlaylist.map((item) => {
              this.PageList.push({ ...item, exist: item.id - 0 === this.AddFromGroup.id - 0 ? 1 : 0 })
            })
          })
        } else {
          this.MyCreatedPlaylist.map((item) => {
            this.PageList.push({ ...item, exist: item.id - 0 === this.AddFromGroup.id - 0 ? 1 : 0 })
          })
        }
      }
    },
    ToAdd () {
      if (this.PageList.length < this.MaxNum) {
        this.IsAdd = true
      } else {
        this.$notify.error({
          title: 'error',
          message: 'Quantity exceeding limit'
        })
      }
    },
    TriggerWatchLater () {
      if (!this.DataLock) {
        this.DataLock = true
        if (this.HasAddedToWatchLater) { // 取消
          this.CancelWatchLater({ params: { videoId: this.Ids[0], accountId: this.UserInfo.id } }).then((res) => {
            this.$notify.success({
              title: 'success',
              message: res.data.msg
            })
            this.GetWatchLaterNum({ params: { accountId: this.UserInfo.id } }).then((res) => {
              this.WatchLaterNum = res.data.data
            })
            this.HasAddedToWatchLater = false
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        } else { // 添加
          this.AddWatchLater({ params: { videoId: this.Ids[0], accountId: this.UserInfo.id } }).then((res) => {
            this.$notify.success({
              title: 'success',
              message: res.data.msg
            })
            this.GetWatchLaterNum({ params: { accountId: this.UserInfo.id } }).then((res) => {
              this.WatchLaterNum = res.data.data
            })
            this.HasAddedToWatchLater = true
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
    },
    CheckForm () { // 校验新建片单表单
      if (this.FormData.name === '') { // 标题不能为空
        this.$notify.error({
          title: 'error',
          message: 'Please enter a title'
        })
        return false
      }
      return true
    },
    Save () { // 保存
      if (!this.DataLock && this.CheckForm()) {
        this.DataLock = true
        if (this.GroupItem === null) { // 新增片单
          this.AddPlaylist({ data: { ...this.FormData, accountId: this.UserInfo.id } }).then((res) => {
            this.$notify.success({
              title: 'success',
              message: 'Playlist created'
            })
            this.AddMyCreatedPlaylist({ ...res.data.data })
            if (this.Ids.length) { // 添加收藏模式下，新增片单
              this.PageList.unshift({ ...res.data.data })
              this.IsAdd = false
              this.FormDataReset()
            } else { // 新增片单
              this.$emit('CutNewest', res.data.data)
              this.$emit('Close')
            }
            this.DataLock = false
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        } else { // 编辑片单
          this.EditPlaylist({ data: { ...this.FormData, accountId: this.UserInfo.id, id: this.GroupItem.id } }).then((res) => {
            this.MyCreatedPlaylist.map((item, index) => {
              if (item.id - 0 === this.GroupItem.id) {
                this.EditMyCreatedPlaylist({ index, name: 'name', value: this.FormData.name })
                this.EditMyCreatedPlaylist({ index, name: 'description', value: this.FormData.description })
                this.EditMyCreatedPlaylist({ index, name: 'visible', value: this.FormData.visible })
              }
            })
            this.DataLock = false
            this.$notify.success({
              title: 'success',
              message: 'modify successfully!'
            })
            this.$emit('Close')
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false
          })
        }
      }
    },
    FormDataReset () { // 新建片单表单重置
      this.FormData = {
        description: '',
        free: 0,
        visible: 1,
        price: 0,
        name: ''
      }
    },
    Cancel () { // 取消
      if (this.Ids.length) { // 添加收藏时，取消逻辑
        this.IsAdd = false
        this.$nextTick(() => {
          this.FormDataReset()
        })
      } else { // 编辑片单时，取消逻辑
        this.$emit('Close')
      }
    },
    Cut (item, index) { // 切换
      if (!this.DataLock) {
        this.DataLock = true
        if (this.AddFromGroup === null) {
          if (this.Ids.length === 1) { // 单视频操作，复选
            if (item.exist - 0 === 1) { // 取消收藏
              if (index === 0) {
                this.RemoveFromDefaultPlaylist({ params: { accountId: this.UserInfo.id, videoId: this.Ids[0] } }).then(() => {
                  let Num = item.videoNum - 1
                  this.PageList[index].exist = 0
                  this.PageList[index].videoNum = Num
                  this.$emit('DefaultPlaylistChange', Num)
                  this.DataLock = false
                }).catch((res) => {
                  this.$notify.error({
                    title: 'error',
                    message: res.data.msg
                  })
                  this.DataLock = false
                })
              } else {
                this.RemoveFromPlaylist({ params: { accountId: this.UserInfo.id, videoIds: this.Ids[0], groupId: item.id } }).then(() => {
                  let Num = item.videoNum - 1
                  if (this.MyCreatedPlaylist.length) {
                    this.EditMyCreatedPlaylist({ index: index - 1, name: 'exist', value: 0 })
                    this.EditMyCreatedPlaylist({ index: index - 1, name: 'videoNum', value: Num })
                  }
                  this.PageList[index].exist = 0
                  this.PageList[index].videoNum = Num
                  this.DataLock = false
                }).catch((res) => {
                  this.$notify.error({
                    title: 'error',
                    message: res.data.msg
                  })
                  this.DataLock = false
                })
              }
            } else { // 添加收藏
              if (index === 0) {
                this.SaveToDefaultPlaylist({ params: { accountId: this.UserInfo.id, videoId: this.Ids[0] } }).then((res) => {
                  this.PageList[index].exist = 1
                  this.PageList[index].videoNum = res.data.data
                  this.$emit('DefaultPlaylistChange', res.data.data)
                  this.$notify.success({
                    title: 'success',
                    message: `Saved to ${this.PageList[index].name.length > 20 ? `${this.PageList[index].name.substring(0, 20)}...` : this.PageList[index].name}`
                  })
                  this.DataLock = false
                }).catch((res) => {
                  this.DataLock = false
                  this.$notify.error({
                    title: 'error',
                    message: res.data.msg
                  })
                })
              } else {
                this.SaveToDefaultPlaylist({ params: { accountId: this.UserInfo.id, videoId: this.Ids[0], groupId: item.id } }).then((res) => {
                  if (this.MyCreatedPlaylist.length) {
                    this.EditMyCreatedPlaylist({ index: index - 1, name: 'exist', value: 1 })
                    this.EditMyCreatedPlaylist({ index: index - 1, name: 'videoNum', value: res.data.data })
                  }
                  this.PageList[index].exist = 1
                  this.PageList[index].videoNum = res.data.data
                  this.$notify.success({
                    title: 'success',
                    message: `Saved to ${this.PageList[index].name.length > 20 ? `${this.PageList[index].name.substring(0, 20)}...` : this.PageList[index].name}`
                  })
                  this.DataLock = false
                }).catch((res) => {
                  this.DataLock = false
                  this.$notify.error({
                    title: 'error',
                    message: res.data.msg
                  })
                })
              }
            }
          } else if (this.Ids.length > 1) { // 多视频操作，单选
            if (item.exist - 0 === 0) {
              this.AddToPlaylist({ params: { accountId: this.UserInfo.id, videoIds: this.Ids.join(','), groupIds: item.id } }).then((res) => {
                this.EditMyCreatedPlaylist({ index, name: 'exist', value: 1 })
                this.EditMyCreatedPlaylist({ index, name: 'videoNum', value: res.data.data - 0 })
                this.PageList[index].exist = 1
                this.PageList[index].videoNum = res.data.data - 0
                this.DataLock = false
                this.$notify.success({
                  title: 'success',
                  message: `Saved to ${this.PageList[index].name.length > 20 ? `${this.PageList[index].name.substring(0, 20)}...` : this.PageList[index].name}`
                })
                this.Timer = window.setTimeout(() => {
                  this.$emit('Close', 'add')
                }, 300)
              }).catch((res) => {
                this.$notify.error({
                  title: 'error',
                  message: res.data.msg
                })
                this.DataLock = false
              })
            } else {
              this.DataLock = false
            }
          } else {
            this.DataLock = false
          }
        } else { // 整体移动视频到其他片单
          if (item.exist - 0 === 0) {
            this.CopyAllToPlaylist({ params: { accountId: this.UserInfo.id, sourceId: this.AddFromGroup.id, targetId: item.id } }).then((res) => {
              this.EditMyCreatedPlaylist({ index, name: 'exist', value: 1 })
              this.EditMyCreatedPlaylist({ index, name: 'videoNum', value: res.data.data - 0 })
              this.PageList[index].exist = 1
              this.PageList[index].videoNum = res.data.data - 0
              this.DataLock = false
              this.$notify.success({
                title: 'success',
                message: 'add successfully!'
              })
              this.Timer = window.setTimeout(() => {
                this.$emit('Close', item)
              }, 300)
            }).catch((res) => {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
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
