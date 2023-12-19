<template>
  <div>
    <!--Modal-->
    <div id="modal" class="modal is-active">
      <div
        @click="closeModal"
        class="modal-background"
        style="opacity: 0.5;"
      ></div>

      <transition name="bounce" de mode="out-in">
        <div class="box modal-content p-0">
          <div class="has-background-info-light p-4">
            <div class="box has-background-white p-4">
              <div class="field">
                
                <!--Titulo-->
                <div class="control has-text-centered m-2">
                  <p v-if="!PictogramaObj.id" class="title is-4">
                    Nuevo Pictograma
                  </p>

                  <p v-if="PictogramaObj.id" class="title is-4">
                    Actualizar Pictograma
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
                          :src="PictogramaObj.ruta"
                          alt="imgPictograma"
                        />
                      </figure>
                    </div>
                  </div>
                </div>
                <!--/preview Imagen-->

                <span v-if="v$.PictogramaForm.file.$error" class="msg">
                  {{ v$.PictogramaForm.file.$errors[0].$message }}
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
                    id="newNombrePictograma"
                    class="input is-info"
                    type="text"
                    placeholder="Ingrese un nombre para el pictograma"
                    :value="PictogramaObj.nombre"
                    @keyup="changeValueNombre($event)"
                  />
                </div>
                <span v-if="v$.PictogramaForm.nombre.$error" class="msg">
                  {{ v$.PictogramaForm.nombre.$errors[0].$message }}
                </span>
                
                <div class="field is-grouped columns is-centered m-2">
                  <div class="control">
                    <button
                      v-if="!storageExceeded && !PictogramaObj.id"
                      @click="createPictograma"
                      class="button is-info"
                    >
                      Guardar Pictograma
                    </button>

                    <button
                      v-if="!storageExceeded && PictogramaObj.id"
                      @click="updatePictograma"
                      class="button is-info"
                    >
                      Actualizar Pictograma
                    </button>

                    <button
                      v-if="storageExceeded"
                      class="button is-info"
                      disabled
                    >
                      Guardar/Actualizar Pictograma
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
            @click="closeModal"
            class="modal-close is-large"
            aria-label="close"
          ></button>
        </div>
      </transition>
    </div>
    <!--/Modal-->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

import EmojiRegex from 'emoji-regex';
import UploadSVG from "@/components/Icons/UploadSVG/UploadSVG.vue";

