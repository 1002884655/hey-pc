<template>
  <div class="components UploadForVideo">

    <ul>

      <!-- 添加视频文件（限单个视频上传） -->
      <li v-if="this.ToolClass.GetUrlParams('key') === false">
        <span class="Title"><b>Add video</b><em> (.mp4,.ts,.mpg,.3gp,.flv,.mkv,.vob,.webm,.wmv,.avi,.mov,.mpeg,.mxf)</em></span>
        <div>
          <video v-if="CheckUrl !== null" style="display: none;" @canplaythrough="GetVideoTimes">
            <source :src="CheckUrl" type="video/mp4">
          </video>
          <div class="VideoPreview" v-if="LocalUrl !== null">
            <div>
              <div>
                <div>
                  <video style="width: 100%; height: 100%">
                    <source :src="LocalUrl" type="video/mp4">
                  </video>
                </div>
              </div>
            </div>
            <a class="iconfont iconqingkong" @click="ToEmptyVideoData"></a>
          </div>
          <div class="UploadProgress" v-show="OnUpload">
            <div class="Line">
              <div :style="{width: UploadWidth}"></div>
            </div>
            <div class="Info">
              <span>Upload speed {{UploadSpeed}}kb/s</span>
              <span>Video size {{(UploadRate * FileSize).toFixed(2)}}MB/{{FileSize}}MB</span>
            </div>
          </div>
          <a class="AddFile" @click="SelectVideo" v-if="!OnUpload && UploadInfo.VideoId === null">
            <i class="iconfont iconjia"></i>
            <span>Add video</span>
          </a>
          <input type="file" ref="HideFileForVideo" hidden @change="FileChange" accept=".mp4,.ts,.mpg,.3gp,.flv,.mkv,.vob,.webm,.wmv,.avi,.mov,.mpeg,.mxf">
        </div>
      </li>

      <!-- 标题 -->
      <li>
        <span class="Title"><b>VIDEO DETAILS</b></span>
        <span class="Title"><b class="star">*</b> Video Title</span>
        <div>
          <input type="text" v-model="UploadInfo.Title" placeholder="Add a title" @input="UploadInfo.Title = UploadInfo.Title.substring(0, 80)">
        </div>
      </li>

      <!-- 简介 -->
      <li>
        <span class="Title">Description</span>
        <div>
          <textarea cols="30" rows="5" v-model="UploadInfo.Desc" placeholder="tell viewers about your video" @input="UploadInfo.Desc = UploadInfo.Desc.substring(0, 256)"></textarea>
        </div>
      </li>

      <!-- 分类 -->
      <li>
        <span class="Title"><b class="star">*</b> Category</span>
        <div>
          <div class="ClassInput flex-h">
            <div class="flex-item">
              <span v-if="!UploadInfo.Class.length">Select video category</span>
              <a v-for="(item, index) in UploadInfo.Class" :key="index">{{item.name}} <i class="iconfont iconguanbi" @click="DeleteClassItem(item, index)"></i></a>
            </div>
            <a class="iconfont iconjiantouup" @click="ShowClassList = !ShowClassList" v-if="ShowClassList"></a>
            <a class="iconfont iconjiantoudown" @click="ShowClassList = !ShowClassList" v-else></a>
          </div>
          <div class="ClassList" v-show="ShowClassList">
            <a v-for="(item, index) in ServiceTypeList" :key="index" :class="{'active': item.active}" @click="CutTypesItem(item, index)">{{item.name}}</a>
          </div>
        </div>
      </li>

      <!-- 标签 -->
      <li>
        <span class="Title"><b class="star">*</b> Tags</span>
        <div>
          <el-select class="LabelSelect" v-model="Labels" multiple filterable allow-create default-first-option placeholder="Press enter to generate the tags" no-data-text="Each label has a maximum of 30 characters"></el-select>
        </div>
      </li>

      <!-- 专辑 -->
      <li>
        <span class="Title">Album</span>
        <div>
          <el-select style="width: 300px;" v-model="UploadInfo.Album" placeholder="select" no-data-text="no data">
            <el-option v-for="item in VideoAlbumList" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left;">{{ item.name }}</span>
              <span style="float: right;">{{ item.videoNum }}</span>
            </el-option>
          </el-select>
        </div>
      </li>

      <!-- 动态内容 -->
      <li v-if="this.ToolClass.GetUrlParams('key') === false">
        <span class="Title">Dynamic</span>
        <div>
          <textarea cols="30" rows="5" v-model="UploadInfo.Dynamic" @input="UploadInfo.Dynamic = UploadInfo.Dynamic.substring(0, 280)" placeholder="I posted a video, come and watch"></textarea>
        </div>
      </li>

      <!-- 隐私设置 -->
      <li>
        <span class="Title">Visiblity</span>
        <div>
          <el-select style="width: 300px;" v-model="UploadInfo.Privacy">
            <el-option v-for="item in PrivacyList" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </li>

      <!-- 来源设置 -->
      <li>
        <span class="Title">Source</span>
        <div>
          <el-select style="width: 300px;" v-model="UploadInfo.Original" @change="OriginalChange">
            <el-option v-for="item in OriginalList" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
          <a v-if="UploadInfo.Original === 0" class="iconfont" :class="[AgreeOriginal ? 'icongouxuan active' : 'iconweigouxuan']" @click="AgreeOriginal = !AgreeOriginal"></a>
          <span v-if="UploadInfo.Original === 0" class="Tips">Agree to the original agreement</span>
        </div>
      </li>

      <!-- 金额 -->
      <li v-if="UploadInfo.Original === 0">
        <span class="Title">Video payment</span>
        <span class="Title" style="color: #999;">{{IsNoFree ? 'Close' : 'Open'}} payment <el-switch style="margin-left: 20px;" v-model="IsNoFree" active-color="#13ce66" inactive-color="#ff4949"></el-switch></span>
        <div v-if="IsNoFree">
          <input style="width: 300px;" type="text" v-model="UploadInfo.Price" :placeholder="`Set the price range of paid video ${MinPrice}-${MaxPrice}`">
          <a class="iconfont" :class="[AgreePrice ? 'icongouxuan active' : 'iconweigouxuan']" @click="AgreePrice = !AgreePrice"></a>
          <span class="Tips">Agree to the paid video agreement</span>
        </div>
      </li>

    </ul>

    <!-- 申明 -->
    <!-- <span class="BottomState">Once uploaded, it means that you upload content and everyone in the video agrees to upload the video to HeyPorn, and that you have read and accepted HeyPorn's <a>&lt;Terms of Service&gt;</a></span> -->

    <!-- 协议 -->
    <div class="Agreement flex-h">
      <a class="iconfont" :class="[Agree ? 'icongouxuan active' : 'iconweigouxuan']" @click="Agree = !Agree"></a>
      <span class="flex-item">I have obtained the valid consent from all individuals that appear in this content and confirm that they were over 18 years of age at the time the content was produced. I also certify that the content being uploaded does not violate HeyPorn's <a href="./T&C.html" target="_self">T&C</a>, Read more about our <a href="./privacy.html" target="_self">policies and guidelines.</a></span>
    </div>

    <!-- 发布按钮 -->
    <a class="PostBtn" @click="SubmitForm" :class="{'active': UploadInfo.VideoId !== null && UploadInfo.Title !== '' && UploadInfo.Class.length && Agree}">Upload</a>

  </div>
