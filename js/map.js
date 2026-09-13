// ================================================
// MAP MODULE — Leaflet + OpenStreetMap
// Cartografia Socioterritorial da Vila Sapo
// Instituto Ádapo — Novo Angelim, São Luís - MA
// Zero Emojis, No Purple, Zero Capture Mode
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

// Centroide geográfico da demarcação da Vila Sapo
export const VILA_SAPO_CENTER = [-2.53654, -44.23602];
export const DEFAULT_ZOOM = 17;

// ================================================
// 2. MATRIZ DOS 11 PONTOS GEORREFERENCIADOS
// Registros fotográficos de campo (1 a 11)
// ================================================
export const MAP_POINTS = [
  {
    id: 'p01',
    code: 'P.01',
    color: '#E86C1D',
    type: 'bridge',
    coords: [-2.536043, -44.235683],
    title: 'P.01 // Foto 01 — Ponte Caída',
    badgeText: 'Infraestrutura Viária',
    sub: 'Principal ponte de travessia através do rio',
    desc: 'Registro fotográfico 01. Ponte caída após enchentes no início de 2026, isolando famílias e comprometendo a travessia diária.',
    img: '/fotos/mapa/1.svg',
  },
  {
    id: 'p02',
    code: 'P.02',
    color: '#0284C7',
    type: 'river',
    coords: [-2.535909, -44.235579],
    title: 'P.02 // Foto 02 — Entrada do Rio',
    badgeText: 'Hidrografia & Calha',
    sub: 'Circulação atrás das residências',
    desc: 'Registro fotográfico 02. Extensão do Rio Ingaúra que desce do Alto do Angelim e cruza o Novo Angelim até a calha da Vila Sapo.',
    img: '/fotos/mapa/2.svg',
  },
  {
    id: 'p03',
    code: 'P.03',
    color: '#DC2626',
    type: 'flood',
    coords: [-2.535882, -44.235707],
    title: 'P.03 // Foto 03 — Visão Ampla de Entrada',
    badgeText: 'Saneamento Crítico',
    sub: 'Início da calha do Rio Ingaúra',
    desc: 'Registro fotográfico 03. Ponte caída e leito poluído com efluentes na principal entrada de acesso da comunidade.',
    img: '/fotos/mapa/3.svg',
  },
  {
    id: 'p04',
    code: 'P.04',
    color: '#E86C1D',
    type: 'bridge',
    coords: [-2.537013, -44.236874],
    title: 'P.04 // Foto 04 — Ponte Tarquínio Lopes',
    badgeText: 'Infraestrutura Viária',
    sub: 'Visão da Av. Tarquínio Lopes',
    desc: 'Registro fotográfico 04. Visão final da extensão do Rio Ingaúra cruzando a Av. Tarquínio Lopes em direção ao escoamento metropolitano.',
    img: '/fotos/mapa/4.svg',
  },
  {
    id: 'p05',
    code: 'P.05',
    color: '#DC2626',
    type: 'waste',
    coords: [-2.536600, -44.235568],
    title: 'P.05 // Foto 05 — Ponto Central & Resíduos',
    badgeText: 'Resíduos & Vetores',
    sub: 'Área central de passagem',
    desc: 'Registro fotográfico 05. Encosta com acúmulo severo de lixo e proliferação de vetores e animais peçonhentos durante cheias periódicas.',
    img: '/fotos/mapa/5.svg',
  },
  {
    id: 'p06',
    code: 'P.06',
    color: '#E86C1D',
    type: 'home',
    coords: [-2.536700, -44.235571],
    title: 'P.06 // Foto 06 — Residência de Beneficiário',
    badgeText: 'Habitabilidade & Acesso',
    sub: 'Ponte improvisada residencial',
    desc: 'Registro fotográfico 06. Ponte de madeira improvisada para viabilizar acesso à moradia de uma das famílias beneficiadas pelo instituto.',
    img: '/fotos/mapa/6.svg',
  },
  {
    id: 'p07',
    code: 'P.07',
    color: '#D97706',
    type: 'erosion',
    coords: [-2.536397, -44.235705],
    title: 'P.07 // Foto 07 — Erosão do Solo',
    badgeText: 'Erosão & Drenagem',
    sub: 'Desvio de curso hídrico',
    desc: 'Registro fotográfico 07. Efeitos de erosão acentuada do solo na área de passagem devido ao desvio das águas provocado por acúmulo de entulhos.',
    img: '/fotos/mapa/7.svg',
  },
  {
    id: 'p08',
    code: 'P.08',
    color: '#D97706',
    type: 'home',
    coords: [-2.536582, -44.235495],
    title: 'P.08 // Foto 08 — Casas à Margem do Rio',
    badgeText: 'Habitabilidade Precária',
    sub: 'Palafitas sobre solo alagadiço',
    desc: 'Registro fotográfico 08. Detalhes construtivos das habitações e esteios fixados diretamente no leito úmido e alagadiço do rio.',
    img: '/fotos/mapa/8.svg',
  },
  {
    id: 'p09',
    code: 'P.09',
    color: '#DC2626',
    type: 'bridge',
    coords: [-2.536785, -44.236118],
    title: 'P.09 // Foto 09 — Travessia Vulnerável',
    badgeText: 'Travessia Crítica',
    sub: 'Margem sem contenção',
    desc: 'Registro fotográfico 09. Passadiço artesanal em situação crítica de desabamento com grande volume de detritos carreados pelas chuvas.',
    img: '/fotos/mapa/9.svg',
  },
  {
    id: 'p10',
    code: 'P.10',
    color: '#D97706',
    type: 'erosion',
    coords: [-2.536726, -44.236045],
    title: 'P.10 // Foto 10 — Sedimentação de Tráfego',
    badgeText: 'Sedimentação de Vias',
    sub: 'Solo instável pós-alagamento',
    desc: 'Registro fotográfico 10. Zona de circulação comunitária com solo altamente sedimentado e instável decorrente das enchentes contínuas.',
    img: '/fotos/mapa/10.svg',
  },
  {
    id: 'p11',
    code: 'P.11',
    color: '#DC2626',
    type: 'waste',
    coords: [-2.536734, -44.235935],
    title: 'P.11 // Foto 11 — Acúmulo de Lixo no Rio',
    badgeText: 'Esgoto & Poluição',
    sub: 'Descarte direto sem rede',
    desc: 'Registro fotográfico 11. Depósito desordenado de resíduos sólidos e lançamento contínuo de esgoto in natura por falta total de rede pública.',
    img: '/fotos/mapa/11.svg',
  },
];

