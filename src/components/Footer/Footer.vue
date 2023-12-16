<template>
  <footer class="footer">
    <div class="footer-content">
      <span class="footer-item">
        Desarrollado con 💖 por Tecnologías Adaptativas Para la Inclusión (TAPI) 
        <br>
        Un proyecto del CITT Duoc UC, sede San Andrés de Concepción | {{ currentYear }}
      </span>
      <InstagramIcon />
    </div>
  </footer>
</template>

<script>
import InstagramIcon from '@/components/Socials/InstagramIcon.vue';

export default {
  name: "PictoFooter",
  components: {
    InstagramIcon,
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style scoped>
.footer {
  background: linear-gradient(to right, #3fada8, #808080);
  min-width: 100vw;
  position: absolute;
  bottom: -30vh;
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  z-index: 3;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;
}

.footer-item {
  color: white;
  font-size: 1rem;
  text-align: center;
  margin: 1rem 0 0 0;
  padding: 2rem;
}
</style>
