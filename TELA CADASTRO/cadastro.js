// ==========================================
// 1. MOSTRAR / OCULTAR SENHA COM ÍCONES SVG
// ==========================================
function configurarToggleSenha(idInput, idBotao) {
    const input = document.getElementById(idInput);
    const botao = document.getElementById(idBotao);

    const iconeOlhoAberto = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const iconeOlhoFechado = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;

    if (botao && input) {
        botao.addEventListener('click', () => {
            const tipoAtual = input.getAttribute('type');
            if (tipoAtual === 'password') {
                input.setAttribute('type', 'text');
                botao.innerHTML = iconeOlhoFechado;
            } else {
                input.setAttribute('type', 'password');
                botao.innerHTML = iconeOlhoAberto;
            }
        });
    }
}

configurarToggleSenha('senha', 'toggle-senha');
configurarToggleSenha('confirmacao', 'toggle-confirmacao');

// ==========================================
// 2. MÁSCARAS DE INPUT (Formatação automática)
// ==========================================
const inputCPF = document.getElementById('CPF');
if (inputCPF) {
    inputCPF.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = valor;
    });
}

const inputCEP = document.getElementById('CEP');
if (inputCEP) {
    inputCEP.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        e.target.value = valor;
    });
}

const inputCelular = document.getElementById('celular');
if (inputCelular) {
    inputCelular.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        e.target.value = valor;
    });
}

const inputTelefone = document.getElementById('telefone');
if (inputTelefone) {
    inputTelefone.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        e.target.value = valor;
    });
}

// ==========================================
// 3. VALIDAÇÃO, TOAST E PERSISTÊNCIA NO LOCALSTORAGE
// ==========================================
const form = document.querySelector('#form-cadastro');
const btnSubmit = document.querySelector('#btn-cadastrar') || document.querySelector('#form-cadastro button[type="submit"]');

function mostrarToastCadastro(mensagem, tipo = "sucesso") {
    const antigo = document.querySelector(".toast-cadastro-custom");
    if (antigo) antigo.remove();

    const toast = document.createElement("div");
    toast.className = "toast-cadastro-custom";
    toast.textContent = mensagem;
    Object.assign(toast.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: tipo === "sucesso" ? "#276749" : "#c0392b",
        color: "#fff",
        padding: "14px 20px",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: "9999",
        fontSize: "14px",
        fontWeight: "600",
        transition: "opacity 0.3s ease"
    });
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function mostrarErro(input, mensagem) {
    const container = input.parentElement.classList.contains('senha-container')
        ? input.parentElement.parentElement
        : input.parentElement;

    container.classList.add('erro-animacao');
    input.classList.add('input-erro');

    let errorSpan = container.querySelector('.mensagem-erro');
    if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'mensagem-erro';
        container.appendChild(errorSpan);
    }
    errorSpan.innerText = mensagem;

    setTimeout(() => {
        container.classList.remove('erro-animacao');
    }, 400);
}

function removerErro(input) {
    const container = input.parentElement.classList.contains('senha-container')
        ? input.parentElement.parentElement
        : input.parentElement;

    input.classList.remove('input-erro');
    const errorSpan = container.querySelector('.mensagem-erro');
    if (errorSpan) {
        errorSpan.remove();
    }
}

