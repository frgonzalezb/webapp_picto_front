import { createApp } from 'vue'
import App from './App.vue'
import store from "./store";
import router from './router'
import konva from "konva";
import VueSweetalert2 from "vue-sweetalert2";
import { getCookie } from '@/store/cookies.js';

const accessToken = getCookie('access_cookie');
const refreshToken = getCookie('refresh_cookie');

if (accessToken && refreshToken) {
  store.dispatch('saveTokens', { accessToken, refreshToken });
}

store.commit('user/setUserObjFromSessionStorage');

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const app = createApp(App)

app.use(store)
app.use(router)
app.use(konva)
app.use(VueSweetalert2)
app.mount('#app')
