/* eslint-disable */
import Axios from 'axios'
const IsOnLine = true //是否线上环境
const ToolClass = {
  RongYunKey: IsOnLine ? 'qd46yzrfqxyxf' : 'bmdehs6pbahqs', // 融云聊天室appkey
  ReturnBillTypes (businessType, productType) {
    if (businessType - 0 === 1) { // 充值记录
      return 'Top up HeyCoin'
    } else if (businessType - 0 === 2) { // 消费记录
      switch (productType - 0) {
        case 1: // 加入粉丝团
          return 'Fans club'
        case 2: // 购买视频
          return 'Videos'
        case 3: // 打赏视频
          return 'Tips'
        case 4: // 购买虚拟币
          return 'Top up HeyCoin'
        case 5: // 购买视频专辑
          return 'Album'
        case 9: // 粉丝团续费
          return 'Fans club'
        default:
          return ''
      }
    } else if (businessType - 0 === 3) { // 创作收入
      return 'Video Earnings'
    } else if (businessType - 0 === 4) { // 粉丝收入
      return 'Fansclub Earnings'
    } else if (businessType - 0 === 5) { // 直播收入
      return 'LiveCam Earnings'
    } else if (businessType - 0 === 6) { // 提现记录
      return 'Withdraw'
    } else {
      return ''
    }
  },
  ReturnBillStatus (status, type = null) {
    switch (status - 0) {
      case 0:
        return 'unpaid'
      case 1:
        return 'processing'
      case 2:
        return 'successful'
      case 3:
        return 'failed'
      case 4:
        return 'timeout'
      case 5:
        return 'successful'
      case 6:
        return 'close'
      case 7:
        return 'close'
      default:
        return ''
    }
  },
  LinkTo (url) {
    window.location.href = url
  },
  Axios (resolve, reject, target, context, payload = {}, code = 0, commit = null, params = null, hasdata = false) { // Axios
    Axios({
      method: target.method,
      url: target.url,
      ...payload
    }).then(res => {
      if (res.data.code - 0 === code - 0) {
        if (commit !== null) {
          context.commit(commit, params === null ? res.data.data : hasdata ? { ...params, data: res.data.data } : params)
        }
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((res) => {
      reject(res)
    })
  },
  ReturnViews (num) {
    num = `${(num - 0).toFixed(0)}`
    if (num.length <= 3) {
      return `${num}`
    } else if (num.length > 3 && num.length < 7) {
      return `${num.substring(0, num.length - 3)}.${num.substring(num.length - 3, num.length - 2)}K`
    } else if (num.length >= 7 && num.length < 10) {
      return `${num.substring(0, num.length - 6)}.${num.substring(num.length - 6, num.length - 5)}M`
    } else if (num.length >= 10) {
      return `${num.substring(0, num.length - 9)}.${num.substring(num.length - 9, num.length - 8)}B`
    }
  },
  ChangeUrlParams (Arr, DeleteAll = false) {
    if (DeleteAll) { // 只保留目标参数
      window.history.pushState({}, 0, window.location.href.split('?')[0])
    }
    Arr.map((item) => {
      window.history.pushState(null, null, this.ChangeUrlArg(window.location.href, item.name, item.value))
    })
  },
  IsLeapYear (year) {
    return !(year % (year % 100 ? 4 : 400))
  },
  DoubleNum (num) { // 单位数补位
    return num > 9 ? num : `0${num}`
  },
  CheckEmail (target) { // 校验邮箱格式
    let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    return reg.test(target)
  },
  GetUrlParams (name) { // 获取url参数
    let query = window.location.search.substring(1)
    let vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=')
      if (pair[0] == name) { return pair[1] }
    }
    return false
  },
  FilterTimer (originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    return `${y}-${m}-${d}`
  },
  DateFormatYear (date = null, format = 'YY:MM:DD hh:mm:ss') {
    if (date !== null) {
      date = new Date(date)
      let YY = date.getFullYear()
      let MM = date.getMonth() + 1
      let DD = date.getDate()
      let hh = date.getHours()
      let mm = date.getMinutes()
      let ss = date.getSeconds()
      if (format === 'YY:MM:DD') {
        return `${YY}-${MM > 9 ? MM : `0${MM}`}-${DD > 9 ? DD : `0${DD}`}`
      }
      if (format === 'hh:mm:ss') {
        return `${hh > 9 ? hh : `0${hh}`}:${mm > 9 ? mm : `0${mm}`}:${ss > 9 ? ss : `0${ss}`}`
      }
      if (format === 'hh:mm') {
        return `${hh > 9 ? hh : `0${hh}`}:${mm > 9 ? mm : `0${mm}`}`
      }
      if (format === 'English') {
        let Month = ''
        switch (MM) {
          case 1:
            Month = 'Jan'
            break
          case 2:
            Month = 'Feb'
            break
          case 3:
            Month = 'Mar'
            break
          case 4:
            Month = 'Apr'
            break
          case 5:
            Month = 'May'
            break
          case 6:
            Month = 'Jun'
            break
          case 7:
            Month = 'Jul'
            break
          case 8:
            Month = 'Aug'
            break
          case 9:
            Month = 'Sept'
            break
          case 10:
            Month = 'Oct'
            break
          case 11:
            Month = 'Nov'
            break
          case 12:
            Month = 'Dec'
            break
          default:
            Month = ''
        }
        return `${Month} ${DD},${YY}`
      }
      return `${YY}-${MM > 9 ? MM : `0${MM}`}-${DD > 9 ? DD : `0${DD}`} ${hh > 9 ? hh : `0${hh}`}:${mm > 9 ? mm : `0${mm}`}:${ss > 9 ? ss : `0${ss}`}`
    } else {
      return ''
    }
  },
  DateFormat (timestamp) { // 格式化时间
    if (timestamp) {
      let mm = Math.floor(timestamp / (1000 * 60))
      let ss = Math.floor(timestamp % (1000 * 60) / 1000)
      return `${mm > 9 ? mm : '0' + mm}:${ss > 9 ? ss : '0' + ss}`
    }
  },
  WindowClick (callback) { // window点击事件
    let WindowClickFn = window.onclick
    window.onclick = () => {
      if (WindowClickFn) {
        WindowClickFn()
      }
      callback()
    }
  },
  WindowResize (callback) { // window尺寸变化
    let WindowResize = window.onresize
    window.onresize = () => {
      if (WindowResize) {
        WindowResize()
      }
      callback()
    }
  },
  DocumentKeyDown (callback) { // document键盘输入事件
    let DocumentKeyDownFn = document.onkeydown
    document.onkeydown = (e) => {
      e = e || event
      if (DocumentKeyDownFn) {
        DocumentKeyDownFn()
      }
      callback(e)
    }
  },
  ImageObjectFit () { // image object-fit IE兼容
    if (!!window.ActiveXObject || 'ActiveXObject' in window) { // 判断IE
      let TargetArr = document.getElementsByTagName('img')
      for (let n = 0; n < TargetArr.length; n++) {
        if (TargetArr[n].getAttribute('class').indexOf('cover') !== -1) {
          TargetArr[n].style.display = 'none'
          TargetArr[n].parentElement.style.backgroundRepeat = 'norepeat'
          TargetArr[n].parentElement.style.backgroundSize = 'cover'
          TargetArr[n].parentElement.style.backgroundPosition = 'center center'
          TargetArr[n].parentElement.style.backgroundImage = `url(${TargetArr[n].getAttribute('src')})`
        }
      }
    }
  },
  CheckUrl (url) { // 校验url
    let reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
    return reg.test(url)
  },
  CheckPhone () { // 校验手机
    return false
  },
  ReturnName (name, num = 20) { // 返回人名
    return name.length < num ? name : `${name.substring(0, 20)}...`
  },
  Confirm (Title = 'Confirm', Content = 'Something', Close = () => { }, Confirm = () => { }, SureText = 'Sure') {
    // 创建弹窗容器
    let MainConfirm = document.createElement('div')
    MainConfirm.className = 'MainConfirm'
    MainConfirm.id = 'MainConfirm'
    document.getElementsByTagName('body')[0].appendChild(MainConfirm)

    // 创建弹窗框
    let MainPopupBox = document.createElement('div')
    MainPopupBox.className = 'centerLabel'
    MainConfirm.appendChild(MainPopupBox)

    let ContentHtml = ''

    if (typeof (Content) === 'object') {
      Content.map((item) => {
        ContentHtml += `<span>${item}</span>`
      })
    } else {
      ContentHtml = `<span>${Content}</span>`
    }

    MainPopupBox.innerHTML = `
      <span class="Title">${Title}</span>
      <div class="Content">
        ${ContentHtml}
      </div>
      <div class="Bottom">
        <a id="MainConfirmCancel">Cancel</a>
        <a id="MainConfirmSure">${SureText}</a>
      </div>
    `

    document.getElementById('MainConfirmCancel').onclick = () => {
      Close()
      document.getElementsByTagName('body')[0].removeChild(MainConfirm)
    }
    document.getElementById('MainConfirmSure').onclick = () => {
      Confirm(() => {
        document.getElementsByTagName('body')[0].removeChild(MainConfirm)
      })
    }
  },
  Popup (Type = 'alert', Title = 'Alert', Content = 'Something', Close = () => { }, Confirm = () => { }, SureText = 'Sure') {
    // 创建弹窗容器
    let MainPopup = document.createElement('div')
    MainPopup.className = 'MainPopup'
    MainPopup.id = 'MainPopup'
    document.getElementsByTagName('body')[0].appendChild(MainPopup)

    // 创建弹窗框
    let MainPopupBox = document.createElement('div')
    MainPopupBox.className = 'MainPopupBox centerLabel'
    MainPopup.appendChild(MainPopupBox)

    MainPopupBox.innerHTML = `
      <div class="Title">
        <span>${Title}</span>
        <a class="iconfont iconguanbi" id="MainPopupClose"></a>
      </div>
      <div class="Content">
        ${typeof (Content) === 'string' ? `<span>${Content}</span>` : `<div>${Content.innerHTML}</div>`}
      </div>
    `
    // 创建底部栏
    let MainPopupBottom = document.createElement('div')
    MainPopupBottom.className = 'Bottom flex-h'
    MainPopupBox.appendChild(MainPopupBottom)

    if (Type === 'Alert' || Type === 'alert') { // alert弹窗
      MainPopupBottom.innerHTML = `<a class="flex-item" id="MainPopupOk">OK</a>`
      document.getElementById('MainPopupOk').onclick = () => {
        Close()
        document.getElementsByTagName('body')[0].removeChild(MainPopup)
        // MainPopup.remove()
      }
    } else { // confirm弹窗
      MainPopupBottom.innerHTML = `<a class="flex-item Cancel" id="MainPopupCancel">Cancel</a><a class="flex-item" id="MainPopupSure">${SureText}</a>`
      document.getElementById('MainPopupCancel').onclick = () => {
        Close()
        document.getElementsByTagName('body')[0].removeChild(MainPopup)
        // MainPopup.remove()
      }
      document.getElementById('MainPopupSure').onclick = () => {
        Confirm()
        document.getElementsByTagName('body')[0].removeChild(MainPopup)
        // MainPopup.remove()
      }
    }

    // 绑定弹窗关闭事件
    document.getElementById('MainPopupClose').onclick = () => {
      Close()
      document.getElementsByTagName('body')[0].removeChild(MainPopup)
      // MainPopup.remove()
    }
  },
  ChangeUrlArg (url, arg, val) { // 替换url参数
    let pattern = arg + '=([^&]*)'
    let replaceText = arg + '=' + val
    if (url.match(pattern)) {
      let tmp = '/(' + arg + '=)([^&]*)/gi'
      tmp = url.replace(eval(tmp), replaceText)
      return tmp
    } else {
      if (url.match('[\?]')) {
        return url + '&' + replaceText
      } else {
        return url + '?' + replaceText
      }
    }
  },
  MatchingCapacity (target, speed) { // 匹配清晰度
    let CurrentCapacity = 4 // 默认 720p
    let CurrentIndex = 0
    let Arr = []
    if (speed <= 70) { // 360p
      CurrentCapacity = 1
      CurrentIndex = 0
    } else if (speed > 70 && speed <= 179) { // 576p
      CurrentCapacity = 2
      CurrentIndex = 1
    } else if (speed > 179 && speed <= 280) { // 720p
      CurrentCapacity = 4
      CurrentIndex = 2
    } else if (speed > 280) { // 1080p
      CurrentCapacity = 8
      CurrentIndex = 3
    }
    if (target[`${CurrentCapacity}`] - 0 === 0) { // 匹配清晰度无资源，取最佳清晰度
      for (let n in target) {
        Arr.push({ name: n, value: target[n] })
      }
      for (let n = CurrentIndex; n >= 0; n--) {
        if (Arr[n].value - 0) {
          return Arr[n].name
        }
      }
      for (let n = CurrentIndex; n < 5; n++) {
        if (Arr[n].value - 0) {
          return Arr[n].name
        }
      }
    }
    return CurrentCapacity
  }
}

export default ToolClass
