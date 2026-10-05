// cliente http da api

// pode ser sobrescrito definindo window.SF_API_URL antes de carregar este arquivo
const API_BASE_URL = (window.SF_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const SESSAO = {
  token: 'sf_token',
  veiculoId: 'sf_vehicle_id',
  conectado: 'sf_conectado',
  resetEmail: 'sf_reset_email',
  resetToken: 'sf_reset_token'
};

function ApiError(status, mensagem, dados) {
  this.status = status;
  this.message = mensagem;
  this.dados = dados;
}
ApiError.prototype = Object.create(Error.prototype);

async function apiFetch(caminho, opcoes) {
  opcoes = opcoes || {};
  const headers = { 'Accept': 'application/json' };
  if (opcoes.body !== undefined) headers['Content-Type'] = 'application/json';

  const token = sessionStorage.getItem(SESSAO.token);
  if (opcoes.auth !== false && token) headers['Authorization'] = 'Bearer ' + token;

  let resp;
  try {
    resp = await fetch(API_BASE_URL + caminho, {
      method: opcoes.method || 'GET',
      headers: headers,
      body: opcoes.body !== undefined ? JSON.stringify(opcoes.body) : undefined
    });
  } catch (e) {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  let dados = null;
  const texto = await resp.text();
  if (texto) {
    try { dados = JSON.parse(texto); } catch (e) { dados = null; }
  }

  if (!resp.ok) {
    // sessão expirada em rota autenticada
    if (resp.status === 401 && opcoes.auth !== false && token) {
      sessionStorage.clear();
      window.location.href = ROTAS.login;
    }
    const msg = (dados && (dados.message || dados.error)) || 'Erro inesperado (' + resp.status + ').';
    throw new ApiError(resp.status, Array.isArray(msg) ? msg.join(' ') : msg, dados);
  }

  return dados;
}

// aceita { token }, { accessToken } ou { access_token }
function extrairToken(dados) {
  return dados && (dados.token || dados.accessToken || dados.access_token);
}

// aceita array puro ou { vehicles } / { data }
function extrairLista(dados, chave) {
  if (Array.isArray(dados)) return dados;
  if (dados && Array.isArray(dados[chave])) return dados[chave];
  if (dados && Array.isArray(dados.data)) return dados.data;
  return [];
}

// --- endpoints ---

const API = {
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  registrar: (name, email, password) => apiFetch('/auth/register', { method: 'POST', body: { name, email, password }, auth: false }),

  esqueciSenha: (email) => apiFetch('/auth/password/forgot', { method: 'POST', body: { email }, auth: false }),
  verificarCodigo: (email, code) => apiFetch('/auth/password/verify', { method: 'POST', body: { email, code }, auth: false }),
  redefinirSenha: (resetToken, password) => apiFetch('/auth/password/reset', { method: 'POST', body: { resetToken, password }, auth: false }),

  usuarioAtual: () => apiFetch('/users/me'),
  veiculos: () => apiFetch('/vehicles'),
  vincularVeiculo: (model, plate) => apiFetch('/vehicles', { method: 'POST', body: { model, plate } }),
  veiculo: (id) => apiFetch('/vehicles/' + encodeURIComponent(id)),
  desconectarVeiculo: (id) => apiFetch('/vehicles/' + encodeURIComponent(id) + '/disconnect', { method: 'POST' })
};
