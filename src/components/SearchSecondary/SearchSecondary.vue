<template>
  <!--Search-->
  <div class="container my-3">
    <div class="field has-addons">
      <div class="control is-expanded">
        <input
          class="input"
          id="buscarAudioCard"
          type="text"
          :placeholder="placeHolder"
          autocomplete="off"
          v-model="valueSearch"
          @keyup="searchObj"
        />
      </div>
    </div>
  </div>
  <!--/Search-->
</template>

<script>
export default {
  name: "SearchSecondary",
  data() {
    return {
      valueSearch: "",
    };
  },
  props: {
    placeHolder: String,
    SearchFunction: {
      type: Function,
    },
  },
  methods: {
    searchObj() {
      if (this.SearchFunction) {
        this.SearchFunction(this.valueSearch);
      }
    },
  },
};
</script>

<style scoped></style>
