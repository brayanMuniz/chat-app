import firebase from 'firebase'
let config = {
    apiKey: "AIzaSyBbJ1EGfkB5xVzVCKHn4uWHF-vZ9Q62tO8",
    authDomain: "chat-app-f27df.firebaseapp.com",
    databaseURL: "https://chat-app-f27df.firebaseio.com",
    projectId: "chat-app-f27df",
    storageBucket: "chat-app-f27df.appspot.com",
    messagingSenderId: "916628150615"
}
firebase.initializeApp(config);
let db = firebase.firestore();
// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});
export default {
    firebase,
    db
}