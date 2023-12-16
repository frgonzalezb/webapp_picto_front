<template>
  <div class="container">
    <h2 class="title has-text-centered">Mis Audios</h2>
    
    <!-- components/Search -->
    <Search
      :CreateFunction="openModal"
      :SearchFunction="searchAudio"
      ActionName="Nuevo Audio"
    />

    <div class="container box">
      <div class="columns is-gapless is-centered is-multiline is-1">
        
        <!-- components/NoFound -->
        <NoFound v-if="AudioFilter.length <= 0" />
        <div
          v-for="(audio, index) in AudioFilter"
          :key="index"
          class="column is-one-third my-4"
        >
          <!-- components/CardAudio -->
          <CardAudio :audio="audio"></CardAudio>
        </div>
      </div>
    </div>

    <div v-if="isOpenModalAudio">
      <!-- components/ModalAudio -->
      <ModalAudio/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import Search from "@/components/Search/Search.vue";
import NoFound from "@/components/NoFound/NoFound.vue";
import SearchSVG from "@/components/Icons/SearchSVG/SearchSVG.vue";
import CardAudio from "@/components/CardAudio/CardAudio.vue";
import ModalAudio from "@/components/ModalAudio/ModalAudio.vue";

export default {
  name: "MisAudios",
  components: {
    SearchSVG,
    CardAudio,
    ModalAudio,
    Search,
    NoFound,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('TopShapeDivider', ['isActiveTop']),
    ...mapState('BottomShapeDivider', ['isActiveBottom']),
    ...mapState("audios", ["AudioFilter", "forceReload"]),
    ...mapState("modalAudio", ["isOpenModalAudio"]),
  },
  mounted() {
    document.title = "PICTO - Mis Audios";
    this.ActiveNav();
    this.setInactiveTop();
    this.setInactiveBottom();
    this.get_audios();
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
    ...mapActions('TopShapeDivider', ['setActiveTop', 'setInactiveTop']),
    ...mapActions('BottomShapeDivider', ['setActiveBottom', 'setInactiveBottom']),
    ...mapActions("audios", ["get_audios", "search_audio"]),
    ...mapActions("audioObj", ["cleanValue"]),
    ...mapActions("modalAudio", ["changeOpenModalAudio"]),

    searchAudio(value) {
      this.search_audio(value);
    },
    openModal() {
      this.cleanValue();
      this.changeOpenModalAudio();
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
/* /contenido-caja */</style
>>
