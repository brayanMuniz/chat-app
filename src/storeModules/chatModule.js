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
                messsagesLength: 0
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        });
    },
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
        console.log('​roomData', roomData)
        // stringInterpolitatoin => 'chatRooms/
        db.collection('chatRooms').doc(payload.roomId).collection('messages').add(
                roomData
            ).then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    },
    incrementRoomMSGLength: ({
    }, roomId) => {
        db.collection('chatRooms').doc(roomId).update({
            "messagesLength": 1
        })
    }
}

export default {
    actions,
    mutations,
    getters,
    state
}