// Ícones técnicos vetoriais sem emojis
export const getMarkerSvg = (type) => {
  switch (type) {
    case 'bridge':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M2 19h20M9 19v-6a3 3 0 0 1 6 0v6"/></svg>`;
    case 'river':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 6c3 0 3 3 6 3s3-3 6-3 3 3 6 3M2 12c3 0 3 3 6 3s3-3 6-3 3 3 6 3M2 18c3 0 3 3 6 3s3-3 6-3 3 3 6 3"/></svg>`;
    case 'flood':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
    case 'waste':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>`;
    case 'erosion':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>`;
    case 'home':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    default:
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg>`;
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
// LIGHTBOX CONTROLLER (AMPLIAÇÃO EM TELA CHEIA)
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
    void modal.offsetWidth;
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
// INICIALIZAÇÃO DO MAPA & CAMADAS INTERATIVAS
// ================================================
export function initMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return null;

  // Inicializa mapa sem controle de atribuição padrão (remove 'Leaflet')
  const map = L.map('leaflet-map', {
    center: VILA_SAPO_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
    scrollWheelZoom: true,
    attributionControl: false, // Remove citação Leaflet
  });

  // Camada base OpenStreetMap limpa
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  // ----------------------------------------------------
  // 1. DEMARCAÇÃO DO PERÍMETRO DA VILA SAPO
  // ----------------------------------------------------
  const vilaSapoPolygon = L.polygon(VILA_SAPO_PERIMETER_COORDS, {
    color: '#E86C1D',
    fillColor: '#E86C1D',
    fillOpacity: 0.16,
    weight: 3.5,
    dashArray: '8, 5',
    interactive: true,
  }).addTo(map);

  vilaSapoPolygon.bindTooltip("Perímetro Territorial Vila Sapo", {
    sticky: true,
    className: "vila-sapo-tooltip"
  });

  // Ajusta a câmera do mapa para enquadrar a área demarcada
  map.fitBounds(vilaSapoPolygon.getBounds(), {
    padding: [40, 40],
    maxZoom: 18,
  });

  // ----------------------------------------------------
  // 2. GRUPO DE CAMADAS: 11 MARCADORES DE CAMPO
  // ----------------------------------------------------
  const markersLayerGroup = L.layerGroup().addTo(map);
  const markerInstances = [];

  MAP_POINTS.forEach((point, index) => {
    const marker = L.marker(point.coords, {
      icon: createIcon(point.color, point.type, point.code),
    }).addTo(markersLayerGroup);

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
  // 3. BARRA LATERAL (LISTA DE PONTOS & GALERIA DE FOTOS)
  // ----------------------------------------------------
  const pointsBadge = document.querySelector('.map-points-badge');
  if (pointsBadge) {
    pointsBadge.textContent = `${MAP_POINTS.length} Registros`;
  }

  const pointsList = document.querySelector('.map-points-list');
  if (pointsList) {
    pointsList.innerHTML = MAP_POINTS.map((pt, idx) => {
      let codeClass = 'brand';
      if (pt.color === '#DC2626') codeClass = 'critical';
      else if (pt.color === '#D97706') codeClass = 'warning';
      else if (pt.color === '#0284C7') codeClass = 'info';

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

  // Interatividade da lista lateral
  const pointButtons = document.querySelectorAll('.map-point-item');
  pointButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.pointIdx, 10);
      if (isNaN(idx) || !MAP_POINTS[idx]) return;

      pointButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (!map.hasLayer(markersLayerGroup)) {
        map.addLayer(markersLayerGroup);
        const toggleEl = document.getElementById('toggle-markers');
        if (toggleEl) toggleEl.checked = true;
      }

      map.flyTo(MAP_POINTS[idx].coords, 18, {
        duration: 1.1,
      });

      setTimeout(() => {
        if (markerInstances[idx]) {
          markerInstances[idx].openPopup();
        }
      }, 700);
    });
  });

  // Interatividade da galeria de miniaturas
  const photoCards = document.querySelectorAll('.map-photo-thumb-wrapper');
  photoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.lightboxIdx, 10);
      if (!isNaN(idx)) {
        openMapLightbox(idx);
      }
    });
  });

  // Fechamento da modal lightbox
  const closeBtn = document.getElementById('map-lightbox-close');
  const backdrop = document.getElementById('map-lightbox-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', closeMapLightbox);
  if (backdrop) backdrop.addEventListener('click', closeMapLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMapLightbox();
  });

  // ----------------------------------------------------
  // 4. NOVA LEGENDA CARTOGRÁFICA INTERATIVA COM TOGGLES
  // Com 11 pontos (P.01 a P.11) e interruptores de camada
  // ----------------------------------------------------
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend-dock');
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    div.innerHTML = `
      <div class="map-legend-card" id="map-legend-card">
        <div class="map-legend-header" id="map-legend-header" title="Clique para recolher ou expandir a legenda">
          <div class="map-legend-title-wrap">
            <span class="legend-pulse-dot"></span>
            <span class="map-legend-heading">LEGENDA & CAMADAS</span>
          </div>
          <button type="button" class="legend-collapse-btn" id="legend-collapse-btn" aria-label="Recolher legenda">
            <svg class="collapse-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        <div class="map-legend-body" id="map-legend-body">
          <!-- Interruptores de Visualização (Toggles) -->
          <div class="legend-section-title">VISUALIZAÇÃO DE CAMADAS</div>
          <div class="legend-toggles-box">
            <label class="legend-toggle-item" title="Alternar visualização do perímetro demarcado da Vila Sapo">
              <input type="checkbox" id="toggle-perimeter" checked />
              <span class="legend-toggle-switch"></span>
              <span class="legend-toggle-text">
                <span class="legend-line-preview"></span>
                Perímetro Vila Sapo
              </span>
            </label>

            <label class="legend-toggle-item" title="Alternar visualização dos marcadores georreferenciados no mapa">
              <input type="checkbox" id="toggle-markers" checked />
              <span class="legend-toggle-switch"></span>
              <span class="legend-toggle-text">
                <span class="legend-pin-preview"></span>
                Marcadores de Campo (11)
              </span>
            </label>
          </div>

          <!-- Listagem dos 11 Registros Georreferenciados -->
          <div class="legend-section-title">REGISTROS FOTOGRÁFICOS (P.01 A P.11)</div>
          <div class="legend-points-scrollable">
            ${MAP_POINTS.map((pt, idx) => `
              <button type="button" class="legend-point-btn" data-legend-point="${idx}" title="Clique para focar em ${pt.title}">
                <span class="legend-point-badge" style="background: ${pt.color};">${pt.code}</span>
                <span class="legend-point-svg" style="color: ${pt.color};">${getMarkerSvg(pt.type)}</span>
                <span class="legend-point-name">${pt.title.replace(/^P\.\d+\s*\/\/\s*Foto\s*\d+\s*—\s*/, '')}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Conectar eventos após inserção
    setTimeout(() => {
      // Toggle Perímetro
      const togglePerimeter = document.getElementById('toggle-perimeter');
      if (togglePerimeter) {
        togglePerimeter.addEventListener('change', (e) => {
          if (e.target.checked) {
            if (!map.hasLayer(vilaSapoPolygon)) map.addLayer(vilaSapoPolygon);
          } else {
            if (map.hasLayer(vilaSapoPolygon)) map.removeLayer(vilaSapoPolygon);
          }
        });
      }

      // Toggle Marcadores
      const toggleMarkers = document.getElementById('toggle-markers');
      if (toggleMarkers) {
        toggleMarkers.addEventListener('change', (e) => {
          if (e.target.checked) {
            if (!map.hasLayer(markersLayerGroup)) map.addLayer(markersLayerGroup);
          } else {
            if (map.hasLayer(markersLayerGroup)) map.removeLayer(markersLayerGroup);
          }
        });
      }

      // Clique em ponto da legenda para focar no mapa
      const legendPointButtons = div.querySelectorAll('.legend-point-btn');
      legendPointButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.legendPoint, 10);
          if (isNaN(idx) || !MAP_POINTS[idx]) return;

          // Se marcadores estiverem ocultos, reativa automaticamente
          if (!map.hasLayer(markersLayerGroup)) {
            map.addLayer(markersLayerGroup);
            if (toggleMarkers) toggleMarkers.checked = true;
          }

          legendPointButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          map.flyTo(MAP_POINTS[idx].coords, 18, { duration: 1.0 });

          setTimeout(() => {
            if (markerInstances[idx]) {
              markerInstances[idx].openPopup();
            }
          }, 600);
        });
      });

      // Expandir / Recolher Legenda
      const collapseBtn = document.getElementById('legend-collapse-btn');
      const legendHeader = document.getElementById('map-legend-header');
      const legendCard = document.getElementById('map-legend-card');
      
      const toggleCollapse = () => {
        if (legendCard) {
          legendCard.classList.toggle('is-collapsed');
        }
      };

      if (collapseBtn) {
        collapseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCollapse();
        });
      }
      if (legendHeader) {
        legendHeader.addEventListener('click', toggleCollapse);
      }
    }, 60);

    return div;
  };
  legend.addTo(map);

  // Recalcula dimensões do mapa na troca de slide e no redimensionamento da janela
  setTimeout(() => map.invalidateSize(), 400);
  window.addEventListener('resize', () => map.invalidateSize());

  return map;
}

// ================================================
// MINI MAPA ESTÁTICO (SLIDE DIAGNÓSTICO // SIDEBAR)
// Exibe apenas o recorte territorial e o perímetro
// Sem controles de edição, arrasto ou zoom (read-only)
// ================================================
let miniMapInstance = null;

export function initMiniMap() {
  const container = document.getElementById('diag-mini-map');
  if (!container) return null;

  if (miniMapInstance) {
    miniMapInstance.remove();
    miniMapInstance = null;
  }

  const miniMap = L.map('diag-mini-map', {
    center: VILA_SAPO_CENTER,
    zoom: 16,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(miniMap);

  const polygon = L.polygon(VILA_SAPO_PERIMETER_COORDS, {
    color: '#E86C1D',
    fillColor: '#E86C1D',
    fillOpacity: 0.32,
    weight: 2.5,
    dashArray: '5, 4',
    interactive: false,
  }).addTo(miniMap);

  miniMap.fitBounds(polygon.getBounds(), {
    padding: [10, 10],
  });

  setTimeout(() => miniMap.invalidateSize(), 400);
  window.addEventListener('resize', () => miniMap.invalidateSize());

  miniMapInstance = miniMap;
  return miniMap;
}

