<template>
  <!-- Dashboard -->
  <div class="content">
    <div class="buttons">
      <img class="logoImg" src="@/assets/Img/logos/logo_up.png" alt="picto" />
      <div v-if="isStaff">
        <router-link to="/pictogramas/" class="button is-large">
          Pictos Precargados
        </router-link>
        <router-link to="/audios/" class="button is-large">
          Audios Precargados
        </router-link>
        <router-link :to="`/cuenta/${userId}/`" class="button is-large">
          Mi Cuenta
        </router-link>
      </div>
      <div v-else>
        <router-link to="/pictogramas/" class="button is-large">
          Mis Pictogramas
        </router-link>
        <router-link to="/audios/" class="button is-large">
          Mis Audios
        </router-link>
        <router-link to="/rutinas/" class="button is-large">
          Mis Rutinas
        </router-link>
        <router-link :to="`/cuenta/${userId}/`" class="button is-large">
          Mi Cuenta
        </router-link>
      </div>
    </div>

    <div class="buttons">
      <storageMonitor />
    </div>
  </div>
  <!-- /Dashboard -->
</template>

<script>
import { mapState, mapActions } from "vuex";
import storageMonitor from '@/components/StorageMonitor/StorageMonitor.vue';

export default {
  name: "Dashboard",
  components: {
    storageMonitor
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["UserObj"]),

    userId() {
      return this.UserObj.id;
    },
    isStaff() {
      return this.UserObj.isStaff;
    },
  },
  mounted() {
    document.title = "PICTO - Dashboard";
    this.ActiveNav();
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
    ...mapActions("audios", ["restartAudios"]),
    ...mapActions("pictogramas", ["restartPictogramas"]),
  },
  unmounted() {
    this.InactiveNav();
  },
};
</script>

<style scoped>
.content {
  z-index: 3;
  position: absolute;
  min-width: 100%;
  border-radius: 0px;
  overflow: hidden;
  display: inline-flex;
  height: calc(100vh - 4rem);
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.buttons {
  max-width: fit-content;
  border-radius: 28px;
  margin: 25px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.button {
  width: 10em;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 14px;
  border: solid black 2px;
  box-shadow: 2px 4px 12px #000;
  background-image: linear-gradient(
    to right,
    #84fab0 0%,
    #8fd3f4 51%,
    #84fab0 100%
  );
  color: white;
  font-weight: bold;
}

.button:hover {
  background-position: right center;
  color: #006ead;
  border: 1px solid #006ead;
  transform: translate(0.3rem, 0.3rem);
  transition: all 0.3s ease-in-out;
}

.logoImg {
  width: 20em;
}
</style>
