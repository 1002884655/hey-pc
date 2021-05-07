<template>
  <div class="components HeyPornLiver" :test="testName">

    <div class="RoomInfo flex-h">
      <div class="Cover">
        <img v-if="CoverUrl !== null" :src="CoverUrl" class="centerLabel cover" alt="">
        <a @click="$refs.CoverFile.click()" v-if="RoomInfo === null">upload</a>
        <input type="file" style="display: none;" ref="CoverFile" @change="CoverFileChange">
      </div>
      <div class="flex-item">
        <div>
          <span v-if="!IsEditRoomName">{{RoomName || `Displayname's tudio`}}</span>
          <input v-else type="text" v-model="RoomName" placeholder="Displayname's tudio">
          <a v-if="RoomInfo === null" class="Edit" @click="IsEditRoomName = !IsEditRoomName">{{IsEditRoomName ? 'Save' : 'Edit'}}</a>
        </div>
        <div>
          <span>{{UserInfo !== null ? UserInfo.nick : ''}}</span>
          <i class="iconfont iconyaoqinghaoyou"></i>
          <span>{{ToolClass.ReturnViews(UserCounts)}}</span>
        </div>
      </div>
    </div>

    <div class="LiverContainer">
      <div>
        <div class="CameraPopup centerLabel" v-show="ShowCameraPopup" @click.stop="ShowCameraPopup = true">
          <span>Camera</span>
          <div class="Line">
            <span>Camera</span>
            <div class="Select">
              <el-select v-model="CameraType" placeholder="Select camera type" no-data-text="no data">
                <el-option v-for="item in VideoInfo" :key="item.deviceId" :label="item.label" :value="item.deviceId"></el-option>
              </el-select>
            </div>
          </div>
          <div class="Line">
            <span>Resolution ratio</span>
            <div class="Select">
              <el-select v-model="CameraCapacity" placeholder="Select capacity" no-data-text="no data">
                <el-option v-for="item in 5" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </div>
          <div class="flex-h">
            <a class="flex-item" @click.stop="ShowCameraPopup = false">Cancel</a>
            <a class="flex-item active" @click.stop="CutVideoInfo">Save</a>
          </div>
        </div>
        <div class="LiverPlayer" id="LiverPlayer"></div>
        <span class="centerLabel LiveTimeCounts" v-if="RoomInfo !== null && LiveTimeCounts < 6">{{LiveTimeCounts}}</span>
      </div>
    </div>

    <div class="BottomOpt flex-h">
      <div class="flex-item"></div>
      <!-- <div class="LiveOpt">
        <a>
          <i class="iconfont iconjingxiang"></i>
          <span>Mirroring</span>
        </a>
      </div> -->
      <div class="LiveOpt">
        <a @click.stop="ShowCameraPopup = !ShowCameraPopup">
          <i class="iconfont iconcamera"></i>
          <span>Camera</span>
        </a>
      </div>
      <div class="LiveOpt MIC">
        <div v-show="ShowVolProgress" @click.stop="ShowVolProgress = true">
          <div class="Vol" ref="VolProgress" @click="CutVol">
            <div>
              <div :style="{height: `${CurrentVol}px`}"></div>
            </div>
            <a @mousedown="MoveVol" ref="VolPoint" :style="{bottom: `${CurrentVol - 6}px`}"></a>
          </div>
          <span>{{CurrentVol}}</span>
        </div>
        <a @click.stop="ShowVolProgress = !ShowVolProgress">
          <i class="iconfont icongj-mkf"></i>
          <span>MIC</span>
        </a>
      </div>
      <div class="LiveOpt SPK">
        <ul v-show="ShowSpkPopup" @click.stop="ShowSpkPopup = true" :style="{top: `-${SoundInfo.length * 30 + 20}px`}">
          <li v-for="(item, index) in SoundInfo" :key="index" class="flex-h" :class="{'active': item.deviceId === SoundType}" @click.stop="CutSpk(item)">
            <a class="iconfont icondui"></a>
            <span class="flex-item">{{item.label}}</span>
          </li>
        </ul>
        <a @click.stop="ShowSpkPopup = !ShowSpkPopup">
          <i class="iconfont iconshengyin1"></i>
          <span>SPK</span>
        </a>
      </div>
      <a :class="{'active': !IsLoadingStart}" @click="TriggerLive">{{IsLoadingStart ? 'Loading...' : IsStart ? 'END' : 'START'}}</a>
    </div>

  </div>
</template>

