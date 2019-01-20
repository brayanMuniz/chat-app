import firebase from '../firebaseConfig'
let db = firebase.db
const state = {

}
const getters = {

}
const mutations = {

}

const actions = {
    readAllUsers: () => {
        // Add the user UID to it
        return new Promise((resolve, reject) => {
            db.collection('Users').get().then(querySnapshot => {
                resolve(querySnapshot)
            }).catch(err => {
                reject(err)
            })
        })
    },
    deleteRoom: (roomID) => {
        // Make sure that user is an owner in that room
    },
    addTestUser: ({}, payload) => {

        return new Promise((resolve, reject) => {
            db.collection('Users').add({
                userName: payload
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    makeNewUser: (userData) => {
        // Use firebase auth API
    }
}

export default {
    actions,
    mutations,
    getters,
    state
}