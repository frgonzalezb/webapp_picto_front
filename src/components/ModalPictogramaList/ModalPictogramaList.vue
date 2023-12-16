<template>
  <div class="modalPictos modal is-active">
    <div @click="CloseAllModal" class="bgList modal-background"></div>
    <div class="mainModal modal-content">
      <header class="modal-card-head has-text-centered">
        <p class="modal-card-title">Selección de Portada</p>
      </header>
      <SearchSecondary
        :SearchFunction="searchPictograma"
        placeHolder="Buscar Pictograma"
      />
      <article class="modal-card-body">
        <div class="media-content">
          <div class="content">
            <div class="list columns is-gapless is-centered is-multiline is-1">
              <ItemModalPictogramaList
                v-for="(pictograma, index) in PictogramaFilter"
                :key="index"
                :pictograma="pictograma"
              />
            </div>
          </div>
        </div>
      </article>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button @click="CloseModalList" class="button is-primary">
            Aceptar
          </button>
          <button @click="CloseModalListCancelar" class="button is-danger">
            Cancelar
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>



<script>
import { mapState, mapActions } from "vuex";
import ItemModalPictogramaList from "@/components/ItemModalPictogramaList/ItemModalPictogramaList.vue";
import SearchSecondary from "@/components/SearchSecondary/SearchSecondary.vue";

export default {
  name: "ModalPictogramaList",
  components: {
    ItemModalPictogramaList,
    SearchSecondary,
  },
  computed: {
    ...mapState("pictogramas", ["PictogramaFilter"]),
    ...mapState("rutina", ["RutinaObj"]),
  },
  methods: {
    ...mapActions("pictogramas", ["get_pictogramas", "search_pictograma"]),
    ...mapActions("ModalRutina", ["CloseModalRutina"]),
    ...mapActions("ModalPictogramaList", ["CloseModal"]),
    ...mapActions("rutina", ["SelectPictogramaUrl", "showPhoto"]),

    searchPictograma(value) {
      this.search_pictograma(value);
    },

    CloseModalList() {
      this.get_pictogramas();
      this.CloseModal();
    },
    CloseModalListCancelar() {
      if (!this.RutinaObj.id) {
        this.showPhoto();
      }
      this.get_pictogramas();
      this.SelectPictogramaUrl("");
      this.CloseModal();
    },

    CloseAllModal() {
      this.CloseModal();
      this.CloseModalRutina();
      this.SelectPictogramaUrl("");
      this.get_pictogramas();
    },
  },
};
</script>



<style scope>
.modalPictos {
  margin-left: 400px;
  margin-top: 300px;
}

.mainModal {
  border: 2px solid #1e9c96;
}

.modal-card-title {
  color: #1e9c96;
}

.modal-content {
  background: white;
  border-radius: 5px;
  padding: 5px;
}

.list {
  max-height: 20vh;
}
.columns {
  gap: 8px;
}
.modal-card-body {
  overflow: scroll;
  max-height: calc(100vh - 100px);
}
.modal-card-body::-webkit-scrollbar {
  display: none;
}

.modal-card-foot {
  display: flex;
  justify-content: center;
}

.bgList {
  background: transparent;
}
</style>
