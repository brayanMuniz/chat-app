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
            newUser: {},
            email: null,
            password: null,
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
        // New User Methodss
        userNameCheck(userName) {
            return this.$store.dispatch('lookForuserName', userName)
        },
        makeNewUser() {
            // Todo: add profileImage
            console.log(this.profileImage)
            this.userNameCheck(this.testUserName).then(userNameTaken => {
                if (userNameTaken.empty) {
                    this.setNewUserData();
                    // make the user => set profile image
                    this.$store.dispatch('makeNewUser', this.newUser).then(newMadeUser => {
                        console.log('TCL: makeNewUser -> newMadeUser', newMadeUser);
                        this.$router.push('/browse')
                        this.uploadProfilePicture(newMadeUser.user.uid).then(uploadProfile => {
                            console.log('TCL -> uploadProfile', uploadProfile)
                            this.setProfilePicture(newMadeUser.user.uid).then(setProfile => {
                                console.log('Set the users profileImageLink')
                            }).catch(err => {
                                console.log('TCL: makeNewUser -> err', err)
                            })
                        }).catch(err => {
                            console.log('TCL: makeNewUser -> err', err)
                        })
                    }).catch(err => {
                        alert('Could not make account')
                        console.log(err)
                    })
                } else {
                    alert('User Name taken')
                }
            }).catch(err => {
                // ! Err without pic
                alert("There was a problem on our side")
                console.log(err)
            })

        },
        uploadProfilePicture(newUserUid) {
            if (this.profileImage == null || newUserUid == null) {
                console.log('No Profile Image for the user ')
                this.$router.push('/browse')
                return Promise.reject("There was no data to submit to firebase")
            } else {
                // Todo: add metadata
                let fullPath = `Users/${newUserUid}/${this.profileImage.name}`
                let fileData = {
                    file: this.profileImage,
                    path: fullPath
                }
                return this.$store.dispatch('uploadPicture', fileData)
            }

        },
        setProfilePicture(newUserUid) {
            let userImagePath = `Users/${newUserUid}/${this.profileImage.name}`
            return this.$store.dispatch('updateProfileImgLink', userImagePath)
        },
        setNewUserData() {
            console.log('Making User')
            let newUserData = {
                userName: this.testUserName,
                dateCreated: new Date(),
                profileImage: this.profileImage.name || null,
                profileImageLink: null
            }
            let signUp = {
                email: this.email,
                password: this.password
            }
            this.newUser['signUp'] = signUp
            this.newUser['newUserData'] = newUserData
            console.log(this.newUser)
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
    }
}