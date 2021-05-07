<template>
  <div class="components SettingForFanClub">
    <div class="Form">
      <div class="Line">
        <span>Price per month</span>
        <div>
          <input type="text" placeholder="$ Set the price and activate the club">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h">
      <span class="flex-item">Minimum $5.99 USD or free</span>
      <a class="active">SAVE</a>
    </div>
  </div>
</template>

<script>
/*
*/
export default {
  name: 'SettingForFanClub',
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
    })
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
