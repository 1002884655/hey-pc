<template>
  <div class="components UserForMyInformation">

    <ScrollY Size="small">
      <div class="FormContainer">
        <span>Profile</span>

        <ul>

          <li class="flex-h">
            <span>Nickname:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your real name" v-model="EditInfo.nick">
              </div>
              <span class="TipsY">{{TipsData.Name}}</span>
            </div>
          </li>

          <li class="flex-h">
            <span>About me:</span>
            <div class="flex-item">
              <div>
                <textarea cols="30" rows="5" v-model="EditInfo.description"></textarea>
              </div>
            </div>
          </li>

          <li class="flex-h">
            <span>Address:</span>
            <div class="flex-item">
              <div>
                <textarea cols="30" rows="2" v-model="EditInfo.address"></textarea>
              </div>
            </div>
          </li>

          <li class="flex-h">
            <span>Gender:</span>
            <div class="flex-item">
              <el-select class="BigSelect" v-model="Sex" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in GenderList" :key="item.id" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </li>

          <li class="flex-h">
            <span>Country:</span>
            <div class="flex-item">
              <el-select class="SmallSelect" v-model="Country" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in AreaList.FirstClass" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <!-- <el-select class="SmallSelect" v-model="State" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in AreaList.SecondClass" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <el-select class="SmallSelect" v-model="City" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in AreaList.ThirdClass" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select> -->
            </div>
          </li>

          <li class="flex-h">
            <span>D.O.B:</span>
            <div class="flex-item">
              <el-select class="SmallSelect" v-model="Year" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in YearList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-select class="SmallSelect" v-model="Month" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in MonthList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-select class="SmallSelect" v-model="Day" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in DayList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div>
          </li>

          <li class="flex-h">
            <span>Relationship status:</span>
            <div class="flex-item">
              <el-select class="BigSelect" v-model="Emotion" placeholder="unselected" no-data-text="no data">
                <el-option v-for="item in EmotionList" :key="item.id" :label="item.value" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </li>

          <li class="flex-h" v-if="UserInfo.userType - 0 === 4">
            <span>Love:</span>
            <div class="flex-item">
              <el-select class="BigSelect" v-model="Love" placeholder="Keep secret" no-data-text="no data">
                <el-option v-for="item in LoveList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </li>

          <li class="flex-h" v-if="UserInfo.userType - 0 === 4">
            <span>Interests:</span>
            <div class="flex-item">
              <div>
                <el-select class="LabelSelect" v-model="Interests" multiple filterable allow-create default-first-option placeholder="You can enter your hobbies" no-data-text="Press enter to generate the label"></el-select>
              </div>
            </div>
          </li>

          <li class="flex-h" v-if="UserInfo.userType - 0 === 4">
            <span>Height:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your height" v-model="EditInfo.height">
              </div>
              <em>CM</em>
            </div>
            <span style="margin-left: 20px;">Weight:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your weight" v-model="EditInfo.weight">
              </div>
              <em>KG</em>
            </div>
            <span style="margin-left: 20px;">Measurements:</span>
            <div class="flex-item flex-h">
              <div class="flex-item">
                <input type="text" placeholder="breast" v-model="Woman3d[0]">
              </div>
              <span>-</span>
              <div class="flex-item">
                <input type="text" placeholder="waistline" v-model="Woman3d[1]">
              </div>
              <span>-</span>
              <div class="flex-item">
                <input type="text" placeholder="hipline" v-model="Woman3d[2]">
              </div>
            </div>
          </li>

        </ul>

        <ul>

          <li class="flex-h" v-if="UserInfo.userType - 0 === 4">
            <span>Company:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your company" v-model="EditInfo.company">
              </div>
            </div>
          </li>

          <li class="flex-h" v-if="UserInfo.userType - 0 === 4">
            <span>Home page:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your home page" v-model="EditInfo.domain">
              </div>
              <span class="TipsY">{{TipsData.HomePage}}</span>
            </div>
          </li>

          <li class="flex-h" v-if="UserInfo.userType - 0 === 4">
            <span>Facebook:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your facebook" v-model="EditInfo.facebook">
              </div>
              <span class="TipsY">{{TipsData.Facebook}}</span>
            </div>
          </li>

          <li class="flex-h" v-if="UserInfo.userType - 0 === 4">
            <span>Twitter:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your twitter" v-model="EditInfo.twitter">
              </div>
              <span class="TipsY">{{TipsData.Twitter}}</span>
            </div>
          </li>

        </ul>

        <!-- <ul>

          <li class="flex-h">
            <span>Email:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your school" v-model="EditInfo.email" disabled="disabled">
              </div>
            </div>
          </li>

          <li class="flex-h">
            <span>Mobile:</span>
            <div class="flex-item">
              <div>
                <input type="text" placeholder="You can enter your mobile" v-model="EditInfo.mobile">
              </div>
            </div>
          </li>

        </ul> -->

        <!-- 提交 -->
        <div class="SubmitForm">
          <a @click="SubmitForm">{{DataLock ? 'submitting...' : 'Save'}}</a>
        </div>
      </div>
    </ScrollY>

  </div>
