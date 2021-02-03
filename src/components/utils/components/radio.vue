<template>
    <div>
        <div id="widgetCase">
            <input type="hidden" name="quType" value="RADIO">
            <input type="hidden" name="quId" value="">
            <input type="hidden" name="orderById" value="0">
            <input type="hidden" name="saveTag" value="0">
            <input type="hidden" name="hoverTag" value="0">
            
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
  name: 'radio',
  data() {
    return {
      question: '单项选择题',
      radio: '',
      initradioList: [
        {
          label: '选项1'
        },
        {
          label: '选项2'
        },
        {
          label: '选项3'
        }
      ]
    }
  },
  props: {
    radioList: Array
  },
  // watch:{
  //     initradioList(val){
  //         console,log(this.radioList)
  //         this.initradioList=this.radioList;

  //     }

  // },
  methods: {},
  mounted() {}
}
</script>

