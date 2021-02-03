<template>
  <!-- 外环境采样 -->
  <div class="container eventDatialsPage">
    <div class="mytop">
      <div>
        <span>外环境采样</span>
      </div>
      <div style=" float: right;">
        <el-input
          type="text"
          size="mini"
          v-model="formQuery.sampName"
          placeholder="样品名称"
          style="width:200px;float:left"
        ></el-input>
        <el-button size="mini" type="primary" @click="getListById" style="margin: 0 50px 0 20px">搜索</el-button>
        <el-button v-show="ispage=='编辑'" size="mini" type="primary" @click="addBtn">添加</el-button>
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
      <el-table-column prop="sampName" label="样品名称" align="center"></el-table-column>
      <el-table-column prop="amount" label="样品数量" align="center"></el-table-column>
      <el-table-column prop="sampTime" label="采样时间" align="center"></el-table-column>
      <el-table-column prop="address" label="采样地点" align="center"></el-table-column>
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
          <el-button type="text" title="查看" size="small" @click="showSample(scope.row)">
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
            @click.native.prevent="editBtn(scope.row)"
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
        layout="total,prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>

    <!-- 添加外环境采样弹出框 -->
    <el-dialog :title="msgtitle" :visible.sync="addVisible" :before-close="handleClose">
      <div class="row_div">
        <div class="my_inp">编号</div>
        <el-input placeholder="请输入编号" style="width:400px;" v-model="outForm.samplingNumber"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品名称：</div>
        <el-input placeholder="请输入内容" style="width:400px;" v-model="outForm.sampName"></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品数量：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          onkeyup="value=value.replace(/[^\d]/g,'')"
          v-model="outForm.amount"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品类型：</div>
        <el-select v-model="outForm.type" placeholder="请选择" @change="changeType">
          <el-option v-for="item in sampleType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="outForm.categoryId" placeholder="请选择" style="margin-left:15px">
          <el-option
            v-for="item in sampleTwoType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="row_div">
        <div class="my_inp">采样时间：</div>
        <!-- <el-input placeholder="请输入内容" style="width:400px;" v-model="outForm.sampTime"></el-input> -->
        <el-date-picker v-model="outForm.sampTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </div>
      <div class="row_div">
        <div class="my_inp">采样地点：</div>
        <el-input placeholder="请输入内容" style="width:400px;" v-model="outForm.address"></el-input>
      </div>

      <div class="btndiv">
        <el-button type="info" size="medium" @click="closeAdd">取消</el-button>
        <el-button type="primary" size="medium" style="margin-left:50px" @click="confirmAdd">保存</el-button>
      </div>
    </el-dialog>

    <!-- 结果编辑弹出框 -->
    <el-dialog title="结果编辑" :visible.sync="endEditVisible" :before-close="handleClose">
      <textarea
        style="width: 100%;height: 300px;"
        placeholder="请输入内容"
        v-model="formAdd.testResult"
        ref="textarea"
      ></textarea>
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

    <!-- 查看外环境采样弹出框 -->
    <el-dialog title="查看外环境采样" :visible.sync="showVisible" :before-close="handleClose">
      <div class="row_div">
        <div class="my_inp">编号</div>
        <el-input
          placeholder="请输入编号"
          style="width:400px;"
          v-model="outForm.samplingNumber"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品名称：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          v-model="outForm.sampName"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品数量：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          v-model="outForm.amount"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">样品类型：</div>
        <el-select v-model="outForm.type" placeholder="请选择">
          <el-option v-for="item in sampleType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <el-select v-model="outForm.categoryId" placeholder="请选择" style="margin-left:15px">
          <el-option
            v-for="item in sampleTwoType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="row_div">
        <div class="my_inp">采样时间：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          v-model="outForm.sampTime"
          readonly="readonly"
        ></el-input>
      </div>
      <div class="row_div">
        <div class="my_inp">采样地点：</div>
        <el-input
          placeholder="请输入内容"
          style="width:400px;"
          v-model="outForm.address"
          readonly="readonly"
        ></el-input>
      </div>

      <div class="btndiv">
        <el-button type="info" size="medium" @click="closeShow">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import moment from "moment";
