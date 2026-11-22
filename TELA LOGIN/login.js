const senha = document.getElementById("senha");
const mostrarSenha = document.getElementById("mostrar-senha");
const olhoAberto = document.getElementById("olho-aberto");
const olhoFechado = document.getElementById("olho-fechado");

function atualizarIconesSenha() {
    const senhaVisivel = senha.type === "text";

    olhoAberto.removeAttribute("hidden");
    olhoFechado.removeAttribute("hidden");

    olhoAberto.style.display = senhaVisivel ? "block" : "none";
    olhoFechado.style.display = senhaVisivel ? "none" : "block";

    olhoAberto.classList.remove("icone-oculto");
    olhoFechado.classList.remove("icone-oculto");

    mostrarSenha.setAttribute(
        "aria-label",
        senhaVisivel ? "Ocultar senha" : "Mostrar senha"
    );

    mostrarSenha.setAttribute(
        "aria-pressed",
        String(senhaVisivel)
    );
}

mostrarSenha.addEventListener("click", function () {
    senha.type = senha.type === "password" ? "text" : "password";
    atualizarIconesSenha();
});

atualizarIconesSenha();

const formlogin = document.getElementById("form-login");
const usuario = document.getElementById("login");
const lembrarCheckbox = document.getElementById("lembrar");
const erroUsuario = document.getElementById("erro-usuario");
const erroSenha = document.getElementById("erro-senha");
const notificacao = document.getElementById("notificacao-sucesso");
const botaoEntrar = document.querySelector(".btn-entrar");

// Preenche usuário lembrado no localStorage
try {
    const usuarioLembrado = localStorage.getItem("cafe_lembrar_usuario");
    if (usuarioLembrado && usuario) {
        usuario.value = usuarioLembrado;
        if (lembrarCheckbox) lembrarCheckbox.checked = true;
    }
} catch (e) {}

function mostrarErro(campo, mensagem, elementoErro) {
    elementoErro.textContent = mensagem;
    campo.classList.add("input-erro");
    campo.setAttribute("aria-invalid", "true");
    campo.classList.remove("input-shake");
    void campo.offsetWidth;
    campo.classList.add("input-shake");
}

function limparErro(campo, elementoErro) {
    elementoErro.textContent = "";
    campo.classList.remove("input-erro", "input-shake");
    campo.removeAttribute("aria-invalid");
}

function mostrarNotificacao(mensagem) {
    if (!notificacao) return;
    notificacao.textContent = mensagem;
    notificacao.classList.add("mostrar");
}

