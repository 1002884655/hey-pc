<template>
  <div class="components UploadForVideo">

    <ul>

      <!-- 添加视频文件（限单个视频上传） -->
      <li v-if="this.ToolClass.GetUrlParams('key') === false">
        <span class="Title"><b>Add video</b><em> (.mp4,.mkv,.mov,.webm)</em></span>
        <div>
          <div class="UploadProgressContainer flex-h" v-if="VideoData !== null || UploadInfo.VideoId !== null">
            <img src="../../assets/img/video.png" alt="">
            <div class="flex-item">
              <div class="flex-h">
                <span class="flex-item">{{VideoData.name}}</span>
                <span v-if="VideoMd5String !== ''">Verifying video uniqueness...{{((VideoMd5CheckIndex / VideoMd5CheckNum) * 100).toFixed(2)}}%</span>
                <span v-if="!UploadComputed && VideoMd5String === ''">Upload speed {{UploadSpeed}}kb/s</span>
                <span v-if="!UploadComputed && VideoMd5String === ''">Video size {{Math.min((VideoData.size / 1024 / 1024).toFixed(2), CurrentUploadIndex * VideoChunkSize)}}MB/{{(VideoData.size / 1024 / 1024).toFixed(2)}}MB</span>
                <span v-if="UploadComputed">Upload to complete</span>
              </div>
              <div class="UploadProgress">
                <div class="Line">
                  <div :style="{width: UploadWidth}"></div>
                </div>
              </div>
            </div>
            <div class="Delete">
              <a v-if="UploadComputed" class="iconfont iconqingkong" @click="ToEmptyVideoData"></a>
            </div>
          </div>
          <a class="AddFile" @click="SelectVideo" v-if="VideoData === null">
            <i class="iconfont iconjia"></i>
            <span>Add video</span>
          </a>
          <input type="file" ref="HideFileForVideo" hidden @change="FileChange" accept=".mp4,.mkv,.mov,.webm">
        </div>
      </li>

      <!-- 封面 -->
      <li v-if="VideoData !== null">
        <span class="Title"><b>Edit the cover</b></span>
        <div id="CoverTest"></div>
        <div class="flex-h UploadCoverContainer">
          <div class="UploadCover">
            <a>
              <img v-if="CoverSelectIndex === 0" :src="CoverList1" class="centerLabel cover" alt="">
              <img v-if="CoverSelectIndex === 1" :src="CoverList2" class="centerLabel cover" alt="">
              <img v-if="CoverSelectIndex === 2" :src="CoverList3" class="centerLabel cover" alt="">
              <img v-if="CoverSelectIndex === 3" :src="CoverList4" class="centerLabel cover" alt="">
              <img v-if="CoverSelectIndex === null" :src="CoverFileUrl" class="centerLabel cover" alt="">
              <span @click="$refs.HideFileForCover.click()">Upload the Thumbnail</span>
            </a>
          </div><input type="file" ref="HideFileForCover" hidden @change="CoverFileChange" accept="image/jpg, image/jpeg, image/png">
          <div class="flex-item">
            <span>Select the video Thumbnail</span>
            <div>
              <div class="flex-item" :class="{'active': CoverSelectIndex === 0}" @click="CoverSelectIndex = 0; $refs.HideFileForCover.value = ''">
                <a>
                  <img :src="CoverList1" class="centerLabel cover" alt="">
                </a>
                <i class="iconfont iconyitianjia"></i>
              </div>
              <div class="flex-item" :class="{'active': CoverSelectIndex === 1}" @click="CoverSelectIndex = 1; $refs.HideFileForCover.value = ''">
                <a>
                  <img :src="CoverList2" class="centerLabel cover" alt="">
                </a>
                <i class="iconfont iconyitianjia"></i>
              </div>
              <div class="flex-item" :class="{'active': CoverSelectIndex === 2}" @click="CoverSelectIndex = 2; $refs.HideFileForCover.value = ''">
                <a>
                  <img :src="CoverList3" class="centerLabel cover" alt="">
                </a>
                <i class="iconfont iconyitianjia"></i>
              </div>
              <div class="flex-item" :class="{'active': CoverSelectIndex === 3}" @click="CoverSelectIndex = 3; $refs.HideFileForCover.value = ''">
                <a>
                  <img :src="CoverList4" class="centerLabel cover" alt="">
                </a>
                <i class="iconfont iconyitianjia"></i>
              </div>
            </div>
          </div>
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
              <span v-if="!UploadInfo.Class.length">Up to 3 categories</span>
              <a v-for="(item, index) in UploadInfo.Class" :key="index">{{item.name}} <i class="iconfont iconguanbi" @click="DeleteClassItem(item, index)"></i></a>
            </div>
            <a class="iconfont iconjiantouup" @click="ShowClassList = !ShowClassList" v-if="ShowClassList"></a>
            <a class="iconfont iconjiantoudown" @click="ShowClassList = !ShowClassList" v-else></a>
          </div>
          <div class="ClassList" v-show="ShowClassList">
            <span>Up to 3 categories</span>
            <a v-for="(item, index) in ServiceTypeList" :key="index" :class="{'active': item.active}" @click="CutTypesItem(item, index)">{{item.name}}</a>
          </div>
        </div>
      </li>

      <!-- 标签 -->
      <li>
        <span class="Title">Tags</span>
        <div>
          <el-select class="LabelSelect" v-model="Labels" multiple filterable allow-create default-first-option placeholder="Up to 10 labels, confirm width ENTER" no-data-text="Each label has a maximum of 30 characters"></el-select>
        </div>
      </li>

      <!-- 专辑 -->
      <!-- <li>
        <span class="Title">Album</span>
        <div>
          <el-select style="width: 300px;" v-model="UploadInfo.Album" placeholder="select" no-data-text="no data">
            <el-option v-for="item in VideoAlbumList" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left;">{{ item.name }}</span>
              <span style="float: right;">{{ item.videoNum }}</span>
            </el-option>
          </el-select>
        </div>
      </li> -->

      <!-- 动态内容 -->
      <!-- <li v-if="this.ToolClass.GetUrlParams('key') === false">
        <span class="Title">Dynamic</span>
        <div>
          <textarea cols="30" rows="5" v-model="UploadInfo.Dynamic" @input="UploadInfo.Dynamic = UploadInfo.Dynamic.substring(0, 280)" placeholder="I posted a video, come and watch"></textarea>
        </div>
      </li> -->

      <!-- 来源设置 -->
      <!-- <li>
        <span class="Title">Source</span>
        <div>
          <el-select style="width: 300px;" v-model="UploadInfo.Original" @change="OriginalChange">
            <el-option v-for="item in OriginalList" :key="item.id" :label="item.value" :value="item.id">
            </el-option>
          </el-select>
          <a v-if="UploadInfo.Original === 0" class="iconfont" :class="[AgreeOriginal ? 'icongouxuan active' : 'iconweigouxuan']" @click="AgreeOriginal = !AgreeOriginal"></a>
          <span v-if="UploadInfo.Original === 0" class="Tips">Agree to the original agreement</span>
        </div>
      </li> -->

      <!-- 金额 -->
      <li>
        <span class="Title">Price ($) <em>price range {{MinPrice}}-{{MaxPrice}}$</em></span>
        <!-- <span class="Title" style="color: #999;">{{IsNoFree ? 'Close' : 'Open'}} payment <el-switch style="margin-left: 20px;" v-model="IsNoFree" active-color="#13ce66" inactive-color="#ff4949"></el-switch></span> -->
        <div>
          <input style="width: 300px;" type="text" v-model="UploadInfo.Price" :placeholder="`Add video price`">
          <!-- <a class="iconfont" :class="[AgreePrice ? 'icongouxuan active' : 'iconweigouxuan']" @click="AgreePrice = !AgreePrice"></a>
          <span class="Tips">Agree to the paid video agreement</span> -->
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
// import md5 from 'md5'
import Vue from 'vue'
import SparkMD5 from 'spark-md5'
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
      CoverSelectIndex: null,
      CoverTimer: null,
      CoverList1: null,
      CoverList2: null,
      CoverList3: null,
      CoverList4: null,
      MinPrice: 0,
      MaxPrice: 0,
      IsNoFree: false,
      AgreePrice: false,
      AgreeOriginal: false,
      Agree: false,
      CenterDialogVisible: true,
      FunOff: true,
      UploadComputed: false,
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
      CoverFile: null,
      CoverFileUrl: null,
      CurrentUploadIndex: 0,
      VideoChunkSize: 4,
      VideoMd5: null,
      VideoMd5String: '',
      VideoMd5CheckIndex: 0,
      VideoMd5CheckNum: 1,
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
      'EditVideoDetails',
      'UploadVideoChunk',
      'CheckVideoMd5',
      'MergeUploadVideo',
      'CheckVideoChunk'
    ]),
    ...mapUserMutations([
      'EditServiceTypeList'
    ]),
    CoverFileChange () {
      this.CoverFile = this.$refs.HideFileForCover.files[0]
      this.CoverFileUrl = this.GetFileURL(this.CoverFile)
      this.CoverSelectIndex = null
    },
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
        Class: this.ReturnClass(this.VideoDetails.types || ''), // 分类
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
    CalcCoverImg (callback = () => { }) {
      let Base64Img = null
      if (this.CoverSelectIndex === null) {
        // Base64Img = this.CoverFile
        let image = new Image()
        image.crossOrigin = ''
        image.src = this.CoverFileUrl
        image.onload = () => {
          let canvas = document.createElement('canvas')
          canvas.style.position = 'absolute'
          canvas.style.left = '-100000px'
          document.getElementById('CoverTest').appendChild(canvas)
          canvas.width = image.width
          canvas.height = image.height
          canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height) // 绘制canvas
          Base64Img = canvas.toDataURL('image/jpeg')
          callback(Base64Img)
        }
      } else if (this.CoverSelectIndex === 0) {
        Base64Img = this.CoverList1
        callback(Base64Img)
      } else if (this.CoverSelectIndex === 1) {
        Base64Img = this.CoverList2
        callback(Base64Img)
      } else if (this.CoverSelectIndex === 2) {
        Base64Img = this.CoverList3
        callback(Base64Img)
      } else if (this.CoverSelectIndex === 3) {
        Base64Img = this.CoverList4
        callback(Base64Img)
      }
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
          this.CalcCoverImg((Base64Img) => {
            let Data = {
              base64Img: Base64Img,
              album: this.UploadInfo.Album - 0, // 专辑
              description: this.UploadInfo.Desc, // 简介
              dynamic: this.UploadInfo.Dynamic, // 动态
              labels: null, // 标签
              visible: this.UploadInfo.Privacy - 0, // 隐私等级
              title: this.UploadInfo.Title, // 标题
              types: ClassArr.join(','), // 分类
              upId: this.UserInfo.id, // 上传人id
              price: this.UploadInfo.Price - 0,
              original: null,
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
        // this.$notify.error({
        //   title: 'error',
        //   message: 'Label is empty!'
        // })
        // return false
      } else if (!this.Agree) { // 未同意协议
        return false
      } else if (this.UploadInfo.Price !== null) {
        if (!(this.UploadInfo.Price - 0)) {
          this.$notify.error({
            title: 'error',
            message: 'Price setting error!'
          })
          return false
        }
        if (this.UploadInfo.Price - 0 < this.MinPrice || this.UploadInfo.Price - 0 > this.MaxPrice) {
          this.$notify.error({
            title: 'error',
            message: 'Price setting error!'
          })
          return false
        } else if (!this.AgreePrice) {
          // this.$notify.error({
          //   title: 'error',
          //   message: 'You should to agree to the paid video agreement!'
          // })
          // return false
        }
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
      if (this.UploadInfo.Price !== null) {
        if (!(this.UploadInfo.Price - 0)) {
          this.$notify.error({
            title: 'error',
            message: 'Price setting error!'
          })
          return false
        }
        if (this.UploadInfo.Price - 0 < this.MinPrice || this.UploadInfo.Price - 0 > this.MaxPrice) {
          this.$notify.error({
            title: 'error',
            message: 'Price setting error!'
          })
          return false
        } else if (!this.AgreePrice) {
          // this.$notify.error({
          //   title: 'error',
          //   message: 'You should to agree to the paid video agreement!'
          // })
          // return false
        }
      }
      // if (this.UploadInfo.Original === 0) { // 原创
      //   if (!this.AgreeOriginal) {
      //     this.$notify.error({
      //       title: 'error',
      //       message: 'You should to agree to the original agreement!'
      //     })
      //     return false
      //   } else if (this.IsNoFree) {
      //     if (!this.AgreePrice) {
      //       this.$notify.error({
      //         title: 'error',
      //         message: 'You should to agree to the paid video agreement!'
      //       })
      //       return false
      //     } else if (this.UploadInfo.Price === null || this.UploadInfo.Price - 0 < this.MinPrice || this.UploadInfo.Price - 0 > this.MaxPrice) {
      //       this.$notify.error({
      //         title: 'error',
      //         message: 'Price setting error!'
      //       })
      //       return false
      //     }
      //   }
      // }
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
        this.CoverSelectIndex = null
        this.CoverList1 = null
        this.CoverList2 = null
        this.CoverList3 = null
        this.CoverList4 = null
        if (this.UploadInfo.VideoId === null) {
          this.VideoData = null
          this.$refs.HideFileForVideo.value = ''
          this.LocalUrl = null
          this.DataLock = false
          this.$nextTick(() => {
            this.UploadWidth = 0
            this.UploadComputed = false
          })
          callback()
        } else {
          this.UserRemoveVideos({ params: { videoId: this.UploadInfo.VideoId } }).then(() => {
            this.UploadInfo.VideoId = null
            this.VideoData = null
            this.$refs.HideFileForVideo.value = ''
            this.LocalUrl = null
            this.DataLock = false
            this.$nextTick(() => {
              this.UploadWidth = 0
              this.UploadComputed = false
            })
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
    VideoOnload () {
    },
    CheckMd5 (Spark, index = 0) {
      let MaxNum = Math.ceil(this.VideoData.size / (this.VideoChunkSize * 1024 * 1024))
      this.VideoMd5CheckNum = MaxNum
      this.VideoMd5CheckIndex = index
      if (index < MaxNum) {
        this.VideoMd5String = 'xxx'
        let fileReader = new FileReader()
        let File = this.VideoData.slice(index * this.VideoChunkSize * 1024 * 1024, (index + 1) * this.VideoChunkSize * 1024 * 1024)
        fileReader.readAsArrayBuffer(File)
        fileReader.onload = (e) => {
          Spark.append(e.target.result)
          this.CheckMd5(Spark, index + 1)
        }
      } else {
        this.VideoMd5 = Spark.end()
        this.VideoMd5String = ''
        this.VideoMd5CheckIndex = 0
        this.VideoMd5CheckNum = 1
        this.CheckAndUpload(MaxNum)
      }

      // let fileReader = new FileReader()
      // fileReader.readAsBinaryString(this.VideoData)
      // fileReader.onload = (e) => {
      //   this.VideoMd5 = md5(e.target.result)
      //   console.log(this.VideoMd5, 'md5')
      // }
    },
    CheckAndUpload (MaxNum) { // 校验并上传
      this.CheckVideoMd5({ params: { identifier: this.VideoMd5, accountId: this.UserInfo.id } }).then((md5Res) => { // 校验视频md5
        this.DataLock = false
        if (md5Res.data.data.flag - 0 === 0) {
          this.CreateCover(this.GetFileURL(this.VideoData))
          this.CheckVideoChunk({
            params: {
              accountId: this.UserInfo.id,
              chunkNumber: this.CurrentUploadIndex + 1,
              chunkSize: this.VideoChunkSize * 1024 * 1024,
              currentChunkSize: this.VideoChunkSize * 1024 * 1024,
              filename: this.VideoData.name,
              identifier: this.VideoMd5,
              totalChunks: MaxNum,
              totalSize: this.VideoData.size
            }
          }).then((res) => {
            this.CurrentUploadIndex = res.data.data.length
            if (res.data.data.length < MaxNum) { // 视频文件未上传或者已上传一部分
              this.NewUploadVideos()
            } else { // 视频文件已全部上传，但未合并
              this.OnUpload = false
              this.UploadComputed = true
              this.UploadWidth = '100%'
              this.MergeUploadVideo({ // 合并视频
                data: {
                  accountId: this.UserInfo.id,
                  filename: this.VideoData.name,
                  identifier: this.VideoMd5,
                  totalChunks: MaxNum
                }
              })
            }
          })
        } else if (md5Res.data.data.flag - 0 === 1) { // 视频已存在，且是本用户上传
          this.UploadInfo.VideoId = md5Res.data.data.videoId - 0 // 获取视频id
          this.CreateCover(this.GetFileURL(this.VideoData))
          this.OnUpload = false
          this.UploadComputed = true
          this.UploadWidth = '100%'
        } else {
          this.$notify.error({
            title: 'error',
            message: 'The video has been uploaded!'
          })
          this.VideoData = null
          this.$refs.HideFileForVideo.value = ''
          this.LocalUrl = null
          this.DataLock = false
          this.$nextTick(() => {
            this.UploadWidth = 0
            this.UploadComputed = false
          })
        }
      })
    },
    FileChange () { // 文件选取更新
      if (!this.DataLock) {
        this.DataLock = true
        this.VideoData = this.$refs.HideFileForVideo.files[0] // 读取视频文件
        this.VideoMd5 = null
        this.VideoMd5String = ''
        this.VideoMd5CheckIndex = 0
        this.VideoMd5CheckNum = 1
        let Spark = new SparkMD5.ArrayBuffer()
        this.CheckMd5(Spark)
      }
    },
    NewUploadVideos () { // 分段上传视频
      let FileList = []
      let MaxNum = Math.ceil(this.VideoData.size / (this.VideoChunkSize * 1024 * 1024))
      for (let n = 0; n < MaxNum; n++) {
        FileList.push(this.VideoData.slice(n * this.VideoChunkSize * 1024 * 1024, (n + 1) * this.VideoChunkSize * 1024 * 1024))
      }
      this.OnUpload = true
      this.UploadComputed = false
      this.ToUploadVideoChunk(FileList, MaxNum)
    },
    ToUploadVideoChunk (list, num) { // 分段上传视频
      this.OnUpload = true
      let Data = new FormData() // 创建form对象
      Data.append('file', list[this.CurrentUploadIndex]) // 赋值form文件
      let StartTime = Date.now()
      this.UploadVideoChunk({
        params: {
          accountId: this.UserInfo.id,
          chunkNumber: this.CurrentUploadIndex + 1,
          chunkSize: this.VideoChunkSize * 1024 * 1024,
          currentChunkSize: list[this.CurrentUploadIndex].size,
          filename: this.VideoData.name,
          identifier: this.VideoMd5,
          totalChunks: list.length,
          totalSize: this.VideoData.size
        },
        data: Data
      }).then(() => {
        this.UploadWidth = `${(this.CurrentUploadIndex + 1) / num * 100}%`
        let UploadTimeLength = (Date.now() - StartTime) / 1000
        this.UploadSpeed = (list[this.CurrentUploadIndex].size / UploadTimeLength / 1024).toFixed(2)
        if (this.CurrentUploadIndex < list.length - 1) {
          this.CurrentUploadIndex += 1
          this.ToUploadVideoChunk(list, num)
        } else {
          this.MergeUploadVideo({ // 上传完成，合并视频
            data: {
              accountId: this.UserInfo.id,
              filename: this.VideoData.name,
              identifier: this.VideoMd5,
              totalChunks: num
            }
          }).then((res) => {
            this.UploadSpeed = 0
            this.OnUpload = false
            this.UploadComputed = true
            this.UploadInfo.VideoId = res.data.data.videoId // 获取视频id
            this.DataLock = false // 数据锁定，防止多次触发
          }).catch(() => {
            this.DataLock = false // 数据锁定，防止多次触发
          })
        }
      }).catch(() => {
        this.DataLock = false // 数据锁定，防止多次触发
      })
    },
    CreateCoverStep (video, index = 0) {
      window.clearTimeout(this.CoverTimer)
      if (index < 5) {
        this.CoverTimer = window.setTimeout(() => {
          video.currentTime = Math.floor(video.duration / (5 - index))
          let canvas = document.createElement('canvas')
          canvas.style.position = 'absolute'
          canvas.style.left = '-100000px'
          document.getElementById('CoverTest').appendChild(canvas)
          canvas.width = 400
          canvas.height = 225
          canvas.getContext('2d').drawImage(video, 0, 0, 400, 225) // 绘制canvas
          if (index !== 0) {
            this[`CoverList${index}`] = canvas.toDataURL('image/jpeg')
            if (index === 1) {
              this.CoverSelectIndex = 0
            }
          }
          this.CreateCoverStep(video, index + 1)
        }, 1000)
      }
    },
    CreateCover (url) { // 生成封面
      let video = document.createElement('video')
      video.style.display = 'none'
      video.style.width = '400px'
      video.style.height = '225px'
      video.style.objectFit = 'contain'
      video.setAttribute('crossOrigin', 'anonymous') // 处理跨域
      document.getElementById('CoverTest').appendChild(video)
      video.innerHTML = `<source src="${url}" type="video/mp4">`
      video.onloadeddata = () => {
        this.CreateCoverStep(video)
      }
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
