/* eslint-disable */
// Todo: when actually writing to firebase use vuelidate for client side
import firebase from '../../firebaseConfig'
let firebaseRef = firebase.firebase
let db = firebase.db
let storage = firebase.firebase.storage();
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
            password: null,
            testImg: null
        }
    },
    created() {
        console.log(firebaseRef.auth().currentUser);
        // Do not add another listener one is enough
        this.getRealTimeUserUpdates();
        this.getRealTimeChatRooms();
        this.getStorage()
    },
    methods: {
        makeNewUser() {
            // Todo: add Datecreated 
            let newUserData = {
                userName: this.testUserName,
                dateCreated: new Date()
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
        signIn() {
            let payload = {
                email: this.email,
                password: this.password
            }
            this.$store.dispatch('logInUserAuth', payload).then(res => {
                console.log('​signIn -> res', res)
            }).catch(err => {
                console.log('​signIn -> err', err)
            })
        },
        // rooms
        makeNewRoom() {
            let roomData = {
                roomName: this.testRoomName,
                dateCreated: new Date()
            }
            if (this.testRoomName == null || this.testRoomName.length > 50) {
                alert('stop it')
            } else {
                this.$store.dispatch('makeNewRoom', roomData).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            }

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
                    console.log(kek.data())
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
        getStorage() {
            // storage.ref('VueJs2.png').getDownloadURL().then(url => {
            //     console.log(url)
            //     this.testImg = url
            // }).catch(err => {
            //     console.log('TCL: getStorage -> err', err)
            // })
        },
        uploadFile() {

        }
    },
    computed: {}
}