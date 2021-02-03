<template>
    <div class="a_box">
        <!-- 症状 -->
        <div class="left-box"> <!-- 左侧 
            <div class="graph_title">
                <el-select v-model="tableType" style="width:100px" placeholder="请选择" @change="chooseCharts">
                    <el-option v-for="item in fileType" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>-->
            <div id="charts">
                <div id="main" :style="{width:'100%',height:'400px'}"></div>
            </div>
        </div>


        <div class="right_box"> <!-- 右侧 -->
            <!-- 表格列表 -->
            <div class="table_main" style="padding-top:30px;">
                <el-table ref="multipleTable" align="left" :data="tableData" border  element-loading-text="拼命加载中" tooltip-effect="dark" style="width: 100% ; border-radius:8px; box-shadow:1px 0px 4px 4px #f2f2f2;">
                    <el-table-column prop="id" label="序号" align="center"> </el-table-column>
                    <el-table-column prop="symptom" label="症状"  align="center"> </el-table-column>
                    <el-table-column prop="personNum" label="病例数"  align="center"> </el-table-column>
                    <el-table-column prop="ness" label="比例"  align="center"> </el-table-column>
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
        data() {
            return {
            tableData: [],
            tableType: 1,
            numberType: 1,
            fileType: [
                {
                id: 1,
                name: '柱状图'
                },
                {
                id: 2,
                name: '折线图'
                },
                {
                id: 3,
                name: '饼状图'
                }
            ],
            sortType: [
                {
                id: 1,
                name: '数值'
                },
                {
                id: 2,
                name: '百分比'
                }
            ],
            nameList: [],
            numList: [],
            pieList: [],
            percentList: []
            }
        },
            computed: {
                ...mapGetters(['event', 'isType'])
            },
            methods: {
                chooseNumber() {
                if (this.numberType == 1 && this.tableType == 1) {
                    this.drawBar(this.nameList, this.numList)
                } else if (this.numberType == 1 && this.tableType == 2) {
                    this.drawLine(this.nameList, this.numList)
                } else if (this.numberType == 2 && this.tableType == 1) {
                    this.drawBarI(this.nameList, this.percentList)
                } else if (this.numberType == 2 && this.tableType == 2) {
                    this.drawLineI(this.nameList, this.percentList)
                }
                },
                chooseCharts() {
                if (this.tableType == 1 && this.numberType == 1) {
                    this.drawBar(this.nameList, this.numList)
                } else if (this.tableType == 2 && this.numberType == 1) {
                    this.drawLine(this.nameList, this.numList)
                } else if (this.tableType == 1 && this.numberType == 2) {
                    this.drawBarI(this.nameList, this.percentList)
                } else if (this.tableType == 2 && this.numberType == 2) {
                    this.drawLineI(this.nameList, this.percentList)
                } else if (this.tableType == 3) {
                    this.drawPie()
                }
                },
              //柱状图
            drawBar(numList,nameList,sum){
                var mainv = document.getElementById('main');
                mainv.style.height = ((nameList.length*52)+20)+'px';
                var myChart = echarts.init(mainv);
                var count1 = 0;
                // myChart.clear();
                myChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter:'{a} <br/>{b}: {c} ({d}%)'
                    },
                    xAxis: {
                        type: 'value',
                        minInterval: 1,
                        show: true
                    },
                    yAxis: [{
                        type:'category',
                        inverse:true,
                        data: nameList,
                        align  : "left"
                    }],
                    series: [{
                        name: '职业',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                　　　　　　　　　　color: function (params){
                
                　　　　　　　　　　　　//我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
                　　　　　　　　　　　　var colorList = [
                                                    ['#ef81ee','#857cfc'],
                                                    ['#27f09d','#0bb5e0'],
                　　　　　　　　　　　　　　　　　　　　['#2fccfd','#6a82fe'],
                                                    ['#81efc4','#00c95a'],
                                                    ['#7cf4fc','#819def']
                                                    
                　　　　　　　　　　　　　　　　　　　];
                
                                        var index=((params.dataIndex-nameList.length)*-1)%5;
            　　　　　　　　　　　　      return new echarts.graphic.LinearGradient(1, 1, 0, 0,
            　　　　　　　　　　　　　     [
            　　　　　　　　　　　　　　       {offset: 0, color: colorList[index][0]},
            　　　　　　　　　　　　　　       {offset: 1, color: colorList[index][1]}
            　　　　　　　　　　　　　     ]);
                　　　　　　　　　　}
                            }
                        },
                        data: numList,
                        label: {
                            normal: {
                                show: true,
                                position: ['65%', '40%'],
                                color : '#fff',
                                formatter: function(params) {
                                    if (params.value > 0) {
                                        return (params.value/sum*100).toFixed(2)+'%';
                                    } else {
                                        return '';
                                    }
                                },
                                textBorderWidth : "0"
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
                axios.get(config.apiHost + '/count/countsymptom', {  
                    params:{
                        eventId:this.event.id,//食源性
                        token:config.token,
                        type:this.isType
                    }
                }).then((result)=>{
                    // console.log(result);
                    // console.log(result.data.status);
                    // console.log(result.data.status == 200);
                    if (result.data.status == 200) {
                            // this.tableData=result.data.body;
                            // console.log(tableData);
                            var count = 1;
                            var sum = 0;
                            result.data.body.forEach(item => {
                                sum += item.personNum;
                            });
                            //遍历
                            result.data.body.forEach(item => {
                                this.numList.push(item.personNum);
                                this.nameList.push(item.symptom);
                                let tableobj={id:count++,symptom:item.symptom,personNum:item.personNum,ness:(item.personNum/sum*100).toFixed(2)+'%'}
                                // console.log(tableobj);
                                let user={value:item.personNum,name:item.symptom}
                                this.tableData.push(tableobj);
                                this.pieList.push(user);//饼状图数据
                            });
                            //  console.log(tableList);
                            // this.tableData=this.tableList;
                            // console.log(1111);
                            this.total=sum;
                            this.drawBar(this.numList,this.nameList, this.total);
                        } 
                }).catch(function(response){  
                    //   this.$message.error(error);
                    // console.log(response);
                })  
            }
    },
  watch: {
    isType() {
      this.getAttackList()
    }
  },
  created() {
    // this.drawLine();
  },
  mounted() {
    this.getAttackList()
  }
}
</script>

<style lang="less" scoped>
.a_box {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .left-box {
    flex: 1;
    padding-right: 20px;

    .table_main {
      margin-top: 10px;
    }
  }
  .right_box {
    flex: 0.85;
    // background-color: #f5f8ff;
    .graph_title {
      padding: 10px;
    }
  }
}
</style>