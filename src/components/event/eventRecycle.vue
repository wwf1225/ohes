<template>
  <div class="rolebox">
    <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>事件管理</el-breadcrumb-item>
        <el-breadcrumb-item>事件回收站</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="rolemgr-container">
      <el-form :inline="true" :model="formQuery" ref="formQuery" label-width="0px" label-position="right" style="text-align:left;padding-left:10px;padding-top:20px;" class="demo-form-inline">
        <el-form-item label="" prop="userName">
          <el-input style="width:300px;" v-model="formQuery.name" placeholder="事件名"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="getRecycleList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" align="left" :data="tableData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="number" label="编号" align="center"> </el-table-column>
        <el-table-column prop="name" label="名称" align="center" width="200"> </el-table-column>
        <el-table-column prop="address" label="事发地点" align="center" width="200"> </el-table-column>
        <el-table-column prop="reportUser" label="报告人" align="center"> </el-table-column>
        <el-table-column prop="reportPhone" label="报告电话" align="center"> </el-table-column>
        <el-table-column prop="userName" label="接报人" align="center"> </el-table-column>
        <el-table-column label="接报时间" align="center">
          <template slot-scope="scope">
            <span>
              {{scope.row.reportedTime.substr(0,16)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="事件状态" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1" size="mini" type="danger" round>未发布</el-button>
            <el-button v-else-if="scope.row.status==2" size="mini" type="primary" round>发布审批</el-button>
            <el-button v-else-if="scope.row.status==3" size="mini" type="success" round>待调查</el-button>
            <el-button v-else-if="scope.row.status==4" size="mini" type="warning" round>调查中</el-button>
            <el-button v-else-if="scope.row.status==5" size="mini" type="warning" round>结案审批</el-button>
            <el-button v-else size="mini" type="warning" round>已结案</el-button>
          </template>
           </el-table-column>
        <el-table-column label="删除时间" align="center">
          <template slot-scope="scope">
            <span>
              {{scope.row.updateAt.substr(0,16)}}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column fixed="right" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" v-if="config.hasPermission('event:recycle:info')" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" v-if="config.hasPermission('event:recycle:delete')" @click.native.prevent="deleteRow(scope.row)">彻底删除</el-button>
            <el-button type="text" size="small" v-if="config.hasPermission('event:recycle:restore')" @click.native.prevent="restoreRow(scope.row)">还原</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 class="block"-->
      <div class="page_main">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
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
      formQuery: {
        name: ''
      },
      tableData: [],
      page: 1,
      limit: 10,
      totalCount: null
    }
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val
      this.getRecycleList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val
      this.getRecycleList()
    },

    //查看
    handleClick(row) {
      //  console.log(row);
      // this.$store.dispatch('showEventDetail',row);
      // this.$router.push({path: '/home/event-show'});
      row.ispage = '查看'
      row.isUrl = 'eventRecycle'
      // console.log(row);
      this.$store.dispatch('showEventDetail', row)
      this.$router.push({ path: '/home/past-event-detail' })
    },
    //彻底删除
    deleteRow(row) {
      // console.log("彻底删除。。。");
      this.$confirm('您确定彻底删除该事件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            this.delEvent(row.id)
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
    },
    //确认删除
    delEvent(id) {
      // console.log(id);
      //
      axios
        .get(config.apiHost + '/old/delete-forever', {
          params: {
            //请求参数
            token: config.token,
            eventId: id
          }
        })
        .then(
          result => {
            // console.log(result.data.status);
            if (result.data.status == 200) {
              //删除成功
              this.getRecycleList()
              this.$message(result.data.body.msg)
            } else {
              //删除失败
              this.$message(result.data.body.message)
            }
          },
          error => {
            this.$message.error(error)
          }
        )
    },
    // 还原
    restoreRow(row) {
      this.$confirm('您确定要还原该事件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            //点击确认
            //
            axios
              .get(config.apiHost + '/old/restoreEvent', {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: row.id
                }
              })
              .then(
                result => {
                  // console.log(result.data.status);
                  if (result.data.status == 200) {
                    //还原成功
                    this.getRecycleList()
                    this.$message(result.data.body.msg)
                  } else {
                    //还原失败
                    this.$message(result.data.body.message)
                  }
                },
                error => {
                  this.$message.error(error)
                }
              )
          } else {
            //点击取消
            this.$message({
              typ: 'info',
              message: '已取消还原'
            })
          }
        },
        type: 'warning'
      })
    },

    //事件回收站列表
    getRecycleList() {
      //
      axios
        .get(config.apiHost + '/old/list-delete', {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            name: this.formQuery.name
          }
        })
        .then(result => {
          // console.log("请求返回。。。");
          // console.log(result.data);
          if (result.data.status == 200) {
            // console.log(result.data.body);
            this.tableData = result.data.body.list
            // console.log(this.tableData);
            this.totalCount = result.data.body.totalCount //总条数
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        })
    }
  },
  created() {
    this.getRecycleList()
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
.event-container {
  width: auto;
  min-height: 100%;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
  /* overflow: hidden; */
}
.recycle_main {
  height: 100%;
  min-height: 800px;
  width: 100%;
  background-color: #ffffff;
}
.Myheader {
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
  text-align: left;
  background-color: #f6f7fb;
  margin-bottom: 15px;
}
.page_main {
  text-align: right;
  margin: 45px 15px 20px 0px;
}
</style>

