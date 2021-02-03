<template>
    <div class="a_box">
        <!-- 发病日期人群 -->
        <div class="left-box"> <!-- 左侧 -->
            <!-- 选择时间 -->
            <div class="time_main">
                <el-date-picker
                    v-model="myStartdate"
                    type="datetime"
                    placeholder="开始时间">
                </el-date-picker>
                <span>—</span>
                    <el-date-picker
                    v-model="myEnddate"
                    type="datetime"
                    placeholder="结束时间">
                </el-date-picker>
                <el-button style="margin-left: 10px;" type="primary" size="small" @click="search">确认</el-button>
            </div>
            <div id="charts">
                <div id="main"  :style="{width:'100%',height:'600px'}"></div>
            </div>
        </div>


        <div class="right_box"> <!-- 右侧 -->
            <!-- 表格列表 -->
            <div class="table_main" style="width: 99%;padding-top:30px;">
                <el-table ref="multipleTable" align="left" :data="attackList" border  element-loading-text="拼命加载中" tooltip-effect="dark" style="width: 100% ; border-radius:8px; box-shadow:1px 0px 4px 4px #f2f2f2;">
                    <el-table-column prop="id" label="序号" align="center"> </el-table-column>
                    <el-table-column prop="date" label="发病日期"  align="center"> </el-table-column>
                    <el-table-column prop="countNum" label="病例数"  align="center"> </el-table-column>
                    <el-table-column prop="ness" label="百分比"  align="center"> </el-table-column>
                </el-table>
            </div>
            <!--
            <div class="graph_title">
                <el-select v-model="tableType" style="width:100px"  placeholder="请选择" @change="chooseCharts">
                    <el-option
                    v-for="item in fileType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>-->

            
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import echarts from 'echarts';
import axios from 'axios';
import moment from "moment"
var config = require('@/components/utils/Common_Config.js');
    export default{
        data(){
            return{
                myStartdate:'',
                myEnddate:'',
                tableData:[],
                tableType:1,
                fileType:[
                    {
                        id:1,
                        name:'柱状图'
                    },
                    {
                        id:2,
                        name:'折线图'
                    },
                    {
                        id:3,
                        name:'饼状图'
                    },
                ],
                attackList:[],
                yearList:[],
                datalist:[[]],
                seriesList:[],
                numList:[],
                peiList:[],
                eventId:null,
            }
        },
        computed:{
            ...mapGetters([
                'event',
                'isType'
            ])
        },
        methods:{
            chooseCharts(id){
                if(id==1){
                    this.drawBar(this.yearList,this.numList);
                }else if(id==2){
                    this.drawLine(this.yearList,this.numList);
                }else{
                    this.drawPie();
                }
            },
              //柱状图
            drawBar(yearList,nameList,seriesList){
                var myChart = echarts.init(document.getElementById('main'));
                var option ={
                    tooltip : {
                        showContent:true,
                        backgroundColor:"transparent",
                        triggerOn:"mousemove", 
                        confine:true,
                        position:['50%', '50%'],
                        show:true
                    },
                    calculable : true,
                    legend: {
                        data: nameList
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type : 'category',
                        data: yearList
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series: []
                };
                option.series=seriesList;
                myChart.setOption(option);
                window.addEventListener('resize', function () {
					myChart.resize();
			    })
            },
             //折线图
            drawLine(yearList,numList){
                var myChart = echarts.init(document.getElementById('main'));
                myChart.setOption({
                    xAxis: {
                        type: 'category',
                        data: yearList
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: seriesList
                })
                window.addEventListener('resize', function () {
					myChart.resize();
			    })
            },
             //环形图
            drawPie(){
                var myChart = echarts.init(document.getElementById('main'));
                // myChart.clear();
                myChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        // data:this.yearList
                    },
                    series: [
                        {
                            name:'人数',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:this.peiList
                        }
                    ]
                },true)
                window.addEventListener('resize', function () {
					myChart.resize();
			    })
            },

            // 确认搜索
            search(){
                let stime=this.myStartdate;
                this.myStartdate=moment(stime).format('YYYY-MM-DD HH:mm:ss');
                let etime=this.myEnddate;
                this.myEnddate=moment(etime).format('YYYY-MM-DD HH:mm:ss');
                this.getAttackList();
            },
            getAttackList(){
                this.numList=[];
                this.yearList=[];
                this.nameList=[];
                this.attackList=[];
                this.peiList=[];
                this.seriesList=[];
                axios.get(config.apiHost +'/count/countbyday', {  
                    params:{
                        eventId:this.eventId,//食源性
                        startTime:this.myStartdate,
                        endTime:this.myEnddate ,
                        type:this.isType,
                        token:config.token,
                    }
                }).then((result)=>{
                    console.log(result);
                    if (result.data.status == 200) {
                            var count = 1;
                            var index = 0;
                            var sum = result.data.body.allCount;
                            this.yearList = result.data.body.times;
                            this.nameList = result.data.body.types;
                            this.datalist = result.data.body.timscounts;
                            this.myStartdate=result.data.body.startTime;
                            this.myEnddate=result.data.body.endTime;
                            var colorList = [['#27f09d','#0bb5e0'],['#2fccfd','#6a82fe'],['#ef81ee','#857cfc']];
                            //遍历
                            result.data.body.extParoxysmTimeCounts.forEach(item => {
                                var inx = (count-1)%3;
                                let tableobj={id:count++,date:item.date,countNum:item.countNum,ness:(item.countNum/sum*100).toFixed(2)+'%'}
                                this.attackList.push(tableobj);
                                    console.log(index)
                                    console.log(result.data.body.types)
                                    console.log(this.nameList)
                                var seriesData ={
                                    name: this.nameList[index],
                                    type: 'bar',
                                    stack: '总量',
                                    itemStyle: {
                                        normal: {
                            　　　　　　　　　　color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: colorList[inx][0]},
                                                    {offset: 1, color: colorList[inx][1]}
                                                ]
                                            )
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            textBorderWidth : "0",
                                            color : '#fff',
                                            position:'inside',
                                            formatter: function(params) {
                                                if (params.value > 0) {
                                                    return params.value;
                                                } else {
                                                    return '';
                                                }
                                            }
                                        }
                                    },
                                    data: this.datalist[count-2],
                                    barCategoryGap: '0%'
                                };
                                this.seriesList.push(seriesData);
                                index++;
                            });
                            this.drawBar(this.yearList,this.nameList,this.seriesList);
                        } 
                }).catch(function(response){})  
            }
          
        },
        watch:{
            isType(){
               this.getAttackList();
            }
        },
        created(){
            // this.drawLine();
            this.eventId=this.event.id;
            // console.log("统计："+this.eventId);
        },
        mounted(){
           
            this.getAttackList();
        }
    }
</script>

<style lang="less" scoped>
    .a_box{
        width: 100%;
        height: 100%;
        display: flex;
        margin-top: 10px;
        box-sizing: border-box;
        .left-box{
            flex: 1;
            padding-right: 20px;
           .time_main{
               padding: 10px;
           }
           .table_main{
               width: 100%;
               height: 100%;
               margin-top: 10px;
           }
        }
        .right_box{
            flex: 0.85;
            // background-color: #F5F8FF;
            .graph_title{
                padding: 10px;
            }
        }
    }
</style>