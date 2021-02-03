<template>
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
    <div class="from-box">
      <!-- <div class="event-title">事件接报</div> -->
      <form :model="form" class="event-form">
        <div class="info">
          <div class="info-head">
            <img src="../../assets/event02.png" style="vertical-align:middle;">&nbsp;&nbsp;信息获取-报告人信息
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">接报时间</label>
              <el-date-picker
                v-model="form.reportedTime"
                @change="getRTime"
                type="datetime"
                placeholder="选择日期时间"
                style="width:220px"
              ></el-date-picker>
            </div>
            <div style="padding-left:10%">
              <label class="label-div">报告人</label>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.reportUser"
                style="width:220px"
              ></el-input>
            </div>
            <div>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.reportPhone"
                style="width:220px;float:right"
              ></el-input>
              <label class="label-div" style="float:right">报告电话</label>
            </div>
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">报告来源</label>
              <el-select v-model="form.originId" placeholder="请选择" style="width:220px">
                <el-option
                  v-for="item in originList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div style="padding-left:10%">
              <label class="label-div">接报人姓名</label>
              <el-input type="text" class="inp inp-per" v-model="form.userName" style="width:220px"></el-input>
            </div>
            <div>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.departmentName"
                style="width:220px;float:right"
              ></el-input>
              <label class="label-div" style="float:right">接报人科室</label>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="info-head">
            <img src="../../assets/event03.png" style="vertical-align:middle;">&nbsp;&nbsp;核实信息-事件概况
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">事件场所</label>
              <el-select
                v-model="form.placeId"
                placeholder="请选择"
                @change="eventPlaceChang(false)"
                style="width:30%;"
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
                style="width:30%;margin-left:5px;float:none"
              ></el-input>
              <el-select
                v-model="form.placeDetail"
                placeholder="请选择"
                filterable
                v-show="!eventPlace"
                style="width:30%;margin-left:5px;"
              >
                <el-option
                  v-for="item in schoolList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="location" style="padding-left:10%">
              <label class="label-div">地点</label>
              <div style="position: relative;width:220px;">
                <el-input
                  type="text"
                  class="inp"
                  ondragstart="return false"
                  placeholder="例：xx市xx区xx路xx号"
                  v-model="form.address"
                  readonly
                ></el-input>
                <i class="ad el-icon-location" @click="showMap"></i>
              </div>
            </div>
            <div>
              <el-input
                type="text"
                class="inp"
                v-model="form.startTime"
                style="width:220px;float:right"
                readonly
              ></el-input>
              <label class="label-div" style="float:right">
                <span>开始时间</span>
              </label>
            </div>
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">疑似事件类型</label>
              <el-select v-model="form.genre" placeholder="请选择" style="width:61.5%">
                <el-option
                  v-for="item in eventType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <!-- <el-select v-model="form.genre" placeholder="请选择" style="width:30%;margin-left:5px;">
                <el-option
                  v-for="item in eventType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>-->
            </div>
            <div style="padding-left:10%">
              <label class="label-div">事件等级</label>
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
            <div>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.caseNumber"
                style="width:220px;float:right"
              ></el-input>
              <label class="label-div" style="float:right">疑似病例数</label>
            </div>
          </div>
          <div class="input-div">
            <label class="label-div">疑似事件</label>
            <el-input type="text" v-model="form.name"></el-input>
          </div>
          <div class="input-div">
            <label class="label-div">事件概要</label>
            <el-input type="textarea" resize="none" :rows="3" v-model="form.comment"></el-input>
          </div>
          <div class="text-input" v-if="form.userNameList">
            <label class="label-div">流调员</label>
            <!-- <span style="color:#409EFF">{{form.userNameList}}</span>  -->
            <el-tag
              size="medium"
              v-for="(item, index) in form.userNameList.split(',')"
              :key="index"
              v-text="item"
              style="margin-right:10px;"
            ></el-tag>
          </div>
          <div class="text-input" v-else>
            <label class="label-div">流调员</label>
            <span style="color:#409EFF">暂无</span>
          </div>
        </div>

        <div class="btn-div">
          <el-button class="ok" @click="updateEvent">保存</el-button>
          <el-button class="cancel" @click="closeShow">取消</el-button>
        </div>
      </form>
    </div>
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
            <div id="r-result" class="input_text">请输入:
              <input type="text" id="suggestId" size="20" value="百度" style="width:300px;">
            </div>
            <div
              id="searchResultPanel"
              style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;z-index:999999999"
            ></div>
          </div>
        </div>
      </transition>
    </template>-->
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
                @click="claerInput"
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
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import moment from "moment";
import animate from "animate.css";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
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
        genreone: "",
        genretwo: "",
        genrethree: "",
        genrefour: "",
        genrefive: "", //疑似事件类型
        otherPlaces: ""
      },
      eventPlace: false,
      secondShow: false,
      thirdShow: false,
      fouthShow: false,
      fiveShow: false,
      placedShow: false,
      fromShow: false,
      originList: [],
      placeList: [],
      thirdType: [],
      fouthType: [],
      fiveType: [],
      schoolList: [],
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
      //   0-传染病   1-食源性疾病
      firstType: [
        {
          id: 0,
          name: "传染病"
        },
        {
          id: 1,
          name: "食源性疾病"
        },
        {
          id: 6,
          name: "其他"
        }
      ],
      secondType: [
        {
          id: 1,
          name: "甲"
        },
        {
          id: 2,
          name: "乙"
        },
        {
          id: 3,
          name: "丙"
        },
        {
          id: 5,
          name: "丁"
        }
      ],
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
    ...mapGetters(["event"])
  },
  methods: {
    showMap() {
      this.fromShow = true;
    },
    // 关闭预览
    closefrom() {
      this.fromShow = false;
    },
    firstChange() {
      if (this.form.genreone == 0) {
        this.secondShow = true;
        this.fouthShow = false;
        this.fiveShow = false;
      }
      if (this.form.genreone == 1) {
        this.secondShow = false;
        this.thirdShow = false;
        this.fouthShow = true;
        this.fiveShow = false;
        this.fouthType = [];
        axios({
          method: "get",
          url: config.apiHost + "/disease/list?type=1",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        }).then(res => {
          if (res.data.status == 200) {
            this.fouthType = res.data.body;
          }
        });
      }
      if (this.form.genreone == 6) {
        this.fouthShow = false;
        this.secondShow = false;
        this.thirdShow = false;
        this.fouthShow = false;
        this.fiveShow = true;
        this.fiveType = [];
        axios({
          method: "get",
          url: config.apiHost + "/disease/list?type=6",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        }).then(res => {
          if (res.data.status == 200) {
            this.fiveType = res.data.body;
          }
        });
      }
    },
    secondChange() {
      this.thirdShow = true;
      this.thirdType = [];
      axios({
        method: "get",
        url: config.apiHost + "/disease/list?type=" + this.form.genretwo,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.thirdType = res.data.body;
        }
      });
    },
    threeChange() {},
    fouthChange() {},
    fiveChange() {},
    getOrigin() {
      axios
        .get(config.apiHost + "/event-origin", {
          params: {
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
    getPlace() {
      axios
        .get(config.apiHost + "/event-places", {
          params: {
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
    getMap() {
      // 百度地图API功能
      function G(id) {
        return document.getElementById(id);
      }
      var map = new BMap.Map("l-map", { enableMapClick: false });

      var latitude = parseInt(this.latitude) + 0.636864;
      var longitude = parseInt(this.longitude) - 0.778122;

      // console.log(this.latitude); //31.1650310.636864
      // console.log(this.longitude); //120.57556000000001

      var point = new BMap.Point(longitude, latitude);
      var pointMark = new BMap.Point(this.longitude, this.latitude);
      map.centerAndZoom(point, 10); // 初始化地图,设置城市和地图级别。
      var marker = new BMap.Marker(pointMark); // 创建标注
      map.addOverlay(marker);
      map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
      map.closeInfoWindow();

      var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: map
      });

      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;

        setPlace();
      });

      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          map.centerAndZoom(pp, 18);
          map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }

      var geoc = new BMap.Geocoder();
      map.addEventListener("click", e => {
        map.clearOverlays(); //清除地图上所有覆盖物
        // alert(e.point.lng + "," + e.point.lat);//经纬度
        var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中

        var pt = e.point;
        geoc.getLocation(pt, rs => {
          var addComp = rs.addressComponents;
          // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
          let myAdress =
            // addComp.province +
            // addComp.city +
            addComp.district + addComp.street + addComp.streetNumber;
          // console.log(myAdress);
          this.form.longitude = pt.lng; //经度
          this.form.latitude = pt.lat; //纬度
          this.form.address = myAdress; //地址
          this.getEventName();

          // G("suggestId").value=myAdress;//给输入框添加值
        });
        this.fromShow = false;
      });
    },
    getSTime(val) {
      // console.log("开始时间。。")
      //  console.log(val);
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
    //保存修改
    updateEvent() {
      axios({
        method: "post",
        url: config.apiHost + "/current-events/update-event",
        data: this.form,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      })
        .then(res => {
          if (res.data.status == 200) {
            this.$message(res.data.body.msg);
            this.$router.go(-1);
          }
          return res.data;
        })
        .catch(response => {
          this.$message.error(response);
        });
    },
    // 取消，返回列表
    closeShow() {
      this.$router.go(-1);
    },
    eventPlaceChang(first) {
      var _this = this;
      if (first == true) {
      } else {
        this.form.otherPlaces = "";
        this.form.placeDetail = "";
      }
      // console.log(this.form.placeId);
      if (this.form.placeId == "") {
        this.eventPlace = false;
      }

      axios({
        method: "get",
        url: config.apiHost + "/froms/places",
        params: {
          placeId: this.form.placeId
        }
      }).then(result => {
        // console.log(result);
        if (result.data.status == 200) {
          this.eventPlace = result.data.body;
          if (!this.eventPlace) {
            if (!this.eventPlace) {
              axios({
                method: "get",
                url: config.apiHost + "/placeMain/place/getAreaPlaceByEvent",
                params: {
                  typeId: _this.form.placeId
                }
              }).then(result => {
                if (result.data.status == 200) {
                  this.schoolList = result.data.body;
                }
              });
            }
          }
        } else {
          this.eventPlace = result.data.body;
        }
      });
      // console.log(value)
      //    if(value == "其他"){
      //   this.eventPlace=true;
      // }else{
      //   this.eventPlace=false;
      // }
      // if (id == first) {

      // } else {
      //   this.form.otherPlaces = ''
      // }
    },
    claerInput() {
      this.$refs.locationSearchInput.value = "";
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
    }
  },
  mounted() {
    // console.log(this.event);
    this.form = this.event;
    this.eventLeveChanged(this.form.grade);
    this.latitude = this.form.latitude;
    this.longitude = this.form.longitude;

    this.getMap();
    this.eventPlaceChang(true);
    // console.log(this.form);
  },
  created() {
    this.getOrigin();
    this.getPlace();
  }
};
</script>

<style scoped>
.mybox {
  width: auto;
  min-height: 100%;
  /* text-align: left; */
  /* background-color: #e2e6ef; */
  padding: 10px 10px 45px;
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
.from-box {
  height: calc(100% - 45px);
  /* min-height: 900px; */
  /* background-color: #ffffff; */
  margin: 0 auto;
  padding: 10px 0px 50px;
}
.event-title {
  height: 30px;
  line-height: 30px;
  width: 100%;
  padding-left: 10px;
  background-color: #def0fe;
  display: flex;
  justify-content: space-between;
}
.event-form {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 30px;
}
.info {
  line-height: 30px;
  text-align: left;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 20px;
  padding: 14px;
  background-color: #ffffff;
}
.info:hover {
  background: #fff url("../../assets/event01.png") repeat-y left;
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
.input-div {
  margin: 20px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  /* align-items: center; */
}
.input-div > div {
  flex: 1;
}
.input-div > div label,
.input-div > div .el-input {
  float: left;
  line-height: 40px;
}
.location > label,
.location > div {
  float: left;
}
.text-input {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}
.area {
  width: 560px;
  height: 100px;
  border: 0;
  background: #eeeeee;
}
.label-div {
  display: block;
  width: 110px;
  text-align: right;
  margin-right: 15px;
  text-align: justify;
  text-align-last: justify;
  font-size: 18px;
}
.inp {
  /* width: 50%; */
  /* height: 30px;
  border: 0;
  border-radius: 4px; */
  /* background: #eeeeee; */
  /* height: 35px; */
  /* padding-left: 10px; */
}
.inp-per {
  /* width: 217px; */
}
.margin-left-three {
  margin-left: 30px;
}
.ad {
  position: absolute;
  right: 5px;
  top: 10px;
}
.btn-div {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}
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
.center_ {
  text-align: center;
}
.right_ {
  text-align: right;
}
</style>

