// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyArFO_pSZkO46nbDpYxsJPgaWJcGckWOQY",
  authDomain: "zentra-4268c.firebaseapp.com",
  databaseURL: "https://zentra-4268c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zentra-4268c",
  storageBucket: "zentra-4268c.firebasestorage.app",
  messagingSenderId: "381782975324",
  appId: "1:381782975324:web:5608cfc6c3ecf4160f5799",
  measurementId: "G-KPV0CV89G2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Set auth persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Auth persistence error:', error);
});

export { auth, db, googleProvider };
