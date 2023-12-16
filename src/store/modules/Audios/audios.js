import axiosInstance from '../../../services/axios';

export default {
  namespaced: true,
  state: {
    AllAudios: [],
    AudioFilter: [],
  },
  mutations: {
    llenarAudios(state, data) {
      state.AllAudios = data;
      state.AudioFilter = [];
      setTimeout(() => {
        state.AudioFilter = state.AllAudios;
      }, 100);
    },
    updateAudioFilter(state, value) {
      const temp = [];
      state.AudioFilter = [];
      if (value === "") {
        setTimeout(() => {
          state.AudioFilter = state.AllAudios;
        }, 100);
      } else {
        for (let audio of state.AllAudios) {
          let matches =
            audio.nombre.toUpperCase().indexOf(value.toUpperCase()) >= 0
              ? true
              : false;
          if (matches) {
            temp.push(audio);
          }
        }
        setTimeout(() => {
          state.AudioFilter = temp;
        }, 100);
      }
    },
  },
  actions: {
    async get_audios({ commit }) {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_APP_BACKEND_API}/audios/`
        );
        commit("llenarAudios", response.data);
      } catch (error) {
        return error.response;
      }
      
    },
    search_audio({ commit }, value) {
      commit("updateAudioFilter", value);
    },
  },
  getters: {},
  modules: {},
};
