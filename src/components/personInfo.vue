<template>
  <div class="person-info">
    <h1 class="infotitle">个人基本信息</h1>
    <div class="form-ul">
      <ul>
        <li :class="{active:activeItem==0}" @click="activeItem=0">
          <p class="title">姓名</p>
          <p class="info">{{formInline.userName}}</p>
          <el-button type="text" size="mini" class="editIcon" @click="activeItem=0">
            <img src="../assets/bj.png">
          </el-button>
          <div class="inner-div">
            <input class="editInput" v-model="formInline.userName" placeholder="请输入">
            <p class="inner-footer">
              <el-button class="ok inner" type="text" size="small" @click.stop="closeShow">确定</el-button>
              <el-button class="cancel inner" type="text" size="small" @click.stop="closeShow">取消</el-button>
            </p>
          </div>
        </li>
        <li :class="{active:activeItem==1}" @click="activeItem=1">
          <p class="title">性别</p>
          <p class="info">{{formInline.sex=='MALE'?'男':'女'}}</p>
          <el-button type="text" size="mini" class="editIcon" @click="activeItem=1">
            <img src="../assets/bj.png">
          </el-button>
          <div class="inner-div">
            <el-radio-group v-model="formInline.sex">
              <el-radio label="MALE">男</el-radio>
              <el-radio label="FEMALE">女</el-radio>
            </el-radio-group>
            <p class="inner-footer">
              <el-button class="ok inner" type="text" size="small" @click.stop="closeShow">确定</el-button>
              <el-button class="cancel inner" type="text" size="small" @click.stop="closeShow">取消</el-button>
            </p>
          </div>
        </li>
        <li :class="{active:activeItem==2}" @click="activeItem=2">
          <p class="title">手机号码</p>
          <p class="info">{{formInline.mobile}}</p>
          <el-button type="text" size="mini" class="editIcon" @click="activeItem=2">
            <img src="../assets/bj.png">
          </el-button>
          <div class="inner-div">
            <input class="editInput" v-model="formInline.mobile" placeholder="请输入">
            <p class="inner-footer">
              <el-button class="ok inner" type="text" size="small" @click.stop="closeShow">确定</el-button>
              <el-button class="cancel inner" type="text" size="small" @click.stop="closeShow">取消</el-button>
            </p>
          </div>
        </li>
        <li :class="{active:activeItem==3}" @click="activeItem=3">
          <p class="title">身份证号</p>
          <p class="info">{{formInline.identityNo}}</p>
          <el-button type="text" size="mini" class="editIcon" @click="activeItem=3">
            <img src="../assets/bj.png">
          </el-button>
          <div class="inner-div">
            <input class="editInput" v-model="formInline.identityNo" placeholder="请输入">
            <p class="inner-footer">
              <el-button class="ok inner" type="text" size="small" @click.stop="closeShow">确定</el-button>
              <el-button class="cancel inner" type="text" size="small" @click.stop="closeShow">取消</el-button>
            </p>
          </div>
        </li>
        <li :class="{active:activeItem==4}" @click="activeItem=4">
          <p class="title">部门E-mail</p>
          <p class="info">{{formInline.email}}</p>
          <el-button type="text" size="mini" class="editIcon" @click="activeItem=4">
            <img src="../assets/bj.png">
          </el-button>
          <div class="inner-div">
            <input class="editInput" v-model="formInline.email" placeholder="请输入">
            <p class="inner-footer">
              <el-button class="ok inner" type="text" size="small" @click.stop="closeShow">确定</el-button>
              <el-button class="cancel inner" type="text" size="small" @click.stop="closeShow">取消</el-button>
            </p>
          </div>
        </li>
        <li>
          <p class="title">所属角色</p>
          <p class="info">{{formInline.rolesName}}</p>
        </li>
        <li :class="{active:activeItem==6}" @click="activeItem=6">
          <p class="title">家庭地址</p>
          <p class="info">{{formInline.address}}</p>
          <el-button type="text" size="mini" class="editIcon" @click="activeItem=6">
            <img src="../assets/bj.png">
          </el-button>
          <div class="inner-div">
            <input class="editInput" v-model="formInline.address" placeholder="请输入">
            <p class="inner-footer">
              <el-button class="ok inner" type="text" size="small" @click.stop="closeShow">确定</el-button>
              <el-button class="cancel inner" type="text" size="small" @click.stop="closeShow">取消</el-button>
            </p>
          </div>
        </li>
        <li :class="{active:activeItem==7}" @click="activeItem=7">
          <p class="title">账户密码</p>
          <p class="info" style="font-weight:bold;">* * * * * *</p>
          <el-button type="text" size="mini" class="editIcon" @click="activeItem=7">
            <img src="../assets/mima.png">
          </el-button>
          <div class="inner-div">
            <div class="pwdItem">
              <p class="title">原始密码</p>
              <input class="editInput" type="password" v-model="password.oldpwd" placeholder="请输入">
            </div>
            <div class="pwdItem">
              <p class="title">新密码</p>
              <input class="editInput" type="password" v-model="password.newpwd" placeholder="请输入">
            </div>
            <div class="pwdItem">
              <p class="title">确认密码</p>
              <input class="editInput" type="password" v-model="password.secondnewpwd" placeholder="请输入">
            </div>
            <p class="inner-footer">
              <el-button
                class="ok inner"
                type="text"
                size="small"
                @click.stop="modifyPwdSub"
                :loading="pwdloading"
              >确定</el-button>
              <el-button
                class="cancel inner"
                type="text"
                size="small"
                @click.stop="closeShow('pwd')"
              >取消</el-button>
            </p>
          </div>
        </li>
        <li :class="{active:activeItem==8}" @click="activeItem=8">
          <p class="title">通讯地址</p>
          <p class="info" style="font-weight:bold;">{{formInline.contactAddress}}</p>
          <el-button type="text" size="mini" class="editIcon" @click="activeItem=8">
            <img src="../assets/bj.png">
          </el-button>
          <div class="inner-div">
            <input class="editInput" v-model="formInline.contactAddress" placeholder="请输入">
            <p class="inner-footer">
              <el-button class="ok inner" type="text" size="small" @click.stop="closeShow">确定</el-button>
              <el-button class="cancel inner" type="text" size="small" @click.stop="closeShow">取消</el-button>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <el-button class="ok" type="text" size="small" @click="onSubmit" :loading="okloading">保存</el-button>
      <el-button class="cancel" type="text" size="small" @click="getInfo">重置</el-button>
    </div>
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
      activeItem: -1,
      pwdloading: false,
      okloading: false
    };
  },
  methods: {
    onSubmit() {
      var that = this;
      if (!that.formInline.userName||that.formInline.userName.trim()=='') {
        that.$message.error("请输入名字");
        return;
      }
      that.okloading = true;
      axios({
        method: "post",
        url: config.apiHost + "/sys/user/update",
        data: that.formInline
      }).then(response => {
        if (response.data.status == 200) {
          that.$message.success(response.data.body.msg);
          that.okloading = false;
        } else {
          that.$message.error(response.data.body.message);
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
      this.pwdloading = true;
      var that = this;
      axios({
        method: "get",
        url: config.apiHost + "/sys/user/password",
        params: {
          newPassword: md5(that.password.newpwd),
          password: md5(that.password.oldpwd)
        }
      })
        .then(response => {
          var data = response.data;
          if (data.status == 200) {
            that.pwdloading = false;
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
        })
        .catch(error => {});
    },
    closeShow(value) {
      this.activeItem = -1;
      if (value) {
        this.password.newpwd = "";
        this.password.oldpwd = "";
        this.password.secondnewpwd = "";
        this.dialogVisible = false;
      }
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
  margin: 8px auto 100px;
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
  margin-bottom: 10px;
}
.form-ul {
  width: 85%;
  max-height: 600px;
  margin: 0 auto;
  overflow-y: auto;
}
/*滚动条整体样式*/
.form-ul::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.form-ul::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
.form-ul::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}
.form-ul li {
  padding: 10px 0;
  position: relative;
  border-bottom: 1px solid #eee;
}
.form-ul li.active {
  background: #fafafa;
}
.form-ul li > p {
  height: 30px;
  line-height: 30px;
}
.form-ul li p.title {
  width: 7em;
  padding-left: 2em;
  text-align: justify;
  text-align-last: justify;
  font-weight: bold;
}
.form-ul li p.info {
  position: absolute;
  width: 100%;
  padding-left: 10em;
  box-sizing: border-box;
  left: 0;
  top: 10px;
  text-align: left;
  transition: width 0.3s;
  overflow: hidden;
}
.form-ul li.active p.info {
  width: 0;
}
.form-ul li .editIcon {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 2em;
  top: 10px;
  display: none;
}
.form-ul li .inner-div {
  max-height: 0;
  width: 90%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.form-ul li.active .inner-div {
  max-height: 500px;
  background: #fff;
  margin: 10px auto;
  padding: 10px;
  transition: max-height 0.5s;
}
.form-ul li .inner-div .inner-footer {
  margin: 10px auto 0;
  text-align: right;
}
.form-ul li .inner-div .editInput {
  border: none;
  outline-style: none;
  display: block;
  height: 35px;
  line-height: 35px;
  width: 100%;
  padding-left: 10px;
}
.form-ul li:hover .editIcon {
  display: block;
}
.form-ul li .inner-div .editInput:focus {
  border-bottom: 1px solid #429e73;
}
.form-ul li .inner-div .el-radio-group {
  text-align: left;
  display: block;
  padding-left: 10px;
}
.form-ul li .inner-div .pwdItem {
  position: relative;
}
.form-ul li .inner-div .pwdItem p.title {
  font-weight: normal;
  height: 35px;
  line-height: 35px;
}
.form-ul li .inner-div .pwdItem .editInput {
  position: absolute;
  left: 9em;
  top: 0;
  background: transparent;
}
.footer {
  margin-top: 50px;
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
.ok.inner,
.cancel.inner {
  width: 60px;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
  padding: 0;
  font-size: 12px;
}
.el-button--text:active {
  color: #429e73 !important;
}
</style>