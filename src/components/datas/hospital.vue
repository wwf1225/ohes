<template>
  <div>
    <div class="top_box">医院信息列表</div>
    <div class="top_box">
      <el-button type="primary" size="small" @click="add">+添加信息</el-button>
      <el-button type="primary" size="small" @click="leadin">导入信息</el-button>
      <el-button type="primary" size="small" @click="remove">-删除信息</el-button>
    </div>
    <template>
      <el-table ref="multipleTable" :data="rows" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column label="医院名称" prop="name" align="center">
        </el-table-column>
        <el-table-column label="医院性质" prop="propertyName" align="center">
        </el-table-column>
        <el-table-column label="医院等级" prop="leveName" align="center">
        </el-table-column>
        <el-table-column label="联系电话" prop="phone" align="center">
        </el-table-column>
        <el-table-column label="医院地址" prop="address" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" round @click="handleClick(scope.row)" type="text">查看</el-button>
            <el-button size="mini" round @click="editor(scope.row)" type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="formQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 查看dialog -->
    <el-dialog title="查看信息" :visible.sync="dialogOne" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" label-width="150px" :model="editForm" label-position="right">
        <el-form-item label="医院名称">
          <el-input v-model="editForm.name" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="占地面积">
          <el-input v-model="editForm.areaCovered" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="业务用房面积">
          <el-input v-model="editForm.businessArea" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="医院负责人">
          <el-input v-model="editForm.director" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editForm.phone" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="医院员工总数">
          <el-input v-model="editForm.employeesNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="医师总数">
          <el-input v-model="editForm.physicianNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="护士总数">
          <el-input v-model="editForm.nurseNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="医技总数">
          <el-input v-model="editForm.medicalNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="医院级别">
          <el-input v-model="editForm.leveName" readonly="readonly"></el-input>

        </el-form-item>
        <el-form-item label="医院性质">
          <el-input v-model="editForm.propertyName" readonly="readonly"></el-input>

        </el-form-item>
        <el-form-item label="护士开放床位数">
          <el-input v-model="editForm.openBedNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="医师编制床位数">
          <el-input v-model="editForm.bedNum" readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="医院地址">
          <el-input v-model="editForm.address" readonly="readonly" style="margin-bottom:8px;"></el-input>
        </el-form-item>
        <el-form-item label="医院环境及建筑描述" style="position:  relative;">

          <vue-html5-editor class="editor" style="margin-top: -30px;width:600px;margin-bottom:8px;" :content="editForm.details" :height="200"></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
        <el-form-item label="医院其他信息描述" style="position:  relative;">

          <vue-html5-editor class="editor" style="margin-top: -30px;width:600px;margin-bottom:8px;" :content="editForm.otherDetails" :height="200"></vue-html5-editor>
          <div style="position: absolute;height:  100%;width:  100%;top:  0;left:  0; z-index: 999999999999999;margin-top: -30px;">
            <div style="height:  37px;width:  100%;background-color: #fff;"></div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="dialogOne = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的dialog -->
    <el-dialog title="编辑信息" :visible.sync="dialogTwo" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" label-width="150px" :model="editForm" label-position="right">
        <el-form-item label="医院名称" required>
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="占地面积">
          <el-input v-model="editForm.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="业务用房面积">
          <el-input v-model="editForm.businessArea"></el-input>
        </el-form-item>
        <el-form-item label="医院负责人">
          <el-input v-model="editForm.director"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="医院员工总数">
          <el-input v-model="editForm.employeesNum"></el-input>
        </el-form-item>
        <el-form-item label="医师总数">
          <el-input v-model="editForm.physicianNum"></el-input>
        </el-form-item>
        <el-form-item label="护士总数">
          <el-input v-model="editForm.nurseNum"></el-input>
        </el-form-item>
        <el-form-item label="医技总数">
          <el-input v-model="editForm.medicalNum"></el-input>
        </el-form-item>
        <el-form-item label="医院级别" required>
          <el-select v-model="editForm.hospitalLeve" style="width:202px;">
            <el-option v-for="item in itemList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院性质" required>
          <el-select v-model="editForm.hospitalProperty" style="width:206px;">
            <el-option v-for="item in propertyList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="护士开放床位数">
          <el-input v-model="editForm.openBedNum"></el-input>
        </el-form-item>
        <el-form-item label="医师编制床位数">
          <el-input v-model="editForm.bedNum"></el-input>
        </el-form-item>
        <el-form-item label="医院地址" required>
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="医院环境及建筑描述">

          <vue-html5-editor class="editor" :content="editForm.details" :height="200" id="myeditor" style="width:576px;" @change="editdetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="医院其他信息描述">

          <vue-html5-editor class="editor" :content="editForm.otherDetails" :height="200" id="myeditor" style="width:576px;" @change="editotherDetails"></vue-html5-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTwo = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加的dialog -->
    <el-dialog title="添加信息" :visible.sync="dialogThree" width="60%">
      <el-form :inline="true" class="demo-form-inline" style="text-align:left;margin: 0 auto;" label-width="150px" :model="form" label-position="right">
        <el-form-item label="医院名称" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="占地面积">
          <el-input v-model="form.areaCovered"></el-input>
        </el-form-item>
        <el-form-item label="业务用房面积">
          <el-input v-model="form.businessArea"></el-input>
        </el-form-item>
        <el-form-item label="医院负责人">
          <el-input v-model="form.director"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="医院员工总数">
          <el-input v-model="form.employeesNum"></el-input>
        </el-form-item>
        <el-form-item label="医师总数">
          <el-input v-model="form.physicianNum"></el-input>
        </el-form-item>
        <el-form-item label="护士总数">
          <el-input v-model="form.nurseNum"></el-input>
        </el-form-item>
        <el-form-item label="医技总数">
          <el-input v-model="form.medicalNum"></el-input>
        </el-form-item>
        <el-form-item label="医院级别" required>
          <el-select v-model="form.hospitalLeve" style="width:202px;">
            <el-option v-for="item in itemList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院性质" required>
          <el-select v-model="form.hospitalProperty" style="width:206px;">
            <el-option v-for="item in propertyList" :key="item.id" :label="item.datails" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="护士开放床位数">
          <el-input v-model="form.openBedNum"></el-input>
        </el-form-item>
        <el-form-item label="医师编制床位数">
          <el-input v-model="form.bedNum"></el-input>
        </el-form-item>
        <el-form-item label="医院地址" required>
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="医院环境及建筑描述">

          <vue-html5-editor class="editor" :content="form.details" :height="200" id="myeditor" style="width:576px;" @change="adddetails"></vue-html5-editor>
        </el-form-item>
        <el-form-item label="医院其他信息描述">

          <vue-html5-editor class="editor" :content="form.otherDetails" :height="200" id="myeditor" style="width:576px;" @change="addotherDetails"></vue-html5-editor>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogThree = false">取 消</el-button>
        <el-button type="primary" @click="confirmII">确 定</el-button>
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
      rows: [],
      multipleSelection: [],
      formQuery: {
        eventName: '',
        pageSize: 10,
        pageNum: 1
      },
      currentPage: 1,
      total: 0,
      dialogOne: false,
      dialogTwo: false,
      dialogThree: false,
      labelPosition: 'left',
      form: {
        name: '',
        address: '',
        type: '',
        areaId: '',
        phone: '',
        areaCovered: '',
        businessArea: '',
        director: '',
        employeesNum: '',
        physicianNum: '',
        nurseNum: '',
        medicalNum: '',
        hospitalLeve: '',
        hospitalProperty: '',
        bedNum: '',
        openBedNum: '',
        details: '',
        otherDetails: ''
      },
      propertyList: [],
      val: [],
      editForm: {}
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'hospitalList'
  },
  methods: {
    adddetails(val) {
      this.form.details = val
    },
    addotherDetails(val) {
      this.form.otherDetails = val
    },
    editdetails(val) {
      this.editForm.details = val
    },
    editotherDetails(val) {
      this.editForm.otherDetails = val
    },
    //   导入
    leadin() {
      this.$router.push({path:'/home/data-epmgr/eventImport',query:{type:5}})
    },
    // 医院信息列表
    hospitalList() {
      this.rows = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceByHospital', {
          params: {
            areaId: this.$route.params.areaId,
            type: 5,
            page: this.formQuery.pageNum,
            limit: this.formQuery.pageSize
          }
        })
        .then(result => {
          console.log(result)
          this.rows = result.data.body.list
          this.total = result.data.body.totalCount
        })
        .catch(function(response) {})
    },
    // 医院查看
    handleClick(row) {
      this.dialogOne = true

      axios
        .get(config.apiHost + '/placeMain/place/getAreaHospitalByOne', {
          params: {
            //请求参数
            params: row.mainId
          }
        })
        .then(result => {
          this.editForm = result.data.body
        })
        .catch(function(response) {})
    },
    // 下拉框
    dropdownI() {
      this.itemList = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceProperty', {
          params: {
            params: 1
          }
        })
        .then(result => {
          this.itemList = result.data.body
        })
        .catch(function(response) {})
    },
    dropdownII() {
      this.propertyList = []
      axios
        .get(config.apiHost + '/placeMain/place/getAreaPlaceProperty', {
          params: {
            params: 2
          }
        })
        .then(result => {
          this.propertyList = result.data.body
          let Data = result.data.body
          // console.log(Data);
          // Data.forEach(item => {
          //   this.formI.type = item.type;
          // });
        })
        .catch(function(response) {})
    },
    // 医院编辑
    editor(row) {
      this.dialogTwo = true

      axios
        .get(config.apiHost + '/placeMain/place/getAreaHospitalByOne', {
          params: {
            //请求参数
            params: row.mainId
          }
        })
        .then(result => {
          this.editForm = result.data.body
        })
        .catch(function(response) {})
    },
    confirm() {
      if(this.editForm.name==""||this.editForm.address==""||this.editForm.phone==""||this.editForm.hospitalLeve==""||this.editForm.hospitalProperty==""){
        this.$message.info("请检查必填项不能为空");
        return;
      }
      this.$confirm('确定要修改数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (acction, instance) => {
          if (acction === 'confirm') {
            this.dialogTwo = false
            axios({
              method: 'post',
              // /api
              url: config.apiHost + '/placeMain/place/updateAreaHospital',
              data: this.editForm
            })
              .then(result => {
                if (result.data.status == 200) {
                  this.hospitalList()
                  this.$message.success('修改成功')
                }
              })
              .catch(function(response) {})
          }
        },
        type: 'warning'
      })
    },
    // 添加信息
    add() {
      Object.keys(this.form).forEach(key => (this.form[key] = ''))
      this.dialogThree = true
    },
    confirmII() {
      if (this.form.name == '' || this.form.phone == ''||this.form.address==""||this.form.hospitalProperty==""||this.form.hospitalLeve=="") {
        this.$message.info('请检查必填项不能为空')
        return
      } else {
        this.$confirm('确定要添加数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          callback: (acction, instance) => {
            if (acction === 'confirm') {
              this.dialogThree = false

              this.form.type = 5
              this.form.areaId = this.$route.params.areaId
              axios({
                method: 'post',
                url: config.apiHost + '/placeMain/place/insertAreaHospital',
                data: this.form
              })
                .then(result => {
                  if (result.data.status == 200) {
                    this.hospitalList()
                  }
                })
                .catch(function(response) {})
            }
          },
          type: 'warning'
        })
      }
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
                url: config.apiHost + '/placeMain/place/deleteAreaHospital',
                data: this.val
              })
                .then(result => {
                  if (result.data.status == 200) {
                    this.hospitalList()
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
    handleSizeChange(val) {
      //分页大小变化
      this.formQuery.pageSize = val
      this.hospitalList()
    },
    handleCurrentChange(val) {
      //分页的当前页变化
      this.formQuery.pageNum = val
      this.hospitalList()
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
    handleSelectionChange(val) {
      console.log(val)
      this.val = []
      val.forEach(item => {
        this.val.push(item.mainId)
      })
      console.log(this.val)
    }
  },
  mounted() {},
  created() {
    this.hospitalList()
    this.dropdownI()
    this.dropdownII()
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
}
.top_box span {
  display: inline-block;
  padding: 0 20px;
}
.el-input--suffix .el-input__inner {
  padding-right: 15px;
}
</style>
