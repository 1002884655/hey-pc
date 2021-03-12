<template>
  <div class="components WalletForRechargeRecord">
    <div class="Filter">
      <el-select class="Select" v-model="RechargeRecordDate" placeholder="Select bill date" no-data-text="no data" @change="TypeChange">
        <el-option v-for="(item, index) in RechargeRecordDateList" :key="index" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div class="List">
      <div class="Title flex-h">
        <span class="flex-item">Order number</span>
        <span class="flex-item">Time</span>
        <span class="flex-item">Types</span>
        <span class="flex-item">Items</span>
        <span class="flex-item">Amount</span>
        <span class="flex-item">Status</span>
        <span class="flex-item">Details</span>
      </div>
      <div class="Line flex-h" v-for="(item, index) in PageList" :key="index">
        <span class="flex-item">{{item.orderNo}}</span>
        <span class="flex-item">{{ToolClass.DateFormatYear(item.createTime)}}</span>
        <span class="flex-item">{{ToolClass.ReturnBillTypes(item.businessType, item.productType)}}</span>
        <span class="flex-item">{{item.content}} <img src="../../assets/img/coin.png" alt="" height="20"></span>
        <span class="flex-item">$ {{item.paymentMoney}}</span>
        <span class="flex-item">{{ToolClass.ReturnBillStatus(item.status)}}</span>
        <span class="flex-item"><a @click="$emit('ShowDetail', { Data: item, PopupType: 'recharge' })">Details</a></span>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="Pagination" v-if="Total">
      <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
/*
*/
import { Select, Option, Pagination } from 'element-ui'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapUserState, mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'WalletForRechargeRecord',
  props: ['data'],
  data () {
    return {
      Total: 0,
      PageData: {
        pageNum: 1,
        pageSize: 15
      },
      PageList: [],
      RechargeRecordDate: null,
      RechargeRecordDateList: []
    }
  },
  computed: {
    ...mapUserState({
      UserInfo: x => x.UserInfo // 用户信息
    })
  },
  components: {
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option
  },
  created () {
    this.Init()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapUserActions([
      'GetRechargeList'
    ]),
    Init () { // 初始化
      this.DataListInit() // 日期初始化
    },
    DataListInit () { // 日期初始化
      let NowDate = Date.now()
      let Month = new Date(NowDate).getMonth() + 1
      let Year = new Date(NowDate).getFullYear()
      for (let n = Month; n > 0; n--) {
        this.RechargeRecordDateList.push(`${Year}-${n > 9 ? n : `0${n}`}`)
      }
      if (Month < 12) {
        for (let n = 0; n < 12 - Month; n++) {
          this.RechargeRecordDateList.push(`${Year - 1}-${12 - n > 9 ? 12 - n : `0${12 - n}`}`)
        }
      }
      this.RechargeRecordDate = this.RechargeRecordDateList[0]
      this.ToGetPageList()
    },
    ToGetPageList () { //  获取列表
      this.GetRechargeList({
        data: {
          accountId: this.UserInfo.id,
          dateTime: this.RechargeRecordDate,
          ...this.PageData
        }
      }).then((res) => {
        this.PageData.pageNum = res.data.data.pageNum
        this.Total = res.data.data.total
        this.PageList = [...(res.data.data.list) || []]
      })
    },
    TypeChange () { // 类型更新
      this.PageData.pageNum = 1
      this.ToGetPageList()
    },
    PageChange (e) {
      this.PageData.pageNum = e
      this.ToGetPageList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
