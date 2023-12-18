<template>
<!-- Registro -->
<div class="content">
  <div class="container">
    <h2>Registro</h2>
    <div class="form">
      <form @submit.prevent="register">
        <div class="input-container">

          <div class="left-column">
            <div class="input__box">
              <label class="form-label" for="nombre">Nombre:</label>
              <br>
              <input 
                class="style-input-box" 
                type="text" 
                v-model="formData.name" 
                id="nombre" 
                placeholder="Ingrese su nombre (opcional)" 
              />
            </div>
            <div class="input__box">
              <label class="form-label" for="email">*Email:</label>
              <br>
              <input 
                class="style-input-box" 
                type="email" 
                v-model="formData.email" 
                id="email" 
                placeholder="*Ingrese su email" 
                required
              />
            </div>
          </div>
          
          <div class="right-column">
            <div class="input__box">
              <label class="form-label" for="password">*Contraseña:</label>
              <br>
              <input
                class="style-input-box" 
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password" 
                id="password" 
                placeholder="*Ingrese su contraseña"
                required
              />
            </div>
            <div class="input__box">
              <label 
                class="form-label" 
                for="confirmPassword"
              >
              *Repita su contraseña:
              </label>
              <br>
              <input 
                class="style-input-box" 
                :type="showPassword ? 'text' : 'password'"
                v-model="confirmPassword" 
                id="confirmPassword" 
                placeholder="*Repita su contraseña"
                required
              />
            </div>
          </div>
          
          <div>
            <label>
              <input 
                type="checkbox" 
                v-model="showPassword" 
              /> Mostrar contraseña
            </label>
          </div>
        </div>

        <br>
        
        <!-- reCAPTCHA -->
        <div class="recaptcha">
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

        <br><br>

        <div>
          <label>
            <input 
              id="Terms"
              type="checkbox" 
              v-model="acceptTerms" 
              required
            /> Acepto los 
            <a
              href="#"
              @click="showTerms"
            >
            términos y condiciones
            </a>de servicio.
          </label>
        </div>
        
        <div class="input__box">
          <input class="boton" type="submit" value="Registrarse"/>
        </div>
        <span>* Campos requeridos</span>

      </form>
    </div>
  </div>
</div>
<!-- /Registro -->
</template>

<script>
import { mapActions } from "vuex";
import vueRecaptcha from 'vue3-recaptcha2';
import axiosInstance from "@/services/axios";

