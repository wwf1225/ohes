<template>
 <div>
     <div id="widgetCase">
            
        </div>
        <div style="text-align: left;">
            <p class="title">{{question}}</p>
     <el-date-picker
      v-model="date"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    </div>
     </div> 
</template>
<style>

</style>
<script>
export default {
    name:"date",
    data(){
        return{
            question:"日期？",
            date:"",
        }
    }
  
}
</script>
