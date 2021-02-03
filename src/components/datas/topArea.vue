<template>
    <div>
        <div class="top_box">添加市信息</div>
           <el-form :label-position="labelPosition" label-width="130px" :inline="true" style="margin-top:50px;">
              <el-form-item label="中文名称">
                    <el-input></el-input>
              </el-form-item>
              <el-form-item label="下载地区总数">
                    <el-input></el-input>
              </el-form-item>
            </el-form>
            <el-form :label-position="labelPosition" label-width="130px" :inline="true" >
              <el-form-item label="医院总数">
                    <el-input></el-input>
              </el-form-item>
              <el-form-item label="学校总数">
                    <el-input></el-input>
              </el-form-item>
            </el-form>
            <el-form :label-position="labelPosition" label-width="130px" :inline="true" >
              <el-form-item label="乡镇总数">
                    <el-input></el-input>
              </el-form-item>
              <el-form-item label="企业总数">
                    <el-input></el-input>
              </el-form-item>
            </el-form>
            <el-form :label-position="labelPosition" label-width="130px" :inline="true" >
              <el-form-item label="社区街道总数">
                    <el-input></el-input>
              </el-form-item>
              <el-form-item label="食品经营场所总数">
                    <el-input></el-input>
              </el-form-item>
            </el-form>
             <el-form style="margin:0 0;padding-top:7%">
                     <el-button type="primary">取消</el-button>
                    <el-button type="primary">确定</el-button>
              </el-form>
                
    </div>
</template>
<script>
    
import axios from "axios";
import vue from "vue";
var config = require("@/components/utils/Common_Config.js");
export default {
    data(){
        return {
             labelPosition:"right",
        }
    }
}
</script>
<style scoped>
   .top_box {
  width: 100%;
  height: 50px;
  background-color: #f0f3fa;
  display: flex;
  align-items: center;
  padding: 10px;
}
.el-form{
    margin-left:-10%;
}
</style>
