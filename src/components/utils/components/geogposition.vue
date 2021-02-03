<template>
 <div>
     <div id="widgetCase">
            
        </div>
        <div id="widgetContent" style="text-align: left;">
            <p class="title">{{question}}</p>
            <el-input v-model="geogname" placeholder="📍获取地理位置"></el-input>
        </div>
     
     </div> 
</template>
<style>

</style>
<script>
export default {
    name:"geogposition",
    data(){
        return{
            question:"位置",
            geogname:"📍获取地理位置"

        }

    },
    methods:{

    },
    created(){

    }
  
}
</script>
