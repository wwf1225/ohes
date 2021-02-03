<template>
  <div class="controlmain">
    <div class="title-header">调查表单管理>控制措施</div>
    <div class="headerDiv">
      <div class="leftName">表单名称：<span style="color:#0199FE">{{title}}</span></div>
      <div class="rightBtn">
        <el-button class="mybtn" type="primary" @click="controSave">保存</el-button>
        <el-button class="mybtn" @click="controBack">返回</el-button>
      </div>
      <div class="edit">
      <vue-html5-editor class="editor" :content="content" :height="600" @change="cContentChange"></vue-html5-editor>
    </div>
    </div>
    
  </div>
</template>
<style scoped>
.title-header {
  text-align: left;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    background-color: #f0f3f8;
    padding-left: 10px;
    margin-bottom: 10px;
}
.headerDiv {
  display: inline-block;
  width: 100%;
  background-color: #fff;
  padding-left: 10px;
  height: 100%;
  padding-right: 10px;
}
.controlmain{
  width: auto;
    height: 100%;
    background-color: #e2e6ef;
    padding: 10px 15px 45px;
}
.leftName {
  font-size: 16px;
  text-align: left;
  height: 60px;
  line-height: 60px;
}
.rightBtn {
  text-align: left;
  margin-bottom: 20px;
}
.mybtn{
  
  padding: 8px 20px;
}
.vue-html5-editor {
  width: 100%;
}
</style>
<script>
var config = require('@/components/utils/Common_Config.js');
import axios from 'axios'
export default {
  data() {
    return {
      title: '',
      formId: '',
      keyword: '',
      content: '',
      typeId: '5'
    }
  },
  methods: {
    controSave() {
      var parm={
        "fromsId":this.formId,
        "title":this.title+"控制措施",
        "typeId":this.typeId,
        "keyword":this.title+"控制措施",
        "content":this.content,
      };
      console.log(parm);
      
      axios({
        method: 'post',
        url: config.apiHost+'/databank/save',
        data: parm,
      }).then(res => {
          
          if (res.data.status == '200') {
            console.log(res.data.body);
            this.$message.success(res.data.body.msg);
            this.$router.push({
              path: '/home/data-formsmgr'
            });

          }
          
        }).catch(function(response) {
            this.$message.error(error);
          
        });
    },
    controBack() {
      this.$router.push({
        path: '/home/data-formsmgr'
      });
    },
    cContentChange(val) {
      // console.log(val)
      this.content = val
    }
  },
  created() {
    this.formId = this.$route.params.formId;
    this.title = this.$route.params.surveyName;
     
    axios({
        method: 'get',
        url: config.apiHost+'/databank/queryDatabankInfo?fromsId='+this.formId,
      }).then(res => {
          
          if (res.data.status == '200') {
            console.log(res.data.body);
            this.content=res.data.body.content;

          }else{
            this.$message.error(res.data.body.message);
          }
          
        }).catch(function(response) {
            this.$message.error(error);
          
        });

   
  }
}
</script>


