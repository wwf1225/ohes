<template>
  <div class="rolebox">
    <!-- <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item >系统管理</el-breadcrumb-item>
                <el-breadcrumb-item >角色管理</el-breadcrumb-item>
            </el-breadcrumb>
    </div>-->
    <div class="rolemgr-container">
      <!-- 搜索框 -->
      <el-form
        :inline="true"
        :model="formQuery"
        ref="formQuery"
        label-width="0px"
        label-position="right"
        style="text-align:left;padding:10px 0px 0px 10px"
        class="demo-form-inline"
      >
        <el-form-item label prop="roleName">
          <el-input style="width:300px;" v-model="formQuery.roleName" placeholder="角色名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addRole()"
            v-if="config.hasPermission('sys:role:save')"
          >新增</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        align="left"
        v-loading="loading"
        border
        :data="tableData"
        element-loading-text="加载中"
        bordertooltip-effect="dark"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="number" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="createAt" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="updateAt" label="修改时间" align="center"></el-table-column>
        <el-table-column prop="remark" label="角色描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="config.hasPermission('sys:role:info')"
              @click="handleClick(scope.row)"
              title="查看"
            ><img src="../../assets/ck.png" alt></el-button>
            <el-button
              type="text"
              size="small"
              v-if="config.hasPermission('sys:role:update')"
              @click="roleEdit(scope.$index,scope.row)"
              title="编辑"
            ><img src="../../assets/bj.png" alt></el-button>
            <el-button
              type="text"
              size="small"
              v-if="config.hasPermission('sys:role:delete')"
              @click="roleDel(scope.$index, scope.row)"
              title="删除"
            ><img src="../../assets/sc.png" alt></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page_main">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          background
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          style="text-align:center"
        ></el-pagination>
      </div>
    </div>
    <!-- 查看角色弹出框 -->
    <el-dialog title="查看用户" width="45%" :visible.sync="dialogShowVisible">
      <el-form ref="form" :inline="false" :model="form" label-width="100px" id="classroom_add" style="text-align:left;width:70%;margin:0 auto">
        <el-form-item label="角色名称：" prop="name">
          <el-input placeholder="角色名称" v-model="form.name" style="width:470px" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="所属部门：" prop="deptId">
          <el-input
            placeholder="部门名称"
            v-model="form.deptName"
            style="width:470px"
            readonly="readonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="3" style="width:470px" readonly resize="none"></el-input>
        </el-form-item>
        <el-form-item label="权限选择：">
          <el-tree
            :data="departmentList"
            :check-strictly="true"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            :default-checked-keys="form.menuIdList"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <!-- :default-checked-keys="treeID" -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" class="ok" @click="closeShow">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      loading: true,
      config: config,
      formQuery: {
        roleName: ""
      },
      form: {
        name: "",
        deptName: "",
        deptIdList: [],
        remark: "",
        menuIdList: []
      },
      departmentList: [],
      defaultProps: {
        children: "list",
        label: "name"
      },
      deptId: "",
      tableData: [], //列表数据
      tableSelection: [], //数据表选择数据集合
      tableSelectObj: {}, //数据表单条选择数据对象
      page: 1, //当前页
      limit: 10, //每页显示条数
      totalCount: null, //总条数
      deleteID: [], //删除ID集合
      dialogShowVisible: false
    };
  },
  methods: {
    getRoleList() {
      this.loading = true;
      //
      axios
        .get(config.apiHost + "/sys/role/list", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            roleName: this.formQuery.roleName
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.tableData = result.data.page.list;
              this.totalCount = result.data.page.totalCount; //总条数
              this.loading = false;
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
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getRoleList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getRoleList();
    },

    // 表格添加
    addRole() {
      this.$router.replace({ path: "/home/sys-rolemgradd" });
    },
    // 表格查看
    handleClick(row) {
      this.getTree(); //权限树
      // console.log(row);
      this.form = row;
      this.dialogShowVisible = true;
    },
    //查看关闭
    closeShow() {
      this.dialogShowVisible = false;
      this.form = {};
    },
    //获取权限
    getTree() {
      axios
        .get(config.apiHost + "/sys/menu/list", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(result => {
          this.departmentList = result.data;
          // console.log(this.departmentList);
        })
        .catch(function(response) {
          this.$message.error(response);
        });
    },
    roleDetail(index, row) {
      //表格查看
    },

    roleEdit(index, row) {
      //表格编辑
      this.$store.dispatch("showRoleDetail", row);
      this.$router.replace({ path: "/home/sys-rolemgrupdate" });
    },

    //表格点击删除
    roleDel(index, row) {
      // console.log("删除。。。");
      this.deleteID.push(row.id);
      this.$confirm("确定要删除角色吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            this.deleteRole();
          } else {
            //点击取消
            this.$message({
              typ: "info",
              message: "已取消删除"
            });
          }
        },
        type: "warning"
      });
    },
    // 删除角色
    deleteRole() {
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/sys/role/delete",

        data: this.deleteID,

        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      }).then(res => {
        if (res.data.status == "200") {
          this.getRoleList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          return res.data;
        }
      });
    },
    roleOldPwd(index, row) {
      //表格初始密码
    }
  },
  created() {
    this.getRoleList();
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
.rolemgr-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
  /* padding-bottom: 30px; */
}
.page_main {
  text-align: right;
  margin: 45px 15px 20px 0px;
}
.top-main {
  height: 45px;
  line-height: 45px;
  text-align: left;
  padding-left: 10px;
  margin-bottom: 5px;
  background-color: #f6f7fb;
}
.dialog-footer{
  text-align: center;
}
.ok {
  width: 150px;
  font-size: 14px;
  background: #429e73;
  color: #fff;
}
.ok:hover {
  background: #006636;
}
</style>