<template>
  <div id="sidebar">
    <div class="toggle-btn">
      <span 
        @mouseover="hover = true"
        @mouseleave="hover = false"
        @click="ToggleSideBar"
      >
        <img src="@/assets/Img/otros/picto.gif" alt="iconPicto" />
      </span>
      <span v-if="hover" class="MsgSpan">Clic para seleccionar un pictograma 🖼</span>
    </div>
    <h3>Mis Pictogramas</h3>
    <!--Search-->
    <div class="container m-3">
      <div class="field has-addons">
        <div class="control is-expanded">
          <input
            class="input"
            id="buscar"
            type="text"
            autocomplete="off"
            placeholder="Buscar Pictograma"
            v-model="valueSearch"
            @keyup="searchPictograma"
          />
        </div>
      </div>
    </div>
    <!--/Search-->
    <div class="ContainerCards" id="drag-items">
      <!--contenido-->
      <NoFound v-if="PictogramaFilter.length <= 0" />
      <div v-for="pictograma in PictogramaFilter" :key="pictograma.id">
        <CardPictogramaSecundary :pictograma="pictograma" />
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import CardPictogramaSecundary from "@/components/CardPictogramaSecundary/CardPictogramaSecundary.vue";
import NoFound from "@/components/NoFound/NoFound.vue";
export default {
  name: "SlideBar",
  data(){
    return{
      hover: false,
      valueSearch: ''
    }
  },
  components: {
    CardPictogramaSecundary,
    NoFound,
  },
  computed: {
    ...mapState("pictogramas", ["PictogramaFilter"]),
  },
  mounted() {
    this.get_pictogramas();
  },
  methods: {
    ...mapActions("pictogramas", ["get_pictogramas", "search_pictograma"]),

    ToggleSideBar() {
      document.getElementById("sidebar").classList.toggle("active");
    },
    searchPictograma() {
      this.search_pictograma(this.valueSearch);
    },
  },
};
</script>

<style scoped>
#sidebar {
  position: fixed;
  border-radius: 0px 10px 10px 0px;
  padding-top: 8px;
  color: white;
  text-align: center;
  z-index: 1000;
  width: 250px;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  left: -250px;
  transition: all 500ms linear;
}

#sidebar.active {
  left: 0px;
}

#sidebar .toggle-btn {
  position: absolute;
  left: 260px;
  top: 5px;
  cursor: pointer;
}

#sidebar .toggle-btn span {
  display: block;
  width: 40px;
  text-align: center;
  font-size: 30px;
}
#sidebar .toggle-btn span img {
  border-radius: 50%;
  border: 2px solid rgb(2, 67, 153);
}

#sidebar .toggle-btn span:hover {
  transition: transform 150ms;
  transform: translateY(-10px);
}

/* ------- */
.ContainerCards {
  display: grid;
  max-height: calc(100vh - 180px);
  overflow: hidden;
  margin: 10px;
  gap: 5px;
  overflow-y: scroll;
}

.ContainerCards::-webkit-scrollbar {
  display: none;
}

.MsgSpan {
  position: absolute;
  background: #00d1b2;
  color: white;
  padding: 10px;
  border-radius: 50px 50px 0px 50px;
  right: 55px;
  bottom: 105px;
  display: block;
  z-index: 2000;
  width: auto;
  text-align: center;
  font-size: 1em;
}
</style>
