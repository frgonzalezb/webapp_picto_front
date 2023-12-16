<template>
  <!-- ContactForm -->
  <div class="content">
    <div class="container">
      <h2>Contacto</h2>
      <div class="form">
        <form @submit.prevent="submitForm">
          <div class="input-container">
            <div class="left-column">
              <div class="input__box">
                <label class="form-label" for="nombre">*Nombre:</label>
                <br>
                <input 
                  class="style-input-box" 
                  v-model="formData.nombre" 
                  type="text" 
                  id="nombre" 
                  placeholder="Ingrese su nombre" 
                  required 
                />
              </div>
              
              <div class="input__box">
                <label class="form-label" for="email">*Email:</label>
                <br>
                <input 
                  class="style-input-box" 
                  v-model="formData.email" 
                  type="email" 
                  id="email" 
                  placeholder="Ingrese su email" 
                  required 
                />
              </div>

              <div class="input__box">
                <label class="form-label" for="asunto">*Asunto:</label>
                <br>
                <input 
                  class="style-input-box" 
                  v-model="formData.asunto" 
                  type="text" 
                  id="asunto" 
                  placeholder="Ingrese el asunto de su mensaje" 
                  required
                  @input="updateCounter('asunto')" 
                />
                <br>
                <span>
                  Caracteres: {{ counters.asunto.current }}/{{ counters.asunto.max }}
                </span>
              </div>
            </div>

            <div class="right-column">
              <div class="input__box">
                <label class="form-label" for="mensaje">*Mensaje:</label>
                <br>
                <textarea 
                  class="style-input-box-textarea" 
                  v-model="formData.mensaje" 
                  id="mensaje" 
                  required
                  @input="updateCounter('mensaje')"
                />
                <br>
                <span>
                  Caracteres: {{ counters.mensaje.current }}/{{ counters.mensaje.max }}
                </span>
              </div>
            </div>
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

          <br>

          <div class="input__box">
            <input class="boton" type="submit" value="Enviar"/>
          </div>

          <span>* Campos requeridos</span>
          
        </form>
      </div>
    </div>
  </div>
  <!-- /ContactForm -->
</template>

<script>
import { mapActions } from "vuex";
import vueRecaptcha from 'vue3-recaptcha2';
import AxiosInstance from '@/services/axios.js';

export default {
  name: "ContactForm",
  components: {
    vueRecaptcha,
  },
  data() {
    return {
      formData: {
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      },
      counters: {
        asunto: { current: 0, max: 50 },
        mensaje: { current: 0, max: 500 },
      },
      endpoint: '/api/contact/',
      showRecaptcha: false,
		  loadingTimeout: 30000,
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
    };
  },
  mounted() {
    document.title = "PICTO - Formulario de contacto";
    this.ActiveNav();

    // Mostrar reCAPTCHA después de un breve retraso
    setTimeout(() => {
      this.showRecaptcha = true;
    }, 500);
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),

    updateCounter(field) {
      const currentLength = this.formData[field].length;
      const maxLength = this.counters[field].max;

      if (currentLength > maxLength) {
        // Recortar la cadena si excede el límite
        this.formData[field] = this.formData[field].substring(0, maxLength);
      } else {
        this.counters[field].current = currentLength;
      }
    },

    resetCounters() {
      for (const field in this.counters) {
        this.counters[field].current = 0;
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

    resetForm(formData) {
      formData = {
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      };
    },

    async submitForm() {
      await AxiosInstance.post(this.endpoint, this.formData)
        .then(response => {
          if (!response) {
            const msg = 'Parece que nos quedamos sin señal. \
            Revisa tu conexión y vuelve a intentarlo. Si el problema persiste, \
            contáctanos a través de nuestras redes sociales.'

            this.$swal.fire({
              title: '¡Ups!',
              text: msg,
              icon: 'error',
            });
            this.resetCounters();
            this.$router.push('/');
            return;

          } else if (response.status == 200) {
            this.$swal.fire({
              title: '¡Mensaje enviado!',
              text: 'Nuestro equipo revisará tu mensaje prontamente.',
              icon: 'success',
            });
            this.resetCounters();
            this.$router.push('/');
            return;

          } else {
            const msg = 'Parece que hubo un error. Revisa que los campos \
            estén adecuadamente completados e intenta nuevamente.';

            this.$swal.fire({
              title: '¡Ups!',
              text: msg,
              icon: 'error',
            });
          }
        })
        .catch(error => {
          const msg = 'Parece que hubo un error inesperado. \
            Si el problema persiste, contáctanos. \
            Disculpa las molestias. 🙏';

          this.$swal.fire({
            title: '¡Ups!',
            text: msg,
            icon: 'error',
          });
        });

      this.resetForm(this.formData);
    },
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
  margin: 1rem 0 0.5rem 0;
  font-size: medium;
  font-weight: bold;
  color: black;
}

.recaptcha {
  display: inline-block;
  background-color: #f9f9f9;
  border: solid black 2px;
  box-shadow: 0px 0px 10px black;
  margin: 1rem 0 1rem 0;
}

.input__box {
  text-align: center;
}

.style-input-box {
  border-radius: 14px;
  box-shadow: 0px 0px 10px 0 black;
  color: black;
  text-align: center;
  width: 100%;
  height: 35px;
  border: solid black 2px;
}

.style-input-box-textarea {
  border-radius: 14px;
  box-shadow: 0px 0px 10px 0 black;
  color: black;
  text-align: left;
  width: 100%;
  height: 15em;
  border: solid black 2px;
  padding: 10px 10px 10px 10px;
}

.boton {
  margin: 1rem 0 1rem 0;
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

span {
  margin-top: 1rem;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 50vw;
}

.left-column,
.right-column {
  width: 48%; /* Ajusta según tus necesidades */
}
</style>
