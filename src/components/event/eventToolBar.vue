<template>
  <div class="event-toolbar">
    <el-form :inline="true" :model="toolbarForm">
      <el-form-item label="搜索">
        <el-input v-model="toolbarForm.searchInfo" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="疾病类别">
        <el-cascader
          expand-trigger="hover"
          placeholder="请选择"
          :options="diseaseOptions"
          @change="diseaseChange"
          clearable
          :change-on-select="true"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="起始时间">
        <el-date-picker
          v-model="datePickerValueArr"
          clearable:true
          :picker-options="datePickerOptions"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="submitSearch" @click="onSubmitSearch" :loading="loading">查询</el-button>
        <el-button class="deleteMuch" @click="deleteMuch" v-if="showButton">批量删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
var config = require("@/components/utils/Common_Config.js");
export default {
  props: ["page", "limit", "status", "deleteids"],
  data() {
    return {
      loading: false,
      toolbarForm: {
        // 搜索信息 疾病类型id 疾病id 起始时间
        searchInfo: "",
        genre: "",
        diseaseId: "",
        startTime: "",
        endTime: "",
        page: "",
        limit: "",
        token: config.token,
        status: ""
      },
      diseaseOptions: [
        { value: 0, label: "传染病", children: [] },
        { value: 1, label: "食源性疾病", children: [] },
        { value: 2, label: "不明原因", children: [] }
      ],
      datePickerValueArr: [],
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      searchResultArr: {
        searchInfo: "",
        totalCount: 0,
        searchResultList: [],
        startTime: "",
        endTime: ""
      },
      // 显示 批量删除 按钮
      showDelSome: ["/home/event-now", "/home/event-survey"]
    };
  },
  methods: {
    onSubmitSearch() {
      this.loading = true;
      if (this.datePickerValueArr == null) {
        this.datePickerValueArr = ["", ""];
      }
      this.toolbarForm.startTime = this.splitTimeStr(
        this.datePickerValueArr[0]
      );
      this.toolbarForm.endTime = this.splitTimeStr(this.datePickerValueArr[1]);
      this.toolbarForm.page = this.$props.page;
      this.toolbarForm.limit = this.$props.limit;
      this.toolbarForm.status = this.$props.status;
      axios({
        method: "get",
        url: config.apiHost + "/current-events/event-list",
        params: this.toolbarForm
      })
        .then(result => {
          if (result.data.status == 200) {
            this.searchResultArr.searchInfo = this.toolbarForm.searchInfo;
            this.searchResultArr.totalCount = result.data.body.totalCount;
            this.searchResultArr.searchResultList = result.data.body.list;
            this.searchResultArr.startTime = this.toolbarForm.startTime;
            this.searchResultArr.endTime = this.toolbarForm.endTime;
            this.$emit("search-result-arr", this.searchResultArr);
            this.$emit("search-info", this.toolbarForm.searchInfo);
            this.loading = false;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    deleteMuch() {
      this.$confirm("是否确认删除选中事件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "get",
            url: config.apiHost + "/current-events/batch-delete",
            params: {
              eventId: this.$props.deleteids
            }
          })
            .then(result => {
              if (result.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.onSubmitSearch();
              }
            })
            .catch(e => {
              console.log(e);
              this.$message({
                type: "error",
                message: "删除失败"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async diseaseChange(dis) {
      this.toolbarForm.genre = dis[0];
      this.toolbarForm.diseaseId = dis.length > 1 ? dis[dis.length - 1] : "";
      const result = await axios({
        method: "get",
        url: config.apiHost + "/disease/listInfo",
        params: {
          typeId: this.toolbarForm.genre
        }
      });
      if (result.data.status == 200) {
        if (dis.length < 3) {
          this.diseaseOptions[dis[0]].children = result.data.body;
        }
      }
    },
    splitTimeStr(str) {
      if (str) {
        str =
          str.substr(0, 4) +
          "-" +
          str.substr(4, 2) +
          "-" +
          str.substr(6, 2) +
          " 00:00:00";
      }
      return str;
    }
  },
  computed: {
    showButton: function() {
      if (this.showDelSome.indexOf(this.$route.path) == -1) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style>
.event-toolbar {
  padding: 30px 8px 10px;
  text-align: left;
  box-shadow: 0px 2px 10px 0px rgba(16, 20, 26, 0.05);
  margin-bottom: 5px;
  background: #fff;
}
.el-form--inline .el-form-item {
  margin-right: 30px;
}
.submitSearch {
  background: #429e73;
  border: 1px solid #429e73;
  color: #fff;
}
.submitSearch:hover,
.submitSearch:focus {
  background: #006636;
  border: 1px solid #006636;
  color: #fff;
}
.deleteMuch {
  background: #fff;
  border: 1px solid #429e73;
  color: #429e73;
  margin-left: 30px !important;
}
.deleteMuch:hover,
.deleteMuch:focus{
  background: #006636;
  border: 1px solid #006636;
  color: #fff;
}
</style>
