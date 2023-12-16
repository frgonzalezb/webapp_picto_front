<template>
  <a
    :class="{ active: isActive }"
    @click="activeSelect"
    v-click-outside="desactiveSelect"
    class="image is-64x64 columns is-gapless is-centered is-multiline is-1"
  >
    <img :src="url_base+pictograma.url_foto" />
  </a>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "ItemModalPictogramaList",
  props: {
    pictograma: Object,
  },
  data() {
    return {
      isActive: false,
      url_base: import.meta.env.VITE_APP_BACKEND_API
    };
  },
  computed:{
  },
  mounted() {},
  methods: {
    ...mapActions("rutina", ["SelectPictogramaUrl", "hidePhoto"]),

    activeSelect(){
      this.isActive = true;
      this.SelectPictogramaUrl(this.pictograma.url_foto);
      document.getElementById("foto").value = "";
      this.hidePhoto();
      
    },

    desactiveSelect() {
      this.isActive = false;
    },
  },
};
</script>

<style scope>
.image:hover {
  box-shadow: rgba(9, 178, 194, 0.3) 0px 0px 0px 5px;
}

.active {
  border: 2px solid rgb(0, 93, 81);
}
</style>
