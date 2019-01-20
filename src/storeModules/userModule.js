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
            db.collection('Users').get().then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    deleteRoom: (roomID) => {
        // Make sure that user is an owner in that room
    }
}

export default {
    actions,
    mutations,
    getters,
    state
}