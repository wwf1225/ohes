<template>
    <div class="logic">
        <!-- 单选 -->
        <div class="radiodiv" v-show="radioType">
            <ul>
                <li>
                    <p class="selectname">标题</p>
                    <input v-model="titlecont">
                </li>
                <li>
                    <p class="selectname">选项设置</p>
                    <ul>
                        <li class="selectli" v-for="(item,index) in selectList">
                            <div v-if="index==0">
                                <input v-model="item.radioName">
                                <span class="symbol" @click="addSelect(index)">+</span>
                            </div>
                            <div v-else>
                                <input v-model="item.radioName">
                                <span class="symbol" @click="addSelect(index)">+</span>
                                <span class="symbol" @click="reduceSelect(index)">-</span>
                            </div>
                            
                        </li>
                    </ul>

                </li>
            </ul>

        </div>

        <!-- 填空题 -->
        <div class="inputdiv" v-show="inputType">
            <ul>
                <li>
                    <p class="selectname">标题</p>
                    <input v-model="inputTitle"></input>
                </li>
                <li>
                    <p class="selectname">选项设置</p>
                    <input v-model="inputCont"></input>

                </li>
            </ul>

        </div>

    </div>
</template>
<style scoped>
.logic {
  text-align: left;
}
.symbol {
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 20px;
  display: inline-block;
  height: 20px;
  line-height: 17px;
  color: #ccc;
  cursor: pointer;
  text-align: center;
}
input {
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 28px;
  width: 200px;
  padding: 0 5px;
}
li {
  cursor: auto;
}
.selectli {
  height: 40px;
  padding: 0px;
}
.selectname {
  font-weight: bold;
  font-size: 16px;
}
</style>
<script>
export default {
  name: 'logic',
  data() {
    return {
      radioType: false,//单选
      titlecont: '',
      selectList: [
        {
          radioName: '选项一'
        },
        {
          radioName: '选项二'
        },
        {
          radioName: '选项三'
        }
      ],

      inputType:false,//填空
      inputTitle:"",
      inputCont:"",


    
    }
  },
  props: [
    'showType'
  ],
  methods: {
    addSelect(index) {
      this.selectList.push({
        radioName: ''
      })
    },
    reduceSelect(index) {
      this.selectList.splice(index, 1)
    }
  },
  created() {
    // console.log(this.selectList)
  },
  watch: {
    showType: function(val) {
    //   console.log(val)
        if(val=="widgetTypeRadio"){
            this.radioType=true;
            this.inputType=false;
        }else if(val=="tiankong"){
            this.inputType=true;
            this.radioType=false;
        }else if(val=="duoxuan"){
            this.radioType=true;
            this.inputType=false;
        }else if(val=="shouji"){
            this.inputType=true;
            this.radioType=false;
        }else if(val=="email"){
            this.inputType=true;
            this.radioType=false;
        }else if(val=="xingbie"){
            this.radioType=true;
            this.inputType=false;
        }else if(val=="xueli"){
            this.radioType=true;
            this.inputType=false;
        }else if(val=="hunyin"){
            this.radioType=true;
            this.inputType=false;
        }else if(val=="shouru"){
            this.radioType=true;
            this.inputType=false;
        }else if(val=="riqi"){
            this.inputType=true;
            this.radioType=false;
        }else if(val=="dizhi"){
            this.inputType=true;
            this.radioType=false;
        }else if(val=="xiala"){
            this.radioType=true;
            this.inputType=false;
        }else if(val=="diliweizhi"){
            this.inputType=true;
            this.radioType=false;
        }else if(val=="fenduan"){
            this.inputType=true;
            this.radioType=false;
        }else{//画板
            this.inputType=true;
            this.radioType=false;
        }
    }
  }
}
</script>

