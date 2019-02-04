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
  beforeCreate() {
    let firebaseRef = firebase.firebase;
    firebaseRef.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setUserAuth");
        if (this.$store.state.userData == null) {
          this.$store
            .dispatch("getUserData")
            .then(userDataGotten => {
              this.$store.commit("setUserData", userDataGotten);
              let usersProfileImagePath = `Users/${
                this.$store.getters.getUserAuth.uid
              }/${this.$store.getters.getUserData.profileImage}`;
              this.$store
                .dispatch("getPicture", usersProfileImagePath)
                .then(res => {
                  this.$store.commit("updateUserPictureURL", res);
                })
                .catch(err => {
                  console.log("TCL: beforeCreate App.vue -> err", err);
                });
            })
            .catch(err => {
              console.log("TCL: beforeCreate -> err", err);
            });
        }
      } else {
        this.$store.commit("clearUser");
        this.$router.push("/");
      }
    });
  },
  created() {}
};
</script>

<style lang="scss">
// Todo: The goal is to elimante all of bootstrap
// Todo: When done uninstall bootstrap
@import "~bootstrap/scss/bootstrap";
$material-design-icons-font-path: "~material-design-icons-iconfont/dist/fonts/";
@import "~material-design-icons-iconfont/src/material-design-icons";
</style>
<style>
@import "~vuetify/dist/vuetify.min.css";
</style>

