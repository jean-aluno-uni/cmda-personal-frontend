// comunicacao com a API do backend
// toda tela chama a API por aqui (apiCall), nunca com fetch direto

// --- sessao (sessionStorage) ---

const CHAVE_TOKEN = 'sf_token';
const CHAVE_VEICULO = 'sf_veiculo_id';
const CHAVE_MSG_LOGIN = 'sf_msg_login';

function salvarToken(token) {
  sessionStorage.setItem(CHAVE_TOKEN, token);
}

function lerToken() {
  return sessionStorage.getItem(CHAVE_TOKEN);
}

function salvarVeiculoId(id) {
  sessionStorage.setItem(CHAVE_VEICULO, String(id));
}

function lerVeiculoId() {
  const id = sessionStorage.getItem(CHAVE_VEICULO);
  return id ? Number(id) : null;
}

function limparSessao() {
  sessionStorage.clear();
}

// mensagem pra tela de login mostrar depois do redirecionamento (ex: sessao expirada)
function guardarMensagemLogin(mensagem) {
  sessionStorage.setItem(CHAVE_MSG_LOGIN, mensagem);
}

function lerMensagemLogin() {
  const mensagem = sessionStorage.getItem(CHAVE_MSG_LOGIN);
  sessionStorage.removeItem(CHAVE_MSG_LOGIN);
  return mensagem;
}

// --- chamada da API ---

// a API devolve erro como {"error": "..."}; validacao do FastAPI (422) vem como {"detail": [...]}
function extrairMensagemErro(corpo, status) {
  if (corpo && corpo.error) return corpo.error;
  if (corpo && typeof corpo.detail === 'string') return corpo.detail;
  if (corpo && Array.isArray(corpo.detail) && corpo.detail.length > 0) {
    return corpo.detail.map(function (d) { return (d.msg || '').replace(/^Value error, /, ''); }).join('; ');
  }
  return 'Erro inesperado (' + status + ')';
}

// caminho: ex '/vehicles' ou '/vehicles/1/alerts/summary?period=24h'
// opcoes: { method, body } -> body e convertido pra JSON
// retorna o JSON da resposta (null se 204); se der erro lanca Error com a mensagem da API
async function apiCall(caminho, opcoes) {
  opcoes = opcoes || {};

  const headers = { 'Accept': 'application/json' };
  if (opcoes.body !== undefined) headers['Content-Type'] = 'application/json';

  const token = lerToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  let resposta;
  try {
    resposta = await fetch(CONFIG.API_URL + caminho, {
      method: opcoes.method || 'GET',
      headers: headers,
      body: opcoes.body !== undefined ? JSON.stringify(opcoes.body) : undefined
    });
  } catch (e) {
    throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando.');
  }

  if (resposta.status === 204) return null;

  let corpo = null;
  try {
    corpo = await resposta.json();
  } catch (e) {
    corpo = null;
  }

  if (!resposta.ok) {
    const mensagem = extrairMensagemErro(corpo, resposta.status);
    const erro = new Error(mensagem);
    erro.status = resposta.status;

    // 401 com token = sessao expirada/encerrada -> volta pro login mostrando o motivo
    // (sem token, ex: senha errada no POST /auth/login, quem chamou trata a mensagem)
    if (resposta.status === 401 && token) {
      limparSessao();
      guardarMensagemLogin(mensagem);
      window.location.href = ROTAS.login;
    }
    throw erro;
  }

  return corpo;
}
