# CMDA Personal — Frontend Web

## Sobre o Projeto

O CMDA Personal, Central de Mapeamento de Desempenho Automotivo, permite que motoristas acompanhem os indicadores de telemetria do veículo: temperatura do motor, RPM, velocidade, alertas e diagnóstico completo.

## Equipe

Projeto desenvolvido pelo grupo CMDA no curso de Engenharia de Software.

## Como executar

O front consome a API do repositório **cmda-personal-backend**, então os dois precisam estar rodando.

1. Suba a API (detalhes no README do backend):
   ```bash
   cd cmda-personal-backend
   python -m app.seed.seed_data      # cria o usuário de demonstração
   uvicorn app.main:app --reload     # http://127.0.0.1:8000
   ```
2. Confira o endereço da API em `js/config.js` (`CONFIG.API_URL`, padrão `http://127.0.0.1:8000/api/v1`).
3. Sirva esta pasta com qualquer servidor HTTP local:
   - **VS Code:** extensão *Live Server* → "Go Live"
   - **Python:** `python -m http.server 5500`
   - **Node.js:** `npx serve .`
4. Acesse `http://localhost:5500` e entre com o usuário de demonstração.

### Credenciais de acesso (seed do backend)

| Campo | Valor |
|-------|-------|
| E-mail | `demo@cmda.app` |
| Senha | `Demo@1234` |

Existe também `outro@cmda.app` / `Outro@1234`, com outro veículo, para testar que um usuário não vê o veículo do outro (a API responde 403).

> Não abra os arquivos `.html` diretamente pelo sistema de arquivos (protocolo `file://`), pois alguns navegadores bloqueiam scripts nesse modo.

## Funcionalidades

| Tela | Descrição |
|------|-----------|
| Login | Autenticação com e-mail e senha |
| Recuperar senha | Fluxo completo: e-mail → OTP → nova senha |
| Home | Dashboard com velocidade, RPM, temperaturas e alertas |
| Condições do motor | Temperaturas detalhadas + gráfico histórico |
| RPM | Gauge 270° com status e diagnóstico |
| Diagnóstico | Status geral, anéis com a leitura atual e tabela do último diagnóstico |
| Alertas | Donut chart de origem com filtro por período (24h / 7 dias / 30 dias), tabela de alertas e modal com lista completa |
| Perfil | Dados do usuário, veículo conectado, sair e desconectar |

## Integração com a API

Todas as telas buscam os dados na API do backend por HTTP, enviando o token JWT em cada requisição. O front não usa mais dados fixos.

- **`js/config.js`** — URL base da API.
- **`js/api.js`** — função `apiCall(caminho, { method, body })`, usada por todas as telas. Ela coloca o token no cabeçalho `Authorization: Bearer ...`, envia/recebe JSON, devolve a mensagem de erro da API (`{"error": "..."}`) e, quando a API responde **401** (sessão expirada ou encerrada), limpa a sessão e volta para o login mostrando o motivo. No mesmo arquivo ficam as funções de guardar e ler o token e o id do veículo no `sessionStorage` (`sf_token` e `sf_veiculo_id`).
- **`js/app.js`** — `verificarAuth()` agora confere se existe um token real e se ele não venceu; além dos utilitários de tela (header, gráficos SVG, formatação de datas da API, `esc()` para texto vindo da API).

Fluxo: login (`POST /auth/login`) → guarda o token → `GET /vehicles` → guarda o id do veículo → cada tela chama as rotas `/vehicles/{id}/...`.

### Status por tela

| Tela | Rotas usadas | Integrada |
|------|--------------|-----------|
| Alertas | `GET /vehicles/{id}`, `GET /vehicles/{id}/alerts/summary`, `GET /vehicles/{id}/alerts` | Sim |
| Diagnóstico | `GET /vehicles/{id}`, `GET /vehicles/{id}/diagnostics`, `GET /vehicles/{id}/telemetry/latest` | Sim |
| Login / recuperar senha | `POST /auth/login`, `GET /vehicles`, `POST /auth/password/...` | Sim |
| Perfil | `GET /users/me`, `GET /vehicles/{id}`, `POST /vehicles/{id}/connect`, `POST /vehicles/{id}/disconnect`, `POST /auth/logout` | Sim |
| Home | `GET /users/me`, `GET /vehicles/{id}`, `GET /vehicles/{id}/telemetry/latest`, `GET /vehicles/{id}/alerts/summary`, `POST /vehicles/{id}/connect`, `POST /vehicles/{id}/disconnect` | Sim |
| Condições do motor | `GET /vehicles/{id}/telemetry/latest`, `GET /vehicles/{id}/temperature/history`, `GET /vehicles/{id}/diagnostics` | Sim |
| RPM | `GET /vehicles/{id}/telemetry/latest`, `GET /vehicles/{id}/diagnostics` | Sim |

## Estado de conexão

O estado de conexão vem do backend (campo `conectado` do veículo). Com o veículo desconectado, a rota de telemetria responde `disponivel: false` e as telas mostram traços (—) / "Veículo não conectado" em vez de números. Alertas e diagnóstico são histórico gravado no banco, então continuam aparecendo.

## Tecnologias utilizadas

- **HTML5** — estrutura semântica, múltiplas páginas
- **CSS3** — variáveis, Flexbox, Grid, media queries, animações
- **JavaScript** — DOM, eventos, `fetch` (via `apiCall`), `async/await`, sessionStorage, SVG dinâmico
- **SVG** — gráficos gerados por código: donut chart, gauge RPM, linha de temperatura, mini-anéis
- **API REST (FastAPI)** — backend em Python, JSON em camelCase, autenticação JWT

## Estrutura de arquivos

```

├── index.html                  # Entrada da aplicação (redireciona para login/)
├── CONTRIBUTING.md             # Regras do grupo para mexer no código
├── css/
│   └── style.css               # Design system completo
├── img/
│   ├── carro.png
│   ├── carro-desativado.png
│   └── foto-perfil.png
├── js/
│   ├── config.js               # URL da API
│   ├── api.js                  # apiCall + token e veículo no sessionStorage
│   └── app.js                  # verificarAuth, utilitários compartilhados e gráficos SVG
├── login/
│   ├── index.html              # Login
│   ├── recuperar-senha.html    # Recuperação de senha
│   ├── otp.html                # Código OTP
│   └── nova-senha.html         # Definir nova senha
├── monitoramento/
│   ├── home.html               # Dashboard principal
│   ├── condicoes-motor.html    # Detalhes do motor
│   └── rpm.html                # Detalhes de RPM
├── diagnostico/
│   └── diagnostico.html        # Aba diagnóstico
├── alertas/
│   └── alertas.html            # Aba alertas (modelo de integração para as outras)
└── perfil/
    └── perfil.html             # Aba perfil
```

## Design System

| Token | Valor |
|-------|-------|
| Cor primária | `#C2182B` |
| Gradiente header | `#7A0A14 → #C2182B` |
| Background | `#F4F5F7` |
| Largura máxima | `430px` (mobile-first) |
| Fonte | Plus Jakarta Sans (Google Fonts) |
