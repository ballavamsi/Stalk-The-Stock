<template>
  <div class="grid">
    <vs-row :loaded="getStocks">
      <vs-col class="pd-10" vs-type="flex" vs-justify="center" vs-align="center" w="3">
        <SearchStock></SearchStock>
      </vs-col>
      <vs-col class="pd-10" vs-type="auto" vs-justify="center" vs-align="center" w="9">
        <div>
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap left>
              <v-flex v-for="(item, index) in stalkedStocks" v-bind:key="index" max-width="250px">
                <vs-card class="pb-4" style="width: 250px">
                  <template #img>
                    <h2>{{ item.symbol }}</h2>
                  </template>
                  <template #title>
                    <h3 style="color:green">{{(item.price =='Unable to load' ? 'N/A' : item.price)}}</h3>
                  </template>
                  <template #text>
                    <div>
                      <p style="display: none">Max Price: {{ index }}</p>
                      <p><b>Name : </b>{{ item.name }}</p>
                      <p><b>Min Price: </b>{{ item.min }}</p>
                      <p><b>Max Price: </b>{{ item.max }}</p>
                    </div>
                  </template>
                  <template #interactions>
                    <vs-button class="btn-chat d-none" shadow primary>
                      <i class="bx bx-chat"></i>
                      <span class="span"> {{ item.price }} </span>
                    </vs-button>
                  </template>
                </vs-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>

<style>
.pd-10 {
  padding: 10px;
}
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
    stalkedStocks: [],
  }),
  created() {
    this.getStocks();
    setInterval(() => {
      this.getStocks();
    }, 1000);
  },
  methods: {
    getStocks() {
      if (localStorage.getItem("stalkedStocks")) {
        try {
          this.stalkedStocks = JSON.parse(localStorage.getItem("stalkedStocks"));
        } catch (e) {
          localStorage.removeItem("stalkedStocks");
        }
      }
    },
    removeStock(x) {
      this.stalkedStocks.splice(x, 1);
      this.saveStocks();
    },
    saveStocks() {
      const parsed = JSON.stringify(this.stalkedStocks);
      localStorage.setItem("stalkedStocks", parsed);
    },
  },
};
//L13ZZ6OUR0KJMBTT
</script>
