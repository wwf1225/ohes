<template>
    <div >
        <div class="title-header">调查表单管理>创建表单>表单编辑</div>
        <div class="backdiv" style="text-align:  right;height: 45px;">
          <el-button @click="addFormBack" style="padding: 10px 20px;">返回</el-button>
        </div>
        <div class="ifram-div">
            <iframe ref="iframe" style=" width: 100%;height: 800px;" :src="fromUrl"></iframe>
        </div>
    </div>
</template>
<style scoped>
.title-header {
  text-align: left;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
}
.ifram-div {
  width: 100%;
  height: 100%;
}
</style>
<script>
var config = require('@/components/utils/Common_Config.js');
var Cookies = require("js-cookie");
export default {
  data() {
    return {
       surveyName:"",
        isTemplate:"",
        type:"",
        fromUrl:"",
        diseaseId:""
    }
  },
  methods: {
    addFormBack(){
      this.$router.push('/home/data-formsmgr');
    }
  },
  created() {
            this.surveyName=this.$route.params.surveyName;
            this.type=this.$route.params.type;
            this.diseaseId=this.$route.params.diseaseId;
            this.isTemplate=true;
            this.fromUrl=encodeURI(encodeURI(config.apiUrl+"index.html?surveyName="+this.surveyName+"&isTemplate="+this.isTemplate+"&token="+Cookies.get('token')+"&type="+this.type+"&diseaseId="+this.diseaseId));
  }
}
</script>

