<template>
  <div class="components SgsStep2">
    <span>Complete Your Profile Details</span>
    <span>It’s time to let your fans get to know you better! Please complete all the required information which will be shown on your profile page.</span>
    <div class="Form">
      <div class="Select" :class="{'active': IsCheck && Form.gender === null}">
        <span :class="{'active': IsCheck && Form.gender === null}">Gende</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.gender" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForGender" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Select" :class="{'active': IsCheck && Form.interested === null}">
        <span :class="{'active': IsCheck && Form.interested === null}">Intersed in</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.interested" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForInterset" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Select" :class="{'active': IsCheck && Form.language === null}">
        <span :class="{'active': IsCheck && Form.language === null}">Languages</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.language" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForLanguages" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Select" :class="{'active': IsCheck && Form.bodyType === null}">
        <span :class="{'active': IsCheck && Form.bodyType === null}">Body type</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.bodyType" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForBodyType" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Select" :class="{'active': IsCheck && Form.ethnicity === null}">
        <span :class="{'active': IsCheck && Form.ethnicity === null}">Ethnicity</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.ethnicity" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForEthnicity" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Select">
        <span>Specifics(Optional)</span>
        <div>
          <el-select class="SgsSelect" multiple v-model="Form.specifics" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForSpecifics" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Select">
        <span>Hair color(Optional)</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.hairColor" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForHairColor" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Select">
        <span>Eyes color(Optional)</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.eyeColor" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForEyesColor" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Select">
        <span>Subculture(Optional)</span>
        <div>
          <el-select class="SgsSelect" v-model="Form.subculture" placeholder="Please select" no-data-text="no data">
            <el-option v-for="item in DictForSubculture" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="InputHeightAuto">
        <span>About me(Optional)</span>
        <div>
          <el-input class="SgsHeightAutoInput" type="textarea" autosize placeholder="Add an introduction abour you" v-model="Form.aboutMe"></el-input>
        </div>
      </div>
    </div>
    <a :class="{'active': Form.gender !== null && Form.interested !== null && Form.language !== null && Form.bodyType !== null && Form.ethnicity !== null}" @click="Submit">Next</a>
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
  name: 'SgsStep2',
  props: {
    SgsType: {
      default: null,
      type: Number
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
      DataLock: false,
      Form: {
        aboutMe: '',
        gender: null,
        interested: null,
        language: null,
        bodyType: null,
        ethnicity: null,
        specifics: [],
        hairColor: null,
        eyeColor: null,
        subculture: null
      },
      IsCheck: false,
      DictForGender: [ // 性别字典
        { name: 'Keep secret', value: 0 },
        { name: 'Man', value: 1 },
        { name: 'Woman', value: 2 },
        { name: 'Unknown', value: 3 }
      ],
      DictForInterset: [], // 爱好字典
      DictForBodyType: [], // 身材类型字典
      DictForEthnicity: [], // 种族字典
      DictForSpecifics: [], // 特长字典
      DictForHairColor: [], // 发色字典
      DictForEyesColor: [], // 眼睛色字典
      DictForSubculture: [], // 职业字典
      DictForLanguages: [] // 语言字典
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
      'SecondSgs'
    ]),
    Init () {
      for (let key in this.Form) {
        if (this.SgsInfo[key] && key !== 'specifics') {
          this.Form[key] = this.SgsInfo[key]
        }
      }
      if (this.SgsInfo.specifics !== '') {
        this.Form.specifics = this.SgsInfo.specifics.split(',')
      }
      this.GetSgsDictList().then((res) => { // 获取认证字典列表
        let ResData = res.data.data || {}
        this.DictForInterset = ResData.Interested
        this.DictForBodyType = ResData.Body_type
        this.DictForEthnicity = ResData.Ethnicity
        this.DictForSpecifics = ResData.Specifics
        this.DictForHairColor = ResData['Hair color']
        this.DictForEyesColor = ResData['Eye color']
        this.DictForSubculture = ResData.Subculture
        this.DictForLanguages = ResData.Language
      })
    },
    CheckForm () {
      this.IsCheck = true
      let Bool = true
      if (this.Form.gender === null) {
        Bool = false
      }
      if (this.Form.interested === null) {
        Bool = false
      }
      if (this.Form.language === null) {
        Bool = false
      }
      if (this.Form.bodyType === null) {
        Bool = false
      }
      if (this.Form.ethnicity === '') {
        Bool = false
      }
      return Bool
    },
    Submit () {
      if (this.CheckForm() && !this.DataLock) {
        this.DataLock = true
        this.SecondSgs({ data: { ...this.Form, accountId: this.UserInfo.id, specifics: this.Form.specifics.join(',') } }).then(() => {
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
