import firebase from './firebaseConfig'
let func = firebase.fbFunctions;
console.log('TCL: fbFunctions', func)
console.log(func.httpsCallable)
// Write a funciton when triggered converts the location of the storage into a thumbnail link and inserts it into the location provided

export default {}