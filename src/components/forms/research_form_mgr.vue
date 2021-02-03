<template>
  <div class="rolebox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>调查表单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="rolemgr-container">
      <el-form :inline="true" :model="formQuery" ref="formQuery" label-position="right" style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;" class="demo-form-inline">
        <el-form-item>
          <el-input style="width:300px;" v-model="formQuery.eventName" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <!-- v-if="config.hasPermission('data:froms:save')" -->
          <el-button type="primary" @click="addForm()" v-if="config.hasPermission('data:froms:save')">添加</el-button>
          <el-button type="primary" @click="delForms()" v-if="config.hasPermission('data:froms:delete')">批量删除</el-button>
        </el-form-item>

      </el-form>
      <el-table ref="multipleTable" align="left" :data="tableData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%" @select="selectTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="typeName" label="类型"> </el-table-column>
        <el-table-column prop="name" label="表单名称"> </el-table-column>
        <el-table-column prop="createAt" label="创建时间"> </el-table-column>
        <el-table-column prop="updateAt" label="修改时间"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">未发布</span>
            <span v-if="scope.row.status==2">已发布</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="config.hasPermission('data:froms:info')" @click="formDetail(scope.$index,scope.row)">查看</el-button>
            <!-- <span v-if="scope.row.status==1"> -->
              <el-button type="text" size="small" v-if="config.hasPermission('data:froms:update')" @click="formEdit(scope.$index,scope.row)">编辑</el-button>
            <!-- </span> -->
            
            <el-button type="text" size="small" v-if="config.hasPermission('data:froms:delete')" @click="formDel(scope.$index, scope.row)">删除</el-button>
            <el-button size="small" v-if="config.hasPermission('data:froms:control')" @click="controlMeasures(scope.$index, scope.row)">控制措施</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="formQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
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
  background-color: #ffffff;
  /* padding-bottom: 30px; */
}
.form-container {
  width: auto;
  /* height: 100%; */
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
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

<script>
var config = require('@/components/utils/Common_Config.js')
// import config from '@/components/utils/Common_Config.js';
var Cookies = require('js-cookie')
import axios from 'axios'
import qs from 'qs'
export default {
  data() {
    return {
      config: config,
      formQuery: {
        eventName: '',
        pageSize: 10,
        pageNum: 1
        // formType:"0",
      },
      tableData: [], //列表数据
      currentPage: 1,
      total: 0,
      tableSelection: [],
      typeList: [
        {
          id: '0',
          val: '全部'
        },
        {
          id: '1',
          val: '个案调查'
        },
        {
          id: '2',
          val: '现况调查'
        },
        {
          id: '3',
          val: '医生调查表'
        },
        {
          id: '4',
          val: '其他'
        }
      ]
    }
  },
  methods: {
    addForm() {
      //添加
      this.$router.push({ path: '/home/data-addForm' })
      // window.location.href="file:///C:/Users/cppe/Desktop/问卷设计.html";

      // window.open("http://127.0.0.1:8020/%E9%97%AE%E5%8D%B7%E8%AE%BE%E8%AE%A1_files/html/%E9%97%AE%E5%8D%B7%E8%AE%BE%E8%AE%A1.html?__hbt=1514873354475")
    },
    delForms() {
      var delIds = ''
      // console.log(this.tableSelection);
      this.tableSelection.forEach(element => {
        delIds += ',' + element.fromsId
      })
      delIds = delIds.substring(1)
      this.$confirm('确定要删除所选地区吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            var that = this
            axios({
              method: 'get',
              url: config.apiHost + '/froms/deleteFroms?fromsId=' + delIds
            }).then(function(res) {
              if (res.data.status == 200) {
                that.$message({
                  typ: 'success',
                  message: res.data.body.msg
                })
              } else {
                that.$message({
                  typ: 'error',
                  message: res.data.body.message
                })
              }
              that.query() //刷新列表
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
    query() {
      //查询
      var that = this
      axios({
        method: 'get',
        url:
          config.apiHost +
          '/froms/queryFroms?page=' +
          this.formQuery.pageNum +
          '&limit=' +
          this.formQuery.pageSize +
          '&name=' +
          this.formQuery.eventName.trim() //&type='+this.formQuery.formType+'&name='+this.formQuery.eventName,
      }).then(function(res) {
        that.tableData = res.data.body.list
        that.total = res.data.body.totalCount
        that.formQuery.pageSize = res.data.body.pageSize
      })
    },
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
    selectTable(selection, val) {
      // 
    },
    handleSelectionChange(selection) {
      this.tableSelection = selection
    },

    formEdit(index, row) {
      //列表中的编辑

      this.$router.push({
        name: 'data-editFormDetail',
        params: {
          formId: row.fromsId,
          type: row.type,
          surveyName: row.name,
          diseaseId: row.diseaseId
        }
      })
    },
    formDetail(index, row) {
      this.$router.push({
        name: 'data-preview',
        params: {
          formId: row.fromsId
        }
      })
      // window.open(config.apiHost+"/froms/preview.html?formId="+row.fromsId+"&token="+Cookies.get('token'))
    },
    formDel(index, row) {
      //列表中的删除
      this.$confirm('确定要删除该表单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            var that = this
            axios({
              method: 'get',
              url: config.apiHost + '/froms/deleteFroms?fromsId=' + row.fromsId
            }).then(function(res) {
              if (res.data.status == 200) {
                that.$message({
                  typ: 'success',
                  message: res.data.body.msg
                })
              } else {
                that.$message({
                  typ: 'error',
                  message: res.data.body.message
                })
              }
              that.query() //刷新列表
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
    controlMeasures(index, row) {
      //列表中的控制措施
      this.$router.push({
        name: 'data-controlMeasures',
        params: {
          formId: row.fromsId,
          surveyName: row.name,
          diseaseId: row.diseaseId
        }
      })
    }
  },

  created() {
    //  console.log(Cookies.get('token')+"表单页面的token") ;
    this.query()
  }
}
</script>