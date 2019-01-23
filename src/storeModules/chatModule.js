import firebase from '../firebaseConfig'
let firebaseRef = firebase.firebase
let db = firebase.db

const state = {

}
const getters = {

}
const mutations = {

}

const actions = {
    makeNewRoom: ({
        getters
    }, roomData) => {
        // ! Does not work until todo done()
        // Todo: set roomData correctlysa
        // Tip: Do not try to access state directly instead use getters to get it and commit to mutate it
        let myUID = firebaseRef.auth().currentUser.uid
        let userName = getters.getUserData.userName
        return new Promise((resolve, reject) => {
            db.collection('chatRooms').add({
                users: [{
                    userName: userName,
                    userUID: myUID
                }],
                roomName: roomData.roomName,
                dateCreated: roomData.dateCreated
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    deleteRoom: ({}, roomID) => {
        // Make sure that user is an owner in that room
    },
    textToToom: ({
        dispatch,
        getters
    }, roomData) => {
        // To(index of the array to respond to), From(userName), Message(String), dateSent(date) 
    }
}

export default {
    actions,
    mutations,
    getters,
    state
}