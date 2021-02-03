<template>
  <div class="home_main">
    <div class="home_top">
      <el-radio-group
        id="homeWra"
        text-color="#fff"
        fill="#006636"
        @change="changeShow"
        v-model="tabPosition"
        style="margin-bottom: 20px;font-weight:bold;"
      >
        <el-radio-button
          text-color="#fff"
          label="0"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;周&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio-button>
        <el-radio-button
          text-color="#fff"
          label="1"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio-button>
        <el-radio-button
          text-color="#fff"
          label="2"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;季&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio-button>
        <el-radio-button
          text-color="#fff"
          label="3"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio-button>
      </el-radio-group>
    </div>
    <div class="home_Container">
      <!-- <div
        :class="{event_num:true,shadow:numsActive===0}"
        @mouseenter="enter(0)"
        @mouseleave="leave"
      >
        <div class="nums">
          <div class="title_event event1">
            <img
              src="../../assets/icon-01.png"
              alt
              style="vertical-align:middle;padding-right:5px;"
            >接报事件数
          </div>
        </div>
        <div class="time_choose">
          <div>
            <count-to
              ref="myNumOne"
              class="nums_span"
              :duration="2000"
              :startVal="0"
              :endVal="numsOne"
            ></count-to>件
          </div>
        </div>
      </div>-->
      <div
        :class="{event_num:true,shadow:numsActive===1}"
        @mouseenter="enter(1)"
        @mouseleave="leave"
      >
        <div class="nums">
          <div class="title_event event1">
            <img
              src="../../assets/icon-02.png"
              alt
              style="vertical-align:middle;padding-right:5px;"
            >传染病事件
          </div>
        </div>
        <!-- 选择  -->
        <div class="time_choose">
          <div>
            <count-to
              ref="myNumOne"
              class="nums_span"
              :duration="2000"
              :startVal="0"
              :endVal="numsTwo"
            ></count-to>件
          </div>
        </div>
      </div>
      <div
        :class="{event_num:true,shadow:numsActive===2}"
        @mouseenter="enter(2)"
        @mouseleave="leave"
      >
        <div class="nums">
          <div class="title_event event2">
            <img
              src="../../assets/icon-03.png"
              alt
              style="vertical-align:middle;padding-right:5px;"
            >食源性事件
          </div>
        </div>
        <!-- 选择  -->
        <div class="time_choose">
          <div>
            <count-to
              ref="myNumOne"
              class="nums_span"
              :duration="2000"
              :startVal="0"
              :endVal="numsThree"
            ></count-to>件
          </div>
        </div>
      </div>
      <div
        :class="{event_num:true,shadow:numsActive===0}"
        @mouseenter="enter(0)"
        @mouseleave="leave"
      >
        <div class="nums">
          <div class="title_event event3">
            <img
              src="../../assets/icon-01.png"
              alt
              style="vertical-align:middle;padding-right:5px;"
            >不明原因事件数
          </div>
        </div>
        <div class="time_choose">
          <div>
            <count-to
              ref="myNumOne"
              class="nums_span"
              :duration="2000"
              :startVal="0"
              :endVal="numsFive"
            ></count-to>件
          </div>
        </div>
      </div>
      <div
        :class="{event_num:true,shadow:numsActive===3}"
        @mouseenter="enter(3)"
        @mouseleave="leave"
      >
        <div class="nums">
          <div class="title_event event4">
            <img
              src="../../assets/icon-04.png"
              alt
              style="vertical-align:middle;padding-right:5px;"
            >涉案总人数
          </div>
        </div>
        <!-- 选择  -->
        <div class="time_choose">
          <div>
            <count-to
              ref="myNumOne"
              class="nums_span"
              :duration="2000"
              :startVal="0"
              :endVal="numsFour"
            ></count-to>人
          </div>
        </div>
      </div>
      <!-- 天气预报-->
      <!-- <div class="vedio_box" style="background:url(../assets/ss.png) left top no-repeat"> -->
      <div
        class="vedio_box event_num"
        :class="{shadow:numsActive===4}"
        @mouseenter="enter(4)"
        @mouseleave="leave"
      >
        <div>&nbsp;</div>
        <iframe
          width="150"
          scrolling="no"
          height="87px"
          frameborder="0"
          allowtransparency="true"
          src="http://i.tianqi.com/index.php?c=code&a=getcode&id=35&h=55&w=200"
        ></iframe>
      </div>
      <div
        class="rotaEvent_box"
        :class="{shadow:numsActive===5}"
        @mouseenter="enter(5)"
        @mouseleave="leave"
      >
        <div class="main_title">事件分发</div>
        <div class="main_item">
          <div v-if="eventsDistribution!=''" class="events" :style="{width:'390px'}">
            <div class="rotaEventMain" v-for="(v,k) in eventsDistribution" :key="k">
              <div class="name">{{v.name}}</div>
              <!-- <div class="list">{{v.status}}</div> -->
              <template>
                <div v-if="v.status==1">未发布</div>
                <div v-else-if="v.status==2">发布审批</div>
                <div v-else-if="v.status==3">待调查</div>
                <div v-else-if="v.status==4">调查中</div>
                <div v-else-if="v.status==5">结案审批</div>
                <div v-else></div>
              </template>
            </div>
          </div>
          <div v-else class="events" :style="{width:'100%',height:'70%'}">
            <div class="rotaEventMain">
              <span style="color:#777;font-size:18px;display:block;width:100%">暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home_ContainerBottom">
      <!-- 左侧 -->
      <div class="right_main">
        <div class="middle_main">
          <div class="main_item">
            <span class="select_div">事件空间分布</span>
            <button class="btn_show" @click="dataShow">
              <img
                src="../../assets/icon-05.png"
                style="vertical-align:middle;padding-right:5px;"
                alt
              >数据展示
            </button>
            <div class="map_item">
              <div id="div1" :style="{width:'100%',height:'525px'}"></div>
              <!-- 浮动数据框(地区分布) -->
              <div class="addressNum" v-show="isShow" style="overflow:auto">
                <div class="address_top">
                  <div class="list_head">地区分布</div>
                  <div class="list_one">传染病</div>
                  <div class="list_two">食源性</div>
                  <div class="list_three">其他</div>
                </div>
                <!-- 地址列表 -->
                <div class="address_list" v-for="(v,k) in addressDate" :key="k">
                  <div class="list_head" :title="v.district">{{v.district}}</div>
                  <div class="list_one">{{v.diseaseNum}}</div>
                  <div class="list_two">{{v.foodBorneNum}}</div>
                  <div class="list_three">{{v.otherNum}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="left_main">
        <!-- 传染病趋势图 -->
        <div class="infection_box">
          <div class="main_item">
            <span class="leftTitle">传染病发病前五类</span>
            <div class="shuaxin">
              <span>单位：事件数</span>
            </div>
            <div id="mainInf" class="echartsCss" :style="{width:'100%',height:'237px'}"></div>
          </div>
        </div>
        <!-- 食源性趋势图 -->
        <div class="food_box">
          <div class="main_item">
            <span class="leftTitle">食源性事件场所分布</span>
            <div class="shuaxin">
              <span>单位：事件数</span>
            </div>
            <div id="foodMain" class="echartsCss" :style="{width:'100%',height:'237px'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import axios from "axios";
import countTo from "vue-count-to";
var config = require("@/components/utils/Common_Config.js");
var dispic1 = require("@/assets/icon-dis1.png");
var dispic2 = require("@/assets/icon-dis2.png");
var dispic3 = require("@/assets/icon-dis3.png");
var eventmap = require("@/assets/eventmap.png");
var level1 = require("@/assets/icon_level1.png");
var level2 = require("@/assets/icon_level2.png");
var level3 = require("@/assets/icon_level3.png");
var level4 = require("@/assets/icon_level4.png");
var level5 = require("@/assets/icon_level5.png");
var cat1 = require("@/assets/icon_cat1.png");
var cat2 = require("@/assets/icon_cat2.png");
var cat3 = require("@/assets/icon_cat3.png");
var place1 = require("@/assets/icon_place1.png");
var place2 = require("@/assets/icon_place2.png");
var place3 = require("@/assets/icon_place3.png");
var place4 = require("@/assets/icon_place4.png");
var place5 = require("@/assets/icon_place5.png");
var place6 = require("@/assets/icon_place6.png");
var status1 = require("@/assets/icon_status1.png");
var status2 = require("@/assets/icon_status2.png");
var status3 = require("@/assets/icon_status3.png");
var status4 = require("@/assets/icon_status4.png");
export default {
  components: {
    countTo
  },
  data() {
    return {
      tabPosition: "3",
      drawInfName: [],
      drawInfData: [],
      drawFoodName: [],
      drawFoodData: [],
      numsActive: -1,
      numsOne: 0,
      numsTwo: 0,
      numsThree: 0,
      numsFour: 0,
      numsFive: 0,
      title: "",
      longitude: "",
      latitude: "",
      addressDate: [],
      isShow: 1,
      eventsDistribution: [],
      mapData: []
    };
  },
  methods: {
    // 传染病发病前五类数据
    getInfection() {
      // // console.log("传染病趋势图~");
      axios
        .get(config.apiHost + "/home/diseaseMap", {
          params: {
            //请求参数
            token: config.token,
            togetherMode: this.tabPosition
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            let Data = result.data.body;
            // // console.log(Data)
            this.drawInfName = Data.disname;
            this.drawInfData = Data.discount;
            this.drawInfLine();
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
        });
    },
    // 食源性趋势数据
    getFood() {
      // // console.log("食源性趋势~");
      axios
        .get(config.apiHost + "/home/foodBorneMap", {
          params: {
            //请求参数
            token: config.token,
            togetherMode: this.tabPosition
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            let Data = result.data.body;
            // console.log(Data)
            this.drawFoodName = Data.disname;
            this.drawFoodData = Data.discount;

            this.drawFoodLine();
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
        });
    },
    //获取最新消息前四
    getEventsDistribution() {
      axios
        .get(config.apiHost + "/home/eventDistribution", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            let Data = result.data.body;
            // console.log(Data)
            // if(Data == ''){
            //   this.eventsDistribution = "暂无数据"
            // }else{
            this.eventsDistribution = Data;
            // console.log(this.eventsDistribution)
            // }
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
        });
    },
    // 传染病发病前五类
    drawInfLine() {
      var myChart = echarts.init(document.getElementById("mainInf"));
      window.onresize = function() {
        myChart.resize();
      };
      let legend = {
        orient: "vertical",
        x: "left",
        // y: 50,
        icon: "circle",
        padding: [0, 25, 0, 0],
        itemWidth: 15, // 设置宽度
        itemHeight: 15, // 设置高度
        itemGap: 25, // 设置间距
        data: this.drawInfName
      };
      // myChart.clear();
      var option = {
        tooltip: {},
        xAxis: [
          {
            data: this.drawInfName,
            axisLine: {
              lineStyle: {
                color: "#f0f0f0"
              }
            },
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                color: "#666"
              },
              formatter: function(value) {
                var ret = ""; //拼接加\n返回的类目项
                var maxLength = 7; //每项显示文字个数
                var valLength = value.length; //X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                if (rowN > 1) {
                  //如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ""; //每次截取的字符串
                    var start = i * maxLength; //开始截取的位置
                    var end = start + maxLength; //结束截取的位置
                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + "\n";
                    ret += temp; //凭借最终的字符串
                  }
                  return ret;
                } else {
                  return value;
                }
              }
            }
          }
        ],
        yAxis: {
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: "#f0f0f0"
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#f0f0f0",
              type: "dashed" //虚线
            }
          }
        },
        series: [
          {
            type: "bar",
            barWidth: "40",
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#ed6a75",
                    "#f2c60d",
                    "#3498dc",
                    "#34bedc",
                    "#37d497"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: "top",
                textBorderWidth: "0",
                color: "#ccc",
                formatter: "{c}"
              }
            },
            data: this.drawInfData
          }
        ]
      };
      myChart.setOption(option, true);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    // 食源性事件场所分布
    drawFoodLine() {
      var myChart = echarts.init(document.getElementById("foodMain"));
      // myChart.clear();
      myChart.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            x: "left",
            y: 50,
            icon: "circle",
            padding: [0, 0, 0, 25],
            itemWidth: 15, // 设置宽度
            itemHeight: 15, // 设置高度
            itemGap: 25, // 设置间距
            data: this.drawFoodName
          },
          series: [
            {
              type: "pie",
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  color: function(params) {
                    var colorList = [
                      "#9a61f7",
                      "#ffd561",
                      "#ff5a84",
                      "#00c2ad"
                    ];
                    return colorList[params.dataIndex];
                  }
                }
              },
              data: this.drawFoodData
            }
          ]
        },
        true
      );
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    // 得到本月、本周、今日事件数量
    getNums() {
      axios
        .get(config.apiHost + "/home/centreTop", {
          params: {
            //请求参数
            token: config.token,
            togetherMode: this.tabPosition
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            // console.log(result);
            let Data = result.data.body;
            this.numsOne = Data.firstTotal;
            this.numsTwo = Data.twoTotal;
            this.numsThree = Data.treeTotal;
            this.numsFour = Data.fourTotal;
            this.numsFive = Data.fiveTotal;
            this.startAnimate();
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
        });
    },
    // 获取地图数据
    getMapList() {
      this.mapData = [];
      axios
        .get(config.apiHost + "/analyze/epidemicMap", {
          params: {
            //请求参数
            token: config.token,
            togetherMode: this.tabPosition
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            let Data = result.data.body;
            // console.log(Data)
            Data.forEach(item => {
              let longitude = Number(item.longitude);
              let latitude = Number(item.latitude);
              let name = item.name;
              let reportedTime = item.reportedTime;
              let reportUser = item.reportUser;
              let genre = item.genre;
              let address = item.address;
              let level = 1;
              let place = item.placeId;
              let status = item.status;
              let cat = 1;
              // // console.log("地图数据"+longitude+latitude+address);
              this.mapData.push([
                longitude,
                latitude,
                address,
                genre,
                name,
                reportedTime,
                reportUser,
                level,
                place,
                status,
                cat
              ]);
            });
            this.getMap();
          } else {
          }
        })
        .catch(response => {});
    },
    // 调用地图
    getMap() {
      var self = this;
      var mapObj = new AMap.Map("div1", {
        zoom: 10 //级别
        // center: [116.331398, 39.897445] //中心点坐标
      });
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
        AMap.event.addListener(geolocation, "complete", data=>{}); //返回定位信息
        AMap.event.addListener(geolocation, "error", error=>{self.$message.error(error.message)}); //返回定位出错信息
        self.mapaddMarker(mapObj);
      });
    },
    mapaddMarker(mapObj) {
      var data_info = this.mapData;
      var infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        offset: new AMap.Pixel(0, -35)
      });
      for (var i = 0, marker; i < data_info.length; i++) {
        var dispic;
        if (data_info[i][3] == 0) dispic = dispic1;
        else if (data_info[i][3] == 1) dispic = dispic2;
        else if (data_info[i][3] == 2) dispic = dispic3;
        var level, place, cat, status;
        switch (data_info[i][7]) {
          case 1:
            level = level1;
            break;
          case 2:
            level = level2;
            break;
          case 3:
            level = level3;
            break;
          case 4:
            level = level4;
            break;
          default:
            level = level4;
            break;
        }
        switch (data_info[i][8]) {
          case 1:
            place = place1;
            break;
          case 2:
            place = place2;
            break;
          case 3:
            place = place3;
            break;
          case 4:
            place = place4;
            break;
          case 4:
            place = place5;
            break;
          case 4:
            place = place6;
            break;
          default:
            place = place1;
            break;
        }
        switch (data_info[i][9]) {
          case 3:
            status = status1;
            break;
          case 4:
            status = status2;
            break;
          case 5:
            status = status3;
            break;
          case 6:
            status = status4;
            break;
          default:
            status = status1;
            break;
        }
        switch (data_info[i][10]) {
          case 1:
            cat = cat1;
            break;
          case 2:
            cat = cat2;
            break;
          case 3:
            cat = cat3;
            break;
          default:
            cat = cat1;
            break;
        }
        var icon = new AMap.Icon({
          size: new AMap.Size(25, 25), // 图标尺寸
          image: dispic
        });
        var marker = new AMap.Marker({
          position: [+data_info[i][0], +data_info[i][1]],
          icon: icon, // 添加 Icon 实例
          map: mapObj
        });
        //构建自定义信息窗体
        var data = data_info[i];
        data["eventmap"] = eventmap;
        data["level"] = level;
        data["place"] = place;
        data["cat"] = cat;
        data["status"] = status;
        function createInfoWindow(title, content, mapObj, data) {
          var info = document.createElement("div");
          info.style.minWidth = "260px";
          info.style.textAlign = "left";
          info.style.background = "#fff";
          info.style.padding = "10px";
          info.style.borderRadius = "5px";
          info.style.position = "relative";
          info.style.margin = "0";
          info.style.border = "1px solid #429e73";
          info.innerHTML = `
              <div
                style="width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid #429E73;
                position: absolute;
                left: 50%;
                bottom: -10px;
                transform: translateX(-50%);"
              >
                <span
                  style="display: block;
                  width: 0;
                  height: 0;
                  border-left: 8px solid transparent;
                  border-right: 8px solid transparent;
                  border-top: 8px solid #fff;
                  position: absolute;
                  left: -8px;
                  top: -10px;"
                ></span>
              </div>
              <div><b style="color:#006636;font-size: 16px;">事件信息</b></div>
              <div>
                <table>
                  <tr>
                    <td>
                      <img style="padding-right:5px" src="${data.eventmap}" />
                      <span style="font-size: 12px;color: #666666;"
                        >${data[4]}</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img style="padding-right:5px" src="${data.level}" />
                      <img style="padding-right:5px" src="${data.place}" />
                      <img style="padding-right:5px" src="${data.cat}" />
                      <img style="padding-right:5px" src="${data.status}" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span style="font-size: 14px;color: #333333;">调查人员：</span>
                      <span style="font-size: 12px;color: #666666;"
                        >${data[6]}</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span style="font-size: 14px;color: #333333;">接报时间：</span>
                      <span style="font-size: 12px;color: #666666;"
                        >${data[5]}</span
                      >
                    </td>
                  </tr>
                </table>
              </div>`;
          var closeX = document.createElement("div");
          closeX.className = "el-icon-close";
          closeX.style.width = "25px";
          closeX.style.height = "25px";
          closeX.style.lineHeight = "25px";
          closeX.style.textAlign = "center";
          closeX.style.position = "absolute";
          closeX.style.top = "0";
          closeX.style.right = "0";
          closeX.style.cursor = "pointer";
          closeX.onclick = () => {
            mapObj.clearInfoWindow();
          };
          info.appendChild(closeX);
          return info;
        }
        marker.content = createInfoWindow("", "", mapObj, data);
        marker.on("click", e => {
          infoWindow.setContent(e.target.content);
          infoWindow.open(mapObj, e.target.getPosition());
        });
        mapObj.add(marker);
      }
    },
    // 得到地区分布列表
    getAddress() {
      axios
        .get(config.apiHost + "/home/dataDisplay", {
          params: {
            //请求参数
            token: config.token,
            togetherMode: this.tabPosition
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            // console.log(result.data.body)
            this.addressDate = result.data.body;
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
        });
    },
    // 控制数据展示显示/隐藏
    dataShow() {
      this.isShow = !this.isShow;
    },
    changeShow() {
      this.getInfection();
      this.getFood();
      // this.changeMap();
      this.getAddress();
      this.getNums();
    },
    enter(index) {
      this.numsActive = index;
    },
    leave() {
      this.numsActive = -1;
    },
    startAnimate: function() {
      this.$refs.myNumOne.start();
      this.$refs.myNumTwo.start();
      this.$refs.myNumThree.start();
      this.$refs.myNumFour.start();
    }
  },
  mounted() {
    // this.login()
    // this.getMap();
    this.getMapList();
  },
  created() {
    this.getInfection();
    this.getFood();
    this.getEventsDistribution();
    this.getAddress();
    this.getNums();
  }
};
</script>

