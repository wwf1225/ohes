<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
// import 'babel-polyfill'
export default {
  name: "app"
};
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /* margin-top: 60px; */
  overflow: hidden;
}
.el-checkbox__inner {
  border-radius: 4px !important;
}
.el-tabs {
  padding-bottom: 0 !important;
}
.main-page > .el-tabs,
.main-page > .el-tabs > .el-tabs__content {
  min-height: 800px;
  /* padding-bottom: 100px; */
  /* height: 100% !important; */
}
.el-tabs__content,
.rolebox,
.userbox,
/* .partmentmgr-container, */
.main,
.logBox {
  background: #f7f7f7 !important;
}
.rolebox {
  min-height: 800px;
}
.add-dialog .el-tabs__content,
/* .rolebox, */
.userbox,
/* .partmentmgr-container, */
.main,
.logBox {
  background: #fff !important;
}

/* start 事件接报 */
#dialog .el-dialog__header,
#dialog .el-dialog__body {
  padding: 0 !important;
}
#dialog .el-dialog {
  border-radius: 10px !important;
}
#dialog .el-checkbox__inner {
  border-radius: 50% !important;
}
/* end 事件接报 */
.el-submenu .el-menu-item:hover,
#homeWra .el-menu .onlyone:hover,
#homeWra .el-submenu__title:hover {
  background: #ddd !important;
}
.rolemgr-container {
  background: #f7f7f7 !important;
}
.template-tabs,
.el-tabs {
  height: 100% !important;
}
.datum-box {
  background: #f7f7f7 !important;
}
.add-dialog .el-dialog__header {
  border-bottom: 1px dashed #f0f0f0;
  font-weight: bold;
  text-align: center;
}
.add-dialog .el-dialog__footer {
  text-align: center;
}
.add-dialog .el-dialog__body .el-form-item__label {
  font-weight: bold;
}
.add-form .el-input .el-input__inner {
  padding-right: 35px !important;
}
.requiredChar .el-form-item__label {
  position: relative;
}
.requiredChar .el-form-item__label::before {
  content: "*" !important;
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  color: red;
}
.add-dialog .el-dialog {
  border-radius: 10px;
  overflow: hidden;
}
.add-dialog .el-dialog__footer {
  background-color: #f9f9f9 !important;
  padding: 15px !important;
}
#classroom_add .el-form-item__label {
  font-weight: bold !important;
}
.left_main .el-tree-node:focus > .el-tree-node__content,
.left_main .el-tree-node__content:hover {
  background: #b8ddcc;
  color: #fff !important;
}
/* 部门管理Tree */
#tree-row .ivu-tree .ivu-tree-children li > span:nth-child(2) {
  line-height: 24px;
  border-radius: 12px 0 0 12px;
  cursor: pointer;
}
#tree-row .ivu-tree .ivu-tree-children li > span:nth-child(2).active {
  background: #b8ddcc;
  color: #fff !important;
}
#tree-row .ivu-tree .ivu-tree-children li > span:nth-child(2):hover {
  background: #b8ddcc;
  color: #fff !important;
}
#tree-row
  .ivu-tree
  .ivu-tree-children
  li
  > span:nth-child(2)
  > span:nth-child(1) {
  padding-left: 10px;
}
#tree-row
  .ivu-tree
  .ivu-tree-children
  li
  > span:nth-child(2)
  > span:nth-child(2) {
  visibility: hidden;
}
#tree-row
  .ivu-tree
  .ivu-tree-children
  li
  > span:nth-child(2):hover
  span:nth-child(2) {
  visibility: visible;
}

#tree-row .ivu-tree .ivu-tree-children li > span:nth-child(1) {
  width: 20px !important;
}
/* 最后一级不显示添加按钮 */
#tree-row
  .ivu-tree
  > .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > .ivu-tree-children
  > li
  > span:nth-child(2)
  > span:nth-child(2)
  > button:nth-child(2) {
  display: none !important;
}
#tree-row
  .ivu-tree
  .ivu-tree-children
  > li
  > span:nth-child(2)
  > span:nth-child(2)
  > button:first-child:hover {
  background: url(./assets/treetj_a.png) no-repeat center !important;
}
#tree-row
  .ivu-tree
  .ivu-tree-children
  > li
  > span:nth-child(2)
  > span:nth-child(2)
  > button:nth-child(2):hover {
  background: url(./assets/treezj_a.png) no-repeat center !important;
}
#tree-row
  .ivu-tree
  .ivu-tree-children
  > li
  > span:nth-child(2)
  > span:nth-child(2)
  > button:nth-child(3):hover {
  background: url(./assets/treebj_a.png) no-repeat center !important;
}
#tree-row
  .ivu-tree
  .ivu-tree-children
  > li
  > span:nth-child(2)
  > span:nth-child(2)
  > button:last-child:hover {
  background: url(./assets/treesc_a.png) no-repeat center !important;
}
/* 部门Tree end */
.partmentmgr-container .add-dialog .el-dialog .el-dialog__body {
  height: 550px !important;
  overflow-y: auto;
}
.partmentmgr-container .add-dialog.add-dep .el-dialog .el-dialog__body {
  height: 200px !important;
}
.add-dialog.add-upload .el-dialog .el-dialog__body {
  text-align: center;
  height: 200px !important;
}
.partmentmgr-container .add-dialog.update-dep .el-dialog .el-dialog__body {
  height: 350px !important;
  overflow: hidden;
}
/*滚动条整体样式*/
.partmentmgr-container
  .add-dialog
  .el-dialog
  .el-dialog__body::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.partmentmgr-container
  .add-dialog
  .el-dialog
  .el-dialog__body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
