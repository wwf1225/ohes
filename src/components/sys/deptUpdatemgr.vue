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
            <div class="postDiv">
                <label for="form.ids " class="lab">领导：</label>
                <div class="inp">
                    <el-select v-model="form.ids" multiple placeholder="请选择">
                        <el-option
                        v-for="item in userData"
                        :key="item.id"
                        :label="item.account"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="postDiv">
                <label for="form.principal" class="lab">负责人：</label>
                <div class="inp">
                    <el-select v-model="form.principal" placeholder="请选择">
                        <el-option
                        v-for="item in userData"
                        :key="item.id"
                        :label="item.account"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="postDiv">
                <label for="form.name" class="lab">联系电话：</label>
                <div class="inp">
                    <el-input v-model="form.mobile" auto-complete="off" readonly></el-input>
                </div>
            </div>
            
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
                mobile:''
            },
            userData:[],
            areaData:[],
        }
    },
    computed:{
            ...mapGetters([
                'deptId',
            ])
        },
    methods:{
         //   用户列表
        getUserList(){
            this.userData=[];
            axios.get(config.apiHost +'/sys/user/listUser', {  
                params : { //请求参数 
                    depId:this.deptId, 
                    token:config.token,
                }  
            }).then((result)=>{  
                if (result.data.status == 200) {
                        this.userData = result.data.body;
                    }
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })  

        },
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
        //得到部门详情
        getDetail(){
            axios.get(config.apiHost +'/sys/dept/depDetails', {  
                params : { //请求参数 
                    deptId:this.deptId, 
                    token:config.token,
                }  
            }).then((result)=>{  
                if (result.data.status == 200) {
                        const cc = result.data.body;
                        const uList=result.data.body.userList;
                        this.form={
                            depId:cc.depId,
                            name:cc.name,//部门名称
                            areaId:cc.areaId,//部门所在地
                            ids:[],//领导
                            principal:cc.principal,//负责人
                            parentId:cc.parentId,//上级部门
                            mobile:cc.mobile,
                        }
                        if(uList.length>0){
                           for (let i = 0; i < uList.length; i++) {
                               const element = uList[i];
                               this.form.ids.push(element.id);
                           }
                        }
                    }
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            }) 
        },
        confirm(){
            axios({
                method:'post',
                // /api
                url:config.apiHost +'/sys/dept/update',
                data:this.form,
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'token':config.token
                    }
                }).then((res)=>{
                    //  console.log(res);
                    if(res.data.status=="200"){
                        // this.$store.dispatch('refNode',1);//刷新父级组件
                        this.$store.dispatch('refNum',5);//刷新父级组件
                        this.$router.push({name:'sys-partmentmgr'});
                        
                        this.$message(res.data.body.msg);
                      
                       
                    }
                    return res.data;
                }).catch(function(response){  
                    //   this.$message.error(error);
                    // console.log(response);
                })  
        }
    },
    watch:{
        deptId(){
            this.getUserList();
            this.getDetail();
          
        }
    },
    mounted(){
       
    },
    created(){
        this.getArea();
        this.getUserList();
        this.getDetail();
        
    }
}
</script>

<style scoped>
    .postDiv{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
    }
    .add_content{
       
        /* display:flex;
        flex-direction: column; */
        padding-top: 10%;
      
    }
    .lab{
        display: inline-block;
        width: 100px;
    }
    .inp{
        width: 300px;
    }
</style>

