<template>
  <div id="app">
    <MainPage :IsSearch="true">
      <div class="MainPage">
        <!-- <span></span> -->
        <div>

          <!-- 一级分类 -->
          <!-- <nav class="MainLevelList">
            <a v-for="(item, index) in MainLevelList" :key="index" :class="{'active': MainLevelActiveIndex === index}" @click="MainLevelActiveIndex = index">{{item.Value}}</a>
          </nav> -->

          <!-- 一级分类内容 -->
          <div class="MainLevelContent">

            <!-- Recommend -->
            <div class="MainLevelRecommend" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 1">
              <SearchForRecommend></SearchForRecommend>
            </div>

            <!-- Video -->
            <div class="MainLevelVideo" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 2">
              <SearchForVideo></SearchForVideo>
            </div>

            <!-- Picture -->
            <div class="MainLevelPicture" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 3">
              <SearchForPicture></SearchForPicture>
            </div>

            <!-- Stars -->
            <div class="MainLevelStars" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 4">
              <SearchForStars></SearchForStars>
            </div>

            <!-- Weibo -->
            <div class="MainLevelWeibo" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 5">
              <SearchForWeibo></SearchForWeibo>
            </div>

            <!-- Users -->
            <div class="MainLevelUsers" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 6">
              <SearchForUsers></SearchForUsers>
            </div>

            <!-- Goods -->
            <div class="MainLevelGoods" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 7">
              <SearchForGoods></SearchForGoods>
            </div>

            <!-- Subscribe -->
            <div class="MainLevelSubscribe" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 8">
              <SearchForSubscribe></SearchForSubscribe>
            </div>

            <!-- Live -->
            <div class="MainLevelLive" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 9">
              <SearchForLive></SearchForLive>
            </div>

          </div>
        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：搜索页
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2020/01/06
  备注： 无
*/
import MainPage from '../../components/MainPage'
import SearchForRecommend from '../../components/SearchForRecommend'
import SearchForVideo from '../../components/SearchForVideo'
import SearchForPicture from '../../components/SearchForPicture'
import SearchForStars from '../../components/SearchForStars'
import SearchForWeibo from '../../components/SearchForWeibo'
import SearchForUsers from '../../components/SearchForUsers'
import SearchForGoods from '../../components/SearchForGoods'
import SearchForSubscribe from '../../components/SearchForSubscribe'
import SearchForLive from '../../components/SearchForLive'
export default {
  components: {
    MainPage,
    SearchForRecommend,
    SearchForVideo,
    SearchForPicture,
    SearchForStars,
    SearchForWeibo,
    SearchForUsers,
    SearchForGoods,
    SearchForSubscribe,
    SearchForLive
  },
  data () {
    return {
      MainLevelList: [ // 一级分类
        { Value: 'Recommend', Id: '1' },
        { Value: 'Video', Id: '2' },
        { Value: 'Picture', Id: '3' },
        { Value: 'Stars', Id: '4' },
        { Value: 'Weibo', Id: '5' },
        { Value: 'Users', Id: '6' },
        { Value: 'Goods', Id: '7' },
        { Value: 'Subscribe', Id: '8' },
        { Value: 'Live', Id: '9' }
      ],
      MainLevelActiveIndex: this.ToolClass.GetUrlParams('type') === false ? 1 : this.ToolClass.GetUrlParams('type') - 0 // 一级分类选中索引值
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
