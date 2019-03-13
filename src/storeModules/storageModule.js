import firebase from '../firebaseConfig'
let storage = firebase.firebase.storage();

const state = {}
const getters = {}
const mutations = {}
const actions = {
    getPicture({}, filePath) {
        console.log('GettingPIcture...')
        return new Promise((resolve, reject) => {
            storage.ref(filePath).getDownloadURL().then(url => {
                console.log('Got Picture')
                resolve(url);
            }).catch(err => {
                console.log('TCL: getStorage -> err', err)
                reject(err);
            })
        })
    },
    uploadPicture({}, fileData) {
        return new Promise((resolve, reject) => {
            // To have a progress bar set storage.ref().put into a variable and get its snapshot
            // Todo: when the upload is complete try to get the url link so you can upload it later
            storage.ref(fileData.path).put(fileData.file).then(res => {
                console.log('TCL: uploadPicture -> res', res)
                resolve(res)
            }).catch(err => {
                console.log('TCL: uploadPicture -> err', err)
                reject(err)
            })
        })
    }
}

export default {
    actions,
    mutations,
    getters,
    state
}