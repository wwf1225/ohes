<template>
  <div class="roleAddBox">
    <div class="addrole-container">
      <div class="btn-div">
        <router-link :to="{ path: '/home/sys-rolemgr'}">
          <el-button type="primary">角色列表</el-button>
        </router-link>
        <el-button type="primary" @click="RoleUpdate">保存修改</el-button>
      </div>
      <div class="roleinfo">
        <el-form
          ref="form"
          :inline="false"
          :rules="rules"
          :model="form"
          label-width="100px"
          id="classroom_add"
        >
          <el-form-item label="角色名称：" prop="name">
            <el-input placeholder="请输入角色名称" v-model="form.name" style="width:470px"></el-input>
          </el-form-item>
          <el-form-item label="角色等级：" prop="name">
            <el-select
              v-model="form.grade"
              placeholder="请选择"
              @change="choseDept"
              style="width:470px"
            >
              <el-option
                v-for="item in gradeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门：" prop="deptId">
            <el-select v-model="deptId" placeholder="请选择" @change="choseDept" style="width:470px">
              <el-option
                v-for="item in deptData"
                :key="item.depId"
                :label="item.name"
                :value="item.depId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色描述：" prop="remark">
            <el-input type="textarea" v-model="form.remark" style="width:470px"></el-input>
          </el-form-item>
          <el-form-item label="权限选择：">
            <el-tree
              :data="departmentList"
              show-checkbox
              :check-strictly="true"
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import { mapGetters } from "vuex";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      form: {
        id: "",
        name: "",
        grade: null,
        remark: "",
        menuIdList: [],
        deptIdList: []
      },
      defaultProps: {
        children: "list",
        label: "name"
      },
      gradeData: [
        { id: 1, name: "一级" },
        { id: 2, name: "二级" },
        { id: 3, name: "三级" }
      ],
      deptId: null,
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
  computed: {
    ...mapGetters(["role"])
  },
  methods: {
    //编辑角色
    RoleUpdate() {
      this.form.deptIdList.push(this.deptId); //得到部门的ID
      let arr = this.$refs.tree.getCheckedKeys(); //选中的节点
      // let half = this.$refs.tree.getHalfCheckedKeys(); //半选中的节点
      // this.form.menuIdList = arr.concat(half);
      this.form.menuIdList = arr;
      axios({
        method: "post",
        url: config.apiHost + "/sys/role/update",
        data: this.form,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      }).then(res => {
        if (res.data.status == "200") {
          this.form = {};
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.$router.push({ path: "/home/sys-rolemgr" });
        }
        return res.data;
      });
    },
    //编辑角色
    updateRole() {},
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
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //部门选择
    choseDept() {
      // console.log("下拉框触发。。");
      // console.log(this.deptId);
    },
    //点击树
    getCheckedKeys() {
      // console.log(">>>>>>>>>>>>>>>>>>>")
      //  console.log(this.$refs.tree.getCheckedKeys());
    }
  },
  mounted() {
    //  console.log(this.role);
    this.form = this.role;
    this.deptId = this.role.deptIdList[0];
  },
  created() {
    //渲染权限
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

    this.getdept();
  }
};
</script>

<style scoped>
.roleAddBox {
  width: auto;
  min-height: 100%;
  /* text-align: left; */
  background-color: #e2e6ef;
  padding: 10px 10px 45px;
  box-sizing: border-box;
}
.addrole-container {
  height: 100%;
  min-height: 850px;
  background-color: #ffffff;
}
.btn-div {
  text-align: left;
  padding: 20px;
}
#classroom_add {
  width: 500px;
  margin: 0 auto;
  padding-top: 40px;
}
.roleinfo {
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
.roleinfo {
  padding-bottom: 50px;
}
</style>