</template>

<script>
/*
  页面名称：视频上传组件
  创建人：许成祥
  创建时间：2020/04/20
  最近修改人：许成祥
  最近修改日期：2020/05/14
  备注： 无
*/
import Vue from 'vue'
import { Select, Option, Notification, Switch } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
const { mapState: mapMediaState, mapActions: mapMediaActions } = createNamespacedHelpers('media')
export default {
  name: 'UploadForVideo',
  props: ['data'],
  data () {
    return {
      MinPrice: 0,
      MaxPrice: 0,
      IsNoFree: false,
      AgreePrice: false,
      AgreeOriginal: false,
      Agree: false,
      CheckUrl: null, // 检测时长url
      CenterDialogVisible: true,
      FunOff: true,
      OnUpload: false, // 是否在上传
      CurrentTimeTamp: 0, // 当前时间戳
      PrevTimeTamp: 0, // 上一次时间戳
      PrevUploadRate: 0, // 上一次上传进度
      FileSize: 0, // 文件大小
      UploadSpeed: 0, // 上传速度
      UploadRate: 0, // 上传进度
      UploadWidth: 0, // 上传百分比
      DataLock: false, // 数据锁
      VideoJs: null, // videojs实例对象初始化
      LocalUrl: null, // 本地地址
      PrivacyList: [ // 隐私设置列表
        { value: 'Public Visible to everyone', id: '0' },
        { value: 'Private Only visible to yourself', id: '1' }
        // { value: 'Visible only to subscriptions and fans', id: '2' },
        // { value: 'Only visible to fans', id: '3' }
      ],
      OriginalList: [ // 来源列表
        { value: 'Original', id: 0 },
        { value: 'Reprint', id: 1 }
        // { value: 'Visible only to subscriptions and fans', id: '2' },
        // { value: 'Only visible to fans', id: '3' }
      ],
      AlbumList: [ // 专辑列表
        { value: 'Default album', id: '1' }
      ],
      VideoData: null, // 视频源
      ShowClassList: true, // 显隐视频分类列表
      ErrorMsg: null, // 错误提示信息
      FailureStatus: null, // 上传状态
      UploadInfo: { // 视频信息
        VideoId: null, // 视频id
        Title: '', // 标题
        Desc: '', // 描述
        Class: [], // 分类
        Tag: null, // 标签
        Album: null, // 专辑
        Dynamic: '', // 动态内容
        Original: 1, // 来源：0-原创 1-转载
        Price: null, // 金额
        Privacy: '0' // 隐私设置
      }
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      VideoAlbumList: x => x.VideoAlbumList, // 用户视频专辑列表
      ServiceTypeList: x => x.ServiceTypeList // 视频分类列表
    }),
    ...mapMediaState({
      VideoDetails: x => x.VideoDetails // 编辑视频信息
    }),
    Labels: { // 兴趣转换
      get: function () {
        return this.UploadInfo.Tag !== null ? this.UploadInfo.Tag.split(',') || [] : []
      },
      set: function (val) {
        val = val.slice(0, 10)
        val.map((item, index) => {
          val[index] = item.replace(/(^\s*)|(\s*$)/g, '').substring(0, 30)
        })
        this.UploadInfo.Tag = val.join(',') === '' ? null : val.join(',')
      }
    }
  },
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-switch': Switch
  },
  created () {
    this.GetRangeOfPrice({ params: { accountId: this.UserInfo.id } }).then((res) => {
      this.MinPrice = res.data.data.minMoney - 0
      this.MaxPrice = res.data.data.maxMoney - 0
    })
    this.GetServiceType().then(() => {
      if (this.ToolClass.GetUrlParams('key') !== false) {
        this.GetVideoDetails({ params: { videoId: this.ToolClass.GetUrlParams('key') } }).then(() => {
          this.FormInit()
        })
      }
    })
    this.GetVideoAlbum({ params: { accountId: this.UserInfo.id } }).then(() => {
      this.UploadInfo.Album = this.VideoAlbumList[0].id
    })
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapMediaActions([
      'GetVideoDetails'
    ]),
    ...mapUserActions([
      'GetRangeOfPrice',
      'UserUploadVideos',
      'UserRemoveVideos',
      'GetServiceType',
      'GetVideoAlbum',
      'EditUploadVideos',
      'EditVideoDetails'
    ]),
    ...mapUserMutations([
      'EditServiceTypeList'
    ]),
    OriginalChange () { // 来源选择更新
      if (this.UploadInfo.Original === 1) {
        this.AgreeOriginal = false
        this.AgreePrice = false
        this.UploadInfo.Price = null
        this.IsNoFree = false
      }
    },
    FormInit () { // 表单信息初始化
      this.UploadInfo = {
        VideoId: this.ToolClass.GetUrlParams('key'), // 视频id
        Title: this.VideoDetails.title, // 标题
        Desc: this.VideoDetails.description, // 描述
        Class: this.ReturnClass(this.VideoDetails.types), // 分类
        Tag: null, // 标签
        Album: this.VideoDetails.albumId, // 专辑
        Dynamic: '', // 动态内容
        Privacy: `${this.VideoDetails.visible}` // 隐私设置
      }
      this.FailureStatus = this.VideoDetails.failureStatus
      this.Labels = this.VideoDetails.labels.split(',')
    },
    ReturnClass (target) { // 返回分类
      let Arr = target.split(',')
      let Data = []
      Arr.map((item) => {
        this.ServiceTypeList.map((subItem, subIndex) => {
          if (item === subItem.name) {
            subItem.active = true
            Data.push({ id: subItem.id, name: subItem.name, deleteIndex: subIndex })
          }
        })
      })
      return Data
    },
    SubmitForm () { // 提交视频编辑信息
      if (this.ToolClass.GetUrlParams('key') !== false) { // 编辑模式
        if (!this.DataLock && this.CheckEditFoo()) {
          this.DataLock = true
          let ClassArr = []
          this.UploadInfo.Class.map((item) => {
            ClassArr.push(item.id)
          })
          let Data = {
            albumId: this.UploadInfo.Album - 0, // 专辑
            description: this.UploadInfo.Desc, // 简介
            labels: this.UploadInfo.Tag, // 标签
            visible: this.UploadInfo.Privacy - 0, // 隐私等级
            title: this.UploadInfo.Title, // 标题
            types: ClassArr.join(','), // 分类
            failureStatus: this.FailureStatus, // 上传状态
            price: this.UploadInfo.Price - 0,
            original: this.UploadInfo.Original,
            id: this.UploadInfo.VideoId // 视频id
          }
          this.EditVideoDetails({
            data: { ...Data }
          }).then(() => {
            this.$emit('Uploaded', 'video')
            this.DataLock = false
          }).catch(() => {
            this.DataLock = false
          })
        }
      } else { // 上传模式
        if (!this.DataLock && this.CheckFoo()) {
          this.DataLock = true
          let ClassArr = []
          this.UploadInfo.Class.map((item) => {
            ClassArr.push(item.id)
          })
          let Data = {
            album: this.UploadInfo.Album - 0, // 专辑
            description: this.UploadInfo.Desc, // 简介
            dynamic: this.UploadInfo.Dynamic, // 动态
            labels: this.UploadInfo.Tag, // 标签
            visible: this.UploadInfo.Privacy - 0, // 隐私等级
            title: this.UploadInfo.Title, // 标题
            types: ClassArr.join(','), // 分类
            upId: this.UserInfo.id, // 上传人id
            price: this.UploadInfo.Price - 0,
            original: this.UploadInfo.Original,
            videoId: this.UploadInfo.VideoId // 视频id
          }
          this.EditUploadVideos({
            data: { ...Data }
          }).then((res) => {
            this.DataLock = false
            this.$emit('Uploaded', 'video')
          }).catch(() => {
            this.DataLock = false
          })
        }
      }
    },
    CheckFoo () { // 核验上传信息
      this.ErrorMsg = null
      if (this.UploadInfo.VideoId === null) { // 视频未选择
        this.$notify.error({
          title: 'error',
          message: 'Video not selected!'
        })
        return false
      } else if (this.UploadInfo.Title === '') { // 标题为空
        this.$notify.error({
          title: 'error',
          message: 'The title is empty!'
        })
        return false
      } else if (!this.UploadInfo.Class.length) { // 分类为空
        this.$notify.error({
          title: 'error',
          message: 'Classification is empty!'
        })
        return false
      } else if (this.UploadInfo.Tag === null || this.UploadInfo.Tag === '') { // 标签为空
        this.$notify.error({
          title: 'error',
          message: 'Label is empty!'
        })
        return false
      } else if (!this.Agree) { // 未同意协议
        return false
      }
      return true
    },
    CheckEditFoo () { // 核验编辑信息
      this.ErrorMsg = null
      if (this.UploadInfo.Title === '') { // 标题为空
        this.$notify.error({
          title: 'error',
          message: 'The title is empty!'
        })
        return false
      } else if (!this.UploadInfo.Class.length) { // 分类为空
        this.$notify.error({
          title: 'error',
          message: 'Classification is empty!'
        })
        return false
      } else if (this.UploadInfo.Tag === null || this.UploadInfo.Tag === '') { // 标签为空
        this.$notify.error({
          title: 'error',
          message: 'Label is empty!'
        })
        return false
      }
      if (this.UploadInfo.Original === 0) { // 原创
        if (!this.AgreeOriginal) {
          this.$notify.error({
            title: 'error',
            message: 'You should to agree to the original agreement!'
          })
          return false
        } else if (this.IsNoFree) {
          if (!this.AgreePrice) {
            this.$notify.error({
              title: 'error',
              message: 'You should to agree to the paid video agreement!'
            })
            return false
          } else if (this.UploadInfo.Price === null || this.UploadInfo.Price - 0 < this.MinPrice || this.UploadInfo.Price - 0 > this.MaxPrice) {
            this.$notify.error({
              title: 'error',
              message: 'Price setting error!'
            })
            return false
          }
        }
      }
      return true
    },
    InputSizeRules (target, size) { // 输入框字数限制
      target = target.substring(0, size)
    },
    DeleteClassItem (item, index) { // 删除视频分类标签
      this.EditServiceTypeList({ index: item.deleteIndex, active: false })
      this.UploadInfo.Class.splice(index, 1)
    },
    CutTypesItem (item, index) { // 选择视频分类标签
      if (!item.active && this.UploadInfo.Class.length < 3) {
        this.UploadInfo.Class.push({ id: item.id, name: item.name, deleteIndex: index })
        this.EditServiceTypeList({ index, active: true })
      } else if (item.active) {
        this.UploadInfo.Class.map((thisItem, thisIndex) => {
          if (thisItem.id === item.id) {
            this.UploadInfo.Class.splice(thisIndex, 1)
          }
        })
        this.EditServiceTypeList({ index, active: false })
      }
    },
    ToEmptyVideoData () { // 主动清空视频信息
      this.ToolClass.Confirm('Delete video', 'Are you sure to delete the current video?', () => { }, (close) => {
        this.EmptyVideoData(close)
      }, 'Delete')
    },
    EmptyVideoData (callback = () => { }) { // 清空视频信息
      if (!this.DataLock) {
        this.DataLock = true
        if (this.UploadInfo.VideoId === null) {
          this.VideoData = null
          this.$refs.HideFileForVideo.value = ''
          this.LocalUrl = null
          this.CheckUrl = null
          this.DataLock = false
          callback()
        } else {
          this.UserRemoveVideos({ params: { videoId: this.UploadInfo.VideoId } }).then(() => {
            this.UploadInfo.VideoId = null
            this.VideoData = null
            this.$refs.HideFileForVideo.value = ''
            this.LocalUrl = null
            this.CheckUrl = null
            this.DataLock = false
            callback()
          }).catch(() => {
            this.DataLock = false
          })
        }
      }
    },
    SelectVideo () { // 选择视频
      this.$refs.HideFileForVideo.click()
    },
    GetVideoTimes (e) { // 获取视频时长
      this.VideoSizeStatus = e.target.duration >= 15
      this.CheckUrl = null
      if (!this.VideoSizeStatus) {
        this.$notify.error({
          title: 'error',
          message: 'Video length should be greater than 15 seconds!'
        })
        this.DataLock = false // 数据锁定，防止多次触发
        this.EmptyVideoData()
        return false
      }
      this.LocalUrl = null // 本地视频地址清空
    },
    FileChange () { // 文件选取更新
      if (!this.DataLock && !this.OnUpload) { // 数据锁判断
        this.DataLock = true // 数据锁定，防止多次触发
        this.LocalUrl = null // 本地视频地址清空
        this.VideoData = this.$refs.HideFileForVideo.files[0] // 读取视频文件
        if (this.VideoData.size < 1 * 1000 * 1000 || this.VideoData.size > 2000 * 1000 * 1000) { // 小于1MB或者大于2000MB文件不允许上传
          this.DataLock = false // 数据锁解锁
          this.$notify.error({
            title: 'error',
            message: 'Video file size should be 1~2000mb!'
          })
          this.EmptyVideoData()
          return false
        }
        this.CheckUrl = this.GetFileURL(this.VideoData)
        this.UploadVideos()
      }
    },
    UploadVideos () { // 上传视频
      this.FileSize = (this.VideoData.size / 1000 / 1000).toFixed(2) // 读取视频大小
      let Data = new FormData() // 创建form对象
      Data.append('videoFiles', this.VideoData) // 赋值form文件
      this.PrevTimeTamp = Date.now()
      this.PrevUploadRate = 0
      this.OnUpload = true // 数据上传状态更新
      this.UserUploadVideos({ // 上传视频
        params: { accountId: this.UserInfo.id },
        data: Data,
        onUploadProgress: (e) => { // 上传进度回调
          if (!this.FunOff) {
            return
          }
          this.FunOff = false
          window.setTimeout(() => {
            if (e.lengthComputable) {
              let Rate = e.loaded / e.total
              if (Rate < 1) {
                this.UploadRate = Rate
                this.UploadWidth = (Rate * 100).toFixed(2) + '%'
                this.CurrentTimeTamp = Date.now()
                let Size = this.VideoData.size / 1000 * (this.UploadRate - this.PrevUploadRate)
                let Time = (this.CurrentTimeTamp - this.PrevTimeTamp) / 1000
                this.UploadSpeed = (Size / Time).toFixed(2)
                this.PrevTimeTamp = this.CurrentTimeTamp - 0
                this.PrevUploadRate = this.UploadRate - 0
              } else {
                this.UploadSpeed = 0
                this.PrevTimeTamp = 0
                this.PrevUploadRate = 0
                this.UploadRate = 1
                this.UploadWidth = '100%'
              }
            }
            this.FunOff = true
          }, 1000)
        }
      }).then((res) => {
        this.UploadRate = 0
        this.UploadWidth = 0
        if (res.data.code - 0 === 2009) { // 上传成功
          this.UploadInfo.VideoId = res.data.data.videoId // 获取视频id
          this.EmptyVideoData()
          this.LocalUrl = this.GetFileURL(this.VideoData)
        } else if (res.data.code - 0 === 2002) { // 上传重复
          this.$notify.error({
            title: 'error',
            message: res.data.msg
          })
          this.EmptyVideoData()
        }
        this.DataLock = false // 数据锁解锁
        this.OnUpload = false // 数据上传状态更新
      }).catch((res) => {
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
        this.DataLock = false // 数据锁解锁
        this.OnUpload = false // 数据上传状态更新
        this.EmptyVideoData()
      })
    },
    GetFileURL (file) { // 获取本地文件地址
      let GetUrl = null
      if (window.createObjectURL !== undefined) {
        GetUrl = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        GetUrl = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        GetUrl = window.webkitURL.createObjectURL(file)
      }
      return GetUrl
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
