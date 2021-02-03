<template>
    <div>
        <div>

        </div>
        <div style="text-align: left;">
            <p class="title">{{question}}</p>
            <el-input :disabled="true" v-model="input" style="width:350px;" placeholder="请输入内容"></el-input>
        </div>
    </div>
</template>

<style>

</style>
<script>
export default {
  data() {
    return {
      question: '填空题',
      input: ''
    }
  },
  methods: {},
  created() {}
}
</script>

