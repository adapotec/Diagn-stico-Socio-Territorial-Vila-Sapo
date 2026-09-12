// ================================================
// CHARTS MODULE — Chart.js configurations
// All data 100% from spreadsheet
// Swiss Punk / Editorial Brutalist Style (NO PURPLE, BARS BORDER-RADIUS: 0)
// ================================================

import Chart from 'chart.js/auto';
import { STATIC_DATA } from './data.js';
import { chartColors, getBarOptions, getDoughnutOptions, sortByValue } from './utils.js';

const d = STATIC_DATA;

// Chart.js global defaults (Swiss Punk / Brutalist geometry)
Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
Chart.defaults.color = '#64748B';
Chart.defaults.elements.bar.borderRadius = 2;
Chart.defaults.elements.bar.borderSkipped = false;

function createChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  return new Chart(canvas.getContext('2d'), config);
}

export function initCharts() {
  // ========== PERFIL ==========

  // Renda familiar
  createChart('chart-renda', {
    type: 'doughnut',
    data: {
      labels: ['Menos de 1 SM', 'Até 2 SM', 'Até 4 SM'],
      datasets: [{
        data: [13, 7, 1],
        backgroundColor: ['#FF2D2D', '#FFB800', '#00D084'],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Pessoas por residência
  createChart('chart-pessoas', {
    type: 'bar',
    data: {
      labels: Object.keys(d.pessoasPorResidencia),
      datasets: [{
        label: 'Famílias',
        data: Object.values(d.pessoasPorResidencia),
        backgroundColor: '#E86C1D',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 50
      }]
    },
    options: getBarOptions()
  });

  // Provedor financeiro
  createChart('chart-provedor', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.provedorFinanceiro),
      datasets: [{
        data: Object.values(d.provedorFinanceiro),
        backgroundColor: chartColors(5),
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Raça da mulher de referência
  createChart('chart-raca', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.racaMulher),
      datasets: [{
        data: Object.values(d.racaMulher),
        backgroundColor: ['#FFB800', '#E86C1D', '#4A5568'],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Escolaridade da mulher
  createChart('chart-escolaridade-mulher', {
    type: 'bar',
    data: {
      labels: ['Não alfabetizada', 'Fund. incomp.', 'Fund. completo', 'Médio completo', 'Técnico', 'Superior'],
      datasets: [{
        label: 'Mulheres',
        data: [2, 6, 2, 8, 1, 2],
        backgroundColor: '#FF7733',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 50
      }]
    },
    options: getBarOptions()
  });

  // Ocupação da mulher
  const ocupSorted = sortByValue(d.ocupacaoMulher);
  createChart('chart-ocupacao-mulher', {
    type: 'bar',
    data: {
      labels: ocupSorted.map(([k]) => k.length > 20 ? k.substring(0, 18) + '...' : k),
      datasets: [{
        label: 'Mulheres',
        data: ocupSorted.map(([, v]) => v),
        backgroundColor: '#E86C1D',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 40
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // ========== INFRAESTRUTURA ==========

  // Frequência de alagamentos
  createChart('chart-freq-alagamento', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.frequenciaAlagamentos),
      datasets: [{
        data: Object.values(d.frequenciaAlagamentos),
        backgroundColor: ['#FF2D2D', '#FFB800', '#00D084'],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Prejuízos por enchentes
  const prejSorted = sortByValue(d.tiposPrejuizos);
  createChart('chart-prejuizos', {
    type: 'bar',
    data: {
      labels: prejSorted.map(([k]) => k),
      datasets: [{
        label: 'Famílias afetadas',
        data: prejSorted.map(([, v]) => v),
        backgroundColor: '#FF2D2D',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 40
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Animais peçonhentos
  const animSorted = sortByValue(d.tiposAnimais);
  createChart('chart-animais', {
    type: 'bar',
    data: {
      labels: animSorted.map(([k]) => k),
      datasets: [{
        label: 'Relatos',
        data: animSorted.map(([, v]) => v),
        backgroundColor: '#FFB800',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 40
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Prejuízos à família (saúde/social)
  const prejFamSorted = sortByValue(d.prejuizosFamilia);
  createChart('chart-prejuizos-familia', {
    type: 'bar',
    data: {
      labels: prejFamSorted.map(([k]) => k.length > 30 ? k.substring(0, 28) + '...' : k),
      datasets: [{
        label: 'Famílias',
        data: prejFamSorted.map(([, v]) => v),
        backgroundColor: '#FF2D2D',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 40
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Problemas do bairro
  const probSorted = sortByValue(d.problemasBairro);
  createChart('chart-problemas-bairro', {
    type: 'bar',
    data: {
      labels: probSorted.map(([k]) => k),
      datasets: [{
        label: 'Famílias',
        data: probSorted.map(([, v]) => v),
        backgroundColor: probSorted.map(([, v]) => v >= 19 ? '#FF2D2D' : v >= 10 ? '#FFB800' : '#4A5568'),
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 50
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // ========== SANEAMENTO ==========

  // Esgotamento sanitário
  createChart('chart-esgoto', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.esgotamentoSanitario),
      datasets: [{
        data: Object.values(d.esgotamentoSanitario),
        backgroundColor: ['#FF2D2D', '#FFB800', '#E86C1D', '#4A5568'],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Frequência falta d'água
  createChart('chart-falta-agua', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.frequenciaFaltaAgua),
      datasets: [{
        data: Object.values(d.frequenciaFaltaAgua),
        backgroundColor: ['#FF2D2D', '#FFB800', '#00D084'],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Doenças ligadas à água
  const doencaSorted = sortByValue(d.tiposDoencasAgua);
  createChart('chart-doencas-agua', {
    type: 'bar',
    data: {
      labels: doencaSorted.map(([k]) => k),
      datasets: [{
        label: 'Casos',
        data: doencaSorted.map(([, v]) => v),
        backgroundColor: '#E86C1D',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 50
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // ========== MORADIA ==========

  // Problemas estruturais
  const estrutSorted = sortByValue(d.tiposProblemasEstruturais);
  createChart('chart-estruturais', {
    type: 'bar',
    data: {
      labels: estrutSorted.map(([k]) => k),
      datasets: [{
        label: 'Moradias',
        data: estrutSorted.map(([, v]) => v),
        backgroundColor: '#FFB800',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 50
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Tipo de propriedade
  createChart('chart-propriedade', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.tipoPropriedade),
      datasets: [{
        data: Object.values(d.tipoPropriedade),
        backgroundColor: ['#E86C1D', '#4A5568'],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // ========== SAÚDE ==========

  // Preocupações de saúde
  const preocSorted = sortByValue(d.preocupacoesSaude);
  createChart('chart-preocupacoes-saude', {
    type: 'bar',
    data: {
      labels: preocSorted.map(([k]) => k.length > 35 ? k.substring(0, 33) + '...' : k),
      datasets: [{
        label: 'Famílias',
        data: preocSorted.map(([, v]) => v),
        backgroundColor: '#E86C1D',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 40
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // ========== ALIMENTAR ==========

  // Refeições por dia
  createChart('chart-refeicoes', {
    type: 'bar',
    data: {
      labels: Object.keys(d.refeicoesDia).map(k => k + ' refeições'),
      datasets: [{
        label: 'Famílias',
        data: Object.values(d.refeicoesDia),
        backgroundColor: Object.keys(d.refeicoesDia).map(k =>
          parseInt(k) <= 2 ? '#FF2D2D' : parseInt(k) <= 3 ? '#FFB800' : '#00D084'
        ),
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 60
      }]
    },
    options: getBarOptions()
  });

  // ========== DIREITOS HUMANOS ==========

  // Situações vividas (NO PURPLE - replaced with alert red/amber)
  const sitSorted = sortByValue(d.situacoesVividas).filter(([k]) => k !== 'Nenhuma das situações');
  createChart('chart-situacoes', {
    type: 'bar',
    data: {
      labels: sitSorted.map(([k]) => k),
      datasets: [{
        label: 'Famílias',
        data: sitSorted.map(([, v]) => v),
        backgroundColor: '#FF2D2D',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 50
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // ========== ÁDAPO ==========

  // Avaliação das atividades
  createChart('chart-avaliacao-adapo', {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.avaliacaoAtividades),
      datasets: [{
        data: Object.values(d.avaliacaoAtividades),
        backgroundColor: ['#E86C1D', '#FFB800'],
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6
      }]
    },
    options: getDoughnutOptions({ cutout: '55%' })
  });

  // Atividades desejadas
  const ativSorted = sortByValue(d.atividadesDesejadas);
  createChart('chart-atividades-desejadas', {
    type: 'bar',
    data: {
      labels: ativSorted.map(([k]) => k),
      datasets: [{
        label: 'Famílias',
        data: ativSorted.map(([, v]) => v),
        backgroundColor: '#E86C1D',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 50
      }]
    },
    options: getBarOptions({ horizontal: true })
  });

  // Como conheceu o Ádapo
  const conheceuSorted = sortByValue(d.comoConheceuAdapo);
  createChart('chart-como-conheceu', {
    type: 'bar',
    data: {
      labels: conheceuSorted.map(([k]) => k.length > 30 ? k.substring(0, 28) + '...' : k),
      datasets: [{
        label: 'Pessoas',
        data: conheceuSorted.map(([, v]) => v),
        backgroundColor: '#FF7733',
        borderRadius: 0,
        borderSkipped: false,
        maxBarThickness: 50
      }]
    },
    options: getBarOptions({ horizontal: true })
  });
}
