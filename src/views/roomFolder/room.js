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
            newMessage: null,
            defaultUser: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Flh3.googleusercontent.com%2F-Zs7cWeyXzTI%2FAAAAAAAAAAI%2FAAAAAAAAAB4%2F5PA9c08gzhQ%2Fphoto.jpg&f=1",
            roomMsgLength: 0
        }
    },
    methods: {
        getChatUpdate() {
            db.collection('chatRooms').doc(this.roomData.roomId).collection('messages').orderBy('dateSent', 'desc').limit(15).onSnapshot(docData => {
                console.log('TCL: getChatUpdate -> docData', docData)
                this.chatRoomMessages = []
                // docData.docs.reverse()
                docData.docs.forEach(message => {
                    if (message.exists) {
                        let msg = {
                            messageId: message.id,
                            messageData: message.data()
                        }

                        this.chatRoomMessages.push(msg)

                    }
                })
                this.chatRoomMessages.reverse()
                console.log(this.chatRoomMessages)

            })

        },
        getRoomUpdate() {
            db.collection('chatRooms').doc(this.roomData.roomId).onSnapshot(doc => {
                console.log('TCL: getRoomUpdate -> doc', doc.data());
                this.roomData.roomData.users = doc.data().users;
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
            console.log(this.newMessage)
            if (this.newMessage == null || this.newMessage.length > 1000 || this.newMessage.length == 0) {
                alert('stop it');
            } else {
                this.$store.dispatch('sendMessageToRoom', payload).then(res => {
                    console.log('​sendMessageToRoom -> res', res);
                }).catch(err => {
                    console.log('​sendMessageToRoom -> err', err);
                });
                this.newMessage = null;
                this.addUserToChat()
            }
        },
        addUserToChat() {
            // decoupple these later
            let userAlreadyInChat = false;

            this.roomData.roomData.users.forEach(user => {
                if (user.userUID == firebaseRef.auth().currentUser.uid) {
                    userAlreadyInChat = true
                }
            });

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
        getProfileImageLink(path) {
            return this.$store.dispatch('getPicture', path)
        },
        matchUserToProfilePic(userUID) {
            let usersProfilePictureLink = this.defaultUser;

            this.roomData.roomData.users.forEach(user => {
                if (user.userUID == userUID) {
                    usersProfilePictureLink = user.userProfileImage
                }
            })

            return usersProfilePictureLink
        }
    },
    created() {
        console.log(this.roomData)
        console.log(this.$store.getters.isUserVerified)
        if (this.roomData == null) {
            this.$router.push('/browse')
        }
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