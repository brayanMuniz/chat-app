import firebase from '../../firebaseConfig';
import moment from 'moment';
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
            defaultUser: 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Flh3.googleusercontent.com%2F-Zs7cWeyXzTI%2FAAAAAAAAAAI%2FAAAAAAAAAB4%2F5PA9c08gzhQ%2Fphoto.jpg&f=1',
            roomMsgLength: 0,
            dropdown_font: ['Arial', 'Calibri', 'Courier', 'Verdana'],
            attachImage: false,
            attachmentPictureUpload: null,
            attachmentPicture: null,
            hoverPicture: false,
            seeImage: {
                show: false,
                imageUrl: null
            }
        };
    },
    methods: {
        getChatUpdate() {
            db
                .collection('chatRooms')
                .doc(this.roomData.roomId)
                .collection('messages')
                .orderBy('dateSent', 'desc')
                .limit(15)
                .onSnapshot((docData) => {
                    console.log('TCL: getChatUpdate -> docData', docData);
                    this.chatRoomMessages = [];
                    // docData.docs.reverse()
                    docData.docs.forEach((message) => {
                        if (message.exists) {
                            let msg = {
                                messageId: message.id,
                                messageData: message.data()
                            };

                            this.chatRoomMessages.push(msg);
                        }
                    });
                    this.chatRoomMessages.reverse();
                    console.log(this.chatRoomMessages);
                });
        },
        getRoomUpdate() {
            db.collection('chatRooms').doc(this.roomData.roomId).onSnapshot((doc) => {
                console.log('TCL: getRoomUpdate -> doc', doc.data());
                this.roomData.roomData.users = doc.data().users;
            });
        },
        sendMessage() {
            this.attachImage = false;
            let payload = this.setMessagePayload();

            if (this.attachmentPictureUpload) {
                payload.msgData['messagePicture'] = this.attachmentPictureUpload.name;
                console.log(payload);
                this.sendMessageToFirebase(payload)
                    .then((res) => {
                        console.log('TCL: sendMessageToFirebase -> res', res);
                        this.sendPicture()
                            .then((pictureSucc) => {
                                console.log('TCL: sendMessage -> pictureSucc', pictureSucc);
                                this.setMessagePictureURL(res.path, pictureSucc.ref.fullPath)
                                    .then((setUrl) => {
                                        console.log('TCL: sendMessage -> setUrl', setUrl);
                                    })
                                    .catch((setUrlErr) => {
                                        console.log('TCL: sendMessage -> setUrlErr', setUrlErr);
                                    });
                            })
                            .catch((pictureErr) => {
                                console.log('TCL: sendMessage -> pictureErr', pictureErr);
                            })
                        this.attachmentPictureUpload = null;
                        this.attachmentPicture = null;
                        this.newMessage = null;
                    })
                    .catch((err) => {
                        console.log('​sendMessageToRoom -> err', err);
                    });
                return null;
            }

            if (this.newMessage == null || this.newMessage.length > 1000 || this.newMessage.length == 0) {
                alert('stop it');
                this.newMessage = null;
                return null;
            } else {
                this.sendMessageToFirebase(payload).catch((err) => {
                    console.log('​sendMessageToRoom -> err', err);
                });
                this.newMessage = null;
                this.addUserToChat();
            }
        },
        sendMessageToFirebase(payload) {
            return this.$store.dispatch('sendMessageToRoom', payload);
        },
        sendPicture() {
            let roomId = this.roomData.roomId;
            let path = `chatRooms/${roomId}/pictureMessages/${this.attachmentPictureUpload.name}`;
            let fileData = {
                file: this.attachmentPictureUpload,
                fileMeta: {},
                path: path
            };
            console.log(fileData);
            return this.$store.dispatch('uploadPicture', fileData);
        },
        setMessagePictureURL(messageDocId, filePath) {
            let payload = {
                messageDocId: messageDocId,
                filePath: filePath
            };
            console.log('TCL: setMessagePictureURL -> payload', payload)
            return this.$store.dispatch('setMessagePictureUrl', payload);
        },
        setMessagePayload() {
            return {
                msgData: {
                    newMessage: this.newMessage,
                    dateSent: new Date(),
                    messagePicture: null,
                    messagePictureURL: null,
                    from: {
                        userName: this.$store.getters.getUserData.userName,
                        userUID: firebase.firebase.auth().currentUser.uid
                    }
                },
                roomId: this.roomData.roomId
            };
        },
        addUserToChat() {
            // decoupple these later
            let userAlreadyInChat = false;

            this.roomData.roomData.users.forEach((user) => {
                if (user.userUID == firebaseRef.auth().currentUser.uid) {
                    userAlreadyInChat = true;
                }
            });

            if (userAlreadyInChat) {
                console.log('Doing nothing');
            } else {
                this.$store
                    .dispatch('addUserToChat', this.roomData.roomId)
                    .then((res) => {
                        console.log('TCL: addUserToChat -> res', res);
                    })
                    .catch((err) => {
                        console.log('TCL: addUserToChat -> err', err);
                    });
            }
        },
        getProfileImageLink(path) {
            return this.$store.dispatch('getPicture', path);
        },
        matchUserToProfilePic(userUID) {
            let usersProfilePictureLink = this.defaultUser;

            this.roomData.roomData.users.forEach((user) => {
                if (user.userUID == userUID) {
                    usersProfilePictureLink = user.userProfileImage;
                }
            });

            return usersProfilePictureLink;
        },
        isUsersMessage(userUID) {
            if (userUID == this.$store.getters.getUserAuth.uid) {
                return true;
            }
            return false;
        },
        convertTime(time) {
            return moment.unix(time).format('MMMM Do, h:mm:ss');
        },
        imagePopUp(imageUrl) {
            if (imageUrl == undefined) {
                alert('err')
                return false
            }
            this.seeImage.imageUrl = imageUrl;
            this.seeImage.show = true;
        },
        imageClose() {
            this.seeImage.show = false
            this.seeImage.imageUrl = null;
        },
        // File changes
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            this.attachmentPictureUpload = files[0];
            this.createImage(files[0]);
        },
        createImage(file) {
            var reader = new FileReader();

            reader.onload = (e) => {
                this.attachmentPicture = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        removeImage() {
            this.attachmentPicture = null;
            this.attachmentPictureUpload = null;
        }
    },
    created() {
        console.log(this.roomData);
        if (this.roomData == undefined) {
            this.$router.push('/browse');
        }
    },
    mounted() {
        this.getChatUpdate();
        this.getRoomUpdate();
    },
    computed: {
        userImageProfileLink() {
            if (this.$store.getters.getProfileImageLink == null) {
                return this.defaultUser;
            }
            return this.$store.getters.getProfileImageLink;
        }
    }
};