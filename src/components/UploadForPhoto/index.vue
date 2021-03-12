<template>
  <div class="components UploadForPhoto">
    <div>

      <!-- 添加图片文件（限9张图片上传） -->
      <div>
        <div>
          <span class="Title"><b>Add photo</b><em> (Currently 9 photos can be uploaded)</em></span>
          <div>
            <div class="PhotoPreview">
              <a v-for="(item, index) in PhotoUrlArr" :key="index">
                <img :src="item" class="centerLabel contain" alt="">
                <i class="iconfont iconqingkong" @click="DeleteImgItem(index)"></i>
              </a>
              <a class="AddPhoto" v-if="PhotoUrlArr.length < 9" @click="$refs.HideFileForPhoto.click()">
                <div class="centerLabel">
                  <i class="iconfont iconjia"></i>
                  <span>add photo</span>
                </div>
              </a>
              <input type="file" ref="HideFileForPhoto" hidden @change="FileChange" accept="image/jpg, image/jpeg, image/png" multiple>
            </div>
          </div>
        </div>
      </div>

      <!-- 切换创建\选择图集按钮 -->
      <div v-if="PhotoAlbum.length">
        <div>
          <a class="CutCreateType" @click="CutCreateType">{{CreateType === 1 ? 'Select an existing gallery' : 'Create a new gallery'}}</a>
        </div>
      </div>

      <!-- 创建新图片专辑 -->
      <div v-if="ShowCreateNewAlbum">

        <!-- 标题 -->
        <div>
          <span class="Title"><b>PHOTO INFORMATION</b></span>
          <span class="Title">Photo Title</span>
          <div>
            <input type="text" v-model="UploadInfo.Title" placeholder="Add a title">
          </div>
        </div>

        <!-- 分类 -->
        <div>
          <span class="Title">Category</span>
          <div>
            <div class="ClassInput flex-h">
              <div class="flex-item">
                <span v-if="!UploadInfo.Class.length">Select photo category</span>
                <a v-for="(item, index) in UploadInfo.Class" :key="index">{{item.name}} <i class="iconfont iconguanbi" @click="DeleteClassItem(item, index)"></i></a>
              </div>
              <a class="iconfont iconjiantouup" @click="ShowClassList = !ShowClassList" v-if="ShowClassList"></a>
              <a class="iconfont iconjiantoudown" @click="ShowClassList = !ShowClassList" v-else></a>
            </div>
            <div class="ClassList" v-show="ShowClassList">
              <a v-for="(item, index) in PhotoTypes" :key="index" :class="{'active': item.active}" @click="CutTypesItem(item, index)">{{item.name}}</a>
            </div>
          </div>
        </div>

        <!-- 标签 -->
        <div>
          <span class="Title">Label</span>
          <div>
            <el-select class="LabelSelect" v-model="Labels" multiple filterable allow-create default-first-option placeholder="Press enter to generate the label" no-data-text="Press enter to generate the label"></el-select>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div>
          <span class="Title">Privacy</span>
          <div>
            <el-select style="width: 300px;" v-model="UploadInfo.Privacy">
              <el-option v-for="item in PrivacyList" :key="item.id" :label="item.value" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- 动态内容 -->
        <div>
          <span class="Title">Dynamic</span>
          <div>
            <textarea cols="30" rows="5" v-model="UploadInfo.Dynamic" placeholder="I posted a photo, come and watch"></textarea>
          </div>
        </div>

      </div>

      <!-- 选择图片专辑 -->
      <div v-if="PhotoAlbum.length && CreateType === 2">

        <!-- 标题 -->
        <div>
          <span class="Title"><b>PHOTO INFORMATION</b></span>
          <span class="Title">Select an existing gallery</span>
          <div>
            <el-select style="width: 300px;" v-model="UploadInfo.Album" placeholder="please select">
              <el-option v-for="item in PhotoAlbum" :key="item.id" :label="item.title" :value="item.id">
                <span style="float: left;">{{ item.title }}</span>
                <span style="float: right;">{{ item.photoNum }}</span>
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- 动态内容 -->
        <div>
          <span class="Title">Dynamic</span>
          <div>
            <textarea cols="30" rows="5" v-model="UploadInfo.Dynamic" placeholder="I posted a photo, come and watch"></textarea>
          </div>
        </div>

      </div>

    </div>

    <!-- 申明 -->
    <span class="BottomState">Once uploaded, it means that you upload content and everyone in the photo agrees to upload the video to HeyPorn, and that you have read and accepted HeyPorn's <a>&lt;Terms of Service&gt;</a></span>

    <!-- 发布按钮 -->
    <a class="PostBtn" @click="SubmitForm" :class="{'active': CanSubmit && !DataLock}">{{DataLock ? 'Uploading...' : 'Publish now'}}</a>
  </div>
