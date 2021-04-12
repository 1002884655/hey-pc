<template>
  <div id="app">
    <MainPage>
      <div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  页面名称：404页面
  创建人：许成祥
  创建时间：2019/12/30
  最近修改人：许成祥
  最近修改日期：2019/12/30
  备注： 无
*/
import MainPage from '@/components/MainPage'
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
