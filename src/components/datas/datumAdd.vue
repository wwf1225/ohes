<template>
  <div class="datumBox">
    <div class="dtitle">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>资料管理</el-breadcrumb-item>
        <el-breadcrumb-item>资料添加</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button size="mini" type="primary" style="float: right; margin: auto 0" @click="closeAdd">返回</el-button>
    </div>
    <div class="datum-container">
      <div class="row_div">
        <div class="my_inp">文章标题</div>
        <el-input placeholder="请输入文章标题" style="width:40%;" v-model="addFrom.title"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">文章类型</div>
        <el-select v-model="addFrom.typeId" style="width:40%;" placeholder="请选择">
          <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="row_div">
        <div class="my_inp">疾病类型</div>
        <el-select v-model="secondId" placeholder="请选择" @change="selectSecond()" style="width: 187px;margin-right:10px;">
          <el-option v-for="item in secondList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>

        <el-select v-show="thirdShow" v-model="thirdId" placeholder="请选择" @change="selectThird()" style="width: 187px;margin-right:10px;">
          <el-option v-for="item in thirdList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>

        <el-select v-show="fouthShow" v-model="fouthId" placeholder="请选择" style="width: 187px;">
          <el-option v-for="item in fouthList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="row_div">
        <label class="my_inp">文章重要性</label>
        <div style="width:40%;">
          <el-radio v-model="addFrom.setTop" label='0'>普通</el-radio>
          <el-radio v-model="addFrom.setTop" label='1'>置顶</el-radio>
        </div>

      </div>
      <div class="row_div">
        <label class="my_inp">是否显示</label>
        <div style="width:40%;">
          <el-radio v-model="addFrom.displayFlag" label='1'>显示</el-radio>
          <el-radio v-model="addFrom.displayFlag" label='0'>不显示</el-radio>
        </div>
      </div>
      <div class="row_div">
        <div class="my_inp">文章作者</div>
        <el-input placeholder="请输入文章作者" style="width:40%;" v-model="addFrom.author"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">关键字</div>
        <el-input placeholder="请输入关键字" style="width:40%;" v-model="addFrom.keyword"></el-input>
      </div>
      <!-- 富文本编辑器 -->
      <div class="editor_box">
        <vue-html5-editor :content="addFrom.content" :min-height="300" @change="changeEditor"></vue-html5-editor>
      </div>
      <div class="row_div btn_style">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="confirm">保存</el-button>
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
      addFrom: {
        id: null,
        systemKey:'', //这个需要你定义一个系统变量
        typeId: null, // 类别ID
        title: '', //资料名称
        author: '', //作者
        setTop: '1', //置顶(1是0否)
        keyword: '', //关键字
        displayFlag: '1', //是否显示(1是0否)
        content: '', //内容
        diseaseType: '',
        diseaseLevel: '',
        diseaseId: ''
      },
      selectData: [],
      dtype: '',
      firstId: '',
      secondId: '',
      thirdId: '',
      fouthId: '',

      typeShow: false,
      // secondShow: false,
      thirdShow: false,
      fouthShow: false,

      firstList: [
        {
          name: '现况调查',
          id: '2'
        },
        {
          name: '个案调查',
          id: '1'
        },
        {
          name: '医生',
          id: '3'
        }
      ],
      secondList: [
        {
          name: '不明原因',
          id: '4' //6
        },
        {
          name: '传染病',
          id: '6' //9
        },
        {
          name: '食源性',
          id: '5' //4
        }
      ],
      thirdList: [],
      fouthList: [],

      infectiousDiseases: [
        //传染病
        {
          name: '甲',
          id: 1
        },
        {
          name: '乙',
          id: 2
        },
        {
          name: '丙',
          id: 3
        },
        {
          name: '其它',
          id: 5
        }
      ]
    }
  },
  methods: {
    selectSecond() {
      this.thirdId = ''
      this.fouthId = ''

      if (this.secondId == 6) {
        //传染病
        this.thirdShow = true
        this.fouthShow = true
        this.thirdList = this.infectiousDiseases
      } else if (this.secondId == 5) {
        //食源性
        this.thirdShow = true
        this.fouthShow = false
        this.fouthId = ''
        var _this = this
        axios({
          method: 'get',
          url: config.apiHost + '/disease/list?type=4'
        }).then(function(res) {
          _this.thirdList = res.data.body
        })
      } else {
        //不明原因
        this.thirdShow = false
        this.fouthShow = false
        // var _this = this
        // axios({
        //   method: 'get',
        //   url: config.apiHost + '/disease/list?type=6'
        // }).then(function(res) {
        //   _this.form.diseaseId = res.data.body[0].id

        // })
      }
    },
    selectThird() {
      this.fouthId = ''
      var _this = this

      if (this.fouthShow == true) {
        axios({
          method: 'get',
          url: config.apiHost + '/disease/list?type=' + _this.thirdId
        }).then(function(res) {
          _this.fouthList = res.data.body
        })
      }
    },

    closeAdd() {
      this.$router.go(-1)
    },
    // 添加
    confirm() {
      if (this.dtype == '添加') {
        this.add()
      } else if (this.dtype == '编辑') {
        this.update()
      }
    },
    // 添加资料
    add() {
      this.addFrom.diseaseType = this.secondId
      this.addFrom.diseaseLevel = this.thirdId
      this.addFrom.diseaseId = this.fouthId
      axios({
        method: 'post',
        url: config.datumUrl + '/resource/data/insertResource',
        data: this.addFrom,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          token: config.token
        }
      })
        .then(res => {
          // console.log(res);
          if (res.data.status == 200) {
            this.$message(res.data.body.msg)

            this.addFrom = {
              id: null,
              systemKey: this.systemKey, //这个需要你定义一个系统变量
              typeId: null, // 类别ID
              title: '', //资料名称
              author: '', //作者
              setTop: '1', //置顶 (1是0否)
              keyword: '', //关键字
              displayFlag: '1', //是否显示(1是0否)
              content: '文章详情' //内容
            }
            this.$router.go(-1)
          }
        })
        .catch(response => {
          this.$message.error(response)
        })
    },
    // 修改资料
    update() {
      this.addFrom.diseaseType = this.secondId
      this.addFrom.diseaseLevel = this.thirdId
      this.addFrom.diseaseId = this.fouthId
      axios({
        method: 'post',
        url: config.datumUrl + '/resource/data/updateResource',
        data: this.addFrom,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          token: config.token
        }
      })
        .then(res => {
          // console.log(res);
          if (res.data.status == 200) {
            this.$message(res.data.body.msg)

            this.addFrom = {
              id: null,
              systemKey: this.systemKey, //这个需要你定义一个系统变量
              typeId: null, // 类别ID
              title: '', //资料名称
              author: '', //作者
              setTop: '1', //置顶 (1是0否)
              keyword: '', //关键字
              displayFlag: '1', //是否显示(1是0否)
              content: '文章详情' //内容
            }
            this.$router.go(-1)
          }
        })
        .catch(response => {
          this.$message.error(response)
        })
    },
    //富文本取值
    changeEditor(e) {
      this.addFrom.content = e
    },
    // 查询类别列表数据
    getTypeList() {
      axios
        .get(config.datumUrl + '/resource/data/resTypeList', {
          params: {
            //请求参数
            page: 1,
            limit: 1000,
            parentId: this.$store.state.meun.navlist[7].list[0].id,
            systemKey: this.systemKey
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.selectData = result.data.body.list
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        })
    },
    // 根据资料Id查详情
    selectDetail() {
      var _this = this
      axios
        .get(config.datumUrl + '/resource/data/getResourceById', {
          params: {
            //请求参数
            id: this.addFrom.id,
            systemKey: this.systemKey
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            _this.addFrom = result.data.body
            _this.addFrom.displayFlag = _this.addFrom.displayFlag.toString() //单选按钮取值
            _this.addFrom.setTop = _this.addFrom.setTop.toString() //单选按钮取值
            _this.secondId = _this.addFrom.diseaseType==null?'':_this.addFrom.diseaseType.toString();
            _this.thirdId = _this.addFrom.diseaseLevel==null?'':_this.addFrom.diseaseLevel;
            _this.fouthId = _this.addFrom.diseaseId==null?'':_this.addFrom.diseaseId;
            
            if (_this.addFrom.diseaseType == 4) {
              //不明原因
              _this.fouthShow = false
              _this.thirdShow = false
            } else if (_this.addFrom.diseaseType == 5||_this.addFrom.diseaseType=="5") {
              //食源性
              
              _this.fouthShow = false
              _this.thirdShow = true
              
              
              axios({
                method: 'get',
                url: config.apiHost + '/disease/list?type=4'
              }).then(function(res) {
                _this.thirdList = res.data.body
              })
            } else if (this.addFrom.diseaseType == 6) {
              //传染病
              _this.fouthShow = true
              _this.thirdShow = true
              _this.thirdList=_this.infectiousDiseases
              

              axios({
                method: 'get',
                url: config.apiHost + '/disease/list?type=' + _this.thirdId
              }).then(function(res) {
                _this.fouthList = res.data.body
              })
            }
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
        })
    }
  },
  mounted() {
    this.getTypeList()
  },
  created() {
    this.dtype = this.$route.params.dtype
    this.systemKey=this.$route.params.systemKey;
    if (this.dtype == '添加') {
      this.addFrom = {
        id: null,
        systemKey: this.systemKey, //这个需要你定义一个系统变量
        typeId: null, // 类别ID
        title: '', //资料名称
        author: '', //作者
        setTop: '1', //置顶(1是0否)
        keyword: '', //关键字
        displayFlag: '1', //是否显示(1是0否)
        content: '文章详情' //内容
      }
    } else if (this.dtype == '编辑') {
      this.addFrom.id = this.$route.params.id
      this.selectDetail()
    }
    this.getTypeList()
  }
}
</script>
<style scoped>
.datumBox {
  width: auto;
  min-height: 100%;
  text-align: left;
  background-color: #e2e6ef;
  padding: 10px 15px 45px;
}
.dtitle {
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
.datum-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
  /* padding: 30px 0px;
   */
  padding: 30px 80px;
}
.editor_box {
  padding: 5px 15px;
}
.row_div {
  /* display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px; */
  display: inline-block;
  width: 100%;
  margin: 0 auto;
  height: 60px;
  line-height: 60px;
}
.my_inp {
  width: 100px;
  text-align: left;
  float: left;
  height: 60px;
}
.btn_style {
  margin-top: 30px;
}
</style>


