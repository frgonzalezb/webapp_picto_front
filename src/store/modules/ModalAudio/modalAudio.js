export default {
    namespaced: true,
    state: {
        isOpenModalAudio: false
    },
    mutations: {
        changeOpenModalAudio(state){
            state.isOpenModalAudio = !state.isOpenModalAudio
        }   
    },
    actions: {
        changeOpenModalAudio({ commit }){
            commit('changeOpenModalAudio')
        }
    },
    getters:{
    },
    modules: {
    }



}