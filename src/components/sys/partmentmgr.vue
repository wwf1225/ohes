<template>
  <div class="partmentmgr-container">
    <div class="tab_main">
      <!-- 左侧 -->
      <div class="content" id="tree-row">
        <div class="left_main">
          <!-- <el-tree
            :data="data5"
            :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, data }"  @click="() => getNode(data)">
                <span>{{ node.label }}</span>
                <span>
                    <el-button type="text" size="mini" @click.stop="() => append(data)">
                        <i class="el-icon-plus"></i>
                    </el-button>
                    <el-button type="text" size="mini" @click.stop="() => remove(node, data)">
                        <i class="el-icon-delete"></i>
                    </el-button>
                </span>
            </span>
          </el-tree>-->
          <Tree :data="data5" :render="renderContent"></Tree>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right_main">
        <div class="content">
          <div class="head">
            <el-form class="top-form" :inline="true" :model="formQuery">
              <el-form-item label="搜索">
                <el-input v-model="formQuery.search" placeholder="请输入"></el-input>
              </el-form-item>
              <!-- <el-form-item label="所属部门">
                <el-cascader
                  :options="deptCascader"
                  change-on-select
                  :props="defaultProps"
                  clearable
                ></el-cascader>
              </el-form-item>-->
              <el-form-item>
                <el-button type="primary" @click="getTableList">查询</el-button>
              </el-form-item>
              <el-form-item style="float:right">
                <el-button type="primary" @click="showAddPerson">
                  <i class="el-icon-circle-plus-outline"></i> 新增
                </el-button>
                <el-button class="delete" @click="delSome">
                  <i class="el-icon-delete"></i> 删除
                </el-button>
                <el-button class="insert" @click="insertSome">
                  <i class="el-icon-news"></i> 导入
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="con">
            <el-table
              id="listTable"
              ref="multipleTable"
              align="left"
              border
              v-loading="loading"
              :data="tableData"
              element-loading-text="加载中"
              bordertooltip-effect="dark"
              style="width: 100%"
              @select="selectTable"
              @selection-change="handleSelectionChange"
              @row-dblclick="rowDblclick"
            >
              <!-- @select="selectTable"
              @selection-change="handleSelectionChange"
              @row-dblclick="rowDblclick"-->
              <el-table-column type="selection" width="80" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
              <el-table-column prop="deptName" label="部门" align="center"></el-table-column>
              <el-table-column prop="account" label="姓名" align="center"></el-table-column>
              <el-table-column label="性别" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.sex==='MALE'?'男':'女'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="birth" label="出生年月日" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.birth">{{scope.row.birth.substr(0,10)}}</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column prop="profession" label="职称" align="center"></el-table-column>
              <el-table-column prop="major" label="专业" align="center"></el-table-column>
              <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    title="删除"
                    @click.native.prevent="deleteRow(scope.row)"
                  >
                    <img src="../../assets/sc.png" alt>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              background
              layout="total, prev, pager, next, jumper"
              :total="totalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 增加人 -->
    <el-dialog
      width="35%"
      class="add-dialog"
      :title="isUpdate?'查看编辑':'增加'"
      :visible.sync="dialogAddVisible"
      @close="closeAdd"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dialogAddForm"
        :inline="true"
        class="add-form"
        size="small"
        ref="addPersonForm"
      >
        <el-form-item label="人员姓名" class="requiredChar" prop="account">
          <el-input v-model="dialogAddForm.account" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="人员性别" class="requiredChar" prop="sex">
          <el-select v-model="dialogAddForm.sex" placeholder>
            <el-option label="男" value="MALE"></el-option>
            <el-option label="女" value="FEMALE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员部门" class="requiredChar" prop="depId">
          <el-select v-model="dialogAddForm.depId" placeholder="请选择">
            <el-option
              v-for="item in depArr"
              :key="item.depId"
              :label="item.name"
              :value="item.depId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职　　称" prop="profession">
          <el-input v-model="dialogAddForm.profession" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="系统角色" class="requiredChar">
          <el-select
            v-model="dialogAddForm.roleStatus"
            placeholder="请选择"
            id="RL"
            @change="changeRole"
          >
            <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月" prop="birth">
          <el-date-picker v-model="dialogAddForm.birth" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="省　 (市)" prop="city">
          <el-input v-model="dialogAddForm.city" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="专　　业" prop="major">
          <el-input v-model="dialogAddForm.major" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="办公电话" prop="tel">
          <el-input v-model="dialogAddForm.tel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="dialogAddForm.mobile" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="dialogAddForm.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="家庭电话" prop="houseTel">
          <el-input v-model="dialogAddForm.houseTel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="通讯地址" prop="contactAddress">
          <el-input v-model="dialogAddForm.contactAddress" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" class="pwd" prop="address">
          <el-input v-model="dialogAddForm.address" placeholder="请输入"></el-input>
          <!-- <el-button type="text" size="mini">
            <img src="../../assets/dt.png">
          </el-button>-->
        </el-form-item>
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="dialogAddForm.companyName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postalcode">
          <el-input v-model="dialogAddForm.postalcode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="单位传真" prop="fax">
          <el-input v-model="dialogAddForm.fax" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="负责人姓名" prop="principalsName">
          <el-input v-model="dialogAddForm.principalsName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="pwd requiredChar" label="账户密码">
          <el-input v-model="dialogAddForm.password" placeholder="请输入" :type="mimaType"></el-input>
          <el-button type="text" size="mini" @click="showPwd">
            <img v-if="mimaType=='password'" src="../../assets/by.png">
            <img v-else src="../../assets/zy.png">
          </el-button>
        </el-form-item>
        <el-form-item label="负责人手机" prop="principalsTel">
          <el-input v-model="dialogAddForm.principalsTel" placeholder="请输入"></el-input>
        </el-form-item>
        <!--  -->
        <el-form-item label="账户状态" prop="status" class="requiredChar">
          <el-select v-model="dialogAddForm.status" id="myStatus" placeholder="请选择">
            <el-option label="激活" :value="0"></el-option>
            <el-option label="未激活" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!--  -->
        <div class="address">
          <label class="el-form-item__label" style="line-height: 32px">专业特长</label>
          <div>
            <el-input v-model="dialogAddForm.speciality" size="small" placeholder="请输入"></el-input>
          </div>
        </div>
        <div class="address">
          <label class="el-form-item__label" style="line-height: 32px">卫生应急经历</label>
          <div>
            <el-input
              type="textarea"
              :rows="3"
              v-model="dialogAddForm.experience"
              resize="none"
              placeholder="请输入"
            ></el-input>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel" type="text" size="small" @click="closeAdd">取 消</el-button>
        <el-button class="ok" type="text" size="small" v-if="isUpdate" @click="insertAdd">确 定</el-button>
        <el-button class="ok" type="text" size="small" v-else @click="updateAdd(dbclickRow.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 增加部门 -->
    <el-dialog
      width="20%"
      class="add-dialog add-dep"
      title="添加部门"
      :visible.sync="dialogAddDepVisible"
      @close="cancelAddDep"
    >
      <el-form :model="addDepForm" label-width="100px" ref="addDepForm" :rules="addDepFormRules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addDepForm.name" placeholder="请输入" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="部门地区" prop="areaId">
          <el-select v-model="addDepForm.areaId" filterable placeholder="请选择" style="width:220px">
            <el-option
              v-for="item in areaData"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel" type="text" size="small" @click="cancelAddDep">取 消</el-button>
        <el-button class="ok" type="text" size="small" @click="confirmAddDep">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑部门 -->
    <el-dialog
      width="21%"
      class="add-dialog update-dep"
      title="编辑部门"
      style="text-align:center"
      :visible.sync="dialogAddUpdateDepVisible"
    >
      <el-form label-width="90px">
        <el-form-item label="部 门 名 称">
          <el-input v-model="form.name" auto-complete="off" style="width:260px"></el-input>
        </el-form-item>
        <el-form-item label="部门所在地">
          <el-select v-model="form.areaId" placeholder="请选择" style="width:260px">
            <el-option
              v-for="item in areaData"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领　　　导">
          <el-select v-model="form.ids" multiple placeholder="请选择" style="width:260px">
            <el-option
              v-for="item in userData"
              :key="item.id"
              :label="item.account"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负　责　人">
          <el-select v-model="form.principal" placeholder="请选择" style="width:260px">
            <el-option
              v-for="item in userData"
              :key="item.id"
              :label="item.account"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联 系 电 话">
          <el-input v-model="form.mobile" auto-complete="off" readonly style="width:260px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="ok" type="text" size="small" @click="confirmUpdate">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 导入文件弹窗 -->
    <el-dialog
      width="22%"
      class="add-dialog add-upload"
      title="批量导入"
      :visible.sync="dialogInsertVisible"
      style="text-align:center"
    >
      <el-form>
        <el-upload
          :action="uploadUrl"
          :data="importData"
          :limit="limit"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :file-list="fileList"
          accept=".xls, .xlsx"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传 xls / xlsx 文件</div>
        </el-upload>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import md5 from "js-md5";
