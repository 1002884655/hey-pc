<template>
  <div class="components WalletForExpensesRecord">
    <div class="Filter">
      <el-select class="Select" v-model="ExpensesRecordType" placeholder="Select bill type" no-data-text="no data" @change="TypeChange">
        <el-option v-for="(item, index) in ExpensesRecordTypeList" :key="index" :label="item.value" :value="item.id"></el-option>
      </el-select>
      <el-select class="Select" v-model="ExpensesRecordDate" placeholder="Select bill date" no-data-text="no data" @change="TypeChange">
        <el-option v-for="(item, index) in ExpensesRecordDateList" :key="index" :label="item" :value="item"></el-option>
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
        <span class="flex-item">{{item.obj}}</span>
        <span class="flex-item">$ {{item.paymentMoney}}</span>
        <span class="flex-item">{{ToolClass.ReturnBillStatus(item.status)}}</span>
        <span class="flex-item"><a @click="$emit('ShowDetail', { Data: item, PopupType: 'expenses' })">Details</a></span>
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
  name: 'WalletForExpensesRecord',
  props: ['data'],
  data () {
    return {
      Total: 100,
      PageData: {
        pageNum: 1,
        pageSize: 15
      },
      PageList: [],
      ExpensesRecordDate: null,
      ExpensesRecordDateList: [],
      ExpensesRecordType: 1,
      ExpensesRecordTypeList: [
        { value: 'Fans club', id: 1 },
        { value: 'Videos', id: 2 },
        { value: 'Tips', id: 3 },
        { value: 'Buy album', id: 5 },
        { value: 'HeyCoin', id: 6 }
      ]
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
      'GetExpenseBill'
    ]),
    Init () { // 初始化
      this.DataListInit() // 日期初始化
    },
    ReturnStatus (status) {
      switch (status - 0) {
        case 0:
          return 'unpaid'
        case 1:
          return 'payment processing'
        case 2:
          return 'payment success'
        case 3:
          return 'payment failure'
        case 4:
          return 'order timeout cancellation'
        case 5:
          return 'order completion'
        case 6:
          return 'close the order'
        default:
          return ''
      }
    },
    ReturnType (type) {
      let Name = ''
      this.ExpensesRecordTypeList.map((item) => {
        if (item.id - 0 === type - 0) {
          Name = item.value
        }
      })
      return Name
    },
    DataListInit () { // 日期初始化
      let NowDate = Date.now()
      let Month = new Date(NowDate).getMonth() + 1
      let Year = new Date(NowDate).getFullYear()
      for (let n = Month; n > 0; n--) {
        this.ExpensesRecordDateList.push(`${Year}-${n > 9 ? n : `0${n}`}`)
      }
      if (Month < 12) {
        for (let n = 0; n < 12 - Month; n++) {
          this.ExpensesRecordDateList.push(`${Year - 1}-${12 - n > 9 ? 12 - n : `0${12 - n}`}`)
        }
      }
      this.ExpensesRecordDate = this.ExpensesRecordDateList[0]
      this.ToGetExpenseBill()
    },
    ToGetExpenseBill () { //  获取消费记录
      this.GetExpenseBill({
        data: {
          accountId: this.UserInfo.id,
          dateTime: this.ExpensesRecordDate,
          ...this.PageData,
          type: this.ExpensesRecordType
        }
      }).then((res) => {
        this.PageData.pageNum = res.data.data.pageNum
        this.Total = res.data.data.total
        this.PageList = [...(res.data.data.list) || []]
      })
    },
    TypeChange () { // 类型更新
      this.PageData.pageNum = 1
      this.ToGetExpenseBill()
    },
    PageChange (e) {
      this.PageData.pageNum = e
      this.ToGetExpenseBill()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
