<template>
    <div class="partmentmgr-container">
        <!-- <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item >系统管理</el-breadcrumb-item>
                <el-breadcrumb-item >部门管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->

        <!-- <el-tabs type="border-card" v-model="activeName"  class="tab_main" @tab-click="handleClick">
            <el-tab-pane label="部门管理" name="first">
                <component :is="viewPage"></component>    
            </el-tab-pane>
            <el-tab-pane label="岗位管理" name="second">
                <component :is="viewPage"></component>    
            </el-tab-pane>
        </el-tabs> -->
        <div class="tab_main">
            <!-- 左侧 -->
            <div class="left_main">
                <div class="top_box">
                    <i class="el-icon-circle-plus" style=" font-size: 30px; margin-right: 15px;" @click="addDept"></i>
                    <span>添加顶级部门</span>
                </div>
                <div class="content">
                    <el-tree
                    :data="data5"
                    :props="defaultProps"
                    :getCurrentNode="getNode"
                    node-key="depId"
                    default-expand-all
                    :expand-on-click-node='false'>
                    <span class="custom-tree-node" slot-scope="{ node, data }"  @click="() => getNode(data)">
                        <span>{{ node.label }}</span>
                        <span>
                            <el-button type="text" size="mini" @click.stop="() => append(data)">
                                <i class="el-icon-plus"></i>
                            </el-button>
                            <!-- <el-button type="text" size="mini" @click.stop="() => remove(node, data)">
                                <i class="el-icon-delete"></i>
                            </el-button> -->
                        </span>
                    </span>
                    </el-tree>
                </div>
            </div>
            <!-- 右侧 -->
            <div class="right_main">
                <div class="top_box">部门信息</div>
                <div class="content ">
                     <router-view></router-view>
                </div>
            </div>
        </div>

    </div> 
</template>
<style scoped>
    .partmentmgr-container{
        width:auto;
        min-height: 100%;
        /* text-align: left; */
        background-color: #E2E6EF;
        padding:10px 10px 45px;
        box-sizing: border-box;
       
    }
    .top-main{
        height: 45px;
        line-height: 45px;
        text-align: left;
        padding-left: 10px;
        margin-bottom: 5px;
        background-color: #F6F7FB;
    }
    .tab_main{
        height: calc(100% - 45px);
        min-height: 800px;
        /* background-color: #FFFFFF; */
        display: flex;
    
    }
    .left_main{
        flex: 1;
        height: 100%;
    }
    .right_main{
        flex: 2;
        height: 100%;
        margin-left: 10px;
    }
    .top_box{
        width: 100%;
        height: 50px;
        background-color: #F0F3FA;
        display: flex;
        align-items: center;
        padding: 10px;
        /* justify-content: center; */
    }
    .content{
        height:calc(100% - 50px);
        width: 100%;
         min-height: 750px;
        background-color: #FFFFFF;
    }
   
</style>
<script>
import { mapGetters } from 'vuex';
import deptmgr from '@/components/sys/deptmgr.vue'
import postmgr from '@/components/sys/postmgr.vue'
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js');
export default {
 data(){
     return{
         deptId:null,
         treeData:[],//列表数据
         tableSelection: [],//数据表选择数据集合
         tableSelectObj: {},//数据表单条选择数据对象
         activeName: 'first',
         viewPage:'deptmgr',
       
        data5:[],
        defaultProps: {
            label: 'name',
            children: 'childrenList',
        },

     }
 },
 components:{
     deptmgr:deptmgr,
     postmgr:postmgr
 },
 computed:{
        ...mapGetters([
            'isNode',
            'isnums'
        ])
    },
 methods:{
    // handleClick(tab, event) {
    //     // console.log(tab, event);
    //     if(tab.label=="部门管理"){
    //         // console.log("1");
    //         this.viewPage='deptmgr';
    //     }else{
    //         // console.log("2");
    //         this.viewPage='postmgr'
    //     }
    // },
     //得到部门
    getArea(){
        axios.get(config.apiHost +'/sys/dept/AsynDepList', {  
            params : { //请求参数  
                token:config.token,
                deptId:this.deptId,
            }  
        }).then((result)=>{  
            if (result.status == 200) {
                    this.treeData = result.data;
                    // this.data5=JSON.parse(JSON.stringify(this.treeData));
                    this.data5=this.treeData;
                    console.log(this.data5);
                }
        }).catch(function(response){  
            //   this.$message.error(error);
            // console.log(response);
        })  
    },
    // 添加子节点
    append(data) {
        this.parentId=data.depId;
          // addType:1 添加顶级  2添加子节点
        this.$router.push({name: 'deptAddmgr',params:{parentId:this.parentId,pdata:data,addType:2}});

        // const newChild = { id: 1, name: 'testtest', childrenList: [] };
        // if (!data.childrenList) {
        //     this.$set(data, 'childrenList', []);
        // }
        // data.childrenList.push(newChild);
    },

    // 删除节点
    remove(node, data) {
        console.log(data.depId);
         this.$confirm('确定要删除该部门吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            callback: (acction, instance) => {
                if (acction === 'confirm') {
                    //  
                    axios.get(config.apiHost +'/sys/dept/delete',{
                        params : { //请求参数  
                            token:config.token,
                            deptId:data.depId
                        } 
                    }).then((result)=>{
                        //  console.log(result);
                        if (result.data.status == 200) {
                            const parent = node.parent;
                            const childrenList = parent.data.childrenList || parent.data;
                            const index = childrenList.findIndex(d => d.id === data.id);
                            childrenList.splice(index, 1);

                            this.$router.push({name:'sys-partmentmgr'});
                            this.$message(result.data.body.msg);
                        }
                    }, function(error) {
                        this.$message.error(error);
                    });
                } else {
                    this.$message({
                        typ: 'info',
                        message: '已取消删除'
                    });
                }
            },
            type: 'warning'
        });
      
    },
    // 得到点击节点
    getNode(node){
        console.log(node);
        this.deptId=node.depId;
        this.$router.push({name:'deptUpdatemgr',params:{deptId:this.deptId}});
        this.$store.dispatch('dept',this.deptId);//刷新父级组件
        if(node.isParent){
            axios.get(config.apiHost +'/sys/dept/AsynDepList', {  
                params : { //请求参数  
                    token:config.token,
                    deptId:this.deptId,
                }  
            }).then((result)=>{  
                if (result.status == 200) {
                    this.treeData = result.data;
                    if (!node.childrenList) {
                        this.$set(node, 'childrenList', []);
                    }else{
                        node.childrenList=[];
                    }
                    this.treeData.forEach(item => {
                       
                        node.childrenList.push(item);
                    });
                }
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })  
        }
    },

    // 添加顶级部门
    addDept(){
        // addType:1 添加顶级  2添加子节点
        this.$router.push({name: 'deptAddmgr',params:{parentId:0,addType:1}});
    },

 },
 watch:{
    isnums(){
        this.deptId=null;
        this.getArea();
        this.$store.dispatch('refNum',6);//刷新父级组件
    }
    //  isNode(){
    //      console.log("刷新node节点");
    //      this.getArea();
    //     this.$store.dispatch('refNode',2);//刷新父级组件
    //  }
 },
 mounted(){
     this.getArea();
 },
 created(){
     this.getArea();
 } 
}
</script>
