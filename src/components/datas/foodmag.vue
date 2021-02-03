<template>
  <div>
    <div class="top_box">食品经营场所列表</div>
    <div class="top_box">
      <el-button type="primary" size="small" @click="add">+添加信息</el-button>
      <el-button type="primary" size="small" @click="leadin" >批量导入</el-button>
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
        <el-table-column label="经营单位名称" prop="name" align="center">
        </el-table-column>
        <el-table-column label="经营形式" prop="operationFromName" align="center">
        </el-table-column>
        <el-table-column label="营业面积" prop="areaCovered" align="center">
        </el-table-column>
        <el-table-column label="联系电话" prop="phone" align="center">
        </el-table-column>
        <el-table-column label="经营地址" prop="address" align="center">
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
    <el-dialog title="查看信息" :visible.sync="dialogOne" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" label-width="200px" :model="editForm" label-position="right">
        <el-form-item label="经营单位名称">
          <el-input v-model="editForm.name" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="经营场所面积">
          <el-input v-model="editForm.areaCovered" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="仓储库房面积">
          <el-input v-model="editForm.areaWarehouse" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="经营单位法人">
          <el-input v-model="editForm.director" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="经营形式">
          <el-input v-model="editForm.operationFromName" readonly="readonly"></el-input>

        </el-form-item>
        <el-form-item label="管理人员数量">
          <el-input v-model="editForm.manageNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="法人联系电话">
          <el-input v-model="editForm.phone" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证号">
          <el-input v-model="editForm.idcardNo" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="销售人员数量">
          <el-input v-model="editForm.salesNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="食品经营地址">
          <el-input v-model="editForm.address" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="营业执照号">
          <el-input v-model="editForm.saleLicense" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="营业执照有效期限">
          <el-input v-model="editForm.saleLicenseDate" readonly="readonly"></el-input>

        </el-form-item>
        <el-form-item label="食品流通许可证">
          <el-input v-model="editForm.foodLicence" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="食品流通许可证有效期限">
          <el-input v-model="editForm.foodLicenceDate" readonly="readonly"></el-input>

        </el-form-item>
        <el-form-item label="经营食品来源(可多选)">
          <el-checkbox-group v-model="checkListU" style="margin-bottom:8px;">
            <el-checkbox v-for="item in typeListII" :key="item.id" :label="item.id" disabled>{{item.datails}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="保障食品安全主要设施和设备" style="position:  relative;">
          
          <vue-html5-editor  class="editor" style="margin-top: -30px;width:600px;margin-bottom:8px;" :content="editForm.equipmentDetails" :height="200" ></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
        <el-form-item label="食品经营场所环境及建筑描述" style="position:  relative;">
          
          <vue-html5-editor  class="editor" style="margin-top: -30px;width:600px;margin-bottom:8px;" :content="editForm.environmentDetails" :height="200" ></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
        <el-form-item label="食品经营场所其他信息描述" style="position:  relative;">
          
          <vue-html5-editor  class="editor" style="margin-top: -30px;width:600px;margin-bottom:8px;" :content="editForm.otherDetails" :height="200" ></vue-html5-editor>
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
    <el-dialog title="查看信息" :visible.sync="dialogTwo" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" label-width="200px" :model="editForm" label-position="right">
        <el-form-item label="经营单位名称" required>
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="经营场所面积" required>
          <el-input v-model="editForm.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="仓储库房面积">
          <el-input v-model="editForm.areaWarehouse"></el-input>
        </el-form-item>
        <el-form-item label="经营单位法人">
          <el-input v-model="editForm.director"></el-input>
        </el-form-item>
        <el-form-item label="经营形式" required>
          <el-select v-model="editForm.operationFrom" style="width:202px;">
            <el-option v-for="item in typeList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理人员数量">
          <el-input v-model="editForm.manageNum"></el-input>
        </el-form-item>
        <el-form-item label="法人联系电话" required>
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证号">
          <el-input v-model="editForm.idcardNo"></el-input>
        </el-form-item>
        <el-form-item label="销售人员数量">
          <el-input v-model="editForm.salesNum"></el-input>
        </el-form-item>
        <el-form-item label="食品经营地址" required>
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="营业执照号">
          <el-input v-model="editForm.saleLicense"></el-input>
        </el-form-item>
        <el-form-item label="营业执照有效期限">
          <el-date-picker v-model="editForm.saleLicenseDate" value-format="yyyy-MM-dd" style="width:202px;" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="食品流通许可证">
          <el-input v-model="editForm.foodLicence"></el-input>
        </el-form-item>
        <el-form-item label="食品流通许可证有效期限">
          <el-date-picker v-model="editForm.foodLicenceDate" style="width:202px;" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="经营食品来源(可多选)">
          <el-checkbox-group v-model="checkListU">
            <el-checkbox v-for="item in typeListII" :key="item.id" :label="item.id">{{item.datails}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="保障食品安全主要设施和设备">
          
          <vue-html5-editor  class="editor" :content="editForm.equipmentDetails" :height="200"  id="myeditor" style="width:600px;" @change="editequipmentDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="食品经营场所环境及建筑描述">
          
          <vue-html5-editor  class="editor" :content="editForm.environmentDetails" :height="200"  id="myeditor" style="width:600px;" @change="editenvironmentDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="食品经营场所其他信息描述">
         
          <vue-html5-editor  class="editor" :content="editForm.otherDetails" :height="200"  id="myeditor" style="width:600px;" @change="editotherDetails"></vue-html5-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTwo = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加的dialog -->
    <el-dialog title="添加信息" :visible.sync="dialogThree" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" label-width="200px" :model="form" label-position="right">
        <el-form-item label="经营单位名称" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="经营场所面积" required>
          <el-input v-model="form.areaCovered" ></el-input>
        </el-form-item>
        <el-form-item label="仓储库房面积">
          <el-input v-model="form.areaWarehouse"></el-input>
        </el-form-item>
        <el-form-item label="经营单位法人">
          <el-input v-model="form.director"></el-input>
        </el-form-item>
        <el-form-item label="经营形式" required>
          <el-select v-model="form.operationFrom" style="width:206px;">
            <el-option v-for="item in typeList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理人员数量">
          <el-input v-model="form.manageNum"></el-input>
        </el-form-item>
        <el-form-item label="法人联系电话" required>
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证号">
          <el-input v-model="form.idcardNo"></el-input>
        </el-form-item>
        <el-form-item label="销售人员数量">
          <el-input v-model="form.salesNum"></el-input>
        </el-form-item>
        <el-form-item label="食品经营地址" required>
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="营业执照号">
          <el-input v-model="form.saleLicense"></el-input>
        </el-form-item>
        <el-form-item label="营业执照有效期限">
          <el-date-picker v-model="form.saleLicenseDate" value-format="yyyy-MM-dd" style="width:202px;" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="食品流通许可证">
          <el-input v-model="form.foodLicence"></el-input>
        </el-form-item>
        <el-form-item label="食品流通许可证有效期限">
          <el-date-picker v-model="form.foodLicenceDate" style="width:202px;" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="经营食品来源(可多选)">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in typeListII" :key="item.id" :label="item.id">{{item.datails}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="保障食品安全主要设施和设备">
          
          <vue-html5-editor  class="editor" :content="form.equipmentDetails" :height="200"  id="myeditor" style="width:600px;" @change="addequipmentDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="食品经营场所环境及建筑描述">
         
          <vue-html5-editor  class="editor" :content="form.environmentDetails" :height="200"  id="myeditor" style="width:600px;" @change="addenvironmentDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="食品经营场所其他信息描述">
         
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
import axios from 'axios'
import vue from 'vue'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      rows: [],
      currentPage: 1,
      formQuery: {
        eventName: '',
        pageSize: 10,
        pageNum: 1
      },

      value1: '',
      value2: '',
      val: [],
      multipleSelection: [],
      total: 0,
      dialogOne: false,
      dialogTwo: false,
      dialogThree: false,
      labelPosition: 'left',
      typeListII: [],
      form: {
        name: '',
        address: '',
        type: '',
        areaId: '',
        phone: '',
        areaCovered: '',
        areaWarehouse: '',
        director: '',
        operationFrom: '',
        manageNum: '',
        idcardNo: '',
        salesNum: '',
        saleLicense: '',
        saleLicenseDate: '',
        foodLicence: '',
        foodLicenceDate: '',
        foodSource: '', //逗号分隔
        equipmentDetails: '',
        environmentDetails: '',
        otherDetails: ''
      },
      checkList: [], //添加弹窗经济食品来源选择的个数
      checkListU: [], //修改
      typeList: [],
      editForm: {
        foodLicenceDate: '',
        saleLicenseDate: ''
      }
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'enterpriseList'
  },
  methods: {
    addequipmentDetails(val){
      this.form.equipmentDetails=val;
    },
    addenvironmentDetails(val){
      this.form.environmentDetails=val;
    },
    addotherDetails(val){
      this.form.otherDetails=val;
    },
    editequipmentDetails(val){
      this.editForm.equipmentDetails=val;
    },
    editenvironmentDetails(val){
      this.editForm.environmentDetails=val;
    },
    editotherDetails(val){
      this.editForm.otherDetails=val;
    },
    // 社区信息列表
    foodList() {
      this.rows = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaFoodPlaceList', {
          params: {
            areaId: this.$route.params.areaId,
            type:4,
            page: this.formQuery.pageNum,
            limit: this.formQuery.pageSize
          }
        })
        .then(result => {
          // console.log(result)
          this.rows = result.data.body.list
          this.total = result.data.body.totalCount
        })
        .catch(function(response) {})
    },
    //   添加
    add() {
      Object.keys(this.form).forEach(key=>this.form[key]='');
      this.dialogThree = true
    },
    confirmII() {
      
      if(this.form.name==""||this.form.phone==""||this.form.address==""||this.form.areaCovered==""||this.form.operationFrom==""){
        this.$message.info("请检查必填项不能为空");
        return;
      }
      
      var _this=this;
      this.$confirm('确定要添加数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            
            this.form.type = 4
            this.form.areaId = this.$route.params.areaId
            this.form.foodSource = ''
            console.log(this.form)
            this.checkList.forEach(element => {
              this.form.foodSource += ',' + element
            })
            this.form.foodSource = this.form.foodSource.substring(1)
            if(this.form.saleLicenseDate!=""&&this.form.saleLicenseDate!=null){
              this.form.saleLicenseDate += ' 00:00:00'
            }
            if(this.form.foodLicenceDate!=""&&this.form.foodLicenceDate!=null){
              this.form.foodLicenceDate += ' 00:00:00'
            }
            

            axios({
              method: 'post',
              url: config.apiHost + '/placeMain/place/insertAreaFoodPlace',
              data: this.form
            })
              .then(result => {
                if (result.data.status == 200) {
                  // console.log("11")
                  _this.$message.success("添加成功")
                  _this.dialogThree = false
                  _this.foodList()
                }
              })
              .catch(function(response) {})
          }
        },
        type: 'warning'
      })
    },
    //   导入
    leadin() {
      this.$router.push({path:'/home/data-epmgr/eventImport',query:{type:4}})
    },
    //   删除
    remove() {
      if (this.val == '') {
        this.$message({
          showClose: true,
          message: '请选择要删除的数据'
        })
        return
      } else {
        
        this.$confirm('确定要删除所选数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          callback: (acction, instance) => {
            if (acction === 'confirm') {
              axios({
                method: 'post',
                url: config.apiHost + '/placeMain/place/deleteAreaFoodPlace',
                data: this.val
              })
                .then(result => {
                  if (result.data.status == 200) {
                    this.foodList()
                  }
                })
                .catch(function(response) {})
            } else {
              //点击取消
              this.$message({
                typ: 'info',
                message: '已取消删除'
              })
            }
          },
          type: 'warning'
        })
      }
    },
    //   查看
    handleClick(row) {
      this.dialogOne = true

      axios
        .get(config.apiHost + '/placeMain/place/getAreaFoodPlaceByOne', {
          params: {
            //请求参数
            params: row.mainId
          }
        })
        .then(result => {
          this.editForm = result.data.body
          if(this.editForm.foodLicenceDate!=""&&this.editForm.foodLicenceDate!=null){
              this.editForm.foodLicenceDate=this.editForm.foodLicenceDate.substring(0,10)
          }else{
            this.editForm.foodLicenceDate="";
          }
          
          let arr = result.data.body.foodSource.split(',')

          console.log(arr)
          var that = this
          arr.forEach(element => {
            that.checkListU.push(parseInt(element))
          })
          console.log(this.checkListU)
        })
        .catch(function(response) {})
 
    },
    dropdownI() {
      this.typeList = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceProperty', {
          params: {
            params: 8
          }
        })
        .then(result => {
          this.typeList = result.data.body
          let Data = result.data.body
          console.log(Data)
          // Data.forEach(item => {
          //   this.formI.type = item.type;
          // });
        })
        .catch(function(response) {})
    },
    checkbox() {
      this.typeListII = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceProperty', {
          params: {
            params: 9
          }
        })
        .then(result => {
          this.typeListII = result.data.body
        })
        .catch(function(response) {})
    },
    //   编辑
    editor(row) {
      this.dialogTwo = true

      axios
        .get(config.apiHost + '/placeMain/place/getAreaFoodPlaceByOne', {
          params: {
            //请求参数
            params: row.mainId
          }
        })
        .then(result => {
          this.editForm = result.data.body
          if(this.editForm.foodLicenceDate!=""&&this.editForm.foodLicenceDate!=null){
            this.editForm.foodLicenceDate=this.editForm.foodLicenceDate.substring(0,10)
          }
          
          let arr = result.data.body.foodSource.split(',')

          console.log(arr)
          var that = this
          arr.forEach(element => {
            that.checkListU.push(parseInt(element))
          })
          console.log(this.checkListU)
        })
        .catch(function(response) {})
    },
    confirm() {
      if(this.editForm.name==""||this.editForm.address==""||this.editForm.phone==""||this.editForm.areaCovered==""||this.editForm.operationFrom==""){
        this.$message.info("请检查必填项不能为空");
        return;
      }
      this.$confirm('确定要修改数据吗？', '提示', { 
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            this.dialogTwo = false
            this.editForm.type = 4
            this.editForm.areaId = this.$route.params.areaId
            this.checkListU.forEach(element => {
              this.editForm.foodSource += ',' + element
            })
            this.editForm.foodSource = this.editForm.foodSource.substring(1)
            if(this.editForm.saleLicenseDate!=""&&this.editForm.saleLicenseDate!=null&&this.editForm.saleLicenseDate!='null'){
              this.editForm.saleLicenseDate += ' 00:00:00'
            }
            if(this.editForm.foodLicenceDate!=""&&this.editForm.foodLicenceDate!=null&&this.editForm.foodLicenceDate!="null"){
              this.editForm.foodLicenceDate += ' 00:00:00'
            }
            
            axios({
              method: 'post',
              // /api
              url: config.apiHost + '/placeMain/place/updateAreaFoodPlace',
              data: this.editForm
            })
              .then(result => {
                if (result.data.status == 200) {
                  this.$message("修改成功");
                  this.foodList()
                }
              })
              .catch(function(response) {
                //   this.$message.error(error);
              })
          }
        },
        type: 'warning'
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChange(val) {
      console.log(val)
      this.val = []
      val.forEach(item => {
        this.val.push(item.mainId)
      })
      console.log(this.val)
    },
    //  分页
    handleSizeChange(val) {
      //分页大小变化
      this.formQuery.pageSize = val
      this.foodList()
    },
    handleCurrentChange(val) {
      //分页的当前页变化
      this.formQuery.pageNum = val
      this.foodList()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  },
  created() {
    this.foodList()
    this.dropdownI()
    this.checkbox()
  },
  mounted() {}
}
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
