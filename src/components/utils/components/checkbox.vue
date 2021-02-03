<template>
    <div>
        <div id="widgetCase">
            
        </div>
        <div style="text-align: left;">
        <p class="title">{{question}}</p>
        <el-checkbox-group v-model="checked">
            <el-checkbox v-for="(item,index) in checkBoxList" :key="index" :label="item.label">{{item.label}}</el-checkbox>
            
        </el-checkbox-group>
        </div>
    </div>
</template>

<style>

</style>
<script>
export default {
    data(){
        return{
            question:"多项选择题",
            checked:[],
            checkBoxList:[
                {
                    label:"选项1"
                },
                {
                    label:"选项2"
                },
                {
                    label:"选项3"
                },
            ],
        }
        
    },
    methods:{

    },
    created(){

    }
  
}
</script>

