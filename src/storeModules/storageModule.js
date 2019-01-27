import firebase from '../firebaseConfig'
let storage = firebase.firebase.storage();
const state = {

}
const getters = {

}
const mutations = {

}
const actions = {
    getPicture({}, filePath) {
        console.log(filePath)
        return new Promise((resolve, reject) => {
            storage.ref(filePath).getDownloadURL().then(url => {
                console.log(url)
                resolve(url)
            }).catch(err => {
                console.log('TCL: getStorage -> err', err)
                reject(err)
            })
        })
    },
    uploadPicture({}, fileData) {
        return new Promise((resolve, reject) => {
            storage.ref().child(fileData.path).put(fileData.file).then(res => {
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