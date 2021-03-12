<template>
  <div id="app">
    <MainPage ref="MainPage">
      <div class="MainPage">
        <!-- <span></span> -->
        <div>

          <!-- 一级分类 -->
          <!-- <nav class="MainLevelList">
            <a v-for="(item, index) in MainLevelList" :key="index" :class="{'active': MainLevelActiveIndex === index}" @click="MainLevelActiveIndex = index">{{item.Value}}</a>
          </nav> -->

          <!-- 一级分类内容 -->
          <div class="MainLevelContent">

            <!-- Video -->
            <div class="ClassForVideo" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 1">
              <ClassForVideo @NeedLogin="$refs.MainPage.Login()"></ClassForVideo>
            </div>

            <!-- Picture -->
            <div class="ClassForPicture" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 2">
              <ClassForPicture></ClassForPicture>
            </div>

            <!-- Subscribe -->
            <div class="ClassForSubscribe" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 3">
              <ClassForSubscribe></ClassForSubscribe>
            </div>

            <!-- Live -->
            <div class="ClassForLive" v-if="MainLevelList[MainLevelActiveIndex].Id - 0 === 4">
              <ClassForLive></ClassForLive>
            </div>
          </div>
        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：视频主分类页
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2020/01/07
  备注： 无
*/
import MainPage from '../../components/MainPage'
import ClassForVideo from '../../components/ClassForVideo'
import ClassForPicture from '../../components/ClassForPicture'
import ClassForSubscribe from '../../components/ClassForSubscribe'
import ClassForLive from '../../components/ClassForLive'
export default {
  components: {
    MainPage,
    ClassForVideo,
    ClassForPicture,
    ClassForSubscribe,
    ClassForLive
  },
  data () {
    return {
      MainLevelList: [ // 一级分类
        { Value: 'Video', Id: '1' },
        { Value: 'Picture', Id: '2' },
        { Value: 'Subscribe', Id: '3' },
        { Value: 'Live', Id: '4' }
      ],
      MainLevelActiveIndex: this.ToolClass.GetUrlParams('type') - 0 || 0 // 一级分类选中索引值：0-Video 1-Picture 2-Subscribe 3-Live
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
