<template>
    <div>
        <div id="widgetCase">
            
        </div>
        <div id="widgetContent" style="text-align: left;">
            <p class="title">{{question}}</p>
            <el-radio-group v-model="radio">
                <el-radio v-for="(item,index) in initradioList" :key="index" :label="index">{{item.label}}</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<style>

</style>
<script>
export default {
    name:"marry",
    data(){
        return{
            question:"请问您婚否？",
            radio:"",
            initradioList:[
                {
                    label:"是"
                },
                {
                    label:"否"
                }
            ],
            
        }
        
    },
    props: {
        radioList: Array,
        
    },
    methods:{

    },
    mounted(){
        


    }
  
}
</script>

