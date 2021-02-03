<template>
  <div class="rolebox">
    <div class="direct-report-top">
      <el-form :inline="true">
        <el-form-item label="搜索">
          <el-input v-model="searchInfo" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="疾病名称">
          <!-- <el-select v-model="diseaseId" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in diseaseOptions"
              :key="item.disease_id"
              :label="item.disease_name"
              :value="item.disease_id">
            </el-option>
          </el-select>-->
          <el-cascader
            placeholder="请选择"
            :options="diseaseCasOptions"
            @change="diseaseChange"
            clearable
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="工作单位">
          <el-select v-model="reCompany" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in jobOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
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
          <el-button class="submitSearch" @click="searchBtn" :loading="searchloading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="direct-report-content">
      <!-- <div class="tool-bar">
        <el-button style="padding-left: 40px;" @click="dialogInsertVisible=true">批量导入</el-button>
        <el-button style="padding-left: 40px;" @click="showExchangeDialog" :disabled="exchangeBtnDisabled">生成事件</el-button>
        <el-button style="padding-left: 40px;" @click="deleteTableRow">删除数据</el-button>
      </div>-->
      <div class="con">
        <el-table
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
          v-loading="loading"
          class="event-table-list"
        >
          <el-table-column type="selection" width="80" align="center" fixed></el-table-column>
          <el-table-column prop="cardId" label="卡片id" width="100" align="center" fixed></el-table-column>
          <el-table-column prop="cardNum" label="卡片编号" width="180" align="center" fixed></el-table-column>
          <el-table-column prop="eventNo" label="事件编号" width="180" align="center" fixed></el-table-column>
          <el-table-column prop="patientName" label="患者姓名" align="center" fixed></el-table-column>
          <el-table-column prop="familyName" label="患者家长姓名" align="center" fixed></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="120" align="center" fixed></el-table-column>
          <el-table-column label="性别" align="center" fixed>
            <template slot-scope="scope">
              <span>{{scope.row.gender==0?'男':'女'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ageCh" label="年龄" align="center" fixed></el-table-column>
          <el-table-column label="出生日期" width="120" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.birth?scope.row.birth.substr(0,10):''}}</span>
            </template>
          </el-table-column>
          <el-table-column label="卡片状态" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.status==0?'原始卡':''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="有效证件号" width="180" align="center"></el-table-column>
          <el-table-column prop="company" label="患者工作单位" width="200" align="center"></el-table-column>
          <el-table-column prop="belong" label="病人属于区域" width="120" align="center"></el-table-column>
          <el-table-column prop="address" label="现住地址国标" width="120" align="center"></el-table-column>
          <el-table-column prop="detAddress" label="现住详细地址" width="350" align="center"></el-table-column>
          <el-table-column prop="diseaseTime" label="发病日期" width="180" align="center"></el-table-column>
          <el-table-column prop="type" label="病历分类" width="150" align="center"></el-table-column>
          <el-table-column prop="type2" label="病历分类2" width="150" align="center"></el-table-column>
          <el-table-column prop="diseaseTime2" label="发病日期2" width="180" align="center"></el-table-column>
          <el-table-column prop="diagnosticTime" label="诊断时间" width="180" align="center"></el-table-column>
          <el-table-column prop="deathTime" label="死亡日期" width="180" align="center"></el-table-column>
          <el-table-column prop="diseaseName" label="疾病名称" width="120" align="center"></el-table-column>
          <el-table-column prop="beforeType" label="订正前病种" width="120" align="center"></el-table-column>
          <el-table-column prop="beforeDiTime" label="订正前诊断时间" width="180" align="center"></el-table-column>
          <el-table-column prop="beforeHeTime" label="订正前终审时间" width="180" align="center"></el-table-column>
          <el-table-column prop="doctorName" label="填卡医生" align="center"></el-table-column>
          <el-table-column prop="cardTime" label="填卡时间" width="180" align="center"></el-table-column>
          <el-table-column prop="postalcode" label="报告单位地区编码" width="120" align="center"></el-table-column>
          <el-table-column prop="reCompany" label="报告单位" width="200" align="center"></el-table-column>
          <el-table-column prop="companyType" label="单位类型" align="center"></el-table-column>
          <el-table-column prop="enteringTime" label="报告卡录入时间" width="180" align="center"></el-table-column>
          <el-table-column prop="cardUser" label="录卡用户" align="center"></el-table-column>
          <el-table-column prop="cardUserCompany" label="录卡用户所属单位" width="180" align="center"></el-table-column>
          <el-table-column prop="auditTimeArea" label="区县审核时间" width="180" align="center"></el-table-column>
          <el-table-column prop="auditTimeCity" label="地市审核时间" width="180" align="center"></el-table-column>
          <el-table-column prop="auditTimePro" label="省市审核时间" width="180" align="center"></el-table-column>
          <el-table-column prop="auditType" label="审核状态" align="center"></el-table-column>
          <el-table-column prop="reportTime" label="订正报告时间" width="180" align="center"></el-table-column>
          <el-table-column prop="finalAuditTime" label="订正终审时间" width="180" align="center"></el-table-column>
          <el-table-column prop="finalDeTime" label="终审死亡时间" width="180" align="center"></el-table-column>
          <el-table-column prop="correctUser" label="订正用户" align="center"></el-table-column>
          <el-table-column prop="correctUserCompany" label="订正用户所在单位" align="center"></el-table-column>
          <el-table-column prop="deleteTime" label="删除时间" align="center"></el-table-column>
          <el-table-column prop="deleteUser" label="删除用户" align="center"></el-table-column>
          <el-table-column prop="deleteUserCompany" label="删除用户所在单位" align="center"></el-table-column>
          <el-table-column prop="deleteReason" label="删除原因" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column prop="labResult" label="实验室结果" align="center"></el-table-column>
          <el-table-column label="是否为重症患者" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.isGrave==0?'否':'是'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
          v-if="tableData.length>0"
        ></el-pagination>
      </div>
    </div>
    <!-- 导入文件弹窗 -->
    <el-dialog
      width="22%"
      class="add-dialog add-upload"
      title="批量导入"
      :visible.sync="dialogInsertVisible"
      style="text-align:center"
    >
      <el-form>
        <el-upload
          :action="uploadUrl"
          :data="importData"
          :limit="limit"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :file-list="fileList"
          accept=".csv"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传 csv 文件</div>
        </el-upload>
      </el-form>
    </el-dialog>

    <!-- 生成事件 -->
    <el-dialog width="65%" :visible.sync="exchangeEventVisible" class="add-dialog exchangeEvent">
      <div class="rolebox dialog-exchange">
        <div class="main-box">
          <i class="closedialog el-icon-close" @click="exchangeEventVisible=false"></i>
          <form :model="form">
            <input type="hidden" name="reviewerType" v-model="form.reviewerType">
            <input type="hidden" name="leaderType" v-model="form.leaderType">
            <div class="info">
              <div class="info-head">
                <img src="../../assets/event02.png" style="vertical-align:middle;">&nbsp;&nbsp;信息获取-报告人信息
              </div>
              <div class="outline">
                <div class="input-div">
                  <div>
                    <label class="label-div">
                      <span class="notnull">接报时间</span>
                    </label>
                    <el-date-picker
                      v-model="form.reportedTime"
                      @change="getRTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width:220px"
                      size="mini"
                    ></el-date-picker>
                  </div>
                  <div>
                    <label class="label-div">
                      <span class="notnull">报告人姓名</span>
                    </label>
                    <el-input
                      type="text"
                      ondragstart="return false"
                      class="inp inp-per"
                      v-model="form.reportUser"
                      style="width:220px"
                      size="mini"
                    ></el-input>
                  </div>
                  <div>
                    <label class="label-div">
                      <span class="notnull">报告人电话</span>
                    </label>
                    <el-input
                      type="tel"
                      id="tel"
                      ondragstart="return false"
                      class="inp inp-per"
                      v-model="form.reportPhone"
                      style="width:220px"
                      size="mini"
                    ></el-input>
                  </div>
                </div>
                <div class="input-div">
                  <div>
                    <label class="label-div">
                      <span class="notnull">报告来源</span>
                    </label>
                    <el-select
                      v-model="form.originId"
                      placeholder="请选择"
                      style="width:220px"
                      size="mini"
                    >
                      <el-option
                        v-for="item in originList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>
                    <label class="label-div">
                      <span class="notnull">接报人姓名</span>
                    </label>
                    <el-input
                      type="text"
                      ondragstart="return false"
                      class="inp inp-per"
                      v-model="form.operator"
                      style="width:220px"
                      size="mini"
                      readonly
                    ></el-input>
                  </div>
                  <div>
                    <label class="label-div">
                      <span class="notnull">接报人科室</span>
                    </label>
                    <el-input
                      type="tel"
                      id="tel"
                      ondragstart="return false"
                      class="inp inp-per"
                      v-model="form.operatDep"
                      style="width:220px"
                      size="mini"
                      readonly
                    ></el-input>
                  </div>
                </div>
              </div>
            </div>

            <div class="info">
              <div class="info-head">
                <img src="../../assets/event03.png" style="vertical-align:middle;">&nbsp;&nbsp;核实信息-事件概况
              </div>
              <div class="outline">
                <div class="input-div">
                  <div>
                    <label class="label-div">
                      <span class="notnull">事件场所</span>
                    </label>
                    <el-select
                      v-model="form.placeId"
                      placeholder="请选择"
                      @change="eventPlaceChang(form.placeId)"
                      style="width:110px"
                      size="mini"
                    >
                      <el-option
                        v-for="item in placeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-input
                      v-model="form.otherPlaces"
                      v-show="eventPlace"
                      style="width:100px;margin-left: 5px;"
                      size="mini"
                    ></el-input>
                    <el-select
                      v-model="placeDetailId"
                      placeholder="请选择"
                      @change="eventPlaceInfo"
                      clearable
                      filterable
                      allow-create
                      v-show="!eventPlace"
                      style="margin-left:5px;width:100px"
                      :disabled="form.placeId===''"
                      size="mini"
                    >
                      <el-option
                        v-for="(item,index) in schoolList"
                        :key="index"
                        :label="item.name"
                        :value="index"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>
                    <label class="label-div">
                      <span class="notnull">事件地点</span>
                    </label>
                    <div class="address-point" style="position: relative;float: right;">
                      <el-input
                        type="text"
                        class="inp"
                        ondragstart="return false"
                        style="width:100%;padding-left:5px;width:220px"
                        placeholder="例：xx市xx区xx路xx号"
                        v-model="form.address"
                        :title="form.address"
                        readonly
                        size="mini"
                      ></el-input>
                      <i class="ad el-icon-location" @click="showMap"></i>
                    </div>
                  </div>
                  <div>
                    <label class="label-div">
                      <span class="notnull">事件等级</span>
                    </label>
                    <el-select
                      ref="eventLeveSelect"
                      v-model="form.grade"
                      placeholder="请选择"
                      @change="eventLeveChanged"
                      style="width:220px"
                      size="mini"
                    >
                      <el-option
                        v-for="item in eventLeve"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        :style="{color:item.color}"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="input-div">
                  <div>
                    <label class="label-div">
                      <span class="notnull">事件类型</span>
                    </label>
                    <el-select
                      v-model="form.genre"
                      placeholder="请选择"
                      @change="eventGenreChang"
                      style="width:110px"
                      size="mini"
                    >
                      <el-option
                        v-for="item in eventType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-cascader
                      expand-trigger="hover"
                      placeholder="请选择"
                      :options="diseaseOptions"
                      ref="cascaderAddr"
                      :class="{activeType:!isShowDis}"
                      @change="handleDisChange"
                      clearable
                      style="margin-left: 5px;width:100px"
                      :disabled="form.genre===''"
                      size="mini"
                    ></el-cascader>
                  </div>
                  <div>
                    <label class="label-div">
                      <span>事件种类</span>
                    </label>
                    <!-- @change="getEventCat" -->
                    <el-select
                      v-model="form.cat"
                      clearable
                      placeholder="请选择"
                      style="width:220px"
                      size="mini"
                      :disabled="form.caseNumber==1"
                    >
                      <el-option
                        v-for="item in eventCat"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>
                    <label class="label-div">
                      <span>疑似病例数</span>
                    </label>
                    <el-input
                      type="number"
                      id="nessNum"
                      ondragstart="return false"
                      class="inp inp-per"
                      min="0"
                      v-model="form.caseNumber"
                      style="width:220px"
                      size="mini"
                      readonly
                    ></el-input>
                  </div>
                </div>
                <div class="input-div">
                  <label class="label-div">
                    <span>事件概要</span>
                  </label>
                  <textarea
                    class="area"
                    rows="3"
                    placeholder="如：目前伤亡状况、涉及人员以及已采取的措施（专家、小组、流调、消杀和救治等）"
                    ondragstart="return false"
                    v-model="form.comment"
                    size="mini"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="btn-div">
              <el-button class="exchangeBtn ok" @click="addEvent">上报</el-button>
              <el-button class="exchangeBtn ok" @click="clickIssue">发布</el-button>
            </div>
          </form>
        </div>
        <!-- 地图选点 -->
        <template>
          <transition
            enter-active-class="animated fadeInRight"
            leave-active-class="animated fadeOutRight"
          >
            <div class="temp_bg" v-show="fromShow">
              <div class="my_from">
                <div class="closeform">
                  <i class="el-icon-close" @click="closefrom"></i>
                </div>
                <div id="mapDiv" style="width:100%;height:100%;border-radius:15px;"></div>
                <div id="r-result" class="input_text">
                  <i class="el-icon-search"></i>
                  <i
                    class="el-icon-close"
                    @click="clearInput"
                    style="height:46%;top:27%;line-height:16px"
                  ></i>
                  <input
                    type="text"
                    id="suggestId"
                    ref="locationSearchInput"
                    size="20"
                    value
                    v-model="searchMapInput"
                    placeholder="请输入搜索内容"
                    style="width:300px;padding-right:50px"
                  >
                </div>
                <div
                  id="searchResultPanel"
                  style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;z-index:999999999"
                ></div>
              </div>
            </div>
          </transition>
        </template>
      </div>
    </el-dialog>

    <!--发布时，事件派发弹框-->
    <el-dialog
      :visible.sync="dialogShowVisible"
      width="28%"
      :show-close="false"
      :close-on-click-modal="false"
      id="dialog"
    >
      <div class="divbox">
        <div class="header">
          <strong>事件派发</strong>
          <div class="two-s">
            <!-- 暂时去掉 -->
            <span style="font-size: 12px;">指派&nbsp;&nbsp;</span>
            <el-switch v-model="isexam" active-value="1" inactive-value="0"></el-switch>
          </div>
          <button
            type="button"
            aria-label="Close"
            class="el-dialog__headerbtn close-btn"
            @click="dialogShowVisible=false"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <!--表格-->
        <div class="treeBox">
          <div class="treeDiv" v-for="(item , k) in ReleaseList" :key="k">
            <div class="left">{{ item.name}}</div>
            <div class="mainRow" :id="k" v-show="activeIndex===k">
              <div ref="rowTwo" class="rowTwo" v-if="item.listUser.length>0">
                <el-checkbox-group v-model="checkedPeople">
                  <el-checkbox
                    v-for="(people , u) in item.listUser"
                    :label="people.id"
                    :key="u"
                  >{{people.account}}</el-checkbox>
                </el-checkbox-group>
                <div class="more" title="展开" v-if="item.listUser.length>6" @click="showMore">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
              <div
                class="row"
                v-if="item.childrenList.length>0"
                v-for="(dept , k) in item.childrenList"
                :key="k"
              >
                <!-- 部门 -->
                <div class="left">{{ dept.name}}</div>
                <!-- 人员 -->
                <div class="right" v-if="dept.listUser.length>0">
                  <div class="item" v-for="(val , k) in dept.listUser" :key="k">
                    <el-checkbox v-model="checkedPeople" :label="val.id">{{val.userName}}</el-checkbox>
                  </div>
                </div>
                <div class="right" v-else>
                  <span>暂无人员</span>
                </div>
                <!-- more -->
                <div class="more" title="展开" v-if="dept.listUser.length>6" @click="showMore">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button size="medium" type="text" class="cancel" @click="closeissue">取消</el-button>
          <el-button size="medium" type="text" class="ok" @click="issue">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import animate from "animate.css";
