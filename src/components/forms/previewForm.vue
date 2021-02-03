<template>
    <div >
        <div class="title-header">调查表单管理>预览表单</div>
        <div class="backdiv" style="text-align:  right;height: 45px;">
          <el-button @click="previewBack" style="padding: 10px 20px;">返回</el-button>
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
       formId:"",
       fromUrl:"",
        
    }
  },
  methods: {
    previewBack(){
      this.$router.go(-1);
    }
  },
  created() {
            this.formId=this.$route.params.formId;
           
            this.fromUrl=encodeURI(encodeURI(config.apiUrl+"preview.html?formId="+this.formId+"&token="+Cookies.get('token')));
  }
}
</script>

