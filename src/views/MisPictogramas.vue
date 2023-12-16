<template>
  <div class="container">
    <h2 class="title has-text-centered">Mis Pictogramas</h2>
    
    <!-- Search -->
    <Search
      :CreateFunction="openModal"
      :SearchFunction="searchPictograma"
      ActionName="Nuevo Pictograma"
    />
    <!-- /Search -->

    <div class="container box">
      <div class="columns is-gapless is-centered is-multiline is-1">
        <NoFound v-if="PictogramaFilter.length <= 0" />
        <div
          v-for="(pictograma, index) in PictogramaFilter"
          :key="index"
          class="column is-one-third my-4"
        >
          <CardPictogramaPrimary
            :pictograma="pictograma"
          ></CardPictogramaPrimary>
        </div>
      </div>
    </div>

    <div v-if="isOpenModalPictograma">
      <ModalPictograma/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import NoFound from "@/components/NoFound/NoFound.vue";
import Search from "@/components/Search/Search.vue";
import ModalPictograma from "@/components/ModalPictograma/ModalPictograma.vue";
import CardPictogramaPrimary from "@/components/CardPictogramaPrimary/CardPictogramaPrimary.vue";


export default {
  name: "MisPictogramas",
  components: {
    ModalPictograma,
    CardPictogramaPrimary,
    NoFound,
    Search,
  },
  data() {
    return {};
  },
  mounted() {
    document.title = "PICTO - Mis Pictogramas";
    this.ActiveNav();
    this.setInactiveTop();
    this.setInactiveBottom();
    this.get_pictogramas();
  },
  computed: {
    ...mapState('TopShapeDivider', ['isActiveTop']),
    ...mapState('BottomShapeDivider', ['isActiveBottom']),
    ...mapState("pictogramas", ["PictogramaFilter"]),
    ...mapState("modalPictograma", ["isOpenModalPictograma"]),
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
    ...mapActions('TopShapeDivider', ['setActiveTop', 'setInactiveTop']),
    ...mapActions('BottomShapeDivider', ['setActiveBottom', 'setInactiveBottom']),
    ...mapActions("modalPictograma", ["changeOpenModalPictograma"]),
    ...mapActions("pictogramas", ["get_pictogramas", "search_pictograma"]),

    openModal() {
      this.changeOpenModalPictograma();
    },
    searchPictograma(value) {
      this.search_pictograma(value);
    },
  },
  unmounted() {
    this.InactiveNav();
    this.setActiveTop();
    this.setActiveBottom();
  },
};
</script>

<style scoped>
.title {
  margin-top: 0.5rem;
  color: #1e9c96;
}


/* contenido-caja */
.box {
  background: rgba(0, 0, 0, 0.3);
  min-height: calc(100vh - 40vh);
  max-height: calc(100vh - 40vh);
  margin-top: 0.5%;
  margin-bottom: 3%;
  overflow-y: scroll;
}
.box::-webkit-scrollbar {
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.3);
}

.box::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid white;
  border-radius: 5px;
}
.columns {
  gap: 0px;
}
/* /contenido-caja */
@media screen and (max-width: 470px) {
  .field.has-addons {
    padding: 10px;
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 0 auto;
  }
  .input,
  .textarea {
    border-radius: 5px !important;
  }
  .control {
    margin-top: 5px;
  }
  .button.is-info {
    border-radius: 5px !important;
  }
}
</style>
