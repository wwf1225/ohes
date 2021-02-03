<template>
  <!-- 对照组调查 -->
  <div class="container eventDatialsPage">
    <div class="mytop">
      <div>
        <div>对照组调查</div>
      </div>
      <div style=" float: right;">
        <el-input
          type="text"
          v-model="formQuery.name"
          placeholder="被调查人员"
          size="mini"
          style="width:200px;float:left"
        ></el-input>
        <el-button size="mini" type="primary" @click="getListById" style="margin-left:20px">搜索</el-button>
        <el-button v-if="ispage=='编辑'&&btnShow" size="mini" type="primary" @click="keepFill">继续调查</el-button>
        <!-- <el-button  v-show="ispage=='编辑'" size="mini" type="primary">编辑表单</el-button> -->
        <!-- <el-button  v-show="ispage=='编辑'" size="mini" type="primary"  @click="changeForm">重选表单</el-button> -->
        <el-button
          v-if="ispage=='编辑'&&btnShow"
          size="mini"
          type="primary"
          @click="publishCon"
        >发布收集</el-button>
        <el-button size="mini" type="primary" @click="count" v-show="btnShow">统计</el-button>
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
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          <span class="infobtn" v-if="scope.row.deleteFlag==2">待完善</span>
          <span>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="formName" label="表单名称" align="center" width="230"></el-table-column>
      <el-table-column prop="name" label="被调查姓名" align="center"></el-table-column>
      <el-table-column prop="address" label="调查地点" align="center"></el-table-column>
      <el-table-column prop="surveyorName" label="调查人员" align="center"></el-table-column>
      <el-table-column prop="surTime" label="调查时间" align="center"></el-table-column>
      <el-table-column prop="phone" label="电话" align="center"></el-table-column>
      <el-table-column label="音视频采集" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showVedio(scope.row)"
          >音视频({{scope.row.audioNum}})</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="samplingNum" label="样品采集"  align="center"> </el-table-column> -->
      <el-table-column label="样品采集" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showSample(scope.row)"
          >采样({{scope.row.samplingNum}})</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" title="复制" size="small" @click="copyForm(scope.row,true)">复制</el-button> -->
          <el-button type="text" title="查看" size="small" @click="showForm(scope.row)">
            <img src="../../assets/ck.png" alt>
          </el-button>
          <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="编辑"
            size="small"
            @click.native.prevent="editForm(scope.row,false)"
          >
            <img src="../../assets/bj.png" alt>
          </el-button>
          <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="删除"
            size="small"
            @click.native.prevent="del(scope.row)"
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
      ispage: "",
      formId: null,
      continueType: null,
      caseType: "",
      btnShow: false
    };
  },
  computed: {
    ...mapGetters(["event"])
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.getListById();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getListById();
    },
    //查看统计数据
    count() {
      this.$router.push({
        path: "/home/statistics",
        params: { eventId: this.event.id }
      });
    },
    //点击查看采样列表
    showSample(row) {
      this.$router.push({
        name: "sample-list",
        params: {
          eventId: this.event.id,
          number: this.event.number,
          id: row.id,
          type: row.type
        }
      });
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
          ispage: "对照"
        }
      });
    },
    getListById() {
      // console.log("对照组调查~");
      //
      axios
        .get(config.apiHost + "/survey/contrastlist", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            eventId: this.event.id,
            name: this.formQuery.name
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData = result.data.body.list;
            this.totalCount = result.data.body.totalCount; //总条数
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //复制表单
    copyForm(row, flag) {
      console.log(row);
      var that = this;
      this.$confirm(
        "点击“复制”会将表单内所有信息，同时复制到新的调查列表，需要您对信息进行再编辑",
        "复制提醒",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          callback: (acction, instance) => {
            if (acction === "confirm") {
              console.log("您点击了确认");
              that.editForm(row, flag);
              //点击确认
              // var that = this
              // axios({
              //   method: 'get',
              //   url: config.apiHost + ''
              // }).then(function(res) {
              //   if (res.data.status == 200) {
              //     this.$router.push({
              //         name: 'show_form',
              //         params: {
              //         caseType: row.formType,
              //         caseId: row.id,
              //         formId: row.formId,
              //         eventId: this.event.id,
              //  urlType:2
              //         }
              //     })
              //   } else {
              //     that.$message({
              //       typ: 'error',
              //       message: res.data.body.message
              //     })
              //   }

              // })
            } else {
              this.$message({
                typ: "info",
                message: "已取消复制"
              });
            }
          },
          type: "warning"
        }
      );
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
    //编辑答案
    editForm(row, flag) {
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            type: 1,
            eventId: this.event.id
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.formId = result.data.body.questionareId;
            this.continueType = result.data.body.continueType;

            this.$router.push({
              name: "fill_form",
              params: {
                fromsId: row.formId,
                eventId: this.event.id,
                type: this.continueType,
                caseType: row.formType,
                caseId: row.id,
                urlType: 2, //1填答案，2编辑答案
                submitCaseType: 2, //1个案，2对照用于编辑答案保存答案时保存接口的caseType
                copyAnswer: flag
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
    //删除对照组
    del(row) {
      this.$confirm("确定要删除该对照组吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios
              .get(config.apiHost + "/survey/deletecase", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: this.event.id,
                  caseId: row.id
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
    // 重选表单（现况）
    changeForm() {
      this.$router.push({
        name: "form_add",
        params: { type: 5, eventId: this.event.id }
      });
    },
    //继续调查
    keepFill() {
      //
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            token: config.token,
            eventId: this.event.id,
            type: 1,
            caseChild: 1
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.formId = result.data.body.questionareId;
            this.continueType = result.data.body.continueType;

            // console.log(this.formId);
            // this.$router.push({name: 'fill_form',params:{fromsId:this.formId,eventId:this.event.id,type:5,caseType:2}});//跳转到填写表单
            this.$router.push({
              name: "fill_form",
              params: {
                fromsId: this.formId,
                eventId: this.event.id,
                type: this.continueType,
                caseType: 2,
                urlType: 1
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
    //发布收集
    publishCon() {
      //
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            eventId: this.event.id,
            type: 1,
            caseChild: 1
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
                domainName: domainName,
                caseType: 2
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
  mounted() {
    if (this.event) {
      this.getListById();
      this.ispage = this.event.ispage;
    }
    axios
      .get(config.apiHost + "/survey/continueWrite", {
        params: {
          //请求参数

          eventId: this.event.id,
          type: 1,
          caseChild: 1
        }
      })
      .then(result => {
        if (result.data.status == 200) {
          if (result.data.body == null) {
            this.btnShow = false;
          } else {
            this.btnShow = true;
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
.infobtn {
  border: 1px solid cornflowerblue;
  border-radius: 5px;
  padding: 2px;
  color: cornflowerblue;
}
</style>
