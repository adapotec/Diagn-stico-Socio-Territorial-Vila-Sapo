// ================================================
// MAP MODULE — Leaflet + OpenStreetMap
// Cartografia Socioterritorial da Vila Sapo
// Instituto Ádapo — Novo Angelim, São Luís - MA
// ================================================

import L from 'leaflet';

// Fix Leaflet default icon paths for Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// ================================================
// 1. DEMARCAÇÃO DA ÁREA VIA GEOJSON (geojson.io)
// Traçado contínuo do perímetro real da Vila Sapo
// ================================================
export const VILA_SAPO_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Perímetro Territorial Vila Sapo",
        bairro: "Novo Angelim, São Luís - MA",
        descricao: "Moradias e área de influência direta às margens do Rio Ingaúra"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-44.2358123, -2.5358136],
          [-44.235977, -2.5359211],
          [-44.2360181, -2.5360704],
          [-44.2360088, -2.5361569],
          [-44.2358667, -2.5361445],
          [-44.2359999, -2.536392],
          [-44.2362224, -2.5365056],
          [-44.2364003, -2.5365648],
          [-44.2365686, -2.5366777],
          [-44.2368056, -2.5366241],
          [-44.2370231, -2.536708],
          [-44.2369343, -2.5370135],
          [-44.2368799, -2.5371863],
          [-44.2367512, -2.5373401],
          [-44.2364497, -2.5372462],
          [-44.2362026, -2.5371277],
          [-44.23599, -2.5369302],
          [-44.2356193, -2.5369747],
          [-44.2353032, -2.5368604],
          [-44.2350215, -2.5366531],
          [-44.2350413, -2.5365],
          [-44.2351053, -2.5363229],
          [-44.235135, -2.5359723],
          [-44.2353506, -2.5357487],
          [-44.2358173, -2.5358136]
        ]
      }
    }
  ]
};

// Conversão automática: GeoJSON [longitude, latitude] -> Leaflet [latitude, longitude]
export const VILA_SAPO_PERIMETER_COORDS = VILA_SAPO_GEOJSON.features[0].geometry.coordinates.map(
  ([lng, lat]) => [lat, lng]
);

// Centroide geográfico exato da demarcação da Vila Sapo
export const VILA_SAPO_CENTER = [-2.53654, -44.23602];
export const DEFAULT_ZOOM = 17;

