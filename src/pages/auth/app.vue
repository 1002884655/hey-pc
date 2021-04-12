<template>
  <div id="app">
    <MainPage @UserInfoChange="Init">
      <div class="Content">

        <div>
          <div class="Text">
            <span>Join us to</span>
            <span>reap the benefits</span>
            <span>Leading adult platform, huge user traffic, high revenue sharing</span>
          </div>
          <div class="Bg"></div>
        </div>

        <div>
          <div class="Center">
            <span class="Title">Strong earnings</span>
            <ul class="flex-h">
              <li class="flex-item" v-for="(item, index) in Earnings" :key="index">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.name}}</span>
                <span>{{item.desc}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div class="Center">
            <span class="Title">Creator's application</span>
            <ul class="flex-h">
              <li class="flex-item" v-for="(item, index) in Application" :key="index">
                <div class="Icon">
                  <i class="iconfont" :class="item.icon"></i>
                </div>
                <i class="iconfont iconwenhao"></i>
                <span>{{item.name}}</span>
                <ul>
                  <li v-for="(subItem, subIndex) in item.desc" :key="subIndex">{{subItem}}</li>
                </ul>
                <a @click="RoleSelect(item.type)">Start certification</a>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div class="Center">
            <span class="Title">Just 3 Simple Steps</span>
            <ul class="flex-h">
              <li class="flex-item">
                <span>1</span>
                <span>Create a free</span>
                <span>Heyporn account</span>
                <a>Sign up</a>
              </li>
              <li class="flex-item">
                <span>2</span>
                <span>Choose an identity</span>
                <span class="Tips">(modle，Star or Studio)</span>
              </li>
              <li class="flex-item">
                <span>3</span>
                <span>Submit application</span>
                <span class="Tips">(Submission of ID card related information)</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </MainPage>
  </div>
</template>

<script>
import MainPage from '../../components/MainPage'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapSgsActions } = createNamespacedHelpers('sgs')
export default {
  components: {
    MainPage
  },
  data () {
    return {
      SgsInfo: null,
      Earnings: [
        { icon: `iconmeiyuan`, name: `Live revenue share`, desc: `You’ll get up to 60% of the live revenue` },
        { icon: `iconaccountbook`, name: `Video Sales`, desc: `Revenue sharing from video sales can reach up to 65%` },
        { icon: `iconjulebushenhe`, name: `Fan Club`, desc: `Unique fan club and keep the profit 95% payout less 15% processing free` },
        { icon: `iconzuanshi`, name: `Fans Tips`, desc: `You can share up to 80% of the Tips that fans send to you` },
        { icon: `iconyaoqinghaoyou`, name: `Referrals=$`, desc: `Recommend a user, and when she completes a platform quest you get a reward` },
        { icon: `iconjili-01`, name: `Incentive plan`, desc: `Every week we will have a dollar incentive campalgn` }
      ],
      Application: [
        { icon: 'iconmodel91', name: 'Model', type: 'model', desc: ['Up to 60% of the live bonus', 'Up to 80% of the video dividend', 'A fan club of its own', '2 weeks is preferred', 'Charge back protection'], id: 1 },
        { icon: 'iconmingxing1', name: 'Star', type: 'star', desc: [`Up to 60% of the live bonus`, `Up to 80% of the video dividend`, `A fan club of its own`, `2 weeks is preferred`, `Charge back protection`], id: 2 },
        { icon: 'iconjigouguanli', name: 'Studio', type: 'studio', desc: [`Up to 60% of the live bonus`, `Up to 80% of the video dividend`, `A fan club of its own`, `2 weeks is preferred`, `Charge back protection`], id: 3 }
      ]
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
    ...mapSgsActions([
      'GetSgsInfo'
    ]),
    RoleSelect (type) {
      if (this.SgsInfo !== null) {
        if (this.SgsInfo.certStatus - 0 === 0) { // 未认证
          window.location.href = `./sgs.html?type=${type}`
        } else if (this.SgsInfo.certStatus - 0 === 4 && this.SgsInfo.certAudit - 0 === 1) { // 已认证
          this.$notify.success({
            title: 'success',
            message: 'A user can authenticate only one identity'
          })
        } else if (this.SgsInfo.certStatus - 0 === 4 && this.SgsInfo.certAudit - 0 === 0) { // 认证中
          this.$notify.error({
            title: 'error',
            message: 'Your application is under review'
          })
        } else {
          window.location.href = `./sgs.html`
        }
      }
    },
    Init () {
      if (this.UserInfo !== null) {
        this.GetSgsInfo({ params: { accountId: this.UserInfo.id } }).then((res) => {
          this.SgsInfo = { ...this.SgsInfo, ...res.data.data }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'page.scss';
</style>
