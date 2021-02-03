<template>
  <!-- 个案调查 -->
  <div class="container eventDatialsPage">
    <div class="mytop">
      <div>
        <!-- <span>个案调查</span> -->
        <!-- <input type="text" v-model="formQuery.name" placeholder="被调查人员" style=" outline: none;padding-left: 5px;">
        <el-button size="mini" type="primary" @click="getListById()">搜索</el-button>-->
      </div>
      <div style=" float: right;">
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
        <el-button size="mini" type="primary" @click="count" v-show="changeFormShow">统计</el-button>
        <el-button
          v-show="ispage=='编辑'&&changeFormShow&&exportShow"
          size="mini"
          type="primary"
          @click="exportFun"
        >导出</el-button>
      </div>
    </div>
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="个案调查表">
        <el-table
          ref="multipleTable"
          align="left"
          :data="tableData"
          border
          element-loading-text="拼命加载中"
          tooltip-effect="dark"
          style="width: 100% ;"
          @selection-change="handleSelectionChangeCase"
        >
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <el-table-column label="序号" align="center" width="80">
            <template slot-scope="scope">
              <span class="infobtn" v-if="scope.row.deleteFlag==2">待完善</span>
              <span>{{scope.row.no}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="formName" label="表单名称" align="center"></el-table-column>
          <el-table-column prop="name" label="被调查姓名" align="center"></el-table-column>
          <el-table-column prop="ageCh" label="年龄" align="center"></el-table-column>
          <el-table-column prop="phone" label="电话" align="center"></el-table-column>
          <el-table-column prop="surTime" label="调查时间" align="center"></el-table-column>
          <el-table-column prop="surveyorName" label="调查人员" align="center"></el-table-column>
          <!-- <el-table-column prop="userId" label="调查来源" align="center"> </el-table-column> -->
          <el-table-column label="音视频采集" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="showVedio(scope.row)"
              >音视频({{scope.row.audioNum}})</el-button>
            </template>
          </el-table-column>
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
              <!-- <el-button type="text" size="small" @click="copyForm(scope.row)">复制</el-button> -->
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
              <!-- <el-button v-show="ispage=='编辑'" type="primary" round size="mini" @click.native.prevent="del(scope.row)">删除</el-button> -->
              <el-button
                v-show="ispage=='编辑'"
                type="text"
                title="删除"
                size="small"
                @click.native.prevent="del(scope.row)"
              >
                <img src="../../assets/sc.png" alt>
              </el-button>
              <!-- <el-button type="text" size="small" @click="exportFun(scope.row)">导出</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 class="block"-->
        <!-- <div style=" margin: 10px 0;text-align:center"> -->
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
          style="background-color:#fff;padding:20px 0;text-align:center"
        ></el-pagination>
        <!-- </div> -->
      </el-tab-pane>
      <el-tab-pane label="个案一览表">
        <el-table
          ref="multipleTable"
          :data="tableDataList"
          bordertooltip-effect="dark"
          border
          style="width: 100%"
          @selection-change="handleSelectionChangeCaseList"
        >
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <el-table-column label="序号" align="center" width="80">
            <template slot-scope="scope">
              <span class="infobtn" v-if="scope.row.deleteFlag==2">待完善</span>
              <span>{{scope.row.no}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="formName" label="表单名称" align="center"></el-table-column>
          <el-table-column prop="name" label="被调查姓名" align="center"></el-table-column>
          <el-table-column prop="age" label="年龄" align="center"></el-table-column>
          <el-table-column prop="surTime" label="调查时间" align="center"></el-table-column>
          <el-table-column prop="surveyorName" label="调查人员" align="center"></el-table-column>
          <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
          <!-- <el-table-column prop="userId" label="调查来源" align="center"> </el-table-column> -->
          <el-table-column label="音视频采集" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="showVedio(scope.row)"
              >音视频({{scope.row.audioNum}})</el-button>
            </template>
          </el-table-column>
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
        <el-pagination
          style="background-color:#fff;padding:20px 0;text-align:center"
          background
          @current-change="handleCurrentChangeIndividualCaseList"
          :page-size="pageSize"
          :current-page="page"
          layout="total, prev, pager, next, jumper"
          :total="totalCountList"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
var Cookies = require("js-cookie");
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
      tableDataList: [],
      totalCountList: 0,
      pageSize: 10,
      pageNum: 1,
      totalIndividualCaseList: 0,
      eventId: "",
      ispage: "",
      formId: null,
      continueType: null,
      currentTab: "个案调查表",
      changeFormShow: false,
      selectFormShow: false,
      tableSelectionCase: [],
      tableSelectionCaseList: [],
      exportShow: false
    };
  },
  computed: {
    ...mapGetters(["event"])
  },
  methods: {
    handleSelectionChangeCase(selection) {
      this.tableSelectionCase = selection;
    },
    handleSelectionChangeCaseList(selection) {
      this.tableSelectionCaseList = selection;
    },
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
      console.log(this.event.id);
      this.$router.push({
        name: "vedio-list",
        params: {
          eventId: this.event.id,
          number: this.event.number,
          id: row.id,
          ispage: "个案"
        }
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
    //查看统计数据
    count() {
      this.$router.push({
        path: "/home/statistics",
        params: { eventId: this.event.id }
      });
    },
    getListById() {
      // console.log("个案列表~");
      let param = {};
      if (this.currentTab == "个案调查表") {
        param.caseChild = 1;
        param.page = this.page;
        param.limit = this.limit;
        param.eventId = this.event.id;
        param.name = this.formQuery.name;
      } else if (this.currentTab == "个案一览表") {
        param.caseChild = 2;
        param.page = this.pageNum;
        param.limit = this.pageSize;
        param.eventId = this.event.id;
        param.name = this.formQuery.name;
      }
      axios
        .get(config.apiHost + "/survey/caselist", {
          params: param
        })
        .then(result => {
          if (result.data.status == 200) {
            if (this.currentTab == "个案调查表") {
              this.tableData = result.data.body.list;
              console.log(result.data.body);
              this.totalCount = result.data.body.totalCount; //总条数
            } else if (this.currentTab == "个案一览表") {
              this.tableDataList = result.data.body.list;
              this.totalIndividualCaseList = result.data.body.totalCount;
            }
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
    copyForm(row) {
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
              that.editForm(row, true);
              // console.log("您点击了确认");
              //     this.$router.push({
              //       name: 'fill_form',
              //       params: {
              //       caseType: row.formType,
              //       caseId: row.id,
              //       formId: row.formId,
              //       eventId: this.event.id,
              //       urlType:2//重填答案
              //       }
              //   });
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
              //         eventId: this.event.id
              // urlType:2
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
      //    console.log(row);
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
    editForm(row, flag) {
      let caseChild = 1;
      if (this.currentTab == "个案调查表") {
        caseChild = 1;
      } else if (this.currentTab == "个案一览表") {
        caseChild = 2;
      }
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            caseChild: caseChild,
            type: 1,
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
                urlType: 2,
                submitCaseType: 1, //1个案，2对照用于编辑答案保存答案时保存接口的caseType
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
    //删除个案
    del(row) {
      this.$confirm("确定要删除该个案吗？", "提示", {
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

    // 重选表单（个案）
    changeForm() {
      let caseChild = 1;
      if (this.currentTab == "个案调查表") {
        caseChild = 1;
      } else if (this.currentTab == "个案一览表") {
        caseChild = 2;
      }
      // this.$router.push({
      //   name: 'form_add',
      //   params: { type: 1, eventId: this.event.id }
      // })
      this.$router.push({
        name: "newResAddForm",
        params: { type: 1, eventId: this.event.id, caseChild: caseChild }
      });
    },
    //发布收集
    publishCon() {
      //
      let caseChild = 1;
      if (this.currentTab == "个案调查表") {
        caseChild = 1;
      } else if (this.currentTab == "个案一览表") {
        caseChild = 2;
      }
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            caseChild: caseChild,
            eventId: this.event.id,
            type: 1
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
                caseType: 1
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
    },
    exportFun() {
      let caseId = "";
      let caseChild = "";
      if (this.currentTab == "个案调查表") {
        if (this.tableSelectionCase.length == 0) {
          this.$message.info("请选择要导出的数据");
          return;
        }
        this.tableSelectionCase.forEach(element => {
          caseId += "," + element.id;
        });
        caseChild = 1;
      } else {
        if (this.tableSelectionCaseList.length == 0) {
          this.$message.info("请选择要导出的数据");
          return;
        }
        this.tableSelectionCaseList.forEach(element => {
          caseId += "," + element.id;
        });
        caseChild = 2;
      }
      caseId = caseId.substring(1);
      // console.log(caseId)
      // return

      location.href =
        config.apiHost +
        "/export/exportAnswerFroms" +
        "?caseType=1&caseId=" +
        caseId +
        "&eventId=" +
        this.event.id +
        "&caseChild=" +
        caseChild +
        "&token=" +
        Cookies.get("token");

      // location.href =
      //   config.apiHost +
      //   '/export/exportAnswerFroms' +
      //   '?caseType=' +
      //   row.formType +
      //   '&caseId=' +
      //   row.id +
      //   '&fromsId=' +
      //   row.formId +
      //   '&eventId=' +
      //   this.event.id +
      //   '&token=' +
      //   Cookies.get('token')
    },
    //继续调查
    keepFill() {
      let caseChild = 1;
      if (this.currentTab == "个案调查表") {
        caseChild = 1;
      } else if (this.currentTab == "个案一览表") {
        caseChild = 2;
      }
      //
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            caseChild: caseChild,
            eventId: this.event.id,
            type: 1
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
                fromsId: this.formId,
                eventId: this.event.id,
                type: this.continueType,
                caseType: 1,
                urlType: 1,
                caseChild: 1
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

    /**
     * 个案一览表 */
    //分页大小变化
    handleSizeChangeIndividualCaseList(val) {
      this.pageSize = val;
      this.getListById();
    },
    //当前页变化
    handleCurrentChangeIndividualCaseList(val) {
      this.pageNum = val;
      this.getListById();
    },

    tabClick(tab, event) {
      // console.log(tab, event)
      this.currentTab = tab.label;
      if (this.currentTab == "个案调查表") {
        this.getIsShow(1);
        this.exportShow = false;
      } else {
        this.getIsShow(2);
        this.exportShow = true;
      }
    },
    getIsShow(caseChild) {
      axios
        .get(config.apiHost + "/survey/continueWrite", {
          params: {
            //请求参数
            caseChild: caseChild,
            type: 1,
            eventId: this.event.id
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            if (result.data.body == null) {
              //显示选择表单
              this.selectFormShow = true;
              this.changeFormShow = false;
            } else {
              //显示重选表单
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
    },
    initData(type) {
      axios
        .get(config.apiHost + "/survey/caselist", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            eventId: this.event.id,
            name: this.formQuery.name,
            caseChild: type
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            if (type == 1) {
              this.tableData = result.data.body.list;
              console.log(result.data.body);
              this.totalCount = result.data.body.totalCount; //总条数
            } else if (type == 2) {
              this.tableDataList = result.data.body.list;
              this.totalCountList = result.data.body.totalCount; //总条数
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
  },

  mounted() {
    if (this.event) {
      this.initData(1);
      this.initData(2);
      this.ispage = this.event.ispage;
    }
    axios
      .get(config.apiHost + "/survey/continueWrite", {
        params: {
          //请求参数
          caseChild: 1,
          type: 1,
          eventId: this.event.id
        }
      })
      .then(result => {
        if (result.data.status == 200) {
          if (result.data.body == null) {
            //显示选择表单
            this.selectFormShow = true;
            this.changeFormShow = false;
          } else {
            //显示重选表单
            this.changeFormShow = true;
            this.selectFormShow = false;
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

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: white;
  /* margin-top: 15px; */
  /* border: 1px solid #797979; */
  /* background-color: skyblue */
  position: relative;
}
.mytop {
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  position: absolute;
  right: 10px;
  top: -2px;
  z-index: 99;
}
.mytop > div:nth-child(1) {
  padding: 0 20px;
  background: #000;
  border-radius: 5px 5px 0 0;
  background: #a5cfbb;
  color: #fff;
}
.infobtn {
  border: 1px solid cornflowerblue;
  border-radius: 5px;
  padding: 2px;
  color: cornflowerblue;
}
.el-tabs--border-card {
  border: 0 !important;
}
.el-tabs--border-card > .el-tabs__header {
  border-left: 1px solid #ebeef5;
  border-radius: 4px 4px 0 0;
}
</style>
