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
    name:"income",
    data(){
        return{
            question:"您的月平均收入是？",
            radio:"",
            initradioList:[
                {
                    label:"3000元以下"
                },
                {
                    label:"3000-5000元"
                },
                {
                    label:"5000-10000元"
                },
                {
                    label:"20000元以上"
                },
            ],
            
        }
        
    },
    props: {
        radioList: Array,
        
    },
    // watch:{
    //     initradioList(val){
    //         console,log(this.radioList)
    //         this.initradioList=this.radioList;


    //     }

    // },
    methods:{

    },
    mounted(){
        


    }
  
}
</script>

