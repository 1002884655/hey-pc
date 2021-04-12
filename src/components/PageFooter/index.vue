<template>
  <div class="components PageFooter">
    <b>Legal</b>
    <div class="flex-h">
      <div class="flex-item"><a href="./privacypolicyamendment.html">Privacy Policy Amendment</a></div>
      <div class="flex-item"><a href="./termsconditions.html">Terms & Conditions</a></div>
      <div class="flex-item"><a href="./privacypolicy.html">Privacy Policy</a></div>
      <div class="flex-item"><a href="./dmca.html">DMCA</a></div>
      <div class="flex-item"><a href="./2257.html">2257</a></div>
    </div>
    <b>Programs</b>
    <div class="flex-h">
      <div class="flex-item"><a href="./creatorpromote.html">HeyPorn for Creators</a></div>
      <div class="flex-item"><a href="./userpromote.html">HeyPorn for Users</a></div>
      <div class="flex-item"><a href="./auth.html">Model Program</a></div>
      <div class="flex-item"></div>
      <div class="flex-item"></div>
    </div>
  </div>
</template>

<script>
/*
  页面名称：页脚
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2020/04/29
  备注： 无
*/
export default {
  name: 'PageFooter',
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
