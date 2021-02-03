<template>
  <div class="rolebox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>分析统计</el-breadcrumb-item>
        <el-breadcrumb-item>地区分布统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <!-- <div class="region-header">
        <el-select
          v-model="tableType"
          placeholder="请选择"
          @change="tabTableType"
          style="float:right;width:150px;margin-right:10px;"
        >
          <el-option label="图表" value="2"></el-option>
          <el-option label="表格" value="1"></el-option>
        </el-select>
      </div>-->
      <div style="clear:both;"></div>
      <div class="main">
        <el-form
          :inline="true"
          :model="formQuery"
          ref="formQuery"
          label-position="right"
          style="text-align:left;background-color:#fff;padding: 30px 10px 10px;"
          class="demo-form-inline"
        >
          <!-- <el-form-item label="事发时间：">
        <el-select v-model="formQuery.regionMode" placeholder="请选择" @change="dateTypeChange">
          <el-option v-for="item in dataTypeList" :key="item.id" :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker id="datestart" v-model="dataStart" align="right" :type="dateType" :format="dateFormat" placeholder="请选择" :default-value="dataStart">
        </el-date-picker>
        <span>-</span>
        <el-date-picker id="dateend" v-model="dataEnd" align="right" :type="dateType" :format="dateFormat" placeholder="请选择" :default-value="dataEnd">
        </el-date-picker>

          </el-form-item>-->
          <el-form-item label="事发时间：">
            <!-- <el-date-picker
          v-model="dataStart"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          default-value="2018-01-01"
          value-format="yyyy-MM-dd">
            </el-date-picker>-->
            <el-date-picker
              v-model="dataStart"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query()">搜索</el-button>
          </el-form-item>
          <el-form-item label="事发场所：">
            <el-select v-model="formQuery.happenPlace" placeholder="请选择" @change="query()" style="width:150px">
              <el-option
                v-for="item in happenPlaceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处置单位：">
            <el-select v-model="formQuery.disposeDepartment" placeholder="请选择" @change="query()" style="width:150px">
              <el-option
                v-for="item in disposeDepartmentList"
                :key="item.depId"
                :label="item.name"
                :value="item.depId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核：">
            <el-select v-model="formQuery.status" placeholder="请选择" @change="query()" style="width:150px">
              <el-option
                v-for="item in regionModeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:right">
            <el-select
              v-model="tableType"
              placeholder="请选择"
              @change="tabTableType"
              style="float:right;width:100px;margin-right:10px;"
            >
              <el-option label="图表" value="2"></el-option>
              <el-option label="表格" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div v-show="tableShow">
          <el-table
            ref="multipleTable"
            align="left"
            :data="tableData"
            element-loading-text="加载中"
            bordertooltip-effect="dark"
            @select="selectTable"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            border
          >
            <el-table-column type="selection" width="80"></el-table-column>
            <el-table-column prop="area" label="地区"></el-table-column>
            <el-table-column prop="disposeDepartment" label="处置单位"></el-table-column>
            <el-table-column prop="happenPlace" label="事发场所"></el-table-column>
            <el-table-column prop="eventNum" label="事件数"></el-table-column>
            <el-table-column prop="caseNum" label="发病数"></el-table-column>
            <el-table-column prop="diseaseTotal" label="传染病总数"></el-table-column>
            <el-table-column prop="diseaseA" label="传染病甲类"></el-table-column>
            <el-table-column prop="diseaseB" label="传染病乙类"></el-table-column>
            <el-table-column prop="diseaseC" label="传染病丙类"></el-table-column>
            <el-table-column prop="foodSource" label="食源性"></el-table-column>
            <el-table-column prop="other" label="其它"></el-table-column>
          </el-table>
          <el-pagination
            style="text-align: right;background-color:#fff;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="formQuery.pageNum"
            :page-sizes="[1, 5, 10, 100]"
            :page-size="formQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <div class="echartCont" v-show="chartShow">
          <div id="echart" :style="{width:'100%',height:'500px'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.rolebox {
  width: auto;
  min-height: 100%;
  /* text-align: left; */
  background-color: #e2e6ef;
  padding: 10px 10px 45px;
  box-sizing: border-box;
}
.top-main {
  height: 45px;
  line-height: 45px;
  text-align: left;
  padding-left: 10px;
  margin-bottom: 5px;
  background-color: #f6f7fb;
}
.rolemgr-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
  /* padding-bottom: 30px; */
}
.containerhead {
  text-align: left;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  background-color: #f0f3f8;
  padding-left: 10px;
  margin-bottom: 10px;
}
.region-header {
  background-color: #fff;
  text-align: left;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}
