/* eslint-disable */
// Todo: when actually writing to firebase use vuelidate for client side
import firebase from '../../firebaseConfig'
let db = firebase.db
export default {
    name: 'landing',
    data() {
        return {
            allUsers: [],
            testUserName: null,
            realTimeData: null
        }
    },
    created() {
        // Do not add another listener one is enough
        this.getRealTimeUserUpdates()
    },
    methods: {
        sendToFirebase() {
            this.$store.dispatch('addTestUser', this.testUserName).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        getRealTimeUserUpdates() {
            db.collection('Users').onSnapshot(doc => {
                console.log(doc)
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
        }
    },
    computed: {}
}