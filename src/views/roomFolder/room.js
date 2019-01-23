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
            db.collection('chatRooms').doc(this.roomUID).collection('messages').onSnapshot(docData => {
                this.chatRoomMessages = []
                docData.docs.forEach(message => {
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
            this.$store.dispatch('sendMessageToRoom', payload).then(res => {
                console.log('​sendMessages -> res', res)
            }).catch(err => {
                console.log('​sendMessages -> err', err)
            })
        },
        convertTime(time) {
            return moment.unix(time).format("MMMM Do, h:mm:ss a")
        }
    },
    created() {
        if (this.roomUID == null) {
            this.$router.push('/')
        } else {
            console.log(this.roomUID)
            this.getChatUpdate()
        }

    },
}