<template>
  <div class="components MyCreatePlaylist">
    <div class="Title">
      <div class="flex-h">
        <span class="flex-item">The playlists you created</span>
        <span>({{MyCreatedPlaylist.length}}/200)</span>
        <i class="iconfont" :class="[ShowList ? 'iconjiantoudown' : 'iconjiantouright']" @click="ShowList = !ShowList"></i>
      </div>
    </div>
    <div class="ListContainer" v-show="ShowList">
      <div class="DragItem" v-show="ShowDragItem" @mouseup="DragEnd">
        <div class="flex-h">
          <i class="iconfont" :class="[DragItem.fee - 0 === 1 ? 'iconshoufeipiandan' : 'iconyewumokuailiebiao']"></i>
          <span class="flex-item">{{DragItem.name}}</span>
          <span class="Num">{{DragItem.videonum}}</span>
        </div>
      </div>
      <ul v-if="MyCreatedPlaylist.length <= 6" class="List">
        <li v-for="(item, index) in MyCreatedPlaylist" :key="index" class="flex-h" :class="{'active': CurrentId === item.id - 0}" :style="{zIndex: MyCreatedPlaylist.length - index}">
          <i class="iconfont" :class="[item.fee - 0 === 1 ? 'iconshoufeipiandan' : 'iconyewumokuailiebiao']"></i>
          <span class="flex-item PlaylistDragItem" @click="CutList(item)">{{item.name}}</span>
          <span class="Num">{{item.videoNum}}</span>
          <a class="iconfont iconsandian" v-if="item.defaults - 0 === 0" :class="`CreateMorePoint-${index}`" @mouseover="MoreOver(`CreateMorePoint-${index}`, `CreateMore-${index}`)"></a>
          <ul :class="`CreateMore-${index}`">
            <li class="flex-h" @click="$emit('Edit', item)">
              <i class="iconfont iconbianji"></i>
              <span class="flex-item">Edit playlist</span>
            </li>
            <li class="flex-h" @click="$emit('AllTo', item)">
              <i class="iconfont iconpiliangtianjia"></i>
              <span class="flex-item">Add all to</span>
            </li>
            <li class="flex-h" @click="Delete(item, index)">
              <i class="iconfont iconshanchu"></i>
              <span class="flex-item">Delete playlist</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="ScrollContainer" v-else>
        <ScrollY Size='small'>
          <ul class="List">
            <li v-for="(item, index) in MyCreatedPlaylist" :key="index" class="flex-h" :class="{'active': CurrentId === item.id - 0}" :style="{zIndex: MyCreatedPlaylist.length - index}">
              <i class="iconfont" :class="[item.fee - 0 === 1 ? 'iconshoufeipiandan' : 'iconyewumokuailiebiao']"></i>
              <span class="flex-item PlaylistDragItem" @click="CutList(item)" @mousedown="DragStart" @mouseup="DragEnd" :data-fee="item.fee" :data-name="item.name" :data-videoNum="item.videoNum" :index="index">{{item.name}}</span>
              <span class="Num">{{item.videoNum}}</span>
              <a class="iconfont iconsandian" :class="`CreateMorePoint-${index}`" @mouseover="MoreOver(`CreateMorePoint-${index}`, `CreateMore-${index}`)"></a>
              <ul :class="`CreateMore-${index}`">
                <li class="flex-h" @click="$emit('Edit', item)">
                  <i class="iconfont iconbianji"></i>
                  <span class="flex-item">Edit playlist</span>
                </li>
                <li class="flex-h" @click="$emit('AllTo', item)">
                  <i class="iconfont iconpiliangtianjia"></i>
                  <span class="flex-item">Add all to</span>
                </li>
                <li class="flex-h" @click="Delete(item, index)">
                  <i class="iconfont iconshanchu"></i>
                  <span class="flex-item">Delete playlist</span>
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
  我创建的片单
