<template>
  <div id="app">
    <div class="Header">
      <img src="../../assets/img/logo3x.png" height="26" alt="" @click="ToolClass.LinkTo('./index.html')">
      <span>· For Creators</span>
    </div>
    <MainPage :HideFooter="false" :Show="false">
      <div class="Container">

        <div class="Screen1">
          <img src="../../assets/img/tuiguang6.jpg" class="centerLabel cover" alt="">
          <!-- <div>
            <div>
              <img src="../../assets/img/tuiguangbtn.png" @click="ToolClass.LinkTo('../index.html')" width="18%" alt="">
            </div>
          </div> -->
          <div class="centerLabel" style="width: 100%; margin-top: 75px;">
            <img src="../../assets/img/tuiguang-title1.png" width="60%" alt="">
            <img src="../../assets/img/tuiguangbtn.png" style="margin-top: 100px;" @click="ToolClass.LinkTo('../index.html')" width="16%" alt="">
          </div>
        </div>

        <div class="Screen2">
          <img src="../../assets/img/tuiguang7.jpg" width="100%" alt="">
        </div>

        <div class="Screen2">
          <img src="../../assets/img/tuiguang8.jpg" width="100%" alt="">
        </div>

        <div class="Screen2">
          <img src="../../assets/img/tuiguang9.jpg" width="100%" alt="">
        </div>

        <div class="Screen2">
          <img src="../../assets/img/tuiguang10.jpg" width="100%" alt="">
        </div>

        <!-- <div class="Screen2">
          <img src="../../assets/img/tuiguang2.jpg" width="100%" alt="">
        </div>

        <div class="Screen2">
          <img src="../../assets/img/tuiguang3.jpg" width="100%" alt="">
        </div>

        <div class="Screen4">
          <img src="../../assets/img/tuiguang5.jpg" width="100%" alt="">
        </div>

        <div class="Screen5">
          <img src="../../assets/img/tuiguang6.jpg" width="100%" alt="">
        </div> -->

      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  推广-用户
*/
import MainPage from '../../components/MainPage'
export default {
  components: {
    MainPage
  },
  data () {
    return {
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
