import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA5pNSBabWSVvulRMUexHv8kqiCyAQZgeA",
  authDomain: "project3-b6fa0.firebaseapp.com",
  projectId: "project3-b6fa0",
  storageBucket: "project3-b6fa0.appspot.com",
  messagingSenderId: "948301348899",
  appId: "1:948301348899:web:7d7f97417d1f036f82f196",
  measurementId: "G-371W1FFFMP"
};

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')



export {
  auth, usersCollection, songsCollection, commentsCollection, storage,
}
