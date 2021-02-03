// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueResource from "vue-resource";
import axios from "axios";
import qs from "qs";
import "font-awesome/css/font-awesome.css";
import store from "./stroe/index";
import iView from "iview";
import "iview/dist/styles/iview.css";
// import 'babel-polyfill'
// import 'es6-promise/auto'
import VueHtml5Editor from "vue-html5-editor";
var options = {
  showModuleName: false,
  language: "zh-cn",
  il8n: {
    "zh-cn": {
      align: "对齐方式",
      image: "图片",
      list: "列表",
      link: "链接",
      unlink: "去除链接",
      table: "表格",
      font: "文字",
      "full screen": "全屏",
      text: "排版",
      eraser: "格式清除",
      info: "关于",
      color: "颜色",
      "please enter a url": "请输入地址",
      "create link": "创建链接",
      bold: "加粗",
      italic: "倾斜",
      underline: "下划线",
      "strike through": "删除线",
      subscript: "上标",
      superscript: "下标",
      heading: "标题",
      "font name": "字体",
      "font size": "文字大小",
      "left justify": "左对齐",
      "center justify": "居中",
      "right justify": "右对齐",
      "ordered list": "有序列表",
      "unordered list": "无序列表",
      "fore color": "前景色",
      "background color": "背景色",
      "row count": "行数",
      "column count": "列数",
      save: "确定",
      upload: "上传",
      progress: "进度",
      unknown: "未知",
      "please wait": "请稍等",
      error: "错误",
      abort: "中断",
      reset: "重置"
    }
  },
  hiddenModules: ["full-screen", "info"]
};
Vue.use(VueHtml5Editor, options);
Vue.use(iView);
// require("./../node_modules/element-ui/lib/theme-chalk/index.css")
Vue.use(ElementUI);
Vue.use(VueResource);
var Cookies = require("js-cookie");

import myConfig from "@/components/utils/Common_Config.js";
// Vue.prototype.Api = Api //挂载到Vue实例上面

// 引入echarts
import echarts from "echarts";

Vue.config.productionTip = false;
Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    // var localTokenString = window.localStorage.getItem('token');
    var localTokenString = Cookies.get("token");
    if (localTokenString == null || localTokenString=="") {
      // alert('登录已超时,请重新登录')
      // router.replace({ path: '/login' })
      // if (
      //     window.localStorage.getItem('tenUrl') == null ||
      //     window.localStorage.getItem('tenUrl') == undefined
      // ) {
      //     window.localStorage.setItem('tenUrl', '')
      // }
      // next({
      //     path: '/index.html'
      // })
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});
// Vue.http.interceptors.push((request, next) => {
//     var token = Cookies.get('token');
//     if (token) {
//         request.headers.set('token', token);
//     }
//     next((response) => {
//         return response;
//     });

// });

// request拦截器
axios.interceptors.request.use(
  config => {
    // 让每个请求携带token--['token']为自定义key
    var token = Cookies.get("token");

    if (token == undefined || token == null || token == "") {
      myConfig.canRequest = false;
      // alert('登录已超时,请重新登录')
      // router.replace({
      //     path: '/login'
      // })
    } else {
      // console.log('request拦截器里的token：' + Cookies.get('token'))
    }

    Object.assign(config.headers, {
      token: token,
      "Content-Type": "application/json"
    });
    return config;
  },
  error => {
    // Do something with request error
    // console.log(error); // for debug
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    // console.log("正确");

    if (response.data.status == 800) {
      myConfig.canRequest = false;
      // alert('登录超时请重新登录')
      // Cookies.set("token", "");
      // router.replace({ path: '/login' })
    } else {
      return response;
    }
  },
  error => {
    //一开始认为标准的开始
    // if (error.response) {
    //     switch (error.response.status) {
    //         case 800:
    //             alert("登录超时请重新登录")
    //             Cookies.set('token', '');
    //             router.replace({
    //                 path: '/',
    //                 // path: '/index.html?tenUrl=' + window.localStorage.getItem('tenUrl'),

    //                 // query: { redirect: router.currentRoute.fullPath }
    //             })
    //     }
    // }
    //一开始认为标准的结束
    //OK的开始
    // console.log("错误");
    myConfig.canRequest = false;
    // console.log("返回错误" + error);
    // alert('登录超时请重新登录')
    // Cookies.set("token", "");
    // router.replace({ path: '/login' })
    // return Promise.reject(error.response.data)

    //OK的结束
    //测试研究的开始
    // console.log("异常的error是   " + error);
    // console.log("异常的error.response是   " + error.response);
    // console.log("异常的error.response.data是   " + error.response.data);
    // return Promise.reject(error.response.data)
    //测试研究的介绍
  }
);
/* eslint-disable no-new */

new Vue({
  store,
  el: "#app",
  router,
  template: "<App/>",
  components: { App },
  http: {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      token: Cookies.get("token") //'8bd78e56d04efb380429cd8045ae6121'
    }
  }
});
