<template>
  <div class="wrapper" id="homeWra">
    <div class="fixed_top">
      <div class="top">
        <div class="top-left">
          <img src="../assets/logo.png" style="height: 60px; margin-top:5px;">
        </div>
        <div></div>
        <!-- 右边的菜单 -->
        <div class="top-right">
          <span
            @click="goMyInfo"
            style="height:  100%;display:  inline-block;padding: 0 20px;font-size: 16px;"
          >
            <!-- <span @click="goMyInfo" style="height:  100%;display:  inline-block;padding: 0 20px; border-right: 1px solid #fff;font-size: 16px;"> -->
            <img src="../assets/用户-icon.png" style="margin: -2px 7px 0px 0px;">
            <!-- 我是  -->
            <!-- <span id="username">{{userName}}</span> -->
          </span>
          <span
            @click="goMsgMgr"
            class="top-msg msgSpanRoot"
            style="height:100%;display:inline-block;padding:0 20px;font-size: 16px;position: relative;"
          >
            <!-- <span @click="goMsgMgr" class="top-msg" style="height:  100%;display:  inline-block;padding: 0 20px; border-right: 1px solid #fff;font-size: 16px;position:  relative;"> -->
            <!-- <span @click="goMsgMgr" class="top-msg" style="height:  100%;display:  inline-block;padding: 0 20px; border-right: 1px solid #fff;font-size: 16px;"> -->
            <!-- <el-badge is-dot class="item"> -->
            <img src="../assets/消息-icon.png" style="margin: -2px 7px 0px 0px;">
            <!-- </el-badge> -->
            <span class="msgspan">{{msgNum}}</span>
            <div class="hiddenDiv">
              <div class="unreadList">
                <ul>
                  <li v-for="item in unreadListData" :key="item.id">
                    <p @click.stop="goMsgWithID(item.id)">
                      <strong>{{item.msgTitle}}:</strong>
                      {{item.msgContent}}
                    </p>
                  </li>
                  <li class="tips" v-if="msgNum>0">没有更多未读消息了~</li>
                </ul>
              </div>
              <div class="unreadFooter">
                <p @click.stop="setAllreaded">全部标记为已读</p>
                <p @click.stop="goMsgMgr">全部消息</p>
              </div>
              <i class="el-icon-bell noMsg" v-if="msgNum==0"></i>
              <p v-if="msgNum==0">暂时没有未读消息~</p>
            </div>
          </span>
          <span
            id="exit"
            @click="exit()"
            style="height:  100%;display:  inline-block;padding: 0 20px;font-size: 16px;"
          >
            <img src="../assets/退出-icon.png" style="margin: -2px 17px 0px 0px;">
            <!-- 退出 -->
          </span>
        </div>
      </div>
    </div>
    <!-- <img src="../assets/logox.png" style="vertical-align: middle;height: 50px;margin-top: 12px;"></div> -->
    <div style="height:69px;"></div>
    <el-row class="container">
      <!-- 菜单栏 -->
      <el-col :span="leftSpan" class="menu">
        <el-menu
          mode="vertical"
          :default-active="defaultActive"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @select="selectMenu"
          style="user-select:none;"
        >
          <el-submenu
            v-for="(item, index) in menusData"
            :key="index"
            v-if="item.list!=undefined&&item.list.length>0"
            :index="index+''"
            :title="item.name||item.name"
            :style="item.color"
          >
            <template slot="title">
              <img :src="item.icon" class="iconimg">
              <span slot="title">{{item.name||item.name}}</span>
            </template>
            <el-menu-item-group v-if="item.list.length>0">
              <router-link
                v-for="(citem, cindex) in item.list"
                :key="cindex"
                v-if="citem.list==undefined"
                :to="{ path:'/home/'+citem.menuUrl}"
              >
                <el-menu-item :index="index+'-'+cindex">{{citem.name||citem.name}}</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>

          <router-link v-else :to="{ path:'/home/'+item.menuUrl}">
            <el-menu-item :index="index+''" style="padding:0px 30px;" class="onlyone">
              <img :src="item.icon" class="iconimg">
              <span
                slot="title"
                style="font-size: 18px;margin-left: 10px;margin-right: 20px;width: 72px;display: inline-block;text-align: left;"
              >{{item.name||item.name}}</span>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-col>
      <!-- 右上栏 -->
      <el-col :span="rightSpan" class="content" id="rightNav">
        <div style="height:calc(100% - 69px);">
          <!-- start tab标签页 -->
          <div class="template-tabs main-page">
            <el-tabs
              v-model="activeIndex"
              type="border-card"
              closable
              @tab-click="tabClick()"
              v-if="options.length"
              @tab-remove="tabRemove"
              style="user-select: none"
            >
              <el-tab-pane :key="item.route" v-for="item in options" :name="item.route">
                <span slot="label">
                  <img :src="item.icon" class="iconimg" style="margin-bottom:-3px">
                  {{item.name}}
                </span>
              </el-tab-pane>
              <router-view></router-view>
            </el-tabs>
          </div>
          <!-- end tab标签页 -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var config = require("./utils/Common_Config");
