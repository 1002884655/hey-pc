<template>
  <div class="components SettingForAccountUserName SettingFormInput">
    <div class="Form">
      <div class="Line">
        <span>Username</span>
        <div>
          <input type="text" placeholder="Username">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h">
      <span class="flex-item">https://heyporn.com/hgkahg567</span>
      <a class="active">SAVE</a>
    </div>
  </div>
</template>

<script>
/*
*/
export default {
  name: 'SettingForAccountUserName',
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
    this.$emit('TitleChange', 'CHANGE USERNAME')
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
