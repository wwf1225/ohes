const state = {
  unReadMsgcount: 0
};
const mutations = {
  minusUnReadMsg(state) {
    state.unReadMsgcount++;
  }
};
export default {
  state,
  mutations
};
