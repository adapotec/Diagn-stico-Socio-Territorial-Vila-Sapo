// ================================================
// DATA MODULE — Vila Sapo Diagnostic Data
// 100% faithful to the original spreadsheet
// ================================================

// Google Sheets integration configuration
const SHEETS_CONFIG = {
  // Replace with your Google Sheets published CSV URL
  // Format: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv
  url: null,
  refreshInterval: 300000, // 5 minutes
};

// Static data extracted from the XLSX file (21 responses, 143 columns)
// Used as fallback when Google Sheets is not configured
const STATIC_DATA = {
  totalResponses: 21,
  lastUpdate: '2026-09-12',

  // [2] Quantas pessoas moram na residência
  pessoasPorResidencia: {
    '1': 2, '2': 5, '3': 2, '4': 5, '5': 5, '6': 1, '8 ou mais': 1
  },

  // [3] Renda familiar mensal
  rendaFamiliar: {
    'Menos de 1 salário-mínimo (Menos de R$1.621)': 13,
    'Até 2 salários-mínimos (entre R$1.621 e R$ 3.242)': 7,
    'Até 4 salários-mínimos (entre R$4.863 e R$ 6.484)': 1
  },

  // [4] Benefícios do governo (checkbox — exploded)
  beneficiosGoverno: {
    'Não recebemos auxílio do governo': 8,
    'Bolsa Família': 9,
    'Auxílio Gás': 5,
    'Tarifa Social de Energia': 5,
    'Benefício de Prestação Continuada (BPC)': 4,
    'Auxílio-doença': 1
  },

  // [5] Provedor financeiro
  provedorFinanceiro: {
    'Mãe': 12, 'Avó/Avô': 4, 'Pai': 3, 'Eu mesmo': 1, 'Esposo': 1
  },

  // [6] Idosos na moradia
  idosos: { 'Sim': 7, 'Não': 14 },

  // [7] Pessoas com deficiência
  pessoasDeficiencia: { 'Sim': 5, 'Não': 15 },

  // [8] Adolescente com experiência de maternidade/paternidade
  adolescentePai: { 'Sim': 3, 'Não': 17 },

  // [9] Mulher de referência
  mulherReferencia: {
    'Mãe': 12, 'Avó': 5, 'Esposa': 2, 'Filha': 1, 'Ela mesma': 1
  },

  // [10] Idade da mulher de referência
  idadeMulher: {
    'De 25 a 30 anos': 2, 'De 31 a 35 anos': 1, 'De 36 a 40 anos': 3,
    'De 41 a 45 anos': 3, 'De 46 a 50 anos': 3, 'De 51 a 59 anos': 4,
    '60 anos ou mais': 5
  },

  // [11] Mulher é mãe
  mulherMae: { 'Sim': 17, 'Não': 4 },

  // [12] Mulher mãe solo
  mulherMaeSolo: { 'Sim': 13, 'Não': 8 },

  // [13] Raça da mulher
  racaMulher: { 'Parda': 14, 'Branca': 4, 'Preta': 3 },

  // [14] Escolaridade da mulher
  escolaridadeMulher: {
    'Ensino médio completo': 8, 'Fundamental incompleto': 6,
    'Superior completo': 2, 'Não alfabetizada': 2,
    'Fundamental completo': 2, 'Técnico': 1
  },

  // [15] Ocupação da mulher
  ocupacaoMulher: {
    'Empregado doméstica': 5, 'Empregado privado': 4,
    'Aposentada': 3, 'Autônoma': 3, 'Servidora pública': 1,
    'Microempreendedora': 1, 'Desempregada': 1,
    'Beneficiada do INSS': 1, 'Dona de casa': 1
  },

  // [16] Tempo de residência da mulher
  tempoResidenciaMulher: {
    'Mais de 30 anos': 6, 'Até 5 anos': 5, 'Menos de 1 ano': 2,
    'Até 10 anos': 2, 'Até 20 anos': 2, 'Até 15 anos': 2,
    'Até 25 anos': 1, 'Até 30 anos': 1
  },

  // [21] Raça do homem
  racaHomem: { 'Parda': 7, 'Preta': 2, 'Branca': 1 },

  // [22] Escolaridade do homem
  escolaridadeHomem: {
    'Ensino médio completo': 4, 'Ensino médio incompleto': 3,
    'Não alfabetizado': 1, 'Fundamental incompleto': 1,
    'Fundamental completo': 1
  },

  // [23] Ocupação do homem
  ocupacaoHomem: {
    'Autônomo': 5, 'Aposentado': 2, 'Empregado privado': 2,
    'Informal/bicos': 1
  },

  // [65] Gênero do responsável pela moradia
  generoResponsavel: { 'Mulher': 17, 'Homem': 4 },

  // [66] Tipo de domicílio
  tipoDomicilio: { 'Casa em rua pública': 17, 'Casa de vila ou condomínio': 4 },

  // [67] Tipo de propriedade
  tipoPropriedade: { 'Moradia Própria': 13, 'Moradia Alugada': 8 },

  // [68] Quantidade de cômodos
  comodos: { '3 cômodos': 7, '4 cômodos': 11, '5 cômodos': 1, '6 ou mais cômodos': 2 },

  // [69] Banheiros
  banheiros: { '1 banheiro': 16, '2 banheiros': 4, '3 ou mais banheiros': 1 },

  // [70] Problemas estruturais
  problemasEstruturais: { 'Sim': 14, 'Não': 6 },

  // [71] Tipos de problemas estruturais (exploded from checkboxes)
  tiposProblemasEstruturais: {
    'Telhado com goteira': 17,
    'Infiltração': 11,
    'Mofo': 10,
    'Rachaduras': 9,
    'Risco elétrico': 5,
    'Falta de encanamento': 5,
    'Risco de desabamento': 4
  },

  // [72] Água encanada
  aguaEncanada: {
    'A água encanada chega até dentro da moradia': 18,
    'Água encanada chega somente até o terreno': 3
  },

  // [73] Tipo de abastecimento de água
  tipoAbastecimento: {
    'Rede geral de distribuição': 20,
    'Poço profundo ou artesiano': 1
  },

  // [74] Frequência de falta de água
  frequenciaFaltaAgua: {
    'Frequentemente': 8, 'Às Vezes': 10, 'Nunca': 3
  },

  // [75] Coleta de lixo regular
  coletaLixo: { 'Sim': 17, 'Não': 3 },

  // [76] Destino do lixo
  destinoLixo: {
    'Armazenado longe da moradia para acesso do serviço público de limpeza': 15,
    'Coletado na moradia pelo serviço público de limpeza': 6
  },

  // [77] Esgotamento sanitário
  esgotamentoSanitario: {
    'Rio ou córrego': 13,
    'Fossa sépticas ligada a rede de esgoto': 6,
    'Fossa sépticas não ligada a rede de esgoto': 1,
    'Não possui esgotamento sanitário': 1
  },

  // [78] Esgoto a céu aberto
  esgotoCeuAberto: { 'Sim': 21 },

  // [80] Moradia atingida por alagamentos
  alagamentos: { 'Sim': 19, 'Não': 2 },

  // [81] Prejuízos por enchentes
  prejuizosEnchentes: { 'Sim': 18, 'Não': 3 },

  // [82] Frequência de alagamentos
  frequenciaAlagamentos: {
    'Apenas em chuvas fortes': 16, 'Sempre que chove': 4, 'Nunca entrou água': 1
  },

  // [83] Tipos de prejuízos (exploded)
  tiposPrejuizos: {
    'Entrada de lama': 16,
    'Perda de móveis': 14,
    'Perda de eletrodomésticos': 8,
    'Danos em paredes': 9,
    'Problemas no piso': 8,
    'Estourou encanamento de água': 8,
    'Perda de alimentos': 7,
    'Perda de documentos': 8,
    'Queda de muro': 4,
    'Queda de telhado': 3
  },

  // [84] Acúmulo de lixo pela chuva
  acumuloLixoChuva: { 'Sim': 20, 'Não': 1 },

  // [85] Animais peçonhentos
  animaisPeconhentos: { 'Sim': 20, 'Não': 1 },

  // [86] Tipos de animais (exploded)
  tiposAnimais: {
    'Ratos': 20,
    'Baratas': 19,
    'Jacarés': 18,
    'Sapos': 16,
    'Aranha': 16,
    'Cobras': 8,
    'Insetos em grande quantidade': 8,
    'Morcegos': 2,
    'Escorpiões': 1,
    'Lacraia/centopeia': 2,
    'Tartaruga': 1
  },

  // [87] Prejuízos à família por enchentes (exploded)
  prejuizosFamilia: {
    'Estresse intenso': 17,
    'Perda de energia elétrica': 14,
    'Impedimento para ir ao trabalho': 13,
    'Impedimento para ir à escola': 13,
    'Perda de água potável': 12,
    'Prejuízos financeiros': 12,
    'Gripe intensa': 12,
    'Impedimento para ir ao hospital': 8,
    'Problemas de pele e respiração': 7,
    'Acidentes': 7,
    'Doenças infecciosas': 3,
    'Acidentes com animais': 1
  },

  // [88] Óbitos por enchente na comunidade
  obitosPorEnchente: { 'Sim': 10, 'Não': 10, 'Não sei': 1 },

  // [89] CadÚnico
  cadUnico: { 'Sim': 14, 'Não': 6, 'Não sei': 1 },

  // [90] Conhece CRAS/CREAS
  conheceCras: { 'Sim': 17, 'Não': 4 },

  // [91] Utiliza CRAS/CREAS
  utilizaCras: { 'Sim': 17, 'Não': 4 },

  // [92] Doenças crônicas
  doencasCronicas: { 'Sim': 10, 'Não': 10 },

  // [93] Rede de saúde
  redeSaude: { 'Rede pública de saúde': 20, 'Rede privada de saúde': 1 },

  // [94] Carteira SUS
  carteiraSUS: { 'Sim': 21 },

  // [95] Acesso a saúde
  acessoSaude: { 'Sempre': 10, 'Às vezes': 10, 'Nunca': 1 },

  // [97] Deixou de procurar saúde
  deixouProcurarSaude: { 'Sim': 15, 'Não': 6 },

  // [99] Emergência sem atendimento
  emergenciaSemAtendimento: { 'Sim': 10, 'Não': 11 },

  // [100] Doenças ligadas à água
  doencasAgua: { 'Sim': 8, 'Não': 13 },

  // [101] Tipos de doenças ligadas à água (exploded)
  tiposDoencasAgua: {
    'Diarreia / infecção intestinal': 8,
    'Micose': 4,
    'Dengue': 3,
    'Zika': 2,
    'Chikungunya': 1,
    'Leptospirose': 1,
    'Infecção de pele': 2
  },

  // [102] Acompanhamento psicológico
  acompanhamentoPsicologico: { 'Sim': 2, 'Não': 18 },

  // [103] Preocupações de saúde (exploded)
  preocupacoesSaude: {
    'Falta de dinheiro para cuidar da saúde': 16,
    'Demora para conseguir consulta ou exame': 16,
    'Falta de atendimento médico quando preciso': 13,
    'Falta de medicamentos': 11,
    'Doenças relacionadas ao ambiente (água, lixo, esgoto)': 12,
    'Problemas de saúde mental (ansiedade, depressão, estresse)': 10,
    'Doenças na família': 8,
    'Dificuldade de acesso ao posto de saúde ou hospital': 6,
    'Alimentação inadequada': 8
  },

  // [104] Acesso à internet
  acessoInternet: { 'Sim': 18, 'Não': 2 },

  // [107] Avaliação educação
  avaliacaoEducacao: { 'Boa': 11, 'Regular': 4, 'Muito boa': 1 },

  // [108] Conhece serviços de risco
  conheceServicosRisco: { 'Sim': 11, 'Não': 9 },

  // [109] Procurou serviço público em situação de risco
  procurouServicoRisco: { 'Sim': 7, 'Não': 14 },

  // [112] Recebe encomendas em casa
  recebeEncomendas: { 'Sim': 14, 'Não': 7 },

  // [114] Transporte público
  transportePublico: { 'Sim': 16, 'Não': 4 },

  // [115] Avaliação transporte
  avaliacaoTransporte: { 'Ruim': 12, 'Regular': 6 },

  // [116] Faltou comida nos últimos 3 meses
  faltouComida: { 'Sim': 8, 'Não': 13 },

  // [117] Frequência falta comida
  frequenciaFaltaComida: {
    'Nunca faltou comida': 12, 'Às vezes': 4,
    'Frequentemente': 3, 'Uma vez': 1
  },

  // [118] Ajuda alimentar
  ajudaAlimentar: { 'Não': 9, 'Às vezes': 7, 'Sim': 5 },

  // [119] Refeições por dia
  refeicoesDia: { '2': 4, '3': 8, '4': 5, '5': 3, '6': 1 },

  // [120] Situações vividas (exploded)
  situacoesVividas: {
    'Desemprego recente': 13,
    'Falta de moradia adequada': 9,
    'Doença grave na família': 9,
    'Falta de acesso à alimentação': 7,
    'Violência': 4,
    'Nenhuma das situações': 3
  },

  // [121] Sente-se seguro
  senteSerguro: { 'Sim': 13, 'Não': 7 },

  // [122] Áreas de risco próximas
  areasRisco: { 'Sim': 21 },

  // [123] Violência na família
  violenciaFamilia: { 'Sim': 9, 'Não': 10 },

  // [124] Adultos analfabetos
  adultosAnalfabetos: { 'Sim': 5, 'Não': 15 },

  // [125] Locais que evita
  locaisEvita: { 'Sim': 6, 'Não': 15 },

  // [126] Crianças brincam com segurança
  criancasSeguranca: { 'Sim': 6, 'As vezes': 6, 'Não': 4 },

  // [127] Rua pavimentada
  ruaPavimentada: { 'Não': 20, 'Sim': 1 },

  // [128] Problemas do bairro (exploded)
  problemasBairro: {
    'Alagamento': 21,
    'Falta de serviços públicos': 20,
    'Ruas sem pavimentação': 19,
    'Lixo acumulado': 17,
    'Falta de água': 14,
    'Falta de energia': 7,
    'Violência': 5,
    'Saneamento básico': 2
  },

  // [129] Preconceito contra a comunidade
  preconceito: { 'Sim': 19, 'Não': 2 },

  // [131] Conhece o Instituto Ádapo
  conheceAdapo: { 'Sim': 17, 'Não': 4 },

  // [132] Como conheceu o Ádapo
  comoConheceuAdapo: {
    'Eventos no bairro': 7, 'Através dos membros do Instituto Ádapo': 6,
    'Não conhecia': 2, 'Amigos/vizinhos': 2,
    'Através da Família/ Filhas': 1, 'Através de membros': 1
  },

  // [134] Participou de atividade
  participouAtividade: { 'Sim': 16, 'Não': 4 },

  // [136] Avaliação atividades
  avaliacaoAtividades: { 'Excelente': 15, 'Boa': 4 },

  // [137] Atividades desejadas (exploded)
  atividadesDesejadas: {
    'Distribuição de alimentos': 17,
    'Apoio psicológico': 17,
    'Cursos profissionalizantes': 14,
    'Atividades esportivas': 14,
    'Educação ambiental': 13,
    'Atividades culturais': 12
  },

  // [138] Sugestões dos moradores
  sugestoesMoradores: [
    'Tá bom demais',
    'Continuar',
    'Que pelo menos arrumasse menos a rua. Ja pensou a gente doente aqui? Vamo morrer, até porque eu sou o pai e a mãe da casa. A rua estando arrumada era muito bom, ja moro 32 anos aqui e essa rua aqui la no projeto nao sei onde ja ta arrumada.',
    'Atividades pra crianças',
    'Atividade voltada para crianças dentro do expectro, concientizar sobre o preconceito com crianças do expectro.',
    'Sim, para as crianças, melhoria para o bairro em estrutura',
    'Não tenho nada o que falar não',
    'Criar uma modalidade esportiva.',
    'Agradecimento ao Ádapo que continue dando reconhecimento pra comunidade ou pras crianças',
    'Que pudéssemos andar sem se preocupar com a água'
  ],

  // [143] Consumo de frutas/legumes
  consumoFrutas: { 'As vezes': 16, 'Sempre': 5 },

  // Crianças e adolescentes
  criancasEscolaPublica: 9,
  adolescentesEscolaPublica: 10,
  adolescentesAPe: 10,
  criancasSemAtividadeFisica: 6,
  criancasTotalComAtividade: 9,
  criancasSemAtividadeCultural: 5,
  criancasTotalComCultural: 8,

  // [32] Rede escolar crianças
  redeEscolarCriancas: { 'Escola pública': 9 },

  // [34] Locomoção crianças escola
  locomocaoCriancas: {
    'A pé': 5, 'A pé, Moto da família': 2,
    'Moto da família': 1, 'Transporte escolar, Carro pago': 1
  },

  // [38] Atividades físicas crianças
  atividadeFisicaCriancas: { 'Não': 6, 'Sim': 3 },

  // [39] Atividades culturais crianças
  atividadeCulturalCriancas: { 'Não': 5, 'Sim': 3 }
};

