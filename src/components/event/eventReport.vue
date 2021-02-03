<template>
  <!-- 事件报告(不需要分页) -->
  <div class="container eventDatialsPage">
    <div class="mytop">
      <div>事件报告</div>
      <!-- 暂时隐藏 -->
      <!-- <div>
               <span style="color:#59BAFD;">事件报告</span>
               <input type="text"  style=" outline: none;margin-left:30px;">
               <el-button size="mini" type="primary">搜索</el-button>
      </div>-->
      <div style=" float: right;">
        <el-button v-show="ispage=='编辑'" size="mini" type="primary" @click="insert">添加</el-button>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      align="left"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
      tooltip-effect="dark"
      style="width: 100% ;"
    >
      <el-table-column type="selection" width="80" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
      <el-table-column prop="reportType" label="名称" align="center"></el-table-column>
      <el-table-column prop="reportUser" label="上报人" align="center"></el-table-column>
      <el-table-column prop="updateAt" label="报告时间" align="center"></el-table-column>
      <el-table-column prop label="附件上传" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showFile(scope.row)"
          >文件({{scope.row.audioNum}})</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            title="查看"
            size="small"
            @click.native.prevent="showReport(scope.row)"
          >
            <img src="../../assets/ck.png" alt>
          </el-button>
          <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="编辑"
            size="small"
            @click.native.prevent="updateReport(scope.row)"
          >
            <img src="../../assets/bj.png" alt>
          </el-button>
          <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="删除"
            size="small"
            @click.native.prevent="delReport(scope.row)"
          >
            <img src="../../assets/sc.png" alt>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 class="block"-->
    <div style=" margin: 10px 0;text-align:center">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="limit"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      formQuery: {
        name: ""
      },
      page: 1,
      limit: 10,
      totalCount: 0,
      tableData: [],
      eventId: "",
      ispage: ""
    };
  },
  computed: {
    ...mapGetters(["event"])
  },
  methods: {
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    //   this.limit=val;
    // //   this.getEventList();
    // },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getListById();
    },

    // 文件上传
    showFile(row) {
      this.$router.push({
        name: "file-list",
        params: {
          eventId: this.event.id,
          number: this.event.number,
          reportId: row.id,
          ispage: "报告"
        }
      });
    },
    insert() {
      // /home/report-detail
      console.log(this.event.id);
      this.$router.push({
        name: "report-update",
        params: {
          eventId: this.event.id,
          name: this.event.name,
          isType: "添加"
        }
      });
    },
    //查看报告
    showReport(row) {
      // this.$router.push({name: 'report-detail',params:{id:row.id,eventId:row.eventId,name:row.name,type:row.type,content:row.content}});
      this.$router.push({ name: "report-detail", params: { id: row.id } });
    },
    //编辑报告
    updateReport(row) {
      //  this.$router.push({name: 'report-update',params:{id:row.id,eventId:row.eventId,name:row.name,type:row.type,content:row.content}});
      this.$router.push({
        name: "report-update",
        params: { id: row.id, isType: "编辑" }
      });
    },
    //删除报告
    delReport(row) {
      this.$confirm("确定要删除该事件报告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios
              .get(config.apiHost + "/survey/reportdelete", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: this.event.id,
                  id: row.id
                }
              })
              .then(
                result => {
                  // console.log(result.data.status);
                  if (result.data.status == 200) {
                    //删除成功
                    this.getListById();
                    this.$message.success(result.data.body.msg);
                    this.$store.dispatch("refNum", 3); //刷新父级组件
                  } else {
                    //删除失败
                    this.$message.error(result.data.body.message);
                  }
                },
                error => {
                  this.$message.error(error);
                }
              );
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
    getListById() {
      // console.log("事件报告~");
      //
      axios
        .get(config.apiHost + "/survey/reportlist", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            eventId: this.event.id
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData = result.data.body;
            this.totalCount = this.tableData.length; //总条数
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    }
  },
  mounted() {
    if (this.event) {
      this.getListById();
      this.ispage = this.event.ispage;
    }
  }
};
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  background: white;
}
.mytop {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}
.mytop > div:nth-child(1) {
  padding: 0 20px;
  background: #000;
  border-radius: 5px 5px 0 0;
  background: #a5cfbb;
  color: #fff;
  border-left: 1px solid #ebeef5;
}
</style>