var config = require("@/components/utils/Common_Config.js");
var Cookies = require("js-cookie");
var map;
export default {
  data() {
    return {
      config: config,
      searchInfo: "",
      diseaseId: "",
      reCompany: "",
      diseaseCasOptions: [
        { value: 0, label: "传染病", children: [] },
        { value: 1, label: "食源性疾病", children: [] },
        { value: 2, label: "不明原因", children: [] }
      ],
      datePickerValueArr: [],
      jobOptions: [],
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 导入
      dialogInsertVisible: false,
      limit: 1,
      uploadUrl: "/Fileupload/import/importReprtSystem", //导入接口
      importData: {
        token: config.token
      },
      fileName: "",
      fileList: [],
      exchangeBtnDisabled: false,
      // table
      loading: true,
      searchloading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      tableSelection: [],
      // 生成事件弹窗
      exchangeEventVisible: false,
      form: {
        name: "", //事件名称
        reportUser: "", //报告人
        reportPhone: "", //报告人电话
        originId: "", //报告来源（下拉）
        operator: Cookies.get("userName"), //接报人
        operatDep: Cookies.get("depName"), //接报人科室
        reportedTime: new Date(), //接报时间
        startTime: new Date(), //开始时间
        address: "", //地点
        cat: "",
        grade: "",
        addressFloor: "", //楼层信息
        caseNumber: "", //疑似病例数
        placeId: "", //事件场所（下拉）
        comment: "", //事件概要
        status: "", //  1 保存  2 审批发布  3 发布
        longitude: "", //经度
        latitude: "", //纬度
        genre: "", //疑似事件类型
        diseaseId: "", //疾病id
        userIdList: "", //发布所选人员
        otherPlaces: "",
        placeDetail: "", //场所第二级
        reviewerType: "eventPublish",
        leaderType: "eventPublish",
        reportSysUsers: ""
      },
      flagName: "",
      searchMapInput: "",
      reportTime: null,
      sTime: null,
      originList: [],
      placeList: [],
      schoolList: [],
      dialogShowVisible: false,
      fromShow: false,
      ReleaseList: [], //事件发布人员列表
      defaultProps: {
        children: "listUser",
        label: "userName"
      },
      treeId: [],
      countType: 0,
      checkedPeople: [], //一级下选中的id
      isexam: "0", //开关
      activeIndex: null,
      locationAreaId: null,
      longitude: "",
      latitude: "",
      oldlongitude: "",
      oldlatitude: "",
      eventPlace: false,
      isShowDis: true,
      diseaseOptions: [],
      disName: "",
      placeName: "",
      eventType: [
        { id: 0, name: "传染病" },
        { id: 1, name: "食源性疾病" },
        { id: 2, name: "不明原因" }
      ],
      eventLeve: [
        { id: 1, name: "I 级", color: "#e51717" },
        { id: 2, name: "II 级", color: "#ff7519" },
        { id: 3, name: "III 级", color: "#ffe229" },
        { id: 4, name: "IV 级", color: "#006636" },
        { id: 5, name: "未分级", color: "#666666" }
      ],
      eventLeveColor: "",
      eventCat: [
        { id: 1, name: "单病例", disabled: true },
        { id: 2, name: "群体性" },
        { id: 3, name: "其他事件" }
      ],
      placeDetailId: "",
      marker: {}
    };
  },
  methods: {
    getTopData() {
      var that = this;
      // axios.get(config.apiHost+'/report-system/getDiseaseNames').then(res=>{
      //   if(res.status==200){
      //     that.diseaseOptions = res.data.body;
      //   }
      // })
      axios
        .get(config.apiHost + "/sur/reportingUnit/getReportingUnits")
        .then(res => {
          if (res.status == 200) {
            that.jobOptions = res.data.body;
          }
        });
    },
    async diseaseChange(dis) {
      // this.form.diseaseId = dis.length > 1 ? dis[dis.length - 1] : "";
      switch (dis.length) {
        case 0:
          this.form.diseaseId = "";
          break;
        case 1:
          this.form.diseaseId = "";
          this.form.genre = dis[0];
          break;
        case 2:
          this.form.diseaseId = dis[1];
          this.form.genre = dis[0];
          break;
        case 3:
          this.form.diseaseId = dis[2];
          this.diseaseId = dis[2];
          this.form.genre = dis[0];
          break;
      }
      const result = await axios({
        method: "get",
        url: config.apiHost + "/disease/listInfo",
        params: {
          typeId: this.form.genre
        }
      });
      if (result.data.status == 200) {
        if (dis.length < 3) {
          this.diseaseCasOptions[dis[0]].children = result.data.body;
        }
      }
    },
    // 查询
    searchBtn() {
      this.searchloading = true;
      this.getTableListData();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableListData();
    },
    // 导入
    insertSome() {
      this.dialogInsertVisible = true;
    },
    handleRemove(file, fileList) {
      // console.log("remove", file);
    },
    handlePreview(file) {
      // console.log("file", file);
    },
    // 导入文件改变事件
    handleChange(file, fileList) {
      this.fileName = file.name;
      this.fileList = fileList;
    },
    // 上传失败回调
    uploadError(err, file, filelist) {
      this.$message.error(err.body.message);
      this.dialogInsertVisible = false;
      this.fileList = [];
    },
    // 上传成功回调
    uploadSuccess(res, file, filelist) {
      if (res.status == 200) {
        this.$message.success(res.body.msg);
        this.getTableListData();
      } else {
        this.$message.error(res.body.message);
      }
      this.dialogInsertVisible = false;
      this.fileList = [];
    },
    getTableListData() {
      var stime = "";
      var etime = "";
      if (this.datePickerValueArr.length > 0) {
        stime = moment(this.datePickerValueArr[0]).format("YYYY-MM-DD");
        etime = moment(this.datePickerValueArr[1]).format("YYYY-MM-DD");
      } else {
        // stime = new Date(new Date().getTime() - 24*60*60*1000)
        // etime = new Date()
      }
      axios({
        method: "get",
        url: config.apiHost + "/report-system/get-all",
        params: {
          token: config.token,
          page: this.currentPage,
          limit: this.pageSize,
          fuzzy: this.searchInfo,
          diseaseId: this.form.diseaseId,
          reCompany: this.reCompany,
          startTime: stime,
          endTime: etime,
          isPush: 1
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.tableData = result.data.body.list;
          this.totalCount = result.data.body.totalCount;
          this.loading = false;
          this.searchloading = false;
        }
      });
    },
    // 上报
    addEvent() {
      this.getEventName();
      if (this.showValidate()) {
        this.form.status = "1";
        this.form.reportedTime = this.getCurrentDateTime(
          this.form.reportedTime
        );
        this.form.startTime = this.getCurrentDateTime(this.form.startTime);
        // if (this.form.addressFloor.trim != '') {
        //   this.form.address = this.form.address + this.form.addressFloor
        // }

        // console.log("添加。。")
        // console.log(this.form);
        axios({
          method: "post",
          // /api
          url: config.apiHost + "/save-event",
          data: this.form,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        })
          .then(res => {
            // console.log(res);
            if (res.data.status == 200) {
              this.$message(res.data.body.msg);
              this.$router.push({ path: "/home/event-now" }); //保存成功 跳转到待发布界面
            }
            return res.data;
          })
          .catch(response => {
            this.$message.error(response);
          });
      }
    },
    clickIssue() {
      this.getEventName();
      if (this.showValidate()) {
        this.dialogShowVisible = true;
      }
    },
    //发布
    issue() {
      if (this.isexam == 0) {
        this.form.status = "3";
      } else if (this.isexam == 1) {
        this.form.status = "2";
      }
      // console.log(this.form.status);
      this.form.reportedTime = this.getCurrentDateTime(this.form.reportedTime);
      this.form.startTime = this.getCurrentDateTime(this.form.startTime);
      this.form.userIdList = this.checkedPeople.join();
      if (this.form.userIdList != null && this.form.userIdList != "") {
        axios({
          method: "post",
          // /api
          url: config.apiHost + "/current-events/savaAndRelease",
          data: this.form,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            token: config.token
          }
        })
          .then(res => {
            // console.log(res);
            if (res.data.status == 200) {
              this.$message(res.data.body.msg);
              (this.form = {
                name: "", //事件名称
                reportUser: "", //报告人
                reportPhone: "", //报告人电话
                originId: "", //报告来源（下拉）
                operator: Cookies.get("userName"), //接报人
                operatDep: Cookies.get("depName"), //接报人科室
                reportedTime: new Date(), //接报时间
                startTime: new Date(), //开始时间
                address: "", //地点
                cat: "",
                grade: "",
                addressFloor: "", //楼层信息
                caseNumber: "", //疑似病例数
                placeId: "", //事件场所（下拉）
                comment: "", //事件概要
                status: "", //  1 保存  2 审批发布  3 发布
                longitude: "", //经度
                latitude: "", //纬度
                genre: "", //疑似事件类型
                diseaseId: "", //疾病id
                userIdList: "", //发布所选人员
                otherPlaces: "",
                placeDetail: "", //场所第二级
                reviewerType: "eventPublish",
                leaderType: "eventPublish",
                reportSysUsers: ""
              }),
                this.$router.push({ path: "/home/event-process" }); //发布成功 跳转到流程中事件
            } else {
              //发布失败
              this.$message(res.data.body.msg);
            }
            return res.data;
          })
          .catch(response => {
            this.$message.error(response);
          });
      } else {
        this.$message.error("请选择发布人");
      }
    },
    // 关闭
    closeissue() {
      this.dialogShowVisible = false;
    },
    // table 选择
    handleSelectionChange(val) {
      try {
        var self = this;
        self.tableSelection = [];
        this.flagName = val[0].diseaseName;
        this.form.diseaseId = val[0].diseaseId;
        this.form.genre = val[0].diseaseGenre;
        this.form.address = val[0].detAddress;
        this.searchMapInput = val[0].detAddress;
        this.form.reportUser = val[val.length - 1].doctorName;
        this.eventGenreChang();
        val.forEach(v => {
          if (v.diseaseName != this.flagName) {
            this.$message.error("请选择同一个事件");
            this.exchangeBtnDisabled = true;
            return;
          }
          self.tableSelection.push(v.id);
          this.exchangeBtnDisabled = false;
        });
      } catch (error) {}
    },
    deleteTableRow() {
      if (this.tableSelection.length == 0) {
        this.$message.error("请先选择要删除的记录");
        return;
      }
      this.$confirm("是否删除该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "get",
            url: config.apiHost + "/report-system/delete",
            params: {
              token: config.token,
              id: this.tableSelection.join(",")
            }
          }).then(result => {
            if (result.data.status == 200) {
              this.getTableListData();
            }
            this.$message.success(result.data.body.msg);
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    // ***********************
    closeRow(id) {
      // console.log(id)
      if (id == this.activeIndex) {
        this.activeIndex = -1;
        return;
      }
      this.activeIndex = id;
      // this.isClose=!this.isClose;
    },
    changeColor(id) {
      this.countType = id;
      // console.log(id);
    },
    eventPlaceChang(value) {
      this.form.otherPlaces = "";
      this.form.placeDetail = "";
      this.placeDetailId = "";
      this.form.placeDetail = "";
      this.form.address = "";
      this.form.latitude = "";
      this.form.longitude = "";
      this.longitude = this.oldlongitude;
      this.latitude = this.oldlatitude;
      this.form.province = "";
      this.form.city = "";
      this.form.district = "";
      // this.closepoint();
      axios({
        method: "get",
        url: config.apiHost + "/froms/places",
        params: {
          placeId: value
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.eventPlace = result.data.body;
          if (!this.eventPlace) {
            axios({
              method: "get",
              url: config.apiHost + "/placeMain/place/getAreaPlaceByEvent",
              params: {
                typeId: value
              }
            }).then(result => {
              if (result.data.status == 200) {
                // console.log(result.data.body);
                this.schoolList = result.data.body;
              }
            });
          }
        } else {
          this.eventPlace = result.data.body;
        }
      });
      // console.log(value)
    },
    eventPlaceInfo() {
      if (this.placeDetailId || this.placeDetailId === 0) {
        var item = this.schoolList[this.placeDetailId];
        this.form.placeDetail = item.id;
        this.form.address = item.address;
        this.form.latitude = item.latitude;
        this.form.longitude = item.longitude;
        this.longitude = item.longitude;
        this.latitude = item.latitude;
        this.placeName = item.name;
        // this.addpoint(+this.form.longitude, +this.form.latitude);
      } else {
        this.form.placeDetail = "";
        this.form.address = "";
        this.form.latitude = "";
        this.form.longitude = "";
        this.longitude = this.oldlongitude;
        this.latitude = this.oldlatitude;
        this.placeName = "";
        this.form.province = "";
        this.form.city = "";
        this.form.district = "";
      }
    },
    eventGenreChang() {
      var value = this.form.genre;
      // console.log(value + "====" + this.isShowDis);
      if (value == 3) this.isShowDis = false;
      else this.isShowDis = true;
      if (this.isShowDis) {
        axios({
          method: "get",
          url: config.apiHost + "/disease/listInfo",
          params: {
            typeId: value
          }
        }).then(result => {
          if (result.data.status == 200) {
            this.diseaseOptions = result.data.body;
          }
        });
      }
      // console.log(value)
    },
    handleDisChange(value) {
      // console.log(value, this.$refs['cascaderAddr'].currentLabels)
      // console.log(this.diseaseNameOptions);
      // console.log(this.diseaseOption);
      if (value.length > 0) {
        this.form.diseaseId = value[value.length - 1];
        this.disName = this.$refs["cascaderAddr"].currentLabels[
          value.length - 1
        ];
        // console.log(this.disName);
      } else {
        this.form.diseaseId = "";
        this.disName = "";
      }
    },
    eventTypeChang(value) {
      this.form.otherPlaces = "";
      this.form.placeDetail = "";
      axios({
        method: "get",
        url: config.apiHost + "/froms/places",
        params: {
          placeId: value
        }
      }).then(result => {
        if (result.data.status == 200) {
          this.eventPlace = result.data.body;
          if (!this.eventPlace) {
            axios({
              method: "get",
              url: config.apiHost + "/placeMain/place/getAreaPlaceByEvent",
              params: {
                typeId: value
              }
            }).then(result => {
              if (result.data.status == 200) {
                this.schoolList = result.data.body;
              }
            });
          }
        } else {
          this.eventPlace = result.data.body;
        }
      });
      // console.log(value);
    },
    getOrigin() {
      axios
        .get(config.apiHost + "/event-origin", {
          params: {
            token: config.token
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.originList = result.data.body;
              var index = this.originList.findIndex(
                v => v.name == "国家传染病直报系统"
              );
              this.form.originId = this.originList[index].id;
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    getPlace() {
      axios
        .get(config.apiHost + "/event-places", {
          params: {
            token: config.token
          }
        })
        .then(
          result => {
            if (result.data.status == 200) {
              this.placeList = result.data.body;
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    // 验证
    showValidate() {
      console.log(this.form);
      var val = this;
      const {
        name,
        reportUser,
        reportPhone,
        originId,
        reportedTime,
        startTime,
        caseNumber,
        placeId,
        address,
        grade,
        cat
      } = this.form;
      // if (
      //   name.trim() == "" ||
      //   reportUser.trim() == "" ||
      //   reportPhone.trim() == "" ||
      //   originId == "" ||
      //   reportedTime == null ||
      //   startTime == null ||
      //   caseNumber.trim() == "" ||
      //   placeId == "" ||
      //   address.trim() == "" ||
      //   grade == "" ||
      //   cat == ""
      // )
      if (
        name.trim() == "" ||
        reportUser.trim() == "" ||
        reportPhone.trim() == "" ||
        originId == "" ||
        reportedTime == null ||
        startTime == null ||
        placeId == "" ||
        address.trim() == "" ||
        grade == ""
      ) {
        this.$message({ type: "error", message: "信息不能为空" });
        return;
      } else {
        // var myreg = /^\d{11}$/   //数字13位
        // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/ //手机号码验证
        // var myreg=/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/;//手机号码验证和电话号码
        var myreg = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(^\d{11}$)/;
        var numreg = /^\d+$/; //疑似病例数
        if (!myreg.test(reportPhone)) {
          this.$message({ type: "error", message: "请输入有效的手机号码！" });
          document.getElementById("tel").focus();
          return;
        }

        // if (!numreg.test(caseNumber)) {
        //   this.$message({ type: "error", message: "请输入正确的病例数！" });
        //   document.getElementById("nessNum").focus();
        //   return;
        // }
        return true;
      }
    },
    getEventName() {
      let genre = "";
      if (this.form.genre == "" && this.form.genre.length == 0) {
        genre = "";
      } else if (this.form.genre == 1) {
        genre = "食源性疾病";
      } else if (this.form.genre == 2) {
        genre = "不明原因";
      } else if (this.form.genre == 0) {
        genre = "传染病";
      }
      // console.log(this.form.diseaseId);
      // console.log(this.disName);
      if (this.form.diseaseId != "" || this.form.diseaseId.length != 0) {
        genre = this.disName;
      }
      if (this.placeName != "" || this.placeName.length != 0) {
        this.form.name =
          this.getCurrentDate(this.form.reportedTime) + this.placeName + genre;
      } else {
        this.form.name =
          this.getCurrentDate(this.form.reportedTime) +
          this.form.address +
          genre;
      }
    },
    // getEventCat() {
    //   if (this.form.cat == 1) {
    //     this.form.caseNumber = "1";
    //   } else {
    //     this.form.caseNumber = "";
    //   }
    // },
    getSTime(val) {
      // console.log("时间。。")
      //  console.log(val);
      // this.form.startTime=this.formatDateTime(val);
    },
    getRTime(val) {
      // console.log("时间。。")
      // console.log(val);
      // this.reportTime=this.formatDateTime(val);
    },
    confirm() {
      let arr = this.$refs.tree.getCheckedKeys();
      this.treeId = arr;
      // console.log(this.treeId);
    },
    //事件发布人员列表
    getReleasedep() {
      axios
        .get(config.apiHost + "/current-events/releasedep", {
          params: {
            //请求参数
            token: config.token
          }
        })
        .then(
          result => {
            // console.log(result.data)
            if (result.data.status == 200) {
              this.ReleaseList = result.data.body;
              this.locationAreaId = result.data.locationAreaId;
              for (let i = 0; i < this.ReleaseList.length; i++) {
                const element = this.ReleaseList[i];
                if (element.areaId == this.locationAreaId) {
                  this.activeIndex = i;
                }
              }
            }
          },
          error => {
            this.$message.error(error);
          }
        );
    },
    // 关闭预览
    closefrom() {
      this.fromShow = false;
    },
    getCurrentDateTime(str) {
      return moment(str).format("YYYY-MM-DD HH:mm:ss");
    },
    getCurrentDate(str) {
      return moment(str).format("YYMM");
    },
    showExchangeDialog() {
      if (this.tableSelection.length > 0) {
        this.exchangeEventVisible = true;
      } else {
        this.$message.error("请先选择事件");
      }
    },
    showMap() {
      this.fromShow = true;
      this.getMap();
    },
    addpoint(lng, lat) {
      map.setCenter([lng, lat]);
      map.clearMap();
      new AMap.Marker({
        position: [lng, lat],
        map: map
      });
    },
    getMap() {
      var self = this;
      var mapObj = new AMap.Map("mapDiv", {
        zoom: 10 //级别
      });
      map = mapObj;
      var marker = new AMap.Marker({
        position: [+self.longitude, +self.latitude]
      });
      mapObj.add(marker);
      // 获取当前位置
      mapObj.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          showButton: false, //显示定位按钮，默认：true
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
          zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", data => {
          self.longitude = data.position.lng;
          self.latitude = data.position.lat;
          self.oldlongitude = data.position.lng;
          self.oldlatitude = data.position.lat;
          self.form.longitude = data.position.lng;
          self.form.latitude = data.position.lat;
        });
        AMap.event.addListener(geolocation, "error", error => {
          self.$message.error(error.message);
        });
      });
      // 搜索
      mapObj.plugin(["AMap.Autocomplete", "AMap.PlaceSearch"], function() {
        var autoOptions = {
          // 城市，默认全国
          city: [self.longitude, self.latitude],
          // 使用联想输入的input的id
          input: "suggestId"
        };
        var autocomplete = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
          city: [self.longitude, self.latitude],
          map: mapObj
        });
        // 搜索建议点击选择
        AMap.event.addListener(autocomplete, "select", function(e) {
          if (e.poi.location.lng && e.poi.location.lat) {
            self.addpoint(+e.poi.location.lng, +e.poi.location.lat);
            let myAdress = e.poi.district + e.poi.address;
            self.form.longitude = +e.poi.location.lng; //经度
            self.form.latitude = +e.poi.location.lat; //纬度
            self.form.address = myAdress; //地址
            self.form.province = "";
            self.form.city = e.poi.city;
            self.form.district = e.poi.name;
            self.longitude = +e.poi.location.lng; //经度
            self.latitude = +e.poi.location.lat; //纬度
          }
          self.fromShow = false;
          self.clearInput();
        });
      });
      // 地图点击设置位置
      AMap.event.addListener(mapObj, "click", e => {
        self.addpoint(+e.lnglat.lng, +e.lnglat.lat);
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: [+e.lnglat.lng, +e.lnglat.lat]
          });
          var lnglat = [+e.lnglat.lng, +e.lnglat.lat];
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              self.form.longitude = +e.lnglat.lng; //经度
              self.form.latitude = +e.lnglat.lat; //纬度
              self.form.address = result.regeocode.formattedAddress; //地址
              self.form.province = result.regeocode.addressComponent.province;
              self.form.city = result.regeocode.addressComponent.city;
              self.form.district = result.regeocode.addressComponent.name;
              self.longitude = +e.lnglat.lng; //经度
              self.latitude = +e.lnglat.lat; //纬度
            }
          });
          self.fromShow = false;
          self.clearInput();
        });
      });
    },
    // 设置select eventLeve颜色
    eventLeveChanged(v) {
      switch (v) {
        case 1:
          this.eventLeveColor = "#e51717";
          break;
        case 2:
          this.eventLeveColor = "#ff7519";
          break;
        case 3:
          this.eventLeveColor = "#ffe229";
          break;
        case 4:
          this.eventLeveColor = "#006636";
          break;
        case 5:
          this.eventLeveColor = "#666666";
          break;
      }
      this.$refs.eventLeveSelect.$children[0].$refs.input.style.color = this.eventLeveColor;
    },
    clearInput() {
      this.$refs.locationSearchInput.value = "";
    },
    showMore(e) {
      // more
      let el = e.target.parentNode;
      el.classList.toggle("active");
      // row / rowTwo
      el.parentNode.classList.toggle("show");
    },
    showRowDetails(row) {
      if (row.status == 4) {
        //编辑调查
        // console.log(row);
        row.ispage = "编辑";
        row.isUrl = "surveyTasks";
        this.$store.dispatch("showEventDetail", row);
        this.$router.push({ path: "/home/survey-update" });
        return;
      }
      if (config.hasPermission("event:current:update")) {
        this.updateRow(row);
        return;
      }
      if (config.hasPermission("event:current:info")) {
        this.handleClick(row);
      }
    },
    // 查看
    handleClick(row) {
      row.ispage = "查看";
      row.isUrl = "eventNow";
      this.$store.dispatch("showEventDetail", row);
      this.$router.push({ path: "/home/past-event-detail" });
    },
    //事件编辑
    updateRow(row) {
      row.isUrl = "eventNow";
      this.$store.dispatch("showEventDetail", row);
      this.$router.push({ path: "/home/eventEdit" });
    },
  },
  created() {
    this.getOrigin();
    this.getPlace();
    this.getTableListData();
    this.getReleasedep();
    this.getTopData();
  },
  watch: {
    tableSelection(newVal) {
      this.form.reportSysUsers = "";
      this.form.caseNumber = "";
      if (newVal.length > 0) {
        this.form.reportSysUsers = newVal.join(",");
        this.form.caseNumber = newVal.length;
        if (this.form.caseNumber == 1) {
          this.form.cat = 1;
        } else {
          this.form.cat = 2;
        }
      }
    }
  }
};
</script>

