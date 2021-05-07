<template>
  <div class="components SgsStatusPopup">
    <div class="centerLabel">

      <!-- 认证成功 -->
      <div v-if="!SgsTypeError && SgsInfo.certStatus - 0 === 4 && SgsInfo.certAudit - 0 === 1">
        <div class="Close">
          <a class="iconfont iconguanbi1" @click="SgsPassConfirm"></a>
        </div>
        <i class="iconfont icontongguo" style="color: #259F57;"></i>
        <span class="Bold">Congratulations， Your request has been approved</span>
        <span>From now on, you can earn money through clubs, uploading videos and live streaming. For more help, check out the FAQ</span>
      </div>

      <!-- 认证失败 -->
      <div v-if="!SgsTypeError && SgsInfo.certStatus - 0 === 4 && SgsInfo.certAudit - 0 === 2">
        <div class="Close">
          <a class="iconfont iconguanbi1" @click="SgsPassConfirm"></a>
        </div>
        <i class="iconfont iconweitongguo" style="color: #FA595C;"></i>
        <span class="Bold">Your request has been rejected</span>
        <span>The identity information you submitted is not approved. Please check it again and submit it again.</span>
        <div class="flex-h">
          <a class="flex-item" @click="ToStopSgs">Termination request</a>
          <a class="flex-item" @click="ToResetSgs">To request</a>
        </div>
      </div>

      <!-- 认证未完成 -->
      <div v-if="!SgsTypeError && SgsInfo.certStatus - 0 < 4">
        <div class="Close">
          <a class="iconfont iconguanbi1" @click="Close"></a>
        </div>
        <i class="iconfont iconshibai" style="color: #FA595C;"></i>
        <span class="Bold">Your request is not complete</span>
        <span>Your request is not yet complete, you can continue to complete the request information.</span>
        <div class="flex-h">
          <a class="flex-item" @click="ToStopSgs">Termination request</a>
          <a class="flex-item" @click="ContinueSgs">Continue to request</a>
        </div>
      </div>

      <!-- 认证类型错误 -->
      <div v-if="SgsTypeError">
        <div class="Close">
          <a class="iconfont iconguanbi1" @click="$emit('Close')"></a>
        </div>
        <i class="iconfont iconshibai" style="color: #FA595C;"></i>
        <span class="Bold">Your request is not complete</span>
        <span>Have applied for {{SgsInfo.certType - 0 === 5 ? 'Model' : SgsInfo.certType - 0 === 4 ? 'Star' : 'Studio'}} certification, can not apply for another role.</span>
        <div class="flex-h">
          <a class="flex-item" @click="ToStopSgs">Termination request</a>
          <a class="flex-item" @click="ContinueSgs">Continue to {{SgsInfo.certType - 0 === 5 ? 'Model' : SgsInfo.certType - 0 === 4 ? 'Star' : 'Studio'}}</a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
/*
*/
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapSgsActions } = createNamespacedHelpers('sgs')
export default {
  name: 'SgsStatusPopup',
  props: {
    SgsTypeError: {
      default: false,
      type: Boolean
    },
    SgsInfo: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
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
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapSgsActions([
      'ConfirmSgs',
      'StopSgs',
      'ResetSgs'
    ]),
    Close () {
      if (window.localStorage.heypornsgshistory !== undefined) {
        let SgsArr = JSON.parse(window.localStorage.heypornsgshistory)
        SgsArr.map((item, index) => {
          if (item.id - 0 === this.UserInfo.id - 0) {
            SgsArr.splice(index, 1)
          }
        })
        SgsArr.push({ id: this.UserInfo.id, time: this.ToolClass.DateFormatYear(Date.now(), 'YY:MM:DD') })
        window.localStorage.heypornsgshistory = JSON.stringify(SgsArr)
      } else {
        let SgsArr = []
        SgsArr.push({ id: this.UserInfo.id, time: this.ToolClass.DateFormatYear(Date.now(), 'YY:MM:DD') })
        window.localStorage.heypornsgshistory = JSON.stringify(SgsArr)
      }
      this.$emit('Close')
    },
    SgsPassConfirm () { // 认证通过确认
      if (!this.DataLock) {
        this.DataLock = true
        this.ConfirmSgs({ params: { accountId: this.UserInfo.id } }).then(() => {
          this.DataLock = false
          this.$emit('Close')
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    ToStopSgs () { // 终止认证
      if (!this.DataLock) {
        this.DataLock = true
        this.StopSgs({ params: { accountId: this.UserInfo.id } }).then(() => {
          this.DataLock = false
          this.$emit('Close')
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    ToResetSgs () { // 重新认证
      if (!this.DataLock) {
        this.DataLock = true
        this.ResetSgs({ params: { accountId: this.UserInfo.id } }).then(() => {
          this.DataLock = false
          window.location.href = `./sgs.html`
          this.$emit('Close')
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    },
    ContinueSgs () { // 继续认证
      if (!this.DataLock) {
        this.DataLock = true
        window.location.href = `./sgs.html?type=${this.SgsInfo.certType - 0 === 5 ? 'model' : this.SgsInfo.certType - 0 === 4 ? 'star' : 'studio'}`
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
