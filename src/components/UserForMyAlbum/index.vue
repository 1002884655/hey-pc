<template>
  <div class="components UserForMyAlbum flex-h">

    <!-- 专辑列表 -->
    <div class="Nav flex-v">
      <div class="flex-item">
        <UserForMyAlbumNav ref="UserForMyAlbumNav" @FolderChange="$refs.UserForMyAlbumNavSubList.CheckFavoritesIndex()" @Change="NavChange" @AxiosEnd="$refs.UserForMyAlbumNavSubList.Init()"></UserForMyAlbumNav>
      </div>
    </div>

    <!-- 专辑下视频列表 -->
    <div class="flex-item">
      <UserForMyAlbumNavSubList ref="UserForMyAlbumNavSubList" @Change="SubListChange"></UserForMyAlbumNavSubList>
    </div>

  </div>
</template>

<script>
/*
  页面名称：我的专辑
  创建人：许成祥
  创建时间：2020/05/26
  最近修改人：许成祥
  最近修改日期：2020/05/26
  备注： 无
*/
import UserForMyAlbumNav from '../UserForMyAlbumNav'
import UserForMyAlbumNavSubList from '../UserForMyAlbumNavSubList'
export default {
  name: 'UserForMyAlbum',
  props: ['data'],
  data () {
    return {
      ShowList: false // 显隐专辑下列表页
    }
  },
  computed: {
  },
  components: {
    UserForMyAlbumNav,
    UserForMyAlbumNavSubList
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    SubListChange () {
      this.$refs.UserForMyAlbumNav.CheckActiveIndex()
    },
    NavChange (e) { // 导航切换回调
      this.$refs.UserForMyAlbumNavSubList.Change(e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
