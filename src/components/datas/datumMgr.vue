<template>
  <div class="datum-box" :key="formQuery.typeId">
    <!-- <div class="top-main">资料管理</div> -->
    <div class="datum-container">
      <el-tabs type="border-card" style=" min-height: 800px;">
        <!-- 资料信息列表 -->
        <el-tab-pane label="资料信息列表">
          <el-form
            :inline="true"
            :model="formQuery"
            label-width="0px"
            label-position="right"
            style="text-align:center"
            class="demo-form-inline"
          >
            <el-form-item>
              <el-button
                type="primary"
                v-if="config.hasPermission('data:database:save')"
                @click="datumAdd()"
              >添加</el-button>
            </el-form-item>
            <el-form-item label>
              <el-select v-model="formQuery.typeId" placeholder="请选择" @change="typeChange">
                <el-option
                  v-for="item in selectData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-input style="width:300px;" v-model="formQuery.title" placeholder="请输入资料标题"></el-input>
              <el-button type="primary" @click="getDatumList()">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            border
            align="left"
            :data="tableData"
            element-loading-text="加载中"
            bordertooltip-effect="dark"
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="no" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="typeName" label="类别" width="120" align="center"></el-table-column>
            <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
            <el-table-column label="是否重要" width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.setTop==0">普通</span>
                <span v-else-if="scope.row.setTop==1">置顶</span>
              </template>
            </el-table-column>
            <el-table-column label="是否显示" width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.displayFlag==0" style="color:#666666">
                  <i class="el-icon-error"></i>
                </span>
                <span v-else-if="scope.row.displayFlag==1" style="color:#0066FF">
                  <i class="el-icon-success"></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createAt" label="添加日期" width="250" align="center"></el-table-column>
            <el-table-column prop="updateAt" label="修改日期" width="250" align="center"></el-table-column>

            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="config.hasPermission('data:database:update')"
                  type="text"
                  size="small"
                  title="查看"
                  @click="showDatum(scope.row)"
                >
                  <img src="../../assets/ck.png" alt>
                </el-button>
                <el-button
                  v-if="config.hasPermission('data:database:update')"
                  type="text"
                  size="small"
                  title="编辑"
                  @click="updateDatum(scope.row)"
                >
                  <img src="../../assets/bj.png" alt>
                </el-button>
                <el-button
                  v-if="config.hasPermission('data:database:delete')"
                  type="text"
                  size="small"
                  title="删除"
                  @click="delDatum(scope.row)"
                >
                  <img src="../../assets/sc.png" alt>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page_main">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="limit"
              layout="total, prev, pager, next, jumper"
              :total="totalCount"
              background
              style="text-align:center"
            ></el-pagination>
          </div>
        </el-tab-pane>

        <!-- 类别 -->
        <el-tab-pane label="类别">
          <el-form
            :inline="true"
            label-width="0px"
            label-position="right"
            style="text-align:center"
            class="demo-form-inline"
          >
            <el-form-item>
              <el-button
                type="primary"
                v-if="config.hasPermission('data:database:save')"
                @click="typeAdd()"
              >添加</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            border
            align="left"
            :data="tableData2"
            element-loading-text="加载中"
            bordertooltip-effect="dark"
            style="width: 100%"
            v-loading="loading2"
          >
            <el-table-column prop="no" label="序号" align="center" width="80"></el-table-column>
            <el-table-column prop="name" label="类别名称" align="center"></el-table-column>
            <el-table-column prop="details" label="描述" align="center"></el-table-column>
            <el-table-column prop="updateAt" label="添加时间" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:database:update')"
                  @click="typeUpdate(scope.row)"
                  title="编辑"
                >
                  <img src="../../assets/bj.png" alt>
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:database:delete')"
                  @click="typeDel(scope.row)"
                  title="删除"
                >
                  <img src="../../assets/sc.png" alt>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page_main">
            <el-pagination
              @current-change="handleCurrentChange2"
              :current-page="page2"
              :page-size="limit2"
              layout="total, prev, pager, next, jumper"
              :total="typeTotalCount"
              background
              style="text-align:center"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加类别信息 -->
    <el-dialog title="类别信息" :visible.sync="typeVisible" :before-close="handleClose">
      <div class="row_div">
        <div class="my_inp">类别名称</div>
        <el-input placeholder="请输入类别名称" style="width:400px;" v-model="typeForm.name"></el-input>
      </div>
      <div class="row_div" style=" align-items: flex-start;">
        <div class="my_inp">描述</div>
        <textarea
          style="width:calc(100% - 80px);min-height: 200px;"
          placeholder="请输入内容"
          v-model="typeForm.details"
        ></textarea>
      </div>

      <div class="row_div btn_style">
        <el-button type="info" size="medium" @click="closeAdd">取消</el-button>
        <el-button type="primary" size="medium" style="margin-left:50px" @click="confirm">保存</el-button>
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
      loading: true,
      loading2: true,
      formQuery: {
        title: "",
        typeId: 0,
        parentId: 0,
        menuname: ''
      },
      selectData: [], //下拉框
      typeForm: {
        id: null,
        name: null, //类别名称
        details: null, //描述
        systemKey: null,
        parentId: null,
        menuname: null
      },
      config: config,
      systemKey: "test",
      limit: 10, //每页条数
      page: 1, //当前页
      totalCount: null, //总条数
      totalPage: null, //总页数
      tableData: [], //列表数据

      limit2: 10, //每页条数
      page2: 1, //当前页
      typeTotalCount: null, //总条数
      totalPage2: null, //总页数
      tableData2: [], //列表数据

      typeVisible: false,
      mtype: ""
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getDatumList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getDatumList();
    },
    handleSizeChange2(val) {
      // console.log(`每页 ${val} 条`);
      this.limit2 = val;
      this.getTypeList();
    },
    handleCurrentChange2(val) {
      // console.log(`当前页: ${val}`);
      this.page2 = val;
      this.getTypeList();
    },
    // 得到资料列表
    getDatumList() {
      axios
        .get(config.datumUrl + "/resource/data/listResource", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            systemKey: this.systemKey,
            title: this.formQuery.title,
            typeId: this.formQuery.typeId,
            parentId: this.formQuery.parentId,
            name: this.formQuery.menuname
          }
        })
        .then(result => {
          //  console.log("请求返回。。。");
          if (result.data.status == 200) {
            this.tableData = result.data.body.list;
            this.totalCount = result.data.body.totalCount; //总条数
            this.loading = false;
            this.getTypeList();
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    // 得到类别列表
    getTypeList() {
      axios
        .get(config.datumUrl + "/resource/data/resTypeList", {
          params: {
            //请求参数
            page: this.page2,
            limit: this.limit2,
            systemKey: this.systemKey,
            // typeId: this.formQuery.typeId,
            parentId: this.formQuery.parentId,
            name: this.formQuery.menuname
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData2 = result.data.body.list;
            this.typeTotalCount = result.data.body.totalCount; //总条数
            this.loading2 = false;
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    // 资料添加
    datumAdd() {
      // /home/datum-Add
      this.$router.push({
        name: "datum-Add",
        params: { dtype: "添加", systemKey: this.systemKey }
      });
    },
    //资料查看
    showDatum(row) {
      this.$router.push({
        name: "datum-Detail",
        params: { id: row.id, systemKey: this.systemKey }
      });
    },
    //资料修改
    updateDatum(row) {
      this.$router.push({
        name: "datum-Add",
        params: { id: row.id, dtype: "编辑", systemKey: this.systemKey }
      });
    },
    // 资料删除
    delDatum(row) {
      this.$confirm("确定要删除该资料吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios({
              method: "post",
              url: config.datumUrl + "/resource/data/deleteResource",
              data: {
                id: row.id,
                systemKey: this.systemKey
              }
            }).then(
              result => {
                if (result.data.status == 200) {
                  //删除成功
                  this.getDatumList();
                  this.$message.success(result.data.body.msg);
                } else {
                  //删除失败
                  this.$message.error(result.data.body.message);
                }
              },
              error => {
                this.$message.error(error);
              }
            );
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
    // 关闭弹出框触发的事件
    handleClose() {
      this.typeForm.id = null;
      this.typeForm.name = null;
      this.typeForm.details = null;
      this.typeForm.systemKey = this.systemKey;
      this.typeVisible = false;
    },
    //添加类型
    typeAdd() {
      this.mtype = "添加";
      this.typeVisible = true;
    },
    //修改类型
    typeUpdate(row) {
      this.mtype = "修改";
      this.typeVisible = true;
      this.typeForm = {
        id: row.id,
        name: row.name, //类别名称
        details: row.details, //描述
        systemKey: this.systemKey,
        pare: this.$store.state.meun.navlist[7].list[0].id
      };
    },
    // 删除类型
    typeDel(row) {
      this.$confirm("确定要删除该类型吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios({
              method: "post",
              url: config.datumUrl + "/resource/data/deleteResType",
              data: {
                id: row.id,
                systemKey: this.systemKey
              }
            }).then(
              result => {
                if (result.data.status == 200) {
                  //删除成功
                  this.getTypeList();
                  this.$message.success(result.data.body.msg);
                } else {
                  //删除失败
                  this.$message.error(result.data.body.message);
                }
              },
              error => {
                this.$message.error(error);
              }
            );
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
    closeAdd() {
      this.typeVisible = false;
      this.typeForm.id = null;
      this.typeForm.name = null;
      this.typeForm.details = null;
      this.typeForm.systemKey = this.systemKey;
    },
    confirm() {
      if (this.mtype == "添加") {
        if (this.typeForm.name == null || this.typeForm.details == null) {
          this.$message.error("请填写内容");
          return;
        }
        this.confirmAdd();
      } else if (this.mtype == "修改") {
        if (this.typeForm.name == null || this.typeForm.details == null) {
          this.$message.error("请填写内容");
          return;
        }
        this.confirmUpdate();
      }
    },
    // 添加类别
    confirmAdd() {
      axios({
        method: "post",
        url: config.datumUrl + "/resource/data/insertResType",
        data: this.typeForm
      })
        .then(res => {
          if (res.data.status == 200) {
            this.$message.success(res.data.body.msg);
            this.typeForm.id = null;
            this.typeForm.name = null;
            this.typeForm.details = null;
            this.typeForm.systemKey = this.systemKey;
            this.typeVisible = false;
            this.getTypeList();
          } else {
            this.$message.error(res.data.body.message);
            this.typeVisible = false;
          }
        })
        .catch(error => {
          console.log("error", error);
          // this.$message.error();
        });
    },
    //修改类别
    confirmUpdate() {
      axios({
        method: "post",
        url: config.datumUrl + "/resource/data/updateResType",
        data: this.typeForm
      })
        .then(res => {
          if (res.data.status == 200) {
            this.$message.success(res.data.body.msg);
            this.typeForm.id = null;
            this.typeForm.name = null;
            this.typeForm.details = null;
            this.typeForm.systemKey = this.systemKey;
            this.typeVisible = false;
            this.getTypeList();
          } else {
            this.$message.error(res.data.body.message);
            this.typeVisible = false;
          }
        })
        .catch(error => {
          console.log("error", error);
          // this.$message.error();
        });
    },
    // 查询类别列表数据
    getSelect() {
      axios
        .get(config.datumUrl + "/resource/data/resTypeList", {
          params: {
            //请求参数
            page: 1,
            limit: 1000,
            systemKey: this.systemKey,
            typeId: this.formQuery.typeId,
            parentId: this.formQuery.parentId,
            name: this.formQuery.menuname
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.selectData = result.data.body.list;
            // console.log(this.selectData);
            this.selectData.unshift({
              id: 0,
              name: "全部"
            });
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    // select Change
    typeChange() {
      this.getDatumList();
    }
  },
  created() {
    // this.systemKey = this.$route.params.systemKey;
    // this.getTypeList();
    // this.getSelect();
    this.typeForm.systemKey = this.systemKey;
    this.getDatumList();
  },
  watch: {
    $route: {
      handler(to, from) {
        // let menuindex = this.$store.state.meun.navlist.findIndex(v => {
        //   v.name === "知识库管理"
        // });
        let navItem = this.$store.state.meun.navlist[7];
        let name = "";
        let parentId = '';
        switch (to.path) {
          case "/home/data-datumMgr/test":
            // this.formQuery.typeId = navItem.list[0].id;
            parentId = navItem.list[0].id;
            name = "规范文档";
            break;
          case "/home/data-datumMgr/test1":
            // this.formQuery.typeId = navItem.list[1].id;
            parentId = navItem.list[1].id;
            name = "知识经验";
            break;
          case "/home/data-datumMgr/test2":
            // this.formQuery.typeId = navItem.list[2].id;
            parentId = navItem.list[2].id;
            name = "传染病知识库";
            break;
          // case "/home/data-datumMgr/test3":
          // this.formQuery.typeId = navItem.list[2].id;
          // this.formQuery.parentId = navItem.list[2].id;
          // name = "传染病知识库";
          // break;
        }
        this.formQuery.parentId = parentId;
        this.formQuery.menuname = name;
        this.typeForm.parentId = parentId;
        this.typeForm.menuname = name;
        let index = this.$store.state.tabs.options.findIndex(
          v => v.route === to.path
        );
        if (index !== -1) {
          this.$store.state.tabs.options[index].name = name;
        }
        // this.tableData = [];
        // this.systemKey = this.$route.params.systemKey;
        this.formQuery.typeId = 0;
        this.getDatumList();
        this.getSelect();
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.datum-box {
  width: auto;
  min-height: 100%;
  background-color: #e2e6ef;
  padding: 10px 10px 45px;
  box-sizing: border-box;
  padding-bottom: 100px;
}
.top-main {
  height: 45px;
  line-height: 45px;
  text-align: left;
  padding-left: 10px;
  margin-bottom: 5px;
  background-color: #f6f7fb;
}
.datum-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
  /* padding-bottom: 30px; */
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  text-align: left;
  background-color: rgb(255, 255, 255);
  padding-left: 10px;
  padding-top: 20px;
}
.row_div {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.my_inp {
  width: 80px;
  text-align: left;
}
.btn_style {
  margin-top: 30px;
}
.page_main {
  text-align: right;
  margin: 20px 15px 20px 0px;
}
</style>


