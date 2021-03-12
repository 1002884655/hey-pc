<template>
  <div class="components NetSpeedTest">
    <img src="../../assets/img/test.jpg" width="0" height="0" class="NetworkSpeedTest" @load="NetworkSpeedTestEnd" alt="">
  </div>
</template>

<script>
/*
  页面名称：网速测试估算
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2019/12/30
  备注： 无
*/
export default {
  name: 'demo',
  props: ['data'],
  data () {
    return {
      Timer: null, // 定时器
      NetworkSpeedStartTime: Date.now(), // 测试开始时间节点
      Ended: false // 测试结束状态
    }
  },
  computed: {
  },
  components: {
  },
  created () {
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    Init () { // 初始化
      window.clearTimeout(this.Timer)
      this.Timer = null
      this.Timer = window.setTimeout(() => {
        if (!this.Ended) {
          this.$emit('TestEnd', 0)
        }
        window.clearTimeout(this.Timer)
        this.Timer = null
      }, 10000)
    },
    NetworkSpeedTestEnd () { // 图片加载结束
      this.Ended = true
      let DownTime = Date.now() - this.NetworkSpeedStartTime
      let FileSize = 382
      let NetworkSpeed = FileSize / DownTime * 1000
      this.$emit('TestEnd', NetworkSpeed)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
