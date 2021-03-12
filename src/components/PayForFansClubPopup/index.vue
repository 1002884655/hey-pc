<template>
  <div class="components PayForFansClubPopup">
    <div class="centerLabel">
      <div class="Close">
        <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
      </div>
      <div class="Title">
        <span>You’re about to subscribe to </span>
        <a>{{PageUserInfo !== null ? PageUserInfo.nick : ''}}</a>
        <span>'s Fan Club.</span>
      </div>
      <span class="Desc">By Becoming a Fan，you are supporting this model to continue creating amazing content and you may even get additional exclusive content that would be listed below.</span>
      <div class="Tips">
        <i class="iconfont icondui"></i>
        <span>Fan-Only Videos</span>
      </div>
      <div class="Tips">
        <i class="iconfont icondui"></i>
        <span>Fan-Only Photos</span>
      </div>
      <div class="Tips">
        <i class="iconfont icondui"></i>
        <span>Fan-Only Posts and Updates</span>
      </div>
      <div class="Tips">
        <i class="iconfont icondui"></i>
        <span>Direct Messaging with Fiamurr</span>
      </div>
      <span class="Price">${{PageUserInfo !== null ? PageUserInfo.fanClubPrice : ''}} / Month</span>
      <a @click="ToJoinFansClub" :class="{'active': !DataLock}">Become a Fan</a>
      <span class="Tips">This membership will renew at ${{PageUserInfo !== null ? PageUserInfo.fanClubPrice : ''}} every 30 days untill cancelled.</span>
    </div>
  </div>
</template>

<script>
/*
  支付加入粉丝俱乐部弹窗
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'PayForFansClubPopup',
  props: {
    PageUserInfo: {
      default: null,
      type: Object
    }
  },
  data () {
    return {
      DataLock: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
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
    ...mapUserActions([
      'CreateOrder'
    ]),
    ToJoinFansClub () {
      if (this.UserInfo === null) {
        this.$emit('NeedLogin')
        return false
      }
      this.$notify.error({
        title: 'error',
        message: 'The payment function has not yet been opened, so stay tuned'
      })
      // if (this.DataLock) return
      // this.DataLock = true
      // this.CreateOrder({
      //   params: {
      //     accountId: this.UserInfo.id,
      //     productId: this.PageUserInfo.id,
      //     productType: 1
      //   }
      // }).then((res) => {
      //   this.DataLock = false
      //   this.$emit('Close')
      //   window.location.href = `./order.html?orderId=${res.data.data.orderNo}`
      // }).then((res) => {
      //   this.$notify.error({
      //     title: 'error',
      //     message: res.data.msg
      //   })
      //   this.DataLock = false
      // })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
