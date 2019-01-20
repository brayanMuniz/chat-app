// ? maybe i can put this in the store
import firebase from '../../firebaseConfig'
import moment from 'moment'
let projectRef = firebase.refProjects;
let userRef = firebase.refUsers;
let firebaseRef = firebase.firebase
export default {
    name: 'user',
    data() {
        return {
            dataLoaded: false,
            userProjects: [],
            userData: {
                userImg: null
            },
            userProjectKeys: null
        }
    },
    methods: {
        getusersProjects() {
            // Todo: get the users data again
            userRef.child(firebaseRef.auth().currentUser.uid).once('value', data => {
                this.$store.state.userData = data.val()
            })
            // if there are no projects return an emtpy array
            let usersProjectKeys = this.$store.getters.getUserProjectKeys
            console.log(usersProjectKeys)
            usersProjectKeys.forEach(element => {
                // be able to read the private data if it is the user who has its
                projectRef.child(element).once('value', data => {
                    this.userProjects.push(data.val())
                })
            });

            console.log(this.userProjects)
            this.dataLoaded = true
        },
        // Todo: set this in store for DRY
        convertTime(unixTime) {
            return moment(unixTime).format('Do MMM YYYY')
        },
        signOutUser() {
            this.$store.dispatch('signOutUser').then(res => {
                console.log('signed Out')
                this.$store.dispatch('clearUser').then(res => {
                    console.log('clear')
                    this.$router.push('/')
                })
            })
        }
    },
    created() {
        if (this.$store.getters.checkUserLog) {
            this.getusersProjects()
        } else {
            this.$router.push('/')
        }
    },
}