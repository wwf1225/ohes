<template>
    <div class="s_box">
        <!-- 性别-->
        <div class="left-box">
            <!-- 左侧 
             <div class="graph_title">
                <el-select v-model="tableType" style="width:100px" placeholder="请选择" @change="chooseCharts">
                    <el-option v-for="item in fileType" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="numberType" style="width:100px" placeholder="请选择" @change="chooseNumber">
                    <el-option v-for="item in sortType" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>-->
            <div id="charts">
                <div id="main" :style="{width:'100%',height:'400px'}"></div>
            </div>
        </div>

        <div class="right_box">
            <!-- 右侧 -->
            <!-- 表格列表 -->
            <div class="table_main" style="width: 99%;padding-top:30px;">
                <el-table ref="multipleTable" align="left" :data="tableData" border element-loading-text="拼命加载中" tooltip-effect="dark" style="width: 100% ; border-radius:8px; box-shadow:1px 0px 4px 4px #f2f2f2;">
                    <el-table-column prop="id" label="序号" align="center"> </el-table-column>
                    <el-table-column prop="sex" label="性别" align="center"> </el-table-column>
                    <el-table-column prop="num" label="病例数" align="center"> </el-table-column>
                    <el-table-column prop="ness" label="百分比" align="center"> </el-table-column>
                </el-table>
            </div>
           

            
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      myStartdate: '',
      myEnddate: '',
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
      tableList: {},
      tableData: [],
      numList: [],
      peiList: [],
      percentList: []
    }
  },
  computed: {
    ...mapGetters(['event', 'isType'])
  },
  methods: {
    chooseNumber() {
      if (this.numberType == 1 && this.tableType == 1) {
        this.drawBar(this.numList)
      } else if (this.numberType == 1 && this.tableType == 2) {
        this.drawLine(this.numList)
      } else if (this.numberType == 2 && this.tableType == 1) {
        this.drawBarI(this.percentList)
      } else if (this.numberType == 2 && this.tableType == 2) {
        this.drawLineI(this.percentList)
      }
    },
    chooseCharts() {
      if (this.tableType == 1 && this.numberType == 1) {
        this.drawBar(this.numList)
      } else if (this.tableType == 2 && this.numberType == 1) {
        this.drawLine(this.numList)
      } else if (this.tableType == 1 && this.numberType == 2) {
        this.drawBarI(this.percentList)
      } else if (this.tableType == 2 && this.numberType == 2) {
        this.drawLineI(this.percentList)
      } else if (this.tableType == 3) {
        this.drawPie()
      }
    },
    //柱状图
    drawBar(aaa) {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption(
        {
          tooltip: {},
          xAxis: {
            data: ['女', '男']
          },
          yAxis: {},
          series: [
            {
              name: '人数',
              type: 'bar',
              barWidth: 30, //柱图宽度
              data: aaa,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: 'black'
                    }
                  }
                }
              }
            }
          ]
        },
        true
      )
      window.addEventListener(
        'resize',
        function() {
          myChart.resize()
        },
        true
      )
    },
    drawBarI(aaa) {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption(
        {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% '
          },
          xAxis: {
            data: ['女', '男']
          },
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value} %'
              },
              show: true
            }
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              barWidth: 30, //柱图宽度
              data: aaa,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%',
                    textStyle: {
                      color: 'black'
                    }
                  }
                }
              }
            }
          ]
        },
        true
      )
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    //折线图
    drawLine(aaa) {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption(
        {
          tooltip: {},
          xAxis: {
            type: 'category',
            data: ['女', '男']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '人数',
              data: aaa,
              type: 'line',
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: 'black'
                    }
                  }
                }
              }
            }
          ]
        },
        true
      )
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },
    drawLineI(aaa) {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption(
        {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% '
          },
          xAxis: {
            type: 'category',
            data: ['女', '男']
          },
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value} %'
              },
              show: true
            }
          ],
          series: [
            {
              name: '人数',
              data: aaa,
              type: 'line',
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%',
                    textStyle: {
                      color: 'black'
                    }
                  }
                }
              }
            }
          ]
        },
        true
      )
      window.addEventListener(
        'resize',
        function() {
          myChart.resize()
        },
        true
      )
    },
    //环形图
    drawPie() {
      var myChart = echarts.init(document.getElementById('main'))
      // myChart.clear();
      myChart.setOption(
        {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            x : 'left'
          },
          series: [
            {
              name: '人数',
              type: 'pie',
              radius: ['30%', '70%'],
              startAngle : 0,
              avoidLabelOverlap: false,
              itemStyle: {
                            normal: {
                                //每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                　　　　　　　　　　color: function (params){
                
                　　　　　　　　　　　　//我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
                　　　　　　　　　　　　var colorList = [
                                                    ['#27f09d','#0bb5e0'],
                　　　　　　　　　　　　　　　　　　　　['#2fccfd','#6a82fe'],
                                                    ['#ef81ee','#857cfc']
                
                　　　　　　　　　　　　　　　　　　　];
                
                                            var index=params.dataIndex;
                                            if(params.dataIndex >= colorList.length){
                                                    index=params.dataIndex-colorList.length;
                                            }
                
                　　　　　　　　　　　　      return new echarts.graphic.LinearGradient(1, 1, 0, 0,
                　　　　　　　　　　　　　     [
                　　　　　　　　　　　　　　       {offset: 0, color: colorList[index][0]},
                　　　　　　　　　　　　　　       {offset: 1, color: colorList[index][1]}
                　　　　　　　　　　　　　     ]);
                　　　　　　　　　　}
                            }
                        },
              label: {
                normal: {
                    formatter: '{d}%',
                    
                }
              },
              labelLine: {
                normal: {
                  show: true,
                  length2:150,
                  width:100
                }
              },
              data: this.peiList
            }
          ]
        },
        true
      )
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },

    getTableList() {
      this.tableData = []
      this.numList = []
      this.peiList = []
      this.percentList = []
      axios
        .get(config.apiHost + '/count/countsex', {
          params: {
            eventId: this.event.id, //食源性
            // startTime: '2017-12-01',
            // endTime: '2018-05-05',
            type: this.isType,
            // token: config.token
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableList = result.data.body
            var womanNess = 0
            var manNess = 0
            var womanper = 0
            var manper = 0

            if (this.tableList.countNum == 0) {
              womanNess = '0.00%'
              manNess = '0.00%'
              womanper = 0.0
              manper = 0.0
            } else {
              womanNess =
                (
                  this.tableList.femaleNum /
                  this.tableList.countNum *
                  100
                ).toFixed(2) + '%'
              manNess =
                (
                  this.tableList.maleNum /
                  this.tableList.countNum *
                  100
                ).toFixed(2) + '%'
              // per = (this.tableList.personNum / this.tableList.countNum * 100).toFixed(2)
              womanper = (
                this.tableList.femaleNum /
                this.tableList.countNum *
                100
              ).toFixed(2)
              manper = (
                this.tableList.maleNum /
                this.tableList.countNum *
                100
              ).toFixed(2)
            }

            let woman = {
              id: 1,
              sex: '女',
              num: this.tableList.femaleNum,
              ness: womanNess
            }
            let man = {
              id: 2,
              sex: '男',
              num: this.tableList.maleNum,
              ness: manNess
            }
            this.tableData.push(woman, man) //表格数据

            this.numList.push(this.tableList.femaleNum, this.tableList.maleNum) //柱状/线性图

            let nv = { value: this.tableList.femaleNum, name: '女' }
            let nan = { value: this.tableList.maleNum, name: '男' }
            this.peiList.push(nv, nan) //饼状图数据

            this.percentList.push(womanper, manper)
            // console.log(this.percentList)
            // console.log(this.tableData)

            this.drawPie()
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        })
    }
  },
  watch: {
    isType() {
      this.getTableList()
    }
  },
  created() {},
  mounted() {
    this.getTableList()
  }
}
</script>

<style lang="less" scoped>
.s_box {
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