</template>

<script>
/*
  我的信息
*/
import Vue from 'vue'
import { Select, Option, Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
import ImageCropping from '../ImageCropping'
import ScrollY from '../ScrollY'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'UserForMyInformation',
  props: ['data'],
  data () {
    return {
      Woman3d: ['', '', ''], // 明星三围
      ShowImageCropping: false, // 显隐图片裁剪组件
      EditInfo: null, // 可编辑用户信息
      IsEditNickName: false, // 显隐编辑昵称
      EditNickNameTips: null, // 编辑昵称报错提示
      GenderList: [ // 性别字典
        // { value: 'Keep secret', id: '0' },
        { value: 'Male', id: '1' },
        { value: 'Female', id: '2' },
        { value: 'Not prefer to tell', id: '3' }
      ],
      EmotionList: [ // 情感状态字典
        { value: 'Single', id: '1' },
        { value: 'Not prefer to tell', id: '2' },
        { value: 'Married', id: '3' },
        { value: 'In a relationship', id: '4' }
      ],
      YearList: [], // 年份列表
      MonthList: [], // 月份列表
      DayList: [], // 日列表
      CountryList: [], // 国家字典
      ProvinceList: [], // 省份字典
      CityList: [], // 城市字典
      DataLock: false, // 数据锁
      TipsData: { // 报错提示信息数据
        Name: null,
        HomePage: null,
        Facebook: null,
        Twitter: null
      }
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      AreaList: x => x.AreaList, // 地区信息
      LoveList: x => x.LoveList // 爱好信息
    }),
    Sex: { // 性别转换
      get: function () {
        return this.EditInfo.sex - 0 === 0 ? 'Keep secret' : this.EditInfo.sex - 0 === 1 ? 'Male' : this.EditInfo.sex - 0 === 2 ? 'Female' : 'Not prefer to tell'
      },
      set: function (val) {
        this.EditInfo.sex = val
      }
    },
    Year: { // 年份转换
      get: function () {
        return this.EditInfo.birthday === null ? null : new Date(this.EditInfo.birthday).getFullYear()
      },
      set: function (val) {
        this.EditInfo.birthday = `${val}-01-01`
        this.Month = '01'
      }
    },
    Month: { // 月份转换
      get: function () {
        let month = this.EditInfo.birthday === null ? null : new Date(this.EditInfo.birthday).getMonth() + 1
        return month === null ? null : month > 9 ? month : '0' + month
      },
      set: function (val) {
        if (this.EditInfo.birthday === null) {
          this.Year = new Date().getFullYear()
        }
        this.Day = '01'
        this.EditInfo.birthday = `${this.Year}-${val}-01`
        this.DayListChange()
      }
    },
    Day: { // 日转换
      get: function () {
        let day = this.EditInfo.birthday === null ? null : new Date(this.EditInfo.birthday).getDate()
        return day === null ? null : day > 9 ? day : '0' + day
      },
      set: function (val) {
        if (this.EditInfo.birthday === null) {
          let month = new Date().getMonth() + 1
          this.Year = new Date().getFullYear()
          this.Month = month > 9 ? month : '0' + month
        }
        this.EditInfo.birthday = `${this.Year}-${this.Month}-${val}`
      }
    },
    Country: { // 国家转换
      get: function () {
        return this.EditInfo.country
      },
      set: function (val) {
        this.EditInfo.country = val
        // this.GetAreaList({ type: 2, code: this.EditInfo.country }).then((res) => {
        //   if (res.data.code - 0 === 0) {
        //     this.State = this.AreaList.SecondClass[0].code
        //   }
        // })
        this.AreaList.FirstClass.map((item) => {
          if (item.code === val) {
            this.EditInfo.countryName = item.name
            return false
          }
        })
      }
    },
    State: { // 省份转换
      get: function () {
        return this.EditInfo.state
      },
      set: function (val) {
        this.EditInfo.state = val
        // this.GetAreaList({ type: 3, code: this.EditInfo.state }).then((res) => {
        //   if (res.data.code - 0 === 0) {
        //     this.City = this.AreaList.ThirdClass[0].code
        //   }
        // })
        // this.AreaList.SecondClass.map((item) => {
        //   if (item.code === val) {
        //     this.EditInfo.stateName = item.name
        //     return false
        //   }
        // })
      }
    },
    City: { // 城市转换
      get: function () {
        return this.EditInfo.city
      },
      set: function (val) {
        this.EditInfo.city = val
        // this.AreaList.ThirdClass.map((item) => {
        //   if (item.code === val) {
        //     this.EditInfo.cityName = item.name
        //     return false
        //   }
        // })
      }
    },
    Emotion: { // 情感状态转换
      get: function () {
        let name = null
        this.EmotionList.map((item) => {
          if (item.id - 0 === this.EditInfo.emotion - 0) {
            name = item.value
          }
        })
        return name
      },
      set: function (val) {
        this.EditInfo.emotion = val - 0
      }
    },
    Love: { // 喜好转换
      get: function () {
        let name = null
        if (this.EditInfo.love !== null) {
          this.LoveList.map((item) => {
            if (item.id - 0 === this.EditInfo.love - 0) {
              name = item.name
            }
          })
        }
        return name
      },
      set: function (val) {
        this.EditInfo.love = val
      }
    },
    Interests: { // 兴趣转换
      get: function () {
        return this.EditInfo.interest !== null && this.EditInfo.interest !== undefined ? this.EditInfo.interest.split(',') || [] : []
      },
      set: function (val) {
        this.EditInfo.interest = val.join(',') === '' ? null : val.join(',')
      }
    }
  },
  components: {
    'el-select': Select,
    'el-option': Option,
    ImageCropping,
    ScrollY
  },
  created () {
    if (this.UserInfo.userType - 0 === 4) {
      this.Woman3d = this.UserInfo.woman3d.split(',') || ['', '', '']
      this.EditInfo = { ...this.UserInfo, height: this.UserInfo.height === undefined ? null : this.UserInfo.height, weight: this.UserInfo.weight === undefined ? null : this.UserInfo.weight, woman3d: this.UserInfo.woman3d === undefined ? null : this.UserInfo.woman3d } // 复制用户信息
    } else {
      this.EditInfo = { ...this.UserInfo } // 复制用户信息
    }
    this.Init() // 初始化
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetAreaList',
      'GetUserLoveType',
      'UpdateUserInfo',
      'GetUserInfoByToken'
    ]),
    Init () { // 初始化
      this.AreaDataInit() // 地区信息初始化
      this.BirthdayDateInit() // 出生日期初始化
      this.GetUserLoveType() // 获取用户喜好类型
      if (this.EditInfo.emotion === '' || this.EditInfo.emotion === null) { // 情感状态为空时，默认赋值第一个
        this.Emotion = this.EmotionList[0].id
      }
    },
    ImageCroppingClose () {
      this.ShowImageCropping = false
      this.EditInfo.picPath1 = this.UserInfo.picPath1
      this.EditInfo.picPath2 = this.UserInfo.picPath2
      this.EditInfo.picPath3 = this.UserInfo.picPath3
    },
    EditNickName () { // 修改昵称
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定（防止多次触发）
        if (this.EditInfo.name === null || this.EditInfo.name === '') { // 昵称为空
          this.EditNickNameTips = 'Nicknames cannot be empty.'
          this.DataLock = false // 数据解锁
          return false
        } else {
          this.EditNickNameTips = null
        }
        this.UpdateUserInfo({ data: { ...this.EditInfo } }).then((res) => { // 提交用户信息
          this.$notify.success({
            title: 'Save',
            message: res.data.msg
          })
          this.GetUserInfoByToken({ params: { token: this.$localStorage.get('heypornid') } }) // 获取用户信息
          this.IsEditNickName = false
          this.DataLock = false // 数据解锁
        }).catch(() => {
          this.DataLock = false // 数据解锁
        })
      }
    },
    FormCheck () { // 表单验证
      let CheckStatus = true
      if (this.EditInfo.nick !== '' && this.EditInfo.nick !== null && this.EditInfo.nick.indexOf(' ') !== -1) { // 姓名不能含有空格字符串
        this.TipsData.Name = 'Names must not contain space characters.'
        CheckStatus = false
      } else {
        this.TipsData.Name = null
      }
      if (this.EditInfo.domain !== '' && this.EditInfo.domain !== null && !this.ToolClass.CheckUrl(this.EditInfo.domain)) { // 主页地址格式错误
        this.TipsData.HomePage = 'Home page address format error.'
        CheckStatus = false
      } else {
        this.TipsData.HomePage = null
      }
      if (this.EditInfo.facebook !== '' && this.EditInfo.facebook !== null && !this.ToolClass.CheckUrl(this.EditInfo.facebook)) { // 主页地址格式错误
        this.TipsData.Facebook = 'Facebook address format error.'
        CheckStatus = false
      } else {
        this.TipsData.Facebook = null
      }
      if (this.EditInfo.twitter !== '' && this.EditInfo.twitter !== null && !this.ToolClass.CheckUrl(this.EditInfo.twitter)) { // 主页地址格式错误
        this.TipsData.Twitter = 'Twitter address format error.'
        CheckStatus = false
      } else {
        this.TipsData.Twitter = null
      }
      return CheckStatus
    },
    SubmitForm () { // 提交数据
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定（防止多次触发）
        if (!this.FormCheck()) { // 表单验证
          this.DataLock = false // 数据解锁
          return false
        }
        this.EditInfo.state = null
        this.EditInfo.city = null
        this.EditInfo.woman3d = this.Woman3d.join(',')
        this.UpdateUserInfo({ data: { ...this.EditInfo } }).then((res) => { // 提交用户信息
          this.GetUserInfoByToken({ params: { token: this.$localStorage.get('heypornid') } }) // 获取用户信息
          this.$notify.success({
            title: 'Save',
            message: 'User updated successfully!'
          })
          this.DataLock = false // 数据解锁
        }).catch(() => {
          this.DataLock = false // 数据解锁
        })
      }
    },
    AreaDataInit () { // 地区信息初始化
      this.GetAreaList({ type: 1 }).then((res) => { // 获取一级地区列表
        if (res.data.code - 0 === 0) {
          if (this.EditInfo.country === '' || this.EditInfo.country === null) { // 用户国家信息为空时默认赋值第一个
            this.EditInfo.country = this.AreaList.FirstClass[0].code
            this.AreaList.FirstClass.map((item) => {
              if (item.code === this.EditInfo.country) {
                this.EditInfo.countryName = item.name
              }
            })
          }
          // this.GetAreaList({ type: 2, code: this.EditInfo.country }).then((res) => { // 获取二级地区列表
          //   if (res.data.code - 0 === 0) {
          //     if (this.EditInfo.state === '' || this.EditInfo.state === null) { // 用户省份信息为空时默认赋值第一个
          //       this.EditInfo.state = this.AreaList.SecondClass[0].code
          //       this.AreaList.SecondClass.map((item) => {
          //         if (item.code === this.EditInfo.state) {
          //           this.EditInfo.stateName = item.name
          //         }
          //       })
          //     }
          //     this.GetAreaList({ type: 3, code: this.EditInfo.state }).then((res) => { // 获取三级地区列表
          //       if (res.data.code - 0 === 0) {
          //         if (this.EditInfo.city === '' || this.EditInfo.city === null) { // 用户城市信息为空时默认赋值第一个
          //           this.EditInfo.city = this.AreaList.ThirdClass[0].code
          //           this.AreaList.ThirdClass.map((item) => {
          //             if (item.code === this.EditInfo.city) {
          //               this.EditInfo.cityName = item.name
          //             }
          //           })
          //         }
          //       }
          //     })
          //   }
          // })
        }
      })
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
      if (this.EditInfo.birthday === '' || this.EditInfo.birthday === null) {
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
    },
    CancelEditNickName () { // 取消编辑昵称
      this.EditInfo.name = this.UserInfo.name
      this.IsEditNickName = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
