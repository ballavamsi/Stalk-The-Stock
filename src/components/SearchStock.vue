<template>
  <v-card class="mx-auto" color="gradient" max-width="344" outlined>
    <v-card-text class="pt-2">
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="Symbol"
        label="Search the Stocks"
        placeholder="Start typing to Search"
        prepend-icon="mdi-finance"
        return-object
      ></v-autocomplete>
    </v-card-text>
    <v-expand-transition>
      <div v-if="model" class="center content-inputs">
        <vs-input
          class="ml-4 mt-6 mb-6 vw-100"
          state="dark"
          dark
          label-placeholder="Symbol"
          v-model="model.Symbol"
          readonly
        />
        <vs-input
          class="ml-4 mt-6 mb-6 vw-100"
          state="dark"
          dark
          label-placeholder="Name"
          v-model="model.Name"
          readonly
        />
        <vs-input
          class="ml-4 mt-6 mb-6 vw-100"
          state="dark"
          dark
          label-placeholder="Currency"
          v-model="model.Currency"
          readonly
        />
        <vs-input
          class="ml-4 mt-6 mb-6 vw-100"
          state="dark"
          dark
          label-placeholder="Price"
          v-model="currentStockPrice"
          readonly
        />
        <vs-input
          class="ml-4 mt-6 mb-6 vw-100"
          type="number"
          :state="parseInt(minvalue) > 0 ? 'success' : 'warn'"
          label-placeholder="Min Price"
          v-model="minvalue"
        />
        <vs-input
          class="ml-4 mt-6 mb-6 vw-100"
          type="number"
          :state="
            parseInt(maxvalue) > 0 && parseInt(maxvalue) >= parseInt(minvalue)
              ? 'success'
              : 'warn'
          "
          label-placeholder="Max Price"
          v-model="maxvalue"
        />
      </div>
    </v-expand-transition>
    <v-card-actions>
      <v-row align="center" justify="end">
        <v-btn
          v-if="model && minvalue > 0 && maxvalue > 0"
          color="green accent-4"
          class="mr-2 mb-2 mt-2"
          text
          @click="saveStockTrigger"
        >
          Add Trigger
          <v-icon right> mdi-save </v-icon>
        </v-btn>
        <v-btn
          v-if="model"
          :disabled="!model"
          class="mr-2 mb-2 mt-2"
          text
          @click="
            model = null;
            minvalue = 0;
            maxvalue = 0;
          "
        >
          Clear
          <v-icon right> mdi-close-circle </v-icon>
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<style scope>
.vw-100 input {
  width: 90%;
}
</style>
<script>
import { messageService } from "../services/message.service";
export default {
  name: "SearchStock",
  data: () => ({
    descriptionLimit: 60,
    stocksData: [],
    isLoading: false,
    model: null,
    search: null,
    minvalue: 0,
    maxvalue: 0,
    currentStockPrice: "0",
    stalkedStocks: [],
  }),
  mounted() {
    if (localStorage.getItem("stalkedStocks")) {
      try {
        this.stalkedStocks = JSON.parse(localStorage.getItem("stalkedStocks"));
      } catch (e) {
        localStorage.removeItem("stalkedStocks");
      }
    }
  },
  computed: {
    fields() {
      if (!this.model) return [];

      let fieldsData = Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
      //console.log(fieldsData);
      return fieldsData;
    },
    items() {
      return this.stocksData.map((entry) => {
        const Name = entry["2. name"]; //"(" + entry["1. symbol"] + ") " +
        const Description =
          Name.length > this.descriptionLimit
            ? Name.slice(0, this.descriptionLimit) + "..."
            : Name;
        const Symbol = entry["1. symbol"];
        const Currency = entry["8. currency"];

        return Object.assign({}, entry, { Symbol, Name, Description, Currency });
      });
    },
  },
  methods: {
    clearValues: function () {
      this.minvalue = 0;
      this.maxvalue = 0;
      this.model = null;
    },
    saveStockTrigger: function () {
      let data = {
        symbol: this.model.Symbol,
        name: this.model.Name,
        min: this.minvalue,
        max: this.maxvalue,
        price: this.currentStockPrice,
      };
      this.saveStocks(data);
      this.clearValues();
    },
    saveStocks(data) {
      //adding to local storage
      let stocksInStorage = JSON.parse(localStorage.getItem("stalkedStocks"));
      stocksInStorage.push(data);
      const parsed = JSON.stringify(stocksInStorage);
      localStorage.setItem("stalkedStocks", parsed);

      messageService.addstock(data);
    },
    getStockPrice(val) {
      fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${escape(
          val
        )}&apikey=L13ZZ6OUR0KJMBTT`
      )
        .then((res) => res.json())
        .then((res) => {
          let data = res["Global Quote"];
          //console.log(data);
          let Price = data["05. price"];
          this.currentStockPrice = Price == 0 ? "Unable to load right now" : Price;
        })
        .catch((err) => {
          this.currentStockPrice = "Unable to load";
          console.log(err);
        });
    },
  },
  watch: {
    search(val) {
      //console.log(val);
      if (val == null || val == undefined || val == "") return;
      // Items have already been loaded
      //if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      //https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=L13ZZ6OUR0KJMBTT
      // Lazily load input items
      fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${escape(
          val
        )}&apikey=L13ZZ6OUR0KJMBTT`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res != undefined && res.bestMatches != undefined) {
            this.count = res.bestMatches.length;
            this.stocksData = res.bestMatches;
          } else {
            this.count = 0;
            this.stocksData = [];
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
    model(val, oldval) {
      //watch you code here
      //console.log(oldval);
      if (val != undefined && val != oldval) {
        this.getStockPrice(val.Symbol);
      }
    },
  },
};
</script>
