<template>
  <div>
    <!-- components/ModalRutina -->
    <ModalRutina v-if="isOpenModalRutina" />

    <!-- components/ModalPictogramaList -->
    <ModalPictogramaList v-if="isOpenModalList" />
    
    <div class="NuevaRutina">
      <SlideBar />
      <SlideBarTools />

      <h2 v-if="!RutinaObj.id" class="title has-text-centered mb-0">
        Nueva Rutina
      </h2>

      <h2 v-if="RutinaObj.id" class="title has-text-centered mb-0">
        Actualizar Rutina
      </h2>

      <Canvas />

      <div v-show="!RutinaObj.id">
        <span
          @mouseover="hover = true"
          @mouseleave="hover = false"
          id="saveRutina"
          class="save"
        >
          <img src="@/assets/Img/otros/save.gif" alt="iconPicto" />
        </span>
        <span v-if="hover" class="msgSave">Clic para guardar rutina 💾</span>
      </div>

      <div v-show="RutinaObj.id">
        <span
          @mouseover="hover = true"
          @mouseleave="hover = false"
          id="updateRutina"
          class="save"
        >
          <img src="@/assets/Img/otros/save.gif" alt="iconPicto" />
        </span>
        <span 
          v-if="hover" 
          class="msgSave"
        >Clic para actualizar rutina 🔄</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import SlideBar from "@/components/SlideBar/SlideBar.vue";
import SlideBarTools from "@/components/SlideBarTools/SlideBarTools.vue";
import Canvas from "@/components/Canvas/Canvas.vue";
import ModalRutina from "@/components/ModalRutina/ModalRutina.vue";
import ModalPictogramaList from "@/components/ModalPictogramaList/ModalPictogramaList.vue";

export default {
  name: "CrearNuevaRutina",
  components: {
    SlideBar,
    SlideBarTools,
    Canvas,
    ModalRutina,
    ModalPictogramaList,
  },
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    ...mapState('TopShapeDivider', ['isActiveTop']),
    ...mapState('BottomShapeDivider', ['isActiveBottom']),
    ...mapState("ModalRutina", ["isOpenModalRutina"]),
    ...mapState("ModalPictogramaList", ["isOpenModalList"]),
    ...mapState("rutina", ["RutinaObj"]),
  },
  mounted() {
    if (this.RutinaObj.id == 0) {
      document.title = "PICTO - Crear nueva rutina";
    } else {
      document.title = "PICTO - Actualizar rutina";
    };
    this.ActiveNav();
    this.setInactiveTop();
    this.setInactiveBottom();

    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  methods: {
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
    ...mapActions('TopShapeDivider', ['setActiveTop', 'setInactiveTop']),
    ...mapActions('BottomShapeDivider', ['setActiveBottom', 'setInactiveBottom']),

    handleBeforeUnload(event) {
      const msg = "¿Realmente deseas recargar la página? \
        Los cambios no guardados se perderán.";

      event.returnValue = msg;

      return msg;
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$swal.fire({
      title: "¿Deseas proceder?",
      text: "Tus cambios no guardados se perderán.",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, proceder"
    }).then((result) => {
      if (result.isConfirmed) {
        next();
      } else {
        next(false);  
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
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

.NuevaRutina {
  position: absolute;
  background: transparent;
  min-height: 100vh;
  min-width: 100%;
}

.save {
  position: absolute;
  right: 10px;
  bottom: 60px;
  cursor: pointer;
  display: block;
  z-index: 2000;
  width: 40px;
  text-align: center;
  font-size: 30px;
}
.save img {
  border-radius: 50%;
  border: 2px solid rgb(2, 67, 153);
}
.save:hover {
  transition: transform 150ms;
  transform: translateY(-10px);
}

.msgSave {
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
