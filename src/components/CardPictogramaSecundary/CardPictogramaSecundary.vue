<template>
  <!-- The background image -->
  <div class="card">
    <figure class="card__thumbnail">
      <img
        :src="pictograma.ruta"
        :id="pictograma.id"
        :name="pictograma.ruta"
      />
      <span class="card__title">{{ pictograma.nombre }}</span>
    </figure>
  </div>
  <!-- The background image -->
</template>



<script>
export default {
  name: "CardPictogramaSecundary",
  props: {
    pictograma: Object,
  },
  data() {
    return {
      url_base: import.meta.env.VITE_APP_BACKEND_API + "/",
    };
  },
  methods: {
      
  },
};
</script>



<style scoped>
.card {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.56s ease-in-out;
  min-width: 100%;
}
.card__thumbnail{
  min-width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card__title {
  display: flex;
  align-self: flex-end;
  padding: 0.5rem;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1;
  font-weight: 600;
  min-width: 100%;
  
}
</style>
