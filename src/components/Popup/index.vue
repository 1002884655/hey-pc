<template>
  <div class="components Popup" v-if="show">

    <div class="MainPopupBox centerLabel">

      <!-- 顶部栏 -->
      <div class="Title flex-h">
        <span class="flex-item">{{title}}</span>
      </div>

      <!-- 内容 -->
      <div class="Content">
        <slot></slot>
      </div>

      <!-- 底部栏 -->
      <div class="Bottom" v-if="ShowBottom">
        <a @click="$emit('Close')">Cancel</a>
        <a @click="$emit('Sure')">Save</a>
      </div>

    </div>

  </div>
</template>

<script>
/*
  页面名称：弹窗
  创建人：许成祥
  创建时间：2020/05/11
  最近修改人：许成祥
  最近修改日期：2020/05/11
  备注： 无
*/
export default {
  name: 'Popup',
  props: {
    show: { // 显隐状态
      default: false,
      type: Boolean
    },
    type: { // 弹窗类型
      default: 'alert',
      type: String
    },
    title: { // 弹窗标题
      default: 'Alert',
      type: String
    },
    theme: { // 主题
      default: 'white',
      type: String
    },
    ShowBottom: { // 是否显示底部按钮
      default: true,
      type: Boolean
    }
  },
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
      this.$emit('Ready')
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
