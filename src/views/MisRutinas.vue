<template>
  <div class="container">
    <h2 class="title has-text-centered">Mis Rutinas</h2>
    <Search
      :CreateFunction="CreateRutina"
      :SearchFunction="SearchRutina"
      ActionName="Nueva Rutina"
    />
    <div class="container box">
      <div class="columns is-gapless is-centered is-multiline is-1">
        <NoFound v-if="RutinasFilter.length <= 0"/>
        <div
          v-for="rutina in RutinasFilter"
          :key="rutina.id"
          class="column is-one-third my-4"
        >
          <CardRutina :rutina="rutina" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import CardRutina from "@/components/CardRutina/CardRutina.vue";
import Search from "@/components/Search/Search.vue";
import NoFound from "@/components/NoFound/NoFound.vue";

export default {
  name: "MisRutinas",
  components: {
    Search,
    CardRutina,
    NoFound
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('TopShapeDivider', ['isActiveTop']),
    ...mapState('BottomShapeDivider', ['isActiveBottom']),
    ...mapState("rutinas", ["RutinasFilter"])
  },
  mounted() {
    document.title = "PICTO - Mis Rutinas";
    this.ActiveNav();
    this.setInactiveTop();
    this.setInactiveBottom();
    this.get_rutinas();
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
    ...mapActions('TopShapeDivider', ['setActiveTop', 'setInactiveTop']),
    ...mapActions('BottomShapeDivider', ['setActiveBottom', 'setInactiveBottom']),
    ...mapActions("rutinas", ["get_rutinas", "search_rutinas"]),
    ...mapActions("rutina", ["cleanValue"]),

    CreateRutina() {
      this.cleanValue();
      this.$router.push("/crear-nueva-rutina/");
    },
    SearchRutina(value) {
      this.search_rutinas(value);
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
</style>
