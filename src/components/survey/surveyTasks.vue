<template>
  <div class="rolebox">
    <!-- <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item>调查管理</el-breadcrumb-item>
                <el-breadcrumb-item>调查任务</el-breadcrumb-item>
            </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <!-- <el-form :inline="true" :model="formQuery" ref="formQuery" label-width="0px" label-position="right" style="text-align:left;padding-left:10px;padding-top: 20px;" class="demo-form-inline">
                <el-form-item label="" prop="name">
                    <el-input style="width:300px;" v-model="formQuery.name" placeholder="事件名"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="getSurveyList()">查询</el-button>
                </el-form-item>
      </el-form>-->
      <event-tool-bar
        @search-result-arr="searchResultArr"
        @search-info="searchInfo"
        :page="page"
        :limit="limit"
        :status="formQuery.status"
        :deleteids="deleteids"
      ></event-tool-bar>
      <el-table
        ref="multipleTable"
        border
        align="left"
        :data="tableData"
        element-loading-text="加载中"
        bordertooltip-effect="dark"
        v-loading="loading"
        @selection-change="selectionChange"
        @row-dblclick="showRowDetails"
      >
        <!-- <el-table-column type="selection" align="center" width="80"></el-table-column> -->
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="reportedTime" label="接报时间" align="center" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.reportedTime.substr(0,16)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="originName" label="事件来源" align="center"></el-table-column>
        <el-table-column prop="diseaseType" label="疾病类型" align="center"></el-table-column>
        <el-table-column prop="diseaseName" label="疾病名称" align="center"></el-table-column>
        <el-table-column label="事件地点" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.address}}&nbsp;{{scope.row.detailName?scope.row.detailName:''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="调查员" align="center" width="150">
          <template slot-scope="scope">
            <span
              :title="scope.row.userNameList"
              class="table-inner-span"
            >{{scope.row.userNameList?scope.row.userNameList.split(',')[0]+' 等人':''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="调查员电话" align="center" width="150">
          <template slot-scope="scope">
            <span
              :title="scope.row.mobile"
              class="table-inner-span"
            >{{scope.row.mobile?scope.row.mobile.split(',')[0]:''}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="reportUser" label="报告人" align="center"></el-table-column> -->
        <!-- <el-table-column prop="reportPhone" label="报告电话" align="center"></el-table-column> -->
        <!-- <el-table-column prop="userName" label="接报人" align="center"></el-table-column> -->
        <!-- <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==3" style="color:#E9B4B4">待调查</span>
            <span v-else style="color:#B2D9C4">调查中</span>
          </template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <!-- v-if="config.hasPermission('survey:current:info')" -->
            <el-button
              @click="showRowDetails(scope.row)"
              type="text"
              size="small"
              title="查看"
              v-if="config.hasPermission('survey:current:updateOnly')"
            >
              <img src="../../assets/ck.png" alt>
            </el-button>
            <!-- 
            <el-button
              v-if="scope.row.status==3 && config.hasPermission('survey:current:updateOnly')"
              type="text"
              size="small"
              title="编辑"
              @click.native.prevent="updateRow(scope.row)"
            ><img src="../../assets/bj.png" alt=""></el-button>-->
            <!-- <el-button
              v-else-if="scope.row.status!=3 && config.hasPermission('survey:current:updateSurvey')"
              type="text"
              size="small"
              title="调查"
              @click.native.prevent="updateSurvey(scope.row)"
            >
              <img src="../../assets/dc.png" alt>
            </el-button>
            <el-button
              v-if="scope.row.status==3 && config.hasPermission('survey:current:startSurvey')"
              type="text"
              size="small"
              title="开始调查"
              @click.native.prevent="startSurvey(scope.row)"
            >
              <img src="../../assets/ksdc.png" alt>
            </el-button> -->
            <el-button
              v-if="scope.row.status!=3 && config.hasPermission('survey:current:settle')"
              type="text"
              size="small"
              title="申请结案"
              @click.native.prevent="endSurvey(scope.row)"
            >
              <img src="../../assets/sqja.png" alt>
            </el-button>
            <!-- <el-button
              type="text"
              size="small"
              title="删除"
              v-if="config.hasPermission('event:current:delete')"
              @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"
            >
              <img src="../../assets/sc.png" alt>
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 class="block"-->
      <div class="page_main">
        <el-pagination
          background
          prev-text="　上一页　"
          next-text="　下一页　"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
import eventToolBar from "../event/eventToolBar";
export default {
  components: {
    eventToolBar
  },
  data() {
    return {
      loading: true,
      config: config,
      formQuery: {
        name: "",
        status: 4
      },
      page: 1,
      limit: 10,
      totalCount: null,
      searchInfo: "",
      startTime: "",
      endTime: "",
      tableData: [],
      deleteids: []
    };
  },
  methods: {
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getSurveyList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getSurveyList();
    },
    //既往事件列表
    getSurveyList() {
      axios
        .get(config.apiHost + "/current-events/event-list", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            name: this.formQuery.name,
            status: this.formQuery.status,
            searchInfo: this.searchInfo,
            startTime: this.startTime,
            endTime: this.endTime
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData = result.data.body.list;
            this.totalCount = result.data.body.totalCount; //总条数
            this.loading = false;
          } else {
            this.$message(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },

    // 搜索结果
    searchResultArr(searchResultArr) {
      this.totalCount = searchResultArr.totalCount;
      this.tableData = searchResultArr.searchResultList;
      this.searchInfo = searchResultArr.searchInfo;
      this.startTime = searchResultArr.startTime;
      this.endTime = searchResultArr.endTime;
    },
    selectionChange(selection) {
      this.deleteids = [];
      selection.forEach(v => {
        this.deleteids.push(v.id);
      });
      this.deleteids = this.deleteids.join(",");
    },
    //查看
    // handleClick(row){
    //    console.log(row);
    //    this.$store.dispatch('showEventDetail',row);
    //    this.$router.push({path: '/home/survey-detail'});
    // },

    //查看调查
    showSurvey(row) {
      row.ispage = "查看";
      row.isUrl = "surveyTasks";
      //    console.log(row);
      this.$store.dispatch("showEventDetail", row);
      this.$router.push({ path: "/home/past-event-detail" });
    },
    //编辑
    updateRow(row) {
      // console.log(row);
      //    this.$store.dispatch('showEventDetail',row);
      //    this.$router.push({path: '/home/update-detail'});
      row.isUrl = "surveyTasks";
      this.$store.dispatch("showEventDetail", row);
      this.$router.push({ path: "/home/eventEdit" });
    },
    //编辑调查
    updateSurvey(row) {
      // console.log(row);
      row.ispage = "编辑";
      row.isUrl = "surveyTasks";
      this.$store.dispatch("showEventDetail", row);
      this.$router.push({ path: "/home/survey-update" });
    },
    // 双击事件
    showRowDetails(row) {
      if (
        row.status == 3 &&
        config.hasPermission("survey:current:updateOnly")
      ) {
        this.updateRow(row);
      } else if (
        row.status != 3 &&
        config.hasPermission("survey:current:updateSurvey")
      ) {
        this.updateSurvey(row);
      } else if (config.hasPermission("survey:current:info")) {
        this.showSurvey(row);
      }
    },
    //开始调查
    startSurvey(row) {
      // console.log(row.id);
      this.$confirm("确定要开始调查吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            //
            axios
              .get(config.apiHost + "/survey/update", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: row.id
                }
              })
              .then(result => {
                if (result.data.status == 200) {
                  //跳编辑界面
                  row.ispage = "编辑";
                  row.isUrl = "surveyTasks";
                  this.$store.dispatch("showEventDetail", row);
                  this.$router.push({ path: "/home/survey-update" });
                } else {
                  this.$message.error(result.data.body.massage);
                }
              })
              .catch(function(response) {
                // console.log(response);
              });
          } else {
            //点击取消
            this.$message({
              typ: "info",
              message: "已取消开始调查"
            });
          }
        },
        type: "warning"
      });
    },
    //申请结案
    endSurvey(row) {
      // console.log(row);
      this.$confirm("确定要申请结案吗？", "结案申请", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            //
            axios
              .get(config.apiHost + "/current-events/update-status", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: row.id
                }
              })
              .then(result => {
                if (result.data.status == 200) {
                  //刷新列表页
                  this.$message.success(result.data.body.msg);
                  this.getSurveyList();
                } else {
                  this.$message.error("申请失败");
                }
              })
              .catch(function(response) {
                // console.log(response);
              });
          } else {
            //点击取消
            this.$message({
              typ: "info",
              message: "已取消结案申请"
            });
          }
        },
        type: "warning"
      });
    },
    //删除事件
    deleteRow(index, Data, row) {
      // console.log("删除。。。");
      this.$confirm("确定要删除该事件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            this.deleteEvent(row.id);
          } else {
            //点击取消
            this.$message({
              typ: "info",
              message: "已取消删除"
            });
          }
        },
        type: "warning"
      });
    },
    //点击删除
    deleteEvent(id) {
      //
      axios
        .get(config.apiHost + "/current-events/delete", {
          params: {
            //请求参数
            token: config.token,
            eventId: id
          }
        })
        .then(
          result => {
            // console.log(result.data.status);
            if (result.data.status == 200) {
              //删除成功
              this.getSurveyList();
              this.$message.success(result.data.body.msg);
            } else {
              //删除失败
              this.$message.error(result.data.body.message);
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    }
  },

  created() {
    this.getSurveyList();
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
  padding-bottom: 30px;
}
.event-container {
  width: auto;
  min-height: 100%;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
  /* overflow: hidden; */
}
.task_main {
  height: 100%;
  min-height: 800px;
  width: 100%;
  background-color: #ffffff;
}
.Myheader {
  /* width: 100%; */
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
  text-align: left;
  background-color: #f6f7fb;
  margin-bottom: 15px;
}
.page_main {
  /* text-align: right; */
  margin: 45px 15px 20px 0px;
}
.table-inner-span {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
