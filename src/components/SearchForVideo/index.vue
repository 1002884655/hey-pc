<template>
  <div class="components SearchForVideo">

    <!-- 搜索过滤器 -->
    <NewSearchFilter ref="NewSearchFilter" :DataLock="VideoDataLock" @TriggerDataLock="TriggerVideoDataLock" @Change="VideoChange" @ListInit="ListInit" @SortReady="SortReady"></NewSearchFilter>

    <!-- 头部 -->
    <div class="flex-h Top">
      <span class="flex-item">Videos</span>
      <a>
        <i class="iconfont iconpaixu"></i>
        <span>Sort By</span>
        <ul>
          <li v-for="(item, index) in SortList" :key="index" v-if="index !== 0" @click="$refs.NewSearchFilter.CutNavLevel2(item, index)">{{item.value}}</li>
        </ul>
      </a>
    </div>

    <!-- 视频列表 -->
    <div class="ClassVideoList flex-h">

      <div class="flex-item">
        <ClassVideoList ref="ClassVideoList" :IsSearch="true" :DataLock="VideoDataLock" @TriggerDataLock="TriggerVideoDataLock"></ClassVideoList>
      </div>

      <div class="ClassRight">

        <!-- 用户排名 -->
        <!-- <div class="flex-h">
          <span class="flex-item">Related users</span>
        </div>
        <ul class="RelatedUsers">
          <li v-for="(item, index) in 10" :key="index" class="flex-h">
            <a><img src="" class="centerLabel cover" alt=""></a>
            <div class="flex-item">
              <a>user name</a>
              <span>desc</span>
            </div>
          </li>
        </ul> -->

        <!-- 搜索视频排名 -->
        <div class="flex-h">
          <span class="flex-item">Pop Search</span>
          <a>more</a>
        </div>
        <ul class="PopSearch">
          <li v-for="(item, index) in VideoRankingList" :key="index" class="flex-h">
            <span>{{index + 1}}</span>
            <a class="flex-item" :href="`./search.html?key=${item.name}`">{{item.name}}</a>
          </li>
        </ul>

      </div>

    </div>

  </div>
</template>

<script>
/*
  页面名称：搜索页Video模块
  创建人：许成祥
  创建时间：2020/01/06
  最近修改人：许成祥
  最近修改日期：2020/01/06
  备注： 无
*/
import NewSearchFilter from '../NewSearchFilter'
import ClassVideoList from '../ClassVideoList'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapSearchState, mapActions: mapSearchActions } = createNamespacedHelpers('search')
export default {
  name: 'SearchForVideo',
  props: ['data'],
  data () {
    return {
      SortList: [],
      VideoDataLock: false // Video数据请求锁定状态
    }
  },
  computed: {
    ...mapSearchState({
      VideoRankingList: x => x.VideoRankingList // 视频搜索排名列表
    })
  },
  components: {
    NewSearchFilter,
    ClassVideoList
  },
  created () {
    this.GetVideoRankingList({ params: { pageNum: 1, pageSize: 5 } }) // 获取搜索视频排名
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapSearchActions([
      'GetVideoRankingList'
    ]),
    SortReady (e) {
      this.SortList = [...e]
    },
    TriggerVideoDataLock (e) { // Video数据锁开关控制
      this.VideoDataLock = e || false
    },
    ListInit (e) { // Video过滤器数据更新
      this.VideoDataLock = false // Video数据锁解锁
      this.$refs.ClassVideoList.Init(e) // Video列表数据初始化
    },
    VideoChange (e) { // Video过滤器数据更新
      this.VideoDataLock = false // Video数据锁解锁
      this.$refs.ClassVideoList.Change(e) // Video列表数据更新
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
