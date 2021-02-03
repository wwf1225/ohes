import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import home from "@/components/home";

//系统管理
const rolemgr = () => import("@/components/sys/rolemgr");
const rolemgradd = () => import("@/components/sys/rolemgradd");
const rolemgrupdate = () => import("@/components/sys/rolemgrupdate.vue");
const usermgr = () => import("@/components/sys/usermgr");
const menumgr = () => import("@/components/sys/menumgr.vue");
const partmentmgr = () => import("@/components/sys/partmentmgr");
const syslog = () => import("@/components/sys/syslog");
const deptmgr = () => import("@/components/sys/deptmgr.vue");
const postmgr = () => import("@/components/sys/postmgr.vue");
const deptAddmgr = () => import("@/components/sys/deptAddmgr.vue");
const deptUpdatemgr = () => import("../components/sys/deptUpdatemgr.vue");

//登录
import login from "@/components/login";

//个人中心
const personInfo = () => import("@/components/personInfo");
const index = () => import("@/components/index");
const homePage = () => import("@/components/home/homePage.vue");
const messageMgr = () => import("@/components/msgmgr.vue");
const msgDetail = () => import("@/components/msgDetail.vue");

//调查表单管理
const researchFormMgr = () => import("@/components/forms/research_form_mgr"); //列表页
const addForm = () => import("@/components/forms/addForm"); //添加表单
const addFormDetail = () => import("@/components/forms/addFormDetail"); //添加表单调用的
const editFormDetail = () => import("@/components/forms/editForm"); //编辑表单
const previewForm = () => import("@/components/forms/previewForm"); //查看表单
const controlMeasures = () => import("@/components/forms/controlMeasures"); //控制措施
const formListMgr = () => import("@/components/datas/formmgr/formListMgr.vue");
//数据管理
const areaMgr = () => import("@/components/datas/areaMgr.vue");
const deterEpi = () => import("@/components/datas/Epi.vue");
const shMgr = () => import("@/components/datas/shMgr.vue");
const vedioMgr = () => import("@/components/datas/vedioMgr.vue");
const rsMgr = () => import("@/components/datas/reportSourceMgr.vue");
const eplaceMgr = () => import("@/components/datas/eventPlaceMgr.vue");
//事件场所管理
// 添加地区页面
const addArea = () => import("@/components/datas/eventPlace/addArea.vue");
const eveStatistics = () =>
  import("@/components/datas/eventPlace/statistics.vue");
const eventImport = () =>
  import("@/components/datas/eventPlace/eventImport.vue");

const professionMgr = () => import("@/components/datas/professionMgr.vue");
const areaImport = () => import("@/components/datas/areaImport.vue");
const schoolImport = () => import("@/components/datas/schoolImport.vue");
const sampleCollection = () =>
  import("@/components/datas/sampleCollection.vue");
const datumMgr = () => import("@/components/datas/datumMgr.vue");
const sysBulletin = () => import("@/components/datas/sysBulletin.vue");
const datumAdd = () => import("@/components/datas/datumAdd.vue");
const datumDetail = () => import("@/components/datas/datumDetail.vue");
const school = () => import("@/components/datas/school.vue");
const topArea = () => import("@/components/datas/topArea.vue");
const hospital = () => import("@/components/datas/hospital.vue");
const enterprise = () => import("@/components/datas/enterprise.vue");
const community = () => import("@/components/datas/community.vue");
const foodmag = () => import("@/components/datas/foodmag.vue");
//统计分析
const region = () => import("@/components/statiAnalysis/region");
const areaStati = () => import("@/components/statiAnalysis/areaStati");
const infections = () => import("@/components/statiAnalysis/infections");
const foodBorne = () => import("@/components/statiAnalysis/foodBorne");
const timeDistribution = () =>
  import("@/components/statiAnalysis/timeDistribution");

const discrimination = () =>
  import("@/components/discrimination/discrimination.vue");

