<template>
    <div class="report_container">
        <div class="reportBox">
            <!-- 事件报告编辑 -->
            <div class="top_main">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>调查管理</el-breadcrumb-item>
                    <el-breadcrumb-item>调查任务</el-breadcrumb-item>
                    <el-breadcrumb-item>调查详情</el-breadcrumb-item>
                    <el-breadcrumb-item>事件报告</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="main_box">
                <div class="btn_main">
                    <label>事件报告</label>
                    <div>
                        <el-button size="medium" type="primary" @click="add">保存</el-button>
                        <el-button size="medium" type="primary" @click="outWord">导出word</el-button>
                        <el-button size="medium" type="info" @click="goClose">返回</el-button>
                    </div>
                </div>
                <!-- <div class="btn_box">事件名称：<el-input placeholder="请输入名称" style="width:225px;" v-model="form.name" readonly="readonly"></el-input></div> -->
                <div class="btn_box">事件名称：
                    <span style="color:#0066FF">{{form.name}}</span>
                </div>
                <div class="btn_box">报告类型：
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option v-for="item in reportType" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button size="medium" type="primary" @click="generationReportBtn">生成报告</el-button>
                </div>

                <!-- 富文本编辑器 -->
                <div class="editor_box">
                    <vue-html5-editor :content="form.content" :height="500" @change="changeEditor"></vue-html5-editor>
                </div>

            </div>
        </div>
        <!-- 到处提示框 -->
        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" left>
            <template>
                <el-radio v-model="radio" label="1">导出doc文件</el-radio>
                <el-radio v-model="radio" label="2">导出docx文件</el-radio>
            </template>

            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      content: '请输入内容',
      form: {
        id: null,
        eventId: null,
        name: '',
        type: null,
        content: ''
      },
      reportType: [],
      canRequest: false,
      // generationReport:false,
      isType: '',
      radio: '1',
      centerDialogVisible: false
    }
  },
  components: {},
  methods: {
    // 导出word文档
    outWord() {
      if (this.canRequest == true) {
        this.centerDialogVisible = true
        if (this.isType == '编辑') {
          this.wordUrl()
        } else {
          // 先添加再导出
          axios({
            method: 'post',
            // /api
            url: config.apiHost + '/survey/reportsave',
            data: this.form,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              token: config.token
            }
          })
            .then(res => {
              // console.log(res);
              if (res.data.status == 200) {
                this.form.id = res.data.body.id
                this.form.type = res.data.body.type
                this.wordUrl()
                this.$router.go(-1)
              } else {
                this.$message(res.data.body.message)
              }
              return res.data
            })
            .catch(response => {
              this.$message.error(response)
            })
        }
      } else {
        this.$message.info('请先生成报告')
        return
      }
    },
    // 下载word
    wordUrl() {
      axios
        .get(config.apiHost + '/exportWord/makeDoc', {
          params: {
            //请求参数
            id: this.form.id,
            type: this.form.type,
            eventId: this.form.eventId,
            token: config.token,
            document: this.radio
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.outData = result.data.body
              // console.log(this.outData);
              this.myUrl = this.outData.completeSavePath
              window.open(this.myUrl, '_blank')
            } else {
              this.$message(result.data.body.message)
            }
          },
          error => {
            this.$message.error(error)
          }
        )
    },
    // 得到报告类型
    getType() {
      axios
        .get(config.apiHost + '/survey/reportType', {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.reportType = result.data.body
              // console.log(this.sampleType);
            } else {
              this.$message(result.data.body.message)
            }
          },
          error => {
            this.$message.error(error)
          }
        )
    },
    // 得到报告详情
    getDetail() {
      axios
        .get(config.apiHost + '/survey/findReport', {
          params: {
            //请求参数
            id: this.form.id,
            token: config.token
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.form = result.data.body
              // console.log(this.form);
            } else {
              this.$message(result.data.body.message)
            }
          },
          error => {
            this.$message.error(error)
          }
        )
    },
    //添加事件报告
    add() {
      // console.log(this.form.content);
      // console.log(this.form);
      if (this.form.content != ""&&this.form.type!="") {
        axios({
          method: 'post',
          // /api
          url: config.apiHost + '/survey/reportsave',
          data: this.form
        })
          .then(res => {
            // console.log(res);
            if (res.data.status == 200) {
              this.$router.go(-1)
              this.form = {
                id: null,
                eventId: null,
                name: '',
                type: null,
                content: ''
              }
            } else {
              this.$message(res.data.body.message)
            }
            return res.data
          })
          .catch(response => {
            this.$message.error(response)
          })
      } else {
        this.$message.info('报告或报告类型不能为空')
        return
      }
    },
    //返回
    goClose() {
      this.$router.go(-1)
    },

    //富文本取值
    changeEditor(e) {
      // console.log(e);//输出富文本内容
      this.form.content = e
    },
    // reportCallBack(){

    //     if(this.form.type==4){
    //         this.generationReport=true;
    //     }else{
    //         this.generationReport=false;
    //     }

    // },
    generationReportBtn() {
      if (this.form.type == '' || this.form.type == null) {
        this.$message('请选择报告类型')
        return
      }

      axios({
        method: 'get',
        url:
          config.apiHost +
          '/survey/genreport?eventId=' +
          this.form.eventId +
          '&type=' +
          this.form.type
      }).then(res => {
        if (res.data.status == 200) {
          // console.log(res.data);
          this.form.content = res.data.body.msg
          this.canRequest = true
        } else {
          this.$message(res.data.body.message)
        }
      })
    }
  },
  mounted() {},
  created() {
    this.getType()
    // console.log("@@@"+this.$route.params.eventId+"现况："+this.$route.params.ispage);
    this.form.id = this.$route.params.id
    this.form.eventId = this.$route.params.eventId
    this.form.name = this.$route.params.name
    this.isType = this.$route.params.isType
    if (this.isType == '编辑') {
      this.getDetail()
    }
    // this.form.type=this.$route.params.type;
    // this.form.content=this.$route.params.content;
  }
}
</script>

<style scoped>
.report_container {
  width: auto;
  min-height: 100%;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
}
.reportBox {
  width: 100%;
  height: 100%;
  text-align: left;
  background-color: #e2e6ef;
  min-height: 800px;
}
.top_main {
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  background-color: #f6f7fb;
}
.main_box {
  height: calc(100% - 45px);
  width: 100%;
  margin-top: 5px;
  min-height: 800px;
  background-color: #ffffff;
}
.btn_main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
}
.btn_box {
  padding: 5px 15px;
}
.editor_box {
  padding: 5px 15px;
}
</style>

