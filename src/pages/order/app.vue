<template>
  <div id="app">
    <MainPage ref="MainPage" @UserInfoChange="UserInfoChange">
      <div class="MainContainer">
        <div class="Title flex-h">
          <a class="iconfont iconjiantouleft" @click="GoBack"></a>
          <!-- <span class="flex-item" v-if="OrderInfo !== null">Reward {{OrderInfo.content}} for a charge of ${{OrderInfo.paymentMoney}}</span> -->
          <span>Payment</span>
        </div>
        <div class="PayStatus" v-if="OrderInfo !== null && !ShowForm">

          <!-- 支付成功 -->
          <div v-if="OrderInfo.status - 0 === 1">
            <span>Success</span>
            <span>thank you for your purchase</span>
            <i class="iconfont iconfabuchenggong-3 Success"></i>
            <span>${{OrderInfo.paymentMoney}}</span>
            <a @click="GoBack">Back</a>
          </div>

          <!-- 支付中 -->
          <div v-if="OrderInfo.status - 0 === 2">
            <span>Waitting</span>
            <span>thank you for your purchase</span>
            <i class="iconfont icondengdai Waitting"></i>
            <span>${{OrderInfo.paymentMoney}}</span>
            <a @click="GoBack">Back</a>
          </div>

          <!-- 支付失败 -->
          <div v-if="OrderInfo.status - 0 === 3">
            <span>Error</span>
            <span>thank you for your purchase</span>
            <i class="iconfont icongantanhao1 Error"></i>
            <span>${{OrderInfo.paymentMoney}}</span>
            <a @click="GoBack">Back</a>
          </div>

        </div>
        <div class="Form" :style="{display: ShowForm ? 'block' : 'none'}">
          <span class="BuyType" v-if="OrderInfo !== null">Buy {{OrderInfo.content}} for a charge of ${{OrderInfo.paymentMoney}}</span>
          <div class="Title flex-h">
            <div class="flex-item">
              <span>Billing details</span>
              <span>We are fully compliant with Payment Card Industry Data Security Standards.</span>
            </div>
            <div class="flex-item">
              <span>Card details</span>
            </div>
          </div>
          <div class="InputContainer flex-h">
            <div class="flex-item">
              <div class="InputLine">
                <el-select v-model="FormData.billCountry" @change="CountryChange" class="PayInfoSelect" placeholder="Country" no-data-text="no data">
                  <el-option v-for="item in CountryList" :key="item.countryCode" :label="item.countryName" :value="item.countryCode"></el-option>
                </el-select>
              </div>
              <div class="InputLine" v-if="FormData.billCountry !== 'CA' && FormData.billCountry !== 'US'">
                <span ref="Tips1" :class="{'active': FormData.billState !== ''}">State</span>
                <input type="text" v-model="FormData.billState" @focus="InputFocus('Tips1')" @blur="InputBlur('Tips1', 'billState')">
              </div>
              <div class="InputLine" v-else>
                <el-select v-model="FormData.billState" class="PayInfoSelect" placeholder="State" no-data-text="no data">
                  <el-option v-for="item in StateList" :key="item.stateCode" :label="item.stateName" :value="item.stateCode"></el-option>
                </el-select>
              </div>
              <div class="InputLine">
                <span ref="Tips11" :class="{'active': FormData.billCity !== ''}">City</span>
                <input type="text" v-model="FormData.billCity" @focus="InputFocus('Tips11')" @blur="InputBlur('Tips11', 'billCity')">
              </div>
              <div class="InputLine">
                <span ref="Tips9" :class="{'active': FormData.billAddress !== ''}">Address</span>
                <input type="text" v-model="FormData.billAddress" @focus="InputFocus('Tips9')" @blur="InputBlur('Tips9', 'billAddress')">
              </div>
              <div class="InputLine">
                <span ref="Tips10" :class="{'active': FormData.billPhone !== ''}">Phone</span>
                <input type="text" v-model="FormData.billPhone" @focus="InputFocus('Tips10')" @blur="InputBlur('Tips10', 'billPhone')">
              </div>
              <div class="InputLine">
                <span ref="Tips12" :class="{'active': FormData.billZip !== ''}">Zip</span>
                <input type="text" v-model="FormData.billZip" @focus="InputFocus('Tips12')" @blur="InputBlur('Tips12', 'billZip')">
              </div>
            </div>
            <div class="flex-item">
              <div class="InputLine">
                <span ref="Tips2" :class="{'active': FormData.billEmail !== ''}">E-mail</span>
                <input type="text" v-model="FormData.billEmail" @focus="InputFocus('Tips2')" @blur="InputBlur('Tips2', 'billEmail')">
              </div>
              <div class="InputLine">
                <span ref="Tips3" :class="{'active': FormData.cardNo !== ''}">Card Number</span>
                <input type="text" v-model="FormData.cardNo" @focus="InputFocus('Tips3')" @blur="InputBlur('Tips3', 'cardNo')">
              </div>
              <div class="InputLine">
                <span ref="Tips4" :class="{'active': FormData.firstName !== ''}">Card Holder First Name</span>
                <input type="text" v-model="FormData.firstName" @focus="InputFocus('Tips4')" @blur="InputBlur('Tips4', 'firstName')">
              </div>
              <div class="InputLine">
                <span ref="Tips5" :class="{'active': FormData.lastName !== ''}">Card Holder Last Name</span>
                <input type="text" v-model="FormData.lastName" @focus="InputFocus('Tips5')" @blur="InputBlur('Tips5', 'lastName')">
              </div>
              <div class="InputFlex">
                <span>Expiration</span>
                <div class="flex-h">
                  <div class="flex-item">
                    <div class="InputLine" style="margin-top: 0;">
                      <span ref="Tips6" :class="{'active': FormData.cardExpireMonth !== ''}">MM</span>
                      <input type="text" v-model="FormData.cardExpireMonth" @focus="InputFocus('Tips6')" @blur="InputBlur('Tips6', 'cardExpireMonth')">
                    </div>
                  </div>
                  <div class="flex-item">
                    <div class="InputLine" style="margin-top: 0;">
                      <span ref="Tips7" :class="{'active': FormData.cardExpireYear !== ''}">YYYY</span>
                      <input type="text" v-model="FormData.cardExpireYear" @focus="InputFocus('Tips7')" @blur="InputBlur('Tips7', 'cardExpireYear')">
                    </div>
                  </div>
                  <div class="flex-item">
                    <div class="InputLine" style="margin-top: 0;">
                      <span ref="Tips8" :class="{'active': FormData.cardSecurityCode !== ''}">CVC</span>
                      <input type="text" v-model="FormData.cardSecurityCode" @focus="InputFocus('Tips8')" @blur="InputBlur('Tips8', 'cardSecurityCode')">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span style="margin-top: 30px; text-align: center; color: #fff; font-size: 14px;">Tick here to confirm that you are at least 18 years old and the age of majority in your place. of residence.</span>
          <div class="Agree">
            <a class="iconfont " :class="[Agree ? 'icongouxuan active' : 'iconweigouxuan']" @click="Agree = !Agree"></a>
            <span>Add credit card, you will not need to fill in your card information in the next payment.</span>
          </div>
          <a class="Submit" @click="ToPay" :class="{'active': !DataLock}">{{DataLock ? 'Submiting...' : 'Submit'}}</a>
        </div>
      </div>
    </MainPage>
  </div>