<script>
/*
*/
import * as QNRTC from 'pili-rtc-web'
import { Select, Option } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState } = createNamespacedHelpers('user')
const { mapActions: mapLiveActions } = createNamespacedHelpers('live')
export default {
  name: 'HeyPornLiver',
  props: ['data'],
  inject: ['testName'],
  data () {
    return {
      IsLoadingStart: false,
      LiveTimeCounts: 6,
      LiveTimer: null,
      UserCounts: 0,
      IsEditRoomName: false,
      RoomName: '',
      CoverUrl: null,
      CurrentVideoTrack: null, // 当前视频设备
      CurrentSoundTrack: null, // 当前音频设备
      VideoInfo: [], // 视频设备列表
      SoundInfo: [], // 音频设备列表
      RoomInfo: null, // 直播间信息
      LocalTracks: null, // 本地设备对象
      MyRoom: null, // 我的直播间对象
      CurrentVol: 50, // 当前音量
      ShowCameraPopup: false, // 显隐摄像头设置弹窗
      ShowVolProgress: false, // 显隐音量滑动条
      ShowSpkPopup: false, // 显隐音频设置弹窗
      CameraCapacity: null,
      CameraType: null, // 当前选择视频设备id
      SoundType: null, // 当前选择音频设备id
      CurrentSoundChannel: 3,
      CoverFile: null, // 直播间封面
      IsStart: false, // 是否已开播
      DataLock: false // 数据锁
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    'el-select': Select,
    'el-option': Option
  },
  created () {
    if (this.UserInfo !== null) {
      this.GetLivingRoomInfo({ params: { accountId: this.UserInfo.id, userId: this.UserInfo.id } }).then((res) => {
        if (res.data.data !== null && res.data.data.roomToken !== null) {
          this.RoomInfo = res.data.data
          this.Init()
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.ToolClass.WindowClick(() => {
        this.ShowVolProgress = false
        this.ShowCameraPopup = false
        this.ShowSpkPopup = false
      })
    })
  },
  methods: {
    ...mapLiveActions([
      'CreateLiveRoom',
      'LiveStart',
      'LiveStop',
      'GetChatRoomShutupList',
      'GetLivingRoomInfo'
    ]),
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
    CoverFileChange () {
      this.CoverFile = this.$refs.CoverFile.files[0]
      this.CoverUrl = this.GetFileURL(this.CoverFile)
    },
    CutVideoInfo () { // 切换视频输入设备
      if (this.CameraType !== null) {
        this.VideoInfo.map((item) => {
          if (item.deviceId === this.CameraType) {
            this.CurrentVideoTrack = { ...item }
            this.ChangeTracks()
          }
        })
      } else {
        this.ShowCameraPopup = false
      }
    },
    async ChangeTracks () { // 切换设备
      this.LocalTracks = await QNRTC.deviceManager.getLocalTracks({
        video: { enabled: true, deviceId: this.CurrentVideoTrack.deviceId, bitrate: 1000 },
        audio: { enabled: true, deviceId: this.CurrentSoundTrack.deviceId }
      })
      for (const localTrack of this.LocalTracks) {
        if (localTrack.info.kind === 'video') {
          localTrack.play(document.getElementById('LiverPlayer'), true)
          this.ShowCameraPopup = false
        }
      }
    },
    CheckLiveForm () { // 校验直播信息
      if (this.CoverFile === null) { // 封面不能为空
        this.$notify.error({
          title: 'error',
          message: 'Please add live room cover'
        })
        return false
      }
      if (this.RoomName === '') { // 房间名不能为空
        this.$notify.error({
          title: 'error',
          message: 'Please add live room name'
        })
        return false
      }
      return true
    },
    TriggerLive () {
      if (!this.IsStart) { // 开播
        if (this.CheckLiveForm() && !this.IsLoadingStart) {
          this.IsLoadingStart = true
          this.IsEditRoomName = false
          let FileData = new FormData()
          FileData.append('file', this.CoverFile)
          this.CreateLiveRoom({ params: { accountId: this.UserInfo.id, screenType: 2, roomName: this.RoomName, roomMode: 2 }, data: FileData }).then((res) => { // 创建直播房间
            this.LiveTimeCounts = 5
            this.RoomInfo = res.data.data
            window.clearInterval(this.LiveTimer)
            this.LiveTimer = window.setInterval(() => {
              if (this.LiveTimeCounts) {
                this.LiveTimeCounts--
              } else {
                window.clearInterval(this.LiveTimer)
                this.RoomInit() // 房建初始化
              }
            }, 1000)
          }).catch(() => {
            this.IsLoadingStart = false
          })
        }
      } else { // 下播
        if (!this.DataLock) {
          this.ToolClass.Confirm('Close live?', 'Longer live broadcast will gain more viewers. Should you close the live broadcast?', () => { }, (close) => {
            this.DataLock = true
            this.LiveStop({ params: { liveRoomId: this.RoomInfo.id, accountId: this.UserInfo.id } }).then(() => {
              this.StopAllTracks()
              this.IsStart = false
              this.DataLock = false
              this.LiveTimeCounts = 6
              this.CoverUrl = null
              this.CoverFile = null
              this.RoomInfo = null
              this.RoomName = ''
              this.UserCounts = 0
              this.$refs.CoverFile.value = ''
              this.$emit('Stop')
              close()
            }).catch(() => {
              this.StopAllTracks()
              this.IsStart = false
              this.DataLock = false
              this.LiveTimeCounts = 6
              this.CoverUrl = null
              this.CoverFile = null
              this.RoomInfo = null
              this.RoomName = ''
              this.UserCounts = 0
              this.$refs.CoverFile.value = ''
              this.$emit('Stop')
              close()
            })
          }, 'Close live')
        }
      }
    },
    Init () { // 初始化
      if (this.RoomInfo !== null) { // 当前有正在直播房间，续播
        this.CoverUrl = this.RoomInfo.sourcePath
        this.RoomName = this.RoomInfo.roomName
        this.RoomInit() // 房建初始化
      }
    },
    StopAllTracks () { // 停止所有设备
      for (const track of this.LocalTracks) {
        track.release()
      }
      this.MyRoom.leaveRoom()
      this.LocalTracks = null
      this.VideoInfo = []
      this.SoundInfo = []
      this.CurrentVideoTrack = null
      this.CurrentSoundTrack = null
      this.CameraType = null
      this.SoundType = null
    },
    async GetEquipmentInfo () { // 采集设备信息
      this.LocalTracks = await QNRTC.deviceManager.getLocalTracks({
        audio: { enabled: true, tag: 'audio' },
        video: { enabled: true, tag: 'video', width: 1920, height: 1080 }
      })
      await this.MyRoom.publish(this.LocalTracks)
      for (const localTrack of this.LocalTracks) {
        if (localTrack.info.tag === 'audio') continue
        localTrack.play(document.getElementById('LiverPlayer'), true)
        this.IsLoadingStart = false
        this.LiveStart({ params: { accountId: this.UserInfo.id, liveRoomId: this.RoomInfo.id } }).then(() => {
          this.$emit('Start', this.RoomInfo)
        })
        this.IsStart = true
      }
      this.MyRoom.addMergeStreamTracks([
        { trackId: this.LocalTracks[1].info.trackId, x: 0, y: 0, w: 1920, h: 1080, stretchMode: 'aspectFit' },
        { trackId: 'xxxxx' }
      ])
      this.MyRoom.setDefaultMergeStream(1920, 1080)
      QNRTC.deviceManager.on('device-update', (info) => { // 设备更新
        // info.map((item) => {
        //   console.log(`item is`, item)
        // })
      })
    },
    async RoomInit () { // 房间初始化
      if (this.RoomInfo !== null) {
        this.MyRoom = new QNRTC.TrackModeSession()
        await this.MyRoom.joinRoomWithToken(this.RoomInfo.roomToken)
        this.GetEquipmentInfo() // 采集设备信息
        if (QNRTC.deviceManager.deviceInfo) {
          this.VideoInfo = []
          this.SoundInfo = []
          QNRTC.deviceManager.deviceInfo.map((item) => {
            if (item.kind === 'videoinput') {
              this.VideoInfo.push(item)
            } else if (item.kind === 'audioinput') {
              this.SoundInfo.push(item)
            }
          })
          this.CurrentVideoTrack = { ...this.VideoInfo[0] }
          this.CurrentSoundTrack = { ...this.SoundInfo[0] }
          this.CameraType = this.CurrentVideoTrack.deviceId
          this.SoundType = this.CurrentSoundTrack.deviceId
        }
      }
    },
    MoveVol () { // 滑动音量
      this.$refs.VolPoint.onmousemove = (e) => {
        let VolNum = Math.floor(this.$refs.VolProgress.getBoundingClientRect().top + this.$refs.VolProgress.getBoundingClientRect().height - e.clientY)
        this.CurrentVol = VolNum >= 0 ? VolNum <= 100 ? VolNum : 100 : 0
      }
      this.$refs.VolPoint.onmouseup = () => {
        this.$refs.VolPoint.onmousemove = null
      }
    },
    CutVol (e) { // 切换音量
      let VolNum = Math.floor(this.$refs.VolProgress.getBoundingClientRect().top + this.$refs.VolProgress.getBoundingClientRect().height - e.clientY)
      this.CurrentVol = VolNum >= 0 ? VolNum <= 100 ? VolNum : 100 : 0
    },
    CutSpk (item) {
      this.ShowSpkPopup = true
      this.CurrentSoundTrack = { ...item }
      this.SoundType = item.deviceId
      this.ChangeTracks()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
