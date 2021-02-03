<template>
  <!-- 其他采样 -->
  <div class="container eventDatialsPage">
    <div class="mytop">
      <div>
        <span>食物采样</span>
      </div>
      <div style=" float: right;">
        <el-input
          type="text"
          size="mini"
          v-model="formQuery.userName"
          placeholder="被调查人员"
          style="width:200px;float:left"
        ></el-input>
        <el-button size="mini" type="primary" @click="getListById" style="margin: 0 50px 0 20px">搜索</el-button>
        <el-button v-show="ispage=='编辑'" size="mini" type="primary" @click="addSample">添加</el-button>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      align="left"
      :data="tableData"
      border
      element-loading-text="加载中"
      tooltip-effect="dark"
      style="width: 100% ;"
    >
      <el-table-column type="selection" width="80" align="center"></el-table-column>
      <el-table-column prop="no" label="序号" align="center" width="80"></el-table-column>
      <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex=='MALE'">男</span>
          <span v-else-if="scope.row.sex=='FEMALE'">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="aged" label="年龄" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="professionName" label="职业" align="center"></el-table-column>
      <el-table-column prop="specimentName" label="样品名称" align="center"></el-table-column>
      <el-table-column label="检验结果" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.resultStatus==false" style="color:#666666">
            <i class="el-icon-error"></i>
          </span>
          <span
            v-else-if="scope.row.resultStatus==true"
            style="color:#0066FF"
            @click="showEnd(scope.row)"
          >
            <i class="el-icon-success"></i>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="text" title="查看" size="small" @click="show(scope.row)">
            <img src="../../assets/ck.png" alt>
          </el-button>
          <!-- <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="结果编辑"
            size="mini"
            @click.native.prevent="endEdit(scope.row)"
          >结果编辑</el-button> -->
          <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="编辑"
            size="small"
            @click.native.prevent="Edit(scope.row)"
          >
            <img src="../../assets/bj.png" alt>
          </el-button>
          <el-button
            v-show="ispage=='编辑'"
            type="text"
            title="删除"
            size="small"
            @click.native.prevent="del(scope.row)"
          >
            <img src="../../assets/sc.png" alt>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 class="block"-->
    <div style=" margin: 10px 0;text-align:center">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="limit"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>

    <!-- 结果编辑弹出框 -->
    <el-dialog title="结果编辑" :visible.sync="endEditVisible" :before-close="handleClose">
      <textarea style="width: 100%;height: 300px;" placeholder="请输入内容" v-model="formAdd.testResult"></textarea>
      <div class="file_div">
        <input class="inp_fu" type="text" v-model="fileName" readonly>
        <el-upload
          class="upload-demo upload_div"
          ref="upload"
          :action="apiUrl"
          :headers="myHeaders"
          :show-file-list="false"
          :on-success="okFile"
          :on-change="changeFile"
          accept=".mp4, .png, .jpg, .mov, .mp3, .doc, .xlsx"
          :data="formAdd"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </div>
      <div class="btndiv">
        <el-button type="info" size="medium" @click="endClose">取消</el-button>
        <el-button type="primary" size="medium" style="margin-left:50px" @click="saveEnd">保存</el-button>
      </div>
    </el-dialog>

    <!-- 查看结果编辑弹出框 -->
    <el-dialog title="查看结果编辑" :visible.sync="endShowVisible" :before-close="handleClose">
      <textarea style="width: 100%;height: 300px;" placeholder="请输入内容" v-model="endContent"></textarea>
      <div class="file_div" v-for="(item,index) in flieList" :key="index">
        <a :href="item.fileName" target="_blank">{{item.originalName}}</a>
      </div>
      <div class="btndiv">
        <el-button type="info" size="medium" @click="endShowClose">取消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑其他采样" :visible.sync="editVisible" :before-close="handleClose">
      <div class="row_div">
        <div class="my_inp">编号</div>
        <el-input placeholder="请输入编号" style="width:400px;" v-model="fromEdit.samplingNumber"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">姓名：</div>
        <el-input placeholder="请输入姓名" style="width:400px;" v-model="fromEdit.userName"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">性别：</div>
        <el-radio v-model="fromEdit.sex" label="MALE">男</el-radio>
        <el-radio v-model="fromEdit.sex" label="FEMALE">女</el-radio>
      </div>
      <div class="row_div">
        <div class="my_inp">年龄：</div>
        <el-input placeholder="请输入年龄" style="width:400px;" v-model="fromEdit.aged"></el-input>
      </div>
      <!-- <div class="row_div">
                <div class="my_inp">采样类型：</div>
                <el-select v-model="fromEdit.type"  placeholder="请选择">
                    <el-option
                    v-for="item in sampleType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
      </div>-->
      <div class="row_div">
        <div class="my_inp">职业：</div>
        <el-select v-model="fromEdit.profession" placeholder="请选择">
          <el-option v-for="item in workList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="row_div">
        <div class="my_inp">联系电话：</div>
        <el-input placeholder="请输入电话" style="width:400px;" v-model="fromEdit.phone"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品名称：</div>
        <el-radio-group v-model="fromEdit.speId">
          <el-radio :label="1">肺部深部吸物</el-radio>
          <el-radio :label="2">粪便</el-radio>
          <el-radio :label="3">肛拭</el-radio>
          <el-radio :label="4">咽拭子</el-radio>
          <el-radio :label="5">血样</el-radio>
          <el-radio :label="6">抠吐物</el-radio>
        </el-radio-group>
      </div>
      <div class="btndiv">
        <el-button type="info" size="medium" @click="closeEdit">取消</el-button>
        <el-button type="primary" size="medium" style="margin-left:50px" @click="editSample">保存</el-button>
      </div>
    </el-dialog>

    <!-- 查看弹出框 -->
    <el-dialog title="查看其他采样" :visible.sync="showVisible" :before-close="handleClose">
      <div class="row_div">
        <div class="my_inp">编号</div>
        <el-input
          placeholder="请输入编号"
          style="width:400px;"
          v-model="fromEdit.samplingNumber"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">姓名：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          v-model="fromEdit.userName"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">性别：</div>
        <el-radio v-model="fromEdit.sex" label="MALE">男</el-radio>
        <el-radio v-model="fromEdit.sex" label="FEMALE">女</el-radio>
      </div>
      <div class="row_div">
        <div class="my_inp">年龄：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          v-model="fromEdit.aged"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">职业：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          v-model="professionName"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">联系电话：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          v-model="fromEdit.phone"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品名称：</div>
        <el-radio-group v-model="fromEdit.speId">
          <el-radio :label="1">肺部深部吸物</el-radio>
          <el-radio :label="2">粪便</el-radio>
          <el-radio :label="3">肛拭</el-radio>
          <el-radio :label="4">咽拭子</el-radio>
          <el-radio :label="5">血样</el-radio>
          <el-radio :label="6">抠吐物</el-radio>
        </el-radio-group>
      </div>
      <div class="btndiv">
        <el-button type="info" size="medium" @click="closeShow">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加其他采样 -->
    <el-dialog title="添加其他采样" :visible.sync="addVisible" :before-close="handleClose">
      <div class="row_div">
        <div class="my_inp">编号</div>
        <el-input placeholder="请输入编号" style="width:400px;" v-model="fromEdit.samplingNumber"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">姓名：</div>
        <el-input placeholder="请输入内容" style="width:400px;" v-model="fromEdit.userName"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">性别：</div>
        <el-radio v-model="fromEdit.sex" label="MALE">男</el-radio>
        <el-radio v-model="fromEdit.sex" label="FEMALE">女</el-radio>
      </div>
      <div class="row_div">
        <div class="my_inp">年龄：</div>
        <el-input placeholder="请输入内容" style="width:400px;" v-model="fromEdit.aged"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">职业：</div>
        <el-select v-model="fromEdit.profession" placeholder="请选择">
          <el-option v-for="item in workList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="row_div">
        <div class="my_inp">联系电话：</div>
        <el-input placeholder="请输入内容" style="width:400px;" v-model="fromEdit.phone"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品名称：</div>
        <el-radio-group v-model="fromEdit.speId">
          <el-radio :label="1">肺部深部吸物</el-radio>
          <el-radio :label="2">粪便</el-radio>
          <el-radio :label="3">肛拭</el-radio>
          <el-radio :label="4">咽拭子</el-radio>
          <el-radio :label="5">血样</el-radio>
          <el-radio :label="6">呕吐物</el-radio>
        </el-radio-group>
      </div>
      <div class="btndiv">
        <el-button type="info" size="medium" @click="closeAdd">取消</el-button>
        <el-button type="primary" size="medium" style="margin-left:50px" @click="add">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
