<template>
  <h2>Datos de uso de almacenamiento</h2>
  <hr>
  <p>Límite: {{ formatBytes(storageData.storage_limit) }} kilobytes</p>
  <p>Usado: {{ formatBytes(storageData.used_storage) }} kilobytes</p>
  <p :style="getRemainingStorageStyle()">
    Remaining Storage: {{ formatBytes(storageData.remaining_storage) }} kilobytes
  </p>
  <p v-if="showLowStorageMessage" style="color: red; font-weight: bold;">
    {{ lowStorageMessage }}
  </p>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axiosInstance from '@/services/axios';

export default {
  name: 'storageMonitor',
  data() {
    return {
      storageData: {
      },
    };
  },
  computed: {
    ...mapState("user", ["UserObj"]),

    userId() {
      return this.UserObj.id;
    },
    endpoint() {
      return `api/user-storage/${this.userId}/`
    },
    showLowStorageMessage() {
      const percentageUsed = (
        this.storageData.used_storage / this.storageData.storage_limit
      ) * 100;
      return percentageUsed >= 90;
    },
    lowStorageMessage() {
      const percentageRemaining = (
        this.storageData.remaining_storage / this.storageData.storage_limit
      ) * 100;
      if (percentageRemaining <= 0) {
        const msg = 'Ya no tienes espacio en tu cuenta. \
        \nConsidera eliminar tus pictogramas y sonidos que \
        no uses frecuentemente.';
        return msg;
      } else if (percentageRemaining <= 10) {
        const msg = 'Queda poco espacio. \
        \nConsidera reducir el peso de tus pictogramas y sonidos. \
        \nTe recomendamos usar archivos de extensión .jpg y .mp3, \
        respectivamente.';
        return msg;
      }
      return '';
    },
  },
  mounted() {
    this.fetchStorageData();
  },
  methods: {
    ...mapActions("storageMonitor", ["getStorageValues"]),

    async fetchStorageData() {
      try {
        const endpoint = this.endpoint;
        const response = await axiosInstance.get(endpoint);
        this.storageData = response.data;
        this.$store.commit('updateStorageData', this.storageData);

      } catch (error) {
        const msg = 'Error al solicitar los datos. \
          Si el problema persiste, contáctanos.';
        console.error(msg);
      }
    },
    formatBytes(bytes) {
      const kilobytes = Math.round((bytes / 1024) * 100) / 100;
      return kilobytes.toLocaleString('es-ES');
    },
    getRemainingStorageStyle() {
      const percentageRemaining = (
        this.storageData.remaining_storage / this.storageData.storage_limit
      ) * 100;
      if (percentageRemaining <= 10 || percentageRemaining === 0) {
        return { color: 'red', fontWeight: 'bold' };
      }
      return {};
    },
  }
};
</script>
