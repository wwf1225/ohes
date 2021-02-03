<template>
    <div class="a_box">
        <!-- 发病率 -->
        <div class="left-box"> <!-- 左侧 -->
            <!--<div class="graph_title">
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
                    <el-table-column prop="cottomstype" label="病例类型"  align="center"> </el-table-column>
                    <el-table-column prop="personNum" label="发病人数"  align="center"> </el-table-column>
                    <el-table-column prop="ness" label="百分比"  align="center"> </el-table-column>
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
                pieList:[]
                
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
                    this.drawBar(this.numList,this.nameList);
                }else if(id==2){
                    this.drawLine(this.numList,this.nameList);
                }else{
                    this.drawPie();
                }
            },
              //柱状图
            drawBar(numList,nameList){
                var myChart = echarts.init(document.getElementById('main'));
                // myChart.clear();
                myChart.setOption({
                    tooltip: {},
                    xAxis: [{
                        data: nameList,
                    }],
                    yAxis: {minInterval: 1},
                    series: [{
                        name: '职业',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                　　　　　　　　　　color: function (params){
                
                　　　　　　　　　　　　//我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
                　　　　　　　　　　　　var colorList = [
                
                　　　　　　　　　　　　　　　　　　　　['#2fccfd','#6a82fe'],
                
                　　　　　　　　　　　　　　　　　　　　['#27f09d','#0bb5e0'],

                                                    ['#ef81ee','#857cfc']
                
                　　　　　　　　　　　　　　　　　　　];
                
                                            var index=params.dataIndex;
                                            if(params.dataIndex >= colorList.length){
                                                    index=params.dataIndex-colorList.length;
                                            }
                
                　　　　　　　　　　　　      return new echarts.graphic.LinearGradient(0, 0, 0, 1,
                　　　　　　　　　　　　　     [
                　　　　　　　　　　　　　　       {offset: 0, color: colorList[index][0]},
                　　　　　　　　　　　　　　       {offset: 1, color: colorList[index][1]}
                　　　　　　　　　　　　　     ]);
                　　　　　　　　　　}
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position:'insideTop',
                                textBorderWidth : "0",
                                color : '#fff',
                                formatter: '{c}'
                            }
                        },
                        data: numList
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
                        name: '职业',
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
                            name:'职业',
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
                axios.get(config.apiHost + '/count/countcottomstype', {  
                    params:{
                        eventId:this.event.id,//食源性
                        type:this.isType,
                        token:config.token,
                    }
                }).then((result)=>{  
                    if (result.data.status == 200) {
                            var count = 1;
                            var sum = 0;
                            result.data.body.forEach(item => {
                                sum += item.personNum;
                            });
                            //遍历
                            result.data.body.forEach(item => {
                                this.numList.push(item.personNum);
                                this.nameList.push(item.cottomstype);
                                let tableobj={id:count++,cottomstype:item.cottomstype,personNum:item.personNum,countNum:sum,ness:(item.personNum/sum*100).toFixed(2)+'%'}
                                // console.log(tableobj);
                                let user={value:item.personNum,name:item.cottomstype}
                                this.tableData.push(tableobj);
                                this.pieList.push(user);//饼状图数据
                            });

                            this.drawBar(this.numList,this.nameList);
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
            // this.drawLine();
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