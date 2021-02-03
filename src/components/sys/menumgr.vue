<template>
  <div class="main">
    <!-- <div class="top-main">
          <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item >系统管理</el-breadcrumb-item>
                <el-breadcrumb-item >菜单管理</el-breadcrumb-item>
            </el-breadcrumb>
    </div>-->
    <div class="menumgr-container">
      <div class="btn-box">
        <el-button
          type="primary"
          size="small"
          @click="showAdd"
          v-if="config.hasPermission('sys:menu:save')"
          icon="el-icon-circle-plus-outline"
        >添加</el-button>
      </div>
      <tree-grid :items="data" :columns="columns" @on-row-click="rowClick" @on-two-click="TwoClick"></tree-grid>

      <!--添加菜单弹出框-->
      <el-dialog title="添加菜单" :visible.sync="dialogFormVisible">
        <form class="myform" :model="form">
          <div class="div-flex">
            <label for="type" class="label-block">类型</label>
            <div class="r-flex">
              <el-radio-group v-model="form.radio2">
                <el-radio :label="0" @change="changRadio(0)">目录</el-radio>
                <el-radio :label="1" @change="changRadio(1)">菜单</el-radio>
                <el-radio :label="2" @change="changRadio(2)">按钮</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="div-flex">
            <label class="label-block">
              <i style="color:red;font-size:16px;margin-right: 10px;">*</i>菜单名
            </label>
            <el-input v-model="form.name" placeholder="请输入内容"></el-input>
          </div>
          <div class="div-flex">
            <label class="label-block">
              <i style="color:red;font-size:16px;margin-right: 10px;">*</i>上级菜单
            </label>
            <!-- <el-input v-model="form.parent" placeholder="一级菜单" :disabled="true" ></el-input> -->
            <!-- <button  class="btn_one" @click="chooseMeun" >{{Menuitem}}</button> -->
            <div class="tree">
              <input
                class="input-tree"
                v-model="form.parentName"
                readonly="readonly"
                type="text"
                @click="choose"
              >
              <div class="etree" id="etree" v-show="isShow">
                <el-tree :data="MeunData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
          </div>
          <div v-show="dd" class="div-flex">
            <label class="label-block">
              <i style="color:red;font-size:16px;margin-right: 10px;">*</i>菜单URL
            </label>
            <el-input v-model="form.menuUrl" placeholder="请输入内容"></el-input>
          </div>
          <div v-show="ss" class="div-flex">
            <label class="label-block">
              <i style="color:red;font-size:16px;margin-right: 10px;">*</i>授权标识
            </label>
            <el-input v-model="form.perms" placeholder="请输入内容"></el-input>
          </div>
          <div v-show="pp" class="div-flex">
            <label class="label-block">
              <i style="color:red;font-size:16px;margin-right: 10px;">*</i>排序号
            </label>
            <el-input-number
              v-model="form.orderNum"
              controls-position="right"
              @change="handleChange"
              :min="1"
              :max="10"
            ></el-input-number>
          </div>
          <div v-show="tt" class="div-flex">
            <label class="label-block">
              <i style="color:red;font-size:16px;margin-right: 10px;">*</i>菜单图标
            </label>
            <!-- <el-input v-model="form.icon" placeholder="选择图片" :disabled="true"></el-input> -->
            <input
              class="input-tree"
              v-model="isImg"
              readonly="readonly"
              type="text"
              @click="ImgList"
            >
            <!--/api  -->
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="uploadInterface"
              :headers="myHeaders"
              :show-file-list="false"
              :auto-upload="true"
              :on-success="ImgOK"
            >
              <el-button slot="trigger" size="small" type="primary">上传</el-button>
            </el-upload>
          </div>
        </form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click="insertMeun">确定</el-button>
        </div>
      </el-dialog>

      <!--编辑菜单弹出框-->
      <el-dialog title="菜单编辑" :visible="dialogUpdatVisible">
        <div class="mybox">
          <form class="myform" :model="form">
            <div class="div-flex">
              <label class="label-block">菜单名</label>
              <el-input v-model="form.name" placeholder="请输入内容"></el-input>
            </div>
            <div class="div-flex">
              <label class="label-block">上级菜单</label>

              <div class="tree">
                <input
                  class="input-tree"
                  v-model="form.parentName"
                  readonly="readonly"
                  type="text"
                  @click="choose"
                >
                <div class="etree" id="etree" v-show="isShow">
                  <el-tree :data="MeunData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </div>
              </div>
            </div>
            <div class="div-flex" v-show="btnShow">
              <label class="label-block">菜单URL</label>
              <el-input v-model="form.menuUrl" placeholder="请输入内容"></el-input>
            </div>
            <div class="div-flex">
              <label class="label-block">授权标识</label>
              <el-input v-model="form.perms" placeholder="请输入内容"></el-input>
            </div>
            <div class="div-flex">
              <label class="label-block">排序号</label>
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                @change="handleChange"
                :min="1"
                :max="100"
              ></el-input-number>
            </div>
            <div class="div-flex" v-show="btnShow">
              <label class="label-block">菜单图标</label>
              <input
                class="input-tree"
                v-model="form.iconName"
                readonly="readonly"
                type="text"
                @click="ImgList"
              >
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadInterface"
                :headers="myHeaders"
                :show-file-list="false"
                :auto-upload="true"
                :on-success="ImgOK"
              >
                <el-button slot="trigger" size="small" type="primary">上传</el-button>
              </el-upload>
            </div>
          </form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEdit">取 消</el-button>
          <el-button type="primary" @click="updateMeun">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 选择图片弹出框 -->
      <el-dialog title="选择图片" :visible="dialogIncoVisible">
        <div v-for="(v,k) in IncoData" :key="k" class="div-flex chooseDiv" @click="chooseImg(v)">
          <div class="incoDiv">
            <!-- <img :src="v.completeSavePath+'?token=8bd78e56d04efb380429cd8045ae6121'" alt="" class="incoImg"> -->
            <img :src="v.completeSavePath+'?token='+token" alt class="incoImg">
          </div>
          <input type="text" readonly="readonly" v-model="v.fileName" class="incoInput">
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TreeGrid from "@/components/utils/TreeGrid";
var config = require("@/components/utils/Common_Config.js");
import axios from "axios";
var Cookies = require("js-cookie");
import qs from "qs";
export default {
  data() {
    return {
      config: config,
      columns: [
        {
          title: "菜单名",
          key: "name",
          sortable: true,
          width: "200"
        },
        {
          title: "级别",
          key: "level",
          width: "150"
        },
        {
          title: "菜单顺序",
          key: "orderNum",
          width: "150"
        },
        {
          title: "操作",
          type: "action",
          actions: [
            {
              type: "primary",
              text: "编辑"
            },
            {
              type: "error",
              text: "删除"
            }
          ],
          width: "150"
        }
      ],
      data: [],
      dialogFormVisible: false, //添加
      dialogIncoVisible: false, //选择图片
      dialogUpdatVisible: false, //编辑
      labelPosition: "right",
      MeunData: [],
      IncoData: [],
      defaultProps: {
        children: "list",
        label: "name"
      },
      Menuitem: "一级菜单", //当前选中菜单

      ss: "true", //授权标识
      pp: "true", //排序号
      tt: "true", //菜单图标
      dd: "true", //菜单URL

      isShow: false,
      isText: "请选择", //显示上级菜单名称
      isImg: "请选择", //显示图片名称
      fileList: [], //图片
      myHeaders: { token: Cookies.get("token") },
      updateId: "",

      form: {
        radio2: 0, //类型
        name: "", //名称
        parentId: "", //父级ID
        parentName: "请选择",
        delivery: false,
        menuUrl: "", //菜单url
        perms: "", //授权
        orderNum: 1, //排序
        icon: "请选择", //图标路径
        iconName: "" //图片名称
      },
      btnShow: true, //编辑时输入框的显示/隐藏

      token: "",
      uploadInterface: ""
    };
  },
  components: {
    TreeGrid
  },
  methods: {
    // 图片上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    //图片上传成功
    ImgOK(res, file, fileList) {
      // console.log("上传成功")
      // console.log(res.body);
      // this.form.icon=res.body.completeSavePath;
      this.form.icon = res.body.fileName;
      this.isImg = res.body.fileName; //获得图片名
      this.form.iconName = res.body.fileName;
    },
    //上级菜单 下拉列表中选中的值
    handleNodeClick(data) {
      //  console.log("下拉列表选中的值"+data.id);
      this.form.parentId = data.id;
      this.isShow = false;
      this.form.parentName = data.name;
      //  console.log(data);
    },
    //菜单列表
    getMenuList() {
      axios
        .get(config.apiHost + "/sys/menu/list", {
          params: {
            token: config.token
          }
        })
        .then(result => {
          // console.log("请求返回。。。");
          this.data = result.data;
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    // 表格树里面的编辑方法
    rowClick(data, event, id) {
      // console.log(data);
      // console.log(event);
      // console.log('点击的是编辑方法，id:' + id)
      // console.log('点击的是编辑方法，parentId:' + data.parentId)
      if (data.parentId == 2) {
        // 按钮
        this.btnShow = false;
      } else {
        this.btnShow = true;
      }
      this.updateId = id;
      this.form.name = data.name;
      this.form.parentId = data.parentId;
      this.form.parentName = data.parentName ? data.parentName : "请选择";
      this.form.orderNum = data.orderNum;
      this.form.radio2 = data.type;
      this.form.icon = data.icon;
      this.form.menuUrl = data.menuUrl;
      this.form.perms = data.perms;
      this.form.iconName =
        data.icon != null
          ? data.icon.substring(data.icon.lastIndexOf("/") + 1)
          : data.icon;
      this.dialogUpdatVisible = true;
      this.chooseMeun();
    },

    // 关闭编辑弹出框
    closeEdit() {
      this.dialogUpdatVisible = false;
      this.form = {
        radio2: 0, //类型
        name: "", //名称
        parentId: "", //父级ID
        parentName: "请选择",
        delivery: false,
        menuUrl: "", //菜单url
        perms: "", //授权
        orderNum: 1, //排序
        icon: "请选择", //图标路径
        iconName: "" //图片名称
      };
    },

    // 表格树里面的删除方法
    TwoClick(data, event, id) {
      // console.log('当前行数据:' + data)
      // console.log('当前行数据的名称:' + data.name)
      //  console.log('点击的是删除方法，id:' + id)
      this.$confirm("确定要删除该菜单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            axios
              .get(config.apiHost + "/sys/menu/delete", {
                params: {
                  //请求参数
                  token: config.token,
                  menuId: id
                }
              })
              .then(result => {
                // console.log(result.data.body)
                if (result.data.status == 200) {
                  this.getMenuList();
                }
                this.$message(result.data.body.msg);
              })
              .catch(response => {
                this.$message.error(response);
              });
          } else {
            this.$message({
              typ: "info",
              message: "已取消删除"
            });
          }
        },
        type: "warning"
      });
    },
    // 排序号
    handleChange(value) {
      // console.log(value);
    },
    // 点击添加
    showAdd() {
      this.dialogFormVisible = true;
      this.chooseMeun();
    },
    // 选择菜单列表
    chooseMeun() {
      axios
        .get(config.apiHost + "/sys/menu/select", {
          params: {
            token: config.token
          }
        })
        .then(result => {
          // console.log("请求返回。。。");
          this.MeunData = result.data.body.menuList;
          console.log(this.MeunData);
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
    },
    //  控制选择菜单下拉列表的展示和隐藏
    choose() {
      if (this.isShow) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    //  点击三个单选框表格样式控制
    changRadio(num) {
      // console.log(num+"^^^^^^")
      //ss授权标识 pp排序号 tt菜单图标 dd菜单URL
      if (num == 1) {
        //菜单
        (this.pp = true), (this.ss = true), (this.tt = true), (this.dd = true);
      } else if (num == 0) {
        //目录
        (this.pp = true), (this.tt = true), (this.dd = true), (this.ss = false);
      } else {
        //按钮
        (this.pp = false),
          (this.tt = false),
          (this.dd = false),
          (this.ss = true);
      }
    },
    //  添加方法
    insertMeun() {
      this.dialogFormVisible = false;
      // console.log(this.form);
      axios({
        method: "post",
        url: config.apiHost + "/sys/menu/save",
        data: {
          parentId: this.form.parentId,
          name: this.form.name,
          perms: this.form.perms,
          type: this.form.radio2,
          menuUrl: this.form.menuUrl,
          icon: this.form.icon,
          level: this.form.radio2 + 1, //等级
          isHide: false,
          description: null,
          orderNum: this.form.orderNum,
          updateAt: "2017-10-31 10:26:03",
          deleteFlag: false
        }
      })
        .then(res => {
          //  console.log("菜单添加成功");
          this.getMenuList();
          //  初始化表单对象
          this.form = {
            radio2: 0, //类型
            name: "", //名称
            parentId: "", //父级ID
            parentName: "请选择",
            delivery: false,
            menuUrl: "", //菜单url
            perms: "", //授权
            orderNum: 1, //排序
            icon: "请选择", //图标路径
            iconName: "" //图片名称
          };
          this.isText = "请选择";
          // console.log(res.data);
          return res.data;
        })
        .catch(function(response) {
          //   this.$message.error(error);
          // console.log(response);
        });
      //  this.Api.Menu_save({
      //             "parentId": this.form.parentId,
      //             "name": this.form.name,
      //             "perms": this.form.perms,
      //             "type": this.form.radio2,
      //             "menuUrl": this.form.menuUrl,
      //             "icon": this.form.icon,
      //             "level": this.form.radio2+1,//等级
      //             "isHide": false,
      //             "description": null,
      //             "orderNum": this.form.orderNum,
      //             "updateAt": "2017-10-31 10:26:03",
      //             "deleteFlag": false,
      //         })
      //      .then(res => {
      //         console.log("菜单添加成功");
      //          this.getMenuList();
      //         //  初始化表单对象
      //          this.form={
      //             radio2:0,//类型
      //             name: '',//名称
      //             parentId:'',//父级ID
      //             parentName:'请选择',
      //             delivery: false,
      //             menuUrl:'',//菜单url
      //             perms:'',//授权
      //             orderNum:1,//排序
      //             icon:'请选择',//图标路径
      //             iconName:''//图片名称
      //          }
      //         this.isText="请选择"
      //         console.log(res.data);
      //         return res.data;
      //     });
    },
    //  编辑菜单
    updateMeun(id) {
      axios({
        method: "post",
        // /api
        url: config.apiHost + "/sys/menu/update",
        data: {
          id: this.updateId,
          parentId: this.form.parentId,
          name: this.form.name,
          perms: this.form.perms,
          type: this.form.radio2,
          menuUrl: this.form.menuUrl,
          icon: this.form.icon,
          level: this.form.radio2 + 1, //等级
          isHide: false,
          description: null,
          orderNum: this.form.orderNum,
          updateAt: "2018-04-20 10:26:03",
          deleteFlag: false
        },
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          token: config.token
        }
      }).then(res => {
        if (res.data.status == "200") {
          this.getMenuList();
          //  初始化表单对象
          this.form = {
            radio2: 0, //类型
            name: "", //名称
            parentId: "", //父级ID
            parentName: "请选择",
            delivery: false,
            menuUrl: "", //菜单url
            perms: "", //授权
            orderNum: 1, //排序
            icon: "请选择", //图标路径
            iconName: "" //图片名称
          };
          this.isText = "请选择";
          this.dialogUpdatVisible = false;
        }
        return res.data;
      });
    },
    //图片列表
    ImgList() {
      this.dialogIncoVisible = true;
      //
      axios
        .get(config.apiHost + "/sys/menu/queryMenuIncos?token=" + config.token)
        .then(
          data => {
            // console.log("图片列表。。");

            this.IncoData = data.data.body;
          },
          Response => {
            // console.log(data.data.message);
          }
        );
    },
    //  选择图片
    chooseImg(item) {
      // console.log(item);
      this.form.icon = item.completeSavePath;
      this.form.iconName = item.fileName;
      this.isImg = item.fileName;
      this.dialogIncoVisible = false;
    }
  },
  created() {
    // 初始化菜单列表
    this.getMenuList();
    // 初始化添加表格样式
    this.changRadio(0);
    this.token = Cookies.get("token");
    this.uploadInterface = config.apiHost + "/sys/menu/upload";
  }
};
</script>

<style scoped>
.main {
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
.menumgr-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
  /* padding-bottom: 30px; */
}
.btn-box {
  float: left;
  margin: 15px;
}
.label-block {
  display: block;
  width: 100px;
}
.div-flex {
  display: flex;
  margin-top: 15px;
  align-items: center;
}
/* 下拉框div */
.input-tree {
  height: 40px;
  width: 300px;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #dcdfe6;
}
/* 上传按钮 */
.btn-up {
  width: 50px;
  height: 30px;
  background: #0099ff;
  color: white;
  margin-left: 15px;
  border: 1px solid #0099ff;
  border-radius: 4px;
}
.chooseDiv {
  width: 100%;
  height: 40px;
  margin-bottom: 15px;
  border: 1px solid #e2e2e3;
  border-radius: 4px;
  justify-content: center;
}
.incoInput {
  border: 0;
}
.incoDiv {
  width: 30px;
  height: 30px;
  margin-right: 20px;
}
.incoImg {
  width: 100%;
  height: 100%;
}
</style>


