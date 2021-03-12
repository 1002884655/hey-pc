/* eslint-disable */

import Vue from 'vue'

import '../assets/css/reset.scss'
import '../assets/css/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'

// 引入IE兼容promise脚本
import 'es6-promise/auto'

import { format } from 'timeago.js';
Vue.filter('changeTime', function (dateStr) {
  return format(dateStr, 'en_US');
})

// 引入项目通用（顶层）方法对象
import ToolClass from '../util/PublicMethod'
Vue.prototype.ToolClass = ToolClass

// 引入文字提示
// import { Tooltip } from 'element-ui'
// Vue.use(Tooltip)

// 引入localstorage
import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)


import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)