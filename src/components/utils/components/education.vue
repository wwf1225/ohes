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
    name:"education",
    data(){
        return{
            question:"您的最高学历是？",
            radio:"",
            initradioList:[
                {
                    label:"博士"
                },
                {
                    label:"硕士"
                },
                {
                    label:"本科"
                },
                {
                    label:"专科"
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

