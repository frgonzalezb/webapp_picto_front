import axiosInstance from '@/services/axios';

export default {
  namespaced: true,
  state: {
    AllPictogramas: [],
    PictogramaFilter: [],
  },
  mutations: {
    llenarPictogramas(state, data) {
      state.AllPictogramas = data;
      state.PictogramaFilter = [];
      setTimeout(() => {
        state.PictogramaFilter = state.AllPictogramas;
      }, 100);
    },
    updatePictogramaFilter(state, value) {
      const temp = [];
      state.PictogramaFilter = [];
      if (value === "") {
        setTimeout(() => {
          state.PictogramaFilter = state.AllPictogramas;
        }, 100);
      } else {
        for (let pictograma of state.AllPictogramas) {
          let matches =
            pictograma.nombre.toUpperCase().indexOf(value.toUpperCase()) >= 0
              ? true
              : false;
          if (matches) {
            temp.push(pictograma);
          }
          setTimeout(() => {
            state.PictogramaFilter = temp;
          }, 100);
        }
      }
    },
  },
  actions: {
    async get_pictogramas({ commit }) {
      const response = await axiosInstance.get(
        `/pictogramas/`
      );
      commit("llenarPictogramas", response.data);
    },
    search_pictograma({ commit }, value) {
      commit("updatePictogramaFilter", value);
    },
  },
  getters: {},
  modules: {},
};
