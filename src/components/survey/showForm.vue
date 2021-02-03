<template>
    <div class="showbox">
        <!-- 表单查看 -->
        <div class="top_main">
            <el-breadcrumb separator-class="el-icon-arrow-right" >
                <el-breadcrumb-item >调查任务</el-breadcrumb-item>
                <el-breadcrumb-item >调查详情</el-breadcrumb-item>
                <el-breadcrumb-item >查看表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="main_box">
            <div class="btn_main">
                <div>调查表单</div>
                <div>
                    <el-button type="primary" @click="close">返回</el-button>
                </div>
            </div>
            <!-- 填写表单 -->
            <div class="from_main">
                <iframe ref="iframe"   style=" width: 100%;height: 800px;" :src="fromUrl" ></iframe>
            </div>
        </div>
        
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
var config = require('@/components/utils/Common_Config.js');
var Cookies =require("js-cookie");
    export default{
        data(){
            return {
                fromsId:'',
                fromUrl:'',
            }
        },
        computed:{
            ...mapGetters(['location'])
        },
        methods:{
            close(){
                console.log("要返回这个页面："+this.location)
                 this.$router.push({path: this.location});//跳到列表页
                // this.$router.go(-1);
            }
        },
        created(){
            // console.log("输出表单Id");
            this.formId=this.$route.params.formId;
            this.eventId=this.$route.params.eventId;
            this.caseType=this.$route.params.caseType;
            this.caseId=this.$route.params.caseId;
            // http://192.168.1.169:8020/cdcform
            this.fromUrl=config.apiUrl+ "preview_answer.html?formId="+this.formId+"&eventId="+this.eventId+"&caseType="+this.caseType+"&caseId="+this.caseId+"&token="+Cookies.get('token');
            // console.log(this.fromsId);
        }
    }
</script>

<style lang="less" scoped>
    .showbox{
        width:auto;
        // height: 100%;
        min-height: 100%;
        text-align: left;
        background-color: #E2E6EF;
         padding:10px 15px 45px;
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
            background-color: #ffffff;
            .btn_main{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
             }
             .from_main{
                 width: 100%;
                 height:100%; 
             }
        }
       
    }
</style>

