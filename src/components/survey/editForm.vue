<template>
  <div class="editbox">
    <!-- 表单编辑 -->
    <div class="top_main">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>调查任务</el-breadcrumb-item>
        <el-breadcrumb-item>调查详情</el-breadcrumb-item>
        <el-breadcrumb-item>引用模板</el-breadcrumb-item>
        <el-breadcrumb-item>表单编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="main_box">
      <div class="btn_main">
        <div>调查表单</div>
        <div>
          <el-button type="primary" @click="userForm">使用表单</el-button>
          <!-- <el-button type="primary" @click="publishCon">发布收集</el-button> -->
          <el-button type="primary" @click="close">返回</el-button>
        </div>
      </div>
      <!-- 填写表单 -->
      <div class="from_main">
        <iframe ref="iframe" style=" width: 100%;height: 800px;" :src="fromUrl"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
var Cookies = require('js-cookie')
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      fromsId: '',
      fromUrl: '',
      eventId: null,
      type: null,
      diseaseId: null,
      isTemplate: null,
      caseType: null,

      //继续调查的type：1 个案/对照  2 医生  3 现况
      continueType: null,

      // 判断是否保存并发布
      isSava: null,
      newFormId: '' //表单ID
    }
  },
  computed: {
    ...mapGetters(['location'])
  },
  methods: {
    close() {
      // this.$router.push({name: 'form_add',params:{type:this.type}});//跳转到列表界面
      // this.$router.push({path: '/home/survey-update'});//跳到列表页
      this.$router.push({ path: this.location })
    },
    //使用表单
    userForm() {
      // /froms/findForm
      // axios.get(config.apiHost + '/froms/findForm', {
      // params : { //请求参数

      //    fromsId:this.fromsId,
      // }
      // }).then((result)=>{
      //     if (result.data.status == 200) {
      //         console.log(result.data.body.status);
      //         this.isSava=result.data.body.status;
      //         if(this.isSava==2){
      //             this.$router.push({name: 'fill_form',params:{fromsId:this.fromsId,eventId:this.eventId,type:this.type,caseType:this.caseType,copyFlag:1}});//跳转到填写表单
      //         }else{
      //             alert("请先点击‘保存并发布’按钮");
      //         }

      //     }else{
      //         this.$message.error(result.data.body.message);
      //     }
      // }).catch(function(response){

      // });
      axios
        .get(config.apiHost + '/fromManager/fromsExistJudge?fromsId='+this.newFormId)
        .then(result => {
          if (result.data.status == 200) {
            if (result.data.body) {
              this.$router.push({
                name: 'fill_form',
                params: {
                  fromsId: this.newFormId,
                  eventId: this.eventId,
                  type: this.type,
                  caseType: this.caseType,
                  copyFlag: 1
                }
              }) //跳转到填写表单
            } else {
              this.$message.info('请先保存表单')
            }
          } else {
          }
        })
    },
    //发布收集
    publishCon() {
      //
      axios
        .get(config.apiHost + '/survey/continueWrite', {
          params: {
            //请求参数

            eventId: this.eventId,
            type: this.continueType
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.formId = result.data.body.questionareId
            var formName = result.data.body.formName
            var eventId = result.data.body.eventId

            this.$router.push({
              name: 'update-publishCollection',
              params: {
                fromsId: this.formId,
                type: 3,
                formName: formName,
                eventId: eventId
              }
            }) //跳转到发布收集
          } else {
            this.$message.error(result.data.body.message)
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        })
    }
  },
  created() {
    // console.log("输出表单Id");
    this.fromsId = this.$route.params.fromsId
    this.eventId = this.$route.params.eventId
    this.diseaseId = this.$route.params.diseaseId
    this.type = this.$route.params.type
    this.isTemplate = this.$route.params.isTemplate
    this.caseType = this.$route.params.caseType
    this.newFormId = this.$route.params.newFormId
    this.fromUrl =
      config.apiUrl +
      'editForm.html?formId=' +
      this.fromsId +
      '&eventId=' +
      this.eventId +
      '&type=' +
      this.type +
      '&diseaseId=' +
      this.diseaseId +
      '&isTemplate=' +
      this.isTemplate +
      '&token=' +
      Cookies.get('token') +
      '&copyFlag=1' +
      '&newFormId=' +
      this.newFormId
    // console.log(this.fromsId);

    if (this.type == 2) {
      this.continueType = 3
    } else if (this.type == 1 || this.type == 5) {
      this.continueType = 1
    } else if (this.type == 3) {
      this.continueType = 2
    }
  }
}
</script>

<style lang="less" scoped>
.editbox {
  width: auto;
  // height: 100%;
  min-height: 100%;
  text-align: left;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
  .top_main {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    background-color: #f6f7fb;
  }

  .main_box {
    height: 100%;
    width: 100%;
    margin-top: 5px;
    background-color: #ffffff;
    .btn_main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
    }
    .from_main {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
