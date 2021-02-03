<template>
    <div class="editbox">
        <!-- 空白表单编辑 -->
         <div class="top_main">
            <el-breadcrumb separator-class="el-icon-arrow-right" >
                <el-breadcrumb-item :to="{ path: '/' }">调查任务</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/' }">调查详情</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/' }">引用模板</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/' }">表单编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

         <div class="main_box">
            <div class="btn_main">
                <div>调查表单</div>
                <div>
                    <el-button type="primary">使用表单</el-button>
                    <el-button type="primary">发布收集</el-button>
                    <el-button type="primary" @click="close">返回</el-button>
                </div>
            </div>
            <!-- 填写表单 -->
            <div class="from_main">
                <iframe ref="iframe"  style=" width: 100%;height: 800px;" :src="fromUrl" ></iframe>
            </div>
        </div>
    </div>
</template>

<script>
    var Cookies =require("js-cookie");
    var config = require('@/components/utils/Common_Config.js');
    export default{
        data(){
            return {
                fromsId:'',
                fromUrl:'',

                 //添加参数
                eventId:null,
                surveyName:'',
                type:null,
                diseaseId:null,
                isTemplate:true,
            }
        },
        methods:{
            close(){
                // this.$router.push({path: '/home/form_add'});//跳转到列表界面
                 this.$router.push({path: '/home/survey-update'});//跳到列表页
            },
            //使用表单
            userForm(){
                 this.$router.push({name: 'fill_form',params:{fromsId:this.fromsId,eventId:this.eventId,type:this.type}});//跳转到填写表单
            }
        },
        created(){
            // console.log("输出表单Id");
            this.surveyName=this.$route.params.surveyName;
            this.type=this.$route.params.type;
            this.diseaseId=this.$route.params.diseaseId;
            this.eventId=this.$route.params.eventId;
           
            this.fromUrl=encodeURI(encodeURI("/froms/index.html?type="+this.type+"&surveyName="+this.surveyName+"&diseaseId="+this.diseaseId+"&isTemplate="+this.isTemplate+"&token="+Cookies.get('token')));
        }
    }
</script>

<style lang="less" scoped>
    .editbox{
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
