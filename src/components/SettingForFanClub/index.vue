<template>
  <div class="components SettingForFanClub">
    <div class="Form" v-if="UserInfo.userType - 0 > 1">
      <span v-if="UserInfo.fanClubAllow - 0 !== 1">The platform has activated the fan club function for you. After activating the club and setting the price, other users can pay to join your club.</span>
      <div class="Line">
        <span>Price per month</span>
        <div>
          <input type="text" placeholder="$ Set the price and activate the club" v-model="Price">
        </div>
      </div>
    </div>
    <div class="Bottom flex-h" v-if="UserInfo.userType - 0 > 1">
      <span class="flex-item">price range ${{MinPrice}}-${{MaxPrice}}</span>
      <a :class="{'active': !DataLock}" @click="ToActivateFansClub">{{DataLock ? 'Loading...' : 'SAVE'}}</a>
    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'SettingForFanClub',
  props: ['data'],
  data () {
    return {
      Price: null,
      DataLock: false,
      MaxPrice: 0,
      MinPrice: 0,
      IsEdit: false
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
      'GetFansClubSetPrice',
      'SetFansClubPrice'
    ]),
    ...mapUserMutations([
      'EditUserInfo'
    ]),
    Init () {
      if (this.UserInfo.fanClubPrice - 0 > 0) {
        this.Price = (this.UserInfo.fanClubPrice - 0).toFixed(2)
      }
      if (this.UserInfo.userType - 0 > 1) {
        this.GetFansClubSetPrice({ params: { accountId: this.UserInfo.id } }).then((res) => {
          this.MaxPrice = (res.data.data.maxMoney - 0).toFixed(2)
          this.MinPrice = (res.data.data.minMoney - 0).toFixed(2)
          if (this.UserInfo.fanClubAllow - 0 !== 1) {
            this.IsEdit = true
          }
        })
      }
    },
    ToActivateFansClub () { // 激活粉丝团
      if (this.Price - 0 < this.MinPrice - 0 || this.Price - 0 > this.MaxPrice - 0) {
        this.$notify.error({
          title: 'error',
          message: 'The price is invalid'
        })
        return false
      }
      if (this.DataLock) return
      this.DataLock = true
      this.SetFansClubPrice({ params: { price: (this.Price - 0).toFixed(2), accountId: this.UserInfo.id } }).then((res) => {
        this.$notify.success({
          title: 'success',
          message: 'Price saved!'
        })
        this.IsEdit = false
        this.EditUserInfo({ name: 'fanClubAllow', value: 1 })
        this.EditUserInfo({ name: 'fanClubPrice', value: (this.Price - 0).toFixed(2) })
        this.DataLock = false
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.message
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
