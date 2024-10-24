import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

/* ============ Foto de Perfil ============ */

document.getElementById('profilePhoto').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profilePhotoView').src = e.target.result;
        }
        reader.readAsDataURL(file);
    } else {
        document.getElementById('photoError').style.display = 'block';
    }
});

/* ============ Telefone ============ */

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

/* ============ db ============ */

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

let userData = {};

function preencherDadosDoPerfil(userId) {
    const dbRef = ref(db);

    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            userData = snapshot.val();

            const nomeInput = document.getElementById('nome');
            if (nomeInput) {
                nomeInput.value = userData.name || "";
            }

            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = userData.email || "";
            }

            const telefoneInput = document.getElementById('telefone');
            if (telefoneInput) {
                telefoneInput.value = userData.phone || "";
            }

            const selectedDdd = document.getElementById('selected-ddd');
            if (selectedDdd && userData.ddd) {
                selectedDdd.textContent = userData.ddd;
            }

            const generoInput = document.querySelector(`input[name="genero"][value="${userData.gender}"]`);
            if (generoInput) {
                generoInput.checked = true;
            }

            const paisSelect = document.getElementById('pais');
            if (paisSelect) {
                paisSelect.value = userData.country || "";
            }

            const dataNascimentoInput = document.getElementById('data_nascimento');
            const idadeInput = document.getElementById('idade');
            if (dataNascimentoInput && userData.birthDate) {
                dataNascimentoInput.value = userData.birthDate;
                const idade = calcularIdade(userData.birthDate);
                idadeInput.value = idade ? `${idade} anos` : "Idade não disponível";
            }

            const profilePhotoView = document.getElementById('profilePhotoView');
            if (profilePhotoView && userData.profilePhotoUrl) {
                profilePhotoView.src = userData.profilePhotoUrl;
            }
        } else {
            console.log("Nenhum dado encontrado.");
        }
    }).catch((error) => {
        console.error("Erro ao buscar os dados:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            preencherDadosDoPerfil(userId);
        } else {
            console.log("Nenhum usuário autenticado.");
            window.location.href = 'index.html';
        }
    });
});

/* ============ btn ============ */

document.getElementById('profileForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nomeAtual = document.getElementById('nome').value;
    const emailAtual = document.getElementById('email').value;
    const telefoneAtual = document.getElementById('telefone').value;
    const dddAtual = document.getElementById('selected-ddd').textContent.trim();
    const generoAtual = document.querySelector('input[name="genero"]:checked') ? document.querySelector('input[name="genero"]:checked').value : "";
    const paisAtual = document.getElementById('pais').value;
    const dataNascimentoAtual = document.getElementById('data_nascimento').value;

    const dadosOriginais = {
        nome: userData.name || "",
        email: userData.email || "",
        telefone: userData.phone || "",
        ddd: userData.ddd || "",
        genero: userData.gender || "",
        pais: userData.country || "",
        dataNascimento: userData.birthDate || "",
        profilePhotoUrl: userData.profilePhotoUrl || ""
    };

    const houveAlteracao = (
        nomeAtual !== dadosOriginais.nome ||
        emailAtual !== dadosOriginais.email ||
        telefoneAtual !== dadosOriginais.telefone ||
        dddAtual !== dadosOriginais.ddd ||
        generoAtual !== dadosOriginais.genero ||
        paisAtual !== dadosOriginais.pais ||
        dataNascimentoAtual !== dadosOriginais.dataNascimento
    );

    const file = document.getElementById('profilePhoto').files[0];
    let fotoDiferente = false;

    if (file) {
        const currentFileName = dadosOriginais.profilePhotoUrl.split('/').pop();
        if (file.name !== currentFileName) {
            fotoDiferente = true;
        }
    }

    if (houveAlteracao || fotoDiferente) {
        const confirmacao = confirm("Houve alterações no perfil. Deseja salvar?");
        if (confirmacao) {
            salvarPerfil({
                nome: nomeAtual,
                email: emailAtual,
                telefone: telefoneAtual,
                ddd: dddAtual,
                genero: generoAtual,
                pais: paisAtual,
                dataNascimento: dataNascimentoAtual
            }, file);
        }else{
            window.location.href = "home.html";
        }
    } else {
        window.location.href = "home.html";
    }
});

function salvarPerfil(dados, file) {
    const userId = auth.currentUser.uid;
    const dbRef = ref(db, `users/${userId}`);

    if (file) {
        const fileRef = storageRef(storage, `profilePhotos/${userId}/${file.name}`);
        uploadBytes(fileRef, file).then((snapshot) => {
            return getDownloadURL(snapshot.ref);
        }).then((url) => {
            return set(dbRef, {
                name: dados.nome,
                email: dados.email,
                phone: dados.telefone,
                ddd: dados.ddd,
                gender: dados.genero,
                country: dados.pais,
                birthDate: dados.dataNascimento,
                profilePhotoUrl: url
            });
        }).then(() => {
            window.location.href = "home.html";
        }).catch((error) => {
            console.error("Erro ao salvar o perfil:", error);
            alert("Erro ao salvar o perfil.");
        });
    } else {

        set(dbRef, {
            name: dados.nome,
            email: dados.email,
            phone: dados.telefone,
            ddd: dados.ddd,
            gender: dados.genero,
            country: dados.pais,
            birthDate: dados.dataNascimento
        }).then(() => {

            window.location.href = "home.html";
        }).catch((error) => {
            console.error("Erro ao salvar o perfil:", error);
            alert("Erro ao salvar o perfil.");
        });
    }
}
