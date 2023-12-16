import axiosInstance from '../../../services/axios';

export default {
    namespaced: true,
    state: {
        PictogramaObj: {
            id: 0,
            nombre: '',
            ruta: '',
            autor: 0
        },
        visiblePhoto: true
    },
    mutations: {
        cleanValue(state){
            state.PictogramaObj.id = 0
            state.PictogramaObj.nombre = ''
            state.PictogramaObj.ruta = ''
            state.PictogramaObj.autor = 0
            state.visiblePhoto = true
        },
        showPhoto(state){
            state.visiblePhoto = true
        },
        hidePhoto(state){
            state.visiblePhoto = false
        },
        setNombre(state, value){
            state.PictogramaObj.nombre = value
        },
        SearchPictogramaObj(state, obj){
            state.PictogramaObj.id = obj.id
            state.PictogramaObj.nombre = obj.nombre
            state.PictogramaObj.ruta = obj.ruta
            state.PictogramaObj.autor = obj.autor
            state.visiblePhoto = false
        }   
    },
    actions: {
        cleanValue({ commit }){
            commit('cleanValue')
        },
        
        showPhoto({ commit }){
            commit('showPhoto')
        },
        
        hidePhoto({ commit }){
            commit('hidePhoto')
        },
        
        setNombre({ commit }, value){
            commit('setNombre', value)
        },
        
        async CreatePictogramaObj({ commit }, data) {
            try {
                const response = await axiosInstance.post(
                    `${import.meta.env.VITE_APP_BACKEND_API}/pictogramas/`, 
                    data    
                );
                return response;

            } catch (error) {
                const response = error.response;
                return response;
            } 
        },
        
        async SearchPictogramaObj({ commit }, id) {
            const response = await axiosInstance.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/pictogramas/${id}/`
            );
            commit('SearchPictogramaObj', response.data)
        },
        
        async UpdatePictogramaObj({ commit }, data) {
            try {
                const response = await axiosInstance.put(
                    `${import.meta.env.VITE_APP_BACKEND_API}/pictogramas/${data.id}/`, 
                    data.data
                );
                return response;

            } catch (error) {
                const response = error.response;
                return response;
            }
        },
        
        async DeletePictogramaObj({ commit }, id) {
            try {
                const response = await axiosInstance.delete(
                    `${import.meta.env.VITE_APP_BACKEND_API}/pictogramas/${id}/`
                );
                return response;

            } catch (error) {
                const response = error.response;
                return response;
            }
        },
    },
    getters:{
    },
    modules: {
    }
}
