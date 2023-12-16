<template>
  <!--Modal-->
  <div class="modal is-active">
    <div
      @click="closeModal"
      class="modal-background"
      style="opacity: 0.5"
    ></div>
    <transition name="bounce" de mode="out-in">
      <div class="box modal-content p-0">
        <div class="has-background-info-light p-4">
          <div class="box has-background-white p-4">
            <div class="field">
              <!--Titulo-->
              <div class="control has-text-centered m-2">
                <p v-if="!AudioObj.id" class="title is-4">
                  Nuevo Audio
                </p>
                <p v-if="AudioObj.id" class="title is-4">
                  Actualizar Audio
                </p>
              </div>
              <!--/Titulo-->

              <div class="control m-2">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="Ingrese Nombre del Audio"
                  id="newNombreAudio"
                  :value="AudioObj.nombre"
                  @keyup="changeValueNombre($event)"
                />
              </div>
              <span v-if="v$.AudioForm.nombre.$error" class="msg">
                {{ v$.AudioForm.nombre.$errors[0].$message }}
              </span>

              <!--input Audio-->
              <div v-show="visibleInput" class="control m-2">
                <div class="file is-info is-fullwidth">
                  <label class="file-label">
                    <input
                      capture
                      id="recorder"
                      class="file-input"
                      type="file"
                      accept="audio/*"
                      name="resume"
                      @change="selectFile($event)"
                    />
                    <span class="file-cta">
                      <span class="file-icon p-0 m-0"><UploadSVG /></span>
                    </span>
                    <span id="file-name" class="file-name input is-info">
                      Seleccione un Audio
                    </span>
                  </label>
                </div>
              </div>
              <!--/input Audio-->
              <span v-if="v$.AudioForm.file.$error" class="msg">
                {{ v$.AudioForm.file.$errors[0].$message }}
              </span>

              <!--Reproductor-->
              <div
                v-show="visibleInput"
                class="control columns is-centered m-2"
              >
                <audio id="player" controls></audio>
              </div>
              <!---->
              <div
                v-if="AudioObj.id && !visibleInput"
                class="control columns is-centered m-2"
              >
                <audio controls>
                  <source
                    :src="url_base + AudioObj.url_audio"
                    type="audio/mp3"
                  />
                </audio>
              </div>
              <!--/Reproductor-->
              <div v-if="!visibleInput" class="has-text-centered">
                <a href="#" @click="toggleFileInput"
                  >Click Para Cambiar Audio!</a
                >
              </div>

              <div class="field is-grouped columns is-centered m-2">
                <div class="control">
                  <button
                    v-if="!storageExceeded && !AudioObj.id"
                      @click="createAudio"
                      class="button is-info"
                    >
                    Guardar Audio
                  </button>

                  <button
                    v-if="!storageExceeded && AudioObj.id"
                    @click="updateAudio"
                    class="button is-info"
                  >
                    Actualizar Audio
                  </button>

                  <button
                    v-if="storageExceeded"
                    class="button is-info"
                    disabled
                  >
                    Guardar/Actualizar Audio
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
</template>

<script>
import { mapState, mapActions } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

import EmojiRegex from 'emoji-regex';
import UploadSVG from "@/components/Icons/UploadSVG/UploadSVG.vue";

