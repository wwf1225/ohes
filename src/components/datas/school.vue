<template>
  <div>
    <div class="top_box">学校信息列表</div>
    <div class="top_box">
      <el-button type="primary" size="small" @click="add">+添加信息</el-button>
      <el-button type="primary" size="small" @click="leadin">批量导入</el-button>
      <el-button type="primary" size="small" @click="remove">-删除信息</el-button>
    </div>
    <!-- 表格 -->
    <template>
      <el-table ref="multipleTable" :data="rows" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column label="所属区县乡镇(街道)" prop="areaName" align="center">
        </el-table-column>
        <el-table-column prop="name" label="学校名称" align="center">
        </el-table-column>
        <el-table-column label="学校类别" prop="typeName" align="center">
        </el-table-column>
        <el-table-column label="占地面积" prop="areaCovered" align="center">
        </el-table-column>
        <el-table-column label="联系电话" prop="phone" align="center">
        </el-table-column>
        <el-table-column label="学校地址" prop="address" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" round @click="handleClick(scope.row)" type="text">查看</el-button>
            <el-button size="mini" round @click="editor(scope.row)" type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="formQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </template>
    <!-- 导出 -->
    <el-dialog title="导入" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <span>
          模板文件下载：
        </span>
        <span style="padding:0 15px">
          学校模板.xls
        </span>
        <span style="color:red">
          (提示:导入的信息必须符合模板文件的要求)
        </span>
        <el-button type="primary" @click="dialogVisible = false">导入</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加的dialog -->
    <el-dialog title="添加信息" :visible.sync="dialogFormVisible" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="margin: 0 auto;text-align:left;" label-width="150px" :model="formI" label-position="right">
        <el-form-item label="学校名称" required>
          <el-input v-model="formI.name"></el-input>
        </el-form-item>
        <el-form-item label="占地面积" required>
          <el-input v-model="formI.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="教学面积">
          <el-input v-model="formI.teachingArea"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="formI.phone"></el-input>
        </el-form-item>
        <el-form-item label="教学楼总数">
          <el-input v-model="formI.academicBuilding"></el-input>
        </el-form-item>
        <el-form-item label="综合楼总数">
          <el-input v-model="formI.officeBuilding"></el-input>
        </el-form-item>
        <el-form-item label="学生人数">
          <el-input v-model="formI.stuNum"></el-input>
        </el-form-item>
        <el-form-item label="住校人数">
          <el-input v-model="formI.residenceNum"></el-input>
        </el-form-item>
        <el-form-item label="职工人数">
          <el-input v-model="formI.teacherNum"></el-input>
        </el-form-item>
        <el-form-item label="学校类别" required>
          <el-select v-model="formI.leveType" style="width:206px">
            <el-option v-for="item in itemList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校地址" required>
          <el-input v-model="formI.address" style="width:568px;"></el-input>
        </el-form-item>
        <el-form-item label="学校环境及建筑描述">

          <vue-html5-editor class="editor" :content="formI.schoolLayout" :height="200" id="myeditor" style="width:568px;" @change="addSchoolLayout"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="学校作息时间">

          <vue-html5-editor class="editor" :content="formI.timeTable" :height="200" id="myeditor" style="width:568px;" @change="addTimeTable"></vue-html5-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmII">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑的dialog -->
    <el-dialog title="编辑信息" :visible.sync="dialogTwo" width="60%">
      <el-form :inline="true" class="demo-form-inline" label-width="150px" style="margin: 0 auto;text-align:left;" :model="form" label-position="right">
        <el-form-item label="学校名称" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="占地面积" required>
          <el-input v-model="form.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="教学面积">
          <el-input v-model="form.teachingArea"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="教学楼总数">
          <el-input v-model="form.academicBuilding"></el-input>
        </el-form-item>
        <el-form-item label="综合楼总数">
          <el-input v-model="form.officeBuilding"></el-input>
        </el-form-item>
        <el-form-item label="学生人数">
          <el-input v-model="form.stuNum"></el-input>
        </el-form-item>
        <el-form-item label="住校人数">
          <el-input v-model="form.residenceNum"></el-input>
        </el-form-item>
        <el-form-item label="职工人数">
          <el-input v-model="form.teacherNum"></el-input>
        </el-form-item>
        <el-form-item label="学校类别" required>
          <el-select v-model="form.leveType" style="width:202px">
            <el-option v-for="item in itemList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校地址" required>
          <el-input v-model="form.address" style="width:568px;"></el-input>
        </el-form-item>
        <el-form-item label="学校环境及建筑描述">

          <vue-html5-editor class="editor" :content="form.schoolLayout" :height="200" id="myeditor" style="width:568px;" @change="editSchoolLayout"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="学校作息时间">

          <vue-html5-editor class="editor" :content="form.timeTable" :height="200" id="myeditor" style="width:568px;" @change="editTimeTable"></vue-html5-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTwo = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看的dialog -->
    <el-dialog title="查看信息" :visible.sync="dialogOne" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="margin: 0 auto;text-align:left;" label-position="right" label-width="150px" :model="form">
        <el-form-item label="学校名称">
          <el-input v-model="form.name" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="占地面积">
          <el-input v-model="form.areaCovered" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="教学面积">
          <el-input v-model="form.teachingArea" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="教学楼总数">
          <el-input v-model="form.academicBuilding" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="综合楼总数">
          <el-input v-model="form.officeBuilding" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="学生人数">
          <el-input v-model="form.stuNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="住校人数">
          <el-input v-model="form.residenceNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="职工人数">
          <el-input v-model="form.teacherNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="学校类别">
          <el-input v-model="form.typeName" readonly="readonly"></el-input>

        </el-form-item>
        <el-form-item label="学校地址">
          <el-input v-model="form.address" style="width:568px;margin-bottom: 8px;" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="学校环境及建筑描述" style="position:  relative;">

          <vue-html5-editor class="editor" style="margin-top: -30px;width:568px;margin-bottom: 8px;" :content="form.schoolLayout" :height="200"></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
        <el-form-item label="学校作息时间" style="position:  relative;">

          <vue-html5-editor class="editor" style="margin-top: -30px;width:568px" :content="form.timeTable" :height="200"></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="dialogOne = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import axios from 'axios'