//事件管理
const eventnow = () => import("@/components/event/eventNow.vue");
const eventsurvey = () => import("@/components/event/eventSurvey.vue");
const eventadd = () => import("@/components/event/eventadd.vue");
const eventDirectReport = () => import("@/components/event/eventDirectReport.vue");
const eventDirectReportComplete = () => import("@/components/event/eventDirectReportComplete.vue");
const eventProcess = () => import("@/components/event/eventProcess.vue");
const eventupdate = () => import("@/components/event/eventupdate.vue");
const eventEdit = () => import("@/components/event/eventEdit.vue");
const eventshow = () => import("@/components/event/eventshow.vue");
const eventaudit = () => import("@/components/event/eventAudit.vue");
const pastevent = () => import("@/components/event/pastEvent.vue");
const pastdetail = () => import("@/components/event/pastEventDetail.vue");
const newResearch = () => import("@/components/event/newResearch.vue");
const caseResearch = () => import("@/components/event/caseResearch.vue");
const groupResearch = () => import("@/components/event/groupResearch.vue");
const doctorResearch = () => import("@/components/event/doctorResearch.vue");
const otherSample = () => import("@/components/event/otherSample.vue");
const outSample = () => import("@/components/event/outSample.vue");
const eventReport = () => import("@/components/event/eventReport.vue");

//调查管理
const reportUpdate = () => import("@/components/survey/reportUpdate.vue");
const reportDetail = () => import("@/components/survey/reportDetail.vue");
const eventRecycle = () => import("@/components/event/eventRecycle.vue");
const surveyTasks = () => import("@/components/survey/surveyTasks.vue"); //调查任务
const surveyDetail = () => import("@/components/survey/surveyDetail.vue");
const surveyUpdate = () => import("@/components/survey/surveyUpdate.vue");
const updateDetail = () => import("@/components/survey/updateDetail.vue");
const newResearchAddForm = () =>
  import("@/components/survey/newResearchAddForm.vue"); //现况重选表单页面

//发布收集
const publishCollection = () =>
  import("@/components/survey/publishCollection.vue");
const vedioList = () => import("@/components/survey/vedioList.vue");
const fileList = () => import("@/components/survey/fileList.vue");
const statistics = () => import("@/components/survey/statistics.vue");
const formAdd = () => import("@/components/survey/formAdd.vue");
const fillForm = () => import("@/components/survey/fillForm.vue");
const editForm = () => import("@/components/survey/editForm.vue");
const editBlank = () => import("@/components/survey/editBlank.vue");
const showForm = () => import("@/components/survey/showForm.vue");
const sampleList = () => import("@/components/survey/sampleList.vue");

//实时视频
const realtimeVedio = () => import("@/components/video/realtimeVedio.vue");

Vue.use(Router);

