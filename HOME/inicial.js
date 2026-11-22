document.addEventListener("DOMContentLoaded", function () {

    // CARROSSEL DE DESTAQUES

    const slides = document.querySelectorAll(".slide");
    const pontos = document.querySelectorAll(".ponto");

    const btnAnterior = document.querySelector(
        ".carrossel-btn.anterior"
    );

    const btnProximo = document.querySelector(
        ".carrossel-btn.proximo"
    );

    const carrossel = document.querySelector(
        ".carrossel-container"
    );

    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (slides.length > 0) {

        let slideAtual = 0;
        let intervaloAuto = null;

        function mostrarSlide(index) {

            if (index >= slides.length) {
                slideAtual = 0;

            } else if (index < 0) {
                slideAtual = slides.length - 1;

            } else {
                slideAtual = index;
            }

            slides.forEach(function (slide, i) {

                const ativo = i === slideAtual;

                slide.classList.toggle("ativo", ativo);

                slide.setAttribute(
                    "aria-hidden",
                    ativo ? "false" : "true"
                );
            });

            pontos.forEach(function (ponto, i) {

                const ativo = i === slideAtual;

                ponto.classList.toggle("ativo", ativo);

                ponto.setAttribute(
                    "aria-pressed",
                    ativo ? "true" : "false"
                );
            });
        }


        // PRÓXIMO SLIDE

        function proximoSlide() {
            mostrarSlide(slideAtual + 1);
        }


        // SLIDE ANTERIOR

        function slideAnterior() {
            mostrarSlide(slideAtual - 1);
        }


        // PARAR CARROSSEL AUTOMÁTICO

        function pararAutoPlay() {

            if (intervaloAuto !== null) {

                clearInterval(intervaloAuto);

                intervaloAuto = null;
            }
        }


        // INICIAR CARROSSEL AUTOMÁTICO

        function iniciarAutoPlay() {

            pararAutoPlay();

            if (movimentoReduzido.matches) {
                return;
            }

            intervaloAuto = setInterval(function () {
                proximoSlide();
            }, 5000);
        }


        // BOTÃO PRÓXIMO

        if (btnProximo) {

            btnProximo.addEventListener("click", function () {

                proximoSlide();
                iniciarAutoPlay();
            });
        }


        // BOTÃO ANTERIOR

        if (btnAnterior) {

            btnAnterior.addEventListener("click", function () {

                slideAnterior();
                iniciarAutoPlay();
            });
        }


        // INDICADORES DOS SLIDES

        pontos.forEach(function (ponto) {

            ponto.addEventListener("click", function () {

                const index = Number(this.dataset.index);

                mostrarSlide(index);
                iniciarAutoPlay();
            });
        });


        // PAUSAR O CARROSSEL COM O MOUSE

        if (carrossel) {

            carrossel.addEventListener(
                "mouseenter",
                pararAutoPlay
            );

            carrossel.addEventListener(
                "mouseleave",
                iniciarAutoPlay
            );

            carrossel.addEventListener(
                "focusin",
                pararAutoPlay
            );

            carrossel.addEventListener("focusout", function (evento) {

                if (!carrossel.contains(evento.relatedTarget)) {
                    iniciarAutoPlay();
                }
            });
        }


        // PAUSAR QUANDO A ABA NÃO ESTIVER VISÍVEL

        document.addEventListener("visibilitychange", function () {

            if (document.hidden) {
                pararAutoPlay();

            } else {
                iniciarAutoPlay();
            }
        });


        // RESPEITAR MOVIMENTO REDUZIDO

        movimentoReduzido.addEventListener("change", function () {
            iniciarAutoPlay();
        });


        // INICIALIZAR CARROSSEL

        mostrarSlide(0);
        iniciarAutoPlay();
    }


    // GERENCIAMENTO DE SESSÃO NO LOCALSTORAGE (NAVBAR)

    function atualizarNavbarSessao() {
        const authContainer = document.getElementById("auth-container");
        if (!authContainer) return;

        let sessao = null;
        try {
            sessao = JSON.parse(localStorage.getItem("cafe_sessao") || "null");
        } catch (e) {
            sessao = null;
        }

        if (sessao && sessao.logado) {
            const primeiroNome = sessao.primeiroNome || (sessao.nome ? sessao.nome.split(" ")[0] : "Cliente");
            authContainer.innerHTML = `
                <span class="nav-user" style="padding: 6px 12px; border-radius: 6px; background: var(--cor-bege); color: var(--cor-marrom-cafe); font-weight: 600; font-size: 0.9rem;">Olá, ${primeiroNome}</span>
                <button type="button" id="btn-sair-home" class="btn-secondary btn-auth">Sair</button>
            `;

            const btnSairHome = document.getElementById("btn-sair-home");
            if (btnSairHome) {
                btnSairHome.addEventListener("click", function () {
                    localStorage.removeItem("cafe_sessao");
                    localStorage.removeItem("cafe_usuario_nome");
                    localStorage.removeItem("cafe_quiz_atual");
                    window.location.reload();
                });
            }
        }
    }

    atualizarNavbarSessao();


    // BARRA DE ACESSIBILIDADE

    const aumentarFonte = document.getElementById("aumentar-fonte");
    const diminuirFonte = document.getElementById("diminuir-fonte");
    const alternarTema = document.getElementById("alternar-tema");

    let tamanhoFonte = 100;


    // IDENTIFICAR OS ELEMENTOS DE TEXTO

    const elementosTexto = Array.from(
        document.querySelectorAll(
            "h1, h2, h3, h4, p, label, small, a, button, input, select, textarea, legend, span"
        )
    ).filter(function (elemento) {

        return !elemento.closest(".barra-acessibilidade");
    });


    // GUARDAR OS TAMANHOS ORIGINAIS

    const fontesOriginais = elementosTexto.map(function (elemento) {

        return {
            elemento: elemento,
            tamanho: parseFloat(
                window.getComputedStyle(elemento).fontSize
            )
        };
    });


    // ATUALIZAR O TAMANHO DA FONTE

    function atualizarFonte() {

        fontesOriginais.forEach(function (item) {

            item.elemento.style.fontSize =
                (item.tamanho * tamanhoFonte / 100) + "px";
        });
    }


    // AUMENTAR FONTE ATÉ 140%

    if (aumentarFonte) {

        aumentarFonte.addEventListener("click", function () {

            if (tamanhoFonte < 140) {

                tamanhoFonte += 10;

                atualizarFonte();
            }
        });
    }


    // DIMINUIR FONTE ATÉ 80%

    if (diminuirFonte) {

        diminuirFonte.addEventListener("click", function () {

            if (tamanhoFonte > 80) {

                tamanhoFonte -= 10;

                atualizarFonte();
            }
        });
    }


    // ATUALIZAR O ÍCONE DO TEMA

    function atualizarIconeTema() {

        if (!alternarTema) {
            return;
        }

        const modoEscuro = document.body.classList.contains(
            "modo-escuro"
        );

        alternarTema.textContent = modoEscuro ? "☀️" : "🌙";

        const descricao = modoEscuro
            ? "Ativar tema claro"
            : "Ativar tema escuro";

        alternarTema.setAttribute(
            "aria-label",
            descricao
        );

        alternarTema.setAttribute(
            "title",
            descricao
        );
    }


    // RECUPERAR O TEMA SALVO

    try {

        const temaSalvo = localStorage.getItem("temaCafeGraos");

        if (temaSalvo === "escuro") {
            document.body.classList.add("modo-escuro");
        }

    } catch (erro) {

        console.warn("Não foi possível recuperar o tema.");
    }

    atualizarIconeTema();


    // ALTERNAR ENTRE OS TEMAS

    if (alternarTema) {

        alternarTema.addEventListener("click", function () {

            document.body.classList.toggle("modo-escuro");

            const modoEscuroAtivo = document.body.classList.contains(
                "modo-escuro"
            );

            try {

                localStorage.setItem(
                    "temaCafeGraos",
                    modoEscuroAtivo ? "escuro" : "claro"
                );

            } catch (erro) {

                console.warn("Não foi possível salvar o tema.");
            }

            atualizarIconeTema();
        });
    }
});