formlogin.addEventListener("submit", function (event) {
    event.preventDefault();

    if (botaoEntrar.disabled) return;

    let formularioValido = true;
    let primeiroCampoInvalido = null;

    if (usuario.value.trim() === "") {
        mostrarErro(usuario, "Digite seu e-mail ou nome cadastrado", erroUsuario);
        formularioValido = false;
        primeiroCampoInvalido = usuario;
    } else {
        limparErro(usuario, erroUsuario);
    }

    if (senha.value.trim() === "") {
        mostrarErro(senha, "Digite sua senha", erroSenha);
        formularioValido = false;
        if (primeiroCampoInvalido === null) {
            primeiroCampoInvalido = senha;
        }
    } else {
        limparErro(senha, erroSenha);
    }

    if (!formularioValido) {
        primeiroCampoInvalido.focus();
        return;
    }

    // Validação real contra os usuários salvos no localStorage
    let usuarios = [];
    try {
        usuarios = JSON.parse(localStorage.getItem("cafe_usuarios") || "[]");
        if (!Array.isArray(usuarios)) usuarios = [];
    } catch (e) {
        usuarios = [];
    }

    if (usuarios.length === 0) {
        mostrarErro(usuario, "Nenhuma conta encontrada. Cadastre-se primeiro.", erroUsuario);
        usuario.focus();
        return;
    }

    const identificador = usuario.value.trim().toLowerCase();
    const senhaDigitada = senha.value;

    const usuarioEncontrado = usuarios.find(function (u) {
        const emailMatch = (u.email || "").toLowerCase() === identificador;
        const nomeMatch = (u.nome || "").toLowerCase() === identificador;
        return emailMatch || nomeMatch;
    });

    if (!usuarioEncontrado) {
        mostrarErro(usuario, "Usuário ou e-mail não cadastrado.", erroUsuario);
        usuario.focus();
        return;
    }

    if (usuarioEncontrado.senha !== senhaDigitada) {
        mostrarErro(senha, "Senha incorreta. Tente novamente.", erroSenha);
        senha.focus();
        return;
    }

    // Salva opção Lembrar de mim
    try {
        if (lembrarCheckbox && lembrarCheckbox.checked) {
            localStorage.setItem("cafe_lembrar_usuario", usuario.value.trim());
        } else {
            localStorage.removeItem("cafe_lembrar_usuario");
        }
    } catch (e) {}

    // Cria sessão ativa no localStorage
    const primeiroNome = usuarioEncontrado.nome.trim().split(/\s+/)[0];
    const sessao = {
        logado: true,
        nome: usuarioEncontrado.nome,
        primeiroNome: primeiroNome,
        email: usuarioEncontrado.email,
        cpf: usuarioEncontrado.cpf || "",
        cep: usuarioEncontrado.cep || "",
        celular: usuarioEncontrado.celular || "",
        telefone: usuarioEncontrado.telefone || "",
        loginEm: new Date().toISOString()
    };

    localStorage.setItem("cafe_sessao", JSON.stringify(sessao));
    localStorage.setItem("cafe_usuario_nome", primeiroNome);

    // Restaura o quiz deste usuário caso já tenha feito antes
    try {
        const quizzes = JSON.parse(localStorage.getItem("cafe_quizzes") || "{}");
        if (quizzes && quizzes[usuarioEncontrado.email]) {
            localStorage.setItem("cafe_quiz_atual", JSON.stringify(quizzes[usuarioEncontrado.email]));
        } else {
            localStorage.removeItem("cafe_quiz_atual");
        }
    } catch (e) {}

    mostrarNotificacao(`Bem-vindo(a), ${primeiroNome}! Login efetuado com sucesso!`);

    botaoEntrar.disabled = true;
    botaoEntrar.textContent = "Entrando...";

    setTimeout(function () {
        window.location.href = "../TELA DESTAQUES/destaques.html";
    }, 1500);
});

usuario.addEventListener("input", function () {
    if (usuario.value.trim() !== "") {
        limparErro(usuario, erroUsuario);
    }
});

senha.addEventListener("input", function () {
    if (senha.value.trim() !== "") {
        limparErro(senha, erroSenha);
    }
});

usuario.addEventListener("animationend", function () {
    usuario.classList.remove("input-shake");
});

senha.addEventListener("animationend", function () {
    senha.classList.remove("input-shake");
});

// Acessibilidade e tema persistente
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

    aumentarFonte.addEventListener("click", function () {
        if (escalaFonte < 1.4) {
            escalaFonte = Math.round((escalaFonte + 0.1) * 10) / 10;
            atualizarFonte();
        }
    });

    diminuirFonte.addEventListener("click", function () {
        if (escalaFonte > 0.8) {
            escalaFonte = Math.round((escalaFonte - 0.1) * 10) / 10;
            atualizarFonte();
        }
    });

    function atualizarIconeTema() {
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

    alternarTema.addEventListener("click", function () {
        document.body.classList.toggle("modo-escuro");
        const ativo = document.body.classList.contains("modo-escuro");
        try {
            localStorage.setItem("temaCafeGraos", ativo ? "escuro" : "claro");
        } catch (e) {}
        atualizarIconeTema();
    });

    atualizarIconeTema();
});
