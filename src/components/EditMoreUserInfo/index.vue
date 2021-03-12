<template>
  <div class="components EditMoreUserInfo">
    <div class="centerLabel">
      <div class="flex-h">
        <span class="flex-item">Improve personal information</span>
        <a class="iconfont iconguanbi" @click="$emit('Close')"></a>
      </div>
      <ul class="flex-h">
        <li class="flex-item">
          <div>
            <span>Nickname</span>
            <div>
              <input type="text" placeholder="Nickname" v-model="FormData.Nickname">
            </div>
          </div>
          <div>
            <span>Address</span>
            <div>
              <input type="text" placeholder="Address" v-model="FormData.Address">
            </div>
          </div>
          <div>
            <span>About me</span>
            <div>
              <textarea cols="30" rows="5" placeholder="Introduction" v-model="FormData.Introduction"></textarea>
            </div>
          </div>
        </li>
        <li class="flex-item">
          <div>
            <span>Gender</span>
            <div>
              <el-select class="MoreInfo" v-model="FormData.Sex" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in GenderList" :key="item.id" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div>
            <span>Country</span>
            <div>
              <el-select class="MoreInfo" v-model="FormData.Region" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in AreaList.FirstClass" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>
          <div>
            <span>Relationship status</span>
            <div>
              <el-select class="MoreInfo" v-model="FormData.Emotion" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in EmotionList" :key="item.id" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div>
            <span>D.O.B</span>
            <div class="flex-h">
              <div class="flex-item">
                <el-select class="MoreInfo" v-model="Year" placeholder="unselected" no-data-text="no data">
                  <el-option v-for="item in YearList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="flex-item">
                <el-select class="MoreInfo" v-model="Month" placeholder="unselected" no-data-text="no data">
                  <el-option v-for="item in MonthList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
              <div class="flex-item">
                <el-select class="MoreInfo" v-model="Day" placeholder="unselected" no-data-text="no data">
                  <el-option v-for="item in DayList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="Bottom">
        <a @click="ToUpdateUserInfo">{{DataLock ? 'Loading' : 'Enjoy Heyporn'}}</a>
        <a class="Jump" @click="$emit('Close')">Next</a>
      </div>
    </div>
  </div>
</template>

