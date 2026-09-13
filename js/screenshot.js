// ================================================
// SCREENSHOT ENGINE — Diagnóstico Vila Sapo
// Captura de tela institucional do slide ativo em PNG (escala 2x)
// Instituto Ádapo — Zero Emojis, No Purple
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

    // Oculta temporariamente elementos flutuantes
    const floatNavButtons = document.querySelectorAll('.float-nav-btn');
    floatNavButtons.forEach(btn => btn.style.visibility = 'hidden');

    try {
      // Pequeno timeout para permitir repintura visual
      await new Promise(resolve => setTimeout(resolve, 80));

      const canvas = await html2canvas(activeSlide, {
        scale: 2, // Alta resolução (Retina display)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F8FAFC',
        logging: false,
        ignoreElements: (element) => {
          return element.classList && element.classList.contains('float-nav-btn');
        },
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
