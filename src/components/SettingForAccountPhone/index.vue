<template>
  <div class="components SettingForAccountPhone SettingFormInput">
    <div class="Form">
      <div class="Line">
        <span>Phone number</span>
        <div>
          <input type="text" placeholder="Phone number">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h">
      <span class="flex-item">Phone number 089-67896543 isn’t verified</span>
      <a class="active">SAVE</a>
    </div>
  </div>
</template>

<script>
/*
*/
export default {
  name: 'SettingForAccountPhone',
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
    this.$emit('TitleChange', 'CHANGE PHONE NUMBER')
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
