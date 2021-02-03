<template>
  <div id="import_area">
    <div class="pt15">
      <el-button @click="back()">返回</el-button>

    </div>
    <el-form label-width="140px" label-position="right" class="demo-dynamic">
      <el-form-item label="模板文件下载：">
        <el-button type="text" @click="modelDownLoad()">导入模板.xls</el-button>
        <p class="redtip">（提示：导入的信息必须符合模板文件的要求。）</p>
      </el-form-item>

    </el-form>
    <div>
      <label class="el-form-item__label" style="width: 140px;">
        <label class="redtip" style="left:-5px">*</label>上传导入文件：</label>
      <el-input style="width:180px" size="small" :readonly="true" placeholder="请选择文件" v-model="fileName"></el-input>
      <el-upload class="upload-demo" ref="upload" :action="importUrl" :data="importData" :on-preview="handlePreview" :on-remove="handleRemove" :show-file-list="false" :file-list="fileList" :auto-upload="false" :on-change="handleChange" :on-error="uploadError" :on-success="uploadSuccess" :multiple="false" :headers="token" accept=".xls">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入</el-button>
      </el-upload>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
var Cookies = require('js-cookie')
export default {
  data() {
    return {
      fileName: '',
      importUrl: config.apiHost + '/import/importArea', //导入接口
      importData: {
        // colsNum:31,
        // headRowsNum:2,
        // originUrl:"",
      },
      name: '',
      fileList: [],
      token: {
        token: Cookies.get('token')
      }
    }
  },
  components: {},
  methods: {
    back() {
      this.$router.go(-1)
    },
    modelDownLoad() {
      
      location.href =
        config.apiHost +
        '/dowload/dowloadAreaPlace' +
        '?token=' +
        Cookies.get('token') +
        '&Name=' +
        this.name
    },
    submitUpload() {
      //导入按钮点击事件
      if (this.fileName.length > 0) {
        this.importData.originUrl = this.fileList[0].url
        this.$refs.upload.submit()
      } else {
        return false
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
      //导入文件改变事件
      this.fileName = file.name
      this.fileList = fileList
    },

    uploadError(res) {
      this.$message(res.body.message)
    },
    uploadSuccess(res) {
      //导入成功
      console.log(res)
      if(res.status==200){
        this.$message(res.body.msg)
      }else{
        this.$message(res.body.message)
      }
      
    }
  },
  created() {
   
    if (this.$route.query.type == 1) {
      this.importUrl = config.apiHost + '/import/importAreasPlaceBySchool'
      this.name = 'school-demo'
    } else if (this.$route.query.type == 2) {
      this.importUrl = config.apiHost + '/import/importAreasPlaceByEnterprise'
      this.name = 'enterprise-demo'
    } else if (this.$route.query.type == 3) {
      this.importUrl = config.apiHost + '/import/importAreasPlaceByCommunity'
      this.name = 'community-demo'
    } else if (this.$route.query.type == 4) {
      this.importUrl = config.apiHost + '/import/importAreasPlaceByFoodPlace'
      this.name = 'foodplace-demo'
    } else if (this.$route.query.type == 5) {
      this.importUrl = config.apiHost + '/import/importAreasPlaceByHospital'
      this.name = 'hospital-demo'
    }
  }
}
</script>

<style>
#import_area {
  text-align: left;
}
.el-form-item__content {
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

input[type='file'] {
  display: none;
}

.upload-demo {
  display: inline-block;
}

#import_area .el-select {
  width: 345px;
}

#selssq .el-select {
  width: 112px;
}
#import_area .el-upload__input {
  display: none;
}
</style>