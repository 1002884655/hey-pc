<template>
  <div class="components WalletForMyEarnings">
    <span class="Title">Earnings</span>
    <div class="Line">
      <span>Available Balance</span>
    </div>
    <div class="flex-h">
      <span>$</span>
      <span>{{UserInfo.useMoney || 0}}</span>
      <span></span>
      <div class="flex-item"></div>
      <a v-if="UserInfo.userType - 0 !== 1" class="Btn" @click="$emit('ShowWithdraw')">Withdraw</a>
    </div>
    <div class="Line">
      <span>Available Balance: ${{UserInfo.noUserMoney}}; Processing: ${{UserInfo.freezeMoney}}</span>
    </div>
    <!-- <div class="Line Border">
      <span>The minimum single transaction is $1, and the single-day withdrawal limit is $10000</span>
    </div> -->
    <!-- <div class="Line">
      <span>Creative income</span>
      <span>$ 12.65</span>
      <span>(Divided into 50%)</span>
    </div>
    <div class="Line">
      <span>Fan income</span>
      <span>$ 12.65</span>
      <span>(Divided into 50%)</span>
    </div>
    <div class="Line">
      <span>Live income</span>
      <img src="../../assets/img/coin.png" alt="">
      <span>12.65</span>
      <span>(Divided into 50%)</span>
      <a class="iconfont iconmendian-"></a>
    </div> -->
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'WalletForMyEarnings',
  props: ['data'],
  data () {
    return {
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
      'GetUserInfoByToken'
    ]),
    Init () {
      this.GetUserInfoByToken({ // 根据token获取用户信息
        params: { token: this.$localStorage.get('heypornid') }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
