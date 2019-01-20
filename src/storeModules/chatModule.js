import firebase from '../firebaseConfig'
const state = {

}
const getters = {

}
const mutations = {

}

const actions = {
    makeNewRoom: (roomName) => {
        // Add the user UID to it
        return new Promise((resolve, reject) => {
            resolve()
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