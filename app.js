const repo = "SEU_USUARIO/frutas-estado"; // Substitua pelo seu usuário/repo
const filePath = "frutas.json";
const token = "SEU_TOKEN_GITHUB"; // Token com permissão para escrever no repo

const lista = document.getElementById('lista');
const inputs = {
  vermelha: document.getElementById('frutaVermelha'),
  amarela: document.getElementById('frutaAmarela'),
  roxa: document.getElementById('frutaRoxa')
};
const botoes = {
  vermelha: document.getElementById('enviarVermelha'),
  amarela: document.getElementById('enviarAmarela'),
  roxa: document.getElementById('enviarRoxa')
};

// Atualiza lista na tela
async function atualizarLista() {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`);
  const data = await res.json();
  const json = JSON.parse(atob(data.content));
  lista.innerHTML = '';
  json.frutas.forEach(f => {
    const li = document.createElement('li');
    li.textContent = `${f.cor}: ${f.nome}`;
    lista.appendChild(li);
  });
}

// Adiciona fruta
async function enviarFruta(cor) {
  const fruta = inputs[cor].value.trim();
  if (!fruta) return alert("Digite uma fruta!");

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    headers: { Authorization: `token ${token}` }
  });
  const data = await res.json();
  const json = JSON.parse(atob(data.content));
  json.frutas.push({ cor, nome: fruta });

  const novoConteudo = btoa(JSON.stringify(json, null, 2));
  await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Adicionar fruta ${cor}: ${fruta}`,
      content: novoConteudo,
      sha: data.sha
    })
  });

  inputs[cor].value = '';
  atualizarLista();
}

// Eventos dos botões
botoes.vermelha.addEventListener('click', () => enviarFruta('vermelha'));
botoes.amarela.addEventListener('click', () => enviarFruta('amarela'));
botoes.roxa.addEventListener('click', () => enviarFruta('roxa'));

// Atualiza lista ao carregar a página
atualizarLista();
