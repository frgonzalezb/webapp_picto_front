import axiosInstance from '@/services/axios';

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
            try {
                const response = await axiosInstance.get(`/audios/${id}/`);
                commit('SearchAudioObj', response.data)
            } catch (error) {
                const response = error.response;
                return response;
            }
            
        },

        async DeleteAudioObj({ commit }, id) {
            try {
                const response = await axiosInstance.delete(`/audios/${id}/`);
                return response;

            } catch (error) {
                const response = error.response;
                return response;
            }
        },

        async UpdateAudioObj({ commit }, data) {
            try {
                const response = await axiosInstance.put(
                    `/audios/${data.id}/`, 
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
                    `/audios/`, 
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