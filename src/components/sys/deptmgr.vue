<template>
  <div>
    <el-form
      :inline="true"
      :model="formQuery"
      ref="formQuery"
      label-width="0px"
      label-position="right"
      style="text-align:left;"
      class="demo-form-inline"
    >
      <el-form-item label prop="userName">
        <el-input style="width:300px;" v-model="formQuery.depName" placeholder="部门"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getDeptList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add()" v-if="config.hasPermission('sys:depat:save')">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      align="left"
      :data="tableData"
      element-loading-text="加载中"
      bordertooltip-effect="dark"
      style="width: 100%"
      @select="selectTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="depId" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="部门" align="center"></el-table-column>

      <el-table-column label="负责人" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.principalUser!=null">{{scope.row.principalUser.account}}</span>
          <!-- {{scope.row.principalUser.account}} -->
          <span v-else-if="scope.row.principalUser==null">无</span>
        </template>
      </el-table-column>

      <el-table-column label="联系方式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.principalUser!=null">{{scope.row.principalUser.mobile}}</span>
          <!-- {{scope.row.principalUser.account}} -->
          <span v-else-if="scope.row.principalUser==null">无</span>
        </template>
      </el-table-column>

      <el-table-column prop="memberNum" label="成员数" align="center"></el-table-column>
      <el-table-column prop="parentName" label="上级部门" align="center"></el-table-column>
      <el-table-column prop="updateAt" label="修改时间" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="config.hasPermission('sys:depat:update')"
            @click="depEdit(scope.$index,scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="config.hasPermission('sys:depat:delete')"
            @click="depDel(scope.$index,scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--部门添加弹出框-->
    <el-dialog title="部门添加" :visible.sync="dialogAddVisible" :before-close="handleClose">
      <el-form :model="form">
        <div class="postDiv">
          <label for="form.name" class="lab">部门：</label>
          <div class="inp">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </div>
        </div>
        <div class="postDiv">
          <label for="form.areaId" class="lab">部门所在地：</label>
          <div class="inp">
            <el-select v-model="form.areaId" placeholder="请选择">
              <el-option
                v-for="item in areaData"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <!-- <div class="postDiv">
                    <label for="form.ids " class="lab">负责人：</label>
                    <div class="inp">
                        <el-select v-model="form.ids" multiple placeholder="请选择">
                            <el-option
                            v-for="item in userData"
                            :key="item.id"
                            :label="item.account"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="postDiv">
                    <label for="form.principal" class="lab">首要领导：</label>
                    <div class="inp">
                        <el-select v-model="form.principal" placeholder="请选择">
                            <el-option
                            v-for="item in userData"
                            :key="item.id"
                            :label="item.account"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
        </div>-->
        <div class="postDiv">
          <label for="form.parentId" class="lab">上级部门：</label>
          <div class="inp">
            <el-select v-model="form.parentId" placeholder="请选择">
              <el-option
                v-for="item in deptData"
                :key="item.depId"
                :label="item.name"
                :value="item.depId"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <!--部门编辑弹出框-->
    <el-dialog title="部门编辑" :visible.sync="dialogUpdateVisible" :before-close="handleClose">
      <el-form :model="form">
        <div class="postDiv">
          <label for="form.name" class="lab">部门：</label>
          <div class="inp">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </div>
        </div>
        <div class="postDiv">
          <label for="form.areaId" class="lab">部门所在地：</label>
          <div class="inp">
            <el-select v-model="form.areaId" placeholder="请选择">
              <el-option
                v-for="item in areaData"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="postDiv">
          <label for="form.ids" class="lab">负责人：</label>
          <div class="inp">
            <el-select v-model="form.ids" multiple placeholder="请选择">
              <el-option
                v-for="item in userData"
                :key="item.id"
                :label="item.account"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="postDiv">
          <label for="form.principal" class="lab">首要领导：</label>
          <div class="inp">
            <el-select v-model="form.principal" placeholder="请选择">
              <el-option
                v-for="item in userData"
                :key="item.id"
                :label="item.account"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="postDiv">
          <label for="form.parentId" class="lab">上级部门：</label>
          <div class="inp">
            <el-select v-model="form.parentId" placeholder="请选择">
              <el-option
                v-for="item in deptData"
                :key="item.depId"
                :label="item.name"
                :value="item.depId"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateClose">取 消</el-button>
        <el-button type="primary" @click="updateDept">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.postDiv {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.lab {
  display: inline-block;
  width: 100px;
}
.inp {
  width: 300px;
}
</style>


<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      config: config,
      formQuery: {
        depName: ""
      },
      form: {
        depId: "",
        name: "", //部门名称
        areaId: "", //部门所在地
        ids: [], //负责人id
        principal: "", //首领
        parentId: null //上级部门
      },
      tableData: [],
      deptData: [], //部门列表
      areaData: [], //部门所在地列表
      userData: [], //用户列表
      dialogAddVisible: false,
      dialogUpdateVisible: false
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.form = {
            depId: "",
            name: "", //部门名称
            ids: [], //负责人id
            principal: "", //首领
            parentId: null //上级部门
          };
          done();
        })
        .catch(_ => {});
    },
    //得到部门列表
    getDeptList() {
      //
      axios
        .get(config.apiHost + "/sys/dept/list", {
          params: {
            //请求参数
            token: config.token,
            depName: this.formQuery.depName
          }
        })
        .then(
          result => {
            if (result.status == 200) {
              this.tableData = result.data;
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
    selectTable(selection, val) {
      this.tableSelection = selection;
      this.tableSelectObj = val;
    },
    handleSelectionChange(selection) {
      this.tableSelection = selection;
    },
    // 验证
    showValidate() {
      var val = this;
      const { name, areaId, parentId } = this.form;
      console.log(this.form);
      if (name.trim() == "" || areaId == "" || parentId == null) {
        this.$message({ type: "error", message: "信息不能为空！" });

        return;
      } else {
        return true;
      }
    },
    //点击添加
    add() {
      this.dialogAddVisible = true;
      this.getdept();
      this.getArea();
      this.getUserList();
    },
    //确认添加
    confirm() {
      // console.log(this.form);
      if (this.showValidate()) {
        axios({
          method: "post",
          // /api
          url: config.apiHost + "/sys/dept/save",
          data: this.form,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        })
          .then(res => {
            //  console.log(res);
            if (res.data.status == "200") {
              this.getDeptList();
              //  初始化表单对象
              this.form = {
                depId: "",
                name: "", //部门名称
                ids: [], //负责人id
                principal: "", //首领
                parentId: null //上级部门
              };
              this.dialogAddVisible = false;
              this.$message(res.data.body.msg);
            } else {
              this.$message({ type: "error", message: res.data.body.message });
            }
            return res.data;
          })
          .catch(function(response) {
            //   this.$message.error(error);
            // console.log(response);
          });
      }
    },
    //取消添加
    addClose() {
      this.dialogAddVisible = false;
      this.form = {
        depId: "",
        name: "", //部门名称
        ids: [], //负责人id
        principal: "", //首领
        parentId: null //上级部门
      };
    },
    //列表中的编辑事件
    depEdit(index, row) {
      // console.log("输出row。。。")
      // console.log(row);
      if (row.leaderUser.length > 0) {
        row.leaderUser.forEach(item => {
          this.form.ids.push(item.id);
        });
      }
      if (row.principalUser != null) {
        this.form.principal = row.principalUser.id; //首领
      } else {
        this.form.principal = "";
      }
      // console.log("输出ids。。。")
      // console.log(this.form.ids)
      // console.log("输出depId。。。")
      // console.log(row.depId)
      (this.form.depId = row.depId),
        (this.form.areaId = row.areaId),
        (this.form.name = row.name),
        (this.form.parentId = row.parentId),
        this.getdept();
      this.getArea();
      this.getUserList(row.depId);
      // console.log(this.form)
      this.dialogUpdateVisible = true;
    },
    //确认编辑
    updateDept() {
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/sys/dept/update",
        data: this.form,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      })
        .then(res => {
          //  console.log(res);
          if (res.data.status == "200") {
            this.getDeptList();
            //  初始化表单对象
            this.form = {
              depId: "",
              name: "", //部门名称
              ids: [], //负责人id
              principal: "", //首领
              parentId: null //上级部门
            };
            this.dialogUpdateVisible = false;
            this.$message(res.data.body.msg);
          }
          return res.data;
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //取消编辑
    updateClose() {
      this.dialogUpdateVisible = false;
      this.form = {
        depId: "",
        name: "", //部门名称
        ids: [], //负责人id
        principal: "", //首领
        parentId: null //上级部门
      };
    },
    depDel(index, row) {
      //列表中的删除事件
      this.$confirm("确定要删除该部门吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //
            axios
              .get(config.apiHost + "/sys/dept/delete", {
                params: {
                  //请求参数
                  token: config.token,
                  deptId: row.depId
                }
              })
              .then(
                result => {
                  //  console.log(result);
                  if (result.data.status == 200) {
                    this.getDeptList();
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
    },
    //得到部门
    getdept() {
      //
      axios
        .get(config.apiHost + "/sys/dept/list", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(result => {
          if (result.status == 200) {
            this.deptData = result.data;
            this.deptData.unshift({ depId: 0, name: "一级部门" });
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //得到部门所在地
    getArea() {
      axios
        .get(config.apiHost + "/basedata/area/selectAll", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(result => {
          if (result.status == 200) {
            this.areaData = result.data.body;
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //   用户列表
    getUserList(depId) {
      // console.log("用户列表~")
      //  console.log(depId)
      //
      axios
        .get(config.apiHost + "/sys/user/listUser", {
          params: {
            //请求参数
            depId: depId,
            token: config.token
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.userData = result.data.body;
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    }
  },
  created() {
    this.getDeptList();
  }
};
</script>