var config = require("@/components/utils/Common_Config.js");
var treetj = require("@/assets/treetj.png");
var treezj = require("@/assets/treezj.png");
var treebj = require("@/assets/treebj.png");
var treesc = require("@/assets/treesc.png");
export default {
  data() {
    return {
      loading: false,
      // deptId: null,
      treeData: [], //列表数据
      activeName: "first",
      viewPage: "deptmgr",
      // left tree
      data5: [],
      activeDepId: 0,
      // right head
      formQuery: {
        search: "",
        deptId: ""
      },
      deptCascader: [],
      // defaultProps: {
      //   value: "depId",
      //   label: "name",
      //   children: "children"
      // },
      // 添加部门
      dialogAddDepVisible: false,
      addDepForm: {
        name: "", //部门名称
        areaId: "",
        parentId: 0, //上级部门
        depId: "",
        ids: [], //领导
        principal: "" //负责人id
      },
      addDepFormRules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        areaId: [
          { required: true, message: "请选择部门所在地", trigger: "change" }
        ]
      },
      // 编辑部门
      dialogAddUpdateDepVisible: false,
      form: {
        depId: "",
        name: "", //部门名称
        areaId: "", //部门所在地
        ids: [], //领导
        principal: "", //负责人id
        parentId: null, //上级部门
        mobile: ""
      },
      userData: [],
      areaData: [],
      // 导入
      dialogInsertVisible: false,
      limit: 1,
      // uploadUrl: "/Fileupload/import/importDepMembers", //导入接口
      uploadUrl: config.apiHost+"/import/importDepMembers", //导入接口
      importData: {
        depId: "",
        token: config.token
      },
      fileName: "",
      fileList: [],
      // 添加人
      dialogAddVisible: false,
      isUpdate: false,
      mimaType: "text",
      dbclickRow: {},
      depArr: [],
      dialogAddForm: {
        account: "",
        sex: "MALE",
        depId: "",
        profession: "",
        roleStatus: "",
        birth: "",
        city: "",
        major: "",
        tel: "",
        mobile: "",
        email: "",
        houseTel: "",
        contactAddress: "",
        address: "",
        companyName: "",
        postalcode: "",
        principalsName: "",
        fax: "",
        principalsTel: "",
        password: "",
        status: 0,
        speciality: "",
        experience: "",
        roleIdList: [],
        stationId: 1 //岗位ID(暂定)
      },
      roleData: [], //角色下拉框
      deleteID: [], //选中的删除id
      selectID: [], //复选框
      // right table
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {
    ...mapGetters(["isNode", "isnums"])
  },
  methods: {
    // 获取左边Tree部门
    getDefaultArea() {
      axios
        .get(config.apiHost + "/sys/dept/dept-menu-list", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(result => {
          if (result.status == 200) {
            this.treeData = result.data;
            this.deptCascader = result.data;
            this.setArr(result.data);
            this.activeDepId = this.data5[0].depId;
            this.getTableList(this.activeDepId);
          }
        })
        .catch(function(response) {});
    },
    setArr(arr) {
      for (const v of arr) {
        this.$set(v, "expand", false);
        this.$set(v, "title", v.name);
        if (v.children) {
          for (const v1 of v.children) {
            this.$set(v1, "expand", true);
            this.$set(v1, "title", v1.name);
            if (v1.children) {
              for (const v2 of v1.children) {
                this.$set(v2, "expand", true);
                this.$set(v2, "title", v2.name);
                if (v2.children) {
                  for (const v3 of v2.children) {
                    this.$set(v3, "expand", true);
                    this.$set(v3, "title", v3.name);
                  }
                }
              }
            }
          }
        }
      }
      this.data5 = arr;
    },
    // 渲染tree
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "95%",
            textAlign: "left",
            fontWeight: "bold",
            fontSize: "14px",
            color: "#444",
            paddingRight: "5%",
            boxSizing: "border-box"
          },
          class: data.depId == this.activeDepId ? "active" : "",
          on: {
            click: () => {
              this.activeDepId = data.depId;
              this.importData.depId = data.depId;
              this.getTableList(data.depId);
            }
          }
        },
        [
          h("span", [h("span", data.title)]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right"
              }
            },
            [
              // 添加同级button
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  // icon: "md-git-network",
                  type: "text",
                  size: "small"
                }),
                style: {
                  marginRight: "3px",
                  height: "20px",
                  width: "20px",
                  borderRadius: "50%",
                  padding: "0",
                  marginBottom: "2px",
                  background: `url(${treetj}) no-repeat center`
                },
                title: "添加同级部门",
                on: {
                  click: () => {
                    this.dialogAddDepVisible = true;
                    this.addDepForm.parentId = data.parentId;
                  }
                }
              }),
              // 添加子级button
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  type: "text",
                  size: "small"
                }),
                style: {
                  marginRight: "3px",
                  height: "20px",
                  width: "20px",
                  borderRadius: "50%",
                  padding: "0",
                  marginBottom: "2px",
                  background: `url(${treezj}) no-repeat center`
                },
                title: "添加子级部门",
                on: {
                  click: () => {
                    this.dialogAddDepVisible = true;
                    this.addDepForm.parentId = data.depId;
                  }
                }
              }),
              // 编辑button
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  type: "text",
                  size: "small"
                }),
                style: {
                  marginRight: "3px",
                  height: "20px",
                  width: "20px",
                  borderRadius: "50%",
                  padding: "0",
                  marginBottom: "2px",
                  background: `url(${treebj}) no-repeat center`
                },
                title: "编辑部门",
                on: {
                  click: () => {
                    this.edit(root, node, data);
                  }
                }
              }),
              // 删除button
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  type: "text",
                  size: "small"
                }),
                style: {
                  marginRight: "5px",
                  height: "20px",
                  width: "20px",
                  borderRadius: "50%",
                  padding: "0",
                  marginBottom: "2px",
                  background: `url(${treesc}) no-repeat center`
                },
                title: "删除部门",
                on: {
                  click: () => {
                    this.remove(root, node, data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    // 表格数据
    getTableList(depId) {
      axios
        .get(config.apiHost + "/sys/dept/dept-members", {
          params: {
            //请求参数
            token: config.token,
            depId: depId,
            page: this.currentPage,
            limit: this.pageSize,
            fuzzy: this.formQuery.search
          }
        })
        .then(result => {
          if (result.status == 200) {
            this.totalCount = result.data.body.totalCount;
            this.tableData = result.data.body.list;
          }
        })
        .catch(function(response) {});
    },
    // 添加部门 所在地列表
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
    // 取消添加部门
    cancelAddDep() {
      (this.dialogAddDepVisible = false),
        (this.addDepForm = {
          name: "", //部门名称
          areaId: "",
          parentId: 0, //上级部门
          depId: "",
          ids: [], //领导
          principal: "" //负责人id
        });
    },
    // 保存添加部门
    confirmAddDep() {
      this.$refs["addDepForm"].validate(valid => {
        if (valid) {
          axios({
            method: "post",
            // /api
            url: config.apiHost + "/sys/dept/save",
            data: this.addDepForm,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              token: config.token
            }
          })
            .then(res => {
              //  console.log(res);
              if (res.data.status == "200") {
                this.cancelAddDep();
                this.$message.success(res.data.body.msg);
                this.getDefaultArea();
              } else {
                this.$message.error(res.data.body.message);
              }
            })
            .catch(function(response) {
              //   this.$message.error(error);
              // console.log(response);
            });
        } else {
          return false;
        }
      });
    },
    // 删除部门
    remove(root, node, data) {
      this.$confirm("删除该部门？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .get(config.apiHost + "/sys/dept/delete", {
              params: {
                //请求参数
                token: config.token,
                depId: data.depId
              }
            })
            .then(res => {
              if (res.data.status == "200") {
                this.$message.success(res.data.body.msg);
                this.getDefaultArea();
              } else {
                this.$message.error(res.data.body.msg);
              }
            })
            .catch(function(response) {});
        })
        .catch(() => {});
    },
    // 编辑部门
    edit(root, node, data) {
      this.dialogAddUpdateDepVisible = true;
      this.getUserList();
      this.getDetail(data.depId);
    },
    //   用户列表
    getUserList() {
      this.userData = [];
      axios
        .get(config.apiHost + "/sys/user/listUser", {
          params: {
            //请求参数
            depId: this.activeDepId,
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
    },
    //得到部门详情
    getDetail(depId) {
      axios
        .get(config.apiHost + "/sys/dept/depDetails", {
          params: {
            //请求参数
            deptId: depId,
            token: config.token
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            const cc = result.data.body;
            const uList = result.data.body.userList;
            this.form = {
              depId: cc.depId,
              name: cc.name, //部门名称
              areaId: cc.areaId, //部门所在地
              ids: [], //领导
              principal: cc.principal, //负责人
              parentId: cc.parentId, //上级部门
              mobile: cc.mobile
            };
            if (uList.length > 0) {
              for (let i = 0; i < uList.length; i++) {
                const element = uList[i];
                this.form.ids.push(element.id);
              }
            }
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    // 保存编辑部门
    confirmUpdate() {
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
            this.$message(res.data.body.msg);
            this.dialogAddUpdateDepVisible = false;
          }
          return res.data;
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    // 获取角色列表
    getRole() {
      //
      axios
        .get(config.apiHost + "/sys/role/list", {
          params: {
            //请求参数
            page: 1,
            limit: 1000,
            token: config.token
          }
        })
        .then(result => {
          //  console.log("角色请求返回。。。");
          if (result.data.status == 200) {
            // console.log(result.data.page.list);
            this.roleData = result.data.page.list;
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //获取部门列表
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
          //  console.log("部门请求返回。。。");
          if (result.status == 200) {
            // console.log(result.data);
            this.depArr = result.data;
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    changeRole() {
      // console.log("选择角色。。");
      // console.log(this.roleStatus);
      //  console.log(this.form);
      // this.form.roleIdList.push(this.roleStatus);//只要角色id
    },
    showPwd() {
      this.mimaType = this.mimaType == "password" ? "text" : "password";
    },
    // 显示添加人dialog
    showAddPerson() {
      this.dialogAddVisible = true;
      this.isUpdate = false;
    },
    // 确认添加人
    insertAdd() {
      this.dialogAddForm.roleIdList.push(this.dialogAddForm.roleStatus);
      if (this.showValidate()) {
        this.dialogAddForm.password = md5(this.dialogAddForm.password);
        axios({
          method: "post",
          // /api
          url: config.apiHost + "/sys/user/save",
          data: this.dialogAddForm,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        }).then(res => {
          if (res.data.status == "200") {
            this.getDefaultArea();
            this.dialogAddVisible = false;
            //  初始化表单对象
            this.dialogAddForm = {
              account: "",
              sex: "MALE",
              depId: "",
              profession: "",
              roleStatus: "",
              birth: "",
              city: "",
              major: "",
              tel: "",
              mobile: "",
              email: "",
              houseTel: "",
              contactAddress: "",
              address: "",
              companyName: "",
              postalcode: "",
              principalsName: "",
              fax: "",
              principalsTel: "",
              password: "",
              status: 0,
              speciality: "",
              experience: "",
              roleIdList: [],
              stationId: 1 //岗位ID(暂定)
            };
            this.$message({ type: "success", message: res.data.body.msg });
          } else {
            this.$message({ type: "error", message: res.data.body.message });
          }
        });
      } else {
        this.$message({ type: "error", message: "检查输入" });
      }
    },
    // 确认编辑
    updateAdd(id) {
      // console.log("update", id);
    },
    // 取消添加人
    closeAdd() {
      this.dialogAddVisible = false;
      this.mimaType = "text";
      this.dialogAddForm = {
        account: "",
        sex: "MALE",
        depId: "",
        profession: "",
        roleStatus: "",
        birth: "",
        city: "",
        major: "",
        tel: "",
        mobile: "",
        email: "",
        houseTel: "",
        contactAddress: "",
        address: "",
        companyName: "",
        postalcode: "",
        principalsName: "",
        fax: "",
        principalsTel: "",
        password: "",
        status: 0,
        speciality: "",
        experience: "",
        roleIdList: [],
        stationId: 1 //岗位ID(暂定)
      };
    },
    // 验证
    showValidate() {
      var val = this;
      const {
        account,
        depId,
        mobile,
        password,
        roleIdList
      } = this.dialogAddForm;
      if (
        mobile.trim() == "" ||
        roleIdList.length <= 0 ||
        account.trim() == "" ||
        depId == null ||
        password.trim() == ""
      ) {
        this.$message({ type: "error", message: "信息不能为空！" });
        return;
      } else {
        var myreg = /^1[3-578]\d{9}$/; //手机号码验证
        var myemail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/; //邮箱
        if (!myreg.test(mobile)) {
          this.$message({ type: "error", message: "请输入有效的手机号码！" });
          document.getElementById("Phone").focus();
          return;
        }
        if (email.trim() != "") {
          if (!myemail.test(email)) {
            this.$message({ type: "error", message: "请输入正确的邮箱！" });
            document.getElementById("EM").focus();
            return;
          }
        }
        return true;
      }
    },
    // 导入
    insertSome() {
      this.dialogInsertVisible = true;
    },
    handleRemove(file, fileList) {
      // console.log("remove", file);
    },
    handlePreview(file) {
      // console.log("file", file);
    },
    // 导入文件改变事件
    handleChange(file, fileList) {
      this.fileName = file.name;
      this.fileList = fileList;
    },
    // 上传失败回调
    uploadError(res) {
      this.$message.error("上传失败");
    },
    // 上传成功回调
    uploadSuccess(res) {
      //导入成功
      if (res.status == 200) {
        this.$message.success(res.body.msg);
        this.dialogInsertVisible = false;
        this.fileList = [];
        this.getDefaultArea();
      } else {
        this.$message.error(res.body.message);
      }
    },
    // 表格删除
    deleteRow(row) {
      this.deleteID = [];
      this.deleteID.push(row.id);
      this.$confirm("确定要删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            this.deleteUser();
          }
        },
        type: "warning"
      });
    },
    //删除方法
    deleteUser() {
      axios({
        method: "post",
        url: config.apiHost + "/sys/user/delete",
        data: this.deleteID,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.getTableList(this.activeDepId);
          this.$message({
            type: "success",
            message: res.data.body.msg
          });
          this.deleteID = [];
        } else {
          this.$message({
            type: "error",
            message: res.data.body.msg
          });
        }
      });
    },
    //批量删除
    delSome() {
      this.selectID.forEach(item => {
        this.deleteID.push(item.id);
      });
      if (this.selectID.length > 0) {
        this.$confirm("确定要删除所有选中用户吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          callback: (acction, instance) => {
            if (acction === "confirm") {
              this.deleteUser();
            }
          },
          type: "warning"
        });
      } else {
        this.$message("您还没有选中用户");
      }
    },
    selectTable(selection, val) {
      this.selectID = selection;
    },
    handleSelectionChange(selection) {
      this.selectID = selection;
    },
    rowDblclick(row, event) {
      this.dialogAddForm = row;
      this.dialogAddForm["roleStatus"] = row.roleIdList[0];
      this.dbclickRow = row;
      this.isUpdate = true;
      this.dialogAddVisible = true;
    },
    // 分页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableList(this.activeDepId);
    }
  },
  watch: {
    isnums() {
      // this.deptId = null;
      // this.getArea();
      // this.$store.dispatch("refNum", 6); //刷新父级组件
    }
  },
  created() {
    this.getDefaultArea();
    this.getArea();
    this.getRole();
    this.getdept();
  }
};
</script>
<style scoped>
.partmentmgr-container {
  width: auto;
  height: 100%;
  /* background-color: #e2e6ef; */
  padding: 8px 8px 45px;
  box-sizing: border-box;
  overflow: hidden;
}
.tab_main {
  height: calc(100% - 45px);
  /* min-height: 800px; */
  display: flex;
}
.left_main {
  /* flex: 3; */
  height: 100%;
  /* padding: 0 0 0 10px; */
  box-sizing: border-box;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
}
.right_main {
  flex: 24;
  height: 100%;
  margin-left: 10px;
  box-sizing: border-box;
  background: #fff;
}
.content {
  width: 100%;
  height: 800px;
  background-color: #ffffff;
}
.right_main .content {
  flex-direction: column;
  overflow: hidden;
}
.right_main .content .head {
  height: 100px;
  padding: 0 10px;
  box-shadow: 0px 2px 10px 0px rgba(16, 20, 26, 0.05);
  position: relative;
}
.right_main .content .head .top-form {
  width: 100%;
  padding-top: 22px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: left;
}
.right_main .content .head .top-form .el-form-item {
  margin-right: 50px;
}
.delete {
  border: 1px solid #e43333;
  color: #e43333;
}
.insert {
  border: 1px solid #429e73;
  color: #429e73;
}
.right_main .content .con {
  height: 690px;
  margin: 10px 0 0;
  padding: 0 10px 50px;
  overflow-x: hidden;
  overflow-y: auto;
}
.right_main .content .con .el-pagination {
  margin: 20px 0;
}
/*滚动条整体样式*/
.partmentmgr-container
  .add-dialog
  .el-dialog
  .el-dialog__body::-webkit-scrollbar,
.right_main .content .con::-webkit-scrollbar,
.left_main::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.partmentmgr-container
  .add-dialog
  .el-dialog
  .el-dialog__body::-webkit-scrollbar-thumb,
.right_main .content .con::-webkit-scrollbar-thumb,
.left_main::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
.partmentmgr-container
  .add-dialog
  .el-dialog
  .el-dialog__body::-webkit-scrollbar-track,
.right_main .content .con::-webkit-scrollbar-track,
.left_main::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}
#tree-row {
  text-align: left;
  flex: 7;
}
.ivu-tree-arrow {
  width: 20px !important;
}

/* 增加dialog */
.add-dialog {
  text-align: left;
}
.add-form .el-input,
.add-form .el-select {
  width: 200px;
}

.add-form .el-form-item {
  width: 48%;
  margin-right: 0;
  margin-left: 0;
}
.add-form .el-form-item:nth-child(odd) {
  margin-left: 15px;
}
.add-form .el-form-item:nth-child(even) {
  text-align: right;
}
.add-form .pwd {
  position: relative;
}
.add-form .pwd .el-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.add-form .address {
  padding-left: 15px;
  position: relative;
  margin-bottom: 22px;
  text-align: left;
}
.add-form .address label {
  font-weight: bold;
  width: 68px;
}
.add-form .address > div {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding-left: 83px;
}
.add-form .address > div .el-input {
  width: 99%;
}
.add-form .address > div .el-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 20px;
}
.cancel {
  width: 150px;
  font-size: 14px;
  border: 1px solid #429e73;
}
.cancel:hover {
  color: #fff;
  background: #429e73;
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

.delete:hover{
  background: #e43333;
  color: #fff;
  border-color: #e43333
}
.insert:hover{
  background: #429E73;
  color: #fff;
  border-color: #429E73
}
</style>