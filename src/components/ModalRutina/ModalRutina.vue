<template>
  <!--Modal-->
  <div id="modal" class="modal is-active">
    <div
      class="modal-background"
      style="opacity: 0.5;"
      @click="CloseAllModal"
    ></div>

    <transition name="bounce" de mode="out-in">
      <div class="box modal-content p-0">
        <div class="has-background-info-light p-4">
          <div class="box has-background-white p-4">
            <div class="field">
              <!--Titulo-->
              <div class="control has-text-centered m-2">
                <p class="title is-4">
                  Datos para la Rutina
                </p>
              </div>
              <!--/Titulo-->

              <!--preview Imagen-->
              <div class="control columns is-centered m-2">
                <div class="card column is-centered">
                  <div class="card-image">
                    <figure v-show="visiblePhoto" id="preview" class="image">
                      <img
                        src="@/assets/Img/otros/picto.gif"
                        alt="img-defecto"
                      />
                    </figure>
                    <figure v-if="!visiblePhoto" class="image">
                      <img
                        v-if="RutinaObj.url_portada === ''"
                        src="@/assets/Img/otros/picto.gif"
                        alt="imgRutina"
                      />
                      <img
                        v-else
                        :src="RutinaObj.url_portada"
                        alt="imgRutina"
                      />
                    </figure>
                  </div>
                </div>
              </div>
              <!--/preview Imagen-->
              <span v-if="v$.RutinaForm.file.$error" class="msg">
                {{ v$.RutinaForm.file.$errors[0].$message }}
              </span>

              <!--input Imagen-->
              <div class="control columns is-centered m-2">
                <div class="file is-info is-boxed">
                  <label class="file-label">
                    <input
                      id="foto"
                      class="file-input"
                      type="file"
                      accept="image/*"
                      name="resume"
                      @change="selectFile($event)"
                    />
                    <span class="file-cta">
                      <span class="file-icon">
                        <UploadSVG></UploadSVG>
                      </span>
                      <span class="file-label"> Buscar Imagen… </span>
                    </span>
                  </label>
                </div>
              </div>
              <!--/input Imagen-->
              <div class="control m-2">
                <input
                  id="newNombreRutina"
                  class="input is-info"
                  type="text"
                  placeholder="Ingrese Nombre para la Rutina"
                  autocomplete="off"
                  :value="RutinaObj.nombre"
                  @keyup="changeValueNombre($event)"
                />
              </div>
              <span v-if="v$.RutinaForm.nombre.$error" class="msg">
                {{ v$.RutinaForm.nombre.$errors[0].$message }}
              </span>
              
              <div class="field is-grouped columns is-centered m-2">
                <div class="control">
                  <button
                    v-if="!storageExceeded && !RutinaObj.id"
                    @click="createRutina"
                    class="button is-info"
                  >
                    Guardar Rutina
                  </button>
                  
                  <button
                    v-if="!storageExceeded && RutinaObj.id"
                    @click="updateRutina"
                    class="button is-info"
                  >
                    Actualizar Rutina
                  </button>

                  <button
                    v-if="storageExceeded"
                    class="button is-info"
                    disabled
                  >
                    Guardar/Actualizar Rutina
                  </button>
                </div>
              </div>

              <div v-if="storageExceeded" class="notification is-danger mt-2">
                Lo sentimos, espacio insuficiente para subir este archivo.
              </div>
              
            </div>
          </div>
        </div>

        <button
          class="modal-close is-large"
          aria-label="close"
          @click="closeModal"
        ></button>
      </div>
    </transition>
  </div>
  <!--/Modal-->
</template>

<script>
import { mapState, mapActions } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

import EmojiRegex from 'emoji-regex';
import UploadSVG from "@/components/Icons/UploadSVG/UploadSVG.vue";

