<template>
  <div class="rolebox">
    <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>报告来源管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="rolemgr-container">
      <el-form :inline="true" :model="formQuery" ref="formQuery" label-width="0px" label-position="right" style="text-align:center" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" v-if="config.hasPermission('data:origin:save')" @click="addReports()">添加</el-button>

        </el-form-item>

      </el-form>

      <el-table ref="multipleTable" align="left" :data="tableData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <el-table-column prop="no" label="序号"></el-table-column>

        <el-table-column prop="name" label="报告来源"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">

            <el-button type="text" size="small" v-if="config.hasPermission('data:origin:update')" @click="ReportsEdit(scope.$index,scope.row)">编辑</el-button>
            <el-button type="text" size="small" v-if="config.hasPermission('data:origin:delete')" @click="ReportsDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="formQuery.page" :page-sizes="[10, 25, 50, 100]" :page-size="formQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <!-- 添加报告来源弹出框 -->
    <el-dialog title="添加报告来源" :visible.sync="dialogAddVisible">
      <el-form ref="form" :inline="false" :model="form" label-width="120px" id="classroom_add">
        <el-form-item label="报告来源名称：" prop="name">
          <el-input placeholder="报告来源名称" v-model="form.name" style="width:364px" required></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOk">确认</el-button>
        <el-button @click="closeShow">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑报告来源弹出框 -->
    <el-dialog title="编辑报告来源" :visible.sync="dialogUpdateVisible">
      <el-form ref="form" :inline="false" :model="form" label-width="120px" id="classroom_edit">
        <el-form-item label="报告来源名称：" prop="name">
          <el-input placeholder="报告来源名称" v-model="form.name" style="width:364px"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editOk">确认</el-button>
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
      config: config,
      formQuery: {
        ReportsName: '',
        page: 1,
        limit: 10
      },
      form: {
        id: '', //报告来源id
        name: '' //报告来源名称
      },
      tableData: [], //列表数据
      page: 1, //当前页
      totalCount: null, //总条数
      dialogAddVisible: false,
      dialogUpdateVisible: false
    }
  },
  methods: {
    getReportsList() {
      axios
        .get(config.apiHost + '/basedata/origin/list', {
          params: {
            //请求参数
            name: this.formQuery.ReportsName,
            page: this.formQuery.page,
            limit: this.formQuery.limit
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
    handleSizeChange(val) {
      this.formQuery.limit = val
      this.getReportsList()
    },
    handleCurrentChange(val) {
      this.formQuery.page = val
      this.getReportsList()
    },
    // 表格添加
    addReports() {
      this.form = {}
      this.dialogAddVisible = true
      this.getReportsList()
    },
    ReportsEdit(index, row) {
      //表格编辑

      this.dialogUpdateVisible = true
      // this.form = row;
      this.form.id = row.id
      this.form.name = row.name
    },
    addOk() {
      axios({
        method: 'post',
        url: config.apiHost + '/basedata/origin/save',
        data: this.form
      })
        .then(res => {
          if (res.data.status == 200) {
            this.getReportsList()
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

          return res.data
        })
        .catch(function(response) {
          console.log(response)
        })
    },
    editOk() {
      axios({
        method: 'post',
        url: config.apiHost + '/basedata/origin/update',
        data: this.form
      })
        .then(res => {
          if (res.data.status == 200) {
            this.getReportsList()
            //  初始化表单对象
            this.form = {
              id: '',
              name: ''
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
    },
    closeShow() {
      this.dialogUpdateVisible = false
      this.dialogAddVisible = false
      this.form = {}
      this.getReportsList()
    },
    // 批量删除
    AllDel() {},
    //表格点击删除
    ReportsDel(index, row) {
      // this.oringinId.push(row.id);
      this.$confirm('确定要删除报告来源吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            axios
              .get(config.apiHost + '/basedata/origin/delete', {
                params: {
                  //请求参数

                  originId: row.id
                }
              })
              .then(
                result => {
                  if (result.data.status == 200) {
                    this.getReportsList()
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
    }
  },
  created() {
    this.getReportsList()
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
#classroom_add,
#classroom_edit {
  width: 500px;
  margin: 0 auto;
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  text-align: left;
  background-color: rgb(255, 255, 255);
  padding-left: 10px;
  padding-top: 20px;
}
.reportheader {
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
.Reportsmgr-container {
  min-height: 745px;
  background-color: #fff;
}
.container {
  width: auto;
  height: auto;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
}
</style>