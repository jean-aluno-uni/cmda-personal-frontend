// dados do app (mock por enquanto)
// TODO: trocar por chamada de API quando tiver backend

const ASSET_PREFIX = '../';

const DADOS = {
  usuario: {
    nome: "Amanda Pereira",
    email: "Amanda.Pereira@gmail.com",
    foto: ASSET_PREFIX + "img/foto-perfil.png"
  },

  veiculo: {
    modelo: "Hyundai HB20",
    placa: "GSBH",
    foto: ASSET_PREFIX + "img/carro.png",
    fotoDesativado: ASSET_PREFIX + "img/carro-desativado.png",
    conectado: false
  },

  telemetria: {
    velocidade: 120,
    rpm: 2100,
    rpmMax: 3000,
    tempOleo: 90,
    tempLiquido: 30,
    tempAr: 30,
    tempGeral: 80
  },

  alertas: [
    { id: 24, tempo: "6,30 minutos", local: "Motor",      observacao: "Óleo com temperatura elevada",             nivel: "high" },
    { id: 23, tempo: "4,30 minutos", local: "Motor",      observacao: "RPM abaixo do esperado para a velocidade", nivel: "high" },
    { id: 22, tempo: "3,30 minutos", local: "Transmissão",observacao: "Óleo com temperatura elevada",             nivel: "medium" },
    { id: 21, tempo: "2,30 minutos", local: "Motor",      observacao: null,                                       nivel: "low" }
  ],

  tabelaAlertas: [
    { id: 24, tempo: "30 min atrás", local: "Motor",       nivel: "high",   observacao: "Óleo com temperatura elevada" },
    { id: 23, tempo: "50 min atrás", local: "Motor",       nivel: "high",   observacao: "RPM abaixo do esperado" },
    { id: 22, tempo: "1h atrás",     local: "Transmissão", nivel: "medium", observacao: null }
  ],

  diagnostico: [
    { indicador: "RPM",                         valor: "2.100",    alerta: false, observacao: "Normal",             referencia: "750 – 3.000 RPM" },
    { indicador: "Velocidade",                  valor: "120 km/h", alerta: false, observacao: "Normal",             referencia: "0 – 200 km/h" },
    { indicador: "Temp. geral",                 valor: "80 °C",    alerta: false, observacao: "Normal",             referencia: "até 90 °C" },
    { indicador: "Temp. ar admissão",           valor: "30 °C",    alerta: false, observacao: "Normal",             referencia: "até 40 °C" },
    { indicador: "Temp. óleo",                  valor: "90 °C",    alerta: true,  observacao: "Temperatura elevada",referencia: "até 85 °C" },
    { indicador: "Temp. líquido arrefecimento", valor: "30 °C",    alerta: false, observacao: "Normal",             referencia: "até 90 °C" }
  ],

  origemAlertas: [
    { local: "Motor",       percentual: 52.81, cor: "#C2182B" },
    { local: "Transmissão", percentual: 42.59, cor: "#3B82F6" },
    { local: "Bateria",     percentual: 4.60,  cor: "#10B981" }
  ],

  alertasPorPeriodo: {
    '24h': {
      total: 8,
      origemAlertas: [
        { local: "Motor",       percentual: 52.81, cor: "#C2182B" },
        { local: "Transmissão", percentual: 42.59, cor: "#3B82F6" },
        { local: "Bateria",     percentual: 4.60,  cor: "#10B981" }
      ],
      tabelaAlertas: [
        { id: 24, tempo: "30 min atrás", local: "Motor",        nivel: "high",   descricao: "Temperatura do óleo elevada" },
        { id: 23, tempo: "50 min atrás", local: "Motor",        nivel: "high",   descricao: "RPM abaixo do esperado" },
        { id: 22, tempo: "1h atrás",     local: "Transmissão",  nivel: "medium", descricao: "Vibração anormal detectada" },
        { id: 21, tempo: "2h atrás",     local: "Bateria",      nivel: "low",    descricao: "Tensão levemente baixa" },
        { id: 20, tempo: "3h atrás",     local: "Motor",        nivel: "medium", descricao: "Pressão de óleo instável" }
      ],
      todosAlertas: [
        { id: 24, tempo: "30 min atrás", local: "Motor",        nivel: "high",   descricao: "Temperatura do óleo elevada" },
        { id: 23, tempo: "50 min atrás", local: "Motor",        nivel: "high",   descricao: "RPM abaixo do esperado" },
        { id: 22, tempo: "1h atrás",     local: "Transmissão",  nivel: "medium", descricao: "Vibração anormal detectada" },
        { id: 21, tempo: "2h atrás",     local: "Bateria",      nivel: "low",    descricao: "Tensão levemente baixa" },
        { id: 20, tempo: "3h atrás",     local: "Motor",        nivel: "medium", descricao: "Pressão de óleo instável" },
        { id: 19, tempo: "4h atrás",     local: "Transmissão",  nivel: "high",   descricao: "Falha na troca de marchas" },
        { id: 18, tempo: "6h atrás",     local: "Motor",        nivel: "low",    descricao: "Consumo levemente elevado" },
        { id: 17, tempo: "8h atrás",     local: "Transmissão",  nivel: "medium", descricao: "Temperatura da transmissão alta" }
      ]
    },
    '7d': {
      total: 23,
      origemAlertas: [
        { local: "Motor",       percentual: 61.15, cor: "#C2182B" },
        { local: "Transmissão", percentual: 29.52, cor: "#3B82F6" },
        { local: "Bateria",     percentual: 9.33,  cor: "#10B981" }
      ],
      tabelaAlertas: [
        { id: 24, tempo: "30 min atrás",  local: "Motor",        nivel: "high",   descricao: "Temperatura do óleo elevada" },
        { id: 23, tempo: "1h atrás",      local: "Motor",        nivel: "high",   descricao: "RPM abaixo do esperado" },
        { id: 22, tempo: "3h atrás",      local: "Transmissão",  nivel: "medium", descricao: "Vibração anormal detectada" },
        { id: 21, tempo: "6h atrás",      local: "Bateria",      nivel: "low",    descricao: "Tensão levemente baixa" },
        { id: 20, tempo: "1 dia atrás",   local: "Motor",        nivel: "high",   descricao: "Superaquecimento detectado" }
      ],
      todosAlertas: [
        { id: 24, tempo: "30 min atrás",  local: "Motor",        nivel: "high",   descricao: "Temperatura do óleo elevada" },
        { id: 23, tempo: "1h atrás",      local: "Motor",        nivel: "high",   descricao: "RPM abaixo do esperado" },
        { id: 22, tempo: "3h atrás",      local: "Transmissão",  nivel: "medium", descricao: "Vibração anormal detectada" },
        { id: 21, tempo: "6h atrás",      local: "Bateria",      nivel: "low",    descricao: "Tensão levemente baixa" },
        { id: 20, tempo: "1 dia atrás",   local: "Motor",        nivel: "high",   descricao: "Superaquecimento detectado" },
        { id: 19, tempo: "1 dia atrás",   local: "Transmissão",  nivel: "medium", descricao: "Troca de marcha irregular" },
        { id: 18, tempo: "2 dias atrás",  local: "Motor",        nivel: "high",   descricao: "Sensor de O2 com leitura anômala" },
        { id: 17, tempo: "2 dias atrás",  local: "Bateria",      nivel: "low",    descricao: "Carga de bateria abaixo de 20%" },
        { id: 16, tempo: "3 dias atrás",  local: "Motor",        nivel: "medium", descricao: "Consumo acima do normal" },
        { id: 15, tempo: "3 dias atrás",  local: "Transmissão",  nivel: "high",   descricao: "Perda de pressão hidráulica" },
        { id: 14, tempo: "4 dias atrás",  local: "Motor",        nivel: "high",   descricao: "Falha no sensor de temperatura" },
        { id: 13, tempo: "4 dias atrás",  local: "Bateria",      nivel: "medium", descricao: "Tensão instável durante partida" },
        { id: 12, tempo: "5 dias atrás",  local: "Motor",        nivel: "low",    descricao: "Pressão de óleo levemente baixa" },
        { id: 11, tempo: "5 dias atrás",  local: "Transmissão",  nivel: "medium", descricao: "Temperatura elevada na caixa" },
        { id: 10, tempo: "6 dias atrás",  local: "Motor",        nivel: "high",   descricao: "Temperatura do líquido elevada" }
      ]
    },
    '30d': {
      total: 47,
      origemAlertas: [
        { local: "Motor",       percentual: 55.37, cor: "#C2182B" },
        { local: "Transmissão", percentual: 37.10, cor: "#3B82F6" },
        { local: "Bateria",     percentual: 7.53,  cor: "#10B981" }
      ],
      tabelaAlertas: [
        { id: 47, tempo: "30 min atrás",  local: "Motor",        nivel: "high",   descricao: "Temperatura do óleo elevada" },
        { id: 46, tempo: "1h atrás",      local: "Motor",        nivel: "high",   descricao: "RPM abaixo do esperado" },
        { id: 45, tempo: "3h atrás",      local: "Transmissão",  nivel: "medium", descricao: "Vibração anormal detectada" },
        { id: 44, tempo: "6h atrás",      local: "Bateria",      nivel: "low",    descricao: "Tensão levemente baixa" },
        { id: 43, tempo: "1 dia atrás",   local: "Motor",        nivel: "high",   descricao: "Superaquecimento detectado" }
      ],
      todosAlertas: [
        { id: 47, tempo: "30 min atrás",  local: "Motor",        nivel: "high",   descricao: "Temperatura do óleo elevada" },
        { id: 46, tempo: "1h atrás",      local: "Motor",        nivel: "high",   descricao: "RPM abaixo do esperado" },
        { id: 45, tempo: "3h atrás",      local: "Transmissão",  nivel: "medium", descricao: "Vibração anormal detectada" },
        { id: 44, tempo: "6h atrás",      local: "Bateria",      nivel: "low",    descricao: "Tensão levemente baixa" },
        { id: 43, tempo: "1 dia atrás",   local: "Motor",        nivel: "high",   descricao: "Superaquecimento detectado" },
        { id: 42, tempo: "2 dias atrás",  local: "Transmissão",  nivel: "medium", descricao: "Troca de marcha irregular" },
        { id: 41, tempo: "2 dias atrás",  local: "Motor",        nivel: "high",   descricao: "Sensor de O2 com leitura anômala" },
        { id: 40, tempo: "3 dias atrás",  local: "Bateria",      nivel: "low",    descricao: "Carga de bateria abaixo de 20%" },
        { id: 39, tempo: "4 dias atrás",  local: "Motor",        nivel: "medium", descricao: "Consumo acima do normal" },
        { id: 38, tempo: "5 dias atrás",  local: "Transmissão",  nivel: "high",   descricao: "Perda de pressão hidráulica" },
        { id: 37, tempo: "6 dias atrás",  local: "Motor",        nivel: "high",   descricao: "Falha no sensor de temperatura" },
        { id: 36, tempo: "7 dias atrás",  local: "Bateria",      nivel: "medium", descricao: "Tensão instável durante partida" },
        { id: 35, tempo: "8 dias atrás",  local: "Motor",        nivel: "low",    descricao: "Pressão de óleo levemente baixa" },
        { id: 34, tempo: "9 dias atrás",  local: "Transmissão",  nivel: "medium", descricao: "Temperatura elevada na caixa" },
        { id: 33, tempo: "10 dias atrás", local: "Motor",        nivel: "high",   descricao: "Temperatura do líquido elevada" },
        { id: 32, tempo: "11 dias atrás", local: "Motor",        nivel: "medium", descricao: "Filtro de ar com restrição" },
        { id: 31, tempo: "12 dias atrás", local: "Transmissão",  nivel: "high",   descricao: "Óleo da transmissão degradado" },
        { id: 30, tempo: "13 dias atrás", local: "Bateria",      nivel: "low",    descricao: "Alternador com baixa eficiência" },
        { id: 29, tempo: "14 dias atrás", local: "Motor",        nivel: "high",   descricao: "Sensor de pressão com falha" },
        { id: 28, tempo: "15 dias atrás", local: "Motor",        nivel: "medium", descricao: "Vela de ignição desgastada" },
        { id: 27, tempo: "16 dias atrás", local: "Transmissão",  nivel: "low",    descricao: "Folga excessiva na embreagem" },
        { id: 26, tempo: "18 dias atrás", local: "Motor",        nivel: "high",   descricao: "Temperatura do óleo elevada" },
        { id: 25, tempo: "20 dias atrás", local: "Bateria",      nivel: "medium", descricao: "Tensão de carga abaixo do ideal" },
        { id: 24, tempo: "22 dias atrás", local: "Motor",        nivel: "high",   descricao: "Superaquecimento detectado" },
        { id: 23, tempo: "25 dias atrás", local: "Transmissão",  nivel: "high",   descricao: "Troca de marchas com atraso" }
      ]
    }
  },

  historicoTemperatura: {
    labels: ["17/06", "18/06", "19/06", "20/06", "21/06", "22/06"],
    series: {
      oleo:    [45, 52, 62, 74, 83, 90],
      liquido: [40, 42, 40, 36, 32, 30],
      ar:      [28, 30, 32, 30, 29, 30],
      geral:   [37, 41, 44, 46, 48, 50]
    }
  }
};