*/
import ScrollY from '../ScrollY'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapState: mapPlaylistState, mapActions: mapPlaylistActions, mapMutations: mapPlaylistMutations } = createNamespacedHelpers('playlist')
export default {
  name: 'MyCreatePlaylist',
  props: {
  },
  data () {
    return {
      ShowDragItem: false,
      DragItem: {},
      ShowList: true,
      CurrentId: null,
      DataLock: false
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
      'GetPlaylist',
      'DeletePlaylist'
    ]),
    ...mapPlaylistMutations([
      'EditMyCreatedPlaylist'
    ]),
    Init () { // 初始化
      this.GetPlaylist({ params: { accountId: this.UserInfo.id, pageNum: 1, pageSize: 200 } }).then((res) => {
        if (this.ToolClass.GetUrlParams('type') !== 'save') { // 判断是否选中创建片单列表选项
          this.ToolClass.ChangeUrlParams([{ name: 'type', value: 'created' }])
          let ListId = this.ToolClass.GetUrlParams('id') - 0
          if (ListId) { // 判断选中列表索引值
            this.MyCreatedPlaylist.map((item) => {
              if (item.id - 0 === ListId) {
                this.CurrentId = ListId
                this.$emit('Cut', { ...item })
              }
            })
            if (this.CurrentId === null && this.MyCreatedPlaylist.length) {
              this.ToolClass.ChangeUrlParams([{ name: 'id', value: this.MyCreatedPlaylist[0].id }])
              this.CurrentId = this.MyCreatedPlaylist[0].id
              this.$emit('Cut', { ...this.MyCreatedPlaylist[0] })
            }
          } else {
            if (this.MyCreatedPlaylist.length) {
              this.ToolClass.ChangeUrlParams([{ name: 'id', value: this.MyCreatedPlaylist[0].id }])
              this.CurrentId = this.MyCreatedPlaylist[0].id
              this.$emit('Cut', { ...this.MyCreatedPlaylist[0] })
            }
          }
        }
      })
    },
    DragStart (e) {
      this.DragItem = { ...e.target.dataset }
      document.getElementsByClassName('DragItem')[0].style.left = `${document.getElementsByClassName('MyCreatePlaylist')[0].getBoundingClientRect().left}px`
      document.getElementsByClassName('DragItem')[0].style.top = `${e.pageY - 21}px`
      let StartY = e.pageY
      document.onmousemove = (moveE) => {
        document.getElementsByClassName('DragItem')[0].style.top = `${moveE.pageY - 21}px`
        this.ShowDragItem = true
        document.onmouseup = (endE) => {
          // console.log(document.getElementsByClassName('PlaylistDragItem')[0].getBoundingClientRect().top)
          this.CheckDragIndex(endE.pageY, StartY)
          document.onmousemove = null
          this.ShowDragItem = false
          this.DragItem = {}
        }
      }
    },
    DragEnd () {
      document.onmousemove = null
      this.ShowDragItem = false
      this.DragItem = {}
    },
    CheckDragIndex (pageY, StartY) { // 校验拖拽目标位置索引值
      let DragItemDom = document.getElementsByClassName('PlaylistDragItem')
      let DragTargetIndex = null
      for (let n = 0; n < DragItemDom.length; n++) {
        if (DragItemDom[0].getBoundingClientRect().top >= pageY - 21) { // 置顶
          DragTargetIndex = 0
          break
        } else if (DragItemDom[DragItemDom.length - 1].getBoundingClientRect().top < pageY - 21) { // 置底
          DragTargetIndex = DragItemDom.length - 1
          break
        } else if (DragItemDom[n].getBoundingClientRect().top <= pageY - 21 && DragItemDom[n + 1] && DragItemDom[n + 1].getBoundingClientRect().top > pageY - 21) {
          if (pageY >= StartY) { // 向下拖拽
            DragTargetIndex = n
          } else { // 向上拖拽
            DragTargetIndex = n + 1
          }
          break
        }
      }
      console.log(DragTargetIndex)
    },
    OtherNoData () { // 收藏片单无数据时，自动切换至创建片单
      if (this.MyCreatedPlaylist.length) {
        this.CutList(this.MyCreatedPlaylist[0])
      } else {
        this.$emit('IsNull')
      }
    },
    Delete (item, index) { // 删除片单
      this.ToolClass.Confirm('Delete playlist', [`Are you sure you want to delete "${item.name}"?`, `note:Deleting playlist is a permanent action and cannot be undone.`, `And the videos in the playlist will be removed together.`], () => { }, (close) => {
        if (!this.DataLock) {
          this.DataLock = true
          this.DeletePlaylist({ params: { accountId: this.UserInfo.id, id: item.id } }).then(() => {
            this.$notify.success({
              title: 'success',
              message: 'Playlist deleted'
            })
            if (item.id - 0 === this.ToolClass.GetUrlParams('id') - 0) {
              if (this.MyCreatedPlaylist.length) {
                this.CutList(this.MyCreatedPlaylist[index - 1 > 0 ? index - 1 : 0])
              } else {
                this.$emit('NoData')
              }
            }
            this.DataLock = false
            close()
          }).catch(() => {
            this.DataLock = false
          })
        }
      })
    },
    CutList (item) { // 切换列表
      if (this.CurrentId !== item.id - 0) {
        this.CurrentId = item.id - 0
        if (this.ToolClass.GetUrlParams('type') !== 'created') {
          this.ToolClass.ChangeUrlParams([{ name: 'type', value: 'created' }])
        }
        this.ToolClass.ChangeUrlParams([{ name: 'id', value: item.id }])
        this.$emit('Cut', { ...item })
      }
    },
    MoreOver (pointname, classname) {
      let Top = document.getElementsByClassName(pointname)[0].getBoundingClientRect().top + 42 - 10
      let Left = document.getElementsByClassName(pointname)[0].getBoundingClientRect().left - 115
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
