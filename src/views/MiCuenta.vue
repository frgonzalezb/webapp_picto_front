<template>
  <!-- MiCuenta -->
  <div class="mainContainer">
    <div class="content">
      <div class="container">
        <h2>Mi cuenta</h2>
        <div class="form">
          <form @submit.prevent="updateAccount">
            <div class="form-container">
              <div class="input__box">
                <label class="form-label" for="nombre">Nombre:</label>
                <br>
                <input 
                  class="style-input-box" 
                  type="text" 
                  v-model="formData.name" 
                  id="nombre" 
                  placeholder="Ingrese su nuevo nombre (opcional)" 
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
                  placeholder="Ingrese su nuevo email" 
                />
              </div>
              <div class="input__box">
                <label class="form-label" for="password">*Contraseña:</label>
                <br>
                <input
                  class="style-input-box" 
                  :type="showPassword ? 'text' : 'password'"
                  v-model="formData.password" 
                  id="password" 
                  placeholder="*Ingrese su contraseña actual"
                />
              </div>
              <div>
                <label>
                  <input 
                    type="checkbox" 
                    v-model="showPassword" 
                  /> Mostrar contraseña
                </label>
              </div>
              <br>
            </div>

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

            <div class="input__box">
              <input class="boton" type="submit" value="Modificar datos"/>
            </div>

            <span>* Campos requeridos</span>
          </form>
          <br>
          <form @submit.prevent="deactivateAccount">
            <div class="sign-out">
              <input 
                class="sign-out-button" 
                type="submit" 
                value="Quiero darme de baja" 
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- /MiCuenta -->
</template>

<script>
import { mapState, mapActions } from "vuex";
import vueRecaptcha from 'vue3-recaptcha2';

