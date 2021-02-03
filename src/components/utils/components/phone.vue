<template>
    <div>
        <div style="text-align: left;">
        <p class="title">{{question}}</p>
        <el-input @focus="returnType" v-model="input" style="width:350px;" placeholder="请输入手机号"></el-input></div>
    </div>
</template>

<style>

</style>
<script>
export default {
    data(){
        return{
            question:"手机号",
            input:"",
            type:"fill"
        }
        
    },
    props:{
        needType:{
				type:String,
				default:"fill",
			},

    },
    methods:{
        returnType(){
            this.$emit("inputType", this.type);

        }

    },
    created(){
        console.log(this.needType);
        this.type=this.needType;
    }
    
  
}
</script>

