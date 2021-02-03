<template>
    <div class="datumBox">
        <div class="dtitle">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item >资料管理</el-breadcrumb-item>
                <el-breadcrumb-item >资料查看</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button size="mini" type="primary" style="float: right; margin: auto 0" @click="closeAdd">返回</el-button>
        </div>
        <div class="datum-container">
             <div class="row_div">
                <div class="my_inp">文章标题</div>
                <el-input placeholder="请输入文章标题" style="width:40%;" readonly v-model="addFrom.title"></el-input>
            </div>
            <div class="row_div">
                <div class="my_inp">文章类别</div>
                <el-input placeholder="请输入文章类别" style="width:40%;" readonly v-model="addFrom.typeId"></el-input>
            </div>
             <div class="row_div">
                <label class="my_inp">文章重要性</label>
                <div style="width:40%;">
                    <el-radio  v-model="addFrom.setTop" label='0'>普通</el-radio>
                    <el-radio  v-model="addFrom.setTop" label='1'>置顶</el-radio>
                </div>
                
            </div>
             <div class="row_div">
                <label class="my_inp">是否显示</label>
                <div style="width:40%;">
                   <el-radio  v-model="addFrom.displayFlag" label='1'>显示</el-radio>
                   <el-radio  v-model="addFrom.displayFlag" label='0'>不显示</el-radio> 
                </div>
            </div>
            <div class="row_div">
                <div class="my_inp">文章作者</div>
                <el-input placeholder="请输入文章作者" style="width:40%;" readonly v-model="addFrom.author"></el-input>
            </div>
            <div class="row_div">
                <div class="my_inp">关键字</div>
                <el-input placeholder="请输入关键字" style="width:40%;" readonly v-model="addFrom.keyword"></el-input>
            </div>
            <!-- 富文本编辑器 -->
            <div class="editor_box">
                 <vue-html5-editor :content="addFrom.content"   :min-height="300"></vue-html5-editor>
            </div>
             <div class="row_div btn_style">
                <el-button @click="closeAdd">取 消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js');
export default {
  data(){
      return{
          systemKey:'',
          addFrom:{
            systemKey:'' ,//这个需要你定义一个系统变量
            typeId:null,    // 类别ID
            title:'',       //资料名称
            author:'',      //作者
            setTop:'1',     //置顶(1是0否)
            keyword:'',     //关键字
            displayFlag:'1',//是否显示(1是0否)
            content:'文章详情',//内容
          },
          id:null,
      }
  },
  methods:{
    closeAdd(){
        this.$router.go(-1);
    },
    // 根据资料Id查详情
    selectDetail(){
        axios.get(config.datumUrl +'/resource/data/getResourceById', {  
            params : { //请求参数  
                id:this.id,
                systemKey:this.systemKey,
            }  
        }).then((result)=>{  
            if (result.data.status == 200) {
                    this.addFrom = result.data.body;
                    this.addFrom.displayFlag=this.addFrom.displayFlag.toString();//单选按钮取值
                    this.addFrom.setTop=this.addFrom.setTop.toString();//单选按钮取值
                }
        }).catch(function(response){  
            //   this.$message.error(error);
        })  
    }
  },
  mounted(){

  },
  created(){
      this.id=this.$route.params.id;
      this.systemKey=this.$route.params.systemKey;
      this.selectDetail();
  }
}
</script>
<style scoped>
    .datumBox{
        width:auto;
        min-height: 100%;
        text-align: left;
        background-color: #E2E6EF;
        padding:10px 15px 45px;
    }
    .dtitle{
        width: 100%;
        height: 45px;
        line-height: 45px;
        font-size:18px;
        padding:0 20px;
        display: flex;
        justify-content: space-between;
        background-color: #F6F7FB;
        margin-bottom: 5px;
    }
    .datum-container{
        height: calc(100% - 45px);
        min-height: 800px;
        background-color: #FFFFFF;
        padding: 30px 0px;
      
    }
    .editor_box{
        padding: 5px 15px;
    }
    .row_div{
        display: flex;
       align-items: center;
       justify-content:center;
       margin-bottom: 20px;
    }
    .my_inp{
        width: 80px;
        text-align: left;
    }
    .btn_style{
        margin-top:30px;
    }
</style>


