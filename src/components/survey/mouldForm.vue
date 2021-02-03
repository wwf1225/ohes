<template>
  <div class="mouldbox">
      <!-- 模板表单 -->

      <!-- 左侧列表 -->
      <!-- <div class="left_main">
          <div class="left_div" @click="toggleTab('exist')" :class='{"current" : currentTab == "exist" }'>
            <i class="el-icon-date"></i>
            <span>现况调查</span>
          </div>
          <div class="left_div" @click="toggleTab('infection')" :class='{"current" : currentTab == "infection" }'>
            <i class="el-icon-location-outline"></i>
            <span>传染病调查表单</span>
          </div>
          <div class="left_div" @click="toggleTab('food')" :class='{"current" : currentTab == "food" }'>
            <i class="el-icon-bell"></i>
            <span>食源性调查表单</span>
          </div>
          <div class="left_div" @click="toggleTab('unknown')" :class='{"current" : currentTab == "unknown" }'>
            <i class="el-icon-phone-outline"></i>
            <span>不明原因</span>
          </div>
          <div class="left_div" @click="toggleTab('docter')" :class='{"current" : currentTab == "docter" }'>
            <i class="el-icon-view"></i>
            <span>医生调查表单</span>
          </div>
          <div class="left_div" @click="toggleTab('other')" :class='{"current" : currentTab == "other" }'>
            <i class="el-icon-search"></i>
            <span>其他</span>
          </div>
      </div> -->
       <!-- 左侧列表 -->
     <div class="left_main">
        <!-- 现况调查 -->
        <div v-if="this.addFrom.addtype==2" class="left_div" @click="toggleTab('exist')" :class='{"current" : currentTab == "exist" }'>
            <i class="el-icon-date"></i>
            <span>现况调查</span>
        </div>
        <!-- 个案调查 -->
        <div v-else-if="this.addFrom.addtype==1||this.addFrom.addtype==5">
            <el-menu
                default-active="11"
                class="el-menu-vertical-demo"
                background-color="#fff"
                text-color="#000"
                active-text-color="#ffd04b">
                <el-submenu index="1">
                    <template slot="title">
                        <span>个案调查</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="11" @click="toggleTab('food')">食源性调查表单</el-menu-item>
                        <el-menu-item index="12" @click="toggleTab('infection')">传染病调查表单</el-menu-item>
                        <el-menu-item index="13" @click="toggleTab('unknown')">不明原因调查表单</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </div>
       
        <!-- 医生 -->
        <div  v-else-if="this.addFrom.addtype==3" class="left_div" @click="toggleTab('docter')" :class='{"current" : currentTab == "docter" }'>
            <i class="el-icon-view"></i>
            <span>医生调查表单</span>
        </div>
     </div>

      <!-- 右侧列表 -->
      <div class="right_main">
        <!-- 搜索框 -->
        <div class="select_div">
            <el-input placeholder="请输入内容" style="width:300px"  v-model="formQuery.name"></el-input>
            <el-button type="primary" size="mini" icon="el-icon-search" style=" margin-left: 10px;" @click="seaechData">搜索</el-button>
        </div>
        <!-- 列表 -->
        <div>
          <div class="right_div" v-for="(v,k) in tableData" :key="k">
            <div>
              <span style=" margin-right: 50px;">{{v.name}}</span>
              {{v.number}}个题目 1页 引用1104次
            </div>
            <div>
              <input type="button"  @click="openFrom(v.fromsId)" value="查看">
              <input type="button"  @click="useFrom(v)" value="使用该表单">
            </div>
          </div>
        </div>
        
      </div>

      <!-- 预览模板 -->
       <template >
         <transition enter-active-class = 'animated fadeInRight' leave-active-class = 'animated fadeOutRight'>
            <div class="temp_bg"  v-show="fromShow" @click="closefrom" >
              <div class="my_from">
                    <!-- <mu-circular-progress :size="40" v-if="loading"/> -->
                    <!-- <div v-html="html"></div> -->
                     <iframe ref="iframe"   style=" width: 600px;height: 600px;" :src="formUrl" ></iframe>
              </div>
             
            </div>
         </transition>
      </template>

       <!-- 使用该表单 -->
      <el-dialog class="vedio"  :visible.sync="useFromVisible">
          <div class="blankbox">
              <!-- 空白表单 --> 
              <span style="font-size:20px" >标题</span>
              <div class="select-div">
                <el-input v-model="addFrom.name" placeholder="请输入内容" style="width:300px"></el-input>
                <span class="title" >请输入标题</span>
              </div>

             <!-- 选择类别（暂时去掉） -->
              <!-- <span style="font-size:20px">类别</span>
              <div class="select-div">
                  <el-button type="primary" v-if="this.addFrom.addtype==2">现况调查</el-button>
                  <el-button type="primary" v-else-if="this.addFrom.addtype==3">医生调查表</el-button>
                  <el-button type="primary" v-if="this.addFrom.addtype==5">对照调查</el-button>
                  <el-button type="primary" v-if="this.addFrom.addtype==4">其他</el-button>
              </div>

              <div class="select-div" v-show="this.addFrom.addtype==1">
                  <el-button type="primary">个案调查</el-button>

                <! 个案类型选择，三级联动（暂时去掉） -->
                 <!-- <div class="btn_detail"> -->
                      <!-- <el-button type="primary" class="btn" size="medium" @click="caseTab('food')" :class='{"current" : currentCaseTab == "food" }'>食源性</el-button> -->
                      <!-- <el-select v-model="from.foodtype"  placeholder="请选择" v-show="isfood" @change="chooseFood"> -->
                          <!-- 食源性 -->
                            <!-- <el-option
                                v-for="item in foodType"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option> -->
                      <!-- </el-select> --> 
                  <!-- </div> -->
                  <!-- <div class="btn_detail"> -->
                      <!-- <el-button type="primary" class="btn" size="medium" @click="caseTab('ness')" :class='{"current" : currentCaseTab == "ness" }'>传染病</el-button> -->
                      <!-- <el-select v-model="from.type"  placeholder="请选择" v-show="isness" @change="chooseNess"> -->
                          <!--传染病-->
                          <!-- <el-option
                              v-for="item in illnessType"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option> -->
                        <!-- </el-select> -->
                         <!-- <el-select v-model="from.nesstype"  placeholder="请选择" v-show="isness" @change="chooseName"> -->
                          <!-- <el-option
                              v-for="item in nessDetailType"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option> -->
                        <!-- </el-select> -->
                  <!-- </div> -->
                  <!-- <div class="btn_detail">
                    <el-button type="primary" class="btn" size="medium" @click="caseTab('nowhy')" :class='{"current" : currentCaseTab == "nowhy" }'>不明原因</el-button>
                  </div> -->
              <!-- </div> --> 
              
              <div class="but_div">
                  <el-button type="primary" style="width:80px;" size="small" @click="editForm">编辑表单</el-button>
                  <el-button type="primary" style="width:80px;" size="small" @click="userForm">直接使用</el-button>
                  <!-- 暂时去掉  -->
                  <!-- <el-button type="primary" style="width:80px;" size="small" @click="addForm">保存</el-button>-->
              </div>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import animate from 'animate.css';
