<template>
  <NavBar v-show="isActiveNav" />
  <TopShapeDivider v-if="isActiveTop" />
  <div @click="CloseOptionNav">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
  <BottomShapeDivider v-if="isActiveBottom" />
  <div class="foot">
    <PictoFooter />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavBar from "@/components/NavBar/NavBar.vue";
import TopShapeDivider from '@/components/BackgroundShapes/TopShapeDivider.vue';
import BottomShapeDivider from '@/components/BackgroundShapes/BottomShapeDivider.vue';
import PictoFooter from '@/components/Footer/Footer.vue';

export default {
  components: {
    NavBar,
    TopShapeDivider,
    BottomShapeDivider,
    PictoFooter,
  },
  computed: {
    ...mapState("navBar", ["isActiveNav"]),
    ...mapState('TopShapeDivider', ['isActiveTop']),
    ...mapState('BottomShapeDivider', ['isActiveBottom']),
  },
  methods: {
    ...mapActions("navBar", ["CloseOptionNav"]),
    ...mapActions('TopShapeDivider', ['setActiveTop', 'setInactiveTop']),
    ...mapActions('BottomShapeDivider', ['setActiveBottom', 'setInactiveBottom']),
  },
};
</script>

<style lang="scss">
@import 'bulma/css/bulma.css';
@import 'sweetalert2/src/sweetalert2';

#app {
  background: url(./assets/Img/otros/Background.png);
  background-position: center;
  background-size: cover;
  max-width: 100vw;
  min-height: 120vh;
}

.foot {
  position: absolute;
  bottom: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
