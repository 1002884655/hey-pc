<template>
  <div class="components SettingForProfile">
    <div class="Form">
      <div class="Line">
        <span>Username</span>
        <div>
          <input type="text" placeholder="Username" v-model="FromData.name">
        </div>
      </div>
      <div class="Line">
        <span>Display name</span>
        <div>
          <input type="text" placeholder="Display name" v-model="FromData.nick">
        </div>
      </div>
      <div class="Line">
        <span>About me (Optional)</span>
        <div>
          <el-input v-model="FromData.aboutMe" class="SettingAutoInput" type="textarea" autosize placeholder="Add an introduction abour you"></el-input>
        </div>
      </div>
      <div class="Line">
        <span>Facebook</span>
        <div>
          <input type="text" placeholder="Add your Facebook" v-model="FromData.facebook">
        </div>
      </div>
      <div class="Line">
        <span>Twitter</span>
        <div>
          <input type="text" placeholder="Add your Twitter" v-model="FromData.twitter">
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Gende</span>
        <div>
          <el-select v-model="FromData.gender" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in GenderList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Intersed in</span>
        <div>
          <el-select v-model="FromData.interest" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in IntersedList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Languages</span>
        <div>
          <el-select v-model="FromData.language" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in LanguagesList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Body type</span>
        <div>
          <el-select v-model="FromData.bodyType" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in BodyTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Ethnicity</span>
        <div>
          <el-select v-model="FromData.ethnicity" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in EthnicityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Specifics(Optional)</span>
        <div>
          <el-select v-model="FromData.specifics" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in SpecificsList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Hair color(Optional)</span>
        <div>
          <el-select v-model="FromData.hairColor" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in HairColorList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Eyes color(Optional)</span>
        <div>
          <el-select v-model="FromData.eyeColor" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in EyesColorList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line" v-if="UserInfo.userType - 0 !== 1">
        <span>Subculture(Optional)</span>
        <div>
          <el-select v-model="FromData.subculture" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in SubcultureList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <span class="Tips" v-if="UserInfo.userType - 0 !== 1">The following information is self-visible and cannot be modified</span>
    <div class="Form" v-if="UserInfo.userType - 0 !== 1">
      <div class="Line">
        <span>First name</span>
        <div>
          <input disabled v-model="FromData.firstName" type="text" placeholder="Add the First name on your official document">
        </div>
      </div>
      <div class="Line">
        <span>Last name</span>
        <div>
          <input disabled v-model="FromData.lastName" type="text" placeholder="Add the Last name on your official document">
        </div>
      </div>
      <div class="Line">
        <span>Birthday</span>
        <div>
          <el-date-picker disabled v-model="FromData.birthday" class="SettingDateSelect" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
        </div>
      </div>
      <div class="Line">
        <span>ID number</span>
        <div>
          <input disabled v-model="FromData.cardNo" type="text" placeholder="Add the ID number on your official document">
        </div>
      </div>
      <div class="Line">
        <span>ID Issuing Country</span>
        <div>
          <el-select disabled v-model="FromData.country" class="SettingSelect" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in CountryList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Line">
        <span>State/Province</span>
        <div>
          <input disabled v-model="FromData.state" type="text" placeholder="Add State/Province">
        </div>
      </div>
      <div class="Line">
        <span>City</span>
        <div>
          <input disabled v-model="FromData.name" type="text" placeholder="Add city">
        </div>
      </div>
      <div class="Line">
        <span>Address</span>
        <div>
          <input disabled v-model="FromData.city" type="text" placeholder="Add address">
        </div>
      </div>
    </div>
    <div class="Form">
      <div class="Line" style="border: none; background: none;">
        <a class="active" :class="{'active': !DataLock}" @click="EditInfo">{{DataLock ? 'Loading...' : 'Save'}}</a>
      </div>
    </div>
  </div>
</template>

<script>
/*
*/
import { Select, Option, Input, DatePicker } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { createNamespacedHelpers } from 'vuex'
locale.use(lang)
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapActions: mapSgsActions } = createNamespacedHelpers('sgs')
const { mapActions: mapSettingActions } = createNamespacedHelpers('setting')
export default {
  name: 'SettingForProfile',
  props: ['data'],
  data () {
    return {
      FromData: {
        name: '',
        nick: '',
        aboutMe: '',
        facebook: '',
        twitter: '',
        gender: '',
        interest: '',
        birthday: '',
        language: '',
        bodyType: '',
        ethnicity: '',
        specifics: '',
        hairColor: '',
        eyeColor: '',
        subculture: '',
        firstName: '',
        lastName: '',
        cardNo: '',
        country: '',
        state: '',
        city: '',
        address: ''
      },
      DataLock: false,
      SgsInfo: {},
      CountryList: [],
      SubcultureList: [],
      EyesColorList: [],
      HairColorList: [],
      SpecificsList: [],
      EthnicityList: [],
      BodyTypeList: [],
      LanguagesList: [],
      IntersedList: [],
      GenderList: [ // 性别字典
        { name: 'Keep secret', value: 0 },
        { name: 'Man', value: 1 },
        { name: 'Woman', value: 2 },
        { name: 'Unknown', value: 3 }
      ]
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-input': Input,
    'el-date-picker': DatePicker
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
      ''
    ]),
    ...mapUserMutations([
      'EditUserInfo'
    ]),
    ...mapSgsActions([
      'GetSgsDictList',
      'GetSgsInfo'
    ]),
    ...mapSettingActions([
      'GetAuthInfo',
      'ChangeAuthInfo'
    ]),
    Init () {
      this.GetSgsDictList().then((res) => { // 获取认证字典列表
        let ResData = res.data.data || {}
        this.IntersedList = ResData.Interested
        this.BodyTypeList = ResData.Body_type
        this.EthnicityList = ResData.Ethnicity
        this.SpecificsList = ResData.Specifics
        this.HairColorList = ResData.Hair_color
        this.EyesColorList = ResData.Eye_color
        this.SubcultureList = ResData.Subculture
        this.LanguagesList = ResData.Language
      })
      this.GetAuthInfo({ params: { accountId: this.UserInfo.id } }).then((res) => {
        this.SgsInfo = { ...this.SgsInfo, ...res.data.data }
        for (let key in this.FromData) {
          if (this.SgsInfo[key]) {
            this.FromData[key] = this.SgsInfo[key]
          } else if (this.UserInfo[key]) {
            this.FromData[key] = this.UserInfo[key]
          }
        }
      })
    },
    EditInfo () {
      if (!this.DataLock) {
        this.DataLock = true
        console.log(JSON.stringify({ ...this.FromData, accountId: this.UserInfo.id }))
        this.ChangeAuthInfo({ data: { ...this.FromData, accountId: this.UserInfo.id } }).then(() => {
          for (let key in this.FromData) {
            if (this.UserInfo[key]) {
              this.EditUserInfo({ name: key, value: this.FromData[key] })
            }
          }
          this.$notify.success({
            title: 'success',
            message: 'The user info has been modified'
          })
          this.DataLock = false
        }).catch((res) => {
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.DataLock = false
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
