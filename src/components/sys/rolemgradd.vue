<template>
  <div class="roleAddBox">
    <div class="addrole-container">
      <div class="btn-div">
        <!-- <router-link :to="{ path: '/home/sys-rolemgr'}">
                    <el-button type="primary">角色列表</el-button>
                </router-link>
        <el-button type="primary" @click="addRoleSave()">保存</el-button>-->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home/sys-rolemgr' }" replace>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/home/sys-rolemgr' }" replace>角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>
            <span style="color:#429E73">新增</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="roleinfo">
        <el-form ref="form" :inline="true" :rules="rules" :model="form" id="classroom_add">
          <el-form-item label="角色名称" prop="name">
            <el-input placeholder="请输入" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="角色等级" prop="name">
            <el-select v-model="form.grade" placeholder="请选择" @change="choseDept">
              <el-option
                v-for="item in gradeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="deptId">
            <el-select v-model="deptId" placeholder="请选择" @change="choseDept">
              <el-option
                v-for="item in deptData"
                :key="item.depId"
                :label="item.name"
                :value="item.depId"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="address">
            <label class="el-form-item__label" style="line-height: 32px">角色描述</label>
            <div>
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.remark"
                resize="none"
                placeholder="请输入"
              ></el-input>
            </div>
          </div>
          <!-- <el-form-item label="角色描述：" prop="remark">
                        <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>-->
          <div class="address">
            <label class="el-form-item__label" style="line-height: 32px">权限选择</label>
            <!-- <div>
              <el-tree
                :data="departmentList"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps"
              ></el-tree>
            </div>-->
          </div>
          <div class="address">
            <div class="nopadding">
              <el-tree
                :data="departmentList"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps"
              ></el-tree>
            </div>
          </div>
          <!-- <el-form-item label="权限选择：">
                        <el-tree
                            :data="departmentList"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :props="defaultProps">
                        </el-tree>
          </el-form-item>-->
          <!-- :default-checked-keys="treeID" -->
          <el-button class="ok" type="text" size="small" @click="addRoleSave">保 存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      form: {
        name: "",
        grade: null,
        remark: "",
        menuIdList: [],
        deptIdList: [],
        token: config.token
      },
      gradeData: [
        { id: 1, name: "一级" },
        { id: 2, name: "二级" },
        { id: 3, name: "三级" }
      ],
      defaultProps: {
        children: "list",
        label: "name"
      },
      deptId: "",
      deptData: [],
      // treeID:[2, 7],
      rules: {
        //正则校验
        // roleName: [
        //     { required: true, message: '请输入课程名称', trigger: 'blur' },
        // ],
      },

      checkAll: false,
      checkedAuthor: [], //选中的子列表
      checkOptions: [],
      departmentList: [] //所有列表返回
    };
  },

  methods: {
    //保存角色
    addRoleSave() {
      // console.log(">>>>>>>>>>>>>>>>>>>");
      // console.log(this.$refs.tree.getCheckedKeys());//得到tree选中的ID
      this.form.deptIdList.push(this.deptId);
      let arr = this.$refs.tree.getCheckedKeys();
      let half = this.$refs.tree.getHalfCheckedKeys(); //半选中的节点
      this.form.menuIdList = arr.concat(half);
      // console.log(this.form);
      if (this.showValidate()) {
        axios({
          method: "post",
          // /api
          url: config.apiHost + "/sys/role/save",
          data: this.form,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        }).then(res => {
          if (res.data.status == "200") {
            // this.getUserList();
            //  初始化表单对象
            this.$message({ type: "success", message: "添加成功" });
            this.form = {
              name: "",
              grade: null,
              remark: "",
              menuIdList: [],
              deptIdList: [],
              token: config.token
            };
            this.$router.push({ path: "/home/sys-rolemgr" });
          }
          return res.data;
        });
      }
    },
    showValidate() {
      var val = this;
      const { name, remark, menuIdList, deptIdList } = this.form;
      console.log(this.form);
      if (
        name.trim() == "" ||
        remark.trim() == "" ||
        menuIdList.length <= 0 ||
        deptIdList.length <= 0
      ) {
        this.$message({ type: "error", message: "信息不能为空！" });

        return;
      } else {
        return true;
      }
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
          // console.log("部门请求返回。。。");
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
    choseDept() {
      // console.log("下拉框触发。。");
      // console.log(this.deptId);
      // this.form.deptIdList.push(this.deptId);
      // console.log(this.form.deptIdList);
    },
    //点击树
    getCheckedKeys() {
      // console.log(">>>>>>>>>>>>>>>>>>>")
      //  console.log(this.$refs.tree.getCheckedKeys());
    },

    //渲染权限
    getQuan() {
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
    }
  },
  created() {
    this.$store.commit("set_active_index", "/home/sys-rolemgr");
    this.getQuan();
    this.getdept();
  }
};
</script>


<style scoped>
.roleAddBox {
  width: auto;
  min-height: 100%;
  /* text-align: left; */
  /* background-color: #E2E6EF; */
  padding: 10px 10px 45px;
  box-sizing: border-box;
}
.addrole-container {
  height: 100%;
  min-height: 800px;
  /* background-color: #FFFFFF; */
}
.btn-div {
  text-align: left;
  padding: 20px;
  margin-bottom: 10px;
  background: #fff;
}
#classroom_add {
  width: 55%;
  margin: 0 auto;
  padding: 40px 0;
}
#classroom_add .el-form-item {
  width: 33%;
  margin-right: 0;
  text-align: left;
}
#classroom_add .el-form-item:nth-child(2) {
  text-align: center;
}
#classroom_add .el-form-item:nth-child(3) {
  text-align: right;
}
#classroom_add .el-form-item .el-input,
#classroom_add .el-form-item .el-select {
  width: 205px;
}
.roleinfo {
  background: #fff;
  height: 700px;
}
.roleAuthority {
  text-align: left;
}
.authorul {
  border-bottom: 1px solid #ccc;
}
.authorli {
  height: 70px;
  border-top: 1px solid #ccc;
  line-height: 70px;
}
.authorli .el-checkbox {
  padding: 0 20px;
}
.modelauthor {
  border-right: 1px solid #66b3fe;
}
.modelauthor {
  float: left;
}
.author {
  /* float:left;*/
}
.address {
  position: relative;
  margin-bottom: 22px;
  text-align: left;
}
.address label {
  font-weight: bold;
  width: 68px;
}
.address > div {
  width: 100%;
  padding-left: 70px;
  margin-top: -25px;
}
.address > div.nopadding {
  height: 320px;
  padding: 20px 0;
  margin-top: 15px;
  border-radius: 5px;
  border: solid 1px #eeeeee;
  overflow-y: auto;
}
.address > div .el-input {
  width: 99%;
}
/*滚动条整体样式*/
div.nopadding::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
div.nopadding::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
div.nopadding::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}
.ok {
  width: 150px;
  font-size: 14px;
  background: #429e73;
  color: #fff;
  margin-top: 10px;
}
.ok:hover {
  background: #006636;
}
</style>