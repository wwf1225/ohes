<template>
  <div class="rolebox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>分析统计</el-breadcrumb-item>
        <el-breadcrumb-item>传染病事件</el-breadcrumb-item>
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
          style="text-align: left;background-color: rgb(255, 255, 255);padding: 30px 10px 10px;"
          class="demo-form-inline"
        >
          <el-form-item label="事发时间：">
            <el-date-picker
              v-model="dataStart"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyyMMdd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query()">搜索</el-button>
          </el-form-item>
          <el-form-item label="病种类型：">
            <el-select v-model="formQuery.infectionsType" placeholder="请选择" @change="query()">
              <el-option
                v-for="item in diseaseTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核：">
            <el-select v-model="formQuery.status" placeholder="请选择" @change="query()">
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
              style="float:right;width:150px;margin-right:10px;"
            >
              <el-option label="图表" value="2"></el-option>
              <el-option label="表格" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div v-show="tableShow">
          <el-table
            ref="multipleTable"
            align="center"
            :default-sort="{prop: 'eventNum', order: 'descending'}"
            :data="tableData"
            element-loading-text="拼命加载中"
            bordertooltip-effect="dark"
            @select="selectTable"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            border
          >
            <el-table-column type="selection" width="80"></el-table-column>
            <el-table-column label="序号" width="80">
              <template slot-scope="scope">{{scope.row.value.no}}</template>
            </el-table-column>
            <!-- <el-table-column type="index" label="序号"> </el-table-column> -->
            <el-table-column label="疾病病种">
              <template slot-scope="scope">{{scope.row.key}}</template>
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.value.diseaseType==1">甲</span>
                <span v-if="scope.row.value.diseaseType==2">乙</span>
                <span v-if="scope.row.value.diseaseType==3">丙</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="事件数">
              <template slot-scope="scope">{{scope.row.value.eventNum}}</template>
            </el-table-column>
            <el-table-column label="涉案人数">
              <template slot-scope="scope">{{scope.row.value.totalNum}}</template>
            </el-table-column>
            <el-table-column label="发病数">
              <template slot-scope="scope">{{scope.row.value.caseNum}}</template>
            </el-table-column>
            <!-- <el-table-column prop="diseaseTotal" label="死亡数"> </el-table-column> -->
          </el-table>
          <el-pagination
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="formQuery.pageNum"
            :page-sizes="[10, 25, 50, 100]"
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

<script>
var config = require("@/components/utils/Common_Config.js");
import axios from "axios";
import echarts from "echarts";
export default {
  data() {
    return {
      loading: true,
      dataStart: [],
      formQuery: {
        status: "0",
        startTime: "",
        endTime: "",
        infectionsType: "0",
        pageNum: 1,
        pageSize: 10
      },
      tableType: "1",
      total: 0,

      currentPage: 1,
      tableData: [],
      chartShow: false,
      tableShow: true,

      diseaseTypeList: [
        //病种类型
        {
          id: "0",
          name: "全部"
        },
        {
          id: "1",
          name: "甲"
        },
        {
          id: "2",
          name: "乙"
        },
        {
          id: "3",
          name: "丙"
        }
      ],

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
      //查询
      if (this.tableType == 1) {
        var that = this;
        axios({
          method: "get",
          url:
            config.apiHost +
            "/analyze/diseaseStatistics?startTime=" +
            this.formQuery.startTime +
            "&endTime=" +
            this.formQuery.endTime +
            "&status=" +
            this.formQuery.status +
            "&infectionsType=" +
            this.formQuery.infectionsType +
            //   '&tableType=' +
            //   this.tableType+
            "&genre=0&page=" +
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
      //查询
      var that = this;
      axios({
        method: "get",
        url:
          config.apiHost +
          "/analyze/diseaseStatistics?startTime=" +
          this.formQuery.startTime +
          "&endTime=" +
          this.formQuery.endTime +
          "&status=" +
          this.formQuery.status +
          "&infectionsType=" +
          this.formQuery.infectionsType +
          //   '&tableType=' +
          //   this.tableType+
          "&genre=0"
      }).then(function(res) {
        if (res.data.status == 200) {
          var echartData = res.data.body.list;
          var diseaseList = []; //病种的集合

          var eventList = []; //事件数
          var caseList = []; //发病数
          var totalList = []; //涉案人数
          echartData.forEach(element => {
            diseaseList.push(element.key);
            eventList.push(element.value.eventNum);
            caseList.push(element.value.caseNum);
            totalList.push(element.value.totalNum);
          });

          var myChart = echarts.init(document.getElementById("echart"));
          myChart.setOption({
            tooltip: {},
            xAxis: {
              data: diseaseList //病种的数组
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
              data: ["事件数", "涉案人数", "发病数"]
            },
            series: [
              {
                name: "事件数",
                type: "bar",
                data: eventList, //每个地区的事件数
                color: ["#6799FF"]
              },
              {
                name: "涉案人数",
                type: "bar",
                data: totalList,
                color: ["#00A0EA"]
              },
              {
                name: "发病数",
                type: "bar",
                data: caseList,
                color: ["#70B6F6"]
              }
            ]
          });
        } else {
          that.$message(res.data.body.message);
        }
      });
    },

    tabTableType(val) {
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
    //查询
    var that = this;
    axios({
      method: "get",
      url:
        config.apiHost +
        "/analyze/diseaseStatistics?startTime=" +
        this.formQuery.startTime +
        "&endTime=" +
        this.formQuery.endTime +
        "&status=" +
        this.formQuery.status +
        "&infectionsType=" +
        this.formQuery.infectionsType +
        //   '&tableType=' +
        //   this.tableType+
        "&genre=0&page=" +
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
        that.loading = false;
      } else {
        that.$message(res.data.body.message);
      }
    });
  }
};
</script>

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
.demo-form-inline {
  background: #fff;
}
</style>