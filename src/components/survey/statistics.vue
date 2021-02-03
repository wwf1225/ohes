<template>
    <div class="countbox">
        <div class="c_top">
            <el-breadcrumb separator-class="el-icon-arrow-right" >
                <el-breadcrumb-item >调查任务</el-breadcrumb-item>
                <el-breadcrumb-item >调查详情</el-breadcrumb-item>
                <el-breadcrumb-item >基础调查</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button  size="mini" type="success" style="margin-right:10px" @click="close">返回</el-button>
        </div>
        <div class="count_main">
            <!-- <button class="top_btn" @click="close">返回</button> -->
            <div class="choose_name">
                <span class="btnsapn" @click="changeType(0)" :class="{'selectedspan': countType==0}">全部</span>
                <span class="btnsapn" @click="changeType(1)" :class="{'selectedspan': countType==1}">个案</span>
                <span class="btnsapn" @click="changeType(2)" :class="{'selectedspan': countType==2}">对照</span>
            </div>
            <div class="v_tab">
                <div class="tab" @click="toggleTab('attackdate')" :class='{"current" : currentTab == "attackdate" }'>发病日期人群比例</div>
                <div class="tab" @click="toggleTab('morbidity')" :class='{"current" : currentTab == "morbidity" }'>发病率</div>
                <div class="tab" @click="toggleTab('sex')" :class='{"current" : currentTab == "sex" }'>性别</div>
                <div class="tab" @click="toggleTab('symptom')" :class='{"current" : currentTab == "symptom" }'>症状统计</div>
                <div class="tab" @click="toggleTab('age')" :class='{"current" : currentTab == "age" }'>年龄段发病率</div>
                <div class="tab" @click="toggleTab('profession')" :class='{"current" : currentTab == "profession" }'>职业</div>
                <div class="tab" @click="toggleTab('classes')" :class='{"current" : currentTab == "classes" }'>输入性和本地病例</div>
                <div class="tab" @click="toggleTab('flowto')" :class='{"current" : currentTab == "flowto" }'>发病后去向</div>
                 <!-- <div class="tab" @click="toggleTab('space')" :class='{"current" : currentTab == "space" }'>空间分布</div> -->
            </div>   

            <!-- 切换界面 -->
            <div>
                <attackdate :is="currentTab" keep-alive></attackdate>
            </div>
        </div>
    </div>
</template>

<script>
import attackdate from '../survey/statisMgr/attackDate'
import morbidity from '../survey/statisMgr/morbidity'
import sex from '../survey/statisMgr/sex'
import symptom from '../survey/statisMgr/symptom'
import age from '../survey/statisMgr/age'
import profession from '../survey/statisMgr/profession'
import space from '../survey/statisMgr/space'
import classes from '../survey/statisMgr/classes'
import flowto from '../survey/statisMgr/flowto'
    export default{
        data(){
            return{
                fileType:[
                    {
                        id:0,
                        name:'全部' 
                    },
                    {
                        id:1,
                        name:'个案'
                    },
                    {
                        id:2,
                        name:'对照'
                    }
                    
                ],
                countType:0,
                currentTab:'attackdate',
                eventId:null,
            }
        },
        components: { // 声明子组件
            attackdate,
            morbidity,
            sex,
            symptom,
            age,
            profession,
            space,
            classes,
            flowto
        },
  methods: {
    toggleTab: function(tab) {
      this.currentTab = tab // tab 为当前触发标签页的组件名
    },
    close() {
      this.$router.go(-1)
    },
    changeType(countType) {
      this.countType = countType;
      if (this.countType == 1) {
        this.currentType = 'gean';
        this.$store.dispatch('refType', 1); //刷新父级组件
      } else if (this.countType == 2) {
        this.currentType = 'duizhao';
        this.$store.dispatch('refType', 2); //刷新父级组件
      } else {
        this.currentType = 'all';
        this.$store.dispatch('refType', 0); //刷新父级组件
      }
    }
  },
  created() {
    this.eventId = this.$route.params.eventId
    this.changeType(0)
  }
}
</script>

<style lang="less" scoped>
.countbox {
  width: auto;
  height: 100%;
  text-align: left;
  // background-color: #e2e6ef;
  padding: 10px 10px 100px;
  box-sizing: border-box;
  overflow: hidden;
  .c_top {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    background-color: #fff;
    .top_btn {
      // width: 60px;
      // height: 40px;
      // border: 0;
      // background: #b5bac7;
    }
  }
  .count_main {
    height: 100%;
    width: 100%;
    margin-top: 8px;
    padding: 10px;
    background-color: #ffffff;
    box-sizing: border-box;
    overflow: auto;
    .shadowdiv {
      height: 50px;
      line-height: 50px;
      box-shadow: 1px 2px 0px 1px #e9e9e9;
      margin-bottom: 20px;
      border-radius: 5px;
      font-weight: bolder;
    }
    .choose_name {
      margin: 30px 0px;
      display: block;
      .title {
        margin-left: 10px;
      }
      .btnsapn {
        padding: 8px 20px;
        cursor: pointer;
      }
      .selectedspan {
        border: 1px solid #429E73;
        border-radius: 5px;
      }
    }
    .v_tab {
      border-radius: 3px;
      border: 1px solid #429E73;
      margin-top: 15px;
      height: 40px;
      display: flex;
      align-items: center;
      .tab {
        width: 150px;
        height: 100%;
        line-height: 40px;
        text-align: center;
        color: #000000;
        border-radius: 3px;
        &.current {
          background-color: #429E73;
          color: #fff;
        }
      }
    }
  }
}
</style>

