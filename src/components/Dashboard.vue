<template>
  <div class="grid">
    <vs-row>
      <vs-col class="pd-10" vs-type="flex" vs-justify="center" vs-align="center" w="3">
        <SearchStock></SearchStock>
      </vs-col>
      <vs-col class="pd-10" vs-type="auto" vs-justify="center" vs-align="center" w="9">
        <div>
          <v-container grid-list-xs>
            <v-layout row>
              <v-flex
                v-for="(item, index) in stalkedStocks"
                v-bind:key="index"
                max-width="250px"
                align="left"
              >
                <vs-card class="pb-4" style="width: 250px">
                  <template #img>
                    <h2>{{ item.symbol }}</h2>
                  </template>
                  <template #title>
                    <h3 style="color: green">
                      {{ item.price == "Unable to load" ? "N/A" : item.price }}
                    </h3>
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
import { messageService } from "../services/message.service";
export default {
  name: "Dashboard",
  components: {
    SearchStock,
  },
  data: () => ({
    options: [],
    stalkedStocks: [],
  }),
  methods: {
    /*getStocks() {
      if (localStorage.getItem("stalkedStocks")) {
        try {
          this.stalkedStocks = JSON.parse(localStorage.getItem("stalkedStocks"));
        } catch (e) {
          localStorage.removeItem("stalkedStocks");
        }
      }
    },*/
    removeStock(x) {
      this.stalkedStocks.splice(x, 1);
      this.saveStocks();
    },
    saveStocks() {
      /*const parsed = JSON.stringify(this.stalkedStocks);
      localStorage.setItem("stalkedStocks", parsed);*/
    },
  },
  created() {
    if (localStorage.getItem("stalkedStocks")) {
      try {
        let stocksInStorage = JSON.parse(localStorage.getItem("stalkedStocks"));
        console.log(stocksInStorage);
        stocksInStorage.forEach((element) => {
          messageService.addstock(element);
        });
        this.stalkedStocks = stocksInStorage;
      } catch (e) {
        console.log(e);
        localStorage.removeItem("stalkedStocks");
        this.stalkedStocks = [];
      }
    }

    // subscribe to home component messages
    this.subscription = messageService.getstocks().subscribe((res) => {
      if (res) {
        // add message to local state if not empty
        //console.log("In Dashboard");
        //console.log(data.data);
        this.stalkedStocks.push(res.data);
      } else {
        //console.log("Inside else");
        // clear messages when empty message received
      }
    });
  },
  beforeDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  },
};
//L13ZZ6OUR0KJMBTT
</script>
