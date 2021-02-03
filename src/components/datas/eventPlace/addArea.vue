<template>
    
    <div class="main">
      <div class="top_box">{{addInfoName}}</div>
        <div class="add_content">
            <div class="postDiv">
                <label class="lab">名称：</label>
                <div class="inp">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </div>
            </div>

            <div style="margin-top: 50px;">
                <el-button type="primary" @click="confirm">保存</el-button>
                <el-button  @click="back()" v-show="form.level!=1">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
var config = require('@/components/utils/Common_Config.js');
export default {
  data() {
    return {
      config: config,
      form: {
        name: '', //部门名称
        level: '',
        areaId: ''
      },
      addInfoName:'',
    }
  },
  methods: {
    confirm() {
      axios({
        method: 'post',
        url: config.apiHost + '/placeMain/place/insertArea',
        data: {
          parentId: this.form.areaId,
          level: this.form.level+1,
          areaName: this.form.name
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.$message.success('添加成功');
          //刷新树
          this.$store.dispatch('refNum',7);//刷新父级组件
          this.$router.push({path:'/home/data-epmgr'});
          // this.$router.go(-1)
        }
      })
    },
    back(){
      this.$router.push({
          name: 'data-statistics',
          params: { id: this.$route.params.areaId, level: this.$route.params.level,areaName:this.$route.params.areaName,parentId:this.$route.params.parentId }
        })
    },
  },
  mounted() {
    this.form.level = this.$route.params.level==undefined?1:this.$route.params.level;
    this.form.areaId = this.$route.params.areaId==undefined?0:this.$route.params.areaId;
    if(this.form.level==1){
      this.addInfoName='添加省或直辖市信息'
    }else if(this.form.level==2){
      this.addInfoName='添加市信息'
    }else if(this.form.level==3){
      this.addInfoName='添加区信息'
    }else if(this.form.level==4){
      this.addInfoName='添加街道(乡镇)信息'
    }
    console.log(this.form.level);
    console.log(this.form.areaId);
  }
}
</script>
<style  scoped>
.top_box {
  width: 100%;
  height: 50px;
  background-color: #f0f3fa;
  display: flex;
  align-items: center;
  padding: 10px;
  
}
.main {
  height: 100%;
  width: 100%;
  min-height: 750px;
}
.add_content {
  display: flex;
  flex-direction: column;
  padding-top: 10%;
}
.postDiv {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.lab {
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
.inp {
  width: 300px;
  text-align: left;
}
</style>