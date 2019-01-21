import firebase from '../firebaseConfig'
let db = firebase.db
const state = {

}
const getters = {

}
const mutations = {

}

const actions = {
    makeNewRoom: ({}, roomData) => {
        // Todo: Add the user UID to it for the initial room creation 
        // There will be a global like UID, but for now use test
        let myUID = 'n5XZ51yjn9k2Eh4jb7iS'
        return new Promise((resolve, reject) => {
            db.collection('chatRooms').add({
                users: [myUID],
                roomName: roomData.roomName
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    deleteRoom: (roomID) => {
        // Make sure that user is an owner in that room
        
    },
    textToToom: (roomID, respondTo) => {}
}

export default {
    actions,
    mutations,
    getters,
    state
}