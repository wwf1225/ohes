<template>
  <div class="realtime_contain">
    <div class="c_flex v_header">
      <!-- 操作 -->
      <div class="c_flex">
        <el-button type="primary" size="small" @click="AllStart">全部开始</el-button>
        <el-button type="primary" size="small" @click="AllEnd">全部结束</el-button>
        <el-button type="primary" size="small" @click="startTalk">开始对讲</el-button>
        <el-button type="primary" size="small" @click="endTalk">结束对讲</el-button>
      </div>

      <!-- 线路 -->
      <div class="c_flex">
        <el-button class="numBtn" size="mini" @click="changeNum(1)">1</el-button>
        <el-button class="numBtn" size="mini" @click="changeNum(4)">4</el-button>
        <el-button class="numBtn" size="mini" @click="changeNum(9)">9</el-button>
        <el-button class="numBtn" size="mini" @click="changeNum(16)">16</el-button>
      </div>
    </div>
    <div id="cmsv6flash" class="v_main"></div>
  </div>
</template>

<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      myjsession: "",
      isInitFinished: false,
      videoList: []
    };
  },
  methods: {
    //实时视频
    login() {
      $.ajax({
        type: "GET",
        async: true, //异步执行 默认是true异步
        url:
          "http://211.162.125.206:8080/StandardApiAction_login.action?account" +
          "=" +
          "myaqkj" +
          "&" +
          "password" +
          "=" +
          "000000",
        dataType: "json",
        success: (data, status, xhr) => {
          this.myjsession = data.jsession;
          // console.log('this.myjsession',this.myjsession);
          this.initPlayerExample();
        }
      });
    },

    //初始化视频插件
    initPlayerExample() {
      //视频插件初始化参数
      var params = {
        allowFullscreen: "true",
        allowScriptAccess: "always",
        bgcolor: "#FFFFFF",
        wmode: "transparent"
      };
      //初始化flash
      // swfobject.embedSWF("./static/home/player.swf", "cmsv6flash", '100%', '90%', "11.0.0", null, null, params, null);
      swfobject.embedSWF(
        "./system/home/player.swf",
        "cmsv6flash",
        "100%",
        "750px",
        "11.0.0",
        null,
        null,
        params,
        null
      );
      this.initFlash();
    },
    //视频插件是否加载完成
    initFlash() {
      // console.log(this.myjsession);
      if (
        swfobject.getObjectById("cmsv6flash") == null ||
        typeof swfobject.getObjectById("cmsv6flash").setWindowNum == "undefined"
      ) {
        setTimeout(this.initFlash, 50);
      } else {
        //设置视频插件的语言
        // swfobject.getObjectById("cmsv6flash").setLanguage("./static/home/cn.xml");
        swfobject
          .getObjectById("cmsv6flash")
          .setLanguage("./system/home/cn.xml");
        //先将全部窗口创建好
        swfobject.getObjectById("cmsv6flash").setWindowNum(36);
        //再配置当前的窗口数目
        swfobject.getObjectById("cmsv6flash").setWindowNum(4);
        //设置视频插件的服务器
        swfobject
          .getObjectById("cmsv6flash")
          .setServerInfo("211.162.125.206", "6605");
        this.isInitFinished = true;

        // this.playVideo();
      }
    },
    //播放视频
    playVideo() {
      //停止播放视频
      swfobject.getObjectById("cmsv6flash").stopVideo(0);
      //设置视频窗口标题
      swfobject.getObjectById("cmsv6flash").setVideoInfo(0, "10007078");
      //播放视频
      swfobject
        .getObjectById("cmsv6flash")
        .startVideo(0, this.myjsession, "10007078", 0, 1, true);
    },

    //停止播放视频
    stopVideo() {
      swfobject.getObjectById("cmsv6flash").stopVideo(0);
    },

    //重置视频窗口
    reSetVideo() {
      swfobject.getObjectById("cmsv6flash").reSetVideo(0);
    },

    // 改变窗口数
    changeNum(num) {
      swfobject.getObjectById("cmsv6flash").setWindowNum(num);
    },

    //全部开始
    AllStart() {
      this.videoList = [];
      axios
        .get(config.apiHost + "/devices/online", {
          params: {
            //请求参数
            jsession: this.myjsession
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.videoList = result.data.body;
            for (let i = 0; i < this.videoList.length; i++) {
              //停止播放视频
              swfobject.getObjectById("cmsv6flash").stopVideo(i);
              //设置视频窗口标题
              swfobject
                .getObjectById("cmsv6flash")
                .setVideoInfo(i, this.videoList[i].deviceNo);
              //播放视频
              swfobject
                .getObjectById("cmsv6flash")
                .startVideo(
                  i,
                  this.myjsession,
                  this.videoList[i].deviceNo,
                  0,
                  1,
                  true
                );
            }
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },

    //全部结束
    AllEnd() {
      for (let i = 0; i < this.videoList.length; i++) {
        //停止播放视频
        swfobject.getObjectById("cmsv6flash").stopVideo(i);
      }
    },
    //开始对讲
    startTalk() {
      axios
        .get(config.apiHost + "/devices/online", {
          params: {
            //请求参数
            jsession: this.myjsession
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.videoList = result.data.body;
            for (let i = 0; i < this.videoList.length; i++) {
              //开始对讲
              var ret = swfobject
                .getObjectById("cmsv6flash")
                .startTalkback(
                  this.videoList,
                  this.videoList[i].deviceNo,
                  0,
                  "211.162.125.206",
                  "6605"
                );
              //返回 0成功，1表示正在对讲，2表示没有mic，3表示禁用了mic。
            }
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //结束对讲
    endTalk() {
      swfobject.getObjectById("cmsv6flash").stopTalkback();
    }
  },
  mounted() {
    this.login();
  }
};
</script>

<style scoped>
.realtime_contain {
  width: 100%;
  min-height: 750px;
  margin: 8px;
  padding: 0 8px 8px;
  background: #fff;
}
.realtime_contain #cmsv6flash{
  min-height: 750px;
}
.v_header {
  height: 60px;
  width: 100%;
  justify-content: space-between;
}

.v_main {
  height: calc(100% - 60px);
  width: 100%;
}
.c_flex {
  display: flex;
  align-items: center;
}
.el-tabs__content {
  background: transparent;
}
.numBtn {
  border-color: #429e73;
  background: #fff;
  color: #429e73;
}
.numBtn:hover {
  border-color: #006636;
  background: #006636;
  color: #fff;
}
</style>

