<template>
  <div id="sidebarTools">
    <div class="toggle-btn">
      <span @click="ToggleSideBar">
        <img src="@/assets/Img/otros/pencil.gif" alt="iconPicto" />
      </span>
    </div>
    <h3>Herramientas</h3>
    <div class="ContainerTools">
      <!--contenido-->
      <ToolsKit />
    </div>
  </div>
</template>

<script>
import ToolsKit from "@/components/ToolsKit/ToolsKit.vue";
export default {
  name: "SlideBarTools",
  components: {
    ToolsKit,
  },
  computed: {},
  mounted() {},
  methods: {
    ToggleSideBar() {
      document.getElementById("sidebarTools").classList.toggle("active");
    },
  },
};
</script>

<style scoped>
/*  */
#sidebarTools {
  position: fixed;
  border-radius: 10px 0px 0px 10px;
  padding-top: 8px;
  color: white;
  text-align: center;
  z-index: 1000;
  width: 250px;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  right: -250px;
  transition: all 500ms linear;
}

#sidebarTools.active {
  right: 0px;
}

#sidebarTools .toggle-btn {
  position: absolute;
  right: 260px;
  top: 5px;
  cursor: pointer;
}

#sidebarTools .toggle-btn span {
  display: block;
  width: 40px;
  text-align: center;
  font-size: 30px;
}
#sidebarTools .toggle-btn span img {
  border-radius: 50%;
  border: 2px solid rgb(2, 67, 153);
}

#sidebarTools .toggle-btn span:hover {
  transition: transform 150ms;
  transform: translateY(-10px);
}

/* ------- */
.ContainerTools {
  display: grid;
  max-height: calc(100vh - 100px);
  overflow: hidden;
  margin: 10px;
  gap: 5px;
  overflow-y: scroll;
}
.ContainerTools::-webkit-scrollbar {
  display: none;
}
</style>
