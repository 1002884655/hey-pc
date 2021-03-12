<template>
  <div class="components BgCropper" ref="BgCropper">
    <div class="centerLabel">

      <div class="flex-h Top">
        <div class="flex-item flex-h">
          <span class="flex-item">Picture editing</span>
          <a class="iconfont iconshangchuan" title="Select local image to upload" @click="SelectImg"></a>
          <a class="iconfont iconxuanzhuan-" title="Rotate the picture 90 degrees clockwise" @click="Rotate"></a>
          <input type="file" accept="image/*" id="ImageFile" hidden ref="ImageFile" @change="FileChange">
        </div>
        <div class="Close">
          <a class="iconfont iconguanbi" title="Close" @click="$emit('Close')"></a>
        </div>
      </div>

      <div class="Content flex-h">
        <div class="flex-item">
          <div class="CanvasArea">
            <div v-if="FileImageUrl !== null">
              <vue-cropper ref="Cropper" autoCrop :img="FileImageUrl" enlarge="3.7" centerBox fixed :fixedNumber="[7.5, 1]" />
            </div>
          </div>
          <span>Only JPG, PNG, JEPG, GIF, BMP are supported, and the size is no more than 5M.</span>
          <span>Please preview the image clipping effect before submitting the clipping result.</span>
        </div>
        <div class="PreviewArea">
          <div class="Icon">
            <div>
              <a><img :src="OriginalBase" class="centerLabel contain" alt=""></a>
            </div>
          </div>
          <a @click="CreateScreenshot">Preview</a>
        </div>
      </div>

      <div class="Bottom">
        <a @click="UpdateUserIcon">{{Loading ? 'Loading...' : 'Confirm'}}</a>
        <a @click="$emit('Close')">Cancel</a>
      </div>

    </div>
  </div>
</template>

<script>
/*
  页面名称：图片裁剪组件
  创建人：许成祥
  创建时间：2020/01/14
  最近修改人：许成祥
  最近修改日期：2020/01/15
  备注： 无
*/
import Vue from 'vue'
import { VueCropper } from 'vue-cropper'
import { createNamespacedHelpers } from 'vuex'
import { Notification } from 'element-ui'
Vue.prototype.$notify = Notification
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'BgCropper',
  props: ['data'],
  data () {
    return {
      Loading: false,
      DataLock: false, // 数据锁
      DragWidth: 0, // 裁剪区域宽度
      DragHeight: 0, // 裁剪区域高度
      RotateCounts: 90, // 旋转角度
      Canvas: null, // Canvas对象
      Context: null, // Context对象
      CopyPositionCoordinates: [], // 复制坐标
      PositionCoordinates: [[0, 0], [0, 0], [0, 0], [0, 0]], // 裁剪位置坐标
      CanvasWidth: 0, // canvas宽度
      CanvasHeight: 0, // canvas高度
      FileImageUrl: null, // 图片本地地址
      SubCanvas: null, // 截图canvas对象
      SubContext: null, // 截图Context对象
      OriginalBase: null, // 截图src
      Img: null // 图片对象
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo
    })
  },
  components: {
    'vue-cropper': VueCropper
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'UploadBackground',
      'GetUserInfoByToken'
    ]),
    UpdateUserIcon () {
      if (!this.DataLock && this.OriginalBase !== null) {
        this.DataLock = true // 数据锁定（防止多次触发）
        this.Loading = true
        this.UploadBackground({
          data: {
            accountId: this.UserInfo.id,
            base64Data: this.OriginalBase
          }
        }).then(() => {
          this.Loading = false
          this.GetUserInfoByToken({ params: { token: this.$localStorage.get('heypornid') } }).then((res) => {
            if (res.data.code - 0 === 0) {
              this.$notify.success({
                title: 'success',
                message: 'Avatar updated successfully!'
              })
              this.DataLock = false // 数据解锁
              this.$emit('Change')
              this.$emit('Close')
            }
          }).catch(() => {
            this.DataLock = false // 数据解锁
          })
        }).catch(() => {
          this.Loading = false
          this.DataLock = false // 数据解锁
        })
      }
    },
    CreateScreenshot () { // 生成截图
      if (!this.DataLock) {
        this.DataLock = true // 数据锁定（防止多次触发）
        this.$refs.Cropper.getCropData(data => {
          this.OriginalBase = data

          let Img = new Image() // 创建图片对象
          Img.crossOrigin = ''
          Img.id = 'ImageCroppingSubImage'
          Img.src = this.OriginalBase
          Img.style.opacity = '0'
          this.$refs.BgCropper.appendChild(Img)
          this.DataLock = false
        })
      }
    },
    Rotate () { // 图片旋转
      if (this.$refs.Cropper) {
        this.$refs.Cropper.rotateRight()
      }
    },
    SelectImg () { // 选择本地图片
      this.$refs.ImageFile.click()
    },
    FileChange () { // 选中本地目标图片
      this.FileImageUrl = this.getObjectURL(this.$refs.ImageFile.files[0])
    },
    getObjectURL (file) { // 获取本地图片地址
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
