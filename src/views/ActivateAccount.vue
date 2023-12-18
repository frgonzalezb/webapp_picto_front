<template>
  <div>
    <p></p>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import axiosInstance from '@/services/axios';

export default {
  data() {
    return {
      activationToken: '',
    };
  },
  mounted() {
    this.ActiveNav();
    this.activationToken = this.$route.query.token;
    this.activateAccount();
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),

    async activateAccount() {
      await axiosInstance.get(`/api/activate/${this.activationToken}/`)
        .then(response => {
          this.showSuccessAlert();
          this.$router.push('/login/');
        })
        .catch(error => {
          this.showErrorAlert();
          this.$router.push('/');
        });
    },
    showSuccessAlert() {
      this.$swal({
        title: 'Activación exitosa',
        text: 'Ahora puedes ingresar con tus credenciales.',
        icon: 'success',
      });
    },
    showErrorAlert() {
      const msg = 'Parece que hubo un error inesperado. Intenta nuevamente. \
        Si el problema persiste, contáctanos. Disculpa las moslestias. 🙏'
        
      this.$swal({
        title: 'Activación fallida',
        text: msg,
        icon: 'error',
      });
    },
  },
  unmounted() {
    this.InactiveNav();
  },
};
</script>