<style scoped>
.direct-report-top {
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
.submitSearch:hover {
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
.direct-report-content {
  min-height: 680px;
  padding-bottom: 100px;
  /* height: 100%; */
  background: #fff;
}
.direct-report-content .tool-bar {
  text-align: right;
  padding: 10px;
}
.direct-report-content .tool-bar .el-button {
  margin-left: 30px;
}
.direct-report-content .tool-bar .el-button:nth-child(1) {
  background: #429e73 url(../../assets/pldr.png) no-repeat 20px center;
  color: #fff;
}
.direct-report-content .tool-bar .el-button:nth-child(1):hover {
  background: #006636 url(../../assets/pldr.png) no-repeat 20px center;
}
.direct-report-content .tool-bar .el-button:nth-child(2),
.direct-report-content .tool-bar .el-button:nth-child(3) {
  border: 1px solid #429e73;
  color: #429e73;
}
.direct-report-content .tool-bar .el-button:nth-child(2) {
  background: #fff url(../../assets/shengcsj_a.png) no-repeat 20px center;
}
.direct-report-content .tool-bar .el-button:nth-child(2):hover {
  background: #429e73 url(../../assets/shengcsj.png) no-repeat 20px center;
  color: #fff;
}
.direct-report-content .tool-bar .el-button:nth-child(3) {
  background: #fff url(../../assets/shancsj_a.png) no-repeat 20px center;
}
.direct-report-content .tool-bar .el-button:nth-child(3):hover {
  background: #429e73 url(../../assets/shancsj.png) no-repeat 20px center;
  color: #fff;
}
.direct-report-content .con {
  padding: 10px;
}
.el-pagination {
  margin: 30px 0;
}
.cancel {
  width: 150px;
  font-size: 14px;
  border: 1px solid #429e73;
}
.cancel:hover {
  color: #fff;
  background: #429e73;
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
.ok.upload,
.cancel.upload {
  width: 100px;
}
.ok.upload {
  margin-right: 30px;
}
/* ************************************************************* */
.rolebox {
  width: auto;
  min-height: 100%;
  background-color: #e2e6ef;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px;
}
.rolebox.dialog-exchange {
  padding: 0;
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
}
.main {
  width: auto;
  /* height: 100%; */
  min-height: 100%;
  background-color: #e2e6ef;
  padding: 10px 10px 45px;
}
.add_Container {
  height: 100%;
  min-height: 850px;
  width: 100%;
  background-color: #ffffff;
}
.title {
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
  background: #f6f7fb;
  text-align: left;
}
.main-box {
  width: 100%;
  /* height: 500px; */
  background: #fff;
  margin: 0 auto;
  padding: 10px 30px 0;
  position: relative;
}
.closedialog {
  font-size: 18px;
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  cursor: pointer;
}
.info {
  line-height: 30px;
  text-align: left;
  border-radius: 8px;
  /* color: #; */
  width: 100%;
  /* margin-bottom: 20px; */
  padding: 14px;
  background-color: #fff;
  /*display:inline;
  border-bottom: 2px solid #6eb594;*/
}
.info:hover {
  /* background: #fff url("../../assets/event01.png") repeat-y left; */
  /*display:inline;
  border-bottom: 2px solid #6eb594;*/
}
.info-head {
  /* padding-left: 20px; */
  color: #333333;
  padding-bottom: 5px;
  /* font-weight: bold; */
  vertical-align: middle;
  /* border-bottom: 2px solid #eee; */
  font-size: 18px;
  margin-bottom: 10px;
}
.selectedspan {
  background: #fff url("../../assets/event01.png") repeat-y left;
}
.outline {
  border: solid 1px #eee;
  padding: 20px 0;
}
.input-div {
  margin: 20px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  /* align-items: center; */
}
.ad {
  position: absolute;
  right: 5px;
  top: 10px;
}
.text-input {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}
.area {
  width: 100%;
  border: 1px solid #dcdfe6;
  background: #fff;
  padding: 0 15px;
  margin-left: 15px;
  border-radius: 5px;
}
.label-div {
  width: 85px;
  color: #666666;
}
.label-div span {
  width: 95px;
  display: inline-block;
  text-align: justify;
  text-align-last: justify;
  font-size: 16px;
  position: relative;
}
.label-div span.notnull::before {
  content: "*";
  color: red;
  position: absolute;
  left: -10px;
  top: 10%;
}
.inp {
  width: 50%;
  height: 35px;
  /* border: 1px solid #dcdfe6; */
  border-radius: 4px;
  background: #fff;
}
.inp-per {
  width: 217px;
  /* padding-left: 20px; */
}
.margin-left-three {
  margin-left: 30px;
}
.btn-div {
  width: 100%;
  height: 100%;
  margin: 30px auto 0;
  padding-bottom: 30px;
  text-align: center;
  /* padding-left: 32%; */
}
.btn-div .el-button {
  width: 100px;
  margin: 0 10px;
}

/* 发布弹出框 */
.divbox {
  /* width: 450px; */
  height: 625px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 10px 10px;
  padding-bottom: 50px;
}
.mainRow {
  padding: 0 25px 20px;
  margin-bottom: 50px;
}
.header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  text-align: center;
  position: relative;
  border-bottom: solid 1px #f0f0f0;
}
.header strong {
  color: #333;
  font-weight: bold;
  font-size: 18px;
}
.detail {
  width: 100%;
  height: 100px;
  background: #fafbff;
  margin-top: 5px;
  margin-bottom: 10px;
  display: flex;
  box-sizing: border-box;
}
.one {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding-left: 25px;
}
.two-s {
  width: 100px;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 10px;
}
.close-btn {
  width: 50px;
  right: 0;
}
.treeDiv {
  width: 100%;
  height: 100%;
  /* background: #eff6fc; */
  margin-right: 25px;
  margin: 0 auto;
  /* border-bottom: solid 1px #f0f0f0; */
}
.treeBox {
  min-height: 520px;
  max-height: 520px;
  margin-bottom: 50px;
  overflow-y: auto;
  border-radius: 0 0 10px 10px;
}
/*滚动条整体样式*/
.treeBox::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.treeBox::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
.treeBox::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}
.tree-h {
  height: 30px;
  line-height: 30px;
  padding: 5px;
  font-size: 15px;
  text-align: left;
  background: #def0fe;
  box-sizing: border-box;
}
.row {
  /* display: flex; */
  height: 95px;
  line-height: 20px;
  margin-top: 10px;
  padding: 15px 0;
  border-radius: 10px;
  overflow: hidden;
  /* border-left: 2px solid skyblue; */
  position: relative;
  background: #fbfbfb url("../../assets/event01.png") repeat-y left;
}
.rowTwo {
  height: 53px;
  overflow: hidden;
  padding: 0 10px 15px;
  line-height: 20px;
  text-align: left;
  background: #fbfbfb url("../../assets/event01.png") repeat-y left;
  border-radius: 0 0 10px 10px;
  position: relative;
}
.rowTwo .el-checkbox-group .el-checkbox {
  min-width: 33%;
}
.el-checkbox + .el-checkbox {
  margin: 0;
}

.row.show,
.rowTwo.show {
  height: auto;
  overflow: auto;
}

.left {
  /* width: 100%; */
  text-align: left;
  padding-left: 10px;
  padding-bottom: 5px;
  box-sizing: border-box;
  background: #fbfbfb url("../../assets/event01.png") repeat-y left;
  color: #333;
  font-size: 16px;
}
.treeDiv > .left {
  margin: 20px 25px 0;
  border-radius: 10px 10px 0 0;
  padding-top: 15px;
}
.right {
  /* flex: 1; */
  width: 100%;
  line-height: 25px;
  padding: 0 10px;
  text-align: left;
}
.more {
  position: absolute;
  height: 50px;
  width: 50px;
  top: 45px;
  right: 0;
  cursor: pointer;
  text-align: center;
}
.rowTwo .more {
  top: 0;
}
.more.active i {
  transform: rotate(90deg);
  color: #429e73;
}
.item {
  min-width: 33%;
  text-align: left;
  display: inline-block;
  margin-top: 0;
  margin: 0;
  /* border: 1px solid #E3EBF3; */
}
.footer {
  width: 100%;
  position: absolute;
  height: 55px;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 999;
  border-radius: 0 0 10px 10px;
  padding: 10px 25px 0;
}
.cancel {
  width: 150px;
  font-size: 14px;
  border: 1px solid #429e73;
}
.cancel:hover {
  color: #fff;
  background: #429e73;
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
.temp_bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(7, 17, 27, 0.6);
  /* z-index: 100; */
}
.temp_bg .input_text {
  position: absolute;
  top: 20px;
  /* left: 50%;
  transform: translateX(-50%); */
  left: 20px;
}
.input_text input {
  height: 40px;
  border-radius: 5px;
  outline: none;
  line-height: 40px;
  padding: 0 20px 0 70px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 10px 0px rgba(16, 20, 26, 0.2);
  border: none;
}
/* .input_text input:focus {
  border: 1px solid #006636;
} */
.input_text .el-icon-search,
.input_text .el-icon-close {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 50px;
  background: #429e73;
  border-radius: 5px 0 0 5px;
  color: #fff;
  font-size: 16px;
  line-height: 40px;
}
.input_text .el-icon-close {
  left: auto;
  right: 0;
  height: 80%;
  top: 10%;
  line-height: 32px;
  background: transparent;
  border-left: 1px solid #aaa;
  color: #333;
  border-radius: 0;
}
.my_from {
  width: 800px;
  height: 600px;
  background: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* overflow: hidden; */
  border-radius: 15px;
}
.my_from .closeform {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: #429e73;
  color: #fff;
  z-index: 9999;
  cursor: pointer;
}
.my_from .closeform i {
  position: absolute;
  font-size: 14px;
  color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.tangram-suggestion-main {
  z-index: 9999999999;
}
.input_text {
  position: absolute;
  top: 20px;
  left: 20px;
}
.activeType {
  visibility: hidden;
}
.ad.el-icon-location {
  color: #006636;
  width: 35px;
  height: 35px;
  top: 0px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
}
.el-dialog__headerbtn {
  top: 0;
}
.exchangeEvent {
  overflow-x: hidden;
}
.exchangeEvent .rolebox {
  border-radius: 10px;
}
</style>
