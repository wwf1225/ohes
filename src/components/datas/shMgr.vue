<template>
  <div class="rolebox">

    <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>学校医院管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="rolemgr-container">
      <!-- <div class="tabdiv">
            <span class="typetab" @click="choseType('school')" :class='{"current" : currentTab == "school" }'>学校医院信息</span>
            <span @click="choseType('type')" class="typetab" :class='{"current" : currentTab == "type" }'>类别</span>
        </div> -->
      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane label="学校医院信息">
          <el-form :inline="true" :model="formQuery" label-width="0px" label-position="right" style="text-align:center" class="demo-form-inline">
            <el-form-item>
              <el-button type="primary" v-if="config.hasPermission('data:company:save')" @click="addCompany()">添加</el-button>
              <el-button type="primary" v-if="config.hasPermission('data:company:delete')" @click="delCompany()">批量删除</el-button>
              <el-button type="primary" v-if="config.hasPermission('data:company:save')" @click="allInsert()" v-show="importBtn">批量导入</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-input style="width:300px;" v-model="formQuery.name" placeholder="学校/医院名称"></el-input>
              <el-button type="primary" @click="getCompanyList()">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" align="left" @selection-change="handleSelectionChange" :data="tableData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="no" label="序号"></el-table-column>
            <el-table-column prop="categoryName" label="类别名称"> </el-table-column>
            <el-table-column prop="comName" label="学校/医院名称"></el-table-column>
            <el-table-column prop="areaName" label="所属地区"> </el-table-column>
            
            <el-table-column label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type==1">学校</span>
                <span v-if="scope.row.type==2">医院</span>
                <span v-if="scope.row.type==3">工厂</span>
              </template>
            </el-table-column>
            <el-table-column prop="legalPerson" label="单位法人"> </el-table-column>
            <el-table-column prop="linkman" label="联系人"> </el-table-column>
            <el-table-column prop="linkmanPhone" label="联系人电话"> </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>

            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="config.hasPermission('data:company:update')" @click="CompanyEdit(scope.$index,scope.row)">编辑</el-button>
                <el-button type="text" size="small" v-if="config.hasPermission('data:company:delete')" @click="CompanyDel(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="类别">
          <el-form :inline="true" :model="formQueryType" label-width="0px" label-position="right" style="text-align:center" class="demo-form-inline">
            <el-form-item>
              <el-button type="primary" v-if="config.hasPermission('data:company:save')" @click="addCompany()">添加</el-button>
              <el-button type="primary" v-if="config.hasPermission('data:company:delete')" @click="delType()">批量删除</el-button>
            </el-form-item>

            <el-form-item label="">
              <el-input style="width:300px;" v-model="formQueryType.name" placeholder="请输入类别名称"></el-input>
              <el-button type="primary" @click="getTypeList()">查询</el-button>
            </el-form-item>

          </el-form>
          <el-table align="left" :data="tableDataType" @selection-change="handleSelectionChangeType" bordertooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55" align="center"></el-table-column> 
            <el-table-column prop="no" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" label="类别名称"> </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type==1">学校</span>
                <span v-if="scope.row.type==2">医院</span>
                <span v-if="scope.row.type==3">工厂</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="config.hasPermission('data:company:update')" @click="typeEdit(scope.$index,scope.row)">编辑</el-button>
                <el-button type="text" size="small" v-if="config.hasPermission('data:company:delete')" @click="typeDel(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChangeType" @current-change="handleCurrentChangeType" :current-page="pageType" :page-sizes="[10, 20, 30, 40]" :page-size="limitType" layout="total, sizes, prev, pager, next, jumper" :total="totalCountType">
            </el-pagination>

        </el-tab-pane>
      </el-tabs>

      <!-- 添加学校/医院弹出框 -->
      <el-dialog title="添加学校/医院" :visible.sync="dialogAddVisible">
        <el-form :inline="false" :model="addForm" label-width="120px" id="classroom_add" style="text-align:left;width:570px;margin: 0 auto;">
          <el-form-item label="类型：">
            <el-radio-group v-model="addForm.type" @change="typeChange" style="width:430px">
              <el-radio :label="1">学校</el-radio>
              <el-radio :label="2">医院</el-radio>

            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称：">
            <el-input placeholder="学校/医院名称" v-model="addForm.comName" style="width:430px" required></el-input>
          </el-form-item>
          <el-form-item label="类别：">
            <el-select v-model="addForm.categoryId" style="width:430px">
              <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属地区：">
            <!-- <el-input placeholder="所属城镇" v-model="addForm.towns" style="width:430px" required></el-input> -->
            <el-select v-model="addForm.areaId" style="width:430px">
              <el-option v-for="item in areaList" :key="item.id" :label="item.areaName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位法人：">
            <el-input v-model="addForm.legalPerson" style="width:430px" required></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="addForm.linkman" style="width:430px" required></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="addForm.linkmanPhone" style="width:430px" required></el-input>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input placeholder="地址" v-model="addForm.address" style="width:430px" required></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="schoolAdd">确认</el-button>
          <el-button @click="closeShow">取消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑学校/医院弹出框 -->
      <el-dialog title="编辑学校/医院" :visible.sync="dialogUpdateVisible">
        <el-form :inline="false" :model="editForm" label-width="120px" id="classroom_edit" style="text-align:left;width:570px;margin: 0 auto;">
          <el-form-item label="类型：">
            <el-radio-group v-model="editForm.type" @change="typeChangeEdit">
              <el-radio :label="1">学校</el-radio>
              <el-radio :label="2">医院</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称：">
            <el-input placeholder="学校/医院名称" v-model="editForm.comName" style="width:430px"></el-input>
          </el-form-item>
          <el-form-item label="类别：">
            <el-select v-model="editForm.categoryId" style="width:430px">
              <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属城镇：">
            <!-- <el-input placeholder="所属城镇" v-model="editForm.towns" style="width:430px" required></el-input> -->
            <el-select v-model="editForm.areaId" style="width:430px">
              <el-option v-for="item in areaList" :key="item.id" :label="item.areaName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位法人：">
            <el-input v-model="editForm.legalPerson" style="width:430px"></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="editForm.linkman" style="width:430px"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：">
            <el-input v-model="editForm.linkmanPhone" style="width:430px"></el-input>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input v-model="editForm.address" style="width:430px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="schoolEdit">确认</el-button>
          <el-button @click="closeShow">取消</el-button>
        </div>
      </el-dialog>

      <!-- 类别的添加 -->
      <el-dialog title="类别信息" :visible.sync="dialogTypeAddVisible">
        <el-form ref="form" :inline="false" :model="typeAddInfo" label-width="120px" style="text-align: left;width:500px;margin:0 auto;">
          <el-form-item label="类型：">
            <el-radio-group v-model="typeAddInfo.type" style="width:430px;" required>
              <el-radio :label="1">学校</el-radio>
              <el-radio :label="2">医院</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称：">
            <el-input placeholder="名称" v-model="typeAddInfo.name" style="width:430px" required></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="typeSave">确认</el-button>
          <el-button @click="closeShow">取消</el-button>
        </div>
      </el-dialog>

      <!-- 类别的修改 -->
      <el-dialog title="类别信息" :visible.sync="dialogTypeEditVisible">
        <el-form :inline="false" :model="typeEditInfo" label-width="120px" style="text-align: left;width:500px;margin:0 auto;">
          <el-form-item label="类型">
            <el-radio-group v-model="typeEditInfo.type" style="width:430px;" required>
              <el-radio :label="1">学校</el-radio>
              <el-radio :label="2">医院</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" prop="editName">
            <el-input v-model="typeEditInfo.name" style="width:430px" required></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editSave">确认</el-button>
          <el-button @click="closeShow">取消</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      schoolShow: true,
      typeShow: false,
      currentTab: '学校医院信息',
      typeList: [],
      townList: [],
      config: config,
      formQuery: {
        name: ''
      },
      formQueryType:{
        name:''
      },
      addForm: {
        type: 1,
        comName: '', //学校/医院名称
        areaId: '', //城镇
        categoryId: '', //类别
        legalPerson: '', //法人
        linkman: '', //联系人
        linkmanPhone: '', //联系电话
        address: '' //地址
      },
      areaList: [], //所属城镇下拉框
      editForm: {},
      typeAddInfo: {
        //类别的添加信息
        type: '',
        name: ''
      },
      typeEditInfo: {
        //类别的修改信息
        type: '',
        name: '',
        id:''
      },

      schoolCategory: [],
      hospitalCategory: [],

      tableData: [], //列表数据
      tableSelection: [],
      tableSelectionType:[],
      page: 1, //当前页
      limit: 10,
      currPage: 1,
      list: [],
      totalCount: 0, //总条数
      totalPage: 0, //总页数
      // oringinId:[],//删除ID集合
      dialogAddVisible: false, //医院信息添加弹框
      dialogUpdateVisible: false, //医院信息修改弹框
      dialogTypeAddVisible: false, //类别添加弹框
      dialogTypeEditVisible: false, //类别修改弹框
      importBtn: true, //导入按钮的显示隐藏判断
      tableDataType:[],
      pageType: 1, //当前页
      limitType: 10,
      currPageType: 1,
      totalCountType: 0, //总条数
      totalPageType: 0, //总页数
    }
  },
  methods: {
    getCompanyList() {
      axios
        .get(config.apiHost + '/basedata/company/list', {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            name: this.formQuery.name
          }
        })
        .then(
          result => {
            if (result.status == 200) {
              this.tableData = result.data.body.list
              this.totalCount = result.data.body.totalCount //总条数
            }
          },
          error => {
            this.$message.error(error)
          }
        )
        .then(text => {
          this.msg = text
        })
    },
    getTypeList(){
      
      axios.get(config.apiHost+'/basedata/company/getCategoryList',{
        params:{
          page:this.pageType,
          limit:this.limitType,
          name:this.formQueryType.name
      }
      }).then(result=>{
        if(result.data.status==200){
          this.tableDataType=result.data.body.list;
          this.totalCountType=result.data.body.totalCount;
          this.pageType=result.data.body.currPage;
        }
      })
    },
    getSelectTypeList(type){
      var that=this;
      axios.get(config.apiHost+'/basedata/company/getCategoryList',{
        params:{
          page:1,
          limit:10000,
          type:type
      }
      }).then(result=>{
        if(result.data.status==200){
          if(type==1){
            that.schoolCategory=result.data.body.list;
          }else{
            that.hospitalCategory=result.data.body.list;
          }
        }
      })
    },
    getAreaList() {
      var that=this;
      axios
        .get(config.apiHost + '/basedata/area/selectList')
        .then(
          result => {
            if (result.status == 200) {
              // console.log(result.data);
              that.areaList = result.data.body;
            }
          },
          error => {
            this.$message.error(error)
          }
        )
        .then(text => {
          this.msg = text
        })
    },
    handleClick(tab, event) {
     
      this.choseType(tab.label)
    },
    handleSelectionChange(selection) {
      this.tableSelection = selection
    },
    handleSelectionChangeType(selection){
      this.tableSelectionType=selection;
    },
    typeChange() {
      this.addForm.categoryId = ''
      if (this.addForm.type == 1) {
        this.typeList = this.schoolCategory
      } else {
        this.typeList = this.hospitalCategory
      }
    },
    typeChangeEdit() {
      this.editForm.categoryId = ''
      if (this.editForm.type == 1) {
        this.typeList = this.schoolCategory
      } else {
        this.typeList = this.hospitalCategory
      }
    },
    choseType(type) {
      this.currentTab = type
      if (type == '学校医院信息') {
        this.schoolShow = true
        this.typeShow = false
        this.importBtn = true
      } else {
        this.schoolShow = false
        this.typeShow = true
        this.importBtn = false
      }
    },
    // 表格添加
    addCompany() {
      if (this.currentTab == '学校医院信息') {
        
        this.addForm.type = ''
        this.addForm.comName = ''
        this.addForm.areaId = ''
        this.addForm.categoryId = ''
        this.addForm.legalPerson = ''
        this.addForm.linkman = ''
        this.addForm.linkmanPhone = ''
        this.addForm.address = ''
        this.dialogAddVisible = true
      } else {
        
        this.typeAddInfo.type = ''
        this.typeAddInfo.name = ''
        this.dialogTypeAddVisible = true
      }
    },
    delCompany() {
      if(this.tableSelection.length==0){
        this.$message.info('请选择需要删除的数据');
        return;
      }
      var companyIds = []
      this.tableSelection.forEach(element => {
        companyIds.push(element.id)
      })
      this.$confirm('确定要删除所选数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            axios({
              method: 'post',
              url: config.apiHost + '/basedata/company/deleteBatch',
              data: companyIds
            })
              .then(result => {
                if (result.data.status == 200) {
                  this.getCompanyList()
                  this.$message(result.data.body.msg)
                } else {
                  this.$message.error(result.data.body.message)
                }
              })
              .catch(function(response) {
                //   this.$message.error(error);
                console.log(response)
              })
          } else {
            this.$message({
              typ: 'info',
              message: '已取消删除'
            })
          }
        },
        type: 'warning'
      })
    },
    delType(){
      if(this.tableSelectionType.length==0){
        this.$message.info("请选择需要删除的数据");
        return;
      }
      var that=this;
      var ids = []
      this.tableSelectionType.forEach(element => {
        ids.push(element.id)
      })
      this.$confirm('确定要删除所选数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            axios({
              method: 'post',
              url: config.apiHost + '/basedata/company/categoryDeleteBatch',
              data: ids
            })
              .then(result => {
                if (result.data.status == 200) {
                  that.getTypeList();
                    that.getSelectTypeList(1);
                    that.getSelectTypeList(2);
                  this.$message(result.data.body.msg)
                } else {
                  this.$message.error(result.data.body.message)
                }
              })
              .catch(function(response) {
                //   this.$message.error(error);
                console.log(response)
              })
          } else {
            this.$message({
              typ: 'info',
              message: '已取消删除'
            })
          }
        },
        type: 'warning'
      })
    },
    
    CompanyEdit(index, row) {
      //表格编辑
      this.dialogUpdateVisible = true

      if (row.type == 1) {
        this.typeList = this.schoolCategory
      } else {
        this.typeList = this.hospitalCategory
      }
     console.log(row);
      this.editForm = row
    },
    typeEdit(index,row){
      this.dialogTypeEditVisible=true;
     
      this.typeEditInfo.id=row.id;
      this.typeEditInfo.name=row.name;
      this.typeEditInfo.type=row.type;
    },
    handleSizeChange(val) {
      this.limit = val
      this.getCompanyList()
    },
    handleSizeChangeType(val){
      this.limitType=val;
      this.getTypeList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getCompanyList();
    },
    handleCurrentChangeType(val){
      this.pageType=val;
      this.getTypeList();
    },
    typeSave() {
      //添加类别弹窗的确定按钮
      var that=this;
      axios({
        method:'post',
        url:config.apiHost+"/basedata/company/categorySave",
        data:this.typeAddInfo,
      }).then(res=>{
      
        if(res.data.status==200){
          that.$message.success(res.data.body.msg);
          that.dialogTypeAddVisible=false;
          that.getTypeList();
          that.getSelectTypeList(1);
          that.getSelectTypeList(2);
        }else{
          that.$message.error(res.data.body.message);
        }

      }).catch(function(response){
        console.log(response);
      })
    },
    editSave() {
      //修改类别弹窗的确定按钮
      //添加类别弹窗的确定按钮
      var that=this;
      axios({
        method:'post',
        url:config.apiHost+"/basedata/company/categoryUpdate",
        data:this.typeEditInfo,
      }).then(res=>{
        
        if(res.data.status==200){
          
          that.$message.success(res.data.body.msg);
          
          that.dialogTypeEditVisible=false;
          that.getTypeList();
          that.getSelectTypeList(1);
          that.getSelectTypeList(2);
        }else{
          that.$message.error(res.data.body.message);
        }

      }).catch(function(response){
        console.log(response);
      })
    },
    //添加确认
    schoolAdd() {
      axios({
        method: 'post',
        url: config.apiHost + '/basedata/company/save',
        data: this.addForm
      })
        .then(res => {
          if (res.data.status == 200) {
            this.getCompanyList();
            this.dialogAddVisible = false
            this.$message(res.data.body.msg)
          }else{
            this.$message.error("必填项不能为空")
          }
         
          return res.data
        })
        .catch(function(response) {
         
          console.log(response)
        })
    },
    schoolEdit() {
      axios({
        method: 'post',
        url: config.apiHost + '/basedata/company/update',
        data: this.editForm
      })
        .then(res => {
          //  console.log(res);
          if (res.data.status == '200') {
            this.getCompanyList()
            //  初始化表单对象
            this.editForm = {
              id: '',
              name: '',
              deleteFlag: false
            }
            this.dialogUpdateVisible = false
            this.$message(res.data.body.msg)
          }
          return res.data
        })
        .catch(function(response) {
          //   this.$message.error(error);
          console.log(response)
        })
    },
    closeShow() {
      this.dialogUpdateVisible = false
      this.dialogAddVisible = false
      this.dialogTypeAddVisible = false
      this.dialogTypeEditVisible = false
    },
    // 批量导入
    allInsert() {
      this.$router.push('/home/data-schoolImport')
    },
    //表格点击删除
    CompanyDel(index, row) {
      // this.oringinId.push(row.id);
      this.$confirm('确定要删除所选择的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            axios
              .get(config.apiHost + '/basedata/company/delete', {
                params: {
                  //请求参数
                  companyId: row.id
                }
              })
              .then(
                result => {
                  if (result.data.status == 200) {
                    this.getCompanyList()
                    this.$message(result.data.body.msg)
                  }
                },
                function(error) {
                  this.$message.error(error)
                }
              )
          } else {
            this.$message({
              typ: 'info',
              message: '已取消删除'
            })
          }
        },
        type: 'warning'
      })
    },
    typeDel(index,row){
      var that=this;
      this.$confirm('确定要删除所选择的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            axios
              .get(config.apiHost + '/basedata/company/categoryDelete', {
                params: {
                  //请求参数
                  companyTypeId: row.id
                }
              })
              .then(
                result => {
                  if (result.data.status == 200) {
                    that.getTypeList();
                    that.getSelectTypeList(1);
                    that.getSelectTypeList(2);
                    this.$message(result.data.body.msg)
                  }else{
                    this.$message.error(result.data.msg);
                  }
                },
                function(error) {
                  this.$message.error(error)
                }
              )
          } else {
            this.$message({
              typ: 'info',
              message: '已取消删除'
            })
          }
        },
        type: 'warning'
      })
    },
  },
  created() {
    this.getCompanyList();
    this.typeList = this.schoolCategory;
    this.getAreaList();
    this.getTypeList();
    this.getSelectTypeList(1);
    this.getSelectTypeList(2);
  }
}
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
  /* padding-bottom: 30px; */
}
.tabdiv {
  text-align: left;
  font-size: 0px;
  /* margin-bottom: 30px; */
  font-family: '微软雅黑';
  background-color: #fff;
  padding: 10px;
}
.tabdiv .typetab {
  border: 1px solid #ccc;
  margin: 0;
  width: 130px;
  display: inline-block;
  text-align: center;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  font-size: 16px;
}
.tabdiv .current {
  color: #fff;
  background-color: #409eff;
  border: 1px solid #409eff;
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  text-align: left;
  background-color: rgb(255, 255, 255);
  padding-left: 10px;
  padding-top: 20px;
}
.sch-hosp {
  text-align: left;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  background-color: #f0f3f8;
  padding-left: 10px;
  margin-bottom: 10px;
}
.Companymgr-container {
  background-color: #fff;
}
.container {
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
  height: auto;
}
</style>