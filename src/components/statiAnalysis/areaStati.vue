<template>
  <div class="rolebox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>分析统计</el-breadcrumb-item>
        <el-breadcrumb-item>疫情地区分布</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <!-- <div class="region-header">
      <div style="float:left;width:200px;">地区分布汇总</div>

    </div>
      <div style="clear:both;"></div>-->
      <div class="main">
        <el-form
          :inline="true"
          :model="formQuery"
          ref="formQuery"
          label-position="right"
          style="text-align:left;padding: 30px 10px 10px;"
          id="formQuery"
          class="demo-form-inline"
        >
          <!-- <el-form-item label="事发时间：">
        <el-select v-model="formQuery.regionMode" placeholder="请选择" @change="dateTypeChange">
          <el-option v-for="item in dataTypeList" :key="item.id" :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker id="datestart" v-model="dataStart" align="right" :type="dateType" :format="dateFormat" placeholder="请选择" :default-value="dataStart">
        </el-date-picker>
        <span>-</span>
        <el-date-picker id="dateend" v-model="dataEnd" align="right" :type="dateType" :format="dateFormat" placeholder="请选择" :default-value="dataEnd">
        </el-date-picker>

          </el-form-item>-->
          <el-form-item label="事发时间：">
            <el-date-picker
              v-model="dataStart"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyyMMdd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getSpaceList()">搜索</el-button>
          </el-form-item>
          <el-form-item label="事发类型：">
            <el-select v-model="formQuery.regionMode" placeholder="请选择" @change="getSpaceList()">
              <el-option
                v-for="item in happenTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处置单位：">
            <el-select
              v-model="formQuery.disposeDepartment"
              placeholder="请选择"
              @change="getSpaceList()"
            >
              <el-option
                v-for="item in disposeDepartmentList"
                :key="item.depId"
                :label="item.name"
                :value="item.depId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核：">
            <el-select v-model="formQuery.status" placeholder="请选择" @change="getSpaceList()">
              <el-option
                v-for="item in regionModeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- <ul style="display: inline-flex;float:right;" class="taggul">
          <li>
            <span class="colortagg" style="background-color: #659AFF;"></span>
            <span style="display: inline-block;height: 20px;min-width">传染病</span>
          </li>
          <li>
            <span class="colortagg" style="background-color: #EF89CB;"></span>
            <span style="display: inline-block;height: 20px;min-width">食源性</span>
          </li>
          <li>
            <span class="colortagg" style="background-color: #7BCC59;"></span>
            <span style="display: inline-block;height: 20px;min-width">其他</span>
          </li>
        </ul> -->
        <div id="mapdiv" :style="style" v-loading="loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
