import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBGEDpGjjjHf19fzijHbL7SuK04wGrE-1Q",
    authDomain: "instagram-clone-df516.firebaseapp.com",
    projectId: "instagram-clone-df516",
    storageBucket: "instagram-clone-df516.appspot.com",
    messagingSenderId: "1082555326318",
    appId: "1:1082555326318:web:9848c75694dc7aba372b7f",
    measurementId: "G-N21JDLJ5L5"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db, auth, storage}