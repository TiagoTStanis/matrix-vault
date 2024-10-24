import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, set, ref, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6n7JhbgbZdz6RHMo8-HgYONd7p0DWNbE",
    authDomain: "matrix-vault-24d73.firebaseapp.com",
    databaseURL: "https://matrix-vault-24d73-default-rtdb.firebaseio.com/",
    projectId: "matrix-vault-24d73",
    storageBucket: "matrix-vault-24d73.appspot.com",
    messagingSenderId: "394346850942",
    appId: "1:394346850942:web:4afd163917908b924bc62f",
    measurementId: "G-D7W7E85SQG"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);
const auth = getAuth(app);

/* ============ nome ============ */

var chaveNome = false;

document.getElementById('nome').addEventListener('input', function () {
    validaNome();
});

document.getElementById('nome').addEventListener('blur', function () {
    this.value = this.value.trim();
    validaNome();
});

function validaNome() {
    const nome = document.getElementById('nome').value;
    const nomeError = document.getElementById('nomeError');
    const regexNomeCompleto = /^[A-Za-z]{2,}(\s[A-Za-z]{2,})+$/;

    if (nome.length > 2) {
        if (regexNomeCompleto.test(nome)) {
            nomeError.style.display = 'none';
            document.getElementById('nome').style.border = '3px solid #00ff00';
            chaveNome = true;
        } else {
            nomeError.style.display = 'block';
            nomeError.classList.add('glitch-effect');
            document.getElementById('nome').style.border = '3px solid #00FF00';
            chaveNome = false;
        }
    } else {
        nomeError.style.display = 'none';
        document.getElementById('nome').style.border = '1px solid #00ff00';
        chaveNome = false;
    }
}

/* ============ Email ============ */

var chaveEmail = false;

document.getElementById('email').addEventListener('input', function () {
    validaEmail();
});

document.getElementById('email').addEventListener('blur', function () {
    this.value = this.value.trim();
    validaEmail();
});



function validaEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var countEmail = " ";

    countEmail = emailInput.value;


    if (countEmail.length > 0) {
        if (emailPattern.test(emailInput.value)) {
            emailError.style.display = 'none';
            emailInput.style.border = '3px solid #00ff00';
            chaveEmail = true;
        } else {
            emailError.style.display = 'block';
            emailError.classList.add('glitch-effect');
            emailInput.style.border = '3px solid #00FF00';
            chaveEmail = false;
        }
    } else {
        emailError.style.display = 'none';
        emailInput.style.border = '1px solid #00ff00';
        chaveEmail = false;
    }
}

/* ============ celular ============ */

var chaveTel = false;

document.getElementById('telefone').addEventListener('click', function () {
    verificaDDDEmTelefone();
});

document.getElementById('telefone').addEventListener('focus', function () {
    verificaDDDEmTelefone();
})

function verificaDDDEmTelefone() {
    const dddList = document.getElementById('ddd-list');
    const selectedDdd = document.getElementById('selected-ddd');
    const inputTelefone = document.getElementById('telefone');
    const erroTelefone = document.getElementById('erroTelefone');

    function selecionarDDD(event) {
        const dddSelecionado = event.target.textContent.trim();
        selectedDdd.textContent = dddSelecionado;
        dddList.style.display = 'none';
        erroTelefone.style.display = 'none';
    }

    dddList.addEventListener('click', selecionarDDD);

    const dddSelecionado = selectedDdd.textContent.trim();

    var countTel = "";
    countTel = inputTelefone.value;

    if (countTel.length > 0 && dddSelecionado != 'DDD') {
        erroTelefone.style.display = 'none';
        inputTelefone.style.border = '3px solid #00ff00';
        chaveTel = true;
    } else {
        if (dddSelecionado === 'DDD') {
            erroTelefone.style.display = 'block';
            erroTelefone.classList.add('glitch-effect');
            inputTelefone.style.border = '3px solid red';
            chaveTel = false;
        } else {
            erroTelefone.style.display = 'none';
            inputTelefone.style.border = '1px solid #00ff00';
            chaveTel = false;
        }
    }
}

/* ============ senha ============ */

var chaveSenhasCoincide = false, chaveForcaSenha = false;

document.getElementById('toggleSenha').addEventListener('click', function () {
    toggleSenhaVisibility(document.getElementById('senha'), document.getElementById('toggleSenha'));
});

document.getElementById('toggleConfirmaSenha').addEventListener('click', function () {
    toggleSenhaVisibility(document.getElementById('confirmaSenha'), document.getElementById('toggleConfirmaSenha'));
});

document.getElementById('senha').addEventListener('input', function () {
    validaForcaSenha();
    validaConfirmaSenha();
});

