<template>
  <div id="app" class="WhitePage">
    <MainPage @UserInfoChange="Init" :HideFooter="true">
      <div class="MainContent flex-h">
        <nav class="Nav" v-if="UserInfo !== null">
          <a v-for="(item, index) in NavList" :key="index" v-if="(UserInfo.userType - 0 === 1 && item.id - 0 !== 2) || UserInfo.userType - 0 !== 1" :class="{'active': CurrentNavId - 0 === item.id - 0}" @click="CutNav(item)">{{item.name}}</a>
        </nav>
        <div class="flex-item" v-if="UserInfo !== null">

          <!-- Heycoin Account -->
          <div v-if="CurrentNavId - 0 === 1">
            <WalletForHeycoinAccount></WalletForHeycoinAccount>
          </div>

          <!-- My earnings -->
          <div v-if="CurrentNavId - 0 === 2 && !ShowWithdraw && !ShowBindCard">
            <WalletForMyEarnings @ShowWithdraw="ShowWithdraw = true; ShowBindCard = false"></WalletForMyEarnings>
          </div>

          <!-- Withdraw -->
          <div v-if="CurrentNavId - 0 === 2 && ShowWithdraw && !ShowBindCard">
            <WalletForWithdraw @CloseWithdraw="ShowWithdraw = false" @BindCard="ShowWithdraw = false; ShowBindCard = true"></WalletForWithdraw>
          </div>

          <!-- BindCard -->
          <div v-if="CurrentNavId - 0 === 2 && !ShowWithdraw && ShowBindCard">
            <WalletForBindCard @BindSuccess="BindCardSuccess" @CloseBindCard="ShowBindCard = false; ShowWithdraw = true"></WalletForBindCard>
          </div>

          <!-- My bill -->
          <div v-if="CurrentNavId - 0 === 3" class="MyBill">
            <nav>
              <a v-for="(item, index) in BillNav" :key="index" v-if="(item.id === 1 || item.id === 4) && (UserInfo.userType - 0 === 1) || (item.id === 2 || item.id === 3) && (UserInfo.userType - 0 !== 1)" :class="{'active': CurrentBillId === item.id}" @click="CurrentBillId = item.id">{{item.name}}</a>
            </nav>

            <!-- Expenses record -->
            <div class="Content" v-if="CurrentBillId === 1">
              <WalletForExpensesRecord @ShowDetail="ShowDetail"></WalletForExpensesRecord>
            </div>

            <!-- Revenue record -->
            <div class="Content" v-if="CurrentBillId === 2">
              <WalletForRevenueRecord @ShowDetail="ShowDetail"></WalletForRevenueRecord>
            </div>

            <!-- Withdrawals record -->
            <div class="Content" v-if="CurrentBillId === 3">
              <WalletForWithdrawalsRecord @ShowDetail="ShowDetail"></WalletForWithdrawalsRecord>
            </div>

            <!-- Recharge record -->
            <div class="Content" v-if="CurrentBillId === 4">
              <WalletForRechargeRecord @ShowDetail="ShowDetail"></WalletForRechargeRecord>
            </div>

          </div>

        </div>
      </div>
      <div class="DetailsPopup" v-if="BillDetail !== null">
        <div class="centerLabel">
          <div class="Title">
            <span>Bill details</span>
            <a class="iconfont iconguanbi" @click="BillDetail = null"></a>
          </div>
          <div class="Price">
            <div>
              <span>$</span>
              <span>{{BillDetail.PopupType === 'revenue' ? BillDetail.toUserIncome : BillDetail.paymentMoney}}</span>
              <!-- <span>{{BillDetail.toUserIncome || BillDetail.paymentMoney}}</span> -->
            </div>
            <span>{{ToolClass.ReturnBillTypes(BillDetail.businessType, BillDetail.productType)}}</span>
          </div>
          <div class="Info">
            <div class="flex-h" v-if="BillDetail.PopupType === 'revenue'">
              <span>Name</span>
              <span class="flex-item">{{BillDetail.userName || '-'}}</span>
            </div>
            <div class="flex-h">
              <span>Amount</span>
              <span class="flex-item">$ {{BillDetail.paymentMoney}}</span>
            </div>
            <div class="flex-h" v-if="BillDetail.PopupType === 'revenue'">
              <span>Your Share</span>
              <span class="flex-item">{{BillDetail.ratio !== null && BillDetail.ratio !== undefined ? `${BillDetail.ratio * 100}%` : '-'}}</span>
            </div>
            <div class="flex-h" v-if="BillDetail.PopupType === 'expenses' || BillDetail.PopupType === 'revenue'">
              <span>Items</span>
              <span class="flex-item">{{BillDetail.obj || '-'}}</span>
            </div>
            <div class="flex-h" v-if="BillDetail.PopupType === 'expenses' || BillDetail.PopupType === 'recharge' || BillDetail.PopupType === 'revenue'">
              <span>Details</span>
              <span class="flex-item">{{BillDetail.content || '-'}}</span>
            </div>
            <!-- <div class="flex-h" v-if="BillDetail.PopupType === 'withdraw'">
              <span>Bank Details</span>
              <span class="flex-item">{{BillDetail.cardId || '-'}}</span>
            </div> -->
            <div class="flex-h">
              <span>Time</span>
              <span class="flex-item">{{ToolClass.DateFormatYear(BillDetail.createTime)}}</span>
            </div>
            <div class="flex-h" v-if="BillDetail.PopupType === 'expenses' || BillDetail.PopupType === 'recharge' || BillDetail.PopupType === 'revenue'">
              <span>Status</span>
              <span class="flex-item" v-if="BillDetail.PopupType !== 'revenue'">{{ToolClass.ReturnBillStatus(BillDetail.status)}}</span>
              <span class="flex-item" v-else>{{BillDetail.status - 0 === 1 || BillDetail.recordStatus - 0 === 0 ? 'pending' : BillDetail.status - 0 === 2 || BillDetail.recordStatus - 0 === 1 ? 'completed' : ''}}</span>
            </div>
            <div class="flex-h">
              <span>Order number</span>
              <span class="flex-item">{{BillDetail.orderNo}}</span>
            </div>
          </div>
        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
  钱包
