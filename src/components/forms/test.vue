<template>
    <div class="main">

        <div class="container">
            <div id="advanced">

                <div style="width: 20%; float: left;min-width: 250px;border: 1px solid #ccc;margin-right: 20px;" class="block__list block__list_words">
                    <div class="block__list-title">常用题型</div>
                    <ul id="advanced-1" class="radioQuModel-ul">
                        
                        <li id="widgetTypeRadio" class="radioC" @click="radioMouseDown($event)">单选题</li>
                        <li id="duoxuan" class="checkC" @click="radioMouseDown($event)">多选题</li>
                        <li id="tiankong" class="inputC" @click="radioMouseDown($event)">填空题</li>
                        <li id="shouji" class="phoneC" @click="radioMouseDown($event)">手机</li>
                        <li id="email" class="emailC" @click="radioMouseDown($event)">Email</li>
                        <li id="xingbie" class="sexC" @click="radioMouseDown($event)">性别</li>
                        <li id="xueli" class="educationC" @click="radioMouseDown($event)">学历</li>
                        <li id="hunyin" class="marryC" @click="radioMouseDown($event)">婚姻</li>
                        <li id="shouru" class="incomeC" @click="radioMouseDown($event)">收入</li>
                        <li id="riqi" class="dateC" @click="radioMouseDown($event)">日期</li>
                        <li id="dizhi" class="addressC" @click="radioMouseDown($event)">地址</li>
                        <li id="xiala" class="selectC" @click="radioMouseDown($event)">下拉框</li>
                        <li id="diliweizhi" class="selectC" @click="radioMouseDown($event)">地理位置题</li>
                        <li id="fenduan" class="subsetionC" @click="radioMouseDown($event)">分段</li>
                        <li id="huaban" @click="radioMouseDown($event)">画板</li>
                    </ul>
                </div>

                <div style="width: 45%; float: left;min-height: 700px;border: 1px solid #ccc;" class="block__list block__list_words">
                    <div class="block__list-title">表单名称</div>
                    <ul id="advanced-2">
                        <li>Money</li>
                        <li>Force</li>
                        <li>Agility</li>

                    </ul>
                </div>
                <table v-if="a==1">
                    <tbody>
                        <tr></tr>
                    </tbody>
                </table>
                <div style="width: 25%;margin-left: 20px; float: left;min-height: 700px;border: 1px solid #ccc;" class="block__list block__list_words">
                    <div class="block__list-title">属性设置</div>
                    <logic :showType="showtype"></logic>
                </div>
                

                <div style="clear: both"></div>
            </div>
        </div>
        <div>
            <myradio id="radioId"></myradio>
            <mycheckbox id="checkboxId"></mycheckbox>
            <myinput id="inputId"></myinput>
            <myphone id="phoneId"></myphone>
            <myemail id="emailId"></myemail>
            <mysex id="sexId"></mysex>
            <myeducation id="educationId"></myeducation>
            <mymarry id="marryId"></mymarry>
            <myincome id="incomeId"></myincome>
            <mydate id="dateId"></mydate>
            <myaddress id="addressId"></myaddress>
            <myselect id="selectId"></myselect>
            <mygeogposition id="geogpositionId"></mygeogposition>
            <mysubsection id="subsectionId"></mysubsection>

        </div>
    </div>
</template>

<style>
#advanced-2 :hover{
    background-color: #faedd8;
}
.hoverclass{
    background-color: red;
}
</style>

<script>
require('@/components/utils/css/app.css')
require('@/components/utils/css/formList.css')
require('@/components/utils/js/Sortable.js')
import myradio from '@/components/utils/components/radio'
import mycheckbox from '@/components/utils/components/checkbox'
import myinput from '@/components/utils/components/input'
import myphone from '@/components/utils/components/phone'
import myemail from '@/components/utils/components/email'
import mysex from '@/components/utils/components/sex'
import myeducation from '@/components/utils/components/education'
import mymarry from '@/components/utils/components/marriage'
import myincome from '@/components/utils/components/income'
import mydate from '@/components/utils/components/date'
import myaddress from '@/components/utils/components/address'
import myselect from '@/components/utils/components/select'
import mygeogposition from '@/components/utils/components/geogposition'
import mysubsection from '@/components/utils/components/subsection'

import logic from '@/components/utils/components/logic'



export default {
  data() {
    return {
      radioList: [
        {
          label: '苹果'
        },
        {
          label: '例子'
        },
        {
          label: '葡萄'
        }
      ],
      showtype:"",
      a:"2",
     
    }
  },
  components: {
    myradio,
    mycheckbox,
    myinput,
    myphone,
    mysex,
    myeducation,
    mymarry,
    myincome,
    mydate,
    myaddress,
    myselect,
    myemail,
    mygeogposition,
    mysubsection,
    logic,
  },
  methods: {
      radioMouseDown(event){

          console.log(event.currentTarget.id);
          $(event).addClass("hoverclass")
        
        this.showtype=event.currentTarget.id;
        
        //   this.showtype=event;
          
      },
      
      



  },
  mounted() {
    require('@/components/utils/js/app.js')
  },
  
}
</script>