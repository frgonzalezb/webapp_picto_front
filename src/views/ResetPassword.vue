<template>
  <!-- CambiarContraseña -->
  <div class="content">
    <div class="container">
      <h2>Restablecer contraseña</h2>
      <br><br>
      <div class="form">
        <form @submit.prevent="onSubmit">
          <div class="input__box">
            <label class="titulo" for="password">Nueva contraseña:</label>
            <br>
            <input 
              :type="showPassword ? 'text' : 'password'"
              class="style-input-box" 
              v-model="formData.password" 
              id="password" 
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <div class="input__box">
            <label class="titulo" for="confirmPassword">Repita su contraseña:</label>
            <br>
            <input 
              :type="showPassword ? 'text' : 'password'"
              class="style-input-box" 
              v-model="formData.confirmPassword" 
              id="confirmPassword" 
              placeholder="Repita su contraseña"
              required
            />
            <br><br>
            <label>
              <input type="checkbox" v-model="showPassword"/> Mostrar contraseña
            </label>
          </div>
          <!-- reCAPTCHA -->
          <div class="recaptcha-box">
            <vue-recaptcha 
              v-show="showRecaptcha" 
              :sitekey="siteKey"
              size="normal" 
              theme="light"
              :loading-timeout="loadingTimeout"
              @verify="recaptchaVerified"
              @expire="recaptchaExpired"
              @fail="recaptchaFailed"
              @error="recaptchaError"
              ref="vueRecaptcha">
            </vue-recaptcha>
          </div>
          <!-- /reCAPTCHA -->
          <div class="input__box">
            <input class="boton" type="submit" value="Recuperar acceso"/>
          </div>
        </form>

      </div>
    </div>
  </div>
  <!-- /CambiarContraseña -->
</template>

<script>
import { mapActions } from "vuex";
import vueRecaptcha from 'vue3-recaptcha2';

export default {
  name: "resetPassword",
  components: {
    vueRecaptcha,
  },
  data() {
    return {
      showPassword: false,
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_\/@$!%*?&])[A-Za-z\d\-_\/@$!%*?&]/,
      formData: {
        token: '',
        password: '',
        confirmPassword: ''
      },
      recaptcha: '',
      showRecaptcha: false,
      loadingTimeout: 30000,
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
    };
  },
  computed: {
    token() {
      const token = this.$route.params.token;

      if (!token) {
        this.$router.push('/');
        return;
      }

      return token;
    }
  },
  mounted() {
    document.title = "PICTO - Restablecer Contraseña";
    this.ActiveNav();

    // Mostrar reCAPTCHA después de un breve retraso
    setTimeout(() => {
      this.showRecaptcha = true;
    }, 500);

    this.token;
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
    ...mapActions('user', ['PasswordReset']),

    recaptchaVerified(response) {
    },

    recaptchaExpired() {
      this.$refs.vueRecaptcha.reset();
    },

    recaptchaFailed() {
    },

    recaptchaError(reason) {
    },

    showAlert(title, text, icon, confirmButtonColor) {
      this.$swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: confirmButtonColor,
        confirmButtonText: "OK",
      });
    },

    handleResponse(response) {
      if (response.status == 200) {
        this.showAlert(
          "¡Contraseña restablecida!", 
          "Se te redirigirá a Login para iniciar sesión.", 
          "success", 
          "#1e9c96"
        );
        this.$router.push('/login/');
      } else {
        this.showAlert(
          "¡Error!", 
          "¡Ups! Ocurrió un inconveniente al restablecer la contraseña. \
          Revise que todos los campos sean correctos y que el token sea válido \
          y vigente.", 
          "error", 
          "#1e9c96"
        );
        return;
      }
    },

    handleError(error, message) {
      this.showAlert("¡Error!", message, "error", "#1e9c96");
      return;
    },

    passwordLengthValidator(password) {
      return [...password].length >= 8 && [...password].length <= 128;
    },

    passwordComplexityValidator(password) {
      const passwordRegex = this.regex;
      return passwordRegex.test(password);
    },

    onSubmitValidations(password, confirmPassword, recaptcha) {
      if (!password) {
        this.showAlert(
          "¡Error!", 
          "Debes proporcionar tu nueva contraseña.", 
          "error", 
          "#1e9c96"
        );
        return;
      }

      if (!this.passwordLengthValidator(password)) {
        this.showAlert(
          "¡Error!", 
          "La contraseña debe tener entre 8 y 128 caracteres.", 
          "error", 
          "#1e9c96"
        );
        return;
      }
      
      const passwordComplexityMessage = 'La contraseña debe tener, al menos:\
        1 letra mayúscula, 1 minúscula, 1 número y 1 símbolo.'

      if (!this.passwordComplexityValidator(password)) {
        this.showAlert(
          "¡Error!", 
          passwordComplexityMessage, 
          "error", 
          "#1e9c96"
        );
        return;
      }

      if (!confirmPassword) {
        this.showAlert(
          "¡Error!", 
          "Debes confirmar tu nueva contraseña.", 
          "error", 
          "#1e9c96"
        );
        return;
      }

      if (password !== confirmPassword) {
        this.showAlert(
          "¡Error!", 
          "Las contraseñas no coinciden. Revisa bien e intenta nuevamente.", 
          "error", 
          "#1e9c96"
        );
        return;
      }

      if (!recaptcha) {
        this.showAlert(
          "¡Error!", 
          "Debes resolver el reCAPTCHA para restablecer tu contraseña.", 
          "error", 
          "#1e9c96"
        );
        return;
      }
    },

    async onSubmit() {
      try {
        this.onSubmitValidations(
          this.formData.password,
          this.confirmPassword,
          this.recaptcha
        );

        const requestData = {
          token: this.token,
          password: this.formData.password,
        };

        this.PasswordReset(requestData).then((response) => {
          this.handleResponse(response)
        });
      } catch (error) {
        const msg = "¡Ups! Ocurrió un error inesperado. \
        Si el problema persiste, contáctanos."
        this.handleError(error, msg);
      }
    },
  },
  unmounted() {
    this.InactiveNav();
  },
}
</script>

<style scoped>
@media screen and (min-width: 1408px) {
  .container:not(.is-max-desktop):not(.is-max-widescreen) {
    max-width: fit-content;
  }
}

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

.container {
  z-index: 3;
  padding: 25px;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.form{
  text-align: center;
}

.input__box {
  margin-bottom: 25px;
}

.style-input-box {
  border-radius: 14px;
  box-shadow: 0px 0px 10px black;
  color: black;
  text-align: center;
  width: 300px;
  height: 35px;
  border: solid black 2px;
}

.boton {
  margin: 2rem 0 0 0;
  width: 250px;
  height: 40px;
  font-size: large;
  font-weight: bold;
  border-radius: 14px;
  box-shadow: 0px 0px 10px black;
  background-image: linear-gradient(
    to right,
    #84fab0 0%,
    #8fd3f4 51%,
    #84fab0 100%
  );
}

.boton:hover {
  background-position: right center;
  color: #006ead;
  border: 1px solid #006ead;
  transform: translate(0.3rem, 0.3rem);
  transition: all 0.3s ease-in-out;
}

h2 {
  color: black;
  font-size: xx-large;
  font-weight: bold;
}

p {
  font-size: 15px;
}

.titulo {
  display: inline-block;
  margin-bottom: 5px;
  font-size: medium;
  font-weight: bold;
  color: black;
}

.recaptcha-box {
  background-color: #f9f9f9;
  border: solid black 2px;
  box-shadow: 0px 0px 10px black;
}
</style>
