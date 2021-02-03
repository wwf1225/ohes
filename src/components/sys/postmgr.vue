<template>
  <div>
       <el-button type="primary" style=" float: left;" @click="add">新增</el-button>
       <el-table ref="multipleTable" align="left" :data="tableData"  element-loading-text="拼命加载中" bordertooltip-effect="dark" style="width: 100%" @select="selectTable" @selection-change="handleSelectionChange">
            <el-table-column prop="name" label="岗位" align="center"> </el-table-column>
            <el-table-column prop="createAt" label="修改时间" align="center"> </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="depEdit(scope.$index,scope.row)">编辑</el-button>
                    <el-button  size="mini" type="danger" @click="depDel(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--岗位编辑弹出框-->
        <el-dialog title="岗位编辑" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <div class="postDiv">
                    <label for="form.name" class="lab">岗位：</label>
                    <div class="inp">
                         <el-input v-model="form.name" auto-complete="off"></el-input>
                    </div>
                    
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>

         <!--岗位编辑弹出框-->
         <el-dialog title="岗位添加" :visible.sync="dialogAddVisible">
            <el-form :model="form">
                <div class="postDiv">
                    <label for="form.name" class="lab">岗位：</label>
                    <div class="inp">
                         <el-input v-model="form.name" auto-complete="off"></el-input>
                    </div>
                    
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAdd">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<style scoped>
    .postDiv{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .lab{
        display: inline-block;
        width: 100px;
    }
    .inp{
        width: 300px;
    }
</style>


<script>
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js');
export default {
    data(){
        return{
            tableData:[],
            dialogFormVisible:false,
            dialogAddVisible:false,
            form:{
                name:"",
            }
        }
    },
    methods:{
        getPostList(){
            //  
              axios.get(config.apiHost +'/sys/station/queryStations',{
                        params : { //请求参数  
                            token:config.token,
                        } 
                    }).then((result)=> {
                        if (result.data.status == 200) {
                            this.tableData = result.data.body;
                        }
                    }, (error)=> {
                        this.$message.error(error);
                    }).then((text) => {
                        this.msg = text;
                });

        },
        selectTable(selection, val) {
            this.tableSelection = selection;
            this.tableSelectObj = val;
        },
        handleSelectionChange(selection) {
            this.tableSelection = selection;
        },
        depEdit(index,row){//列表中的编辑事件
            this.dialogFormVisible=true;
            this.form=row;
        },
        depDel(index,row){//列表中的删除事件
            // console.log(row.id);
             this.$confirm('确定要删除该岗位吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    callback: (acction, instance) => {
                        if (acction === 'confirm') {
                            //  
                            axios.get(config.apiHost +'/sys/station/delete',{
                                params : { //请求参数  
                                    token:config.token,
                                    id:row.id
                                } 
                            }).then((result)=>{
                                if (result.data.status == 200) {
                                    this.getPostList();
                                    this.$message(result.data.body.msg);
                                }
                            }, function(error) {
                                this.$message.error(error);
                            });
                        } else {
                            this.$message({
                                typ: 'info',
                                message: '已取消删除'
                            });
                        }
                    },
                    type: 'warning'
                });
        },
        //确认编辑
        confirm(){
            axios({
                method:'post',
                // /api
                url:config.apiHost +'/sys/station/update',
                data:this.form,
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'token':config.token
                }
            }).then((res)=>{
                if(res.data.status=="200"){
                    //  初始化表单对象
                    this.form={
                        name:"",
                    };
                    this.getPostList();
                    this.dialogFormVisible = false;
                    
                }
                    return res.data;
            })
        },
        add(){
            this.dialogAddVisible = true;
        },
        //确认添加
        confirmAdd(){
             axios({
                method:'post',
                // /api
                url:config.apiHost +'/sys/station/save',
                data:this.form,
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'token':config.token
                    }
                }).then((res)=>{
                    if(res.data.status=="200"){
                        //  初始化表单对象
                        this.form={
                            name:"",
                        };
                        this.getPostList();
                        this.dialogAddVisible = false;
                        
                    }
                    return res.data;
            })
        }

    },
    created(){
        this.getPostList();
    }
}
</script>