import axios from 'axios';
var Cookies =require("js-cookie");
var config = require('@/components/utils/Common_Config.js');
export default{
    data(){
        return{
            currentTab:'exist', // currentTab 用于标识当前触发的子组件
            fromShow:false,
            useFromVisible:false,
            formQuery:{
                name:'',
            },
            queryType:null,
            tableData:[],
            page:1,
            limit:10,
            // url:'',
            // loading: false,
            // html: ''
            formUrl:'',
            from:{
                type:null,
                nesstype:null,
                foodtype:null,
            },
            addFrom:{
                fromsId:null,
                name:'',
                addtype:null,
                diseaseId:null,
                isTemplate:null,
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
            nessDetailType:[],
            foodType:[],
            isfood:true,
            isness:false,
           
            currentCaseTab:'food',
          
            type:null,
            eventId:null,
            NewfromsId:null,

            oneFrom:{},
            bindType:null,
            caseType:null,
            controlType:null,

        }
    },
   
    methods:{
        toggleTabOne(v){
            // console.log(v);
        },
        toggleTab: function(tab) {
            this.currentTab = tab; // tab 为当前触发标签页的组件名
            if(tab=='exist'){
              //点击现况
            //    console.log("现况");
               this.getFromList(2);
               this.queryType=2;
            }else if(tab=='infection'){
              // 点击流行病
            //    console.log("流行病");
               this.getFromList(6);
               this.queryType=6;
            }else if(tab=='food'){
              // 点击食源性
               this.getFromList(5);
               this.queryType=5;
            }else if(tab=='unknown'){
              // 点击不明原因
               this.getFromList(4);
               this.queryType=4;
            }else if(tab=='docter'){
              // 点击医生调查表
               this.getFromList(3);
               this.queryType=3;
            }
        },
        seaechData(){
            this.getFromList(this.queryType);
        },
        openFrom(fromsId){
           this.fromShow=true;
           this.formUrl=config.apiUrl+"preview.html?formId="+fromsId+"&token="+Cookies.get('token');
          //  this.load('http://192.168.1.169:8020/cdcform/preview.html?formId=403118302899081217');
        },
        useFrom(v){
          console.log(v);
          this.addFrom.fromsId=v.fromsId;
          this.addFrom.addtype=v.type;
          this.addFrom.diseaseId=v.diseaseId;
          this.addFrom.isTemplate=v.isTemplate;
          
          axios.get(config.apiHost+'/froms/name',{
              params:{
                  name:v.name,
                  eventId:this.eventId,
                  fromsId:v.fromsId
              }
          }).then(result=>{
              if(result.data.status==200){
                  this.addFrom.name=result.data.body.msg;
                //   console.log(result.data.body.msg);
              }else{
                  this.$message.error(result.data.body.msg);
              }
          });
          this.useFromVisible=true;
        },
         //点击遮盖层关闭弹框
        // handleClose(done) {
        //     // this.$confirm('确认关闭？')
        //     // .then(_ => {
        //         // done();
        //     // })
        //     // .catch(_ => {});
        // },
        caseTab: function(tab) {
            this.currentCaseTab = tab; // tab 为当前触发标签页的组件名
            if(tab=='food'){
              //点击食源性
                this.isfood=true,
                this.isness=false,
                // this.addFrom.diseaseId=4,
                this.showfoodList(4);
            }else if(tab=='ness'){
              // 点击传染病
               this.isfood=false,
               this.isness=true
            //    this.addFrom.diseaseId=1
            }else{
              // 点击不明原因
               this.isfood=false,
               this.isness=false,
            //    this.addFrom.diseaseId=5,
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
                      } 
              }).catch(function(response){  
                  //   this.$message.error(error);
                //   console.log(response);
              })  
          },
           // 食源性列表选择时触发
          chooseFood(id){
            //   console.log(id);
              this.addFrom.diseaseId=id;
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
                      } 
              }).catch(function(response){  
                  //   this.$message.error(error);
                //   console.log(response);
              })  
          },
          //选择传染病名称触发(二级下拉)
          chooseName(id){
            //   console.log(id);
              this.addFrom.diseaseId=id;
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
                          this.addFrom.diseaseId = result.data.body[0].id;
                        //    console.log(this.addFrom.diseaseId);
                      } 
              }).catch(function(response){  
                  //   this.$message.error(error);
                //   console.log(response);
              })  
          },
          //保存表单名称
          saveFormName(){
              axios.get(config.apiHost+'/froms/saveFromsName', {  
                params:{
                    fromsId:this.addFrom.fromsId,
                    eventId:this.eventId,
                }
            }).then((result)=>{  
               
                if (result.data.status == 200) {
                    // this.$message.success("成功");
                        
                }else{
                    this.$message.error(result.data.body.message);
                }
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })

          },
          //编辑表单
          editForm(){
              this.saveFormName();
              //复制表单，得到新表单对象
              axios.get(config.apiHost+'/froms/copyFroms', {  
                    params:{
                        fromsId:this.addFrom.fromsId,
                        name:this.addFrom.name,
                        type:this.addFrom.addtype,
                        controlType:this.controlType,
                        diseaseId:this.addFrom.diseaseId,
                        
                    }
                }).then((result)=>{  
                    // console.log("请求返回1。。。");
                    if (result.data.status == 200) {
                        this.$message.success("复制成功");
                        //获取到新的Id
                        this.NewfromsId=result.data.body.fromsId;
                        this.oneFrom=result.data.body;
                        // this.oneFrom.fromsId="";
                        //  console.log(this.oneFrom);

                        // this.oneSave(this.oneFrom);//保存新复制的事件
                        // 绑定事件和新表单(暂时去掉)
                            // axios.get(config.apiHost+'/questionareEvent/save', {  
                            //     params:{
                            //         formId:this.NewfromsId,
                            //         eventId:this.eventId,
                            //         type:this.bindType,
                            //         token:config.token,
                            //     }
                            // }).then((result)=>{  
                            //     // console.log("请求返回2。。。");
                            //     if (result.data.status == 200) {
                            //             this.$message.success("绑定成功");
                            //             // console.log(this.addFrom.addtype);
                            //             this.$router.push({name: 'edit_form',params:{fromsId:this.NewfromsId,eventId:this.eventId,type:this.addFrom.addtype,diseaseId:this.addFrom.diseaseId,isTemplate:this.addFrom.isTemplate,caseType:this.caseType}});//跳转到编辑表单界面
                            //         } 
                            // }).catch(function(response){  
                            //     //   this.$message.error(error);
                            //     // console.log(response);
                            // })  
                            this.$router.push({name: 'edit_form',params:{fromsId:this.NewfromsId,eventId:this.eventId,type:this.addFrom.addtype,diseaseId:this.addFrom.diseaseId,isTemplate:this.addFrom.isTemplate,caseType:this.caseType}});//跳转到编辑表单界面
                        } 
                }).catch(function(response){  
                    //   this.$message.error(error);
                    // console.log(response);
                })  
          },
          // 直接使用
          userForm(){
              this.saveFormName();
            //复制表单，得到新表单对象 http://192.168.5.197:8088/survey/userForm?surveyName=fff77777&type=6&diseaseId=1&fromsId=427885349776265217&eventId=89
            axios.get(config.apiHost+'/survey/userForm', {  
                params:{
                    fromsId:this.addFrom.fromsId,
                    eventId:this.eventId,
                    type:this.addFrom.addtype,
                    controlType:this.controlType,
                    surveyName:this.addFrom.name,
                   

                }
            }).then((result)=>{  
                // console.log("请求返回。。。");
                if (result.data.status == 200) {
                        this.$message.success("成功");
                        this.NewfromsId=result.data.body.fromsId;
                        this.$router.push({name: 'fill_form',params:{fromsId:this.NewfromsId,eventId:this.eventId,type:this.addFrom.addtype,caseType:this.caseType,urlType:1}});//跳转到填写表单
                    } 
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })


            // axios.get(config.apiHost+'/froms/copyFroms', {  
            //         params:{
            //             fromsId:this.addFrom.fromsId,
            //             name:this.addFrom.name,
            //             type:this.addFrom.addtype,
            //             diseaseId:this.addFrom.diseaseId,
            //             token:config.token,
            //         }
            //     }).then((result)=>{  
            //         // console.log("请求返回。。。");
            //         if (result.data.status == 200) {
            //             this.$message.success("复制成功");
            //             //获取到新的Id
            //             this.NewfromsId=result.data.body.fromsId;
            //              this.oneFrom=result.data.body;
            //             //  this.oneSave(result.data.body);//保存新复制的事件

            //             axios.post(config.apiHost+'/froms/preBuildTempFroms',this.oneFrom).then((result)=>{  
            //                 // console.log("请求返回。。。");
            //                 if (result.data.status == 200) {
            //                         this.$message.success("保存成功");
            //                         //  this.pushEvent(this.NewfromsId);//发布新复制的事件

            //                         axios.get(config.apiHost+'/froms/publishFroms', {  
            //                             params:{
            //                                 fromsId:this.NewfromsId,
            //                                 token:config.token,
            //                             }
            //                         }).then((result)=>{  
            //                             // console.log("请求返回。。。");
            //                             if (result.data.status == 200) {
            //                                     this.$message.success("发布成功");
            //                                     axios.get(config.apiHost+'/questionareEvent/save', {  
            //                                             params:{
            //                                                 formId:this.NewfromsId,
            //                                                 eventId:this.eventId,
            //                                                 type:this.bindType,
            //                                                 token:config.token,
            //                                             }
            //                                         }).then((result)=>{  
            //                                             // console.log("请求返回。。。");
            //                                             if (result.data.status == 200) {
            //                                                     this.$message.success("绑定成功");
            //                                                     this.$router.push({name: 'fill_form',params:{fromsId:this.NewfromsId,eventId:this.eventId,type:this.addFrom.addtype,caseType:this.caseType}});//跳转到填写表单
            //                                                 } 
            //                                         }).catch(function(response){  
            //                                             //   this.$message.error(error);
            //                                             // console.log(response);
            //                                         })
            //                                 } 
            //                         }).catch(function(response){  
            //                             //   this.$message.error(error);
            //                             // console.log(response);
            //                         })  

  
            //                     } 
            //             }).catch(function(response){  
            //                 //   this.$message.error(error);
            //                 // console.log(response);
            //             })  


                        
            //             //   
                       
            //         } 
            //     }).catch(function(response){  
            //         //   this.$message.error(error);
            //         // console.log(response);
            //     })  
          },
          //保存
          addForm(){
               //复制表单，得到新表单对象
               axios.get(config.apiHost+'/froms/copyFroms', {  
                    params:{
                        fromsId:this.addFrom.fromsId,
                        name:this.addFrom.name,
                        type:this.addFrom.addtype,
                        diseaseId:this.addFrom.diseaseId,
                        
                    }
                }).then((result)=>{  
                    // console.log("请求返回。。。");
                    if (result.data.status == 200) {
                        this.$message.success("复制成功");
                        //获取到新的Id
                        this.NewfromsId=result.data.body.fromsId;
                        this.pushEvent(this.NewfromsId);//发布新复制的事件
                         // 绑定事件和新表单
                        //   
                        axios.get(config.apiHost+'/questionareEvent/save', {  
                                params:{
                                    formId:this.NewfromsId,
                                    eventId:this.eventId,
                                    type:this.bindType,
                                    token:config.token,
                                }
                            }).then((result)=>{  
                                // console.log("请求返回。。。");
                                if (result.data.status == 200) {
                                        this.$message.success("绑定成功");
                                        this.$router.push({path: '/home/form_add'});//跳转到列表界面
                                    } 
                            }).catch(function(response){  
                                //   this.$message.error(error);
                                // console.log(response);
                            })  
                    } 
                }).catch(function(response){  
                    //   this.$message.error(error);
                    // console.log(response);
                })  
          },

        // 发布事件（复制完后直接使用表单得发布）
        pushEvent(Id){
            axios.get(config.apiHost+'/froms/publishFroms', {  
                params:{
                    fromsId:Id,
                    token:config.token,
                }
            }).then((result)=>{  
                // console.log("请求返回。。。");
                if (result.data.status == 200) {
                        this.$message.success("发布成功");
                    } 
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })  
        },
         // 第一次保存表单（复制完后编辑表单得先保存）
        oneSave(from){
            axios.post(config.apiHost+'/froms/preBuildTempFroms',from).then((result)=>{  
                // console.log("请求返回。。。");
                if (result.data.status == 200) {
                        this.$message.success("保存成功");
                    } 
            }).catch(function(response){
                //   this.$message.error(error);
                // console.log(response);
            })  
        },
        close(){
            this.$router.go(-1);
        },
        //   关闭预览
        closefrom(){
          this.fromShow=false;
        },
        getFromList(type){
            // console.log("进入请求。。。");
            axios.get(config.apiHost+ '/froms/queryTempFroms', {  
                params:{
                    page:1,
                    limit:1000,
                    type:type,
                    name:this.formQuery.name,
                    token:config.token,
                }
            }).then((result)=>{  
                // console.log("请求返回。。。");
                if (result.data.status == 200) {
                        this.tableData = result.data.body.list;
                    } 
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })  
        },

    },
    mounted(){
        // console.log('返回加载！！')
        if(this.addFrom.addtype==1||this.addFrom.addtype==5){
           this.getFromList(5);//默认显示食源性调查表单
           this.queryType=5;
        }else{
           this.getFromList(this.addFrom.addtype);
           this.queryType=this.addFrom.addtype;
        }
    },
    created(){
    //   console.log("输出路由");
      this.addFrom.addtype=this.$route.params.type;
      this.eventId=this.$route.params.eventId;
      if(this.addFrom.addtype==1||this.addFrom.addtype==5){
           this.getFromList(5);//默认显示食源性调查表单
           this.queryType=5;
      }else{
           this.getFromList(this.addFrom.addtype);
           this.queryType=this.addFrom.addtype;
      }
    
    //   给绑定表单提供参数
      if(this.addFrom.addtype==1||this.addFrom.addtype==5){
           this.bindType=1;
            // console.log("是个案/对照");
      }else if(this.addFrom.addtype==3){
        //    console.log("是医生");
           this.bindType=2;
      }else{
          this.bindType=3;
      }

      if(this.addFrom.addtype==1){
          this.caseType=1;//个案
      }else if(this.addFrom.addtype==5){
          this.caseType=2;//对照
      }

    if(this.addFrom.addtype==1){
        this.controlType=1;//个案
    }else if(this.addFrom.addtype==2){
        this.controlType=2;//现况
    }else if(this.addFrom.addtype==3){
        this.controlType=3;//医生
    }

    //    console.log("^^^^^^^^^^^^"+this.bindType);
    //   console.log(this.addFrom.addtype);
    }
}
</script>

