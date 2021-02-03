<template>
  <div class="countbox">
    <!-- 添加表单 -->
    <div class="top_main">
      <div class="c_top">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>调查任务</el-breadcrumb-item>
          <el-breadcrumb-item>调查详情</el-breadcrumb-item>
          <el-breadcrumb-item>现况调查</el-breadcrumb-item>
          <el-breadcrumb-item>引用表单</el-breadcrumb-item>
        </el-breadcrumb>

      </div>
      <div class="c_tab">
        <el-form :inline="true" :model="formQuery" label-position="right" style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;" class="demo-form-inline">
          <el-form-item label="表单名称：">
            <el-input style="width:300px;" v-model="formQuery.formName" placeholder="请输入表单名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getFromList()">搜索</el-button>
          </el-form-item>
          <el-form-item label="表单类别：" v-show="formTypeShow">
            <el-select v-model="value" placeholder="请选择" @change="getFromList()">
              <el-option label="不明原因" value="4"></el-option>
              <el-option label="食源性" value="5"></el-option>
              <el-option label="传染病" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="back()" type="primary" plain style="float:right;margin-right:20px;">返回</el-button>
        </el-form>
      </div>
    </div>
    <!-- 列表 -->
    <ul class="listul">
      <li class="right_div" v-for="(v,k) in tableData" :key="k">

        <span>{{v.name}}</span>

        <div>
          <el-button type="primary" plain size="mini" @click="openFrom(v.fromsId)">预览</el-button>
          <el-button type="primary" plain size="mini" @click="editFrom(v)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="useFrom(v)">使用</el-button>

        </div>
      </li>
    </ul>
    <!-- 预览模板 -->
    <template>
      <transition enter-active-class='animated fadeInRight' leave-active-class='animated fadeOutRight'>
        <div class="temp_bg" v-show="formShow" @click="closefrom">
          <div class="my_from">
            <iframe ref="iframe" style=" width: 600px;height: 600px;" :src="formUrl"></iframe>
          </div>

        </div>
      </transition>
    </template>
    <!--创建新表单弹出框 -->
    <el-dialog title="创建空白表单" :visible.sync="dialogAddVisible">
      <el-form ref="form" :inline="false" :model="creatForm" label-width="120px" id="classroom_add">
        <el-form-item label="表单类别：" prop="name">
          <el-select v-model="creatForm.formType" placeholder="请选择">
            <el-option v-for="item in formTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCall">确认</el-button>
        <el-button @click="closeShow">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
