import firebase from '../firebaseConfig'
import room from '../views/roomFolder/room';
let firebaseRef = firebase.firebase
let db = firebase.db

const state = {
    currentRoom: null
}
const getters = {
    currentRoom(state) {
        return state.currentRoom
    }
}
const mutations = {
    // This will be for when the user reloads the page
    setCurrentRoom(state, newRoomUID) {
        state.currentRoom = newRoomUID
    }
}

const actions = {
    // Update the user rooms in his own data
    makeNewRoom: ({
        getters
    }, roomData) => {
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
                dateCreated: roomData.dateCreated,
                msgLength: 0
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        });
    },
    // Way later
    inviteUserToChatRoom: ({}, payload) => {

    },
    deleteRoom: ({}, roomID) => {
        // Make sure that user is an owner in that room
    },
    sendMessageToRoom: ({
        dispatch,
        getters
    }, payload) => {
        let roomData = payload.msgData
        return new Promise((resolve, reject) => {
            dispatch('changeRoomMSGLength', payload.roomId).then(res => {
                db.collection('chatRooms').doc(payload.roomId).collection('messages').add(
                        roomData
                    ).then(function () {
                        console.log("Document successfully written!");
                        resolve()
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                        reject()
                    });
            })

        })

    },
    // abstract this with a an additional parameter saying if you want to add or subtract it and by how much
    changeRoomMSGLength: ({}, roomId) => {
        let roomRef = db.collection('chatRooms').doc(roomId)
        return new Promise((resolve, reject) => {
            db.runTransaction(transaction => {
                return transaction.get(roomRef).then(res => {
                    console.log(res)
                    if (res.exists) {
                        let newRoomAmount = res.data().msgLength + 1;
                        transaction.update(roomRef, {
                            msgLength: newRoomAmount
                        })
                    }
                }).catch(err => {
                    reject(err)
                })
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export default {
    actions,
    mutations,
    getters,
    state
}