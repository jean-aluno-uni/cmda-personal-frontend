// rotas e funções gerais

// --- auth ---

const ROTAS = {
  login: '../login/index.html',
  recuperarSenha: '../login/recuperar-senha.html',
  otp: '../login/otp.html',
  novaSenha: '../login/nova-senha.html',
  home: '../monitoramento/home.html',
  condicoesMotor: '../monitoramento/condicoes-motor.html',
  rpm: '../monitoramento/rpm.html',
  diagnostico: '../diagnostico/diagnostico.html',
  alertas: '../alertas/alertas.html',
  perfil: '../perfil/perfil.html'
};

// le o "exp" de dentro do JWT (so pra saber se ja venceu; quem valida de verdade e a API)
function tokenExpirado(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch (e) {
    return true;
  }
}

// precisa de js/api.js carregado antes
function verificarAuth() {
  const token = lerToken();
  if (!token || tokenExpirado(token)) {
    limparSessao();
    if (token) guardarMensagemLogin('Sessão expirada, faça login novamente');
    window.location.href = ROTAS.login;
    return false;
  }
  return true;
}

// --- helpers pros dados da API ---

// a API manda data em UTC sem fuso (ex: 2026-10-05T14:30:00), entao forca o Z
function dataDaApi(texto) {
  if (!texto) return null;
  return new Date(/(Z|[+-]\d{2}:\d{2})$/i.test(texto) ? texto : texto + 'Z');
}

function tempoRelativo(texto) {
  const data = dataDaApi(texto);
  if (!data) return '—';
  const min = Math.max(0, Math.round((Date.now() - data.getTime()) / 60000));
  if (min < 1) return 'agora';
  if (min < 60) return min + ' min atrás';
  const horas = Math.floor(min / 60);
  if (horas < 24) return horas + 'h atrás';
  const dias = Math.floor(horas / 24);
  return dias === 1 ? '1 dia atrás' : dias + ' dias atrás';
}

function formatarDataHora(texto) {
  const data = dataDaApi(texto);
  if (!data) return '—';
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' +
    data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// texto que vem da API vai pro innerHTML, entao escapa antes
function esc(valor) {
  if (valor === null || valor === undefined) return '';
  return String(valor)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// card padrao de carregando / erro / vazio
function msgCard(texto, cor) {
  return '<p style="font-size:13px;color:' + (cor || 'var(--text-secondary)') + ';text-align:center;padding:16px 0;margin:0">' + esc(texto) + '</p>';
}

// badge do sino = alertas "high" das ultimas 24h
async function atualizarBadgeAlertas(veiculoId) {
  try {
    const lista = await apiCall('/vehicles/' + veiculoId + '/alerts?period=24h&pageSize=100');
    const qtd = lista.items.filter(function (a) { return a.nivel === 'high'; }).length;
    const sino = document.querySelector('#main-header .header-bell');
    if (!sino) return;
    const antigo = sino.querySelector('.header-badge');
    if (antigo) antigo.remove();
    if (qtd > 0) {
      sino.insertAdjacentHTML('beforeend', `<span class="header-badge" aria-label="${qtd} alertas críticos">${qtd}</span>`);
    }
  } catch (e) {
    // badge nao e essencial, se falhar a tela continua
  }
}

// login mostra a mensagem que o apiCall/verificarAuth guardou antes de redirecionar (ex: sessao expirada)
document.addEventListener('DOMContentLoaded', function () {
  const msgErro = document.getElementById('msg-erro');
  if (!msgErro) return;
  // le direto do sessionStorage (mesma chave do api.js) pra funcionar mesmo em tela que nao carrega o api.js
  const mensagem = sessionStorage.getItem('sf_msg_login');
  sessionStorage.removeItem('sf_msg_login');
  if (mensagem) {
    msgErro.textContent = mensagem;
    msgErro.classList.remove('hidden');
  }
});

// icones svg

function icoBack() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
}

function icoBell() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`;
}

function icoChevron() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
}

function icoBluetooth(cor) {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/></svg>`;
}

function icoHome() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
}

function icoDiag() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
}

function icoPerfil() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
}

function icSpeed() {
  return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 6v2M6 12H4M20 12h-2M7.05 7.05L8.46 8.46M16.95 7.05l-1.41 1.41"/><path d="M12 12l3-4" stroke="#C2182B" stroke-width="2.5"/><circle cx="12" cy="12" r="1.5" fill="#C2182B"/></svg>`;
}