var Cookies = require("js-cookie");
import Vue from "vue";
import axios from "axios";
var Event = new Vue();
export default {
  name: "home",
  data() {
    return {
      screenWidth: document.body.clientWidth,
      defaultActive: "0",
      userName: Cookies.get("userName"),
      msgNum: 0,
      unreadListData: [],
      isCollapse: false,
      rightSpan: 21,
      leftSpan: 3,
      menusData: [],
      navData: [],
      inter: "",
      // activeMenuName: "",
      activeMenuIcon: "",
      activeSubRouter: "",
      // 单独添加Tab页路由Arr
      menuRouter: [
        "/home-page",
        "/realtime-video",
        "/event-add",
        "/event-direct-report",
        "/event-direct-report-complete",
        "/event-process",
        "/event-now",
        "/event-survey",
        "/survey_tasks",
        "/event-audit",
        "/past-event",
        "/analy-foodBorne",
        "/analy-infections",
        "/analy-areaStati",
        "/analy-region",
        "/data-formsmgr",
        "/data-datumMgr/test",
        "/data-datumMgr/test1",
        "/data-datumMgr/test2",
        "/data-datumMgr/test3",
        "/sys-usermgr",
        "/sys-rolemgr",
        "/sys-partmentmgr",
        "/data-epmgr",
        "/data-vediomgr",
        "/data-sysBulletin",
        "/sys-menumgr",
        "/sys-syslog",
        "/discrimination",
        "/data-Epi"
      ]
    };
  },
  methods: {
    getNav() {
      var that = this;
      this.getMsgNum();
      axios({
        method: "get",
        url: config.apiHost + "/sys/menu/nav"
      }).then(
        function(res) {
          that.menusData = res.data.body.menuList;
          that.menusData[0].icon = that.menusData[0].icon.replace(
            ".png",
            "-checked.png"
          );
          // console.log(res.data.body.menuList)
          that.$store.commit("add_navs", res.data.body.menuList);
          window.parent.permissions = res.data.body.permissions + "";
        },
        response => {
          // console.log("error");
        }
      );
    },
    selectMenu(index) {
      var start = index.split("-")[0];
      this.menusData.forEach((v, i) => {
        if (start == i) {
          // 如果已经切换checked，不重复切换
          if (v.icon.indexOf("-checked.png") !== -1) {
            // console.log("");
          } else {
            v.icon = v.icon.replace(".png", "-checked.png");
          }
        } else {
          v.icon = v.icon.replace("-checked.png", ".png");
        }
      });
      var mainIndex = index.split("-")[0];
      var subIndex = "";
      if (index.indexOf("-") === -1) {
        // this.activeMenuName = this.menusData[index].name;
      } else {
        subIndex = index.split("-")[1];
        // this.activeMenuName = this.menusData[mainIndex].list[subIndex].name;
      }
      this.activeMenuIcon = this.menusData[mainIndex].icon;
      if (this.menusData[mainIndex].list.length > 0) {
        this.activeSubRouter =
          "/home/" + this.menusData[mainIndex].list[subIndex].menuUrl;
      }
    },
    goMyInfo() {
      this.$router.push("/home/personInfo");
    },
    goMsgMgr() {
      this.$router.push("/home/messageMgr");
    },
    exit() {
      var that = this;
      this.$confirm("你确定要退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //   确定退出登录
          this.$http
            .get(config.apiHost + "/sys/logout?token=" + Cookies.get("token"))
            .then(
              data => {
                if (data.body.status == 200) {
                  this.$store.state.tabs.options
                    .slice(1)
                    .forEach(v => this.$store.commit("delete_tabs", v.route));
                  this.$store.commit("set_active_index", "/home/home-page");
                  // that.$router.push('/login?tenUrl='+window.localStorage.getItem('tenUrl'));
                  // that.$router.push('/index.html');
                  that.$router.push("/");
                  Cookies.set("token", "");
                  // 清空vuex中的tabs数组
                  // let tabs = this.$store.state.tabs.options
                  // tabs = tabs.slice(0,1)
                } else {
                  that.$message({
                    message: data.body.body.msg,
                    type: "error"
                  });
                }
              },
              response => {
                // console.log(response.body)
                that.$message({
                  message: response.body.body,
                  type: "error"
                });
              }
            );
          // 不管是否报错，强退
          that.$router.push("/");
          Cookies.set("token", "");
        })
        .catch(() => {
          //   取消退出登录
        });
    },
    toggleMenu() {
      if (this.isCollapse == true) {
        this.isCollapse = false;
        this.rightSpan = 21;
        this.leftSpan = 3;
      } else {
        this.isCollapse = true;
        this.rightSpan = 23;
        this.leftSpan = 1;
      }
    },
    bus_formatData(data) {},
    com_keyMap(list, key, value) {},
    com_keySort(property) {
      return function(obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2;
      };
    },
    interGet() {
      if (Cookies.get("token") == "") {
        clearInterval(this.inter);
      } else {
        this.inter = setInterval(this.getMsgNum, 10000);
      }
    },
    getMsgNum() {
      if (Cookies.get("token") != "") {
        axios({
          method: "get",
          url: config.apiHost + "/sys/msg/unReadTotal"
        }).then(result => {
          if (result.data.status == 200) {
            this.msgNum = result.data.body.total;
            this.unreadListData = result.data.body.mapList;
          }
        });
      }
      // else {
      //   Cookies.set("token", "");
      //   this.$router.push({ path: "/login" });
      // }
      // if (config.canRequest == false) {
      //   Cookies.set("token", "");
      //   config.canRequest = true;
      //   this.$message.error("登录超时，请重新登录");
      //   this.$router.push({ path: "/login" });
      // } else {
      // }
    },
    // tab切换时，动态的切换路由
    tabClick() {
      let path = this.activeIndex;
      this.$router.push({ path: path });
    },
    tabRemove(targetName) {
      // 首页不可删除
      if (targetName == "/home/home-page") {
        return;
      }
      this.$store.commit("delete_tabs", targetName);
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.options && this.options.length >= 1) {
          this.$store.commit(
            "set_active_index",
            this.options[this.options.length - 1].route
          );
          this.$router.push({ path: this.activeIndex });
        } else {
          this.$router.push({ path: "/home/home-page" });
        }
      }
    },
    goMsgWithID(id) {
      this.$router.replace({ path: "/home/messageMgr", query: { msgid: id } });
    },
    setAllreaded() {
      var ids = [];
      var self = this;
      this.unreadListData.forEach(v => {
        ids.push(v.id);
      });
      axios
        .post(config.apiHost + "/sys/msg/userReadMsgAll", {
          msgId: ids.join(",")
        })
        .then(result => {
          if (result.data.status == 200) {
            self.$message.success(result.data.body.msg);
            self.getMsgNum();
          } else {
            self.$message.error(result.data.body.msg);
          }
        });
    }
  },
  created() {
    this.getNav();
  },
  computed: {
    options() {
      return this.$store.state.tabs.options;
    },
    activeIndex: {
      get() {
        return this.$store.state.tabs.activeIndex;
      },
      set(val) {
        this.$store.commit("set_active_index", val);
      }
    }
  },
  watch: {
    $route(to) {
      let flag = false;
      for (let option of this.options) {
        if (option.route === to.path) {
          flag = true;
          let path;
          if (!to.path.split("/home")[1]) {
            path = "/home/home-page";
          } else {
            path = "/home" + to.path.split("/home")[1];
          }
          this.$store.commit("set_active_index", path);
          break;
        }
      }
      if (!flag) {
        let path = "";
        // 顶部导航栏 用户中心 和 消息列表 单独处理
        if (
          to.path.split("/home")[1] === "/personInfo" ||
          to.path.split("/home")[1] === "/messageMgr"
        ) {
          path = "/home" + to.path.split("/home")[1];
          this.$store.commit("add_tabs", {
            route: "/home" + to.path.split("/home")[1],
            name: this.$route.name,
            icon:
              to.path.split("/home")[1] === "/personInfo"
                ? "/store/menu/usericon.png"
                : "/store/menu/messageicon.png"
          });
        } else if (this.menuRouter.indexOf(to.path.split("/home")[1]) !== -1) {
          path = "/home" + to.path.split("/home")[1];
          // 左侧导航处理
          if (this.$store.state.tabs.options.indexOf(to.path) === -1) {
            this.$store.commit("add_tabs", {
              route: "/home" + to.path.split("/home")[1],
              // name: this.activeMenuName,
              name: this.$route.name,
              icon: this.activeMenuIcon
            });
          } else {
            this.$store.commit("set_active_index", path);
          }
        } else {
          // tab页内部路由跳转
          path = this.activeSubRouter;
        }
        this.$store.commit("set_active_index", path);
      }
    },
    // 未读消息
    "$store.state.msgs.unReadMsgcount"(newVal) {
      this.getMsgNum();
    }
  },
  mounted() {
    // if (this.$route.path !== "/home/home-page") {
    //   this.$store.commit("add_tabs", {
    //     route: this.$route.path,
    //     name: this.$route.name
    //   });
    //   this.$store.commit("set_active_index", this.$route.path);
    // }

    // 刷新保留home-page
    if (this.$route.path !== "/home/home-page") {
      this.$store.commit("set_active_index", "/home/home-page");
      this.$router.push("/home/home-page");
    }
  }
};
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
}
a {
  text-decoration: none;
}
.el-menu {
  text-align: left;
  box-sizing: border-box;
}
.el-submenu {
  border-left: none !important;
}

