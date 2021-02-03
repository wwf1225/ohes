<template>
    <div class="mybox">
        <div class="exam">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height: 45px;">
                <el-breadcrumb-item>事件管理</el-breadcrumb-item>
                <el-breadcrumb-item>当前事件</el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="from-box">
            <div class="event-title">事件接报</div>
            <form :model="form" class="event-form">
                <div class="info">报告人信息</div>
                <div class="input-div">
                    <label class="label-div">疑似事件</label>
                    <input type="text" class="inp" v-model="form.name" style="width:50%">
                </div>
                <div class="input-div">
                    <label class="label-div">报告人</label>
                    <input type="text" class="inp inp-per" v-model="form.reportUser">

                    <label class="label-div ">报告电话</label>
                    <input type="text" class="inp inp-per" v-model="form.reportPhone">
                </div>
                <div class="input-div ">
                    <label class="label-div">报告来源</label>
                    <el-select v-model="form.originId" placeholder="请选择">
                        <el-option v-for="item in originList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>

                    <label class="label-div ">接报时间</label>
                    <el-date-picker v-model="form.reportedTime" @change="getRTime" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </div>

                <div class="info">事件信息</div>
                <div class="input-div">
                    <label class="label-div">事件开始时间</label>
                    <el-date-picker v-model="form.startTime" @change="getSTime" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>

                    <label class="label-div ">地点</label>
                    <input type="text" class="inp inp-per" v-model="form.address">
                </div>
                <div class="input-div ">
                    <label class="label-div">疑似病例数</label>
                    <input type="text" class="inp inp-per" v-model="form.caseNumber">

                    <label class="label-div">疑似事件类型</label>
                    <el-select v-model="form.genre" placeholder="请选择">
                        <el-option v-for="item in eventType" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                      <!-- <el-select v-model="form.genreone" @change="firstChange" placeholder="请选择">
                        <el-option v-for="item in firstType" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                      <el-select v-model="form.genretwo" @change="secondChange" placeholder="请选择" v-show="secondShow">
                        <el-option v-for="item in secondType" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                      <el-select v-model="form.genrethree" @change="threeChange" placeholder="请选择" v-show="thirdShow">
                        <el-option v-for="item in thirdType" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                      <el-select v-model="form.genrefour" @change="fouthChange" placeholder="请选择" v-show="fouthShow">
                        <el-option v-for="item in fouthType" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                      <el-select v-model="form.genrefive" @change="fiveChange" placeholder="请选择" v-show="fiveShow">
                        <el-option v-for="item in fiveType" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select> -->
                </div>
                <div class="input-div ">

                    <label class="label-div ">事件场所</label>
                    <el-select v-model="form.placeId" placeholder="请选择" @change="eventPlaceChang">
                        <el-option v-for="item in placeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-input v-model="form.otherPlaces" v-show="eventPlace" style="width:  230px;margin-left: 10px;"></el-input>
                </div>

                <div class="text-input">
                    <label class="label-div">事件概要</label>
                    <textarea class="area" v-model="form.comment"></textarea>
                </div>
                <div class="text-input">
                    <label class="label-div">流调员</label>
                    <span style="color:#409EFF">{{form.userNameList}}</span>
                </div>

                <div class="btn-div">
                    <el-button type="primary" @click="updateEvent">保存</el-button>
                    <el-button type="primary" @click="closeShow">取消</el-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import moment from 'moment'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      form: {
        name: '', //事件名称
        reportUser: '', //报告人
        reportPhone: '', //报告人电话
        originId: '', //报告来源（下拉）
        reportedTime: null, //接报时间
        startTime: null, //开始时间
        address: '', //地点
        caseNumber: '', //疑似病例数
        placeId: '', //事件场所（下拉）
        comment: '', //事件概要
        status: '', //保存
        longitude: 111, //经度
        latitude: 12222, //纬度
        genreone: '', 
        genretwo:'',
        genrethree:'',
        genrefour:'',
        genrefive:'',//疑似事件类型
        otherPlaces: ''
      },
       eventPlace: false,
      secondShow:false,
      thirdShow:false,
      fouthShow:false,
      fiveShow:false,
      placedShow:false,
      originList: [],
      placeList: [],
      thirdType:[],
      fouthType:[],
      fiveType:[],
      eventType: [
        {
          id: 0,
          name: '传染病'
        },
        {
          id: 1,
          name: '食源性疾病'
        },
        {
          id: 2,
          name: '其他'
        }
      ],
      //   0-传染病   1-食源性疾病
      firstType: [
        {
          id: 0,
          name: '传染病'
        },
        {
          id: 1,
          name: '食源性疾病'
        },
        {
          id: 6,
          name: '其他'
        }
      ],
      secondType: [
        {
          id: 1,
          name: '甲'
        },
        {
          id: 2,
          name: '乙'
        },
        {
          id: 3,
          name: '丙'
        },
        {
          id: 5,
          name: '丁'
        }
      ],
    }
  },
  computed: {
    ...mapGetters(['event'])
  },
  methods: {
   firstChange(){
      if(this.form.genreone==0){
      this.secondShow=true;
      // this.thirdShow=true;
      this.fouthShow=false;
      this.fiveShow=false;
      }
      if(this.form.genreone==1){
        this.secondShow=false;
        this.thirdShow=false;
        this.fouthShow=true;
        this.fiveShow=false;
         this.fouthType=[];
         axios({
          method: 'get',
          // /api
          url: config.apiHost + '/disease/list?type=1',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            token: config.token
          }
        })
          .then(res => {
            console.log(res);
            if (res.data.status == 200) {
               this.fouthType=res.data.body;
            }
          })
        
      }
      if(this.form.genreone==6){
        this.fouthShow=false;
        this.secondShow=false;
        this.thirdShow=false;
        this.fouthShow=false;
        this.fiveShow=true;
         this.fiveType=[];
         axios({
          method: 'get',
          // /api
          url: config.apiHost + '/disease/list?type=6',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            token: config.token
          }
        })
          .then(res => {
            console.log(res);
            if (res.data.status == 200) {
               this.fiveType=res.data.body;
            }
          })
        
      }
   },
   secondChange(){
        this.thirdShow=true;
      this.thirdType=[];
       axios({
          method: 'get',
          // /api
          url: config.apiHost + '/disease/list?type='+this.form.genretwo,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            token: config.token
          }
        })
          .then(res => {
            console.log(res);
            if (res.data.status == 200) {
              this.thirdType=res.data.body;
            }
          })
         
    },
