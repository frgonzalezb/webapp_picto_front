<template>
  <!-- cuadro de herramientas -->
  <div id="herramientas" class="box">
    <div class="field">
      <label class="label">Agregar Texto</label>
      <div class="control">
        <input
          id="valorTexto"
          class="input is-primary"
          type="text"
          placeholder="Ingrese Texto"
        />
      </div>

      <div class="field is-horizontal my-1">
        <div class="field-label is-small">
          <label class="label">Tamaño:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input
                id="pxTexto"
                class="input is-small is-primary"
                value="20"
                type="number"
                min="20"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal my-1">
        <div class="field-label is-small">
          <label class="label">Color:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input id="colorTexto" class="input is-small is-primary" type="color" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="control is-flex is-flex-direction-row-reverse">
      <button id="addTexto" class="button is-primary is-small is-fullwidth">
        Agregar
      </button>
    </div>

    <hr />

    <div class="field">
      <label class="label">Agregar figura</label>
      <div class="control">
        <div class="select is-primary is-fullwidth">
          <!-- select faltante  -->
          <select id="selectfigura">
            <option selected value="0" disabled>Seleccione</option>
            <option v-for="f in figuras" :key="f" :value="f.value">{{
              f.label
            }}</option>
          </select>
        </div>
      </div>
      <div class="field is-horizontal my-1">
        <div class="field-label is-small">
          <label class="label">Color:</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input id="colorFigura" class="input is-small is-primary" type="color" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="control is-flex is-flex-direction-row-reverse">
      <button id="addFigura" class="button is-small is-primary is-fullwidth">
        Agregar
      </button>
    </div>
    <hr />
  </div>
  <!-- /cuadro de herramientas -->
</template>

<script>
export default {
    name: 'ToolsKit',
    data(){
    return{
      figuras: [{
        'value': 'Arrow',
        'label': 'Flecha'
        },
        {
        'value': 'Triangle',
        'label': 'Triangulo'
        },
        {
        'value': 'Square',
        'label': 'Cuadrado'
        },
        {
        'value': 'Circle',
        'label': 'Circulo'
        }
      ]
    }
  },
}
</script>

<style scoped>
#herramientas {
  background: rgba(255, 255, 255, 0.2);
  margin: 8px 0px;
  max-height: auto;
  overflow-y: scroll;
}

#herramientas::-webkit-scrollbar {
  display: none;
}

#herramientas label {
  color: white;
}
</style>
