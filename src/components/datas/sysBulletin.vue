<template>
  <div class="rolebox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统公告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <el-form
        :inline="true"
        :model="formQuery"
        ref="formQuery"
        label-width="0px"
        label-position="right"
        style="text-align:center"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-button
            type="primary"
            v-if="config.hasPermission('data:profession:save')"
            @click="addSysBull()"
          >添加</el-button>
        </el-form-item>
        <el-form-item label>
          <el-input style="width:300px;" v-model="formQuery.bulltinName" placeholder="请输入公告名称"></el-input>
          <el-button type="primary" @click="getBulletinList()">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table
        ref="multipleTable"
        align="left"
        border
        :data="tableData"
        bordertooltip-effect="dark"
        style="width: 100%;"
      >
        <el-table-column prop="no" label="序号" style="text-align: center;"></el-table-column>
        <el-table-column prop="msgTitle" label="名称"></el-table-column>
        <el-table-column prop="createTime" label="发布时间"></el-table-column>
        <el-table-column label="是否显示">
          <template slot-scope="scope">
            <span style="font-size:28px;color: #0066FF;" v-if="scope.row.displayFlag==1">
              <i class="el-icon-check"></i>
            </span>
            <span style="font-size:28px;color: #666666;" v-else>
              <i class="el-icon-close"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="config.hasPermission('data:profession:update')"
              @click="bulletinDetail(scope.$index,scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
              v-if="config.hasPermission('data:profession:update')"
              @click="bulletinEdit(scope.$index,scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              v-if="config.hasPermission('data:profession:delete')"
              @click="bulletinDel(scope.$index, scope.row)"
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
    <!-- 详情公告弹出框 -->
    <el-dialog title="信息详情" :visible.sync="dialogDetailVisible">
      <el-form :inline="false" :model="detailForm" label-width="120px" id="classroom_add">
        <el-form-item label="名称：" style="text-align: left;">{{detailForm.name}}</el-form-item>
        <el-form-item label="详情：" style="text-align: left;position:  relative;">
          <vue-html5-editor
            class="editor"
            style="margin-top: -30px;"
            :content="detailForm.detail"
            :height="200"
            :width="465"
          ></vue-html5-editor>
          <div
            style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;"
          >
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
        <el-form-item label="是否显示：" style="text-align: left;">
          <span v-if="detailForm.displayFlag==1">显示</span>
          <span v-else>不显示</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加公告弹出框 -->
    <el-dialog title="添加信息" :visible.sync="dialogAddVisible">
      <el-form :inline="false" :model="addForm" label-width="120px" id="classroom_add">
        <el-form-item label="名称：">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="详情：">
          <!-- <el-input type="textarea" :rows="5" v-model="addForm.detail" style="max-width:364px"></el-input> -->
          <vue-html5-editor
            class="editor"
            :content="addForm.detail"
            :height="200"
            id="myeditor"
            @change="addContentChange"
          ></vue-html5-editor>
        </el-form-item>
        <el-form-item label="是否显示：" style="text-align: left;">
          <el-radio-group v-model="addForm.displayFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCallback">确认</el-button>
        <el-button @click="closeShow">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑职业弹出框 -->
    <el-dialog title="编辑公告" :visible.sync="dialogUpdateVisible">
      <el-form :inline="false" :model="editForm" label-width="120px" id="classroom_edit">
        <el-form-item label="名称：">
          <el-input placeholder="公告名称" v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="详情：">
          <vue-html5-editor
            class="editor"
            :content="editForm.detail"
            :height="200"
            id="myeditor"
            @change="cContentChange"
          ></vue-html5-editor>
        </el-form-item>
        <el-form-item label="是否显示：" style="text-align: left;">
          <el-radio-group v-model="editForm.displayFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editCallBack">确认</el-button>
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
        bulltinName: "",
        page: 1,
        limit: 10
      },
      addForm: {
        name: "", //公告名称
        detail: "",
        displayFlag: 1
      },
      editForm: {
        id: "", //公告id
        name: "", //公告名称
        detail: "",
        displayFlag: "",
        msgType: 1
      },
      detailForm: {
        name: "", //公告名称
        detail: "",
        displayFlag: ""
      },
      tableData: [], //列表数据
      totalCount: 0, //总条数
      dialogAddVisible: false,
      dialogUpdateVisible: false,
      dialogDetailVisible: false
    };
  },
  methods: {
    getBulletinList() {
      var that = this;
      axios
        .get(config.apiHost + "/sys/msg/list", {
          params: {
            //请求参数
            title: that.formQuery.bulltinName,
            page: that.formQuery.page,
            limit: that.formQuery.limit
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              that.tableData = result.data.body.list;
              that.totalCount = result.data.body.totalCount; //总条数
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
      this.formQuery.limit = val;
      this.getBulletinList();
    },
    handleCurrentChange(val) {
      this.formQuery.page = val;
      this.getBulletinList();
    },

    // 表格添加
    addSysBull() {
      this.addForm.name = "";
      this.addForm.detail = "";
      this.addForm.displayFlag = 1;
      this.dialogAddVisible = true;
    },
    bulletinEdit(index, row) {
      this.editForm.id = "";
      this.editForm.name = "";
      this.editForm.displayFlag = "";
      this.editForm.detail = "";
      let msgId = row.id;
      axios({
        url: config.apiHost + "/sys/msg/getMsgDetail",
        method: "get",
        params: {
          msgId: msgId
        }
      }).then(res => {
        if (res.data.status == 200) {
          //表格编辑
          this.editForm.id = row.id;
          this.editForm.detail = res.data.body.msgContent;
          this.editForm.name = res.data.body.msgTitle;
          this.editForm.displayFlag = res.data.body.displayFlag;
          this.editForm.msgType = res.data.body.msgType;
          this.dialogUpdateVisible = true;
        } else {
          this.$message.error(res.data.body.msg);
        }
      });
    },
    bulletinDetail(index, row) {
      let msgId = row.id;
      axios({
        url: config.apiHost + "/sys/msg/getMsgDetail",
        method: "get",
        params: {
          msgId: msgId
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.detailForm.detail = res.data.body.msgContent;
          this.detailForm.name = res.data.body.msgTitle;
          this.detailForm.displayFlag = res.data.body.displayFlag;
          this.dialogDetailVisible = true;
        } else {
          this.$message.error(res.data.body.msg);
        }
      });
    },
    saveCallback() {
      axios({
        method: "post",
        url: config.apiHost + "/sys/msg/insertSysMsg",
        data: {
          msgTitle: this.addForm.name,
          msgContent: this.addForm.detail,
          displayFlag: this.addForm.displayFlag,
          msgType: 1
        }
      })
        .then(res => {
          if (res.data.status == 200) {
            this.getBulletinList();

            this.dialogAddVisible = false;
            this.$message(res.data.body.msg);
          } else {
            this.$message(res.data.body.msg);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          console.log(response);
        });
    },
    editCallBack() {
      axios({
        method: "post",
        url: config.apiHost + "/sys/msg/updateMsg",
        data: {
          id: this.editForm.id,
          msgTitle: this.editForm.name,
          msgContent: this.editForm.detail,
          displayFlag: this.editForm.displayFlag,
          msgType: this.editForm.msgType
        }
      })
        .then(res => {
          if (res.data.status == 200) {
            this.getBulletinList();
            this.dialogUpdateVisible = false;
            this.$message.success(res.data.body.msg);
          } else {
            this.$message, error(res.data.body.msg);
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    closeShow() {
      this.dialogUpdateVisible = false;
      this.dialogAddVisible = false;
      this.addForm = {};
      this.editForm = {};
      this.getBulletinList();
    },

    //表格点击删除
    bulletinDel(index, row) {
      this.$confirm("确定要删除公告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios({
              method: "post",
              url: config.apiHost + "/sys/msg/deleteSysMsg",
              data: {
                //请求参数
                id: row.id
              }
            }).then(
              result => {
                if (result.data.status == 200) {
                  this.getBulletinList();
                  this.$message.success(result.data.body.msg);
                } else {
                  this.$message.error(result.data.body.msg);
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
    },
    cContentChange(val) {
      this.editForm.detail = val;
    },
    addContentChange(val) {
      this.addForm.detail = val;
    }
  },
  created() {
    this.getBulletinList();
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
  width: 100%;
  margin: 0 auto;
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  background-color: rgb(255, 255, 255);
  padding-left: 10px;
  padding-top: 20px;
}
.proheader {
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
.professionmgr-container {
  min-height: 700px;
  background-color: #fff;
}
.container {
  width: auto;
  height: auto;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
}
</style>