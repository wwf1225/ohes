<template>
  <!-- 医生表单调查 -->
  <div class="container eventDatialsPage">
    <div class="mytop">
      <div>
        <span>医生表单调查</span>
      </div>
      <div style=" float: right;">
        <el-input
          type="text"
          size="mini"
          v-model="formQuery.name"
          style="width:200px;float:left"
          placeholder="被调查人员"
        ></el-input>
        <el-button size="mini" type="primary" @click="getListById" style="margin: 0 50px 0 20px">搜索</el-button>
        <el-button
          v-show="ispage=='编辑'&&changeFormShow"
          size="mini"
          type="primary"
          @click="keepFill"
        >继续调查</el-button>
        <el-button
          v-show="ispage=='编辑'&&changeFormShow"
          size="mini"
          type="primary"
          @click="changeForm"
        >重选表单</el-button>
        <el-button
          v-show="ispage=='编辑'&&selectFormShow"
          size="mini"
          type="primary"
          @click="changeForm"
        >选择表单</el-button>
        <el-button
          v-show="ispage=='编辑'&&changeFormShow"
          size="mini"
          type="primary"
          @click="publishCon"
        >发布收集</el-button>
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
      <el-table-column label="序号" align="right" width="80">
        <template slot-scope="scope">
          <span class="infobtn" v-if="scope.row.deleteFlag==2">待完善</span>
          <span>{{scope.row.no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="formName" label="表单名称" align="center"></el-table-column>
      <el-table-column prop="name" label="被调查姓名" align="center"></el-table-column>
      <el-table-column prop="surTime" label="调查时间" align="center"></el-table-column>
      <el-table-column prop="surveyorName" label="调查人员" align="center"></el-table-column>
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
      changeFormShow: false,
      selectFormShow: false
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
    // 点击查看视频列表
    showVedio(row) {
      this.$router.push({
        name: "vedio-list",
        params: {
          eventId: this.event.id,
          number: this.event.number,
          id: row.id,
          ispage: "医生"
        }
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
      // console.log(row);
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
            type: 3,
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
                submitCaseType: 100, //1个案，2对照用于编辑答案保存答案时保存接口的caseType
                copyAnswer: flag
              }
            });
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {});
    },
    //删除医生调查表单
    del(row) {
      this.$confirm("确定要删除该医生调查表单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios
              .get(config.apiHost + "/survey/deletedoctor", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: this.event.id,
                  doctorId: row.id
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
      // console.log("医生调查列表~");
      //
      axios
        .get(config.apiHost + "/survey/doctorlist", {
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
    //继续调查
    keepFill() {
      //
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            token: config.token,
            eventId: this.event.id,
            type: 3,
            urlType: 1
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.formId = result.data.body.questionareId;
            this.continueType = result.data.body.continueType;
            // console.log(this.formId);
            // this.$router.push({name: 'fill_form',params:{fromsId:this.formId,eventId:this.event.id,type:3}});//跳转到填写表单
            this.$router.push({
              name: "fill_form",
              params: {
                fromsId: this.formId,
                eventId: this.event.id,
                type: this.continueType,
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
    // 重选表单（个案）
    changeForm() {
      // this.$router.push({
      //   name: 'form_add',
      //   params: { type: 3, eventId: this.event.id }
      // })
      this.$router.push({
        name: "newResAddForm",
        params: { type: 3, eventId: this.event.id }
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
            type: 3
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
  mounted() {
    if (this.event) {
      this.getListById();
      this.ispage = this.event.ispage;
    }
    axios
      .get(config.apiHost + "/survey/continueWrite", {
        params: {
          //请求参数
          type: 3,
          eventId: this.event.id
        }
      })
      .then(result => {
        if (result.data.status == 200) {
          if (result.data.body == null) {
            this.selectFormShow = true;
            this.changeFormShow = false;
          } else {
            this.selectFormShow = false;
            this.changeFormShow = true;
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