</template>

<script>
/*
*/
import { Select, Option } from 'element-ui'
import MainPage from '../../components/MainPage'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  components: {
    'el-select': Select,
    'el-option': Option,
    MainPage
  },
  data () {
    return {
      Remember: 1,
      ShowForm: true,
      Agree: true,
      DataLock: false,
      FormData: {
        billPhone: '',
        billAddress: '',
        billCountry: '',
        billCity: '',
        billEmail: '',
        cardNo: '',
        firstName: '',
        lastName: '',
        cardExpireMonth: '',
        cardExpireYear: '',
        cardSecurityCode: '',
        billState: '',
        billZip: ''
      },
      OrderInfo: null,
      CountryList: [],
      StateList: []
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
      'GetOrderInfo',
      'PayForOrder',
      'GetPayInfoCountry',
      'GetPayInfoCity',
      'GetPayCard'
    ]),
    Init () {
      this.GetPayInfoCountry().then((res) => { // 获取国家代码
        this.CountryList = res.data.data || []
      })
      this.GetPayCard({ params: { accountId: this.UserInfo.id } }).then((res) => {
        if (res.data.data !== null) {
          for (let key in this.FormData) {
            this.FormData[key] = res.data.data[key]
          }
          this.CountryChange()
          this.FormData.billState = res.data.data.billState
        }
      })
    },
    GoBack () {
      window.history.back()
    },
    CountryChange () {
      this.FormData.billState = ''
      if (this.FormData.billCountry === 'US' || this.FormData.billCountry === 'CA') {
        this.StateList = []
        this.GetPayInfoCity({ params: { countryCode: this.FormData.billCountry } }).then((res) => {
          this.StateList = res.data.data || []
        })
      }
    },
    InputChange (target) {
      console.log(111)
    },
    InputFocus (target) {
      this.$refs[target].className = 'active'
    },
    InputBlur (target, name) {
      if (this.FormData[name] === '') {
        this.$refs[target].className = ''
      }
    },
    CheckForm () {
      return true
    },
    ToPay () {
      if (this.DataLock || !this.CheckForm()) return
      this.DataLock = true
      this.PayForOrder({
        data: {
          billAddress: this.FormData.billAddress,
          billCity: this.FormData.billCity,
          billCountry: this.FormData.billCountry,
          billEmail: this.FormData.billEmail,
          billFirstName: this.FormData.firstName,
          billLastName: this.FormData.lastName,
          billPhone: this.FormData.billPhone,
          billState: this.FormData.billState,
          billZip: this.FormData.billZip,
          cardExpireMonth: this.FormData.cardExpireMonth,
          cardExpireYear: this.FormData.cardExpireYear,
          cardNo: this.FormData.cardNo,
          cardSecurityCode: this.FormData.cardSecurityCode,
          goodsInfo: JSON.stringify([this.OrderInfo.goodsInfo]) || '',
          orderAmount: this.OrderInfo.paymentMoney,
          orderCurrency: this.OrderInfo.currencyType,
          orderNo: this.OrderInfo.orderNo,
          remember: this.Agree ? 1 : 0
        }
      }).then((res) => {
        if (res.data.data.orderSucceed - 0 === 1 || res.data.data.orderSucceed - 0 === -1) {
          this.ShowForm = false
          this.OrderInfo.status = 1 // 支付成功
        } else {
          if (res.data.data.redirectUrl !== null) {
            window.location.href = res.data.data.redirectUrl
          }
        }
        this.DataLock = false
      }).catch((res) => {
        if (res.data.code - 0 === 7001) { // 支付失败
          this.ShowForm = false
          this.OrderInfo.status = 3
        } else if (res.data.code - 0 === 7004) { // 支付中
          this.ShowForm = false
          this.OrderInfo.status = 2
        } else {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
        }
        this.DataLock = false
      })
    },
    UserInfoChange () { // 用户信息更新
      if (this.UserInfo !== null) {
        this.Init()
        this.GetOrderInfo({ params: { orderNo: this.ToolClass.GetUrlParams('orderId') } }).then((res) => {
          this.OrderInfo = res.data.data || null
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
