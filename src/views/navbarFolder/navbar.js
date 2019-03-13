export default {
    name: 'navbar',
    data() {
        return {
            userName: null,
            drawer: null,
        }
    },
    methods: {
        signOutUser() {
            this.$store.dispatch('signOutUserTotal')
        }
    },
    computed: {
        getUserName() {
            return this.$store.getters.getUserData.userName
        }
    },
}