function icoRpm() {
  return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C2182B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`;
}

function icoWarning() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="#C2182B"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;
}

// agua
function icoWater(cor, size) {
  cor  = cor  || '#3B82F6';
  size = size || 22;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`;
}

// oleo
function icoOil(cor, size) {
  cor  = cor  || '#C2182B';
  size = size || 22;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/><path d="M12 15v-4" stroke-width="2.5"/></svg>`;
}

// ar admissao
function icoAir(cor, size) {
  cor  = cor  || '#9CA3AF';
  size = size || 22;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>`;
}

// termometro geral
function icoThermo(cor, size) {
  cor  = cor  || '#10B981';
  size = size || 22;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>`;
}

// check / sucesso
function icoSuccess() {
  return `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
}

// X fechar
function icoClose() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
}

// === header ===

function renderHeader(config) {
  const el = document.getElementById('main-header');
  if (!el) return;

  const contAlertas = 0;
  const foto = '../img/foto-perfil.png';
  const nome = 'usuário';

  const btnEsq = config.back
    ? `<a href="${typeof config.back === 'string' ? config.back : ROTAS.home}" class="header-back" aria-label="Voltar">${icoBack()}</a>`
    : `<div class="header-spacer"></div>`;

  const badge = contAlertas > 0
    ? `<span class="header-badge" aria-label="${contAlertas} alertas críticos">${contAlertas}</span>` : '';

  el.innerHTML = `
    <div class="header-top">
      ${btnEsq}
      <div class="header-actions">
        <a href="${ROTAS.alertas}" class="header-bell" aria-label="Ver alertas">${icoBell()}${badge}</a>
        <a href="${ROTAS.perfil}" class="header-avatar" aria-label="Ver perfil">
          <img src="${foto}" alt="Foto de perfil de ${nome}"
               onerror="this.style.display='none';this.parentElement.innerHTML='<svg width=36 height=36 viewBox=\\'0 0 36 36\\' fill=\\'none\\'><circle cx=\\'18\\' cy=\\'18\\' r=\\'18\\' fill=\\'rgba(255,255,255,0.25)\\'/><circle cx=\\'18\\' cy=\\'14\\' r=\\'6\\' fill=\\'white\\' opacity=\\'0.85\\'/><path d=\\'M5 34c0-7.18 5.82-13 13-13s13 5.82 13 13\\' stroke=\\'white\\' stroke-width=\\'1.5\\' stroke-linecap=\\'round\\' fill=\\'none\\' opacity=\\'0.85\\'/></svg>'">
        </a>
      </div>
    </div>
    <div class="header-greeting">${config.greeting}</div>
    ${config.vehicle ? `<div class="header-vehicle">${esc(config.vehicle)}</div>` : ''}
  `;
}

// nav inferior

function renderBottomNav(ativo) {
  const el = document.getElementById('bottom-nav');
  if (!el) return;

  const tabsAtualizadas = [
    { id: 'home', label: 'Home', href: ROTAS.home, ico: icoHome() },
    { id: 'diagnostico', label: 'Diagnóstico', href: ROTAS.diagnostico, ico: icoDiag() },
    { id: 'perfil', label: 'Perfil', href: ROTAS.perfil, ico: icoPerfil() }
  ];

  el.innerHTML = tabsAtualizadas.map(t => `
    <a href="${t.href}" class="nav-item ${ativo === t.id ? 'active' : ''}" aria-label="${t.label}">
      ${t.ico}
      <span>${t.label}</span>
    </a>
  `).join('');
}

// TODO: talvez separar os graficos num arquivo proprio depois

// donut

function renderDonutChart(idContainer, fatias, tamanho) {
  tamanho = tamanho || 170;
  const cx = tamanho / 2;
  const cy = tamanho / 2;
  const r  = tamanho * 0.36;
  const sw = tamanho * 0.13;
  const C  = 2 * Math.PI * r;

  let circulos = '';
  let acumulado = 0;

  fatias.forEach(function(f) {
    const dash = (f.percentual / 100) * C;
    const gap  = C - dash;
    circulos += `<circle cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="${f.cor}" stroke-width="${sw}"
      stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
      stroke-dashoffset="${(-acumulado).toFixed(2)}"
      transform="rotate(-90 ${cx} ${cy})"
    />`;
    acumulado += dash;
  });

  const el = document.getElementById(idContainer);
  if (!el) return;
  el.innerHTML = `<svg width="${tamanho}" height="${tamanho}" viewBox="0 0 ${tamanho} ${tamanho}" role="img" aria-label="Gráfico de origem dos alertas">${circulos}</svg>`;
}

// gauge rpm

