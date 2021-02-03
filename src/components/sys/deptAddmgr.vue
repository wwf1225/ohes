<template>
    <div class="main">
        <div class="add_content">
            <div class="postDiv">
                <label for="form.name" class="lab">部门：</label>
                <div class="inp">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </div>
            </div>
            <div class="postDiv">
                <label for="form.areaId" class="lab">部门所在地：</label>
                <div class="inp">
                    <el-select style="width:100%" v-model="form.areaId" placeholder="请选择">
                        <el-option
                        v-for="item in areaData"
                        :key="item.id"
                        :label="item.areaName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!-- <div class="postDiv">
                <label for="form.parentId" class="lab">上级部门：</label>
                <div class="inp">
                    <el-select style="width:100%" v-model="form.parentId" placeholder="请选择">
                        <el-option
                        v-for="item in deptData"
                        :key="item.depId"
                        :label="item.name"
                        :value="item.depId">
                        </el-option>
                    </el-select>
                </div>
            </div> -->
            <div style="margin-top: 50px;">
                <el-button type="primary" @click="confirm">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js');
export default {
    data(){
        return{
            form:{
                depId:'',
                name:'',//部门名称
                areaId:'',//部门所在地
                ids:[],//领导
                principal:'',//负责人id
                parentId:null,//上级部门
            },
            areaData:[],//部门所在地列表
            nodeData:{},
            
        }
    },
    methods:{
        //得到部门所在地
        getArea(){
            axios.get(config.apiHost +'/basedata/area/selectAll', {  
                params : { //请求参数  
                    token:config.token,
                }  
            }).then((result)=>{  
                if (result.status == 200) {
                        this.areaData = result.data.body;
                    }
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })  
        },
        // 保存添加部门
        confirm(){
            if(this.showValidate()){
                axios({
                    method:'post',
                    // /api
                    url:config.apiHost +'/sys/dept/save',
                    data:this.form,
                        headers:{
                            'Content-Type': 'application/json;charset=UTF-8',
                            'token':config.token
                        }
                }).then((res)=>{
                    //  console.log(res);
                    if(res.data.status=="200"){
                        //  初始化表单对象
                        this.form={
                            depId:'',
                            name:'',//部门名称
                            ids:[],//领导
                            principal:'',//负责人id
                            parentId:null,//上级部门
                        };
                        this.$message(res.data.body.msg);
                        this.$store.dispatch('refNum',7);//刷新父级组件
                        this.$router.push({name:'sys-partmentmgr'});
                    }else{
                        this.$message({type: 'error',message: res.data.body.message});
                    }
                    return res.data;
                }).catch(function(response){  
                        //   this.$message.error(error);
                        // console.log(response);
                })  
            }
        },
        // 验证
        showValidate(){
            var val = this
            const { name, areaId, parentId} = this.form
            console.log(this.form);
            if (name.trim() == '' || areaId == ''|| parentId == null) {
            
                this.$message({type: 'error',message: '信息不能为空！'});
            
                return
            } else {
            
                return true;
            }
        },
    },
    created(){
         this.form.parentId=this.$route.params.parentId;
         this.nodeData=this.$route.params.pdata;
         console.log(this.nodeData);
         this.getArea();
    }
}
</script>

<style scoped>
    .main{
        height: 100%;
        width: 100%;
        min-height: 750px;
    }
     .add_content{
       
        display:flex;
        flex-direction: column;
        padding-top: 10%;
      
    }
    .postDiv{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
    }
    .lab{
        width: 100px;
        text-align: right;
        margin-right: 10px;
    }
    .inp{
        width: 300px;
        text-align: left;
    }
</style>


