<template>
  <div class="components SettingForAccountEmail SettingFormInput">
    <div class="Form" v-if="Step === 1">
      <span>Step 1/2</span>
      <span>Please enter your new E-mail address</span>
      <div class="Line">
        <span>New email</span>
        <div>
          <input type="text" placeholder="New email">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h" v-if="Step === 1">
      <span class="flex-item">E-mail 235525@qq.com is verified</span>
      <a class="active">NEXT</a>
    </div>

    <div class="Form" v-if="Step === 2">
      <span>Step 2/2</span>
      <span>Please enter verification code</span>
      <div class="Line">
        <span>Verification code</span>
        <div>
          <input type="text" placeholder="Add verification code">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h" v-if="Step === 2">
      <span class="flex-item">E-mail 235525@qq.com is verified</span>
      <a class="active">SAVE</a>
    </div>
  </div>
</template>

<script>
/*
*/
export default {
  name: 'SettingForAccountEmail',
  props: ['data'],
  data () {
    return {
      Step: 1
    }
  },
  computed: {
  },
  components: {
  },
  created () {
    this.$emit('TitleChange', 'CHANGE EMAIL')
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
