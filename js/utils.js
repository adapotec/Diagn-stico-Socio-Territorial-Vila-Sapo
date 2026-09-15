// ================================================
// UTILS — Helper functions
// ================================================

// Format number with locale
export function formatNumber(num) {
  return new Intl.NumberFormat('pt-BR').format(num);
}

// Calculate percentage
export function percent(part, total) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

// Format percentage string
export function formatPercent(part, total) {
  return `${percent(part, total)}%`;
}

// Sort object entries by value descending
export function sortByValue(obj) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]);
}

// Get top N items from object
export function topN(obj, n = 5) {
  return sortByValue(obj).slice(0, n);
}

// Throttle function
export function throttle(fn, delay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}

// Debounce function
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Intersection observer for scroll animations
export function setupScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger progress bars
          const bars = entry.target.querySelectorAll('.progress-bar-fill[data-width]');
          bars.forEach(bar => {
            bar.style.width = bar.dataset.width;
          });
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });

  return observer;
}

// Generate chart colors (Institutional high-contrast palette, ZERO purple, ZERO soft pastels)
export function chartColors(count) {
  const palette = [
    '#E86C1D', '#DC2626', '#D97706', '#059669', '#0284C7',
    '#475569', '#EA580C', '#B91C1C', '#D97706', '#0D9488',
    '#64748B', '#B45309', '#94A3B8', '#991B1B', '#334155'
  ];
  return palette.slice(0, count);
}

// Convert counts to percentage (1 decimal place)
export function toPercent(val, total = 21) {
  if (!total || total === 0) return 0;
  return Number(((val / total) * 100).toFixed(1));
}

// Plugin de Rótulos Diretos (%) para Chart.js
// Exibe porcentagens permanentes em barras (horizontais e verticais) sem depender de hover
// Roscas já possuem as % legíveis na legenda inferior (evitando repetição/cortes) e Radar mantém sua grade limpa
export const adapoDataLabelsPlugin = {
  id: 'adapoDataLabels',
  afterDatasetsDraw(chart) {
    const chartType = chart.config.type;
    // Rótulos na tela apenas para gráficos de barra
    if (chartType !== 'bar') return;

    const { ctx, chartArea } = chart;
    const isHorizontal = chart.config.options?.indexAxis === 'y';

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      meta.data.forEach((element, index) => {
        const rawVal = dataset.data[index];
        if (rawVal === undefined || rawVal === null) return;
        const numVal = typeof rawVal === 'number' ? rawVal : parseFloat(rawVal);
        if (isNaN(numVal) || numVal <= 0) return;

        const labelText = `${Number(numVal.toFixed(1))}%`;

        ctx.save();
        ctx.font = '700 11px "Space Mono", monospace';

        if (isHorizontal) {
          // Barra Horizontal: posiciona à direita da barra
          const xPos = element.x + 6;
          const yPos = element.y;

          // Se encostar na margem direita, renderiza dentro da barra em branco
          if (chartArea && xPos + 38 > chartArea.right && (element.x - element.base) > 45) {
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, element.x - 8, yPos);
          } else {
            ctx.fillStyle = '#0F172A';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, xPos, yPos);
          }
        } else {
          // Barra Vertical: posiciona acima do topo da barra
          const xPos = element.x;
          const yPos = element.y - 6;

          if (chartArea && yPos < chartArea.top && (element.base - element.y) > 30) {
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(labelText, xPos, element.y + 6);
          } else {
            ctx.fillStyle = '#0F172A';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(labelText, xPos, yPos);
          }
        }

        ctx.restore();
      });
    });
  }
};

