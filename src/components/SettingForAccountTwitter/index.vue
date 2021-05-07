<template>
  <div class="components SettingForAccountTwitter SettingFormInput">
    <div class="Form">
      <div class="Line">
        <span>Twitter</span>
        <div>
          <input type="text" placeholder="Twitter">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h">
      <span class="flex-item"></span>
      <a class="active">SAVE</a>
    </div>
  </div>
</template>

<script>
/*
*/
export default {
  name: 'SettingForAccountTwitter',
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
    this.$emit('TitleChange', 'CHANGE TWITTER')
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
