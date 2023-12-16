import axiosInstance from '../../../services/axios';

export default {
  namespaced: true,
  state: {
    AllRutinas: [],
    RutinasFilter: [],
  },
  mutations: {
    llenarRutinas(state, data) {
      state.AllRutinas = data;
      state.RutinasFilter = [];
      setTimeout(() => {
        state.RutinasFilter = state.AllRutinas;
      }, 100);
    },
    updateRutinaFilter(state, value) {
      const temp = [];
      state.RutinasFilter = [];
      if (value === "") {
        setTimeout(() => {
          state.RutinasFilter = state.AllRutinas;
        }, 100);
      } else {
        for (let rutina of state.AllRutinas) {
          let matches =
            rutina.nombre.toUpperCase().indexOf(value.toUpperCase()) >= 0
              ? true
              : false;
          if (matches) {
            temp.push(rutina);
          }
        }
        setTimeout(() => {
          state.RutinasFilter = temp;
        }, 100);
      }
    },
  },
  actions: {
    async get_rutinas({ commit }) {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_APP_BACKEND_API}/rutinas/`
      );
      commit("llenarRutinas", response.data);
    },
    search_rutinas({ commit }, value) {
      commit("updateRutinaFilter", value);
    },
  },
  getters: {},
  modules: {},
};
