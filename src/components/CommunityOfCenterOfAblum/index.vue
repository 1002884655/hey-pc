<template>
  <div class="components CommunityOfCenterOfAblum">

    <ul>
      <li v-for="(item, index) in VideoAlbumList" :key="index">
        <a class="Img">
          <img :src="item.cover" class="centerLabel cover" @click="ToSheetDetail(item)" alt="">
          <div class="RightLayer" @click="ToSheetDetail(item)">
            <span class="centerLabel">
              <span>{{item.videoNum}}</span>
              <i class="iconfont iconshipinliebiao"></i>
            </span>
          </div>
          <div class="Layer" v-if="item.videoNum">
            <span class="centerLabel" @click="PlayAll(item)">
              <i class="iconfont iconbofang2"></i>
              <span>Play all</span>
            </span>
          </div>
        </a>
        <a class="Title" @click="ToSheetDetail(item)">{{item.name}}</a>
      </li>
    </ul>

  </div>
</template>

<script>
/*
  页面名称：社交页面中间部分组件-片单部分
  创建人：许成祥
  创建时间：2020/06/03
  最近修改人：许成祥
  最近修改日期：2020/06/03
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityOfCenterOfAblum',
  props: ['data'],
  data () {
    return {
      Total: 0,
      DataLock: false // 数据锁
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户所有视频片单列表
      VideoAlbumList: x => x.VideoAlbumList // 用户所有视频片单列表
    })
  },
  components: {
  },
  created () {
    this.ToGetPieceGroup()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetVideoAlbum'
    ]),
    ToSheetDetail (item) { // 去片单详情页
      window.open(`./album.html?key=${this.ToolClass.GetUrlParams('key') || this.UserInfo.id}&album=${item.id}`, '_self')
    },
    PlayAll (item) { // 播放全部
      if (item.videoNum) {
        window.open(`./video.html?type=5&album=${item.id}`, '_self')
      }
    },
    ToGetPieceGroup () { // 获取用户专辑
      if (!this.DataLock) {
        this.DataLock = true
        this.GetVideoAlbum({
          params: { accountId: this.ToolClass.GetUrlParams('key') || this.UserInfo.id }
        }).then((res) => {
          this.DataLock = false
        }).catch(() => {
          this.DataLock = false
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
