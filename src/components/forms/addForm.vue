<template>
  <div style="width: auto;height: auto;background-color: #e2e6ef;padding: 10px 15px 45px;">
    <div class="title-header">调查表单管理>表单添加</div>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules" class="addform">
      <el-form-item label="标题：" prop="title">
        <el-input style="width:200px;" v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="选择类别：" v-show="typeShow">
        <!-- <el-select class="myselect" v-model="firstId" placeholder="请选择" @change="selectFirst(firstId)">
          <el-option v-for="item in firstList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select> -->
        <!-- 第二级 -->
        <el-select class="myselect" v-show="secondShow" v-model="secondId" placeholder="请选择" @change="selectSecond(secondId)">
          <el-option v-for="item in secondList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- 第三级 -->
        <el-select class="myselect" v-show="thirdShow" v-model="thirdId" placeholder="请选择" @change="selectThird(thirdId)">
          <el-option v-for="item in thirdList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- 第四级 -->
        <el-select class="myselect" v-show="fouthShow" v-model="fouthId" placeholder="请选择" @change="selectFouth(fouthId)">
          <el-option v-for="item in fouthList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less" scoped>
.title-header{
    text-align: left;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    background-color: #f0f3f8;
    padding-left: 10px;
    margin-bottom: 10px;
}
.addform {
  width: 100%;
  text-align: left;
  background-color: #fff;
  min-height: 700px;
  padding-top:45px;
}
.btn {
  width: 114px;
}
.myselect {
  width: 200px;
}
.firstType {
  text-align: left;
  height: 60px;
  &.selected {
    background-color: #0099ff;
    color: #ffffff;
  }
}
</style>
<script>
var config = require('@/components/utils/Common_Config.js')
import axios from 'axios'
import qs from 'qs'
export default {
  data() {
    return {
      form: {
        title: '',
        diseaseId: '',
        type: ''
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }
        ]
      },
      firstId: '',
      secondId: '',
      thirdId: '',
      fouthId: '',
      typeShow:false,
      secondShow: false,
      thirdShow: false,
      fouthShow: false,
      firstList: [
        {
          name: '现况调查',
          id: '2'
        },
        {
          name: '个案调查',
          id: '1'
        },
        {
          name: '医生',
          id: '3'
        }
      ],
      secondList: [
        {
          name: '不明原因',
          id: '4'//6
        },
        {
          name: '传染病',
          id: '6'//9
        },
        {
          name: '食源性',
          id: '5'//4
        }
      ],
      thirdList: [],
      fouthList: [],

      infectiousDiseases: [
        //传染病
        {
          name: '甲',
          id: '1'
        },
        {
          name: '乙',
          id: '2'
        },
        {
          name: '丙',
          id: '3'
        },
        {
          name: '其它',
          id: '5'
        }
      ]
    }
  },

  methods: {
    onSubmit() {
      //创建事件
    //  console.log("type的值"+this.form.type);
    //  console.log("diseaseId的值"+this.form.diseaseId)
      if(this.form.title==""){
        this.$message({
          type:"info",
          message:"请输入表单名称"
        });
        return;
      }else if(this.form.type==""){
        this.$message({
          type:"info",
          message:"请选择类别"
        });
        return;
      }else if((this.form.type==5||this.form.type==6)&&(this.form.diseaseId==""||this.form.diseaseId.length==0)){
          this.$message({
          type:"info",
          message:"请选择疾病"
        });
        return;
      }else{
        this.$router.push({name: 'data-addFormDetail',params:{surveyName:this.form.title,type:this.form.type,diseaseId:this.form.diseaseId}});
      }
    },

    back() {
      //返回
      this.$router.push({
        path: '/home/data-formsmgr'
      })
    },
    selectFirst(value) {
      this.secondId = '';
      this.thirdId = '';
      this.fouthId = '';
      this.form.type = value;
      
      if (value == 1) {
        this.form.type='';
        //个案
        this.typeShow=true;
        this.secondShow = true;
        var _this = this;
        axios({
          method: 'get',
          url: config.apiHost + '/disease/list?type=5',
        }).then(function(res) {
          _this.thirdList = res.data.body;
        })
      } else {
        this.typeShow=false;
        this.secondShow = false;
        this.thirdShow = false;
        this.fouthShow = false;
      }
     
    },
    selectSecond(value) {
      this.thirdId = '';
      this.fouthId = '';
      
      this.form.type = value
      if (value == 6) {
        //传染病
        this.thirdShow = true;
        this.fouthShow = true;
        this.thirdList = this.infectiousDiseases;
      } else if (value == 5) {
        //食源性
        this.thirdShow = true;
        this.fouthShow = false;
        this.fouthId = '';
        var _this = this
        axios({
          method: 'get',
          url: config.apiHost + '/disease/list?type=4',

         
        }).then(function(res) {
          _this.thirdList = res.data.body;
        })
      } else {
        //不明原因
        this.thirdShow = false;
        this.fouthShow = false;
        var _this = this;
        axios({
          method: 'get',
          url: config.apiHost + '/disease/list?type=6',
        }).then(function(res) {
          _this.form.diseaseId = res.data.body[0].id;
        })
      }
    
    },
    selectThird(value) {
      this.fouthId = '';
      var _this = this
      if (this.fouthShow == true) {
        axios({
          method: 'get',
          url: config.apiHost + '/disease/list?type=' + value,
        }).then(function(res) {
          _this.fouthList = res.data.body;
        })
      } else {
        _this.form.diseaseId = value;
      }
 
    },
    selectFouth(value) {
      this.form.diseaseId = value;
    }
  },

  created() {
    let type=this.$route.params.type;
    if(type==1){//现况
      this.firstId=2;
    }else if(type==2){//个案
      this.firstId=1;
    }else if(type==3){//
      this.firstId=3;
    }
    this.selectFirst(this.firstId);
  }
}
</script>