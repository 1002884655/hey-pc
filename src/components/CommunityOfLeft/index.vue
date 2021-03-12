<template>
  <div class="components CommunityOfLeft">

    <!-- 个人基本信息 -->
    <div class="UserBasicInfo">

      <!-- 头像 -->
      <div class="Icon">
        <a>
          <img :src="data.picPath3" class="centerLabel cover" alt="">
        </a>
        <span class="iconfont iconzhaopian1" v-if="ShowEditIcon" @click="ShowImageCropping = true"></span>
      </div>

      <!-- 其他基本信息 -->
      <div class="OtherBasicInfo">

        <!-- 姓名&性别 -->
        <div class="UserName">
          <span>{{data.name}}</span>
          <i class="iconfont iconnan" v-if="data.sex - 0 === 1"></i>
          <i class="iconfont iconnv" v-if="data.sex - 0 === 2"></i>
        </div>

        <!-- 账号数据 -->
        <div class="AccountData flex-h">
          <a class="flex-item" @click="SubscribeInfo({Id: 8})">
            <span>{{SubscribeNum}}</span>
            <span>Follow</span>
          </a>
          <a class="flex-item" @click="SubscribeInfo({Id: 9})">
            <span>{{MySubscribeNum}}</span>
            <span>Subscribers</span>
          </a>
        </div>

        <!-- 账号操作 -->
        <div class="AccountOperation flex-h">
          <!-- <a class="flex-item">Send a tip</a> -->
          <a class="flex-item" v-if="UserInfo !== null && UserInfo.id !== data.id" @click="ToSubscribe" :class="{'active': !HasSubscribe}">{{HasSubscribe ? 'Subscribed' : 'Subscribers'}}</a>
        </div>

        <!-- 用户简介 -->
        <div class="UserDesc">
          <span>{{data.description || `No introduction`}}</span>
        </div>

        <!-- 附属信息 -->
        <ul class="SatelliteInfo">
          <li class="flex-h">
            <span><i class="iconfont iconnianling"></i></span>
            <span class="flex-item">{{data.age || `unknown`}}</span>
          </li>
          <li class="flex-h">
            <span><i class="iconfont iconnianling-"></i></span>
            <span class="flex-item">{{data.birthday || `unknown`}}</span>
          </li>
          <li class="flex-h">
            <span><i class="iconfont icondizhi"></i></span>
            <span class="flex-item">{{data.cityName}} {{data.stateName}} {{data.countryName}}</span>
          </li>
        </ul>

      </div>

    </div>

    <ImageCropping ref="ImageCropping" v-if="ShowImageCropping" @Close="ShowImageCropping = false" @Change="$emit('UserIconChange')"></ImageCropping>
  </div>
</template>

<script>
/*
  页面名称：社交页面左侧组件
  创建人：许成祥
  创建时间：2020/03/13
  最近修改人：许成祥
  最近修改日期：2020/05/13
  备注： 无
*/
import Vue from 'vue'
import { Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import ImageCropping from '../ImageCropping'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'CommunityOfLeft',
  props: ['data'],
  data () {
    return {
      ShowImageCropping: false, // 显隐剪切图片
      ShowEditIcon: false, // 显隐编辑头像
      HasSubscribe: true, // 是否订阅过此用户
      DataLock: false, // 数据锁
      SubscribeNum: 0, // 我的粉丝
      MySubscribeNum: 0 // 我订阅别人的数量
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    ImageCropping
  },
  created () {
    if (this.UserInfo !== null && this.data.id !== this.UserInfo.id) {
      this.CheckSubscribe({
        params: { subId: this.data.id, accountId: this.UserInfo.id }
      }).then((res) => {
        if (res.data.code - 0 === 0) {
          this.HasSubscribe = !!res.data.data.subscribeStatus
        }
      })
    } else if (this.UserInfo !== null && this.data.id - 0 === this.UserInfo.id - 0) {
      this.ShowEditIcon = true
    }
    this.GetAccountSubscribe({
      params: { accountId: this.data.id }
    }).then((res) => {
      if (res.data.code - 0 === 0) {
        this.SubscribeNum = res.data.data.subscribe - 0
        this.MySubscribeNum = res.data.data.mySubscribe - 0
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetAccountSubscribe',
      'AccountSubscribe',
      'CheckSubscribe',
      'Unsubscribe'
    ]),
    SubscribeInfo (params) { // 查看订阅数据
      if (this.UserInfo !== null && this.UserInfo.id - 0 === this.ToolClass.GetUrlParams('key') - 0) {
        this.$emit('Change', params)
      }
    },
    ToSubscribe () { // 去订阅
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定
        if (!this.HasSubscribe) { // 订阅
          this.AccountSubscribe({
            params: { subId: this.data.id, accountId: this.UserInfo.id }
          }).then((res) => {
            if (res.data.code - 0 === 0) {
              this.HasSubscribe = true
              this.$notify.success({
                title: 'success',
                message: 'Subscribe of success!'
              })
            } else {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
            }
            this.DataLock = false // 数据解锁
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false // 数据解锁
          })
        } else {
          this.Unsubscribe({
            params: { subId: this.data.id, accountId: this.UserInfo.id }
          }).then((res) => {
            if (res.data.code - 0 === 0) {
              this.HasSubscribe = false
              this.$notify.success({
                title: 'success',
                message: 'Unsubscribe of success!'
              })
            } else {
              this.$notify.error({
                title: 'error',
                message: res.data.msg
              })
            }
            this.DataLock = false // 数据解锁
          }).catch((res) => {
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
            this.DataLock = false // 数据解锁
          })
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
