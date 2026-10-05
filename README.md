# CMDA SmartFleet — Frontend Web

## Sobre o Projeto

O CMDA SmartFleet permite que condutores e gestores de frota acompanhem remotamente indicadores de telemetria do veículo: temperatura do motor, RPM, velocidade, alertas e diagnóstico completo.

## Equipe

Projeto desenvolvido pelo grupo CMDA no curso de Engenharia de Software.

## Como executar

1. Faça o download ou clone o repositório
2. Na raiz do projeto, instale as dependências e inicie o servidor:
   ```bash
   npm install
   npm start
   ```
3. Acesse `http://localhost:8080/login/` no navegador
4. Entre com uma conta existente ou clique em **Criar conta**

### API

O frontend consome a API em `http://localhost:3000` (configurável em `js/api.js` ou definindo `window.SF_API_URL`). O backend precisa liberar CORS para `http://localhost:8080`.

> Não abra os arquivos `.html` diretamente pelo sistema de arquivos (protocolo `file://`), pois alguns navegadores bloqueiam scripts nesse modo.

## Funcionalidades

| Tela | Descrição |
|------|-----------|
| Login | Autenticação com usuário e senha |
| Recuperar senha | Fluxo completo: e-mail → OTP → nova senha |
| Home | Dashboard com velocidade, RPM, temperaturas e alertas |
| Condições do motor | Temperaturas detalhadas + gráfico histórico de 6 dias |
| RPM | Gauge 270° com status e diagnóstico |
| Diagnóstico | Tabela completa com 6 indicadores e mini-anéis de progresso |
| Alertas | Donut chart de origem com filtro por período (24h / 7 dias / 30 dias), tabela de alertas e modal com lista completa |
| Perfil | Dados do usuário, veículo conectado, sair e desconectar |

## Estado de conexão

A plataforma simula dois estados:

- **Conectado:** exibe todos os dados de telemetria do mock
- **Desconectado:** exibe traços (—) e mensagem de veículo não conectado

O app inicia **desconectado por padrão**. Para conectar, acesse a tela **Home** e clique em **"Conectar ao veículo"**. Para desconectar, vá em **Perfil → Desconectar veículo**.

O estado é controlado pela chave `sf_conectado` no `sessionStorage` e é resetado a cada novo login.

## Dados mockados

Todos os dados estão no arquivo `js/dados.js`. Os principais valores mock são:

```
Veículo:   Hyundai HB20 · Placa GSBH
Usuário:   Amanda Pereira
Velocidade: 120 km/h
RPM:        2100 (máx 3000)
Temp. óleo: 90 °C  ⚠ elevada
Temp. líquido: 30 °C
Temp. ar:   30 °C
Temp. geral: 80 °C
```

## Tecnologias utilizadas

- **HTML5** — estrutura semântica, múltiplas páginas
- **CSS3** — variáveis, Flexbox, Grid, media queries, animações
- **JavaScript** — manipulação de DOM, eventos, sessionStorage, SVG dinâmico
- **SVG** — gráficos gerados por código: donut chart, gauge RPM, linha de temperatura, mini-anéis

## Estrutura de arquivos

```

├── index.html                  # Entrada da aplicação (redireciona para login/)
├── css/
│   └── style.css               # Design system completo
├── img/
│   ├── carro.png
│   ├── carro-desativado.png
│   └── foto-perfil.png
├── js/
│   ├── dados.js                # Dados mockados
│   └── app.js                  # Utilitários compartilhados e gráficos SVG
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
│   └── alertas.html            # Aba alertas
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
