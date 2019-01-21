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
            newUser: {},
            testRoomName: null,
            email: null,
            password: null
        }
    },
    created() {
        // Do not add another listener one is enough
        this.getRealTimeUserUpdates();
        this.getRealTimeChatRooms();
    },
    methods: {
        makeNewUser() {
            let newUserData = {
                userName: this.testUserName,
            }
            let signUp = {
                email: this.email,
                password: this.password
            }
            this.newUser['signUp'] = signUp
            this.newUser['newUserData'] = newUserData
            console.log(this.newUser)
            this.$store.dispatch('makeNewUser', this.newUser).then(res => {
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
            // use.doc(roomUID) to get realtime updates there
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