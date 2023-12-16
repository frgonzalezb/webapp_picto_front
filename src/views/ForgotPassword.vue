<template>
  <!-- RecuperarContraseña -->
  <div class="content">
    <div class="container">
      <h2>¿Olvidó su contraseña?</h2>
      <br><br>
      <div class="form">
        <form @submit.prevent="onSubmit">
          <div class="input__box">
            <label 
              class="titulo" 
              for="recovery-email"
            >
              Ingrese el email asociado a su cuenta:
            </label>
            <br>
            <input 
              type="email" 
              class="style-input-box" 
              v-model="formData.email" 
              name="email-field" 
              id="recovery-email" 
              placeholder="Email" 
              required
            />
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
          <br>
          <div class="input__box">
            <button class="boton">Enviar</button>
          </div>
        </form>

      </div>
    </div>
  </div>
  <!-- /RecuperarContraseña -->
</template>

<script>
import { mapActions } from "vuex";
import { required, helpers } from "@vuelidate/validators";
import vueRecaptcha from 'vue3-recaptcha2';

export default {
  name: "forgotPassword",
  components: {
    vueRecaptcha,
  },
  data() {
    return {
      formData: {
        email: "",
      },
      errorMessage: "",
      successMessage: "",
      showRecaptcha: false,
		  loadingTimeout: 30000,
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
    };
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
    ...mapActions('user', ['ForgotPass']),

    recaptchaVerified(response) {
    },

    recaptchaExpired() {
      this.$refs.vueRecaptcha.reset();
    },

    recaptchaFailed() {
    },

    recaptchaError(reason) {
    },

    emailComplexityValidator(email) {
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      return emailRegex.test(email);
    },

    validateFormDataBeforeSubmit() {
      if (!this.formData.email) {
        this.$swal.fire({
          title: '¡Error!',
          text: 'Debe proporcionar un email válido.',
          icon: 'error'
        });
        return;
      }

      if (!this.emailComplexityValidator(this.formData.email)) {
        this.$swal.fire({
          title: '¡Error!',
          text: 'El email contiene caracteres no válidos.',
          icon: 'error'
        });
        return;
      }
    },

    async onSubmit() {
      try {
        this.validateFormDataBeforeSubmit();

        this.ForgotPass(this.formData.email).then((response) => {
          if (response.status == 200) {
            this.$swal.fire({
              title: '¡Mensaje enviado!',
              text: 'Revisa tu correo y sigue las instrucciones detalladas.',
              icon: 'success',
            });
            this.$router.push('/');

          } else {
            this.$swal.fire({
              title: '¡Ups!',
              text: 'Parece que no existe una cuenta con ese email.',
              icon: 'error',
            });
          }
        });
      } catch (error) {
        const msg = 'Parece que hubo un error inesperado. \
          Si el problema persiste, contáctanos. \
          Disculpa las molestias. 🙏';
        
        this.$swal.fire({
          title: '¡Ups!',
          text: msg,
          icon: 'error',
        });
      }
    },
  },
  validations() {
    return {
      formData: {
        email: {
          required: helpers.withMessage(
            "Se requiere su email para recuperar acceso.",
            required
          ),
        },
      },
    };
  },
  mounted() {
    document.title = "PICTO - ¿Olvidó su contraseña?";
    this.ActiveNav();

    // Mostrar reCAPTCHA después de un breve retraso
    setTimeout(() => {
      this.showRecaptcha = true;
    }, 500);
  },
  unmounted() {
    this.InactiveNav();
  },
};
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

.recaptcha-box {
  background-color: #f9f9f9;
  border: solid black 2px;
  box-shadow: 0px 0px 10px black;
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
  width: 150px;
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
  margin-bottom: 10px;
  font-size: medium;
  font-weight: bold;
  color: black;
}
</style>
