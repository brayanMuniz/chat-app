export default {
    name: 'navbar',
    data() {
        return {
            userName: null
        }
    },
    created() {},
    mounted() {

    },
    methods: {

    },
    computed: {
        getUserName() {
            return this.$store.getters.getUserData.userName
        }
    },
}