<template>
    <div style="padding:10px;text-align:left;">
        <div class="header">
            <span class="headtitle">发布收集</span>
            <el-button class="headerBtn" @click="publishBack">返回</el-button>
        </div>
        <div class="cont">
            <div class="formName">{{formName}}</div>
            <p style="font-size:16px;margin-bottom: 20px;">问卷链接：复制或分享访问链接给他人填写</p>
            <el-input style="width:450px;float:left;" id="copyNum" v-model="formURL"></el-input>
            <el-button type="primary" @click="jsCopy">复制</el-button>
            <div class="clear"></div>
            <div class="qrtitle">二维码收集</div>
            <div class=" qrCode ">
                <div class="qrleft">
                    <img :src="qrimgSrc" class="qrimg">
                </div>
                <div class="qrright">
                    <div>在设计的海报、广告中增加二维码，方便用户通过扫码填写在各类线下活动中，通过下载打印二维码，让用户扫码填写通过微信、QQ、微博扫一扫分享给好友，让更多的用户填写</div>
                    <el-button style="margin-top: 27px;" @click="downloadQR">下载二维码</el-button>
                </div>

            </div>

        </div>

    </div>
</template>
<style scoped>
.header {
  display: inline-block;
  width: 100%;
  font-size: 18px;
}
.headtitle {
  float: left;
}
.headerBtn {
  float: right;
}
.formName {
  text-align: left;
  margin-bottom: 40px;
  font-size: 18px;
}
.cont {
  padding-left: 100px;
}
.qrCode {
  display: inline-block;
}
.qrtitle {
  font-size: 18px;
  margin-top: 50px;
  margin-bottom: 10px;
}
.qrleft {
  float: left;
}
.qrright {
  float: left;
  width: 322px;
}
.qrimg {
  border: 1px solid #ccc;
  width: 150px;
  height: 150px;
  margin-right: 15px;
}
.clear {
  clear: both;
}
</style>
<script>
var config = require('@/components/utils/Common_Config.js')
var Cookies =require("js-cookie");
import axios from 'axios'
export default {
  data() {
    return {
      formId: '',
      formName: '表单名称',
      type: '',
      eventId: '',
      domainName:'',
      formURL: '',
      qrimgSrc: '',
      caseType:'',
    }
  },
  methods: {
      //返回
      publishBack(){
          this.$router.go(-1);
      },
    downloadQR() {
        location.href = config.apiHost+"/froms/dowloadQrCode?fromsId="+this.formId+"&eventId="+this.eventId+"&token="+Cookies.get('token')+"&type="+this.type+'&caseType='+this.caseType;
    },
    jsCopy() {
      var e = document.getElementById('copyNum');
      e.select(); 
      document.execCommand('Copy'); 
      
    }
  },
  created() {
    this.formId = this.$route.params.fromsId;
    this.formName = this.$route.params.formName;
    this.type = this.$route.params.type;
    this.eventId = this.$route.params.eventId;
    this.domainName=this.$route.params.domainName;
    this.caseType=this.$route.params.caseType;

    // console.log(this.type)
    // console.log(this.formId)
    this.formURL =this.domainName+
      '/froms/answer_survey.html?formId=' +
      this.formId +
      '&token=' +
      Cookies.get('token') +
      '&eventId=' +
      this.eventId +
      '&type=' +
      this.type+
      '&caseType='+
      this.caseType;
      this.qrimgSrc = config.apiHost+"/froms/getQrCode?fromsId="+this.formId+"&eventId="+this.eventId+"&token="+Cookies.get('token')+"&type="+this.type+'&caseType='+this.caseType;
  }
}
</script>

