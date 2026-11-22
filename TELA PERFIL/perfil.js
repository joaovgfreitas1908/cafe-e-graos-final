document.addEventListener("DOMContentLoaded", function () {
  // 1. Verifica sessão ativa no localStorage (Erro 403 se não estiver logado)
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

  const primeiroNome = sessao.primeiroNome || (sessao.nome ? sessao.nome.split(" ")[0] : "Cliente");
  const navUserQuiz = document.getElementById("nav-user-quiz");
  if (navUserQuiz) navUserQuiz.textContent = primeiroNome;

  const btnSairQuiz = document.getElementById("btn-sair-quiz");
  if (btnSairQuiz) {
    btnSairQuiz.addEventListener("click", function () {
      localStorage.removeItem("cafe_sessao");
      localStorage.removeItem("cafe_usuario_nome");
      localStorage.removeItem("cafe_quiz_atual");
      window.location.href = "../HOME/inicial.html";
    });
  }

  // Seleciona os elementos da página
  const formulario = document.getElementById("form-perfil");
  const intensidade = document.getElementById("intensidade");
  const aumentarFonte = document.getElementById("aumentar-fonte");
  const diminuirFonte = document.getElementById("diminuir-fonte");
  const alternarTema = document.getElementById("alternar-tema");

  if (!formulario) return;

  const frequencias = formulario.querySelectorAll('input[type="radio"]');
  const metodo = document.getElementById("metodo-preparo");
  const sabores = formulario.querySelectorAll('input[type="checkbox"]');
  const comentario = document.getElementById("comentario");
  const notificacao = document.getElementById("notificacao-sucesso");

  // Atualiza a parte preenchida da barra de intensidade
  function atualizarBarra() {
    if (!intensidade) return;
    const min = Number(intensidade.min);
    const max = Number(intensidade.max);
    const valor = Number(intensidade.value);
    const porcentagem = ((valor - min) / (max - min)) * 100;
    intensidade.style.setProperty("--posicao", porcentagem + "%");
  }

  const valorIntensidade = document.createElement("span");
  valorIntensidade.style.display = "block";
  valorIntensidade.style.marginTop = "5px";

  const legenda = document.querySelector(".legenda-intensidade");

  function atualizarIntensidade() {
    if (!intensidade) return;
    valorIntensidade.textContent = "Intensidade selecionada: " + intensidade.value;
  }

  if (intensidade) {
    (legenda || intensidade).insertAdjacentElement("afterend", valorIntensidade);

    intensidade.addEventListener("input", function () {
      atualizarBarra();
      atualizarIntensidade();
    });

    atualizarBarra();
    atualizarIntensidade();
  }

  // Preenche respostas anteriores se o usuário já respondeu o quiz
  try {
    const quizzes = JSON.parse(localStorage.getItem("cafe_quizzes") || "{}");
    const anterior = (sessao.email && quizzes[sessao.email]) || JSON.parse(localStorage.getItem("cafe_quiz_atual") || "null");
    if (anterior) {
      if (anterior.frequencia) {
        const radio = formulario.querySelector(`input[name="frequencia"][value="${anterior.frequencia}"]`);
        if (radio) radio.checked = true;
      }
      if (anterior.intensidade && intensidade) {
        intensidade.value = anterior.intensidade;
        atualizarBarra();
        atualizarIntensidade();
      }
      if (anterior.metodoPreparo && metodo) {
        metodo.value = anterior.metodoPreparo;
      }
      if (Array.isArray(anterior.sabores)) {
        sabores.forEach(cb => {
          cb.checked = anterior.sabores.includes(cb.value);
        });
      }
      if (anterior.comentario && comentario) {
        comentario.value = anterior.comentario;
      }
    }
  } catch (e) {}

  // Acessibilidade: tamanho da fonte
  let escalaFonte = 1;
  const textos = document.querySelectorAll(
    "h1, h2, h3, h4, p, label, input, button, a, small, span, textarea, select"
  );

  textos.forEach(function (elemento) {
    elemento.dataset.fonteOriginal = parseFloat(getComputedStyle(elemento).fontSize);
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

  // Tema claro/escuro persistido no localStorage
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

  // Contador de caracteres
  const contador = document.createElement("small");
  contador.style.display = "block";
  contador.style.marginTop = "5px";

  function atualizarContador() {
    if (!comentario) return;
    contador.textContent = comentario.value.length + "/300 caracteres";
  }

  if (comentario) {
    comentario.maxLength = 300;
    comentario.insertAdjacentElement("afterend", contador);
    comentario.addEventListener("input", atualizarContador);
    atualizarContador();
  }

  // Mensagens de erro inline
  function mostrarErro(elemento, id, mensagem) {
    let erro = document.getElementById(id);
    if (!erro) {
      erro = document.createElement("small");
      erro.id = id;
      erro.style.color = "#c62828";
      erro.style.display = "block";
      erro.style.marginTop = "5px";
      erro.style.marginBottom = "8px";
      erro.setAttribute("role", "alert");
      elemento.insertAdjacentElement("afterend", erro);
    }
    erro.textContent = mensagem;
  }

  function limparErro(id) {
    const erro = document.getElementById(id);
    if (erro) erro.remove();
  }

  const ultimoRadio = frequencias[frequencias.length - 1];
  const campoFrequencia =
    ultimoRadio.nextElementSibling?.tagName === "LABEL"
      ? ultimoRadio.nextElementSibling
      : ultimoRadio;

  const campoSabores = formulario.querySelector(".sabores");

  frequencias.forEach(function (radio) {
    radio.addEventListener("change", function () {
      limparErro("erro-frequencia");
    });
  });

  sabores.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      limparErro("erro-sabores");
    });
  });

  metodo.addEventListener("change", function () {
    limparErro("erro-metodo");
    metodo.style.border = "";
  });

  let tempoNotificacao;

  function mostrarNotificacao(mensagem) {
    if (!notificacao) return;
    clearTimeout(tempoNotificacao);
    notificacao.textContent = mensagem;
    notificacao.classList.add("mostrar");
    tempoNotificacao = setTimeout(function () {
      esconderNotificacao();
    }, 3000);
  }

  function esconderNotificacao() {
    if (!notificacao) return;
    clearTimeout(tempoNotificacao);
    notificacao.classList.remove("mostrar");
    const mensagemAtual = notificacao.textContent;
    setTimeout(function () {
      if (
        !notificacao.classList.contains("mostrar") &&
        notificacao.textContent === mensagemAtual
      ) {
        notificacao.textContent = "";
      }
    }, 300);
  }

  function calcularPerfilSensorial(nivelIntensidade, listaSabores) {
    const temFrutado = listaSabores.some(s => ["frutas", "floral", "citrico"].includes(s));
    const temDoceTorrado = listaSabores.some(s => ["chocolate", "caramelo", "castanhas"].includes(s));

    if (nivelIntensidade >= 8) {
      return {
        titulo: "Intenso & Encorpado",
        acidez: "Baixa (notas profundas e marcantes)",
        corpo: "Muito Encorpado e Denso"
      };
    } else if (nivelIntensidade <= 3) {
      return {
        titulo: temFrutado ? "Suave & Frutado" : "Suave & Delicado",
        acidez: "Média a Alta (brilhante e refrescante)",
        corpo: "Leve e Sedoso"
      };
    } else if (temFrutado && !temDoceTorrado) {
      return {
        titulo: "Aromático & Cítrico",
        acidez: "Média (vibrante e perfumada)",
        corpo: "Médio e Limpo"
      };
    } else {
      return {
        titulo: "Equilibrado & Aromático",
        acidez: "Baixa a Média (suave e agradável ao paladar)",
        corpo: "Aveludado e Encorpado"
      };
    }
  }

  // Envio do Quiz -> salva no localStorage e redireciona para Preferências
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let formularioValido = true;
    esconderNotificacao();

    const radioMarcado = Array.from(frequencias).find(r => r.checked);
    if (!radioMarcado) {
      mostrarErro(
        campoFrequencia,
        "erro-frequencia",
        "Selecione a frequência com que você toma café."
      );
      formularioValido = false;
    } else {
      limparErro("erro-frequencia");
    }

    if (metodo.value === "") {
      mostrarErro(
        metodo,
        "erro-metodo",
        "Selecione seu método de preparo favorito."
      );
      metodo.style.border = "2px solid #c62828";
      formularioValido = false;
    } else {
      limparErro("erro-metodo");
      metodo.style.border = "";
    }

    const checkboxesMarcados = Array.from(sabores).filter(cb => cb.checked);
    if (checkboxesMarcados.length === 0) {
      mostrarErro(
        campoSabores,
        "erro-sabores",
        "Selecione pelo menos um sabor favorito."
      );
      formularioValido = false;
    } else {
      limparErro("erro-sabores");
    }

    if (formularioValido) {
      const nivelIntensidade = Number(intensidade.value);
      const saboresValues = checkboxesMarcados.map(cb => cb.value);
      const saboresLabels = checkboxesMarcados.map(cb => cb.parentElement.textContent.trim());
      const freqLabelEl = formulario.querySelector(`label[for="${radioMarcado.id}"]`);
      const freqLabel = freqLabelEl ? freqLabelEl.textContent.trim() : radioMarcado.value;
      const metodoLabel = metodo.options[metodo.selectedIndex].text.trim();

      const dadosQuiz = {
        usuarioEmail: sessao.email,
        usuarioNome: sessao.nome,
        frequencia: radioMarcado.value,
        frequenciaLabel: freqLabel,
        intensidade: nivelIntensidade,
        metodoPreparo: metodo.value,
        metodoPreparoLabel: metodoLabel,
        sabores: saboresValues,
        saboresLabels: saboresLabels,
        comentario: comentario ? comentario.value.trim() : "",
        perfilCalculado: calcularPerfilSensorial(nivelIntensidade, saboresValues),
        dataPreenchimento: new Date().toISOString()
      };

      try {
        const quizzes = JSON.parse(localStorage.getItem("cafe_quizzes") || "{}");
        if (sessao.email) {
          quizzes[sessao.email] = dadosQuiz;
        }
        localStorage.setItem("cafe_quizzes", JSON.stringify(quizzes));
        localStorage.setItem("cafe_quiz_atual", JSON.stringify(dadosQuiz));
      } catch (e) {}

      mostrarNotificacao("Preferências enviadas com sucesso! Carregando seu perfil...");

      setTimeout(function () {
        window.location.href = "../TELA PREFERENCIAS/preferencias.html";
      }, 1200);
    }
  });

  formulario.addEventListener("reset", function () {
    limparErro("erro-frequencia");
    limparErro("erro-metodo");
    limparErro("erro-sabores");
    metodo.style.border = "";
    esconderNotificacao();

    setTimeout(function () {
      atualizarBarra();
      atualizarIntensidade();
      atualizarContador();
    }, 0);
  });
});