export default {
  name: "registro",
  components: {
    vueRecaptcha,
  },
  data() {
    return {
      showPassword: false,
      acceptTerms: false,
      termsEndpoint: '/api/terms-and-conditions/',
      formData: {
        name: '',
        email: '',
        password: '',
        recaptcha: ''
      },
      confirmPassword: '',
      showRecaptcha: false,
		  loadingTimeout: 30000,
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
    };
  },
  mounted() {
    document.title = "PICTO - Registrarse";
    this.ActiveNav();

    // Mostrar reCAPTCHA después de un breve retraso
    setTimeout(() => {
      this.showRecaptcha = true;
    }, 500);
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
    ...mapActions("user", ["CreateUserObj"]),

    recaptchaVerified(response) {
      if (!response) {
        this.$swal.fire({
          title: '¡Error!',
          text: 'Hubo un error con reCAPTCHA. Intenta nuevamente.',
          icon: 'error'
        });
        return;
      }
      this.formData.recaptcha = response;
      return response;
    },

    recaptchaExpired() {
      this.$refs.vueRecaptcha.reset();
      this.formData.recaptcha = '';
    },

    recaptchaFailed() {
      this.formData.recaptcha = '';
    },

    recaptchaError(reason) {
      this.formData.recaptcha = '';
    },

    nameComplexityValidator(input) {
      if (!input.trim()) {
        return true;
      }

      const inputRegex = /^[a-zA-Z]*$/;
      return inputRegex.test(input);
    },

    nameLengthValidator(input) {
      if (!input.trim()) {
        return true;
      }

      const minLength = 2;
      const maxLength = 50;

      const trimmedInput = input.trim();
      const inputLength = trimmedInput.length;

      return inputLength >= minLength && inputLength <= maxLength;
    },

    emailComplexityValidator(email) {
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      return emailRegex.test(email);
    },

    passwordLengthValidator(password) {
      return [...password].length >= 8 && [...password].length <= 128;
    },

    passwordComplexityValidator(password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_\/@$!%*?&])[A-Za-z\d\-_\/@$!%*?&]/;;
      return passwordRegex.test(password);
    },

    async showTerms() {
      const response = await axiosInstance.get(this.termsEndpoint);
      const termsText = response.data;
      const termsHtml = `<div style="max-height: 300px; overflow-y: auto; \
        white-space: pre-line;">${termsText}</div>`

      this.$swal.fire({
        title: 'Términos y Condiciones',
        html: termsHtml,
        icon: 'info'
      });
      return;
    },

    async register() {
      try {
        // Comprobar errores en el formulario
        if (!this.nameComplexityValidator(this.formData.name)) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'El nombre contiene caracteres no válidos.',
            icon: 'error'
          });
          return;
        }

        if (!this.nameLengthValidator(this.formData.name)) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'El nombre debe contener entre 2 y 50 caracteres.',
            icon: 'error'
          });
          return;
        }

        if (!this.formData.email) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'Debes proporcionar un email válido.',
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

        if (!this.formData.password) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'Debes proporcionar una contraseña.',
            icon: 'error'
          });
          return;
        }

        if (!this.passwordLengthValidator(this.formData.password)) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'La contraseña debe tener entre 8 y 128 caracteres.',
            icon: 'error'
          });
          return;
        }
        
        const passwordComplexityMessage = 'La contraseña debe tener, al menos:\
          1 letra mayúscula, 1 minúscula, 1 número y 1 símbolo.'

        if (!this.passwordComplexityValidator(this.formData.password)) {
          this.$swal.fire({
            title: '¡Error!',
            text: passwordComplexityMessage,
            icon: 'error'
          });
          return;
        }

        if (this.formData.password !== this.confirmPassword) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'Las contraseñas no coinciden.',
            icon: 'error'
          });
          return;
        }

        // Verificar si reCAPTCHA se ha resuelto
        if (!this.formData.recaptcha) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'Debes resolver el reCAPTCHA para registrarte.',
            icon: 'error',
          });
          return;
        }

        if (!this.acceptTerms) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'Debes aceptar los términos y condiciones para registrarte.',
            icon: 'error',
          });
          return;
        }

        // Efectuar el registro de usuario
        this.CreateUserObj(this.formData).then((response) => {
          if (!response) {
            const msg = '¡Ups! Parece que tenemos algunos problemas internos. \
            Intenta en un rato más y disculpa las molestias. 😔🙏'
            this.$swal.fire({
              title: '¡Error!',
              text: msg,
              icon: 'error',
            });
            return;

          } else if (response.status === 201) {
            this.$router.push('/login/');
            this.$swal.fire({
              title: '¡Registro casi terminado!',
              text: 'Hemos enviado un email para que actives tu cuenta.',
              icon: 'success',
            });
          } else if (response.status === 400) {
            this.$swal.fire({
              title: '¡Error!',
              text: 'El correo ingresado ya tiene una cuenta en PICTO.',
              icon: 'error',
            });
          } else {
            this.$swal.fire({
              title: '¡Error!',
              text: 'Hubo un error en la solicitud. Intente nuevamente.',
              icon: 'error',
            });
            return;
          }
        });
      
      } catch (error) {
        this.$swal.fire({
          title: '¡Error!',
          text: 'Ha ocurrido un error inesperado.',
          icon: 'error'
        });
      }
    },
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
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.form {
  text-align: center !important;
}

.form-label {
  display: inline-block;
  margin-bottom: 5px;
  font-size: medium;
  font-weight: bold;
  color: black;
}

.recaptcha {
  display: inline-block;
  background-color: #f9f9f9;
  border: solid black 2px;
  box-shadow: 0px 0px 10px black;
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

.input-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.left-column,
.right-column {
  width: 50%; /* Ajusta según tus necesidades */
}
</style>
