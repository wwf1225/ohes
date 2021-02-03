<template>
  <div class="logBox">
    <!-- <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item >系统管理</el-breadcrumb-item>
                <el-breadcrumb-item >系统日志</el-breadcrumb-item>
            </el-breadcrumb>
    </div>-->
    <div class="log-container">
      <!--根据条件搜索 -->
      <el-form
        :inline="true"
        :model="formQuery"
        ref="formQuery"
        label-width="0px"
        label-position="right"
        style="text-align:left;padding:20px 0px 0px 20px"
        class="demo-form-inline"
      >
        <el-form-item label prop="roleName">
          <el-input style="width:300px;" v-model="formQuery.key" placeholder="操作名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="formQuery.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="结束日期"
              v-model="formQuery.date2"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getLogList">查询</el-button>
        </el-form-item>
      </el-form>

      <!--日志列表 -->
      <el-table
        ref="multipleTable"
        align="left"
        border
        :data="tableData"
        element-loading-text="拼命加载中"
        bordertooltip-effect="dark"
        style="width: 100%;"
      >
        <!-- <el-table-column prop="id" label="序号" align="center"> </el-table-column> -->
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="operation" label="日志名称" align="center"></el-table-column>
        <el-table-column prop="remoteAddr" label="IP地址" align="center"></el-table-column>
        <el-table-column prop="createByName" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
      </el-table>

      <!--分页 -->
      <div class="page_main">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          style="text-align:center"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logBox {
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
.log-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
}
.page_main {
  text-align: right;
  margin: 45px 15px 20px 0px;
}
</style>

<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      formQuery: {
        key: "",
        date1: "",
        date2: ""
      },
      tableData: [],
      page: 1, //当前页
      limit: 10, //每页显示条数
      totalCount: null //总条数
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getLogList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getLogList();
    },
    getLogList() {
      //
      axios
        .get(config.apiHost + "/sys/log/list", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            key: this.formQuery.key,
            startDate: this.formQuery.date1,
            endData: this.formQuery.date2
          }
        })
        .then(
          result => {
            if (result.status == 200) {
              // console.log(result);
              this.tableData = result.data.body.list;
              this.totalCount = result.data.body.totalCount; //总条数
            }
          },
          error => {
            this.$message.error(error);
          }
        )
        .then(text => {
          this.msg = text;
        });
    }
  },
  created() {
    this.getLogList();
  }
};
</script>