function validarCPFAlgoritmo(cpfStr) {
    const cpf = cpfStr.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let formValido = true;

        const campos = [
            { id: 'nome', msg: 'O nome é obrigatório.' },
            { id: 'CPF', msg: 'Digite um CPF válido.' },
            { id: 'CEP', msg: 'Digite o CEP.' },
            { id: 'celular', msg: 'Digite seu número de celular.' },
            { id: 'Email', msg: 'Digite um e-mail válido.' },
            { id: 'senha', msg: 'A senha deve ter no mínimo 6 caracteres.' }
        ];

        form.querySelectorAll('input').forEach(input => removerErro(input));

        campos.forEach(campo => {
            const input = document.getElementById(campo.id);
            if (!input) return;
            if (input.value.trim() === '') {
                mostrarErro(input, campo.msg);
                formValido = false;
            } else if (campo.id === 'CPF' && !validarCPFAlgoritmo(input.value)) {
                mostrarErro(input, 'CPF inválido. Verifique os dígitos.');
                formValido = false;
            } else if (campo.id === 'CEP' && input.value.replace(/\D/g, '').length !== 8) {
                mostrarErro(input, 'Digite um CEP com 8 números.');
                formValido = false;
            } else if (campo.id === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                mostrarErro(input, 'Insira um e-mail válido.');
                formValido = false;
            } else if (campo.id === 'senha' && input.value.length < 6) {
                mostrarErro(input, campo.msg);
                formValido = false;
            }
        });

        const inputSenha = document.getElementById('senha');
        const inputConfirmacao = document.getElementById('confirmacao');

        if (inputSenha.value !== '' && inputSenha.value !== inputConfirmacao.value) {
            mostrarErro(inputConfirmacao, 'As senhas não coincidem.');
            formValido = false;
        }

        if (formValido) {
            const emailDigitado = document.getElementById('Email').value.trim();
            let usuarios = [];
            try {
                usuarios = JSON.parse(localStorage.getItem('cafe_usuarios') || '[]');
                if (!Array.isArray(usuarios)) usuarios = [];
            } catch (err) {
                usuarios = [];
            }

            const jaExiste = usuarios.some(u => u.email.toLowerCase() === emailDigitado.toLowerCase());
            if (jaExiste) {
                mostrarErro(document.getElementById('Email'), 'Este e-mail já está cadastrado.');
                return;
            }

            const novoUsuario = {
                nome: document.getElementById('nome').value.trim(),
                cpf: document.getElementById('CPF').value.trim(),
                cep: document.getElementById('CEP').value.trim(),
                celular: document.getElementById('celular').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
                email: emailDigitado,
                senha: inputSenha.value,
                criadoEm: new Date().toISOString()
            };

            usuarios.push(novoUsuario);
            localStorage.setItem('cafe_usuarios', JSON.stringify(usuarios));
            localStorage.setItem('cafe_usuario_cadastrado', JSON.stringify(novoUsuario));

            if (btnSubmit) {
                btnSubmit.classList.add('btn-sucesso');
                btnSubmit.disabled = true;
                btnSubmit.innerText = 'Cadastrando...';
            }

            mostrarToastCadastro('Cadastro salvo com sucesso! Redirecionando para o login...', 'sucesso');

            setTimeout(() => {
                if (btnSubmit) btnSubmit.innerText = 'Conta Criada!';
                window.location.href = '../TELA LOGIN/login.html';
            }, 1300);
        }
    });

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            removerErro(input);
        });
    });
}

// ==========================================
// 4. ACESSIBILIDADE & TEMA PERSISTENTE
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const aumentarFonte = document.getElementById("aumentar-fonte");
    const diminuirFonte = document.getElementById("diminuir-fonte");
    const alternarTema = document.getElementById("alternar-tema");

    let escalaFonte = 1;

    const textos = document.querySelectorAll(
        "h1, h2, h3, p, label, input, button, a, small, span"
    );

    textos.forEach(function (elemento) {
        elemento.dataset.fonteOriginal =
            parseFloat(getComputedStyle(elemento).fontSize);
    });

    function atualizarFonte() {
        textos.forEach(function (elemento) {
            const tamanhoOriginal = Number(elemento.dataset.fonteOriginal);
            elemento.style.fontSize = (tamanhoOriginal * escalaFonte) + "px";
        });
    }

    if (aumentarFonte) {
        aumentarFonte.addEventListener("click", function () {
            if (escalaFonte < 1.4) {
                escalaFonte = Math.round((escalaFonte + 0.1) * 10) / 10;
                atualizarFonte();
            }
        });
    }

    if (diminuirFonte) {
        diminuirFonte.addEventListener("click", function () {
            if (escalaFonte > 0.8) {
                escalaFonte = Math.round((escalaFonte - 0.1) * 10) / 10;
                atualizarFonte();
            }
        });
    }

    function atualizarIconeTema() {
        if (!alternarTema) return;
        const modoEscuro = document.body.classList.contains("modo-escuro");
        alternarTema.textContent = modoEscuro ? "☀️" : "🌙";
        alternarTema.setAttribute(
            "aria-label",
            modoEscuro ? "Ativar tema claro" : "Ativar tema escuro"
        );
    }

    try {
        if (localStorage.getItem("temaCafeGraos") === "escuro") {
            document.body.classList.add("modo-escuro");
        }
    } catch (e) {}

    if (alternarTema) {
        alternarTema.addEventListener("click", function () {
            document.body.classList.toggle("modo-escuro");
            const ativo = document.body.classList.contains("modo-escuro");
            try {
                localStorage.setItem("temaCafeGraos", ativo ? "escuro" : "claro");
            } catch (e) {}
            atualizarIconeTema();
        });
    }

    atualizarIconeTema();
});
