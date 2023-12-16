export default {
    namespaced: true,
    state: {
        isOpenModalRutina: false
    },
    mutations: {
        OpenModalRutina(state){
            state.isOpenModalRutina = true;
        },
        CloseModalRutina(state){
            state.isOpenModalRutina = false;
        }  
    },
    actions: {
        OpenModalRutina({commit}){
            commit('OpenModalRutina')
        },
        CloseModalRutina({commit}){
            commit('CloseModalRutina')
        }
    },
    getters:{
    },
    modules: {
    }



}