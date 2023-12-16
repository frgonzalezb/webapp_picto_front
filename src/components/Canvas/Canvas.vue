<template>
  <div>
    <!-- El ÁREA DE TRABAJO en sí -->
    <div id="containercanvas" class="content"></div>

    <!-- components/OptionMenu -->
    <OptionMenu />

    <!-- components/SelectAudioMenu -->
    <SelectAudioMenu :callback="getUrlAudio" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import OptionMenu from "@/components/OptionMenu/OptionMenu.vue";
import SelectAudioMenu from "@/components/SelectAudioMenu/SelectAudioMenu.vue";

export default {
  name: "Canvas",
  components: {
    OptionMenu,
    SelectAudioMenu,
  },
  data() {
    return {
      url_base: import.meta.env.VITE_APP_BACKEND_API,
      currentShape: null,
      src_imagen: "",
      Url_imagen: "",
      Id_pictograma: "",
    };
  },
  computed: {
    ...mapState("rutina", ["RutinaObj"]),
  },
  mounted() {
    const ts = this;
    // Métodos KONVA.JS
    let divCanvas = document.getElementById("containercanvas");
    let sceneWidth = divCanvas.clientWidth;
    let sceneHeight = divCanvas.clientHeight;
    let menuNode = document.getElementById("OptionMenu");
    let menu2Node = document.getElementById("SelectAudioMenu");
    let btnAudio = document.getElementById("audio-button");
    let inputSearchAudio = document.getElementById("buscarAudioCard");
    let currentShape;
    let json = null;
    let stage = null;
    let layer = null;
    let rutinaId = ts.RutinaObj.id;
    let btnUpdateRutina = document.getElementById("updateRutina");
    let btnSaveRutina = document.getElementById("saveRutina");
    let dragItemsElement = document.getElementById("drag-items");
    let stageContainer;

    // El ÁREA DE TRABAJO se declara aquí
    stage = new Konva.Stage({
      container: "containercanvas",
      width: sceneWidth,
      height: sceneHeight,
    });
    layer = new Konva.Layer();
    stage.add(layer);
    stageContainer = stage.container();
    checkAndRestartStage();

    // --- ACTUALIZAR RUTINA ---
    function updateRutina() {
      const nroElement = stage.children[0].children.length;

      if (nroElement <= 0) {
        ts.toast("No se puede actualizar una rutina sin elementos.");
        ts.CloseModalRutina();
        return;
      }

      json = stage.toJSON();
      ts.SearchRutinaObjForUpdate(rutinaId);
      ts.setJson(json);
      ts.OpenModalRutina();
    }
    btnUpdateRutina.addEventListener("click", updateRutina);

    // --- GUARDAR RUTINA ---
    function saveRutina() {
      const nroElement = stage.children[0].children.length;

      if (nroElement <= 0) {
        ts.toast("No se puede actualizar una rutina sin elementos.");
        ts.CloseModalRutina();
        return;
      }

      json = stage.toJSON();
      ts.cleanValue();
      ts.setJson(json);
      ts.OpenModalRutina();
    }
    btnSaveRutina.addEventListener("click", saveRutina);

    // Procesar solicitud de imagen
    function processImage(attrs, callback) {
      return new Promise(function(resolve) {
        Konva.Image.fromURL(attrs.url_img, function(image) {
          setImageAttributes(image, attrs);
          callback(image);
          resolve(image);
        });
      });
    }

    // Crear objeto IMAGEN (pictograma) en el canvas
    function createImage(attrs) {
      return processImage(attrs, function(image) {
        setDoubleClickHandler(image, attrs);
      });
    }

    // Establecer los atributos de la IMAGEN
    function setImageAttributes(image, attrs) {
      image.setAttrs(attrs);
    }

    // Comportamiento al hacer doble clic en el pictograma
    function DoubleClickHandler(image, attrs) {
      return function () {
        const audio = image.getAttr("url_audio");
        const scaleMultiplier = 1.2;
        
        // Verificar si attrs está definido antes de acceder a sus propiedades
        const width = attrs && attrs.width !== undefined ? attrs.width : image.getAttr("width");
        const height = attrs && attrs.height !== undefined ? attrs.height : image.getAttr("height");

        if (audio) {
          playAudioWithScaling(image, audio, scaleMultiplier, width, height);
        } else {
          scaleImage(image, scaleMultiplier, width, height);
        }
      };
    }

    // Establecer el comportamiento al hacer doble clic en el pictograma
    function setDoubleClickHandler(image, attrs) {
      image.on("dblclick", DoubleClickHandler(image, attrs));
    }

    // Reproducir el sonido asociado al pictograma y escalar imagen
    function playAudioWithScaling(image, audioUrl, scaleMultiplier, width, height) {
      playAudio(audioUrl, function() {
        scaleImage(image, 1 / scaleMultiplier, width, height);
      });
    }

    // Reproducir sonido
    function playAudio(url, onFinish) {
      const song = new Audio(url);
      song.play();

      if (onFinish) {
        song.addEventListener("ended", onFinish);
      }
    }

    // Escalar imagen
    function scaleImage(image, scaleMultiplier, width, height) {
      image.to({
        width: width * scaleMultiplier,
        height: height * scaleMultiplier,
        onFinish: function() {
          image.to({
            width: width,
            height: height,
          });
        },
      });
    }

    // Crear objeto TEXTO en el canvas
    function createText(attrs) {
      return new Konva.Text({
        type: "TEXTO",
        text: attrs.text,
        x: attrs.x,
        y: attrs.y,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        fontSize: attrs.fontSize,
        fill: attrs.fill,
        align: "center",
        draggable: true,
        width: "auto",
      });
    }

    // Crear objeto FLECHA en el canvas
    function createArrow(attrs) {
      return new Konva.Arrow({
        type: "FLECHA",
        x: attrs.x,
        y: attrs.y,
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
        draggable: true,
      });
    }

    // Crear objeto TRIANGULO en el canvas
    function createRegularPolygon(attrs) {
      return new Konva.RegularPolygon({
        type: "TRIANGULO",
        x: attrs.x,
        y: attrs.y,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        sides: attrs.sides,
        radius: attrs.radius,
        stroke: attrs.stroke,
        strokeWidth: attrs.strokeWidth,
        lineJoin: "bevel",
        draggable: true,
      });
    }

    // Crear objeto CUADRADO en el canvas
    function createRectangle(attrs) {
      return new Konva.Rect({
        type: "CUADRADO",
        x: attrs.x,
        y: attrs.y,
        width: attrs.width,
        height: attrs.height,
        stroke: attrs.stroke,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        strokeWidth: attrs.strokeWidth,
        draggable: true,
      });
    }

    // Crear objeto CIRCULO en el canvas
    function createCircle(attrs) {
      return new Konva.Circle({
        type: "CIRCULO",
        x: attrs.x,
        y: attrs.y,
        radius: attrs.radius,
        stroke: attrs.stroke,
        scaleX: attrs.scaleX,
        scaleY: attrs.scaleY,
        height: 100,
        strokeWidth: attrs.strokeWidth,
        draggable: true,
      });
    }

    // Crear transformador de objeto
    function createTransformer(node) {
      return new Konva.Transformer({
        nodes: [node],
        type: "TRANSFORMER",
        anchorSize: 7,
        borderDash: [3, 3],
        boundBoxFunc: function(oldBox, newBox) {
          if (newBox.width < 10 || newBox.height < 10) {
            return oldBox;
          }
          return newBox;
        },
      });
    }

    // Agregar el nodo a la capa
    function addNodeToLayer(node) {
      layer.add(node);
    }

    // Agregar el transformador a la capa
    function addTransformerToLayer(tr) {
      layer.add(tr);
    }

    // Reiniciar el canvas
    async function restartStage() {
      try {
        const jsonString = ts.RutinaObj.json_rutina;
        const json = jsonString ? JSON.parse(jsonString) : null;

        if (!json || !json.attrs) {
          ts.toast("Error al cargar rutina: JSON no válido");
          return;
        }

        stage.attrs.width = json.attrs.width;
        stage.attrs.height = json.attrs.height;

        const children = json.children[0]?.children;

        if (!children) return;

        const nodeCreators = {
          IMAGEN: createImage,
          TEXTO: createText,
          FLECHA: createArrow,
          TRIANGULO: createRegularPolygon,
          CUADRADO: createRectangle,
          CIRCULO: createCircle,
        };

        for (let i = 0; i < children.length; i++) {
          const attrs = children[i]?.attrs;

          if (attrs && nodeCreators[attrs.type]) {
            const node = await nodeCreators[attrs.type](attrs);
            const tr = createTransformer(node);

            addNodeToLayer(node);
            addTransformerToLayer(tr);
          }
        }
      } catch (err) {
        ts.toast("Error al cargar rutina: " + err.message);
      }
    }

    // Chequear si la rutina existe
    function checkAndRestartStage() {
      if (rutinaId) {
        restartStage();
      }
    }

    // Adaptar el tamaño del canvas a la ventana
    function fitStageIntoParentContainer() {
      let container = document.querySelector("#containercanvas");
      let containerWidth = container.offsetWidth;
      let scale = containerWidth / sceneWidth;
      stage.width(sceneWidth * scale);
      stage.height(sceneHeight * scale);
      stage.scale({ x: scale, y: scale });
    }
    window.addEventListener("resize", fitStageIntoParentContainer);

    // Drag pictograma
    function handleDragStart(e) {
      ts.src_imagen = e.target.src;
      ts.Id_pictograma = e.target.id;
      ts.Url_imagen = e.target.name;
    }
    dragItemsElement.addEventListener("dragstart", handleDragStart);

    // Dragover pictograma
    function handleDragOver(e) {
      e.preventDefault();
    }
    stageContainer.addEventListener("dragover", handleDragOver);

    // Drop pictograma
    function handleDrop(e) {
      handleDragOver(e);
      stage.setPointersPositions(e);

      const attrs = {
        type: "IMAGEN",
        width: 200,
        height: 200,
        url_img: ts.Url_imagen,
        id_pictograma: ts.Id_pictograma,
        url_audio: "",
        name: "pictograma",
        stroke: "black",
        strokeWidth: 5,
        draggable: true,
        position: stage.getPointerPosition(),
      };

      processImage(attrs, function(image) {
        addNodeToLayer(image);
        addTransformerToLayer(createTransformer(image));
        setDoubleClickHandler(image);
        clearVariables();
      });
    }
    stageContainer.addEventListener("drop", handleDrop);

    // Limpiar variables
    function clearVariables() {
      ts.src_imagen = "";
      ts.Url_imagen = "";
      ts.Id_pictograma = "";
    }

    // Agregar un texto al canvas
    function addTextToCanvas(text, px, color) {
      if (text === "") {
        ts.toast("¡El campo de texto no puede estar vacío!");
        return;
      }

      const defaultAttrs = {
        text: text,
        x: 500,
        y: 50,
        scaleX: 1,
        scaleY: 1,
        fontSize: parseInt(px),
        fill: color,
      }

      const textNode = createText(defaultAttrs);

      addNodeToLayer(textNode);
      addTransformerToLayer(createTransformer(textNode));

      clearTextInputs();
    }

    // Limpiar los campos de entrada de texto
    function clearTextInputs() {
      document.getElementById("valorTexto").value = "";
    }

    // Asignar el manejador de clic al botón "addTexto"
    document.getElementById("addTexto").addEventListener("click", function () {
      const text = document.getElementById("valorTexto").value;
      const px = document.getElementById("pxTexto").value;
      const color = document.getElementById("colorTexto").value;

      addTextToCanvas(text, px, color);
    });

    // Configuración para tipos de figura
    const figureConfig = {
      Arrow: (defaults, color) => createArrow({
        ...defaults,
        points: [100, 300, stage.width() / 4, stage.height() / 4],
        fill: color,
        stroke: color,
        strokeWidth: 30,
      }),
      Triangle: (defaults, color) => createRegularPolygon({
        ...defaults,
        sides: 3,
        radius: 100,
        stroke: color,
        strokeWidth: 10,
        lineJoin: "bevel",
      }),
      Square: (defaults, color) => createRectangle({
        ...defaults,
        width: 200,
        height: 100,
        stroke: color,
        strokeWidth: 10,
      }),
      Circle: (defaults, color) => createCircle({
        ...defaults,
        radius: 70,
        stroke: color,
        strokeWidth: 10,
      }),
    };

    // Agregar una figura al canvas
    function addFigureToCanvas(figureType, color) {
      const defaults = {
        x: stage.width() / 2,
        y: stage.height() / 2,
        scaleX: 1,
        scaleY: 1,
        draggable: true,
      };

      const figureCreationFunction = figureConfig[figureType];

      if (figureCreationFunction) {
        const figure = figureCreationFunction(defaults, color);
        const tr = createTransformer(figure);

        addNodeToLayer(figure);
        addTransformerToLayer(tr);
      } else {
        ts.toast("¡Debe seleccionar una figura!");
      }
    }

    // Asignar el manejador de clic al botón "addFigura"
    document.getElementById("addFigura").addEventListener("click", function () {
      const figuraSeleccionada = document.getElementById("selectfigura").value;
      const color = document.getElementById("colorFigura").value;

      addFigureToCanvas(figuraSeleccionada, color);
    });

    // Mostrar el menú en una posición específica
    function showMenu(node, menu, offset = { x: -100, y: -100 }) {
      const containerRect = stage.container().getBoundingClientRect();
      menu.style.top = containerRect.top + node.getPointerPosition().y + offset.y + "px";
      menu.style.left = containerRect.left + node.getPointerPosition().x + offset.x + "px";
      menu.style.display = "initial";
    }

    // Ocultar el menú
    function hideMenu(menu) {
      menu.style.display = "none";
    }

    // Destruir el transformer y la figura
    function destroyShape(shape) {
      const tr = layer.find("Transformer").find((tr) => tr.nodes()[0] === shape);
      tr.destroy();
      shape.destroy();
    }

    // Abrir opción de menú al hacer clic derecho
    stage.on("contextmenu", function (e) {
      e.evt.preventDefault();

      if (e.target === stage) {
        hideMenu(menu2Node);
        inputSearchAudio.value = '';
        return;
      }

      ts.currentShape = e.target;
      currentShape = e.target;

      if (ts.currentShape.attrs.name == "pictograma") {
        btnAudio.style.display = "initial";
        hideMenu(menu2Node);
      } else {
        btnAudio.style.display = "none";
        hideMenu(menu2Node);
      }

      showMenu(stage, menuNode);
    });

    // Ocultar menú al hacer clic fuera del lienzo
    window.addEventListener("click", () => {
      hideMenu(menuNode);
      btnAudio.style.display = "none";
    });

    // Ocultar menú al hacer clic en el lienzo
    stage.on("click", function (e) {
      if (e.target === stage) {
        hideMenu(menu2Node);
        inputSearchAudio.value = '';
      }
    });

    // Mostrar menú con lista de audios al hacer clic en el botón de audio
    document.getElementById("audio-button").addEventListener("click", () => {
      showMenu(stage, menu2Node);
      inputSearchAudio.value = '';
    });

    // Eliminar la figura al hacer clic en el botón de eliminar
    document.getElementById("delete-button").addEventListener("click", () => {
      destroyShape(currentShape);
    });

  },
  methods: {
    ...mapActions("ModalRutina", ["OpenModalRutina", "CloseModalRutina"]),
    ...mapActions("rutina", ["setJson", "cleanValue", "SearchRutinaObjForUpdate"]),

    getUrlAudio(url) {
      let menu2Node = document.getElementById("SelectAudioMenu");
      let btnAudio = document.getElementById("audio-button");
      menu2Node.style.display = "none";
      btnAudio.style.display = "none";
      this.currentShape.attrs.url_audio = url;
    },
    toast(msg) {
      this.$swal.fire({
        html: `<span style='color: black, text-align: center'>${msg}</span>`,
        background: "white",
        showConfirmButton: false,
        icon: "error",
        timer: 2000,
        toast: true,
        position: "bottom-right",
      });
    },
  },
};
</script>

<style scoped>
.content {
  position: grid;
  margin: 1% auto;
  min-height: 75vh;
  max-height: 75vh;
  min-width: 90vw;
  max-width: 90vw;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
}
</style>