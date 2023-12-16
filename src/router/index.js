import { createRouter, createWebHistory } from 'vue-router'

import MisRutinas from "../views/MisRutinas.vue";
import MisPictogramas from "../views/MisPictogramas.vue";
import MisAudios from "../views/MisAudios.vue";
import MiCuenta from "../views/MiCuenta.vue";
import CrearNuevaRutina from "../views/CrearNuevaRutina.vue";
import RutinaActiva from "../views/RutinaActiva.vue";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import ActivateAccount from "../views/ActivateAccount.vue";
import forgotPassword from "../views/ForgotPassword.vue";
import resetPassword from "../views/ResetPassword.vue";
import ContactForm from "../views/ContactForm.vue";
import Error404 from "../views/Error404.vue";

import Index from "../views/Index.vue"

import store from '../store/index';


const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    beforeEnter: (to, from, next) => {
      if (store.state.accessToken) {
        next('/dashboard/');
      } else {
        next();
      }
    },
  },
  {
    path: "/contacto/",
    name: "Contacto",
    component: ContactForm,
  },
  {
    path: "/dashboard/",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/pictogramas/",
    name: "MisPictogramas",
    component: MisPictogramas,
    meta: { requiresAuth: true },
  },
  {
    path: "/audios/",
    name: "MisAudios",
    component: MisAudios,
    meta: { requiresAuth: true },
  },
  {
    path: "/rutinas/",
    name: "MisRutinas",
    component: MisRutinas,
    meta: { requiresAuth: true },
  },
  {
    path: "/cuenta/:id/",
    name: "MiCuenta",
    component: MiCuenta,
    meta: { requiresAuth: true },
  },
  {
    path: "/crear-nueva-rutina/",
    name: "CrearNuevaRutina",
    component: CrearNuevaRutina,
    meta: { requiresAuth: true },
  },
  {
    path: "/rutina-activa/:id/",
    name: "RutinaActiva",
    component: RutinaActiva,
    meta: { requiresAuth: true },
  },
  {
    path: "/login/",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.state.accessToken) {
        next('/dashboard/');
      } else {
        next();
      }
    },
  },
  {
    path: "/registro/",
    name: "Registro",
    component: Registro,
    beforeEnter: (to, from, next) => {
      if (store.state.accessToken) {
        next('/dashboard/');
      } else {
        next();
      }
    },
  },
  {
    path: "/activate/",
    name: "ActivateAccount",
    component: ActivateAccount,
    beforeEnter: (to, from, next) => {
      if (store.state.accessToken) {
        next('/dashboard/');
      } else {
        next();
      }
    },
  },
  {
    path: "/recuperar-acceso/",
    name: "forgotPassword",
    component: forgotPassword,
    beforeEnter: (to, from, next) => {
      if (store.state.accessToken) {
        next('/dashboard/');
      } else {
        next();
      }
    },
  },
  {
    path: "/restablecer-contrasena/",
    name: "resetPassword",
    component: resetPassword,
    beforeEnter: (to, from, next) => {
      if (store.state.accessToken) {
        next('/dashboard/');
      } else {
        next();
      }
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: Error404,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.accessToken) {
      next('/login/');
    } else {
      next();
    }
  } else {
    next();
  }
});

// Manejar errores globalmente
router.onError((error) => {
  const isAxiosError = error && error.name === 'AxiosError';

  if (isAxiosError) {
    router.push('/login/');
  }
});

export default router;
