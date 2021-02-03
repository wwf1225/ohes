<template>
    <div class="vediobox">
        <!-- 采样列表 -->
        <div class="vedio_main">
            <div class="v_top">
                <el-breadcrumb separator-class="el-icon-arrow-right" >
                    <el-breadcrumb-item >调查任务</el-breadcrumb-item>
                    <el-breadcrumb-item >调查管理</el-breadcrumb-item>
                    <el-breadcrumb-item >调查详情</el-breadcrumb-item>
                    <el-breadcrumb-item >采样列表</el-breadcrumb-item>
                </el-breadcrumb>
                <button class="top_btn" @click="close">返回</button>
            </div>
            <!-- 添加按钮 -->
            <div class="btn-add">
                <el-button type="primary" size="small" @click="addVedio">添加采样</el-button>
            </div>
            <!-- 搜索框 -->
            <div class="from_box">
                <div class="from_title">采样列表</div>
                <div>
                    <el-input v-model="fromQuery.sampName" placeholder="请输入内容"></el-input>
                </div>
                <div class="from_btn">
                    <el-button type="primary" size="small" icon="el-icon-search" @click="getSampleList">搜索</el-button>
                </div>
            </div>
            <!-- 表格 -->
            <el-table ref="multipleTable" align="left" :data="tableData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%">
                <el-table-column prop="samplingNumber" label="序号" align="center"> </el-table-column>
                <el-table-column prop="name" label="样品名称"  align="center"> </el-table-column>
                <el-table-column prop="sampTime" label="采样时间"  align="center"> </el-table-column>
                <el-table-column  label="采样类别"  align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sampletype==1" >肺部深部吸物</span>
                        <span v-else-if="scope.row.sampletype==2">粪便</span>
                        <span v-else-if="scope.row.sampletype==3">肛拭</span>
                        <span v-else-if="scope.row.sampletype==4">咽拭子</span>
                        <span v-else-if="scope.row.sampletype==5">血样</span>
                        <span v-else >呕吐物</span>
                    </template>
                </el-table-column>
                <el-table-column label="结果"  align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.resultStatus==false" style="color:#666666"><i class="el-icon-error"></i></span>
                        <span v-else-if="scope.row.resultStatus==true" style="color:#0066FF" @click="showEnd(scope.row)"><i class="el-icon-success"></i></span>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="200"  align="center">
                    <template slot-scope="scope">
                        <el-button  type="text" size="small" @click="updateEnd(scope.row)" >编辑结果</el-button>
                        <el-button  type="text" size="small" @click="updateRow(scope.row)" >编辑</el-button>
                        <el-button  type="text" size="small" @click="delVedio(scope.row)" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 class="block"-->
            <!-- <div style="text-align: right; margin-top: 20px; padding-right: 10px;">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
                </el-pagination>
            </div> -->

             <!-- 添加采样 -->
            <el-dialog title="添加采样" :visible.sync="addVisible" :before-close="handleClose">
                <div class="row_div">
                    <div class="my_inp">编号</div>
                    <el-input placeholder="请输入编号" style="width:400px;" v-model="fromAdd.samplingNumber"></el-input>
                </div>
                <div class="row_div">
                    <div class="my_inp">名称</div>
                    <el-input placeholder="请输入名称" style="width:400px;" v-model="fromAdd.name"></el-input>
                </div>
                <div class="row_div">
                    <div class="my_inp">采样时间</div>
                    <el-date-picker
                        v-model="fromAdd.sampTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </div>
                <div class="row_div">
                    <div class="my_inp">样品类型：</div>
                    <el-radio-group v-model="fromAdd.sampletype">
                        <el-radio :label="1">肺部深部吸物</el-radio>
                        <el-radio :label="2">粪便</el-radio>
                        <el-radio :label="3">肛拭</el-radio>
                        <el-radio :label="4">咽拭子</el-radio>
                        <el-radio :label="5">血样</el-radio>
                        <el-radio :label="6">呕吐物</el-radio>
                    </el-radio-group>
                </div>
                <div class="btndiv">
                    <el-button type="info" size="medium" @click="closeAdd">取消</el-button>
                    <el-button type="primary"  size="medium" style="margin-left:50px" @click="add">保存</el-button>
                </div>
            </el-dialog>

             <!--编辑采样 -->
            <el-dialog title="添加采样" :visible.sync="updateVisible" :before-close="handleClose">
                <div class="row_div">
                    <div class="my_inp">编号</div>
                    <el-input placeholder="请输入编号" style="width:400px;" v-model="fromAdd.samplingNumber"></el-input>
                </div>
                <div class="row_div">
                    <div class="my_inp">名称</div>
                    <el-input placeholder="请输入名称" style="width:400px;" v-model="fromAdd.name"></el-input>
                </div>
                <div class="row_div">
                    <div class="my_inp">采样时间</div>
                    <el-date-picker
                        v-model="fromAdd.sampTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </div>
                <div class="row_div">
                    <div class="my_inp">样品类型：</div>
                    <el-radio-group v-model="fromAdd.sampletype">
                        <el-radio :label="1">肺部深部吸物</el-radio>
                        <el-radio :label="2">粪便</el-radio>
                        <el-radio :label="3">肛拭</el-radio>
                        <el-radio :label="4">咽拭子</el-radio>
                        <el-radio :label="5">血样</el-radio>
                        <el-radio :label="6">呕吐物</el-radio>
                    </el-radio-group>
                </div>
                <div class="btndiv">
                    <el-button type="info" size="medium" @click="closeAdd">取消</el-button>
                    <el-button type="primary"  size="medium" style="margin-left:50px" @click="update">保存</el-button>
                </div>
            </el-dialog>

            <!-- 结果编辑弹出框 -->
            <el-dialog title="结果编辑" :visible.sync="endEditVisible" :before-close="handleClose">
                <textarea style="width: 100%;height: 300px;"  placeholder="请输入内容"  v-model="formEnd.testResult" ></textarea>
                <div class="file_div">
                    <input class="inp_fu" type="text" v-model="fileName" readonly/>
                    <el-upload
                        class="upload-demo upload_div"
                        ref="upload"
                        :action="apiUrl"
                        :headers="myHeaders"
                        :show-file-list="false"
                        :on-success='okFile'
                        :on-change='changeFile'
                        accept=".mp4,.png,.jpg,.mov,.mp3,.doc,.xlsx"
                        :data="formEnd"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </div>
                <div class="btndiv">
                    <el-button type="info" size="medium" @click="endClose">取消</el-button>
                    <el-button type="primary"  size="medium" style="margin-left:50px" @click="saveEnd">保存</el-button>
                </div>
            </el-dialog>

              <!-- 查看结果编辑弹出框 -->
            <el-dialog title="查看结果编辑" :visible.sync="endShowVisible" :before-close="handleClose">
                <textarea style="width: 100%;height: 300px;"  placeholder="请输入内容"  v-model="endContent" ></textarea>
                <div class="file_div" v-for="(item,index) in flieList" :key="index">
                    <a :href=item.fileName target="_blank"> {{item.originalName}}</a>
                </div>
                <div class="btndiv">
                    <el-button type="info" size="medium" @click="endShowClose">取消</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import fancyBox from 'vue-fancybox';
