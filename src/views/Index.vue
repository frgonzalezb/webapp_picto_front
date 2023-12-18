<template>
  <!-- Index -->
  <div class="content">
    <div class="buttons">
      <img class="logoImg" src="@/assets/Img/logos/logo_up.png" alt="picto" />
      <router-link to="/login/" class="button is-large">
        Iniciar sesión
      </router-link>
      <router-link to="/registro/" class="button is-large">
        Registrarse
      </router-link>
      <img
        class="logoImg"
        src="@/assets/Img/logos/logo_down.png"
        alt="picto"
      />
    </div>
  </div>
  <!-- /Index -->
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Index",
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {
    document.title = "PICTO - Inicio";
    this.ActiveNav();
    const text = 'Esta es una versión de prueba de PICTO, que estará vigente \
      por un tiempo limitado. Es posible que algunas características tengan \
      algunos errores en su funcionamiento. Si quieres ayudarnos, puedes \
      utilizar el formulario de contacto para notificarnos de algún problema \
      o contactarnos a través de nuestro Instagram (ver abajo).\n\n \
      Atentamente, el equipo de PICTO.'
    this.$swal.fire({
      title: "Antes de comenzar...",
      text: text,
      icon: "warning",
      confirmButtonText: 'Entendido'
    });
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
