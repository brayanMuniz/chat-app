/* eslint-disable */
import cardComp from '../../components/cardsComp/cards.vue'
import firebase from '../../firebaseConfig.js';
let db = firebase.db;
export default {
    name: 'banned',
    data() {
        return {
            allRooms: [],
        };
    },
    components: {
        'card-component': cardComp
    },
    methods: {
        getHiddenChatRooms() {
            // todo: figure out if it is more cost effective to get a colleciton or read each room one by one  
            this.$store.getters.getHiddenRoomsIDs.forEach(roomId => {
                db.collection('chatRooms').doc(roomId).get().then(doc => {
                    console.log('TCL: getHiddenChatRooms -> doc', doc)
                    if (doc.exists) {
                        let room = {
                            roomId: doc.id,
                            roomData: doc.data()
                        };
                        let fullPath = `chatRooms/${room.roomId}/${room.roomData.roomPicture}`;
                        this.getPicture(fullPath)
                            .then((res) => {
                                room['urlPicture'] = res;
                                this.allRooms.push(room);
                            })
                            .catch((err) => {
                                console.log('TCL: getRealTimeChatRooms -> err', err);
                                room['urlPicture'] = null;
                                this.allRooms.push(room);
                            });
                    }
                }).catch(err => {
                    console.log('TCL: getHiddenChatRooms -> err', err)
                })
            })
        },
        getPicture(filePath) {
            return this.$store.dispatch('getPicture', filePath);
        }
    },
    created() {
        this.getHiddenChatRooms()
    }
}