var Cookies =require("js-cookie");
import moment from "moment"
var config = require('@/components/utils/Common_Config.js');
export default {
    data(){
        return{
            fromQuery:{
                sampName:'',
            },
            page:1,
            limit:10,
            totalCount:null,
            tableData:[],
            fromAdd:{
                id:null,
                samplingNumber:'',//采样编号
                name:'',//名称
                sampTime:new Date(),//采样时间
                sampletype:null,//样品类型
                eventId:null,//事件Id
                caseId:null,//个案Id
            },
            formEnd:{
                eventId:null,
                sampeId:null,
                caseId:null,
                testResult:'',
            },
           
            myHeaders:{ 'token': Cookies.get('token')},

            eventId:null,
            caseId:null,
            type:null,
            eventNumber:'',
            addVisible:false,
            updateVisible:false,
            endEditVisible:false,
            form:{},
            fileName:'',
            apiUrl:'',
            endShowVisible:false,
            flieList:[],
            endContent:""
        }
    },
    methods:{
        handleSizeChange(val) {
        //   console.log(`每页 ${val} 条`);
          this.limit=val;
          this.getSampleList();
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page=val;
            this.getSampleList();
        },
        addVedio(){
            this.addVisible=true
        },
        //编辑结果
        updateEnd(row){
            this.formEnd.sampeId=row.id;
            this.formEnd.eventId=this.$route.params.eventId;
            this.formEnd.caseId=this.$route.params.id;
            this.endEditVisible=true;
        },
         // 点击保存结果编辑
        saveEnd(){
            this.$refs.upload.submit();
        },
        // 关闭结果编辑
        endClose(){
            this.formEnd={
                eventId:null,
                sampeId:null,
                caseId:null,
                testResult:'',
            }
            this.fileName='';
            this.endEditVisible=false;
        },
        //文件改变
        changeFile(file){
            // console.log("文件改变");
            // console.log(file);
            this.fileName=file.name;
        },
        //文件上传成功后
        okFile(){
            this.formAdd={
                eventId:null,
                samplingId:null,
                testResult:'',
            }
            this.fileName='';
            this.getSampleList();
            this.$message.success('添加成功');
            this.endEditVisible=false;
        },
        //查看结果编辑
        showEnd(row){
            this.endShowVisible=true;
            axios.get(config.apiHost +'/caseSample/selectOne',{
                params : { //请求参数  
                    token:config.token,
                    caseSampleId:row.id,
                    eventId:this.fromAdd.eventId,
                    type:1,//1、个案 2、外环境 3、其他采样
                } 
            }).then((result)=> {
                if (result.data.status == 200) {
                    this.flieList= result.data.body.accessory;
                    this.endContent=result.data.body.testingResult;
                    console.log(this.flieList);
                }
            }, (error)=> {
                this.$message.error(error);
            });
        },
         // 关闭查看结果编辑
        endShowClose(){
            this.endShowVisible=false;
            this.flieList=[];
            this.endContent="";
        },
        // 编辑
        updateRow(row){
            this.fromAdd={
                id:row.id,
                samplingNumber:row.samplingNumber,//采样编号
                name:row.name,//名称
                sampTime:row.sampTime,//采样时间
                sampletype:row.sampletype,//样品类型
                eventId:row.eventId,//事件Id
                caseId:row.caseId,//个案Id
            }
            this.updateVisible=true;
            console.log(this.fromAdd);
        },
        //确认编辑
        update(){
            let mytime=this.fromAdd.sampTime;
            this.fromAdd.sampTime=moment(mytime).format('YYYY-MM-DD HH:mm:ss');
            axios({
                method:'post',
                // /api
                url:config.apiHost+'/caseSample/update',
                data:this.fromAdd,
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'token':config.token
                }
            }).then((res)=>{
                // console.log(res);
                if(res.data.status == 200){
                    this.$message(res.data.body.msg);
                    // this.$message.success('添加成功');
                    this.getSampleList();
                    this.updateVisible=false;
                    this.fromAdd={
                        id:null,
                        samplingNumber:'',//采样编号
                        name:'',//名称
                        sampTime:new Date(),//采样时间
                        sampletype:null,//样品类型
                        eventId:this.$route.params.eventId,//事件Id
                        caseId:this.$route.params.id,//个案Id
                    }
                }
                return res.data;
            }).catch((response)=>{  
                this.$message.error(response);
            })  
        },
        
         //点击遮盖层关闭弹框
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                this.fromAdd={
                    id:null,
                    samplingNumber:'',//采样编号
                    name:'',//名称
                    sampTime:new Date(),//采样时间
                    sampletype:null,//样品类型
                    eventId:this.$route.params.eventId,//事件Id
                    caseId:this.$route.params.id,//个案Id
                }
                this.fileName='',
                done();
            })
            .catch(_ => {});
        },
        //采样列表
        getSampleList(){
            axios.get(config.apiHost +'/caseSample/select', {  
              params : { //请求参数  
                //   page:this.page,
                //   limit:this.limit,
                  caseId:this.fromAdd.caseId,
                  eventId:this.fromAdd.eventId,
                  sampName:this.fromQuery.sampName,
                  type:this.type
              }  
            }).then((result)=>{  
                if (result.data.status == 200) {
                    this.tableData = result.data.body;
                    this.totalCount=result.data.body.totalCount;//总条数
                    console.log(this.tableData)
                }else{
                    this.$message.error(result.data.body.message);
                }
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })  
        },
        
        //删除
        delVedio(row){
            this.$confirm('确定要删除该采样吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                callback: (acction, instance) => {
                    if (acction === 'confirm') {
                        //点击确认
                        axios.get(config.apiHost +'/caseSample/delete',{
                            params : { //请求参数  
                                sampleId:row.id
                            } 
                        }).then((result)=>{
                            // console.log(result.data.status);
                            if (result.data.status == 200) {
                                //删除成功
                               this.getSampleList();
                                this.$message(result.data.body.msg);
                            }else{
                                //删除失败
                                this.$message(result.data.body.message);
                            }
                        },(error)=>{
                            this.$message.error(error);
                        });
                        
                    } else {
                        //点击取消
                        this.$message({
                            typ: 'info',
                            message: '已取消删除'
                        });
                    }
                },
                type: 'warning'
            });
        },
        
        closeAdd(){
            this.addVisible=false;
            this.updateVisible=false;
            this.fromAdd={
                id:null,
                samplingNumber:'',//采样编号
                name:'',//名称
                sampTime:new Date(),//采样时间
                sampletype:null,//样品类型
                eventId:this.$route.params.eventId,//事件Id
                caseId:this.$route.params.id,//个案Id
            }
        },
        add(){
            let mytime=this.fromAdd.sampTime;
            this.fromAdd.sampTime=moment(mytime).format('YYYY-MM-DD HH:mm:ss');
            axios({
                method:'post',
                // /api
                url:config.apiHost+'/caseSample/save',
                data:this.fromAdd,
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'token':config.token
                }
            }).then((res)=>{
                // console.log(res);
                if(res.data.status == 200){
                    // this.$message(res.data.body.msg);
                    this.$message.success('添加成功');
                    this.getSampleList();
                    this.addVisible=false;
                    this.fromAdd={
                        id:null,
                        samplingNumber:'',//采样编号
                        name:'',//名称
                        sampTime:new Date(),//采样时间
                        sampletype:null,//样品类型
                        eventId:this.$route.params.eventId,//事件Id
                        caseId:this.$route.params.id,//个案Id
                    }
                }
                return res.data;
            }).catch((response)=>{  
                this.$message.error(response);
            })  
        },
        //返回
        close(){
          this.$router.go(-1)
        }
    },
    created(){
        // console.log("@@@"+this.$route.params.eventId+"现况："+this.$route.params.ispage);
        this.fromAdd.eventId=this.$route.params.eventId;
        this.fromAdd.caseId=this.$route.params.id;
        this.type=this.$route.params.type;
        this.getSampleList();
        this.apiUrl=config.apiHost+'/caseSample/resultUpdate';
    }
}
</script>

<style lang="less" scoped>
    .vediobox{
        width:auto;
        // height: 100%;
        min-height: 100%;
        text-align: left;
        background-color: #E2E6EF;
        padding:10px 15px 45px;
        .vedio_main{
            height: 100%;
            min-height: 850px;
            width: 100%;
            background-color: #FFFFFF;
            .v_top{
                height: 45px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-left: 10px;
                background-color: #F6F7FB;
                .top_btn{
                    width: 60px;
                    height: 45px;
                    border: 0;
                    background: #B5BAC7;
                }
            }
            .btn-add{
                margin: 20px;
            }
            .from_box{
                height: 30px;
                margin: 20px 20px 10px;
                display: flex;
                align-items: center;
                .from_title{
                    margin-right: 30px;
                    color: #199EFE;
                }
                .from_btn{
                    margin-left: 20px;
                }
            }
            .row_div{
                display: flex;
                align-items: center;
                margin-bottom: 20px;

            }
            .my_inp{
                width: 80px;
                text-align: left;
            }
            .btndiv{
                display: flex;
                justify-content: center;
                margin-top: 50px;
            }
            
           
        }
        
    }
   
</style>



