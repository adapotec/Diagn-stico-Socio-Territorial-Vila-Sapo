// ================================================
// CHARTS MODULE — Chart.js configurations
// Reestruturado conforme a Matriz Geral de Indicadores Socioterritoriais
// Todos os dados 100% convertidos para Porcentagem (%)
// Estilo Editorial Brutalista (Zero roxo, bordas afiadas, alto contraste)
// ================================================

import Chart from 'chart.js/auto';
import { STATIC_DATA } from './data.js';
import { chartColors, getBarOptions, getDoughnutOptions, getRadarOptions, sortByValue, toPercent, adapoDataLabelsPlugin } from './utils.js';

// Registrar plugin de exibição direta e permanente das porcentagens (%) em todos os gráficos
Chart.register(adapoDataLabelsPlugin);

const d = STATIC_DATA;
const TOTAL = 21; // Base censitária consolidada das famílias às margens do Rio Ingaúra

// Helpers para garantir saída estrita em porcentagem (%)
const toPct = (v, tot = TOTAL) => toPercent(v, tot);
const mapValuesToPct = (obj, tot = TOTAL) => Object.values(obj).map(v => toPct(v, tot));

// Padrões globais do Chart.js
Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
Chart.defaults.color = '#64748B';
Chart.defaults.elements.bar.borderRadius = 2;
Chart.defaults.elements.bar.borderSkipped = false;

// Registro e cache de instâncias para destruição/recriação segura
const chartInstances = {};

function createChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }
  chartInstances[canvasId] = new Chart(canvas.getContext('2d'), config);
  return chartInstances[canvasId];
}

