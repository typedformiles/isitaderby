/**
 * Leaflet map integration.
 */

let derbyMap = null;
let mapMarkers = [];
let mapLine = null;

function initMap() {
  if (derbyMap) return;
  derbyMap = L.map('map', {
    scrollWheelZoom: false,
    attributionControl: true
  }).setView([52.5, -1.5], 6);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(derbyMap);
}

function showMatchupOnMap(clubA, clubB, result) {
  initMap();

  // Clear previous
  mapMarkers.forEach(m => derbyMap.removeLayer(m));
  mapMarkers = [];
  if (mapLine) {
    derbyMap.removeLayer(mapLine);
    mapLine = null;
  }

  const verdictClass = getVerdictClass(result.verdict);
  const colours = {
    fierce: '#22c55e',
    local: '#84cc16',
    rivalry: '#eab308',
    stretch: '#f97316',
    'not-derby': '#ef4444'
  };
  const colour = colours[verdictClass] || '#5b8def';

  // Markers
  const iconA = L.divIcon({
    className: 'map-marker',
    html: `<div style="width:14px;height:14px;background:${colour};border:2px solid #fff;border-radius:50%;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
  const iconB = L.divIcon({
    className: 'map-marker',
    html: `<div style="width:14px;height:14px;background:${colour};border:2px solid #fff;border-radius:50%;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  const markerA = L.marker([clubA.lat, clubA.lng], { icon: iconA })
    .bindTooltip(clubA.name, { permanent: true, direction: 'top', offset: [0, -10], className: 'map-tooltip' })
    .addTo(derbyMap);

  const markerB = L.marker([clubB.lat, clubB.lng], { icon: iconB })
    .bindTooltip(clubB.name, { permanent: true, direction: 'top', offset: [0, -10], className: 'map-tooltip' })
    .addTo(derbyMap);

  mapMarkers.push(markerA, markerB);

  // Line between clubs
  mapLine = L.polyline(
    [[clubA.lat, clubA.lng], [clubB.lat, clubB.lng]],
    { color: colour, weight: 2, dashArray: '6 4', opacity: 0.7 }
  ).addTo(derbyMap);

  // Distance label at midpoint
  const midLat = (clubA.lat + clubB.lat) / 2;
  const midLng = (clubA.lng + clubB.lng) / 2;
  const distLabel = L.marker([midLat, midLng], {
    icon: L.divIcon({
      className: 'map-dist-label',
      html: `<div style="background:rgba(15,25,12,0.85);color:#f0f0e8;padding:2px 8px;border-radius:0;font-size:12px;font-weight:600;white-space:nowrap;border:1px solid rgba(255,255,255,0.3);">${result.distance} mi</div>`,
      iconAnchor: [25, 10]
    })
  }).addTo(derbyMap);
  mapMarkers.push(distLabel);

  // Fit bounds
  const bounds = L.latLngBounds(
    [clubA.lat, clubA.lng],
    [clubB.lat, clubB.lng]
  );
  derbyMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
}
