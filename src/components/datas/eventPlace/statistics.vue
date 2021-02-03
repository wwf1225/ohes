<template>
    <div>
        <div class="top_box">{{areaName}}信息列表</div>
        <div class="top_box" style="background-color:#fff">
            <el-button type="primary" size="small" @click="add" v-show="level!=5">添加</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="200px" :inline="true" style="margin-top:40px;text-align:left;">
            <el-form-item label="中文名称">
                <el-input v-model="areaName" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="下辖地区总数" v-show="level==1||level==2||level==3">
                <el-input v-model="form.areaNum" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="下辖乡镇(街道总数)" v-show="level==4">
                <el-input v-model="form.communityNum" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="医院总数">
                <el-input v-model="form.hospitalNum" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="学校总数">
                <el-input v-model="form.schoolNum" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="社区总数">
                <el-input v-model="form.communityNum" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="企业总数">
                <el-input v-model="form.companyNum" readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="食品经营场所总数">
                <el-input v-model="form.foodPlaceNum" readonly="readonly"></el-input>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      config: config,
      form: {
        name: ''
      },
      areaId: '',
      level: '',
      areaName:'',
      parentId:'',
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'getInfo'
  },
  methods: {
    getInfo() {
      console.log(this.$route.params.areaName)
      this.areaId = this.$route.params.id
      this.level = this.$route.params.level
      this.areaName=this.$route.params.areaName;
      this.parentId=this.$route.params.parentId;
      axios
        .get(config.apiHost + '/placeMain/place/getPlaceCountByArea', {
          params: {
            params: this.areaId
          }
        })
        .then(result => {
          this.form = result.data.body
          console.log(this.form)
        })
        .catch(function(response) {})
    },
    add(){
        this.$router.replace({
          name: 'data-addArea',
          params: { areaId: this.areaId, level: this.level,areaName:this.areaName,parentId:this.parentId }
        })
    }
  },
  mounted() {
    this.getInfo()
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
</style>

