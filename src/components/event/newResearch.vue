<template>
  <!-- 现况调查 -->
  <div class="container eventDatialsPage">
    <div class="mytop">
      <div>现况调查</div>
      <div style=" float: right;" v-show="ispage=='编辑'">
        <!-- <el-button size="mini" type="primary">编辑表单</el-button> -->
        <el-button size="mini" type="primary" @click="changeForm" v-show="changeFormShow">重选表单</el-button>
        <el-button size="mini" type="primary" @click="changeForm" v-show="selectFormShow">选择表单</el-button>
        <!-- <el-button size="mini" type="primary" @click="publishCon">发布收集</el-button> -->
      </div>
    </div>

    <el-table
      ref="multipleTable"
      align="left"
      :data="tableData"
      border
      element-loading-text="加载中"
      tooltip-effect="dark"
      style="width: 100% ;"
    >
      <el-table-column type="selection" width="80" align="center"></el-table-column>
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          <span class="infobtn" v-if="scope.row.deleteFlag==2">待完善</span>
          <span>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="formName" label="表单名称" align="center"></el-table-column>
      <el-table-column prop="address" label="调查地点" align="center"></el-table-column>
      <el-table-column prop="userName" label="调查人员" align="center"></el-table-column>
      <el-table-column prop="updateAt" label="调查时间" align="center"></el-table-column>
      <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
      <el-table-column label="音视频采集" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showVedio(scope.row)"
          >音视频({{scope.row.audioNum}})</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" title="查看" size="small" @click="showForm(scope.row)">
            <img src="../../assets/ck.png" alt>
          </el-button>
          <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="编辑"
            size="small"
            @click.native.prevent="editForm(scope.row)"
          >
            <img src="../../assets/bj.png" alt>
          </el-button>
          <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="编辑"
            size="small"
            @click.native.prevent="del(scope.row)"
          >
            <img src="../../assets/sc.png" alt>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 class="block"-->
    <div style=" margin: 20px 0;text-align:center">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="limit"
        layout="total,prev, pager, next, jumper"
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
      page: 1,
      limit: 10,
      totalCount: 0,
      tableData: [],
      ispage: "",
      changeFormShow: false,
      selectFormShow: false
    };
  },
  computed: {
    ...mapGetters(["eventId", "event"])
  },
  methods: {
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getListById();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getListById();
    },
    // 点击查看视频列表
    showVedio(row) {
      // console.log("查看视频");
      // console.log(row.id);
      // console.log(this.event.id);
      this.$router.push({
        name: "vedio-list",
        params: {
          eventId: this.event.id,
          number: this.event.number,
          id: row.id,
          ispage: "现况"
        }
      });
    },
    getListById() {
      // console.log("现况~");
      //
      axios
        .get(config.apiHost + "/survey/curlist", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            eventId: this.eventId
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData = result.data.body.list;
            this.totalCount = result.data.body.totalCount; //总条数
          } else {
            // this.$message.error(result.data.body.message);
            this.tableData = [];
            this.totalCount = null;
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    // 重选表单（现况）
    changeForm() {
      //  this.$router.push({name: 'form_add',params:{type:2,eventId:this.event.id}});
      this.$router.push({
        name: "newResAddForm",
        params: { type: 2, eventId: this.event.id }
      });
    },
    // 查看表单
    showForm(row) {
      //   console.log(row);
      //   caseType:2 现况 3 医生 4 不明原因 5 食源性 6 流行病
      this.$router.push({
        name: "show_form",
        params: {
          caseType: row.formType,
          caseId: row.id,
          formId: row.formId,
          eventId: this.event.id
        }
      });
    },
    editForm(row) {
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            type: 2,
            eventId: this.event.id
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.formId = result.data.body.questionareId;
            this.continueType = result.data.body.continueType;
            // console.log(this.formId);
            // this.$router.push({name: 'fill_form',params:{fromsId:this.formId,eventId:this.event.id,type:1,caseType:1}});//跳转到填写表单
            this.$router.push({
              name: "fill_form",
              params: {
                fromsId: row.formId,
                eventId: this.event.id,
                type: this.continueType,
                caseType: row.formType,
                caseId: row.id,
                urlType: 2, //1填答案，2编辑答案
                submitCaseType: 100, //1个案，2对照用于编辑答案保存答案时保存接口的caseType
                copyAnswer: false
              }
            });
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //删除现况
    del(row) {
      this.$confirm("确定要删除该现况吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios
              .get(config.apiHost + "/survey/deletescene", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: this.event.id,
                  sceneId: row.id
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
    //发布收集
    publishCon() {
      //
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            type: 2,
            eventId: this.event.id
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.formId = result.data.body.questionareId;
            var formName = result.data.body.formName;
            var eventId = result.data.body.eventId;
            var domainName = result.data.body.domainName;
            var continueType = result.data.body.continueType;
            this.$router.push({
              name: "update-publishCollection",
              params: {
                fromsId: this.formId,
                type: continueType,
                formName: formName,
                eventId: eventId,
                domainName: domainName
              }
            }); //跳转到发布收集
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
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    //   '$route': 'getParams',
    eventId: "getListById"
  },
  mounted() {
    // console.log("初始化:"+this.event.id);
    // console.log("ispage:"+this.event.ispage);
    // console.log(this.$route.query.eventId);
    // this.ispage=this.$route.query.ispage;//查看或编辑
    // if(this.$route.query.eventId){
    //      this.getListById();
    // }
    if (this.event) {
      this.getListById();
      this.ispage = this.event.ispage;
    }
    axios
      .get(config.apiHost + "/survey/continueWrite", {
        params: {
          //请求参数
          type: 2,
          eventId: this.event.id
        }
      })
      .then(result => {
        if (result.data.status == 200) {
          if (result.data.body != null) {
            //有表单
            this.changeFormShow = true;
            this.selectFormShow = false;
          } else {
            //没表单
            this.selectFormShow = true;
            this.changeFormShow = false;
          }
        } else {
          this.$message.error(result.data.body.message);
        }
      })
      .catch(function(response) {
        //   this.$message.error(error);
        // console.log(response);
      });
  }
};
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  background: white;
  padding: 0 10px;
  /* border: 1px solid #797979; */
  /* background-color: skyblue */
}
.mytop {
  width: 100%;
  height: 40px;
  line-height: 40px;
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
.infobtn {
  border: 1px solid cornflowerblue;
  border-radius: 5px;
  padding: 2px;
  color: cornflowerblue;
}
</style>
