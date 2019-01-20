<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import navbar from "./views/navbarFolder/navbar.vue";
import footer from "./views/footerFolder/footer.vue";
import firebase from "./firebaseConfig.js";

export default {
  name: "app",
  components: {
    "app-header": navbar,
    "app-footer": footer
  }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
</style>
