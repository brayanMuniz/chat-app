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
            usersImgLinks: {}
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
                    console.log('​sendMessages -> res', res);
                    this.scrollChatToBottom();
                }).catch(err => {
                    console.log('​sendMessages -> err', err);
                });
                this.newMessage = null;
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
        } else {
            this.$store.commit('setCurrentRoom', this.roomData.roomId);
        }
        if (this.$store.getters.getProfileImageLink) {
            // dont set the users profile images
        } else {
            let usersProfileImagePath = `Users/${this.$store.getters.getUserAuth.uid}/${this.$store.getters.getUserData.profileImage}`
            this.getProfileImageLink(usersProfileImagePath).then(res => {
                this.$store.commit('updateUserPictureURL', res)
                console.log(res);
            }).catch(err => {
                console.log('TCL: created -> err', err);
            })

        }
        console.log(this.roomData)

    },
    mounted() {
        this.getChatUpdate();
    },
}