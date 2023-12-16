<template>
  <!-- Index -->
  <div class="content">
    <div class="buttons">
      <h1>Error 404</h1>
      <h6>¡Ups! Nada que ver aquí...</h6>
      <img src="@/assets/Img/otros/no-Found.gif" alt="" />
      <div v-if="isAuthenticated">
        <router-link to="/dashboard/" class="button is-large">
          Volver
        </router-link>
      </div>
      <div v-else>
        <router-link to="/" class="button is-large">
          Volver
        </router-link>
      </div>
    </div>
  </div>
  <!-- /Index -->
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Error404",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["UserObj"]),

    isAuthenticated() {
      return this.UserObj.isAuthenticated;
    },
  },
  mounted() {
    document.title = "PICTO - Error 404";
    this.ActiveNav();
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
  },
};
</script>

<style scoped>
.content {
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.buttons {
  z-index: 3;
  padding: 25px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
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