export default {
  name: "ModalRutina",
  components: {
    UploadSVG,
  },
  data() {
    return {
      url_base: import.meta.env.VITE_APP_BACKEND_API,
      v$: useVuelidate(),
      RutinaForm: {
        nombre: "",
        file: {
          cargado: -1,
          tipo: "",
        },
      },
    };
  },
  validations() {
    const emojiRegex = EmojiRegex();
    const fileType = (value) =>
      value === "image/png" ||
      value === "image/jpeg" ||
      value === "image/jpg"

    const fileSize = (value) => {
      if (this.RutinaForm.file.cargado <= 0) {
        return true;  // No hay archivo seleccionado, no aplicar validación de tamaño
      }
      return value <= 1024 * 1024; // 1 MB
    };

    return {
      RutinaForm: {
        nombre: {
          required: helpers.withMessage("Nombre es Requerido", required),
          maxLength: helpers.withMessage("Maximo 20 Caracteres", maxLength(20)),
          minLength: helpers.withMessage("Minimo 2 Caracteres", minLength(2)),
          noEmoji: helpers.withMessage("El nombre no puede contener emojis", (value) => {
            return !emojiRegex.test(value);
          }), 
        },
        file: {
          tipo: {
            fileType: helpers.withMessage(
              "Formatos aceptados: .png | .jpg | .jpeg",
              fileType
            ),
          },
          size: {
            fileSize: helpers.withMessage(
              "Tamaño máximo permitido: 1 MB por archivo",
              fileSize
            ),
          },
        },
      },
    };
  },
  computed: {
    ...mapState("rutina", ["RutinaObj", "visiblePhoto"]),
    ...mapState(["storageData"]),

    storageExceeded() {
      const remainingStorage = this.storageData.remaining_storage || 0;
      const fileSize = this.RutinaForm.file.size || 0;
      return fileSize >= remainingStorage;
    },
  },
  methods: {
    ...mapActions("pictogramas", ["get_pictogramas"]),
    ...mapActions("ModalRutina", ["CloseModalRutina"]),
    ...mapActions("ModalPictogramaList", ["OpenModal", "CloseModal"]),
    ...mapActions("rutina", [
      "setNombre",
      "CreateRutinaObj",
      "UpdateRutinaObj",
      "showPhoto",
      "SelectPictogramaUrl",
    ]),
    ...mapActions("rutinas", ["get_rutinas"]),

    selectImgPictograma() {
      this.OpenModal();
    },

    closeModal() {
      this.CloseModalRutina();
    },
    CloseAllModal() {
      this.CloseModal();
      this.CloseModalRutina();
      this.SelectPictogramaUrl("");
      this.get_pictogramas();
    },
    changeValueNombre(evt) {
      this.setNombre(evt.target.value);
    },

    showAlert(title, text, icon, confirmButtonColor) {
      this.$swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: confirmButtonColor,
        confirmButtonText: "OK",
      });
    },

    calculateJsonSize(json) {
      // Convierte el JSON a cadena
      const jsonString = JSON.stringify(json);

      // Calcula el tamaño en bytes aproximado
      const bytes = new TextEncoder().encode(jsonString).length;

      return bytes;
    },

    showStorageExceededMessage() {
      this.showAlert(
        "¡Advertencia!",
        "El tamaño del JSON excede el espacio de almacenamiento restante.",
        "warning",
        "#1e9c96"
      );
    },

    selectFile(evt) {
      let preview = document.getElementById("preview");
      let image = document.createElement("img");

      image.style.display = "flex";
      image.style.justifyContent = "center";
      image.style.margin = "0 auto";
      image.style.minWidth = "50%";
      image.style.maxWidth = "50%";

      if (!evt.target.files.length) {
        this.handleNoFileSelected(image, preview);
      } else {
        this.handleFileSelected(image, preview, evt.target.files[0]);
      }
    },

    handleNoFileSelected(image, preview) {
      this.RutinaForm.file.cargado = -1;
      this.RutinaForm.file.tipo = "";
      this.RutinaForm.file.size = 0;
      image.src = require("@/assets/Img/otros/default-Image.gif");
      this.clearAndAppendImage(preview, image);
      this.showPhoto();
    },

    handleFileSelected(image, preview, file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        image.src = reader.result;
        this.clearAndAppendImage(preview, image);
      };
      this.showPhoto();
      this.updateFileDetails(file);
    },

    clearAndAppendImage(container, image) {
      container.innerHTML = "";
      container.append(image);
    },

    updateFileDetails(file) {
      this.RutinaForm.file.cargado = 1;
      this.RutinaForm.file.tipo = file.type;
      this.RutinaForm.file.size = file.size || 0;
    },

    handleCreateWithoutCover(formData) {
      formData.append("name", this.RutinaForm.nombre);
      formData.append("json", this.RutinaObj.json_rutina);

      this.executeCreate(formData);
    },

    handleCreateWithCover(formData, portadaFile) {
      formData.append("name", this.RutinaForm.nombre);
      formData.append("json", this.RutinaObj.json_rutina);
      formData.append("file", portadaFile.files[0]);

      this.executeCreate(formData);
    },

    executeCreate(formData) {
      this.CreateRutinaObj(formData).then((response) => {
        this.handleCreateResponse(response);
      });
    },

    handleCreateResponse(response) {
      if (response.status == 201) {
        this.showAlert(
          "¡Creado!", 
          "Rutina creada exitosamente.", 
          "success", 
          "#1e9c96"
        );
        return;
      } else {
        const msg = "No podemos crear la rutina. \
        Revisa que tengas suficiente espacio disponible para almacenarla.\
        Si añades una imagen de portada, también valida que cumpla con los \
        requisitos mínimos de subida y que tengas suficiente \
        espacio disponible para almacenarla."

        this.showAlert(
          "¡Ups!", 
          msg,
          "error", 
          "#1e9c96"
        );
      }
    },

    handleError(error, message) {
      this.showAlert("¡Error!", message, "error", "#1e9c96");
    },

    createRutina() {
      let formData = new FormData();
      let portadaFile = document.getElementById("foto");
      let nombre = document.getElementById("newNombreRutina").value;
      
      this.RutinaForm.nombre = nombre;

      const jsonSize = this.calculateJsonSize(this.RutinaObj.json_rutina);

      if (jsonSize >= this.storageData.remaining_storage) {
        this.showStorageExceededMessage();
        return;
      }

      if (!portadaFile.files.length) {
        this.RutinaForm.file.cargado = 0;
        this.RutinaForm.file.tipo = "image/png";
      }

      this.v$.$validate();

      if (!this.v$.$error) {
        try {
          if (!portadaFile.files.length) {
            this.handleCreateWithoutCover(formData);
          } else {
            this.handleCreateWithCover(formData, portadaFile);
          }
        } catch(error) {
          this.handleError(error, "Parece que currió un error inesperado.");
        }
        this.closeModal();
        return;
      } else {
        const msg = 'Formulario no válido o espacio insuficiente. \
        Si el problema persiste, contáctanos.';
        console.error(msg);
      }
    },

    handleUpdateWithFile(formData, portadaFile) {
      formData.append("name", this.RutinaForm.nombre);
      formData.append("json", this.RutinaObj.json_rutina);
      formData.append("file", portadaFile.files[0]);
      
      const updateObj = { id: this.RutinaObj.id, data: formData };
      this.executeUpdate(updateObj);
    },

    handleUpdateWithoutFile(formData) {
      formData.append("name", this.RutinaForm.nombre);
      formData.append("json", this.RutinaObj.json_rutina);
      
      const updateObj = { id: this.RutinaObj.id, data: formData };
      this.executeUpdate(updateObj);
    },

    executeUpdate(updateObj) {
      this.UpdateRutinaObj(updateObj).then((response) => {
        this.handleUpdateResponse(response);
      });
    },

    handleUpdateResponse(response) {
      if (response.status == 200) {
        this.showAlert(
          "¡Actualizado!", 
          "Rutina actualizada correctamente.", 
          "success", 
          "#1e9c96"
        );
        this.CloseModalRutina();
        return;
      } else {
        const msg = "No podemos actualizar la rutina. \
        Revisa que tengas suficiente espacio disponible para almacenarla.\
        Si añades una imagen de portada, también valida que cumpla con los \
        requisitos mínimos de subida y que tengas suficiente \
        espacio disponible para almacenarla."

        this.showAlert(
          "¡Ups!", 
          msg,
          "error", 
          "#1e9c96"
        );
      }
    },

    updateRutina() {
      let formData = new FormData();
      let portadaFile = document.getElementById("foto");
      
      this.RutinaForm.nombre = document.getElementById("newNombreRutina").value;

      const jsonSize = this.calculateJsonSize(this.RutinaObj.json_rutina);

      if (jsonSize >= this.storageData.remaining_storage) {
        this.showStorageExceededMessage();
        return;
      }

      if (!portadaFile.files.length) {
        this.RutinaForm.file.cargado = 0;
        this.RutinaForm.file.tipo = "image/png";
      }
      this.v$.$validate();

      if (!this.v$.$error) {
        try {
          if (portadaFile.files[0]) {
            this.handleUpdateWithFile(formData, portadaFile);
          } else {
            this.handleUpdateWithoutFile(formData);
          }
        } catch (error) {
          this.handleError(error, "Parece que ocurrió un error inesperado.");
        }
      } else {
        const msg = 'Formulario no válido o espacio insuficiente. \
          Si el problema persiste, contáctanos.';
        console.error(msg);
      }
    },
  },
};
</script>

<style scoped>
.title {
  color: #1e9c96;
}
.button.is-info {
  background: #3fada8;
  color: white;
}
.button.is-info:hover {
  background: #52c7b3;
}
.file.is-info .file-cta {
  background: #3fada8;
  color: white;
}
.file.is-info .file-cta:hover {
  background: #52c7b3;
}

.modal-content {
  overflow: scroll;
  max-height: calc(100vh - 100px);
}
.modal-content::-webkit-scrollbar {
  display: none;
}

.card-image {
  max-height: auto;
}

/* .image{
  max-height: 490px;
  overflow: hidden;
  padding-bottom: 5px;
} */

.image img {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  min-width: 50%;
  max-width: 50%;
}

.msg {
  color: red;
  display: block;
  text-align: center;
  -webkit-animation: 0.7s click 1;
  animation: 0.7s click 1;
}
@keyframes click {
  25%,
  75% {
    -webkit-transform: scale(0.8);
  }
  50% {
    -webkit-transform: scale(1.1);
  }
}

@media screen and (max-width: 774px) {
  .file {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
