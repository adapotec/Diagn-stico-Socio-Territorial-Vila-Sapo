// ================================================
// MAP MODULE — Leaflet + OpenStreetMap
// Vila Sapo, Novo Angelim, São Luís - MA
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

// Vila Sapo approximate center — Novo Angelim, São Luís, MA
const VILA_SAPO_CENTER = [-2.5885, -44.2205];
const DEFAULT_ZOOM = 16;

// Custom technical SVG markers (NO EMOJIS)
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
      width: 32px;
      height: 32px;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid #FFFFFF;
      box-shadow: 2px 2px 0px #000000;
    ">
      ${getMarkerSvg(type)}
      <span style="font-family: 'Space Mono', monospace; font-size: 8px; font-weight: 700; line-height: 1; margin-top: 2px;">${code}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

export function initMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return;

  const map = L.map('leaflet-map', {
    center: VILA_SAPO_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
    scrollWheelZoom: true,
  });

  // Light-themed tile layer (OpenStreetMap Standard — No watermark)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Vila Sapo area polygon (approximate perimeter)
  const vilaSapoPolygon = L.polygon(
    [
      [-2.5865, -44.2225],
      [-2.5865, -44.2185],
      [-2.5875, -44.2175],
      [-2.5895, -44.2175],
      [-2.5905, -44.2185],
      [-2.5905, -44.2225],
      [-2.5895, -44.2235],
      [-2.5875, -44.2235],
    ],
    {
      color: '#E86C1D',
      fillColor: '#E86C1D',
      fillOpacity: 0.12,
      weight: 2,
      dashArray: '6, 4',
    }
  ).addTo(map);

  vilaSapoPolygon.bindPopup(`
    <div style="font-family: 'Inter', sans-serif; min-width: 240px; padding: 4px;">
      <div style="font-family: 'Space Mono', monospace; font-size: 10px; color: #E86C1D; font-weight: 700; margin-bottom: 4px;">[ PERÍMETRO TERRITORIAL ]</div>
      <h3 style="margin: 0 0 6px; color: #0F172A; font-size: 15px; font-weight: 800;">Vila Sapo — Bacia do Rio Ingaúra</h3>
      <p style="margin: 0 0 4px; color: #334155; font-size: 12px;"><strong>Bairro:</strong> Novo Angelim, São Luís - MA</p>
      <p style="margin: 0 0 4px; color: #334155; font-size: 12px;"><strong>Amostra Censitária:</strong> 21 Famílias (100% dos domicílios)</p>
      <p style="margin: 0; color: #64748B; font-size: 11px; margin-top: 6px; border-top: 1px solid #E2E8F0; padding-top: 4px; line-height: 1.35;">
        <em>Nota Metodológica:</em> Consideram-se as residências à margem do Rio Ingaúra e o entorno de impacto socioambiental direto.
      </p>
    </div>
  `);

  // Risk area — Rio Ingaúra / Calha Crítica
  const riskArea = L.polygon(
    [
      [-2.5905, -44.2235],
      [-2.5910, -44.2220],
      [-2.5915, -44.2200],
      [-2.5912, -44.2185],
      [-2.5920, -44.2185],
      [-2.5920, -44.2240],
    ],
    {
      color: '#DC2626',
      fillColor: '#DC2626',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '4, 4',
    }
  ).addTo(map);

  riskArea.bindPopup(`
    <div style="font-family: 'Inter', sans-serif; padding: 4px; min-width: 220px;">
      <div style="font-family: 'Space Mono', monospace; font-size: 10px; color: #DC2626; font-weight: 700; margin-bottom: 4px;">[ ÁREA DE RISCO HÍDRICO ]</div>
      <h3 style="margin: 0 0 6px; color: #DC2626; font-size: 14px; font-weight: 700;">Margem do Rio Ingaúra</h3>
      <p style="margin: 0; color: #334155; font-size: 12px; line-height: 1.4;">
        100% das famílias convivem com a vulnerabilidade climática severa pelo transbordamento e refluxo de águas pluviais contaminadas.
      </p>
    </div>
  `);

  // Markers for key issues with REAL PHOTOS (NO EMOJIS)
  const markers = [
    {
      pos: [-2.5880, -44.2205],
      color: '#E86C1D',
      type: 'community',
      code: 'P.01',
      title: 'P.01 // Núcleo Vila Sapo',
      desc: '21 famílias entrevistadas. 95% das vias sem pavimentação e isolamento em períodos de fortes chuvas.',
      img: '/fotos/foto-1.jpg'
    },
    {
      pos: [-2.5900, -44.2210],
      color: '#DC2626',
      type: 'flood',
      code: 'P.02',
      title: 'P.02 // Margem do Rio Ingaúra & Enchentes',
      desc: '90% das moradias atingidas diretamente por enchentes. 48% das famílias relatam ocorrência de óbitos por alagamento.',
      img: '/fotos/foto-2.jpg'
    },
    {
      pos: [-2.5890, -44.2190],
      color: '#DC2626',
      type: 'sewage',
      code: 'P.03',
      title: 'P.03 // Esgoto a Céu Aberto',
      desc: '100% das famílias convivem com esgoto a céu aberto. 62% do descarte é efetuado diretamente na calha do rio.',
      img: '/fotos/foto-3.jpg'
    },
    {
      pos: [-2.5870, -44.2200],
      color: '#D97706',
      type: 'hazard',
      code: 'P.04',
      title: 'P.04 // Invasão de Fauna Peçonhenta',
      desc: '95% relatam invasão de animais peçonhentos e vetores (jacarés, cobras e escorpiões) após as inundações.',
      img: '/fotos/foto-4.jpg'
    },
  ];

  markers.forEach(({ pos, color, type, code, title, desc, img }) => {
    L.marker(pos, { icon: createIcon(color, type, code) })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: 'Inter', sans-serif; min-width: 240px; max-width: 270px; padding: 2px;">
          <div style="width: 100%; height: 130px; overflow: hidden; border-radius: 4px; margin-bottom: 8px; border: 1px solid #E2E8F0; background: #F1F5F9;">
            <img src="${img}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'" />
          </div>
          <div style="font-family: 'Space Mono', monospace; font-size: 10px; color: ${color}; font-weight: 700; margin-bottom: 4px;">${title}</div>
          <p style="margin: 0; color: #334155; font-size: 12px; line-height: 1.45;">${desc}</p>
        </div>
      `);
  });

  // Legend (Institutional Light card style, ZERO EMOJIS)
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <div style="
        background: #FFFFFF;
        padding: 10px 12px;
        border-radius: 6px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        font-family: 'Space Mono', monospace;
        font-size: 11px;
        color: #334155;
        min-width: 175px;
      ">
        <div style="font-weight: 700; margin-bottom: 8px; color: #0F172A; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
          LEGENDA CARTOGRÁFICA
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <div style="width: 16px; height: 3px; background: #E86C1D;"></div>
          <span>Perímetro Vila Sapo</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <div style="width: 16px; height: 3px; background: #DC2626;"></div>
          <span>Margem do Rio Ingaúra</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
          <span style="display: inline-block; width: 15px; height: 15px; background: #E86C1D; color: #fff; font-size: 8px; font-weight: 700; text-align: center; line-height: 15px; border-radius: 2px;">01</span>
          <span>Núcleo Comunitário</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
          <span style="display: inline-block; width: 15px; height: 15px; background: #DC2626; color: #fff; font-size: 8px; font-weight: 700; text-align: center; line-height: 15px; border-radius: 2px;">02</span>
          <span>Eixo de Alagamento</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
          <span style="display: inline-block; width: 15px; height: 15px; background: #DC2626; color: #fff; font-size: 8px; font-weight: 700; text-align: center; line-height: 15px; border-radius: 2px;">03</span>
          <span>Esgoto a Céu Aberto</span>
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

  // Invalidate size on events
  setTimeout(() => map.invalidateSize(), 400);
  window.addEventListener('resize', () => map.invalidateSize());

  return map;
}
