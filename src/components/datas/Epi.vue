<template>
    <div class="rolebox">
        <!-- top -->
        <!-- <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item>应急小工具</el-breadcrumb-item>
                <el-breadcrumb-item>Epi小工具</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->

        <!-- container -->
        <div class="rolemgr-container">

            <div class="tab_main">
                <!-- left -->
                <div class="left_main">
                   <div style="display:flex;font-weight:bold;font-size:25px;margin-bottom:5%;">
                        <div style="flex:1;padding-left:28%">病例</div>
                        <div style="flex:1;padding-right:20%">对照</div>
                    </div>

                    <el-form :label-position="labelPosition" label-width="100px"  :inline="true">
                          <el-form-item label="暴露">
                            <el-input v-model="form.caseOpenNum"></el-input>
                          </el-form-item>
                          <el-form-item label="">
                            <el-input v-model="form.ratioOpenNum"></el-input>
                          </el-form-item>
                    </el-form>
                    <el-form :label-position="labelPosition" label-width="100px"  :inline="true">
                          <el-form-item label="非暴露">
                            <el-input v-model="form.caseNum"></el-input>
                          </el-form-item>
                          <el-form-item label="">
                            <el-input v-model="form.ratioNum"></el-input>
                          </el-form-item>
                    </el-form>
                    <el-form>
                     <el-button type="primary"  @click="submit" style="margin-left:7%">开始计算</el-button>
                    </el-form>
                </div>
                <!-- right -->
                <div class="right_main">
                    <div class="right_main_top">
                        <div style="font-size:25px;font-weight:bold">计算结果</div>
                        <div class="num">OR值:{{msg}}</div>
                        <div class="num">RR值:{{rrValueStr}}</div>
                        <div class="num">95%可信区间:{{minOrStr}}--{{maxOrStr}}</div>
                        <div class="num">卡方值:{{kafangStr}}</div>
                        <div class="num">P值：{{pValueStr}}</div>
                    </div>
                    <div class="right_main_bottom">
                        <p>说明:</p>
                        <p>OR值包含1，说明暴露和发病无统计学关联</p>
                        <p>OR值不包含1，说明暴露和发病有统计学关联</p>
                        <p>p<0.05，说明OR值与1有统计学差异</p>
                        <p>p>0.05，说明OR值与1无统计学差异</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      form: {
        caseOpenNum: '',
        ratioOpenNum: '',
        caseNum: '',
        ratioNum: ''
      },
      msg: '',
      rrValueStr: '',
      pValueStr: '',
      maxOrStr: '',
      minOrStr: '',
      maxOrStr: '',
      kafangStr: '',
      labelPosition:'',
    }
  },
  methods: {
    showValidate() {
      // var val = this
      const { caseOpenNum, ratioOpenNum, caseNum, ratioNum } = this.form
      var myreg = /^\+?[1-9][0-9]*$/
      if (
        myreg.test(caseOpenNum) == false ||
        myreg.test(ratioOpenNum) == false ||
        myreg.test(caseNum) == false ||
        myreg.test(ratioNum) == false
      ) {
        this.$message({ type: 'error', message: '请输入大于0的整数！' })
        return
      }
      return true
    },
    submit() {
      if (this.showValidate()) {
        this.getOr()
        this.getOrRange()
      }
    },
    getOr() {
      //   console.log(this.form.caseOpenNum)

      axios({
        method: 'post',
        url: config.apiHost + '/data/getOR',
        data: {
          //请求参数

          caseOpenNum: this.form.caseOpenNum,
          ratioOpenNum: this.form.ratioOpenNum,
          caseNum: this.form.caseNum,
          ratioNum: this.form.ratioNum
        }
      })
        .then(result => {
          if (result.data.status == 200) {
            console.log(result.data.body)
            this.msg = result.data.body.msg
          }
        })
        .catch(function(response) {})
    },
    getOrRange() {
      axios({
        method: 'post',
        url: config.apiHost + '/data/getOrRange',
        data: {
          //请求参数

          caseOpenNum: this.form.caseOpenNum,
          ratioOpenNum: this.form.ratioOpenNum,
          caseNum: this.form.caseNum,
          ratioNum: this.form.ratioNum
        }
      })
        .then(result => {
          if (result.data.status == 200) {
            // this.msg = result.data.body.msg
            console.log(result.data.body)
            this.rrValueStr = result.data.body.rrValueStr
            this.pValueStr = result.data.body.pValueStr
            this.maxOrStr = result.data.body.maxOrStr
            this.minOrStr = result.data.body.minOrStr
            this.kafangStr = result.data.body.kafangStr
          }
        })
        .catch(function(response) {
          this.$message.error(response)
        })
    }
  }
}
</script>
<style scoped>
.rolebox {
  width: auto;
  min-height: 100%;
  /* text-align: left; */
  background-color: #e2e6ef;
  padding: 10px 10px 45px;
  box-sizing: border-box;
}
.top-main {
  height: 45px;
  line-height: 45px;
  text-align: left;
  padding-left: 10px;
  margin-bottom: 5px;
  background-color: #f6f7fb;
}
.rolemgr-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
  /* padding-bottom: 30px; */
  padding-top: 100px;
}
.container {
  width: auto;
  height: auto;
  background-color: #e2e6ef;
  padding: 10px 15px 45px 15px;
}
.tab_main {
  height: calc(100% - 45px);
  min-height: 800px;
  /* background-color: #FFFFFF; */
  display: flex;
}
.left_main {
  flex: 2;
  height: 100%;
}
.right_main {
  flex: 2;
  height: 100%;
  margin-left: 10px;
}
.right_main_top {
  border: 1px solid grey;
  width: 80%;
  height: 100%;
}
.right_main_bottom {
  margin-top: 50px;
}
.right_main_bottom p {
  text-align: left;
}
.num {
  font-weight: bold;
  height: 100%;
  width: auto;
  text-align: left;
  padding-left: 50px;
}
.form_item_div{
  display:flex;
}
.el-form--inline .el-form-item__label {
    font-size: 25px;
    }
</style>
