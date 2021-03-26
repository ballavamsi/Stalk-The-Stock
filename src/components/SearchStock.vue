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
            <vs-input class="ml-4 mt-6 mb-6 vw-100" state="dark" dark label-placeholder="Symbol" v-model="model.Symbol" readonly/>
            <vs-input class="ml-4 mt-6 mb-6 vw-100" state="dark" dark label-placeholder="Name" v-model="model.Name" readonly/>
            <vs-input class="ml-4 mt-6 mb-6 vw-100" state="dark" dark label-placeholder="Currency" v-model="model.Currency" readonly/>
            <vs-input :loaded="getStockPrice(model.Symbol)" class="ml-4 mt-6 mb-6 vw-100" state="dark" dark label-placeholder="Price" v-model="currentStockPrice" readonly/>
            <vs-input class="ml-4 mt-6 mb-6 vw-100" type="number" :state="minvalue > 0? 'success' : 'warn'" label-placeholder="Min Price" v-model="minvalue"/>
            <vs-input class="ml-4 mt-6 mb-6 vw-100" type="number" :state="maxvalue > 0? 'success' : 'warn'" label-placeholder="Max Price" v-model="maxvalue"/>
      </div>
    </v-expand-transition>
    <v-card-actions>
    
      <v-row align="center" justify="end">
        <v-btn v-if="model && minvalue > 0 && maxvalue > 0" color="green accent-4" class="mr-2 mb-2 mt-2" text @click="saveStockTrigger">
          Add Trigger
          <v-icon right> mdi-save </v-icon>
        </v-btn>
        <v-btn v-if="model" :disabled="!model" class="mr-2 mb-2 mt-2" text @click="model = null">
          Clear
          <v-icon right> mdi-close-circle </v-icon>
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<style scope>
 .vw-100 input{
   width: 90%;
 }
</style>
<script>
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
    currentStockPrice: 0
  }),

  computed: {
    fields() {
      if (!this.model) return [];

      let fieldsData = Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
      console.log(fieldsData);
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
    saveStockTrigger: function(){
      let data = {'symbol': this.model["Symbol"] , 'min' : this.minvalue, 'max': this.maxvalue};
      console.log(data);
    },
    async getStockPrice(val){
      await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${escape(val)}&apikey=L13ZZ6OUR0KJMBTT`)
        .then((res) => res.json())
        .then((res) => {
          let data = res["Global Quote"];
          console.log(data);
          let Price = data["05. price"];
          this.currentStockPrice = Price;
      });
    }
  },
  watch: {
    search(val) {
      console.log(val);
      // Items have already been loaded
      if (this.items.length > 0) return;

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
  },
};
</script>
