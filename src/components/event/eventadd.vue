<template>
  <!-- <div class="rolebox"> -->
  <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>事件接报</el-breadcrumb-item>
      </el-breadcrumb>
  </div>-->
  <div class="rolebox">
    <div class="main-box">
      <form :model="form">
        <input type="hidden" name="reviewerType" v-model="form.reviewerType">
        <input type="hidden" name="leaderType" v-model="form.leaderType">
        <div class="info">
          <div class="info-head">
            <img src="../../assets/event02.png" style="vertical-align:middle;">&nbsp;&nbsp;信息获取-报告人信息
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>接报时间</span>
              </label>
              <el-date-picker
                v-model="form.reportedTime"
                @change="getRTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:220px"
              ></el-date-picker>
            </div>
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>报告人姓名</span>
              </label>
              <input
                type="text"
                ondragstart="return false"
                class="inp inp-per"
                v-model="form.reportUser"
                style="width:220px"
              >
            </div>
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>报告人电话</span>
              </label>
              <input
                type="tel"
                id="tel"
                ondragstart="return false"
                class="inp inp-per"
                v-model="form.reportPhone"
                style="width:220px"
              >
            </div>
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>报告来源</span>
              </label>
              <el-select v-model="form.originId" placeholder="请选择" style="width:220px">
                <el-option
                  v-for="item in originList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>接报人姓名</span>
              </label>
              <input
                type="text"
                ondragstart="return false"
                class="inp inp-per"
                v-model="form.operator"
                disabled
                style="width:220px;background:#F5F7FA;color:#ccc"
              >
            </div>
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>接报人科室</span>
              </label>
              <input
                type="tel"
                id="tel"
                ondragstart="return false"
                class="inp inp-per"
                v-model="form.operatDep"
                disabled
                style="width:220px;background:#F5F7FA;color:#ccc"
              >
            </div>
          </div>
        </div>

        <div class="info">
          <div class="info-head">
            <img src="../../assets/event03.png" style="vertical-align:middle;">&nbsp;&nbsp;核实信息-事件概况
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>事件场所</span>
              </label>
              <el-select
                v-model="form.placeId"
                placeholder="请选择"
                @change="eventPlaceChang(form.placeId)"
                style="width:220px"
              >
                <el-option
                  v-for="item in placeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-input
                v-model="form.otherPlaces"
                v-show="eventPlace"
                style="width:220px;margin-left: 10px;"
              ></el-input>
              <el-select
                v-model="placeDetailId"
                placeholder="请选择"
                @change="eventPlaceInfo()"
                clearable
                filterable
                allow-create
                v-show="!eventPlace"
                style="margin-left: 10px;width:220px"
                :disabled="form.placeId===''"
              >
                <el-option
                  v-for="(item,index) in schoolList"
                  :key="index"
                  :label="item.name"
                  :value="index"
                ></el-option>
              </el-select>
            </div>
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>事件地点</span>
              </label>
              <div style="position: relative;width:220px;float: right;">
                <input
                  type="text"
                  class="inp"
                  ondragstart="return false"
                  style="width:100%;padding-left:5px;width:220px;padding-right:35px"
                  placeholder="例：xx市xx区xx路xx号"
                  :title="form.address"
                  v-model="form.address"
                  readonly
                >
                <i class="ad el-icon-location" @click="showMap"></i>
              </div>
            </div>
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>事件等级</span>
              </label>
              <el-select
                ref="eventLeveSelect"
                v-model="form.grade"
                placeholder="请选择"
                @change="eventLeveChanged"
                style="width:220px"
              >
                <el-option
                  v-for="item in eventLeve"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :style="{color:item.color}"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="input-div">
            <!--<label class="label-div">
              <i style="color:red;font-size:16px;margin-right: 10px;">*</i>事件开始时间</label>

            <el-date-picker v-model="form.startTime" @change="getSTime" type="datetime" placeholder="选择日期时间">
            </el-date-picker>-->
            <div>
              <label class="label-div">
                <i style="color:red;font-size:16px;margin-right: 10px;">*</i>
                <span>事件类型</span>
              </label>
              <el-select
                v-model="form.genre"
                placeholder="请选择"
                @change="eventGenreChang()"
                style="width:220px"
              >
                <el-option
                  v-for="item in eventType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-cascader
                expand-trigger="hover"
                placeholder="请选择"
                :options="diseaseOptions"
                ref="cascaderAddr"
                :class="{activeType:!isShowDis}"
                @change="handleChange"
                clearable
                style="margin-left: 10px;width:220px"
                :disabled="form.genre===''"
              ></el-cascader>
            </div>
            <div>
              <label class="label-div">
                <!-- <i style="color:red;font-size:16px;margin-right: 10px;">*</i> -->
                <span>事件种类</span>
              </label>
              <el-select
                v-model="form.cat"
                @change="getEventCat"
                clearable
                placeholder="请选择"
                style="width:220px"
              >
                <el-option
                  v-for="item in eventCat"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div>
              <label class="label-div">
                <!-- <i style="color:red;font-size:16px;margin-right: 10px;">*</i> -->
                <span>疑似病例数</span>
              </label>
              <input
                type="number"
                id="nessNum"
                ondragstart="return false"
                class="inp inp-per"
                min="0"
                v-model="form.caseNumber"
                :disabled="form.cat==1"
                style="width:220px"
              >
            </div>
          </div>
          <!--<div class="input-div">
            <label class="label-div">
              <i style="color:red;font-size:16px;margin-right: 10px;">*</i>疑似事件</label>
            <input type="text" ondragstart="return false" class="inp" v-model="form.name">

          </div>-->
          <div class="input-div">
            <label class="label-div">
              <!-- <i style="color:red;font-size:16px;margin-right: 10px;">*</i> -->
              <span style="margin-left:20px">事件概要</span>
            </label>
            <textarea
              class="area"
              rows="3"
              placeholder="如：目前伤亡状况、涉及人员以及已采取的措施（专家、小组、流调、消杀和救治等）"
              ondragstart="return false"
              v-model="form.comment"
            ></textarea>
          </div>
        </div>
        <div class="btn-div">
          <el-button type="primary" @click="addEvent">上 报</el-button>
          <el-button type="primary" @click="release">发 布</el-button>
        </div>
      </form>
    </div>

    <!--发布时，事件派发弹框-->
    <el-dialog
      :visible.sync="dialogShowVisible"
      width="28%"
      :show-close="false"
      :close-on-click-modal="false"
      id="dialog"
    >
      <div class="divbox">
        <div class="header">
          <strong>事件派发</strong>
          <div class="two-s">
            <!-- 暂时去掉 -->
            <span style="font-size: 12px;">指派&nbsp;&nbsp;</span>
            <el-switch v-model="isexam" active-value="1" inactive-value="0"></el-switch>
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
        <!-- <div class="detail"> -->
        <!-- <div class="one"> -->
        <!-- <div>
                <label>事件编号</label>
                <span style="color: #3F99DB;">20170001</span>
        </div>-->
        <!-- <div style="margin-top: 10px;">
                <label>事件名称：</label>
                <span style="color: #3F99DB;">{{form.name}}</span>
        </div>-->
        <!-- </div> -->
        <!-- </div> -->
        <!--表格-->
        <div class="treeBox">
          <div class="treeDiv" v-for="(item , k) in ReleaseList" :key="k">
            <div class="left">
              {{ item.name}}
              <!-- <i
                  class="el-icon-minus"
                  v-show="activeIndex===k"
                  style="float: right;"
                  @click="closeRow(k)"
                ></i>
                <i
                  class="el-icon-plus"
                  v-show="activeIndex!=k"
                  style="float: right;"
                  @click="closeRow(k)"
              ></i>-->
              <!-- <img style="float: right;height: 100%;width: 30px" src="img/HBuilder.png"/> -->
            </div>
            <div class="mainRow" :id="k" v-show="activeIndex===k">
              <div ref="rowTwo" class="rowTwo" v-if="item.listUser.length>0">
                <!-- <div class="item" v-for="(people , k) in item.listUser" :key="k"> -->
                <!-- <input type="checkbox"/>
                {{people.userName}}-->
                <el-checkbox-group v-model="checkedPeople">
                  <el-checkbox
                    v-for="(people , u) in item.listUser"
                    :label="people.id"
                    :key="u"
                  >{{people.account}}</el-checkbox>
                </el-checkbox-group>
                <!-- </div> -->
                <!-- more -->
                <div class="more" title="展开" v-if="item.listUser.length>6" @click="showMore">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
              <div
                class="row"
                v-if="item.childrenList.length>0"
                v-for="(dept , k) in item.childrenList"
                :key="k"
              >
                <!-- 部门 -->
                <div class="left">{{ dept.name}}</div>
                <!-- 人员 -->
                <div class="right" v-if="dept.listUser.length>0">
                  <div class="item" v-for="(val , k) in dept.listUser" :key="k">
                    <el-checkbox v-model="checkedPeople" :label="val.id">{{val.userName}}</el-checkbox>
                  </div>
                </div>
                <div class="right" v-else>
                  <span>暂无人员</span>
                </div>
                <!-- more -->
                <div class="more" title="展开" v-if="dept.listUser.length>6" @click="showMore">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button size="medium" type="text" class="cancel" @click="closeissue">取消</el-button>
          <el-button size="medium" type="text" class="ok" @click="issue">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 地图选点 -->
    <template>
      <transition
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutRight"
      >
        <div class="temp_bg" v-show="fromShow">
          <div class="my_from">
            <div class="closeform">
              <i class="el-icon-close" @click="closefrom"></i>
            </div>
            <div id="l-map" style="width:100%;height:100%;border-radius:15px;"></div>
            <div id="r-result" class="input_text">
              <i class="el-icon-search"></i>
              <i
                class="el-icon-close"
                @click="clearInput"
                style="height:46%;top:27%;line-height:16px"
              ></i>
              <input
                type="text"
                id="suggestId"
                ref="locationSearchInput"
                size="20"
                value
                placeholder="请输入搜索内容"
                style="width:300px;padding-right:50px"
              >
            </div>
            <div
              id="searchResultPanel"
              style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;z-index:999999999"
            ></div>
          </div>
        </div>
      </transition>
    </template>
  </div>
  <!-- </div> -->
