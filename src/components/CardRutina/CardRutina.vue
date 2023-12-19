<template>
  <div class="card has-background-link-light has-text-centered m-4">
    <router-link :to="`/rutina-activa/${rutina.id}/`" >
      <div class="card-image">
        <figure class="image 1by1">
          <img 
          v-if="rutina.url_portada !== null"
          :src="rutina.url_portada" />
          <img 
          v-else
          src="@/assets/Img/otros/rutinaDefault.jpg" />
        </figure>
      </div>
    </router-link>
    <div class="card-content has-text-centered ">
      <div class="card-tittle pb-1">{{ rutina.nombre }}</div>
      <div class="field has-addons has-addons-centered">
        <button @click="updateRutina" class="button is-small is-info mr-2">
          <span class="file-icon p-0 m-0">
            <EditSVG />
          </span>
        </button>
        <button @click="deleteRutina" class="button is-small is-danger">
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
  name: "CardRutina",
  components: {
    DeleteSVG,
    EditSVG,
  },
  props: {
    rutina: Object,
  },
  data() {
    return {
      url_base: import.meta.env.VITE_APP_BACKEND_API
    };
  },
  methods: {
    ...mapActions("pictogramaObj", [
      "SearchPictogramaObj",
      "DeletePictogramaObj",
    ]),
    ...mapActions("rutinas", ["get_rutinas"]),
    ...mapActions("rutina", ["SearchRutinaObj", "DeleteRutinaObj"]),

    updateRutina() {
      this.SearchRutinaObj(this.rutina.id).then(response => {
        if (!response) {
          const text = 'Parece que nos quedamos sin señal. \
          Revisa tu conexión y vuelve a intentarlo. \
          Si el problema persiste, contáctanos.'

          this.$swal.fire({
            title: '¡Ups!',
            text: text,
            icon: 'error',
          });
          return;

        } else if (response.status == 200) {
          this.$swal.fire({
            title: '¡Bien!',
            text: 'Rutina guardada correctamente.',
            icon: 'success',
          });
          return;

        } else {
          const text = 'Parece que no podemos encontrar esa rutina. \
          Si el problema persiste, contáctanos.';

          this.$swal.fire({
            title: '¡Ups!',
            text: text,
            icon: 'error',
          });
          return;
        }
      });
    },
    deleteRutina() {
      this.$swal
        .fire({
          title: `¿Eliminar "${this.rutina.nombre}"?`,
          text: "Esta Acción no se Puede Revertir",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#1e9c96",
          cancelButtonColor: "#ef2e55",
          confirmButtonText: "Si, eliminar",
        })
        .then((result) => {

          if (result.isConfirmed) {
            try {

              this.DeleteRutinaObj(this.rutina.id).then((response) => {

                if (response.status == 200) {
                  this.$swal.fire({
                    title: "¡Bien!",
                    text: "Rutina eliminada correctamente",
                    icon: "success",
                    confirmButtonColor: "#1e9c96",
                    confirmButtonText: "OK",
                  });
                  this.get_rutinas();
                } else {
                  const text = 'No se pudo guardar la rutina. \
                  Intenta nuevamente y disculpa las molestias. 🙏';

                  this.$swal.fire({
                    title: "¡Ups!",
                    text: text,
                    icon: "error",
                    confirmButtonColor: "#1e9c96",
                    confirmButtonText: "OK",
                  });
                }
              });
            } catch (error) {
              const text = 'Ocurrio un error inesperado. \
                Si el problema persiste, contáctanos.';

              this.$swal.fire({
                title: "¡Ups!",
                text: text,
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
