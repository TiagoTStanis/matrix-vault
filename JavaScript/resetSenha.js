import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6n7JhbgbZdz6RHMo8-HgYONd7p0DWNbE",
    authDomain: "matrix-vault-24d73.firebaseapp.com",
    databaseURL: "https://matrix-vault-24d73-default-rtdb.firebaseio.com/",
    projectId: "matrix-vault-24d73",
    storageBucket: "gs://matrix-vault-24d73.appspot.com",
    messagingSenderId: "394346850942",
    appId: "1:394346850942:web:4afd163917908b924bc62f",
    measurementId: "G-D7W7E85SQG"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

function resetPassword(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Email de redefinição de senha enviado!");
            alert("Verifique seu email para redefinir sua senha.");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Erro ${errorCode}: ${errorMessage}`);
            alert("Erro ao tentar redefinir a senha. Verifique o email fornecido.");
        });
}

document.querySelector('.btn-submit-esqueci').addEventListener('click', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    if (email) {
        resetPassword(email);
    } else {
        alert('Por favor, insira um email válido.');
    }
});