<style lang="less" scoped>
    .mouldbox{
        display: flex;
        height: 100%;
        
        .left_main{
        //   flex: 0.5;
          width: 200px;
          height: 100%;
          min-height: 800px;
          background-color: #FFFFFF;
          margin-right: 10px;
          box-sizing: border-box;
          .left_div{
            display: flex;
            justify-content: space-between;
            padding: 18px;
            border-bottom: 1px solid #EAEDF4;
            &.current{
              background-color: #D0D6E4;
               color: #5CB1F5;
            }
          }
        }
        .right_main{
          flex: 2.5;
          height: 100%;
          min-height: 800px;
          background-color: #FFFFFF;
          .select_div{
            padding:15px;
            border-bottom: 1px solid #EAEDF4;
          }
          .right_div{
              display: flex;
              justify-content: space-between;
              padding: 15px;
              border-bottom: 1px solid #EAEDF4;
          }
        }
        .temp_bg{
          width: 100%;
          height: 100%;
          position: fixed;
          left: 0;
          top: 0;
          // background:rgba(7, 17, 27, 0.6);
          z-index: 1000;
          .my_from{
            width: 600px;
            height: 600px;
            background: #FFFFFF;
            position: fixed;
            top: 173px;
            right:0;
           
          }
        }
      .blankbox{
        height: 100%;
        background-color: #FFFFFF;
        // padding: 30px;
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
    }
</style>