</template>

<script>
var Cookies = require("js-cookie");
import axios from "axios";
import moment from "moment";
import animate from "animate.css";
var config = require("@/components/utils/Common_Config.js");
var map;
export default {
  data() {
    return {
      config: config,
      form: {
        name: "", //事件名称
        reportUser: "", //报告人
        reportPhone: "", //报告人电话
        originId: "", //报告来源（下拉）
        operator: Cookies.get("userName"), //接报人
        operatDep: Cookies.get("depName"), //接报人科室
        reportedTime: new Date(), //接报时间
        startTime: new Date(), //开始时间
        address: "", //地点
        cat: "",
        grade: "",
        addressFloor: "", //楼层信息
        caseNumber: "", //疑似病例数
        placeId: "", //事件场所（下拉）
        comment: "", //事件概要
        status: "", //  1 保存  2 审批发布  3 发布
        longitude: "", //经度
        latitude: "", //纬度
        genre: "", //疑似事件类型
        diseaseId: "", //疾病id
        userIdList: "", //发布所选人员
        otherPlaces: "",
        placeDetail: "", //场所第二级
        reviewerType: "eventPublish",
        leaderType: "eventPublish"
      },
      reportTime: null,
      sTime: null,
      originList: [],
      placeList: [],
      schoolList: [],
      dialogShowVisible: false,
      fromShow: false,
      ReleaseList: [], //事件发布人员列表
      defaultProps: {
        children: "listUser",
        label: "userName"
      },
      treeId: [],
      countType: 0,
      checkedPeople: [], //一级下选中的id
      isexam: "0", //开关
      activeIndex: null,
      locationAreaId: null,
      longitude: "",
      latitude: "",
      oldlongitude: "",
      oldlatitude: "",
      eventPlace: false,
      isShowDis: true,
      diseaseOptions: [],
      disName: "",
      placeName: "",
      eventType: [
        { id: 0, name: "传染病" },
        { id: 1, name: "食源性疾病" },
        { id: 2, name: "不明原因" }
      ],
      eventLeve: [
        { id: 1, name: "I 级", color: "#e51717" },
        { id: 2, name: "II 级", color: "#ff7519" },
        { id: 3, name: "III 级", color: "#ffe229" },
        { id: 4, name: "IV 级", color: "#006636" },
        { id: 5, name: "未分级", color: "#666666" }
      ],
      eventLeveColor: "",
      eventCat: [
        { id: 1, name: "单病例" },
        { id: 2, name: "群体性" },
        { id: 3, name: "其他事件" }
      ],
      placeDetailId: "",
      map: "",
      marker: {}
    };
  },
  methods: {
    closeRow(id) {
      // console.log(id)
      if (id == this.activeIndex) {
        this.activeIndex = -1;
        return;
      }
      this.activeIndex = id;
      // this.isClose=!this.isClose;
    },
    changeColor(id) {
      this.countType = id;
      // console.log(id);
    },
    //关闭发布
    closeissue() {
      this.dialogShowVisible = false;
      this.checkedPeople = [];
    },
    eventPlaceChang(value) {
      this.form.otherPlaces = "";
      this.form.placeDetail = "";
      this.placeDetailId = "";
      this.form.placeDetail = "";
      this.form.address = "";
      this.form.latitude = "";
      this.form.longitude = "";
      this.longitude = this.oldlongitude;
      this.latitude = this.oldlatitude;
      this.form.province = "";
      this.form.city = "";
      this.form.district = "";
      // this.closepoint();
      axios({
        method: "get",
        url: config.apiHost + "/froms/places",
        params: {
          placeId: value
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.eventPlace = result.data.body;
          if (!this.eventPlace) {
            axios({
              method: "get",
              url: config.apiHost + "/placeMain/place/getAreaPlaceByEvent",
              params: {
                typeId: value
              }
            }).then(result => {
              if (result.data.status == 200) {
                // console.log(result.data.body);
                this.schoolList = result.data.body;
              }
            });
          }
        } else {
          this.eventPlace = result.data.body;
        }
      });
      // console.log(value)
    },
    eventPlaceInfo() {
      if (this.placeDetailId || this.placeDetailId === 0) {
        var item = this.schoolList[this.placeDetailId];
        // console.log(item);
        this.form.placeDetail = item.id;
        this.form.address = item.address;
        this.form.latitude = item.latitude;
        this.form.longitude = item.longitude;
        this.longitude = item.longitude;
        this.latitude = item.latitude;
        this.placeName = item.name;
        this.form.township = item.township;
        this.form.province = item.province;
        this.form.city = item.city;
        this.form.district = item.district;
        this.form.township = item.township;
        // console.log(this.form);
        this.addpoint(+this.longitude, +this.latitude);
      } else {
        // console.log(111111);
        this.form.placeDetail = "";
        this.form.address = "";
        this.form.latitude = "";
        this.form.longitude = "";
        this.longitude = this.oldlongitude;
        this.latitude = this.oldlatitude;
        this.placeName = "";
        this.form.province = "";
        this.form.city = "";
        this.form.district = "";
        this.form.township = "";
        // this.closepoint();
      }
    },
    eventGenreChang() {
      var value = this.form.genre;
      // console.log(value + "====" + this.isShowDis);
      if (value == 3) this.isShowDis = false;
      else this.isShowDis = true;
      if (this.isShowDis) {
        axios({
          method: "get",
          url: config.apiHost + "/disease/listInfo",
          params: {
            typeId: value
          }
        }).then(result => {
          if (result.data.status == 200) {
            this.diseaseOptions = result.data.body;
            this.form.diseaseId = "";
            // console.log(result.data.body);
          }
        });
      }
      // console.log(value)
    },
    handleChange(value) {
      // console.log(value, this.$refs['cascaderAddr'].currentLabels)
      // console.log(this.diseaseNameOptions);
      // console.log(this.diseaseOption);
      if (value.length > 0) {
        this.form.diseaseId = value[value.length - 1];
        this.disName = this.$refs["cascaderAddr"].currentLabels[
          value.length - 1
        ];
        // console.log(this.disName);
      } else {
        this.form.diseaseId = "";
        this.disName = "";
      }
    },
    eventTypeChang(value) {
      this.form.otherPlaces = "";
      this.form.placeDetail = "";
      axios({
        method: "get",
        url: config.apiHost + "/froms/places",
        params: {
          placeId: value
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.eventPlace = result.data.body;
          if (!this.eventPlace) {
            axios({
              method: "get",
              url: config.apiHost + "/placeMain/place/getAreaPlaceByEvent",
              params: {
                typeId: value
              }
            }).then(result => {
              if (result.data.status == 200) {
                this.schoolList = result.data.body;
              }
            });
          }
        } else {
          this.eventPlace = result.data.body;
        }
      });
      // console.log(value);
    },
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
            // console.log(result.data);
            if (result.data.status == 200) {
              this.originList = result.data.body;
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
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
    // 验证
    showValidate() {
      console.log(this.form);
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
        grade,
        cat
      } = this.form;
      // if (
      //   name.trim() == "" ||
      //   reportUser.trim() == "" ||
      //   reportPhone.trim() == "" ||
      //   originId == "" ||
      //   reportedTime == null ||
      //   startTime == null ||
      //   caseNumber.trim() == "" ||
      //   placeId == "" ||
      //   address.trim() == "" ||
      //   grade == "" ||
      //   cat == ""
      // )
      if (
        name.trim() == "" ||
        reportUser.trim() == "" ||
        reportPhone.trim() == "" ||
        originId == "" ||
        reportedTime == null ||
        startTime == null ||
        placeId == "" ||
        address.trim() == "" ||
        grade == ""
      ) {
        this.$message({ type: "error", message: "信息不能为空" });
        return;
      } else {
        // var myreg = /^\d{11}$/   //数字13位
        // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/ //手机号码验证
        // var myreg=/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/;//手机号码验证和电话号码
        var myreg = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(^\d{11}$)/;
        var numreg = /^\d+$/; //疑似病例数
        if (!myreg.test(reportPhone)) {
          this.$message({ type: "error", message: "请输入有效的手机号码！" });
          document.getElementById("tel").focus();
          return;
        }

        // if (!numreg.test(caseNumber)) {
        //   this.$message({ type: "error", message: "请输入正确的病例数！" });
        //   document.getElementById("nessNum").focus();
        //   return;
        // }
        return true;
      }
    },
    getEventName() {
      let genre = "";
      if (this.form.genre == "" && this.form.genre.length == 0) {
        genre = "";
      } else if (this.form.genre == 1) {
        genre = "食源性疾病";
      } else if (this.form.genre == 2) {
        genre = "不明原因";
      } else if (this.form.genre == 0) {
        genre = "传染病";
      }
      // console.log(this.form.diseaseId);
      // console.log(this.disName);
      if (this.form.diseaseId != "" || this.form.diseaseId.length != 0) {
        genre = this.disName;
      }
      if (this.placeName != "" || this.placeName.length != 0) {
        this.form.name =
          this.getCurrentDate(this.form.reportedTime) + this.placeName + genre;
      } else {
        this.form.name =
          this.getCurrentDate(this.form.reportedTime) +
          this.form.address +
          genre;
      }

      // let year=
    },
    getEventCat() {
      if (this.form.cat == 1) {
        this.form.caseNumber = "1";
      } else {
        this.form.caseNumber = "";
      }
    },
    //保存
    addEvent() {
      this.getEventName();
      if (this.showValidate()) {
        this.form.status = "1";
        this.form.reportedTime = this.getCurrentDateTime(
          this.form.reportedTime
        );
        this.form.startTime = this.getCurrentDateTime(this.form.startTime);
        // if (this.form.addressFloor.trim != '') {
        //   this.form.address = this.form.address + this.form.addressFloor
        // }

        // console.log("添加。。")
        // console.log(this.form);
        axios({
          method: "post",
          // /api
          url: config.apiHost + "/save-event",
          data: this.form,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        })
          .then(res => {
            // console.log(res);
            if (res.data.status == 200) {
              this.$message(res.data.body.msg);
              this.$router.push({ path: "/home/event-now" }); //保存成功 跳转到待发布界面
            }
            return res.data;
          })
          .catch(response => {
            this.$message.error(response);
          });
      }
    },
    getSTime(val) {
      // console.log("时间。。")
      //  console.log(val);
      // this.form.startTime=this.formatDateTime(val);
    },
    getRTime(val) {
      // console.log("时间。。")
      // console.log(val);
      // this.reportTime=this.formatDateTime(val);
    },
    confirm() {
      let arr = this.$refs.tree.getCheckedKeys();
      this.treeId = arr;
      // console.log(this.treeId);
    },
    // 点击发布
    release() {
      this.getEventName();
      if (this.showValidate()) {
        // if (this.form.addressFloor.trim != '') {
        //   this.form.address = this.form.address + this.form.addressFloor
        // }
        this.dialogShowVisible = true;
        this.getReleasedep();
      }
    },
    //事件发布人员列表
    getReleasedep() {
      axios
        .get(config.apiHost + "/current-events/releasedep", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            // console.log(result.data)
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
    //发布
    issue() {
      if (this.isexam == 0) {
        this.form.status = "3";
      } else if (this.isexam == 1) {
        this.form.status = "2";
      }
      // console.log(this.form.status);
      this.form.reportedTime = this.getCurrentDateTime(this.form.reportedTime);
      this.form.startTime = this.getCurrentDateTime(this.form.startTime);
      this.form.userIdList = this.checkedPeople.join();
      if (this.form.userIdList != null && this.form.userIdList != "") {
        axios({
          method: "post",
          // /api
          url: config.apiHost + "/current-events/savaAndRelease",
          data: this.form,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        })
          .then(res => {
            // console.log(res);
            if (res.data.status == 200) {
              this.$message(res.data.body.msg);
              this.$router.push({ path: "/home/event-process" }); //发布成功 跳转到流程中事件
            } else {
              //发布失败
              this.$message(res.data.body.msg);
            }
            return res.data;
          })
          .catch(response => {
            this.$message.error(response);
          });
      } else {
        this.$message.error("请选择发布人");
      }
    },
    // 关闭预览
    closefrom() {
      this.fromShow = false;
    },
    getCurrentDateTime(str) {
      return moment(str).format("YYYY-MM-DD HH:mm:ss");
    },
    getCurrentDate(str) {
      return moment(str).format("YYMM");
    },
    showMap() {
      this.fromShow = true;
    },
    addpoint(lng, lat) {
      map.setCenter([lng, lat]);
      map.clearMap();
      new AMap.Marker({
        position: [lng, lat],
        map: map
      });
    },
    getMap() {
      var self = this;
      var mapObj = new AMap.Map("l-map", {
        zoom: 10 //级别
      });
      map = mapObj;
      var marker = new AMap.Marker({
        position: [+self.longitude, +self.latitude]
      });
      mapObj.add(marker);
      // 获取当前位置
      mapObj.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          showButton: false, //显示定位按钮，默认：true
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
          zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", data => {
          self.longitude = data.position.lng;
          self.latitude = data.position.lat;
          self.oldlongitude = data.position.lng;
          self.oldlatitude = data.position.lat;
        });
        AMap.event.addListener(geolocation, "error", error => {
          self.$message.error(error.message);
        });
      });
      // 搜索
      mapObj.plugin(["AMap.Autocomplete", "AMap.PlaceSearch", "AMap.DistrictSearch"], function() {
        var autoOptions = {
          // 城市，默认全国
          city: [self.longitude, self.latitude],
          // 使用联想输入的input的id
          input: "suggestId"
        };
        var autocomplete = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
          city: [self.longitude, self.latitude],
          map: mapObj
        });
        // 搜索建议点击选择
        AMap.event.addListener(autocomplete, "select", function(e) {
          if (e.poi.location.lng && e.poi.location.lat) {
            self.addpoint(+e.poi.location.lng, +e.poi.location.lat);
            // let myAdress = e.poi.district + e.poi.address;
            // self.form.address = myAdress; //地址
            self.form.longitude = +e.poi.location.lng; //经度
            self.form.latitude = +e.poi.location.lat; //纬度
            var geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              city: [+e.poi.location.lng, +e.poi.location.lat]
            });
            var lnglat = [+e.poi.location.lng, +e.poi.location.lat];
            geocoder.getAddress(lnglat, function(status, result) {             
              if (status === "complete" && result.info === "OK") {
                // result为对应的地理位置详细信息
                // console.log('***',result.regeocode);
                var data = result.regeocode.addressComponent
                self.form.address = result.regeocode.formattedAddress;
                self.form.province = data.province;
                self.form.city = data.city?data.city:data.province;
                self.form.district = data.district;
                self.form['township'] = data.township;
                self.form['street'] = data.street;
                self.fromShow = false;
                self.clearInput();
              }
            });
          }
        });
      });
      // 地图点击设置位置
      AMap.event.addListener(mapObj, "click", e => {
        self.addpoint(+e.lnglat.lng, +e.lnglat.lat);
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: [+e.lnglat.lng, +e.lnglat.lat]
          });
          var lnglat = [+e.lnglat.lng, +e.lnglat.lat];
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              var data = result.regeocode.addressComponent
              self.form.longitude = +e.lnglat.lng; //经度
              self.form.latitude = +e.lnglat.lat; //纬度
              self.form.address = result.regeocode.formattedAddress; //地址
              self.form.province = data.province;
              self.form.city = data.city?data.city:data.province;
              self.form.district = data.district;
              self.form['township'] = data.township;
              self.form['street'] = data.street;
              self.fromShow = false;
              self.clearInput();
            }
          });
        });
      });
    },
    // 设置select eventLeve颜色
    eventLeveChanged(v) {
      switch (v) {
        case 1:
          this.eventLeveColor = "#e51717";
          break;
        case 2:
          this.eventLeveColor = "#ff7519";
          break;
        case 3:
          this.eventLeveColor = "#ffe229";
          break;
        case 4:
          this.eventLeveColor = "#006636";
          break;
        case 5:
          this.eventLeveColor = "#666666";
          break;
      }
      this.$refs.eventLeveSelect.$children[0].$refs.input.style.color = this.eventLeveColor;
    },
    clearInput() {
      this.$refs.locationSearchInput.value = "";
    },
    showMore(e) {
      // more
      let el = e.target.parentNode;
      el.classList.toggle("active");
      // row / rowTwo
      el.parentNode.classList.toggle("show");
    }
  },
  mounted() {
    this.getMap();
  },
  created() {
    this.getOrigin();
    this.getPlace();
  }
};
</script>

