<template>
  <div class="components SearchForWeibo">
    <span class="NoOpen">The function is not open yet</span>
  </div>
</template>

<script>
/*
  页面名称：搜索页Weibo模块
  创建人：许成祥
  创建时间：2020/01/06
  最近修改人：许成祥
  最近修改日期：2020/01/06
  备注： 无
*/
export default {
  name: 'SearchForWeibo',
  props: ['data'],
  data () {
    return {
    }
  },
  computed: {
  },
  components: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.Init()
    })
  },
  methods: {
    Init () { // 初始化
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