// Parse multi-select responses into individual items and count
function explodeMultiSelect(data, responses) {
  const counts = {};
  responses.forEach(response => {
    if (!response) return;
    const items = String(response).split(',').map(s => s.trim()).filter(Boolean);
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
  });
  return counts;
}

// Fetch data from Google Sheets
async function fetchFromGoogleSheets() {
  if (!SHEETS_CONFIG.url) return null;

  try {
    const response = await fetch(SHEETS_CONFIG.url);
    if (!response.ok) throw new Error('Failed to fetch');
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.warn('Google Sheets fetch failed, using static data:', error);
    return null;
  }
}

// Simple CSV parser
function parseCSV(text) {
  const lines = text.split('\n');
  if (lines.length < 2) return null;

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Get data — tries Google Sheets first, falls back to static
export async function getData() {
  const sheetsData = await fetchFromGoogleSheets();

  if (sheetsData) {
    console.log(`[ÁDAPO DATA] Loaded ${sheetsData.length} responses from Google Sheets`);
    return {
      raw: sheetsData,
      processed: STATIC_DATA, // TODO: process sheetsData dynamically
      source: 'google-sheets',
      totalResponses: sheetsData.length,
      lastUpdate: new Date().toLocaleDateString('pt-BR')
    };
  }

  console.log('[ÁDAPO DATA] Using static census data (21 responses)');
  return {
    raw: null,
    processed: STATIC_DATA,
    source: 'static',
    totalResponses: STATIC_DATA.totalResponses,
    lastUpdate: STATIC_DATA.lastUpdate
  };
}

export { STATIC_DATA, SHEETS_CONFIG };
