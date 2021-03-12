<template>
  <div class="components ScrollY">
    <scrollbar style="height: 100%;" class="HeyScroll" :id="RefId" :class="{'SmallScroll': Size === 'small', 'LiveChatScroll': Size === 'normal'}" :ref="RefId">
      <slot></slot>
    </scrollbar>
  </div>
</template>

<script>
/*
  页面名称：纵轴（Y方向）滚动组件
  创建人：许成祥
  创建时间：2019/12/19
  最近修改人：许成祥
  最近修改日期：2020/04/01
  备注： 无
*/
import { scrollbar } from 'element-ui'
export default {
  name: 'ScrollY',
  props: {
    RefId: {
      default: `Scroll-${Date.now()}`,
      type: String
    },
    Size: {
      default: `big`,
      type: String
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  components: {
    scrollbar
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.ListenScrollbar, true)
    })
  },
  methods: {
    ListenScrollbar () {
      if (this.$refs[this.RefId].wrap) {
        this.$emit('ScrollTop', this.$refs[this.RefId].wrap.scrollTop)
      }
    },
    ScrollTo (top) {
      this.$refs[this.RefId].wrap.scrollTop = top
    },
    ScrollBottom () {
      this.$refs[this.RefId].wrap.scrollTop = this.$refs[this.RefId].wrap.scrollHeight
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
