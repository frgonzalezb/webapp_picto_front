<template>
  <div class="card has-background-link-light has-text-centered m-4">
    <div class="card-image">
      <figure class="image 1by1">
        <img :src="pictograma.ruta" />
      </figure>
    </div>

    <div class="card-content has-text-centered ">
      <div class="card-tittle pb-1">{{ pictograma.nombre }}</div>
      <div class="field has-addons has-addons-centered">

        <!-- Botón de Editar -->
        <button @click="updatePictograma" class="button is-small is-info mr-2" :disabled="pictograma.es_precargado && !isStaff">
          <span class="file-icon p-0 m-0">
            <EditSVG />
          </span>
        </button>

        <!-- Botón de Eliminar -->
        <button @click="deletePictograma" class="button is-small is-danger" :disabled="pictograma.es_precargado && !isStaff">
          <span class="file-icon p-0 m-0">
            <DeleteSVG />
          </span>
        </button>
      
      </div>
    </div>
  </div>
</template>



<script>
import { mapActions } from "vuex";

import DeleteSVG from "@/components/Icons/DeleteSVG/DeleteSVG.vue";
import EditSVG from "@/components/Icons/EditSVG/EditSVG.vue";

export default {
  name: "CardPictogramaPrimary",
  components: {
    DeleteSVG,
    EditSVG
  },
  props: {
    pictograma: Object,
  },
  data() {
    return {
      url_base: import.meta.env.VITE_APP_BACKEND_API,
    };
  },
  computed: {
    isStaff() {
      return this.$store.state.isStaff;
    },
  },
  mounted() { },
  methods: {
    ...mapActions("pictogramaObj", [
      "SearchPictogramaObj",
      "DeletePictogramaObj",
    ]),
    ...mapActions("pictogramas", ["get_pictogramas"]),
    ...mapActions("pictogramaObj", ["DeletePictogramaObj"]),
    ...mapActions("modalPictograma", ["changeOpenModalPictograma"]),

    updatePictograma() {
      this.SearchPictogramaObj(this.pictograma.id);
      this.changeOpenModalPictograma();
    },
    
    deletePictograma() {
      this.$swal
        .fire({
          title: `¿Eliminar "${this.pictograma.nombre}"?`,
          text: "NOTA: Esta acción no se puede revertir",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#1e9c96",
          confirmButtonText: "Sí, eliminar",
          cancelButtonColor: "#ef2e55",
        })
        .then((result) => {

          if (result.isConfirmed) {
            try {
              this.DeletePictogramaObj(this.pictograma.id).then((response) => {

                if (response.status == 200) {
                  this.$swal.fire({
                    title: "¡Eliminado!",
                    text: "Pictograma Eliminado Correctamente",
                    icon: "success",
                    confirmButtonColor: "#1e9c96",
                    confirmButtonText: "OK",
                  });
                  this.get_pictogramas();
                } else {
                  this.$swal.fire({
                    title: "¡Error!",
                    text: "¡Ups! Ocurrio un Inconveniente ERRORSILLO BORRAR",
                    icon: "error",
                    confirmButtonColor: "#1e9c96",
                    confirmButtonText: "OK",
                  });
                }
              });
            } catch (error) {
              this.$swal.fire({
                title: "¡Error!",
                text: "¡Ups! Ocurrio un Inconveniente CATCH BORRAR",
                icon: "error",
                confirmButtonColor: "#1e9c96",
                confirmButtonText: "OK",
              });
            }
          }
        });
    },
  },
};
</script>



<style scoped>
.is-info {
  background: #3fada8;
  color: white;
}

.is-info:hover {
  background: #52c7b3;
}

.is-danger:hover {
  background: #a10d0d;
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.image {
  min-height: 300px;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-content {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0px 0px 10px 0;
}

.card:hover {
  box-shadow: 0px 20px 40px rgb(0, 248, 165);
  transform: scale(1.05, 1.05);
}

/* /card */
</style>
