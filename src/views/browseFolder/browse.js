/* eslint-disable */
import moment from 'moment'
import firebase from '../../firebaseConfig'
let db = firebase.db
let firebaseRef = firebase.firebase
export default {
    name: 'browse',
    data() {
        return {
            allRooms: [],
            newRoomName: null,
            newRoomDesc: null,
            roomPicture: null,
            roomPictureUpload: null,
            dialog: false
        }
    },
    created() {},
    // Todo: use the mehtods from projectModule.jss
    methods: {
        getRealTimeChatRooms() {
            // use.doc(roomUID) to get realtime updates there
            db.collection('chatRooms').orderBy('dateCreated').onSnapshot(doc => {
                this.allRooms = [];
                doc.docs.forEach(kek => {
                    if (kek.exists) {
                        let room = {
                            roomId: kek.id,
                            roomData: kek.data()
                        }
                        let fullPath = `chatRooms/${room.roomId}/${room.roomData.roomPicture}`
                        this.getPicture(fullPath).then(res => {
                            room['urlPicture'] = res
                            this.allRooms.push(room)
                        }).catch(err => {
                            console.log('TCL: getRealTimeChatRooms -> err', err)
                            room['urlPicture'] = null;
                            this.allRooms.push(room)

                        })
                    }
                })
            })
        },
        convertTime(time) {
            return moment.unix(time).format("MMMM Do");
        },
        makeNewRoom() {
            // ! Room Picture gave an undefined 
            let roomData = this.setNewRoomData();
            this.$store.dispatch('makeNewRoom', roomData).then(res => {
                this.dialog = false;
                console.log(res.id)
                let fullPath = `chatRooms/${res.id}/${this.roomPictureUpload.name}`
                if (this.roomPicture == null || res.id == null) {
                    console.log('did not');
                } else {
                    this.uploadRoomPicture(fullPath).then(res => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        hideCard(roomId) {
            console.log('TCL: hideCard -> roomId', roomId)
            var index;
            this.allRooms.forEach(room => {
                if (room.roomId == roomId) {
                    index = this.allRooms.indexOf(room)
                }
            })
            if (index > -1) {
                this.allRooms.splice(index, 1);
            }
            // Find the card in this.allRooms and then delete it locally

        },
        setNewRoomData() {
            let myUID = firebaseRef.auth().currentUser.uid;
            let userName = this.$store.getters.getUserData.userName;
            let userProfileImage = this.$store.getters.getProfileImageLink
            let roomData = {
                roomName: this.newRoomName,
                msgLength: 0,
                dateCreated: new Date(),
                roomDescription: this.newRoomDesc,
                roomPicture: this.roomPictureUpload.name,
                users: [{
                    userName: userName,
                    userUID: myUID,
                    dateJoined: new Date(),
                    userProfileImage: userProfileImage
                }]
            }
            console.log(roomData);
            return roomData
        },
        getPicture(filePath) {
            return this.$store.dispatch('getPicture', filePath)
        },
        uploadRoomPicture(path) {
            // Todo: verify that roomPicture is a actual file\
            // Todo: add metadata
            let fileData = {
                file: this.roomPictureUpload,
                fileMeta: {},
                path: path
            }
            console.log(path)
            return this.$store.dispatch('uploadPicture', fileData)
        },
        // File changes
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.roomPictureUpload = files[0];
            this.createImage(files[0]);
        },
        createImage(file) {
            var reader = new FileReader();

            reader.onload = (e) => {
                this.roomPicture = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        removeImage() {
            this.roomPicture = null;
            this.roomPictureUpload = null;
        },
    },
    mounted() {
        this.getRealTimeChatRooms()
    }
}