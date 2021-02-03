<template>
<div class="report_container">
    <div class="reportBox">
        <!-- 事件报告编辑 -->
        <div class="top_main">
            <el-breadcrumb separator-class="el-icon-arrow-right" >
                <el-breadcrumb-item>调查管理</el-breadcrumb-item>
                <el-breadcrumb-item>调查任务</el-breadcrumb-item>
                <el-breadcrumb-item>调查详情</el-breadcrumb-item>
                <el-breadcrumb-item>事件报告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="main_box">
            <div class="btn_main">
                <label>事件报告</label>
                <div>
                    <!-- <el-button size="medium" type="primary" @click="add">保存</el-button> -->
                    <el-button size="medium" type="primary" @click="outWord">导出word</el-button>
                    <el-button size="medium" type="info" @click="goClose">返回</el-button>
                </div>
            </div>
            <!-- <div class="btn_box">事件名称：<el-input placeholder="请输入名称" style="width:225px;" v-model="form.name" readonly="readonly"></el-input></div> -->
            <div class="btn_box">事件名称：<span style="color:#0066FF" >{{form.name}}</span></div>
            <div class="btn_box">报告类型：
                <el-select v-model="form.type"  placeholder="请选择">
                    <el-option
                    v-for="item in reportType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <!-- 富文本编辑器 -->
            <div class="editor_box">
                 <vue-html5-editor :content="form.content"  :height="500" @change="changeEditor"></vue-html5-editor>
            </div>
           
        </div>
    </div>
    <el-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="30%"
  left>
  <template>
  <el-radio v-model="radio" label="1">导出doc文件</el-radio>
  <el-radio v-model="radio" label="2">导出docx文件</el-radio>
</template>

  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js');
 export default {
    data() {
        return {
            content:'请输入内容',
            form:{
                id:null,
                eventId:null,
                name:'',
                type:null,
                content:'',
            },
            reportType:[],
            outData:{},
            myUrl:"",
            centerDialogVisible: false,
             radio: '1',
        }
     },
    components:{

    },
     methods: {
        // 得到报告类型
        getType(){
            axios.get(config.apiHost +'/survey/reportType',{
                params : { //请求参数  
                    token:config.token,
                } 
            }).then((result)=> {
                if (result.data.status == 200) {
                    this.reportType = result.data.body;
                    // console.log(this.sampleType);
                }
            }, (error)=> {
                this.$message.error(error);
            });
        },
        // 得到报告详情
        getDetail(){
            axios.get(config.apiHost +'/survey/findReport',{
                params : { //请求参数
                    id:this.form.id, 
                    token:config.token,
                } 
            }).then((result)=> {
                if (result.data.status == 200) {
                    this.form = result.data.body;
                    console.log(this.form);
                }else{
                  this.$message(result.data.body.message);
                }
            }, (error)=> {
                this.$message.error(error);
            });
        },
        //返回
        goClose(){
            this.$router.go(-1)
        },
        // 导出word文档
        outWord(){
            this.centerDialogVisible = true;
           axios.get(config.apiHost +'/exportWord/makeDoc',{
                params : { //请求参数
                    id:this.form.id, 
                    type:this.form.type,
                    eventId:this.form.eventId,
                    token:config.token,
                    document:this.radio
                } 
            }).then((result)=> {
                if (result.data.status == 200) {
                    this.outData = result.data.body;
                    console.log(this.outData);
                    this.myUrl=this.outData.completeSavePath;
                    window.open(this.myUrl,'_blank')
                }else{
                //   this.$message("result.data.body.message");
                }
            }); 
        },
        
        //富文本取值
        changeEditor(e){
            // console.log(e);//输出富文本内容
            this.form.content=e;
        }


    },
    mounted(){
        this.getDetail();
    },
    created(){
         this.getType();
        // console.log("@@@"+this.$route.params.eventId+"现况："+this.$route.params.ispage);
        this.form.id=this.$route.params.id;
        
        // this.form.eventId=this.$route.params.eventId;
        // this.form.name=this.$route.params.name;
        // this.form.type=this.$route.params.type;
        // this.form.content=this.$route.params.content;

       
    }

 }
</script>

<style scoped>
    .report_container{
        width:auto;
        min-height: 100%;
        background-color: #E2E6EF;
        padding:10px 15px 45px;
    }
    .reportBox{
        width:100%;
        height: 100%;
        text-align: left;
        /* min-height: 800px; */
        background-color: #E2E6EF;
        /* padding:10px; */
    }
    .top_main{
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 10px;
        background-color: #F6F7FB;
    }
    .main_box{
        height: 100%;
        width: 100%;
        margin-top: 5px;
        min-height: 800px;
        background-color: #ffffff;
    }
    .btn_main{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 15px;
    }
    .btn_box{
        padding: 5px 15px;
    }
    .editor_box{
        padding: 5px 15px;
    }
</style>