*/
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import MainPage from '../../components/MainPage'
import WalletForHeycoinAccount from '../../components/WalletForHeycoinAccount'
import WalletForMyEarnings from '../../components/WalletForMyEarnings'
import WalletForWithdraw from '../../components/WalletForWithdraw'
import WalletForExpensesRecord from '../../components/WalletForExpensesRecord'
import WalletForRevenueRecord from '../../components/WalletForRevenueRecord'
import WalletForWithdrawalsRecord from '../../components/WalletForWithdrawalsRecord'
import WalletForRechargeRecord from '../../components/WalletForRechargeRecord'
import WalletForBindCard from '../../components/WalletForBindCard'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    MainPage,
    WalletForHeycoinAccount,
    WalletForMyEarnings,
    WalletForWithdraw,
    WalletForExpensesRecord,
    WalletForRevenueRecord,
    WalletForWithdrawalsRecord,
    WalletForRechargeRecord,
    WalletForBindCard
  },
  data () {
    return {
      ShowBindCard: false,
      ShowWithdraw: false,
      BillDetail: null,
      NavList: [
        { name: 'Heycoin', id: 1 },
        { name: 'Earnings', id: 2 },
        { name: 'Bill', id: 3 }
      ],
      CurrentNavId: 1,
      BillNav: [
        { name: 'Recharge History', id: 4 },
        { name: 'Transactions', id: 1 },
        { name: 'Earnings', id: 2 },
        { name: 'Withdrawals', id: 3 }
      ],
      CurrentBillId: 4
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetHeyCoinList'
    ]),
    BindCardSuccess () {
      this.ShowBindCard = false
      this.ShowWithdraw = true
    },
    CutNav (item) { // 切换左侧菜单
      this.CurrentNavId = item.id
      this.ShowWithdraw = false
    },
    ShowDetail (e) {
      this.BillDetail = { ...e.Data, PopupType: e.PopupType }
    },
    Init () {
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
