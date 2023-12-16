<template>
  <!-- menu2 -->
  <div id="SelectAudioMenu">
    <!--Search-->
    <div class="container my-3">
      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            class="input"
            id="buscarAudioCard"
            type="text"
            placeholder="Buscar Audio"
            autocomplete="off"
            v-model="valueSearch"
            @keyup="searchAudio"
          />
        </div>
      </div>
    </div>
    <!--/Search-->
    <div id="lista2" class="box">
      <p class="msg" v-if="AudioFilter.length <= 0">Sin Resultados...</p>
      <div v-for="audio in AudioFilter" :key="audio.id" class="is-flex">
        <AudioItem :ObjAudio="audio" />
        <div class="control ml-1">
          <a
            class="button is-primary agregarsonido"
            @click="getUrlAudio(audio.ruta)"
          >
            Agregar
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- /manu2 -->
</template>

<script>
import { mapState, mapActions } from "vuex";

import AudioItem from "@/components/AudioItem/AudioItem.vue";
import NoFound from "@/components/NoFound/NoFound.vue";

export default {
  name: "SelectAudioMenu",
  data() {
    return {
      valueSearch: "",
    };
  },
  props: {
    callback: {
      type: Function,
    },
  },
  components: {
    AudioItem,
    NoFound,
  },
  computed: {
    ...mapState("audios", ["AudioFilter"]),
  },
  mounted() {
    this.get_audios();
  },
  methods: {
    ...mapActions("audios", ["get_audios", "search_audio"]),

    getUrlAudio(url) {
      if (this.callback) {
        this.callback(url);
        this.valueSearch = ''
      }
    },
    searchAudio() {
      this.search_audio(this.valueSearch);
    },
  },
};
</script>

<style scoped>
/* menu para seleccionar sonido */
#SelectAudioMenu {
  display: none;
  position: absolute;
  height: auto;
  max-height: 300px;
  max-width: 400px;
  min-width: 400px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  padding: 5px;
}
#audio-button {
  display: none;
}
#lista2 {
  background: white;
  max-height: 200px;
  max-width: 100%;
  overflow-y: scroll;
}
#lista2::-webkit-scrollbar {
  display: none;
}

.msg{
  text-align: center;
}
/* menu para seleccionar sonido */
</style>
