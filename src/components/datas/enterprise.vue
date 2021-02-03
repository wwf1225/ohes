<template>
  <div>
    <div class="top_box">企业列表</div>
    <div class="top_box">
      <el-button type="primary" size="small" @click="add">+添加信息</el-button>
      <el-button type="primary" size="small" @click="leadin">批量导入</el-button>
      <el-button type="primary" size="small" @click="remove">-删除信息</el-button>
    </div>

    <!-- 表格 -->

    <el-table ref="multipleTable" :data="rows" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>
      <el-table-column label="序号" type="index" width="50">
      </el-table-column>
      <el-table-column label="所属区县乡镇(街道)" prop='areaName' align="center" >
      </el-table-column>
      <el-table-column label="企业名称" prop="name" align="center">
      </el-table-column>
      <el-table-column label="所属行业" prop="typeName" align="center">
      </el-table-column>
      <el-table-column label="占地面积" prop="areaCovered" align="center">
      </el-table-column>
      <el-table-column label="联系电话" prop="phone" align="center">
      </el-table-column>
      <el-table-column label="企业地址" prop="address" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" round @click="handleClick(scope.row)" type="text">查看</el-button>
          <el-button size="mini" round @click="editor(scope.row)" type="text">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="formQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 查看的dialog -->
    <el-dialog title="查看信息" :visible.sync="dialogOne" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" :label-position="labelPosition" label-width="180px" :model="editForm" >
        <el-form-item label="企业名称">
          <el-input v-model="editForm.name" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="占地面积">
          <el-input v-model="editForm.areaCovered" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="办公面积">
          <el-input v-model="editForm.businessArea" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="注册地址">
          <el-input v-model="editForm.registAddress" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="成立时间">
          <el-input v-model="editForm.companyDate" readonly="readonly" ></el-input>
        </el-form-item>
        <el-form-item label="企业地址">
          <el-input v-model="editForm.address" readonly="readonly" ></el-input>
        </el-form-item>
        <el-form-item label="所属行业">
          <el-input v-model="editForm.typeName" readonly="readonly" ></el-input>
        </el-form-item>
        <el-form-item label="经营范围" >
          <el-input v-model="editForm.operateRange" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人">
          <el-input v-model="editForm.director" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="企业类型">
          <el-input v-model="editForm.companyType" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="企业性质">
          <el-input v-model="editForm.propertyName" readonly="readonly"></el-input>
         
        </el-form-item>
        <el-form-item label="联系电话" >
          <el-input v-model="editForm.phone" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="企业总人数">
          <el-input v-model="editForm.companyNum" readonly="readonly" style="margin-bottom: 8px;"></el-input>
        </el-form-item>
        <el-form-item label="企业经营发展特色简要描述" style="position:relative;">
          
          <vue-html5-editor  class="editor" style="margin-top: -30px;width:568px;margin-bottom: 8px;" :content="editForm.featureDetails" :height="200" ></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
        <el-form-item label="企业环境及建筑描述" style="position:relative;">
         
          <vue-html5-editor  class="editor" style="margin-top: -30px;width:568px;margin-bottom: 8px;" :content="editForm.environmentDetails" :height="200" ></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
        <el-form-item label="企业其他信息描述" style="position:relative;">
 
          <vue-html5-editor  class="editor" style="margin-top: -30px;width:568px;margin-bottom: 8px;" :content="editForm.otherDetails" :height="200" ></vue-html5-editor>
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
    <el-dialog title="编辑信息" :visible.sync="dialogTwo" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" :label-position="labelPosition" label-width="180px" :model="editForm" >
        <el-form-item label="企业名称" required>
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="占地面积" required>
          <el-input v-model="editForm.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="办公面积">
          <el-input v-model="editForm.businessArea"></el-input>
        </el-form-item>
        <el-form-item label="注册地址">
          <el-input v-model="editForm.registAddress"></el-input>
        </el-form-item>
        <el-form-item label="成立时间">
          
          <el-date-picker v-model="editForm.companyDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width:202px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="企业地址" required>
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="所属行业" required>
          <el-select v-model="editForm.industry" style="width:206px">
            <el-option v-for="item in typeList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营范围" >
          <el-input v-model="editForm.operateRange"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人">
          <el-input v-model="editForm.director"></el-input>
        </el-form-item>
        <el-form-item label="企业类型">
          <el-input v-model="editForm.companyType"></el-input>
        </el-form-item>
        <el-form-item label="企业性质">
          <el-select v-model="editForm.companyProperty" style="width:206px;">
            <el-option v-for="item in propertyList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="企业总人数">
          <el-input v-model="editForm.companyNum"></el-input>
        </el-form-item>
        <el-form-item label="企业经营发展特色简要描述">
          
          <vue-html5-editor  class="editor" :content="editForm.featureDetails" :height="200"  id="myeditor" style="width:599px;" @change="editfeatureDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="企业环境及建筑描述" prop="desc">
          
          <vue-html5-editor  class="editor" :content="editForm.environmentDetails" :height="200"  id="myeditor" style="width:599px;" @change="editenvironmentDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="企业其他信息描述" prop="desc">
          
          <vue-html5-editor  class="editor" :content="editForm.otherDetails" :height="200"  id="myeditor" style="width:599px;" @change="editotherDetails"></vue-html5-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTwo = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加的dialog -->
    <el-dialog title="添加信息" :visible.sync="dialogThree" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" label-width="180px" :model="form" label-position="right">
        <el-form-item label="企业名称" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="占地面积" required>
          <el-input v-model="form.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="办公面积">
          <el-input v-model="form.businessArea"></el-input>
        </el-form-item>
        <el-form-item label="注册地址">
          <el-input v-model="form.registAddress"></el-input>
        </el-form-item>
        <el-form-item label="成立时间">
          <el-date-picker v-model="form.companyDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width:206px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="企业地址" required>
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="所属行业" required>
          <el-select v-model="form.industry" style="width:206px">
            <el-option v-for="item in typeList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营范围" >
          <el-input v-model="form.operateRange"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人">
          <el-input v-model="form.director"></el-input>
        </el-form-item>
        <el-form-item label="企业类型">
          <el-input v-model="form.companyType"></el-input>
        </el-form-item>
        <el-form-item label="企业性质">
          <el-select v-model="form.companyProperty" style="width:206px;">
            <el-option v-for="item in propertyList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="企业总人数">
          <el-input v-model="form.companyNum"></el-input>
        </el-form-item>
        <el-form-item label="企业经营发展特色简要描述" prop="desc">
          
          <vue-html5-editor  class="editor" :content="form.featureDetails" :height="200"  id="myeditor" style="width:599px;" @change="addfeatureDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="企业环境及建筑描述" prop="desc">
          
          <vue-html5-editor  class="editor" :content="form.environmentDetails" :height="200"  id="myeditor" style="width:599px;" @change="addenvironmentDetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="企业其他信息描述" prop="desc">
          
          <vue-html5-editor  class="editor" :content="form.otherDetails" :height="200"  id="myeditor" style="width:599px;" @change="addotherDetails"></vue-html5-editor>
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
      val: [],
      multipleSelection: [],
      total: 0,
      dialogOne: false,
      dialogTwo: false,
      dialogThree: false,
      labelPosition: 'right',
      form: {
        name: '',
        address: '',
        type: 2,
        areaId: '',
        phone: '',
        areaCovered: '',
        businessArea: '',
        registAddress: '',
        companyDate: '',
        industry: '',
        operateRange: '',
        director: '',
        companyType: '',
        companyProperty: '',
        companyNum: '',
        featureDetails: '',
        environmentDetails: '',
        otherDetails: ''
      },
      editForm:{
        name: '',
        address: '',
        type: 2,
        areaId: '',
        phone: '',
        areaCovered: '',
        businessArea: '',
        registAddress: '',
        companyDate: '1234567812345678',
        industry: '',
        operateRange: '',
        director: '',
        companyType: '',
        companyProperty: '',
        companyNum: '',
        featureDetails: '',
        environmentDetails: '',
        otherDetails: ''
      },
      typeList: []
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'enterpriseList'
  },
  methods: {
    addfeatureDetails(val){
      this.form.featureDetails=val;
    },
    addenvironmentDetails(val){
      this.form.environmentDetails=val;
    },
    addotherDetails(val){
      this.form.otherDetails=val;
    },
    editfeatureDetails(val){
      this.editForm.featureDetails=val;
    },
    editenvironmentDetails(val){
      this.editForm.environmentDetails=val;
    },
    editotherDetails(val){
      this.editForm.otherDetails=val;
    },
    // 企业信息列表
    enterpriseList() {
      this.rows = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceByCompany', {
          params: {
            areaId: this.$route.params.areaId,
            type: 2,
            page: this.formQuery.pageNum,
            limit: this.formQuery.pageSize
          }
        })
        .then(result => {
          console.log(result)
          this.rows = result.data.body.list
          this.total=result.data.body.totalCount;
        })
        .catch(function(response) {})
    },
    //   添加
    add() {
      
      Object.keys(this.form).forEach(key => this.form[key]= '');
      this.dialogThree = true
    },
    confirmII() {
      console.log(this.form);
      if(this.form.name==""||this.form.areaCovered==""||this.form.address==""||this.form.industry==""||this.form.phone==""){
        this.$message.info("请检查必填项不能为空")
        return;
      }
      if(this.form.companyDate!=""&&this.form.companyDate!=null&&this.form.companyDate!="null"){
        this.form.companyDate+=' 00:00:00';
      }
      
      this.form.areaId=this.$route.params.areaId;
      this.form.type=2;
      this.$confirm('确定要添加数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            this.dialogThree = false
           
            axios({
              method: 'post',
              url: config.apiHost + '/placeMain/place/insertAreaCompany',
              data: this.form
            })
              .then(result => {
                if (result.data.status == 200) {
                  this.$message.success('添加成功')
                  this.enterpriseList()
                } else {
                  this.$message.error(result.data.body.message)
                }
              })
              .catch(function(response) {})
          }
        },
        type: 'warning'
      })
      // this.dropdownI()
      // this.dropdownII()
    },
    //   导入
    leadin() {
      this.$router.push({path:'/home/data-epmgr/eventImport',query:{type:2}})
    },
    //   删除
    remove() {
      if (this.val == '') {
        this.$message({
          showClose: true,
          message: '请勾选数据'
        })
        return
      } else {
        this.$confirm('确定要删除该事件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          callback: (acction, instance) => {
            if (acction === 'confirm') {
              axios({
                method: 'post',
                url: config.apiHost + '/placeMain/place/deleteAreaCompany',
                data: this.val
              })
                .then(result => {
                  if (result.data.status == 200) {
                    this.enterpriseList()
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
      this.form = {}
      axios
        .get(config.apiHost + '/placeMain/place/getAreaCompanyByOne', {
          params: {
            //请求参数
            params: row.mainId
          }
        })
        .then(result => {
          this.editForm = result.data.body
          this.editForm.companyDate=this.editForm.companyDate.substring(0,10)
        
          
        })
        .catch(function(response) {})
      
    },
    dropdownI() {
      this.typeList = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceProperty', {
          params: {
            params: 6
          }
        })
        .then(result => {
          this.typeList = result.data.body
         
         
        })
        .catch(function(response) {})
    },
    dropdownII() {
      this.propertyList = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceProperty', {
          params: {
            params: 7
          }
        })
        .then(result => {
          this.propertyList = result.data.body
          let Data = result.data.body
          
        })
        .catch(function(response) {})
    },
    //   编辑
    editor(row) {
      this.dialogTwo = true
      
      axios
        .get(config.apiHost + '/placeMain/place/getAreaCompanyByOne', {
          params: {
            //请求参数
            params: row.mainId
          }
        })
        .then(result => {
         
          this.editForm = result.data.body
          if(this.editForm.companyDate!=""&&this.editForm.companyDate!=null&&this.editForm.companyDate!="null"){
            this.editForm.companyDate=this.editForm.companyDate.substring(0,10)
          }else{
            this.editForm.companyDate="";
          }
          if(this.editForm.propertyName==0||this.editForm.propertyName=="0"){
            this.editForm.propertyName="";
          }
          
         
        })
        .catch(function(response) {})
     
    },
    confirm() {
      if(this.editForm.name==""||this.editForm.areaCovered==""||this.editForm.industry==""||this.editForm.phone==""||this.editForm.address==""){
        this.$message.info("请检查必填项不能为空");
        return;
      }
      
      this.$confirm('确定要修改数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            this.dialogTwo = false
            this.editForm.type=2;
            if(this.editForm.companyDate!=""&&this.editForm.companyDate!=null&&this.editForm.companyDate!="null"){
              this.editForm.companyDate+=' 00:00:00';
            }else{
              this.editForm.companyDate="";
            }
            
            axios({
              method: 'post',
              
              url: config.apiHost + '/placeMain/place/updateAreaCompany',
              data: this.editForm
            })
              .then(result => {
                if (result.data.status == 200) {
                  this.$message.success("修改成功");
                  this.enterpriseList()
                }else{
                  this.$message.error(result.data.body.message);
                }
              })
              .catch(function(response) {
                  this.$message.error(error);
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
      this.query(this.formQuery)
    },
    handleCurrentChange(val) {
      //分页的当前页变化
      this.formQuery.pageNum = val
      this.query(this.formQuery)
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
    this.enterpriseList()
    this.dropdownII()
    this.dropdownI()
  },
  mounted() {
    this.form.areaId = this.$route.params.areaId
  }
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
</style>
