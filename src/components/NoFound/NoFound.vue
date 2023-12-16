<template>
  <div class="noFound">
    <img src="@/assets/Img/otros/no-Found.gif" alt="" />
    Sin Resultados...
  </div>
</template>

<style scoped>
.noFound {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 0 auto;
  color: white;
}

@media screen and (max-width: 800px) {
  .noFound{
    max-width: 100px;
  }
}
</style>
