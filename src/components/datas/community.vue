<template>
  <div>
    <div class="top_box">社区列表</div>
    <div class="top_box">
      <el-button type="primary" size="small" @click="add">+添加信息</el-button>
      <el-button type="primary" size="small" @click="leadin">批量导入</el-button>
      <el-button type="primary" size="small" @click="remove">-删除信息</el-button>
    </div>

    <!-- 表格 -->
    <template>
      <el-table ref="multipleTable" :data="rows" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column label="所属区县乡镇(街道)" prop='areaName' align="center">
        </el-table-column>
        <el-table-column label="社区名称" prop="name" align="center">
        </el-table-column>
        <el-table-column label="占地面积" prop="areaCovered" align="center">
        </el-table-column>
        <el-table-column label="联系电话" prop="phone" align="center">
        </el-table-column>
        <el-table-column label="联系地址" prop="address" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" round @click="handleClick(scope.row)" type="text">查看</el-button>
            <el-button size="mini" round @click="editor(scope.row)" type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="formQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 查看的dialog -->
    <el-dialog title="查看信息" :visible.sync="dialogOne" width="65%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" label-position="right" label-width="225px" :model="editForm">
        <el-form-item label="社区名称">
          <el-input v-model="editForm.name" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="占地面积">
          <el-input v-model="editForm.areaCovered" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="房屋使用面积">
          <el-input v-model="editForm.areaUse" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="社区负责人">
          <el-input v-model="editForm.director" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editForm.phone" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="社区街道总人数">
          <el-input v-model="editForm.communityNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="常住人口数">
          <el-input v-model="editForm.residentNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="户籍人口数">
          <el-input v-model="editForm.censusRegisterNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="外来人口数">
          <el-input v-model="editForm.externalPopulation" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="外出人口数">
          <el-input v-model="editForm.outgoingPopulation" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="出生人口数">
          <el-input v-model="editForm.birthPopulation" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="死亡人口数">
          <el-input v-model="editForm.deathPopulation" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="家庭户人数">
          <el-input v-model="editForm.householdNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="集体户人数">
          <el-input v-model="editForm.collectiveNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="editForm.address" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="是否有集体宿舍集中区域">
          <el-input v-model="editForm.flagValue" readonly="readonly"></el-input>
          
        </el-form-item>
        <el-form-item label="农林牧渔从业人员占从业人员比例">
          <el-input v-model="editForm.personnelRatio" style="width:600px" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="主要饮用水来源">
          <el-input v-model="editForm.waterSourceName" style="width:600px" readonly="readonly"></el-input>
          
        </el-form-item>
        <el-form-item label="市政排水(生活污水)">
          <el-input v-model="editForm.drainageSystemName" style="width:600px" readonly="readonly"></el-input>
         
        </el-form-item>
        <el-form-item label="生活垃圾处理系统">
          <el-input v-model="editForm.garbageSystemName" style="width:600px;margin-bottom:8px;" readonly="readonly"></el-input>
          
        </el-form-item>
        <el-form-item label="社区环境及建筑描述" style="position:  relative;">
          
          <vue-html5-editor  class="editor" style="margin-top: -30px;width:600px;margin-bottom:8px;" :content="editForm.environmentDetails" :height="200" ></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
        <el-form-item label="社区街道其他信息描述" style="position:  relative;">
         
          <vue-html5-editor  class="editor" style="margin-top: -30px;width:600px" :content="editForm.otherDetails" :height="200" ></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        
        <el-button type="primary" @click="dialogOne = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的接口 -->
    <el-dialog title="编辑信息" :visible.sync="dialogTwo" width="65%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin:0 auto;" label-position="right" label-width="225px" :model="editForm">
        <el-form-item label="社区名称" required>
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="占地面积" required>
          <el-input v-model="editForm.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="房屋使用面积">
          <el-input v-model="editForm.areaUse"></el-input>
        </el-form-item>
        <el-form-item label="社区负责人">
          <el-input v-model="editForm.director"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="社区街道总人数">
          <el-input v-model="editForm.communityNum"></el-input>
        </el-form-item>
        <el-form-item label="常住人口数">
          <el-input v-model="editForm.residentNum"></el-input>
        </el-form-item>
        <el-form-item label="户籍人口数">
          <el-input v-model="editForm.censusRegisterNum"></el-input>
        </el-form-item>
        <el-form-item label="外来人口数">
          <el-input v-model="editForm.externalPopulation"></el-input>
        </el-form-item>
        <el-form-item label="外出人口数">
          <el-input v-model="editForm.outgoingPopulation"></el-input>
        </el-form-item>
        <el-form-item label="出生人口数">
          <el-input v-model="editForm.birthPopulation"></el-input>
        </el-form-item>
        <el-form-item label="死亡人口数">
          <el-input v-model="editForm.deathPopulation"></el-input>
        </el-form-item>
        <el-form-item label="家庭户人数">
          <el-input v-model="editForm.householdNum"></el-input>
        </el-form-item>
        <el-form-item label="集体户人数">
          <el-input v-model="editForm.collectiveNum"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" required>
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="是否有集体宿舍集中区域">
          <el-select v-model="editForm.collectiveFlag" style="width:202px;">
            <el-option value="1" label="是">是</el-option>
            <el-option value="0" label="否">否</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="农林牧渔从业人员占从业人员比例">
          <el-input v-model="editForm.personnelRatio" style="width:600px"></el-input>
        </el-form-item>
        <el-form-item label="主要饮用水来源">
          <el-select v-model="editForm.waterSource" style="width:600px">
            <el-option v-for="item in typeList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市政排水(生活污水)">
          <el-select v-model="editForm.drainageSystem" style="width:600px">
            <el-option v-for="item in typeListII" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生活垃圾处理系统">
          <el-select v-model="editForm.garbageSystem" style="width:600px">
            <el-option v-for="item in typeListIII" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社区环境及建筑描述">
          
          <vue-html5-editor  class="editor" :content="editForm.environmentDetails" :height="200"  id="myeditor" style="width:600px;" @change="editenvironmentDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="社区街道其他信息描述">
          
          <vue-html5-editor  class="editor" :content="editForm.otherDetails" :height="200"  id="myeditor" style="width:600px;" @change="editotherDetails"></vue-html5-editor>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTwo = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加的dialog -->
    <el-dialog title="添加信息" :visible.sync="dialogThree" width="65%">
      <el-form :inline="true" class="demo-form-inline" label-width="225px" style="text-align:left;margin: 0 auto;" :model="form">
        <el-form-item label="社区名称" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="占地面积" required>
          <el-input v-model="form.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="房屋使用面积">
          <el-input v-model="form.areaUse"></el-input>
        </el-form-item>
        <el-form-item label="社区负责人">
          <el-input v-model="form.director"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="社区街道总人数">
          <el-input v-model="form.communityNum"></el-input>
        </el-form-item>
        <el-form-item label="常住人口数">
          <el-input v-model="form.residentNum"></el-input>
        </el-form-item>
        <el-form-item label="户籍人口数">
          <el-input v-model="form.censusRegisterNum"></el-input>
        </el-form-item>
        <el-form-item label="外来人口数">
          <el-input v-model="form.externalPopulation"></el-input>
        </el-form-item>
        <el-form-item label="外出人口数">
          <el-input v-model="form.outgoingPopulation"></el-input>
        </el-form-item>
        <el-form-item label="出生人口数">
          <el-input v-model="form.birthPopulation"></el-input>
        </el-form-item>
        <el-form-item label="死亡人口数">
          <el-input v-model="form.deathPopulation"></el-input>
        </el-form-item>
        <el-form-item label="家庭户人数">
          <el-input v-model="form.householdNum"></el-input>
        </el-form-item>
        <el-form-item label="集体户人数">
          <el-input v-model="form.collectiveNum"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" required>
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="是否有集体宿舍集中区域">
          <el-select v-model="form.collectiveFlag" style="width:202px;">
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="农林牧渔从业人员占从业人员比例">
          <el-input v-model="form.personnelRatio" style="width:600px"></el-input>
        </el-form-item>
        <el-form-item label="主要饮用水来源">
          <el-select v-model="form.waterSource" style="width:600px">
            <el-option v-for="item in typeList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市政排水(生活污水)">
          <el-select v-model="form.drainageSystem" style="width:600px">
            <el-option v-for="item in typeListII" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生活垃圾处理系统">
          <el-select v-model="form.garbageSystem" style="width:600px">
            <el-option v-for="item in typeListIII" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社区环境及建筑描述">
          
          <vue-html5-editor  class="editor" :content="form.environmentDetails" :height="200"  id="myeditor" style="width:600px;" @change="addenvironmentDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="社区街道其他信息描述">
          
          <vue-html5-editor  class="editor" :content="form.otherDetails" :height="200"  id="myeditor" style="width:600px;" @change="addotherDetails"></vue-html5-editor>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogThree = false">取 消</el-button>
        <el-button type="primary" @click="confirmII">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import vue from "vue";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      rows: [],
      currentPage: 1,
      formQuery: {
        eventName: "",
        pageSize: 10,
        pageNum: 1
      },
      val: [],
      multipleSelection: [],
      total: 0,
      dialogOne: false,
      dialogTwo: false,
      dialogThree: false,
      labelPosition: "left",
      form: {
        name: "",
        address: "",
        type: 3,
        areaId: "",
        phone: "",
        areaCovered: "",
        areaUse: "",
        director: "",
        communityNum: "",
        residentNum: "",
        censusRegisterNum: "",
        externalPopulation: "",
        outgoingPopulation: "",
        birthPopulation: "",
        deathPopulation: "",
        householdNum: "",
        collectiveNum: "",
        collectiveFlag: "",
        personnelRatio: "",
        waterSource: "",
        drainageSystem: "",
        garbageSystem: "",
        environmentDetails: "",
        otherDetails: ""
      },
      editForm: {
        name: "",
        address: "",
        type: 3,
        areaId: "",
        phone: "",
        areaCovered: "",
        areaUse: "",
        director: "",
        communityNum: "",
        residentNum: "",
        censusRegisterNum: "",
        externalPopulation: "",
        outgoingPopulation: "",
        birthPopulation: "",
        deathPopulation: "",
        householdNum: "",
        collectiveNum: "",
        collectiveFlag: "",
        personnelRatio: "",
        waterSource: "",
        drainageSystem: "",
        garbageSystem: "",
        environmentDetails: "",
        otherDetails: ""
      },

      typeList: []
    };
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "enterpriseList"
  },
  methods: {
    addenvironmentDetails(val) {
      this.form.environmentDetails = val;
    },
    addotherDetails(val) {
      this.form.otherDetails = val;
    },
    editenvironmentDetails(val) {
      this.editForm.environmentDetails = val;
    },
    editotherDetails(val) {
      this.editForm.otherDetails = val;
    },
    // 社区信息列表
    communityList() {
      axios
        .get(config.apiHost + "/placeMain/place/getAreaPlaceByCommunity", {
          params: {
            areaId: this.$route.params.areaId,
            type: 3,
            page: this.formQuery.pageNum,
            limit: this.formQuery.pageSize
          }
        })
        .then(result => {
          console.log(result);
          this.rows = result.data.body.list;
          this.total = result.data.body.totalCount;
        })
        .catch(function(response) {});
    },
    //   添加
    add() {
      
      Object.keys(this.form).forEach(key=>this.form[key]='');
      this.dialogThree = true;
    },
    confirmII() {
      if(this.form.name==""||this.form.areaCovered==""||this.form.phone==""||this.form.address==""){
        this.$message.info("请检查必填项不能为空");
        return;
      }
      var that = this;
      this.$confirm("确定要添加数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            this.dialogThree = false;
            this.form.type = this.$route.params.type;
            this.form.areaId = this.$route.params.areaId;
            axios({
              method: "post",
              url: config.apiHost + "/placeMain/place/insertAreaCommunity",
              data: this.form
            })
              .then(result => {
                if (result.data.status == 200) {
                  that.communityList();
                  this.$message.success("添加成功");
                } else {
                  this.$message.error(result.data.body.message);
                }
              })
              .catch(function(response) {});
          }
        },
        type: "warning"
      });
    },
    //   导入
    leadin() {
      this.$router.push({path:'/home/data-epmgr/eventImport',query:{type:3}})
    },
    //   删除
    remove() {
      if (this.val == "") {
        this.$message({
          showClose: true,
          message: "请勾选数据"
        });
        return;
      } else {
        this.$confirm("确定要删除该事件吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          callback: (acction, instance) => {
            if (acction === "confirm") {
              axios({
                method: "post",
                url: config.apiHost + "/placeMain/place/deleteAreaCommunity",
                data: this.val
              })
                .then(result => {
                  if (result.data.status == 200) {
                    this.communityList();
                  }
                })
                .catch(function(response) {});
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
      }
    },
    //   查看
    handleClick(row) {
      this.dialogOne = true;

      axios
        .get(config.apiHost + "/placeMain/place/getAreaCommunityByOne", {
          params: {
            //请求参数
            params: row.mainId
          }
        })
        .then(result => {
          this.editForm = result.data.body;
        })
        .catch(function(response) {});
    },
    dropdownI() {
      this.typeList = [];
      axios
        .get(config.apiHost + "/placeMain/place/getAreaPlaceProperty", {
          params: {
            params: 3
          }
        })
        .then(result => {
          this.typeList = result.data.body;
          let Data = result.data.body;
          console.log(Data);
          // Data.forEach(item => {
          //   this.formI.type = item.type;
          // });
        })
        .catch(function(response) {});
    },
    dropdownII() {
      this.typeListII = [];
      axios
        .get(config.apiHost + "/placeMain/place/getAreaPlaceProperty", {
          params: {
            params: 4
          }
        })
        .then(result => {
          this.typeListII = result.data.body;
          let Data = result.data.body;
          // console.log(Data);
          // Data.forEach(item => {
          //   this.formI.type = item.type;
          // });
        })
        .catch(function(response) {});
    },
    dropdownIII() {
      this.typeListIII = [];
      axios
        .get(config.apiHost + "/placeMain/place/getAreaPlaceProperty", {
          params: {
            params: 5
          }
        })
        .then(result => {
          this.typeListIII = result.data.body;
          let Data = result.data.body;
          // console.log(Data);
          // Data.forEach(item => {
          //   this.formI.type = item.type;
          // });
        })
        .catch(function(response) {});
    },
    //   编辑
    editor(row) {
      this.dialogTwo = true;

      axios
        .get(config.apiHost + "/placeMain/place/getAreaCommunityByOne", {
          params: {
            //请求参数
            params: row.mainId
          }
        })
        .then(result => {
          this.editForm = result.data.body;
          this.editForm.collectiveFlag = this.editForm.collectiveFlag.toString();
          console.log(this.editForm.waterSource)
          if(this.editForm.flagValue=="0"||this.editForm.flagValue==0){
            this.editForm.flagValue="";
          }
          if(this.editForm.waterSource=="0"||this.editForm.waterSource==0){
            this.editForm.waterSource="";
          }
          if(this.editForm.drainageSystem=="0"||this.editForm.drainageSystem==0){
            this.editForm.drainageSystem="";
          }
          if(this.editForm.garbageSystem=="0"||this.editForm.garbageSystem==0){
            this.editForm.garbageSystem="";
          }

        })
        .catch(function(response) {});
    },
    confirm() {
      if(this.editForm.name==""||this.editForm.phone==""||this.editForm.address==""||this.editForm.areaCovered==""){
        this.$message.info("请检查必填项不能为空");
        return;
      }
      var that = this;
      this.$confirm("确定要修改数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            this.dialogTwo = false;
            this.editForm.type = this.$route.params.type;
            axios({
              method: "post",
              // /api
              url: config.apiHost + "/placeMain/place/updateAreaCommunity",
              data: this.editForm
            })
              .then(result => {
                if (result.data.status == 200) {
                  that.communityList();
                  console.log("123");

                  this.$message.success("修改成功");
                } else {
                  this.$message.error(result.data.body.message);
                }
              })
              .catch(function(response) {
                //   this.$message.error(error);
              });
          }
        },
        type: "warning"
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.val = [];
      val.forEach(item => {
        this.val.push(item.mainId);
      });
      console.log(this.val);
    },
    //  分页
    handleSizeChange(val) {
      //分页大小变化
      this.formQuery.pageSize = val;
      this.communityList();
    },
    handleCurrentChange(val) {
      //分页的当前页变化
      this.formQuery.pageNum = val;
      this.communityList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
  created() {
    this.communityList();
    this.dropdownII();
    this.dropdownI();
    this.dropdownIII();
  },
  mounted() {}
};
</script>
   
<style scoped>
.top_box {
  width: 100%;
  height: 50px;
  background-color: #f0f3fa;
  display: flex;
  align-items: center;
  padding: 10px;
  /* justify-content: center; */
}
.top_box span {
  display: inline-block;
  padding: 0 20px;
}
</style>
