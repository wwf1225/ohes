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
          style="text-align:left;padding-top: 20px;"
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
        height: "630px",
        marginTop: '35px',
        borderRadius: '8px'
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
    // dateTypeChange() {
    //   if (this.formQuery.regionMode == 1) {
    //     //年

    //     this.dataStart = ''
    //     this.dataEnd = ''
    //     this.dateFormat = 'yyyy'
    //     this.dateType = 'year'

    //   } else if (this.formQuery.regionMode == 2) {
    //     //月

    //     this.dataStart = ''
    //     this.dataEnd = ''
    //     this.dateFormat = 'yyyy-MM'
    //     this.dateType = 'month'

    //   } else if (this.formQuery.regionMode == 3) {
    //     //周

    //     this.dataStart = ''
    //     this.dataEnd = ''
    //     this.dateFormat = 'yyyy第WW周'
    //     this.dateType = 'week'

    //   } else {
    //     //日
    //     this.dataStart = ''
    //     this.dataEnd = ''
    //     this.dateFormat = 'yyyy-MM-dd'
    //     this.dateType = 'date'

    //   }
    // },

    // startDateChange(val) {
    //   console.log(val)
    // },
    // endDateChange(val) {
    //   console.log(val)
    // },
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
            this.getMap(this.mapDataOther);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    getMap(mapData) {
      // var diseaIcon = new BMap.Icon(
      //   '/src/assets/blue.png',
      //   new BMap.Size(32, 32)
      // )
      // var foodIcon = new BMap.Icon(
      //   '/src/assets/pink.png',
      //   new BMap.Size(32, 32)
      // )
      // var otherIcon = new BMap.Icon(
      //   '/src/assets/green.png',
      //   new BMap.Size(32, 32)
      // )
      var diseaIcon = new BMap.Icon(
        require("@/assets/blue.png"),
        new BMap.Size(32, 32)
      );
      var foodIcon = new BMap.Icon(
        require("@/assets/pink.png"),
        new BMap.Size(32, 32)
      );
      var otherIcon = new BMap.Icon(
        require("@/assets/green.png"),
        new BMap.Size(32, 32)
      );
      // var otherIcon=new BMap.Icon("/static/img/green.png", new BMap.Size(32, 32));

      // 百度地图API功能
      var map = new BMap.Map("mapdiv");
      map.centerAndZoom("上海", 11);
      map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
      this.map = map;
      var data_info = mapData;

      for (var i = 0; i < data_info.length; i++) {
        var dispic;
        if (data_info[i][3] == 0) dispic = dispic1;
        else if (data_info[i][3] == 1) dispic = dispic2;
        else if (data_info[i][3] == 2) dispic = dispic3;
        var level, place, cat, status;
        switch (this.tableData[i].grade) {
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
        switch (this.tableData[i].placeId) {
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
        switch (this.tableData[i].status) {
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
        var myIcon = new BMap.Icon(dispic, new BMap.Size(23, 25), {
          // 指定定位位置。
          // 当标注显示在地图上时，其所指向的地理位置距离图标左上
          // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
          // 图标中央下端的尖角位置。
          anchor: new BMap.Size(10, 25)
        });
        var marker = new BMap.Marker(
          new BMap.Point(data_info[i][0], data_info[i][1]),
          { icon: myIcon }
        ); 
        // 创建标注
        var html = `<div style="width: 250px">
            <div><b style="color:#006636;font-size: 16px;">事件信息</b></div>
            <div style="height:150px">
              <table>
                <tr>
                  <td>
                    <img style="padding-right:5px" src="${eventmap}" />
                    <span style="font-size: 12px;color: #666666;">${
                      this.tableData[i].name
                    }</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img style="padding-right:5px" src="${level}" />
                    <img style="padding-right:5px" src="${place}" />
                    <img style="padding-right:5px" src="${cat}" />
                    <img style="padding-right:5px" src="${status}" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size: 14px;color: #333333;">调查人员：</span>
                    <span style="font-size: 12px;color: #666666;">${
                      this.tableData[i].reportUser
                    }</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size: 14px;color: #333333;">接报时间：</span>
                    <span style="font-size: 12px;color: #666666;">${
                      this.tableData[i].startTime
                    }</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>`;
        this.map.addOverlay(marker); // 将标注添加到地图中
        // this.markers.push(marker);
        this.addClickHandler(html, marker);
      }
      that.loading = false
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

