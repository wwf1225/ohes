<template>
    <div>
        <div style="text-align: left;">
        <p class="title">{{question}}</p>
        <el-input v-model="input" style="width:350px;" placeholder="请输入内容"></el-input></div>
    </div>
</template>

<style>

</style>
<script>
export default {
    name:"myemail",
    data(){
        return{
            question:"您的邮箱是？",
            input:"",
            
        }
        
    },
    methods:{

    },
    created(){

    }
  
}
</script>

