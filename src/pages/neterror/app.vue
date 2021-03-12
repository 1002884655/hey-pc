<template>
  <div id="app">
    <MainPage>
      <div class="centerLabel ErrorBox">
        <i class="iconfont iconimg_empty2x"></i>
        <span>No access</span>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
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
