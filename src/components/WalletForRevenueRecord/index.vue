<template>
  <div class="components WalletForRevenueRecord">
    <div class="Filter">
      <el-select class="Select" v-model="RevenueRecordType" placeholder="Select bill type" no-data-text="no data" @change="TypeChange">
        <el-option v-for="(item, index) in RevenueRecordTypeList" :key="index" :label="item.value" :value="item.id"></el-option>
      </el-select>
      <el-select class="Select" v-model="RevenueRecordDate" placeholder="Select bill date" no-data-text="no data" @change="TypeChange">
        <el-option v-for="(item, index) in RevenueRecordDateList" :key="index" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div class="List">
      <div class="Title flex-h">
        <span class="flex-item">{{RevenueRecordType - 0 === 4 ? 'Live room id' : 'Order number'}}</span>
        <span class="flex-item">Time</span>
        <span class="flex-item">Types</span>
        <span class="flex-item">Items</span>
        <span class="flex-item">Amount</span>
        <span class="flex-item">Status</span>
        <span class="flex-item">Details</span>
      </div>
      <div class="Line flex-h" v-for="(item, index) in PageList" :key="index">
        <span class="flex-item">{{item.orderNo || item.liveRoomId}}</span>
        <span class="flex-item">{{ToolClass.DateFormatYear(item.createTime)}}</span>
        <span class="flex-item">{{ToolClass.ReturnBillTypes(item.businessType, item.productType)}}</span>
        <span class="flex-item">{{item.obj || item.content}}</span>
        <span class="flex-item">$ {{item.toUserIncome || item.paymentMoney || item.totalIncome}}</span>
        <span class="flex-item">{{item.status - 0 === 1 || item.recordStatus - 0 === 0 ? 'pending' : item.status - 0 === 2 || item.recordStatus - 0 === 1 ? 'completed' : ''}}</span>
        <span class="flex-item"><a @click="ShowDetails(item)">Details</a></span>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="Pagination" v-if="Total">
      <el-pagination background :page-size="PageData.pageSize" :current-page="PageData.pageNum" layout="prev, pager, next, jumper" :total="Total" @current-change="PageChange"></el-pagination>
    </div>

    <div class="BillDetailsPopup" v-if="CurrentTarget !== null">
      <div class="centerLabel">
        <div class="Title">
          <span>Bill details</span>
          <a class="iconfont iconguanbi" @click="CurrentTarget = null; DetailIndex = 0"></a>
        </div>
        <div class="Info">
          <div class="Nav">
            <a :class="{'active': DetailIndex === 0}" @click="CutDetailNav(0)">Gifts Recevied</a>
            <a :class="{'active': DetailIndex === 1}" @click="CutDetailNav(1)">Paid Viewers</a>
          </div>
          <span>{{DetailIndex === 0 ? 'Gifts Recevied' : 'Paid Viewers'}} {{ToolClass.DateFormatYear(CurrentTarget.createTime)}}-{{ToolClass.DateFormatYear(CurrentTarget.endTime)}} (Divided into {{CurrentTarget.ratio * 100}}%)</span>
          <div class="List">
            <div class="flex-h" v-for="(item, index) in DetailList" :key="index">
              <div>
                <span>{{item.userName}}</span>
              </div>
              <div>
                <span>{{ToolClass.DateFormatYear(item.createTime)}}</span>
              </div>
              <div>
                <span>{{item.amount}} {{item.amount - 0 > 1 ? 'gifts' : 'gift'}}</span>
              </div>
              <div>
                <span>{{item.customer}}</span>
                <img src="../../assets/img/zuanshi.png" alt="">
              </div>
            </div>
          </div>
          <span v-if="DetailTotal === 0" class="NoData">No Data</span>
          <!-- 下一页 -->
          <div class="NextPage" v-if="DetailTotal !== 0 && DetailTotal !== null">
            <el-pagination background :page-size="DetailPageData.pageSize" :current-page="DetailPageData.pageNum" layout="prev, pager, next, jumper" :total="DetailTotal" @current-change="DetailPageChange"></el-pagination>
          </div>
        </div>
      </div>
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
  name: 'WalletForRevenueRecord',
  props: ['data'],
  data () {
    return {
      DetailIndex: 0,
      DetailTotal: null,
      DetailList: [],
      DetailPageData: {
        pageNum: 1,
        pageSize: 10
      },
      Total: 0,
      PageData: {
        pageNum: 1,
        pageSize: 15
      },
      CurrentTarget: null,
      PageList: [],
      RevenueRecordDate: null,
      RevenueRecordDateList: [],
      RevenueRecordType: 1,
      RevenueRecordTypeList: [
        { value: 'Videos', id: 1 },
        { value: 'Tips', id: 2 },
        { value: 'Album', id: 3 },
        { value: 'HeyDollar', id: 4 },
        { value: 'Fans club', id: 5 }
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
      'GetIncomeList',
      'GetLiveRoomBillDetail'
    ]),
    ToGetDetailList () {
      this.GetLiveRoomBillDetail({ data: { ...this.DetailPageData, liveRomeId: this.CurrentTarget.liveRoomId, type: this.DetailIndex + 1 } }).then((res) => {
        this.DetailPageData.pageNum = res.data.data.pageNum
        this.DetailTotal = res.data.data.total
        this.DetailList = [...(res.data.data.list) || []]
      })
    },
    CutDetailNav (index) {
      this.DetailPageData.pageNum = 1
      this.DetailTotal = 0
      this.DetailList = []
      this.DetailIndex = index
      this.ToGetDetailList()
    },
    DetailPageChange (e) {
      this.DetailPageData.pageNum = e
      this.ToGetDetailList()
    },
    ShowDetails (item) {
      if (this.RevenueRecordType - 0 !== 4) {
        this.$emit('ShowDetail', { Data: item, PopupType: 'revenue' })
      } else {
        this.CurrentTarget = { ...item }
        this.ToGetDetailList()
      }
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
      this.RevenueRecordTypeList.map((item) => {
        if (item.id - 0 === type - 0) {
          Name = item.value
        }
      })
      return Name
    },
    Init () {
      this.DataListInit() // 日期初始化
    },
    DataListInit () { // 日期初始化
      let NowDate = Date.now()
      let Month = new Date(NowDate).getMonth() + 1
      let Year = new Date(NowDate).getFullYear()
      for (let n = Month; n > 0; n--) {
        this.RevenueRecordDateList.push(`${Year}-${n > 9 ? n : `0${n}`}`)
      }
      if (Month < 12) {
        for (let n = 0; n < 12 - Month; n++) {
          this.RevenueRecordDateList.push(`${Year - 1}-${12 - n > 9 ? 12 - n : `0${12 - n}`}`)
        }
      }
      this.RevenueRecordDate = this.RevenueRecordDateList[0]
      this.ToGetPageList()
    },
    ToGetPageList () {
      let Data = {
        accountId: this.UserInfo.id,
        dateTime: this.RevenueRecordDate,
        ...this.PageData
      }
      this.GetIncomeList({ data: { ...Data, type: this.RevenueRecordType } }).then((res) => {
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
