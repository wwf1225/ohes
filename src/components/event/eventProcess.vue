<template>
  <div class="rolebox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>事件管理</el-breadcrumb-item>
        <el-breadcrumb-item>流程中事件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <!-- <el-form :inline="true" :model="formQuery" ref="formQuery" label-width="0px" label-position="right" style="text-align:left;padding-left:10px;padding-top:20px;" class="demo-form-inline">
        <el-select v-model="formQuery.status" placeholder="请选择状态" style="width:120px">
          <el-option v-for="item in eventType" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>

        <el-form-item label="" prop="userName">
          <el-input style="width:300px;" v-model="formQuery.name" placeholder="事件名"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="getEventList()">查询</el-button>
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
      <!-- @row-dblclick="rowClick(row,$event)" -->
      <el-table
        ref="multipleTable"
        align="left"
        :data="tableData"
        border
        element-loading-text="加载中"
        v-loading="loading"
        @selection-change="selectionChange"
        @row-dblclick="showRowDetails"
      >
        <!-- <el-table-column type="selection" align="center" width="80"></el-table-column> -->
        <el-table-column type="index" fixed label="序号" align="center" width="80"></el-table-column>
        <!-- <el-table-column prop="grade" fixed label="事件等级" align="center" width="80">
          <template slot-scope="scope">
            <span
              v-if="eventLeve[scope.row.grade-1]=='I 级'"
              style="color:#e51717"
            >{{eventLeve[scope.row.grade-1]}}</span>
            <span
              v-else-if="eventLeve[scope.row.grade-1]=='II 级'"
              style="color:#ff7519"
            >{{eventLeve[scope.row.grade-1]}}</span>
            <span
              v-else-if="eventLeve[scope.row.grade-1]=='III 级'"
              style="color:#ffe229"
            >{{eventLeve[scope.row.grade-1]}}</span>
            <span
              v-else-if="eventLeve[scope.row.grade-1]=='IV 级'"
              style="color:#006636"
            >{{eventLeve[scope.row.grade-1]}}</span>
            <span v-else style="color:#666666">{{eventLeve[scope.row.grade-1]}}</span>
          </template>fixed
        </el-table-column>-->
        <el-table-column label="接报时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.reportedTime.substr(0,16)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="originName" label="事件来源" align="center"></el-table-column>
        <el-table-column prop="diseaseType" label="疾病类型" align="center"></el-table-column>
        <el-table-column prop="diseaseName" label="疾病名称" align="center"></el-table-column>
        <!-- <el-table-column prop="diseaseType" label="疾病类型" align="center"></el-table-column> -->
        <el-table-column label="事件地点" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.address}}&nbsp;{{scope.row.detailName?scope.row.detailName:''}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="detailName" label="场所名称" align="center" width="150"></el-table-column> -->
        <!-- <el-table-column prop="address" label="事件地点" align="center"></el-table-column> -->
        <el-table-column prop="reportPhone" label="报告人电话" align="center"></el-table-column>
        <el-table-column prop="reportUser" label="报告人姓名" align="center"></el-table-column>
        <!-- <el-table-column prop="userName" label="接报人" align="center"></el-table-column> -->
        <el-table-column label="状态" fixed="right" align="center">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.status==1" size="mini" type="danger" round>未发布</el-button>
            <el-button v-else-if="scope.row.status==2" size="mini" type="primary" round>发布审批</el-button>
            <el-button v-else-if="scope.row.status==3" size="mini" type="success" round>待调查</el-button>
            <el-button v-else-if="scope.row.status==4" size="mini" type="warning" round>调查中</el-button>
            <el-button v-else-if="scope.row.status==5" size="mini" type="warning" round>结案审批</el-button>
            <el-button v-else size="mini" type="warning" round>已结案</el-button>-->
            <el-button
              v-if="scope.row.status==1"
              size="mini"
              type="text"
              disabled
              style="color:#f56c6c;cursor:default"
            >未发布</el-button>
            <el-button
              v-else-if="scope.row.status==2"
              size="mini"
              type="text"
              disabled
              style="color:#409eff;cursor:default"
            >发布审批</el-button>
            <el-button
              v-else-if="scope.row.status==3"
              size="mini"
              type="text"
              disabled
              style="color:#67c23a;cursor:default"
            >待调查</el-button>
            <el-button
              v-else-if="scope.row.status==4"
              size="mini"
              type="text"
              disabled
              style="color:#e6a23c;cursor:default"
            >调查中</el-button>
            <el-button
              v-else-if="scope.row.status==5"
              size="mini"
              type="text"
              disabled
              style="color:#e6a23c;cursor:default"
            >结案审批</el-button>
            <el-button
              v-else
              size="mini"
              type="text"
              disabled
              style="color:#e6a23c;cursor:default"
            >已结案</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="240px" align="center">
          <template slot-scope="scope">
            <div style="text-align:left;padding-left:30px">
              <div class="issueDiv" v-if="config.hasPermission('event:current:publish')">
                <el-button
                  v-if="scope.row.status==1"
                  size="small"
                  type="text"
                  title="发布"
                  @click.native.prevent="issueRow(scope.row)"
                >
                  <img src="../../assets/fb.png" alt>
                </el-button>
                <el-button
                  v-else
                  size="small"
                  type="text"
                  title="增派"
                  @click.native.prevent="addRunner(scope.row)"
                >
                  <img src="../../assets/zp.png" alt>
                </el-button>
              </div>
              <!-- v-if="config.hasPermission('event:current:info')" -->
              <el-button
                @click="showRowDetails(scope.row)"
                v-if="config.hasPermission('event:current:update')"
                type="text"
                size="small"
                title="查看"
              >
                <img src="../../assets/ck.png" alt>
              </el-button>
              <el-button
                v-if="config.hasPermission('event:current:update')  && scope.row.status==4 "
                type="text"
                size="small"
                title="调查"
                @click.native.prevent="updateSurvey(scope.row)"
              >
                <img src="../../assets/dc.png" alt>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="开始调查"
                v-if="scope.row.status==3"
                @click="startSurvey(scope.row)"
              >
                <img src="../../assets/ksdc.png" alt>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="通过"
                v-if="config.hasPermission('event:approve:pass') && scope.row.status==2"
                @click.native.prevent="passEvent(scope.row)"
              >
                <img src="../../assets/tg.png" alt>
              </el-button>
              <el-button
                type="text"
                size="small"
                title="驳回"
                v-if="config.hasPermission('event:approve:reject') && scope.row.status==2"
                @click.native.prevent="rejectRow(scope.row)"
              >
                <img src="../../assets/bh.png" alt>
              </el-button>
              <!-- <el-button
              v-else
              v-show="config.hasPermission('event:current:update')"
              type="text"
              size="small"
              title="编辑"
              @click.native.prevent="updateRow(scope.row)"
            >
              <img src="../../assets/bj.png" alt>
              </el-button>-->
              <el-button
                type="text"
                size="small"
                title="删除"
                v-if="config.hasPermission('event:current:delete') && scope.row.status==1||scope.row.status==3"
                @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"
              >
                <img src="../../assets/sc.png" alt>
              </el-button>
            </div>
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

      <!--发布时，事件派发弹框-->
      <el-dialog
        width="28%"
        id="dialog"
        :visible.sync="dialogShowVisible"
        :before-close="handleClose"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div class="divbox">
          <div class="header">
            <strong>事件派发</strong>
            <div class="two-s">
              <!-- 暂时去掉 -->
              <span style="font-size: 12px;">指派&nbsp;&nbsp;</span>
              <el-switch v-model="isYES" active-value="1" inactive-value="0"></el-switch>
            </div>
            <button
              type="button"
              aria-label="Close"
              class="el-dialog__headerbtn close-btn"
              @click="dialogShowVisible=false"
            >
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
          <!--事件详情-->
          <!-- <div class="detail">
            <div class="one">
              <div>
                <label>事件编号</label>
                <span style="color: #3F99DB;">{{form.number}}</span>
              </div>
              <div style="margin-top: 10px;">
                <label>事件名称：</label>
                <span style="color: #3F99DB;">{{form.name}}</span>
              </div>
            </div>
            <div class="two" v-show="isExamin">
              <span style="font-size: 12px;">是否审批</span>
              <el-switch v-model="isYES" active-value="1" inactive-value="0"></el-switch>
            </div>
          </div>-->
          <!--表格-->
          <div class="treeBox">
            <div class="treeDiv" v-for="(item , k1) in ReleaseList" :key="k1">
              <div class="left">
                {{ item.name}}
                <!-- <i
                  class="el-icon-minus"
                  v-show="activeIndex===k1"
                  style="float: right;"
                  @click="closeRow(k1)"
                ></i>
                <i
                  class="el-icon-plus"
                  v-show="activeIndex!=k1"
                  style="float: right;"
                  @click="closeRow(k1)"
                ></i>-->
              </div>
              <div class="mainRow" :id="k1" v-show="activeIndex===k1">
                <div class="rowTwo" v-if="item.listUser.length>0">
                  <el-checkbox-group v-model="checkedPeople">
                    <el-checkbox
                      v-for="(people ,k4) in item.listUser"
                      :label="people.id"
                      :key="k4"
                    >{{people.account}}</el-checkbox>
                  </el-checkbox-group>
                  <div class="more" title="展开" v-if="item.listUser.length>6" @click="showMore">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <div
                  class="row"
                  v-if="item.childrenList.length>0"
                  v-for="(dept , k2) in item.childrenList"
                  :key="k2"
                >
                  <!-- 部门 -->
                  <div class="left">{{ dept.name}}</div>
                  <!-- 人员 -->
                  <div class="right" v-if="dept.listUser.length>0">
                    <div class="item" v-for="(val , k3) in dept.listUser" :key="k3">
                      <el-checkbox v-model="checkedPeople" :label="val.id">{{val.userName}}</el-checkbox>
                    </div>
                  </div>
                  <div class="right" v-else>
                    <span>暂无人员</span>
                  </div>
                  <div class="more" title="展开" v-if="dept.listUser.length>6" @click="showMore">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <el-button type="text" class="cancel" size="medium" @click="closeissue">取消</el-button>
            <el-button type="text" class="ok" size="medium" @click="issue">确认</el-button>
          </div>
        </div>
      </el-dialog>
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
        // status: "1,2,3,4"
        status: "2,3,4"
      },
      form: {
        name: "", //事件名称
        reportUser: "", //报告人
        reportPhone: "", //报告人电话
        originId: "", //报告来源（下拉）
        reportedTime: null, //接报时间
        startTime: null, //开始时间
        address: "", //地点
        caseNumber: "", //疑似病例数
        placeId: "", //事件场所（下拉）
        comment: "", //事件概要
        status: "", //保存
        longitude: 111, //经度
        latitude: 12222, //纬度
        genre: "", //疑似事件类型
        userIdList: "" //发布所选人员
      },
      checkedPeople: [], //一级下选中的id
      isYES: "0", //开关
      tableData: [],
      page: 1,
      limit: 10,
      totalCount: null,
      searchInfo: "",
      startTime: "",
      endTime: "",
      dialogShowVisible: false,
      ReleaseList: [],
      //   0-传染病   1-食源性疾病
      eventType: [
        {
          id: 0,
          name: "全部"
        },
        {
          id: 1,
          name: "待发布"
        },
        {
          id: 2,
          name: "待审核"
        },
        {
          id: 3,
          name: "待调查"
        },
        {
          id: 4,
          name: "调查中"
        }
      ],
      eventLeve: ["I 级", "II 级", "III 级", "IV 级", "未分级"],
      eventCat: [
        { id: 1, name: "单病例" },
        { id: 2, name: "群体性" },
        { id: 3, name: "其他事件" }
      ],
      isClose: true,
      activeIndex: null,
      locationAreaId: null,
      btnType: "",
      surUserList: [],
      isExamin: false,
      deleteids: []
    };
  },
  methods: {
    handleClose(done) {
      this.getEventList();
      this.dialogShowVisible = false;
      this.checkedPeople = [];
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getEventList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getEventList();
    },
    closeRow(id) {
      // console.log(id)
      if (id == this.activeIndex) {
        this.activeIndex = -1;
        return;
      }
      this.activeIndex = id;
      // this.isClose=!this.isClose;
    },
    // 查看
    handleClick(row) {
      // console.log(row);
      // this.$store.dispatch('showEventDetail',row);
      // this.$router.push({path: '/home/event-show'});
      row.ispage = "查看";
      row.isUrl = "eventNow";
      // console.log(row);
      this.$store.dispatch("showEventDetail", row);
      this.$router.push({ path: "/home/past-event-detail" });
    },
    rowClick(row, column) {
      column.ispage = "查看";
      column.isUrl = "eventNow";
      this.$store.dispatch("showEventDetail", column);
      this.$router.push({ path: "/home/past-event-detail" });
    },
    //开始调查
    startSurvey(row) {
      // console.log(row.id);
      this.$confirm("确定要开始调查吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            axios
              .get(config.apiHost + "/survey/update", {
                params: {
                  token: config.token,
                  eventId: row.id
                }
              })
              .then(result => {
                if (result.data.status == 200) {
                  this.$message.success("该事件已经开始调查");
                  this.getEventList();
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
    //确认审批通过
    passEvent(row) {
      this.$confirm("确定通过吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            axios
              .get(config.apiHost + "/updateStatus", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: row.id
                }
              })
              .then(
                result => {
                  // console.log(result.data.status);
                  if (result.data.status == 200) {
                    this.getEventList();
                    this.$message(result.data.body.msg);
                  } else {
                    this.$message(result.data.body.message);
                  }
                },
                error => {
                  this.$message.error(error);
                }
              );
          }
        },
        type: "warning"
      });
    },
    //驳回
    rejectRow(row) {
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
                this.getEventList();
              } else {
                this.$message.error(res.data.body.message);
              }
            })
            .catch(response => {
              this.$message.error(response);
            });
        })
        .catch(() => {});
    },
    //事件编辑
    updateRow(row) {
      row.isUrl = "eventNow";
      this.$store.dispatch("showEventDetail", row);
      // this.$router.push({ path: '/home/event-update' })
      this.$router.push({ path: "/home/eventEdit" });
    },
    // 双击事件
    showRowDetails(row) {
      if (row.status == 4) {
        //编辑调查
        // console.log(row);
        row.ispage = "编辑";
        row.isUrl = "surveyTasks";
        this.$store.dispatch("showEventDetail", row);
        this.$router.push({ path: "/home/survey-update" });
        return;
      }
      if (config.hasPermission("event:current:update")) {
        this.updateRow(row);
        return;
      }
      if (config.hasPermission("event:current:info")) {
        this.handleClick(row);
      }
    },
    //编辑表格详情
    updateSurvey(row) {
      // console.log(row);
      row.ispage = "编辑";
      row.isUrl = "eventNow";
      this.$store.dispatch("showEventDetail", row);
      this.$router.push({ path: "/home/survey-update" });
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
              this.getEventList();
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
    //点击发布
    issueRow(row) {
      this.btnType = 1;
      this.isExamin = true;
      // console.log(this.isExamin);
      this.form = row;
      this.dialogShowVisible = true;
      this.getReleasedep();
    },
    //添加流调员
    addRunner(row) {
      // addRunner
      this.btnType = 2;
      this.isExamin = false;
      var str = row.surUsers;
      this.checkedPeople = str ? str.split(",") : [];
      for (var i = 0; i < this.checkedPeople.length; i++) {
        this.checkedPeople[i] = parseInt(this.checkedPeople[i]);
      }
      this.form = row;
      this.dialogShowVisible = true;
      this.getReleasedep();
    },
    //确认发布
    issue() {
      this.form.userIdList = this.checkedPeople.join();
      if (this.btnType == 1) {
        if (this.form.userIdList != null && this.form.userIdList != "") {
          axios
            .get(config.apiHost + "/current-events/releaseSure", {
              params: {
                //请求参数
                token: config.token,
                eventId: this.form.id,
                auditId: this.isYES,
                userIdList: this.form.userIdList
              }
            })
            .then(
              result => {
                //  console.log(result.data.status);
                if (result.data.status == 200) {
                  //发布成功
                  this.$message(result.data.body.msg);
                  this.dialogShowVisible = false; //关闭弹框
                  this.getEventList();
                  this.checkedPeople = [];
                } else {
                  //发布失败
                  this.$message(result.data.body.message);
                }
              },
              error => {
                this.$message.error(error);
              }
            );
        } else {
          this.$message.error("请选择发布人");
        }
      } else {
        //点击添加流调员
        if (
          this.form.userIdList != null &&
          this.form.userIdList != "" &&
          this.form.userIdList.length > 0
        ) {
          axios({
            method: "post",
            url: config.apiHost + "/updateEventUser",
            data: {
              //请求参数

              id: this.form.id,
              // auditId: this.isYES,
              surUsers: this.form.userIdList
            }
          }).then(
            result => {
              // console.log(result.data.status);
              if (result.data.status == 200) {
                //发布成功
                this.$message(result.data.body.msg);
                this.dialogShowVisible = false; //关闭弹框
                this.getEventList();
                this.checkedPeople = [];
              } else {
                //发布失败
                this.$message(result.data.body.message);
              }
            },
            error => {
              this.$message.error(error);
            }
          );
        } else {
          this.$message.error("请选择发布人");
        }
      }
    },
    //关闭发布
    closeissue() {
      this.getEventList();
      this.dialogShowVisible = false;
      this.checkedPeople = [];
    },
    //事件发布人员列表
    getReleasedep() {
      //
      axios
        .get(config.apiHost + "/current-events/releasedep", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            // console.log(result.data);
            if (result.data.status == 200) {
              this.ReleaseList = result.data.body;
              this.locationAreaId = result.data.locationAreaId;
              for (let i = 0; i < this.ReleaseList.length; i++) {
                const element = this.ReleaseList[i];
                if (element.areaId == this.locationAreaId) {
                  this.activeIndex = i;
                }
              }
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    //事件列表
    getEventList() {
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
          // console.log(result.data);
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
    showMore(e) {
      // more
      let el = e.target.parentNode;
      el.classList.toggle("active");
      // row / rowTwo
      el.parentNode.classList.toggle("show");
    }
  },
  created() {
    this.getEventList();
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
  /* position: absolute; */
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
  /* overflow:hidden; */
}
.now_main {
  height: 100%;
  /* min-height: 100%; */
  min-height: 800px;
  width: 100%;
  /* position: relative; */
  background-color: #ffffff;
  /* padding: 10px; */
}
.issueDiv {
  display: inline-block;
  /* border: 1px solid #9CBEF1; */
  height: 25px;
  padding-left: 5px;
  padding-right: 10px;
  margin-left: 5px;
  box-sizing: border-box;
}

/* 发布弹出框 */
.divbox {
  /* width: 450px; */
  height: 625px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 10px 10px;
  padding-bottom: 50px;
}
.mainRow {
  padding: 0 25px 20px;
  margin-bottom: 50px;
}
.header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  text-align: center;
  position: relative;
  border-bottom: solid 1px #f0f0f0;
}
.header strong {
  color: #333;
  font-weight: bold;
  font-size: 18px;
}
.detail {
  width: 100%;
  height: 100px;
  background: #fafbff;
  margin-top: 5px;
  margin-bottom: 10px;
  display: flex;
  box-sizing: border-box;
}
.one {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding-left: 25px;
}
.two-s {
  width: 100px;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 10px;
}
.close-btn {
  width: 50px;
  right: 0;
}
.treeDiv {
  width: 100%;
  height: 100%;
  /* background: #eff6fc; */
  margin-right: 25px;
  margin: 0 auto;
  /* border-bottom: solid 1px #f0f0f0; */
}
.treeBox {
  min-height: 520px;
  max-height: 520px;
  margin-bottom: 50px;
  overflow-y: auto;
  border-radius: 0 0 10px 10px;
}
/*滚动条整体样式*/
.treeBox::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.treeBox::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
.treeBox::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}
.tree-h {
  height: 30px;
  line-height: 30px;
  padding: 5px;
  font-size: 15px;
  text-align: left;
  background: #def0fe;
  box-sizing: border-box;
}
.row {
  /* display: flex; */
  height: 95px;
  line-height: 20px;
  margin-top: 10px;
  padding: 15px 0;
  border-radius: 10px;
  overflow: hidden;
  /* border-left: 2px solid skyblue; */
  position: relative;
  background: #fbfbfb url("../../assets/event01.png") repeat-y left;
}
.rowTwo {
  height: 53px;
  overflow: hidden;
  padding: 0 10px 15px;
  line-height: 20px;
  text-align: left;
  background: #fbfbfb url("../../assets/event01.png") repeat-y left;
  border-radius: 0 0 10px 10px;
  position: relative;
}
.rowTwo .el-checkbox-group .el-checkbox {
  min-width: 33%;
}
.el-checkbox + .el-checkbox {
  margin: 0;
}

.row.show,
.rowTwo.show {
  height: auto;
  overflow: auto;
}

.left {
  /* width: 100%; */
  text-align: left;
  padding-left: 10px;
  padding-bottom: 5px;
  box-sizing: border-box;
  background: #fbfbfb url("../../assets/event01.png") repeat-y left;
  color: #333;
  font-size: 16px;
}
.treeDiv > .left {
  margin: 20px 25px 0;
  border-radius: 10px 10px 0 0;
  padding-top: 15px;
}
.right {
  /* flex: 1; */
  width: 100%;
  line-height: 25px;
  padding: 0 10px;
  text-align: left;
}
.more {
  position: absolute;
  height: 50px;
  width: 50px;
  top: 45px;
  right: 0;
  cursor: pointer;
  text-align: center;
}
.rowTwo .more {
  top: 0;
}
.more.active i {
  transform: rotate(90deg);
  color: #429e73;
}
.item {
  min-width: 33%;
  text-align: left;
  display: inline-block;
  margin-top: 0;
  margin: 0;
  /* border: 1px solid #E3EBF3; */
}
.footer {
  width: 100%;
  position: absolute;
  height: 55px;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 999;
  border-radius: 0 0 10px 10px;
  padding: 10px 25px 0;
}
/* .footer .el-button:last-child {
  background: #429e73;
  color: #fff;
}
.footer .el-button:first-child {
  background: #fff;
  color: #429e73;
  border: 1px solid #429e73;
} */
.cancel {
  width: 150px;
  font-size: 14px;
  border: 1px solid #429e73;
}
.cancel:hover {
  color: #fff;
  background: #429e73;
}
.ok {
  width: 150px;
  font-size: 14px;
  background: #429e73;
  color: #fff;
}
.ok:hover {
  background: #006636;
}
.el-dialog__headerbtn {
  top: 0;
}
.page_main {
  /* text-align: right; */
  margin: 45px 15px 20px 0px;
}
</style>