// ================================================
// 2. MATRIZ DE PONTOS GEORREFERENCIADOS (FOTOS 1 A 11)
// Para posicionar qualquer foto, clique no mapa para
// copiar a coordenada e cole em 'coords: [lat, lng]'!
// ================================================
export const MAP_POINTS = [
  {
    id: 'p01',
    code: 'P.01',
    color: '#E86C1D',
    type: 'community',
    coords: [-2.536043, -44.235683],
    title: 'P.01 // Foto 01 — Ponte Caída',
    badgeText: 'Núcleo Habitacional',
    sub: 'Principal ponte de travessia atraves do rio',
    desc: 'Registro fotográfico 01. Ponte caída após casos de enchentes no inicio de 2026.',
    img: '/fotos/mapa/1.svg',
  },
  {
    id: 'p02',
    code: 'P.02',
    color: '#DC2626',
    type: 'flood',
    coords: [-2.535909, -44.235579],
    title: 'P.02 // Foto 02 — Entrada do rio',
    badgeText: 'Risco de Inundação',
    sub: 'Circulação por tras das casas',
    desc: 'Registro fotográfico 02. Extensão do rio que vem desde o alto do angelim, atravessando o novo Angelim até chegar a vila sapo.',
    img: '/fotos/mapa/2.svg',
  },
  {
    id: 'p03',
    code: 'P.03',
    color: '#DC2626',
    type: 'sewage',
    coords: [-2.535882, -44.235707],
    title: 'P.03 // Foto 03 — Visão ampla de entrada',
    badgeText: 'Saneamento Crítico',
    sub: 'Inicio do Rio ingaúra',
    desc: 'Registro fotográfico 03. Ponte caída e extensão do rio polúido na entrada da vila',
    img: '/fotos/mapa/3.svg',
  },
  {
    id: 'p04',
    code: 'P.04',
    color: '#D97706',
    type: 'hazard',
    coords: [-2.537013, -44.236874],
    title: 'P.04 // Foto 04 — Ponte Tarquínio Lopes',
    badgeText: 'Risco Biológico',
    sub: 'Visão da ponte Tarquínio Lopes',
    desc: 'Registro fotográfico 04. Visão final da extensão do rio ingaúra pela av Tarquíneo Lopes.',
    img: '/fotos/mapa/4.svg',
  },
  {
    id: 'p05',
    code: 'P.05',
    color: '#E86C1D',
    type: 'community',
    coords: [-2.536600, -44.235568],
    title: 'P.05 // Foto 05 — Ponto central',
    badgeText: 'Acumulo de lixo',
    sub: 'Visão de ponte de travessia',
    desc: 'Registro fotográfico 05. Área de encosta com proliferação maciça de vetores e animais peçonhentos (jacarés, cobras e escorpiões) após cheias.',
    img: '/fotos/mapa/5.svg',
  },
  {
    id: 'p06',
    code: 'P.06',
    color: '#DC2626',
    type: 'sewage',
    coords: [-2.536700, -44.235571],
    title: 'P.06 // Foto 06 — Resdiência de beneficiário',
    badgeText: 'Impacto Ambiental',
    sub: 'Ponte improvisada',
    desc: 'Registro fotográfico 06. Visão de ponte improvisada para acesso a residencia de um dos beneficiários do instituto.',
    img: '/fotos/mapa/6.svg',
  },
  {
    id: 'p07',
    code: 'P.07',
    color: '#D97706',
    type: 'hazard',
    coords: [-2.536397, -44.235705],
    title: 'P.07 // Foto 07 — Erosão de solo',
    badgeText: 'Direito de ir e vir',
    sub: 'Desvio de agua',
    desc: 'Registro fotográfico 07. Efeitos de erosão do solo na área de passagem por conta do desvio de agua a partir do acumulo de lixo',
    img: '/fotos/mapa/7.svg',
  },
  {
    id: 'p08',
    code: 'P.08',
    color: '#E86C1D',
    type: 'community',
    coords: [-2.536582, -44.235495],
    title: 'P.08 // Foto 08 — Visão das casas a margem do rio',
    badgeText: 'Habitabilidade',
    sub: 'Palafitas e alvenaria precária',
    desc: 'Registro fotográfico 08. Detalhe construtivo das residências e fundações erguidas sobre o solo alagadiço.',
    img: '/fotos/mapa/8.svg',
  },
  {
    id: 'p09',
    code: 'P.09',
    color: '#DC2626',
    type: 'flood',
    coords: [-2.536785, -44.236118],
    title: 'P.09 // Foto 09 — Ponte improvisada',
    badgeText: 'Acumulo de lixo',
    sub: 'Margem vulnerável sem contenção',
    desc: 'Registro fotográfico 09. Travessia improvisada para acesso a moradias com acumulo de lixo apos um dos casos de enchentes',
    img: '/fotos/mapa/9.svg',
  },
  {
    id: 'p10',
    code: 'P.10',
    color: '#D97706',
    type: 'community',
    coords: [-2.536726, -44.236045],
    title: 'P.10 // Foto 10 — Erosão do Solo',
    badgeText: 'Perigo de tráfego',
    sub: 'Solo sedimentado',
    desc: 'Registro fotográfico 10. Zona de trafégo onde o solo está sedimentado pelos casos de enchentes.',
    img: '/fotos/mapa/10.svg',
  },
  {
    id: 'p11',
    code: 'P.11',
    color: '#E86C1D',
    type: 'hazard',
    coords: [-2.536734, -44.235935],
    title: 'P.11 // Foto 11 — Acumulo de lixo no rio',
    badgeText: 'Riscos biológicos',
    sub: 'Descarte de esgoto no rio',
    desc: 'Registro fotográfico 11. Acumulo de lixo ao longo do rio e descarte de esgoto residencial diretamente no rio por ausencia de rede de esgoto',
    img: '/fotos/mapa/11.svg',
  },
];

