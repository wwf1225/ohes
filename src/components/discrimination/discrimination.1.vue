<template>
  <div class="rolebox">
    <!-- <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item>应急小工具</el-breadcrumb-item>
                <el-breadcrumb-item>辅助判别</el-breadcrumb-item>
            </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <div class="left">
        <div class="title">潜伏期：</div>
        <ul class="incubation">
          <li>
            <span>最小潜伏期</span>
            <el-input class="inp" v-model="minPeriod" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
            <el-select v-model="minPeriodUnit ">
              <el-option label="分钟" value="1">分钟</el-option>
              <el-option label="小时" value="2">小时</el-option>
              <el-option label="天" value="3">天</el-option>
            </el-select>
          </li>
          <li>
            <span>平均潜伏期</span>
            <el-input class="inp" v-model="avgPeriod"></el-input>
            <el-select v-model="avgPeriodUnit">
              <el-option label="分钟" value="1">分钟</el-option>
              <el-option label="小时" value="2">小时</el-option>
              <el-option label="天" value="3">天</el-option>
            </el-select>
          </li>
        </ul>
        <div class="title">症状：</div>
        <el-tabs
          tab-position="top"
          @tab-click="symptClick"
          type="border-card"
          style="height:250px;"
        >
          <el-tab-pane
            v-for="item in symptomTypeList"
            :key="item.id"
            :label="item.catName"
            :value="item.id"
          >
            <el-checkbox-group v-model="symptCheckList">
              <el-checkbox
                v-for="ele in symptomList"
                :label="ele.symName"
                :key="ele.id"
                :value="ele.id"
              >{{ele.symName}}</el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
        <div class="title">摄入食物:</div>
        <el-tabs tab-position="top" @tab-click="foodClick" type="border-card" style="height:250px;">
          <el-tab-pane
            v-for="item in foodTypeList"
            :key="item.id"
            :label="item.catName"
            :value="item.id"
          >
            <el-checkbox-group v-model="foodCheckList">
              <el-checkbox
                v-for="ele in foodList"
                :label="ele.foodName"
                :key="ele.id"
              >{{ele.foodName}}</el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
        <div class="btndiv">
          <el-button @click="analysis" type="primary">开始判别</el-button>
        </div>
      </div>
      <div class="right">
        <h1 class="discriResult">判别结果</h1>
        <span style="font-weight:bold;">疑似致病因子:</span>
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item v-for="(item,index) in resultList" :key="index" :name="index">
            <template slot="title">
              <span id="coltitle">&nbsp;&nbsp;因子{{index+1}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.disName}}</span>
            </template>
            <div class="resultp">临床特点：{{item.symptom}}</div>
            <div class="resultp">诊断标准：{{item.disName}}</div>
            <div class="resultp">常见中毒食物：{{item.food}}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      config: config,
      avgPeriod: "", //平均潜伏期
      minPeriod: "", //最小潜伏期
      minPeriodUnit: "1", //最小潜伏期类型
      avgPeriodUnit: "1", //平均潜伏期类型
      symptomTypeList: [], //症状列表
      foodTypeList: [], //食物列表
      symptomList: [], //症状列表
      foodList: [], //食物列表
      symptCheckList: [],
      foodCheckList: [],
      activeNames: [0],
      resultList: [], //判别结果
      yinzi: "因子",
      placedStr: "      "
    };
  },
  methods: {
    getCategoryList(type) {
      var that = this;
      axios({
        method: "get",
        url: config.datumUrl + "/ass/listCategory",
        params: {
          type: type
        }
      }).then(result => {
        if (result.data.status == 200) {
          if (type == 1) {
            //食物
            that.foodTypeList = result.data.body;
            this.getFirstFood(result.data.body[0].id);
          } else {
            //症状
            that.symptomTypeList = result.data.body;
            this.getFirstSym(result.data.body[0].id);
          }
        }
      });
    },
    getFirstFood(id) {
      axios({
        method: "get",
        url: config.datumUrl + "/ass/listFood",
        params: {
          cateId: id
        }
      }).then(result => {
        if (result.data.status == 200) {
          console.log(result.data.body);
          this.foodList = result.data.body;
        }
      });
    },
    getFirstSym(id) {
      axios({
        method: "get",
        url: config.datumUrl + "/ass/listSymptom",
        params: {
          cateId: id
        }
      }).then(result => {
        if (result.data.status == 200) {
          console.log(result.data.body);
          this.symptomList = result.data.body;
        }
      });
    },
    symptClick(tab, event) {
      // console.log(tab.$el.innerHTML);
      let cateId = tab.$attrs.value;
      var that = this;
      axios({
        method: "get",
        url: config.datumUrl + "/ass/listSymptom",
        params: {
          cateId: cateId
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.symptomList = result.data.body;
        }
      });
    },
    foodClick(tab, event) {
      // console.log(tab);

      let cateId = tab.$attrs.value;
      var that = this;
      axios({
        method: "get",
        url: config.datumUrl + "/ass/listFood",
        params: {
          cateId: cateId
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.foodList = result.data.body;
        }
      });
    },
    analysis() {
      if (this.avgPeriod == "") {
        this.$message.info("平均潜伏期不能为空！");
      } else if (this.minPeriod == "") {
        this.$message.info("最小潜伏期不能为空！");
      } else if (this.foodCheckList.length <= 0) {
        this.$message.info("请至少选择一种摄入食物！");
      } else if (this.symptCheckList.length <= 0) {
        this.$message.info("请至少选择一种症状！");
      } else {
        var minPeriod = "";
        var avgPeriod = "";
        if (this.minPeriodUnit == 1) {
          //分钟
          minPeriod = this.minPeriod;
        } else if (this.minPeriodUnit == 2) {
          //小时
          minPeriod = this.minPeriod * 60;
        } else {
          //天
          minPeriod = this.minPeriod * 1440;
        }
        if (this.avgPeriodUnit == 1) {
          //分钟
          avgPeriod = this.avgPeriod;
        } else if (this.avgPeriodUnit == 2) {
          //小时
          avgPeriod = this.avgPeriod * 60;
        } else {
          //天
          avgPeriod = this.avgPeriod * 1440;
        }

        axios({
          method: "post",
          url: config.datumUrl + "/ass/analysis",
          data: {
            minPeriod: minPeriod,
            avgPeriod: avgPeriod,
            symptoms: this.symptCheckList,
            foods: this.foodCheckList
          }
        }).then(result => {
          if (result.data.status == 200) {
            console.log(result.data.body);
            this.resultList = result.data.body;
          }
        });
      }
    }
  },
  created() {
    this.getCategoryList(0); //症状
    this.getCategoryList(1); //食物
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
  padding-left: 10px;
  display: flex;
}
.left {
  float: left;
  flex: 1;
  text-align: left;
}
.el-checkbox {
  margin-left: 0px;
  /* margin-right: 20px; */
  width: 25%;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.incubation li {
  height: 50px;
}
.title {
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  text-align: left;
  margin-top: 10px;
}

.btndiv {
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.inp {
  width: 150px;
}
.right {
  float: left;
  flex: 1;
  text-align: left;
  border: 1px solid #ccc;
  padding-left: 5px;
  margin-left: 10px;
}
#coltitle {
  height: 100%;
  width: 100%;
  display: block;
  background-color: #409eff;
  font-weight: bold;
}
.discriResult {
  font-size: 20px;
  font-weight: normal;
  height: 35px;
  line-height: 35px;
  text-align: center;
}
.resultp {
  padding-left: 10px;
  height: 30px;
}
/* #eltabs .is-left{
        min-width:95px;
        border-bottom: 1px solid #E4E7ED;
    } */
.el-tabs__nav {
  width: 95px;
}
</style>