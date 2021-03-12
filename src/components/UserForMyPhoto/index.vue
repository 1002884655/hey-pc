<template>
  <div class="components UserForMyPhoto flex-h">

    <!-- 左侧菜单 -->
    <div class="MenuList">
      <UserForMyPhotoFavoritesList ref="UserForMyPhotoFavoritesList" @Change="MyPhotoFavoritesChange" @AxiosEnd="$refs.PhotoFavoritesSubList.Init()"></UserForMyPhotoFavoritesList>
    </div>

    <!-- 右侧切换内容 -->
    <div class="RightContainer flex-item">

      <div v-if="PhotoAlbum.length">
        <UserForMyPhotoFavoritesSubList ref="PhotoFavoritesSubList" @Change="$refs.UserForMyPhotoFavoritesList.Init()" @NewFolder="$refs.UserForMyPhotoFavoritesList.AddNewFolder()"></UserForMyPhotoFavoritesSubList>
      </div>

    </div>

  </div>
</template>

<script>
/*
  页面名称：我的相片
  创建人：许成祥
  创建时间：2020/06/12
  最近修改人：许成祥
  最近修改日期：2020/06/12
  备注： 无
*/
import UserForMyPhotoFavoritesList from '../UserForMyPhotoFavoritesList'
import UserForMyPhotoFavoritesSubList from '../UserForMyPhotoFavoritesSubList'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyPhoto',
  props: ['data'],
  data () {
    return {
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      PhotoAlbum: x => x.PhotoAlbum // 用户所有图集列表
    })
  },
  components: {
    UserForMyPhotoFavoritesList,
    UserForMyPhotoFavoritesSubList
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    MyPhotoFavoritesChange (e) {
      this.$refs.PhotoFavoritesSubList.Change(e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
