<template>
        <el-table ref="multipleTable" align="left" :data="tableData" element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="number" label="编号" align="center"> </el-table-column>
        <el-table-column prop="name" label="名称" align="center" width="250"> </el-table-column>
        <el-table-column prop="address" label="事发地点" align="center" width="250"> </el-table-column>
        <el-table-column prop="reportUser" label="报告人" align="center"> </el-table-column>
        <el-table-column prop="reportPhone" label="报告电话" align="center"> </el-table-column>
        <el-table-column prop="userName" label="接报人" align="center"> </el-table-column>
        <el-table-column label="接报时间" align="center">
          <template slot-scope="scope">
            <span>
              {{scope.row.reportedTime.substr(0,16)}}
            </span>
          </template>
       </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1" size="mini" type="danger" round>未发布</el-button>
            <el-button v-else-if="scope.row.status==2" size="mini" type="primary" round>发布审批</el-button>
            <el-button v-else-if="scope.row.status==3" size="mini" type="success" round>待调查</el-button>
            <el-button v-else-if="scope.row.status==4" size="mini" type="warning" round>调查中</el-button>
            <el-button v-else-if="scope.row.status==5" size="mini" type="warning" round>结案审批</el-button>
            <el-button v-else size="mini" type="warning" round>已结案</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250" align="left">
          <template slot-scope="scope">
            <div class="issueDiv" v-if="config.hasPermission('event:current:publish')">
              <el-button v-if="scope.row.status==1" type="primary" size="mini" @click.native.prevent="issueRow(scope.row)">发布</el-button>
              <el-button v-else type="primary" size="mini" @click.native.prevent="addRunner(scope.row)">增派</el-button>
            </div>
            <el-button @click="handleClick(scope.row)" v-if="config.hasPermission('event:current:info')" type="text" size="small">查看</el-button>

            <el-button v-if="config.hasPermission('event:current:update')  && scope.row.status==4 " type="text" size="small" @click.native.prevent="updateSurvey(scope.row)">调查</el-button>
            <el-button v-else v-show="config.hasPermission('event:current:update')" type="text" size="small" @click.native.prevent="updateRow(scope.row)">编辑</el-button>

            <el-button type="text" size="small" v-if="config.hasPermission('event:current:delete')" @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 class="block"-->
      <div class="page_main">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
</template>

