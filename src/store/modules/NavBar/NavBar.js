export default {
    namespaced: true,
    state: {
        isActiveNav: true,
        isOpenOptionNav: false
    },
    mutations: {
        OpenOptionNav(state){
            state.isOpenOptionNav = true;
        },
        CloseOptionNav(state){
            state.isOpenOptionNav = false;
        },
        ToggleOptionNav(state){
            state.isOpenOptionNav = !state.isOpenOptionNav;
        },
        ActiveNav(state){
            state.isActiveNav = true;
        },
        InactiveNav(state){
            state.isActiveNav = false;
        }, 
    },
    actions: {
        OpenOptionNav({commit}){
            commit('OpenOptionNav')
        },
        CloseOptionNav({commit}){
            commit('CloseOptionNav')
        },
        ToggleOptionNav({commit}){
            commit('ToggleOptionNav')
        },
        ActiveNav({commit}){
            commit('ActiveNav')
        },
        InactiveNav({commit}){
            commit('InactiveNav')
        }
    },
    getters:{
    },
    modules: {
    }
}
