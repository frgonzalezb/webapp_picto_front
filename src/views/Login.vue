<template>
  <!-- Login -->
  <div class="content">
    <div class="container">
      <h2>Iniciar sesión</h2>
      <br><br>
      <div class="form">
        <form @submit.prevent="onSubmit">
          <div class="input__box">
            <label class="form-label" for="email">Email:</label>
            <br>
            <input 
            id="email"  
            class="style-input-box" 
              type="email" 
              placeholder="Ingrese su email" 
              v-model="LoginForm.email"
            />
          </div>
          <div class="input__box">
            <label class="form-label" for="password">Contraseña:</label>
            <br>
            <input 
              id="password"
              class="style-input-box" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Ingrese su contraseña" 
              v-model="LoginForm.password"
            />
            <br>
            <br>
            <label>
              <input 
                type="checkbox" 
                v-model="showPassword"
              /> 
              Mostrar contraseña
            </label>
          </div>
          <div class="input__box">
            <input class="boton" type="submit" value="Ingresar"/>
          </div>
          <p class="forget">
            ¿Olvidó su contraseña? 
            <a class="link" href="/recuperar-acceso/">Clic aquí</a>
          </p>
          <p class="forget">
            ¿No posee un cuenta? 
            <a class="link" href="/registro/"><b>¡Registrarse!</b></a>
          </p>
        </form>
      </div>
    </div>
  </div>
  <!-- /Login -->
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "login",
  components: {},
  data() {
    return {
      submitted: false,
      showPassword: false,
      LoginForm: {
        email: '',
        password: '',
      }
    };
  },
  computed: {
    ...mapState("user", ["UserObj"]),

    userEmail() {
      return this.UserObj.email;
    },

    isAuthenticated() {
      return this.UserObj.isAuthenticated;
    },
  },
  mounted() {
    document.title = "PICTO - Iniciar sesión";
    this.ActiveNav();
  },
  methods: {
    ...mapActions(['authenticate', 'saveTokens']),
    ...mapActions('navBar', ['ActiveNav', 'InactiveNav']),
    ...mapActions('user', [
      'cleanValue',
      'setId',
      'setName',
      'setEmail',
      'setIsStaff',
      'setIsAuthenticated',
      'SearchUserObj',
    ]),

    validateFormDataBeforeSubmit() {
      // Validación elemental del formulario
      if (!this.LoginForm.email) {
        this.$swal.fire({
          title: '¡Error!',
          text: 'Debes proporcionar tu email de cuenta.',
          icon: 'error'
        });
        return;
      }

      if (!this.LoginForm.password) {
        this.$swal.fire({
          title: '¡Error!',
          text: 'Debes proporcionar tu contraseña.',
          icon: 'error'
        });
        return;
      }
    },

    validateUserIsNotAuthenticated() {
      if ((this.LoginForm.email == this.userEmail) && this.isAuthenticated) {
        this.$swal.fire({
          title: '¡Error!',
          text: 'Este usuario ya está autenticado.',
          icon: 'error'
        });
        return;
      }
    },

    storeData(response) {
      const accessToken = response.data.token;
      const refreshToken = response.data.refresh_token;
      const userId = response.data.user.id;
      const userName = response.data.user.name;
      const userEmail = response.data.user.email;
      const isStaff = response.data.user.is_staff;
      const isAuthenticated = true
      
      this.cleanValue();

      this.setId(userId);
      this.setName(userName);
      this.setEmail(userEmail);
      this.setIsStaff(isStaff);
      this.setIsAuthenticated(isAuthenticated);

      this.$store.dispatch('user/storeUserObjInSessionStorage');
      this.$store.dispatch('saveTokens', { accessToken, refreshToken });
    },

    async onSubmit() {
      try {
        this.validateFormDataBeforeSubmit();
        this.validateUserIsNotAuthenticated();
        
        this.authenticate(this.LoginForm).then((response) => {
          const footer = 'Psst: Si te has registrado hace un momento,\
            recuerda que debes activar tu cuenta. 😉'

          if (!response) {
            const msg = 'Parece que nos quedamos sin señal. \
            Revisa tu conexión y vuelve a intentarlo. Si el problema persiste, \
            contáctanos a través de nuestra sección Contacto.'
            this.$swal.fire({
              title: '¡Ups!',
              text: msg,
              icon: 'error',
            });
            return;
          } else if (response.status == 401) {
            this.$swal.fire({
              title: '¡Error!',
              text: 'Credenciales no válidas o cuenta desactivada.',
              icon: 'error',
              footer: footer
            });
            return;

          } else {
            this.storeData(response);
            this.$router.push('/dashboard/');
          }
        });

      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$swal.fire({
            title: '¡Error!',
            text: 'Credenciales inválidas.',
            icon: 'error',
          });
        } else {
          this.$swal.fire({
            title: '¡Error!',
            text: 'Ha ocurrido un error inesperado.',
            icon: 'error',
          });
  }

      }
    }
  },
  unmounted() {
    this.InactiveNav();
  },
};
</script>


<!-- style -->
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
  text-align: center;
}

.form-label {
  display: inline-block;
  margin-bottom: 5px;
  font-size: medium;
  font-weight: bold;
  color: black;
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

.link:hover {
  color: white;
}
</style>
