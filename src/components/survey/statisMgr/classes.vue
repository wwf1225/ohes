<template>
    <div class="a_box">
        <!-- 职业 -->
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
                    <el-table-column prop="className" label="比例" align="center"> </el-table-column>
                    <el-table-column prop="classNum" label="病例数" align="center"> </el-table-column>
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
    drawBar(nameList, numList) {
      var myChart = echarts.init(document.getElementById('main'))
      // myChart.clear();
      myChart.setOption(
        {
          tooltip: {},
          xAxis: [
            {
              data: nameList
            }
          ],
          yAxis: {},
          series: [
            {
              barWidth: 30, //柱图宽度
              name: '职业',
              type: 'bar',
              data: numList,
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
    drawBarI(nameList, numList) {
      var myChart = echarts.init(document.getElementById('main'))
      // myChart.clear();
      myChart.setOption(
        {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% '
          },
          xAxis: [
            {
              data: nameList
            }
          ],
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
              barWidth: 30, //柱图宽度
              name: '职业',
              type: 'bar',
              data: numList,
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
    drawLine(nameList, numList) {
      var myChart = echarts.init(document.getElementById('main'))
      // myChart.clear();
      myChart.setOption(
        {
          tooltip: {},
          xAxis: {
            type: 'category',
            data: nameList
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '职业',
              data: numList,
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
    drawLineI(nameList, numList) {
      var myChart = echarts.init(document.getElementById('main'))
      // myChart.clear();
      myChart.setOption(
        {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% '
          },
          xAxis: {
            type: 'category',
            data: nameList
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
              name: '职业',
              data: numList,
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
      window.addEventListener('resize', function() {
        myChart.resize()
      })
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
              startAngle : 90,
              avoidLabelOverlap: false,
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
                //                                     ['#881ef5','#e26fff'],
                // 　　　　　　　　　　　　　　　　　　　　['#2fadff','#9924df'],
                //                                     ['#2fadff','#44fbf0'],
                //                                     ['#ff5836','#ab39ef'],
                //                                     ['#fce147','#ff5836'],
                //                                     ['#31d3e2','#3f2ff8'],
                //                                     ['#ffc015','#6915b3'],
                //                                     ['#8ce0d1','#4b7cbf']
                　　　　　　　　　　　　　　　　　　　];
                                            
                                            var index=params.dataIndex%5;
                                            // console.log(index);
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
              data:this.pieList
            }
          ]
        },
        true
      )
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },

    getAttackList() {
      this.numList = []
      this.nameList = []
      this.tableData = []
      this.pieList = []
      this.percentList = []
      axios
        .get(config.apiHost + '/count/caseClassCount', {
          params: {
            eventId: this.event.id, //食源性
            token: config.token,
            type: this.isType
          }
        })
        .then(result => {
          // console.log(result.data);
          if (result.data.status == 200) {
            var count = 1
            var sum = 0
            result.data.body.forEach(item => {
              if(count==1){
                sum = item.caseNum
              }
              this.numList.push(item.classNum)
              this.nameList.push(item.className)
              var ness = 0
              var per=0;
              if (sum == 0) {
                ness = '0.00%';
                per=0.00
              } else {
                ness = (item.classNum / sum * 100).toFixed(2) + '%'
                per=(item.classNum / sum * 100).toFixed(2)
              }
              
              let tableobj = {
                id: count++,
                className: item.className,
                classNum: item.classNum,
                ness: ness
              }
              // console.log(tableobj);
              let user = { value: item.classNum, name: item.className }
              this.tableData.push(tableobj)
              this.pieList.push(user) //饼状图数据
              // console.log(this.pieList);
              let tableper = { per: per }
              this.percentList.push(tableper.per)
            })
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