<style scoped>
.BMap_cpyCtrl {
  display: none !important;
}
.BMap_noprint {
  display: none !important;
}
.BMap_point {
  display: none !important;
}
.anchorBL {
  display: none !important;
}

.BMap_stdMpPan,
.BMap_stdMpZoom .BMap_text,
.BMap_stdMpSliderBgTop,
.BMap_stdMpSliderBar,
.BMap_stdMpSliderBgBot,
.anchorBL {
  width: 0 !important;

  height: 0 !important;
}

#div1 {
  border-radius: 8px;
}

.anchorBL img {
  width: 0 !important;
}
.home_Container {
  width: auto;
  text-align: left;
  background-color: #fff;
  margin: 0px 8px 8px 8px;
  display: flex;
  padding: 10px 0;
  /* flex-direction: row; */
  /* justify-content: center; */
  /* align-items: center; */
}
.home_ContainerBottom {
  width: auto;
  text-align: left;
  background-color: #fff;
  margin: 0px 8px 8px 8px;
  display: flex;
  /* flex-direction: row; */
  /* justify-content: center; */
  /* align-items: center; */
}
/* 事件数，涉案人数，总接报数 */
.event_num {
  height: 110px;
  flex: 1;
  align-items: center;
  background-color: #ffffff;
  margin: 8px 8px;
  /* box-shadow: 0px 5px 10px 0px rgba(16, 20, 26, 0.1); */
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.05);
  /* padding: 0px 10px; */
  display: flex;
  flex-direction: column;
}
.shadow {
  box-shadow: 0px 5px 10px 0px rgba(16, 20, 26, 0.1);
}
.nums {
  width: 100%;
  text-align: center;
  justify-content: center;
}
.nums img {
  margin: 0 auto;
  /* line-height:60px; */
}

