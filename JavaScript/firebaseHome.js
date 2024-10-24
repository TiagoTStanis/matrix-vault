import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getStorage, ref as createStorageRef, uploadBytesResumable, listAll, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';
import { getDatabase, ref, get, child } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);

function loadUserProfile() {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const dbRef = ref(db, `users/${userId}`);

        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                document.querySelector('.name').textContent = userData.name || 'Usuário';
                document.querySelector('.age').textContent = `${calcularIdade(userData.birthDate) + " anos" || 'Indefinido'}`;

                const profilePhotoView = document.querySelector('.profile-pic');
                if (userData.profilePhotoUrl) {
                    profilePhotoView.src = userData.profilePhotoUrl;
                }
            } else {
                console.log("Nenhum dado de usuário encontrado.");
            }
        }).catch((error) => {
            console.error("Erro ao carregar os dados do usuário:", error);
        });
    }
}

function calcularIdade(dataNascimento) {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile();
    } else {
        console.log("Usuário não autenticado.");
    }
});

function uploadFile(file) {
    const user = auth.currentUser;
    if (user) {
        const fileRef = createStorageRef(storage, `${user.email}/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
        return uploadTask;
    } else {
        return Promise.reject("Usuário não autenticado");
    }
}

function listUserFiles() {
    const user = auth.currentUser;

    return new Promise((resolve, reject) => {
        if (user) {
            const userStorageRef = createStorageRef(storage, user.email);

            listAll(userStorageRef).then((result) => {
                const files = [];
                result.items.forEach((fileRef) => {
                    getDownloadURL(fileRef).then((url) => {
                        files.push({
                            name: fileRef.name,
                            url: url
                        });
                        if (files.length === result.items.length) {
                            resolve(files);
                        }
                    }).catch((error) => reject(error));
                });
            }).catch((error) => reject(error));
        } else {
            reject('Usuário não autenticado');
        }
    });
}

function deleteFile(fileName) {
    const user = auth.currentUser;
    if (user) {
        const fileRef = createStorageRef(storage, `${user.email}/${fileName}`);
        return deleteObject(fileRef) 
            .then(() => {
                console.log("Arquivo deletado com sucesso!");
            }).catch((error) => {
                console.error("Erro ao deletar o arquivo:", error);
            });
    } else {
        return Promise.reject("Usuário não autenticado");
    }
}

export { auth, uploadFile, onAuthStateChanged, listUserFiles, deleteFile };