// Custom technical SVG icons (strictly no emojis)
const getMarkerSvg = (type) => {
  switch (type) {
    case 'community':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
    case 'flood':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12h20M2 17h20M2 7h20"></path></svg>`;
    case 'sewage':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
    case 'hazard':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    default:
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle></svg>`;
  }
};

const createIcon = (color, type, code) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background: ${color};
      color: #FFFFFF;
      width: 34px;
      height: 34px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25), 2px 2px 0px #0F172A;
      cursor: pointer;
    ">
      ${getMarkerSvg(type)}
      <span style="font-family: 'Space Mono', monospace; font-size: 8px; font-weight: 800; line-height: 1; margin-top: 2px;">${code}</span>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
};

// ================================================
// LIGHTBOX CONTROLLER (FULLSCREEN INSPECTION)
// ================================================
export function openMapLightbox(index) {
  const item = MAP_POINTS[index];
  if (!item) return;

  const modal = document.getElementById('map-lightbox-modal');
  const imgEl = document.getElementById('map-lightbox-img');
  const codeEl = document.getElementById('map-lightbox-code');
  const coordsEl = document.getElementById('map-lightbox-coords');
  const titleEl = document.getElementById('map-lightbox-title');
  const descEl = document.getElementById('map-lightbox-desc');

  if (imgEl) {
    imgEl.src = item.img;
    imgEl.alt = item.title;
  }
  if (codeEl) {
    codeEl.textContent = item.code;
    codeEl.style.background = item.color;
  }
  if (coordsEl) {
    coordsEl.textContent = `Coordenadas: ${item.coords[0].toFixed(6)}, ${item.coords[1].toFixed(6)}`;
  }
  if (titleEl) {
    titleEl.textContent = item.title;
  }
  if (descEl) {
    descEl.textContent = item.desc;
  }

  if (modal) {
    modal.style.display = 'flex';
    void modal.offsetWidth; // Force layout recalculation for smooth CSS transition
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

export function closeMapLightbox() {
  const modal = document.getElementById('map-lightbox-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 250);
}

// Bind to window for Leaflet inline popups
window.openMapLightbox = openMapLightbox;
window.closeMapLightbox = closeMapLightbox;

// ================================================
// INITIALIZE MAP & INTERACTIVITY
// ================================================
export function initMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return null;

  const map = L.map('leaflet-map', {
    center: VILA_SAPO_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
    scrollWheelZoom: true,
  });

  // Light-themed OpenStreetMap tiles
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // ----------------------------------------------------
  // 1. DEMARCAÇÃO DA ÁREA DA VILA SAPO (POLÍGONO FECHADO)
  // Desenhado com interactive: false para que cliques
  // em qualquer casa passem diretamente para o capturador
  // ----------------------------------------------------
  const vilaSapoPolygon = L.polygon(VILA_SAPO_PERIMETER_COORDS, {
    color: '#E86C1D',
    fillColor: '#E86C1D',
    fillOpacity: 0.16,
    weight: 3.5,
    dashArray: '8, 5',
    interactive: false, // NÃO bloqueia cliques em casas, ruas ou pontos
  }).addTo(map);

  // Ajusta a câmera do mapa para enquadrar perfeitamente a área demarcada
  map.fitBounds(vilaSapoPolygon.getBounds(), {
    padding: [35, 35],
    maxZoom: 18,
  });

  // ----------------------------------------------------
  // 2. FERRAMENTA: CAPTURADOR DE COORDENADA NO CLIQUE
  // Ao clicar no mapa, exibe e copia a coordenada exata!
  // ----------------------------------------------------
  let lastPickerPopup = null;
  map.on('click', (e) => {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    const coordString = `[${lat}, ${lng}]`;

    // Atualiza banner de captura
    const bannerVal = document.getElementById('map-coord-banner-val');
    if (bannerVal) {
      bannerVal.textContent = coordString;
    }

    // Copia para área de transferência
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(coordString).catch(() => { });
    }

    // Exibe toast informativo animado
    const toast = document.getElementById('map-coord-toast');
    if (toast) {
      toast.innerHTML = `<span>📍 Coordenada <strong>${coordString}</strong> copiada!</span>`;
      toast.classList.add('active');
      clearTimeout(window.__coordToastTimer);
      window.__coordToastTimer = setTimeout(() => {
        toast.classList.remove('active');
      }, 3500);
    }

    // Abre pequeno popup no local do clique
    if (lastPickerPopup) {
      map.closePopup(lastPickerPopup);
    }
    lastPickerPopup = L.popup({
      offset: [0, -6],
      className: 'coord-picker-leaflet-popup',
      autoClose: true,
      closeOnClick: true,
    })
      .setLatLng(e.latlng)
      .setContent(`
        <div class="map-coord-picker-popup">
          <span class="coord-picker-tag">Coordenada Capturada</span>
          <span class="coord-picker-val">${coordString}</span>
          <span class="coord-picker-msg">✓ Copiado! Pressione Ctrl+V no código</span>
        </div>
      `)
      .openOn(map);

    // Registra no console do navegador para facilidade do desenvolvedor
    console.log(`%c📍 Coordenada Capturada: ${coordString}`, 'color: #E86C1D; font-weight: bold;');
    console.log(`Cole no MAP_POINTS em js/map.js: coords: ${coordString},`);
  });

  // ----------------------------------------------------
  // 3. GEOREFERENCED EVIDENCE MARKERS WITH POPUPS
  // ----------------------------------------------------
  const markerInstances = [];

  MAP_POINTS.forEach((point, index) => {
    const marker = L.marker(point.coords, {
      icon: createIcon(point.color, point.type, point.code),
    }).addTo(map);

    const popupHtml = `
      <div class="map-popup-card">
        <div class="map-popup-img-wrap" onclick="window.openMapLightbox(${index})" title="Clique para expandir o registro">
          <img src="${point.img}" alt="${point.title}" class="map-popup-img" onerror="this.src='/fotos/foto-1.jpg'" />
          <div class="map-popup-img-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            <span>Ver Ampliado</span>
          </div>
        </div>
        <div class="map-popup-header">
          <span class="map-popup-code" style="color: ${point.color};">${point.code} // ${point.badgeText}</span>
          <h4 class="map-popup-title">${point.title}</h4>
        </div>
        <p class="map-popup-desc">${point.desc}</p>
        <button type="button" class="map-popup-expand-btn" onclick="window.openMapLightbox(${index})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          Visualizar em Alta Resolução
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml, {
      maxWidth: 300,
      minWidth: 260,
      className: 'custom-leaflet-popup',
    });

    markerInstances.push(marker);
  });

  // ----------------------------------------------------
  // 4. RENDERIZAÇÃO DINÂMICA DA BARRA LATERAL (LISTA & FOTOS)
  // Sincroniza automaticamente a barra com o array MAP_POINTS
  // ----------------------------------------------------
  const pointsBadge = document.querySelector('.map-points-badge');
  if (pointsBadge) {
    pointsBadge.textContent = `${MAP_POINTS.length} Registros`;
  }

  // Popula botões de pontos
  const pointsList = document.querySelector('.map-points-list');
  if (pointsList) {
    pointsList.innerHTML = MAP_POINTS.map((pt, idx) => {
      let codeClass = 'brand';
      if (pt.color === '#DC2626') codeClass = 'critical';
      else if (pt.color === '#D97706') codeClass = 'warning';

      return `
        <button class="map-point-item" type="button" data-point-idx="${idx}" title="Clique para localizar no mapa">
          <span class="point-code ${codeClass}">${pt.code}</span>
          <div class="point-meta">
            <span class="point-name">${pt.title.split('//')[1] || pt.title}</span>
            <span class="point-sub">${pt.sub}</span>
          </div>
          <span class="point-action">Localizar</span>
        </button>
      `;
    }).join('');
  }

  // Popula miniaturas de fotos
  const thumbGrid = document.querySelector('.map-photo-thumb-grid');
  if (thumbGrid) {
    thumbGrid.innerHTML = MAP_POINTS.map((pt, idx) => `
      <div class="map-photo-thumb-wrapper" data-lightbox-idx="${idx}" title="${pt.title}">
        <img src="${pt.img}" alt="${pt.title}" class="map-photo-thumb" onerror="this.src='/fotos/foto-1.jpg'" />
        <span class="thumb-expand-icon">⤢</span>
        <span class="thumb-code-tag">${pt.code}</span>
      </div>
    `).join('');
  }

  // Conecta cliques nos botões da lista lateral
  const pointButtons = document.querySelectorAll('.map-point-item');
  pointButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.pointIdx, 10);
      if (isNaN(idx) || !MAP_POINTS[idx]) return;

      pointButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      map.flyTo(MAP_POINTS[idx].coords, 18, {
        duration: 1.2,
      });

      setTimeout(() => {
        if (markerInstances[idx]) {
          markerInstances[idx].openPopup();
        }
      }, 700);
    });
  });

  // Conecta cliques nas miniaturas da galeria
  const photoCards = document.querySelectorAll('.map-photo-thumb-wrapper');
  photoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.lightboxIdx, 10);
      if (!isNaN(idx)) {
        openMapLightbox(idx);
      }
    });
  });

  // Eventos de fechamento do modal lightbox
  const closeBtn = document.getElementById('map-lightbox-close');
  const backdrop = document.getElementById('map-lightbox-backdrop');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMapLightbox);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeMapLightbox);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMapLightbox();
    }
  });

  // ----------------------------------------------------
  // 5. LEGENDA CARTOGRÁFICA INSTITUCIONAL
  // ----------------------------------------------------
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <div style="
        background: #FFFFFF;
        padding: 10px 12px;
        border-radius: 6px;
        border: 1px solid #CBD5E1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-family: 'Space Mono', monospace;
        font-size: 11px;
        color: #334155;
        min-width: 180px;
      ">
        <div style="font-weight: 700; margin-bottom: 8px; color: #0F172A; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
          LEGENDA CARTOGRÁFICA
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <div style="width: 16px; height: 3px; background: #E86C1D; border-top: 1.5px dashed #E86C1D;"></div>
          <span>Perímetro Vila Sapo</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
          <span style="display: inline-block; width: 15px; height: 15px; background: #E86C1D; color: #fff; font-size: 8px; font-weight: 700; text-align: center; line-height: 15px; border-radius: 2px;">01</span>
          <span>Núcleo Habitacional</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
          <span style="display: inline-block; width: 15px; height: 15px; background: #DC2626; color: #fff; font-size: 8px; font-weight: 700; text-align: center; line-height: 15px; border-radius: 2px;">02</span>
          <span>Ponto de Alagamento</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
          <span style="display: inline-block; width: 15px; height: 15px; background: #DC2626; color: #fff; font-size: 8px; font-weight: 700; text-align: center; line-height: 15px; border-radius: 2px;">03</span>
          <span>Valas de Esgoto</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 15px; height: 15px; background: #D97706; color: #fff; font-size: 8px; font-weight: 700; text-align: center; line-height: 15px; border-radius: 2px;">04</span>
          <span>Fauna Peçonhenta</span>
        </div>
      </div>
    `;
    return div;
  };
  legend.addTo(map);

  // Recalcula dimensões do mapa na troca de slide e no redimensionamento da janela
  setTimeout(() => map.invalidateSize(), 400);
  window.addEventListener('resize', () => map.invalidateSize());

  return map;
}