<style scoped>
.rolebox {
  width: auto;
  min-height: 100%;
  /* text-align: left; */
  background-color: #e2e6ef;
  /* padding: 10px 10px 45px; */
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
  /* padding-bottom: 30px; */
}
.main {
  width: auto;
  /* height: 100%; */
  min-height: 100%;
  background-color: #e2e6ef;
  padding: 10px 10px 45px;
}
.add_Container {
  height: 100%;
  min-height: 850px;
  width: 100%;
  background-color: #ffffff;
}
.title {
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
  background: #f6f7fb;
  text-align: left;
}
.main-box {
  width: 100%;
  min-height: 800px;
  /* height: 500px; */
  /*background: #DCE0E8;  */
  margin: 0 auto;
  padding: 10px;
}
.info {
  line-height: 30px;
  text-align: left;
  border-radius: 8px;
  /* color: #; */
  width: 100%;
  margin-bottom: 20px;
  padding: 14px;
  background-color: #fff;
  /*display:inline;
  border-bottom: 2px solid #6eb594;*/
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
  margin: 20px;
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
  border: 1px solid #dcdfe6;
  background: #fff;
  padding: 0 15px;
  margin-left: 5px;
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
  width: 50%;
  height: 35px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
}
.inp-per {
  width: 217px;
  padding-left: 20px;
}
.margin-left-three {
  margin-left: 30px;
}
.btn-div {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
  /* padding-left: 32%; */
}
.btn-div .el-button {
  width: 100px;
  margin: 0 10px;
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
/* .footer .el-button:first-child {
  background: #429e73;
  color: #fff;
}
.footer .el-button:last-child {
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
/* .temp_bg {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(7, 17, 27, 0.6);
}
.my_from {
  width: 800px;
  height: 600px;
  background: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
} */
.temp_bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(7, 17, 27, 0.6);
  /* z-index: 100; */
}
.temp_bg .input_text {
  position: absolute;
  top: 20px;
  /* left: 50%;
  transform: translateX(-50%); */
  left: 20px;
}
.input_text input {
  height: 40px;
  border-radius: 5px;
  outline: none;
  line-height: 40px;
  padding: 0 20px 0 70px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 10px 0px rgba(16, 20, 26, 0.2);
  border: none;
}
/* .input_text input:focus {
  border: 1px solid #006636;
} */
.input_text .el-icon-search,
.input_text .el-icon-close {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 50px;
  background: #429e73;
  border-radius: 5px 0 0 5px;
  color: #fff;
  font-size: 16px;
  line-height: 40px;
}
.input_text .el-icon-close {
  left: auto;
  right: 0;
  height: 80%;
  top: 10%;
  line-height: 32px;
  background: transparent;
  border-left: 1px solid #aaa;
  color: #333;
  border-radius: 0;
}
.my_from {
  width: 800px;
  height: 600px;
  background: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* overflow: hidden; */
  border-radius: 15px;
}
.my_from .closeform {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: #429e73;
  color: #fff;
  z-index: 9999;
  cursor: pointer;
}
.my_from .closeform i {
  position: absolute;
  font-size: 14px;
  color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.tangram-suggestion-main {
  z-index: 9999999999;
}
.input_text {
  position: absolute;
  top: 20px;
  left: 20px;
}
.activeType {
  visibility: hidden;
}
.ad.el-icon-location {
  color: #006636;
  width: 35px;
  height: 35px;
  top: 0px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
}
.el-dialog__headerbtn {
  top: 0;
}
</style>