/* 时间选择联动 */
.time_choose {
  padding: 20px 0px;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
}

/* 左侧 */
.left_main {
  flex: 0.4;
  height: 100%;
  margin: 0 5px;
  display: flex;
  flex-direction: column;
}
/* 右侧 */
.right_main {
  flex: 0.6;
  height: 100%;
  margin: 5px;
  display: flex;
  flex-direction: column;
}

/*三个盒子*/
.three_box {
  flex: 0.5;
  justify-content: space-between;
  /* background-color: orange; */
  flex-direction: row;
  display: flex;
}

/*近一月选择框*/
.event_select {
  border-radius: 3px;
  /* color: ; */
  outline: none;
  height: 35px;
  text-align: center;
  line-height: 35px;
  margin-bottom: 12px;
}
/*数字*/
.title_event {
  font-size: 18px;
  color: #ffffff;
  text-align: center;
  justify-content: center;
  border-radius: 8px 8px 0px 0px;
  padding: 5px 20px;
}
.event1 {
  background-color: #5eaee1;
}
.event2 {
  background-color: #5e9fe1;
}
.event3 {
  background-color: #5e80e1;
}
.event4 {
  background-color: #865ee1;
}
/*文字*/
.nums_span {
  font-size: 36px;
  color: #333333;
  font-weight: 300;
  width: 30px;
  line-height: 30px;
  padding-right: 4px;
  text-align: center;
}
/* 天气预报 */
.vedio_box iframe {
  width: 100%;
  height: 100%;
}
.rotaEvent_box {
  height: 110px;
  width: 432px;
  align-items: center;
  background-color: #ffffff;
  margin: 8px 8px;
  /* box-shadow: 0px 5px 10px 0px rgba(16, 20, 26, 0.1); */
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.main_title {
  width: 10%;
  height: 110px;
  vertical-align: middle;
  padding: 8px 7px;
  border-radius: 8px 0px 0px 8px;
  background-color: #5ec7e1;
  float: left;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.main_item {
  width: 90%;
  float: left;
  position: relative;
}

/* 传染病 */
.infection_box {
  flex: 1;
  margin: 8px 8px;
  display: flex;
  /* padding: 10px 10px; */
}
/* 食源性 */
.food_box {
  border-radius: 5px;
  flex: 1;
  margin: 8px 8px;
  display: flex;
  /* padding: 10px 10px; */
}

/* 左边的标题 */
.left_main .left_title {
  flex: 0.8;
  color: white;
  font-size: 20px;
  border-radius: 5px 0 0 5px;
  background: #283142;
  box-shadow: rgba(0, 0, 0, 0.2) 3px 4px 2px 2px;
}
.left_main .left_title span {
  display: block;
  margin: 35px 12px;
}

/* 右边的数据 */
.left_main .main_item {
  flex: 10;
  position: relative;
  margin-bottom: 0px;
}
/* 时间筛选 */
.left_main .select_div {
  position: absolute;
  top: 0px;
  right: 12%;
  border: 0;
  /* background-color: #e2e6ed; */
  border-radius: 3px;
  outline: none;
  height: 22px;
  line-height: 22px;
  z-index: 100;
}
/* 右边的标题 */
.right_main .middle_top .left_title {
  flex: 0.7;
  color: white;
  border-radius: 5px 0 0 5px;
  font-size: 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 3px 4px 2px 2px;
  z-index: 100;
}
.events {
  color: #666666;
  overflow: hidden;
  margin: 12px 8px;
}
.echartsCss {
  margin-top: 10px;
  margin-right: 8px;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.05);
}
.rotaEventMain {
  display: flex;
  font-size: 14px;
  line-height: 22px;
}
.rotaEventMain span {
  display: block;
  margin: 7% 38%;
}
.rotaEventMain .name {
  flex: 0.94;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.rotaEventMain template {
  flex: 0.1;
}
.right_main .middle_main .left_title {
  flex: 0.5;
  color: white;
  font-size: 20px;
  z-index: 50;
}
.right_main .left_title span {
  display: block;
  margin: 28px 12px;
}
.right_main .middle_main .left_title span {
  display: block;
  margin: 150px 12px;
}
/* 右边的数据 */
.right_main .main_item {
  flex: 11;
  position: relative;
  background-color: #ffffff;
  border-radius: 5px;
  /* padding: 15px 0px 0px 15px; */
}
.leftTitle {
  color: #333333;
  font-size: 16px;
  margin: 8px;
}
/* 时间筛选 */
.right_main .select_div {
  position: absolute;
  top: 1%;
  left: 8px;
  outline: none;
  line-height: 22px;
}

.middle_main {
  flex: 1.6;
  display: flex;
  flex-direction: row;
}

/* 数据展示 */
.btn_show {
  border-radius: 4px;
  border: solid 1px #eeeeee;
  /* color: white; */
  font-size: 14px;
  color: #666666;
  width: 120px;
  height: 26px;
  background-color: #fff;
  outline: none;
  background: #fff;
  /* margin-left: 82%; */
  /* margin-top: 0.7%; */
  border-radius: 5px;
  /* z-index: 111; */
  position: absolute;
  top: 3px;
  right: 10px;
}

/* 地区分布 */
.addressNum {
  height: calc(100% - 20px);
  width: 35%;
  position: absolute;
  top: 2px;
  right: 0px;
  background-color: #5e9fe1;
  box-shadow: 4px 5px 10px 0px rgba(16, 20, 26, 0.1);
  margin: 10px;
  border-radius: 5px;
  opacity: 0.75;
}
.address_top {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 12px 7px 10px;
  color: #eee;
}
.address_list {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.list_head {
  font-size: 16px;
  width: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #eee;
}

.list_one,
.list_two,
.list_three {
  font-size: 13px;
  color: #eee;
}
.map_item {
  height: calc(100% - 47px);
  width: 98%;
  margin: 38px 1px 0px 8px;
  position: relative;
}
.bottom_box {
  flex: 1.25;
  /* background-color: orange; */
  display: flex;
}

/* 事件公告 */
.notice_box {
  flex: 0.49;
  /* margin-top: 10px; */
  background-color: #ffffff;
}

.main_top {
  background-color: #f0f3fa;
  height: 60%;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  align-items: center;
}
.top_right {
  display: flex;
  align-items: center;
  /* margin: 0px 4px; */
}
.main_crowd {
  display: flex;
  height: calc(100%);
}
.crowd_pie {
  flex: 1;
  height: 90%;
  padding: 10px;
  /* background: pink; */
}

.event_select,
.select_div {
  font-size: 16px;
  height: 27px !important;
}
.select_div option {
  border: 1px solid #333;
}
.left_main .shuaxin {
  z-index: 100;
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 14px;
  color: #666666;
}
.right_main .shuaxin {
  z-index: 100;
  position: absolute;
  top: 1.5%;
  right: 10px;
}
.home_top {
  padding-top: 20px;
  margin: 8px 8px 0;
  background-color: #ffffff;
}
.home_main {
  height: 100%;
}
#rightNav .el-tabs__content {
  background: transparent;
}
</style>

