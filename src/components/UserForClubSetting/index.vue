<template>
  <div class="components UserForClubSetting">
    <div class="Content">
      <span v-if="UserInfo.fanClubAllow - 0 !== 1">The platform has activated the fan club function for you. After activating the club and setting the price, other users can pay to join your club.</span>
      <span>Your fansclub price</span>
      <!-- <a v-if="UserInfo.fanClubAllow - 0 !== 1 && !AgreeActivate" class="active" @click="AgreeActivate = true; IsEdit = true">Activate the club</a> -->
      <div class="Price">
        <span v-if="!IsEdit">{{Price}}</span>
        <input v-else type="text" v-model="Price" placeholder="Please enter the price">
        <span style="margin-left: 5px;">$</span>
      </div>
      <span class="Tips" v-if="IsEdit">price range ${{MinPrice}}-${{MaxPrice}}</span>
      <a v-if="!IsEdit && UserInfo.fanClubAllow - 0 === 1" @click="IsEdit = true" class="active">Modift</a>
      <a v-if="IsEdit" @click="ToActivateFansClub" :class="{'active': Price - 0 >= MinPrice && Price - 0 <= MaxPrice}">{{UserInfo.fanClubAllow - 0 === 1 ? 'Save' : 'Activation Fansclub'}}</a>
    </div>
  </div>
</template>

<script>
/*
  激活俱乐部
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UserForClubSetting',
  props: ['data'],
  data () {
    return {
      AgreeActivate: false,
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
      this.AgreeActivate = this.UserInfo.fanClubAllow - 0 === 1
      this.GetFansClubSetPrice({ params: { accountId: this.UserInfo.id } }).then((res) => {
        this.MaxPrice = (res.data.data.maxMoney - 0).toFixed(2)
        this.MinPrice = (res.data.data.minMoney - 0).toFixed(2)
        if (this.UserInfo.fanClubAllow - 0 !== 1) {
          this.IsEdit = true
        }
      })
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
