<template>
  <div class="components WalletForBindCard">
    <div class="Title"><a class="iconfont iconjiantouleft" @click="$emit('CloseBindCard')"></a><span>Bind/replace bank card</span></div>
    <div class="Form" v-if="Type === 'Bind'">
      <div class="InputLine">
        <el-select v-model="FormData.country" class="BindCardSelect" placeholder="country" no-data-text="no data">
          <el-option v-for="item in CountryList" :key="item.countryCode" :label="item.countryName" :value="item.countryCode"></el-option>
        </el-select>
      </div>
      <div class="InputLine">
        <span ref="Tips1" :class="{'active': FormData.remittanceNum !== ''}">9-digit remittance route number</span>
        <input type="text" v-model="FormData.remittanceNum" @focus="InputFocus('Tips1')" @blur="InputBlur('Tips1', 'remittanceNum')">
      </div>
      <div class="InputLine">
        <span ref="Tips2" :class="{'active': FormData.bankNo !== ''}">Bank Account</span>
        <input type="text" v-model="FormData.bankNo" @focus="InputFocus('Tips2')" @blur="InputBlur('Tips2', 'bankNo')">
      </div>
      <div class="InputLine">
        <span ref="Tips3" :class="{'active': BankNoAgain !== ''}">Re-enter bank account</span>
        <input type="text" v-model="BankNoAgain" @focus="InputFocus('Tips3')" @blur="InputBlur('Tips3', 'BankNoAgain', false)">
      </div>
      <div class="InputLine">
        <span ref="Tips4" :class="{'active': FormData.firstName !== ''}">Account holder first name</span>
        <input type="text" v-model="FormData.firstName" @focus="InputFocus('Tips4')" @blur="InputBlur('Tips4', 'firstName')">
      </div>
      <div class="InputLine">
        <span ref="Tips5" :class="{'active': FormData.lastName !== ''}">Account holder last name</span>
        <input type="text" v-model="FormData.lastName" @focus="InputFocus('Tips5')" @blur="InputBlur('Tips5', 'lastName')">
      </div>
      <a @click="ToBindCard" :class="{'active': !DataLock}">{{DataLock ? 'Submiting...' : 'Bind'}}</a>
    </div>
    <div v-if="Type === 'Status'" class="Status">
      <div>
        <i v-if="BindRes.Status - 0 === 1" class="iconfont iconfabuchenggong-3"></i>
        <i v-else class="iconfont icongantanhao1 active"></i>
        <span>Bind withdrawal</span>
        <ul>
          <li class="flex-h">
            <span>Bank Details</span>
            <div class="flex-item"></div>
            <img src="../../assets/img/bankcard.png" alt="">
            <span>{{BindRes.Account}}</span>
          </li>
          <li class="flex-h">
            <span>Account Name</span>
            <span class="flex-item">{{BindRes.Name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/*
*/
import { Select, Option } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'WalletForBindCard',
  props: ['data'],
  data () {
    return {
      Type: 'Bind',
      BindRes: {},
      FormData: {
        country: '',
        remittanceNum: '',
        bankNo: '',
        firstName: '',
        lastName: ''
      },
      CountryList: [],
      BankNoAgain: '',
      DataLock: false
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    'el-select': Select,
    'el-option': Option
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
      'GetPayInfoCountry',
      'BindBankCard'
    ]),
    ...mapUserMutations([
      'EditUserInfo'
    ]),
    CheckForm () {
      if (this.FormData.country === '') {
        this.$notify.error({
          title: 'error',
          message: 'Country cannot be empty'
        })
        return false
      }
      if (this.FormData.remittanceNum === '') {
        this.$notify.error({
          title: 'error',
          message: 'Remittance route number cannot be empty'
        })
        return false
      }
      if (this.FormData.bankNo === '') {
        this.$notify.error({
          title: 'error',
          message: 'Bank Account cannot be empty'
        })
        return false
      }
      if (this.BankNoAgain === '') {
        this.$notify.error({
          title: 'error',
          message: 'Re-enter bank account cannot be empty'
        })
        return false
      }
      if (this.BankNoAgain !== this.FormData.bankNo) {
        this.$notify.error({
          title: 'error',
          message: 'The two input card numbers are inconsistent'
        })
        return false
      }
      if (this.FormData.firstName === '') {
        this.$notify.error({
          title: 'error',
          message: 'FirstName cannot be empty'
        })
        return false
      }
      if (this.FormData.lastName === '') {
        this.$notify.error({
          title: 'error',
          message: 'LastName cannot be empty'
        })
        return false
      }
      return true
    },
    ToBindCard () {
      if (this.CheckForm() && !this.DataLock) {
        this.DataLock = true
        this.BindBankCard({ data: { ...this.FormData, accountId: this.UserInfo.id } }).then(() => {
          // this.$notify.success({
          //   title: 'success',
          //   message: 'Binding success'
          // })
          // this.$emit('BindSuccess')
          this.BindRes.Status = 1
          this.BindRes.Account = this.FormData.bankNo
          this.BindRes.Name = `${this.FormData.firstName} ${this.FormData.lastName}`
          this.Type = 'Status'
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    InputFocus (target) {
      this.$refs[target].className = 'active'
    },
    InputBlur (target, name, bool = true) {
      if (bool) {
        if (this.FormData[name] === '') {
          this.$refs[target].className = ''
        }
      } else {
        if (this[name] === '') {
          this.$refs[target].className = ''
        }
      }
    },
    Init () {
      this.GetPayInfoCountry().then((res) => { // 获取国家代码
        this.CountryList = res.data.data || []
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