</template>

<script>
/*
  页面名称：图片上传组件
  创建人：许成祥
  创建时间：2020/04/20
  最近修改人：许成祥
  最近修改日期：2020/05/09
  备注： 无
*/
import Vue from 'vue'
import { Select, Option, Notification } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions, mapMutations: mapUserMutations } = createNamespacedHelpers('user')
export default {
  name: 'UploadForPhoto',
  props: ['data'],
  data () {
    return {
      UploadEnd: false, // 已上传完毕状态
      ErrorMsg: null, // 报错信息
      DataLock: false, // 数据锁
      ShowCreateNewAlbum: false, // 显隐创建新图片专辑
      CreateType: 2, // 上传图片业务类型：1-先创建图集，后上传图片 2-选择已有图集，后上传图片
      LocalUrl: null, // 本地地址
      PrivacyList: [ // 隐私设置列表
        { value: 'Public Visible to everyone', id: '1' },
        { value: 'Private Only visible to yourself', id: '2' },
        { value: 'Visible only to subscriptions and fans', id: '3' },
        { value: 'Only visible to fans', id: '4' }
      ],
      InputFileData: [], // input文件数据
      PhotoUrlArr: [], // 图片本地地址
      PhotoData: [], // 图片源
      ShowClassList: true, // 显隐图片分类列表
      UploadInfo: { // 图片信息
        Title: '', // 标题
        Class: [], // 分类
        Tag: null, // 标签
        Album: this.ToolClass.GetUrlParams('album') || '', // 专辑
        Dynamic: '', // 动态内容
        Privacy: '1' // 隐私设置
      }
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo, // 用户信息
      PhotoAlbum: x => x.PhotoAlbum, // 图片专辑
      PhotoTypes: x => x.PhotoTypes // 图片分类
    }),
    Labels: { // 兴趣转换
      get: function () {
        return this.UploadInfo.Tag !== null ? this.UploadInfo.Tag.split(',') || [] : []
      },
      set: function (val) {
        this.UploadInfo.Tag = val.join(',') === '' ? null : val.join(',')
      }
    },
    CanSubmit () { // 是否可以提交数据
      if (!this.PhotoData.length) { // 图片未选择
        return false
      }
      if (this.CreateType === 1) { // 先创建图集
        if (this.UploadInfo.Title === '') { // 标题为空
          return false
        }
        if (!this.UploadInfo.Class.length) { // 分类为空
          return false
        }
      }
      return true
    }
  },
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created () {
    this.GetPhotoAlbum({ params: { accountId: this.UserInfo.id } }).then(() => { // 获取已创建图集
      if (!this.PhotoAlbum.length) { // 未创建任何图集时，上传类型为1（先创建图集，后上传图片）
        this.ShowCreateNewAlbum = true
        this.CreateType = 1
      } else {
        this.UploadInfo.Album = this.ToolClass.GetUrlParams('album') - 0 || this.PhotoAlbum[0].id
      }
    })
    this.GetPhotoServiceType()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetPhotoAlbum',
      'GetPhotoServiceType',
      'CreatePhotoAlbum',
      'UploadPhotos'
    ]),
    ...mapUserMutations([
      'EditPhotoTypes'
    ]),
    CheckSubmit () { // 是否可以提交数据
      if (!this.PhotoData.length) { // 图片未选择
        this.$notify.error({
          title: 'error',
          message: 'Photo not selected!'
        })
        this.DataLock = false
        return false
      }
      if (this.CreateType === 1) { // 先创建图集
        if (this.UploadInfo.Title === '') { // 标题为空
          this.$notify.error({
            title: 'error',
            message: 'The title is empty!'
          })
          this.DataLock = false
          return false
        }
        if (!this.UploadInfo.Class.length) { // 分类为空
          this.$notify.error({
            title: 'error',
            message: 'Classification is empty!'
          })
          this.DataLock = false
          return false
        }
        if (this.UploadInfo.Tag === null || this.UploadInfo.Tag === '') { // 标签为空
          this.$notify.error({
            title: 'error',
            message: 'Tag is empty!'
          })
          this.DataLock = false
          return false
        }
      }
      return true
    },
    CutCreateType () { // 切换创建\选择类型
      this.CreateType = this.CreateType === 1 ? 2 : 1
      this.ShowCreateNewAlbum = this.CreateType === 1
      this.UploadInfo.Dynamic = ''
    },
    SubmitForm () { // 提交表单
      if (!this.DataLock) {
        this.DataLock = true // 数据锁锁定，防多次提交
        if (!this.CheckSubmit()) {
          return false
        }
        if (this.CreateType === 1) { // 先创建图集
          this.CreatePhotoAlbum({ // 创建图集
            data: {
              dynamic: this.UploadInfo.Dynamic,
              labels: this.UploadInfo.Tag,
              photoServiceTypeId: this.UploadInfo.Class[0].id - 0,
              visible: this.UploadInfo.Privacy,
              title: this.UploadInfo.Title,
              upId: this.UserInfo.id
            }
          }).then((res) => {
            this.UploadInfo.Album = res.data.data.photoAlbumId // 获取创建图集id
            this.ToUploadPhotos()
          }).catch((res) => {
            this.DataLock = false
            this.$notify.error({
              title: 'error',
              message: res.data.msg
            })
          })
        } else { // 选择已有图集
          this.ToUploadPhotos()
        }
      }
    },
    ToUploadPhotos () {
      let Data = new FormData() // 创建form对象
      this.PhotoData.map((item) => {
        Data.append('photoFiles', item) // 赋值form文件
      })
      this.UploadPhotos({
        params: { accountId: this.UserInfo.id, photoAlbumId: this.UploadInfo.Album },
        data: Data,
        onUploadProgress: (e) => {
          if (e.lengthComputable) {
          }
        }
      }).then(() => {
        this.DataLock = false
        this.UploadEnd = true
        this.$emit('Uploaded', 'photo')
      }).catch((res) => {
        this.DataLock = false
        this.$notify.error({
          title: 'error',
          message: res.data.msg
        })
      })
    },
    DeleteClassItem (item, index) { // 删除分类标签
      this.EditPhotoTypes({ index: item.deleteIndex, active: false })
      this.UploadInfo.Class.splice(index, 1)
    },
    CutTypesItem (item, index) { // 选择分类标签
      if (!item.active) {
        if (this.UploadInfo.Class.length < 1) {
          this.UploadInfo.Class.push({ id: item.id, name: item.name, deleteIndex: index })
          this.EditPhotoTypes({ index, active: true })
        } else {
          this.EditPhotoTypes({ index: this.UploadInfo.Class[this.UploadInfo.Class.length - 1].deleteIndex, active: false })
          this.UploadInfo.Class.splice(this.UploadInfo.Class.length - 1, 1)
          this.UploadInfo.Class.push({ id: item.id, name: item.name, deleteIndex: index })
          this.EditPhotoTypes({ index, active: true })
        }
      } else if (item.active) {
        this.UploadInfo.Class.map((thisItem, thisIndex) => {
          if (thisItem.id === item.id) {
            this.UploadInfo.Class.splice(thisIndex, 1)
          }
        })
        this.EditPhotoTypes({ index, active: false })
      }
    },
    DeleteImgItem (index) { // 删除单个图片
      this.PhotoData.splice(index, 1)
      this.PhotoUrlArr.splice(index, 1)
    },
    FileChange () { // 文件选取更新
      this.InputFileData = [...this.$refs.HideFileForPhoto.files] // 获取file数据
      let Bool = true
      this.InputFileData.map((item) => { // 遍历file数据
        if (item.size <= 5000000) { // 单张限制5MB
          let CheckBool = true
          this.PhotoData.map((subItem) => { // 查本次重复文件
            if (subItem.name === item.name && subItem.size === item.size) {
              this.$notify.error({
                title: 'error',
                message: 'The current image already exists!'
              })
              CheckBool = false
            }
          })
          if (CheckBool && this.PhotoData.length < 9) {
            this.PhotoData.push(item)
            this.PhotoUrlArr.push(this.GetFileURL(item))
          }
        } else {
          Bool = false
        }
      })
      if (!Bool) {
        this.$notify.error({
          title: 'error',
          message: 'Single picture cannot be more than 5mb!'
        })
      }
      this.$refs.HideFileForPhoto.value = ''
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
