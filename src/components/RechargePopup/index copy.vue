<template>
  <div class="components RechargePopup">
    <div class="centerLabel">
      <div class="Title flex-h">
        <span>Recharge</span>
        <span>(Balance: </span>
        <span class="Amount">{{UserInfo.rechargeCurrency || 0}}</span>
        <img src="../../assets/img/coin.png" alt="">
        <span>)</span>
        <div class="flex-item"></div>
        <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
      </div>
      <div class="Content">
        <span class="Title">HeyCoin Package</span>
        <ul class="List">
          <li v-for="(item, index) in PageList" :key="index" :class="{'active': ActiveIndex === index}" @click="ActiveIndex = index">
            <div>
              <img src="../../assets/img/coin.png" alt="">
              <span>{{item.amount}}</span>
            </div>
            <span>${{item.usdPrice}}</span>
          </li>
        </ul>
        <div class="Bottom">
          <a :class="{'active': !DataLock}" @click="ToCashHeyCoin">Recharge</a>
          <span>Recharge means agree to <a>&lt;Recharge User Agreement&gt;</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'RechargePopup',
  props: ['data'],
  data () {
    return {
      ActiveIndex: 0,
      DataLock: false,
      PageList: []
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
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
      'GetHeyCoinList',
      'CreateOrder'
    ]),
    ...mapUserMutations([
      ''
    ]),
    Init () {
      this.GetHeyCoinList({ params: { pageNum: 1, pageSize: 1000 } }).then((res) => {
        this.PageList = [...res.data.data.list]
      })
    },
    ToCashHeyCoin () { // 充值
      if (this.DataLock) return
      this.DataLock = true
      this.CreateOrder({
        params: {
          accountId: this.UserInfo.id,
          productId: this.PageList[this.ActiveIndex].id,
          productType: 4
        }
      }).then((res) => {
        this.DataLock = false
        window.localStorage.OrderBackUrl = window.location.href
        window.localStorage.OrderType = 'pay'
        window.location.href = res.data.data.payUrl
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
        this.DataLock = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
