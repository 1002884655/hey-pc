<template>
  <div class="components UserForMyCollection flex-h">

    <!-- 左侧菜单 -->
    <div class="MenuList">

      <!-- 左侧导航栏 -->
      <nav class="LeftNav flex-h">
        <a v-for="(item, index) in LeftNavList" :key="index" class="flex-item" @click="CutNav(item, index)" :class="{'active': index === NavActiveIndex}">{{item.Name}}</a>
      </nav>

      <!-- 视频收藏列表 -->
      <div class="VideoCollectList" v-if="NavActiveIndex === 0">
        <UserForMyVideoFavoritesList ref="UserForMyVideoFavoritesList" @Change="MyVideoFavoritesChange" @AxiosEnd="$refs.VideoFavoritesSubList.Init()"></UserForMyVideoFavoritesList>
      </div>

      <!-- 片单收藏列表 -->
      <div class="VideoCollectList" v-if="NavActiveIndex === 1">
        <UserCollectForSheet ref="UserCollectForSheet" @Change="$refs.SheetSubList.Init()"></UserCollectForSheet>
      </div>

      <!-- 专辑收藏列表 -->
      <div class="VideoCollectList" v-if="NavActiveIndex === 2">
        <UserCollectForAblum ref="UserCollectForAblum" @Change="$refs.AlbumSubList.Init()"></UserCollectForAblum>
      </div>

    </div>

    <!-- 右侧切换内容 -->
    <div class="RightContainer flex-item">

      <!-- 视频收藏夹下列表 -->
      <div class="ForVideo" v-if="NavActiveIndex === 0 && VideoCollectCategoryList.length">
        <UserForMyVideoFavoritesSubList ref="VideoFavoritesSubList" @Change="$refs.UserForMyVideoFavoritesList.Init()"></UserForMyVideoFavoritesSubList>
      </div>

      <!-- 片单收藏夹下列表 -->
      <div class="ForVideo" v-if="NavActiveIndex === 1 && CollectForSheetList.length">
        <UserCollectForSheetSubList ref="SheetSubList" @Change="$refs.UserCollectForSheet.Init()"></UserCollectForSheetSubList>
      </div>

      <!-- 专辑收藏夹下列表 -->
      <div class="ForVideo" v-if="NavActiveIndex === 2 && CollectAlbumList.length">
        <UserCollectForAlbumSubList ref="AlbumSubList" @Change="$refs.UserCollectForAblum.Init()"></UserCollectForAlbumSubList>
      </div>

    </div>

  </div>
</template>

<script>
/*
  页面名称：用户中心-MyCollection组件
  创建人：许成祥
  创建时间：2020/01/07
  最近修改人：许成祥
  最近修改日期：2020/05/21
  备注： 无
*/
import UserForMyVideoFavoritesList from '../UserForMyVideoFavoritesList'
import UserForMyVideoFavoritesSubList from '../UserForMyVideoFavoritesSubList'
import UserCollectForSheet from '../UserCollectForSheet'
import UserCollectForSheetSubList from '../UserCollectForSheetSubList'
import UserCollectForAblum from '../UserCollectForAblum'
import UserCollectForAlbumSubList from '../UserCollectForAlbumSubList'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyCollection',
  props: ['data'],
  data () {
    return {
      NavActiveIndex: null, // 左侧导航栏索引值 0-视频收藏 1-片单收藏 2-专辑收藏
      LeftNavList: [ // 左侧导航栏数据
        { Name: 'Videos', Id: '1' },
        { Name: 'Playlist', Id: '2' },
        { Name: 'Album', Id: '3' }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoCollectCategoryList: x => x.VideoCollectCategoryList, // 用户所有视频收藏夹列表
      CollectForSheetList: x => x.CollectForSheetList, // 用户所有收藏片单列表
      CollectAlbumList: x => x.CollectAlbumList // 用户所有收藏片单列表
    })
  },
  components: {
    UserForMyVideoFavoritesList,
    UserForMyVideoFavoritesSubList,
    UserCollectForSheet,
    UserCollectForSheetSubList,
    UserCollectForAblum,
    UserCollectForAlbumSubList
  },
  created () {
    this.CheckActiveIndex() // 检验索引值
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    CheckActiveIndex () { // 检验索引值
      let SubType = this.ToolClass.GetUrlParams('subid') - 0
      let Index = null
      this.LeftNavList.map((item, index) => {
        if (item.Id - 0 === SubType) {
          Index = index
        }
      })
      this.NavActiveIndex = Index || 0
    },
    CutNav (item, index) { // 切换导航
      this.ToolClass.ChangeUrlParams([{ name: 'subid', value: item.Id }, { name: 'type', value: this.ToolClass.GetUrlParams('type') - 0 }], true)
      this.NavActiveIndex = index
    },
    MyVideoFavoritesChange (e) { // 我的视频收藏夹导航切换
      this.$refs.VideoFavoritesSubList.Change(e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
