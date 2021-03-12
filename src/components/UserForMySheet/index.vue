<template>
  <div class="components UserForMySheet flex-h">

    <!-- 片单列表 -->
    <div class="Nav flex-v">
      <div class="flex-item">
        <UserForMySheetNav ref="UserForMySheetNav" @FolderChange="$refs.UserForMySheetNavSubList.CheckFavoritesIndex()" @Change="NavChange" @AxiosEnd="$refs.UserForMySheetNavSubList.Init()"></UserForMySheetNav>
      </div>
    </div>

    <!-- 片单下视频列表 -->
    <div class="flex-item">
      <UserForMySheetNavSubList ref="UserForMySheetNavSubList" @Change="SubListChange" @ListChange="$refs.UserForMySheetNav.Init()"></UserForMySheetNavSubList>
    </div>

  </div>
</template>

<script>
/*
  页面名称：我的片单
  创建人：许成祥
  创建时间：2020/05/25
  最近修改人：许成祥
  最近修改日期：2020/05/25
  备注： 无
*/
import UserForMySheetNav from '../UserForMySheetNav'
import UserForMySheetNavSubList from '../UserForMySheetNavSubList'
export default {
  name: 'UserForMySheet',
  props: ['data'],
  data () {
    return {
      ShowList: false // 显隐片单下列表页
    }
  },
  computed: {
  },
  components: {
    UserForMySheetNav,
    UserForMySheetNavSubList
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    SubListChange () {
      this.$refs.UserForMySheetNav.CheckActiveIndex()
    },
    NavChange (e) { // 导航切换回调
      this.$refs.UserForMySheetNavSubList.Change(e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
