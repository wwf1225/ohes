<template>
    <div class="a_box">
        <div class="demo">
		<div class="container">
			<div class="row" v-for="flowsData in tableData">
        <div class="case-timeline" style="margin:20px">
            <div class="col-md-2 col-sm-6" style="display: block; padding:10px; padding-bottom:20px">
              &nbsp;&nbsp;&nbsp;<span style="font-size:20px"><b>{{flowsData.name}}</b></span>
            </div>
            <div class="main-timeline" style="display: flex; width:100%; heigh:50px">
              <div class="col-md-2 col-sm-6 timeline" v-for="(flowinfo,index) in flowsData.flows" :class="flowsDataCss[index]">
                <template v-if="index%2 ==0">
                  <div class="timeline-icon" :class="colorCss[index]"><span style="font-size:20px">{{flowinfo.address}}</span><br/>{{flowinfo.detail}}</div>
                  <div class="timeline-icon"><span >{{flowinfo.startTime}}</span></div>
                </template>
                <template v-else>
                  <div class="timeline-icon1" :class="colorCss[index]"><span >{{flowinfo.startTime}}</span></div>
                  <div class="timeline-icon2"><span style="font-size:20px">{{flowinfo.address}}</span><br/>{{flowinfo.detail}}</div>
                </template>
              </div>
            </div>
        </div>
			</div>
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
      flowsDataCss:['bk01','bk02','bk03','bk04','bk05'],
      colorCss:['ck01','ck02','ck03','ck04','ck05'],
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
    getAttackList() {
      this.numList = []
      this.nameList = []
      this.tableData = []
      this.pieList = []
      this.percentList = []
      axios
        .get(config.apiHost + '/count/caseFlowTo', {
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
              var caseflows = [];
              item.caseList.flows.forEach(item1 => {
                let caseflow = {address:item1.address,detail:item1.detail,startTime:item1.startTime}
                caseflows.push(caseflow);
              })
              // console.log(caseflows);
              // console.log(item.caseList.name);
              let caseInfo = {name:item.caseList.name, id:count++, flows:caseflows}
              this.tableData.push(caseInfo);
            })
            // console.log(this.tableData);
          }
        })
        .catch(function(response) {
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
.demo{
			background: #fff;padding: 2em 0;
		}
    .case-timeline{
      border: 1px dashed #ccc;
      border-radius:8px;
    }
		.main-timeline{ overflow: auto; 
    }
		.main-timeline .timeline{
		    padding: 0;
        width:20%;
		    text-align: center;
		    overflow: hidden;
        height:200px;
       
		}
    .bk01{
        background:url("../../../assets/img-01.png")  no-repeat  50% 36%;
        background-size:18px 54px;
        color:#de7d7d;
    }
    .bk02{
        background:url("../../../assets/img-02.png")  no-repeat  50% 61%;
        background-size:18px 54px;
        color:#167c7c;
    }
    .bk03{
        background:url("../../../assets/img-03.png")  no-repeat  50% 36%;
        background-size:18px 54px;
        color:#e6a123;
    }
    .bk04{
        background:url("../../../assets/img-04.png")  no-repeat  50% 61%;
        background-size:18px 54px;
        color:#775e6b;
    }
    .bk05{
        background:url("../../../assets/img-05.png")  no-repeat  50% 36%;
        background-size:18px 54px;
        color:#5ea384;
    }
    .ck01{
      border-bottom: 3px solid #de7d7d;
    }
    .ck02{
      border-bottom: 3px solid #167c7c;
    }
    .ck03{
      border-bottom: 3px solid #E6a123;
    }
    .ck04{
      border-bottom: 3px solid #775e6b;
    }
    .ck05{
      border-bottom: 3px solid #5ea384;
    }
    
		    
		.main-timeline .timeline-icon{
		    padding-bottom: 20px;
		    margin-bottom: 15px;
        height:100px;
		    position: relative;
		}
		.main-timeline .timeline-icon:before{
		    content: "";
		    width: 16px;
		    height: 16px;
		    border-radius: 50%;
		    margin: 0 auto;
		    position: absolute;
		    bottom: -9.5px;
		    left: 0;
		    right: 0;
		}
    .main-timeline .timeline-icon1{
		    padding-top: 65px;
		    margin-bottom: 10px;
        height:100px;
		    position: relative;
		}
    .main-timeline .timeline-icon2{
		    padding-top: 35px;
		    margin-bottom: 10px;
        height:100px;
		    position: relative;
		}
		.main-timeline .timeline-icon1:before{
		    content: "";
		    width: 16px;
		    height: 16px;
		    border-radius: 50%;
		    margin: 0 auto;
		    position: absolute;
		    bottom: -9.5px;
		    left: 0;
		    right: 0;
		}
</style>