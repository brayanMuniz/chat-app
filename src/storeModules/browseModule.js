// This module is going to be for both user expirience and saving time between firebase calls
const state = {
    // objects inside sjhould be each of the messages
    recentRoomData: [],
}

const getters = {
    getRecentRoomData(state) {
        return state.recentRoomData
    }
}

const mutations = {
    changeRecentRoomData(state, newRoomData) {
        state.recentRoomData = newRoomData
    }
}

const actions = {}

export default {
    actions,
    mutations,
    getters,
    state
}