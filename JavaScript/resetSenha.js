import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
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
