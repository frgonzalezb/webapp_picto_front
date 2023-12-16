<template>
  <div id="OptionMenu">
    <div>
      <button id="audio-button">Seleccionar sonido</button>
      <button id="delete-button">Eliminar</button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'OptionMenu'
}
</script>

<style scoped>
/* menu para eliminar elemento */
#OptionMenu {
  display: none;
  position: absolute;
  width: auto;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  padding: 5px;
}
#OptionMenu button {
  width: 100%;
  background-color: white;
  border: 2px solid #00d1b2;
  color: #008571;
  margin: 0;
  padding: 10px;
  border-radius: 5px;
}
#OptionMenu button:hover {
  background-color: #45f1d7;
  color: white;
}

#OptionMenu button + button {
  width: 100%;
  background-color: white;
  border: 2px solid red;
  color: red;
  margin: 0;
  padding: 10px;
  border-radius: 5px;
}

#OptionMenu button + button:hover {
  background-color: rgb(251, 90, 90);
  color: white;
}
/* /menu para eliminar elemento */
</style>
