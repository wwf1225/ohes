<template>
    <div class="space_box">
        <div class="space_title">发病地点</div>
        <div id="div1" :style="style"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios'
var config = require('@/components/utils/Common_Config.js')
export default{
　　data(){
　　　　return{
　　　　　　style:{
　　　　　　　　　width:'100%',
　　　　　　　　　height:'500px'
            },
            tableData:[],
            mapData:[],
　　　　　　 longitude:116.404, //定义经度
　　　　　　 latitude:39.915, //定义纬度
            ak:'WjTNkCNGTZFmdPSnq7gm3gFY6xz1DYvc',
　　　　}
　　},
    computed:{
        ...mapGetters([
            'event',
            'isType'
        ])
    },
    methods:{
        getMap(mapData){
            // 百度地图API功能	
            var map = new BMap.Map("div1");
            map.centerAndZoom('上海', 9);
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
            var data_info = mapData;
            var opts = {
                        width : 250,     // 信息窗口宽度
                        height: 80,     // 信息窗口高度
                        title : "信息窗口" , // 信息窗口标题
                        enableMessage:true//设置允许信息窗发送短息
                    };
            for(var i=0;i<data_info.length;i++){
                var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // 创建标注
                var content = data_info[i][2];
                map.addOverlay(marker);               // 将标注添加到地图中
                addClickHandler(content,marker);
            }
            function addClickHandler(content,marker){
                marker.addEventListener("click",function(e){
                    openInfo(content,e)}
                );
            }
            function openInfo(content,e){
                var p = e.target;
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
                map.openInfoWindow(infoWindow,point); //开启信息窗口
        　　}
        },
        //空间分布
        getSpaceList(){
            //analyze/epidemicMap  
            axios.get(config.apiHost +'/count/caseSpace', {  
                params:{
                    eventId:this.event.id,
                    type:this.isType,
                    token:config.token,
                }
            }).then((result)=>{  
                if (result.data.status == 200) {
                        this.tableData=result.data.body;
                        this.tableData.forEach(item => {
                           let longitude=Number(item.longitude);
                           let latitude=Number(item.latitude);
                           let address=item.address;
                           this.mapData.push([longitude,latitude,address]);
                       });
                       this.getMap(this.mapData);
                    //    console.log(this.mapData);
                    } 
            }).catch(function(response){  
                //   this.$message.error(error);
                // console.log(response);
            })  
        }
    },
    watch:{
        isType(){
            this.getSpaceList();
        }
    },
　　mounted(){
        this.getSpaceList();
    }
}
</script>

<style lang="less" scoped>
    .space_box{
        height: 100%;
        width: 100%;
        .space_title{
            padding: 10px;
        }
    }
</style>