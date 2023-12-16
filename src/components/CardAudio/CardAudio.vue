<template>
  <!--card Audio-->
  <div class="card has-background-link-light m-4">
    <div class="card-content is-fullwidth">
      <div class="is-flex is-justify-content-center p-0 m-2">
        <audio class="is-fullwidth" controls>
          <source :src="audio.ruta" type="audio/mp3" />
        </audio>
      </div>
      <p class="card-header-title is-centered">{{ audio.nombre }}</p>
      <div class="buttons is-centered">
        <button @click="UpdateAudio" class="button is-small is-info" :disabled="audio.es_precargado && !isStaff">
          <span class="file-icon p-0 m-0">
            <EditSVG />
          </span>
        </button>
        <button @click="DeleteAudio" class="button is-small is-danger" :disabled="audio.es_precargado && !isStaff">
          <span class="file-icon p-0 m-0">
            <DeleteSVG />
          </span>
        </button>
      </div>
    </div>
  </div>
  <!--/card Audio-->
</template>



<script>
import { mapActions } from "vuex";

import DeleteSVG from "@/components/Icons/DeleteSVG/DeleteSVG.vue";
import EditSVG from "@/components/Icons/EditSVG/EditSVG.vue";

export default {
  name: "CardAudio",
  components: {
    DeleteSVG,
    EditSVG,
  },
  props: {
    audio: Object,
  },
  data() {
    return {
      url_base: import.meta.env.VITE_APP_BACKEND_API
    };
  },
  mounted() {
  },
  computed: {
    isStaff() {
      return this.$store.state.isStaff;
    },
  },
  methods: {
    ...mapActions("audioObj", ["SearchAudioObj", "DeleteAudioObj"]),
    ...mapActions("audios", ["get_audios"]),
    ...mapActions("modalAudio", ["changeOpenModalAudio"]),

    UpdateAudio() {
      this.SearchAudioObj(this.audio.id);
      this.changeOpenModalAudio();
    },
    DeleteAudio() {
      this.$swal
        .fire({
          title: `¿Eliminar "${this.audio.nombre}"?`,
          text: "Esta Acción no se Puede Revertir",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#1e9c96",
          cancelButtonColor: "#ef2e55",
          confirmButtonText: "Si, Eliminar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            try {
              this.DeleteAudioObj(this.audio.id).then((response) => {
                if (response.status == 200) {
                  this.$swal.fire({
                    title: "¡Eliminado!",
                    text: "Audio Eliminado Correctamente",
                    icon: "success",
                    confirmButtonColor: "#1e9c96",
                    confirmButtonText: "OK",
                  });
                  this.get_audios();
                } else {
                  this.$swal.fire({
                    title: "¡Error!",
                    text: "¡Ups! Ocurrio un Inconveniente ERROSILLO 1 CARD",
                    icon: "error",
                    confirmButtonColor: "#1e9c96",
                    confirmButtonText: "OK",
                  });
                }
              });
            } catch (error) {
              this.$swal.fire({
                title: "¡Error!",
                text: "¡Ups! Ocurrio un Inconveniente ERRORSILLO 2 CARD",
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
</style>
