const state = {
  options: [
    {
      route: "/home/home-page",
      name: "首页",
      icon: "/store/menu/20190108-135228-38-checked.png"
    }
  ],
  activeIndex: "/home/home-page"
};
const mutations = {
  // 添加tabs
  add_tabs(state, data) {
    state.options.push(data);
  },
  // 删除tabs
  delete_tabs(state, route) {
    let index = 0;
    for (let option of state.options) {
      if (option.route === route) {
        break;
      }
      index++;
    }
    state.options.splice(index, 1);
  },
  // 设置当前激活的tab
  set_active_index(state, index) {
    state.activeIndex = index;
  }
};

export default {
  state,
  mutations
};
