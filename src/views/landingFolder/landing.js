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
            testImg: null,
            profileImage: null,
            showProfileImg: null
        }
    },
    created() {
        if (this.$store.getters.isUserSignedIn) {
            this.$router.push('/browse')
        }
    },
    methods: {
        userNameCheck(userName) {
            return this.$store.dispatch('lookForuserName', userName)
        },
        makeNewUser() {
            // Todo: add profileImage
            console.log(this.profileImage)
            this.userNameCheck(this.testUserName).then(res => {
                console.log(res)
                if (res.empty) {
                    console.log('user Name Not taken')
                    // make the user
                    let newUserData = {
                        userName: this.testUserName,
                        dateCreated: new Date(),
                        profileImage: this.profileImage.name
                    }
                    let signUp = {
                        email: this.email,
                        password: this.password
                    }
                    this.newUser['signUp'] = signUp
                    this.newUser['newUserData'] = newUserData
                    console.log(this.newUser)
                    this.$store.dispatch('makeNewUser', this.newUser).then(res => {
                        console.log('TCL: makeNewUser -> res', res)
                        if (this.profileImage == null || res.user.uid == null) {
                            console.log('No Profile Image for the user ')
                            this.$router.push('/browse')
                        } else {
                            let fullPath = `Users/${res.user.uid}/${this.profileImage.name}`
                            this.uploadProfilePicture(fullPath).then(imageResult => {
                                // Todo: Send a notification of uploaded successfully 
                                console.log(imageResult)
                                this.$router.push('/browse')
                            }).catch(err => {
                                alert('Account was made but image could not be uploaded')
                                console.log(err)
                            })
                        }

                    }).catch(err => {
                        alert('Could not make account')
                        console.log(err)
                    })
                } else {
                    alert('User Name taken')
                }
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
                this.$router.push('/browse')
            }).catch(err => {
                console.log('​signIn -> err', err)
            })
        },
        uploadProfilePicture(path) {
            // Todo: verify that roomPicture is a actual file\
            // Todo: add metadata
            let fileData = {
                file: this.profileImage,
                path: path
            }
            return this.$store.dispatch('uploadPicture', fileData)
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
        // File changes
        // Todo: change room picture to profileImage
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.profileImage = files[0];
            this.createImage(files[0]);
        },
        createImage(file) {
            var reader = new FileReader();

            reader.onload = (e) => {
                this.showProfileImg = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        removeImage() {
            this.showProfileImg = null;
            this.profileImage = null;
        },
        // Upload
        uploadFile() {

        }
    },
    computed: {}
}