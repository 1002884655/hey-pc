<template>
  <div class="components RechargePopup">
    <div class="centerLabel">
      <div class="Title flex-h">
        <span>Heycion Package</span>
        <span>(Balance: </span>
        <span class="Amount">{{UserInfo.rechargeCurrency || 0}}</span>
        <img src="../../assets/img/coin.png" alt="">
        <span>)</span>
        <div class="flex-item"></div>
        <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
      </div>
      <div class="Content">
        <ul class="List">
          <li v-for="(item, index) in PageList" :key="index" class="flex-h" :class="{'active': ActiveIndex === index}" @click="ActiveIndex = index">
            <div class="flex-item">
              <div>
                <span>{{item.amount}}</span>
                <img src="../../assets/img/coin.png" height="20px" alt="">
              </div>
            </div>
            <div class="Price">
              <span>${{item.usdPrice}}</span>
            </div>
          </li>
          <!-- 后面加入充值优惠需求时，优惠布局可以采用下面的结构，和上面的列表结构混合使用 -->
          <!-- <li v-for="(item, index) in PageList" :key="index" class="flex-h" :class="{'active': ActiveIndex === index}" @click="ActiveIndex = index">
            <div class="flex-item">
              <div>
                <span>{{item.amount}}</span>
                <img src="../../assets/img/coin.png" height="20px" alt="">
                <span>+ 30</span>
                <img src="../../assets/img/coin.png" height="20px" alt="">
              </div>
              <span>+ ULTIMATE OFFER</span>
            </div>
            <div class="Price">
              <span>${{item.usdPrice}}</span>
              <span>5% bonus</span>
            </div>
          </li> -->
        </ul>
        <div class="Bottom">
          <a :class="{'active': !DataLock}" @click="ToCashHeyCoin">Top up Heycion</a>
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
