export default {
    namespaced: true,
    state: {
        isOpenModalPictograma: false
    },
    mutations: {
        changeOpenModalPictograma(state){
            state.isOpenModalPictograma = !state.isOpenModalPictograma
        }   
    },
    actions: {
        changeOpenModalPictograma({ commit }){
            commit('changeOpenModalPictograma')
        }
    },
    getters:{
    },
    modules: {
    }



}