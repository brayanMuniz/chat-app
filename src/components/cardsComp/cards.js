import moment from 'moment';
export default {
    name: 'cardComponent',
    props: {
        room: Object
    },
    methods: {
        // computed With parameters
        showAmountOfUsers(usersAmount) {
            if (usersAmount == 1) {
                return `${usersAmount} user`
            }
            return `${usersAmount} users`
        },
        convertTime(time) {
            return moment.unix(time).format('MMMM Do');
        },
        hideCardInStore(roomId) {
            let payload = {
                newId: roomId,
                addId: true
            }
            this.$store.commit('updateUserHiddenrooms', payload);
        },
    }
}