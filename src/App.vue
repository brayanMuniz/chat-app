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
      }
    });
  },
  created() {}
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
</style>
