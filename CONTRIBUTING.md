# Regras de contribuição — CMDA Personal (frontend)

Regras do grupo para quem mexer neste repositório. Os dados vêm da API em `cmda-personal-backend`.

## Stack e como rodar

- HTML + CSS + JavaScript puro, sem framework e sem build. Cada tela é um `.html` com o seu `<script>` no final.
- Servir com servidor HTTP local (ex: `python -m http.server 5500`) — nunca abrir por `file://`.
- A API tem que estar rodando (`uvicorn app.main:app --reload` no backend). Endereço em `js/config.js`.
- Usuário de demonstração (seed do backend): `demo@cmda.app` / `Demo@1234`.

## Ordem dos scripts em toda tela

```html
<script src="../js/config.js"></script>  <!-- CONFIG.API_URL -->
<script src="../js/api.js"></script>     <!-- apiCall + sessão -->
<script src="../js/app.js"></script>     <!-- verificarAuth, header, gráficos, helpers -->
```

Nenhuma tela usa dados fixos. Toda informação exibida vem da API.

## Regras de integração

- **Toda chamada à API passa por `apiCall(caminho, { method, body })`** de `js/api.js`. Nada de `fetch` direto na tela.
  - Ela coloca o token no `Authorization`, converte o body para JSON e devolve o JSON da resposta.
  - Em erro, lança `Error` com a mensagem que a API mandou (`e.message`) e o status em `e.status`.
  - Em 401 com token (sessão expirada ou encerrada) ela já limpa a sessão e manda para o login com a mensagem. A tela não precisa tratar.
- Sessão só pelas funções do `api.js`: `salvarToken` / `lerToken`, `salvarVeiculoId` / `lerVeiculoId`, `limparSessao`. Não inventar chave nova no `sessionStorage` sem combinar.
- Toda tela protegida começa com `if (verificarAuth()) { ... }`.
- O id do veículo vem de `lerVeiculoId()` (gravado no login depois do `GET /vehicles`). Nunca fixar id no código.
- A API responde em **camelCase** (`dataHora`, `tabelaAlertas`, `velocidadeKmh`). Usar os nomes exatamente como vêm.
- Datas da API estão em UTC sem fuso: usar `tempoRelativo()` / `formatarDataHora()` do `app.js`, não `new Date()` direto.
- Texto vindo da API que vai para `innerHTML` passa por `esc()`.
- Toda tela integrada tem os três estados: **carregando** (`msgCard('Carregando...')`), **erro** (mensagem da API em vermelho) e **vazio / desconectado** (ex: telemetria com `disponivel: false` → "Veículo não conectado").

## Modelo a seguir

`alertas/alertas.html` é a tela de referência (depois `diagnostico/diagnostico.html`): `verificarAuth` → `lerVeiculoId` → funções `carregarX()` que chamam `apiCall` e renderizam → tratamento de erro no `catch`. Copiar esse padrão nas outras telas.

## Estilo

- Não mexer no design (`css/style.css`) sem combinar. Reaproveitar as classes que já existem.
- Código e comentários em português, comentários curtos e minúsculos.

## Git

- Branch `main`. Commits pequenos, em português, no formato `tipo: descrição` (`feat:`, `fix:`, `docs:`, `chore:`).
- Testar a tela no navegador com a API rodando (e olhar a aba Network) antes de dar push.
