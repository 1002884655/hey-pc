<template>
  <div class="components PlayerActorList">
    <ul>
      <li v-for="(item, index) in MediaInfo.directorList.concat(MediaInfo.actorList)" :key="index">
        <div class="flex-h">
          <a>
            <img :src="item.picPath" class="centerLabel cover" alt="">
          </a>
          <div class="flex-item">
            <a>{{item.name}}</a>
            <span>{{item.alias}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/*
  页面名称：播放器演职员列表
  创建人：许成祥
  创建时间：2020/02/10
  最近修改人：许成祥
  最近修改日期：2020/02/10
  备注： 无
*/
export default {
  name: 'PlayerActorList',
  props: ['MediaInfo'],
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
