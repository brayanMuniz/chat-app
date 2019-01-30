export default {
    name: 'user',
    // use Props to pass the users uid to fetch data
    data() {
        return {
            userData: {}
        }
    },
    methods: {},
    created() {
        if (this.$store.getters.isUserSignedIn) {
            this.userData = this.$store.getters.getUserData
        } else {
            this.$router.push('/')
        }
    },
}