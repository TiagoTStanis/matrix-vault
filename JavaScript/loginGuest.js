const inputEmail = document.getElementById('email'),
    inputPass = document.getElementsByClassName('group-senha'),
    btnEnviar = document.getElementById('btn-entrar'),
    btnEsqueci = document.getElementById('btn-esquiceSenha'),
    btnAcessar = document.getElementById('btn-acessar'),
    divBtn = document.getElementById('divbtn'),
    btnVoltar = document.getElementById('btn-emailVoltar');

function revelaLogin(event) {
    event.preventDefault();

    if (inputEmail.value !== '') {
        if (validaEmail(inputEmail.value)) {
            for (let i = 0; i < inputPass.length; i++) {
                inputPass[i].style.display = 'block';
                setTimeout(() => inputPass[i].classList.add('show'), 500);
            }

            btnEnviar.style.display = 'block';
            setTimeout(() => {
                btnEnviar.classList.add('show');
                btnEnviar.style.opacity = '1';
            }, 500);

            btnEsqueci.style.display = 'block';
            setTimeout(() => {
                btnEsqueci.classList.add('show');
                btnEsqueci.style.opacity = '1';
            }, 500);

            btnVoltar.style.display = 'flex';
            setTimeout(() => {
                btnVoltar.classList.add('show');
                btnVoltar.style.opacity = '1';
            }, 500);

            divBtn.style.maxWidth = '500px';
            btnAcessar.style.display = 'none';

            setTimeout(() => {
                document.getElementById("senha").focus();
                document.getElementById("email").blur();
            }, 510);

            inputEmail.disabled = true;
            
        } else {
            alert("Por favor, insira um e-mail válido.");
            document.getElementById("email").focus();
            document.getElementById("senha").blur();
        }
    } else {
        alert("Por favor, não deixe o campo Email vazio.");
        document.getElementById("email").focus();
        document.getElementById("senha").blur();
    }
}

function voltar() {
    for (let i = 0; i < inputPass.length; i++) {
        inputPass[i].classList.remove('show');
        setTimeout(() => inputPass[i].style.display = 'none', 60);
    }

    btnEnviar.classList.remove('show');
    setTimeout(() => btnEnviar.style.display = 'none', 60);

    btnEsqueci.classList.remove('show');
    setTimeout(() => btnEsqueci.style.display = 'none', 60);

    btnVoltar.classList.remove('show');
    setTimeout(() => btnVoltar.style.display = 'none', 60);

    divBtn.style.maxWidth = '200px';
    btnAcessar.style.display = 'block';

    inputEmail.disabled = false;
    inputEmail.value = ' ';
    setTimeout(() => {
        document.getElementById("email").focus();
        document.getElementById("senha").blur();
    }, 70);
}

function validaEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

document.addEventListener("DOMContentLoaded", function () { document.getElementById('email').focus(); document.getElementById('email').value = ' ' });