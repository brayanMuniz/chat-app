export default {
    data() {
        return {

        }
    },
    created() {
        // this.$store.dispatch('loadChats')
    },
    computed: {
        chats() {
            return this.$store.getters.chats
        }
    }
}