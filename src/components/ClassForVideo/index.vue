<template>
  <div class="components ClassForVideo">

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
    <div class="ClassVideoList">
      <ClassVideoList ref="ClassVideoList" :DataLock="VideoDataLock" @TriggerDataLock="TriggerVideoDataLock" @NeedLogin="$emit('NeedLogin')"></ClassVideoList>
    </div>

  </div>
</template>

<script>
/*
  页面名称：分类主页-Video
  创建人：许成祥
  创建时间：2020/01/07
  最近修改人：许成祥
  最近修改日期：2020/01/07
  备注： 无
*/
import NewSearchFilter from '../NewSearchFilter'
import ClassVideoList from '../ClassVideoList'
export default {
  name: 'ClassForVideo',
  props: ['data'],
  data () {
    return {
      SortList: [],
      VideoDataLock: false // Video数据请求锁定状态
    }
  },
  computed: {
  },
  components: {
    NewSearchFilter,
    ClassVideoList
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
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
