import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

const firebaseConfig = {

};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

async function verificarEmailNoDatabase(email) {
    const dbRef = ref(getDatabase(app));

    const emailFormatado = email.trim().toLowerCase();
    
    try {
        const snapshot = await get(child(dbRef, 'users'));
        if (snapshot.exists()) {
            let emailEncontrado = false;
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.email.trim().toLowerCase() === emailFormatado) {
                    emailEncontrado = true;
                }
            });

            if (emailEncontrado) {
                return true;
            } else {
                alert("Email não encontrado no banco de dados.");
                return false;
            }
        } else {
            alert("Nenhum usuário encontrado no banco de dados.");
            return false;
        }
    } catch (error) {
        console.error("Erro ao buscar email no banco de dados:", error);
        return false;
    }
}

async function loginComFirebase(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    
    const email = emailInput.value;
    const senha = senhaInput.value;

    const emailExiste = await verificarEmailNoDatabase(email);
    if (!emailExiste) return;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            
            window.location.href = "home.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Erro ao fazer login: ${errorMessage}`);
        });
}


document.getElementById('btn-entrar').addEventListener('click', loginComFirebase);

document.getElementById('login').addEventListener('submit', function (event) {
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    if (!emailInput.validity.valid || !senhaInput.validity.valid) {
        event.preventDefault();
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
});

