import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyBz3o1YgacJNA7rJeWhUX7qACEcph0xj6c",
    authDomain: "devportifolio-ff745.firebaseapp.com",
    projectId: "devportifolio-ff745",
    storageBucket: "devportifolio-ff745.appspot.com",
    messagingSenderId: "935025773642",
    appId: "1:935025773642:web:0911bafd72ceb3307beab3",
    measurementId: "G-8YVNRD1XHH"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