import vue from 'vue'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      formQuery: {
        eventName: '',
        pageSize: 10,
        pageNum: 1
      },
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      dialogFormVisible: false,
      dialogVisible: false,
      form: {
        id: '', //id
        name: '', //学校名称
        address: '', //学校地址
        areaCovered: '', //占地面积
        officeBuilding: '', //综合楼总数
        residenceNum: '', //住校人数
        schoolLayout: '', //学校环境及建筑描述
        stuNum: '', //学生人数
        teacherNum: '', //职工人数
        teachingArea: '', //教学面积
        academicBuilding: '', //教学楼总数
        timeTable: '', //学校作息时间
        leveType: '', //学校类别
        areaId: '',
        phone: '', //联系电话
        type: 1
      },
      formI: {
        name: '', //学校名称
        address: '', //学校地址
        areaCovered: '', //占地面积
        officeBuilding: '', //综合楼总数
        residenceNum: '', //住校人数
        schoolLayout: '', //学校环境及建筑描述
        stuNum: '', //学生人数
        teacherNum: '', //职工人数
        teachingArea: '', //教学面积
        academicBuilding: '', //教学楼总数
        timeTable: '', //学校作息时间
        leveType: '', //学校类别
        areaId: '',
        phone: '', //联系电话
        type: 1
      },
      itemList: [],
      rows: [],
      genrethree: '',
      dialogOne: false,
      dialogTwo: false,
      val: [],
      labelPosition: 'left'
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'schoolList'
  },
  methods: {
    // 编辑
    editor(row) {
      console.log(row)
      this.dialogTwo = true
      this.form = {}
      axios
        .get(config.apiHost + '/placeMain/place/getAreaSchoolByOne', {
          params: {
            //请求参数
            params: row.id
          }
        })
        .then(result => {
          // let Data = result.data.body
          this.form = result.data.body
        })
        .catch(function(response) {
          //   this.$message.error(error);
        })
      this.dropdown()
    },
    confirm() {
      var _this = this
      this.$confirm('确定要修改数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            this.form.id = this.form.joinId
            if (
              _this.form.name == '' ||
              _this.form.areaCovered == '' ||
              _this.form.phone == '' ||
              _this.form.leveType == '' ||
              _this.form.address == ''
            ) {
              _this.$message.info('请检查必填项不能为空')
              return
            } else {
              axios({
                method: 'post',
                // /api
                url: config.apiHost + '/placeMain/place/updateAreaPlace',
                data: _this.form
              })
                .then(result => {
                  if (result.data.status == 200) {
                    _this.dialogTwo = false
                    _this.$message.success('修改成功')
                    _this.schoolList()
                  } else {
                    _this.$message.error(result.data.body.message)
                  }
                })
                .catch(function(response) {
                  //   this.$message.error(error);
                })
            }
          }
        }
      })
    },
    // 下拉框
    dropdown() {
      this.itemList = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceProperty', {
          params: {
            params: 10
          }
        })
        .then(result => {
          this.itemList = result.data.body
        })
        .catch(function(response) {})
    },
    // 查看
    handleClick(row) {
      this.dialogOne = true
      this.form = {}
      axios
        .get(config.apiHost + '/placeMain/place/getAreaSchoolByOne', {
          params: {
            //请求参数
            params: row.id
          }
        })
        .then(result => {
          let Data = result.data.body
          this.form = Data
        })
        .catch(function(response) {
          //   this.$message.error(error);
        })
      this.dropdown()
    },
    handleSizeChange(val) {
      //分页大小变化
      this.formQuery.pageSize = val
      this.schoolList()
    },
    handleCurrentChange(val) {
      //分页的当前页变化
      this.formQuery.pageNum = val
      this.schoolList()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 添加信息
    add() {
      this.formI.name = ''
      this.formI.address = ''
      this.formI.areaCovered = ''
      this.formI.officeBuilding = ''
      this.formI.residenceNum = ''
      this.formI.schoolLayout = ''
      this.formI.stuNum = ''
      this.formI.teacherNum = ''
      this.formI.teachingArea = ''
      this.formI.academicBuilding = ''
      this.formI.timeTable = ''
      this.formI.leveType = ''

      this.formI.phone = ''

      this.dialogFormVisible = true
      // this.centerDialogVisible=true;
      this.dropdown()
    },
    confirmII() {
      var _this = this
      if (
        _this.formI.name == '' ||
        _this.formI.areaCovered == '' ||
        _this.formI.phone == '' ||
        _this.formI.leveType == '' ||
        _this.formI.address == ''
      ) {
        _this.$message.info('请检查必填项不能为空')
        return
      }
      this.$confirm('确定要添加数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            this.formI.areaId = this.$route.params.areaId

            axios({
              method: 'post',
              url: config.apiHost + '/placeMain/place/insertAreaPlace',
              data: _this.formI
            })
              .then(result => {
                if (result.data.status == 200) {
                  _this.dialogFormVisible = false
                  _this.$message.success('添加成功')
                  _this.schoolList()
                } else {
                  _this.$message.error(result.data.body.message)
                }
              })
              .catch(function(response) {
                _this.$message.error(error)
              })
          }
        },
        type: 'warning'
      })
    },
    // 导入
    leadin() {
      // this.dialogVisible = true
      this.$router.push({
        path: '/home/data-epmgr/eventImport',
        query: { type: 1 }
      })
    },
    // 删除
    remove() {
      if (this.val == '') {
        this.$message({
          showClose: true,
          message: '请勾选数据'
        })
        return
      } else {
        this.$confirm('确定要删除该事件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          callback: (acction, instance) => {
            if (acction === 'confirm') {
              axios({
                method: 'post',
                url: config.apiHost + '/placeMain/place/deleteAreaPlace',
                data: this.val
              })
                .then(result => {
                  if (result.data.status == 200) {
                    this.schoolList()
                  }
                })
                .catch(function(response) {})
            } else {
              //点击取消
              this.$message({
                typ: 'info',
                message: '已取消删除'
              })
            }
          },
          type: 'warning'
        })
      }
    },
    handleSelectionChange(val) {
      this.val = []
      val.forEach(item => {
        this.val.push(item.id)
      })
      console.log(this.val)
    },
    // 学校信息列表
    schoolList() {
      this.rows = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceBySchool', {
          params: {
            areaId: this.$route.params.areaId,
            type: 1,
            page: this.formQuery.pageNum,
            limit: this.formQuery.pageSize
          }
        })
        .then(result => {
          this.rows = result.data.body.list
          this.total = result.data.body.totalCount
          // this.rows.forEach(item=>{
          //   this.id=item.id;
          //   console.log(this.id)
          // })
        })
        .catch(function(response) {})
    },
    addSchoolLayout(val) {
      this.formI.schoolLayout = val
    },
    addTimeTable(val) {
      this.formI.timeTable = val
    },
    editSchoolLayout(val) {
      this.form.schoolLayout = val
    },
    editTimeTable(val) {
      this.form.timeTable = val
    }
  },
  mounted() {},
  created() {
    this.schoolList()
  }
}
</script>

<style scoped>
.top_box {
  width: 100%;
  height: 50px;
  background-color: #f0f3fa;
  display: flex;
  align-items: center;
  padding: 10px;
  /* justify-content: center; */
}
.top_box span {
  display: inline-block;
  padding: 0 20px;
}
/* .el_input {
  width: 50%;
  margin-left: -50px;
} */
.el-dialog__footer {
  text-align: center !important;
}
.top_box span {
  padding: 0;
}
.el-form--inline .el-form-item {
  /* margin-left: 40px; */
}
.el-textarea {
  /* width: 94%; */
}
</style>


