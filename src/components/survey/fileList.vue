<template>
    <div class="vediobox">
        <!-- 视频列表 -->
        <div class="vedio_main">
            <div class="v_top">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item >调查任务</el-breadcrumb-item>
                    <el-breadcrumb-item >调查管理</el-breadcrumb-item>
                    <el-breadcrumb-item >事件报告</el-breadcrumb-item>
                    <el-breadcrumb-item >文件上传</el-breadcrumb-item>
                </el-breadcrumb>
                <button class="top_btn" @click="close">返回</button>
            </div>
            <!-- 添加按钮 -->
            <div class="btn-add">
                <el-button type="primary" size="small" @click="addVedio">上传文件资料</el-button>
            </div>
            <!-- 搜索框 -->
            <div class="from_box">
                <div class="from_title">文件列表</div>
                <div>
                    <el-input v-model="fromQuery.mediaName" placeholder="请输入内容"></el-input>
                </div>
                <div class="from_btn">
                    <el-button type="primary" size="small" icon="el-icon-search" @click="getFileList">搜索</el-button>
                </div>
            </div>
            <!-- 表格 -->
            <el-table ref="multipleTable" align="left" :data="tableData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%">
                <el-table-column prop="id" label="序号" align="center"> </el-table-column>
                <el-table-column prop="mediaName" label="文件名称"  align="center"> </el-table-column>
                <el-table-column prop="updateAt" label="提交时间"  align="center"> </el-table-column>
                <el-table-column  label="文件类型"  align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==1" style="color:#8CDCFE">照片</span>
                        <span v-else-if="scope.row.type==2" style="color:#E9B4B4">语音</span>
                        <span v-else-if="scope.row.type==3" style="color:#E9B4B4">文档</span>
                        <span v-else style="color:#B2D9C4">视频</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reportUserName" label="上传者"  align="center"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="180"  align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.type==1" type="text" size="small" @click="showImg(scope.row)" >预览</el-button>
                        <el-button v-else-if="scope.row.type==2" type="text" size="small" @click="showAudio(scope.row)" >{{istext}}</el-button>
                        <el-button v-else type="text" size="small" @click="showVedio(scope.row)" >播放视频</el-button>

                        <el-button  type="text" size="small" @click.native.prevent="delList(scope.row)" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 class="block"-->
            <div style="text-align: right; margin-top: 20px; padding-right: 10px;">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
                </el-pagination>
            </div>
            
            <!-- 上传影像弹出框 -->
             <el-dialog class="vedio"  :show-close="false"  :before-close="handleClose" :visible.sync="dialogShowVisible">
                <div class="add_box">
                    <div class="title">
                        上传文件资料
                    </div>
                    <div class="detail">
                        <div class="m_top">事件编号:</div>
                        <input type="text" v-model="eventNumber"  class="input_div" readonly/>
                        <div class="m_top">文件名称:</div>
                        <input type="text" v-model="fromAdd.mediaName" class="input_div"/>
                        <div class="m_top">文件类型:</div>
                        <el-select v-model="fromAdd.type" placeholder="请选择" @change="choosetype" style="width:70%">
                            <el-option
                            v-for="item in fileType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <div class="m_top" >
                            <!-- <el-button type="primary" size="small">选择文件</el-button> -->
                            <!-- /api -->
                           <el-upload
                                class="upload-demo upload_div"
                                ref="upload"
                                :action="hostUrl"
                                :headers="myHeaders"
                                :show-file-list="false"
                                :before-upload='beforeUpload'
                                :on-success='okFile'
                                accept=".mp4,.png,.jpg,.mov,.mp3"
                                :data="fromAdd"
                                :auto-upload="false">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            </el-upload>

                        </div>
                        <div class="m_top">
                            <el-button type="primary" size="mini" @click="submitUpload">上传</el-button>
                            <el-button size="mini" @click="close_add">关闭</el-button>
                        </div>
                    </div>
                    <div class="common">
                        <span class="kuan">
                            <strong>说明</strong>
                        </span>
                        <span class="kuan">
                            最大支持上传100M图片文件或者视频文件
                        </span>
                        <span class="kuan">
                            允许上传的视频格式为：gif、jpg、jpeg、bmp、png、mp4、3gp
                        </span>
                        <span class="kuan">
                            不符合格式的视频将会被丢弃，请确保视频格式的正确性，避免上传失败
                        </span>
                    </div>
                </div>
             </el-dialog>

            <!-- 视频播放弹出框 -->
             <el-dialog title="视频播放" :before-close="handleClose" :visible.sync="dialogPlayVisible">
                  <video :src="vedioUrl" controls autoplay muted loop width="100%" height="300"></video>
             </el-dialog>

             <!-- 音频播放 -->
             <audio id="myaudio" controls="controls"  style="display:none;">
             </audio>

            <!-- 预览图片弹出框 -->
             <template>
                 <div class="img_bg"  v-show="imgShow" @click="closeImg">
                     <img class="my_img" :src="imgurl" alt="">
                 </div>
             </template>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import fancyBox from 'vue-fancybox';
