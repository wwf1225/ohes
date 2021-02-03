<template>
  <div  id="import_school">
    <div class="pt15">
      <el-button @click="back()">返回</el-button>
    </div>
    <el-form label-width="140px" label-position="right" class="demo-dynamic">
        <el-form-item label="模板文件下载：">
         <el-radio-group v-model="importData.type">
          <el-radio :label="1">学校</el-radio>
          <el-radio :label="2">医院</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="模板文件下载：">
        <el-button type="text" @click="modelDownload()">导入模板.xls</el-button>
        <p class="redtip">（提示：导入的信息必须符合模板文件的要求。）</p>
      </el-form-item>
  
    </el-form>
    <div>
      <label class="el-form-item__label" style="width: 140px;">
        <label class="redtip" style="left:-5px">*</label>上传导入文件：</label>
      <el-input style="width:180px" size="small" :readonly="true" placeholder="请选择文件" v-model="fileName"></el-input>
      <el-upload class="upload-demo" 
      	ref="upload" 
      	:action="importUrl" 
      	:data="importData" 
      	:multiple="true" 
      	:auto-upload="false" 
      	:on-error="uploadError" 
      	:on-success="uploadSuccess" 
      	:show-file-list="false" 
      	:on-change="handleChange" 
        :headers="token"
      	accept=".xls">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js');
var Cookies = require("js-cookie");
export default {
  
  data() {
    return {
      fileName: '',
      importUrl:config.apiHost+'/import/importCompanys',//上传接口
      importData:{
      		type:1,//1学校2医院3工厂
      },
      token:{
        "token":Cookies.get('token')
      },
    }
  },
  components: {

  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    
    modelDownload() {//下载模板
     
      location.href =config.apiHost+ "/dowload/dowloadSchoolTem"+"?token="+Cookies.get('token');
    },
    submitUpload() {//导入按钮点击事件

    
        if (this.fileName.length>0) {
          this.$refs.upload.submit();
        } else {
          return false;
        }
    },
    handleChange(file) {//导入文件改变事件
      this.fileName = file.name;
    },
    uploadError(res) {
      console.log(res)
      this.openMsgBox([res.body.msg])
    },
    uploadSuccess(res) {//导入成功
       console.log(res)
       if(res.status==200){
        //  this.openMsgBox(res.body.msg);
         this.$message.success("导入成功")
       }else{
        //  this.openMsgBox(res.body.message);
         this.$message.error(res.body.message)
       }
       
    },
    openMsgBox(data) {//显示导入结果弹窗
      const h = this.$createElement;
      const arr = [];
      for (var i = 0; i < data.length; i++) {
        arr.push(h('p', null, data[i]))
      }
      this.$msgbox({
        title: '消息',
        message: h('p', null, arr),
        showConfirmButton: false
      });
    
    },


  },
  created() {
 		
  }
}
</script>

<style>
#import_school{
    text-align: left;
}
.el-form-item__content{
    width: auto;
}
.ml15 {
  margin-left: 15px;
}

.pt15 {
  padding: 15px 25px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
}

.redtip {
  color: #ee4b31;
  position: relative;
  left: -120px;
}

input[type="file"] {
  display: none;
}

.upload-demo {
  display: inline-block;
}

#import_school .el-select {
  width: 345px;
}

#selssq .el-select {
  width: 112px;
}
#import_school .el-upload__input{
  display:none;
}
</style>