<template>
  <div class="formlistbox">
    <!-- <div class="top-main">
      <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>调查表单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div class="formlist-container">
      <el-tabs
        type="border-card"
        style=" min-height: 800px;"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <!-- 现况部分开始 -->
        <el-tab-pane label="现况调查表" name="xiankuang">
          <el-form
            :inline="true"
            :model="formQueryCurrentSituation"
            label-position="right"
            style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;"
            class="demo-form-inline"
          >
            <el-form-item label="表单名称：">
              <el-input
                style="width:300px;"
                v-model="formQueryCurrentSituation.eventName"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>

            <el-form-item label="更新时间：">
              <el-date-picker
                v-model="formQueryCurrentSituationTime"
                clearable:true
                :picker-options="pickerOptions1"
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
              <el-button type="primary" @click="query(1)">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="addForm(1)"
                v-if="config.hasPermission('data:froms:save')"
              >添加</el-button>
              <el-button
                type="primary"
                @click="delForms(1)"
                v-if="config.hasPermission('data:froms:delete')"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            align="left"
            :data="tableDataCurrentSituation"
            bordertooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeCurrentSituation"
            border
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>

            <el-table-column prop="typeName" label="类型" align="center"></el-table-column>
            <el-table-column prop="name" label="表单名称" align="center" width="300"></el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updateAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">未发布</span>
                <span v-if="scope.row.status==2">已发布</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:info')"
                  @click="formDetail(scope.$index,scope.row)"
                >查看</el-button>

                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:update')"
                  @click="formEdit(scope.$index,scope.row)"
                >编辑</el-button>

                <span
                  v-if="(scope.row.template&&scope.row.tenId==0)||(!scope.row.template&&scope.row.tenId!=0)"
                >
                  <el-button
                    type="text"
                    size="small"
                    v-if="config.hasPermission('data:froms:delete')"
                    @click="formDel(scope.$index, scope.row,1)"
                  >删除</el-button>
                </span>
                
                <span v-if="(!scope.row.template)||(scope.row.template&&scope.row.thisTenId==0)">
                  <el-button size="small" @click="recoverFroms(scope.$index, scope.row,1)">初始化表单</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="background-color:#fff;padding-bottom:20px;"
            @size-change="handleSizeChangeCurrentSituation"
            @current-change="handleCurrentChangeCurrentSituation"
            :current-page.sync="currentPageCurrentSituation"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="formQueryCurrentSituation.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCurrentSituation"
          ></el-pagination>
        </el-tab-pane>
        <!-- 现况部分结束 -->
        <!-- 个案部分开始 -->
        <el-tab-pane label="个案调查表" name="gean">
          <el-form
            :inline="true"
            :model="formQueryIndividualCase"
            label-position="right"
            style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;"
            class="demo-form-inline"
          >
            <el-form-item label="表单名称：">
              <el-input
                style="width:300px;"
                v-model="formQueryIndividualCase.eventName"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
            <el-form-item label="更新时间：">
              <el-date-picker
                v-model="formQueryIndividualCaseTime"
                clearable:true
                :picker-options="pickerOptions2"
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
              <el-button type="primary" @click="query(2)">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="addForm(2)"
                v-if="config.hasPermission('data:froms:save')"
              >添加</el-button>
              <el-button
                type="primary"
                @click="delForms(2)"
                v-if="config.hasPermission('data:froms:delete')"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            :data="tableDataIndividualCase"
            bordertooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeIndividualCase"
            border
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>

            <el-table-column prop="typeName" label="类型" align="center"></el-table-column>
            <el-table-column prop="name" label="表单名称" align="center" width="300"></el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updateAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">未发布</span>
                <span v-if="scope.row.status==2">已发布</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:info')"
                  @click="formDetail(scope.$index,scope.row)"
                >查看</el-button>
                <!-- <span v-if="scope.row.status==1"> -->
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:update')"
                  @click="formEdit(scope.$index,scope.row)"
                >编辑</el-button>
                <!-- </span> -->
                <span
                  v-if="(scope.row.template&&scope.row.tenId==0)||(!scope.row.template&&scope.row.tenId!=0)"
                >
                  <el-button
                    type="text"
                    size="small"
                    v-if="config.hasPermission('data:froms:delete')"
                    @click="formDel(scope.$index, scope.row,2)"
                  >删除</el-button>
                </span>

                <el-button
                  size="small"
                  v-if="config.hasPermission('data:froms:control')"
                  @click="controlMeasures(scope.$index, scope.row)"
                >控制措施</el-button>
                <span v-if="(!scope.row.template)||(scope.row.template&&scope.row.thisTenId==0)">
                  <el-button size="small" @click="recoverFroms(scope.$index, scope.row,2)">初始化表单</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="background-color:#fff;padding-bottom:20px;"
            @size-change="handleSizeChangeIndividualCase"
            @current-change="handleCurrentChangeIndividualCase"
            :current-page.sync="currentPageIndividualCase"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="formQueryIndividualCase.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalIndividualCase"
          ></el-pagination>
        </el-tab-pane>
        <!-- 个案部分结束 -->
        <!-- 个案一览表开始 -->
        <el-tab-pane label="个案一览表" name="geanyilan">
          <el-form
            :inline="true"
            :model="formQueryIndividualCaseList"
            label-position="right"
            style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;"
            class="demo-form-inline"
          >
            <el-form-item label="表单名称：">
              <el-input
                style="width:300px;"
                v-model="formQueryIndividualCaseList.eventName"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
            <el-form-item label="更新时间：">
              <el-date-picker
                v-model="formQueryIndividualCaseListTime"
                clearable:true
                :picker-options="pickerOptions3"
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
              <el-button type="primary" @click="query(4)">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="addForm(4)"
                v-if="config.hasPermission('data:froms:save')"
              >添加</el-button>
              <el-button
                type="primary"
                @click="delForms(4)"
                v-if="config.hasPermission('data:froms:delete')"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            :data="tableDataIndividualCaseList"
            bordertooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeIndividualCaseList"
            border
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>

            <el-table-column prop="typeName" label="类型" align="center"></el-table-column>
            <el-table-column prop="name" label="表单名称" align="center" width="300"></el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updateAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">未发布</span>
                <span v-if="scope.row.status==2">已发布</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:info')"
                  @click="formDetail(scope.$index,scope.row)"
                >查看</el-button>

                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:update')"
                  @click="formEdit(scope.$index,scope.row)"
                >编辑</el-button>

                <span
                  v-if="(scope.row.template&&scope.row.tenId==0)||(!scope.row.template&&scope.row.tenId!=0)"
                >
                  <el-button
                    type="text"
                    size="small"
                    v-if="config.hasPermission('data:froms:delete')"
                    @click="formDel(scope.$index, scope.row,4)"
                  >删除</el-button>
                </span>
                <span v-if="(!scope.row.template)||(scope.row.template&&scope.row.thisTenId==0)">
                  <el-button size="small" @click="recoverFroms(scope.$index, scope.row,2)">初始化表单</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="background-color:#fff;padding-bottom:20px;"
            @size-change="handleSizeChangeIndividualCaseList"
            @current-change="handleCurrentChangeIndividualCaseList"
            :current-page.sync="currentPageIndividualCaseList"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="formQueryIndividualCaseList.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalIndividualCaseList"
          ></el-pagination>
        </el-tab-pane>
        <!-- 个案一览表结束 -->
        <!-- 个案随访表开始 -->
        <el-tab-pane label="个案随访表" name="geansuifang">
          <el-form
            :inline="true"
            :model="formQueryIndividualCaseFollow"
            label-position="right"
            style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;"
            class="demo-form-inline"
          >
            <el-form-item label="表单名称：">
              <el-input
                style="width:300px;"
                v-model="formQueryIndividualCaseFollow.eventName"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
            <el-form-item label="更新时间：">
              <el-date-picker
                v-model="formQueryIndividualCaseFollowTime"
                clearable:true
                :picker-options="pickerOptions4"
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
              <el-button type="primary" @click="query(5)">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="addForm(5)"
                v-if="config.hasPermission('data:froms:save')"
              >添加</el-button>
              <el-button
                type="primary"
                @click="delForms(5)"
                v-if="config.hasPermission('data:froms:delete')"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            :data="tableDataIndividualCaseFollow"
            bordertooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeIndividualCaseFollow"
            border
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>

            <el-table-column prop="typeName" label="类型" align="center"></el-table-column>
            <el-table-column prop="name" label="表单名称" align="center" width="300"></el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updateAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">未发布</span>
                <span v-if="scope.row.status==2">已发布</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:info')"
                  @click="formDetail(scope.$index,scope.row)"
                >查看</el-button>
                <!-- <span v-if="scope.row.status==1"> -->
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:update')"
                  @click="formEdit(scope.$index,scope.row)"
                >编辑</el-button>
                <!-- </span> -->
                <span
                  v-if="(scope.row.template&&scope.row.tenId==0)||(!scope.row.template&&scope.row.tenId!=0)"
                >
                  <el-button
                    type="text"
                    size="small"
                    v-if="config.hasPermission('data:froms:delete')"
                    @click="formDel(scope.$index, scope.row,2)"
                  >删除</el-button>
                </span>

                <el-button
                  size="small"
                  v-if="config.hasPermission('data:froms:control')"
                  @click="controlMeasures(scope.$index, scope.row)"
                >控制措施</el-button>
                <span v-if="(!scope.row.template)||(scope.row.template&&scope.row.thisTenId==0)">
                  <el-button size="small" @click="recoverFroms(scope.$index, scope.row,2)">初始化表单</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="background-color:#fff;padding-bottom:20px;"
            @size-change="handleSizeChangeIndividualCaseFollow"
            @current-change="handleCurrentChangeIndividualCaseFollow"
            :current-page.sync="currentPageIndividualCaseFollow"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="formQueryIndividualCaseFollow.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalIndividualCaseFollow"
          ></el-pagination>
        </el-tab-pane>
        <!-- 个案随访表结束 -->
        <!-- 医生部分开始 -->
        <el-tab-pane label="医生调查表" name="yisheng">
          <el-form
            :inline="true"
            :model="formQueryDoctor"
            label-position="right"
            style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;"
            class="demo-form-inline"
          >
            <el-form-item label="表单名称：">
              <el-input
                style="width:300px;"
                v-model="formQueryDoctor.eventName"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
            <el-form-item label="更新时间：">
              <el-date-picker
                v-model="formQueryDoctorTime"
                clearable:true
                :picker-options="pickerOptions5"
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
              <el-button type="primary" @click="query(3)">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="addForm(3)"
                v-if="config.hasPermission('data:froms:save')"
              >添加</el-button>
              <el-button
                type="primary"
                @click="delForms(3)"
                v-if="config.hasPermission('data:froms:delete')"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            align="left"
            :data="tableDataDoctor"
            bordertooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeDoctor"
            border
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="typeName" label="类型" align="center"></el-table-column>
            <el-table-column prop="name" label="表单名称" align="center" width="300"></el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updateAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">未发布</span>
                <span v-if="scope.row.status==2">已发布</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:info')"
                  @click="formDetail(scope.$index,scope.row)"
                >查看</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:update')"
                  @click="formEdit(scope.$index,scope.row)"
                >编辑</el-button>
                <span
                  v-if="(scope.row.template&&scope.row.tenId==0)||(!scope.row.template&&scope.row.tenId!=0)"
                >
                  <el-button
                    type="text"
                    size="small"
                    v-if="config.hasPermission('data:froms:delete')"
                    @click="formDel(scope.$index, scope.row,3)"
                  >删除</el-button>
                </span>

                <el-button
                  size="small"
                  v-if="config.hasPermission('data:froms:control')"
                  @click="controlMeasures(scope.$index, scope.row)"
                >控制措施</el-button>
                <span v-if="(!scope.row.template)||(scope.row.template&&scope.row.thisTenId==0)">
                  <el-button size="small" @click="recoverFroms(scope.$index, scope.row,3)">初始化表单</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="background-color:#fff;padding-bottom:20px;"
            @size-change="handleSizeChangeDoctor"
            @current-change="handleCurrentChangeDoctor"
            :current-page.sync="currentPageDoctor"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="formQueryDoctor.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalDoctor"
          ></el-pagination>
        </el-tab-pane>
        <!-- 医生部分结束 -->
        <!-- 事件报告模板开始 -->
        <!-- <el-tab-pane label="事件报告模板">
          <el-form :inline="true" :model="formQueryEventReportModel" label-position="right" style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;" class="demo-form-inline">
            <el-form-item>
              <el-input style="width:300px;" v-model="formQueryEventReportModel.eventName" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryEventReport()">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" align="left" :data="tableDataEventReportModel" bordertooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeEventReportModel">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="模板名称"> </el-table-column>
            <el-table-column prop="placeName" label="场所名称"> </el-table-column>
            <el-table-column prop="created" label="创建时间"> </el-table-column>
            <el-table-column prop="modified" label="修改时间"> </el-table-column>

            <el-table-column label="操作" width="350">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="formDetail(scope.$index,scope.row)">查看</el-button>
                <el-button type="text" size="small" @click="formEdit(scope.$index,scope.row)">编辑</el-button>
                <span v-if="!scope.row.isTemplate">
                  <el-button size="small" @click="recoverModels(scope.$index, scope.row)">初始化模板</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="background-color:#fff;padding-bottom:20px;" @size-change="handleSizeChangeEventReportModel" @current-change="handleCurrentChangeEventReportModel" :current-page.sync="currentPageEventReportModel" :page-sizes="[10, 25, 50, 100]" :page-size="formQueryEventReportModel.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalDoctor">
          </el-pagination>
        </el-tab-pane>-->
        <!-- 事件报告模板结束 -->
        <!-- 采样送检表开始 -->
        <el-tab-pane label="采样检验表" name="caiyangsongjian">
          <el-form
            :inline="true"
            :model="formQuerySample"
            label-position="right"
            style="text-align: left;background-color: #fff;padding-left:  10px;padding-top: 20px;"
            class="demo-form-inline"
          >
            <el-form-item label="表单名称：">
              <el-input
                style="width:300px;"
                v-model="formQuerySample.eventName"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
            <el-form-item label="更新时间：">
              <el-date-picker
                v-model="formQuerySampleTime"
                clearable:true
                :picker-options="pickerOptions5"
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
              <el-button type="primary" @click="query(6)">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="addForm(6)"
                v-if="config.hasPermission('data:froms:save')"
              >添加</el-button>
              <el-button
                type="primary"
                @click="delForms(6)"
                v-if="config.hasPermission('data:froms:delete')"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            align="left"
            :data="tableDataSample"
            bordertooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChangeSample"
            border
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="typeName" label="类型" align="center"> </el-table-column> -->
            <el-table-column prop="name" label="表单名称" align="center" width="300"></el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updateAt.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">未发布</span>
                <span v-if="scope.row.status==2">已发布</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:info')"
                  @click="formDetail(scope.$index,scope.row)"
                >查看</el-button>
                <el-button
                  type="text"
                  size="small"
                  v-if="config.hasPermission('data:froms:update')"
                  @click="formEdit(scope.$index,scope.row)"
                >编辑</el-button>
                <!-- <span v-if="(scope.row.template&&scope.row.tenId==0)||(!scope.row.template&&scope.row.tenId!=0)">
                  <el-button type="text" size="small" v-if="config.hasPermission('data:froms:delete')" @click="formDel(scope.$index, scope.row,3)">删除</el-button>
                </span>

                <el-button size="small" v-if="config.hasPermission('data:froms:control')" @click="controlMeasures(scope.$index, scope.row)">控制措施</el-button>
                <span v-if="!scope.row.template">
                  <el-button size="small" @click="recoverFroms(scope.$index, scope.row,3)">初始化表单</el-button>
                </span>-->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="background-color:#fff;padding-bottom:20px;"
            @size-change="handleSizeChangeSample"
            @current-change="handleCurrentChangeSample"
            :current-page.sync="currentPageSample"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="formQuerySample.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSample"
          ></el-pagination>
        </el-tab-pane>
        <!-- 采样送检表结束 -->
      </el-tabs>

      <!-- 添加弹出框 -->
      <el-dialog title="添加表单" :visible.sync="dialogAddVisible">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          :rules="rules"
          class="addform"
          id="form_add"
        >
          <el-form-item label="地区场所：" align="left" required v-show="formPlaceShow">
            <el-select
              style="width:360px"
              v-model="form.formPlace"
              placeholder="请选择"
              @change="getFormName"
            >
              <el-option
                v-for="item in placeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="选择类别：" v-show="typeShow" align="left" required>
            <!-- <el-select class="myselect" v-model="firstId" placeholder="请选择" @change="selectFirst(firstId)">
          <el-option v-for="item in firstList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
            </el-select>-->
            <!-- 第二级 -->
            <el-select
              class="myselect"
              style="width:120px"
              v-show="secondShow"
              v-model="secondId"
              placeholder="请选择"
              @change="selectSecond(secondId)"
            >
              <el-option
                v-for="item in secondList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <!-- 第三级 -->
            <el-select
              class="myselect"
              style="width:120px"
              v-show="thirdShow"
              v-model="thirdId"
              placeholder="请选择"
              @change="selectThird(thirdId)"
            >
              <el-option
                v-for="item in thirdList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <!-- 第四级 -->
            <el-select
              class="myselect"
              style="width:120px"
              v-show="fouthShow"
              v-model="fouthId"
              placeholder="请选择"
              @change="selectFouth(fouthId)"
            >
              <el-option
                v-for="item in fouthList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采样表单类型：" align="left" required v-show="formTypeShow">
            <el-select
              style="width:360px"
              v-model="form.caseChild"
              placeholder="请选择"
              @change="formTypeChange"
            >
              <el-option label="采样送检表" value="4"></el-option>
              <el-option label="采样结果表" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表单标题：" required align="left">
            <el-input style="width:364px" v-model="form.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveCall">确认</el-button>
          <el-button @click="closeShow">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