// Chart.js default config for Institutional Light Mode
export function getChartDefaults() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 8,
        right: 18,
        bottom: 6,
        left: 4
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#334155',
          font: { family: "'Space Mono', monospace", size: 10.5, weight: '600' },
          padding: 10,
          usePointStyle: true,
          pointStyle: 'rect'
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0F172A',
        bodyColor: '#334155',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        cornerRadius: 4,
        padding: 10,
        titleFont: { family: "'Inter', sans-serif", weight: '700', size: 12 },
        bodyFont: { family: "'Space Mono', monospace", size: 11 },
        displayColors: true,
        boxPadding: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        callbacks: {
          label: function(context) {
            const raw = context.raw;
            const formatted = typeof raw === 'number' ? `${Number(raw.toFixed(1))}%` : raw;
            if (context.chart.config.type === 'doughnut' || context.chart.config.type === 'pie') {
              return ` ${context.label}: ${formatted}`;
            }
            const dsLabel = context.dataset.label ? `${context.dataset.label}: ` : '';
            return ` ${dsLabel}${formatted}`;
          }
        }
      }
    }
  };
}

// Get bar chart options with percentage ticks on value axis and margin for labels
export function getBarOptions(opts = {}) {
  const defaults = getChartDefaults();
  const valueTickFormat = {
    color: '#64748B',
    font: { size: 10, family: "'Space Mono', monospace" },
    callback: (val) => `${val}%`
  };
  const categoryTickFormat = {
    color: '#334155',
    font: { size: 10, family: "'Space Mono', monospace", weight: '600' },
    maxRotation: opts.horizontal ? 0 : 45
  };

  return {
    ...defaults,
    indexAxis: opts.horizontal ? 'y' : 'x',
    plugins: {
      ...defaults.plugins,
      legend: { display: opts.showLegend ?? false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false },
        ticks: opts.horizontal ? valueTickFormat : categoryTickFormat,
        beginAtZero: true,
        grace: opts.horizontal ? '16%' : 0
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false },
        ticks: opts.horizontal ? categoryTickFormat : valueTickFormat,
        beginAtZero: true,
        grace: opts.horizontal ? 0 : '18%'
      }
    }
  };
}

// Get doughnut/pie options with direct percentages in legend labels
export function getDoughnutOptions(opts = {}) {
  const defaults = getChartDefaults();
  return {
    ...defaults,
    cutout: opts.cutout ?? '55%',
    plugins: {
      ...defaults.plugins,
      legend: {
        ...defaults.plugins.legend,
        position: opts.legendPosition ?? 'bottom',
        display: opts.showLegend ?? true,
        labels: {
          color: '#334155',
          font: { family: "'Space Mono', monospace", size: 10, weight: '600' },
          padding: 8,
          usePointStyle: true,
          pointStyle: 'rect',
          boxWidth: 8,
          generateLabels: function(chart) {
            const data = chart.data;
            if (!data.labels?.length || !data.datasets?.length) return [];
            const dataset = data.datasets[0];
            return data.labels.map((label, i) => {
              const val = dataset.data[i];
              const formattedVal = typeof val === 'number' ? `${Number(val.toFixed(1))}%` : `${val}%`;
              const bg = Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[i] : dataset.backgroundColor;
              const border = Array.isArray(dataset.borderColor) ? dataset.borderColor[i] : (dataset.borderColor || '#FFFFFF');
              return {
                text: `${label}: ${formattedVal}`,
                fillStyle: bg,
                strokeStyle: border,
                lineWidth: 1,
                hidden: !chart.isDatasetVisible(0),
                index: i,
                pointStyle: 'rect'
              };
            });
          }
        }
      }
    }
  };
}

// Get radar options with percentage ticks
export function getRadarOptions(opts = {}) {
  const defaults = getChartDefaults();
  return {
    ...defaults,
    scales: {
      r: {
        angleLines: { color: '#E2E8F0' },
        grid: { color: '#E2E8F0' },
        pointLabels: {
          color: '#1E293B',
          font: { family: "'Inter', sans-serif", size: 10, weight: '700' }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#64748B',
          font: { family: "'Space Mono', monospace", size: 8.5 },
          callback: (v) => `${v}%`,
          stepSize: 25
        },
        min: 0,
        max: 100
      }
    },
    plugins: {
      ...defaults.plugins,
      legend: { display: false }
    },
    ...opts
  };
}
