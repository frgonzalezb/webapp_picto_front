export default {
  namespaced: true,
  state: {
    isOpenModalList: false,
  },
  mutations: {
    OpenModal(state) {
      state.isOpenModalList = true;
    },
    CloseModal(state) {
      state.isOpenModalList = false;
    },
  },
  actions: {
    OpenModal({ commit }) {
      commit("OpenModal");
    },
    CloseModal({ commit }) {
      commit("CloseModal");
    },
  },
  getters: {},
  modules: {},
};