.el-submenu .el-menu-item {
  min-width: 0px;
}
.el-menu-item i {
  margin-right: 5px;
}
.el-menu-item.onlyone span,
.el-submenu__title span {
  display: inline-block;
  width: 6em !important;
  text-align-last: justify;
}
.el-menu-item-group .el-menu-item {
  display: block;
  /* width: 6.5em !important; */
  text-align-last: justify;
  padding: 0 80px 0 62px !important;
}
.el-submenu .el-submenu__title span {
  color: #303133;
}
#homeWra .el-menu-item.is-active {
  z-index: auto;
}

.el-menu-item.onlyone,
.el-submenu {
  border-bottom: 1px solid #eee;
}
.wrapper {
  height: 100%;
}
.el-menu::-webkit-scrollbar {
  width: 0px;
}

.logo {
  height: 69px;
  width: 100%;
  background-color: #006636;
  position: fixed;
}
.fixed_top {
  height: 80px;
  /* background: url(../assets/底图.png); */
  background-color: #006636;
  color: #333;
  z-index: 2;
  width: 100%;
}
.iconimg {
  width: 18px;
  height: 18px;
}

.content {
  /* height: calc(100% - 69px); */
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.fixed_top .top {
  position: relative;
  width: 100%;
  background-color: #006636;
  /*  background: url(../assets/底图.png) right top;
  left: -30px; */
  height: 69px;
  vertical-align: middle;
  line-height: 69px;
}

.fixed_top .top img {
  vertical-align: middle;
  margin-top: 15px;
}

.fixed_top .top .top-right {
  /* background-color: #fff; */
  color: #333;
  text-align: right;
  height: 80px;
}
.msgspan {
  position: absolute;
  top: 14px;
  /* left: 0px; */
  left: 25px;
  background-color: #fcb424;
  height: 16px;
  display: inline-block;
  width: 20px;
  border-radius: 8px;
  line-height: 16px;
  text-align: center;
  color: #fff;
  font-size: 12px;
}
.hiddenDiv {
  width: 300px;
  min-height: 0;
  max-height: 0;
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  position: absolute;
  background: transparent;
  z-index: 999999;
  left: -230px;
  top: 60px;
  transition: all 0.3s;
}
.msgSpanRoot:hover .hiddenDiv {
  min-height: 300px;
  max-height: 300px;
  padding: 10px;
  transition: all 0.3s;
}
.hiddenDiv .unreadList {
  background: #fff;
  height: 250px;
  /* border: 1px solid #006636; */
  position: relative;
  border-radius: 10px 10px 0 0;
  box-shadow: 0px 5px 10px 0px rgba(16, 20, 26, 0.1);
  overflow-y: auto;
  margin-bottom: 50px;
}
/*滚动条整体样式*/
.hiddenDiv .unreadList::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.hiddenDiv .unreadList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
.hiddenDiv .unreadList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}
.hiddenDiv .unreadList li {
  font-size: 12px;
  height: 40px;
  line-height: 40px;
  padding: 0 10px 0 20px;
  text-align: left;
  position: relative;
}
.hiddenDiv .unreadList li::before {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #ff4040;
}
.hiddenDiv .unreadList li:last-child::before {
  background: transparent;
}
.hiddenDiv .unreadList li p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #eee;
}
.hiddenDiv .unreadList li.tips {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #999;
}
.hiddenDiv .unreadFooter {
  width: 280px;
  height: 30px;
  background: #fafafa;
  position: absolute;
  left: 10px;
  bottom: 10px;
  border-radius: 0 0 10px 10px;
  display: flex;
  box-shadow: 0px 5px 10px 0px rgba(16, 20, 26, 0.1);
}
.hiddenDiv .unreadFooter p {
  flex: 1;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  font-weight: bold;
}
.hiddenDiv .unreadFooter p:first-child {
  text-align: left;
  padding-left: 20px;
}
.hiddenDiv .unreadFooter p:last-child {
  text-align: right;
  padding-right: 20px;
  color: #429e73;
}
.noMsg {
  position: absolute;
  left: 50%;
  top: 75px;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  font-size: 60px;
  color: #999;
}
.noMsg + p {
  width: 95%;
  position: absolute;
  top: 140px;
  text-align: center;
  color: #999;
  font-size: 14px;
  margin: 0 auto;
}
.fixed_top .top .top-right span {
  /* padding: 0 10px; */
  cursor: pointer;
}

