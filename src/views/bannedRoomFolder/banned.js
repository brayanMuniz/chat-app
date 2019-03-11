/* eslint-disable */
import cardComp from '../../components/cardsComp/cards.vue';
import firebase from '../../firebaseConfig.js';
import async from 'async'
let db = firebase.db;

export default {
    name: 'banned',
    data() {
        return {
            allRooms: []
        };
    },
    components: {
        'card-component': cardComp
    },
    methods: {
        async getHiddenChatRooms() {
            // todo: Figure out if it is more cost effective to get a colleciton or read each room one by one
            async.each(this.$store.getters.getHiddenRoomsIDs, async roomId => {
                // Developer note: Remeber to keep using anonymus funciotns otherwise "this" will not work
                let doc = await db.collection('chatRooms').doc(roomId).get()
                if (doc.exists) {

                    let room = {
                        roomId: doc.id,
                        roomData: doc.data()
                    };

                    let fullPath = `chatRooms/${room.roomId}/${room.roomData.roomPicture}`;
                    let roomPicture = await this.getPicture(fullPath)
                    room['urlPicture'] = roomPicture ? roomPicture : null;
                    this.allRooms.push(room);

                }
            }, err => {
                console.log('TCL: test -> err', err);
            })
        },
        async getPicture(filePath) {
            return this.$store.dispatch('getPicture', filePath);
        },
        // Client Rendering
        idInList(roomId) {
            if (this.$store.getters.getHiddenRoomsIDs.includes(roomId)) {
                return true;
            }
            return false;
        },
    },
    created() {
        this.getHiddenChatRooms();
    }
};