var Cookies =require("js-cookie");
var config = require('@/components/utils/Common_Config.js');
export default {
    data(){
        return{
            fromQuery:{
                mediaName:'',
            },
            hostUrl:'',
            page:1,
            limit:10,
            totalCount:null,
            tableData:[],
            dialogShowVisible:false,
            fileType:[
                {
                    id:1,
                    name:'照片'
                },
                {
                    id:2,
                    name:'语音'
                },
                {
                    id:3,
                    name:'视频'
                },{
                    id:4,
                    name:"文档"
                }
            ],
            fType:null,
            fromAdd:{
                eventId:null,
                mediaName:'',
                type:null,
                // audioType:null,
                //  reportId:this.$route.params.reportId,
            },
            myHeaders:{ 'token': Cookies.get('token')},
            dialogPlayVisible:false,
            vedioUrl:'',
            isPlaying:false,
            istext:"播放语音",
            imgShow:false,
            imgurl:"",

            eventId:null,
            ispage:'',
            id:null,
            eventNumber:'',

            form:{},
        }
    },
    methods:{
        handleSizeChange(val) {
        //   console.log(`每页 ${val} 条`);
          this.limit=val;
          this.getFileList();
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page=val;
            this.getFileList();
        },
        //上传视频
        addVedio(){
            this.dialogShowVisible=true;
        },
         // 选择文件类型
        choosetype(id){
            // console.log(id);
            this.fType=id;
        },
        //文件上传前
        beforeUpload(file){
            // console.log("文件上传前");
            // console.log(file);
        },
        //文件上传成功后
        okFile(){
            this.fromAdd={
                eventId:null,
                mediaName:'',
                type:null
            }
            this.getFileList();
            this.$message.success('添加成功');
            this.dialogShowVisible=false;
        },
        submitUpload() {
            this.$refs.upload.submit();
         },
        close_add(){
             this.dialogShowVisible=false;
        },
         //点击遮盖层关闭弹框
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        //文件列表
        getFileList(){
        //   console.log("进入请求。。。");
        //   console.log(this.ispage);
          this.form ={
            eventId:this.eventId,
            page:this.page,
            limit:this.limit,
            mediaName:this.fromQuery.mediaName?this.fromQuery.mediaName:'',
            //  reportId:this.$route.params.reportId,
            token:config.token,
          }
          this.fromAdd.eventId=this.eventId;
          console.log(this.form.reportId)
          if(this.ispage=='现况'){
                this.form.sceneId=this.id;
                this.fromAdd.sceneId=this.id;
                // this.fromAdd.audioType=2;
            }else if(this.ispage=='个案'||this.ispage=='对照'){
                this.form.caseId=this.id;
                this.fromAdd.caseId=this.id;
                // this.fromAdd.audioType=1;
            }else if(this.ispage=='医生'){
                this.form.doctorId=this.id;
                this.fromAdd.doctorId=this.id;
                // this.fromAdd.audioType=3;
            }else if(this.ispage=='其他'||this.ispage=='外环境'){
                this.form.samlingId=this.id;
                this.fromAdd.samlingId=this.id
            }else if(this.ispage=='报告'){
                this.form.reportId=this.reportId;
                this.fromAdd.reportId=this.reportId;
           }

            // this.form.audioType=this.fromAdd.audioType;
        //   console.log(this.form);
        // 
          axios.get(config.apiHost + '/survey/imagelist', {  
              params:this.form
          }).then((result)=>{  
            //   console.log("请求返回。。。");
              if (result.data.status == 200) {
                    this.tableData = result.data.body.list;
                    this.totalCount=result.data.body.totalCount;//总条数
                    console.log(result.data.body)
                  }
          }).catch(function(response){  
              //   this.$message.error(error);
            //   console.log(response);
          })  
        },
        //预览图片
        showImg(row){
        // this.imgurl="../src/assets/logo.png"
           this.imgurl=row.fileName+"?"+"token"+"="+Cookies.get('token');
        //    console.log(this.imgurl);
           this.imgShow=true;  
        },
        //关闭预览图片弹出框
        closeImg(){
            this.imgShow=false;
        },
        //播放音频
        showAudio(row){
            var a=document.getElementById("myaudio");
            //  a.src = "../src/assets/tong.mp3";
            a.src=row.fileName+"?"+"token"+"="+Cookies.get('token');
            // console.log(a.paused);
            if(this.isPlaying==false){
                // console.log("播放..");
                a.play();
               this.isPlaying=true;
               this.istext="停止播放"
            }else{
                //  console.log("暂停..");
                a.pause();
                this.isPlaying=false;
                 this.istext="播放语音"
            }
          
        },
        //预览视频
        showVedio(row){
            this.vedioUrl=row.fileName+"?"+"token"+"="+Cookies.get('token');
            this.dialogPlayVisible=true;
        },
        //删除
        delList(row){
            this.$confirm('确定要删除该资料吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                callback: (acction, instance) => {
                    if (acction === 'confirm') {
                        //点击确认
                        //  
                        axios.get(config.apiHost +'/survey/imagedelete',{
                            params : { //请求参数  
                                token:config.token,
                                eventId:row.eventId,
                                id:row.id
                            } 
                        }).then((result)=>{
                            // console.log(result.data.status);
                            if (result.data.status == 200) {
                                //删除成功
                               this.getFileList();
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
       
        //返回
        close(){
          this.$router.go(-1)
        }
    },
    created(){
        // console.log("@@@"+this.$route.params.eventId+"现况："+this.$route.params.ispage);
        this.eventId=this.$route.params.eventId;
        this.ispage=this.$route.params.ispage;
        this.id=this.$route.params.id;
        this.reportId=this.$route.params.reportId;
        this.eventNumber=this.$route.params.number;
        this.getFileList();
        this.hostUrl=config.apiHost+'/survey/upload';
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
            .img_bg{
                width: 100%;
                height: 100%;
                position: fixed;
                left: 0;
                top: 0;
                background:rgba(7, 17, 27, 0.6);
                z-index: 1000;
                .my_img{
                    width: 300px;
                    height: 300px;
                    background: #fff;
                    position: fixed;
                    bottom: 40%;
                    left: 40%;
                }
            }
            .vedio{
                .add_box{
                    width: auto;
                    height: 500px;
                    padding: 20px 10px;
                    border: 3px solid #E3E3E3;
                    background-color: #FFFFFF;
                    position: relative;
                    .title{
                        width: auto;
                        position: absolute;
                        top: 8px;
                        left: 20px;
                        font-size: 18px;
                        background-color: #FFFFFF;
                    }
                    .detail{
                        width: auto;
                        height: 350px;
                        padding: 10px;
                        border: 1px solid #A0A0A0;
                        display: flex;
                        flex-direction: column;
                        .input_div{
                            width: 70%;
                            height: 35px;
                            border-radius: 5px;
                            padding-left: 10px;
                            border: 1px solid  #C8CCCF;
                        }
                        .m_top{
                            margin-top: 10px;
                        }
                        .upload_div{
                            display: flex;
                            flex-direction: row;
                            height: 40px;
                        }
                    }
                    .common{
                        position: absolute;
                        bottom: 10px;
                        .kuan{
                            display: block;
                        }
                    }
                       
                }
            }
           
        }
        
    }
   
</style>