.menu {
  height: 100%;
  border-right: 1px solid #eee;
}

.container {
  margin-top: -69px;
  height: 100%;
  padding: 0px;
}
.top-left {
  float: left;
  height: 69px;
  font-size: 25px;
  padding-left: 3%;
  font-family: "微软雅黑";
  /* color: #00a0e9; */
  letter-spacing: 8px;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  font-weight: bold;
  color: #fff;
}
</style>
<style>
#homeWra .el-menu {
  height: calc(100% - 69px);
  overflow-y: auto;
  background-color: #ffffff;
  color: #666666;
  font-weight: bold;
  border-right: none;
}
.el-submenu .el-menu-item {
  padding: 0 30px;
}
#homeWra .el-menu-item-group__title {
  padding-top: 0px;
  padding-bottom: 0px;
}
#rightNav .el-breadcrumb__item:last-child .el-breadcrumb__item__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__item__inner a {
  color: #48576a;
}
#rightNav .el-breadcrumb__item:last-child .el-breadcrumb__item__inner:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__item__inner a:hover {
  color: #20a0ff;
  cursor: pointer;
}
/* .el-menu{
    background: #283142;
} */
#homeWra .el-submenu__title {
  color: #666666;
  font-weight: bold;
  padding-left: 30px !important;
}
#homeWra .el-submenu__title:hover {
  background-color: #eee;
  /*background: url(../assets/kuang-left.png) center center no-repeat;*/
}
#homeWra .el-submenu__title i {
  position: static;
  margin-top: 0px;
}
.el-submenu .el-menu-item {
  color: #666666;
}
.router-link-active .el-menu-item:hover {
  background-color: #eee;
  color: #006636;
  /*background: url(../assets/kuang-left.png) center center no-repeat;*/
}
.el-submenu .el-menu-item:hover {
  background-color: #eee;
  color: #006636;
  /*background: url(../assets/kuang-left.png) center center no-repeat;*/
}
.onlyone {
  padding: 15px 20px 0px;
}
#homeWra .el-menu .onlyone:hover {
  background-color: #eee;
  color: #006636;
  /*background: url(../assets/kuang-left.png) center center no-repeat;*/
}
.el-submenu__title span {
  margin: 0 10px;
  font-size: 18px;
}
.el-menu-item-group li {
  font-size: 16px;
}

