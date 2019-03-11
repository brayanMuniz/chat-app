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
    makeNewRoom: ({}, roomData) => {
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
    async sendMessageToRoom({
        dispatch,
    }, payload) {
        console.log('Sending Message...')
        let roomData = payload.msgData;
        await dispatch('changeRoomMSGLength', payload.roomId)
        return db.collection('chatRooms').doc(payload.roomId).collection('messages').add(roomData)
    },
    async setMessagePictureUrl({
        dispatch,
    }, payload) {
        console.log('Setting Pic Url...')
        let pictureUrl = await dispatch('getPicture', payload.filePath)
        let messageDoc = db.doc(payload.messageDocId)

        return messageDoc.update(({
            messagePictureURL: pictureUrl
        }))
        // return new Promise((resolve, reject) => {
        //     dispatch('getPicture', payload.filePath).then(pictureUrl => {
        //         let messageDoc = db.doc(payload.messageDocId)

        //         messageDoc.update(({
        //             messagePictureURL: pictureUrl
        //         })).then(updatedCorrectly => {
        //             resolve(updatedCorrectly)
        //         }).catch(err => {
        //             reject(err)
        //         })

        //     }).catch(err => {
        //         reject(err)
        //     })

        // })
    },
    // abstract this with a an additional parameter saying if you want to add or subtract it and by how much
    async changeRoomMSGLength({}, roomId) {
        console.log('Changing Room Msg length...')
        let roomRef = await db.collection('chatRooms').doc(roomId);
        let transaction = await db.runTransaction(transaction => {
            return transaction.get(roomRef).then(res => {
                if (res.exists) {
                    let newRoomAmount = res.data().msgLength + 1;
                    transaction.update(roomRef, {
                        msgLength: newRoomAmount
                    })
                }
            })
        })
        console.log('Room Length Change Finish')
        return transaction
    },
    async addUserToChat({
        getters
    }, roomId) {

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
        // ? Returns an undefined Dont know y
        return db.collection('chatRooms').doc(roomId).update({
            users: firebaseRef.firestore.FieldValue.arrayUnion(userData)
        })
    }
}

export default {
    actions,
    mutations,
    getters,
    state
}