export default {
  name: "ModalAudio",
  components: {
    UploadSVG,
  },
  data() {
    return {
      url_base: import.meta.env.VITE_APP_BACKEND_API,
      v$: useVuelidate(),
      AudioForm: {
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
    const fileType = (value) => value === "audio/mpeg" || value ===  "audio/wav";

    const fileSize = (value) => {
      if (this.AudioForm.file.cargado <= 0) {
        return true;  // No hay archivo seleccionado, no aplicar validación de tamaño
      }
      return value <= 1024 * 1024; // 1 MB
    };

    return {
      AudioForm: {
        nombre: {
          required: helpers.withMessage("Nombre es requerido", required),
          maxLength: helpers.withMessage("Maximo 50 caracteres", maxLength(50)),
          minLength: helpers.withMessage("Minimo 2 caracteres", minLength(2)),
          noEmoji: helpers.withMessage("El nombre no puede contener emojis", (value) => {
            return !emojiRegex.test(value);
          }),
        },
        file: {
          cargado: {
            fileRe: helpers.withMessage("Audio es requerido", fileRe),
          },
          tipo: {
            fileType: helpers.withMessage(
              "Formatos Aceptados .MP3 o .WAV",
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
    ...mapState("audioObj", ["AudioObj", "visibleInput"]),
    ...mapState(["storageData"]),

    storageExceeded() {
      const remainingStorage = this.storageData.remaining_storage || 0;
      const fileSize = this.AudioForm.file.size || 0;
      return fileSize >= remainingStorage;
    },
  },
  methods: {
    ...mapActions("modalAudio", ["changeOpenModalAudio"]),
    ...mapActions("audioObj", [
      "cleanValue",
      "showInput",
      "hideInput",
      "setNombre",
      "UpdateAudioObj",
      "CreateAudioObj",
    ]),
    ...mapActions("audios", ["get_audios"]),

    closeModal() {
      this.cleanValue();
      this.changeOpenModalAudio();
    },

    changeValueNombre(evt) {
      this.setNombre(evt.target.value);
    },

    toggleFileInput() {
      this.showInput();
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
      const filename = document.getElementById("file-name");

      if (!evt.target.files.length) {
        this.AudioForm.file.cargado = -1;
        this.AudioForm.file.tipo = "";
        this.AudioForm.file.size = 0;
        filename.innerHTML = "";
        filename.innerHTML = "Seleccione un audio";
        return;
      }
      const player = document.getElementById("player");

      const file = evt.target.files[0];
      const url = URL.createObjectURL(file);
      player.src = url;
      filename.innerHTML = "";
      filename.innerHTML = document.getElementById("recorder").files[0].name;

      this.AudioForm.file.cargado = evt.target.files.length;
      this.AudioForm.file.tipo = evt.target.files[0].type;
      this.AudioForm.file.size = evt.target.files[0]?.size || 0;
    },

    handleCreate(formData, audioFile) {
      formData.append("name", this.AudioForm.nombre);
      formData.append("file", audioFile.files[0]);

      this.executeCreate(formData);
    },

    executeCreate(formData) {
      this.CreateAudioObj(formData).then((response) => {
        this.handleCreateResponse(response)
      });
    },

    handleCreateResponse(response) {
      if (response.status == 201) {
        this.showAlert(
          "¡Creado!", 
          "Audio creado exitosamente.", 
          "success", 
          "#1e9c96"
        );
        this.get_audios();
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
      this.showAlert("¡Error!", message, "error", "#1e9c96");
    },

    createAudio() {
      let formData = new FormData();
      let audioFile = document.getElementById("recorder");

      this.AudioForm.nombre = document.getElementById("newNombreAudio").value;

      this.v$.$validate();

      if (!this.v$.$error) {
        if (audioFile.files[0]) {
          try {
            this.handleCreate(formData, audioFile);
          } catch (error) {
            this.handleError(error, "Parece que ocurrió un error inesperado.");
          }
        }
        this.changeOpenModalAudio();
      } else {
        const msg = 'Formulario no válido o espacio insuficiente. \
          Si el problema persiste, contacte al administrador.';
        console.error(msg);
      }
    },

    handleUpdateWithFile(formData, audioFile) {
      formData.append("name", this.AudioForm.nombre);
      formData.append("file", audioFile.files[0]);

      const updateObj = { id: this.AudioObj.id, data: formData };
      this.executeUpdate(updateObj);
    },

    handleUpdateWithoutFile(formData) {
      formData.append("name", this.AudioForm.nombre);

      const updateObj = { id: this.AudioObj.id, data: formData };
      this.executeUpdate(updateObj);
    },

    executeUpdate(updateObj) {
      this.UpdateAudioObj(updateObj).then((response) => {
        this.handleUpdateResponse(response);
      });
    },

    handleUpdateResponse(response) {
      if (response.status == 200) {
        this.showAlert(
          "¡Actualizado!", 
          "Audio actualizado correctamente.", 
          "success", 
          "#1e9c96"
        );
        this.get_audios();
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

    updateAudio() {
      let formData = new FormData();
      let audioFile = document.getElementById("recorder");

      this.AudioForm.nombre = document.getElementById("newNombreAudio").value;

      if (!audioFile.files.length) {
        this.AudioForm.file.cargado = 0;
        this.AudioForm.file.tipo = "audio/mpeg";
      }

      this.v$.$validate();

      if (!this.v$.$error) {
        try {
          if (audioFile.files[0]) {
            // Si hay nuevo archivo (y nombre)
            this.handleUpdateWithFile(formData, audioFile);
          } else {
            // Si solo cambia el nombre
            this.handleUpdateWithoutFile(formData)
          }
        } catch (error) {
          this.handleError(error, "Parece que ocurrió un error inesperado.");
        }
        this.closeModal();
      } else {
        const msg = 'Formulario no válido o espacio insuficiente. \
          Si el problema persiste, contacte al administrador.';
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
</style>