function renderRpmGauge(idContainer, rpm, rpmMax) {
  const size  = 220;
  const cx    = size / 2;
  const cy    = size / 2;
  const r     = 82;
  const sw    = 18;
  const C     = 2 * Math.PI * r;
  const arc   = C * 0.75;
  const perc  = Math.min(rpm / rpmMax, 1);
  const fill  = perc * arc;
  const pct   = Math.round(perc * 100);
  const font  = "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif";

  const el = document.getElementById(idContainer);
  if (!el) return;

  el.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="RPM atual: ${rpm} de ${rpmMax}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
        stroke="#F0F0F0" stroke-width="${sw}" stroke-linecap="round"
        stroke-dasharray="${arc.toFixed(2)} ${(C - arc).toFixed(2)}"
        transform="rotate(135 ${cx} ${cy})"
      />
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
        stroke="#C2182B" stroke-width="${sw}" stroke-linecap="round"
        stroke-dasharray="${fill.toFixed(2)} ${(C - fill).toFixed(2)}"
        transform="rotate(135 ${cx} ${cy})"
      />
      <text x="${cx}" y="${cy - 4}" font-size="40" font-weight="700"
        fill="#C2182B" text-anchor="middle" font-family="${font}">${pct}%</text>
      <text x="${cx}" y="${cy + 22}" font-size="13"
        fill="#6B7280" text-anchor="middle" font-family="${font}">${rpm.toLocaleString('pt-BR')} de ${rpmMax.toLocaleString('pt-BR')}</text>
    </svg>`;
}

// grafico de linha (temperaturas)

function renderLineChart(idContainer, historico) {
  const W    = 350;
  const H    = 185;
  const padL = 32;
  const padR = 10;
  const padT = 10;
  const padB = 28;
  const cW   = W - padL - padR;
  const cH   = H - padT - padB;

  const labels = historico.labels;
  const series = historico.series;

  const todos    = Object.values(series).flat();
  const minY     = Math.floor(Math.min(...todos) / 10) * 10 - 5;
  const maxY     = Math.ceil(Math.max(...todos) / 10) * 10 + 5;

  function xPos(i)   { return padL + (i / (labels.length - 1)) * cW; }
  function yPos(val) { return padT + cH - ((val - minY) / (maxY - minY)) * cH; }
  function pts(data) { return data.map((v, i) => `${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(' '); }

  const cores = { oleo: '#C2182B', liquido: '#3B82F6', ar: '#9CA3AF', geral: '#10B981' };

  let grids = '';
  for (let i = 0; i <= 4; i++) {
    const y   = padT + (i / 4) * cH;
    const val = Math.round(maxY - (i / 4) * (maxY - minY));
    grids += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}"
      stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4,4"/>
      <text x="${(padL - 4).toFixed(0)}" y="${(y + 4).toFixed(0)}" font-size="9" fill="#9CA3AF" text-anchor="end">${val}</text>`;
  }

  let xLabels = '';
  labels.forEach(function(lbl, i) {
    xLabels += `<text x="${xPos(i).toFixed(1)}" y="${H - 4}" font-size="9" fill="#9CA3AF" text-anchor="middle">${lbl}</text>`;
  });

  let linhas = '';
  Object.entries(series).forEach(function([key, data]) {
    linhas += `<polyline points="${pts(data)}" fill="none" stroke="${cores[key]}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`;
    data.forEach(function(v, i) {
      linhas += `<circle cx="${xPos(i).toFixed(1)}" cy="${yPos(v).toFixed(1)}" r="3.2" fill="${cores[key]}"/>`;
    });
  });

  const el = document.getElementById(idContainer);
  if (!el) return;
  el.innerHTML = `<svg width="100%" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Histórico de temperaturas">${grids}${xLabels}${linhas}</svg>`;
}

// mini ring

function renderMiniRing(idContainer, percentual, cor) {
  const size = 72;
  const cx   = size / 2;
  const cy   = size / 2;
  const r    = 27;
  const sw   = 8;
  const C    = 2 * Math.PI * r;
  const fill = (percentual / 100) * C;

  const el = document.getElementById(idContainer);
  if (!el) return;
  el.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${percentual}%">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#F0F0F0" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cor}" stroke-width="${sw}"
        stroke-dasharray="${fill.toFixed(2)} ${(C - fill).toFixed(2)}"
        stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
      <text x="${cx}" y="${cy + 5}" font-size="12" font-weight="700"
        fill="#1C1C1E" text-anchor="middle">${percentual}%</text>
    </svg>`;
}
