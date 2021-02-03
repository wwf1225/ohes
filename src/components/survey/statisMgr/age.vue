<template>
    <div class="a_box">
        <!-- 年龄段发病率 -->
        <div class="left-box"> <!-- 左侧 
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

            <div id="charts">
                <div id="main"  :style="{width:'100%',height:'400px'}"></div>
            </div>
            
        </div>


        <div class="right_box"> <!-- 右侧 -->
            <!-- 表格列表 -->
            <div class="table_main" style="width: 99%;padding-top:30px;">
                <el-table ref="multipleTable" align="left" :data="tableData" border  element-loading-text="拼命加载中" tooltip-effect="dark" style="width: 100% ; border-radius:8px; box-shadow:1px 0px 4px 4px #f2f2f2;">
                    <el-table-column prop="id" label="序号" align="center"> </el-table-column>
                    <el-table-column prop="ageGroup" label="年龄段"  align="center"> </el-table-column>
                    <el-table-column prop="countNum" label="总人数"  align="center"> </el-table-column>
                    <el-table-column prop="patientNum" label="病例数"  align="center"> </el-table-column>
                    <el-table-column prop="ness" label="发病率"  align="center"> </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import echarts from 'echarts';
import axios from 'axios';
var config = require('@/components/utils/Common_Config.js');
    export default{
        data(){
            return{
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
                nameList:[],
                numList:[],
                pieList:[],
                total:0
                
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
               // console.log("年龄："+id);
                if(id==1){
                    this.drawBar(this.numList,this.nameList);
                }else if(id==2){
                    this.drawLine(this.numList,this.nameList);
                }else{
                    this.drawPie();
                }
            },
              //柱状图
            drawBar(numList,nameList,sum){
                var myChart = echarts.init(document.getElementById('main'));
                // myChart.clear();
                myChart.setOption({
               
                    tooltip : {
                        show:true
                    },
                    xAxis: {type: 'value',
                        minInterval: 1,
                        show: true},
                    yAxis: [{
                        data: nameList,
                        inverse:true,
                    }],
                    series: [{
                        name: '年龄段',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                　　　　　　　　　　color: '#7fc6ff',
                                  borderColor:"#66baff"
                            }
                        },
                        data: numList,
                        label: {
                            normal: {
                                show: true,
                                position:'insideRight',
                                distance:'20',
                                color : '#fff',
                                textBorderWidth : "0",
                                formatter: function(params) {
                                    if (params.value > 0) {
                                        return (params.value/sum*100).toFixed(2)+'%';
                                    } else {
                                        return '';
                                    }
                                }
                            }
                        },
                        barCategoryGap: '0%'
                    }]
                },true);
                window.addEventListener('resize', function () {
					myChart.resize();
			    })
            },
             //折线图
            drawLine(numList,nameList){
                var myChart = echarts.init(document.getElementById('main'));
                // myChart.clear();
                myChart.setOption({
                    xAxis: {
                        type: 'category',
                        data: nameList
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name: '年龄段',
                        data: numList,
                        type: 'line'
                    }]
                });
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
                            name:'年龄段',
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
                            data:this.pieList
                        }
                    ]
                },true);
                window.addEventListener('resize', function () {
					myChart.resize();
			    })
            },

            getAttackList(){
                this.numList=[];
                this.nameList=[];
                this.tableData=[];
                this.pieList=[];
                axios.get(config.apiHost +'/count/countage', {  
                    params:{
                        eventId:this.event.id,//食源性
                        limitNum:10,
                        type:this.isType,
                        token:config.token,
                    }
                }).then((result)=>{  
                    if (result.data.status == 200) {

                            var count = 1;
                            var sum = 0;
                            result.data.body.forEach(item => {
                                sum += item.patientNum;
                            });
                            //遍历
                           
                            result.data.body.forEach(item => {
                                this.numList.push(item.patientNum);
                                this.nameList.push(item.ageGroup);
                                let tableobj={id:count++,ageGroup:item.ageGroup,countNum:item.countNum,patientNum:item.patientNum,ness:(item.patientNum/sum*100).toFixed(2)+'%'}
                                this.tableData.push(tableobj);
                                let user={value:item.patientNum,name:item.ageGroup}
                                this.pieList.push(user);//饼状图数据
                            });

                            this.total=sum;
                            this.drawBar(this.numList,this.nameList, this.total);
                        } 
                }).catch(function(response){  
                    //   this.$message.error(error);
                    // console.log(response);
                })  
            }
          
        },
        watch:{
            isType(){
               this.getAttackList();
            }
        },
        created(){
            //this.drawLine();
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
        .left-box{
            flex: 1;
            padding-right: 20px;
         
           .table_main{
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