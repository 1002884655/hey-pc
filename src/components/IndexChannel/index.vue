<template>
  <div class="components IndexChannel" v-if="List.length">
    <div class="flex-h">
      <span class="Title">{{Title}}</span>
      <div class="flex-item"></div>
      <!-- <a>refresh</a>
      <a>more</a> -->
    </div>
    <ul>
      <li v-for="(item, index) in List" :key="index">
        <a class="Img" :href="`./userspace.html?key=${item.id}`" target="_self">
          <img :src="item.picPath3" class="centerLabel cover" alt="">
        </a>
        <a class="Title" :href="`./userspace.html?key=${item.id}`" target="_self">{{item.name}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
/*
  页面名称：首页频道组件
  创建人：许成祥
  创建时间：2020/06/23
  最近修改人：许成祥
  最近修改日期：2020/06/23
  备注： 无
*/
export default {
  name: 'IndexChannel',
  props: {
    Title: {
      default: 'Title',
      type: String
    },
    List: {
      default: () => {
        return []
      },
      type: Array
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
