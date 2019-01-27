import firebase from '../../firebaseConfig'
import moment from 'moment'
let db = firebase.db
export default {
    name: 'room',
    props: {
        roomData: Object
    },
    data() {
        return {
            chatRoomMessages: [],
            chatRoomData: null,
            newMessage: null,
        }
    },
    methods: {
        getChatUpdate() {
            db.collection('chatRooms').doc(this.roomData.roomId).collection('messages').orderBy('dateSent').onSnapshot(docData => {
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
                this.scrollChatToBottom()
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
                roomId: this.roomData.roomId,
            }
            if (this.newMessage == null || this.newMessage.length > 1000) {
                alert('stop it');
            } else {
                this.$store.dispatch('sendMessageToRoom', payload).then(res => {
                    console.log('​sendMessages -> res', res);
                }).catch(err => {
                    console.log('​sendMessages -> err', err);
                });
                this.newMessage = null;
            }
        },
        convertTime(time) {
            return moment.unix(time).format("MMMM Do, h:mm:ss a")
        },
        scrollChatToBottom() {
            let chatMSGScroll = document.getElementById('card_msg_body');
            chatMSGScroll.scrollTo(0, chatMSGScroll.scrollHeight)
        }
    },
    created() {
        if (this.roomData == null) {
            this.$router.push('/');
        } else {
            this.$store.commit('setCurrentRoom', this.roomData.roomId);
        }
    },
    mounted() {
        this.getChatUpdate();
    },
}