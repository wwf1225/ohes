<template>
  <div class="container">
    <div class="table-div">
      <ul class="msg-ul">
        <li v-for="item in tableData" :key="item.id" :class="{isRead:item.readFlag==0}">
          <p class="title">
            <strong :class="{isRead:item.readFlag==0}">{{item.msgTitle}}</strong>
            {{item.createTime}}
          </p>
          <p class="info">{{item.msgContent}}</p>
          <p class="operation">
            <el-button type="text" size="small" title="查看" @click="msgDetail(item.id)">
              <img src="../assets/ck.png">
            </el-button>
            <el-button type="text" size="small" title="删除" @click="msgDel(item.id)">
              <img src="../assets/sc.png">
            </el-button>
          </p>
        </li>
      </ul>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="limit"
        style="background-color:#fff;padding-bottom:20px;"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        background
      ></el-pagination>
    </div>
    <el-dialog width="25%" class="add-dialog" title="事件发布详情" :visible.sync="dialogVisible">
      <p class="dialog-p">{{showItem.msgContent}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button class="ok" type="text" size="small" @click="msgDel(showItem.id)">删 除</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  data() {
    return {
      config: config,
      tableData: [], //列表数据
      page: 1, //当前页
      limit: 10,
      currPage: 1,
      totalCount: 0, //总条数
      totalPage: 0, //总页数
      dialogVisible: false,
      showItem: {}
    };
  },
  methods: {
    getMsgList() {
      axios
        .get(config.apiHost + "/sys/msg/userMsgList", {
          params: {
            //请求参数
            page: this.page,
            limit: this.limit
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.tableData = result.data.body.list;
              this.totalCount = result.data.body.totalCount; //总条数
            } else {
              this.$message.error(result.data.body.msg);
            }
          },
          error => {
            this.$message.error(error);
          }
        )
        .then(text => {
          this.msg = text;
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getMsgList();
    },
    handleSelectionChange(selection) {
      this.tableSelection = selection;
    },
    //查看
    msgDetail(id) {
      this.dialogVisible = true;
      axios({
        method: "post",
        url: config.apiHost + "/sys/msg/userReadMsg",
        data: {
          id: id
        }
      }).then(result => {
        if (result.data.status == 200) {
          var index = this.tableData.findIndex(v => v.id == id);
          this.tableData[index].readFlag = 1;
          this.showItem = this.tableData[index];
          this.$store.commit('minusUnReadMsg')
        } else {
          this.$message.error(this.data.body.msg);
        }
      });
    },
    //删除
    msgDel(id) {
      this.$confirm("确定要删除该消息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            axios({
              method: "post",
              url: config.apiHost + "/sys/msg/deleteUserMsg",
              data: {
                //请求参数
                id: id
              }
            }).then(
              result => {
                if (result.data.status == 200) {
                  this.dialogVisible = false;
                  this.getMsgList();
                  this.$message.success(result.data.body.msg);
                } else {
                  this.$message.error(result.data.body.message);
                }
              },
              function(error) {
                this.$message.error(error);
              }
            );
          }
        },
        type: "warning"
      });
    }
  },
  created() {
    this.getMsgList();
  },
  watch: {
    $route: {
      handler(to) {
        if (to.query.msgid) {
          this.dialogVisible = true;
          this.msgDetail(to.query.msgid);
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.container {
  /* width: auto;
    height: auto;
    background-color: #e2e6ef;
    padding: 10px 15px 45px 15px;
    width: auto; */
  min-height: 100%;
  /* text-align: left; */
  /* background-color: #e2e6ef; */
  padding: 10px 10px 45px;
  box-sizing: border-box;
  margin-top: 0px;
}
.table-div {
  padding: 30px 70px;
  background: #fff;
}
.table-div .el-table {
  border-radius: 8px 8px 0 0;
}
.table-div .el-pagination {
  padding: 50px !important;
  border-radius: 0 0 8px 8px;
}

#classroom_add,
#classroom_edit {
  width: 500px;
  margin: 0 auto;
}

.title-header {
  text-align: left;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  background-color: #f0f3f8;
  padding-left: 10px;
  margin-bottom: 10px;
}
.mainhead {
  background-color: #fff;
  text-align: left;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
}

/* ############# */
.msg-ul li {
  position: relative;
  font-size: 14px;
  text-align: left;
  color: #ccc;
  padding: 5px 15% 10px 10px;
  border-bottom: 1px solid #eee;
}
.msg-ul li:hover {
  background: #eee;
}
.msg-ul li.isRead {
  color: #666;
}
.msg-ul li p.title {
  height: 35px;
  line-height: 35px;
}
.msg-ul li p.title strong {
  margin-right: 20px;
  font-size: 15px;
  padding-left: 5px;
}
.msg-ul li p.title strong.isRead {
  color: #429e73;
}
.msg-ul li p.info {
  min-height: 25px;
  line-height: 25px;
}
.msg-ul li p.operation {
  height: 50px;
  line-height: 50px;
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
}
.msg-ul li p.operation .el-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  outline-style: none;
  border: none;
}
.msg-ul li p.operation .el-button:first-child {
  margin-right: 10px;
}
.msg-ul li p.operation .el-button:first-child:hover img,
.msg-ul li p.operation .el-button:last-child:hover img {
  display: none;
}
.msg-ul li p.operation .el-button:first-child:hover {
  background: url(../assets/msg-see-hover.png) no-repeat center;
}
.msg-ul li p.operation .el-button:last-child:hover {
  background: url(../assets/msg-delete-hover.png) no-repeat center;
}
.ok {
  width: 150px;
  font-size: 14px;
  background: #429e73;
  color: #fff;
}
.ok:hover {
  background: #006636;
}
.dialog-p {
  text-align: left;
  padding: 0 20px;
  margin: 50px 0;
}
</style>