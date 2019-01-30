import firebase from '../../firebaseConfig'
import moment from 'moment'
let firebaseRef = firebase.firebase;
let db = firebase.db;

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
            usersImgLinks: {},
            defaultUser: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Flh3.googleusercontent.com%2F-Zs7cWeyXzTI%2FAAAAAAAAAAI%2FAAAAAAAAAB4%2F5PA9c08gzhQ%2Fphoto.jpg&f=1",
            roomMsgLength: 0
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
                if (this.roomMsgLength < this.chatRoomMessages.length) {
                    this.scrollChatToBottom()
                    this.roomMsgLength = this.chatRoomMessages.length
                }
            })

        },
        getRoomUpdate() {
            db.collection('chatRooms').doc(this.roomData.roomId).onSnapshot(doc => {
                console.log('TCL: getRoomUpdate -> doc', doc.data())
                this.roomData.roomData.users = doc.data().users
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
            if (this.newMessage == null || this.newMessage.length > 1000 || this.newMessage.length == 0) {
                alert('stop it');
            } else {
                this.$store.dispatch('sendMessageToRoom', payload).then(res => {
                    console.log('​sendMessageToRoom -> res', res);
                    this.scrollChatToBottom();
                }).catch(err => {
                    console.log('​sendMessageToRoom -> err', err);
                });
                this.newMessage = null;
                this.addUserToChat()
            }
        },
        addUserToChat() {
            // decoupple these later
            let userAlreadyInChat = false
            this.roomData.roomData.users.forEach(user => {
                console.log('TCL: addUserToChat -> user', user)
                if (user.userUID == firebaseRef.auth().currentUser.uid) {
                    userAlreadyInChat = true
                }
            })
            if (userAlreadyInChat) {
                console.log('Doing nothing')
            } else {
                this.$store.dispatch('addUserToChat', this.roomData.roomId).then(res => {
                    console.log('TCL: addUserToChat -> res', res)
                }).catch(err => {
                    console.log('TCL: addUserToChat -> err', err)
                })
            }
        },
        convertTime(time) {
            return moment.unix(time).format("MMMM Do, h:mm:ss")
        },
        scrollChatToBottom() {
            let chatMSGScroll = document.getElementById('card_msg_body');
            chatMSGScroll.scrollTo(0, chatMSGScroll.scrollHeight)
        },
        getProfileImageLink(path) {
            return this.$store.dispatch('getPicture', path)
        },
        matchUserToProfilePic(userUID) {
            if (userUID in Object.keys(this.usersImgLinks)) {
                return null;
            } else {
                // add userImgLink to it
            }
        }
    },
    created() {
        if (this.roomData == null || this.$store.getters.getUserData == null) {
            this.$router.push('/');
        }
        console.log(this.roomData)
    },
    mounted() {
        this.getChatUpdate();
        this.getRoomUpdate();
    },
    computed: {
        userImageProfileLink() {
            if (this.$store.getters.getProfileImageLink == null) {
                return this.defaultUser
            }
            return this.$store.getters.getProfileImageLink
        }
    },
}