export default {
    name: 'room',
    props: {
        roomUID: String
    },
    data() {
        return {}
    },
    methods: {},
    created() {
        console.log(this.roomUID)
    },
}