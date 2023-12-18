import axiosInstance from '@/services/axios';

export default {
  namespaced: true,
  state: {
    RutinaObj: {
      id: 0,
      nombre: "",
      url_portada: "",
      json_rutina: "",
    },
    visiblePhoto: true,
  },
  mutations: {
    cleanValue(state) {
      state.RutinaObj.id = 0;
      state.RutinaObj.nombre = "";
      state.RutinaObj.url_portada = "";
      state.RutinaObj.json_rutina = "";
      state.visiblePhoto = true;
    },
    showPhoto(state) {
      state.visiblePhoto = true;
    },
    hidePhoto(state) {
      state.visiblePhoto = false;
    },
    setNombre(state, value) {
      state.RutinaObj.nombre = value;
    },
    setJson(state, value) {
      state.RutinaObj.json_rutina = value;
    },
    SearchRutinaObj(state, obj) {
      state.RutinaObj.id = obj.id;
      state.RutinaObj.nombre = obj.nombre;
      state.RutinaObj.url_portada = obj.url_portada;
      state.RutinaObj.json_rutina = obj.json_rutina;
      state.visiblePhoto = false;
    },
    SearchRutinaObjForUpdate(state, obj) {
      state.RutinaObj.id = obj.id;
      state.RutinaObj.nombre = obj.nombre;
      state.RutinaObj.url_portada = obj.url_portada;
      state.RutinaObj.json_rutina = obj.json_rutina;
      state.visiblePhoto = false;
    },
  },
  actions: {
    cleanValue({ commit }) {
      commit("cleanValue");
    },
    
    showPhoto({ commit }) {
      commit("showPhoto");
    },
    
    setNombre({ commit }, value) {
      commit("setNombre", value);
    },
    
    setJson({ commit }, value) {
      commit("setJson", value);
    },
    
    hidePhoto({ commit }) {
      commit("hidePhoto");
    },

    async SearchRutinaObj({ commit }, id) {
      const response = await axiosInstance.get(
        `/rutinas/${id}/`
      );
      commit("SearchRutinaObj", response.data);
      return response;
    },

    async SearchRutinaObjForUpdate({ commit }, id) {
      const response = await axiosInstance.get(
        `/rutinas/${id}/`
      );
      commit("SearchRutinaObjForUpdate", response.data);
    },

    async DeleteRutinaObj({ commit }, id) {
      try {
        const response = await axiosInstance.delete(
          `/rutinas/${id}/`
        );
        return response;

      } catch (error) {
        const response = error.response;
        return response;
      }
    },

    async UpdateRutinaObj({ commit }, data) {
      try {
        const response = await axiosInstance.put(
          `/rutinas/${data.id}/`,
          data.data
        );
        return response;

      } catch (error) {
        const response = error.response;
        return response;
      }
    },
    
    async CreateRutinaObj({ commit }, data) {
      try {
        const response = await axiosInstance.post(
          `/rutinas/`,
          data
        );
        return response;
      
      } catch (error) {
        const response = error.response;
        return response;
      }
    },
  },
  getters: {},
  modules: {},
};