<script>
/*
  完善更多信息
*/
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import { Select, Option, Notification } from 'element-ui'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'EditMoreUserInfo',
  props: ['data'],
  data () {
    return {
      DataLock: false, // 数据锁
      EmotionList: [ // 情感状态字典
        { value: 'Single', id: '1' },
        { value: 'Not prefer to tell', id: '2' },
        { value: 'Married', id: '3' },
        { value: 'In a relationship', id: '4' }
      ],
      GenderList: [ // 性别字典
        // { value: 'Keep secret', id: '0' },
        { value: 'Male', id: '1' },
        { value: 'Female', id: '2' },
        { value: 'Not prefer to tell', id: '3' }
      ],
      YearList: [], // 年份列表
      MonthList: [], // 月份列表
      DayList: [], // 日列表
      FormData: { // 表单数据
        Nickname: null,
        Address: null,
        Introduction: null,
        Sex: null,
        Emotion: null,
        Region: null,
        Birthday: null
      }
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      AreaList: x => x.AreaList // 地区信息
    }),
    Year: { // 年份转换
      get: function () {
        return this.FormData.Birthday === null ? null : new Date(this.FormData.Birthday).getFullYear()
      },
      set: function (val) {
        this.FormData.Birthday = `${val}-01-01`
        this.Month = '01'
      }
    },
    Month: { // 月份转换
      get: function () {
        let month = this.FormData.Birthday === null ? null : new Date(this.FormData.Birthday).getMonth() + 1
        return month === null ? null : month > 9 ? month : '0' + month
      },
      set: function (val) {
        if (this.FormData.Birthday === null) {
          this.Year = new Date().getFullYear()
        }
        this.Day = '01'
        this.FormData.Birthday = `${this.Year}-${val}-01`
        this.DayListChange()
      }
    },
    Day: { // 日转换
      get: function () {
        let day = this.FormData.Birthday === null ? null : new Date(this.FormData.Birthday).getDate()
        return day === null ? null : day > 9 ? day : '0' + day
      },
      set: function (val) {
        if (this.FormData.Birthday === null) {
          let month = new Date().getMonth() + 1
          this.Year = new Date().getFullYear()
          this.Month = month > 9 ? month : '0' + month
        }
        this.FormData.Birthday = `${this.Year}-${this.Month}-${val}`
      }
    }
  },
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created () {
    this.Init() // 初始化
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetAreaList',
      'UpdateUserInfo',
      'GetUserInfoByToken'
    ]),
    Init () { // 初始化
      this.GetAreaList({ type: 1 })
      this.BirthdayDateInit()
    },
    ToUpdateUserInfo () { // 提交用户信息
      if (!this.DataLock) {
        this.DataLock = true
        this.UpdateUserInfo({
          data: {
            id: this.UserInfo.id,
            nick: this.FormData.Nickname,
            address: this.FormData.Address,
            description: this.FormData.Introduction,
            sex: this.FormData.Sex,
            country: this.FormData.Region,
            emotion: this.FormData.Emotion,
            birthday: this.FormData.Birthday
          }
        }).then(() => {
          this.GetUserInfoByToken({ params: { token: this.$localStorage.get('heypornid') } }) // 获取用户信息
          this.$notify.success({
            title: 'Save',
            message: 'User updated successfully!'
          })
          this.DataLock = false
          this.$emit('Close')
        }).catch(() => {
          this.DataLock = false
        })
      }
    },
    CheckForm () { // 校验表单
      if (this.FormData.Nickname === null) { // 昵称为空
        this.$notify.error({
          title: 'error',
          message: 'Nickname cannot be null!'
        })
        return false
      }
      if (this.FormData.Address === null) { // 地址为空
        this.$notify.error({
          title: 'error',
          message: 'Address cannot be null!'
        })
        return false
      }
      if (this.FormData.Introduction === null) { // 简介为空
        this.$notify.error({
          title: 'error',
          message: 'Introduction cannot be null!'
        })
        return false
      }
      if (this.FormData.Sex === null) { // 性别为空
        this.$notify.error({
          title: 'error',
          message: 'Gender cannot be null!'
        })
        return false
      }
      if (this.FormData.Region === null) { // 地区为空
        this.$notify.error({
          title: 'error',
          message: 'Region cannot be null!'
        })
        return false
      }
      if (this.FormData.Emotion === null) { // 情感状态为空
        this.$notify.error({
          title: 'error',
          message: 'Emotion cannot be null!'
        })
        return false
      }
      if (this.FormData.Birthday === null) { // 生日为空
        this.$notify.error({
          title: 'error',
          message: 'Birthday cannot be null!'
        })
        return false
      }
      return true
    },
    BirthdayDateInit () { // 出生日期初始化
      this.YearList = [] // 年份列表清空
      this.MonthList = [] // 月份列表清空
      this.DayList = [] // 日列表清空
      let CurrentYear = new Date().getFullYear() // 当前年份
      let DayNumMax = 0
      for (let n = CurrentYear - 60; n < CurrentYear + 1; n++) { // 构造年份列表
        this.YearList.push(n)
      }
      for (let n = 1; n < 13; n++) { // 构造月份列表
        this.MonthList.push(n > 9 ? n : '0' + n)
      }
      if (this.FormData.Birthday === '' || this.FormData.Birthday === null) {
        DayNumMax = 31
      } else {
        DayNumMax = new Date(new Date(`${this.Year}-${this.Month - 0 + 1}-01`).getTime() - 1).getDate()
      }
      for (let n = 1; n < DayNumMax + 1; n++) { // 构造日列表
        this.DayList.push(n > 9 ? n : '0' + n)
      }
    },
    DayListChange () { // 月份变化重构日列表
      this.DayList = [] // 日列表清空
      let LastDay = new Date(new Date(`${this.Year}-${this.Month - 0 + 1}-01`).getTime() - 1).getDate()
      for (let n = 1; n < LastDay + 1; n++) {
        this.DayList.push(n > 9 ? n : '0' + n)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