var config = require("@/components/utils/Common_Config.js");

var Cookies = require("js-cookie");
import axios from "axios";
import qs from "qs";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      config: config,
      activeName: "", //当前页

      //弹窗中添加参数
      dialogAddVisible: false,
      formPlaceShow: false, //地区场所下拉框
      formTypeShow: false, //采样表单类型
      firstId: "",
      secondId: "",
      thirdId: "",
      fouthId: "",
      typeShow: false,
      secondShow: false,
      thirdShow: false,
      fouthShow: false,
      form: {
        title: "",
        diseaseId: "",
        type: "",
        formPlace: "",
        caseChild: ""
      },
      rules: {
        // title: [
        //   {
        //     required: true,
        //     message: '请输入标题',
        //     trigger: 'blur'
        //   }
        // ],
        // type:[
        //   {
        //     require:true,
        //     message: '请选择类别',
        //     trigger: 'blur'
        //   }
        // ],
        // formPlace:[
        //   {
        //     required: true,
        //     message: '请选择地区场所',
        //     trigger: 'change'
        //   }
        // ]
      },
      placeList: [],
      secondList: [
        {
          name: "不明原因",
          id: "4" //6
        },
        {
          name: "传染病",
          id: "6" //9
        },
        {
          name: "食源性",
          id: "5" //4
        }
      ],
      thirdList: [],
      fouthList: [],
      infectiousDiseases: [
        //传染病
        {
          name: "甲",
          id: "1"
        },
        {
          name: "乙",
          id: "2"
        },
        {
          name: "丙",
          id: "3"
        },
        {
          name: "其它",
          id: "5"
        }
      ],
      //获取表单名称参数
      formType: 1,
      caseChild: "",
      //时间控件
      //现况
      formQueryCurrentSituationTime: [],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //个案
      formQueryIndividualCaseTime: [],
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //个案一览表
      formQueryIndividualCaseListTime: [],
      pickerOptions3: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //个案随访表
      formQueryIndividualCaseFollowTime: [],
      pickerOptions4: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //医生调查表
      formQueryDoctorTime: [],
      pickerOptions5: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //采样送检表
      formQuerySampleTime: [],

      //查询参数
      //现况调查列表查询参数
      formQueryCurrentSituation: {
        eventName: "",
        pageSize: 10,
        pageNum: 1,
        type: 2,
        formPlace: ""
      },
      //个案调查列表查询参数
      formQueryIndividualCase: {
        eventName: "",
        pageSize: 10,
        pageNum: 1,
        type: 7,
        caseChild: 1
      },
      //个案一览表列表查询参数
      formQueryIndividualCaseList: {
        eventName: "",
        pageSize: 10,
        pageNum: 1,
        type: 7,
        caseChild: 2
      },
      //个案随访表列表查询参数
      formQueryIndividualCaseFollow: {
        eventName: "",
        pageSize: 10,
        pageNum: 1,
        type: 7,
        caseChild: 3
      },
      //医生调查列表查询参数
      formQueryDoctor: {
        eventName: "",
        pageSize: 10,
        pageNum: 1,
        type: 3
      },
      //事件报告模板调查列表查询参数
      formQueryEventReportModel: {
        eventName: "",
        pageSize: 10,
        pageNum: 1
      },
      //采样送检表查询参数
      formQuerySample: {
        eventName: "",
        pageSize: 10,
        pageNum: 1,
        type: 7,
        caseChild: 4
      },

      //列表数据
      tableDataCurrentSituation: [], //现况调查表列表数据
      tableDataIndividualCase: [], //个案调查表列表数据
      tableDataIndividualCaseList: [], //个案一览表列表数据
      tableDataIndividualCaseFollow: [], //个案随访列表数据
      tableDataDoctor: [], //医生调查列表数据
      tableDataEventReportModel: [], //事件报告模板列表数据
      tableDataSample: [], //采样送检表列表数据

      //当前页
      currentPageCurrentSituation: 1, //现况调查列表当前页
      currentPageIndividualCase: 1, //个案调查列表当前页
      currentPageIndividualCaseList: 1, //个案一览表当前页
      currentPageIndividualCaseFollow: 1, //个案随访表当前页
      currentPageDoctor: 1, //医生调查列表当前页
      currentPageEventReportModel: 1, //事件报告模板列表当前页
      currentPageSample: 1, //采样送检表

      //总页数
      totalCurrentSituation: 0, //现况调查表总页数
      totalIndividualCase: 0, //个案调查表列表总页数
      totalIndividualCaseList: 0, //个案一览表列表总数
      totalIndividualCaseFollow: 0, //个案随访表列表总数
      totalDoctor: 0, //医生调查表总页数
      totalEventReportModel: 0, //事件报告模板当前页
      totalSample: 0, //采样送检表总页数

      //表格选择数据
      tableSelectionCurrentSituation: [], //现况调查表当前选择项
      tableSelectionIndividualCase: [], //个案调查表当前选择项
      tableSelectionIndividualCaseList: [], //个案一览表当前选择项
      tableSelectionIndividualCaseFollow: [], //个案随访表当前选择项
      tableSelectionDoctor: [], //医生调查列表数据
      tableSelectionEventReportModel: [], //事件报告模板列表选择项
      tableSelectionSample: [] //采样送检表
    };
  },
  computed: {
    ...mapGetters(["nowTab"])
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.name);
      this.$store.dispatch("nowTab", tab.name);
    },
    //获取地区列表下拉数据
    getPlaceList() {
      var that = this;
      axios({
        method: "get",
        url: config.apiHost + "/basedata/place/list?page=1&limit=1000"
      }).then(res => {
        that.placeList = res.data.body.list;
      });
    },
    //事件报告模板
    queryEventReport() {
      //         var str = 'abcadeacf';
      // var str1 = str.replace('a', 'o');
      // alert(str1);

      // // 打印结果： obcadeacf

      // var str2 = str.replace(/a/g, 'o');
      // alert(str2);

      // //打印结果： obcodeocf,
      var that = this;
      axios({
        method: "get",
        url:
          config.apiHost +
          "/content/list?page=" +
          this.formQueryEventReportModel.pageNum +
          "&limit=" +
          this.formQueryEventReportModel.pageSize +
          "&name=" +
          this.formQueryEventReportModel.eventName.trim() //&type='+this.formQuery.formType+'&name='+this.formQuery.eventName,
      }).then(function(res) {
        that.tableDataEventReportModel = res.data.body.list;
        that.totalEventReportModel = res.data.body.totalCount;
        that.formQueryEventReportModel.pageSize = res.data.body.pageSize;
      });
    },
    //表单查询
    query(type) {
      let param = {};

      if (type == 1) {
        //现况

        param.name = this.formQueryCurrentSituation.eventName.trim();
        param.limit = this.formQueryCurrentSituation.pageSize;
        param.page = this.formQueryCurrentSituation.pageNum;
        param.type = this.formQueryCurrentSituation.type;

        if (
          this.formQueryCurrentSituationTime == null ||
          this.formQueryCurrentSituationTime.length == 0
        ) {
          param.startTime = "";
          param.endTime = "";
        } else {
          param.startTime = this.formQueryCurrentSituationTime[0];
          param.endTime = this.formQueryCurrentSituationTime[1];
        }
      } else if (type == 2) {
        //个案
        param.name = this.formQueryIndividualCase.eventName.trim();
        param.limit = this.formQueryIndividualCase.pageSize;
        param.page = this.formQueryIndividualCase.pageNum;
        param.type = this.formQueryIndividualCase.type;
        param.caseChild = this.formQueryIndividualCase.caseChild;
        if (
          this.formQueryIndividualCaseTime == null ||
          this.formQueryIndividualCaseTime.length == 0
        ) {
          param.startTime = "";
          param.endTime = "";
        } else {
          param.startTime = this.formQueryIndividualCaseTime[0];
          param.endTime = this.formQueryIndividualCaseTime[1];
        }
      } else if (type == 3) {
        //医生
        param.name = this.formQueryDoctor.eventName.trim();
        param.limit = this.formQueryDoctor.pageSize;
        param.page = this.formQueryDoctor.pageNum;
        param.type = this.formQueryDoctor.type;
        if (
          this.formQueryDoctorTime == null ||
          this.formQueryDoctorTime.length == 0
        ) {
          param.startTime = "";
          param.endTime = "";
        } else {
          param.startTime = this.formQueryDoctorTime[0];
          param.endTime = this.formQueryDoctorTime[1];
        }
      } else if (type == 4) {
        //个案一览表
        param.name = this.formQueryIndividualCaseList.eventName.trim();
        param.limit = this.formQueryIndividualCaseList.pageSize;
        param.page = this.formQueryIndividualCaseList.pageNum;
        param.type = this.formQueryIndividualCaseList.type;
        param.caseChild = this.formQueryIndividualCaseList.caseChild;
        if (
          this.formQueryIndividualCaseListTime == null ||
          this.formQueryIndividualCaseListTime.length == 0
        ) {
          param.startTime = "";
          param.endTime = "";
        } else {
          param.startTime = this.formQueryIndividualCaseListTime[0];
          param.endTime = this.formQueryIndividualCaseListTime[1];
        }
      } else if (type == 5) {
        //个案随访表
        param.name = this.formQueryIndividualCaseFollow.eventName.trim();
        param.limit = this.formQueryIndividualCaseFollow.pageSize;
        param.page = this.formQueryIndividualCaseFollow.pageNum;
        param.type = this.formQueryIndividualCaseFollow.type;
        param.caseChild = this.formQueryIndividualCaseFollow.caseChild;
        if (
          this.formQueryIndividualCaseFollowTime == null ||
          this.formQueryIndividualCaseFollowTime.length == 0
        ) {
          param.startTime = "";
          param.endTime = "";
        } else {
          param.startTime = this.formQueryIndividualCaseFollowTime[0];
          param.endTime = this.formQueryIndividualCaseFollowTime[1];
        }
      } else if (type == 6) {
        //送检表
        param.name = this.formQuerySample.eventName.trim();
        param.limit = this.formQuerySample.pageSize;
        param.page = this.formQuerySample.pageNum;
        param.type = this.formQuerySample.type;
        param.caseChild = this.formQuerySample.caseChild;
        if (
          this.formQuerySampleTime == null ||
          this.formQuerySampleTime.length == 0
        ) {
          param.startTime = "";
          param.endTime = "";
        } else {
          param.startTime = this.formQuerySampleTime[0];
          param.endTime = this.formQuerySampleTime[1];
        }
      }
      var that = this;
      let tableData = [];
      let total = 0;
      let pageSize = 0;
      console.log(param);
      axios({
        method: "get",
        async: false,
        url: config.apiHost + "/froms/queryFroms",
        params: param
      }).then(function(res) {
        tableData = res.data.body.list;
        total = res.data.body.totalCount;
        pageSize = res.data.body.pageSize;
        if (type == 1) {
          //现况
          that.tableDataCurrentSituation = tableData;
          that.totalCurrentSituation = total;
          that.formQueryCurrentSituation.pageSize = pageSize;
        } else if (type == 2) {
          //个案
          that.tableDataIndividualCase = tableData;
          that.totalIndividualCase = total;
          that.formQueryIndividualCase.pageSize = pageSize;
        } else if (type == 3) {
          //医生
          that.tableDataDoctor = tableData;
          that.totalDoctor = total;
          that.formQueryDoctor.pageSize = pageSize;
        } else if (type == 4) {
          //个案一览表
          that.tableDataIndividualCaseList = tableData;
          that.totalIndividualCaseList = total;
          that.formQueryIndividualCaseList.pageSize = pageSize;
        } else if (type == 5) {
          //个案随访表
          that.tableDataIndividualCaseFollow = tableData;
          that.totalIndividualCaseFollow = total;
          that.formQueryIndividualCaseFollow.pageSize = pageSize;
        } else if (type == 6) {
          that.tableDataSample = tableData;
          that.totalSample = total;
          that.formQuerySample.pageSize = pageSize;
        }
      });
    },

    //表单添加
    addForm(type) {
      this.firstId = "";
      this.secondId = "";
      this.thirdId = "";
      this.fouthId = "";
      this.typeShow = false;
      this.secondShow = false;
      this.thirdShow = false;
      this.fouthShow = false;
      this.formPlaceShow = false;
      this.formTypeShow = false;
      this.form.title = "";
      this.form.diseaseId = "";
      this.form.type = "";
      this.form.formPlace = "";
      this.form.caseChild = "";
      this.caseChild = "";

      this.dialogAddVisible = true;

      if (type == 1) {
        //现况
        this.formPlaceShow = true;
        this.firstId = 2;
        this.formType = 2;
      } else if (type == 2) {
        //个案
        this.firstId = 1;
        this.formType = 1;
        this.caseChild = 1;
      } else if (type == 3) {
        //医生
        this.firstId = 3;
        this.formType = 3;
      } else if (type == 4) {
        //个案一览表
        this.firstId = 1;
        this.formType = 1;
        this.caseChild = 2;
      } else if (type == 5) {
        //个案随访表
        this.firstId = 1;
        this.formType = 1;
        this.caseChild = 3;
      } else if (type == 6) {
        //采样送检表
        this.formTypeShow = true;
        this.firstId = 1;

        this.formType = 8;
      }
      this.selectFirst(this.firstId);
    },
    //表单批量删除
    delForms(type) {
      let delIds = "";
      let tableSelection = [];
      if (type == 1) {
        tableSelection = this.tableSelectionCurrentSituation;
      } else if (type == 2) {
        tableSelection = this.tableSelectionIndividualCase;
      } else if (type == 3) {
        tableSelection = this.tableSelectionDoctor;
      } else if (type == 4) {
        tableSelection = this.tableSelectionIndividualCaseList;
      } else if (type == 5) {
        tableSelection = this.tableSelectionIndividualCaseFollow;
      } else if (type == 6) {
        tableSelection = this.tableSelectionSample;
      }
      // console.log(this.tableSelection);
      if (tableSelection.length == 0) {
        this.$message.info("请选择需要删除的数据");
        return;
      }
      tableSelection.forEach(element => {
        delIds += "," + element.fromsId;
      });
      delIds = delIds.substring(1);
      this.$confirm("确定要删除所选表单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            //点击确认
            var that = this;
            axios({
              method: "get",
              url: config.apiHost + "/froms/deleteFroms?fromsId=" + delIds
            }).then(function(res) {
              if (res.data.status == 200) {
                that.query(type); //刷新列表
                that.$message({
                  type: "success",
                  message: res.data.body.msg
                });
              } else {
                that.$message({
                  typ: "error",
                  message: res.data.body.message
                });
              }
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
    //采样送检表选择采样表单类型的回调
    formTypeChange() {
      console.log("选择的疾病ID：" + this.form.diseaseId);
      this.caseChild = this.form.caseChild;
      console.log("caseChild的值：" + this.caseChild);
      var _this = this;
      if (this.form.diseaseId != "" && this.form.caseChild != "") {
        axios({
          method: "get",
          url: config.apiHost + "/fromManager/getFromName",
          params: {
            type: 8,
            caseChild: _this.form.caseChild,
            diseaseId: _this.form.diseaseId
          }
        }).then(res => {
          if (res.data.status == 200) {
            _this.form.title = res.data.body.msg;
          }
        });
      }
    },
    //表单编辑
    formEdit(index, row) {
      //列表中的编辑

      this.$router.push({
        name: "data-editFormDetail",
        params: {
          formId: row.fromsId,
          type: row.type,
          surveyName: row.name,
          diseaseId: row.diseaseId
        }
      });
    },
    //表单查看
    formDetail(index, row) {
      this.$router.push({
        name: "data-preview",
        params: {
          formId: row.fromsId
        }
      });
    },
    formDel(index, row, type) {
      //列表中的删除
      this.$confirm("确定要删除该表单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            var that = this;
            axios({
              method: "get",
              url: config.apiHost + "/froms/deleteFroms?fromsId=" + row.fromsId
            }).then(function(res) {
              if (res.data.status == 200) {
                that.$message({
                  typ: "success",
                  message: res.data.body.msg
                });
              } else {
                that.$message({
                  type: "error",
                  message: res.data.body.message
                });
              }
              that.query(type); //刷新列表
            });
          } else {
            that.$message({
              typ: "info",
              message: "已取消删除"
            });
          }
        },
        type: "warning"
      });
    },
    controlMeasures(index, row, type) {
      //列表中的控制措施
      this.$router.push({
        name: "data-controlMeasures",
        params: {
          formId: row.fromsId,
          surveyName: row.name,
          diseaseId: row.diseaseId
        }
      });
    },
    //初始化表单
    recoverFroms(index, row, type) {
      this.$confirm("确定要初始化该表单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            var that = this;
            axios({
              method: "get",
              url: config.apiHost + "/froms/recoverFroms?fromsId=" + row.fromsId
            }).then(function(res) {
              if (res.data.status == 200) {
                that.$message({
                  typ: "success",
                  message: res.data.body.msg
                });
              } else {
                that.$message({
                  typ: "error",
                  message: res.data.body.message
                });
              }
              that.query(type); //刷新列表
            });
          } else {
            that.$message({
              typ: "info",
              message: "已取消删除"
            });
          }
        },
        type: "warning"
      });
    },
    //初始化模板
    recoverModels(index, row) {
      var that = this;
      this.$confirm("确定要初始化该事件报告模板吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            axios({
              method: "get",
              url:
                config.apiHost +
                "/content/resetTemple?templateId=" +
                row.templateId
            }).then(function(res) {
              if (res.data.status == 200) {
                that.$message({
                  typ: "success",
                  message: res.data.body.msg
                });
              } else {
                that.$message({
                  typ: "error",
                  message: res.data.body.message
                });
              }
              that.queryEventReport(); //刷新列表
            });
          } else {
            that.$message({
              typ: "info",
              message: "已取消删除"
            });
          }
        },
        type: "warning"
      });
    },
    //事件报告模板删除
    modelDel(index, row) {
      //列表中的删除
      var that = this;
      this.$confirm("确定要删除该事件模板吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (acction, instance) => {
          if (acction === "confirm") {
            axios({
              method: "get",
              url: config.apiHost + "/froms/deleteFroms?fromsId=" + row.fromsId
            }).then(function(res) {
              if (res.data.status == 200) {
                that.$message({
                  typ: "success",
                  message: res.data.body.msg
                });
              } else {
                that.$message({
                  typ: "error",
                  message: res.data.body.message
                });
              }
              that.queryEventReport(); //刷新列表
            });
          } else {
            that.$message({
              typ: "info",
              message: "已取消删除"
            });
          }
        },
        type: "warning"
      });
    },
    /**
     * 现况
     */
    //分页大小变化
    handleSizeChangeCurrentSituation(val) {
      this.formQueryCurrentSituation.pageSize = val;
      this.query(1);
    },
    //当前页变化
    handleCurrentChangeCurrentSituation(val) {
      this.formQueryCurrentSituation.pageNum = val;
      this.query(1);
    },
    //选择项变化
    handleSelectionChangeCurrentSituation(selection) {
      this.tableSelectionCurrentSituation = selection;
    },

    /**
     * 个案 */
    //分页大小变化
    handleSizeChangeIndividualCase(val) {
      this.formQueryIndividualCase.pageSize = val;
      this.query(2);
    },
    //当前页变化
    handleCurrentChangeIndividualCase(val) {
      this.formQueryIndividualCase.pageNum = val;
      this.query(2);
    },
    handleSelectionChangeIndividualCase(selection) {
      this.tableSelectionIndividualCase = selection;
    },
    /**
     * 个案一览表 */
    //分页大小变化
    handleSizeChangeIndividualCaseList(val) {
      this.formQueryIndividualCaseList.pageSize = val;
      this.query(4);
    },
    //当前页变化
    handleCurrentChangeIndividualCaseList(val) {
      this.formQueryIndividualCaseList.pageNum = val;
      this.query(4);
    },
    handleSelectionChangeIndividualCaseList(selection) {
      this.tableSelectionIndividualCaseList = selection;
    },
    /**
     * 个案随访表 */
    //分页大小变化
    handleSizeChangeIndividualCaseFollow(val) {
      this.formQueryIndividualCaseFollow.pageSize = val;
      this.query(5);
    },
    //当前页变化
    handleCurrentChangeIndividualCaseFollow(val) {
      this.formQueryIndividualCaseFollow.pageNum = val;
      this.query(5);
    },
    handleSelectionChangeIndividualCaseFollow(selection) {
      this.tableSelectionIndividualCaseFollow = selection;
    },
    /**医生 */
    //分页大小变化
    handleSizeChangeDoctor(val) {
      this.formQueryDoctor.pageSize = val;
      this.query(3);
    },
    //当前页变化
    handleCurrentChangeDoctor(val) {
      this.formQueryDoctor.pageNum = val;
      this.query(3);
    },
    handleSelectionChangeDoctor(selection) {
      this.tableSelectionDoctor = selection;
    },

    /**事件报告模板 */
    //分页大小变化
    handleSizeChangeEventReportModel(val) {
      this.formQueryEventReportModel.pageSize = val;
      this.query(3);
    },
    //当前页变化
    handleCurrentChangeEventReportModel(val) {
      this.formQueryEventReportModel.pageNum = val;
      this.query(3);
    },
    handleSelectionChangeEventReportModel(selection) {
      this.tableSelectionEventReportModel = selection;
    },
    /**采样送检表 */
    //分页大小变化
    handleSizeChangeSample(val) {
      this.formQuerySample.pageSize = val;
      this.query(6);
    },
    //当前页变化
    handleCurrentChangeSample(val) {
      this.formQuerySample.pageNum = val;
      this.query(6);
    },
    handleSelectionChangeSample(selection) {
      this.tableSelectionSample = selection;
    },

    /**添加弹窗中的事件 */
    //保存按钮
    saveCall() {
      if (this.form.title == "") {
        this.$message({
          type: "info",
          message: "请输入表单名称"
        });
        return;
      } else if (this.form.type == "") {
        this.$message({
          type: "info",
          message: "请选择类别"
        });
        return;
      } else if (
        (this.form.type == 5 || this.form.type == 6) &&
        (this.form.diseaseId == "" || this.form.diseaseId.length == 0)
      ) {
        this.$message({
          type: "info",
          message: "请选择疾病"
        });
        return;
      } else {
        console.log("caseChild的值：" + this.caseChild);
        // return;
        //请求保存接口
        axios({
          method: "post",
          url: config.apiHost + "/fromManager/addFrom",
          data: {
            placeId: this.form.formPlace,
            name: this.form.title,
            caseChild: this.caseChild,
            diseaseId: this.form.diseaseId,
            type: this.form.type
          }
        }).then(res => {
          if (res.data.status == 200) {
            console.log(res.data.body);

            this.$router.push({
              name: "data-editFormDetail",
              params: {
                formId: res.data.body.fromsId,
                type: res.data.body.type,
                surveyName: res.data.body.name,
                diseaseId: res.data.body.diseaseId
              }
            });
          }
        });
        // this.$router.push({
        //   name: 'data-addFormDetail',
        //   params: {
        //     surveyName: this.form.title,
        //     type: this.form.type,
        //     diseaseId: this.form.diseaseId
        //   }
        // })
      }
    },
    //取消按钮
    closeShow() {
      this.dialogAddVisible = false;
    },
    //选择地区场所回调，获取表单名称
    getFormName() {
      axios({
        method: "get",
        url: config.apiHost + "/fromManager/getFromName",
        params: {
          placeId: this.form.formPlace,
          type: this.formType,
          caseChild: "",
          diseaseId: ""
        }
      }).then(res => {
        if (res.data.status == 200) {
          // console.log(res.data.body)
          this.form.title = res.data.body.msg;
        }
      });
    },
    selectFirst(value) {
      this.secondId = "";
      this.thirdId = "";
      this.fouthId = "";
      this.form.type = value;
      this.form.title = "";

      if (value == 1) {
        this.form.type = "";
        //个案
        this.typeShow = true;
        this.secondShow = true;
        var _this = this;
        axios({
          method: "get",
          url: config.apiHost + "/disease/list?type=5"
        }).then(function(res) {
          _this.thirdList = res.data.body;
        });
      } else {
        this.typeShow = false;
        this.secondShow = false;
        this.thirdShow = false;
        this.fouthShow = false;
      }
    },
    selectSecond(value) {
      this.thirdId = "";
      this.fouthId = "";

      this.form.type = value;
      this.form.title = "";
      if (value == 6) {
        //传染病
        this.thirdShow = true;
        this.fouthShow = true;
        this.thirdList = this.infectiousDiseases;
      } else if (value == 5) {
        //食源性
        this.thirdShow = true;
        this.fouthShow = false;
        this.fouthId = "";
        var _this = this;
        axios({
          method: "get",
          url: config.apiHost + "/disease/list?type=4"
        }).then(function(res) {
          _this.thirdList = res.data.body;
        });
      } else {
        //不明原因
        this.thirdShow = false;
        this.fouthShow = false;
        var _this = this;
        axios({
          method: "get",
          url: config.apiHost + "/disease/list?type=6"
        }).then(function(res) {
          _this.form.diseaseId = res.data.body[0].id;
          if (_this.formType == 8) {
            //采样送检添加，先判断是否选择了采样表单类型
            if (_this.form.caseChild != "") {
              console.log("获取表单名称");
              axios({
                method: "get",
                url: config.apiHost + "/fromManager/getFromName",
                params: {
                  placeId: "",
                  type: _this.form.type,
                  caseChild: _this.caseChild,
                  diseaseId: res.data.body[0].id
                }
              }).then(res => {
                if (res.data.status == 200) {
                  _this.form.title = res.data.body.msg;
                }
              });
            }
          } else {
            //获取表单名称
            console.log("获取表单名称");
            axios({
              method: "get",
              url: config.apiHost + "/fromManager/getFromName",
              params: {
                placeId: "",
                type: _this.form.type,
                caseChild: _this.caseChild,
                diseaseId: res.data.body[0].id
              }
            }).then(res => {
              if (res.data.status == 200) {
                _this.form.title = res.data.body.msg;
              }
            });
          }
        });
      }
    },
    selectThird(value) {
      this.fouthId = "";
      var _this = this;
      _this.form.title = "";
      if (this.fouthShow == true) {
        axios({
          method: "get",
          url: config.apiHost + "/disease/list?type=" + value
        }).then(function(res) {
          _this.fouthList = res.data.body;
        });
      } else {
        _this.form.diseaseId = value;
        if (_this.formType == 8) {
          if (_this.form.caseChild != "") {
            console.log("获取表单名称");
            axios({
              method: "get",
              url: config.apiHost + "/fromManager/getFromName",
              params: {
                type: 8,
                caseChild: _this.form.caseChild,
                diseaseId: value
              }
            }).then(res => {
              if (res.data.status == 200) {
                _this.form.title = res.data.body.msg;
              }
            });
          }
        } else {
          console.log("获取表单名称");
          axios({
            method: "get",
            url: config.apiHost + "/fromManager/getFromName",
            params: {
              placeId: "",
              type: this.form.type,
              caseChild: this.caseChild,
              diseaseId: value
            }
          }).then(res => {
            if (res.data.status == 200) {
              _this.form.title = res.data.body.msg;
            }
          });
        }
      }
    },
    selectFouth(value) {
      this.form.diseaseId = value;

      var _this = this;
      if (this.formType == 8) {
        if (this.form.caseChild != "") {
          //获取表单名称
          axios({
            method: "get",
            url: config.apiHost + "/fromManager/getFromName",
            params: {
              type: this.form.type,
              caseChild: this.form.caseChild,
              diseaseId: value
            }
          }).then(res => {
            if (res.data.status == 200) {
              _this.form.title = res.data.body.msg;
            }
          });
        }
      } else {
        //获取表单名称
        axios({
          method: "get",
          url: config.apiHost + "/fromManager/getFromName",
          params: {
            placeId: "",
            type: this.form.type,
            caseChild: this.caseChild,
            diseaseId: value
          }
        }).then(res => {
          if (res.data.status == 200) {
            _this.form.title = res.data.body.msg;
          }
        });
      }
    }
  },
  mounted() {
    this.activeName = this.nowTab;
  },
  created() {
    this.query(1); //现况
    this.query(2); //个案
    this.query(3); //医生
    this.query(4); //个案一览表
    this.query(5); //个案随访表
    this.query(6); //采样送检表
    this.queryEventReport(); //事件报告模板
    this.getPlaceList(); //获取地区场所下拉数据
  }
};
</script>
<style scoped>
.formlistbox {
  width: auto;
  min-height: 100%;
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
.formlist-container {
  height: calc(100% - 45px);
  min-height: 800px;
  background-color: #ffffff;
}
#form_add {
  width: 500px;
  margin: 0 auto;
}
.el-table .el-button:hover{
  background: #429E73;
  border-color: #429E73;
  color: #fff;
}
</style>