export default {
  name: "ModalPictograma",
  components: {
    UploadSVG,
  },
  data() {
    return {
      v$: useVuelidate(),
      PictogramaForm: {
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
    const fileRe = (value) => value > -1;
    const fileType = (value) =>
      value === "image/png" ||
      value === "image/jpg" ||
      value === "image/jpeg"

    const fileSize = (value) => {
      if (this.PictogramaForm.file.cargado <= 0) {
        return true;  // No hay archivo seleccionado, no aplicar validación de tamaño
      }
      return value <= 1024 * 1024; // 1 MB
    };

    return {
      PictogramaForm: {
        nombre: {
          required: helpers.withMessage("El nombre es requerido", required),
          maxLength: helpers.withMessage("Máximo 50 caracteres", maxLength(50)),
          minLength: helpers.withMessage("Mínimo 2 caracteres", minLength(2)),
          noEmoji: helpers.withMessage("El nombre no puede contener emojis", (value) => {
            return !emojiRegex.test(value);
          }),          
        },
        file: {
          cargado: {
            fileRe: helpers.withMessage("Imagen es requerida", fileRe),
          },
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
    ...mapState("pictogramaObj", ["PictogramaObj", "visiblePhoto"]),
    ...mapState("user", ["UserObj"]),
    ...mapState(["storageData"]),

    storageExceeded() {
      const remainingStorage = this.storageData.remaining_storage || 0;
      const fileSize = this.PictogramaForm.file.size || 0;
      // return fileSize >= remainingStorage;
    },
  },
  methods: {
    ...mapActions("modalPictograma", ["changeOpenModalPictograma"]),
    ...mapActions("pictogramas", ["get_pictogramas"]),
    ...mapActions("pictogramaObj", [
      "cleanValue",
      "showPhoto",
      "hidePhoto",
      "setNombre",
      "UpdatePictogramaObj",
      "CreatePictogramaObj",
    ]),

    closeModal() {
      this.cleanValue();
      this.changeOpenModalPictograma();
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
      this.PictogramaForm.file.cargado = -1;
      this.PictogramaForm.file.tipo = "";
      this.PictogramaForm.file.size = 0;
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
      this.PictogramaForm.file.cargado = 1;
      this.PictogramaForm.file.tipo = file.type;
      this.PictogramaForm.file.size = file.size || 0;
    },

    createPictograma() {
      let formData = new FormData();
      let pictoFile = document.getElementById("foto");
      
      this.PictogramaForm.nombre = document.getElementById(
        "newNombrePictograma"
      ).value;

      this.v$.$validate();

      if (!this.v$.$error) {
        try {
          this.handleCreate(formData, pictoFile);
        } catch (error) {
          this.handleError(error, "Parece que ocurrió un error inesperado.");
        }
        this.closeModal();
      } else {
        const msg = 'Formulario no válido o espacio insuficiente. \
        Si el problema persiste, contáctanos.';
        console.error(msg);
      }
    },

    handleCreate(formData, pictoFile) {
      formData.append("name", this.PictogramaForm.nombre);
      formData.append("file", pictoFile.files[0]);

      this.executeCreate(formData);
    },

    executeCreate(formData) {
      this.CreatePictogramaObj(formData).then((response) => {
        this.handleCreateResponse(response)
      });
    },

    handleCreateResponse(response) {
      if (response.status == 201) {
        this.showAlert(
          "¡Creado!", 
          "Pictograma creado exitosamente.", 
          "success", 
          "#1e9c96"
        );
        this.get_pictogramas();
      } else {
        const msg = "No podemos subir este archivo. \
        Revisa que cumpla con los requisitos mínimos de subida y \
        que tengas suficiente espacio disponible para almacenarlo."

        this.showAlert(
          "¡Ups!", 
          msg,
          "error", 
          "#1e9c96"
        );
      }
    },

    handleUpdateWithFile(formData, pictoFile) {
      formData.append("name", this.PictogramaForm.nombre);
      formData.append("file", pictoFile.files[0]);

      const updateObj = { id: this.PictogramaObj.id, data: formData };
      this.executeUpdate(updateObj);
    },

    handleUpdateWithoutFile(formData) {
      formData.append("name", this.PictogramaForm.nombre);

      const updateObj = { id: this.PictogramaObj.id, data: formData };
      this.executeUpdate(updateObj);
    },

    executeUpdate(updateObj) {
      this.UpdatePictogramaObj(updateObj).then((response) => {
        this.handleUpdateResponse(response);
      });
    },

    handleUpdateResponse(response) {
      if (response.status == 200) {
        this.showAlert(
          "¡Actualizado!", 
          "Pictograma actualizado correctamente.", 
          "success", 
          "#1e9c96"
        );
        this.get_pictogramas();
      } else {
        const msg = "No podemos subir este archivo. \
        Revisa que cumpla con los requisitos mínimos de subida y \
        que tengas suficiente espacio disponible para almacenarlo."
        
        this.showAlert(
          "¡Ups!", 
          msg,
          "error", 
          "#1e9c96"
        );
      }
    },

    handleError(error, message) {
      this.showAlert("¡Ups!", message, "error", "#1e9c96");
    },
    
    updatePictograma() {
      let formData = new FormData();
      let pictoFile = document.getElementById("foto");

      this.PictogramaForm.nombre = document.getElementById(
        "newNombrePictograma"
      ).value;

      if (!pictoFile.files.length) {
        this.PictogramaForm.file.cargado = 0;
        this.PictogramaForm.file.tipo = "image/png";
      }
      
      this.v$.$validate();

      if (!this.v$.$error) {
        try {
          if (pictoFile.files[0]) {
            // Si hay nuevo archivo (y nombre)
            this.handleUpdateWithFile(formData, pictoFile);
          } else {
            // Si solo cambia el nombre
            this.handleUpdateWithoutFile(formData);
          }
        } catch (error) {
          this.handleError(error, "Parece que ocurrió un error inesperado.");
        }
        this.closeModal();
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