var config = require("@/components/utils/Common_Config.js");
import axios from "axios";
import echarts from "echarts";
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
  data() {
    return {
      loading: true,
      style: {
        width: "100%",
        height: "100%",
        borderRadius: '8px',
        padding: '0 10px'
      },
      dataStart: [],
      dateFormat: "yyyy-MM",
      dateType: "month",
      valueFormat: "yyyy-MM",
      isWeek: false,
      formQuery: {
        status: "0",
        // happenYear: '2018',
        disposeDepartment: "0",
        // happenType: '9',
        regionMode: "9"
      },
      map:{},
      tableData: [],
      mapDataFood: [],
      mapDataDisea: [],
      mapDataOther: [],
      ak: "XwzaMa59viQw05VeoylDFNwVUYxks2se",
      dataTypeList: [
        {
          id: "1",
          value: "年统计"
        },
        {
          id: "2",
          value: "月统计"
        },
        {
          id: "3",
          value: "周统计"
        },
        {
          id: "4",
          value: "其它"
        }
      ],

      happenTypeList: [
        //事发类型
        {
          id: "9",
          name: "全部"
        },
        {
          id: "0",
          name: "传染病"
        },
        {
          id: "1",
          name: "食源性"
        },
        {
          id: "2",
          name: "其它"
        }
      ],
      disposeDepartmentList: [], //处置单位
      regionModeList: [
        //审核状态
        {
          id: "0",
          name: "全部"
        },
        {
          id: "4",
          name: "调查中"
        },
        {
          id: "6",
          name: "已结案"
        },
        {
          id: "5",
          name: "审核中"
        }
      ]
    };
  },
  methods: {
    getSpaceList() {
      this.mapDataOther = [];
      this.formQuery.startTime = this.dataStart[0];
      this.formQuery.endTime = this.dataStart[1];
      var happenType = "";
      if (this.formQuery.regionMode == 9) {
        happenType = "";
      } else {
        happenType = this.formQuery.regionMode;
      }
      axios
        .get(config.apiHost + "/analyze/epidemicMap", {
          params: {
            startTime: this.formQuery.startTime,
            endTime: this.formQuery.endTime,
            status: this.formQuery.status,
            genre: happenType,
            disposeDepartment: this.formQuery.disposeDepartment
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData = result.data.body;
            this.tableData.forEach(item => {
              let longitude = Number(item.longitude);
              let latitude = Number(item.latitude);
              let address = item.address;
              let genre = item.genre;
              this.mapDataOther.push([longitude, latitude, address, genre]);
            });

            //    this.getMap(this.mapDataDisea);
            //    this.getMap(this.mapDataFood,1);
            this.getMap();
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    getMap() {
      var self = this;
      var mapObj = new AMap.Map("mapdiv", {
        zoom: 10 //级别
        // center: [116.331398, 39.897445] //中心点坐标
      });
      self.loading = false
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
        AMap.event.addListener(geolocation, "complete", data=>{console.log('')}); //返回定位信息
        AMap.event.addListener(geolocation, "error", error=>{self.$message.error(error.message)}); //返回定位出错信息
        self.mapaddMarker(mapObj);
      });
    },
     mapaddMarker(mapObj) {
      var data_info = this.mapDataOther;
      var infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        offset: new AMap.Pixel(0, -35)
      });
      for (var i = 0, marker; i < data_info.length; i++) {
        var dispic;
        if (data_info[i][3] == 0) dispic = dispic1;
        else if (data_info[i][3] == 1) dispic = dispic2;
        else if (data_info[i][3] == 2) dispic = dispic3;
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
                      <span style="font-size: 12px;color: #666666;"
                        >${data[2]}</span
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
    }
  },
  mounted() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var day = myDate.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    var startTime = year - 1 + "" + month + "" + day + "";
    var endTime = year + "" + month + "" + day + "";
    this.dataStart.splice(0, 2);
    this.dataStart.push(startTime);
    this.dataStart.push(endTime);
    this.formQuery.startTime = startTime;
    this.formQuery.endTime = endTime;
    this.getSpaceList();
  },
  created() {
    var that = this;
    axios({
      //事发场所
      method: "get",
      url: config.apiHost + "/event-places"
    }).then(function(res) {
      if (res.data.status == 200) {
        that.happenPlaceList = res.data.body;
      }
    });
    axios({
      //处置单位
      method: "get",
      url: config.apiHost + "/sys/dept/list"
    }).then(function(res) {
      that.disposeDepartmentList = res.data;
      that.disposeDepartmentList.unshift({
        depId: "0",
        name: "全部"
      });
      // console.log(that.disposeDepartmentList)
      // if(res.data.status!=200){
      //     // that.$message.error(res.data.body.message);
      // }else{

      // }
    });
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
  background-color: #eee;
  /* padding-bottom: 30px; */
}
.containerhead {
  text-align: left;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  background-color: #f0f3f8;
  padding-left: 10px;
  margin-bottom: 10px;
}
.main {
  background-color: #fff;
  height: 700px;
}
.region-header {
  background-color: #fff;
  text-align: left;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}
.taggul{
  margin-top: 10px;
}
.taggul li {
  margin-right: 10px;
}
.colortagg {
  display: block;
  height: 18px;
  width: 30px;
  margin-right: 5px;
  border-radius: 5px;
  float: left;
}
.demo-form-inline{
  background: #fff;
  padding-left: 10px;
}
.rolemgr-container{
  background: #fff;
}
/* #formQuery .el-range-separator{
    min-width: 28px;
} */
</style>