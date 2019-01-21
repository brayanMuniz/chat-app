/* eslint-disable */
// Todo: when actually writing to firebase use vuelidate for client side
import firebase from '../../firebaseConfig'
let db = firebase.db
export default {
    name: 'landing',
    data() {
        return {
            allUsers: [],
            allRooms: [],
            testUserName: null,
            myUserUID: 'n5XZ51yjn9k2Eh4jb7iS',
            testRoomName: null
        }
    },
    created() {
        // Do not add another listener one is enough
        this.getRealTimeUserUpdates();
        this.getRealTimeChatRooms();
    },
    methods: {
        // user
        makeNewUser() {
            this.$store.dispatch('addTestUser', this.testUserName).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },

        // rooms
        makeNewRoom() {
            let roomData = {
                roomName: this.testRoomName
            }
            this.$store.dispatch('makeNewRoom', roomData).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        // Live Updates
        getRealTimeUserUpdates() {
            db.collection('Users').onSnapshot(doc => {
                this.allUsers = [];
                doc.docs.forEach(kek => {
                    if (kek.exists) {
                        let user = {
                            userId: kek.id,
                            userData: kek.data()
                        }
                        this.allUsers.push(user)
                    }
                })
            })
        },
        getRealTimeChatRooms() {
            db.collection('chatRooms').onSnapshot(doc => {
                this.allRooms = [];
                doc.docs.forEach(kek => {
                    if (kek.exists) {
                        let room = {
                            roomId: kek.id,
                            roomData: kek.data()
                        }
                        this.allRooms.push(room)
                    }
                })
            })
        },
    },
    computed: {}
}