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

    <div class="event-title" @click="openTop">事件接报
      <!-- <img :src="topOpenClose" @click="openTop" alt> -->
      <div :class="{open:topOpenClose=='open',close:topOpenClose=='close'}"></div>
    </div>

    <div class="main-box" :class="{open:topOpenClose=='open'}">
      <form :model="form" class="event-form">
        <!-- <div class="info">报告人信息</div> -->
        <div class="info">
          <div class="info-head">
            <img src="../../assets/event02.png" style="vertical-align:middle;">&nbsp;&nbsp;信息获取-报告人信息
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">
                <span>报告人</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.reportUser" readonly></el-input>
            </div>
            <div>
              <label class="label-div">
                <span>报告电话</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.reportPhone" readonly></el-input>
            </div>
            <div>
              <label class="label-div">
                <span>接报时间</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.reportedTime" readonly></el-input>
            </div>
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">
                <span>报告来源</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.originName" readonly></el-input>
            </div>
            <div>
              <label class="label-div">
                <span>接报人姓名</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.userName" readonly></el-input>
            </div>
            <div>
              <label class="label-div">
                <span>接报人科室</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.departmentName" readonly></el-input>
            </div>
          </div>
        </div>

        <div class="info">
          <div class="info-head">
            <img src="../../assets/event03.png" style="vertical-align:middle;">&nbsp;&nbsp;核实信息-事件概况
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">
                <span>事件场所</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.placeName" readonly></el-input>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.otherPlaces"
                v-show="eventPlace"
                style="width:  230px;margin-left: 10px;"
                readonly
              ></el-input>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.detailName"
                v-show="!eventPlace"
                style="width:  230px;margin-left: 10px;"
                readonly
              ></el-input>
            </div>
            <!-- <div>
              <label class="label-div">
                <span>开始时间</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.startTime" readonly></el-input>
            </div>-->
            <div>
              <label class="label-div">
                <span>地点</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.address" readonly></el-input>
            </div>
            <div>
              <label class="label-div">
                <span>事件等级</span>
              </label>
              <el-input
                type="text"
                ref="levelInput"
                class="inp inp-per"
                v-model="form.grade"
                readonly
              ></el-input>
            </div>
          </div>
          <div class="input-div">
            <div>
              <label class="label-div">
                <span>事件类型</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.diseaseType" readonly></el-input>
              <el-input
                type="text"
                class="inp inp-per"
                v-model="form.diseaseName"
                readonly
                style="width: 230px;margin-left: 10px;"
              ></el-input>
            </div>
            <div>
              <label class="label-div">
                <span>疑似事件</span>
              </label>
              <el-input
                :title="form.name"
                type="text"
                class="inp inp-per"
                v-model="form.name"
                readonly
              ></el-input>
            </div>
            <div>
              <label class="label-div">
                <span>疑似病例数</span>
              </label>
              <el-input type="text" class="inp inp-per" v-model="form.caseNumber" readonly></el-input>
            </div>
          </div>
          <div class="input-div">
            <div style="width:100%">
              <label class="label-div" style="float:left; margin-right:0">
                <span>事件概要</span>
              </label>
              <el-input type="textarea" :rows="3" class="area" v-model="form.comment" readonly></el-input>
            </div>
          </div>
          <div class="input-div">
            <div style="width:100%">
              <label class="label-div">
                <span>流调人员</span>
              </label>
              <span v-if="form.userNameList==''||form.userNameList==null" style="color:#409EFF">暂无</span>
              <el-tag
                v-else
                v-for="(item,index) in form.userNameList.split(',')"
                :key="index"
                v-text="item"
                style="margin-right:10px;"
              ></el-tag>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!--调查列表-->
    <!-- <div class="choose" v-show="form.status==4">
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
      <div v-show="nums.countScene!=undefined">
        <router-view></router-view>
      </div>
    </div>-->
    <div class="event-title" @click="openBottom">调查列表
      <!-- <img :src="bottomOpenClose" @click="openBottom" alt> -->
      <div :class="{open:bottomOpenClose=='open',close:bottomOpenClose=='close'}"></div>
    </div>
    <div class="choose" :class="{open:bottomOpenClose=='open'}">
      <div class="list" v-show="nums!=null">
        <router-link
          v-if="nums.countScene>0"
          :to="{ path:'/home/survey-update/new-research' }"
          replace
        >
          <!-- @click.native="remberLocal('/home/survey-update/new-research')" -->
          <div class="btn2">
            <p class="num">
              {{nums.countScene}}
              <span>个</span>
            </p>
            <p class="title">现况调查</p>
            <el-progress
              type="circle"
              :percentage="nums.countScene/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#1bbab8"
            ></el-progress>
          </div>
        </router-link>
        <div v-else class="btn2" @click="addForm(2)">
          <p class="num">
            {{nums.countScene}}
            <span>个</span>
          </p>
          <p class="title">现况调查</p>
          <el-progress
            type="circle"
            :percentage="0"
            :width="120"
            :stroke-width="8"
            :show-text="false"
            color="#1bbab8"
          ></el-progress>
        </div>

        <router-link
          v-if="nums.countCase>0||nums.haveCreated==1"
          :to="{ path:'/home/survey-update/case-research'}"
          replace
        >
          <!-- @click.native="remberLocal('/home/survey-update/case-research')" -->
          <div class="btn2">
            <p class="num">
              {{nums.countCase}}
              <span>个</span>
            </p>
            <p class="title">个案调查</p>
            <el-progress
              type="circle"
              :percentage="nums.countCase/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="fdb45c"
            ></el-progress>
          </div>
        </router-link>
        <div v-else class="btn2" @click="addForm(1)">
          <p class="num">
            {{nums.countCase}}
            <span>个</span>
          </p>
          <p class="title">个案调查</p>
          <el-progress
            type="circle"
            :percentage="0"
            :width="120"
            :stroke-width="8"
            :show-text="false"
            color="fdb45c"
          ></el-progress>
        </div>

        <router-link
          v-if="nums.countContrast>0||nums.haveCreated==1"
          :to="{ path:'/home/survey-update/group-research'}"
          replace
        >
          <!-- @click.native="remberLocal('/home/survey-update/group-research')" -->
          <div class="btn2">
            <p class="num">
              {{nums.countContrast}}
              <span>个</span>
            </p>
            <p class="title">对照组调查</p>
            <el-progress
              type="circle"
              :percentage="nums.countContrast/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#921ff5"
            ></el-progress>
          </div>
        </router-link>
        <div v-else class="btn2" @click="addForm(5)">
          <p class="num">
            {{nums.countContrast}}
            <span>个</span>
          </p>
          <p class="title">对照组调查</p>
          <el-progress
            type="circle"
            :percentage="0"
            :width="120"
            :stroke-width="8"
            :show-text="false"
            color="#921ff5"
          ></el-progress>
        </div>

        <!-- <router-link
          v-if="nums.countDoctor>0"
          :to="{ path:'/home/survey-update/doctor-research'}"
          replace
        >
          <div class="btn2">
            <p class="num">
              {{nums.countDoctor}}
              <span>个</span>
            </p>
            <p class="title">医生调查表单</p>
            <el-progress
              type="circle"
              :percentage="nums.countDoctor/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#3747e3"
            ></el-progress>
          </div>
        </router-link>
        <div v-else class="btn2" @click="addForm(3)">
          <p class="num">
            {{nums.countDoctor}}
            <span>个</span>
          </p>
          <p class="title">医生调查表单</p>
          <el-progress
            type="circle"
            :percentage="0"
            :width="120"
            :stroke-width="8"
            :show-text="false"
            color="#3747e3"
          ></el-progress>
        </div>-->
        <router-link :to="{ path:'/home/survey-update/other-sample'}" replace>
          <div v-if="nums.countOtherSampling>0" class="btn2">
            <p class="num">
              {{nums.countOtherSampling}}
              <span>个</span>
            </p>
            <p class="title">食物采样</p>
            <el-progress
              type="circle"
              :percentage="nums.countOtherSampling/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#2692e5"
            ></el-progress>
          </div>
          <div v-else class="btn2">
            <p class="num">
              {{nums.countOtherSampling}}
              <span>个</span>
            </p>
            <p class="title">食物采样</p>
            <el-progress
              type="circle"
              :percentage="0"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#2692e5"
            ></el-progress>
          </div>
        </router-link>

        <router-link :to="{ path:'/home/survey-update/out-sample'}" replace>
          <div v-if="nums.countSampling>0" class="btn2">
            <p class="num">
              {{nums.countSampling}}
              <span>个</span>
            </p>
            <p class="title">外环境采样</p>
            <el-progress
              type="circle"
              :percentage="nums.countSampling/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#ffbb04"
            ></el-progress>
          </div>
          <div v-else class="btn2">
            <p class="num">
              {{nums.countSampling}}
              <span>个</span>
            </p>
            <p class="title">外环境采样</p>
            <el-progress
              type="circle"
              :percentage="0"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#ffbb04"
            ></el-progress>
          </div>
        </router-link>

        <router-link :to="{ path:'/home/survey-update/event-report'}" replace>
          <div v-if="nums.countReport>0" class="btn2">
            <p class="num">
              {{nums.countReport}}
              <span>个</span>
            </p>
            <p class="title">事件报告</p>
            <el-progress
              type="circle"
              :percentage="nums.countReport/allNums*100"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#9efdee"
            ></el-progress>
          </div>
          <div v-else class="btn2">
            <p class="num">
              {{nums.countReport}}
              <span>个</span>
            </p>
            <p class="title">事件报告</p>
            <el-progress
              type="circle"
              :percentage="0"
              :width="120"
              :stroke-width="8"
              :show-text="false"
              color="#9efdee"
            ></el-progress>
          </div>
        </router-link>
      </div>
      <!-- 表格 -->
      <div>
        <router-view replace></router-view>
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
      allNums: 0, //事件总数
      disabled: true,
      genre: "",
      eventPlace: false,
      topOpenClose: "close",
      bottomOpenClose: "open",
      eventLeve: [
        { id: 1, name: "I 级", color: "#e51717" },
        { id: 2, name: "II 级", color: "#ff7519" },
        { id: 3, name: "III 级", color: "#ffe229" },
        { id: 4, name: "IV 级", color: "#006636" },
        { id: 5, name: "未分级", color: "#666666" }
      ],
      levelColor: ""
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
            this.allNums =
              this.nums.countScene +
              this.nums.countCase +
              this.nums.countContrast +
              this.nums.countDoctor +
              this.nums.countOtherSampling +
              this.nums.countSampling +
              this.nums.countReport;
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
    },
    openBottom() {
      this.bottomOpenClose = this.bottomOpenClose == "close" ? "open" : "close";
    },
    openTop() {
      this.topOpenClose = this.topOpenClose == "close" ? "open" : "close";
    }, //添加表单
    addForm(type) {
      // this.$router.push({
      //   name: 'form_add',
      //   params: { type: type, eventId: this.event.id }
      // })
      let caseChild = "";
      if (type == 1) {
        caseChild = 1;
      } else {
        caseChild = "";
      }

      // this.$router.push({
      //   name: 'newResAddForm',
      //   params: { type: type, eventId: this.event.id,caseChild:caseChild }
      // })
      if (type == 1) {
        //个案
        this.$router.replace({ path: "/home/survey-update/case-research" });
      } else if (type == 2) {
        //现况
        this.$router.replace({ path: "/home/survey-update/new-research" });
      } else if (type == 3) {
        //医生
        this.$router.replace({ path: "/home/survey-update/doctor-research" });
      } else if (type == 5) {
        //对照组
        this.$router.replace({ path: "/home/survey-update/group-research" });
      }
    }
  },
  mounted() {
    // console.log(this.event);
    this.form = this.event;
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
    switch (this.form.grade) {
      case 1:
        this.form.grade = this.eventLeve[1].name;
        this.levelColor = this.eventLeve[1].color;
        break;
      case 2:
        this.form.grade = this.eventLeve[2].name;
        this.levelColor = this.eventLeve[2].color;
        break;
      case 3:
        this.form.grade = this.eventLeve[3].name;
        this.levelColor = this.eventLeve[3].color;
        break;
      case 4:
        this.form.grade = this.eventLeve[4].name;
        this.levelColor = this.eventLeve[4].color;
        break;
      case 5:
        this.form.grade = this.eventLeve[5].name;
        this.levelColor = this.eventLeve[5].color;
        break;
    }
    this.$refs.levelInput.$el.children[0].style.color = this.levelColor;
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
  min-height: 100%;
  text-align: left;
  padding: 10px 10px 45px;
}
.exam {
  width: 100%;
  height: 45px;
  line-height: 45px;
  font-size: 14px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  margin-bottom: 5px;
}
.main-box {
  width: 100%;
  max-height: 0;
  overflow: hidden;
  /* min-height: 800px; */
  margin: 0 auto;
  transition: all 0.3s;
}
.main-box.open {
  max-height: 1000px;
  transition: all 0.3s;
}
.event-title {
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding-left: 15px;
  /* background-color: #def0fe; */
  display: flex;
  justify-content: space-between;
  color: #429e73;
  /* border-left: 3px solid #429e73; */
  font-weight: bold;
  margin: 10px 0 0;
  position: relative;
  background: #fff;
}
.event-title::before {
  content: "";
  width: 3px;
  height: 20px;
  background-color: #429e73;
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.event-title div {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.event-title div.open {
  background: url(../../assets/open-green.png);
}
.event-title div.close {
  background: url(../../assets/close-gray.png);
}
.choose {
  max-height: 0;
  background-color: #ffffff;
  transition: all 0.3s;
  overflow: hidden;
  margin-bottom: 50px;
}
.choose.open {
  max-height: 1500px;
  transition: all 0.3s;
}
.list {
  display: flex;
  width: auto;
  padding: 20px;
  background-color: #fff;
  justify-content: space-between;
}
.btn {
  padding: 0 20px;
  height: 45px;
  border: 0;
  color: white;
}
.btn2 {
  height: 120px;
  border: 0;
  color: white;
  display: flex;
  align-items: center;
  position: relative;
}
/* .btn2:hover{
  border-radius: 50%;
  box-shadow: 0px 5px 10px 0px rgba(16, 20, 26, 0.1);
} */
.btn2 .num {
  position: absolute;
  width: 100%;
  bottom: 40%;
  text-align: center;
  color: #243037;
  font-size: 30px;
}
.btn2 .num span {
  font-size: 14px;
  color: #243037;
  opacity: 0.6;
  font-weight: bold;
}
.btn2 .title {
  position: absolute;
  width: 100%;
  top: 60%;
  text-align: center;
  font-size: 12px;
  color: #243037;
  opacity: 0.6;
}
.event-form {
  width: 100%;
  margin: 0 auto;
  background: #fff;
  padding: 10px;
}
.info {
  line-height: 30px;
  text-align: left;
  width: 100%;
  margin-bottom: 20px;
  padding: 14px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 1px 10px 0px rgba(22, 9, 6, 0.05);
}
.info:hover {
  background: #fff url("../../assets/event01.png") repeat-y left;
}
.info-head {
  padding-left: 20px;
  color: #333333;
  padding-bottom: 5px;
  font-weight: bold;
  vertical-align: middle;
  border-bottom: 2px solid #eee;
  font-size: 18px;
}
.input-div {
  margin: 20px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  /* align-items: center; */
}
.area {
  width: 92.7%;
  background: #fff;
}
.label-div {
  width: 110px;
  color: #666666;
  margin-right: 15px;
}
.label-div span {
  width: 90px;
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
  font-size: 18px;
}
.inp {
  border-radius: 4px;
  background: #fff;
}
.inp-per {
  width: 230px;
}
.center_ {
  text-align: center;
}
.right_ {
  text-align: right;
}
</style>

