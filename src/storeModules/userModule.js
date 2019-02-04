import firebase from '../firebaseConfig'
let firebaseRef = firebase.firebase;
let db = firebase.db;

const state = {
    userAuth: firebaseRef.auth().currentUser,
    userData: {},
    defaultUserImage: 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Flh3.googleusercontent.com%2F-Zs7cWeyXzTI%2FAAAAAAAAAAI%2FAAAAAAAAAB4%2F5PA9c08gzhQ%2Fphoto.jpg&f=1'
}

const getters = {
    getUserData: (state) => {
        if (Object.keys(state.userData).length == 0) {
            return null
        }
        return state.userData;
    },
    getUserAuth: (state) => {
        return state.userAuth;
    },
    getProfileImageLink: (state) => {
        if (Object.keys(state.userData).length == 0 || state.userData.profileImageLink == undefined) {
            console.log(state)
            return state.defaultUserImage
        } else {
            return state.userData.profileImageLink
        }
    },
    isUserSignedIn: (state) => {
        if (Object.keys(state.userData).length == 0 || state.userAuth == null) {
            return false
        } else {
            return true
        }
    },
    isUserVerified: (state) => {
        if (state.userAuth == null) {
            return false;
        } else {
            // ? emailVerified
            return state.userAuth.emailVerified
        }

    }
}

const mutations = {
    setUserAuth(state) {
        state.userAuth = firebaseRef.auth().currentUser;
    },
    setUserData(state, newData) {
        state.userData = newData
    },
    updateUserPictureURL(state, newData) {
        state.userData.profileImageLink = newData;
    },
    clearUser(state) {
        state.userAuth = null;
        state.userData = {};
    }
}

// Do not check for valid data because that should be handled with vue-validate and generally in the clients
const actions = {
    // Making the user;
    createUserWithEmail: ({}, payload) => {
        console.log('createUserWithEmail', payload)
        return new Promise((resolve, reject) => {
            firebaseRef.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            });
        })
    },
    lookForuserName: ({}, userName) => {
        return new Promise((resolve, reject) => {
            db.collection("Users").where("userName", "==", userName).get().then(res => {
                resolve(res)
            }).catch(err => {
                console.log(err)
                reject(err)
            })

        })
    },
    sendEmailVerification: ({}) => {
        return new Promise((resolve, reject) => {
            firebaseRef.auth().currentUser.sendEmailVerification().then((res) => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    createUserInDB: ({
        commit
    }, payload) => {
        // Todo: add Datecreated 
        // Todo: configure rules in firebase so only the user with his UID can change his data
        return new Promise((resolve, reject) => {
            let userUID = firebaseRef.auth().currentUser.uid
            db.collection('Users').doc(userUID).set(payload).then(res => {
                console.log('createUserInDB', res)
                commit('setUserData', payload)
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })

    },
    makeNewUser: ({
        dispatch,
        commit
    }, payload) => {
        console.log('makeNewUser', payload)
        return new Promise((resolve, reject) => {
            dispatch('createUserWithEmail', payload.signUp).then(madeUser => {
                commit('setUserAuth')
                // If either of these fail then the new user will be deleted
                // ? If the email does not exist how does it send it over to it
                Promise.all([dispatch('sendEmailVerification'), dispatch('createUserInDB', payload.newUserData)]).then(res => {
                    console.log('TCL: res', res)
                    resolve(madeUser)
                }).catch(err => {
                    console.log('Failed one of them', err)
                    dispatch('deleteUser').catch(deletedNewUser => {
                        reject(deletedNewUser)
                    })
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
    // Updating users data
    updateProfileImgLink: ({
        commit,
        dispatch
    }, filePath) => {
        return new Promise((resolve, reject) => {
            dispatch('getPicture', filePath).then(imageLink => {
                commit('updateUserPictureURL', imageLink)
                let userDoc = db.collection('Users').doc(firebaseRef.auth().currentUser.uid)
                userDoc.update({
                    profileImageLink: imageLink
                }).then(result => {
                    resolve(result)
                })
            }).catch(err => {
                console.log('TCL: err', err)
                reject(err)
            })
        })
    },
    // Getting user data
    getUserData: ({
        commit
    }) => {
        let userUID = firebaseRef.auth().currentUser.uid
        return new Promise((resolve, reject) => {
            db.collection('Users').doc(userUID).get().then(querySnapshot => {
                commit('setUserData', querySnapshot.data())
                resolve(querySnapshot.data())
            }).catch(err => {
                reject(err)
            })
        })
    },
    readAllUsers: () => {
        // One Time read
        return new Promise((resolve, reject) => {
            db.collection('Users').get().then(querySnapshot => {
                resolve(querySnapshot)
            }).catch(err => {
                reject(err)
            })
        })
    },

    logInUserAuth: ({
        commit,
        dispatch
    }, payload) => {
        return new Promise((resolve, reject) => {
            firebaseRef.auth().signInWithEmailAndPassword(payload.email, payload.password).then(res => {
                commit('setUserAuth')
                dispatch('getUserData').then(res => {
                    console.log(res)
                    resolve(res)
                }).catch(err => {
                    console.log(err)
                })
            }).catch(error => {
                reject(error)
            });
        })
    },
    // Sign Out User
    signOutUserAuth: ({}) => {
        return new Promise((resolve, reject) => {
            firebaseRef.auth().signOut().then((res) => {
                console.log('Signed Out');
                resolve(res);
            }, err => {
                console.error('Sign Out Error', error);
                reject(err);
            });
        })
    },
    signOutUserTotal: ({
        dispatch
    }) => {
        return new Promise((resolve, reject) => {
            dispatch('signOutUserAuth').then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    },
    deleteUser: ({}) => {
        return new Promise((resolve, reject) => {
            var user = firebaseRef.auth().currentUser;
            user.delete().then((res) => {
                resolve(res)
            }).catch(err => {
                reject(err)
            });
        })
    },
}

export default {
    actions,
    mutations,
    getters,
    state
}