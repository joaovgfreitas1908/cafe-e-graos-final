document.addEventListener("DOMContentLoaded", () => {
    // 1. Verifica no localStorage se o quiz foi realizado (Erro 404 caso contrário)
    let sessao = null;
    let quizUsuario = null;

    try {
        sessao = JSON.parse(localStorage.getItem("cafe_sessao") || "null");
        const quizzes = JSON.parse(localStorage.getItem("cafe_quizzes") || "{}");
        const quizAtual = JSON.parse(localStorage.getItem("cafe_quiz_atual") || "null");

        quizUsuario = (sessao && sessao.email && quizzes[sessao.email])
            ? quizzes[sessao.email]
            : (sessao && sessao.logado ? quizAtual : null);
    } catch (e) {
        quizUsuario = null;
    }

    if (!quizUsuario) {
        window.location.replace("../404/erro404.html");
        return;
    }

    const nomeUsuario = (sessao && (sessao.primeiroNome || (sessao.nome && sessao.nome.split(" ")[0]))) || "Cliente";

    const spanUserNavbar = document.querySelector(".nav-user");
    if (spanUserNavbar) {
        spanUserNavbar.textContent = nomeUsuario;
    }

    // 2. Utilitários visuais (Toast e Modal de Confirmação)
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
        }, 3200);
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

    function mostrarModalConfirmacaoFicticia(dadosResumo) {
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
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "10000",
            fontFamily: "inherit",
            padding: "16px"
        });

        const caixa = document.createElement("div");
        Object.assign(caixa.style, {
            backgroundColor: "#FAF2E6",
            border: "2px solid #3D2417",
            padding: "28px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            maxWidth: "430px",
            width: "100%",
            textAlign: "center",
            color: "#3D2417"
        });

        caixa.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 8px;">☕✓</div>
            <h3 style="margin-bottom: 10px; font-size: 1.3rem;">Confirmação Registrada!</h3>
            <p style="font-size: 0.95rem; color: #674F41; margin-bottom: 16px;">
                Suas preferências sensoriais foram confirmadas com sucesso no sistema (confirmação fictícia).
            </p>
            <div style="background: #FFFFFF; border: 1px solid #EBE2D7; border-radius: 8px; padding: 12px; text-align: left; font-size: 0.85rem; margin-bottom: 18px;">
                <p style="margin-bottom: 6px;"><strong>Cliente:</strong> ${dadosResumo.cliente}</p>
                <p style="margin-bottom: 6px;"><strong>Perfil:</strong> ${dadosResumo.perfil}</p>
                <p style="margin-bottom: 6px;"><strong>Método:</strong> ${dadosResumo.metodo}</p>
                <p style="margin: 0;"><strong>Notas:</strong> ${dadosResumo.notas}</p>
            </div>
            <button type="button" id="fechar-modal-ficticio" style="background: #3D2417; color: #fff; border: none; padding: 10px 24px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                Entendi
            </button>
        `;

        overlay.appendChild(caixa);
        document.body.appendChild(overlay);

        document.getElementById("fechar-modal-ficticio").addEventListener("click", () => {
            overlay.remove();
        });
    }

    // 3. Preenche o Card 1 com os dados reais do Quiz salvos no localStorage
    const perfil = quizUsuario.perfilCalculado || {
        titulo: "Equilibrado & Aromático",
        acidez: "Baixa a Média (suave e agradável ao paladar).",
        corpo: "Aveludado e Encorpado."
    };

    const notasFormatadas = (quizUsuario.saboresLabels && quizUsuario.saboresLabels.length > 0)
        ? quizUsuario.saboresLabels.join(", ") + "."
        : "Chocolate, caramelo e castanhas.";

    document.getElementById("perfil-titulo").textContent = `☕ ${perfil.titulo}`;
    document.getElementById("perfil-notas").textContent = notasFormatadas;
    document.getElementById("perfil-acidez").textContent = perfil.acidez;
    document.getElementById("perfil-corpo").textContent = perfil.corpo;
    document.getElementById("perfil-intensidade").textContent = `${quizUsuario.intensidade || 5} / 10`;
    document.getElementById("perfil-frequencia").textContent = quizUsuario.frequenciaLabel || "Diariamente";
    document.getElementById("perfil-metodo").textContent = quizUsuario.metodoPreparoLabel || "Coado";

    if (quizUsuario.comentario) {
        const itemComentario = document.getElementById("item-comentario");
        const spanComentario = document.getElementById("perfil-comentario");
        if (itemComentario && spanComentario) {
            itemComentario.hidden = false;
            spanComentario.textContent = quizUsuario.comentario;
        }
    }

    // 4. Gera recomendações personalizadas com base nas respostas do Quiz
    const catalogoCafes = [
        {
            nome: "Café Tradicional",
            notas: "Corpo aveludado, com notas de caramelo e chocolate ao leite.",
            tags: ["caramelo", "chocolate"],
            intensidadeIdeal: 5,
            imagem: "../TELA PRODUTOS/img/cafe_tradicional.jpg"
        },
        {
            nome: "Café Expresso",
            notas: "Sabor concentrado, aroma intenso, acidez cítrica e finalização achocolatada.",
            tags: ["citrico", "chocolate"],
            intensidadeIdeal: 9,
            imagem: "../TELA PRODUTOS/img/cafe_expresso.jpg"
        },
        {
            nome: "Café com Leite",
            notas: "Bebida cremosa e suave, com notas de castanha e a doçura do leite.",
            tags: ["castanhas"],
            intensidadeIdeal: 3,
            imagem: "../TELA PRODUTOS/img/cafe_com_leite.jpg"
        },
        {
            nome: "Cappuccino",
            notas: "Café expresso, leite vaporizado e espuma, com textura cremosa e equilibrada.",
            tags: [],
            intensidadeIdeal: 5,
            imagem: "../TELA PRODUTOS/img/cappuccino.jpg"
        },
        {
            nome: "Café Mocha",
            notas: "Café expresso com chocolate e leite cremoso, de sabor mais doce.",
            tags: ["chocolate"],
            intensidadeIdeal: 4,
            imagem: "../TELA PRODUTOS/img/cafe_mocha.jpg"
        },
        {
            nome: "Café Latte",
            notas: "Café expresso com bastante leite vaporizado, sabor suave e textura cremosa.",
            tags: [],
            intensidadeIdeal: 2,
            imagem: "../TELA PRODUTOS/img/cafe_latte.jpg"
        },
        {
            nome: "Café Macchiato",
            notas: "Café expresso intenso, suavizado por uma pequena porção de espuma de leite.",
            tags: [],
            intensidadeIdeal: 8,
            imagem: "../TELA PRODUTOS/img/cafe_macchiato.jpg"
        },
        {
            nome: "Café Americano",
            notas: "Expresso com água quente, de corpo leve e sabor menos concentrado.",
            tags: [],
            intensidadeIdeal: 4,
            imagem: "../TELA PRODUTOS/img/cafe_americano.jpg"
        },
        {
            nome: "Affogato",
            notas: "Sobremesa com sorvete de baunilha e uma dose de expresso quente.",
            tags: [],
            intensidadeIdeal: 5,
            imagem: "../TELA PRODUTOS/img/cafe_affogato.jpg"
        },
        {
            nome: "Cold Brew",
            notas: "Café extraído em água fria, servido gelado e de sabor suave.",
            tags: [],
            intensidadeIdeal: 2,
            imagem: "../TELA PRODUTOS/img/cafe_coldbrew.jpg"
        },
        {
            nome: "Café Cortado",
            notas: "Expresso com um pouco de leite quente, de sabor equilibrado e cremoso.",
            tags: [],
            intensidadeIdeal: 6,
            imagem: "../TELA PRODUTOS/img/cafe_cortado.jpg"
        },
        {
            nome: "Café com Chantilly",
            notas: "Café expresso com cobertura de chantilly, unindo intensidade e doçura.",
            tags: [],
            intensidadeIdeal: 6,
            imagem: "../TELA PRODUTOS/img/cafe_chantilly.jpg"
        }
    ];

    const saboresUsuario = quizUsuario.sabores || [];
    const intUsuario = Number(quizUsuario.intensidade || 5);

    const recomendados = catalogoCafes
        .map(cafe => {
            const matchesSabor = cafe.tags.filter(t => saboresUsuario.includes(t)).length;
            const diffIntensidade = Math.abs(cafe.intensidadeIdeal - intUsuario);
            const score = Math.min(99, Math.max(84, 86 + matchesSabor * 6 - diffIntensidade));
            return { ...cafe, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

    const listaRecEl = document.getElementById("lista-recomendacoes");
    if (listaRecEl) {
        listaRecEl.innerHTML = recomendados.map(cafe => `
            <div class="coffee-item">
                <img src="${cafe.imagem}" alt="${cafe.nome}" onerror="this.src='imagens/logo.png'">
                <div class="coffee-info">
                    <h4>${cafe.nome}</h4>
                    <p class="coffee-notes">${cafe.notas}</p>
                    <span class="coffee-match">${cafe.score}% Match com seu perfil</span>
                </div>
            </div>
        `).join("");
    }

    // 5. Ações dos botões
    window.refazerQuiz = function () {
        mostrarConfirmacao("Deseja refazer o seu questionário de perfil sensorial?", () => {
            window.location.href = "../TELA PERFIL/perfil.html";
        });
    };

    window.salvarPreferencias = function () {
        const resumo = {
            cliente: (sessao && sessao.nome) || nomeUsuario,
            perfil: perfil.titulo,
            metodo: quizUsuario.metodoPreparoLabel || "Coado",
            notas: notasFormatadas,
            confirmadoEm: new Date().toISOString()
        };

        try {
            localStorage.setItem("cafe_preferencias_confirmadas", JSON.stringify(resumo));
        } catch (e) {}

        const btnSalvar = document.getElementById("btn-salvar-preferencias");
        if (btnSalvar) {
            btnSalvar.textContent = "✓ Preferências Confirmadas!";
            btnSalvar.style.backgroundColor = "#2d6a4f";
        }

        mostrarModalConfirmacaoFicticia(resumo);
    };

    window.verProdutos = function () {
        window.location.href = "../TELA PRODUTOS/Produtos.html";
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

    // 6. Acessibilidade e tema persistido no localStorage
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