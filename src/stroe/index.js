import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import meun from "./modules/meun";
import role from "./modules/role";
import event from "./modules/event";
import tabs from "./modules/tabs";
import msgs from "./modules/message";

export default new Vuex.Store({
  modules: {
    meun,
    role,
    event,
    tabs,
    msgs
  }
});
