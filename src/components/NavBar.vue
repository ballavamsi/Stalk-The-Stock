<template>
    <div class="center examplex">
      <vs-navbar center-collapsed text-white v-model="active" class="heading-bg">
        <template #left>
         <img src="../assets/stalk-the-stock-logo.png" class="logo" alt="stalk-the-stock-logo" />
        </template>
        <vs-navbar-item  :active="active == 'home'" id="home">
          Home
        </vs-navbar-item>
        <vs-navbar-item :active="active == 'about-us'" id="about-us">
          About Us
        </vs-navbar-item>
        <!--<vs-navbar-item :active="active == 'components'" id="components">
          Components
        </vs-navbar-item>
        <vs-navbar-item :active="active == 'license'" id="license">
          license
        </vs-navbar-item>-->
        <!--<template #right>
          <vs-button flat >Login</vs-button>
          <vs-button>Get Started</vs-button>
        </template>-->
      </vs-navbar>
      <div class="square" style="height:100vh;padding-top:100px">
        <Dashboard></Dashboard>
      </div>
    </div>
  </template>
<script>
  import Dashboard from '@/components/Dashboard.vue';
  export default {
    name: "NavBar",
    data:() => ({
      active: 'home'
    }),
    components: {
      Dashboard
    }
  }
</script>
<style scoped>
.heading-bg{
  /*background:linear-gradient(to bottom right, white, #2C4664 );*/
  background:#A8D1E7
}
.logo{
   width:260px;
   height:80px;
}
.square, .grid{
  background: #A8D1E7;
}
</style>

        