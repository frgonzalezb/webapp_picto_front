export default {
  namespaced: true,
  state: {
    isActiveBottom: true,
  },
  mutations: {
    setActiveBottom(state){
        state.isActiveBottom = true;
    },
    setInactiveBottom(state){
        state.isActiveBottom = false;
    },
  },
  actions: {
    setActiveBottom({ commit }) {
      commit('setActiveBottom');
    },
    setInactiveBottom({ commit }) {
      commit('setInactiveBottom');
    },
  },
  getters:{
  },
  modules: {
  }
}