document.getElementById('senha').addEventListener('blur', function () {
    if (chaveForcaSenha) {
        document.getElementById('forcaSenha').style.display = 'none';
    } else {
        document.getElementById('forcaSenha').style.display = 'block';
    }
});

document.getElementById('confirmaSenha').addEventListener('input', function () {
    validaConfirmaSenha();
});

document.addEventListener("DOMContentLoaded", function () { validaForcaSenha(); });

document.getElementById('confirmaSenha').addEventListener('blur', function () {
    if (chaveSenhasCoincide) {
        document.getElementById('equalSenha').style.display = 'none';
    } else {
        document.getElementById('equalSenha').style.display = 'block';
    }
});

function validaConfirmaSenha() {
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;
    const equalSenha = document.getElementById('equalSenha');

    if (senha.length > 0 && confirmaSenha.length > 0) {

        if (senha === confirmaSenha) {
            equalSenha.innerHTML = '✔️ As senhas coincidem';
            equalSenha.style.color = 'green';
            equalSenha.style.display = 'block';
            document.getElementById('confirmaSenha').style.border = '3px solid #00ff00';
            chaveSenhasCoincide = true;
        } else {
            equalSenha.innerHTML = '❌ As senhas não coincidem';
            equalSenha.style.color = 'red';
            equalSenha.style.display = 'block';
            equalSenha.classList.add('glitch-effect');
            document.getElementById('confirmaSenha').style.border = '3px solid red';
            chaveSenhasCoincide = false;
        }
    } else {
        document.getElementById('confirmaSenha').style.border = '1px solid #00ff00';
        chaveSenhasCoincide = false;
    }
}

function validaForcaSenha() {
    const senha = document.getElementById('senha').value;
    const forcaSenha = document.getElementById('forcaSenha');
    const listaRequisitos = [];
    var countForcaSenhaValid = 0;

    if (senha.length >= 8) {
        listaRequisitos.push('✔️ Pelo menos 8 caracteres');
        countForcaSenhaValid++;
    } else {
        listaRequisitos.push('❌ Pelo menos 8 caracteres');
        countForcaSenhaValid--;
    }

    if (/[A-Z]/.test(senha)) {
        listaRequisitos.push('✔️ Pelo menos uma letra maiúscula');
        countForcaSenhaValid++;
    } else {
        listaRequisitos.push('❌ Pelo menos uma letra maiúscula');
        countForcaSenhaValid--;
    }

    if (/[a-z]/.test(senha)) {
        listaRequisitos.push('✔️ Pelo menos uma letra minúscula');
        countForcaSenhaValid++;
    } else {
        listaRequisitos.push('❌ Pelo menos uma letra minúscula');
        countForcaSenhaValid--;
    }

    if (/\d/.test(senha)) {
        listaRequisitos.push('✔️ Pelo menos um número');
        countForcaSenhaValid++;
    } else {
        listaRequisitos.push('❌ Pelo menos um número');
        countForcaSenhaValid--;
    }

    if (/[\W_]/.test(senha)) {
        listaRequisitos.push('✔️ Pelo menos um caractere especial');
        countForcaSenhaValid++;
    } else {
        listaRequisitos.push('❌ Pelo menos um caractere especial');
        countForcaSenhaValid--;
    }

    forcaSenha.innerHTML = listaRequisitos.join('<br>');
    forcaSenha.style.display = 'block';
    forcaSenha.classList.add('glitch-effect');

    if (senha.length > 0) {
        if (countForcaSenhaValid > 0) {
            document.getElementById('senha').style.border = '3px solid #00ff00';
            chaveForcaSenha = true;
        } else {
            document.getElementById('senha').style.border = '3px solid red';
            chaveForcaSenha = false;
        }
    } else {
        document.getElementById('senha').style.border = '1px solid #00ff00';
        chaveForcaSenha = false;
    }
}


function toggleSenhaVisibility(inputField, toggleIcon) {
    if (inputField.type === "password") {
        inputField.type = "text";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    } else {
        inputField.type = "password";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    }
}

/* ============ DNS ============ */

var chaveDataDeNascimento = false;

document.getElementById('data_nascimento').addEventListener('input', function () {
    validaDataNascimento();
});

