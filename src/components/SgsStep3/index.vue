<template>
  <div class="components SgsStep3">
    <span>Fill the Form with Your Personal Details</span>
    <span>Your personal information will need to be approved in order to start earning money.This information will be confidential and securely used only for positioning purposes on our site. It will never be shared with anyone. You'll always be able to add more people as soon as your account gets approved.</span>
    <div class="Tips" v-if="SgsInfo.certRemark !== ''">
      <span class="Tips">{{SgsInfo.certRemark}}</span>
    </div>
    <span class="Title">Personal information</span>
    <div class="Form">
      <div :class="{'active': IsCheck && Form.firstName === ''}">
        <span :class="{'active': IsCheck && Form.firstName === ''}">First name</span>
        <div>
          <input type="text" placeholder="Add the First name on your official document" v-model="Form.firstName">
        </div>
        <span class="Tips" v-if="IsCheck && Form.firstName === ''">this is required</span>
      </div>
      <div :class="{'active': IsCheck && Form.lastName === ''}">
        <span :class="{'active': IsCheck && Form.lastName === ''}">Last name</span>
        <div>
          <input type="text" placeholder="Add the Last name on your official document" v-model="Form.lastName">
        </div>
        <span class="Tips" v-if="IsCheck && Form.lastName === ''">this is required</span>
      </div>
      <div class="Date" :class="{'active': IsCheck && Form.birthday === ''}">
        <span :class="{'active': IsCheck && Form.birthday === ''}">Birthday</span>
        <div>
          <el-date-picker class="SgsDateSelect" v-model="Form.birthday" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
        </div>
        <span class="Tips" v-if="IsCheck && Form.birthday === ''">this is required</span>
      </div>
      <div :class="{'active': IsCheck && Form.cardNo === ''}">
        <span :class="{'active': IsCheck && Form.cardNo === ''}">ID number</span>
        <div>
          <input type="text" placeholder="Add the ID number on your official document" v-model="Form.cardNo">
        </div>
        <span class="Tips" v-if="IsCheck && Form.cardNo === ''">this is required</span>
      </div>
      <div class="Select" :class="{'active': IsCheck && Form.country === ''}">
        <span :class="{'active': IsCheck && Form.country === ''}">ID Issuing Country</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.country" placeholder="Add country" no-data-text="no data">
            <el-option v-for="item in CountryList" :key="item.countryCode" :label="item.countryName" :value="item.countryCode"></el-option>
          </el-select>
        </div>
        <span class="Tips" v-if="IsCheck && Form.country === ''">this is required</span>
      </div>
      <div class="Select">
        <span>State/Province</span>
        <div>
          <input type="text" placeholder="Add State/Province" v-model="Form.state">
        </div>
      </div>
      <div class="Select" :class="{'active': IsCheck && Form.city === ''}">
        <span :class="{'active': IsCheck && Form.city === ''}">City</span>
        <div>
          <input type="text" placeholder="Add city" v-model="Form.city">
        </div>
      </div>
      <div class="InputHeightAuto" :class="{'active': IsCheck && Form.address === ''}">
        <span :class="{'active': IsCheck && Form.address === ''}">Address</span>
        <div>
          <el-input class="SgsHeightAutoInput" type="textarea" autosize placeholder="Add an introduction abour you" v-model="Form.address"></el-input>
        </div>
        <span class="Tips" v-if="IsCheck && Form.address === ''">this is required</span>
      </div>
    </div>
    <span class="Title">Document Upload</span>
    <div class="UploadForm">
      <span>Close-up photo of your ID.</span>
      <div>
        <a class="Btn" @click="$refs.IdFile.click()" v-if="(IdFileUrl === '' || IdFileUrl === null) && !IsUploading1">Upload File</a>
        <div class="Example" v-if="(IdFileUrl !== '' && IdFileUrl !== null) || IsUploading1">
          <img :src="IsUploading1 ? null : ShowExample1 ? Example1 : IdFileUrl" class="centerLabel cover" alt="">
          <span class="centerLabel" v-if="IsUploading1">loading...</span>
          <a @click="$refs.IdFile.click()" v-if="!IsUploading1">Upload File</a>
        </div>
        <input type="file" style="display: none" hidden="hidden" ref="IdFile" accept="image/jpg, image/jpeg, image/png" @change="IdFileChange">
        <a @click="ShowExample1 = !ShowExample1">{{ShowExample1 ? 'Cancel' :'Show example'}}</a>
      </div>
      <span>photo of your hplding your ID and a handwritten note with your username and the current date.</span>
      <div>
        <a class="Btn" @click="$refs.IdHandFile.click()" v-if="(IdHandFileUrl === '' || IdHandFileUrl === null) && !IsUploading2">Upload File</a>
        <div class="Example" v-if="(IdHandFileUrl !== '' && IdHandFileUrl !== null) || IsUploading2">
          <img :src="IsUploading2 ? null : ShowExample2 ? Example2 : IdHandFileUrl" class="centerLabel cover" alt="">
          <span class="centerLabel" v-if="IsUploading2">loading...</span>
          <a @click="$refs.IdHandFile.click()" v-if="!IsUploading2">Upload File</a>
        </div>
        <input type="file" style="display: none" hidden="hidden" ref="IdHandFile" accept="image/jpg, image/jpeg, image/png" @change="IdHandFileChange">
        <a @click="ShowExample2 = !ShowExample2">{{ShowExample2 ? 'Cancel' :'Show example'}}</a>
      </div>
      <a @click="Submit" :class="{'active': !DataLock}">{{DataLock ? 'Loading...' : 'Request approval'}}</a>
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
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapSgsActions } = createNamespacedHelpers('sgs')
export default {
  name: 'SgsStep3',
  props: {
    SgsInfo: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      IsUploading1: false,
      IsUploading2: false,
      Example1: null,
      Example2: null,
      ShowExample1: false,
      ShowExample2: false,
      IsCheck: false,
      DataLock: false,
      IdFile: null,
      IdFileUrl: null,
      IdHandFile: null,
      IdHandFileUrl: null,
      Form: {
        firstName: '',
        lastName: '',
        birthday: '',
        cardNo: '',
        country: '',
        state: '',
        city: '',
        address: ''
      },
      CountryList: [],
      StateList: [],
      CityList: []
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
    ...mapSgsActions([
      'GetSgsDictList',
      'GetCountryList',
      'ThirdSgs'
    ]),
    Init () {
      for (let key in this.Form) {
        if (this.SgsInfo[key]) {
          this.Form[key] = this.SgsInfo[key]
        }
      }
      this.Example1 = this.SgsInfo.example1
      this.Example2 = this.SgsInfo.example2
      this.IdFileUrl = this.SgsInfo.cardPicPath
      this.IdHandFileUrl = this.SgsInfo.certPicPath
      this.CardPic = this.SgsInfo.cardPic
      this.CertPic = this.SgsInfo.certPic
      this.GetCountryList().then((res) => {
        this.CountryList = res.data.data || []
      })
    },
    IdFileChange () {
      if (this.$refs.IdFile.files[0].size <= 5 * 1024 * 1024) {
        this.ShowExample1 = false
        this.IsUploading1 = true
        this.IdFile = this.$refs.IdFile.files[0]
        this.IdFileUrl = this.GetFileURL(this.IdFile)
        this.IsUploading1 = false
      } else {
        this.$refs.IdFile.files[0].value = ''
        this.$notify.error({
          title: 'error',
          message: 'Single picture cannot be more than 5mb!'
        })
      }
    },
    IdHandFileChange () {
      if (this.$refs.IdHandFile.files[0].size <= 5 * 1024 * 1024) {
        this.ShowExample2 = false
        this.IsUploading2 = true
        this.IdHandFile = this.$refs.IdHandFile.files[0]
        this.IdHandFileUrl = this.GetFileURL(this.IdHandFile)
        this.IsUploading2 = false
      } else {
        this.$refs.IdHandFile.files[0].value = ''
        this.$notify.error({
          title: 'error',
          message: 'Single picture cannot be more than 5mb!'
        })
      }
    },
    GetFileURL (file) { // 获取file文件本地地址
      let GetUrl = null
      if (window.createObjectURL !== undefined) {
        GetUrl = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        GetUrl = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        GetUrl = window.webkitURL.createObjectURL(file)
      }
      return GetUrl
    },
    CheckForm () {
      this.IsCheck = true
      return this.Form.firstName !== '' && this.Form.lastName !== '' && this.Form.birthday !== '' && this.Form.cardNo !== '' && this.Form.country !== '' && this.Form.city !== '' && ((this.IdFile !== '' && this.IdFile !== null) || (this.CardPic !== null)) && ((this.IdHandFile !== '' && this.IdHandFile !== null) || (this.CertPic !== null))
    },
    Submit () {
      if (this.CheckForm() && !this.DataLock) {
        this.DataLock = true
        let FileData = new FormData()
        if (this.IdFile !== null) {
          FileData.append('onePic', this.IdFile)
        }
        if (this.IdHandFile !== null) {
          FileData.append('twoPic', this.IdHandFile)
        }
        let Data = null
        if (this.IdFile !== null || this.IdHandFile !== null) {
          Data = FileData
        }
        this.ThirdSgs({ params: { ...this.Form, birthday: new Date(this.Form.birthday), accountId: this.UserInfo.id, cardPic: this.IdFile === null ? this.CardPic : null, certPic: this.IdHandFile === null ? this.CertPic : null }, data: Data }).then(() => {
          this.DataLock = false
          this.$emit('Success')
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
