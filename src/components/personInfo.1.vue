<template>
  <div class="person-info">
    <h1 class="infotitle">个人基本信息</h1>
    <el-form
      ref="form"
      :rules="rules"
      class="info-form"
      :model="formInline"
      label-width="100px"
      style="text-algin:left;"
    >
      <el-form-item label="用户姓名" prop="userName">
        <el-input v-model="formInline.userName"></el-input>
      </el-form-item>
      <el-form-item label="性别" style="text-align: left;">
        <el-radio-group v-model="formInline.sex">
          <el-radio label="MALE">男</el-radio>
          <el-radio label="FEMALE">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="formInline.mobile"></el-input>
        <!-- <span>更换绑定</span> -->
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="formInline.identityNo"></el-input>
      </el-form-item>

      <el-form-item label="部门E-mail">
        <el-input v-model="formInline.email"></el-input>
      </el-form-item>
      <el-form-item label="所属角色" style="text-align: left;">
        <!-- <el-input v-model="formInline.roles" :disabled="true"></el-input> -->
        <span style="color:#679AFF">{{formInline.rolesName}}</span>
        <!-- <span >{{item.name}}</span> -->
      </el-form-item>
      <el-form-item label="家庭住址">
        <el-input v-model="formInline.address"></el-input>
      </el-form-item>
      <el-form-item label="账户密码">
        <el-input type="password" :disabled="true" v-model="formInline.password"></el-input>
        <span style="color: #00A5E9;cursor:pointer;" @click="modifyPwd">【修改密码】</span>
      </el-form-item>
      <el-form-item label="通讯地址">
        <el-input v-model="formInline.contactAddress"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" style="width:200px;" @click="onSubmit">保存</el-button>
      <el-button type="primary" style="width:200px;" @click="getInfo">重置</el-button>
    </div>

    <!-- 修改密码弹出框 -->
    <el-dialog title="修改密码" width="40%" :visible.sync="dialogVisible">
      <el-form
        :inline="false"
        :model="password"
        label-width="110px"
        style="width: 540px;margin: 0 auto;"
      >
        <el-form-item label="旧密码：" prop="oldpwd">
          <el-input type="password" v-model="password.oldpwd" style="width:430px" required></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newpwd">
          <el-input type="password" v-model="password.newpwd" style="width:430px" required></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="newpwd">
          <el-input type="password" v-model="password.secondnewpwd" style="width:430px" required></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyPwdSub">确认</el-button>
        <el-button @click="closeShow">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var config = require("./utils/Common_Config");
import axios from "axios";
import md5 from "js-md5";
var Cookies = require("js-cookie");
export default {
  data() {
    return {
      dialogVisible: false,
      password: {
        oldpwd: "",
        newpwd: "",
        secondnewpwd: ""
      },
      formInline: {
        userName: "",
        sex: "",
        mobile: "",
        Email: "",
        identityNo: "",
        deptName: "",
        email: "",
        roles: "",
        address: "",
        contactAddress: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      var that = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          axios({
            method: "post",
            url: config.apiHost + "/sys/user/update",

            data: that.formInline
          }).then(
            function(response) {
              if (response.data.status == 200) {
                // that.formInline=response.data.body;
                that.$message({
                  type: "success",
                  message: response.data.body.msg
                });
              } else {
                that.$message({
                  showClose: true,
                  type: "error",
                  message: response.data.body.message
                });
              }
            },
            response => {
              console.log("error");
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getInfo() {
      var that = this;
      axios({
        method: "get",
        url: config.apiHost + "/sys/user/info"
      }).then(
        function(response) {
          if (response.data.status == 200) {
            that.formInline = response.data.body;
          } else {
            that.$message({
              type: "error",
              message: response.data.message
            });
          }
        },
        response => {
          console.log("error");
        }
      );
    },
    modifyPwd() {
      this.dialogVisible = true;
    },
    modifyPwdSub() {
      this.password.oldpwd = this.password.oldpwd.trim();
      this.password.newpwd = this.password.newpwd.trim();
      this.password.secondnewpwd = this.password.secondnewpwd.trim();
      if (this.password.oldpwd == "") {
        this.$message.error("请输入旧密码");
        return;
      } else if (this.password.newpwd == "") {
        this.$message.error("请输入新密码");
        return;
      } else if (this.password.secondnewpwd == "") {
        this.$message.error("请再次输入新密码");
        return;
      } else if (this.password.secondnewpwd != this.password.newpwd) {
        this.$message.error("两次密码输入不一致，请重新输入");
        return;
      }
      var that = this;
      axios({
        method: "get",
        url: config.apiHost + "/sys/user/password",
        params: {
          newPassword: md5(that.password.newpwd),
          password: md5(that.password.oldpwd)
        }
      }).then(
        function(response) {
          var data = response.data;
          if (data.status == 200) {
            that.$message.success(data.body.msg);
            //重新登录
            that.$store.state.tabs.options
              .slice(1)
              .forEach(v => that.$store.commit("delete_tabs", v.route));
            that.$store.commit("set_active_index", "/home/home-page");
            that.$router.push("/");
            Cookies.set("token", "");
          } else {
            that.$message.error(data.body.msg);
          }
        },
        response => {
          console.log("error");
        }
      );
    },
    closeShow() {
      this.password.newpwd = "";
      this.password.oldpwd = "";
      this.password.secondnewpwd = "";
      this.dialogVisible = false;
    }
  },
  created() {
    this.getInfo();
  }
};
</script>

<style scoped>
.person-info {
  width: 50%;
  margin: 8px auto;
  background: #fff;
  padding: 20px 0 50px;
}
.info-form {
  width: 1024px;
  margin: 0 auto;
  text-align: left;
}
.info-form .el-input {
  width: 350px;
}
.perhead {
  text-align: left;
  height: 60px;
  width: 90%;
  margin: 0 auto;
  line-height: 60px;
  font-size: 20px;
}
.infotitle {
  font-size: 16px;
  line-height: 50px;
  font-weight: bold;
  color: #333;
  font-family: "微软雅黑";
  text-align: center;
  border-bottom: 1px solid #eee;
  width: 95%;
  margin: 0 auto;
  margin-bottom: 40px;
}
</style>