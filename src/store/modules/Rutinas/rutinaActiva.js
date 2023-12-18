import axiosInstance from '@/services/axios';

export default {
  namespaced: true,
  state: {
    RutinaActiva: {
      id: 0,
      nombre: "",
      json_rutina: "",
    },
  },
  mutations: {
    SearchRutinaActiva(state, obj) {
      state.RutinaActiva.id = obj.id;
      state.RutinaActiva.nombre = obj.nombre;
      state.RutinaActiva.json_rutina = obj.json_rutina;
    },
  },
  actions: {
    async SearchRutinaActiva({ commit }, id) {
      const response = await axiosInstance.get(
        `/rutinas/${id}/`
      );
      commit("SearchRutinaActiva", response.data);
    },
  },
  getters: {},
  modules: {},
};
