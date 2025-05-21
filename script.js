// ADICIONADO: suporte a múltiplos meteoros, estrelas, fundo infinito, vidas, som, placar, tempo e efeitos sonoros

// Seleciona os elementos principais do jogo
let foguete = document.getElementById("foguete"); // Elemento do foguete
let jogo = document.getElementById("jogo");       // Área principal do jogo // ADICIONADO
let mensagemFim = document.getElementById("mensagemFim"); // Mensagem de fim de jogo

// ADICIONADO: elementos de UI para placar e tempo
let placarEl = document.createElement("div"); // Cria um elemento <div> para o placar
placarEl.id = "placar"; // Define o ID do placar para futura referência ou estilo via CSS
placarEl.style.position = "absolute"; // Posicionamento absoluto para fixar na tela
placarEl.style.top = "10px"; // Distância do topo da tela
placarEl.style.left = "10px"; // Distância da esquerda da tela
placarEl.style.color = "white"; // Cor do texto
placarEl.style.fontSize = "18px"; // Tamanho da fonte
placarEl.innerText = "Vidas: 3 | Pontos: 0 | Tempo: 0s"; // Texto inicial do placar
// Adiciona o placar visualmente ao corpo do HTML
document.body.appendChild(placarEl);

// Variáveis de estado do jogo
let posicaoHorizontal = window.innerWidth / 2; // Define a posição inicial do foguete (meio da tela)
let vidas = 3;        // Quantidade inicial de vidas // ADICIONADO
let pontos = 0;       // Pontuação do jogador // ADICIONADO
let tempo = 0;        // Tempo de jogo em segundos // ADICIONADO
let intervalo;        // Intervalo principal do jogo
let cronometro;       // Controla o tempo em segundos // ADICIONADO
let meteoros = [];    // Lista dinâmica de meteoros na tela // ADICIONADO
let estrelas = [];    // Lista dinâmica de estrelas bônus na tela // ADICIONADO

// ADICIONADO: trilha sonora e efeitos sonoros
let musica = new Audio("musica-fundo.mp3"); // Música de fundo
musica.loop = true; // Define que a música se repita automaticamente
let somColisao = new Audio("som-colisao.mp3"); // Som ao colidir com meteoro
let somEstrela = new Audio("som-estrela.mp3"); // Som ao coletar estrela

// ADICIONADO: função que atualiza o texto do placar
function atualizarPlacar() {
  placarEl.innerText = `Vidas: ${vidas} | Pontos: ${pontos} | Tempo: ${tempo}s`; // Atualiza dinamicamente a HUD
}

// Cria dinamicamente um elemento de imagem para meteoro ou estrela // ADICIONADO
function criarElemento(tipo, classe, src) {
  let el = document.createElement("img"); // Cria um elemento <img>
  el.classList.add(classe); // Adiciona classe CSS ao elemento
  el.src = src;             // Define o caminho da imagem
  el.style.position = "absolute"; // Posicionamento livre dentro da área do jogo
  el.style.width = "40px";        // Largura padrão dos elementos
  el.style.height = "40px";       // Altura padrão dos elementos
  jogo.appendChild(el); // Adiciona visualmente ao DOM
  return el; // Retorna o elemento criado
}

// ADICIONADO: cria múltiplos meteoros com posições aleatórias
function criarMeteoros(qtd) {
  for (let i = 0; i < qtd; i++) {
    let meteoro = criarElemento("img", "meteoro", "meteoro.png");
    meteoro.style.left = Math.random() * (window.innerWidth - 60) + "px";
    meteoro.style.top = Math.random() * -500 + "px";
    meteoros.push(meteoro);
  }
}

// ADICIONADO: cria múltiplas estrelas bônus com posições aleatórias
function criarEstrelas(qtd) {
  for (let i = 0; i < qtd; i++) {
    let estrela = criarElemento("img", "estrela", "estrela.png");
    estrela.style.left = Math.random() * (window.innerWidth - 60) + "px";
    estrela.style.top = Math.random() * -1000 + "px";
    estrelas.push(estrela);
  }
}

// Função que move o foguete para esquerda ou direita com as setas // MANTIDO
function moverFoguete(event) {
  if (event.key === "ArrowLeft") posicaoHorizontal -= 20;
  if (event.key === "ArrowRight") posicaoHorizontal += 20;
  posicaoHorizontal = Math.max(0, Math.min(posicaoHorizontal, window.innerWidth - 60));
  foguete.style.left = posicaoHorizontal + "px";
}

// ADICIONADO: função genérica para mover qualquer objeto verticalmente
function moverObjetos(objetos, velocidade) {
  objetos.forEach(obj => {
    let top = parseInt(obj.style.top) + velocidade;
    if (top > window.innerHeight) {
      top = -60;
      obj.style.left = Math.random() * (window.innerWidth - 60) + "px";
    }
    obj.style.top = top + "px";
  });
}

// ADICIONADO: função genérica para detectar colisão entre o foguete e objetos
function verificarColisaoObjetos(objetos, callback) {
  const fogueteRect = foguete.getBoundingClientRect();
  objetos.forEach((obj, index) => {
    const objRect = obj.getBoundingClientRect();
    const colisao = !(
      fogueteRect.top > objRect.bottom ||
      fogueteRect.bottom < objRect.top ||
      fogueteRect.right < objRect.left ||
      fogueteRect.left > objRect.right
    );
    if (colisao) callback(obj, index);
  });
}

// ALTERADO: agora reduz vida e toca som ao colidir com qualquer meteoro da lista
function perderVida(meteoro, i) {
  vidas--;
  meteoro.style.top = -60 + "px";
  meteoro.style.left = Math.random() * (window.innerWidth - 60) + "px";
  somColisao.play(); // ADICIONADO
  atualizarPlacar();

  if (vidas <= 0) {
    clearInterval(intervalo);
    clearInterval(cronometro); // ADICIONADO
    mensagemFim.style.display = "block";
    musica.pause(); // ADICIONADO
  }
}

// ADICIONADO: agora estrela aumenta vida, dá pontos e toca som ao colidir
function ganharVida(estrela, i) {
  vidas++;
  pontos += 10;
  estrela.style.top = -100 + "px";
  estrela.style.left = Math.random() * (window.innerWidth - 60) + "px";
  somEstrela.play(); // ADICIONADO
  atualizarPlacar();
}

// ALTERADO: função iniciar agora gerencia múltiplos objetos, música e tempo
function iniciar() {
  vidas = 3;
  pontos = 0;
  tempo = 0;
  atualizarPlacar();
  meteoros.forEach(m => m.remove());
  estrelas.forEach(e => e.remove());
  meteoros = [];
  estrelas = [];
  criarMeteoros(5); // ADICIONADO
  criarEstrelas(2); // ADICIONADO
  musica.play();    // ADICIONADO

  intervalo = setInterval(() => {
    moverObjetos(meteoros, 8);
    moverObjetos(estrelas, 5);
    verificarColisaoObjetos(meteoros, perderVida);
    verificarColisaoObjetos(estrelas, ganharVida);
  }, 50);

  cronometro = setInterval(() => { // ADICIONADO
    tempo++;
    atualizarPlacar();
  }, 1000);
}

// ALTERADO: reiniciar agora reseta tudo e chama iniciar
function reiniciar() {
  mensagemFim.style.display = "none";
  iniciar();
}

// MANTIDO: ativa controle via teclado e inicia o jogo ao carregar a página
document.addEventListener("keydown", moverFoguete);
window.onload = iniciar;