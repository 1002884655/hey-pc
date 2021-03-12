<template>
  <div class="components SearchFilter">

    <!-- 二级分类 -->
    <nav class="NavLevel2List">
      <a v-for="(item, index) in NavLevel2List" :key="index" @click="CutNavLevel2(item, index)" :class="{'active': NavLevel2ActiveIndex === index}">{{item.value}}</a>
      <a @click="ShowNavLevel3Filter = !ShowNavLevel3Filter"><i class="iconfont iconshaixuan1"></i><span>FILTER</span></a>
    </nav>

    <!-- 三级分类 -->
    <ul class="NavLevel3List" v-show="ShowNavLevel3Filter">
      <li v-for="(item, index) in NavLevel3List" :key="index" class="flex-h">
        <span>{{item.Name}}</span>
        <div class="flex-item">
          <a v-for="(subItem, subIndex) in item.List" :key="subIndex" v-if="!((subItem.level - 0 === 1 || subItem.level - 0 === 2) && subItem.typeCode === 'type')" @click="CutNavLevel3(item, index, subItem, subIndex)" :class="{'active': item.ActiveIndex === subIndex}">{{subItem.name}}</a>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
/*
  页面名称：搜索过滤器组件（视频分类主页、搜索主页）
  创建人：许成祥
  创建时间：2019/12/31
  最近修改人：许成祥
  最近修改日期：2020/04/08
  备注： 无
*/
import { createNamespacedHelpers } from 'vuex'
const { mapActions: mapSearchActions } = createNamespacedHelpers('search')
export default {
  name: 'SearchFilter',
  props: ['DataLock'],
  data () {
    return {
      NavLevel2ActiveIndex: null, // 二级分类nav索引
      InitOptionsArr: [], // 初始参数
      NavLevel2List: [], // 二级分类nav
      ShowNavLevel3Filter: true, // 显隐三级分类
      NavLevel3List: [], // 三级分类过滤器数据
      EmitParams: { // 传出搜索过滤条件数据
        OrderBy: this.ToolClass.GetUrlParams('orderBy') === false ? 1 : this.ToolClass.GetUrlParams('orderBy') - 0,
        SearchParams: {
          endTime: null,
          startTime: null,
          types: this.ToolClass.GetUrlParams('types') === false ? '' : this.ToolClass.GetUrlParams('types')
        }
      },
      TypeIdList: [] // 三级分类id选择记录
    }
  },
  computed: {
  },
  components: {
  },
  created () {
    this.Init() // 初始化
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapSearchActions([
      'GetSearchFilter'
    ]),
    Init () { // 初始化
      this.GetSearchFilter().then((res) => { // 获取二三级过滤器
        if (res.data.code - 0 === 0) {
          this.NavLevel2List = [] // 二级过滤器清空
          this.NavLevel3List = [] // 三级过滤器清空
          for (let key in res.data.data) { // 构建过滤器数据
            if (key !== 'orderByList' && key !== 'areaList') { // 三级过滤器数据构建
              this.NavLevel3List.push({
                Name: res.data.data[key][0].typeName,
                Type: res.data.data[key][1].remark === undefined || res.data.data[key][1].remark === '' ? 1 : 2, // 过滤类型：1-非区间值 2-区间值
                ActiveIndex: null,
                List: [{ id: null, name: 'All', remark: '' }, ...res.data.data[key].slice(1)]
              })
              if (this.NavLevel3List[this.NavLevel3List.length - 1].Type === 1) { // 非区间值求取选中索引值
                this.NavLevel3List[this.NavLevel3List.length - 1].List.map((item, index) => {
                  let Types = this.ToolClass.GetUrlParams('types') || ''
                  Types.split(',').map((subItem, subIndex) => {
                    if (subItem - 0 === item.id) {
                      this.NavLevel3List[this.NavLevel3List.length - 1].ActiveIndex = index
                    }
                  })
                })
              } else { // 区间值求取选中索引值
                this.NavLevel3List[this.NavLevel3List.length - 1].List.map((item, index) => {
                  if (item.remark !== '') {
                    let Length = this.ToolClass.GetUrlParams('length') || ''
                    let ItemLength = `${JSON.parse(item.remark).min * 60 * 1000},${JSON.parse(item.remark).max * 60 * 1000}`
                    if (Length === ItemLength) {
                      this.NavLevel3List[this.NavLevel3List.length - 1].ActiveIndex = index
                    }
                  }
                })
              }
              this.NavLevel3List[this.NavLevel3List.length - 1].ActiveIndex = this.NavLevel3List[this.NavLevel3List.length - 1].ActiveIndex || 0
              this.TypeIdList.push(res.data.data[key][1].remark === undefined || res.data.data[key][1].remark === '' ? '' : null) // 构建过滤器id数据
            } else { // 二级过滤器数据构建
              if (this.ToolClass.GetUrlParams('orderBy') === false) {
                this.NavLevel2ActiveIndex = 0
              }
              res.data.data[key].map((item, index) => {
                if (index !== 0) {
                  this.NavLevel2List.push({ value: item.name, id: JSON.parse(item.remark).orderBy })
                  if (JSON.parse(item.remark).orderBy - 0 === this.ToolClass.GetUrlParams('orderBy') - 0) {
                    this.NavLevel2ActiveIndex = this.NavLevel2List.length - 1
                  }
                }
              })
            }
          }
          this.InitOptionsArr.map((pItem) => {
            this.NavLevel3List.map((item) => {
              item.List.map((subItem, subIndex) => {
                if (subItem.id === pItem) {
                  item.ActiveIndex = subIndex
                }
              })
            })
          })
          this.$emit('ListInit', this.EmitParams) // 过滤器数据更新抛出
        }
      })
    },
    CutNavLevel2 (item, index) { // 切换二级分类
      if (index !== this.NavLevel2ActiveIndex) {
        if (!this.DataLock) { // 非锁定状态下请求
          this.$emit('TriggerDataLock', true) // 数据锁定（防多次触发）
          this.NavLevel2ActiveIndex = index
          this.EmitParams.OrderBy = item.id
          this.$emit('Change', this.EmitParams) // 过滤器数据更新抛出
          history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'orderBy', item.id))
        }
      }
    },
    CutNavLevel3 (item, index, subItem, subIndex) { // 切换三级分类
      if (item.ActiveIndex !== subIndex) {
        if (!this.DataLock) { // 非锁定状态下请求
          this.$emit('TriggerDataLock', true) // 数据锁定（防多次触发）
          item.ActiveIndex = subIndex
          if (item.Type - 0 === 1) { // 1-非区间值 2-区间值
            this.TypeIdList[index] = subItem.id
            let Arr = []
            if (this.InitOptionsArr.length) {
              Arr = Arr.concat(this.InitOptionsArr)
            }
            this.TypeIdList.map((item) => {
              if (item !== null && item !== '') {
                Arr.push(item)
              }
            })
            this.EmitParams.SearchParams.types = Arr.join(',')
            history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'types', this.EmitParams.SearchParams.types))
          } else {
            this.EmitParams.SearchParams.endTime = subItem.remark !== '' && subItem.remark !== undefined ? JSON.parse(subItem.remark).max * 60 * 1000 : null
            this.EmitParams.SearchParams.startTime = subItem.remark !== '' && subItem.remark !== undefined ? JSON.parse(subItem.remark).min * 60 * 1000 : null
            history.pushState(null, null, this.ToolClass.ChangeUrlArg(window.location.href, 'length', `${this.EmitParams.SearchParams.startTime},${this.EmitParams.SearchParams.endTime}`))
          }
          this.$emit('Change', this.EmitParams) // 过滤器数据更新抛出
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
