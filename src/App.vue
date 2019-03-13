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
    // Todo porfavor make this async and await i can bearly read what i wrote
    let firebaseRef = firebase.firebase;
    firebaseRef.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setUserAuth");
        if (this.userHasNoData()) {
          this.getUserData()
            .then(userDataGotten => {
              this.$store.commit("setUserData", userDataGotten);
              if (this.userPicExist()) {
                let usersProfileImagePath = `Users/${
                  this.$store.getters.getUserAuth.uid
                }/${this.$store.getters.getUserData.profileImage}`;
                this.getUserProfilePic().then(res => {
                  this.$store.commit("updateUserPictureURL", res);
                });
              }
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
  methods: {
    userPicExist() {
      if (
        this.$store.getters.getUserData == null ||
        this.$store.getters.getUserData.profileImage == null ||
        this.$store.getters.getUserData.profileImageLink == null
      ) {
        return false;
      }
      return true;
    },
    userHasNoData() {
      if (this.$store.getters.userData == null) {
        return true;
      }
    },
    async getUserData() {
      return this.$store.dispatch("getUserData");
    },
    async getUserProfilePic() {
      let usersProfileImagePath = `Users/${
        this.$store.getters.getUserAuth.uid
      }/${this.$store.getters.getUserData.profileImage}`;
      return this.$store.dispatch("getPicture", usersProfileImagePath);
    }
  }
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

