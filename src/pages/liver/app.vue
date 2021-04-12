<template>
  <div id="app">
    <MainPage :HideFooter="true">
      <div class="Content">
        <div v-for="(item, index) in 200" :key="index">{{index}}</div>
      </div>
    </MainPage>
  </div>
</template>

<script>
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
