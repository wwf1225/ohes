<template>
  <div class="login-container">
    <div class="logintab">
      <div class="login-title">
        <img src="../assets/logo_green.png" style="margin-top:5px;">
      </div>
      <div
        class="login-info"
      >事件接报&nbsp;·&nbsp;事件审批&nbsp;·&nbsp;智能分析&nbsp;·&nbsp;动态表单&nbsp;·&nbsp;报告生成</div>
      <div class="login-form">
        <div>
          <img src="../assets/login_show.png" style="float:left;width:330px;padding-left:10%">
        </div>
        <div>
          <ul class="loginul">
            <!-- <li class="inp_bark">
                <el-select v-model="ruleForm.tenUrl" filterable placeholder="请选择租户地区">
                  <el-option
                    v-for="item in tenUrlList"
                    :key="item.url"
                    :label="item.name"
                    :value="item.url">
                  </el-option>
                </el-select>
            </li>-->
            <li class="inp_bark">
              <i class="fa fa-user-o"></i>
              <el-input
                type="text"
                v-model="ruleForm.username"
                placeholder="请输入用户名"
                auto-complete="off"
              ></el-input>
            </li>
            <li class="inp_bark">
              <i class="fa fa-lock" style="font-size:20px;"></i>
              <el-input
                type="password"
                v-model="ruleForm.password"
                placeholder="请输入密码"
                @keyup.enter.native="submitData"
                auto-complete="off"
              ></el-input>
            </li>

            <li class="inp_bark">
              <el-button
                type="primary"
                style="width: 300px;"
                @click="submitData()"
                :disabled="loginBtnDisabled"
              >登录</el-button>
            </li>
            <li
              class="inp_bark"
              style="text-align:right;font-size:7px;padding-right: 60px;color:#b9b9b9"
            >
              <span>版本号{{version}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var config = require("./utils/Common_Config");
var Cookies = require("js-cookie");
import md5 from "js-md5";
export default {
  name: "Login",
  data() {
    return {
      loginBtnDisabled: false,
      version: "",
      ruleForm: {
        username: "",
        password: "",
        tenUrl: ""
      },
      tenUrlList: []
    };
  },
  methods: {
    submitData() {
      var self = this;
      const { username, password, tenUrl } = this.ruleForm;
      if (username.trim() == "" || password.trim() == "") {
        this.$message({
          type: "error",
          message: "请输入用户名或密码"
        });
        return;
      } else {
        // if(tenUrl==''){
        //   this.$message({
        //   type: 'error',
        //   message: '请选择疾控所属地区'
        // })
        // return;
        // }
        self.loginBtnDisabled = true;
        this.$http
          .post(
            config.apiHost + "/sys/login",
            { username: username, password: md5(password) },
            { emulateJSON: true },
            { "Content-Type": "application/json;charset=UTF-8" }
          )
          .then(response => {
            var data = response.body;
            if (data.status == 200) {
              this.$message({
                duration: 1000,
                type: "success",
                message: "登录成功",
                onClose: function() {
                  // if (data.body.userId != undefined) {
                  config.token = data.body.sessionId;
                  //   console.log(config.token);
                  // }

                  // if (window.localStorage) {

                  //   window.localStorage.setItem('token', data.body.sessionId)
                  // }
                  // console.log(window.localStorage.getItem('token'))
                  Cookies.set("token", data.body.sessionId, { expires: 1 });
                  Cookies.set("userName", data.body.userName);
                  Cookies.set("depName", data.body.depName);
                  config.canRequest = true;
                  // console.log(Cookies.get('token') + '登录页面的cookie')
                  var target = self.$route.query.redirect;

                  if (target == undefined) {
                    target = config.indexPagePath;
                  }

                  self.$router.push(target);
                  self.loginBtnDisabled = false;
                }
              });
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: data.body.message
              });
              self.loginBtnDisabled = false;
            }
          })
          .catch(error => {
            self.loginBtnDisabled = false;
          });
      }
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
  },
  created() {
    this.$http.get(config.apiHost + "/version/select").then(response => {
      var data = response.body;
      // console.log(data.body.msg);
      this.version = data.body.msg;
    });

    // console.log("登录页面的token"+Cookies.get('token'));
    if (Cookies.get("token") == "" || Cookies.get("token") == undefined) {
      // this.ruleForm.tenUrl = this.$route.params.tenUrl;
      // this.ruleForm.tenUrl = this.getQueryString('tenUrl')
      // this.$http.get(config.apiHost+"/sys/tenUrl").then(response=>{
      //   if(response.body.status==200){
      //     this.tenUrlList=response.body.body;

      //   }else{

      //     this.$message({
      //       showClose:true,
      //       type:'error',
      //       message:response.body.body.msg
      //     })

      //   }
      // })
      if (window.localStorage) {
        // window.localStorage.setItem('tenUrl', this.ruleForm.tenUrl)
        // alert(window.localStorage.getItem('tenUrl'))
      }
      var that = this;

      // document.onkeydown=function(e){
      //   if(!e) e = window.event;
      //   if((e.keyCode || e.which) == 13) {
      //     that.submitData();

      //   }
      // }

      // alert(window.localStorage.getItem('tenUrl'));
      // Cookies.set('tenUrl',this.ruleForm.tenUrl);
    } else {
      var self = this;
      var target = self.$route.query.redirect;

      if (target == undefined) {
        target = config.indexPagePath;
      }

      self.$router.push(target);
    }
  }
};
</script>

<style>
html,
body,
.container-table {
  height: 100%;
  background-color: #fff !important;
  margin: 0;
  padding: 0;
}

.container-table {
  display: table;
  color: white;
}
.logintab {
  width: 900px;
  /* margin-left: 27%; */
  background-color: #fff;
  border-radius: 15px;
  border: 0px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
  /* margin-top: 50px; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
}
.inp_bark {
  position: relative;
  list-style: none;
}
.inp_bark .fa {
  display: inline-block;
  width: 29px;
  height: 29px;
  position: absolute;
  background-repeat: no-repeat;
  font-size: 16px;
  color: #ccc;
  right: 410px;
  z-index: 1;
  top: 12px;
}
.inp_bark button {
  background-color: #91c3ab;
  border-radius: 33px;
  border: 0px;
}
.inp_bark button:hover {
  background-color: #006636;
}
.inp_bark button:after {
  background-color: #006636;
}
.loginul {
  outline: none;
  padding-top: 30px;
}
.login-title {
  font-size: 24px;
  padding-top: 4%;
  color: #5182c4;
  height: 100px;
  line-height: 100px;
}
.login-info {
  font-size: 16px;
  color: #666666;
  padding-top: 2%;
  padding-bottom: 4%;
}
.login-form {
  float: flex;
}
.inp_bark {
  height: 65px;
}
.login-container {
  height: 100%;
  width: 100%;
  background-image: url("../assets/bg.png");
  background-size: cover;
  position: relative;
}

.input-group input {
  height: 4em;
}

.login-container .el-input {
  width: 300px;
}

.inputclass {
  border: 0px;
}

.login-container .el-input__inner {
  outline: none;
  border: 0px;
  border-bottom: 1px solid #eeeeee;
  border-radius: 0px;
  padding-left: 40px;
}

.login-container {
  height: 100%;

  padding-top: 200px;
}

.login-container input:-webkit-autofill {
  /* -webkit-text-fill-color: #fff !important; */

  outline: none;
}

.login_form {
  width: 400px;
  margin: 0 auto;
}
</style>
