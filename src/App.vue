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
  },
  created() {
    let firebaseRef = firebase.firebase;
    firebaseRef.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setUserAuth");
        if (this.$store.state.userData == null) {
          this.$store
            .dispatch("getUserData")
            .then(userDataGotten => {
              this.$store.commit("setUserData", userDataGotten);
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        this.$store.commit("clearUser");
      }
    });
  }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
</style>