.partmentmgr-container
  .add-dialog
  .el-dialog
  .el-dialog__body::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}

.eventDatialsPage .el-table .el-table__header-wrapper tr {
  background: #a5cfbb !important;
  color: #fff;
}
.eventDatialsPage .el-table .el-table__header-wrapper tr th {
  border-right: none !important;
}
.eventDatialsPage .el-table--border {
  border-top: none;
}
.eventDatialsPage
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active {
  background: #a5cfbb !important;
  color: #fff;
  border: none;
  border-radius: 10px 10px 0 0;
}
.eventDatialsPage .el-tabs--border-card > .el-tabs__header {
  border-left: 1px solid #e4e7ed;
  background: #fff;
}
.eventDatialsPage .el-tabs--border-card {
  box-shadow: none;
}
.exchangeEvent .el-form--inline .el-form-item {
  margin-right: 0 !important;
}
.exchangeEvent .el-dialog__header {
  display: none;
}
.exchangeEvent .el-dialog__body {
  border-radius: 5px !important;
  padding: 0;
}
.discrimination .content .el-input-group__append {
  background: #fff !important;
}
.discrimination .content > div > .el-input input {
  border-radius: 5px !important;
}
.discrimination .content > div > .el-select .el-input input {
  height: 34px !important;
  border: none !important;
  text-align: center !important;
  user-select: none;
  border-radius: 5px !important;
}
.discrimination .content > div > .el-select .el-input::before {
  content: "";
  height: 20px;
  width: 1px;
  background: #dcdfe6;
  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
}
.discrimination .el-tabs {
  background: #fff !important;
  height: 80% !important;
}
.discrimination .el-tabs__content {
  background: #fff !important;
  height: 83% !important;
  border: 1px solid #eee;
  overflow-y: auto;
}
/*滚动条整体样式*/
.discrimination .el-tabs__content::-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.discrimination .el-tabs__content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #eee;
}
/*滚动条里面轨道*/
.discrimination .el-tabs__content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
}
.discrimination .el-tabs__nav-wrap::after {
  display: none;
}
.discrimination .el-tabs__nav div:nth-child(2) {
  padding-left: 10px !important;
}
.discrimination .el-tabs__nav div:last-child {
  padding-right: 10px !important;
}
.discrimination .left .el-tabs__item.is-active {
  background: #ebbb16;
  color: #fff;
}
.discrimination .right .el-tabs__item.is-active {
  background: #ff7f00;
  color: #fff;
}
.discrimination .el-tabs__item {
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  margin-top: 10px;
  margin-right: 10px;
}
.discrimination .el-tabs__active-bar {
  background: none !important;
}
.discrimination
  .inner-top
  .el-tabs
  .el-tabs__content
  .el-tab-pane
  .el-checkbox-group {
  text-align: left;
}
.discrimination
  .inner-top
  .el-tabs
  .el-tabs__content
  .el-tab-pane
  .el-checkbox-group
  .el-checkbox
  > .el-checkbox__label {
  width: 8em;
  text-align: left;
}
.el-button--primary.is-disabled {
  background-color: #91c3ab !important;
  border-color: #91c3ab !important;
}
.el-button--primary:focus,
.el-button--primary:hover {
  background-color: #006636 !important;
  border-color: #006636 !important;
  color: #fff;
}
.el-message-box__btns button:last-child {
  background-color: #429e73 !important;
  border-color: #429e73 !important;
  color: #fff;
}
.el-message-box__btns button:last-child:hover {
  background-color: #006636 !important;
  border-color: #006636 !important;
  color: #fff;
}
.el-message-box__btns button:first-child:hover {
  background-color: #429e73 !important;
  border-color: #429e73 !important;
  color: #fff;
}
input:focus,
textarea:focus{
  outline-style: none;
  border-color: #429E73 !important;
}
.el-tabs--border-card>.el-tabs__content{
  padding: 0 !important;
}
/* .el-table.event-table-list .cell{
  white-space:nowrap !important;
}
.el-table.event-table-list th>.cell{
  white-space:nowrap !important;
} */
.address-point .el-input--mini .el-input__inner{
  padding-right: 35px !important;
}
.amap-sug-result{
  z-index: 99999999999999999999 !important;
}
</style>
