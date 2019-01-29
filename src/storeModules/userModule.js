import firebase from '../firebaseConfig'
import router from '../router'
let firebaseRef = firebase.firebase
let db = firebase.db
let firestoreRoot = firebase.firebase.firestore
const state = {
    userAuth: firebaseRef.auth().currentUser,
    userData: null
}
const getters = {
    getUserData: (state) => {
        return state.userData;
    },
    getUserAuth: (state) => {
        return state.userAuth;
    },
    getProfileImageLink: (state) => {
        if (state.userData == null) {
            console.log(state)
            return null
        } else {
            console.log(state.userData.profileImageLink)
            return state.userData.profileImageLink
        }
    },
    isAUserSignedIn: (state) => {
        if (state.userData == null || state.userAuth == null) {
            // redirect user to landing page
        }
    },
    isUserVerified: (state) => {
        if (state.userAuth == null) {
            return false;
        } else {
            // ? emailVerified
            return state.userAuth
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
        state.userData = null;
    }
}

// Do not check for valid data because that should be handled with vue-validate and generally in the clients
const actions = {
    // User Firebase Auth API 
    // After the user signs up send them an email verification and add them to the databases
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
        return new Promise((resolve, reject) => {
            let userUID = firebaseRef.auth().currentUser.uid
            commit('setUserData', payload)
            // Todo: configure rules in firebase so only the user with his UID can change his data
            db.collection('Users').doc(userUID).set(payload).then(res => {
                console.log('createUserInDB', res)
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })

    },
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
    addUsersRooms: ({
            commit,
            dispatch
        },
        roomData) => {
        let userUID = firebaseRef.auth().currentUser.uid
        let userRef = db.collection('Users').doc(userUID)
        // roomData should have the roomName and room Id
        return new Promise((resolve, reject) => {
            userRef.update({
                rooms: firestoreRoot.FieldValue.arrayUnion(roomData)
            }).then(res => {
                console.log(res)
                resolve(res)
            }).catch(err => {
                console.log('​err', err)
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
        commit,
        dispatch
    }) => {
        return new Promise((resolve, reject) => {
            dispatch('signOutUserAuth').then(res => {
                commit('clearUser');
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    },
    deleteUser: ({
        commit
    }) => {
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