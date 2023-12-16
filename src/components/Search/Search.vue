<template>
  <!--Search-->
  <div class="container mt-2">
    <div class="field has-addons">
      <div class="control is-expanded">
        <input
          class="input"
          id="buscar"
          type="text"
          placeholder="Buscar..."
          v-model="valueSearch"
          @keyup="searchObj"
        />
      </div>
      <div class="control">
        <a class="button">
          <span class="file-icon p-0 m-0">
            <SearchSVG></SearchSVG>
          </span>
        </a>
        <a @click="createObj" class="button ml-1">{{ActionName}}</a>
      </div>
    </div>
  </div>
  <!--/Search-->
</template>

<script>
import SearchSVG from '@/components/Icons/SearchSVG/SearchSVG.vue'
export default {
  name: "Search",
  components:{
      SearchSVG
  },
  data() {
    return {
      valueSearch: ""
    };
  },
  props: {
    ActionName: String,
    CreateFunction: {
      type: Function,
    },
    SearchFunction: {
      type: Function,
    },
  },
  methods: {
    createObj() {
      if (this.CreateFunction) {
        this.CreateFunction();
      }
    },
    searchObj() {
      if (this.SearchFunction) {
        this.SearchFunction(this.valueSearch);
      }
    },
  },
};
</script>

<style scoped>
.button{
  background: #3fada8;
  color: white;
}
.button:hover{
  background: #52c7b3;
}

@media screen and (max-width: 470px) {
.field.has-addons{
  padding: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 0 auto;
}
.input, .textarea {
  border-radius: 5px !important;
}
.control{
  margin-top: 5px;
}
.button.is-info{
  border-radius: 5px !important;
}
}
</style>
