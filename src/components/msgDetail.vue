<template>
    <div>
        <div class="title-header">信息提醒>详情</div>
        <!-- <div>
        <div>{{detail.name}}提交关于事件名称为{{detail.eventName}}的结案审批被驳回，意见为：{{detail.option}}</div>
        <div>调查员为:{{detail.name}}</div>
        <div>
            <el-button @click="msgDel">删除</el-button>
            <el-button @click="msgBack">返回</el-button>
        </div>
    </div> -->

        <div class="headerDiv">
            <div class="leftName">消息标题：<span style="color:#0199FE">{{detail.msgTitle}}</span></div>
            <div class="rightBtn">
              <el-button class="mybtn" type="primary" @click="msgDel">删除</el-button>
              <el-button class="mybtn" @click="msgBack">返回</el-button>
            </div>
            <div class="edit">
                <vue-html5-editor  class="editor" style="margin-top: -30px;" :content="detail.msgContent" :height="600" id="myeditor"></vue-html5-editor>
              <div class="editor-mask">
                <div style="height:  37px;width:  100%;background-color: #fff;"></div>
              </div>
            </div>
            <!-- <div class="rightBtn">
                <el-button class="mybtn" @click="msgDel">删除</el-button>
                <el-button class="mybtn" @click="msgBack">返回</el-button>
            </div> -->
        </div>
    </div>
</template>
<style scoped>
#myeditor .toolbar {
  display: none;
}
.title-header {
  text-align: left;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
}

.headerDiv {
  display: inline-block;
  width: 100%;
  background-color: #fff;
  padding-left: 10px;
  height: 100%;
  padding-right: 10px;
}
.controlmain {
  width: auto;
  height: 100%;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
}
.leftName {
  font-size: 16px;
  text-align: left;
  height: 40px;
  line-height: 40px;
}
.rightBtn {
  text-align: left;
  margin-top: 20px;
  margin-bottom: 32px;
}
.mybtn {
 
  padding: 8px 20px;
}
.edit {
  position: relative;
  min-height: 500px;
  text-align: left;
  /* padding: 10px; */
}
.edit .editor-mask{
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1001;
}
.vue-html5-editor {
  width: 100%;
}

</style>

<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      config: config,
      detail: {}
    }
  },
  methods: {
    msgDel() {
      axios({
        url: config.apiHost + '/sys/msg/deleteUserMsg',
        method: 'post',
        data: {
          id: this.detail.id
        }
      }).then(res => {
        if (res.data.status == 200) {
          this.$message.success(res.data.body.msg)
          this.$router.go(-1)
        } else {
          this.$message.error(res.data.body.msg)
        }
      })
    },
    msgBack() {
      this.$router.go(-1)
    }
  },
  created() {
    var msgId=this.$route.params.id;
    
    console.log(this.detail);
    axios({
        url: config.apiHost + '/sys/msg/getMsgDetail',
        method: 'get',
        params: {
          msgId: msgId
        }
      }).then(res => {
        if (res.data.status == 200) {
          console.log(res.data.body);
          this.detail = res.data.body;
        } else {
          this.$message.error(res.data.body.msg)
        }
      })

  }
}
</script>