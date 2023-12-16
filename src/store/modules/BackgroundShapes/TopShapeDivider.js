export default {
  namespaced: true,
  state: {
    isActiveTop: true,
  },
  mutations: {
    setActiveTop(state){
        state.isActiveTop = true;
    },
    setInactiveTop(state){
        state.isActiveTop = false;
    },
  },
  actions: {
    setActiveTop({ commit }) {
      commit('setActiveTop');
    },
    setInactiveTop({ commit }) {
      commit('setInactiveTop');
    },
  },
  getters:{
  },
  modules: {
  }
}