var config = require("@/components/utils/Common_Config.js");
var Cookies = require("js-cookie");
export default {
  data() {
    return {
      msgtitle: "添加外环境采样",
      formQuery: {
        sampName: ""
      },
      apiUrl: "",
      outForm: {
        id: null,
        // type:2,//1 其他采样 2外环境采样
        eventId: null,
        speId: null,
        samplingNumber: "", //样品编号
        sampName: "", //样品名称
        amount: null, //样品数量
        type: null, //样品类型
        categoryId: null, //样品类型2
        sampTime: new Date(), //采样时间
        address: "" //采样地点
      },
      formAdd: {
        eventId: null,
        samplingId: null,
        testResult: ""
        // typeLab:2,//1 其他采样 2外环境采样
      },
      // myHeaders:{ 'token': config.token},
      myHeaders: { token: Cookies.get("token") },
      fileName: "",
      page: 1,
      limit: 10,
      totalCount: 0,
      tableData: [],
      eventId: "",
      ispage: "",
      type: 2, //2代表外环境采样,3代表其他采样
      sampleType: [], //采样类型
      sampleTwoType: [], //采样类型2
      addVisible: false,
      endEditVisible: false,
      endShowVisible: false,
      showVisible: false,
      mypage: "",
      typeOne: null,
      flieList: [],
      endContent: ""
      // sampleTypeId:null,
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
    // 弹出框关闭前
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.outForm = {
            id: null,
            // type:2,
            eventId: null,
            speId: null,
            samplingNumber: "", //样品编号
            sampName: "", //样品名称
            amount: null, //样品数量
            type: null, //样品类型
            categoryId: null, //样品类型2
            sampTime: "", //采样时间
            address: "" //采样地点
          };
        })
        .catch(_ => {});
    },
    getListById() {
      // console.log("外环境采样列表~");
      //
      axios
        .get(config.apiHost + "/survey/samplinglist", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit,
            token: config.token,
            eventId: this.event.id,
            sampName: this.formQuery.sampName,
            type: this.type //1 其他采样 2外环境采样
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            this.tableData = result.data.body.list;
            console.log(this.tableData);
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
    // 点击添加按钮
    addBtn() {
      this.mypage = "添加";
      this.msgtitle = "添加外环境采样";
      this.addVisible = true;
      this.getType();
    },
    // 点击编辑按钮
    editBtn(row) {
      this.mypage = "编辑";
      this.msgtitle = "编辑外环境采样";
      this.addVisible = true;
      this.getType();
      this.outForm.id = row.id;
      this.outForm.eventId = this.event.id;
      (this.outForm.speId = row.speId),
        (this.outForm.samplingNumber = row.samplingNumber); //样品编号
      this.outForm.sampName = row.sampName; //样品名称
      this.outForm.amount = row.amount; //样品数量
      this.outForm.type = row.type; //样品类型
      this.outForm.categoryId = row.categoryId;
      this.outForm.sampTime = row.sampTime; //采样时间
      this.outForm.address = row.address; //采样地点
      this.getTypeTwo();
    },
    // 点击确认添加
    confirmAdd() {
      this.outForm.eventId = this.event.id;
      // console.log(this.outForm);
      if (this.mypage == "添加") {
        this.add();
      } else if (this.mypage == "编辑") {
        this.edit();
      }
    },
    // 添加
    add() {
      let mytime = this.outForm.sampTime;
      this.outForm.sampTime = moment(mytime).format("YYYY-MM-DD HH:mm:ss");
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/survey/savespecimen",
        data: this.outForm,
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      })
        .then(res => {
          console.log(res);
          if (res.data.status == 200) {
            // this.$message(res.data.body.msg);
            this.$message.success("添加成功");
            this.getListById();
            this.addVisible = false;
            this.outForm = {
              id: null,
              // type:2,
              eventId: null,
              speId: null,
              samplingNumber: "", //样品编号
              sampName: "", //样品名称
              amount: null, //样品数量
              type: null, //样品类型
              categoryId: null, //样品类型2
              sampTime: "", //采样时间
              address: "" //采样地点
            };
          }

          this.$store.dispatch("refNum", 1); //刷新父级组件

          return res.data;
        })
        .catch(response => {
          this.$message.error(response);
        });
    },
    // 编辑
    edit() {
      // console.log(this.outForm);
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/survey/savespecimen",
        data: this.outForm
      })
        .then(res => {
          // console.log(res);
          if (res.data.status == 200) {
            this.$message("修改成功");
            this.getListById();
            this.addVisible = false;
            this.outForm = {
              id: null,
              // type:2,
              eventId: null,
              speId: null,
              samplingNumber: "", //样品编号
              sampName: "", //样品名称
              amount: null, //样品数量
              type: null, //样品类型
              categoryId: null, //样品类型2
              sampTime: "", //采样时间
              address: "" //采样地点
            };
          }
          return res.data;
        })
        .catch(response => {
          this.$message.error(response);
        });
    },
    // 关闭添加窗口
    closeAdd() {
      this.addVisible = false;
      this.outForm = {
        id: null,
        // type:2,
        eventId: null,
        speId: null,
        samplingNumber: "", //样品编号
        sampName: "", //样品名称
        amount: null, //样品数量
        type: null, //样品类型
        categoryId: null, //样品类型2
        sampTime: "", //采样时间
        address: "" //采样地点
      };
      this.typeOne = null;
    },
    //得到采样类型
    getType() {
      // axios.get(config.apiHost +'/sampleType',{
      axios
        .get(config.apiHost + "/sampleCategory/list", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.sampleType = result.data.body;
              // console.log(this.sampleType);
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    changeType(id) {
      // console.log("############"+id);
      // this.sampleTypeId=id;
      this.outForm.categoryId = null;
      this.sampleTwoType = [];
      this.getTypeTwo();
    },
    //得到采样类型2
    getTypeTwo() {
      axios
        .get(config.apiHost + "/sampleCategory/listBySampleTypeId", {
          params: {
            //请求参数
            token: config.token,
            sampleTypeId: this.outForm.type
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.sampleTwoType = result.data.body;
              // console.log(this.sampleType);
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    //删除采样
    del(row) {
      this.$confirm("确定要删除该采样吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios
              .get(config.apiHost + "/survey/deletesampling", {
                params: {
                  //请求参数
                  token: config.token,
                  eventId: this.event.id,
                  id: row.id
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

    // 点击结果编辑
    endEdit(row) {
      this.endEditVisible = true;
      this.formAdd.samplingId = row.id;
      this.formAdd.eventId = this.event.id;
      // console.log(row);
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
            type: 2 //1、个案 2、外环境 3、其他采样
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
    },
    // 关闭查看结果编辑
    endShowClose() {
      this.endShowVisible = false;
      this.flieList = [];
      this.endContent = "";
    },
    // 点击保存结果编辑
    saveEnd() {
      if (this.$refs.textarea.value == "") {
        this.$message({ type: "error", message: "信息不能为空" });
        return;
      }

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
    //查看采样
    showSample(row) {
      this.showVisible = true;
      this.getType();

      this.outForm.samplingNumber = row.samplingNumber; //样品编号
      this.outForm.sampName = row.sampName; //样品名称
      this.outForm.amount = row.amount; //样品数量
      this.outForm.type = row.type; //样品类型
      this.outForm.categoryId = row.categoryId;
      this.outForm.sampTime = row.sampTime; //采样时间
      this.outForm.address = row.address; //采样地点

      this.getTypeTwo();
    },
    closeShow() {
      this.showVisible = false;
      this.outForm = {
        id: null,
        // type:2,
        eventId: null,
        speId: null,
        samplingNumber: "", //样品编号
        sampName: "", //样品名称
        amount: null, //样品数量
        type: null, //样品类型
        categoryId: null, //样品类型2
        sampTime: "", //采样时间
        address: "" //采样地点
      };
    }
  },
  mounted() {
    if (this.event) {
      this.getListById();
      this.ispage = this.event.ispage;
    }
  },
  created() {
    this.apiUrl = config.apiHost + "/survey/testresult";
  }
};
</script>

<style>
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
.row_div {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.my_inp {
  width: 80px;
  text-align: left;
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
</style>