function validaDataNascimento() {
    const dataNascimento = new Date(document.getElementById('data_nascimento').value);
    const erroDataNascimento = document.getElementById('erroDataNascimento');
    const hoje = new Date();

    if (!isValidDate(dataNascimento)) {
        erroDataNascimento.innerText = 'Data de nascimento inválida.';
        erroDataNascimento.style.display = 'block';
        erroDataNascimento.classList.add('glitch-effect');
        document.getElementById('data_nascimento').style.border = '3px solid red';
        chaveDataDeNascimento = false;
        return;
    }

    if (dataNascimento > hoje) {
        erroDataNascimento.innerText = 'A data de nascimento não pode ser no futuro.';
        erroDataNascimento.style.display = 'block';
        erroDataNascimento.classList.add('glitch-effect');
        document.getElementById('data_nascimento').style.border = '3px solid red';
        chaveDataDeNascimento = false;
        return;
    }

    const idade = calculaIdade(dataNascimento);

    if (idade < 18) {
        erroDataNascimento.innerText = 'Você deve ter pelo menos 18 anos.';
        erroDataNascimento.style.display = 'block';
        erroDataNascimento.classList.add('glitch-effect');
        document.getElementById('data_nascimento').style.border = '3px solid red';
        chaveDataDeNascimento = false;
    } else {
        erroDataNascimento.style.display = 'none';
        document.getElementById('data_nascimento').style.border = '3px solid #00ff00';
        chaveDataDeNascimento = true;
    }
}

function calculaIdade(dataNascimento) {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    return idade;
}

function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

/* ============ genero ============ */

function validaGenero() {
    const masculino = document.getElementById('masculinoRadio').checked;
    const feminino = document.getElementById('femininoRadio').checked;
    const generoError = document.getElementById('erroGeneroDNS');

    if (masculino || feminino) {
        generoError.style.display = 'none';
        return true;
    } else {
        return false;
    }
}

/* ============ pais ============ */

function validaPais() {
    const pais = document.getElementById('pais');
    const erroPais = document.getElementById('erroPais');

    if (pais.value === "") {
        return false;
    } else {
        erroPais.style.display = 'none';
        pais.style.borderColor = '#00ff00';
        return true;
    }
}

/* ============ btn para cadastrar-se ============ */

async function generateKey() {
    const key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

async function encryptPassword(password, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        data
    );

    return { encryptedData: encrypted, iv: iv };
}

async function decryptPassword(encryptedData, key, iv) {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

async function saveUserData(userData) {
    const key = await generateKey();

    const { encryptedData, iv } = await encryptPassword(document.getElementById('senha').value, key);

    //const decryptedPassword = await decryptPassword(encryptedData, key, iv);
    //console.log("Senha descriptografada:", decryptedPassword);

    const userRef = ref(db, 'users/' + userData.userId);

    set(userRef, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        ddd: userData.ddd,
        birthDate: userData.birthDate,
        gender: userData.gender,
        country: userData.country,
        password: encryptedData,
        createdAt: new Date().toISOString()
    })
        .then(() => {
            console.log("");
        })
        .catch((error) => {
            console.error("Error saving user data: ", error);
        });
}

async function checkEmailExists(email) {
    const db = getDatabase();

    const emailRef = query(ref(db, 'users'), orderByChild('email'), equalTo(String(email)));

    try {
        const snapshot = await get(emailRef);
        if (snapshot.exists()) {
            console.log("Email já cadastrado.");
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao verificar email:", error);
        return false;
    }
}

function autenticandoEmail() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            
            const user = userCredential.user;
            console.log("Usuário autenticado com sucesso:", user);

            window.location.href = 'perfil.html';  
        })
        .catch((error) => {

            const errorMessage = error.message;
            console.log("Erro no login: " + errorMessage);

        });
}

document.querySelector('.btn-submit').addEventListener('click', async function (event) {
    event.preventDefault();
    let formIsValid = true;

    if (!chaveNome) {
        formIsValid = false;
    }

    if (!chaveEmail) {
        formIsValid = false;
    }

    if (!chaveTel) {
        formIsValid = false;
    }

    if (!chaveSenhasCoincide || !chaveForcaSenha) {
        formIsValid = false;
    }

    if (!chaveDataDeNascimento) {
        formIsValid = false;
    }

    if (!validaGenero()) {
        formIsValid = false;
    }

    if (!validaPais()) {
        formIsValid = false;
    }

    let errorMessage = document.getElementById('erroSubmit');

    if (!formIsValid) {
        alert("Erro: ❌ Por favor, preecha todos os campos.");

        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 88000);
    } else {
        const emailExists = await checkEmailExists(document.getElementById('email').value);

        if (emailExists) {
            alert("O e-mail já está cadastrado!");
        } else {
            const ddd = document.getElementById('selected-ddd').textContent.trim();
            const userCredential = await createUserWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('senha').value);
            const user = userCredential.user;

            const userData = {
                name: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('telefone').value,
                ddd: ddd,
                birthDate: document.getElementById('data_nascimento').value,
                gender: document.querySelector('input[name="genero"]:checked')?.value || "Não informado",
                country: document.getElementById('pais').value,
                password: document.getElementById('senha').value,
                userId: user.uid
            };

            await saveUserData(userData);

            autenticandoEmail();
        }
    }
});
