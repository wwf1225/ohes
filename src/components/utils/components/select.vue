<template>
    <div>
        <div id="widgetCase">

        </div>
        <div id="widgetContent" style="text-align: left;">
            <p class="title">{{question}}</p>
            <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

        </div>
    </div>
</template>

<style>

</style>
<script>
export default {
  name: 'myselect',
  data() {
    return {
      question: '您的选择？',
      radio: '',
      value: '',
      options: [
        {
          label: '选项1',
          value: '1'
        },
        {
          label: '选项2',
          value: '2'
        },
        {
          label: '选项3',
          value: '3'
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

