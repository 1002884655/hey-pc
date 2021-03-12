<template>
  <div class="components WalletForHeycoinAccount">
    <span class="Title">Heycoin Account</span>
    <div class="Balance">
      <!-- <span>Account balance</span> -->
      <div class="flex-h">
        <img src="../../assets/img/coin.png" alt="">
        <span>{{UserInfo.rechargeCurrency || 0}}</span>
      </div>
      <span v-if="UserInfo.userType - 0 === 1">HeyCoin Package</span>
    </div>
    <div class="ChongZhi" v-if="UserInfo.userType - 0 === 1">
      <div class="List">
        <div v-for="(item, index) in PageList" :key="index" :class="{'active': CurrentIndex === index}" @click="CurrentIndex = index">
          <div>
            <div>
              <img src="../../assets/img/coin.png" alt="">
              <span>{{item.amount}}</span>
            </div>
            <span>${{item.usdPrice}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="Btn" v-if="UserInfo.userType - 0 === 1">
      <a @click="ToCashHeyCoin">Top up HeyCoin</a>
      <span>Recharge means agree to <a>&lt;Recharge User Agreement&gt;</a></span>
    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'WalletForHeycoinAccount',
  props: ['data'],
  data () {
    return {
      CurrentIndex: 0,
      PageList: [],
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
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'CreateOrder',
      'GetHeyCoinList',
      'PayForHeyCoin'
    ]),
    ...mapUserMutations([
      'EditUserInfo'
    ]),
    Init () {
      this.GetHeyCoinList({ params: { pageNum: 1, pageSize: 1000 } }).then((res) => {
        this.PageList = [...res.data.data.list]
      })
    },
    ToCashHeyCoin () { // 充值
      this.$notify.error({
        title: 'error',
        message: 'The payment function has not yet been opened, so stay tuned'
      })
      // if (this.DataLock) return
      // this.DataLock = true
      // this.CreateOrder({
      //   params: {
      //     accountId: this.UserInfo.id,
      //     productId: this.PageList[this.CurrentIndex].id,
      //     productType: 4
      //   }
      // }).then((res) => {
      //   window.location.href = `./order.html?orderId=${res.data.data.orderNo}`
      //   this.DataLock = false
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
