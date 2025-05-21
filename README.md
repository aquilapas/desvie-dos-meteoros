from textwrap import dedent

markdown_content = dedent("""
# 🚀 Jogo "Desvie dos Meteoros" – Documentação do Código

Este documento descreve em detalhes o funcionamento do código JavaScript do jogo “Desvie dos Meteoros”, com explicações linha por linha, marcações de **ADICIONADO** e **ALTERADO**, ideal para fins educacionais, apresentação de projeto ou versionamento.

---

## 📁 Estrutura do Jogo

- `index.html` – Interface do jogo (HTML)
- `style.css` – Estilização visual (CSS)
- `script.js` – Lógica do jogo (JS)
- `foguete.png`, `meteoro.png`, `estrela.png` – Imagens usadas
- `musica-fundo.mp3`, `som-colisao.mp3`, `som-estrela.mp3` – Efeitos sonoros

---

## 🎮 Funcionalidades Implementadas

- Múltiplos meteoros descendo aleatoriamente
- Estrelas bônus que aumentam pontuação e vida
- Trilha sonora e efeitos sonoros
- Sistema de vidas
- Contador de tempo
- HUD com pontuação e tempo
- Reinício automático ao perder

---

## 📜 Código com Anotações

```js
// ADICIONADO: suporte a múltiplos meteoros, estrelas, fundo infinito, vidas, som, placar, tempo e efeitos sonoros

// Seleciona os elementos principais do jogo
let foguete = document.getElementById("foguete"); // Elemento do foguete
let jogo = document.getElementById("jogo");       // Área principal do jogo // ADICIONADO
let mensagemFim = document.getElementById("mensagemFim"); // Mensagem de fim de jogo

// ADICIONADO: elementos de UI para placar e tempo
let placarEl = document.createElement("div");
// ... restante do código documentado como no script.js
