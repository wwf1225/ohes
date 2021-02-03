<template>
  <div class="rolebox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>事件管理</el-breadcrumb-item>
        <el-breadcrumb-item>事件审批</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <!-- <el-form :inline="true" :model="formQuery" ref="formQuery" label-width="0px" label-position="right" style="text-align:left;padding-left:10px;padding-top:20px;" class="demo-form-inline">
        <el-form-item label="" prop="userName">
          <el-input style="width:300px;" v-model="formQuery.name" placeholder="事件名"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="getAuditList()">查询</el-button>
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
        <el-table-column label="接报时间" align="center" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.reportedTime.substr(0,16)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="originName" label="事件来源" align="center"></el-table-column>
        <el-table-column prop="diseaseType" label="疾病类型" align="center"></el-table-column>
        <!-- <el-table-column prop="number" label="编号" align="center"></el-table-column> -->
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
        <!-- <el-table-column label="审批类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status==2">发布审批</span>
            <span v-else>结案审批</span>
          </template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              @click="showRowDetails(scope.row)"
              v-if="config.hasPermission('event:approve:info')"
              type="text"
              size="small"
              title="查看"
            >
              <img src="../../assets/ck.png" alt>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="通过"
              v-if="config.hasPermission('event:approve:pass')"
              @click.native.prevent="passRow(scope.row)"
            >
              <img src="../../assets/tg.png" alt>
            </el-button>
            <el-button
              type="text"
              size="small"
              title="驳回"
              v-if="config.hasPermission('event:approve:reject')"
              @click.native.prevent="rejectRow(scope.$index, tableData,scope.row)"
            >
              <img src="../../assets/bh.png" alt>
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
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
import eventToolBar from "./eventToolBar";
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
        status: 5
      },
      tableData: [],
      page: 1,
      limit: 10,
      totalCount: null,
      searchInfo: "",
      startTime: "",
      endTime: "",
      deleteids: []
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getAuditList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getAuditList();
    },
    //查看
    handleClick(row) {
      // console.log(row);
      // this.$store.dispatch('showEventDetail',row);
      // this.$router.push({path: '/home/event-show'});
      row.ispage = "查看";
      row.isUrl = "eventAudit";
      // console.log(row);
      this.$store.dispatch("showEventDetail", row);
      this.$router.push({ path: "/home/past-event-detail" });
    },
    // 双击事件
    showRowDetails(row) {
      if (config.hasPermission("event:approve:info")) {
        this.handleClick(row);
      }
    },
    //通过审批
    passRow(row) {
      // console.log("通过审批。。。");
      this.$confirm(
        "编号为“" + row.number + "”提交的发布审核是否通过？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          callback: (acction, instance) => {
            if (acction === "confirm") {
              //点击确认
              this.passEvent(row.id);
            } else {
              //点击取消
              this.$message({
                typ: "info",
                message: "已取消审核通过"
              });
            }
          },
          type: "warning"
        }
      );
    },
    //确认审批通过
    passEvent(id) {
      //
      axios
        .get(config.apiHost + "/updateStatus", {
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
              this.getAuditList();
              this.$message(result.data.body.msg);
            } else {
              //删除失败
              this.$message(result.data.body.message);
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    //驳回
    rejectRow(index, Data, row) {
      this.$prompt("请输入驳回意见", "确认驳回", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "驳回意见不能为空"
      })
        .then(({ value }) => {
          axios({
            method: "post",
            // /api
            url: config.apiHost + "/reject-event",
            data: {
              eventId: row.id,
              content: value
            },
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              token: config.token
            }
          })
            .then(res => {
              // console.log(res);
              if (res.data.status == 200) {
                this.$message(res.data.body.msg);
                this.getAuditList();
              } else {
                this.$message.error(res.data.body.message);
              }
            })
            .catch(response => {
              this.$message.error(response);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //审核列表
    getAuditList() {
      // axios
      //   .get(config.apiHost + '/approval-event', {
      //     params: {
      //       //请求参数
      //       page: this.page,
      //       limit: this.limit,
      //       token: config.token,
      //       name: this.formQuery.name
      //     }
      //   })
      //   .then(result => {
      //     if (result.data.status == 200) {
      //       this.tableData = result.data.body.list
      //       this.totalCount = result.data.body.totalCount //总条数
      //     }
      //   })
      //   .catch(function(response) {
      //     //   this.$message.error(error);
      //     // console.log(response);
      //   })
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
              this.getAuditList();
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
    }
  },
  created() {
    this.getAuditList();
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
  /* height: 100%; */
  min-height: 100%;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
  /* overflow: hidden; */
}
.audit_main {
  height: 100%;
  min-height: 800px;
  width: 100%;
  background-color: #ffffff;
}
.Myheader {
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

