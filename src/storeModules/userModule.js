import firebase from '../firebaseConfig'
let firebaseRef = firebase.firebase
let db = firebase.db
const state = {
    userAuth: firebaseRef.auth().currentUser,
    userData: null
}
const getters = {
    getUserData: (state) => {
        return state.userData
    },
}
const mutations = {
    setUserAuth(state) {
        state.userAuth = firebaseRef.auth().currentUser
    },
    setUserData(state, newData) {
        state.userData = newData
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
            db.collection('Users').doc(userUID).set({
                userName: payload.userName
            }).then(res => {
                console.log('createUserInDB', res)
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })

    },
    getUserData: ({}) => {
        let userUID = firebaseRef.auth().currentUser.uid
        return new Promise((resolve, reject) => {
            db.collection('Users').doc(userUID).get().then(querySnapshot => {
                resolve(querySnapshot.data())
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
                Promise.all([dispatch('sendEmailVerification'), dispatch('createUserInDB', payload.newUserData)]).then(res => {
                    resolve(res)
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
    logInUser: ({}, payload) => {
        return new Promise((resolve, reject) => {
            firebaseRef.auth().signInWithEmailAndPassword(payload.email, payload.password).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            });
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