export default {
  name: "MiCuenta",
  components: {
    vueRecaptcha
  },
  data() {
    return {
      showPassword: false,
      formData: {
        id: '',
        email: '',
        password: '',
        confirmPassword: '',
        recaptcha: ''
      },
      showRecaptcha: false,
		  loadingTimeout: 30000,
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
    };
  },
  computed: {
    ...mapState('user', ['UserObj']),
  },
  watch: {
    UserObj: {
      handler: 'fetchUserData',
      deep: true,
    },
  },
  methods: {
    ...mapActions("navBar", ['ActiveNav', 'InactiveNav']),
    ...mapActions('user', [
      'cleanValue',
      'setId',
      'setName',
      'setEmail',
      'setIsStaff',
      'SearchUserObj',
      'UpdateUserObj',
      'DeactivateUserObj'
    ]),
    ...mapActions(['clearTokens']),

    fetchUserData() {
      try {
        this.formData.name = this.UserObj.name;
        this.formData.email = this.UserObj.email;
        
      } catch (error) {
        const console_msg = 'Error al solicitar los datos. \
          Si el problema persiste, contacte al administrador.';
        console.error(console_msg);

        const msg = 'Parece que tenemos un problema para recuperar tus datos. \
          Vuelve al dashboard y luego intenta nuevamente. \
          Si el problema persiste, contáctanos.'

        this.$swal.fire({
          title: '¡Ups!',
          text: msg,
          icon: 'error'
        });
        return;
      }
    },

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

    sameDataValidator(nameField, emailField) {
      const userName = this.UserObj.name;
      const userEmail = this.UserObj.email;

      if (nameField == userName && emailField == userEmail) {
        return true;
      } else {
        return false;
      }
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

    validateFormDataBeforeSubmit() {
      // Si no hay cambios, volver al dashboard
      if (this.sameDataValidator(this.formData.name, this.formData.email)) {
        this.$swal.fire({
          title: '¡Importante!',
          text: 'No se han registrado cambios. Volverás al dashboard.',
          icon: 'info'
        });
        return this.$router.push('/dashboard/');
      }

      // Si hay cambios, verificar si hay errores en el formulario
      if (!this.nameComplexityValidator(this.formData.name)) {
          this.$swal.fire({
            title: '¡Ups!',
            text: 'El nombre contiene caracteres no válidos.',
            icon: 'error'
          });
          return;
        }

      if (!this.nameLengthValidator(this.formData.name)) {
        this.$swal.fire({
          title: '¡Ups!',
          text: 'El nombre debe contener entre 2 y 50 caracteres.',
          icon: 'error'
        });
        return;
      }

      if (!this.formData.email) {
        this.$swal.fire({
          title: '¡Ups!',
          text: 'Debe proporcionar un email válido.',
          icon: 'error'
        });
        return;
      }

      if (!this.emailComplexityValidator(this.formData.email)) {
        this.$swal.fire({
          title: '¡Ups!',
          text: 'El email contiene caracteres no válidos.',
          icon: 'error'
        });
        return;
      }

      if (!this.formData.password) {
        this.$swal.fire({
          title: '¡Ups!',
          text: 'Debe ingresar su contraseña actual para guardar los cambios.',
          icon: 'error'
        });
        return;
      }

      // Verificar si reCAPTCHA se ha resuelto
      if (!this.formData.recaptcha) {
        this.$swal.fire({
          title: '¡Ups!',
          text: 'Debes resolver el reCAPTCHA para registrarte.',
          icon: 'error',
        });
        return;
      }
    },

    storeData(response) {
      const userId = response.data.id;
      const userName = response.data.name;
      const userEmail = response.data.email;
      const isStaff = response.data.is_staff;

      this.cleanValue();
      this.setId(userId);
      this.setName(userName);
      this.setEmail(userEmail);
      this.setIsStaff(isStaff);
    },

    getUserId() {
      if (this.UserObj.id) {
        this.formData.id = this.UserObj.id;
        return this.UserObj.id;
      } else {
        this.formData.id = this.$route.params.id;
        return this.$route.params.id;
      }
    },

    async updateAccount() {
      try {
        this.validateFormDataBeforeSubmit();
        this.getUserId();

        this.UpdateUserObj(this.formData).then((response) => {
          if (!response) {
            const msg = '¡Ups! Parece que nos quedamos sin señal. \
            Revisa tu conexión y vuelve a intentarlo. Si el problema persiste, \
            contáctanos a través de nuestro formulario de contacto.'
            
            this.$swal.fire({
              title: '¡Ups!',
              text: msg,
              icon: 'error',
            });
            return;

          } else if (response.status === 200) {
            this.storeData(response);

            this.$swal.fire({
              title: '¡Datos actualizados!',
              text: 'Tus datos han sido actualizados exitosamente.',
              icon: 'success',
            });

            this.$router.push('/dashboard/');

          } else {
            const msg = 'Parece que hubo un error. Revisa que los campos \
              estén adecuadamente completados e intenta nuevamente.';
            
            this.$swal.fire({
              title: '¡Ups!',
              text: msg,
              icon: 'error',
            });
            return;
          }
        });    

        this.$router.push('/dashboard/');
      
      } catch (error) {
        const msg = 'Parece que hubo un error inesperado. \
          Si el problema persiste, contáctanos. \
          Disculpa las molestias. 🙏';

        this.$swal.fire({
          title: '¡Ups!',
          text: msg,
          icon: 'error'
        });
      }
    },

    // Darse de baja
    async deactivateAccount() {
      try {
        const alertMessage = `
          Esta es una acción <b><u>irreversible</u></b>.
          <br>
          Tu cuenta y todo su contenido (pictogramas, sonidos y 
          rutinas) serán completamente <u>eliminados</u> del sistema dentro
          de 30 días.
        `
        const goodbyeMessage = `
            Tu cuenta ha sido desactivada exitosamente.
            <br>
            Si deseas volver a usar PICTO, deberás <b>registrarte</b> nuevamente.
          `

        this.$swal.fire({
          title: "¿Realmente deseas proceder?",
          html: alertMessage,
          text: "",
          icon: "warning",
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, dame de baja"
        }).then((result) => {
          if (result.isConfirmed) {
            // Realizar la eliminación del usuario
            try {
              const userId = this.getUserId();

              this.DeactivateUserObj(userId).then((response) => {
                if (response.status == 200) {
                  this.$swal.fire({
                    title: "Cuenta desactivada",
                    html: goodbyeMessage,
                    icon: "success"
                  });
                  this.clearTokens();
                  this.$router.push('/');

                } else {
                  const msg = `No se pudo desactivar tu cuenta.
                    Si el problema persiste, contáctanos.
                    Disculpa las molestias. 🙏`;

                  this.$swal.fire({
                    title: "¡Error!",
                    text: msg,
                    icon: "error"
                  });
                }
              });
            } catch (error) {
              const msg = `Ha ocurrido un error inesperado.
                Si el problema persiste, contáctanos.
                Disculpa las molestias. 🙏`;

              this.$swal.fire({
                title: '¡Error!',
                text: msg,
                icon: 'error'
              });
            }
          } else {
            const msg = `No se pudo desactivar tu cuenta.
              Contáctanos si no puedes hacerlo nuevamente o
              si tienes problemas tras este suceso.
              Disculpa las molestias. 🙏`;

            this.$swal.fire({
              title: "¡Error!",
              text: msg,
              icon: "error"
            });
          }
        });
      } catch (error) {
        const msg = `Ha ocurrido un error inesperado.
          Si el problema persiste, contáctanos.
          Disculpa las molestias. 🙏`;

        this.$swal.fire({
          title: '¡Error!',
          text: msg,
          icon: 'error'
        });
      }
    }
  },
  mounted() {
    document.title = "PICTO - Mi Cuenta";
    this.ActiveNav();
    this.fetchUserData();

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

.mainContainer {
  min-width: 100%;
  margin: 0px;
}

.content {
  z-index: 3;
  position: absolute;
  min-width: 100%;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: fit-content;
  margin-top: 25px;
  padding: 25px;
  border-radius: 28px;
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

.sign-out-button {
  border: none;
  color: crimson;
  cursor: pointer;
  background: none;
  padding: 0;
  font: inherit;
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
</style>
