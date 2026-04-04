/**
 * Carte — accueil incitta.eu
 * - Mapbox streets-v12 si meta mapbox-access-token renseignée
 * - Sinon Leaflet + tuiles OpenStreetMap (détail maximal, sans clé)
 * - Survol liste ↔ marqueur ; clic → panneau latéral + backdrop blur
 */

function loadCss(href) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.crossOrigin = '';
    l.onload = () => resolve();
    l.onerror = () => reject(new Error(`CSS ${href}`));
    document.head.appendChild(l);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Script ${src}`));
    document.head.appendChild(s);
  });
}

function getMapboxToken() {
  const meta = document.querySelector('meta[name="mapbox-access-token"]');
  const t = meta?.getAttribute('content')?.trim();
  return t || '';
}

function createMarkerEl(placeId) {
  const el = document.createElement('div');
  el.className = 'city-explore-marker';
  el.dataset.placeId = placeId;
  el.setAttribute('aria-hidden', 'true');
  const inner = document.createElement('span');
  inner.className = 'city-explore-marker__dot';
  el.appendChild(inner);
  return el;
}

function setMarkerHighlight(placeId, on) {
  const safe = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(placeId) : placeId.replace(/"/g, '\\"');
  const el = document.querySelector(`.city-explore-marker[data-place-id="${safe}"]`);
  if (el) el.classList.toggle('is-highlighted', on);
}

function collectPlaces(root) {
  const cards = root.querySelectorAll('.city-explore-card[data-place-id]');
  return Array.from(cards).map((card) => ({
    id: card.dataset.placeId,
    lat: parseFloat(card.dataset.lat, 10),
    lng: parseFloat(card.dataset.lng, 10),
    title: card.dataset.title || '',
    body: card.dataset.body || '',
    meta: card.dataset.meta || '',
    card,
  })).filter((p) => p.id && Number.isFinite(p.lat) && Number.isFinite(p.lng));
}

function openPanel(root, place, onCloseFocusEl) {
  const backdrop = root.querySelector('.city-explore-backdrop');
  const panel = root.querySelector('.city-explore-panel');
  const titleEl = root.querySelector('#city-explore-panel-title');
  const metaEl = root.querySelector('#city-explore-panel-meta');
  const bodyEl = root.querySelector('#city-explore-panel-body');
  if (!backdrop || !panel || !titleEl || !bodyEl) return;

  titleEl.textContent = place.title;
  if (metaEl) {
    metaEl.textContent = place.meta || '';
    metaEl.hidden = !place.meta;
  }
  bodyEl.replaceChildren();
  const chunks = place.body
    .split(/\||\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  chunks.forEach((line) => {
    const p = document.createElement('p');
    p.textContent = line;
    bodyEl.appendChild(p);
  });

  backdrop.hidden = false;
  panel.hidden = false;
  requestAnimationFrame(() => {
    backdrop.classList.add('is-visible');
    panel.classList.add('is-open');
  });
  panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('city-explore-panel-open');

  const closeBtn = panel.querySelector('.city-explore-panel__close');
  closeBtn?.focus({ preventScroll: true });

  const mapApi = root._cityExploreMapApi;

  function close() {
    backdrop.classList.remove('is-visible');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('city-explore-panel-open');
    window.setTimeout(() => {
      backdrop.hidden = true;
      panel.hidden = true;
      scheduleMapResize(mapApi);
    }, 380);
    onCloseFocusEl?.focus?.({ preventScroll: true });
    document.removeEventListener('keydown', onKey);
    backdrop.removeEventListener('click', onBackdropClick);
    closeBtn?.removeEventListener('click', onCloseClick);
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  function onBackdropClick(e) {
    if (e.target === backdrop) close();
  }

  function onCloseClick() {
    close();
  }

  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('click', onBackdropClick);
  closeBtn?.addEventListener('click', onCloseClick);
}

async function initLeafletMap(container, places, markerById) {
  await loadCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  const L = window.L;
  if (!L) return null;

  const map = L.map(container, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
    maxZoom: 19,
  });

  /* Tuiles OSM : maximum de détail (routes, eau, bâtiments, noms, équipements) — usage modéré conforme à la politique des tuiles OSM */
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    maxNativeZoom: 19,
  }).addTo(map);

  const pane = container.querySelector('.leaflet-tile-pane');
  if (pane) pane.classList.add('city-explore-tile-pane');

  const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
  map.fitBounds(bounds, { padding: [18, 18], maxZoom: 18 });

  places.forEach((p) => {
    const el = createMarkerEl(p.id);
    const icon = L.divIcon({
      className: 'city-explore-marker-wrap',
      html: el,
      iconSize: [28, 36],
      iconAnchor: [14, 32],
    });
    const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
    markerById.set(p.id, { kind: 'leaflet', marker, element: el });
  });

  return { map, kind: 'leaflet' };
}

async function initMapboxMap(container, token, places, markerById) {
  await loadCss('https://api.mapbox.com/mapbox-gl-js/v3.9.2/mapbox-gl.css');
  await loadScript('https://api.mapbox.com/mapbox-gl-js/v3.9.2/mapbox-gl.js');
  const mapboxgl = window.mapboxgl;
  if (!mapboxgl) return null;

  mapboxgl.accessToken = token;

  const first = places[0];
  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [first.lng, first.lat],
    zoom: 13,
    attributionControl: true,
  });

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

  await new Promise((resolve) => {
    if (typeof map.loaded === 'function' && map.loaded()) resolve();
    else map.once('load', resolve);
  });

  const bounds = new mapboxgl.LngLatBounds();
  places.forEach((p) => bounds.extend([p.lng, p.lat]));
  map.fitBounds(bounds, { padding: 20, maxZoom: 18, duration: 0 });

  places.forEach((p) => {
    const el = createMarkerEl(p.id);
    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([p.lng, p.lat])
      .addTo(map);
    markerById.set(p.id, { kind: 'mapbox', marker, element: el });
  });

  return { map, kind: 'mapbox' };
}

function scheduleMapResize(mapApi) {
  window.setTimeout(() => {
    if (!mapApi) return;
    if (mapApi.kind === 'leaflet') mapApi.map.invalidateSize();
    if (mapApi.kind === 'mapbox') mapApi.map.resize();
  }, 400);
}

export function initCityExploreMap() {
  const root = document.getElementById('city-explore');
  const container = document.getElementById('city-explore-map');
  if (!root || !container) return;
  /* Section masquée (pas de missions à montrer) : pas de chargement carte / scripts */
  if (root.hasAttribute('hidden')) return;

  const places = collectPlaces(root);
  if (places.length === 0) return;

  const markerById = new Map();
  const token = getMapboxToken();

  (async () => {
    let mapApi = null;
    try {
      if (token) {
        mapApi = await initMapboxMap(container, token, places, markerById);
      }
      if (!mapApi) {
        mapApi = await initLeafletMap(container, places, markerById);
      }
    } catch (e) {
      console.warn('[city-explore] Carte non initialisée :', e);
      container.innerHTML =
        '<p class="city-explore-map-fallback">Carte indisponible pour le moment. Les lieux restent consultables dans la liste.</p>';
    }

    root._cityExploreMapApi = mapApi;

    places.forEach((p) => {
      const { card } = p;
      card.addEventListener('mouseenter', () => setMarkerHighlight(p.id, true));
      card.addEventListener('mouseleave', () => setMarkerHighlight(p.id, false));
      card.addEventListener('focusin', () => setMarkerHighlight(p.id, true));
      card.addEventListener('focusout', (e) => {
        if (!card.contains(e.relatedTarget)) setMarkerHighlight(p.id, false);
      });

      card.addEventListener('click', (e) => {
        e.preventDefault();
        openPanel(root, p, card);
        scheduleMapResize(mapApi);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPanel(root, p, card);
          scheduleMapResize(mapApi);
        }
      });
    });
  })();
}