var Cookies = require('js-cookie')
import config from '../utils/Common_Config.js'
import axios from 'axios'
export default {
  data() {
    return {
      config: config,
      formTypeShow: false,
      formQuery: {
        formName: '',
        type: '',
        caseChild: ''
      },
      value: '5',
      creatForm: {
        formType: ''
      },
      addType: '',
      formTypeList: [],
      eventId: '',
      tableData: [],
      formShow: false,
      formUrl: '',
      dialogAddVisible: false,
      NewfromsId: ''
    }
  },
  computed: {
    ...mapGetters(['location'])
  },
  methods: {
    back() {
      // this.$router.push({ path: this.location }) //跳转到列表界面
      this.$router.go(-1) //跳转到列表界面
    },
    closeShow() {
      this.dialogAddVisible = false
      this.creatForm = {}
      this.getFromList()
    },
    saveCall() {
      if (
        this.creatForm.formType == undefined ||
        this.creatForm.formType == ''
      ) {
        this.$message.info('请选择表单类别')
        return
      } else {
        this.$router.push({
          name: 'edit_blank',
          params: {
            surveyName: this.surveyName,
            type: this.type,
            eventId: this.eventId,
            diseaseId: this.diseaseId
          }
        }) //跳转到填写表单
      }
    },
    addblankForm() {
      this.dialogAddVisible = true
    },
    openFrom(fromsId) {
      this.formShow = true
      this.formUrl =
        config.apiUrl +
        'preview.html?formId=' +
        fromsId +
        '&token=' +
        Cookies.get('token')
    },
    closefrom() {
      this.formShow = false
    },
    //保存表单名称
    saveFormName(formId) {
      axios
        .get(config.apiHost + '/froms/saveFromsName', {
          params: {
            fromsId: formId,
            eventId: this.eventId
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            // this.$message.success("成功");
          } else {
            this.$message.error(result.data.body.message)
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        })
    },
    //编辑表单
    editFrom(info) {
      axios({
        method: 'get',
        url: config.apiHost + '/fromManager/falseFromsId'
      }).then(result => {
        if (result.data.status == 200) {
          console.log(info)

          let caseType = null
          let newFormId = result.data.body.msg
          if (info.type == 1) {
            caseType = 1 //个案
          } else if (info.type == 5) {
            caseType = 2 //对照
          }
          this.$router.push({
            name: 'edit_form',
            params: {
              fromsId: info.fromsId,
              eventId: this.eventId,
              type: info.type,
              diseaseId: info.diseaseId,
              isTemplate: info.isTemplate,
              caseType: this.addType,
              copyFlag: 2,
              newFormId: newFormId
            }
          }) //跳转到编辑表单界面
        }
      })
    },
    //使用
    useFrom(info) {
      //复制表单，得到新表单对象 http://192.168.5.197:8088/survey/userForm?surveyName=fff77777&type=6&diseaseId=1&fromsId=427885349776265217&eventId=89
      axios
        .get(config.apiHost + '/survey/userForm', {
          params: {
            fromsId: info.fromsId,
            eventId: this.eventId,
            type: info.type,
            controlType: 1,
            surveyName: info.name
          }
        })
        .then(result => {
          // console.log("请求返回。。。");
          if (result.data.status == 200) {
            this.$message.success('成功')
            this.NewfromsId = result.data.body.fromsId
            var caseType = null
            if (info.type == 1) {
              caseType = 1 //个案
            } else if (info.type == 5) {
              caseType = 2 //对照
            }
            this.$router.push({
              name: 'fill_form',
              params: {
                fromsId: this.NewfromsId,
                eventId: this.eventId,
                type: info.type,
                caseType: this.addType,
                urlType: 1,
                copyFlag: 2
              }
            }) //跳转到填写表单
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        })
    },
    getFromList() {
      let type
      if (this.formQuery.type == 1) {
        type = this.value
      } else {
        type = this.formQuery.type
      }
      axios
        .get(config.apiHost + '/froms/queryTempFroms', {
          params: {
            name: this.formQuery.formName,
            page: 1,
            limit: 1000,
            type: type,
            caseChild: this.formQuery.caseChild
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData = result.data.body.list
          }
        })
        .catch(function(response) {})
    }
  },
  created() {
    this.formQuery.type = this.$route.params.type
    this.eventId = this.$route.params.eventId
    this.addType = this.$route.params.type
    if (this.$route.params.type == 1) {
      this.formQuery.caseChild = this.$route.params.caseChild
      this.formTypeShow = true
    }
    this.getFromList()
  }
}
</script>
<style lang="less" scoped>
.countbox {
  width: auto;
  // height: 100%;
  min-height: 100%;
  text-align: left;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
  box-sizing: border-box;
  overflow: hidden;
  .top_main {
    background-color: #ffffff;
    .c_top {
      height: 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      background-color: #f6f7fb;
    }
  }
  .listul {
    height: 100%;
    min-height: 800px;
    background-color: #ffffff;
    .right_div {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 1px solid #eaedf4;
    }
  }
  .temp_bg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    .my_from {
      width: 600px;
      height: 600px;
      background: #ffffff;
      position: fixed;
      top: 173px;
      right: 0;
    }
  }
}
.el-button--primary.is-plain{
  background: #fff !important;
  border-color: #429E73 !important;
}
.el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover{
  background: #429E73 !important;
}
</style>