export default new Router({
  // mode: 'history',

  routes: [
    {
      path: "/",
      component: login
    },
    {
      path: "/login",
      component: login
    },

    {
      path: "/home",
      name: "首页",
      component: home,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "/home/index",
          component: index
        },
        {
          path: "/home/home-page",
          name: "首页",
          component: homePage
        },
        {
          path: "/home/realtime-video",
          name: "实时视频",
          component: realtimeVedio
        },
        {
          path: "/home/personInfo",
          name: "个人中心",
          component: personInfo
        },
        {
          path: "/home/messageMgr",
          name: "消息列表",
          component: messageMgr
        },
        {
          path: "/home/msgdetail",
          name: "msgdetail",
          component: msgDetail
        },

        {
          path: "/home/sys-rolemgr",
          name: "角色管理",
          component: rolemgr
        },
        {
          path: "/home/sys-menumgr",
          name: "菜单管理",
          component: menumgr
        },
        {
          path: "/home/sys-rolemgradd",
          name: "sys-rolemgradd",
          component: rolemgradd
        },
        {
          path: "/home/sys-rolemgrupdate",
          name: "sys-rolemgrupdate",
          component: rolemgrupdate
        },
        {
          path: "/home/sys-usermgr",
          name: "用户管理",
          component: usermgr
        },
        {
          path: "/home/sys-partmentmgr",
          name: "部门管理",
          component: partmentmgr,
          children: [
            {
              path: "/home/sys-partmentmgr/dept",
              name: "deptmgr",
              component: deptmgr
            },
            {
              path: "/home/sys-partmentmgr/posts",
              name: "postmgr",
              component: postmgr
            },
            {
              path: "/home/sys-partmentmgr/deptAddmgr",
              name: "deptAddmgr",
              component: deptAddmgr
            },
            {
              path: "/home/sys-partmentmgr/deptUpdatemgr",
              name: "deptUpdatemgr",
              component: deptUpdatemgr
            }
          ]
        },
        {
          path: "/home/sys-syslog",
          name: "系统日志",
          component: syslog
        },
        // { //表单管理
        //     path: '/home/data-formsmgr',
        //     name: 'data-formsmgr',
        //     component: researchFormMgr,

        // },
        {
          path: "/home/data-addForm",
          name: "data-addForm",
          component: addForm
        },
        {
          path: "/home/data-addFormDetail",
          name: "data-addFormDetail",
          component: addFormDetail
        },
        {
          path: "/home/data-editFormDetail",
          name: "data-editFormDetail",
          component: editFormDetail
        },
        {
          //新需求表单管理
          path: "/home/data-formsmgr",
          name: "表单管理",
          component: formListMgr
        },

        {
          path: "/home/data-preview",
          name: "data-preview",
          component: previewForm
        },
        {
          path: "/home/data-controlMeasures",
          name: "data-controlMeasures",
          component: controlMeasures
        },
        {
          //分析统计
          path: "/home/analy-region",
          name: "地区分布统计",
          component: region
        },
        {
          path: "/home/analy-areaStati",
          name: "疫情地区分布",
          component: areaStati
        },
        {
          path: "/home/analy-infections",
          name: "传染病事件",
          component: infections
        },
        {
          path: "/home/analy-foodBorne",
          name: "食源性事件",
          component: foodBorne
        },
        {
          path: "/home/analy-timeDistribution",
          name: "analy-timeDistribution",
          component: timeDistribution
        },
        //基础数据管理

        {
          path: "/home/data-Epi",
          name: "Epi小工具",
          component: deterEpi
        },

        {
          path: "/home/data-areamgr",
          name: "data-areamgr",
          component: areaMgr
        },

        {
          path: "/home/data-areaImport",
          name: "data-areaImport",
          component: areaImport
        },
        {
          path: "/home/data-schoolImport",
          name: "data-schoolImport",
          component: schoolImport
        },
        {
          path: "/home/data-sampleCollection",
          name: "data-sampleCollection",
          component: sampleCollection
        },
        {
          path: "/home/data-sysBulletin",
          name: "系统公告",
          component: sysBulletin
        },
        {
          path: "/home/data-datumMgr/:systemKey",
          name: "知识库管理",
          component: datumMgr
        },
        {
          path: "/home/datum-Detail",
          name: "datum-Detail",
          component: datumDetail
        },
        {
          path: "/home/datum-Add",
          name: "datum-Add",
          component: datumAdd
        },
        {
          path: "/home/data-shmgr",
          name: "data-shmgr",
          component: shMgr
        },
        {
          path: "/home/data-vediomgr",
          name: "视频管理",
          component: vedioMgr
        },
        {
          path: "/home/data-rsmgr",
          name: "data-rsmgr",
          component: rsMgr
        },
        {
          path: "/home/data-epmgr",
          name: "地区管理",
          component: eplaceMgr,
          children: [
            {
              path: "/home/data-epmgr/school/:areaId",
              name: "data-school",
              component: school
            },
            {
              path: "/home/data-epmgr/topArea",
              name: "data-topArea",
              component: topArea
            },
            {
              //添加省市区街道
              path: "/home/data-epmgr/addArea",
              name: "data-addArea",
              component: addArea
            },
            {
              //时间场所省市区街道统计页面
              path: "/home/data-epmgr/statistics/:id",
              name: "data-statistics",
              component: eveStatistics
            },
            {
              //时间场所省市区街道统计页面
              path: "/home/data-epmgr/eventImport",
              name: "data-eventImport",
              component: eventImport
            },

            {
              path: "/home/data-epmgr/hospital/:areaId",
              name: "data-hospital",
              component: hospital
            },
            {
              path: "/home/data-epmgr/enterprise/:areaId",
              name: "data-enterprise",
              component: enterprise
            },
            {
              path: "/home/data-epmgr/community/:areaId",
              name: "data-community",
              component: community
            },
            {
              path: "/home/data-epmgr/foodmag/:areaId",
              name: "data-foodmag",
              component: foodmag
            }
          ]
        },
        {
          path: "/home/data-professmgr",
          name: "data-professmgr",
          component: professionMgr
        },
        {
          path: "/home/discrimination",
          name: "辅助判别",
          component: discrimination
        },
        {
          path: "/home/event-add",
          name: "事件接报",
          component: eventadd
        },
        {
          path: "/home/event-direct-report",
          name: "未生成事件",
          component: eventDirectReport
        },
        {
          path: "/home/event-direct-report-complete",
          name: "已生成事件",
          component: eventDirectReportComplete
        },
        {
          path: "/home/event-now",
          name: "待发布事件",
          component: eventnow
        },
        {
          path: "/home/event-survey",
          name: "待调查事件",
          component: eventsurvey
        },
        {
          path: "/home/event-process",
          name: "流程中事件",
          component: eventProcess
        },
        {
          path: "/home/event-update",
          name: "event-update",
          component: eventupdate
        },
        {
          path: "/home/eventEdit",
          name: "eventEdit",
          component: eventEdit
        },

        {
          path: "/home/event-show",
          name: "event-show",
          component: eventshow
        },
        {
          path: "/home/event-audit",
          name: "待结案审批",
          component: eventaudit
        },

        {
          path: "/home/past-event",
          name: "已结案事件",
          component: pastevent
        },
        {
          path: "/home/past-event-detail",
          // name:'past-event-detail',//有子路由不需要name属性
          component: pastdetail,
          children: [
            { path: "/", redirect: "new-research" },
            {
              path: "/home/past-event-detail/new-research",
              name: "new-research",
              component: newResearch
            },
            {
              path: "/home/past-event-detail/case-research",
              name: "case-research",
              component: caseResearch
            },
            {
              path: "/home/past-event-detail/group-research",
              name: "group-research",
              component: groupResearch
            },
            {
              path: "/home/past-event-detail/doctor-research",
              name: "doctor-research",
              component: doctorResearch
            },
            {
              path: "/home/past-event-detail/other-sample",
              name: "other-sample",
              component: otherSample
            },
            {
              path: "/home/past-event-detail/out-sample",
              name: "out-sample",
              component: outSample
            },
            {
              path: "/home/past-event-detail/event-report",
              name: "event-report",
              component: eventReport
            }
          ]
        },
        {
          path: "/home/event-recycle",
          name: "event-recycle",
          component: eventRecycle
        },
        {
          path: "/home/survey_tasks",
          name: "调查中事件",
          component: surveyTasks
        },
        {
          path: "/home/survey-detail",
          name: "survey-detail",
          component: surveyDetail
        },
        {
          path: "/home/show_form",
          name: "show_form",
          component: showForm
        },
        {
          path: "/home/survey-update",
          // name:'survey-update',
          component: surveyUpdate,
          children: [
            { path: "/", redirect: "new-research" },

            {
              path: "/home/survey-update/new-research",
              component: newResearch
            },
            {
              path: "/home/survey-update/case-research",
              component: caseResearch
            },
            {
              path: "/home/survey-update/group-research",
              component: groupResearch
            },
            {
              path: "/home/survey-update/doctor-research",
              component: doctorResearch
            },
            {
              path: "/home/survey-update/other-sample",
              component: otherSample
            },
            {
              path: "/home/survey-update/out-sample",
              component: outSample
            },
            {
              path: "/home/survey-update/event-report",
              component: eventReport
            }
          ]
        },
        {
          path: "/home/update-detail",
          name: "update-detail",
          component: updateDetail
        },
        {
          path: "/home/update-publishCollection",
          name: "update-publishCollection",
          component: publishCollection
        },

        {
          path: "/home/vedio-list",
          name: "vedio-list",
          component: vedioList
        },
        {
          path: "/home/file-list",
          name: "file-list",
          component: fileList
        },
        {
          path: "/home/sample-list",
          name: "sample-list",
          component: sampleList
        },
        {
          path: "/home/report-update",
          name: "report-update",
          component: reportUpdate
        },
        {
          path: "/home/report-detail",
          name: "report-detail",
          component: reportDetail
        },
        {
          path: "/home/statistics",
          name: "statistics",
          component: statistics
        },
        {
          path: "/home/form_add",
          name: "form_add",
          component: formAdd
        },
        {
          //现况重选表单页面
          path: "/home/newResAddForm",
          name: "newResAddForm",
          component: newResearchAddForm
        },
        {
          path: "/home/fill_form",
          name: "fill_form",
          component: fillForm
        },
        {
          path: "/home/edit_form",
          name: "edit_form",
          component: editForm
        },
        {
          path: "/home/edit_blank",
          name: "edit_blank",
          component: editBlank
        }
      ]
    }
  ]
});
