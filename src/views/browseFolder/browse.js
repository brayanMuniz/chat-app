/* eslint-disable */
import moment from 'moment'
import firebase from '../../firebaseConfig'
let db = firebase.db
export default {
    name: 'browse',
    data() {
        return {
            allRooms: [],
            newRoomName: null,
            newRoomDesc: null
        }
    },
    // Todo: use the mehtods from projectModule.jss
    methods: {
        getRealTimeChatRooms() {
            // use.doc(roomUID) to get realtime updates there
            db.collection('chatRooms').onSnapshot(doc => {
                this.allRooms = [];

                doc.docs.forEach(kek => {
                    console.log(kek.data())
                    if (kek.exists) {
                        let room = {
                            roomId: kek.id,
                            roomData: kek.data()
                        }
                        this.allRooms.push(room)
                    }
                })
            })
        },
        convertTime(time) {
            return moment.unix(time).format("MMMM Do")
        },
        makeNewRoom() {
            let roomData = {
                roomName: this.newRoomName,
                dateCreated: new Date(),
                roomDescription: this.newRoomDesc
            }
            this.$store.dispatch('makeNewRoom', roomData).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
    },
    created() {

    },
    mounted() {
        this.getRealTimeChatRooms()
    }
}