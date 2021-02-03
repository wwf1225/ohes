<template>
  <!-- 所有有下面表格的修改 -->
  <div class="mybox">
    <div class="exam">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>调查任务</el-breadcrumb-item>
        <el-breadcrumb-item>调查详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="float: right;">
        <el-button size="mini" type="success" style=" margin: auto 0" @click="$router.go(-1)">返回</el-button>
      </div>
    </div>

    <div class="event-title" @click="openTop">事件接报
      <!-- <img :src="topOpenClose" @click="openTop" alt> -->
      <div :class="{open:topOpenClose=='open',close:topOpenClose=='close'}"></div>
    </div>
    <div class="from-box" :class="{open:topOpenClose=='open'}">
      <div class="info">
        <div class="info-head">
          <img src="../../assets/event02.png" style="vertical-align:middle;">&nbsp;&nbsp;信息获取-报告人信息
        </div>
        <div class="input-div">
          <el-form :model="form" class="event-form" :inline="true" label-width="100px">
            <el-form-item label="接 报 时 间">
              <el-input type="text" class="inp inp-per" v-model="form.reportedTime" readonly></el-input>
            </el-form-item>
            <el-form-item label="报告人姓名" class="center_">
              <el-input type="text" class="inp inp-per" v-model="form.reportUser" readonly></el-input>
            </el-form-item>
            <el-form-item label="报告人电话" class="right_">
              <el-input type="text" class="inp inp-per" v-model="form.reportPhone" readonly></el-input>
            </el-form-item>
            <el-form-item label="报 告 来 源">
              <el-input type="text" class="inp inp-per" v-model="form.originName" readonly></el-input>
            </el-form-item>
            <el-form-item label="接报人姓名" class="center_">
              <el-input type="text" class="inp inp-per" v-model="form.userName" readonly></el-input>
            </el-form-item>
            <el-form-item label="接报人科室" class="right_">
              <el-input type="text" class="inp inp-per" v-model="form.departmentName" readonly></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="info">
        <div class="info-head">
          <img src="../../assets/event03.png" style="vertical-align:middle;">&nbsp;&nbsp;核实信息-事件概况
        </div>
        <div class="input-div">
          <el-form :model="form" class="event-form" :inline="true" label-width="100px">
            <el-form-item label="事 件 场 所">
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.placeName"
                readonly
                style="width:45%"
              ></el-input>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.otherPlaces"
                v-show="eventPlace"
                readonly
                style="width:45%;margin-left:5px;"
              ></el-input>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.detailName"
                v-show="!eventPlace"
                readonly
                style="width:45%;margin-left:5px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="事 件 地 点" class="center_">
              <el-input type="text" class="inp inp-per" v-model="form.address" readonly></el-input>
            </el-form-item>
            <el-form-item label="事 件 等 级" class="right_">
              <el-input
                type="text"
                ref="eventLevelColor"
                class="inp inp-per"
                v-model="form.grade"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item label="事 件 类 型">
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.diseaseType"
                style="width:45%"
                readonly
              ></el-input>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.diseaseName"
                style="width:45%;margin-left:5px;"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item label="事 件 种 类" class="center_">
              <el-input type="text" class="inp inp-per" v-model="form.originName" readonly></el-input>
            </el-form-item>
            <el-form-item label="疑似病例数" class="right_">
              <el-input type="text" class="inp inp-per" v-model="form.caseNumber" readonly></el-input>
            </el-form-item>
            <!-- <div class="address">
              <label class="el-form-item__label" style="line-height: 40px">通 讯 地 址</label>
              <div>
                <el-input type="text" v-model="form.comment" readonly></el-input>
              </div>
            </div>-->
            <div class="address">
              <label class="el-form-item__label" style="line-height: 40px">事 件 概 要</label>
              <div>
                <el-input type="text" v-model="form.comment" readonly></el-input>
              </div>
            </div>
            <div class="address">
              <label class="el-form-item__label" style="line-height: 40px">流 调 人 员</label>
              <div>
                <span v-if="form.userNameList==''||form.userNameList==null" style="color:#409EFF">暂无</span>
                <el-tag
                  v-else
                  v-for="(item,index) in form.userNameList.split(',')"
                  :key="index"
                  v-text="item"
                  style="margin-right:10px;"
                ></el-tag>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!--调查列表-->
    <!-- v-show="nums.countScene!=0||nums.countCase!=0||nums.countContrast!=0||nums.countDoctor!=0||nums.countOtherSampling!=0||nums.countSampling!=0||nums.countReport!=0" -->
    <div class="event-title" @click="openBottom">调查列表
      <!-- <img :src="bottomOpenClose" @click="openBottom" alt> -->
      <div :class="{open:bottomOpenClose=='open',close:bottomOpenClose=='close'}"></div>
    </div>
    <div class="choose" :class="{open:bottomOpenClose=='open'}">
      <div class="list" v-show="nums!=null">
        <router-link
          v-if="nums.countScene>0"
          :to="{ path:'/home/survey-update/new-research' }"
          replace
        >
          <!-- @click.native="remberLocal('/home/survey-update/new-research')" -->
          <div class="btn2">
            <p class="num">
              {{nums.countScene}}
              <span>个</span>
            </p>
            <p class="title">现况调查</p>
            <el-progress
              type="circle"
              :percentage="nums.countScene/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#1bbab8"
            ></el-progress>
          </div>
        </router-link>
        <div v-else class="btn2" @click="addForm(2)">
          <p class="num">
            {{nums.countScene}}
            <span>个</span>
          </p>
          <p class="title">现况调查</p>
          <el-progress
            type="circle"
            :percentage="0"
            :width="120"
            :stroke-width="8"
            :show-text="false"
            color="#1bbab8"
          ></el-progress>
        </div>

        <router-link
          v-if="nums.countCase>0||nums.haveCreated==1"
          :to="{ path:'/home/survey-update/case-research'}"
          replace
        >
          <!-- @click.native="remberLocal('/home/survey-update/case-research')" -->
          <div class="btn2">
            <p class="num">
              {{nums.countCase}}
              <span>个</span>
            </p>
            <p class="title">个案调查</p>
            <el-progress
              type="circle"
              :percentage="nums.countCase/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="fdb45c"
            ></el-progress>
          </div>
        </router-link>
        <div v-else class="btn2" @click="addForm(1)">
          <p class="num">
            {{nums.countCase}}
            <span>个</span>
          </p>
          <p class="title">个案调查</p>
          <el-progress
            type="circle"
            :percentage="0"
            :width="120"
            :stroke-width="8"
            :show-text="false"
            color="fdb45c"
          ></el-progress>
        </div>

        <router-link
          v-if="nums.countContrast>0||nums.haveCreated==1"
          :to="{ path:'/home/survey-update/group-research'}"
          replace
        >
          <!-- @click.native="remberLocal('/home/survey-update/group-research')" -->
          <div class="btn2">
            <p class="num">
              {{nums.countContrast}}
              <span>个</span>
            </p>
            <p class="title">对照组调查</p>
            <el-progress
              type="circle"
              :percentage="nums.countContrast/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#921ff5"
            ></el-progress>
          </div>
        </router-link>
        <div v-else class="btn2" @click="addForm(5)">
          <p class="num">
            {{nums.countContrast}}
            <span>个</span>
          </p>
          <p class="title">对照组调查</p>
          <el-progress
            type="circle"
            :percentage="0"
            :width="120"
            :stroke-width="8"
            :show-text="false"
            color="#921ff5"
          ></el-progress>
        </div>

        <!-- <router-link
          v-if="nums.countDoctor>0"
          :to="{ path:'/home/survey-update/doctor-research'}"
          replace
        >
          <div class="btn2">
            <p class="num">
              {{nums.countDoctor}}
              <span>个</span>
            </p>
            <p class="title">医生调查表单</p>
            <el-progress
              type="circle"
              :percentage="nums.countDoctor/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#3747e3"
            ></el-progress>
          </div>
        </router-link>
        <div v-else class="btn2" @click="addForm(3)">
          <p class="num">
            {{nums.countDoctor}}
            <span>个</span>
          </p>
          <p class="title">医生调查表单</p>
          <el-progress
            type="circle"
            :percentage="0"
            :width="120"
            :stroke-width="8"
            :show-text="false"
            color="#3747e3"
          ></el-progress>
        </div>-->
        <router-link :to="{ path:'/home/survey-update/other-sample'}" replace>
          <div v-if="nums.countOtherSampling>0" class="btn2">
            <p class="num">
              {{nums.countOtherSampling}}
              <span>个</span>
            </p>
            <p class="title">食物采样</p>
            <el-progress
              type="circle"
              :percentage="nums.countOtherSampling/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#2692e5"
            ></el-progress>
          </div>
          <div v-else class="btn2">
            <p class="num">
              {{nums.countOtherSampling}}
              <span>个</span>
            </p>
            <p class="title">食物采样</p>
            <el-progress
              type="circle"
              :percentage="0"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#2692e5"
            ></el-progress>
          </div>
        </router-link>

        <router-link :to="{ path:'/home/survey-update/out-sample'}" replace>
          <div v-if="nums.countSampling>0" class="btn2">
            <p class="num">
              {{nums.countSampling}}
              <span>个</span>
            </p>
            <p class="title">外环境采样</p>
            <el-progress
              type="circle"
              :percentage="nums.countSampling/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#ffbb04"
            ></el-progress>
          </div>
          <div v-else class="btn2">
            <p class="num">
              {{nums.countSampling}}
              <span>个</span>
            </p>
            <p class="title">外环境采样</p>
            <el-progress
              type="circle"
              :percentage="0"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#ffbb04"
            ></el-progress>
          </div>
        </router-link>

        <router-link :to="{ path:'/home/survey-update/event-report'}" replace>
          <div v-if="nums.countReport>0" class="btn2">
            <p class="num">
              {{nums.countReport}}
              <span>个</span>
            </p>
            <p class="title">事件报告</p>
            <el-progress
              type="circle"
              :percentage="nums.countReport/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#9efdee"
            ></el-progress>
          </div>
          <div v-else class="btn2">
            <p class="num">
              {{nums.countReport}}
              <span>个</span>
            </p>
            <p class="title">事件报告</p>
            <el-progress
              type="circle"
              :percentage="0"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#9efdee"
            ></el-progress>
          </div>
        </router-link>
      </div>
      <!-- 表格 -->
      <div>
        <router-view replace></router-view>
      </div>
    </div>

    <!-- 地图选点 -->
    <!-- <template>
      <transition
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutRight"
      >
        <div class="temp_bg" v-show="fromShow">
          <div>
            <i
              class="el-icon-circle-close-outline"
              style="color: #FFFFFF;font-size: 30px;  float: right;margin: 10px;"
              @click="closefrom"
            ></i>
          </div>
          <div class="my_from">
            <div id="l-map" style="width:100%;height:100%;"></div>
            <div id="r-result" class="input_text">
              请输入:
              <input type="text" id="suggestId" size="20" value="百度" style="width:300px;">
            </div>
            <div
              id="searchResultPanel"
              style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;z-index:999999999"
            ></div>
          </div>
        </div>
      </transition>
    </template> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import moment from "moment";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      // isevent:false,
      // isText:'显示全部',
      topOpenClose: "close",
      bottomOpenClose: "open",
      form: {
        originId: null,
        placeId: null,
        addressFloor: "",
        otherPlaces: ""
      },
      eventType: [
        {
          id: 0,
          name: "传染病"
        },
        {
          id: 1,
          name: "食源性疾病"
        },
        {
          id: 2,
          name: "其他"
        }
      ],
      nums: {},
      allNums: 0, //事件总数
      disabled: true,
      originList: [],
      placeList: [],
      downIcon: false,
      fromShow: false,
      eventPlace: false,
      genre: "",
      eventLeve: [
        { id: 1, name: "I 级", color: "#e51717" },
        { id: 2, name: "II 级", color: "#ff7519" },
        { id: 3, name: "III 级", color: "#ffe229" },
        { id: 4, name: "IV 级", color: "#006636" },
        { id: 5, name: "未分级", color: "#666666" }
      ],
      eventLeveColor: ""
    };
  },
  computed: {
    ...mapGetters(["event", "isnums", "location"])
  },
  methods: {
    openTop() {
      this.topOpenClose = this.topOpenClose == "close" ? "open" : "close";
    },
    openBottom() {
      this.bottomOpenClose = this.bottomOpenClose == "close" ? "open" : "close";
    },
    eventPlaceChang(value, first) {
      axios({
        method: "get",
        url: config.apiHost + "/froms/places",
        params: {
          placeId: value
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.eventPlace = result.data.body;
        } else {
          this.eventPlace = result.data.body;
        }
      });

      if (first == 1) {
      } else {
        this.form.otherPlaces = "";
      }
    },
    remberLocal(locastr) {
      // this.$store.dispatch('remeberLocation','/home/survey-update/new-research');//记住当前位置
      // this.$store.dispatch("remeberLocation", locastr);
    },
    //显示全部(暂时不要)
    // changeData(){
    //     this.isevent=!this.isevent;
    // },
    showDetail() {
      this.downIcon = !this.downIcon;
    },
    //返回
    closeDetail() {
      this.$router.go(-1);
      // this.$router.push({path: '/home/survey_tasks'});
      // this.remberLocal("/home/survey-update/new-research");
      // if (this.form.isUrl == "surveyTasks") {
      //   this.$router.push({ path: "/home/survey_tasks" }); //跳转到调查管理列表
      // } else if (this.form.isUrl == "eventNow") {
      //   this.$router.push({ path: "/home/event-now" }); //跳转到当前事件列表
      // } else {
      //   // this.$router.go(-1);//暂时替换
      //   this.$router.push({ path: "/home/survey_tasks" }); //跳转到调查管理列表
      // }
    },
    //获取7项数据
    getSeven() {
      //
      axios
        .get(config.apiHost + "/survey/countSurveyNum", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            eventId: this.form.id
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.nums = result.data.body;
            // if(this.nums.countScene>0){
            // console.log("初始化列表！！！");
            this.allNums =
              this.nums.countScene +
              this.nums.countCase +
              this.nums.countContrast +
              this.nums.countDoctor +
              this.nums.countOtherSampling +
              this.nums.countSampling +
              this.nums.countReport;
            this.$store.dispatch("showEventId", this.event.id); //把id传过去
            // }
          } else {
            this.$message.error(result.data.body.massage);
          }
        })
        .catch(function(response) {
          // console.log(response);
        });
    },
    //得到事件来源下拉框
    getOrigin() {
      //
      axios
        .get(config.apiHost + "/event-origin", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            // console.log(result.data)
            if (result.data.status == 200) {
              this.originList = result.data.body;
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    //得到事件场所下拉框
    getPlace() {
      //
      axios
        .get(config.apiHost + "/event-places", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.placeList = result.data.body;
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    getSTime(val) {
      // console.log("开始时间。。")
      // console.log(val);
      var startTime = this.getCurrentDateTime(val);
      // console.log(startTime);
      this.form.startTime = startTime;
    },
    getRTime(val) {
      // console.log("接报时间。。")
      // console.log(val);
      var reportedTime = this.getCurrentDateTime(val);
      // console.log(reportedTime);
      this.form.reportedTime = reportedTime;
    },
    // 时间转换
    getCurrentDateTime(str) {
      return moment(str).format("YYYY-MM-DD HH:mm:ss");
    },
    // 验证
    showValidate() {
      var val = this;
      const {
        name,
        reportUser,
        reportPhone,
        originId,
        reportedTime,
        startTime,
        caseNumber,
        placeId,
        address,
        comment
      } = this.form;
      if (
        name.trim() == "" ||
        reportUser.trim() == "" ||
        reportPhone.trim() == "" ||
        originId == "" ||
        reportedTime == null ||
        startTime == null ||
        caseNumber == null ||
        placeId == "" ||
        address.trim() == "" ||
        comment.trim() == ""
      ) {
        this.$message({ type: "error", message: "信息不能为空" });
        return;
      } else {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; //手机号码验证
        var numreg = /^\d+$/; //疑似病例数
        if (!myreg.test(reportPhone)) {
          this.$message({ type: "error", message: "请输入有效的手机号码！" });
          document.getElementById("tel").focus();
          return;
        }
        if (!numreg.test(caseNumber)) {
          this.$message({ type: "error", message: "请输入正确的病例数！" });
          document.getElementById("nessNum").focus();
          return;
        }
        return true;
      }
    },
    //确认修改
    update() {
      if (this.showValidate()) {
        if (this.form.addressFloor) {
          if (this.form.addressFloor.trim != "") {
            this.form.address = this.form.address + this.form.addressFloor;
          }
        }

        axios({
          method: "post",
          // /api
          url: config.apiHost + "/current-events/update-event",
          data: {
            id: this.form.id,
            status: this.form.status,
            name: this.form.name,
            reportUser: this.form.reportUser,
            reportPhone: this.form.reportPhone,
            originId: this.form.originId,
            reportedTime: this.form.reportedTime,
            startTime: this.form.startTime,
            address: this.form.address,
            caseNumber: this.form.caseNumber,
            placeId: this.form.placeId,
            comment: this.form.comment,
            userName: this.form.userName,
            genre: this.form.genre,
            otherPlaces: this.form.otherPlaces
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
              this.$router.push({ path: "/home/survey_tasks" }); //跳转到调查管理列表
            }
            return res.data;
          })
          .catch(response => {
            this.$message.error(response);
          });
      }
    },
    //添加表单
    addForm(type) {
      // this.$router.push({
      //   name: 'form_add',
      //   params: { type: type, eventId: this.event.id }
      // })
      let caseChild = "";
      if (type == 1) {
        caseChild = 1;
      } else {
        caseChild = "";
      }

      // this.$router.push({
      //   name: 'newResAddForm',
      //   params: { type: type, eventId: this.event.id,caseChild:caseChild }
      // })
      if (type == 1) {
        //个案
        this.$router.replace({ path: "/home/survey-update/case-research" });
      } else if (type == 2) {
        //现况
        this.$router.replace({ path: "/home/survey-update/new-research" });
      } else if (type == 3) {
        //医生
        this.$router.replace({ path: "/home/survey-update/doctor-research" });
      } else if (type == 5) {
        //对照组
        this.$router.replace({ path: "/home/survey-update/group-research" });
      }
    },
    // 显示地图选点
    // showMap() {
    //   this.fromShow = true;
    // },
    // // 关闭地图选点
    // closefrom() {
    //   this.fromShow = false;
    // },
    // getMap() {
    //   // 百度地图API功能
    //   function G(id) {
    //     return document.getElementById(id);
    //   }

    //   var map = new BMap.Map("l-map", { enableMapClick: false });
    //   map.centerAndZoom("南京", 8); // 初始化地图,设置城市和地图级别。
    //   map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
    //   map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
    //   map.closeInfoWindow();

    //   var ac = new BMap.Autocomplete({
    //     //建立一个自动完成的对象
    //     input: "suggestId",
    //     location: map
    //   });

    //   ac.addEventListener("onhighlight", function(e) {
    //     //鼠标放在下拉列表上的事件
    //     var str = "";
    //     var _value = e.fromitem.value;
    //     var value = "";
    //     if (e.fromitem.index > -1) {
    //       value =
    //         _value.province +
    //         _value.city +
    //         _value.district +
    //         _value.street +
    //         _value.business;
    //     }
    //     str =
    //       "FromItem<br />index = " +
    //       e.fromitem.index +
    //       "<br />value = " +
    //       value;

    //     value = "";
    //     if (e.toitem.index > -1) {
    //       _value = e.toitem.value;
    //       value =
    //         _value.province +
    //         _value.city +
    //         _value.district +
    //         _value.street +
    //         _value.business;
    //     }
    //     str +=
    //       "<br />ToItem<br />index = " +
    //       e.toitem.index +
    //       "<br />value = " +
    //       value;
    //     G("searchResultPanel").innerHTML = str;
    //   });

    //   var myValue;
    //   ac.addEventListener("onconfirm", function(e) {
    //     //鼠标点击下拉列表后的事件
    //     var _value = e.item.value;
    //     myValue =
    //       _value.province +
    //       _value.city +
    //       _value.district +
    //       _value.street +
    //       _value.business;
    //     G("searchResultPanel").innerHTML =
    //       "onconfirm<br />index = " +
    //       e.item.index +
    //       "<br />myValue = " +
    //       myValue;

    //     setPlace();
    //   });

    //   function setPlace() {
    //     map.clearOverlays(); //清除地图上所有覆盖物
    //     function myFun() {
    //       var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
    //       map.centerAndZoom(pp, 18);
    //       map.addOverlay(new BMap.Marker(pp)); //添加标注
    //     }
    //     var local = new BMap.LocalSearch(map, {
    //       //智能搜索
    //       onSearchComplete: myFun
    //     });
    //     local.search(myValue);
    //   }

    //   var geoc = new BMap.Geocoder();
    //   map.addEventListener("click", e => {
    //     map.clearOverlays(); //清除地图上所有覆盖物
    //     // alert(e.point.lng + "," + e.point.lat);//经纬度
    //     var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
    //     map.addOverlay(marker); // 将标注添加到地图中

    //     var pt = e.point;
    //     geoc.getLocation(pt, rs => {
    //       var addComp = rs.addressComponents;
    //       // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
    //       let myAdress =
    //         addComp.province +
    //         addComp.city +
    //         addComp.district +
    //         addComp.street +
    //         addComp.streetNumber;
    //       // console.log(myAdress);
    //       this.form.longitude = pt.lng; //经度
    //       this.form.latitude = pt.lat; //纬度
    //       this.form.address = myAdress; //地址

    //       // G("suggestId").value=myAdress;//给输入框添加值
    //     });
    //     this.fromShow = false;
    //   });
    // },
    setColor() {
      try {
        var index = this.eventLeve.findIndex(v => v.id == this.form.grade);
        this.eventLeveColor = this.eventLeve[index].color;
        this.$refs.eventLevelColor.$el.children[0].setAttribute(
          "style",
          "color:" + this.eventLeveColor
        );
        this.form.grade = this.eventLeve[index].name;
      } catch (error) {}
    }
  },
  mounted() {
    this.form = this.event;
    this.setColor();
    if (this.form.genre == 0) {
      this.genre = "传染病";
    } else if (this.form.genre == 1) {
      this.genre = "食源性疾病";
    } else {
      this.genre = "其他";
    }
    this.getSeven();
    this.getOrigin();
    this.getPlace();
    // this.getMap();
    this.eventPlaceChang(this.form.placeId, 1);
    // console.log('你返回了这个页面' + this.location)
    //  console.log("#############"+this.isnums);
  },
  watch: {
    isnums() {
      // console.log(this.isnums)
      if (this.isnums) {
        // console.log(this.isnums);
        this.getSeven();

        this.$store.dispatch("refNum", 2); //刷新父级组件
      }
    }
  },
  created() {
    this.getSeven();
    if (this.form.ispage == "编辑") {
      this.disabled = false;
    }
    this.getOrigin();
    this.getPlace();
    this.setColor();
  }
};
</script>

<style scoped>
.mybox {
  width: auto;
  /* height: 100%; */
  min-height: 100%;
  text-align: left;
  /* background-color: #e2e6ef; */
  padding: 10px 10px 100px;
  box-sizing: border-box;
}
.exam {
  width: 100%;
  height: 45px;
  line-height: 45px;
  font-size: 18px;
  padding: 0 10px 20px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  margin-bottom: 5px;
}
/* 下拉框改样式 */
.el-select {
  width: 25%;
}
.el-date-editor {
  width: 25%;
}
.from-box {
  max-height: 0;
  background-color: #ffffff;
  margin: 0 auto;
  padding: 0px 10px;
  transition: all 0.3s;
  overflow: hidden;
}
.from-box.open {
  max-height: 1000px;
  padding: 10px 10px 30px;
  transition: all 0.3s;
}

.event-title {
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding-left: 15px;
  /* background-color: #def0fe; */
  display: flex;
  justify-content: space-between;
  color: #429e73;
  /* border-left: 3px solid #429e73; */
  font-weight: bold;
  margin: 10px 0 0;
  position: relative;
  background: #fff;
}
.event-title::before {
  content: "";
  width: 3px;
  height: 20px;
  background-color: #429e73;
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.event-title div {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.event-title div.open {
  background: url(../../assets/open-green.png);
}
.event-title div.close {
  background: url(../../assets/close-gray.png);
}
.mytag {
  height: 30px;
  width: 50px;
  background-color: #c8e4fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.event-form {
  width: 100%;
  /* margin: 0 auto; */
  /* margin-bottom: 30px; */
}
.el-form--inline .el-form-item {
  width: 33%;
  margin-right: 0 !important;
}
.ad {
  position: absolute;
  right: 5px;
  top: 10px;
}
.myinfo {
  height: 30px;
  line-height: 30px;
  text-align: left;
  color: #6eb594;
  width: 100%;
  margin-top: 15px;
  border-bottom: 2px solid #6eb594;
}

.input-div {
  /* height: 30px; */
  margin-top: 20px;
  /* margin-left: 20px; */
  text-align: left;
  display: flex;
  align-items: center;
}
.label-div {
  display: block;
  width: 100px;
  text-align: right;
  margin-right: 15px;
}
.text-input {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}

.mytitle {
  width: 100%;
  height: 35px;
  line-height: 35px;
  margin-bottom: 15px;
}

.isShow {
  position: fixed;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  right: 0;
  top: 232px;
  background: white;
}
.choose {
  max-height: 0;
  /* margin-top: 10px; */
  background-color: #ffffff;
  transition: all 0.3s;
  overflow: hidden;
}
.choose.open {
  max-height: 1500px;
  transition: all 0.3s;
}
.list {
  display: flex;
  width: auto;
  padding: 20px;
  background-color: #fff;
  justify-content: space-between;
}
.btn {
  padding: 0 20px;
  height: 45px;
  border: 0;
  color: white;
}
.btn2 {
  height: 120px;
  border: 0;
  color: white;
  display: flex;
  align-items: center;
  position: relative;
}
/* .btn2:hover{
  border-radius: 50%;
  box-shadow: 0px 5px 10px 0px rgba(16, 20, 26, 0.1);
} */
.btn2 .num {
  position: absolute;
  width: 100%;
  bottom: 40%;
  text-align: center;
  color: #243037;
  font-size: 30px;
}
.btn2 .num span {
  font-size: 14px;
  color: #243037;
  opacity: 0.6;
  font-weight: bold;
}
.btn2 .title {
  position: absolute;
  width: 100%;
  top: 60%;
  text-align: center;
  font-size: 12px;
  color: #243037;
  opacity: 0.6;
}
.btnText {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-size: 12px;
}
.btnImg {
  width: 45px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 7px;
}
/* 地图 */
.my_from {
  width: 800px;
  height: 600px;
  background: #ffffff;
  position: fixed;
  top: 173px;
  left: 20%;
  /* z-index: 1000; */
}
.tangram-suggestion-main {
  z-index: 9999999999;
}
.input_text {
  position: absolute;
  top: 20px;
  left: 20px;
}
.temp_bg {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(7, 17, 27, 0.6);
  /* z-index: 1000; */
}

.info {
  line-height: 30px;
  text-align: left;
  border-radius: 8px;
  /* color: #; */
  width: 100%;
  margin-bottom: 20px;
  padding: 14px 14px 0;
  background-color: #fff;
  /*display:inline;
  border-bottom: 2px solid #6eb594;*/
  box-shadow: 0px 1px 10px 0px rgba(22, 9, 6, 0.05);
}
.info:hover {
  background: #fff url("../../assets/event01.png") repeat-y left;
  /*display:inline;
  border-bottom: 2px solid #6eb594;*/
}
.info-head {
  padding-left: 20px;
  color: #333333;
  padding-bottom: 5px;
  font-weight: bold;
  vertical-align: middle;
  border-bottom: 2px solid #eee;
  font-size: 18px;
}
.selectedspan {
  background: #fff url("../../assets/event01.png") repeat-y left;
}
.input-div {
  /* margin: 70px 20px 20px; */
  text-align: left;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  /* align-items: center; */
}
.ad {
  position: absolute;
  right: 5px;
  top: 10px;
}
.text-input {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}
.area {
  width: 100%;
  /* height: 200px; */
  border: 1px solid #dcdfe6;
  background: #fff;
  padding: 0 15px;
  /* margin-left: 5px; */
  border-radius: 5px;
}
.label-div {
  width: 110px;
  color: #666666;
  margin-right: 15px;
}
.label-div span {
  width: 90px;
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
  font-size: 18px;
}
.inp {
  /* width: 50%; */
  /* height: 35px; */
  /* border: 1px solid #dcdfe6; */
  border-radius: 4px;
  background: #fff;
}
.inp-per {
  width: 220px;
  /* padding-left: 20px; */
}
.address {
  /* padding-left: 15px; */
  position: relative;
  margin-bottom: 20px;
}
.address label {
  width: 100px;
}
.address > div {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding-left: 100px;
}
.address > div .el-input {
  width: 99.5%;
}
.address > div .el-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 20px;
}
.center_ {
  text-align: center;
}
.right_ {
  text-align: right;
}
</style>

