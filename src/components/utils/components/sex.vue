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
    name:"sex",
    data(){
        return{
            question:"您的性别是？",
            radio:"",
            initradioList:[
                {
                    label:"男"
                },
                {
                    label:"女"
                }
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