.main {
  background-color: #fff;
  height: 700px;
}
</style>
<script>
var config = require("@/components/utils/Common_Config.js");
import axios from "axios";
import echarts from "echarts";
export default {
  data() {
    return {
      loading: true,
      dataStart: [],
      // dataEnd: '2018-02-01',
      dateFormat: "yyyy-MM",
      dateType: "month",
      valueFormat: "yyyy-MM",
      isWeek: false,
      formQuery: {
        status: "0",
        startTime: "",
        endTime: "",
        disposeDepartment: "0",
        happenPlace: "0",
        pageNum: 1,
        pageSize: 10
      },
      tableType: "1",
      total: 0,

      currentPage: 1,
      tableData: [],
      chartShow: false,
      tableShow: true,
      dataTypeList: [
        {
          id: "1",
          value: "年统计"
        },
        {
          id: "2",
          value: "月统计"
        },
        {
          id: "3",
          value: "周统计"
        },
        {
          id: "4",
          value: "其它"
        }
      ],

      happenPlaceList: [], //事发场所
      disposeDepartmentList: [], //处置单位
      regionModeList: [
        //审核状态
        {
          id: "0",
          name: "全部"
        },
        {
          id: "4",
          name: "调查中"
        },
        {
          id: "6",
          name: "已结案"
        },
        {
          id: "5",
          name: "审核中"
        }
      ]
    };
  },
  methods: {
    query() {
      this.formQuery.startTime = this.dataStart[0];
      this.formQuery.endTime = this.dataStart[1];
      if (this.tableType == 1) {
        //   var d = new Date(this.dataStart);
        //   var c=new Date(this.dataEnd);

        // var start="";
        // var end="";
        // if (this.formQuery.regionMode == 3) {
        //   //周
        //   start = document.getElementById('datestart').value;
        //   end = document.getElementById('dateend').value;

        // } else{
        //   start =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' '
        //   end =c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate() + ' '

        // }

        //查询
        var that = this;
        axios({
          method: "get",
          url:
            config.apiHost +
            "/analyze/regionStatistics?startTime=" +
            this.formQuery.startTime +
            "&endTime=" +
            this.formQuery.endTime +
            "&happenPlace=" +
            this.formQuery.happenPlace +
            "&disposeDepartment=" +
            this.formQuery.disposeDepartment +
            "&status=" +
            this.formQuery.status +
            "&tableType=" +
            this.tableType +
            "&page=" +
            this.formQuery.pageNum +
            "&limit=" +
            this.formQuery.pageSize
        }).then(function(res) {
          if (res.data.status == 200) {
            that.total = res.data.body.totalCount;

            that.tableData = res.data.body.list;
            // var start=(that.pageNum*that.pageSize)-that.pageSize;
            // var end=start+that.pageSize;
            // that.tableData=that.tableData.splice(start,end);
          } else {
            that.$message(res.data.body.message);
          }
        });
      } else {
        this.initEchart();
      }
    },
    initEchart() {
      // var d = new Date(this.dataStart);
      // var c=new Date(this.dataEnd);

      // var start="";
      // var end="";
      // if (this.formQuery.regionMode == 1) {
      //   //年
      //   start = d.getFullYear() + ' ';
      //   end=c.getFullYear() + ' ';
      // } else if (this.formQuery.regionMode == 2) {
      //   //月
      //   start = d.getFullYear() + '-' + (d.getMonth() + 1) + ' '
      //   end = c.getFullYear() + '-' + (c.getMonth() + 1) + ' '
      // } else if (this.formQuery.regionMode == 3) {
      //   //周
      //   start = document.getElementById('datestart').value;
      //   end = document.getElementById('dateend').value;
      // } else {
      //   //其它
      //   start =d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' '
      //   end =c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate() + ' '
      // }

      //查询
      var that = this;
      axios({
        method: "get",
        url:
          config.apiHost +
          "/analyze/regionStatistics?startTime=" +
          this.formQuery.startTime +
          "&endTime=" +
          this.formQuery.endTime +
          "&happenPlace=" +
          this.formQuery.happenPlace +
          "&disposeDepartment=" +
          this.formQuery.disposeDepartment +
          "&tableType=" +
          this.tableType
      }).then(function(res) {
        if (res.data.status == 200) {
          var echartData = res.data.body.list;

          var areaList = [];
          var eventList = [];
          var caseList = [];
          var diseaseTotalList = [];
          var diseaseAList = [];
          var diseaseBList = [];
          var diseaseCList = [];
          var foodSourceList = [];
          var otherList = [];
          echartData.forEach(element => {
            areaList.push(element.value[0].area);
            var totalEvent = 0;
            var totalCase = 0;
            var totalDiseaseTotal = 0;
            var totalDiseaseA = 0;
            var totalDiseaseB = 0;
            var totalDiseaseC = 0;
            var totalFoodSource = 0;
            var totalOther = 0;

            element.value.forEach(item => {
              totalEvent += item.eventNum;
              totalCase += item.caseNum;
              totalDiseaseTotal += item.diseaseTotal;
              totalDiseaseA += item.diseaseA;
              totalDiseaseB += item.diseaseB;
              totalDiseaseC += item.diseaseC;
              totalFoodSource += item.foodSource;
              totalOther += item.other;
            });
            eventList.push(totalEvent);
            caseList.push(totalCase);
            diseaseTotalList.push(totalDiseaseTotal);
            diseaseAList.push(totalDiseaseA);
            diseaseBList.push(totalDiseaseB);
            diseaseCList.push(totalDiseaseC);
            foodSourceList.push(totalFoodSource);
            otherList.push(totalOther);
          });

          var myChart = echarts.init(document.getElementById("echart"));
          myChart.setOption({
            tooltip: {},
            xAxis: {
              data: areaList //地区数组
            },
            yAxis: [
              {
                type: "value",
                name: "单位(件)",
                // min: 0,
                // max: 400,
                // interval: 100,
                axisLabel: {
                  formatter: "{value}"
                }
              }
            ],
            legend: {
              data: [
                "事件数",
                "发病数",
                "传染病总数",
                "传染病甲类",
                "传染病乙类",
                "传染病丙类",
                "食源性",
                "其它"
              ]
            },
            series: [
              {
                name: "事件数",
                type: "bar",
                data: eventList, //每个地区的事件数
                color: ["#6799FF"]
              },
              {
                name: "发病数",
                type: "bar",
                data: caseList,
                color: ["#00A0EA"]
              },
              {
                name: "传染病总数",
                type: "bar",
                data: diseaseTotalList,
                color: ["#70B6F6"]
              },
              {
                name: "传染病甲类",
                type: "bar",
                data: diseaseAList,
                color: ["#1ADAEA"]
              },
              {
                name: "传染病乙类",
                type: "bar",
                data: diseaseBList,
                color: ["#F18ACD"]
              },
              {
                name: "传染病丙类",
                type: "bar",
                data: diseaseCList,
                color: ["#F08889"]
              },
              {
                name: "食源性",
                type: "bar",
                data: foodSourceList,
                color: ["#F4B657"]
              },
              {
                name: "其它",
                type: "bar",
                data: otherList,
                color: ["#7CCC5A"]
              }
            ]
          });
        } else {
          that.$message(res.data.body.message);
        }
      });
    },

    // dateTypeChange() {
    //   if (this.formQuery.regionMode == 1) {
    //     //年

    //     this.dataStart = ''
    //     this.dataEnd = ''
    //     this.dateFormat = 'yyyy'
    //     this.dateType = 'year'

    //   } else if (this.formQuery.regionMode == 2) {
    //     //月

    //     this.dataStart = ''
    //     this.dataEnd = ''
    //     this.dateFormat = 'yyyy-MM'
    //     this.dateType = 'month'

    //   } else if (this.formQuery.regionMode == 3) {
    //     //周

    //     this.dataStart = ''
    //     this.dataEnd = ''
    //     this.dateFormat = 'yyyy第WW周'
    //     this.dateType = 'week'

    //   } else {
    //     //日

    //     this.dataStart = ''
    //     this.dataEnd = ''
    //     this.dateFormat = 'yyyy-MM-dd'
    //     this.dateType = 'date'

    //   }
    // },
    tabTableType(val) {
      console.log(val);
      if (val == 2) {
        //图表
        this.chartShow = true;
        this.tableShow = false;
        this.initEchart();
      } else {
        this.chartShow = false;
        this.tableShow = true;
        this.query();
      }
    },
    // startDateChange(val) {
    //   console.log(val)
    // },
    // endDateChange(val) {
    //   console.log(val)
    // },
    selectTable(selection, val) {
      //
    },
    handleSelectionChange(selection) {},
    handleSizeChange(val) {
      //分页大小变化
      this.formQuery.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      //分页的当前页变化
      this.formQuery.pageNum = val;

      this.query();
    }
  },
  created() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var day = myDate.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    var startTime = year - 1 + "" + month + "" + day + "";
    var endTime = year + "" + month + "" + day + "";
    this.dataStart.splice(0, 2);
    this.dataStart.push(startTime);
    this.dataStart.push(endTime);
    this.formQuery.startTime = startTime;
    this.formQuery.endTime = endTime;
    var that = this;
    axios({
      //事发场所
      method: "get",
      url: config.apiHost + "/event-places"
    }).then(function(res) {
      if (res.data.status == 200) {
        that.happenPlaceList = res.data.body;
        that.happenPlaceList.unshift({ id: "0", name: "全部" });
      }
    });
    axios({
      //处置单位
      method: "get",
      url: config.apiHost + "/sys/dept/list"
    }).then(function(res) {
      that.disposeDepartmentList = res.data;
      that.disposeDepartmentList.unshift({ depId: "0", name: "全部" });
    });

    // this.initEchart();
    //查询

    axios({
      method: "get",
      url:
        config.apiHost +
        "/analyze/regionStatistics?startTime=" +
        this.formQuery.startTime +
        "&endTime=" +
        this.formQuery.endTime +
        "&happenPlace=" +
        this.formQuery.happenPlace +
        "&disposeDepartment=" +
        this.formQuery.disposeDepartment +
        "&tableType=" +
        this.tableType +
        "&page=" +
        this.formQuery.pageNum +
        "&limit=" +
        this.formQuery.pageSize
    }).then(function(res) {
      if (res.data.status == 200) {
        that.total = res.data.body.totalCount;
        // that.tableData = res.data.body.splice(0,10);
        that.tableData = res.data.body.list;
        that.loading = false;
      } else {
        that.$message(res.data.body.message);
      }
    });
  }
};
</script>

