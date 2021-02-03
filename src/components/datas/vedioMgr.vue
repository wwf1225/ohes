<template>
  <div class="rolebox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>视频设备管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <el-form
        :inline="true"
        :model="formQuery"
        ref="formQuery"
        label-width="0px"
        label-position="right"
        style="text-align: left;background-color: rgb(255, 255, 255);padding-left: 10px;padding-top: 20px;"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-button
            type="primary"
            @click="addvideo()"
            v-if="config.hasPermission('data:device:save')"
          >添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        align="left"
        border
        :data="tableData"
        bordertooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="no" label="序号"></el-table-column>
        <el-table-column prop="deviceNo" label="设备号"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column prop="areaName" label="所属地区"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="config.hasPermission('data:device:update')"
              @click="videoEdit(scope.$index,scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              v-if="config.hasPermission('data:device:delete')"
              @click="videoDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          style="background-color:#fff;padding-bottom:20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="formQuery.page"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="formQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 添加设备弹出框 -->
    <el-dialog title="添加设备" :visible.sync="dialogAddVisible">
      <el-form ref="form" :inline="false" :model="form" label-width="120px" id="classroom_add">
        <el-form-item label="设备号：">
          <el-input placeholder="设备号" v-model="form.deviceNo" style="width:364px"></el-input>
        </el-form-item>
        <el-form-item label="设备名称：">
          <el-input placeholder="设备名称" v-model="form.deviceName" style="width:364px"></el-input>
        </el-form-item>
        <el-form-item label="所属地区：">
          <el-select v-model="form.areaId" placeholder="请选择" style="width:364px">
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOK">确认</el-button>
        <el-button @click="closeShow">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑设备弹出框 -->
    <el-dialog title="编辑设备" :visible.sync="dialogUpdateVisible">
      <el-form ref="form" :inline="false" :model="form" label-width="120px" id="classroom_edit">
        <el-form-item label="设备号：">
          <el-input placeholder="设备号" v-model="form.deviceNo" style="width:364px"></el-input>
        </el-form-item>
        <el-form-item label="设备名称：">
          <el-input placeholder="设备名称" v-model="form.deviceName" style="width:364px"></el-input>
        </el-form-item>
        <el-form-item label="所属地区：">
          <el-select v-model="form.areaId" placeholder="请选择" style="width:364px">
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editOK">确认</el-button>
        <el-button @click="closeShow">取消</el-button>
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
      formQuery: {
        videoName: "",
        page: 1,
        limit: 10
      },
      form: {
        id: "", //设备id
        deviceNo: "", //设备id
        deviceName: "", //设备名称
        areaId: "" //所属地区
      },
      areaList: [],
      tableData: [], //列表数据
      totalCount: 0, //总条数
      dialogAddVisible: false,
      dialogUpdateVisible: false
    };
  },
  methods: {
    getVideoList() {
      axios
        .get(config.apiHost + "/sys/devices/queryDevices", {
          params: {
            //请求参数
            page: this.formQuery.page,
            limit: this.formQuery.limit,
            deviceName: this.formQuery.videoName
          }
        })
        .then(
          result => {
            if (result.status == 200) {
              this.tableData = result.data.body.list;
              this.totalCount = result.data.body.totalCount; //总条数
            }
          },
          error => {
            this.$message.error(error);
          }
        )
        .then(text => {
          this.msg = text;
        });
    },
    getAreaList() {
      axios
        .get(config.apiHost + "/basedata/area/selectList", {})
        .then(
          result => {
            if (result.status == 200) {
              this.areaList = result.data.body;
            }
          },
          error => {
            this.$message.error(error);
          }
        )
        .then(text => {
          this.msg = text;
        });
    },
    handleSizeChange(val) {
      this.formQuery.pageSize = val;
      this.getVideoList();
    },
    handleCurrentChange(val) {
      this.formQuery.pageNum = val;
      this.getVideoList();
    },

    // 表格添加
    addvideo() {
      this.form = {};
      this.dialogAddVisible = true;
    },
    videoEdit(index, row) {
      //表格编辑
      this.dialogUpdateVisible = true;
      this.form.id = row.id;
      this.form.deviceNo = row.deviceNo;
      this.form.deviceName = row.deviceName;
      this.form.areaId = row.areaId;
    },
    addOK() {
      if (this.form.deviceNo == undefined || this.form.deviceNo == "") {
        this.$message.info("请输入设备号");
        return;
      } else if (
        this.form.deviceName == undefined ||
        this.form.deviceName == ""
      ) {
        this.$message.info("请输入设备名称");
        return;
      } else if (this.form.areaId == undefined || this.form.areaId == "") {
        this.$message.info("请选择设备所属地区");
        return;
      } else {
        axios({
          method: "post",
          url: config.apiHost + "/sys/devices/save",
          data: this.form
        })
          .then(res => {
            if (res.data.status == 200) {
              this.getVideoList();
              this.dialogAddVisible = false;
              this.$message(res.data.body.msg);
            } else {
              this.$message.error(res.data.body.message);
            }
          })
          .catch(function(response) {
            console.log(response);
          });
      }
    },
    editOK() {
      if (this.form.deviceNo == undefined || this.form.deviceNo == "") {
        this.$message.info("请输入设备号");
        return;
      } else if (
        this.form.deviceName == undefined ||
        this.form.deviceName == ""
      ) {
        this.$message.info("请输入设备名称");
        return;
      } else {
        axios({
          method: "post",
          url: config.apiHost + "/sys/devices/update",
          data: this.form
        })
          .then(res => {
            if (res.data.status == 200) {
              this.getVideoList();
              this.dialogUpdateVisible = false;
              this.$message(res.data.body.msg);
            } else {
              this.$message.error(res.data.body.message);
            }
          })
          .catch(function(response) {
            console.log(response);
          });
      }
    },
    closeShow() {
      this.dialogUpdateVisible = false;
      this.dialogAddVisible = false;
      this.form = {};
      this.getVideoList();
    },
    // 批量删除
    AllDel() {},
    //表格点击删除
    videoDel(index, row) {
      this.$confirm("确定要删除设备吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios
              .get(config.apiHost + "/sys/devices/delete", {
                params: {
                  //请求参数
                  tenId: row.tenId,
                  id: row.id
                }
              })
              .then(
                result => {
                  if (result.data.status == 200) {
                    this.getVideoList();
                    this.$message(result.data.body.msg);
                  }
                },
                function(error) {
                  this.$message.error(error);
                }
              );
          } else {
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
  created() {
    this.getVideoList();
    this.getAreaList();
  }
};
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
.mainhead {
  background-color: #fff;
  text-align: left;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
}
.vedioheader {
  text-align: left;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  background-color: #f0f3f8;
  padding-left: 10px;
  margin-bottom: 10px;
}
.videomgr-container {
  background-color: #fff;
  padding-left: 10px;
  min-height: 700px;
}
.container {
  width: auto;
  height: auto;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
}
</style>