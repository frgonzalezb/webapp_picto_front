<template>
<!-- NavBar -->
<nav class="navbar" role="navigation" aria-label="dropdown navigation">
  <!-- Left side -->
  <div class="navbar-brand">
    <router-link to="/">
      <div class="navbar-start">
        <img
          src="@/assets/Img/logos/Logo-blanco.png"
          width="160"
          alt="Picto-Logo"
        />
      </div>
    </router-link>
    <div
      class="navbar-burger"
      role="menu"
      aria-label="menu"
      aria-expanded="false"
      data-target="pictoNavbar"
      @click="ToggleOptionNav"
      :class="{ 'is-active': isOpenOptionNav }"
    >
      <span role="menuitem" aria-hidden="true"></span>
      <span role="menuitem" aria-hidden="true"></span>
      <span role="menuitem" aria-hidden="true"></span>
    </div>
  </div>
  <!-- Right side -->
  <div id="pictoNavbar" class="navbar-menu" :class="{ 'is-active': isOpenOptionNav }">
    <div class="navbar-end" @click="ToggleOptionNav">
      <div v-if="isAuthenticated" class="user-info">
        <span class="navbar-item">Bienvenido, {{ userName || userEmail }}</span>
        <span class="navbar-item">||</span>
        <router-link class="navbar-item" to="/dashboard/">
          Dashboard
        </router-link>
        <div v-if="isStaff" class="user-info">
          <router-link class="navbar-item" to="/pictogramas/">
            Pictogramas
          </router-link>
          <router-link class="navbar-item" to="/audios/">
            Audios
          </router-link>
        </div>
        <div v-else class="user-info">
          <router-link class="navbar-item" to="/pictogramas/">
            Mis Pictogramas
          </router-link>
          <router-link class="navbar-item" to="/audios/">
            Mis Audios
          </router-link>
          <router-link class="navbar-item" to="/rutinas/">
            Mis Rutinas
          </router-link>
        </div>
        <span class="navbar-item">||</span>
        <router-link class="navbar-item" to="/#/" @click="handleLogout">
          Logout
        </router-link>
      </div>
      <div v-else class="user-info">
        <router-link class="navbar-item" to="/">
          Home
        </router-link>
        <router-link class="navbar-item" to="/login/">
          Iniciar sesión
        </router-link>
        <router-link class="navbar-item" to="/registro/">
          Registrarse
        </router-link>
        <router-link class="navbar-item" to="/contacto/">
          Contacto
        </router-link>
      </div>
    </div>
  </div>
</nav>
<!-- /Navbar -->
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "NavBar",
  components: {},
  props: {},
  data() {
    return {
      mostrarOpciones: false,
    };
  },
  computed: {
    ...mapState("navBar", ["isOpenOptionNav"]),
    ...mapState("user", ["UserObj"]),
    ...mapState(['accessToken']),

    userName() {
      return this.UserObj.name;
    },

    userEmail() {
      return this.UserObj.email;
    },

    isStaff() {
      return this.UserObj.isStaff;
    },

    isAuthenticated() {
      return this.accessToken !== null;
    },
  },
  methods: {
    ...mapActions("navBar", [
      "OpenOptionNav",
      "CloseOptionNav",
      "ToggleOptionNav",
    ]),
    ...mapActions("audios", ["restartAudios", "get_audios"]),
    ...mapActions("pictogramas", ["restartPictogramas", "get_pictogramas"]),
    ...mapActions("user", ["cleanValue", "SearchUserObj"]),
    ...mapActions(['logout']),
    
    async handleLogout() {
      await this.$store.dispatch('logout');
      this.$router.push('/');
    }
  },
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(to right, #3fada8, #808080);
  height: 10vh;
  padding: 0;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-start {
  margin-left: 12px;
}

.navbar-end {
  background: transparent;
}

@media screen and (max-width: 1023px) {
  .navbar-menu {
    background-color: white;
    box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
  }

  .navbar-end {
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    right: 0;
  }

  .navbar-end a {
    background: transparent !important;
    text-decoration: none !important;
  }
}

.navbar-item {
  color: white;
  font-size: 1.25rem;
}

.navbar-burger {
  color: white;
  background: transparent;
  position: absolute;
  right: 0;
  margin-right: 12px;
}

.user-info {
  display: flex;
}
</style>
