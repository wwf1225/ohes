<template>
  <div class="userbox">
    <!-- <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item >系统管理</el-breadcrumb-item>
                <el-breadcrumb-item >用户管理</el-breadcrumb-item>
            </el-breadcrumb>
    </div>-->
    <div class="usermgr-container">
      <el-form class="top-form" :inline="true" :model="formQuery" ref="formQuery">
        <el-form-item label="搜索" prop="userName">
          <el-input v-model="formQuery.account" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="所属部门">
          <!-- <el-input v-model="formQuery.account" placeholder="账号"></el-input> -->
          <el-select v-model="formQuery.deptId" placeholder="请选择" @change="queryChange">
            <el-option
              v-for="item in deptData"
              :key="item.depId"
              :label="item.name"
              :value="item.depId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="config.hasPermission('sys:user:list')">
          <el-button type="primary" @click="getUserList()">查询</el-button>
        </el-form-item>
        <!-- 暂时不显示用户添加 -->
        <el-form-item v-if="config.hasPermission('sys:user:save')">
          <el-button type="primary" @click="addUser">
            <i class="el-icon-circle-plus-outline"></i> 新增
          </el-button>
        </el-form-item>
        <el-form-item v-if="config.hasPermission('sys:user:delete')" style="float:right">
          <el-button type="primary" @click="AllDel">删除</el-button>
        </el-form-item>
      </el-form>

      <el-table
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
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column prop="no" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="account" label="账号" align="center"></el-table-column>
        <!-- <el-table-column prop="stationName" label="职位"  align="center"> </el-table-column> -->
        <el-table-column prop="deptName" label="部门" align="center"></el-table-column>
        <el-table-column label="所属角色" align="center">
          <template slot-scope="scope">
            <span>{{getRoleName(scope.row.roles)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" align="center">
          <template slot-scope="scope">
            <span>{{userStatus(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              @click="rowDblclick(scope.row)"
              type="text"
              size="small"
              title="查看"
              v-if="config.hasPermission('sys:user:update')"
            >
              <img src="../../assets/ck.png" alt>
            </el-button>
            <!--<el-button
              type="text"
              size="small"
              @click.native.prevent="updateRow(scope.row)"
              v-if="config.hasPermission('sys:user:update')"
            >编辑</el-button>-->
            <!-- <el-button
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"
              v-if="config.hasPermission('sys:user:delete')"
            >删除</el-button>-->
            <el-button
              size="small"
              type="text"
              title="删除"
              @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"
              v-if="config.hasPermission('sys:user:delete')"
            >
              <img src="../../assets/sc.png" alt>
            </el-button>
            <div class="resetDiv" v-if="config.hasPermission('sys:user:resetpassword')">
              <!-- <el-button type="text" size="small" @click.native.prevent="resetRow(scope.row)">初始化密码</el-button> -->
              <el-button
                size="small"
                type="text"
                title="初始化密码"
                @click.native.prevent="resetRow(scope.row)"
              >
                <img src="../../assets/mima.png" alt>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page_main">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>

    <!-- 用户添加/编辑弹出框 -->
    <el-dialog
      width="35%"
      class="add-dialog"
      :title="myType"
      :visible.sync="dialogAddVisible"
      :before-close="handleClose"
      @close="closeAdd"
    >
      <el-form :model="form" :inline="true" class="add-form" size="small" ref="addFormRef">
        <el-form-item label="人员姓名" class="requiredChar">
          <el-input v-model="form.account" placeholder="请输入" required></el-input>
        </el-form-item>
        <el-form-item label="人员性别">
          <el-select v-model="form.sex" placeholder>
            <el-option label="男" value="MALE"></el-option>
            <el-option label="女" value="FEMALE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" class="requiredChar">
          <el-input v-model="form.mobile" placeholder="请输入" required></el-input>
        </el-form-item>
        <el-form-item label="单位名称">
          <el-input v-model="form.depId" placeholder="请输入" readonly></el-input>
        </el-form-item>
        <el-form-item label="所属部门" class="requiredChar">
          <el-select
            v-model="form.depId"
            id="DP"
            value-key="depId"
            placeholder="请选择"
            @change="choseDept"
            required
          >
            <el-option
              v-for="item in deptData"
              :key="item.depId"
              :label="item.name"
              :value="item.depId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="办公座机">
          <el-input v-model="form.tel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="系统角色" class="requiredChar">
          <el-select v-model="roleStatus" placeholder="请选择" id="RL" @change="changeRole" required>
            <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="pwd requiredChar" label="账户密码">
          <el-input v-model="form.password" placeholder="请输入" :type="mimaType" required></el-input>
          <el-button type="text" size="mini" @click="showPwd">
            <img v-if="mimaType=='password'" src="../../assets/by.png">
            <img v-else src="../../assets/zy.png">
          </el-button>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="form.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="账户状态" class="requiredChar">
          <el-select v-model="form.status" id="myStatus" placeholder="请选择" required>
            <el-option v-for="item in items" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div class="address">
          <label class="el-form-item__label" style="line-height: 32px">通讯地址</label>
          <div>
            <el-input v-model="form.contactAddress" size="small" placeholder="请输入"></el-input>
            <!-- <el-button type="text" size="mini">
              <img src="../../assets/dt.png" alt="">
            </el-button>-->
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel" type="text" size="small" @click="closeAdd">取 消</el-button>
        <el-button
          class="ok"
          type="text"
          size="small"
          @click="insertAdd"
          v-text="myType=='编辑用户'?'保 存':'创 建'"
        ></el-button>
      </div>
    </el-dialog>

    <!-- 用户添加/编辑弹出框 -->
    <!-- <el-dialog :title="myType" :visible.sync="dialogAddVisible" :before-close="handleClose">
      <el-form :model="form">
        <div class="addBox">
          <div class="info">个人基本信息</div>
          <div class="info-box">
            <div class="one">
              <div class="input-div">
                <label class="label-div">
                  <i style="color:red;font-size:16px;margin-right: 10px;">*</i>用户姓名
                </label>
                <input
                  class="inp-add"
                  type="text"
                  id="uName"
                  v-model="form.userName"
                  auto-complete="off"
                >
    </div>-->
    <!-- <div class="input-div">
                                <label class="label-div">出生日期</label>
                                <input type="text"  v-model="form.birth">
    </div>-->
    <!-- <div class="input-div">
                <label class="label-div">
                  <i style="color:red;font-size:16px;margin-right: 10px;">*</i>手机号码
                </label>
                <input class="inp-add" type="text" id="Phone" v-model="form.mobile">
              </div>
              <div class="input-div">
                <label class="label-div">家庭住址</label>
                <input
                  class="inp-add"
                  style="flex:0.8;"
                  id="homeAddress"
                  type="text"
                  v-model="form.address"
                >
              </div>
              <div class="input-div">
                <label class="label-div">通讯地址</label>
                <input
                  class="inp-add"
                  style="flex:0.8;"
                  id="msgAddress"
                  type="text"
                  v-model="form.contactAddress"
                >
              </div>
            </div>
            <div class="two">
              <div class="input-div">
                <label class="label-div">性别</label>
                <el-radio v-model="form.sex" label="MALE">男</el-radio>
                <el-radio v-model="form.sex" label="FEMALE">女</el-radio>
              </div>
              <div class="input-div">
                <label class="label-div">身份证</label>
                <input class="inp-add" style="flex:0.8;" id="Icard" v-model="form.identityNo">
              </div>
              <div class="input-div">
                <label class="label-div">
                  <i style="color:red;font-size:16px;margin-right: 10px;">*</i>所属角色
                </label>
                <el-select
                  v-model="roleStatus"
                  placeholder="请选择"
                  id="RL"
                  size="small"
                  @change="changeRole"
                >
                  <el-option
                    v-for="item in roleData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div class="input-div">
                <label class="label-div">
                  <i style="color:red;font-size:16px;margin-right: 10px;">*</i>状态
                </label>
                <el-select v-model="form.status" id="myStatus" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in items"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="info">个人部门信息</div>
          <div class="info-box">
            <div class="one">
              <div class="input-div">
                <label class="label-div">
                  <i style="color:red;font-size:16px;margin-right: 10px;">*</i>账号
                </label>
                <input
                  type="text"
                  class="inp-add"
                  id="Acc"
                  v-model="form.account"
                  style="flex:0.6;"
                >
              </div>
              <div class="input-div">
                <label class="label-div">是否领导</label>
                <el-switch
                  v-model="myLead"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
    </div>-->
    <!-- <div class="input-div">
                                <label class="label-div"><i style="color:red;font-size:16px;margin-right: 10px;">*</i>岗位</label>
                                    <el-select v-model="form.stationId" id="ST"  placeholder="请选择" size="small" @change="changPosts">
                                    <el-option
                                    v-for="item in postsData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
    </div>-->
    <!-- 暂时不要 -->
    <!-- <div class="input-div">
                                <label class="label-div">上司</label>
                                <el-select v-model="bossStatus" size="small" placeholder="请选择">
                                    <el-option
                                    v-for="item in bossData"
                                    :key="item.id"
                                    :label="item.account"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
    </div>-->
    <!-- <div class="input-div">
                <label class="label-div">公司E-mail</label>
                <input type="text" class="inp-add" id="EM" v-model="form.email" style="flex:0.6;">
              </div>
            </div>
            <div class="two">
              <div class="input-div">
                <label class="label-div">
                  <i style="color:red;font-size:16px;margin-right: 10px;">*</i>部门
                </label>
                <el-select
                  v-model="form.depId"
                  size="small"
                  id="DP"
                  value-key="depId"
                  placeholder="请选择"
                  @change="choseDept"
                >
                  <el-option
                    v-for="item in deptData"
                    :key="item.depId"
                    :label="item.name"
                    :value="item.depId"
                  ></el-option>
                </el-select>
              </div>
              <div class="input-div">
                <label class="label-div">是否负责人</label>
                <el-switch
                  v-model="myPrincipal"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :change="changePrincipal()"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
    </div>-->
    <!-- 暂时不显示密码 -->
    <!-- <div class="input-div" v-if="isPwd">
                <label class="label-div">
                  <i style="color:red;font-size:16px;margin-right: 10px;">*</i>账户密码
                </label>
                <input
                  type="password"
                  class="inp-add"
                  id="PW"
                  v-model="form.password"
                  style="flex:0.6;"
                >
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="insertAdd">确 定</el-button>
      </div>
    </el-dialog>-->
    <!-- 查看用户弹出框 -->
    <el-dialog title="查看用户" :visible.sync="dialogShowVisible" :before-close="handleClose">
      <el-form :model="form">
        <div class="addBox">
          <div class="info">个人基本信息</div>
          <div class="info-box">
            <div class="one">
              <div class="input-div">
                <label class="label-div">用户姓名</label>
                <input class="inp" type="text" v-model="form.userName" readonly>
              </div>
              <div class="input-div">
                <label class="label-div">手机号码</label>
                <input class="inp" type="text" v-model="form.mobile" readonly>
              </div>
              <div class="input-div">
                <label class="label-div">家庭住址</label>
                <input class="inp" style="flex:0.8;" type="text" v-model="form.address" readonly>
              </div>
              <div class="input-div">
                <label class="label-div">通讯地址</label>
                <input
                  class="inp"
                  style="flex:0.8;"
                  type="text"
                  v-model="form.contactAddress"
                  readonly
                >
              </div>
            </div>
            <div class="two">
              <div class="input-div">
                <label class="label-div">性别</label>
                <el-radio v-model="form.sex" label="MALE" disabled>男</el-radio>
                <el-radio v-model="form.sex" label="FEMALE" disabled>女</el-radio>
              </div>
              <div class="input-div">
                <label class="label-div">身份证</label>
                <input class="inp" style="flex:0.8;" v-model="form.identityNo" readonly>
              </div>
              <div class="input-div">
                <label class="label-div">所属角色</label>
                <input class="inp" type="text" v-model="showRoleName" style="flex:0.6;" readonly>
              </div>
              <div class="input-div">
                <label class="label-div">状态</label>
                <input class="inp" type="text" v-model="mystatus" style="flex:0.6;" readonly>
              </div>
            </div>
          </div>
          <div class="info">个人部门信息</div>
          <div class="info-box">
            <div class="one">
              <div class="input-div">
                <label class="label-div">账号</label>
                <input class="inp" type="text" v-model="form.account" style="flex:0.6;" readonly>
              </div>
              <div class="input-div">
                <label class="label-div">岗位</label>
                <input
                  class="inp"
                  type="text"
                  v-model="form.stationName"
                  style="flex:0.6;"
                  readonly
                >
              </div>
              <!-- 暂时去掉 -->
              <!-- <div class="input-div">
                                <label class="label-div">上司</label>
                                <input class="inp" type="text"  v-model="form.bossStatus" style="flex:0.6;" readonly>
              </div>-->
            </div>
            <div class="two">
              <div class="input-div">
                <label class="label-div">部门</label>
                <input class="inp" type="text" v-model="form.deptName" style="flex:0.6;" readonly>
              </div>
              <div class="input-div">
                <label class="label-div">公司E-mail</label>
                <input class="inp" type="text" v-model="form.email" style="flex:0.6;" readonly>
              </div>
              <!-- 暂时不显示密码 -->
              <!-- <div class="input-div">
                                <label class="label-div">账户密码</label>
                                <input class="inp" type="text"  v-model="form.password" style="flex:0.6;" readonly>
              </div>-->
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeShow">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 信息不能为空 -->
    <!-- <el-dialog title="提示" :visible.sync="dialogInfo">
    </el-dialog>-->
  </div>
</template>

<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
import md5 from "js-md5";
export default {
  data() {
    return {
      loading: true,
      config: config,
      formQuery: {
        account: ""
      },
      myType: "",
      showRoleName: "",
      mimaType: "password",
      form: {
        id: null,
        account: "", //用户名
        userName: "", //用户姓名
        password: "", //用户密码
        sex: "MALE", //性别
        // birth: "",//出生年月
        identityNo: "", //身份证号
        mobile: "", //手机号码
        tel: "", //座机
        email: "", //email
        address: "", //..家庭住址
        contactAddress: "", //居住地
        status: 1, //状态
        depId: null, //部门ID
        deptName: "", //部门名称
        stationId: 1, //岗位ID(暂定)
        stationName: "2", //岗位名称（暂定）
        deleteFlag: false,
        isLead: null, //是否负责人
        isPrincipal: null, //是否首领
        roleIdList: [] //角色ID
      },
      tableData: [], //列表数据
      tableSelection: [], //数据表选择数据集合
      tableSelectObj: {}, //数据表单条选择数据对象
      // currentPage4: 4,
      limit: 10, //每页条数
      page: 1, //当前页
      totalCount: null, //总条数
      totalPage: null, //总页数
      dialogAddVisible: false,
      dialogShowVisible: false,
      dialogInfo: false,
      items: [{ text: "激活", id: 1 }, { text: "未激活", id: 2 }],
      roleStatus: "", //角色ID
      deptStatus: {}, //部门
      postsStatus: {}, //岗位
      bossStatus: "", //上司ID
      roleData: [], //角色下拉框
      deptData: [], //部门下拉框
      postsData: [], //岗位下拉框
      bossData: [], //上司下拉框
      deleteID: [],
      selectID: [], //复选框

      myLead: "0",
      myPrincipal: "0",
      isPwd: true,
      mystatus: ""
    };
  },
  methods: {
    handleClose(done) {
      this.form = {
        id: null,
        account: "", //用户名
        userName: "", //用户姓名
        password: "", //用户密码
        sex: "MALE", //性别
        // birth: "",//出生年月
        identityNo: "", //身份证号
        mobile: "", //手机号码
        email: "", //email
        address: "", //..家庭住址
        contactAddress: "", //居住地
        status: "", //状态
        depId: null, //部门ID
        deptName: "", //部门名称
        stationId: 1, //岗位ID(暂定)
        stationName: "2", //岗位名称（暂定）
        deleteFlag: false,
        isLead: null, //是否负责人
        isPrincipal: null, //是否首领
        roleIdList: [] //角色ID
      };
      this.roleStatus = "";
      this.showRoleName = "";
      this.myLead = "0";
      this.myPrincipal = "0";
      done();
    },
    getRoleName(rl) {
      //  console.log("输出...")
      var arr = [];
      rl.forEach(item => {
        arr.push(item.name);
      });
      return arr.join();
    },
    userStatus(status) {
      if (status == 1) {
        return "激活";
      } else {
        return "未激活";
      }
    },
    //查看
    handleClick(row) {
      // console.log("查看。。。");
      this.getRole();
      this.getdept();
      this.getPosts();
      this.form = row;

      if (this.form.status == 1) {
        this.mystatus = "激活";
      } else {
        this.mystatus = "未激活";
      }

      if (this.form.roles.length > 0) {
        this.form.roles.forEach(items => {
          this.showRoleName += items.name + ",";
        });
      } else {
        this.showRoleName = "";
      }

      this.dialogShowVisible = true;
      // console.log(this.form);
    },
    //编辑
    updateRow(row) {
      // console.log(row);
      this.getRole();
      this.getdept();
      this.getPosts();
      this.form = row;
      this.myLead = this.form.isLead.toString();
      this.myPrincipal = this.form.isPrincipal.toString();
      this.choseDept(); //获取岗位
      this.dialogAddVisible = true;

      // this.$nextTick(()=>console.log(this.$refs.addFormRef.$children[0].$el));

      this.myType = "编辑用户";
      this.isPwd = false;
      /**
       * 报错！！！
       */
      if (row.roles.length > 0) {
        this.roleStatus = row.roles[0].id;
      }
      // console.log("编辑实体。。。");
      // console.log(this.form.roleIdList);
      // console.log(this.roleStatus);
    },
    //选择是否负责人
    changePrincipal() {
      //   console.log("负责人 "+this.myPrincipal);
      //   console.log("领导 "+this.myLead);
      if (this.myPrincipal == "1") {
        this.myLead = "1";
      }
    },
    // 验证
    showValidate() {
      var val = this;
      const {
        userName,
        mobile,
        roleIdList,
        status,
        account,
        depId,
        stationId,
        password,
        email
      } = this.form;
      console.log(this.form);
      if (
        // userName.trim() == "" ||
        mobile.trim() == "" ||
        roleIdList.length <= 0 ||
        status == "" ||
        account.trim() == "" ||
        depId == null ||
        password.trim() == ""
      ) {
        // if(userName.trim() == ''){
        //      document.getElementById("uName").focus();
        // }else if(mobile.trim() == ''){
        //      document.getElementById("Phone").focus();
        // }else if(roleIdList.length<=0){
        //      document.getElementById("RL").focus();
        // }else if(status==''){
        //      document.getElementById("myStatus").focus();
        // }else if(account.trim()==''){
        //      document.getElementById("Acc").focus();
        // }else if(depId ==null){
        //      document.getElementById("DP").focus();
        // }else if(stationId==null){
        //      document.getElementById("ST").focus();
        // }else if(password.trim()==''){
        //      document.getElementById("PW").focus();
        // }
        this.$message({ type: "error", message: "信息不能为空！" });

        return;
      } else {
        var myreg = /^1[3-578]\d{9}$/; //手机号码验证
        // var numreg = /^\d+$/;//疑似病例数
        // var card= /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;//身份证
        var myemail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/; //邮箱
        if (!myreg.test(mobile)) {
          this.$message({ type: "error", message: "请输入有效的手机号码！" });
          document.getElementById("Phone").focus();
          return;
        }
        // if(!card.test(this.form.identityNo)){
        //     this.$message({type: 'error',message: '请输入正确的身份证！'});
        //     document.getElementById("Icard").focus();
        //     return;
        // }
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
    //点击删除
    deleteRow(index, rows, row) {
      // console.log("删除。。。");
      this.deleteID.push(row.id);
      this.$confirm("确定要删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            let req = this.deleteUser();
            console.log(this.deleteUser());
            if (req.status == "200") {
              this.getUserList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          } else {
            // this.$message({
            //   typ: "info",
            //   message: "已取消删除"
            // });
          }
        },
        type: "warning"
      });
    },
    //删除方法
    deleteUser() {
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/sys/user/delete",
        data: this.deleteID,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      }).then(res => {
        if (res.data.status == "200") {
          this.getUserList();
          // console.log(res.data);
          //  rows.splice(index, 1);
          this.deleteID = [];
        } else {
          this.$message.error(res.data.body.message);
        }
        console.log(res.data);
        return res.data;
      });
    },
    //初始化密码
    resetRow(row) {
      // console.log("初始化密码。。。");
      // console.log(row.id);
      //
      axios
        .get(config.apiHost + "/sys/user/initPassword", {
          params: {
            //请求参数
            userId: row.id,
            token: config.token
          }
        })
        .then(result => {
          //  console.log("初始化返回。。。");
          //  console.log(result);
          if (result.data.status == 200) {
            this.$message("初始化成功");
          }
        })
        .catch(response => {
          this.$message(response);
        });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getUserList();
    },
    //   用户列表
    getUserList() {
      this.loading = true;
      //
      axios
        .get(config.apiHost + "/sys/user/list", {
          params: {
            //请求参数
            order: "asc",
            page: this.page,
            limit: this.limit,
            token: config.token,
            account: this.formQuery.account
          }
        })
        .then(result => {
          //  console.log("请求返回。。。");
          if (result.data.status == 200) {
            // console.log(result.data.body);
            this.tableData = result.data.body.list;
            // console.log(this.tableData);
            this.totalCount = result.data.body.totalCount; //总条数
            this.loading = false;
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    selectTable(selection, val) {
      // console.log("搜索列表");
      // console.log(selection);
      //  console.log(val);
      this.tableSelection = selection;
      this.tableSelectObj = val;
    },
    handleSelectionChange(selection) {
      //  console.log("复选框列表");
      this.selectID = selection;
      // console.log(this.selectID);
      this.tableSelection = selection;
    },
    // 双击表格行
    rowDblclick(row, event) {
      // console.log(row);
      if (config.hasPermission("sys:user:info")) {
        if (config.hasPermission("sys:user:update")) {
          this.updateRow(row);
        } else {
          this.handleClick(row);
        }
      }
    },
    //批量删除
    AllDel() {
      // console.log("批量删除。。")
      this.selectID.forEach(item => {
        this.deleteID.push(item.id);
      });
      if (this.selectID.length > 0) {
        this.$confirm("确定要删除所有选中用户吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          callback: (acction, instance) => {
            if (acction === "confirm") {
              let req = this.deleteUser();
              if (req.status == "200") {
                this.getUserList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            } else {
              this.$message({
                typ: "info",
                message: "已取消删除"
              });
            }
          },
          type: "warning"
        });
      } else {
        this.$message("您还没有选中用户");
      }
    },
    // 点击新增按钮
    addUser() {
      this.myType = "新增用户";
      this.isPwd = true;
      this.dialogAddVisible = true;
      this.getRole();
      this.getdept();
      this.getPosts();
    },
    // 点击确认添加/修改
    insertAdd() {
      //    this.dialogAddVisible = false;
      if (this.myType == "新增用户") {
        this.add();
      } else if (this.myType == "编辑用户") {
        this.update();
        //    this.isPwd=false;
      }
    },
    // 调添加接口
    add() {
      if (this.roleStatus != "") {
        this.form.roleIdList.push(this.roleStatus); //只要角色id
      }

      this.form.isLead = Number(this.myLead);
      this.form.isPrincipal = Number(this.myPrincipal);
      if (this.showValidate()) {
        this.form.password = md5(this.form.password);

        axios({
          method: "post",
          // /api
          url: config.apiHost + "/sys/user/save",
          data: this.form,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        }).then(res => {
          if (res.data.status == "200") {
            this.getUserList();
            this.dialogAddVisible = false;
            //  初始化表单对象
            this.form = {
              id: null,
              account: "", //用户名
              userName: "", //用户姓名
              password: "", //用户密码
              sex: "MALE", //性别
              // birth: "",//出生年月
              identityNo: "", //身份证号
              mobile: "", //手机号码
              tel: "", //座机
              email: "", //email
              address: "", //..家庭住址
              contactAddress: "", //居住地
              status: 1, //状态
              depId: null, //部门ID
              deptName: "", //部门名称
              stationId: 1, //岗位ID(暂定)
              stationName: "2", //岗位名称（暂定）
              deleteFlag: false,
              isLead: null, //是否负责人
              isPrincipal: null, //是否首领
              roleIdList: [] //角色ID
            };
            this.myLead = "0";
            this.myPrincipal = "0";
            this.$message({ type: "success", message: res.data.body.msg });
          } else {
            this.$message({ type: "error", message: res.data.body.message });
          }
          return res.data;
        });
      }
    },
    update() {
      // console.log(this.form);
      this.form.roleIdList.push(this.roleStatus);
      this.form.isLead = Number(this.myLead);
      this.form.isPrincipal = Number(this.myPrincipal);
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/sys/user/update",
        data: this.form,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      }).then(res => {
        if (res.data.status == "200") {
          this.getUserList();
          this.dialogAddVisible = false;
          //  初始化表单对象
          this.form = {
            id: null,
            account: "", //用户名
            userName: "", //用户姓名
            password: "", //用户密码
            sex: "MALE", //性别
            // birth: "",//出生年月
            identityNo: "", //身份证号
            mobile: "", //手机号码
            tel: "", //座机
            email: "", //email
            address: "", //..家庭住址
            contactAddress: "", //居住地
            status: 1, //状态
            depId: null, //部门ID
            deptName: "", //部门名称
            stationId: 1, //岗位ID(暂定)
            stationName: "2", //岗位名称（暂定）
            deleteFlag: false,
            isLead: null, //是否负责人
            isPrincipal: null, //是否首领
            roleIdList: [] //角色ID
          };
          this.myLead = "0";
          this.myPrincipal = "0";
          this.$message({ type: "success", message: res.data.body.msg });
        }
        return res.data;
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
            this.deptData = result.data;
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //获取岗位列表
    getPosts() {
      //
      axios
        .get(config.apiHost + "/sys/station/queryStations", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(result => {
          //  console.log("岗位请求返回。。。");
          if (result.status == 200) {
            // console.log(result.data.body);
            this.postsData = result.data.body;
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
    changPosts() {
      // console.log("选择岗位。。。");
      // console.log(this.form.stationId);
    },
    //选择部门
    choseDept() {
      // console.log("选择部门触发。。。");
      // console.log(this.form.depId);
      axios
        .get(config.apiHost + "/sys/dept/findLeader", {
          params: {
            //请求参数
            deptId: this.form.depId
          }
        })
        .then(result => {
          if (result.status == 200) {
            this.bossData = result.data.body; //得到上司列表
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
        });

      // this.form.depId=this.deptStatus.depId;//部门ID
      // this.form.deptName=this.deptStatus.name;//部门名称
      // if(this.deptStatus.leaderUser.length>0){
      //     // console.log("有")
      //     this.bossData=this.deptStatus.leaderUser;
      //     // console.log(this.bossData);//上司
      //     return;

      // }else{
      //     this.bossData=[];
      //     this.bossStatus='';
      // }
    },
    closeShow() {
      this.dialogShowVisible = false;
      this.form = {
        id: null,
        account: "", //用户名
        userName: "", //用户姓名
        password: "", //用户密码
        sex: "MALE", //性别
        // birth: "",//出生年月
        identityNo: "", //身份证号
        mobile: "", //手机号码
        tel: "", //座机
        email: "", //email
        address: "", //..家庭住址
        contactAddress: "", //居住地
        status: 1, //状态
        depId: null, //部门ID
        deptName: "", //部门名称
        stationId: 1, //岗位ID(暂定)
        stationName: "2", //岗位名称（暂定）
        roleIdList: [] //角色ID
      };
      this.showRoleName = "";
      this.roleStatus = "";
    },
    closeAdd() {
      this.dialogAddVisible = false;
      this.form = {
        id: null,
        account: "", //用户名
        userName: "", //用户姓名
        password: "", //用户密码
        sex: "MALE", //性别
        // birth: "",//出生年月
        identityNo: "", //身份证号
        mobile: "", //手机号码
        tel: "", //座机
        email: "", //email
        address: "", //..家庭住址
        contactAddress: "", //居住地
        status: 1, //状态
        depId: null, //部门ID
        deptName: "", //部门名称
        stationId: 1, //岗位ID(暂定)
        stationName: "2", //岗位名称（暂定）
        roleIdList: [] //角色ID
      };
      this.showRoleName = "";
      this.roleStatus = "";
    },
    showPwd() {
      this.mimaType = this.mimaType == "password" ? "text" : "password";
    },
    queryChange(data) {
      this.formQuery.deptId = data;
    }
  },
  created() {
    this.getUserList();
    this.getdept();
  }
};
</script>

<style scoped>
.userbox {
  width: auto;
  min-height: 100%;
  /* text-align: left; */
  background-color: #e2e6ef;
  padding: 10px 10px 45px;
  box-sizing: border-box;
}
.usermgr-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
  padding-bottom: 30px;
}
.page_main {
  text-align: center;
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
.resetDiv {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 5px;
}
.addBox {
  width: 100%;
  height: 100%;
}
.info {
  height: 40px;
  line-height: 40px;
  text-align: left;
  color: #6eb594;
  width: 100%;
  border-bottom: 1px solid #6eb594;
}
.info-box {
  display: flex;
}
.one {
  flex: 1;
}
.two {
  flex: 1;
}
.input-div {
  margin-top: 15px;
  text-align: left;
  display: flex;
  align-items: center;
}
.label-div {
  display: block;
  width: 80px;
  text-align: right;
  margin-right: 15px;
}
.inp {
  border: 0;
  background-color: #f6f7fb;
  padding-left: 10px;
}
.inp-add {
  padding-left: 10px;
  border-radius: 4px;
}
.top-form {
  text-align: left;
  padding: 10px 0px 0px 10px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 10px 0px rgba(16, 20, 26, 0.05);
}
.top-form .el-form-item {
  margin-left: 35px;
}
.top-form .el-form-item:nth-child(1) {
  margin-left: 0;
}
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
</style>