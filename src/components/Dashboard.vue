<template>
  <div class="grid">
    <vs-row>
      <vs-col class="pd-10" vs-type="flex" vs-justify="center" vs-align="center" w="3">
        <SearchStock></SearchStock>
      </vs-col>
      <vs-col class="pd-10" vs-type="flex" vs-justify="center" vs-align="center" w="9"> 75% </vs-col>
      <!--Old Code-->
      <!--<vs-col w="5">
        <v-select
          label="name"
          :filterable="false"
          :options="options"
          @search="onSearch"
          @selected="optionSelected">
          <template slot="no-options"> Search Stocks.. </template>
          <template slot="option" slot-scope="option">
            <div class="">
              <template>
                <b>{{ option["1. symbol"] }}</b> <br />
                <em>{{ option["2. name"] }}</em>
              </template>
            </div>
          </template>
          <template slot="selected-option" slot-scope="option">
            <div class="selected">
              <template>
                <b>{{ option["1. symbol"] }}</b> <br />
                <em>{{ option["2. name"] }}</em>
              </template>
            </div>
          </template>
        </v-select>
      </vs-col>-->
    </vs-row>
  </div>
</template>

<style>
.pd-10{
    padding:10px;
}
/*
.d-center {
  display: flex;
  align-items: center;
}

.v-select .dropdown li {
  border-bottom: 1px solid rgba(112, 128, 144, 0.1);
}

.v-select .dropdown li:last-child {
  border-bottom: none;
}

.v-select .dropdown li a {
  padding: 10px 20px;
  width: 100%;
  font: 400 13.3333px Arial;
  color: white;
}

.v-select .dropdown-menu .active > a {
}*/
</style>

<script>
//import _ from "lodash";
import SearchStock from "@/components/SearchStock.vue";
export default {
  name: "Dashboard",
  components: {
    SearchStock,
  },
  data: () => ({
    options: [],
  }),
  methods: {
    // onSearch(search, loading) {
    //   if (search.length) {
    //     loading(true);
    //     this.search(loading, search, this);
    //   }
    // },
    // search: _.debounce((loading, search, vm) => {
    //   fetch(
    //     `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${escape(
    //       search
    //     )}&apikey=L13ZZ6OUR0KJMBTT`
    //   ).then((res) => {
    //     res.json().then((json) => (vm.options = json.bestMatches));
    //     loading(false);
    //   });
    // }, 350),
    // optionSelected: function(label) {
    //     //receive the label of the value selected (the label shown in the select, or an empty string)
    //     console.error(label);
    // },
  },
};
//L13ZZ6OUR0KJMBTT
</script>
