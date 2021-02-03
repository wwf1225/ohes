<template>
    <div class="partmentmgr-container">
        <!-- <div class="top-main">
            <el-breadcrumb separator-class="el-icon-arrow-right" style=" height: 45px;line-height:45px;">
                <el-breadcrumb-item>数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>事件场所管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <div class="tab_main">
            <!-- 左侧 -->
            <div class="left_main">
                <div class="top_box">
                    <i class="el-icon-circle-plus" style=" font-size: 30px; margin-right: 15px;" @click="addDept"></i>
                    <span>添加顶层地区</span>
                </div>
                <div class="content">
                    <el-tree :data="treeData" :load="loadNode" :props="props" lazy @node-click="handleNodeClick" ref="tree">
                    </el-tree>
                </div>
            </div>
            <!-- 右侧 -->
            <div class="right_main">
                <div class="content-right">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import school from '@/components/datas/school.vue'
import topArea from '@/components/datas/topArea.vue'
import hospital from '@/components/datas/hospital.vue'
import enterprise from '@/components/datas/enterprise.vue'
import community from '@/components/datas/community.vue'
import foodmag from '@/components/datas/foodmag.vue'
import axios from 'axios'
import vue from 'vue'
var config = require('@/components/utils/Common_Config.js')
export default {
  data() {
    return {
      treeData: [],

      props: {
        label: 'areaName',
        children: 'objectList'
      }
    }
  },
  components: {
    school,
    hospital,
    enterprise,
    community,
    foodmag
  },
  computed: {
    ...mapGetters(['isnums'])
  },
  watch: {
    isnums() {
      this.tree()
      this.$store.dispatch('refNum', 6) //刷新父级组件
    }
  },
  methods: {
    tree() {
      this.treeData=[];
      var _this=this;
      axios
        .get(config.apiHost + '/placeMain/place/asyncAreaTree', {
          params: {
            // level:1,
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            _this.treeData = result.data.body
            console.log(_this.treeData);
          }
        })
        .catch(function(response) {})
    },
    loadNode(node, resolve) {
      console.log(node.data.level)
      //   console.log(resolve)
      if (node.data.level == 6) {
        // resolve()
        resolve([])
        //子页面跳转学校企业页面
        if (node.data.id == 1) {
          this.$router.push({
            name: 'data-school',
            params: { areaId: node.parent.data.id, type: 1 }
          })
        } else if (node.data.id == 5) {
          this.$router.push({
            name: 'data-hospital',
            params: { areaId: node.parent.data.id, type: 5 }
          })
        } else if (node.data.id == 2) {
          this.$router.push({
            name: 'data-enterprise',
            params: { areaId: node.parent.data.id, type: 2 }
          })
        } else if (node.data.id == 3) {
          this.$router.push({
            name: 'data-community',
            params: { areaId: node.parent.data.id, type: 3 }
          })
        } else if (node.data.id == 4) {
          this.$router.push({
            name: 'data-foodmag',
            params: { areaId: node.parent.data.id, type: 4 }
          })
        }
      }else{
        axios
        .get(config.apiHost + '/placeMain/place/asyncAreaTree', {
          params: {
            //请求参数
            level: node.data.level,
            parentId: node.data.id
          }
        })
        .then(result => {
          if (result.data.status == 200) {
            // console.log(result.data.body)
            resolve(result.data.body)
          }
        })
        .catch(function(response) {})
      }
      //  else if (
      //   node.data.level == 1 ||
      //   node.data.level == 2 ||
      //   node.data.level == 3 ||
      //   node.data.level == 4
      // ) {
      //   //跳转省市区页面
      //   this.$router.push({
      //     name: 'data-addArea',
      //     params: { parentId: node.data.id, level: node.data.level }
      //   })
      // }
    },
    handleNodeClick(node, data, resolve) {
      // console.log(data.parent.data)
      console.log(data)
      console.log(node)
      if (
        node.level == 1 ||
        node.level == 2 ||
        node.level == 3 ||
        node.level == 4||
        node.level == 5
      ) {
        //跳转省市区页面统计页面
        this.$router.push({
          name: 'data-statistics',
          params: { id: node.id, level: node.level,areaName:node.areaName,parentId:data.parent.data.id }
        })
        // this.$router.push({
        //   name: 'data-addArea',
        //   params: { parentId: node.id, level: node.level }
        // })
      }else if (node.id == 1) {
        this.$router.push({
          name: 'data-school',
          params: { areaId: data.parent.data.id, type: node.id }
        })
      }else if (node.id == 5) {
        this.$router.push({
          name: 'data-hospital',
          params: { areaId: data.parent.data.id, type: node.id }
        })
      }else if (node.id == 2) {
        this.$router.push({
          name: 'data-enterprise',
          params: { areaId: data.parent.data.id, type: node.id }
        })
      }else if (node.id == 3) {
        this.$router.push({
          name: 'data-community',
          params: { areaId: data.parent.data.id, type: node.id }
        })
      }else if (node.id == 4) {
        this.$router.push({
          name: 'data-foodmag',
          params: { areaId: data.parent.data.id, type: node.id }
        })
      }
    },
    addDept() {
      this.$router.push({
        name: 'data-addArea',
        params: { areaId: 0, level: 1 }
      })
    }
  },
  mounted() {
    //this.tree()
  },
  created() {}
}
</script>
<style scoped>
.partmentmgr-container {
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
.tab_main {
  height: calc(100% - 45px);
  min-height: 800px;
  /* background-color: #FFFFFF; */
  display: flex;
}
.left_main {
  flex: 1;
  /* width: 400px; */
  height: 100%;
}
.right_main {
  flex: 5;
  height: 100%;
  margin-left: 10px;
}
.top_box {
  width: 100%;
  height: 50px;
  background-color: #f0f3fa;
  display: flex;
  align-items: center;
  padding: 10px;
  /* justify-content: center; */
}
.content {
  height: calc(100% - 50px);
  width: 100%;
  min-height: 750px;
  background-color: #ffffff;
}
.content-right {
  height: 100%;
  width: 100%;
  min-height: 800px;
  background-color: #ffffff;
}
</style>