<template>
  <div class="rolebox">
    <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>地区管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="rolemgr-container">
      <el-form :inline="true" :model="formQuery" ref="formQuery" label-width="0px" label-position="right" style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;" class="demo-form-inline">
        <el-form-item label="" prop="AreasName">
          <el-input style="width:300px;" v-model="formQuery.AreasName" placeholder="地区名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getAreasList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="config.hasPermission('data:area:save')" @click="addAreas()">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="config.hasPermission('data:area:delete')" @click="delAreas()">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="config.hasPermission('data:area:save')" @click="allInsert()">批量导入</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" align="left" :data="tableData" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" bordertooltip-effect="dark" style="width: 100%;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="no" label="序号"></el-table-column>
        <el-table-column prop="areaName" label="地区名称"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="config.hasPermission('data:area:update')" @click="AreasEdit(scope.$index,scope.row)">编辑</el-button>
            <el-button type="text" size="small" v-if="config.hasPermission('data:area:delete')" @click="AreasDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="limit" style="background-color:#fff;padding-bottom:20px;" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 添加地区弹出框 -->
    <el-dialog title="添加地区" :visible.sync="dialogAddVisible">
      <el-form ref="form" :inline="false" :model="form" label-width="120px" id="classroom_add">
        <el-form-item label="地区名称：" prop="name">
          <el-input placeholder="地区名称" v-model="form.areaName" style="width:364px" required></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCall">确认</el-button>
        <el-button @click="closeShow">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑地区弹出框 -->
    <el-dialog title="编辑地区" :visible.sync="dialogUpdateVisible">
      <el-form ref="form" :inline="false" :model="form" label-width="120px" id="classroom_edit">
        <el-form-item label="地区名称：" prop="name">
          <el-input placeholder="地区名称" v-model="form.areaName" style="width:364px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editCall">确认</el-button>
        <el-button @click="closeShow">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      tableSelection: [],
      config: config,
      formQuery: {
        AreasName: ''
      },
      form: {
        id: '', //地区id
        areaName: '', //地区名称
        deleteFlag: false
      },
      tableData: [], //列表数据
      page: 1, //当前页
      limit: 10,
      currPage: 1,
      list: [],
      totalCount: null, //总条数
      totalPage: null, //总页数
      // oringinId:[],//删除ID集合
      dialogAddVisible: false,

      dialogUpdateVisible: false
    }
  },
  methods: {
    getAreasList() {
      axios
        .get(config.apiHost + '/basedata/area/list', {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            name: this.formQuery.AreasName
          }
        })
        .then(
          result => {
            if (result.status == 200) {
              // console.log(result.data);
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
    // 表格添加
    addAreas() {
      this.form = {}
      this.dialogAddVisible = true
      this.getAreasList()
    },
    AreasEdit(index, row) {
      this.dialogUpdateVisible = true
      this.form = row
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.limit = val
      this.getAreasList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.getAreasList()
    },
    // 批量导入
    allInsert() {
      this.$router.push('/home/data-areaImport')
    },
    //删除
    delAreas() {
      
      if(this.tableSelection.length==0){
        this.$message.info('请选择需要删除的数据');
        return;
      }
      var delIds = ''
      // console.log(this.tableSelection);
      this.tableSelection.forEach(element => {
        delIds += ',' + element.id
      })
      delIds = delIds.substring(1)
      this.$confirm('确定要删除所选地区吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            axios
              .get(config.apiHost + '/basedata/area/delete', {
                params: {
                  //请求参数

                  areaId: delIds
                }
              })
              .then(
                result => {
                  if (result.data.status == 200) {
                    this.getAreasList()
                    this.$message(result.data.body.msg)
                  } else {
                    this.$message.error(result.data.body.message)
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
    handleSelectionChange(selection) {
      this.tableSelection = selection
    },

    //添加确认
    saveCall() {
      // console.log(this.form.areaName);
      // return;
      if (this.form.areaName == undefined || this.form.areaName == '') {
        this.$message.info('请输入地区名称')
        return
      } else {
        axios({
          method: 'post',
          url: config.apiHost + '/basedata/area/save',
          data: this.form
        })
          .then(res => {
            // console.log(res.data.status)
            if (res.data.status == 200) {
              this.getAreasList()
              //  初始化表单对象
              this.form = {
                id: '',
                name: ''
              }
              this.dialogAddVisible = false
              this.$message(res.data.body.msg)
            }else{
              this.$message.error(res.data.body.message);
            }
            
          })
          .catch(function(response) {
            //   this.$message.error(error);
            console.log(response)
          })
      }
    },
    //确认编辑
    editCall() {
      // console.log(this.form)
      if (this.form.areaName == undefined || this.form.areaName == '') {
        this.$message.info('请输入地区名称')
        return
      } else {
        axios({
          method: 'post',
          url: config.apiHost + '/basedata/area/update',
          data: this.form
        })
          .then(res => {
            //  console.log(res);
            if (res.data.status == 200) {
              this.getAreasList()
              //  初始化表单对象
              this.form = {
                id: '',
                name: '',
                deleteFlag: false
              }
              this.dialogUpdateVisible = false
              this.$message(res.data.body.msg)
            }else{
              this.$message.error(res.data.body.message);
            }
            
          })
          .catch(function(response) {
            //   this.$message.error(error);
            console.log(response)
          })
      }
    },
    closeShow() {
      this.dialogUpdateVisible = false
      this.dialogAddVisible = false
      this.form = {}
      this.getAreasList()
    },
    //表格点击删除
    AreasDel(index, row) {
      // console.log(row.id)
      // this.oringinId.push(row.id);
      this.$confirm('确定要删除地区吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            axios
              .get(config.apiHost + '/basedata/area/delete', {
                params: {
                  //请求参数
                  areaId: row.id
                }
              })
              .then(
                result => {
                  if (result.data.status == 200) {
                    this.getAreasList()
                    this.$message(result.data.body.msg)
                  } else {
                    this.$message.info(result.data.body.message)
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
    }
  },
  created() {
    this.getAreasList()
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
.container {
  width: auto;
  height: auto;
  background-color: #e2e6ef;
  padding: 10px 15px 45px 15px;
}

#classroom_add,
#classroom_edit {
  width: 500px;
  margin: 0 auto;
}

.title-header {
  text-align: left;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  background-color: #f0f3f8;
  padding-left: 10px;
  margin-bottom: 10px;
}
.mainhead {
  background-color: #fff;
  text-align: left;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}
</style>