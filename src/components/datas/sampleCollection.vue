<template>
    <div class="rolebox">
       <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item>数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>采样类别管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="rolemgr-container">
            <el-tabs type="border-card">
                <el-tab-pane label="样品列表">
                    <el-form :inline="true" :model="formQuery" label-width="0px" style="text-align:center" class="demo-form-inline">
                         <el-form-item>
                            <el-button type="primary" v-if="config.hasPermission('data:sample:save')" @click="addSample()" >添加</el-button>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input style="width:300px;" v-model="formQuery.name" placeholder="输入关键字"></el-input>
                            <el-button type="primary" @click="getSampleList()">搜索</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table align="left" :data="tableData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%">
                        <el-table-column label="序号" prop="no" width="50"></el-table-column>
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="类别" prop="category"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" v-if="config.hasPermission('data:sample:update')" @click="sampleEdit(scope.$index,scope.row)">编辑</el-button>
                                <el-button type="text" size="small" v-if="config.hasPermission('data:sample:delete')" @click="sampleDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="formQuery.page" :page-sizes="[10, 25, 50, 100]" :page-size="formQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="sampleTotal">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="样品类别添加">
                    <el-form :inline="true" :model="typeFormQuery" label-width="0px" label-position="right" style="text-align:center" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" @click="addSampleType()">添加</el-button>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input style="width:300px;" v-model="typeFormQuery.name" placeholder="输入关键字"></el-input>
                            <el-button type="primary" @click="getSampleTypeList()">搜索</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table align="left" :data="sampleTypeData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%">
                        <el-table-column label="序号" prop="no" width="50"></el-table-column>
                        <el-table-column label="类型" prop="name"></el-table-column>
                        <el-table-column label="时间" prop="updateAt"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="sampleTypeEdit(scope.$index,scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="sampleTypeDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChangeType" @current-change="handleCurrentChangeType" :current-page.sync="typeFormQuery.page" :page-sizes="[10, 25, 50, 100]" :page-size="typeFormQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="typeTotal">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
            <!-- 样品添加 -->
            <el-dialog title="添加信息" :visible.sync="sampleAddDialogVisible">
                <el-form :inline="false" :model="addSampleData" label-width="120px" style="text-align:left;width:570px;margin: 0 auto;">
                    <el-form-item label="名称">
                        <el-input v-model="addSampleData.name" style="width:430px"></el-input>
                    </el-form-item>
                    <el-form-item label="类别">
                        <el-select v-model="addSampleData.categoryId" placeholder="请选择" style="width:430px;">
                            <el-option
                                v-for="item in sampleTypeDataList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addSampleOk()">确认</el-button>
                    <el-button @click="addSampleCancel()">取消</el-button>
                </div>
            </el-dialog>
            <!-- 样品修改 -->
            <el-dialog title="修改信息" :visible.sync="sampleEditDialogVisible">
                <el-form :inline="false" :model="editSampleData" label-width="120px" style="text-align:left;width:570px;margin: 0 auto;">
                    <el-form-item label="名称">
                        <el-input v-model="editSampleData.name" style="width:430px;"></el-input>
                    </el-form-item>
                    <el-form-item label="类别" >
                        <el-select v-model="editSampleData.categoryId" style="width:430px;">
                            <el-option
                                v-for="item in sampleTypeDataList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="editSampleOk()">确认</el-button>
                    <el-button @click="editSampleCancel()">取消</el-button>
                </div>
            </el-dialog>
            <!-- 样品类别添加 -->
            <el-dialog title="添加信息" :visible.sync="typeAddDialogVisible">
                <el-form :inline="false" :model="addTypeData" label-width="120px" style="text-align:left;width:570px;margin: 0 auto;">
                    <el-form-item label="类别">
                        <el-input v-model="addTypeData.name" style="width:430px;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addTypeOk()">确认</el-button>
                    <el-button @click="addTypeCancel()">取消</el-button>
                </div>
            </el-dialog>
            <!-- 样品类别修改 -->
            <el-dialog title="修改信息" :visible.sync="typeEditDialogVisible">
                <el-form :inline="false" :model="editTypeData" label-width="120px;" style="text-align:left;width:570px;margin: 0 auto;">
                    <el-form-item label="类别">
                        <el-input v-model="editTypeData.name" style="width:430px;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="editTypeOk()">确认</el-button>
                    <el-button @click="editTypeCancel()">取消</el-button>
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
        config: config,
        formQuery:{
            name:"",
            limit:10,
            page:1
        },
        sampleTotal:5,
        tableData:[],
        sampleAddDialogVisible:false,
        sampleEditDialogVisible:false,
        addSampleData:{
            "name":"",
            "categoryId":""

        },
        editSampleData:{
            "id":"",
            "name":"",
            "categoryId":""
        },
        //类别
        typeFormQuery:{
            name:"",
            limit:10,
            page:1,
        },
        typeTotal:2,
        sampleTypeData:[],
        sampleTypeDataList:[],
        typeAddDialogVisible:false,
        typeEditDialogVisible:false,
        addTypeData:{
            "name":""
        },
        editTypeData:{
            "id":"",
            "name":""
        }
        

    }
  },
  methods: {
      //样品列表
      addSample(){
          this.addSampleData.name="";
          this.addSampleData.categoryId="";
          this.sampleAddDialogVisible=true;

      },
      getSampleList(){
         
          var that=this;
          axios({
              method:"get",
              url:config.apiHost+"/sampleCategory/listCategory",
              params:that.formQuery
          }).then(res=>{
              if(res.data.status==200){
                  that.tableData=res.data.body.list;
                  that.sampleTotal=res.data.body.totalCount;
              }else{
                  that.$message(res.data.msg);
              }
          })
      },
      handleSizeChange(val){
          this.formQuery.limit=val;
          this.getSampleList();
      },
      handleCurrentChange(val){
          this.formQuery.page=val;
          this.getSampleList();
      },
      sampleEdit(index,row){
          this.editSampleData.id=row.id;
          this.editSampleData.name=row.name;
          this.editSampleData.categoryId=row.categoryId;
          this.sampleEditDialogVisible=true;
      },
      sampleDel(index,row){
          
          var that = this;
          this.$confirm('确定要删除该样品吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            callback: (acction, instance) => {
            if (acction === 'confirm') {
               
                axios({
                method: 'get',
                url: config.apiHost + '/sampleCategory/daleteCategory?id=' + row.id
                }).then(function(res) {
                if(res.data.status==200){
                    that.$message({
                    typ: 'success',
                    message: res.data.body.msg
                    })
                }else{
                    that.$message({
                    typ: 'error',
                    message: res.data.body.message
                    })
                }
                that.getSampleList(); //刷新列表
                })
            } else {
                that.$message({
                typ: 'info',
                message: '已取消删除'
                })
            }
            },
            type: 'warning'
        })
      },
      addSampleOk(){
          
          if(this.addSampleData.name==""||this.addSampleData.type==""){
              this.$message({
              typ: 'info',
              message: '名称或类别不能为空'
            });
          }else{
              
              axios({
                  method:'post',
                  url:config.apiHost+'/sampleCategory/saveCategory',
                  data:this.addSampleData
              }).then(res=>{
                  if(res.data.status==200){
                      this.getSampleList();
                      this.sampleAddDialogVisible=false;
                      this.$message(res.data.body.msg);
                  }else{
                      this.$message(res.data.body.message)
                  }
              }).catch(function(response){
                  console.log(response);
              });
              
          }
          

      },
      addSampleCancel(){
          this.sampleAddDialogVisible=false;
      },
    
    editSampleOk(){
      if(this.editSampleData.name==""||this.editSampleData.categoryId==""){
              this.$message({
                  type:'info',
                  message:'名称或类别不能为空'
              });
          }else{
              axios({
                  method:'post',
                  url:config.apiHost+'/sampleCategory/updateCategory',
                  data:this.editSampleData
              }).then(res=>{
                  if(res.data.status==200){
                      this.sampleEditDialogVisible=false;
                      this.getSampleList();
                      this.$message(res.data.body.msg);
                  }else{
                      this.$message(res.data.body.message)
                  }
              })
          }
    },
      editSampleCancel(){
          this.sampleEditDialogVisible=false;
      },

      //类别
      addSampleType(){
          this.addTypeData.name="";
          this.typeAddDialogVisible=true;

      },
      getSampleTypeList(){
         
          var that=this;
          axios({
              method:"get",
              url:config.apiHost+"/sampleCategory/listType",
              params:this.typeFormQuery
          }).then(res=>{
              if(res.data.status==200){
                  that.sampleTypeData=res.data.body.list;
                  that.typeTotal=res.data.body.totalCount;
              }else{
                  that.$message(res.data.msg);
              }
          })
      },
      handleSizeChangeType(val){
         this.typeFormQuery.limit=val;
         this.getSampleTypeList();

      },
      handleCurrentChangeType(val){
          this.typeFormQuery.page=val;
          this.getSampleTypeList();
      },
      addTypeOk(){
          
          if(this.addTypeData.name==""){
              this.$message("请输入类别名称");
          }else{
              var that=this;
              axios({
                  method:"post",
                  url:config.apiHost+'/sampleCategory/saveType',
                  data:that.addTypeData
                }).then(res=>{
                    if(res.data.status==200){
                        that.typeAddDialogVisible=false;
                        that.$message(res.data.body.msg);
                        that.getSampleTypeList();
                        that.getSelectTypeList();
                        that.getSampleList();
                    }else{
                        that.$message.error(res.data.body.message);
                    }
                })
              
          }
          
      },
      addTypeCancel(){
          this.typeAddDialogVisible=false;
      },
      sampleTypeEdit(index,row){
          
          this.editTypeData.name=row.name;
          this.editTypeData.id=row.id;
          this.typeEditDialogVisible=true;

      },
      editTypeOk(){
          
          if(this.editTypeData.name==""){
              this.$message("请输入类别名称")
          }else{
              axios({
                  method:'post',
                  url:config.apiHost+'/sampleCategory/updateType',
                  data:this.editTypeData
              }).then(res=>{
                  if(res.data.status==200){
                      this.$message(res.data.body.msg);
                      this.getSampleTypeList();
                      this.getSelectTypeList();
                      this.getSampleList();
                      this.typeEditDialogVisible=false;
                  }else{
                      this.$message(res.data.body.message);
                  }
              })
          }

      },
      editTypeCancel(){
          this.typeEditDialogVisible=false;
      },
      sampleTypeDel(index,row){
        
          var that = this;
          this.$confirm('确定要删除该样品类别吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            callback: (acction, instance) => {
            if (acction === 'confirm') {
                  
                axios({
                method: 'get',
                url: config.apiHost + '/sampleCategory/daleteType?id=' + row.id
                }).then(function(res) {
                if(res.data.status==200){
                    that.$message({
                    typ: 'success',
                    message: res.data.body.msg
                    })
                }else{
                    that.$message({
                    typ: 'error',
                    message: res.data.body.message
                    })
                }
                that.getSampleTypeList() //刷新列表
                that.getSelectTypeList();
                that.getSampleList();
                })
            } else {
                that.$message({
                typ: 'info',
                message: '已取消删除'
                })
            }
            },
            type: 'warning'
        })
      },
      getSelectTypeList(){
          var that=this;
          axios({
              method:"get",
              url:config.apiHost+"/sampleCategory/list",
              
          }).then(res=>{
              if(res.data.status==200){
                  that.sampleTypeDataList=res.data.body;
                  
              }else{
                  that.$message(res.data.msg);
              }
          })
      }

  },
  created(){
      this.getSampleList();
      this.getSampleTypeList();
      this.getSelectTypeList();
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
.samplecontainer{
    background-color: #e2e6ef;
    padding: 10px 15px 45px;
    height: auto;
}
.sample-header {
  text-align: left;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    background-color: #f0f3f8;
    padding-left: 10px;
    margin-bottom: 10px;
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  text-align: left;
    background-color: rgb(255, 255, 255);
    padding-left: 10px;
    padding-top: 20px;
}
</style>

