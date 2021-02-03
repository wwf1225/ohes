<template>
    <div class="fillbox">
        <!-- 表单填写（直接使用） -->
        <div class="top_main">
            <el-breadcrumb separator-class="el-icon-arrow-right" >
                <el-breadcrumb-item >调查任务</el-breadcrumb-item>
                <el-breadcrumb-item >调查详情</el-breadcrumb-item>
                <el-breadcrumb-item >引用模板</el-breadcrumb-item>
                <el-breadcrumb-item >表单填写</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="main_box">
            <div class="btn_main">
                <div>调查表单</div>
                <div>
                    <el-button type="primary" @click="close">返回</el-button>
                </div>
            </div>
            <!-- 填写表单 -->
            <div class="from_main">
                <iframe ref="iframe"   style=" width: 100%;height: 800px;" :src="fromUrl" ></iframe>
            </div>
        </div>
        <div id="mapDiv" style="width:0;height:0"></div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
var config = require("@/components/utils/Common_Config.js");
var Cookies = require("js-cookie");
export default {
  data() {
    return {
      fromsId: "",
      fromUrl: "",
      urlType:"",
      caseType:"",
      caseId:"",
      submitCaseType:"",
      copyAnswer:"",
      longitude:null,
      latitude:null,
      copyFlag:1,
      caseChild:'',
    };
  },
  computed:{
      ...mapGetters(['location'])
  },
  methods: {
    close() {
      // LJ,返回问什么要用push？？？
      // this.$router.push({path: '/home/form_add'});//跳转到列表界面
      // this.$router.push({ path: this.location }); //跳到列表页
      this.$router.go(-1);
    },
    addressDetail() {
      var self = this;
      var mapObj = new AMap.Map("mapDiv", {
        zoom: 10 //级别
      });
      // 获取当前位置
      mapObj.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          showButton: false, //显示定位按钮，默认：true
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", data => {
          self.longitude = data.position.lng;
          self.latitude = data.position.lat;
          if(self.urlType==2){//充填答案页面
            self.fromUrl =config.apiUrl+ "edit_answer_survey.html?formId=" + self.fromsId + "&eventId=" + self.eventId +"&type=" + self.type +"&caseId="+self.caseId+"&caseType=" + self.caseType+"&submitCaseType="+self.submitCaseType+"&copyAnswer="+self.copyAnswer +"&longitude="+self.longitude+"&latitude="+self.latitude+ "&token=" + Cookies.get("token");
          }else{//填写答案页面
            self.fromUrl =config.apiUrl+ "answer_survey.html?formId=" + self.fromsId + "&eventId=" + self.eventId +"&type=" + self.type +"&caseType=" + self.caseType +"&longitude="+self.longitude+"&latitude="+self.latitude+ "&token=" + Cookies.get("token")+'&copyFlag='+self.copyFlag+'&caseChild='+self.caseChild;
          }
        });
        AMap.event.addListener(geolocation, "error", error => {
          self.$message.error(error.message);
        });
      });
    },
    // addressDetail() {
    //   //获取地理位置
    //   var self = this;
    //   //全局的this在方法中不能使用，需要重新定义一下
    //   var geolocation = new BMap.Geolocation();
    //   //调用百度地图api 中的获取当前位置接口
    //   geolocation.getCurrentPosition((r)=>{
    //     if (geolocation.getStatus() == BMAP_STATUS_SUCCESS) {
    //       //获取当前位置经纬度
    //       var myGeo = new BMap.Geocoder();
    //       myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), result=> {
    //         if (result) {
    //           //根据当前位置经纬度解析成地址
    //             console.log(result.point);

    //             this.longitude=result.point.lng;
    //             this.latitude=result.point.lat;
    //             if(this.urlType==2){//充填答案页面
    //               this.fromUrl =config.apiUrl+ "edit_answer_survey.html?formId=" + this.fromsId + "&eventId=" + this.eventId +"&type=" + this.type +"&caseId="+this.caseId+"&caseType=" + this.caseType+"&submitCaseType="+this.submitCaseType+"&copyAnswer="+this.copyAnswer +"&longitude="+this.longitude+"&latitude="+this.latitude+ "&token=" + Cookies.get("token");
    //             }else{//填写答案页面
    //               this.fromUrl =config.apiUrl+ "answer_survey.html?formId=" + this.fromsId + "&eventId=" + this.eventId +"&type=" + this.type +"&caseType=" + this.caseType +"&longitude="+this.longitude+"&latitude="+this.latitude+ "&token=" + Cookies.get("token")+'&copyFlag='+this.copyFlag+'&caseChild='+this.caseChild;
    //             }
    //         }
    //       });
    //     }
    //   });
    // }
  },
  mounted(){
     
  },
  created() {
    // console.log("输出表单Id");
    this.urlType=this.$route.params.urlType;
    this.fromsId = this.$route.params.fromsId;
      this.eventId = this.$route.params.eventId;
      this.type = this.$route.params.type;
      this.caseType = this.$route.params.caseType;
      this.copyAnswer=this.$route.params.copyAnswer;
      this.copyFlag=this.$route.params.copyFlag;
      this.caseChild=this.$route.params.caseChild;
      // console.log(this.$route.params)
      this.addressDetail();
    if(this.urlType==2){
      this.caseId=this.$route.params.caseId;
      this.submitCaseType=this.$route.params.submitCaseType;
      // console.log("跳转的是重填答案页面");
      
      
      
    }else{
      // http://192.168.1.169:8020/cdcform
    }
    
   
    // var ip = "221.239.128.94";  
    // var url = "http://whois.pconline.com.cn/?ip=" + ip;  
    // $.getJSON(url, function (json) {  
    //     var myprovince2 = json.data.area;  
    //     var mycity2 = json.data.region;  
    //     alert("您所在的城市是：" + myprovince2 + mycity2);  
    // });  
    //   this.fromUrl =
    //             "/froms/answer_survey.html?formId=" +
    //             this.fromsId +
    //             "&eventId=" +
    //             this.eventId +
    //             "&type=" +
    //             this.type +
    //             "&caseType=" +
    //             this.caseType +
    //             "&longitude="+
    //             this.longitude+
    //             "&latitude="+
    //             this.latitude+
    //             "&token=" +
    //             Cookies.get("token");
    
    // console.log(this.fromsId);
  }
};
</script>

<style lang="less" scoped>
.fillbox {
  width: auto;
  // height: 100%;
  min-height: 100%;
  text-align: left;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
  .top_main {
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    background-color: #f6f7fb;
  }
  .main_box {
    height: calc(~"100% - 45px");
    // min-height: 800px;
    width: 100%;
    margin-top: 5px;
    background-color: #ffffff;
    .btn_main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
    }
    .from_main {
      width: 100%;
      height: 100%;
      padding-bottom: 50px;
    }
  }
}
</style>

