<template>
  <!-- 所有查看 -->
  <div class="mybox">
    <div class="exam">调查详情
      <el-button
        size="mini"
        type="success"
        style="float: right; margin: auto 0"
        @click="closeDetail"
      >返回</el-button>
    </div>

    <div class="from-box">
      <div class="event-title">
        <div>事件接报</div>
        <div class="mytag" @click="showDetail">
          <img src="../../assets/jian.png" style="height:25px;width:25px;" alt v-show="downIcon">
          <img src="../../assets/add.png" style="height:15px;width:15px;" alt v-show="!downIcon">
        </div>
      </div>
      <form :model="form" class="event-form">
        <div class="info">报告人信息</div>

        <div class="input-div">
          <label class="label-div">报告人</label>
          <input type="text" class="inp inp-per" v-model="form.reportUser" readonly>
          
          <label class="label-div">报告电话</label>
          <input type="text" class="inp inp-per" v-model="form.reportPhone" readonly>
        </div>
        <div class="input-div">
          <label class="label-div">报告来源</label>
          <input type="text" class="inp inp-per" v-model="form.originName" readonly>
          
          <label class="label-div">接报时间</label>
          <input type="text" class="inp inp-per" v-model="form.reportedTime" readonly>
        </div>

        <div v-show="downIcon">
          <div class="info">事件信息</div>
          <div class="input-div">
            <label class="label-div">事件开始时间</label>
            <input type="text" class="inp inp-per" v-model="form.startTime" readonly>
            
            <label class="label-div">疑似病例数</label>
            <input type="text" class="inp inp-per" v-model="form.caseNumber" readonly>
          </div>
          <div class="input-div">
            <label class="label-div">事件场所</label>
            <input type="text" class="inp inp-per" v-model="form.placeName" readonly>
            <input
              type="text"
              class="inp inp-per"
              v-model="form.otherPlaces"
              v-show="eventPlace"
              style="width:  230px;margin-left: 10px;"
              readonly
            >
            <input
              type="text"
              class="inp inp-per"
              v-model="form.detailName"
              v-show="!eventPlace"
              style="width:  230px;margin-left: 10px;"
              readonly
            >
          </div>
          <div class="input-div">
            <label class="label-div">地点</label>
            <input type="text" class="inp inp-per" v-model="form.address" readonly>
            
            <label class="label-div">疑似事件类型</label>
            <input type="text" class="inp inp-per" v-model="genre" readonly>
          </div>

          <div class="input-div">
            <label class="label-div">疑似事件</label>
            <input type="text" class="inp" style="width:63%" v-model="form.name" readonly>
          </div>
          <div class="text-input">
            <label class="label-div">事件概要</label>
            <textarea class="area" v-model="form.comment" readonly></textarea>
          </div>
          <div class="text-input">
            <label class="label-div">流调人员</label>
            <span style="color:#409EFF">{{form.userNameList}}</span>
          </div>
        </div>
      </form>
    </div>

    <!--调查列表-->
    <div class="choose" v-show="form.status==4">
      <div class="event-title">调查列表</div>
      <div class="list" v-show="nums!=null">
        <router-link v-if="nums.countScene>0" :to="{ path:'/home/past-event-detail/new-research' }">
          <div class="btn2" style="background-color: #71B6F9;">
            <div class="btnText">
              <div>现况调查</div>
              <div>
                <span style="font-size:16px">{{nums.countScene}}</span> 个
              </div>
            </div>
            <div class="btnImg">
              <img src="../../assets/new.png" alt style="width:100%;height:100%;">
            </div>
          </div>
        </router-link>
        <div v-else class="btn2" style="background-color: #CCCCCC;">
          <div style="padding: 0 15px;font-size: 12px;">现况调查</div>
          <div class="btnImg">
            <img src="../../assets/new.png" alt style="width:100%;height:100%;">
          </div>
        </div>

        <router-link v-if="nums.countCase>0" :to="{ path:'/home/past-event-detail/case-research'}">
          <div class="btn2" style="background-color: #00CCFF;">
            <div class="btnText">
              <div>个案调查</div>
              <div>
                <span style="font-size:16px">{{nums.countCase}}</span> 个
              </div>
            </div>
            <div class="btnImg">
              <img src="../../assets/case.png" alt style="width:100%;height:100%;">
            </div>
          </div>
        </router-link>
        <div v-else class="btn2" style="background-color: #CCCCCC;">
          <div style="padding: 0 15px;font-size: 12px;">个案调查</div>
          <div class="btnImg">
            <img src="../../assets/case.png" alt style="width:100%;height:100%;">
          </div>
        </div>

        <router-link
          v-if="nums.countContrast>0"
          :to="{ path:'/home/past-event-detail/group-research'}"
        >
          <div class="btn2" style="background-color: #33CCCC;">
            <div class="btnText">
              <div>对照组调查</div>
              <div>
                <span style="font-size:16px">{{nums.countContrast}}</span> 个
              </div>
            </div>
            <div class="btnImg">
              <img src="../../assets/group.png" alt style="width:100%;height:100%;">
            </div>
          </div>
        </router-link>
        <div v-else class="btn2" style="background-color: #CCCCCC;">
          <div style="padding: 0 15px;font-size: 12px;">对照组调查</div>
          <div class="btnImg">
            <img src="../../assets/group.png" alt style="width:100%;height:100%;">
          </div>
        </div>

        <router-link
          v-if="nums.countDoctor>0"
          :to="{ path:'/home/past-event-detail/doctor-research'}"
        >
          <div class="btn2" style="background-color: #33CC99;">
            <div class="btnText">
              <div>医生调查表单</div>
              <div>
                <span style="font-size:16px">{{nums.countDoctor}}</span> 个
              </div>
            </div>
            <div class="btnImg">
              <img src="../../assets/doctor.png" alt style="width:100%;height:100%;">
            </div>
          </div>
        </router-link>
        <div v-else class="btn2" style="background-color: #CCCCCC;">
          <div style="padding: 0 15px;font-size: 12px;">医生调查表单</div>
          <div class="btnImg">
            <img src="../../assets/doctor.png" alt style="width:100%;height:100%;">
          </div>
        </div>
        <router-link
          v-if="nums.countOtherSampling>0"
          :to="{ path:'/home/past-event-detail/other-sample'}"
        >
          <div class="btn2" style="background-color: #66CCFF;">
            <div class="btnText">
              <div>其他采样</div>
              <div>
                <span style="font-size:16px">{{nums.countOtherSampling}}</span> 个
              </div>
            </div>
            <div class="btnImg">
              <img src="../../assets/other.png" alt style="width:100%;height:100%;">
            </div>
          </div>
        </router-link>
        <div v-else class="btn2" style="background-color: #CCCCCC;">
          <div style="padding: 0 15px;font-size: 12px;">其他采样</div>
          <div class="btnImg">
            <img src="../../assets/other.png" alt style="width:100%;height:100%;">
          </div>
        </div>

        <router-link v-if="nums.countSampling>0" :to="{ path:'/home/past-event-detail/out-sample'}">
          <div class="btn2" style="background-color: #66CCFF;">
            <div class="btnText">
              <div>外环境采样</div>
              <div>
                <span style="font-size:16px">{{nums.countSampling}}</span> 个
              </div>
            </div>
            <div class="btnImg">
              <img src="../../assets/out.png" alt style="width:100%;height:100%;">
            </div>
          </div>
        </router-link>
        <div v-else class="btn2" style="background-color: #CCCCCC;">
          <div style="padding: 0 15px;font-size: 12px;">外环境采样</div>
          <div class="btnImg">
            <img src="../../assets/out.png" alt style="width:100%;height:100%;">
          </div>
        </div>
        <router-link v-if="nums.countReport>0" :to="{ path:'/home/past-event-detail/event-report'}">
          <div class="btn2" style="background-color: #3366FF;">
            <div class="btnText">
              <div>事件报告</div>
              <div>
                <span style="font-size:16px">{{nums.countReport}}</span> 个
              </div>
            </div>
            <div class="btnImg">
              <img src="../../assets/report.png" alt style="width:100%;height:100%;">
            </div>
          </div>
        </router-link>
        <div v-else class="btn2" style="background-color: #CCCCCC;">
          <div style="padding: 0 15px;font-size: 12px;">事件报告</div>
          <div class="btnImg">
            <img src="../../assets/report.png" alt style="width:100%;height:100%;">
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div v-show="nums.countScene!=undefined">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      downIcon: false,
      isText: "显示全部",
      form: {},
      nums: {},
      disabled: true,
      genre: "",
      eventPlace: false
    };
  },
  computed: {
    ...mapGetters(["event"])
  },
  methods: {
    //显示全部
    showDetail() {
      this.downIcon = !this.downIcon;
    },
    //返回
    closeDetail() {
      console.log(this.form);
      this.$router.go(-1);
      //   if (this.form.isUrl == 'surveyTasks') {
      //     this.$router.push({ path: '/home/survey_tasks' }) //跳转到调查管理列表
      //   } else if (this.form.isUrl == 'pastEvent') {
      //     this.$router.push({ path: '/home/past-event' }) //跳转到既往事件列表
      //   } else if (this.form.isUrl == 'eventNow') {
      //     this.$router.push({ path: '/home/event-now' }) //跳转到当前事件列表
      //   } else if (this.form.isUrl == 'eventAudit') {
      //     this.$router.push({ path: '/home/event-audit' }) //跳转到审批事件列表
      //   } else if (this.form.isUrl == 'eventRecycle') {
      //     this.$router.push({ path: '/home/event-recycle' }) //跳转到事件回收站列表
      //   }
    },
    //获取7项数据
    getSeven() {
      //
      axios
        .get(config.apiHost + "/survey/countSurveyNum", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            eventId: this.form.id
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.nums = result.data.body;
            if (this.nums.countScene > 0) {
              // console.log("初始化列表！！！");
              this.$store.dispatch("showEventId", this.event.id);
            }
          } else {
            this.$message.error(result.data.body.massage);
          }
        })
        .catch(response => {
          this.$message.error(response);
        });
    },
    eventPlaceChang(value) {
      axios({
        method: "get",
        url: config.apiHost + "/froms/places",
        params: {
          placeId: value
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.eventPlace = result.data.body;
        } else {
          this.eventPlace = result.data.body;
        }
      });
      console.log(value);
    }
  },
  mounted() {
    // console.log(this.event);
    this.form = this.event;
    console.log(this.form);
    if (this.form.status == 4) {
      this.downIcon = false;
    } else {
      this.downIcon = true;
    }
    if (this.form.genre == 0) {
      this.genre = "传染病";
    } else if (this.form.genre == 1) {
      this.genre = "食源性疾病";
    } else {
      this.genre = "其他";
    }
    this.getSeven();
    if (this.form.ispage == "编辑") {
      this.disabled = false;
    }
    this.eventPlaceChang(this.form.placeId);
  }
};
</script>

