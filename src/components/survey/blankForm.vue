<template>
  <div class="blankbox">
      <!-- 空白表单 --> 
      <span style="font-size:20px">标题</span>
      <div class="select-div">
         <el-input placeholder="请输入内容" style="width:300px" v-model="surveyName"></el-input>
         <!-- <span class="title">请输入标题</span> -->
      </div>

      <span style="font-size:20px">类别</span>
      <div class="select-div">
            <el-button type="primary" v-if="this.type==2">现况调查</el-button>
            <el-button type="primary" v-else-if="this.type==3">医生调查表</el-button>
            <el-button type="primary" v-if="this.type==5">对照调查</el-button>
            <el-button type="primary" v-if="this.type==4">其他</el-button>
      </div>

       <div class="select-div" v-show="this.type==1">
          <el-button type="primary">个案调查</el-button>

          <div class="btn_detail">
              <el-button type="primary" class="btn" size="medium" @click="blankTab('food')" :class='{"current" : currentTab == "food" }'>食源性</el-button>
              <el-select v-model="from.foodtype"  placeholder="请选择" v-show="isfood" @change="chooseFood">
                    <el-option
                        v-for="item in foodType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
              </el-select>
          </div>
          <div class="btn_detail">
              <el-button type="primary" class="btn" size="medium" @click="blankTab('ness')" :class='{"current" : currentTab == "ness" }'>传染病</el-button>
               <el-select v-model="from.type"  placeholder="请选择" v-show="isness"  @change="chooseNess">
                   <el-option
                      v-for="item in illnessType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="from.nesstype"  placeholder="请选择" v-show="isness" @change="chooseName">
                    <el-option
                        v-for="item in nessDetailType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
          </div>
          <div class="btn_detail">
             <el-button type="primary" class="btn" size="medium" @click="blankTab('nowhy')" :class='{"current" : currentTab == "nowhy" }'>不明原因</el-button></div>
      </div>
      
      <div class="but_div">
          <el-button type="primary" style="width:80px;" size="small" @click="addFrom">创建</el-button>
          <el-button type="primary" style="width:80px;" size="small">取消</el-button>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
var config = require('@/components/utils/Common_Config.js');
    export default{
        data(){
            return{
                from:{
                  type:null,
                  foodtype:null,
                  nesstype:null
                },
                illnessType:[
                    {
                        id:1,
                        name:'甲类'
                    },
                    {
                        id:2,
                        name:'乙类'
                    },
                    {
                        id:3,
                        name:'丙类'
                    },
                    {
                        id:5,
                        name:'其他'
                    }
                ],
                foodType:[],
                nessDetailType:[],
                isfood:true,
                isness:false,
                currentTab:'food',
                iscase:false,//个案

                //添加参数
                eventId:null,
                surveyName:'',
                type:null,
                diseaseId:null,
                isTemplate:true,
            }
        },
        methods:{
          blankTab: function(tab) {
            this.currentTab = tab; // tab 为当前触发标签页的组件名
             if(tab=='food'){
              //点击食源性
                this.isfood=true,
                this.isness=false,
                this.showfoodList(4);
            }else if(tab=='ness'){
              // 点击传染病
               this.isfood=false,
               this.isness=true,
               this.from.type=1;
               this.chooseNess(1);

            }else{
              // 点击不明原因
               this.isfood=false,
               this.isness=false,
               this.showId(6);
            }
          },
            // 食源性列表
          showfoodList(type){
            //    
              axios.get(config.apiHost +'/disease/list', {  
                  params:{
                      type:type,//食源性
                      token:config.token,
                  }
              }).then((result)=>{  
                  if (result.data.status == 200) {
                          this.foodType=result.data.body;
                          this.from.foodtype=this.foodType[0].id;
                          this.diseaseId=this.from.foodtype;
                      } 
              }).catch(function(response){  
                  //   this.$message.error(error);
                //   console.log(response);
              })  
          },
          // 食源性列表选择时触发
          chooseFood(id){
            //   console.log(id);
              this.diseaseId=id;
          },


          // 不明原因
          showId(type){
            //    
              axios.get(config.apiHost +'/disease/list', {  
                  params:{
                      type:type,
                      token:config.token,
                  }
              }).then((result)=>{  
                  if (result.data.status == 200) {
                          this.diseaseId = result.data.body[0].id;
                        //    console.log(this.diseaseId);
                      } 
              }).catch(function(response){  
                  //   this.$message.error(error);
                //   console.log(response);
              })  
          },

           //选择传染病等级时触发(一级下拉)
          chooseNess(type){
             this.nessDetailType=[];
             this.from.nesstype=null;
            //   
              axios.get(config.apiHost +'/disease/list', {  
                  params:{
                      type:type,//传染病
                      token:config.token,
                  }
              }).then((result)=>{  
                  if (result.data.status == 200) {
                          this.nessDetailType=result.data.body;
                          this.from.nesstype=this.nessDetailType[0].id;
                          this.diseaseId=this.from.nesstype;
                      } 
              }).catch(function(response){  
                  //   this.$message.error(error);
                //   console.log(response);
              })  
          },
          //选择传染病名称触发(二级下拉)
          chooseName(id){
            //   console.log(id);
              this.diseaseId=id;
          },

          addFrom(){
              this.$router.push({name: 'edit_blank',params:{surveyName:this.surveyName,type:this.type,eventId:this.eventId,diseaseId:this.diseaseId}});//跳转到填写表单
          },
          close(){
            this.$router.go(-1);
          }
        },
        created(){
            // console.log("输出路由2");
           this.type=this.$route.params.type;
           this.eventId=this.$route.params.eventId;
            // console.log(this.$route.params.type);
            this.showfoodList(4);
        }
    }
</script>

<style lang="less" scoped>
    .blankbox{
       height: 100%;
       min-height: 800px;
       background-color: #FFFFFF;
       padding: 30px;
       .select-div{
         margin-top: 10px;
         margin-bottom: 20px;
         .title{
            font-size:12px;
            color: red;
            margin-left: 10px;
         }
         .btn_detail{
            margin-top: 15px;
            .btn{
              width:99px; 
              background-color: #F1F4FD;
              border: 0;
              color: #000;
              margin-right: 10px;
               &.current{
                  background-color: #0099FF;
                  color: #FFFFFF;
                }
            }
         }
       }
       .but_div{
         margin-top: 200px;
       }
    }
</style>

