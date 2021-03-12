<template>
  <div class="components UserSettingForPreferences">

    <ul>

      <li v-for="(item, index) in LikeTypes" :key="index">
        <div class="flex-h">
          <span class="flex-item">{{item.TypeName}}</span>
          <span class="flex-item">Like</span>
          <span class="flex-item">Dislike</span>
          <span class="flex-item">Don't care</span>
        </div>
        <ul>
          <li class="flex-h" v-for="(subItem, subIndex) in item.List" :key="subIndex">
            <span class="flex-item">{{subItem.name}}</span>
            <div class="flex-item"><a :class="[CalcSelect(subItem) === 1 ? 'active' : '']" @click="SelectItem(subItem, 1)"><img src="../../assets/img/biaoqing.png" alt=""></a></div>
            <div class="flex-item"><a :class="[CalcSelect(subItem) === 2 ? 'active' : '']" @click="SelectItem(subItem, 2)"><img src="../../assets/img/biaoqing.png" alt=""></a></div>
            <div class="flex-item"><a :class="[CalcSelect(subItem) === 3 ? 'active' : '']" @click="SelectItem(subItem, 3)"><img src="../../assets/img/biaoqing.png" alt=""></a></div>
          </li>
        </ul>
      </li>

    </ul>

  </div>
</template>

<script>
/*
  页面名称：个人中心-用户设置-Preferences
  创建人：许成祥
  创建时间：2020/01/09
  最近修改人：许成祥
  最近修改日期：2020/01/17
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'UserSettingForPreferences',
  props: ['data'],
  data () {
    return {
      DataLock: false // 数据锁
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo,
      LikeTypes: x => x.LikeTypes,
      UserLikes: x => x.UserLikes
    })
  },
  components: {
  },
  created () {
    this.GetUserLikes({ params: { accountId: this.UserInfo.id } }).then((res) => {
      if (res.data.code - 0 === 0) {
        this.GetLikeTypes()
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetLikeTypes',
      'EditUserLikes',
      'GetUserLikes'
    ]),
    CalcSelect (item) { // 计算是否选中
      let Bool = null
      this.UserLikes.map((thisItem) => {
        if (thisItem.workId === item.id) {
          Bool = thisItem.status
        }
      })
      return Bool - 0
    },
    SelectItem (item, status) { // 选择项
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定（防止多次触发）
        let Bool = true
        this.UserLikes.map((thisItem) => {
          if (thisItem.workId - 0 === item.id - 0 && thisItem.status - 0 === status - 0) {
            Bool = false
          }
        })
        if (!Bool) {
          this.DataLock = false // 数据解锁
          return false
        }
        this.EditUserLikes({
          data: {
            accountId: this.UserInfo.id,
            likeType: 1,
            status,
            workId: item.id
          }
        }).then((res) => {
          this.GetUserLikes({ params: { accountId: this.UserInfo.id } }).then(() => {
            this.DataLock = false // 数据解锁
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        }).catch(() => {
          this.DataLock = false // 数据解锁
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