<style scoped>
.mybox {
  width: auto;
  /* height: 100%; */
  min-height: 100%;
  text-align: left;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
}
.exam {
  width: 100%;
  height: 45px;
  line-height: 45px;
  font-size: 14px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  background-color: #f6f7fb;
  margin-bottom: 5px;
}
.from-box {
  background-color: #ffffff;
  margin: 0 auto;
  padding-bottom: 30px;
}

.event-title {
  height: 30px;
  line-height: 30px;
  width: 100%;
  padding-left: 10px;
  background-color: #def0fe;
  display: flex;
  justify-content: space-between;
}
.mytag {
  height: 30px;
  width: 50px;
  background-color: #c8e4fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.event-form {
  width: 70%;
  margin: 0 auto;
  margin-bottom: 30px;
}

.isShow {
  position: fixed;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  right: 0;
  top: 232px;
  background: white;
}

.info {
  height: 30px;
  line-height: 30px;
  text-align: left;
  color: #6eb594;
  width: 100%;
  margin-top: 15px;
  border-bottom: 2px solid #6eb594;
}
.input-div {
  height: 30px;
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  align-items: center;
}
.label-div {
  display: block;
  width: 100px;
  text-align: right;
  margin-right: 15px;
}
.inp {
  height: 100%;
  border: 0;
  border-radius: 4px;
  padding-left: 10px;
  height: 35px;
  background-color: #eeeeee;
}
.inp-per {
  width: 300px;
}

.text-input {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}
.area {
  width: 710px;
  height: 100px;
  border: 0;
  background: #eeeeee;
}

/* 调查列表 */
.choose {
  /* height: 100%; */
  width: 100%;
  background-color: #f2f2f2;
  /* border-top: 1px solid #999999; */
  margin-top: 10px;
  background-color: #ffffff;
}
.list {
  display: flex;
  width: auto;
  padding: 20px;
  background-color: #f8f9fb;
  justify-content: space-between;
}
.btn {
  padding: 0 20px;
  height: 45px;
  border: 0;
  color: white;
}
.btn2 {
  height: 55px;
  border: 0;
  color: white;
  display: flex;
  align-items: center;
}
.btnText {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-size: 12px;
}
.btnImg {
  width: 45px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 7px;
}
</style>

