import { auth, uploadFile, onAuthStateChanged, listUserFiles, deleteFile } from './firebaseHome.js';

const zip = new JSZip();
let files = [];

async function zipFile(file) {
    return zip.generateAsync({
        type: "blob",
        streamFiles: true,
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
    }, (metadata) => {
        const progress = Math.floor(metadata.percent);
        updateProgressBar(progress);
    }).then((blob) => {
        const zipName = file.name.replace('.exe', '.zip');
        return new File([blob], zipName, { type: "application/zip" });
    });
}

function updateProgressBar(progress) {
    const progressBar = document.getElementById('file-progress');
    const progressPercent = document.getElementById('progress-percent');
    const progressContainer = document.getElementById('progress-container');

    progressContainer.style.display = 'block';
    progressBar.value = progress;
    progressPercent.textContent = `${progress}%`;
}

function deleteFileFromUI(fileName) {
    if (confirm(`Tem certeza de que deseja deletar o arquivo ${fileName}?`)) {
        deleteFile(fileName).then(() => {
            const fileList = document.getElementById('file-list');
            const fileItem = document.querySelector(`[data-file-name="${fileName}"]`);
            if (fileItem) {
                fileList.removeChild(fileItem);
            }
        }).catch((error) => {
            console.error("Erro ao deletar arquivo da interface:", error);
        });
    }
}

window.deleteFileFromUI = deleteFileFromUI;

function loadFilesIntoList() {
    const fileList = document.getElementById('file-list');

    listUserFiles().then((files) => {
        files.forEach((file) => {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-file-name', file.name);
            listItem.innerHTML = `
    <span>${file.name}</span>
    <div class="actions">
        <a href="${file.url}" class="download-btn">Download</a>
        <a href="#" class="delete-btn" onclick="deleteFileFromUI('${file.name}', this)">
            <i class="fas fa-trash-alt"></i>
        </a>
    </div>
`;
            fileList.appendChild(listItem);
        });
    }).catch((error) => {
        console.error("Erro ao carregar arquivos:", error);
    });
}

function downloadFile(url, fileName) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
        })
        .catch(error => console.error('Erro ao baixar o arquivo:', error));
}

function generateMatrixZipName() {
    const names = ["Neo", "Trinity", "Morpheus", "Zion", "Oracle", "Cypher", "AgentSmith", "TheMatrix", "Dojo", "Sentinel", "MatrixReloaded"];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();

    const timestamp = new Date().getTime();
    const randomCode = Math.floor(1000 + Math.random() * 9000);

    return `${randomName}_${randomLetters}_${timestamp}_${randomCode}.zip`;
}


document.getElementById('file-upload').addEventListener('change', async (event) => {
    const fileInput = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');
    const uploadWarning = document.querySelector('.upload-warning');

    if (fileInput.files.length === 0) {
        alert('Por favor, selecione pelo menos um arquivo.');
        return;
    }

    let largeFileDetected = false;
    for (const file of fileInput.files) {
        if (file.size > 1000000) {
            largeFileDetected = true;
            break;
        }
    }

    if (largeFileDetected) {
        uploadWarning.style.display = 'block';
    } else {
        uploadWarning.style.display = 'none';
    }

    const zip = new JSZip();

    for (const file of fileInput.files) {
        zip.file(file.name, file);
    }

    const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });

    const zipFileName = generateMatrixZipName();

    const uploadTask = uploadFile(new File([zipBlob], zipFileName));

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        updateProgressBar(progress.toFixed(0));
    }, (error) => {
        console.error("Erro ao carregar o arquivo:", error);
    }, () => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-file-name', zipFileName);
        listItem.innerHTML = `
            <span>${zipFileName}</span>
            <a href="#" class="download-btn" onclick="downloadFile('${zipFileName}', '${zipFileName}')">Download</a>
            <a href="#" class="delete-btn" onclick="deleteFileFromUI('${zipFileName}', this)">
                <i class="fas fa-trash-alt"></i> <!-- Ícone de lixeira -->
            </a>
        `;
        fileList.appendChild(listItem);

        const progressContainer = document.getElementById('progress-container');
        progressContainer.style.display = 'none';

        uploadWarning.style.display = 'none';

        location.reload();
    });
});


document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
        console.log('Logout bem-sucedido');
    }).catch((error) => {
        console.error('Erro ao fazer logout:', error);
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadFilesIntoList();
    }
});
