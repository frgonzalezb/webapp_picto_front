import axiosInstance from '../../../services/axios';

export default {
    namespaced: true,
    state: {
        AudioObj: {
            id: 0,
            nombre: '',
            ruta: '',
            autor: 0
        },
        visibleInput: true
    },
    mutations: {
        cleanValue(state) {
            state.AudioObj.id = 0
            state.AudioObj.nombre = ''
            state.AudioObj.ruta = ''
            state.AudioObj.autor = 0
            state.visibleInput = true
        },
        showInput(state) {
            state.visibleInput = true
        },
        hideInput(state) {
            state.visibleInput = false
        },
        setNombre(state, value) {
            state.AudioObj.nombre = value
        },
        SearchAudioObj(state, obj) {
            state.AudioObj.id = obj.id
            state.AudioObj.nombre = obj.nombre
            state.AudioObj.ruta = obj.ruta
            state.AudioObj.autor = obj.autor
            state.visibleInput = false
        }   
    },
    actions: {
        cleanValue({ commit }) {
            commit('cleanValue')
        },

        showInput({ commit }) {
            commit('showInput')
        },

        hideInput({ commit }) {
            commit('hideInput')
        },

        setNombre({ commit }, value) {
            commit('setNombre', value)
        },

        async SearchAudioObj({ commit }, id) {
            const response = await axiosInstance.get(`${import.meta.env.VITE_APP_BACKEND_API}/audios/${id}/`);
            commit('SearchAudioObj', response.data)
        },

        async DeleteAudioObj({ commit }, id) {
            try {
                const response = await axiosInstance.delete(
                    `${import.meta.env.VITE_APP_BACKEND_API}/audios/${id}/`
                );
                return response;

            } catch (error) {
                const response = error.response;
                return response;
            }
        },

        async UpdateAudioObj({ commit }, data) {
            try {
                const response = await axiosInstance.put(
                    `${import.meta.env.VITE_APP_BACKEND_API}/audios/${data.id}/`, 
                    data.data
                );
                return response;

            } catch (error) {
                const response = error.response;
                return response;
            }
        },

        async CreateAudioObj({ commit }, data) {
            try {
                const response = await axiosInstance.post(
                    `${import.meta.env.VITE_APP_BACKEND_API}/audios/`, 
                    data
                );
                return response;

            } catch (error) {
                const response = error.response;
                return response;
            }
        },
    },
    getters: {
    },
    modules: {
    }



}