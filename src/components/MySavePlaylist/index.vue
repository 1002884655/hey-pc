<template>
  <div class="components MySavePlaylist">
    <div class="Title">
      <div class="flex-h">
        <span class="flex-item">Playlists you saved</span>
        <span>({{PageList.length}}/200)</span>
        <i class="iconfont" :class="[ShowList ? 'iconjiantoudown' : 'iconjiantouright']" @click="ShowList = !ShowList"></i>
      </div>
    </div>
    <div class="ListContainer" v-show="ShowList">
      <ul v-if="PageList.length <= 8" class="List">
        <li v-for="(item, index) in PageList" :key="index" class="flex-h" :class="{'active': CurrentId === item.id - 0}" :style="{zIndex: PageList.length - index}">
          <i class="iconfont" :class="[item.fee - 0 === 1 ? 'iconshoufeipiandan' : 'iconpiandan']"></i>
          <div class="flex-item flex-h" @click="CutList(item)">
            <span class="flex-item PlaylistDragItem" :data-name="item.name" :data-fee="item.fee" :data-videonum="item.videoNum">{{item.name}}</span>
          </div>
          <span class="Num">{{item.videoNum}}</span>
          <a class="iconfont iconsandian" v-if="item.defaults - 0 === 0" :class="`SaveMorePoint-${index}`" @mouseover="MoreOver(`SaveMorePoint-${index}`, `SaveMore-${index}`)"></a>
          <ul :class="`SaveMore-${index}`" v-if="item.defaults - 0 === 0">
            <li class="flex-h" @click="$emit('AllTo', item)">
              <i class="iconfont iconpiliangtianjia"></i>
              <span class="flex-item">Add all to</span>
            </li>
            <li class="flex-h" @click="Delete(item, index)">
              <i class="iconfont iconshanchu"></i>
              <span class="flex-item">Remove playlist</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="ScrollContainer" v-else>
        <ScrollY Size='small' OverflowX='visible'>
          <ul class="List">
            <li v-for="(item, index) in PageList" :key="index" class="flex-h" :class="{'active': CurrentId === item.id - 0}" :style="{zIndex: PageList.length - index}">
              <i class="iconfont" :class="[item.fee - 0 === 1 ? 'iconshoufeipiandan' : 'iconpiandan']"></i>
              <div class="flex-item flex-h" @click="CutList(item)">
                <span class="flex-item PlaylistDragItem" :data-name="item.name" :data-fee="item.fee" :data-videonum="item.videoNum">{{item.name}}</span>
              </div>
              <span class="Num">{{item.videoNum}}</span>
              <a class="iconfont iconsandian" v-if="item.defaults - 0 === 0" :class="`SaveMorePoint-${index}`" @mouseover="MoreOver(`SaveMorePoint-${index}`, `SaveMore-${index}`)"></a>
              <ul :class="`SaveMore-${index}`" v-if="item.defaults - 0 === 0">
                <li class="flex-h" @click="$emit('AllTo', item)">
                  <i class="iconfont iconpiliangtianjia"></i>
                  <span class="flex-item">Add all to</span>
                </li>
                <li class="flex-h" @click="Delete(item, index)">
                  <i class="iconfont iconshanchu"></i>
                  <span class="flex-item">Remove from list</span>
                </li>
              </ul>
            </li>
          </ul>
        </ScrollY>
      </div>
    </div>
  </div>
</template>

<script>
/*
*/
import ScrollY from '../ScrollY'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapPlaylistActions } = createNamespacedHelpers('playlist')
export default {
  name: 'MySavePlaylist',
  props: {
  },
  data () {
    return {
      PageList: [],
      ShowList: true,
      CurrentId: null,
      DataLock: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
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
    ...mapPlaylistActions([
      'GetSavePlaylist',
      'RemoveSavePlaylist'
    ]),
    Init () { // 初始化
      this.GetSavePlaylist({ params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 200 } }).then((res) => {
        this.PageList = [...res.data.data.list]
        if (this.ToolClass.GetUrlParams('type') === 'save') { // 判断是否选中创建片单列表选项
          let ListId = this.ToolClass.GetUrlParams('id') - 0
          if (ListId) { // 判断选中列表索引值
            this.PageList.map((item) => {
              if (item.id - 0 === ListId) {
                this.CurrentId = ListId
                this.$emit('Cut', { ...item })
              }
            })
            if (this.CurrentId === null && this.PageList.length) {
              this.ToolClass.ChangeUrlParams([{ name: 'id', value: this.PageList[0].id }])
              this.CurrentId = this.PageList[0].id
              this.$emit('Cut', { ...this.PageList[0] })
            }
          } else {
            if (this.PageList.length) {
              this.ToolClass.ChangeUrlParams([{ name: 'id', value: this.PageList[0].id }])
              this.CurrentId = this.PageList[0].id
              this.$emit('Cut', { ...this.PageList[0] })
            }
          }
        }
      })
    },
    VideoRemove (num) {
      this.PageList[0].videoNum -= num
    },
    Delete (item, index) { // 移除收藏的片单
      if (!this.DataLock) {
        this.DataLock = true
        this.RemoveSavePlaylist({ params: { accountId: this.UserInfo.id, groupId: item.id } }).then(() => {
          this.$notify.success({
            title: 'success',
            message: 'Removed from list'
          })
          this.PageList.splice(index, 1)
          if (item.id - 0 === this.ToolClass.GetUrlParams('id') - 0) {
            if (this.PageList.length) {
              this.CutList(this.PageList[index - 1 > 0 ? index - 1 : 0])
            } else {
              this.$emit('NoData')
            }
          }
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    OtherNoData () { // 创建片单无数据时，自动切换至收藏片单
      if (this.PageList.length) {
        this.CutList(this.PageList[0])
      } else {
        this.$emit('IsNull')
      }
    },
    CutList (item) { // 切换列表
      if (this.CurrentId !== item.id - 0) {
        this.CurrentId = item.id - 0
        if (this.ToolClass.GetUrlParams('type') !== 'save') {
          this.ToolClass.ChangeUrlParams([{ name: 'type', value: 'save' }])
        }
        this.ToolClass.ChangeUrlParams([{ name: 'id', value: item.id }])
        this.$emit('Cut', { ...item })
      }
    },
    MoreOver (pointname, classname) {
      let Top = document.getElementsByClassName(pointname)[0].getBoundingClientRect().top + 42 - 20
      let Left = document.getElementsByClassName(pointname)[0].getBoundingClientRect().left - 140
      document.getElementsByClassName(classname)[0].style.top = `${Top}px`
      document.getElementsByClassName(classname)[0].style.left = `${Left}px`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
