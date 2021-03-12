<template>
  <div class="components WalletForWithdraw">
    <div class="Title"><a class="iconfont iconjiantouleft" @click="$emit('CloseWithdraw')"></a><span>Withdraw</span></div>
    <div v-if="Type === 'Withdraw'" class="Withdraw">
      <div class="Line Big">
        <span>Amount</span>
      </div>
      <div class="Amount flex-h">
        <input type="text" :placeholder="`This time you can withdraw $${UserInfo.useMoney || 0}`" class="flex-item" v-model="CashCount">
        <a @click="() => {CashCount = UserInfo.useMoney}">All</a>
      </div>
      <!-- <div class="Line">
        <span>The minimum single transaction is $1, and the single-day withdrawal limit is $10000</span>
      </div> -->
      <div class="Line Big">
        <span>Bank Details</span>
      </div>
      <div class="BankCard">
        <div>
          <img src="../../assets/img/bankcard.png" alt="">
          <span>{{BindCardList.length ? BindCardList[0].bankNo : 'Unbound bank card'}}</span>
        </div>
        <a @click="$emit('BindCard')">Add Bank Details</a>
      </div>
      <!-- <div class="Line">
        <span>Expected to arrive in x days</span>
      </div> -->
      <a @click="ToCashMoney" :class="{'active': !DataLock}">Submit</a>
      <div class="Line Tips">
        <span>Continue to agree to the </span>
        <a>&lt;Terms of Service&gt;</a>
      </div>
    </div>
    <div v-if="Type === 'Status'" class="Status">
      <div>
        <i v-if="WithdrawRes.Status - 0 === 1" class="iconfont iconfabuchenggong-3"></i>
        <i v-else class="iconfont icongantanhao1 active"></i>
        <span>Has applied for withdrawal</span>
        <ul>
          <li class="flex-h">
            <span>Amount</span>
            <span class="flex-item">${{WithdrawRes.Amount}}</span>
          </li>
          <li class="flex-h">
            <span>Bank Details</span>
            <div class="flex-item"></div>
            <img src="../../assets/img/bankcard.png" alt="">
            <span>{{WithdrawRes.Account}}</span>
          </li>
          <li class="flex-h">
            <span>Account Name</span>
            <span class="flex-item">{{WithdrawRes.Name}}</span>
          </li>
        </ul>
        <!-- <span class="Tips">The withdrawal fee rate is 0.05%, and it is estimated to be ${{((WithdrawRes.Amount - 0) * 0.9995).toFixed(2)}}</span>
        <span class="Tips">Expected to arrive in x days</span> -->
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
  name: 'WalletForWithdraw',
  props: ['data'],
  data () {
    return {
      WithdrawRes: {},
      Type: 'Withdraw',
      CashCount: null,
      DataLock: false,
      BindCardList: []
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
      'CashMoney',
      'GetUserBindCard'
    ]),
    ...mapUserMutations([
      'EditUserInfo'
    ]),
    Init () {
      this.GetUserBindCard({ params: { accountId: this.UserInfo.id, type: 2 } }).then((res) => {
        this.BindCardList = res.data.data || []
      })
    },
    ToCashMoney () {
      if (this.DataLock) return
      this.DataLock = true
      this.CashMoney({ params: { accountId: this.UserInfo.id, bankCardId: this.BindCardList[0].id, cash: this.CashCount - 0 } }).then((res) => {
        // this.$notify.success({ title: 'success', message: 'Withdrawal success' })
        this.EditUserInfo({ name: 'useMoney', value: this.UserInfo.useMoney - this.CashCount })
        this.WithdrawRes.Status = 1
        this.WithdrawRes.Amount = this.CashCount - 0
        this.WithdrawRes.Account = this.BindCardList[0].bankNo
        this.WithdrawRes.Name = this.BindCardList[0].userName
        this.Type = 'Status'
        this.CashCount = null
        this.DataLock = false
      }).catch((res) => {
        this.$notify.error({ title: 'error', message: res.data.msg })
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
