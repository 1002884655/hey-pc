<template>
  <div class="components IndexClassNav">
    <div class="flex-h">
      <!-- <nav>
        <a v-for="(item, index) in ClassNavList" :key="index" @click="LinkTo(item.Url)">
          <i class="iconfont" :class="item.Icon"></i>
          <span>{{item.Name}}</span>
        </a>
      </nav> -->
      <div class="flex-item">
        <a v-for="(item, index) in ClassList" v-if="item.level - 0 === 3" :class="{'Hide': index > 9 && HideSomeNav}" :key="index" :href="`./videoindex.html?types=${item.id}`" target="_self">{{item.name}}</a>
        <a class="More" @click="HideSomeNav = !HideSomeNav">{{HideSomeNav ? '+ More Categories' : '- Less Categories'}}</a>
      </div>
    </div>
  </div>
</template>

<script>
/*
  页面名称：首页分类nav
  创建人：许成祥
  创建时间：2020/06/22
  最近修改人：许成祥
  最近修改日期：2020/06/22
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
const { mapActions: mapSearchActions } = createNamespacedHelpers('search')
export default {
  name: 'IndexClassNav',
  props: ['data'],
  data () {
    return {
      HideSomeNav: true, // 隐藏部分nav
      ClassNavList: [ // 分类nav数据
        { Name: 'Home', Icon: 'iconshouye', Url: './index.html' },
        { Name: 'Video', Icon: 'iconshipin', Url: './more.html?type=hotvideos' },
        { Name: 'Playlist', Icon: 'iconliebiao', Url: './more.html?type=playlist' },
        { Name: 'Live', Icon: 'iconzhibo', Url: null },
        { Name: 'Photo', Icon: 'iconzhaopian1', Url: null }
      ],
      ClassList: [] // 分类列表
    }
  },
  computed: {
  },
  components: {
  },
  created () {
    this.GetSearchFilter().then((res) => { // 获取分类
      if (res.data.code - 0 === 0) {
        this.ClassList = res.data.data.typeList.slice(1) || []
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapSearchActions([
      'GetSearchFilter'
    ]),
    LinkTo (url) {
      if (url !== null) {
        window.open(url, '_self')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
