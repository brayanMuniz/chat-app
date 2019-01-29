export default {
    name: 'navbar',
    data() {
        return {
            userName: null
        }
    },
    beforeCreate() {
    },
    created() {},
    mounted() {

    },
    methods: {
        signOutUser() {
            this.$store.dispatch('signOutUserTotal').then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        }
    },
    computed: {
        getUserName() {
            return this.$store.getters.getUserData.userName
        }
    },
}