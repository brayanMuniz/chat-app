import firebase from '../../firebaseConfig'
import moment from 'moment'
let db = firebase.db
export default {
    name: 'room',
    props: {
        roomUID: String
    },
    data() {
        return {
            chatRoomMessages: [],
            newMessage: null
        }
    },
    methods: {
        getChatUpdate() {
            db.collection('chatRooms').doc(this.roomUID).collection('messages').orderBy('dateSent').onSnapshot(docData => {
                console.log(docData)
                this.chatRoomMessages = []
                docData.docs.forEach(message => {
                    console.log(message)
                    if (message.exists) {
                        let msg = {
                            messageId: message.id,
                            messageData: message.data()
                        }
                        this.chatRoomMessages.push(msg)
                    }
                })
            })
        },
        sendMessage() {
            // Todo: figure out a way to order the documnets
            let payload = {
                msgData: {
                    newMessage: this.newMessage,
                    dateSent: new Date(),
                    from: {
                        userName: this.$store.getters.getUserData.userName,
                        userUID: firebase.firebase.auth().currentUser.uid
                    }
                },
                roomId: this.roomUID,
            }

            if (this.newMessage == null || this.newMessage.length > 250) {
                alert('stop it');
            } else {
                this.newMessage = null
                this.$store.dispatch('sendMessageToRoom', payload).then(res => {
                    console.log('​sendMessages -> res', res);
                }).catch(err => {
                    console.log('​sendMessages -> err', err);
                });
            }

        },
        convertTime(time) {
            return moment.unix(time).format("MMMM Do, h:mm:ss a")
        },
        organizeByDate() {

        }
    },
    created() {
        if (this.roomUID == null) {
            this.$router.push('/');
        } else {
            this.$store.commit('setCurrentRoom', this.roomUID);
            console.log(this.roomUID);
            this.getChatUpdate();
        }

        // else if (this.$store.getters.currentRoom) {
        //     // get user data
        // }
    },
}