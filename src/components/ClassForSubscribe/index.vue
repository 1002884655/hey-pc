<template>
  <div class="components ClassForSubscribe">
    <span class="NoOpen">The function is not open yet</span>
  </div>
</template>

<script>
/*
  页面名称：分类主页-Subscribe
  创建人：许成祥
  创建时间：2020/01/07
  最近修改人：许成祥
  最近修改日期：2020/01/07
  备注： 无
*/
export default {
  name: 'ClassForSubscribe',
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
