<template>
  <div class="mybox">
   
    <div class="exam">
        <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 40px;line-height: 40px;">
        <el-breadcrumb-item :to="{ path: '/' }">事件管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">当前事件</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="from-box">
        <div class="event-title">事件接报</div>
        <form :model="form" class="event-form">
                <div class="info">报告人信息</div>
                <div class="input-div">
                    <label class="label-div">疑似事件</label>
                    <input type="text" class="inp" v-model="form.name" readonly>
                </div>
                <div class="input-div">
                    <label class="label-div">报告人</label>
                    <input type="text" class="inp inp-per" v-model="form.reportUser" readonly>

                    <label class="label-div ">报告电话</label>
                    <input type="text"  class="inp inp-per" v-model="form.reportPhone" readonly>
                </div>
                <div class="input-div ">
                    <label class="label-div">报告来源</label>
                    <el-select v-model="form.originId" placeholder="请选择" readonly>
                        <el-option
                        v-for="item in originList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>

                    <label class="label-div ">接报时间</label>
                    <!-- <input type="text"  class="inp inp-per"> -->
                    <!-- v-model="form.reportedTime" -->
                    <el-date-picker
                        v-model="form.reportedTime"
                        @change="getRTime" 
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </div>


                <div class="info">事件信息</div>
                <div class="input-div">
                    <label class="label-div">事件开始时间</label>
                    <!-- v-model="form.startTime" -->
                    <el-date-picker
                    v-model="form.startTime"
                        @change="getSTime" 
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>

                    <label class="label-div ">地点</label>
                    <input type="text"  class="inp inp-per" v-model="form.address" readonly>
                </div>
                <div class="input-div ">
                    <label class="label-div">疑似病例数</label>
                    <input type="text" class="inp inp-per" v-model="form.caseNumber" readonly>

                    <label class="label-div ">事件场所</label>
                    <el-select v-model="form.placeId" placeholder="请选择" readonly>
                        <el-option
                        v-for="item in placeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="input-div ">
                    <label class="label-div">疑似事件类型</label>
                    <el-select v-model="form.genre" placeholder="请选择" readonly>
                        <el-option
                        v-for="item in eventType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <div class="text-input">
                    <label class="label-div">事件概要</label>
                    <textarea class="area" v-model="form.comment" readonly></textarea>
                </div>

                <div class="btn-div">
                    <el-button type="primary" @click="closeShow">关闭</el-button>
                </div>
        </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js');
    export default{
         data(){
            return {
                form:{
                    name:'',//事件名称
                    reportUser:'',//报告人
                    reportPhone:'',//报告人电话
                    originId:'',//报告来源（下拉）
                    reportedTime:null,//接报时间
                    startTime:null,//开始时间
                    address:'',//地点
                    caseNumber:'',//疑似病例数
                    placeId:'',//事件场所（下拉）
                    comment:'',//事件概要
                    status:"",//保存
                    longitude: 111,//经度
                    latitude: 12222,//纬度
                    genre: "",
                },
                originList:[],
                placeList:[],
                //   0-传染病   1-食源性疾病
                eventType:[
                    {
                        id:0,
                        name:'传染病'
                    },
                    {
                        id:1,
                        name:'食源性疾病'
                    },
                    {
                       id:2,
                       name:'其他'
                    }
                ],
            }
        },
        computed:{
            ...mapGetters([
                'event'
            ])
        },
        methods:{
             getOrigin(){
                //   
                axios.get(config.apiHost +'/event-origin',{
                        params : { //请求参数  
                            token:config.token,
                        } 
                    }).then((result)=> {
                        // console.log(result.data)
                        if (result.data.status == 200) {
                            this.originList = result.data.body;
                        }
                    }, (error)=> {
                        this.$message.error(error);
                    });
            },
            getPlace(){
                //  
                axios.get(config.apiHost +'/event-places',{
                        params : { //请求参数  
                            token:config.token,
                        } 
                    }).then((result)=> {
                        if (result.data.status == 200) {
                            this.placeList = result.data.body;
                        }
                    }, (error)=> {
                        this.$message.error(error);
                    });
            },
            getSTime(val){
                // console.log("时间。。")
                //  console.log(val);
                // console.log(this.formatDateTime(val));
                // this.form.startTime=this.formatDateTime(val);
                var startTime=val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate() + ' ' + val.getHours() + ':' + val.getMinutes() + ':' + val.getSeconds(); 
                // console.log(startTime);
                this.form.startTime=startTime;
            },
             getRTime(val){
                // console.log("时间。。")
                // console.log(val);
                // console.log(this.formatDateTime(val));
                // this.form.reportedTime=this.formatDateTime(val);
                 var reportedTime=val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate() + ' ' + val.getHours() + ':' + val.getMinutes() + ':' + val.getSeconds(); 
                // console.log(reportedTime);
                this.form.reportedTime=reportedTime;
                
            },
            // 取消，返回列表
            closeShow(){
                //  this.$router.push({path: '/home/event-now'});
                this.$router.go(-1)
            }
        },
        mounted(){
            // console.log(this.event);
            this.form=this.event;
        },
        created(){
            this.getOrigin();
            this.getPlace();
        }
    }
</script>

<style scoped>
    .mybox{
        width:auto;
        height: 100%;
        text-align: left;
        background-color: #E2E6EF;
        /* background-color: rgb(102, 212, 245); */
        padding:10px;
    }

   .exam{
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
    .from-box{
        height: 100%;
        background-color: #FFFFFF;
        margin: 0 auto;
    }
    .event-title{
        height: 30px;
        line-height: 30px;
        width: 100%;
        padding-left: 10px;
        background-color: #DEF0FE;
    }

    .event-form{
        width: 70%;
         margin: 0 auto;
         margin-bottom: 30px;
    }
    .info{
        height: 30px;
        line-height: 30px;
        text-align: left;
        color: #6eb594;
        width: 100%;
        margin-top: 15px;
        border-bottom: 2px solid #6eb594;
    }
    .input-div{
        margin-top: 20px;
        margin-left: 20px;
        text-align: left;
        display: flex;
        align-items: center;
    }
    .text-input{
        margin-top: 20px;
        margin-left: 20px;
        text-align: left;
        display: flex;
        justify-content: flex-start;
    }
    .area{
         width:77%;
         height:100px;
         border: 0;
         background: #F6F7FB;
    }
    .label-div{
        display: block;
        width: 100px;
        text-align: right;
        margin-right: 15px;
    }
    .inp{
        /* width: 50%; */
        height: 30px;
        border: 0;
        border-radius: 4px;
        background: #F6F7FB;
    }
    .inp-per{
         width: 30%;
    }
    .margin-left-three{
        margin-left: 30px;
    }
    .btn-div{
        width: 100%;
        height: 100%;
        text-align: center;
        margin-top: 30px;

    }

</style>

