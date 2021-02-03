<template>
  <div class="discrimination">
    <div class="top">
      <div class="title">
        <p>潜伏期</p>
      </div>
      <div class="content">
        <div>最小潜伏期
          <el-input v-model="minPeriod"></el-input>
          <el-select v-model="minPeriodUnit">
            <el-option label="分钟" :value="1">分钟</el-option>
            <el-option label="小时" :value="2">小时</el-option>
            <el-option label="天" :value="3">天</el-option>
          </el-select>
        </div>
        <div>平均潜伏期
          <el-input v-model="avgPeriod"></el-input>
          <el-select v-model="avgPeriodUnit">
            <el-option label="分钟" :value="1">分钟</el-option>
            <el-option label="小时" :value="2">小时</el-option>
            <el-option label="天" :value="3">天</el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="title">
          <p>摄入食物</p>
        </div>
        <div class="inner-top">
          <el-tabs v-model="leftActiveName" @tab-click="leftHandleClick">
            <el-tab-pane
              v-for="(item,index) in foodTypeList"
              :key="item.id"
              :label="item.catName"
              :name="index+''"
              :active-id="item.id"
            >
              <el-checkbox-group v-model="checkedFoodID" @change="handleFoodCheckedChange">
                <el-checkbox
                  v-for="food in foodList"
                  :label="food.id"
                  :key="food.id"
                >{{food.foodName}}</el-checkbox>
              </el-checkbox-group>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="inner-bottom">
          <div class="inner-content">
            <div class="data-view">
              <el-checkbox-group v-model="checkedFoodID" @change="handleFoodCheckedChange">
                <el-checkbox
                  v-for="food in foodList"
                  :label="food.id"
                  :key="food.id"
                  v-if="checkedFoodID.indexOf(food.id)!= -1"
                >{{food.foodName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="title">
            <p>已选</p>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <p>症状</p>
        </div>
        <div class="inner-top">
          <el-tabs v-model="rightActiveName" @tab-click="rightHandleClick">
            <el-tab-pane
              v-for="(item,index) in symptomTypeList"
              :key="item.id"
              :label="item.catName"
              :name="index+''"
              :active-id="item.id"
            >
              <el-checkbox-group v-model="checkedSymptomID" @change="handleSymptomCheckedChange">
                <el-checkbox
                  v-for="sym in symptomList"
                  :label="sym.id"
                  :key="sym.id"
                >{{sym.symName}}</el-checkbox>
              </el-checkbox-group>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="inner-bottom">
          <div class="inner-content">
            <div class="data-view">
              <el-checkbox-group v-model="checkedSymptomID" @change="handleSymptomCheckedChange">
                <el-checkbox
                  v-for="sym in symptomList"
                  :label="sym.id"
                  :key="sym.id"
                  v-if="checkedSymptomID.indexOf(sym.id)!= -1"
                >{{sym.symName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="title">
            <p>已选</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button class="begin" @click="getResult">开始判别</el-button>
    </div>

    <el-dialog width="28%" id="dialog" :visible.sync="dialogShowVisible" :show-close="false">
      <div class="divbox">
        <div class="header">
          <strong>判别结果</strong>
          <button
            type="button"
            aria-label="Close"
            class="el-dialog__headerbtn close-btn"
            @click="dialogShowVisible=false"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <ul>
          <li>
            <div class="li-title" @click="setActive">
              <strong :class="{active:activeResultItem==0}">1</strong>
              <p :class="{active:activeResultItem==0}">变形杆菌</p>
              <i class="el-icon-arrow-right" :class="{active:activeResultItem==0}"></i>
            </div>
            <div class="li-content" :class="{active:activeResultItem==0}">
              <ul>
                <li>
                  <strong>诊断标准：</strong>
                  <p>变形杆菌变形杆菌变形杆菌变形杆菌变形杆菌变形杆菌变形杆菌变形杆菌变形杆菌变形杆菌变形杆菌变形杆菌</p>
                </li>
                <li>
                  <strong>临床特点：</strong>
                  <p>变形杆菌变形杆菌变形杆菌变形杆菌</p>
                </li>
                <li>
                  <strong>常见中毒食物：</strong>
                  <p>变形杆菌变形杆菌变形杆菌变形杆菌</p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
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
      minPeriodUnit: 1, //最小潜伏期类型
      avgPeriodUnit: 1, //平均潜伏期类型
      leftActiveName: 0,
      rightActiveName: 0,

      foodTypeList: [], //食物类型列表
      foodList: [], //check食物列表
      checkedFoodID: [], //checked 食物列表ID
      symptomTypeList: [], //症状类型列表
      symptomList: [], //check症状列表
      checkedSymptomID: [], //checked 症状列表ID
      dialogShowVisible: false,
      activeResultItem: 1,
      resultList: [] //判别结果
    };
  },
  methods: {
    // 左tab
    leftHandleClick(tab, event) {
      this.getFood(tab.$attrs["active-id"]);
    },
    // 右tab
    rightHandleClick(tab, event) {
      this.getSym(tab.$attrs["active-id"]);
    },
    // tab header
    getCategoryList(type) {
      var that = this;
      axios({
        method: "get",
        url: config.datumUrl + "/ass/listCategory",
        params: {
          type: type
        }
      })
        .then(result => {
          if (result.data.status == 200) {
            if (type == 1) {
              //食物
              that.foodTypeList = result.data.body;
              that.getFood(result.data.body[0].id);
            } else {
              //症状
              that.symptomTypeList = result.data.body;
              that.getSym(result.data.body[0].id);
            }
          }
        })
        .catch(err => console.log(err));
    },
    getFood(id) {
      axios({
        method: "get",
        url: config.datumUrl + "/ass/listFood",
        params: {
          cateId: id
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.foodList = result.data.body;
        }
      });
    },
    getSym(id) {
      axios({
        method: "get",
        url: config.datumUrl + "/ass/listSymptom",
        params: {
          cateId: id
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.symptomList = result.data.body;
        }
      });
    },
    handleFoodCheckedChange(val) {
      this.checkedFoodID = val;
    },
    handleSymptomCheckedChange(val) {
      this.checkedSymptomID = val;
    },
    showResultDialog() {
      this.dialogShowVisible = true;
    },
    getResult() {
      if (this.minPeriod == "") {
        this.$message.error("最小潜伏期不能为空！");
        return;
      } else if (this.avgPeriod == "") {
        this.$message.error("平均潜伏期不能为空！");
        return;
      } else if (this.checkedFoodID.length <= 0) {
        this.$message.error("请至少选择一种摄入食物！");
        return;
      } else if (this.checkedSymptomID.length <= 0) {
        this.$message.error("请至少选择一种症状！");
        return;
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
      }
      axios({
        method: "post",
        url: config.datumUrl + "/ass/analysis",
        data: {
          minPeriod: minPeriod,
          avgPeriod: avgPeriod,
          symptoms: this.checkedSymptomID,
          foods: this.checkedFoodID
        }
      }).then(result => {
        if (result.data.status == 200) {
          console.log(result.data.body);
          this.resultList = result.data.body;
          this.showResultDialog();
        }
      });
    },
    setActive(){
      this.activeResultItem == 0?this.activeResultItem = 1:this.activeResultItem = 0
    }
  },
  created() {
    this.getCategoryList(0); //症状
    this.getCategoryList(1); //食物
  }
};
</script>

<style scoped>
.discrimination {
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  padding: 8px 0;
  box-sizing: border-box;
}
.top {
  height: 150px;
  width: 99%;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0px 2px 10px 0px rgba(16, 20, 26, 0.05);
}
.title {
  width: 100%;
  height: 50px;
  background: #e3f5e9;
  text-align: left;
  padding: 13px 0;
  box-sizing: border-box;
}
.title p {
  font-size: 16px;
  height: 24px;
  padding-left: 10px;
  position: relative;
  color: #429e73;
  margin-left: 13px;
}
.title p::before {
  content: "";
  height: 15px;
  width: 3px;
  background: #429e73;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.content {
  width: 100%;
  height: 100px;
  padding: 30px 10px;
  box-sizing: border-box;
}
.content > div {
  /* width: 400px; */
  height: 40px;
  float: left;
  margin-right: 50px;
  position: relative;
}
.content > div .el-input {
  width: 300px;
  margin-left: 20px;
}
.content > div .el-select {
  width: 120px;
  position: absolute;
  right: 2px;
  top: 3px;
  height: 34px;
}
.bottom {
  width: 99%;
  height: 100%;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 160px 0 110px;
  display: flex;
}
.left,
.right {
  flex: 1;
  margin-bottom: 8px;
  background-color: #fff;
  position: relative;
  box-shadow: 0px 2px 10px 0px rgba(16, 20, 26, 0.05);
}
.left {
  margin-right: 5px;
}
.left .title {
  background: #f9f5de;
}
.left .title p {
  color: #ebbb16;
}
.left .title p::before {
  background: #ebbb16;
}
.right {
  margin-left: 5px;
}
.right .title {
  background: #f7eadd;
}
.right .title p {
  color: #ff7f00;
}
.right .title p::before {
  background: #ff7f00;
}
.inner-top,
.inner-bottom {
  width: 100%;
  position: absolute;
  left: 0;
  overflow: hidden;
}
.inner-top {
  height: 60%;
  top: 0;
}
.inner-top .el-tabs {
  margin: 50px 13px 13px;
}
.inner-top
  .el-tabs
  .el-tabs__content
  .el-tab-pane
  .el-checkbox-group
  .el-checkbox,
.data-view .el-checkbox-group .el-checkbox {
  width: 25%;
  padding-left: 5%;
}
.inner-top
  .el-tabs
  .el-tabs__content
  .el-tab-pane
  .el-checkbox-group
  .el-checkbox
  + .el-checkbox,
.data-view .el-checkbox-group .el-checkbox + .el-checkbox {
  margin-left: 0;
}
.inner-bottom {
  height: 40%;
  bottom: 0;
}
.inner-bottom .title {
  background: #fff;
}
.inner-bottom .inner-content {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 50px 13px 13px;
  box-sizing: border-box;
  top: 0;
  left: 0;
}
.inner-bottom .inner-content .data-view {
  height: 100%;
  border: 1px solid #eee;
  text-align: left;
  overflow-y: auto;
}
/*滚动条整体样式*/
.inner-bottom .inner-content .data-view::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.inner-bottom .inner-content .data-view::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
.inner-bottom .inner-content .data-view::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}
.footer {
  height: 100px;
  width: 99%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
}
.footer .begin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #429e73;
  color: #fff;
  border: none;
  outline: none;
}
.footer .begin:hover {
  background: #006636;
}
/* dialog */
.divbox {
  /* width: 450px; */
  /* min-height: 625px; */
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
.close-btn {
  width: 50px;
  right: 0;
  top: 0;
}
.li-title {
  position: relative;
  height: 50px;
  text-align: left;
}
.li-title > strong,
.li-title > p,
.li-title > i {
  position: absolute;
  top: 0;
  font-weight: bold;
}
.li-title > strong,
.li-title > i {
  width: 50px;
  height: 50px;
  text-align: center;
  box-sizing: border-box;
  padding: 15px;
  left: 0;
  background: url(../../assets/quanquan.png) no-repeat center;
}
.li-title > strong.active {
  background: url(../../assets/quanquan_a.png) no-repeat center;
  color: #006636;
}
.li-title > p {
  width: 100%;
  padding-left: 50px;
  line-height: 50px;
  font-size: 16px;
}
.li-title > p.active {
  color: #006636;
}
.li-title > i {
  padding: 0;
  line-height: 50px;
  left: auto;
  right: 0;
  background: none;
  transition: transform 0.3s;
  cursor: pointer;
}
.li-title > i.active {
  transform: rotate(90deg);
  transform-origin: 50% 50%;
  color: #006636;
  transition: transform 0.3s;
}
.li-content {
  max-height: 0;
  padding: 0 15px;
  overflow: hidden;
  transition: max-height 0.3s;
}
.li-content.active {
  max-height: 200px;
  transition: max-height 0.3s;
}
.li-content ul {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 5px 0;
}
.li-content li {
  position: relative;
  text-align: left;
}
.li-content li strong {
  position: absolute;
  width: 120px;
  padding-left: 20px;
  text-align: justify;
  text-align-last: justify;
  left: 0;
  top: 0;
}
.li-content li p {
  padding-left: 130px;
}
</style>