var Cookies = require("js-cookie");
export default {
  data() {
    return {
      apiUrl: "",
      formQuery: {
        userName: ""
      },
      formAdd: {
        eventId: null,
        samplingId: null,
        testResult: ""
        // typeLab:1,//1 其他采样 2外环境采样
      },
      fromEdit: {
        samplingNumber: "", //采样编号
        id: null,
        // type:null,//样品类型
        eventId: null,
        userName: "", //名称
        sex: "MALE",
        aged: "", //年龄
        profession: null, //职业
        phone: "", //联系电话
        speId: 1 //样品名称id
      },
      fileName: "",
      // myHeaders:{ 'token': config.token},
      myHeaders: { token: Cookies.get("token") },
      page: 1,
      limit: 10,
      totalCount: 0,
      tableData: [],
      eventId: "",
      ispage: "",
      // type:3,//2代表外环境采样,3代表其他采样(分开请求接口了)
      endEditVisible: false,
      endShowVisible: false,
      editVisible: false,
      showVisible: false,
      addVisible: false,
      professionName: "",
      workList: [],
      sampleType: [], //采样类型
      flieList: [],
      endContent: ""
    };
  },
  computed: {
    ...mapGetters(["event"])
  },
  methods: {
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getListById();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getListById();
    },
    // 得到其他采样列表
    getListById() {
      // console.log("其他采样列表~");
      axios
        .get(config.apiHost + "/otherSampling/list", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            eventId: this.event.id,
            userName: this.formQuery.userName
            //   type:this.type
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData = result.data.body.list;
            consol;
            this.totalCount = result.data.body.totalCount; //总条数
          } else {
            this.$message.error(result.data.body.message);
          }
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    // 弹出框关闭前
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.formAdd = {
            eventId: null,
            samplingId: null,
            testResult: ""
          };
          this.fromEdit = {
            samplingNumber: "", //采样编号
            id: null,
            eventId: null,
            userName: "", //名称
            sex: "MALE",
            aged: "", //年龄
            profession: null, //职业
            phone: "", //联系电话
            speId: 1 //样品名称id
          };
          this.professionName = "";
          this.fileName = "";
        })
        .catch(_ => {});
    },
    // 点击结果编辑
    endEdit(row) {
      this.endEditVisible = true;
      this.formAdd.samplingId = row.id;
      this.formAdd.eventId = this.event.id;
      // console.log(row);
    },
    // 点击保存结果编辑
    saveEnd() {
      this.$refs.upload.submit();
    },
    //文件改变
    changeFile(file) {
      // console.log("文件改变");
      // console.log(file);
      this.fileName = file.name;
    },
    //文件上传成功后
    okFile() {
      this.formAdd = {
        eventId: null,
        samplingId: null,
        testResult: ""
      };
      this.fileName = "";
      this.getListById();
      this.$message.success("添加成功");
      this.endEditVisible = false;
    },
    // 关闭结果编辑
    endClose() {
      this.formAdd = {
        eventId: null,
        samplingId: null,
        testResult: ""
      };
      this.fileName = "";
      this.endEditVisible = false;
    },
    // 关闭查看结果编辑
    endShowClose() {
      this.endShowVisible = false;
      this.flieList = [];
      this.endContent = "";
    },
    // 点击编辑
    Edit(row) {
      this.editVisible = true;
      this.getWork();
      this.fromEdit.samplingNumber = row.samplingNumber;
      this.fromEdit.id = row.id;
      this.fromEdit.eventId = this.event.id;
      this.fromEdit.userName = row.userName; //名称
      this.fromEdit.sex = row.sex;
      this.fromEdit.aged = row.aged; //年龄
      this.fromEdit.profession = row.profession; //职业
      this.fromEdit.phone = row.phone; //联系电话
      this.fromEdit.speId = row.speId; //样品名称id
    },
    // 得到职业列表/basedata/profession/list
    getWork() {
      axios
        .get(config.apiHost + "/basedata/profession/listAll", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.workList = result.data.body;
              // console.log(this.workList);
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },

    // 保存编辑
    editSample() {
      // console.log(this.fromEdit);
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/otherSampling/update",
        data: this.fromEdit,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      })
        .then(res => {
          // console.log(res);
          if (res.data.status == 200) {
            this.$message(res.data.body.msg);
            this.getListById();
            this.editVisible = false;
            this.fromEdit = {
              samplingNumber: "", //采样编号
              id: null,
              eventId: null,
              userName: "", //名称
              sex: "MALE",
              aged: "", //年龄
              profession: null, //职业
              phone: "", //联系电话
              speId: 1 //样品名称id
            };
          }
          return res.data;
        })
        .catch(response => {
          this.$message.error(response);
        });
    },
    // 关闭编辑
    closeEdit() {
      this.editVisible = false;
      this.fromEdit = {
        samplingNumber: "", //采样编号
        id: null,
        eventId: null,
        userName: "", //名称
        sex: "MALE",
        aged: "", //年龄
        profession: null, //职业
        phone: "", //联系电话
        speId: 1 //样品名称id
      };
    },
    //删除其他采样
    del(row) {
      this.$confirm("确定要删除该采样吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios
              .get(config.apiHost + "/otherSampling/delete", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: this.event.id,
                  surOtherSamplingId: row.id
                }
              })
              .then(
                result => {
                  // console.log(result.data.status);
                  if (result.data.status == 200) {
                    //删除成功
                    this.getListById();
                    this.$message.success(result.data.body.msg);

                    this.$store.dispatch("refNum", 3); //刷新父级组件
                  } else {
                    //删除失败
                    this.$message.error(result.data.body.message);
                  }
                },
                error => {
                  this.$message.error(error);
                }
              );
          } else {
            //点击取消
            this.$message({
              typ: "info",
              message: "已取消删除"
            });
          }
        },
        type: "warning"
      });
    },
    //点击查看
    show(row) {
      this.showVisible = true;
      this.fromEdit.samplingNumber = row.samplingNumber;
      this.fromEdit.id = row.id;
      this.fromEdit.userName = row.userName; //名称
      this.fromEdit.sex = row.sex;
      this.fromEdit.aged = row.aged; //年龄
      this.professionName = row.professionName; //职业
      this.fromEdit.phone = row.phone; //联系电话
      this.fromEdit.speId = row.speId; //样品名称id
    },
    // 关闭查看
    closeShow() {
      this.showVisible = false;
      this.fromEdit = {
        samplingNumber: "", //采样编号
        id: null,
        eventId: null,
        userName: "", //名称
        sex: "MALE",
        aged: "", //年龄
        profession: null, //职业
        phone: "", //联系电话
        speId: 1 //样品名称id
      };
      this.professionName = "";
    },
    // 点击添加按钮
    addSample() {
      this.addVisible = true;

      this.getWork();
    },
    // 确认添加
    add() {
      this.fromEdit.eventId = this.event.id;
      // console.log(this.fromEdit);
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/otherSampling/save",
        data: this.fromEdit,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      })
        .then(res => {
          // console.log(res);
          if (res.data.status == 200) {
            // this.$message(res.data.body.msg);
            this.$message.success("添加成功");
            this.getListById();
            this.addVisible = false;
            this.fromEdit = {
              samplingNumber: "", //采样编号
              id: null,
              eventId: null,
              userName: "", //名称
              sex: "MALE",
              aged: "", //年龄
              profession: null, //职业
              phone: "", //联系电话
              speId: 1 //样品名称id
            };
            this.$store.dispatch("refNum", 1); //刷新父级组件
          }
          return res.data;
        })
        .catch(response => {
          this.$message.error(response);
        });
    },
    closeAdd() {
      this.addVisible = false;
      this.fromEdit = {
        samplingNumber: "", //采样编号
        id: null,
        eventId: null,
        userName: "", //名称
        sex: "MALE",
        aged: "", //年龄
        profession: null, //职业
        phone: "", //联系电话
        speId: 1 //样品名称id
      };
    },
    //查看结果编辑
    showEnd(row) {
      this.endShowVisible = true;
      axios
        .get(config.apiHost + "/caseSample/selectOne", {
          params: {
            //请求参数
            token: config.token,
            caseSampleId: row.id,
            eventId: this.event.id,
            type: 3 //1、个案 2、外环境 3、其他采样
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.flieList = result.data.body.accessory;
              this.endContent = result.data.body.testingResult;
              console.log(this.flieList);
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    }
  },
  mounted() {
    if (this.event) {
      this.getListById();
      this.formAdd.eventId = this.event.id;
      this.ispage = this.event.ispage;
    }
  },
  created() {
    this.apiUrl = config.apiHost + "/otherSampling/resultUpdate";
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: white;
}
.mytop {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}
.mytop > div:nth-child(1) {
  padding: 0 20px;
  background: #000;
  border-radius: 5px 5px 0 0;
  background: #a5cfbb;
  color: #fff;
  border-left: 1px solid #ebeef5;
}
.btndiv {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.inp_fu {
  height: 35px;
  border: 1px solid #a9a9a9;
  border-radius: 4px;
  margin-right: 15px;
}
.file_div {
  display: flex;
}
.row_div {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.my_inp {
  width: 80px;
  text-align: left;
}
</style>
