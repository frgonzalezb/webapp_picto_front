import { createStore } from "vuex";
import { setCookie, clearCookie } from './cookies.js';

import navBar from "./modules/NavBar/NavBar";
import TopShapeDivider from "./modules/BackgroundShapes/TopShapeDivider";
import BottomShapeDivider from "./modules/BackgroundShapes/BottomShapeDivider";

import audioObj from "./modules/Audios/audio";
import audios from "./modules/Audios/audios";
import modalAudio from "./modules/ModalAudio/modalAudio";

import modalPictograma from "./modules/ModalPictograma/modalPictograma";
import pictogramas from "./modules/Pictogramas/pictogramas";
import pictogramaObj from "./modules/Pictogramas/pictograma";

import ModalRutina from "./modules/ModalRutina/ModalRutina";
import rutinas from "./modules/Rutinas/rutinas";
import rutina from "./modules/Rutinas/rutina";
import rutinaActiva from "./modules/Rutinas/rutinaActiva";

import user from "./modules/Users/user";

import ModalPictogramaList from "./modules/ModalPictogramaList/ModalPictogramaList";

import axiosInstance from '@/services/axios';
import refreshTokenInstance from '@/services/refreshToken';

import router from '@/router/index';


export default createStore({
  state: {
    accessToken: null,
    refreshToken: null,
    storageData: null,
  },
  mutations: {
    setTokens(state, { accessToken, refreshToken }) {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      setCookie('access_cookie', accessToken, {}, 15 * 60);
      setCookie('refresh_cookie', refreshToken, {}, 24 * 60 * 60);
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;

      clearCookie('access_cookie');
      clearCookie('refresh_cookie');
    },
    updateStorageData(state, storageData) {
      state.storageData = storageData;
      console.log('updateStorageData', storageData);
    },
    clearStorageData(state) {
      state.storageData = null;
    }
  },
  actions: {
    saveTokens({ commit, state }, { accessToken, refreshToken }) {
      commit('setTokens', { accessToken, refreshToken });

      setCookie('access_cookie', accessToken, {}, 15 * 60);
      setCookie('refresh_cookie', refreshToken, {}, 24 * 60 * 60);
    },
    clearTokens({ commit }) {
      commit('clearTokens');
    },
    clearStorageData({ commit }) {
      commit('clearStorageData');
    },
    async logout({ dispatch }) {
      await dispatch('clearTokens');
      await dispatch('clearStorageData');
      await dispatch('user/cleanValue');
    },

    async authenticate({ commit }, data) {
      try {
        const response = await axiosInstance.post(
          `/api/login/`, 
          data    
        );
        return response;
      } catch (error) {
        return error.response
      };
    },
    async refreshTokens({ commit, state }) {
      const refresh_token = state.refreshToken;
  
      if (refresh_token) {
        try {
          const response = await refreshTokenInstance.post(
            import.meta.env.VITE_REFRESH_TOKEN_ENDPOINT, 
            { refresh: refresh_token }
          );
  
          const newAccessToken = response.data.access;

          commit('setTokens', 
            { accessToken: newAccessToken, refreshToken: refresh_token }
          );
  
          return newAccessToken;
  
        } catch (refreshError) {
          commit('clearTokens');
  
          if (refreshError.response && refreshError.response.status === 401) {
            router.push('/login/');
          } else {
            const msg = 'Error al solicitar los datos. \
              Si el problema persiste, contacte al administrador.';
            console.error(msg);
          }
  
          return null;
        }
      } else {
        router.push('/login/');
        throw new Error('No hay token de refresco disponible.');
      }
    },
  },
  modules: {
    navBar,
    TopShapeDivider,
    BottomShapeDivider,

    audioObj,
    audios,
    modalAudio,

    pictogramas,
    modalPictograma,
    pictogramaObj,

    ModalRutina,
    rutinas,
    rutina,
    rutinaActiva,

    user,

    ModalPictogramaList
  },
});
