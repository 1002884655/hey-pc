<template>
  <div class="components SgsStep3">
    <span>Fill the Form with Your Personal Details</span>
    <span>Your personal information will need to be approved in order to start earning money.This information will be confidential and securely used only for positioning purposes on our site. It will never be shared with anyone. You'll always be able to add more people as soon as your account gets approved.</span>
    <span class="Title">Personal information</span>
    <div class="Form">
      <div :class="{'active': IsCheck && Form.firstName === ''}">
        <span :class="{'active': IsCheck && Form.firstName === ''}">First name</span>
        <div>
          <input type="text" placeholder="Add the First name on your official document" v-model="Form.firstName">
        </div>
      </div>
      <div :class="{'active': IsCheck && Form.lastName === ''}">
        <span :class="{'active': IsCheck && Form.lastName === ''}">Last name</span>
        <div>
          <input type="text" placeholder="Add the Last name on your official document" v-model="Form.lastName">
        </div>
      </div>
      <div class="Date" :class="{'active': IsCheck && Form.birthday === ''}">
        <span :class="{'active': IsCheck && Form.birthday === ''}">Birthday</span>
        <div>
          <input type="text" v-model="Form.birthday">
          <!-- <span>{{birthday}}</span> -->
        </div>
      </div>
      <div :class="{'active': IsCheck && Form.cardNo === ''}">
        <span :class="{'active': IsCheck && Form.cardNo === ''}">ID number</span>
        <div>
          <input type="text" placeholder="Add the ID number on your official document" v-model="Form.cardNo">
        </div>
      </div>
      <div class="Select" :class="{'active': IsCheck && Form.country === ''}">
        <span :class="{'active': IsCheck && Form.country === ''}">ID Issuing Country</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.country" placeholder="Add country" no-data-text="no data">
            <el-option v-for="item in CountryList" :key="item.countryCode" :label="item.countryName" :value="item.countryCode"></el-option>
          </el-select>
        </div>
      </div>
      <div class="Select">
        <span>State/Province</span>
        <div>
          <!-- <el-select class="SgsSelect" v-model="Form.state" placeholder="Add State/Province" no-data-text="no data">
            <el-option v-for="item in StateList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
          <input type="text" placeholder="Add State/Province" v-model="Form.state">
        </div>
      </div>
      <div class="Select" :class="{'active': IsCheck && Form.city === ''}">
        <span :class="{'active': IsCheck && Form.city === ''}">City</span>
        <div>
          <!-- <el-select class="SgsSelect" v-model="Form.city" placeholder="Add city" no-data-text="no data">
            <el-option v-for="item in CityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select> -->
          <input type="text" placeholder="Add city" v-model="Form.city">
        </div>
      </div>
      <div class="InputHeightAuto" :class="{'active': IsCheck && Form.address === ''}">
        <span :class="{'active': IsCheck && Form.address === ''}">Address</span>
        <div>
          <el-input class="SgsHeightAutoInput" type="textarea" autosize placeholder="Add an introduction abour you" v-model="Form.address"></el-input>
        </div>
      </div>
    </div>
    <span class="Title">Document Upload</span>
    <div class="UploadForm">
      <span>Close-up photo of your ID.</span>
      <div>
        <a class="Btn" @click="$refs.IdFile.click()" v-if="IdFileUrl === '' || IdFileUrl === null">Upload File</a>
        <div class="Example" v-if="IdFileUrl !== '' && IdFileUrl !== null">
          <img :src="ShowExample1 ? Example1 : IdFileUrl" class="centerLabel cover" alt="">
          <a @click="$refs.IdFile.click()">Upload File</a>
        </div>
        <input type="file" style="display: none" hidden="hidden" ref="IdFile" accept="image/jpg, image/jpeg, image/png" @change="IdFileChange">
        <a @click="ShowExample1 = !ShowExample1">{{ShowExample1 ? 'Cancel' :'Show example'}}</a>
      </div>
      <span>photo of your hplding your ID and a handwritten note with your username and the current date.</span>
      <div>
        <a class="Btn" @click="$refs.IdHandFile.click()" v-if="IdHandFileUrl === '' || IdHandFileUrl === null">Upload File</a>
        <div class="Example" v-if="IdHandFileUrl !== '' && IdHandFileUrl !== null">
          <img :src="ShowExample2 ? Example2 : IdHandFileUrl" class="centerLabel cover" alt="">
          <a @click="$refs.IdHandFile.click()">Upload File</a>
        </div>
        <input type="file" style="display: none" hidden="hidden" ref="IdHandFile" accept="image/jpg, image/jpeg, image/png" @change="IdHandFileChange">
        <a @click="ShowExample2 = !ShowExample2">{{ShowExample2 ? 'Cancel' :'Show example'}}</a>
      </div>
      <a @click="Submit" :class="{'active': Form.firstName !== '' && Form.lastName !== '' && Form.birthday !== '' && Form.cardNo !== '' && Form.country !== '' && Form.city !== ''}">Request approval</a>
    </div>
  </div>
</template>

<script>
/*
*/
import { Select, Option, Input } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
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
    'el-input': Input
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
        this.IdFile = this.$refs.IdFile.files[0]
        this.IdFileUrl = this.GetFileURL(this.IdFile)
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
        this.IdHandFile = this.$refs.IdHandFile.files[0]
        this.IdHandFileUrl = this.GetFileURL(this.IdHandFile)
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
        this.ThirdSgs({ params: { ...this.Form, accountId: this.UserInfo.id, cardPic: this.IdFile === null ? this.CardPic : null, certPic: this.IdHandFile === null ? this.CertPic : null }, data: Data }).then(() => {
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