threeChange(){

},

fouthChange(){

},
fiveChange(){

},












    getOrigin() {
      //
      axios
        .get(config.apiHost + '/event-origin', {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            // console.log(result.data)
            if (result.data.status == 200) {
              this.originList = result.data.body
            }
          },
          error => {
            this.$message.error(error)
          }
        )
    },
    getPlace() {
      //
      axios
        .get(config.apiHost + '/event-places', {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.placeList = result.data.body
            }
          },
          error => {
            this.$message.error(error)
          }
        )
    },
    getSTime(val) {
      // console.log("开始时间。。")
      //  console.log(val);
      var startTime = this.getCurrentDateTime(val)
      // console.log(startTime);
      this.form.startTime = startTime
    },
    getRTime(val) {
      // console.log("接报时间。。")
      // console.log(val);
      var reportedTime = this.getCurrentDateTime(val)
      // console.log(reportedTime);
      this.form.reportedTime = reportedTime
    },
    // 时间转换
    getCurrentDateTime(str) {
      return moment(str).format('YYYY-MM-DD HH:mm:ss')
    },
    //保存修改
    updateEvent() {
      //    this.form.status='1';
      // console.log("修改。。")
      // console.log(this.form);
      axios({
        method: 'post',
        // url:'/api/save-event',
        // '/api
        url: config.apiHost + '/current-events/update-event',
        data: this.form,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          token: config.token
        }
      })
        .then(res => {
          // console.log(res);
          if (res.data.status == 200) {
            this.$message(res.data.body.msg)
            this.$router.push({ path: '/home/event-now' }) //跳转到当前事件界面
          }
          return res.data
        })
        .catch(response => {
          this.$message.error(response)
        })
    },
    // 取消，返回列表
    closeShow() {
      //  this.$router.push({path: '/home/event-now'});
      if (this.form.isUrl == 'surveyTasks') {
        this.$router.push({ path: '/home/survey_tasks' }) //跳转到调查管理列表
      } else if (this.form.isUrl == 'eventNow') {
        this.$router.push({ path: '/home/event-now' }) //跳转到当前事件列表
      } else {
        this.$router.go(-1)
      }
    },
    eventPlaceChang() {
          console.log(this.form.placeId)
          if(this.form.placeId == ''){
                this.eventPlace = false
          }
        axios({
          method: 'get',
          url: config.apiHost + '/froms/places',
          params: {
            placeId: this.form.placeId
          }
        }).then(result => {
          console.log(result)
          if (result.data.status == 200) {
            this.eventPlace = result.data.body
          } else {
            this.eventPlace = result.data.body
          }
        })
        // console.log(value)
      //    if(value == "其他"){
      //   this.eventPlace=true;
      // }else{
      //   this.eventPlace=false;
      // }
      // if (id == first) {
        
      // } else {
      //   this.form.otherPlaces = ''
      // }
    }
  },
  mounted() {
    // console.log(this.event);
    this.form = this.event
    // console.log(this.form)
  },
  created() {
    this.getOrigin()
    this.getPlace()
    // this.eventPlaceChang()
  }
}
</script>

<style scoped>
.mybox {
  width: auto;
  min-height: 100%;
  text-align: left;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
}

.exam {
  width: 100%;
  height: 45px;
  line-height: 45px;
  font-size: 18px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  background-color: #f6f7fb;
  margin-bottom: 5px;
}
.from-box {
  height: calc(100% - 45px);
  min-height: 900px;
  background-color: #ffffff;
  margin: 0 auto;
}
.event-title {
  height: 30px;
  line-height: 30px;
  width: 100%;
  padding-left: 10px;
  background-color: #def0fe;
}
.event-form {
  width: 70%;
  margin: 0 auto;
  margin-bottom: 30px;
}
.info {
  height: 30px;
  line-height: 30px;
  text-align: left;
  color: #6eb594;
  width: 100%;
  margin-top: 15px;
  border-bottom: 2px solid #6eb594;
}
.input-div {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  align-items: center;
}
.text-input {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}
.area {
  width: 77%;
  height: 100px;
  border: 0;
  background: #eeeeee;
}
.label-div {
  display: block;
  width: 100px;
  text-align: right;
  margin-right: 15px;
}
.inp {
  /* width: 50%; */
  height: 30px;
  border: 0;
  border-radius: 4px;
  background: #eeeeee;
  height: 35px;
  padding-left: 10px;
}
.inp-per {
  width: 30%;
}
.margin-left-three {
  margin-left: 30px;
}
.btn-div {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}
</style>

