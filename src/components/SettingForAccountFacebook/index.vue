<template>
  <div class="components SettingForAccountFacebook SettingFormInput">
    <div class="Form">
      <div class="Line">
        <span>Facebook</span>
        <div>
          <input type="text" placeholder="Facebook">
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
  name: 'SettingForAccountFacebook',
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
    this.$emit('TitleChange', 'CHANGE FACEBOOK')
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
