import moment from 'moment';
export default {
    name: 'cardComponent',
    // todo: add another prop property called type
    // todo:  either says hide or unhide or none so i can make it dynamic for the views
    props: {
        room: Object,
        show: Boolean
    },
    data: () => ({
        showCardText: false
    }),
    created() {},
    methods: {
        // computed With parameters
        showAmountOfUsers(usersAmount) {
            if (usersAmount == 1) {
                return `${usersAmount} user`;
            }
            return `${usersAmount} users`;
        },
        convertTime(time) {
            return moment.unix(time).format('MMMM Do');
        },
        updateCardInStore(roomId) {
            console.log('TCL: updateCardInStore -> roomId', roomId)
            let payload = {
                newId: roomId,
                addId: this.show
            };
            this.$store.commit('updateUserHiddenrooms', payload);
        },
        // @click='$router.push({ name: "room", params: { roomName: room.roomData.roomName, roomData: room }
        pushToChatRoom(room) {
            this.$router.push({
                name: 'room',
                params: {
                    roomName: room.roomData.roomName,
                    roomData: room
                }
            })
        }
    },
    computed: {
        typeOfAction() {
            if (this.show) {
                return 'hide';
            }
            return 'unhide';
        }
    }
};