/* 子菜单选中后样式 */
#homeWra .el-menu-item.is-active {
  /* background-color: #eee; */
  /* color: #006636; */
  /* background: url(../assets/kuang-left.png) center center no-repeat;*/
  z-index: 100;
  /* margin-right:-8px;
    position: relative;
    left:10; */
}
.el-menu-item-group > ul {
  background-color: #fff;
}

.el-tabs {
  padding-bottom: 25px;
  background: #f7f7f7;
}

.el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

.el-tabs__nav .el-tabs__item:nth-child(1) span.el-icon-close {
  display: none;
}

.el-tabs .el-tabs--top .el-tabs--border-card {
  background: #eee;
}

.el-tabs__item.is-closable {
  border-right-color: #ccc !important;
}

#homeWra .el-submenu__title i {
  position: absolute !important;
  top: 50%;
  right: 35px;
  transform: translate(-50%, -50%);
}
.router-link-active li {
  box-sizing: border-box;
  border-left: 3px solid #006636;
  background: #ddd;
  color: #006636;
}
.router-link-exact-active.router-link-active li {
  color: #006636;
  background: #ddd;
}
.is-opened,
.is-opened ul {
  background: #eee !important;
}

.el-tabs__content {
  background: #e2e6ef;
}

li,
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
body,
html {
  height: 100%;
  overflow: hidden;
  font-size: 14px;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>