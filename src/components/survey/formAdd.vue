<template>
    <div class="countbox">
        <!-- 添加表单 -->
        <div class="top_main">
             <div class="c_top">
                <el-breadcrumb separator-class="el-icon-arrow-right" >
                    <el-breadcrumb-item >调查任务</el-breadcrumb-item>
                    <el-breadcrumb-item >调查详情</el-breadcrumb-item>
                    <el-breadcrumb-item >引用模板</el-breadcrumb-item>
                </el-breadcrumb>
                <button class="top_btn" @click="close">返回</button>
            </div>

            <div class="c_tab">
                <div class="tab" @click="toggleTab('mould')" :class='{"current" : currentTab == "mould" }'>引用模板库</div>
                <div class="tab" @click="toggleTab('blank')" :class='{"current" : currentTab == "blank" }'>创建空白表单</div>
            </div>
        </div>
       
        <div class="count_main">
           <mould :is="currentTab" keep-alive></mould>
        </div>
            
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import mould from '../survey/mouldForm'
import blank from '../survey/blankForm'
    export default{
        data(){
            return{
                 fileType:[
                    {
                        id:1,
                        name:'个案'
                    },
                    {
                        id:2,
                        name:'对照'
                    },
                ],
                currentTab: 'mould', // currentTab 用于标识当前触发的子组件
                type:null,
               
            }
        },
        computed:{
            ...mapGetters(['location'])
        },
        components: { // 声明子组件
            mould,
            blank,
        },
        methods:{
            close(){
                this.$router.push({path: this.location});//跳转到列表界面
            },
            toggleTab: function(tab) {
                this.currentTab = tab; // tab 为当前触发标签页的组件名
            },
          
        },
        created(){
           
        }
    }
</script>

<style lang="less" scoped>
    .countbox{
        width:auto;
        // height: 100%;
        min-height: 100%;
        text-align: left;
        background-color: #E2E6EF;
        padding:10px 15px 45px;
        box-sizing: border-box;
        overflow: hidden;
        .top_main{
            background-color: #FFFFFF;
            .c_top{
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
            .c_tab{
                margin-top: 5px;
                height: 50px;
                display: flex;
                align-items: center;
                background-color: #ECF0FC;
                .tab{
                    width: 150px;
                    height: 100%;
                    line-height: 50px;
                    background-color: #F1F4FD;
                    text-align: center;
                    color: #000000;
                    &.current{
                      
                        background-color: #FFFFFF;
                        border-top: 1px solid #8EB2FE;
                    }
                }
            
            }
        }
        .count_main{
            height:calc(~"100% - 100px");
            width: 100%;
            margin-top: 8px;
            // padding: 10px;
            // background-color: #FFFFFF;
            box-sizing: border-box;
           
        }
    }
</style>

