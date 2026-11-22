document.addEventListener("DOMContentLoaded", () => {
    // 1. Verifica sessão ativa no localStorage
    let sessao = null;
    try {
        sessao = JSON.parse(localStorage.getItem("cafe_sessao") || "null");
    } catch (e) {
        sessao = null;
    }

    if (!sessao || !sessao.logado) {
        window.location.replace("../403/erro403.html");
        return;
    }

    const nomeUsuario = sessao.primeiroNome || (sessao.nome ? sessao.nome.split(" ")[0] : "Cliente");

    function mostrarMensagem(mensagem, tipo = "info") {
        const alertaAntigo = document.querySelector(".toast-alerta-custom");
        if (alertaAntigo) alertaAntigo.remove();

        const toast = document.createElement("div");
        toast.className = "toast-alerta-custom";
        toast.textContent = mensagem;

        Object.assign(toast.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: tipo === "sucesso" ? "#2d6a4f" : "#333",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: "9999",
            fontFamily: "inherit",
            fontSize: "14px",
            transition: "opacity 0.3s ease"
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function mostrarConfirmacao(mensagem, callbackSim) {
        const modalAntigo = document.querySelector(".modal-confirm-custom");
        if (modalAntigo) modalAntigo.remove();

        const overlay = document.createElement("div");
        overlay.className = "modal-confirm-custom";
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "10000",
            fontFamily: "inherit"
        });

        const caixa = document.createElement("div");
        Object.assign(caixa.style, {
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            maxWidth: "360px",
            width: "90%",
            textAlign: "center"
        });

        const texto = document.createElement("p");
        texto.textContent = mensagem;
        Object.assign(texto.style, {
            marginBottom: "20px",
            color: "#333",
            fontSize: "16px"
        });

        const btnSim = document.createElement("button");
        btnSim.textContent = "Sim";
        Object.assign(btnSim.style, {
            backgroundColor: "#2d6a4f",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            marginRight: "10px",
            fontWeight: "bold"
        });

        const btnNao = document.createElement("button");
        btnNao.textContent = "Cancelar";
        Object.assign(btnNao.style, {
            backgroundColor: "#ccc",
            color: "#333",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
        });

        btnSim.addEventListener("click", () => {
            overlay.remove();
            callbackSim();
        });

        btnNao.addEventListener("click", () => {
            overlay.remove();
        });

        caixa.appendChild(texto);
        caixa.appendChild(btnSim);
        caixa.appendChild(btnNao);
        overlay.appendChild(caixa);
        document.body.appendChild(overlay);
    }

    // Atualiza nome na navbar e cabeçalho
    const spanUserNavbar = document.querySelector(".nav-user");
    if (spanUserNavbar) {
        spanUserNavbar.textContent = nomeUsuario;
    }

    const h1Principal = document.getElementById("saudacao-usuario");
    if (h1Principal) {
        h1Principal.textContent = `Olá, ${nomeUsuario}!`;
    }

    // Verifica se o usuário já respondeu o quiz no localStorage
    let quizUsuario = null;
    try {
        const quizzes = JSON.parse(localStorage.getItem("cafe_quizzes") || "{}");
        quizUsuario = (sessao.email && quizzes[sessao.email]) || JSON.parse(localStorage.getItem("cafe_quiz_atual") || "null");
    } catch (e) {
        quizUsuario = null;
    }

    if (quizUsuario && quizUsuario.perfilCalculado) {
        const btnQuiz = document.getElementById("btn-fazer-quiz");
        const statusQuiz = document.getElementById("status-quiz-texto");
        const statusPref = document.getElementById("status-pref-texto");

        if (btnQuiz) btnQuiz.textContent = "Refazer o Quiz";
        if (statusQuiz) {
            statusQuiz.innerHTML = `Quiz concluído! Seu perfil atual é <strong>${quizUsuario.perfilCalculado.titulo}</strong>. Você pode atualizar suas respostas quando quiser.`;
        }
        if (statusPref) {
            statusPref.innerHTML = `Seu perfil sensorial (<strong>${quizUsuario.perfilCalculado.titulo}</strong>) e suas recomendações personalizadas já estão disponíveis.`;
        }
    }

    // Funções globais chamadas pelos botões do HTML
    window.fazerQuiz = function () {
        window.location.href = "../TELA PERFIL/perfil.html";
    };

    window.verPreferencias = function () {
        // Se não fez o quiz, preferencias.html redirecionará para 404/erro404.html
        window.location.href = "../TELA PREFERENCIAS/preferencias.html";
    };

    window.sairApp = function () {
        mostrarConfirmacao("Deseja realmente sair da sua conta?", () => {
            localStorage.removeItem("cafe_sessao");
            localStorage.removeItem("cafe_usuario_nome");
            localStorage.removeItem("cafe_quiz_atual");
            mostrarMensagem("Sessão encerrada com sucesso!", "sucesso");
            setTimeout(() => {
                window.location.href = "../HOME/inicial.html";
            }, 800);
        });
    };

    // Acessibilidade e tema persistido no localStorage
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
