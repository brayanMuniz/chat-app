import firebase from '../../firebaseConfig'
let db = firebase.db
export default {
    name: 'room',
    props: {
        roomUID: String
    },
    data() {
        return {
            chatRoomData: null
        }
    },
    methods: {
        getChatUpdate() {
            db.collection('chatRooms').doc(this.roomUID).onSnapshot(docData => {
                this.chatRoomData = docData.data()
                console.log('​getChatUpdate -> doc', docData.data())
            })
        },
    },
    created() {
        if (this.roomUID == null) {
            this.$router.push('/')
        }
        console.log(this.roomUID)
        this.getChatUpdate()
    },
}