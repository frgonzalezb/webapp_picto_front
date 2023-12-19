<template>
<!-- RutinaActiva -->
<div class="mainContainer">
  <div id="rutinaCanvas" class="Content"></div>
  
  <router-link to="/dashboard/">
    <span
      @mouseover="hover = true"
      @mouseleave="hover = false"
      id="updateRutina"
      class="save"
    >
      <img src="@/assets/Img/otros/exit.gif" alt="iconPicto" />
    </span>
    <span v-if="hover" class="msgSave">Volver a Dashboard</span>
  </router-link>

</div>
<!-- /RutinaActiva -->
</template>

<script>
import { mapState, mapActions } from "vuex";
import GIF from "@/assets/Img/otros/party.gif"

export default {
  name: "rutinaActiva",
  data() {
    return {
      url_base: import.meta.env.VITE_APP_BACKEND_API,
      hover: false,
    };
  },
  created() {},
  computed: {
    ...mapState("rutinaActiva", ["RutinaActiva"]),
  },
  async mounted() {
    document.title = "Rutina | Pictogramas";
    const id = this.$route.params.id;
    await this.SearchRutinaActiva(id);
    this.ActiveNav();

    /* metodos KONVA.JS */
    let divCanvas = document.getElementById("rutinaCanvas");
    let sceneWidth = divCanvas.clientWidth;
    let sceneHeight = divCanvas.clientHeight;
    let json_ = this.RutinaActiva.json_rutina;
    let defaultValuesPictograma = null;
    let stage = null;
    let layer = null;
    const group = new Konva.Group();

    stage = new Konva.Stage({
      container: "rutinaCanvas",
      width: sceneWidth,
      height: sceneHeight,
    });
    layer = new Konva.Layer();
    stage.add(layer);

    function createGif(width, height, scaleX, scaleY) {
      var canvas = document.createElement("canvas");
      function onDrawFrame(ctx, frame) {
        frame.delay = 10;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame.buffer, frame.x, frame.y);
        layer.draw();
      }
      gifler(GIF).frames(canvas, onDrawFrame, true);
      var giff = new Konva.Image({
        image: canvas,
        width: width * 3,
        height: height * 3,
        x: stage.width() / 4,
        y: stage.height() / 12,
        scaleX: scaleX,
        scaleY: scaleY,
      });
      layer.add(giff);
      setTimeout(() => {
        giff.destroy();
      }, 2000);
    };

    const handleMouseOver = (img) => {
      img.to({
        shadowBlur: 200,
        shadowColor: "#FEE600",
        stroke: "#00FEF8",
      });
    };

    const handleMouseOut = (img) => {
      img.to({
        shadowBlur: 0,
        stroke: "#FFC300",
      });
    };

    const handleClick = (img, e) => {
      if (defaultValuesPictograma === null) {
        defaultValuesPictograma = e.target.attrs;
        img.to({
          stroke: "#FFC300",
          strokeWidth: 60,
        });
        return;
      } else if (e.target.attrs.id === defaultValuesPictograma.id) {
        img.to({
          stroke: "#FFC300",
          strokeWidth: 50,
        });
        return;
      } else {
        img.to({
          stroke: "#FFC300",
          strokeWidth: 50,
        });

        let currentValuesPictograma = stage.find(
          `#${defaultValuesPictograma.id}`
        )[0];
        currentValuesPictograma.to({
          stroke: "black",
          strokeWidth: 5,
        });
        defaultValuesPictograma = e.target.attrs;
      }
    };

    const reproducirAudio = (ts, url_audio) => {
      const song = new Audio(url_audio);
      song.play();
    };

    const animarImagen = (img, currentWidth, currentHeight, currentX, currentY, stage) => {
      img.to({
        width: currentWidth * 2,
        height: currentHeight * 2,
        stroke: "#00FEF8",
        x: stage.width() / 4,
        y: stage.height() / 4,
        zIndex: 2,
        onFinish: () => {
          setTimeout(() => {
            img.to({
              width: currentWidth,
              height: currentHeight,
              stroke: "black",
              strokeWidth: 5,
              x: currentX,
              y: currentY,
              zIndex: 2,
            });
          }, 2000);
        },
      });
    };

    const handleDoubleClick = (img, ts) => {
      let url_audio = img.getAttr("url_audio");
      let currentHeight = img.getAttr("height");
      let currentWidth = img.getAttr("width");
      let currentX = img.getAttr("x");
      let currentY = img.getAttr("y");
      let currentScaleX = img.getAttr("scaleX");
      let currentScaleY = img.getAttr("scaleY");

      createGif(currentWidth, currentHeight, currentScaleX, currentScaleY);

      if (url_audio !== "") {
        reproducirAudio(ts, url_audio);
        animarImagen(img, currentWidth, currentHeight, currentX, currentY, stage);
      } else {
        animarImagen(img, currentWidth, currentHeight, currentX, currentY, stage);
      }
    };

    const crearImagen = (attrs) => {
      return new Promise((resolve) => {
        Konva.Image.fromURL(attrs.url_img, function (image) {
          image.setAttrs({
            type: attrs.type,
            width: attrs.width,
            height: attrs.height,
            url_img: attrs.url_img,
            id_pictograma: attrs.id_pictograma,
            id: attrs.id_pictograma,
            url_audio: attrs.url_audio,
            name: "pictograma",
            stroke: attrs.stroke,
            strokeWidth: attrs.strokeWidth,
            draggable: false,
            x: attrs.x,
            y: attrs.y,
            rotation: attrs.rotation,
            scaleX: attrs.scaleX,
            scaleY: attrs.scaleY,
          });

          image.on("mouseover", function () {
            handleMouseOver(image);
          });

          image.on("mouseout", function () {
            handleMouseOut(image);
          });

          image.on("click", (e) => {
            handleClick(image, e);
          });

          image.on("dblclick", function () {
            handleDoubleClick(image, this);
          });

          resolve(image);
        });
      });
    };

    const crearTexto = (attrs) => {
      return new Konva.Text({
        type: "TEXTO",
        text: attrs.text,
        x: attrs.x,
        y: attrs.y,
        rotation: attrs.rotation,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        fontSize: attrs.fontSize,
        fill: attrs.fill,
        align: "center",
        draggable: false,
        width: "auto",
      });
    };

    const crearFlecha = (attrs) => {
      return new Konva.Arrow({
        type: "FLECHA",
        x: attrs.x,
        y: attrs.y,
        rotation: attrs.rotation,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        points: attrs.points,
        pointerLength: attrs.pointerLength,
        pointerWidth: attrs.pointerWidth,
        fill: attrs.fill,
        stroke: attrs.stroke,
        strokeWidth: attrs.strokeWidth,
        padding: attrs.padding,
        margin: attrs.margin,
        draggable: false,
      });
    };

    const crearTriangulo = (attrs) => {
      return new Konva.RegularPolygon({
        type: "TRIANGULO",
        x: attrs.x,
        y: attrs.y,
        rotation: attrs.rotation,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        sides: attrs.sides,
        radius: attrs.radius,
        stroke: attrs.stroke,
        strokeWidth: attrs.strokeWidth,
        lineJoin: "bevel",
        draggable: false,
      });
    };

    const crearCuadrado = (attrs) => {
      return new Konva.Rect({
        type: "CUADRADO",
        x: attrs.x,
        y: attrs.y,
        rotation: attrs.rotation,
        width: attrs.width,
        height: attrs.height,
        stroke: attrs.stroke,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        strokeWidth: attrs.strokeWidth,
        draggable: false,
      });
    };

    const crearCirculo = (attrs) => {
      return new Konva.Circle({
        type: "CIRCULO",
        x: attrs.x,
        y: attrs.y,
        rotation: attrs.rotation,
        radius: attrs.radius,
        stroke: attrs.stroke,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        height: 100,
        strokeWidth: attrs.strokeWidth,
        draggable: false,
      });
    };

    const crearElemento = {
      IMAGEN: crearImagen,
      TEXTO: crearTexto,
      FLECHA: crearFlecha,
      TRIANGULO: crearTriangulo,
      CUADRADO: crearCuadrado,
      CIRCULO: crearCirculo,
    };

    async function restartStage() {
      try {
        const json = JSON.parse(json_);

        json.children[0].children.forEach(async (child) => {
          const attrs = child.attrs;
          const elemento = crearElemento[attrs.type];

          if (elemento) {
            if (attrs.type === "IMAGEN") {
              const image = await elemento(attrs);
              group.add(image);
              layer.add(group);
            } else {
              layer.add(elemento(attrs));
            }
          } else {
            const text = 'No es posible encontrar un elemento de la rutina. \
              Verifica que todos los elementos de la rutina existan y que no\
              hayan sido actualizados o eliminados. Es decir, que posean \
              exactamente las mismas características (imagen, audio, \
              nombre, etc.).';
            
            this.$swal.fire({
              title: "¡Ups!",
              text: text,
              icon: "error",
              confirmButtonColor: "#1e9c96",
              confirmButtonText: "OK",
            });
          }
        });
      } catch (error) {
        const text = 'Error inesperado al obtener los datos de la rutina. \
          Si el problema persiste, contáctanos.';

        console.error(text);

        this.$swal.fire({
          title: "¡Ups!",
          text: text,
          icon: "error",
          confirmButtonColor: "#1e9c96",
          confirmButtonText: "OK",
        });
      }
    }

    if (json_ != "") {
      restartStage();
    }
  },
  methods: {
    ...mapActions("rutinaActiva", ["SearchRutinaActiva"]),
    ...mapActions("navBar", ["ActiveNav", "InactiveNav"]),
  },
  unmounted() {
    this.InactiveNav();
  },
};
</script>

<style scoped>
.mainContainer {
  min-width: 100%;
  min-height: 100vh;
  margin: 0px;
}
.Content {
  z-index: 3;
  position: absolute;
  min-height: 100%;
  min-width: 100%;
  background-color: rgba(212, 204, 190, 0.5);
  border-radius: 0px;
  overflow: hidden;
}

.save {
  position: absolute;
  right: 10px;
  bottom: 10px;
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
  bottom: 60px;
  display: block;
  z-index: 2000;
  width: auto;
  text-align: center;
  font-size: 1em;
  z-index: 2000;
}
</style>
