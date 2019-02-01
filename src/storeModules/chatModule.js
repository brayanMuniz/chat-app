import firebase from '../firebaseConfig'
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

    }, roomData) => {
        // Todo: set roomData correctlysa
        // Tip: Do not try to access state directly instead use getters to get it and commit to mutate it
        return new Promise((resolve, reject) => {
            db.collection('chatRooms').add(roomData).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        });
    },
    sendMessageToRoom: ({
        dispatch,
    }, payload) => {
        let roomData = payload.msgData
        return new Promise((resolve, reject) => {
            dispatch('changeRoomMSGLength', payload.roomId).then(res => {
                db.collection('chatRooms').doc(payload.roomId).collection('messages').add(
                        roomData
                    ).then(res => {
                        console.log("Document successfully written!");
                        resolve(res);
                    })
                    .catch(error => {
                        console.error("Error writing document: ", error);
                        reject(error);
                    });
            })

        })
    },
    // abstract this with a an additional parameter saying if you want to add or subtract it and by how much
    changeRoomMSGLength: ({}, roomId) => {
        let roomRef = db.collection('chatRooms').doc(roomId);
        return new Promise((resolve, reject) => {
            db.runTransaction(transaction => {
                return transaction.get(roomRef).then(res => {
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
    },
    addUserToChat: ({
        getters
    }, roomId) => {
        return new Promise((resolve, reject) => {

            let myUID = firebaseRef.auth().currentUser.uid;
            let userName = getters.getUserData.userName;
            // ? Link might not be defined on initial render
            let userProfileImage = getters.getProfileImageLink;

            let userData = {
                userName: userName,
                userUID: myUID,
                userProfileImage: userProfileImage,
                dateJoined: new Date()
            }

            db.collection('chatRooms').doc(roomId).update({
                users: firebaseRef.firestore.FieldValue.arrayUnion(userData)
            }).then(res => {
                console.log('TCL: res', res)
                resolve(res)
            }).catch(err => {
                console.log('TCL: err', err)
                reject(err)
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