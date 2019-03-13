import firebase from '../firebaseConfig'
let storage = firebase.firebase.storage();

const state = {}
const getters = {}
const mutations = {}
const actions = {
    async getPicture({}, filePath) {
        console.log('GettingPIcture...')
        return storage.ref(filePath).getDownloadURL()
    },
    async uploadPicture({}, fileData) {
        return storage.ref(fileData.path).put(fileData.file)
    }
}

export default {
    actions,
    mutations,
    getters,
    state
}