export function initCharts() {

  // ========================================================
  // PAINEL 01: SÍNTESE GERAL & IVS
  // ========================================================

  // Radar das 5 Dimensões Socioterritoriais
  createChart('chart-ivs-radar', {
    type: 'radar',
    data: {
      labels: d.ivsGeral.labels,
      datasets: [{
        label: 'Vulnerabilidade Setorial (%)',
        data: d.ivsGeral.scores,
        backgroundColor: 'rgba(232, 108, 29, 0.22)',
        borderColor: '#E86C1D',
        borderWidth: 2.5,
        pointBackgroundColor: '#E86C1D',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4.5,
        pointHoverRadius: 6
      }]
    },
    options: getRadarOptions()
  });

  // ========================================================
  // PAINEL 02: INDICADORES SOCIOECONÔMICOS
  // ========================================================

  // Faixas de Renda Familiar
  createChart('chart-renda-socio', {
    type: 'doughnut',
    data: {
      labels: ['Menos de 1 SM', 'Até 2 SM', 'Até 4 SM'],
      datasets: [{
        data: [13, 7, 1].map(v => toPct(v)),
        backgroundColor: ['#DC2626', '#E86C1D', '#059669'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Inserção no Trabalho & Informalidade (base: 31 trabalhadores)
  createChart('chart-ocupacao-socio', {
    type: 'bar',
    data: {
      labels: Object.keys(d.ocupacaoTrabalhoGeral),
      datasets: [{
        label: 'Trabalhadores (%)',
        data: Object.values(d.ocupacaoTrabalhoGeral).map(v => toPct(v, 31)),
        backgroundColor: ['#DC2626', '#D97706', '#059669', '#64748B'],
        maxBarThickness: 35
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Densidade Domiciliar (Moradores por residência)
  createChart('chart-moradores-socio', {
    type: 'bar',
    data: {
      labels: Object.keys(d.pessoasPorResidencia).map(k => k + (k === '1' ? ' pessoa' : ' pessoas')),
      datasets: [{
        label: 'Famílias (%)',
        data: mapValuesToPct(d.pessoasPorResidencia),
        backgroundColor: '#E86C1D',
        maxBarThickness: 45
      }]
    },
    options: getBarOptions()
  });

  // Principal Provedor Financeiro
  createChart('chart-provedor-socio', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.provedorFinanceiro),
      datasets: [{
        data: mapValuesToPct(d.provedorFinanceiro),
        backgroundColor: ['#E86C1D', '#D97706', '#0284C7', '#64748B', '#94A3B8'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // ========================================================
  // PAINEL 03: MORADIA E INFRAESTRUTURA
  // ========================================================

  // Esgotamento Sanitário
  createChart('chart-esgotamento-infra', {
    type: 'doughnut',
    data: {
      labels: ['Descarte no Rio Ingaúra', 'Fossa ligada a rede', 'Fossa não ligada', 'Sem esgotamento'],
      datasets: [{
        data: [13, 6, 1, 1].map(v => toPct(v)),
        backgroundColor: ['#DC2626', '#D97706', '#E86C1D', '#64748B'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Frequência de Falta de Água
  createChart('chart-falta-agua-infra', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.frequenciaFaltaAgua),
      datasets: [{
        data: mapValuesToPct(d.frequenciaFaltaAgua),
        backgroundColor: ['#DC2626', '#E86C1D', '#059669'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Regime de Moradia e Danos Estruturais
  createChart('chart-propriedade-infra', {
    type: 'bar',
    data: {
      labels: ['Moradia Própria', 'Moradia Alugada', 'Danos Estruturais'],
      datasets: [{
        label: 'Incidência (%)',
        data: [toPct(13), toPct(8), toPct(14)],
        backgroundColor: ['#059669', '#E86C1D', '#DC2626'],
        maxBarThickness: 45
      }]
    },
    options: getBarOptions()
  });

  // Prejuízos Físicos por Enchentes
  createChart('chart-prejuizos-infra', {
    type: 'bar',
    data: {
      labels: ['Entrada de Lama', 'Perda de Móveis', 'Danos em Paredes/Piso', 'Perda de Eletrodomésticos', 'Risco de Desabamento'],
      datasets: [{
        label: 'Famílias Atingidas (%)',
        data: [16, 14, 10, 8, 4].map(v => toPct(v)),
        backgroundColor: '#DC2626',
        maxBarThickness: 32
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // ========================================================
  // PAINEL 04: ACESSO A SERVIÇOS PÚBLICOS
  // ========================================================

  // Barreiras de Acesso à Saúde
  createChart('chart-barreiras-saude', {
    type: 'bar',
    data: {
      labels: ['Dependência do SUS', 'Deixou de Buscar Saúde', 'Emergência s/ Atendimento', 'Doença Ligada à Água'],
      datasets: [{
        label: 'Proporção (%)',
        data: [toPct(20), toPct(15), toPct(10), toPct(8)],
        backgroundColor: ['#0284C7', '#DC2626', '#E86C1D', '#D97706'],
        maxBarThickness: 35
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Frequência de Uso de Saúde
  createChart('chart-freq-saude-servicos', {
    type: 'doughnut',
    data: {
      labels: ['Às vezes (quando necessário)', 'Frequentemente (todo mês)', 'Raramente'],
      datasets: [{
        data: [11, 6, 4].map(v => toPct(v)),
        backgroundColor: ['#E86C1D', '#DC2626', '#64748B'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Rede Socioassistencial (CRAS & CadÚnico)
  createChart('chart-cras-servicos', {
    type: 'bar',
    data: {
      labels: ['Conhece o CRAS/CREAS', 'Utiliza o CRAS/CREAS', 'Inscrito no CadÚnico', 'Bolsa Família'],
      datasets: [{
        label: 'Famílias Vinculadas (%)',
        data: [toPct(17), toPct(17), toPct(16), toPct(9)],
        backgroundColor: '#E86C1D',
        maxBarThickness: 35
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Doenças de Veiculação Hídrica
  createChart('chart-doencas-agua-servicos', {
    type: 'doughnut',
    data: {
      labels: ['Com Doença nos Últimos 6m', 'Sem Ocorrência Declarada'],
      datasets: [{
        data: [toPct(8), toPct(13)],
        backgroundColor: ['#DC2626', '#059669'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // ========================================================
  // PAINEL 05: INDICADORES DE EDUCAÇÃO
  // ========================================================

  // Escolarização por Faixa Etária
  createChart('chart-escolarizacao-faixas', {
    type: 'bar',
    data: {
      labels: ['4 a 6 anos (Pré-escola)', '7 a 11 anos (Fund. I)', '12 a 14 anos (Fund. II)', '15 a 17 anos (Médio)'],
      datasets: [{
        label: 'Taxa de Escolarização (%)',
        data: [33.3, 85.7, 100.0, 100.0],
        backgroundColor: ['#DC2626', '#E86C1D', '#059669', '#059669'],
        maxBarThickness: 45
      }]
    },
    options: getBarOptions()
  });

  // Dificuldades de Aprendizagem
  createChart('chart-dificuldades-aprendizagem', {
    type: 'bar',
    data: {
      labels: Object.keys(d.dificuldadesGeral),
      datasets: [{
        label: 'Incidência entre Crianças com Dificuldades (%)',
        data: Object.values(d.dificuldadesGeral),
        backgroundColor: '#E86C1D',
        maxBarThickness: 35
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Estudo na Pandemia
  createChart('chart-estudo-pandemia', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.estudoPandemiaGeral),
      datasets: [{
        data: mapValuesToPct(d.estudoPandemiaGeral),
        backgroundColor: ['#059669', '#DC2626', '#FFB800'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Avaliação Comunitária do Acesso à Educação
  createChart('chart-avaliacao-educacao', {
    type: 'doughnut',
    data: {
      labels: ['Boa', 'Regular', 'Muito boa', 'Sem avaliação'],
      datasets: [{
        data: [toPct(11), toPct(4), toPct(1), toPct(5)],
        backgroundColor: ['#059669', '#FFB800', '#0284C7', '#94A3B8'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // ========================================================
  // PAINEL 06: VULNERABILIDADE SOCIAL
  // ========================================================

  // Insegurança Alimentar (Frequência da falta de comida)
  createChart('chart-falta-comida-freq', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.frequenciaFaltaComida),
      datasets: [{
        data: mapValuesToPct(d.frequenciaFaltaComida),
        backgroundColor: ['#059669', '#FFB800', '#DC2626', '#E86C1D'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Dependência de Ajuda Alimentar
  createChart('chart-ajuda-alimentar', {
    type: 'doughnut',
    data: {
      labels: ['Não recebe ajuda', 'Recebe às vezes', 'Recebe regularmente'],
      datasets: [{
        data: [9, 7, 5].map(v => toPct(v)),
        backgroundColor: ['#64748B', '#FFB800', '#E86C1D'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Refeições Diárias da Família
  createChart('chart-refeicoes-dia', {
    type: 'bar',
    data: {
      labels: ['2 refeições', '3 refeições', '4 refeições', '5 ou mais'],
      datasets: [{
        label: 'Famílias (%)',
        data: [4, 8, 5, 4].map(v => toPct(v)),
        backgroundColor: ['#DC2626', '#FFB800', '#059669', '#059669'],
        maxBarThickness: 45
      }]
    },
    options: getBarOptions()
  });

  // Exposição a Violência no Território
  createChart('chart-violencia-territorio', {
    type: 'bar',
    data: {
      labels: ['Violência na Família', 'Evita Pontos do Bairro', 'Crianças Livres na Rua'],
      datasets: [{
        label: 'Incidência Declarada (%)',
        data: [toPct(9), toPct(6), toPct(6)],
        backgroundColor: ['#DC2626', '#E86C1D', '#059669'],
        maxBarThickness: 35
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // ========================================================
  // PAINEL 07: PERCEPÇÃO DO TERRITÓRIO
  // ========================================================

  // Ranking de Principais Problemas Apontados
  createChart('chart-ranking-problemas-bairro', {
    type: 'bar',
    data: {
      labels: ['Alagamento', 'Falta Serviços Públicos', 'Ruas sem Asfalto', 'Lixo Acumulado', 'Falta de Água', 'Falta de Energia', 'Violência'],
      datasets: [{
        label: 'Famílias que Apontaram como Problema Grave (%)',
        data: [21, 20, 20, 16, 14, 9, 5].map(v => toPct(v)),
        backgroundColor: ['#DC2626', '#E86C1D', '#E86C1D', '#D97706', '#D97706', '#64748B', '#64748B'],
        maxBarThickness: 32
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Percepção de Segurança no Bairro
  createChart('chart-percepcao-seguranca', {
    type: 'doughnut',
    data: {
      labels: ['Sente-se seguro(a)', 'Não se sente seguro(a)', 'Não informado'],
      datasets: [{
        data: [toPct(13), toPct(7), toPct(1)],
        backgroundColor: ['#059669', '#DC2626', '#94A3B8'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Segurança para Crianças Brincarem na Rua
  createChart('chart-seguranca-criancas-rua', {
    type: 'doughnut',
    data: {
      labels: ['Brincam com segurança', 'Apenas sob vigilância', 'Não podem brincar', 'Restrito / Outros'],
      datasets: [{
        data: [toPct(6), toPct(6), toPct(4), toPct(5)],
        backgroundColor: ['#059669', '#FFB800', '#DC2626', '#94A3B8'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // ========================================================
  // SLIDE 08: INSTITUTO ÁDAPO (Legitimidade e Avaliação)
  // ========================================================

  // Avaliação das Atividades do Ádapo (base: 19 respondentes válidos)
  const totalAvaliacao = Object.values(d.avaliacaoAtividades).reduce((a, b) => a + b, 0);
  createChart('chart-avaliacao-adapo', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.avaliacaoAtividades),
      datasets: [{
        data: Object.values(d.avaliacaoAtividades).map(v => toPct(v, totalAvaliacao)),
        backgroundColor: ['#E86C1D', '#FFB800'],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Atividades Desejadas pela Comunidade
  const ativSorted = sortByValue(d.atividadesDesejadas);
  createChart('chart-atividades-desejadas', {
    type: 'bar',
    data: {
      labels: ativSorted.map(([k]) => k),
      datasets: [{
        label: 'Famílias Interessadas (%)',
        data: ativSorted.map(([, v]) => toPct(v)),
        backgroundColor: '#E86C1D',
        maxBarThickness: 40
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Como Conheceu o Ádapo
  const conheceuSorted = sortByValue(d.comoConheceuAdapo);
  createChart('chart-como-conheceu', {
    type: 'bar',
    data: {
      labels: conheceuSorted.map(([k]) => k.length > 30 ? k.substring(0, 28) + '...' : k),
      datasets: [{
        label: 'Pessoas (%)',
        data: conheceuSorted.map(([, v]) => toPct(v)),
        backgroundColor: '#FF7733',
        maxBarThickness: 40
      }]
    },
    options: getBarOptions({ horizontal: true })
  });
}
