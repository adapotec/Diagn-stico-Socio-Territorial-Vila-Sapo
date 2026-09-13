// ================================================
// SCREENSHOT ENGINE — Diagnóstico Vila Sapo
// Captura de tela institucional do slide ativo em PNG (escala 2x)
// Instituto Ádapo — Zero Emojis, No Purple
// Alta Fidelidade de Cores e Contraste Máximo
// ================================================

import html2canvas from 'html2canvas';

export function initScreenshotEngine() {
  const screenshotBtn = document.getElementById('btn-screenshot-deck');
  if (!screenshotBtn) return;

  screenshotBtn.addEventListener('click', async () => {
    if (screenshotBtn.classList.contains('loading')) return;

    // Identifica o slide ativo
    const activeSlide = document.querySelector('.slide-view.active') || document.querySelector('.presentation-deck');
    if (!activeSlide) return;

    const originalBtnContent = screenshotBtn.innerHTML;
    
    // Atualiza estado do botão para 'Capturando...'
    screenshotBtn.classList.add('loading');
    screenshotBtn.innerHTML = `
      <svg class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"></circle>
      </svg>
      <span class="btn-screenshot-label">Capturando...</span>
    `;

    // Oculta temporariamente elementos flutuantes de navegação
    const floatNavButtons = document.querySelectorAll('.float-nav-btn');
    floatNavButtons.forEach(btn => btn.style.visibility = 'hidden');

    try {
      // Timeout seguro para repintura visual
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(activeSlide, {
        scale: 2, // Alta resolução (Retina display)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F8FAFC',
        logging: false,
        ignoreElements: (element) => {
          return element.classList && element.classList.contains('float-nav-btn');
        },
        onclone: (clonedDoc) => {
          // 1. Desativa todas as animações e transições CSS para evitar snapshots com opacidade intermediária (fade-in)
          const overrideStyle = clonedDoc.createElement('style');
          overrideStyle.id = 'screenshot-high-contrast-overrides';
          overrideStyle.innerHTML = `
            *, *::before, *::after {
              animation: none !important;
              transition: none !important;
              -webkit-animation: none !important;
              -webkit-transition: none !important;
            }
            .slide-view, .slide-view.active,
            .diag-panel, .diag-panel.active,
            .diag-main-stage,
            .diag-sidebar,
            .diag-panels-wrapper,
            .card, .card-compact,
            .diag-strip-item,
            .hero-content-col,
            .hero-photo-dock,
            .hero-photo-dock-card {
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }

            .hero-photo-dock-card {
              background-color: #FFFFFF !important;
              background: #FFFFFF !important;
              border: 1px solid #CBD5E1 !important;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
              opacity: 1 !important;
            }

            /* Garantir fundos brancos sólidos e bordas nítidas nos cartões */
            .card, 
            .card-compact, 
            .diag-main-stage .card, 
            .diag-strip-item, 
            .diag-main-stage .diag-strip-item {
              background-color: #FFFFFF !important;
              background: #FFFFFF !important;
              border: 1px solid #CBD5E1 !important;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
              opacity: 1 !important;
            }

            .diag-sidebar {
              background-color: #FFFFFF !important;
              background: #FFFFFF !important;
              border: 1px solid #CBD5E1 !important;
              opacity: 1 !important;
            }

            .diag-subtab-btn {
              background-color: #FFFFFF !important;
              border: 1px solid #E2E8F0 !important;
              opacity: 1 !important;
            }

            .diag-subtab-btn.active {
              background-color: #FFF7ED !important;
              border-color: #E86C1D !important;
            }

            /* Máximo contraste e legibilidade em textos institucionais */
            .card-title,
            .diag-main-stage .card-title,
            .diag-strip-text,
            .diag-main-stage .diag-strip-text,
            .diag-strip-status-label,
            .point-name,
            .legend-point-name,
            .pillar-title,
            .intro-anchor-title {
              color: #0F172A !important;
              font-weight: 800 !important;
            }

            .diag-strip-num,
            .diag-main-stage .diag-strip-num {
              color: #C2410C !important;
              font-weight: 900 !important;
            }

            .metric-label,
            .demand-label {
              color: #334155 !important;
              font-weight: 600 !important;
            }

            .chart-wrapper {
              background-color: #FFFFFF !important;
            }
          `;
          clonedDoc.head.appendChild(overrideStyle);

          // 2. Cópia exata dos bitmaps de todos os elementos <canvas> (gráficos Chart.js)
          const originalCanvases = activeSlide.querySelectorAll('canvas');
          const clonedCanvases = clonedDoc.querySelectorAll('canvas');
          originalCanvases.forEach((origCanvas, i) => {
            const clonedCanvas = clonedCanvases[i];
            if (clonedCanvas && origCanvas.width && origCanvas.height) {
              clonedCanvas.width = origCanvas.width;
              clonedCanvas.height = origCanvas.height;
              const ctx = clonedCanvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(origCanvas, 0, 0);
              }
            }
          });
        }
      });

      // Gera download em formato PNG
      const slideId = activeSlide.id ? activeSlide.id.replace('slide-', '') : 'tela';
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `diagnostico-vila-sapo-${slideId}-${dateStr}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Feedback de sucesso
      screenshotBtn.classList.remove('loading');
      screenshotBtn.classList.add('success');
      screenshotBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="btn-screenshot-label">✓ Baixado!</span>
      `;

      setTimeout(() => {
        screenshotBtn.classList.remove('success');
        screenshotBtn.innerHTML = originalBtnContent;
      }, 2500);

    } catch (err) {
      console.error('Erro ao capturar tela:', err);
      screenshotBtn.classList.remove('loading');
      screenshotBtn.innerHTML = `
        <span class="btn-screenshot-label">Falha ao salvar</span>
      `;
      setTimeout(() => {
        screenshotBtn.innerHTML = originalBtnContent;
      }, 2500);
    } finally {
      floatNavButtons.forEach(btn => btn.style.visibility = '');
    }
  });
}
