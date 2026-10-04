/* Szlakownik — personal offline hiking map. Plain JS, Leaflet 1.9. */
(() => {
'use strict';

const $ = (id) => document.getElementById(id);

/* ---------------------------------------------------------------- i18n */
const I18N = {
  pl: {
    'net.offline': 'Offline', draw: 'Rysuj', drawing: 'Rysowanie — stuknij w mapę', snap: 'Po szlakach', undo: 'Cofnij', clear: 'Wyczyść', save: 'Zapisz',
    'stat.dist': 'Dystans', 'stat.up': 'Podejście', 'stat.down': 'Zejście', 'stat.time': 'Czas',
    'profile.empty': 'Profil wysokości pojawi się po drugim punkcie', 'profile.loading': 'Pobieram wysokości…', 'profile.noele': 'Brak danych o wysokości (potrzebna sieć)', 'profile.retry': 'Pobierz wysokości',
    layers: 'Warstwy', 'layers.base': 'Mapa', 'layers.overlays': 'Nakładki', 'layer.opentopo': 'OpenTopoMap (rzeźba)', 'layer.osm': 'OpenStreetMap', 'layer.hiking': 'Szlaki piesze (OSM)', 'layer.cycling': 'Szlaki rowerowe', 'layer.km': 'Znaczniki kilometrów',
    'layers.note': 'Szlaki pochodzą z OpenStreetMap (waymarkedtrails.org): kolory jak na znakach PTTK.',
    routes: 'Trasy', 'routes.empty': 'Brak zapisanych tras', 'routes.import': 'Importuj GPX', 'routes.load': 'Otwórz', 'routes.delete': 'Usuń', 'routes.new': 'Nowa trasa', 'routes.export': 'GPX',
    'save.title': 'Zapisz trasę', cancel: 'Anuluj', saved: 'Zapisano', deleted: 'Usunięto', close: 'Zamknij',
    settings: 'Ustawienia', 'settings.lang': 'Język', 'settings.time': 'Obliczanie czasu (DIN 33466)', 'settings.flat': 'Prędkość na płaskim, km/h', 'settings.up': 'Podejście, m/h', 'settings.down': 'Zejście, m/h',
    'settings.timeNote': 'Czas = dłuższy z (poziomy, pionowy) + połowa krótszego. Bez przerw.', 'settings.profile': 'Profil wyznaczania trasy', 'settings.cacheViewed': 'Zapisuj przeglądane kafelki',
    'settings.about': 'Mapa: OpenTopoMap, OpenStreetMap. Szlaki: waymarkedtrails.org. Trasowanie: brouter.de. Wysokości: open-meteo.com.', rebuild: 'Przelicz po szlakach',
    offline: 'Mapa offline', 'offline.area': 'Obszar', 'offline.view': 'Bieżący widok', 'offline.route': 'Wzdłuż trasy (±1 km)', 'offline.zoom': 'Szczegółowość do zoom',
    'offline.estimate': '{n} kafelków · ≈{mb} MB', 'offline.download': 'Pobierz', 'offline.cancel': 'Stop', 'offline.done': 'Gotowe: zapisano {n} kafelków', 'offline.cache': 'W pamięci: {n} kafelków, {mb} MB',
    'offline.cacheTitle': 'Pamięć podręczna', 'offline.clear': 'Wyczyść pamięć', 'offline.unavailable': 'Tryb offline działa tylko w zainstalowanej wersji (HTTPS).', 'offline.toomany': 'Za dużo kafelków — zmniejsz obszar lub zoom',
    'offline.note': 'Kafelki przeglądane online zapisują się same. Pobieranie dużych obszarów obciąża serwery OpenTopoMap — pobieraj tylko to, co potrzebne.', 'offline.progress': '{done} / {n}', 'offline.noroute': 'Najpierw narysuj trasę', 'offline.nocors': '{host}: serwer nie pozwala na zapis (brak CORS)',
    gps: 'GPS', 'gps.denied': 'Brak dostępu do lokalizacji', 'gps.unavailable': 'Lokalizacja niedostępna', 'gps.follow': 'Śledzenie włączone',
    'snap.failed': 'Nie udało się wyznaczyć po szlakach — linia prosta', 'pt.removed': 'Punkt usunięty', 'route.cleared': 'Trasa wyczyszczona',
    'gpx.imported': 'Zaimportowano: {name}', 'gpx.badfile': 'Nie udało się odczytać GPX',
    'sw.updated': 'Dostępna nowa wersja — odśwież stronę', 'unit.km': 'km', 'unit.m': 'm', 'unit.h': 'h', 'unit.min': 'min', 'route.untitled': 'Trasa', 'ele.failed': 'Nie udało się pobrać wysokości',
  },
  ru: {
    'net.offline': 'Офлайн', draw: 'Рисовать', drawing: 'Рисую — тапни по карте', snap: 'По тропам', undo: 'Отменить', clear: 'Очистить', save: 'Сохранить',
    'stat.dist': 'Длина', 'stat.up': 'Набор', 'stat.down': 'Спуск', 'stat.time': 'Время',
    'profile.empty': 'Профиль высот появится после второй точки', 'profile.loading': 'Загружаю высоты…', 'profile.noele': 'Нет данных о высотах (нужна сеть)', 'profile.retry': 'Загрузить высоты',
    layers: 'Слои', 'layers.base': 'Карта', 'layers.overlays': 'Наложения', 'layer.opentopo': 'OpenTopoMap (рельеф)', 'layer.osm': 'OpenStreetMap', 'layer.hiking': 'Пешие szlaki (OSM)', 'layer.cycling': 'Велосипедные szlaki', 'layer.km': 'Километровые отметки',
    'layers.note': 'Szlaki берутся из OpenStreetMap (waymarkedtrails.org): цвета как на знаках PTTK.',
    routes: 'Маршруты', 'routes.empty': 'Сохранённых маршрутов пока нет', 'routes.import': 'Импорт GPX', 'routes.load': 'Открыть', 'routes.delete': 'Удалить', 'routes.new': 'Новый маршрут', 'routes.export': 'GPX',
    'save.title': 'Сохранить маршрут', cancel: 'Отмена', saved: 'Сохранено', deleted: 'Удалено', close: 'Закрыть',
    settings: 'Настройки', 'settings.lang': 'Язык', 'settings.time': 'Расчёт времени (DIN 33466)', 'settings.flat': 'Скорость по ровному, км/ч', 'settings.up': 'Подъём, м/ч', 'settings.down': 'Спуск, м/ч',
    'settings.timeNote': 'Время = большее из (горизонтальное, вертикальное) + половина меньшего. Без привалов.', 'settings.profile': 'Профиль маршрутизации', 'settings.cacheViewed': 'Кэшировать просмотренные тайлы',
    'settings.about': 'Карта: OpenTopoMap, OpenStreetMap. Szlaki: waymarkedtrails.org. Маршрутизация: brouter.de. Высоты: open-meteo.com.', rebuild: 'Перестроить по тропам',
    offline: 'Офлайн-карта', 'offline.area': 'Область', 'offline.view': 'Текущий экран', 'offline.route': 'Вдоль маршрута (±1 км)', 'offline.zoom': 'Детализация до zoom',
    'offline.estimate': '{n} тайлов · ≈{mb} МБ', 'offline.download': 'Скачать', 'offline.cancel': 'Стоп', 'offline.done': 'Готово: сохранено {n} тайлов', 'offline.cache': 'В кэше: {n} тайлов, {mb} МБ',
    'offline.cacheTitle': 'Кэш', 'offline.clear': 'Очистить кэш', 'offline.unavailable': 'Офлайн-режим работает только в установленной версии (HTTPS).', 'offline.toomany': 'Слишком много тайлов — уменьши область или zoom',
    'offline.note': 'Тайлы, просмотренные онлайн, сохраняются сами. Скачивание больших областей нагружает серверы OpenTopoMap — качай только нужное.', 'offline.progress': '{done} / {n}', 'offline.noroute': 'Сначала нарисуй маршрут', 'offline.nocors': '{host}: сервер не разрешает кэширование (нет CORS)',
    gps: 'GPS', 'gps.denied': 'Нет доступа к геолокации', 'gps.unavailable': 'Геолокация недоступна', 'gps.follow': 'Слежение включено',
    'snap.failed': 'Не удалось проложить по тропам — прямая линия', 'pt.removed': 'Точка удалена', 'route.cleared': 'Маршрут очищен',
    'gpx.imported': 'Импортировано: {name}', 'gpx.badfile': 'Не удалось прочитать GPX',
    'sw.updated': 'Доступна новая версия — перезагрузи страницу', 'unit.km': 'км', 'unit.m': 'м', 'unit.h': 'ч', 'unit.min': 'мин', 'route.untitled': 'Маршрут', 'ele.failed': 'Не удалось загрузить высоты',
  },
  uk: {
    'net.offline': 'Офлайн', draw: 'Малювати', drawing: 'Малюю — тапни по мапі', snap: 'Стежками', undo: 'Скасувати', clear: 'Очистити', save: 'Зберегти',
    'stat.dist': 'Довжина', 'stat.up': 'Набір', 'stat.down': 'Спуск', 'stat.time': 'Час',
    'profile.empty': 'Профіль висот з’явиться після другої точки', 'profile.loading': 'Завантажую висоти…', 'profile.noele': 'Немає даних про висоти (потрібна мережа)', 'profile.retry': 'Завантажити висоти',
    layers: 'Шари', 'layers.base': 'Мапа', 'layers.overlays': 'Накладки', 'layer.opentopo': 'OpenTopoMap (рельєф)', 'layer.osm': 'OpenStreetMap', 'layer.hiking': 'Пішохідні szlaki (OSM)', 'layer.cycling': 'Велосипедні szlaki', 'layer.km': 'Кілометрові позначки',
    'layers.note': 'Szlaki беруться з OpenStreetMap (waymarkedtrails.org): кольори як на знаках PTTK.',
    routes: 'Маршрути', 'routes.empty': 'Збережених маршрутів поки немає', 'routes.import': 'Імпорт GPX', 'routes.load': 'Відкрити', 'routes.delete': 'Видалити', 'routes.new': 'Новий маршрут', 'routes.export': 'GPX',
    'save.title': 'Зберегти маршрут', cancel: 'Скасувати', saved: 'Збережено', deleted: 'Видалено', close: 'Закрити',
    settings: 'Налаштування', 'settings.lang': 'Мова', 'settings.time': 'Розрахунок часу (DIN 33466)', 'settings.flat': 'Швидкість по рівному, км/год', 'settings.up': 'Підйом, м/год', 'settings.down': 'Спуск, м/год',
    'settings.timeNote': 'Час = більше з (горизонтальне, вертикальне) + половина меншого. Без привалів.', 'settings.profile': 'Профіль маршрутизації', 'settings.cacheViewed': 'Кешувати переглянуті тайли',
    'settings.about': 'Мапа: OpenTopoMap, OpenStreetMap. Szlaki: waymarkedtrails.org. Маршрутизація: brouter.de. Висоти: open-meteo.com.', rebuild: 'Перебудувати стежками',
    offline: 'Офлайн-мапа', 'offline.area': 'Область', 'offline.view': 'Поточний екран', 'offline.route': 'Уздовж маршруту (±1 км)', 'offline.zoom': 'Деталізація до zoom',
    'offline.estimate': '{n} тайлів · ≈{mb} МБ', 'offline.download': 'Завантажити', 'offline.cancel': 'Стоп', 'offline.done': 'Готово: збережено {n} тайлів', 'offline.cache': 'У кеші: {n} тайлів, {mb} МБ',
    'offline.cacheTitle': 'Кеш', 'offline.clear': 'Очистити кеш', 'offline.unavailable': 'Офлайн-режим працює лише у встановленій версії (HTTPS).', 'offline.toomany': 'Забагато тайлів — зменш область або zoom',
    'offline.note': 'Тайли, переглянуті онлайн, зберігаються самі. Завантаження великих областей навантажує сервери OpenTopoMap — качай лише потрібне.', 'offline.progress': '{done} / {n}', 'offline.noroute': 'Спочатку намалюй маршрут', 'offline.nocors': '{host}: сервер не дозволяє кешування (немає CORS)',
    gps: 'GPS', 'gps.denied': 'Немає доступу до геолокації', 'gps.unavailable': 'Геолокація недоступна', 'gps.follow': 'Стеження увімкнено',
    'snap.failed': 'Не вдалося прокласти стежками — пряма лінія', 'pt.removed': 'Точку видалено', 'route.cleared': 'Маршрут очищено',
    'gpx.imported': 'Імпортовано: {name}', 'gpx.badfile': 'Не вдалося прочитати GPX',
    'sw.updated': 'Доступна нова версія — перезавантаж сторінку', 'unit.km': 'км', 'unit.m': 'м', 'unit.h': 'год', 'unit.min': 'хв', 'route.untitled': 'Маршрут', 'ele.failed': 'Не вдалося завантажити висоти',
  },
  en: {
    'net.offline': 'Offline', draw: 'Draw', drawing: 'Drawing — tap the map', snap: 'Snap to trails', undo: 'Undo', clear: 'Clear', save: 'Save',
    'stat.dist': 'Distance', 'stat.up': 'Ascent', 'stat.down': 'Descent', 'stat.time': 'Time',
    'profile.empty': 'Elevation profile appears after the second point', 'profile.loading': 'Loading elevation…', 'profile.noele': 'No elevation data (network needed)', 'profile.retry': 'Load elevation',
    layers: 'Layers', 'layers.base': 'Base map', 'layers.overlays': 'Overlays', 'layer.opentopo': 'OpenTopoMap (relief)', 'layer.osm': 'OpenStreetMap', 'layer.hiking': 'Hiking trails (OSM)', 'layer.cycling': 'Cycling routes', 'layer.km': 'Km markers',
    'layers.note': 'Trails come from OpenStreetMap (waymarkedtrails.org), coloured like the PTTK blazes.',
    routes: 'Routes', 'routes.empty': 'No saved routes yet', 'routes.import': 'Import GPX', 'routes.load': 'Open', 'routes.delete': 'Delete', 'routes.new': 'New route', 'routes.export': 'GPX',
    'save.title': 'Save route', cancel: 'Cancel', saved: 'Saved', deleted: 'Deleted', close: 'Close',
    settings: 'Settings', 'settings.lang': 'Language', 'settings.time': 'Time estimate (DIN 33466)', 'settings.flat': 'Flat speed, km/h', 'settings.up': 'Ascent, m/h', 'settings.down': 'Descent, m/h',
    'settings.timeNote': 'Time = the larger of (horizontal, vertical) + half of the smaller. No breaks.', 'settings.profile': 'Routing profile', 'settings.cacheViewed': 'Cache viewed tiles',
    'settings.about': 'Map: OpenTopoMap, OpenStreetMap. Trails: waymarkedtrails.org. Routing: brouter.de. Elevation: open-meteo.com.', rebuild: 'Rebuild along trails',
    offline: 'Offline map', 'offline.area': 'Area', 'offline.view': 'Current view', 'offline.route': 'Along route (±1 km)', 'offline.zoom': 'Detail up to zoom',
    'offline.estimate': '{n} tiles · ≈{mb} MB', 'offline.download': 'Download', 'offline.cancel': 'Stop', 'offline.done': 'Done: {n} tiles saved', 'offline.cache': 'Cached: {n} tiles, {mb} MB',
    'offline.cacheTitle': 'Cache', 'offline.clear': 'Clear cache', 'offline.unavailable': 'Offline mode works only in the installed version (HTTPS).', 'offline.toomany': 'Too many tiles — reduce the area or zoom',
    'offline.note': 'Tiles viewed online are cached automatically. Downloading large areas loads the OpenTopoMap servers — fetch only what you need.', 'offline.progress': '{done} / {n}', 'offline.noroute': 'Draw a route first', 'offline.nocors': '{host}: server does not allow caching (no CORS)',
    gps: 'GPS', 'gps.denied': 'Location access denied', 'gps.unavailable': 'Location unavailable', 'gps.follow': 'Following your position',
    'snap.failed': 'Trail routing failed — straight line', 'pt.removed': 'Point removed', 'route.cleared': 'Route cleared',
    'gpx.imported': 'Imported: {name}', 'gpx.badfile': 'Could not read the GPX file',
    'sw.updated': 'New version available — reload the page', 'unit.km': 'km', 'unit.m': 'm', 'unit.h': 'h', 'unit.min': 'min', 'route.untitled': 'Route', 'ele.failed': 'Could not load elevation',
  },
};

/* ------------------------------------------------------------ settings */
const DEFAULTS = { lang: null, base: 'opentopo', hiking: true, cycling: false, km: true, snap: true, flat: 4, up: 300, down: 500, profile: 'hiking-mountain', cacheViewed: true, sheet: 'open', view: null };
const settings = Object.assign({}, DEFAULTS);
try { Object.assign(settings, JSON.parse(localStorage.getItem('szlakownik.settings') || '{}')); } catch (e) { /* no storage */ }
function saveSettings() { try { localStorage.setItem('szlakownik.settings', JSON.stringify(settings)); } catch (e) { /* ignore */ } }

function detectLang() {
  const l = (navigator.language || 'pl').toLowerCase();
  if (l.startsWith('pl')) return 'pl';
  if (l.startsWith('uk')) return 'uk';
  if (l.startsWith('ru')) return 'ru';
  if (l.startsWith('en')) return 'en';
  return 'pl';
}
let LANG = settings.lang || detectLang();
const t = (k, vars) => {
  let s = (I18N[LANG] && I18N[LANG][k]) || I18N.en[k] || k;
  if (vars) for (const v in vars) s = s.replace('{' + v + '}', vars[v]);
  return s;
};
function applyI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
  $('selLang').value = LANG;
  renderStats();
  renderRouteList();
  drawProfile();
}

/* ----------------------------------------------------------------- UI helpers */
function toast(msg, ms = 2600) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  $('toasts').appendChild(el);
  setTimeout(() => el.remove(), ms);
}
let openPanel = null;
function showPanel(id) {
  closePanel();
  openPanel = $(id); openPanel.hidden = false; $('backdrop').hidden = false;
  if (id === 'panelOffline') refreshOfflinePanel();
}
function closePanel() { if (openPanel) openPanel.hidden = true; openPanel = null; $('backdrop').hidden = true; }
$('backdrop').addEventListener('click', closePanel);
document.querySelectorAll('.panel-close').forEach((b) => b.addEventListener('click', closePanel));

/* ------------------------------------------------------------------ geo math */
const R = 6371008.8;
function haversine(a, b) { // [lat, lon]
  const toR = Math.PI / 180;
  const dLat = (b[0] - a[0]) * toR, dLon = (b[1] - a[1]) * toR;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function lon2tile(lon, z) { return Math.floor((lon + 180) / 360 * 2 ** z); }
function lat2tile(lat, z) { const r = lat * Math.PI / 180; return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** z); }
/** Interpolate straight segment a→b with points every `step` metres (returns [lat,lon] list incl. both ends). */
function densify(a, b, step = 100) {
  const d = haversine(a, b), n = Math.max(1, Math.ceil(d / step)), out = [];
  for (let i = 0; i <= n; i++) { const f = i / n; out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, null]); }
  return out;
}

/* --------------------------------------------------------- tile caching */
const TILE_CACHE = 'szlakownik-tiles-v1';
let tileCache = null;
async function openTileCache() {
  if (tileCache) return tileCache;
  try { if (window.caches && window.isSecureContext) tileCache = await caches.open(TILE_CACHE); } catch (e) { tileCache = null; }
  return tileCache;
}
openTileCache();

function tileUrl(tpl, subdomains, x, y, z) {
  const s = subdomains.length ? subdomains[Math.abs(x + y) % subdomains.length] : '';
  return tpl.replace('{s}', s).replace('{x}', x).replace('{y}', y).replace('{z}', z);
}
const corsBlocked = new Set(); // tile hosts that refused a CORS fetch this session (then: plain <img>, no caching)
const hostOf = (url) => { try { return new URL(url).hostname; } catch (e) { return url; } };
async function fetchTile(url, store, signal) {
  let resp;
  try { resp = await fetch(url, { mode: 'cors', credentials: 'omit', signal }); }
  catch (e) { if (e.name !== 'AbortError' && navigator.onLine) corsBlocked.add(hostOf(url)); throw e; }
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  if (store && tileCache) { try { await tileCache.put(url, resp.clone()); } catch (e) { /* quota */ } }
  return resp.blob();
}
const CachedTileLayer = L.TileLayer.extend({
  createTile(coords, done) {
    const img = document.createElement('img');
    img.alt = ''; img.setAttribute('role', 'presentation');
    const url = tileUrl(this._url, this.options.subdomains, coords.x, coords.y, coords.z);
    (async () => {
      let blob = null;
      const cache = await openTileCache();
      if (cache) { try { const r = await cache.match(url); if (r) blob = await r.blob(); } catch (e) { /* ignore */ } }
      if (!blob) {
        if (!navigator.onLine) throw new Error('offline');
        const direct = () => new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('load')); img.src = url; });
        if (corsBlocked.has(hostOf(url))) { await direct(); return; }
        try { blob = await fetchTile(url, settings.cacheViewed); }
        catch (e) { await direct(); return; } // no CORS or network error: plain image request (online only)
      }
      const obj = URL.createObjectURL(blob);
      await new Promise((res, rej) => { img.onload = () => { URL.revokeObjectURL(obj); res(); }; img.onerror = () => { URL.revokeObjectURL(obj); rej(new Error('decode')); }; img.src = obj; });
    })().then(() => done(null, img), (e) => done(e, img));
    return img;
  },
});

/* ------------------------------------------------------------------- map */
const SOURCES = {
  opentopo: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c'], maxNative: 17, kb: 28, attr: '© <a href="https://openstreetmap.org/copyright">OSM</a>, SRTM | <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)' },
  osm: { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', subdomains: [], maxNative: 19, kb: 22, attr: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>' },
  hiking: { url: 'https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', subdomains: [], maxNative: 18, kb: 6, attr: '<a href="https://hiking.waymarkedtrails.org">waymarkedtrails</a>' },
  cycling: { url: 'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', subdomains: [], maxNative: 18, kb: 6, attr: '<a href="https://cycling.waymarkedtrails.org">waymarkedtrails</a>' },
};
function makeLayer(key, extra) {
  const s = SOURCES[key];
  return new CachedTileLayer(s.url, Object.assign({ subdomains: s.subdomains, maxNativeZoom: s.maxNative, maxZoom: 19, attribution: s.attr, crossOrigin: 'anonymous', updateWhenIdle: true, keepBuffer: 3 }, extra || {}));
}
const map = L.map('map', { zoomControl: false, attributionControl: true, worldCopyJump: false, tap: false });
map.attributionControl.setPrefix('');
const layers = { opentopo: makeLayer('opentopo'), osm: makeLayer('osm'), hiking: makeLayer('hiking', { opacity: 0.95, zIndex: 5 }), cycling: makeLayer('cycling', { opacity: 0.9, zIndex: 4 }) };
let baseLayer = null;
function setBase(key) {
  if (baseLayer) map.removeLayer(baseLayer);
  baseLayer = layers[key] || layers.opentopo; baseLayer.addTo(map);
  settings.base = key; saveSettings();
  $('baseOpentopo').checked = key === 'opentopo'; $('baseOsm').checked = key === 'osm';
}
function setOverlay(key, on) {
  if (on) layers[key].addTo(map); else map.removeLayer(layers[key]);
  settings[key] = on; saveSettings();
}
setBase(settings.base);
setOverlay('hiking', settings.hiking); setOverlay('cycling', settings.cycling);
$('ovHiking').checked = settings.hiking; $('ovCycling').checked = settings.cycling; $('ovKm').checked = settings.km;
if (settings.view && settings.view.length === 3) map.setView([settings.view[0], settings.view[1]], settings.view[2]);
else map.setView([49.25, 19.95], 12); // Tatry, as a sensible first view
map.on('moveend', () => { const c = map.getCenter(); settings.view = [+c.lat.toFixed(5), +c.lng.toFixed(5), map.getZoom()]; saveSettings(); if (openPanel && openPanel.id === 'panelOffline') updateEstimate(); });
$('zoomIn').onclick = () => map.zoomIn(); $('zoomOut').onclick = () => map.zoomOut();
$('baseOpentopo').onchange = () => setBase('opentopo'); $('baseOsm').onchange = () => setBase('osm');
$('ovHiking').onchange = (e) => setOverlay('hiking', e.target.checked);
$('ovCycling').onchange = (e) => setOverlay('cycling', e.target.checked);
$('ovKm').onchange = (e) => { settings.km = e.target.checked; saveSettings(); renderKm(); };

/* ------------------------------------------------------------------ route model */
// route = { id, name, waypoints: [[lat,lon]], legs: [{ mode:'snap'|'line'|'fixed', coords:[[lat,lon,ele|null]], pending?:bool }] }
let route = newRoute();
let drawing = false;
const undoStack = [];
function newRoute() { return { id: null, name: '', waypoints: [], legs: [] }; }
function snapshot() { undoStack.push(JSON.stringify({ waypoints: route.waypoints, legs: route.legs.map((l) => (l ? { mode: l.mode, coords: l.coords } : null)) })); if (undoStack.length > 60) undoStack.shift(); $('btnUndo').disabled = false; }
function undo() {
  const s = undoStack.pop(); if (!s) return;
  const st = JSON.parse(s); route.waypoints = st.waypoints; route.legs = st.legs; legToken++;
  $('btnUndo').disabled = undoStack.length === 0;
  renderRoute(); afterRouteChange();
}
function track() { // full [lat,lon,ele] list (legs share endpoints, so skip each leg's first point after the first leg)
  const pts = [];
  route.legs.forEach((leg) => { if (!leg) return; leg.coords.forEach((c, j) => { if (pts.length && j === 0) return; pts.push(c); }); });
  return pts;
}

/* leg computation ------------------------------------------------------ */
let legToken = 0;
async function computeLeg(i) {
  const a = route.waypoints[i], b = route.waypoints[i + 1];
  if (!a || !b) return;
  const token = ++legToken;
  const leg = { mode: 'line', coords: densify(a, b), pending: settings.snap, token };
  route.legs[i] = leg;
  renderRoute();
  if (settings.snap && navigator.onLine) {
    try {
      const r = await brouter(a, b);
      if (leg.token !== token || route.legs[i] !== leg) return;
      leg.coords = r; leg.mode = 'snap';
    } catch (e) { if (route.legs[i] === leg) toast(t('snap.failed')); }
  }
  if (route.legs[i] !== leg) return;
  leg.pending = false;
  renderRoute();
  afterRouteChange();
}
async function brouter(a, b) {
  const url = `https://brouter.de/brouter?lonlats=${a[1].toFixed(6)},${a[0].toFixed(6)}|${b[1].toFixed(6)},${b[0].toFixed(6)}&profile=${encodeURIComponent(settings.profile)}&alternativeidx=0&format=geojson`;
  const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), 20000);
  try {
    const resp = await fetch(url, { signal: ctrl.signal });
    if (!resp.ok) throw new Error('brouter ' + resp.status);
    const gj = await resp.json();
    const coords = gj.features[0].geometry.coordinates.map((c) => [c[1], c[0], c.length > 2 && isFinite(c[2]) ? Math.round(c[2]) : null]);
    if (coords.length < 2) throw new Error('empty');
    coords[0] = [a[0], a[1], coords[0][2]]; coords[coords.length - 1] = [b[0], b[1], coords[coords.length - 1][2]];
    return coords;
  } finally { clearTimeout(tm); }
}

/* elevation ------------------------------------------------------------ */
let eleBusy = false, elePromise = null, eleFailedAt = 0;
function missingEle() { const m = []; route.legs.forEach((leg) => leg && leg.coords.forEach((c) => { if (c[2] == null) m.push(c); })); return m; }
function fillElevation(force) {
  if (elePromise) return elePromise;
  if (!missingEle().length) return Promise.resolve(true);
  if (!navigator.onLine) return Promise.resolve(false);
  if (!force && Date.now() - eleFailedAt < 30000) return Promise.resolve(false); // back off after a failure
  elePromise = (async () => {
    eleBusy = true; drawProfile();
    try {
      for (let pass = 0; pass < 3; pass++) { // points may be added while a pass runs
        const missing = missingEle(); if (!missing.length) break;
        for (let i = 0; i < missing.length; i += 100) {
          const chunk = missing.slice(i, i + 100);
          const url = `https://api.open-meteo.com/v1/elevation?latitude=${chunk.map((c) => c[0].toFixed(5)).join(',')}&longitude=${chunk.map((c) => c[1].toFixed(5)).join(',')}`;
          const resp = await fetch(url);
          if (!resp.ok) throw new Error('elevation ' + resp.status);
          const j = await resp.json();
          chunk.forEach((c, k) => { const e = j.elevation && j.elevation[k]; c[2] = isFinite(e) ? Math.round(e) : null; });
        }
      }
      return true;
    } catch (e) { eleFailedAt = Date.now(); toast(t('ele.failed')); return false; }
    finally { eleBusy = false; elePromise = null; renderStats(); drawProfile(); renderKm(); }
  })();
  return elePromise;
}

/* stats ---------------------------------------------------------------- */
function computeStats() {
  const pts = track();
  let dist = 0, up = 0, down = 0, hasEle = pts.length > 1;
  const prof = []; // {d (m), e}
  let ref = null;
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) dist += haversine(pts[i - 1], pts[i]);
    const e = pts[i][2];
    if (e == null) { hasEle = false; continue; }
    prof.push({ d: dist, e });
    if (ref == null) { ref = e; continue; }
    const diff = e - ref;
    if (Math.abs(diff) >= 4) { if (diff > 0) up += diff; else down -= diff; ref = e; } // 4 m hysteresis against SRTM noise
  }
  let minutes = null;
  if (pts.length > 1) {
    const th = dist / 1000 / settings.flat, tv = up / settings.up + down / settings.down;
    minutes = Math.round((Math.max(th, tv) + Math.min(th, tv) / 2) * 60);
  }
  return { dist, up: Math.round(up), down: Math.round(down), minutes, hasEle, prof, n: pts.length };
}
let stats = computeStats();
function fmtTime(min) { if (min == null) return '—'; const h = Math.floor(min / 60), m = min % 60; return h ? `${h}<small>${t('unit.h')}</small> ${String(m).padStart(2, '0')}<small>${t('unit.min')}</small>` : `${m}<small>${t('unit.min')}</small>`; }
function renderStats() {
  stats = computeStats();
  const km = stats.dist / 1000;
  $('sDist').innerHTML = `${km < 10 ? km.toFixed(2) : km.toFixed(1)}<small>${t('unit.km')}</small>`;
  $('sUp').innerHTML = stats.hasEle || stats.prof.length > 1 ? `${stats.up}<small>${t('unit.m')}</small>` : '—';
  $('sDown').innerHTML = stats.hasEle || stats.prof.length > 1 ? `${stats.down}<small>${t('unit.m')}</small>` : '—';
  $('sTime').innerHTML = fmtTime(stats.minutes);
  const has = route.waypoints.length > 0 || route.legs.length > 0;
  $('btnClear').disabled = !has; $('btnSave').disabled = stats.n < 2; $('btnExport').disabled = stats.n < 2;
}
function afterRouteChange() {
  renderStats(); drawProfile(); renderKm();
  if (stats.n > 1 && !stats.hasEle) fillElevation().then(() => { renderStats(); renderKm(); });
}

/* ------------------------------------------------------------- map rendering */
const routeGroup = L.layerGroup().addTo(map);
const casing = L.polyline([], { color: '#ffffff', weight: 8, opacity: 0.9, lineCap: 'round', interactive: false }).addTo(routeGroup);
const lines = L.layerGroup().addTo(routeGroup);
const wpGroup = L.layerGroup().addTo(map);
const kmGroup = L.layerGroup().addTo(map);
const hoverDot = L.marker([0, 0], { icon: L.divIcon({ className: '', html: '<div class="hover-dot"></div>', iconSize: [12, 12], iconAnchor: [6, 6] }), interactive: false, zIndexOffset: 900 });

function renderRoute() {
  lines.clearLayers();
  const all = [];
  route.legs.forEach((leg, i) => {
    if (!leg) return;
    const ll = leg.coords.map((c) => [c[0], c[1]]);
    all.push(...ll);
    const pl = L.polyline(ll, { color: '#c4321f', weight: 4, opacity: leg.pending ? 0.5 : 1, dashArray: leg.mode === 'line' ? '6 8' : null, lineCap: 'round', bubblingMouseEvents: false });
    pl.on('click', (e) => { if (drawing) insertWaypoint(i, [e.latlng.lat, e.latlng.lng]); });
    lines.addLayer(pl);
  });
  casing.setLatLngs(all);
  wpGroup.clearLayers();
  route.waypoints.forEach((p, i) => {
    const cls = 'wp' + (i === 0 ? ' start' : i === route.waypoints.length - 1 ? ' end' : '');
    const m = L.marker(p, { icon: L.divIcon({ className: '', html: `<div class="${cls}"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] }), draggable: true, zIndexOffset: 1000 });
    m.on('dragstart', () => snapshot());
    m.on('dragend', (e) => { const ll = e.target.getLatLng(); moveWaypoint(i, [ll.lat, ll.lng]); });
    m.on('click', () => { if (drawing) removeWaypoint(i); });
    wpGroup.addLayer(m);
  });
}
function renderKm() {
  kmGroup.clearLayers();
  if (!settings.km || map.getZoom() < 12) return;
  const pts = track(); let d = 0, next = 1000;
  for (let i = 1; i < pts.length; i++) {
    const seg = haversine(pts[i - 1], pts[i]);
    while (d + seg >= next && seg > 0) {
      const f = (next - d) / seg;
      const p = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
      kmGroup.addLayer(L.marker(p, { icon: L.divIcon({ className: '', html: `<div class="km-badge">${next / 1000}</div>`, iconSize: [24, 18], iconAnchor: [12, 9] }), interactive: false }));
      next += 1000;
    }
    d += seg;
  }
}
map.on('zoomend', renderKm);

/* -------------------------------------------------------------- editing ops */
function addWaypoint(p) {
  snapshot();
  route.waypoints.push(p);
  const n = route.waypoints.length;
  if (n >= 2) computeLeg(n - 2); else { renderRoute(); afterRouteChange(); }
}
function insertWaypoint(legIndex, p) {
  snapshot();
  route.waypoints.splice(legIndex + 1, 0, p);
  route.legs.splice(legIndex, 1, null, null);
  computeLeg(legIndex); computeLeg(legIndex + 1);
}
function moveWaypoint(i, p) {
  route.waypoints[i] = p;
  const fixedBefore = route.legs[i - 1] && route.legs[i - 1].mode === 'fixed';
  const fixedAfter = route.legs[i] && route.legs[i].mode === 'fixed';
  if (fixedBefore) { const c = route.legs[i - 1].coords; c[c.length - 1] = [p[0], p[1], null]; } else if (i > 0) computeLeg(i - 1);
  if (fixedAfter) { route.legs[i].coords[0] = [p[0], p[1], null]; } else if (i < route.waypoints.length - 1) computeLeg(i);
  renderRoute(); afterRouteChange();
}
function removeWaypoint(i) {
  snapshot();
  route.waypoints.splice(i, 1);
  if (i === 0) route.legs.shift();
  else if (i === route.waypoints.length) route.legs.pop();
  else { route.legs.splice(i - 1, 2, null); computeLeg(i - 1); }
  renderRoute(); afterRouteChange();
  toast(t('pt.removed'), 1500);
}
function clearRoute(silent) {
  if (route.waypoints.length || route.legs.length) snapshot();
  route = newRoute(); legToken++;
  renderRoute(); afterRouteChange(); renderRouteList();
  if (!silent) toast(t('route.cleared'), 1500);
}
async function rebuildAll() {
  if (route.waypoints.length < 2) return;
  snapshot();
  for (let i = 0; i < route.waypoints.length - 1; i++) await computeLeg(i);
}
function setDrawing(on) {
  drawing = on;
  $('btnDraw').classList.toggle('on', on);
  map.getContainer().classList.toggle('drawing', on);
  if (on) toast(t('drawing'), 1800);
}
map.on('click', (e) => { if (drawing) addWaypoint([e.latlng.lat, e.latlng.lng]); });
$('btnDraw').onclick = () => setDrawing(!drawing);
$('btnSnap').onclick = () => { settings.snap = !settings.snap; saveSettings(); $('btnSnap').classList.toggle('on', settings.snap); };
$('btnSnap').classList.toggle('on', settings.snap);
$('btnUndo').onclick = undo;
$('btnClear').onclick = () => clearRoute();
$('btnRebuild').onclick = () => { closePanel(); rebuildAll(); };

/* ------------------------------------------------------------ elevation profile */
const canvas = $('profile');
const ctx = canvas.getContext('2d');
let hoverIdx = -1;
function cssVar(n) { return getComputedStyle(document.body).getPropertyValue(n).trim() || '#888'; }
function drawProfile() {
  const wrap = canvas.parentElement;
  const W = wrap.clientWidth, H = wrap.clientHeight;
  if (!W || !H) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const note = $('profileNote'), noteText = $('profileNoteText'), btn = $('btnEle');
  const prof = stats.prof;
  if (stats.n < 2) { note.hidden = false; noteText.textContent = t('profile.empty'); btn.hidden = true; return; }
  if (prof.length < 2) { note.hidden = false; noteText.textContent = eleBusy ? t('profile.loading') : t('profile.noele'); btn.hidden = eleBusy || !navigator.onLine; return; }
  note.hidden = true;
  const padL = 38, padR = 10, padT = 10, padB = 18;
  const w = W - padL - padR, h = H - padT - padB;
  const dMax = prof[prof.length - 1].d || 1;
  let eMin = Infinity, eMax = -Infinity;
  prof.forEach((p) => { if (p.e < eMin) eMin = p.e; if (p.e > eMax) eMax = p.e; });
  const span = Math.max(eMax - eMin, 50);
  eMin = Math.floor((eMin - span * 0.08) / 10) * 10; eMax = Math.ceil((eMax + span * 0.08) / 10) * 10;
  const X = (d) => padL + (d / dMax) * w, Y = (e) => padT + (1 - (e - eMin) / (eMax - eMin)) * h;
  const fg = cssVar('--fg'), muted = cssVar('--muted'), line = cssVar('--line'), green = cssVar('--green');
  // grid + y labels (3 steps)
  ctx.font = '500 10px ' + cssVar('--font-ui'); ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  const stepE = niceStep((eMax - eMin) / 3);
  for (let e = Math.ceil(eMin / stepE) * stepE; e <= eMax; e += stepE) {
    const y = Y(e);
    ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillStyle = muted; ctx.fillText(String(e), padL - 5, y);
  }
  // x labels
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  const stepD = niceStep(dMax / 1000 / 5) * 1000;
  for (let d = 0; d <= dMax + 1; d += stepD) { ctx.fillStyle = muted; ctx.fillText((d / 1000).toFixed(stepD < 1000 ? 1 : 0), X(Math.min(d, dMax)), padT + h + 4); }
  // area + line
  ctx.beginPath(); ctx.moveTo(X(prof[0].d), Y(prof[0].e));
  prof.forEach((p) => ctx.lineTo(X(p.d), Y(p.e)));
  ctx.lineTo(X(prof[prof.length - 1].d), padT + h); ctx.lineTo(X(prof[0].d), padT + h); ctx.closePath();
  ctx.fillStyle = green; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1;
  ctx.beginPath(); prof.forEach((p, i) => (i ? ctx.lineTo(X(p.d), Y(p.e)) : ctx.moveTo(X(p.d), Y(p.e))));
  ctx.strokeStyle = green; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
  // hover
  if (hoverIdx >= 0 && hoverIdx < prof.length) {
    const p = prof[hoverIdx], x = X(p.d), y = Y(p.e);
    ctx.strokeStyle = fg; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + h); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = cssVar('--surface'); ctx.lineWidth = 2; ctx.stroke();
    const label = `${(p.d / 1000).toFixed(2)} ${t('unit.km')} · ${p.e} ${t('unit.m')}`;
    ctx.font = '600 12px ' + cssVar('--font-num');
    const tw = ctx.measureText(label).width + 12, bx = Math.min(Math.max(x - tw / 2, padL), W - padR - tw), by = padT;
    ctx.fillStyle = fg; roundRect(ctx, bx, by, tw, 20, 6); ctx.fill();
    ctx.fillStyle = cssVar('--bg'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, bx + tw / 2, by + 10);
  }
}
function niceStep(raw) { const p = 10 ** Math.floor(Math.log10(raw || 1)); const m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function profileHover(ev) {
  const prof = stats.prof; if (prof.length < 2) return;
  const rect = canvas.getBoundingClientRect(); const x = ev.clientX - rect.left;
  const padL = 38, padR = 10, w = rect.width - padL - padR;
  const d = Math.max(0, Math.min(1, (x - padL) / w)) * prof[prof.length - 1].d;
  let lo = 0, hi = prof.length - 1; // binary search by distance
  while (lo < hi) { const mid = (lo + hi) >> 1; if (prof[mid].d < d) lo = mid + 1; else hi = mid; }
  hoverIdx = lo; drawProfile();
  const pt = pointAtDistance(prof[lo].d);
  if (pt) { hoverDot.setLatLng(pt); if (!map.hasLayer(hoverDot)) hoverDot.addTo(map); }
}
function profileLeave() { hoverIdx = -1; drawProfile(); if (map.hasLayer(hoverDot)) map.removeLayer(hoverDot); }
canvas.addEventListener('pointermove', profileHover); canvas.addEventListener('pointerdown', profileHover);
canvas.addEventListener('pointerleave', profileLeave); canvas.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') setTimeout(profileLeave, 1200); });
function pointAtDistance(target) {
  const pts = track(); let d = 0;
  for (let i = 1; i < pts.length; i++) { const s = haversine(pts[i - 1], pts[i]); if (d + s >= target) { const f = s ? (target - d) / s : 0; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; } d += s; }
  return pts.length ? [pts[pts.length - 1][0], pts[pts.length - 1][1]] : null;
}
new ResizeObserver(() => drawProfile()).observe(canvas.parentElement);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => drawProfile());
new MutationObserver(() => drawProfile()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
$('btnEle').onclick = () => fillElevation().then(afterRouteChange);

/* sheet collapse */
const sheet = $('sheet');
function setSheet(open) { sheet.classList.toggle('collapsed', !open); settings.sheet = open ? 'open' : 'closed'; saveSettings(); if (open) requestAnimationFrame(drawProfile); }
$('sheetToggle').onclick = () => setSheet(sheet.classList.contains('collapsed'));
setSheet(settings.sheet !== 'closed');

/* ------------------------------------------------------------------ storage */
const DB_NAME = 'szlakownik', STORE = 'routes';
function idb() {
  return new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('no idb'));
    const rq = indexedDB.open(DB_NAME, 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore(STORE, { keyPath: 'id' });
    rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
  });
}
async function dbAll() {
  try { const db = await idb(); return await new Promise((res, rej) => { const rq = db.transaction(STORE).objectStore(STORE).getAll(); rq.onsuccess = () => res(rq.result || []); rq.onerror = () => rej(rq.error); }); }
  catch (e) { try { return JSON.parse(localStorage.getItem('szlakownik.routes') || '[]'); } catch (e2) { return []; } }
}
async function dbPut(r) {
  try { const db = await idb(); await new Promise((res, rej) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(r); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
  catch (e) { const all = (await dbAll()).filter((x) => x.id !== r.id); all.push(r); try { localStorage.setItem('szlakownik.routes', JSON.stringify(all)); } catch (e2) { /* full */ } }
}
async function dbDel(id) {
  try { const db = await idb(); await new Promise((res, rej) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
  catch (e) { const all = (await dbAll()).filter((x) => x.id !== id); try { localStorage.setItem('szlakownik.routes', JSON.stringify(all)); } catch (e2) { /* ignore */ } }
}
let savedRoutes = [];
async function loadRouteList() { savedRoutes = (await dbAll()).sort((a, b) => (b.updated || 0) - (a.updated || 0)); renderRouteList(); }
function renderRouteList() {
  const list = $('routeList'); list.innerHTML = '';
  $('routesEmpty').hidden = savedRoutes.length > 0;
  savedRoutes.forEach((r) => {
    const el = document.createElement('div'); el.className = 'route-item' + (r.id === route.id ? ' current' : '');
    const km = (r.stats && r.stats.dist / 1000) || 0;
    el.innerHTML = `<div class="info"><div class="name"></div><div class="meta">${km.toFixed(1)} ${t('unit.km')} · ↑${r.stats ? r.stats.up : '—'} ${t('unit.m')} · ${new Date(r.updated || 0).toLocaleDateString()}</div></div>
      <div class="acts"><button data-act="open" title="${t('routes.load')}"><svg class="i"><use href="#i-open"/></svg></button><button data-act="gpx" title="GPX"><svg class="i"><use href="#i-download"/></svg></button><button data-act="del" title="${t('routes.delete')}"><svg class="i"><use href="#i-trash"/></svg></button></div>`;
    el.querySelector('.name').textContent = r.name;
    el.querySelector('[data-act=open]').onclick = () => { openRoute(r); closePanel(); };
    el.querySelector('[data-act=gpx]').onclick = () => exportGpx(r);
    el.querySelector('[data-act=del]').onclick = async () => { await dbDel(r.id); if (route.id === r.id) route.id = null; await loadRouteList(); toast(t('deleted'), 1400); };
    list.appendChild(el);
  });
}
function openRoute(r) {
  undoStack.length = 0; $('btnUndo').disabled = true; legToken++;
  route = { id: r.id, name: r.name, waypoints: JSON.parse(JSON.stringify(r.waypoints)), legs: JSON.parse(JSON.stringify(r.legs)) };
  renderRoute(); afterRouteChange(); renderRouteList();
  const pts = track(); if (pts.length) map.fitBounds(L.latLngBounds(pts.map((p) => [p[0], p[1]])), { padding: [40, 40] });
}
$('btnSave').onclick = () => { $('saveName').value = route.name || `${t('route.untitled')} ${new Date().toLocaleDateString()}`; $('modalSave').hidden = false; setTimeout(() => $('saveName').select(), 50); };
$('saveCancel').onclick = () => { $('modalSave').hidden = true; };
$('saveOk').onclick = async () => {
  const name = $('saveName').value.trim() || t('route.untitled');
  route.name = name; if (!route.id) route.id = 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  await dbPut({ id: route.id, name, waypoints: route.waypoints, legs: route.legs.filter(Boolean).map((l) => ({ mode: l.mode, coords: l.coords })), stats: { dist: stats.dist, up: stats.up, down: stats.down }, updated: Date.now() });
  $('modalSave').hidden = true; await loadRouteList(); toast(t('saved'), 1400);
};
$('saveName').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('saveOk').click(); });
$('btnNewRoute').onclick = () => { clearRoute(true); undoStack.length = 0; $('btnUndo').disabled = true; closePanel(); setDrawing(true); };
loadRouteList();

/* --------------------------------------------------------------------- GPX */
function esc(s) { return String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])); }
function toGpx(r) {
  const legs = (r.legs || []).filter(Boolean);
  const pts = []; legs.forEach((leg) => leg.coords.forEach((c, j) => { if (pts.length && j === 0) return; pts.push(c); }));
  const name = r.name || t('route.untitled');
  const trk = pts.map((c) => `      <trkpt lat="${c[0].toFixed(6)}" lon="${c[1].toFixed(6)}">${c[2] != null ? `<ele>${c[2]}</ele>` : ''}</trkpt>`).join('\n');
  const wpts = (r.waypoints || []).map((p, i) => `  <wpt lat="${p[0].toFixed(6)}" lon="${p[1].toFixed(6)}"><name>${i + 1}</name></wpt>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Szlakownik" xmlns="http://www.topografix.com/GPX/1/1">\n  <metadata><name>${esc(name)}</name><time>${new Date().toISOString()}</time></metadata>\n${wpts}\n  <trk><name>${esc(name)}</name><trkseg>\n${trk}\n  </trkseg></trk>\n</gpx>\n`;
}
function exportGpx(r) {
  const gpx = toGpx(r || route);
  const fname = ((r || route).name || t('route.untitled')).replace(/[^\p{L}\p{N}_-]+/gu, '_') + '.gpx';
  const blob = new Blob([gpx], { type: 'application/gpx+xml' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
}
$('btnExport').onclick = () => exportGpx();
function parseGpx(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('bad xml');
  let pts = [...doc.querySelectorAll('trkpt')];
  if (!pts.length) pts = [...doc.querySelectorAll('rtept')];
  if (pts.length < 2) throw new Error('no points');
  const coords = pts.map((p) => { const e = p.querySelector('ele'); const ev = e ? parseFloat(e.textContent) : NaN; return [parseFloat(p.getAttribute('lat')), parseFloat(p.getAttribute('lon')), isFinite(ev) ? Math.round(ev) : null]; }).filter((c) => isFinite(c[0]) && isFinite(c[1]));
  const nameEl = doc.querySelector('trk > name, rte > name, metadata > name');
  return { name: nameEl ? nameEl.textContent.trim() : '', coords };
}
$('btnImport').onclick = () => $('fileGpx').click();
$('fileGpx').onchange = async (e) => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try {
    const { name, coords } = parseGpx(await f.text());
    undoStack.length = 0; $('btnUndo').disabled = true; legToken++;
    route = { id: null, name: name || f.name.replace(/\.gpx$/i, ''), waypoints: [[coords[0][0], coords[0][1]], [coords[coords.length - 1][0], coords[coords.length - 1][1]]], legs: [{ mode: 'fixed', coords }] };
    renderRoute(); afterRouteChange(); renderRouteList(); closePanel();
    map.fitBounds(L.latLngBounds(coords.map((p) => [p[0], p[1]])), { padding: [40, 40] });
    toast(t('gpx.imported', { name: route.name }));
  } catch (err) { toast(t('gpx.badfile')); }
};

/* --------------------------------------------------------------------- GPS */
let gpsWatch = null, gpsFollow = false, gpsMarker = null, gpsCircle = null, gpsHadFix = false;
function stopGps() { if (gpsWatch != null) navigator.geolocation.clearWatch(gpsWatch); gpsWatch = null; gpsFollow = false; gpsHadFix = false; if (gpsMarker) map.removeLayer(gpsMarker); if (gpsCircle) map.removeLayer(gpsCircle); gpsMarker = gpsCircle = null; $('btnLocate').className = 'ibtn'; }
$('btnLocate').onclick = () => {
  if (!navigator.geolocation) { toast(t('gps.unavailable')); return; }
  if (gpsWatch == null) {
    gpsFollow = true; $('btnLocate').className = 'ibtn follow';
    gpsWatch = navigator.geolocation.watchPosition((pos) => {
      const ll = [pos.coords.latitude, pos.coords.longitude];
      if (!gpsMarker) { gpsMarker = L.marker(ll, { icon: L.divIcon({ className: '', html: '<div class="gps-dot"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }), interactive: false, zIndexOffset: 1100 }).addTo(map); gpsCircle = L.circle(ll, { radius: pos.coords.accuracy || 0, color: '#2a6fa8', weight: 1, fillOpacity: 0.08, interactive: false }).addTo(map); }
      gpsMarker.setLatLng(ll); gpsCircle.setLatLng(ll).setRadius(pos.coords.accuracy || 0);
      if (gpsFollow) { if (!gpsHadFix) map.setView(ll, Math.max(map.getZoom(), 15)); else map.panTo(ll); }
      gpsHadFix = true;
    }, (err) => { stopGps(); toast(err.code === 1 ? t('gps.denied') : t('gps.unavailable')); }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
    toast(t('gps.follow'), 1500);
  } else if (!gpsFollow) { gpsFollow = true; $('btnLocate').className = 'ibtn follow'; if (gpsMarker) map.panTo(gpsMarker.getLatLng()); }
  else stopGps();
};
map.on('dragstart', () => { if (gpsFollow) { gpsFollow = false; $('btnLocate').className = 'ibtn on'; } });

/* ----------------------------------------------------------------- offline */
let dlArea = 'view', dlAbort = null;
$('areaSeg').querySelectorAll('button').forEach((b) => { b.onclick = () => { dlArea = b.dataset.area; $('areaSeg').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); updateEstimate(); }; });
$('zoomMax').onchange = updateEstimate;
function activeSources() { const s = [settings.base]; if (settings.hiking) s.push('hiking'); if (settings.cycling) s.push('cycling'); return s; }
function tileSet() {
  const zMax = +$('zoomMax').value, zMin = Math.min(Math.max(8, Math.floor(map.getZoom())), zMax);
  const tiles = new Set();
  if (dlArea === 'view') {
    const b = map.getBounds();
    for (let z = zMin; z <= zMax; z++) {
      const x0 = lon2tile(b.getWest(), z), x1 = lon2tile(b.getEast(), z), y0 = lat2tile(b.getNorth(), z), y1 = lat2tile(b.getSouth(), z);
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) tiles.add(`${z}/${x}/${y}`);
      if (tiles.size > 20000) break;
    }
  } else {
    const pts = track(); if (pts.length < 2) return tiles;
    const samp = []; let acc = 0; pts.forEach((p, i) => { if (i === 0) { samp.push(p); return; } acc += haversine(pts[i - 1], p); if (acc >= 150) { samp.push(p); acc = 0; } }); samp.push(pts[pts.length - 1]);
    for (let z = zMin; z <= zMax; z++) {
      const tileM = 40075016 * Math.cos(samp[0][0] * Math.PI / 180) / 2 ** z, n = Math.ceil(1000 / tileM);
      samp.forEach((p) => { const cx = lon2tile(p[1], z), cy = lat2tile(p[0], z); for (let x = cx - n; x <= cx + n; x++) for (let y = cy - n; y <= cy + n; y++) tiles.add(`${z}/${x}/${y}`); });
      if (tiles.size > 20000) break;
    }
  }
  return tiles;
}
function updateEstimate() {
  if (!openPanel || openPanel.id !== 'panelOffline') return;
  const tiles = tileSet(), srcs = activeSources();
  const n = tiles.size * srcs.length;
  const mb = tiles.size * srcs.reduce((a, k) => a + SOURCES[k].kb, 0) / 1024;
  $('estimate').textContent = dlArea === 'route' && !tiles.size ? t('offline.noroute') : t('offline.estimate', { n, mb: mb < 10 ? mb.toFixed(1) : Math.round(mb) });
  const tooMany = n > 6000;
  const blocked = srcs.map((k) => hostOf(SOURCES[k].url.replace('{s}', 'a'))).filter((h) => corsBlocked.has(h));
  $('dlWarn').textContent = tooMany ? t('offline.toomany') : blocked.map((h) => t('offline.nocors', { host: h })).join(' · ');
  $('btnDownload').disabled = tooMany || n === 0 || !tileCache || !!dlAbort;
}
async function refreshOfflinePanel() {
  await openTileCache();
  $('offlineUnavailable').hidden = !!tileCache;
  updateEstimate(); refreshCacheStats();
}
async function refreshCacheStats() {
  if (!tileCache) { $('cacheStats').textContent = '—'; return; }
  try {
    const keys = await tileCache.keys();
    let mb = '?';
    if (navigator.storage && navigator.storage.estimate) { const est = await navigator.storage.estimate(); mb = ((est.usage || 0) / 1048576).toFixed(1); }
    $('cacheStats').textContent = t('offline.cache', { n: keys.length, mb });
  } catch (e) { $('cacheStats').textContent = '—'; }
}
$('btnClearCache').onclick = async () => { try { await caches.delete(TILE_CACHE); tileCache = null; await openTileCache(); } catch (e) { /* ignore */ } refreshCacheStats(); };
$('btnDlCancel').onclick = () => { if (dlAbort) dlAbort.abort(); };
$('btnDownload').onclick = async () => {
  if (!tileCache) return;
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* ignore */ }
  const tiles = [...tileSet()], srcs = activeSources();
  const jobs = [];
  srcs.forEach((k) => { const s = SOURCES[k]; tiles.forEach((key) => { const [z, x, y] = key.split('/').map(Number); if (z <= s.maxNative) jobs.push(tileUrl(s.url, s.subdomains, x, y, z)); }); });
  const total = jobs.length; let done = 0, saved = 0, failed = 0;
  dlAbort = new AbortController();
  $('dlProgress').hidden = false; $('btnDlCancel').hidden = false; $('btnDownload').disabled = true;
  const bar = $('dlProgress').firstElementChild;
  const tick = () => { bar.style.width = (done / total * 100).toFixed(1) + '%'; $('dlStatus').textContent = t('offline.progress', { done, n: total }) + (failed ? ` · ✕${failed}` : ''); };
  const worker = async () => {
    while (jobs.length && !dlAbort.signal.aborted) {
      const url = jobs.pop();
      try {
        if (corsBlocked.has(hostOf(url))) throw new Error('nocors');
        if (!(await tileCache.match(url))) { await fetchTile(url, true, dlAbort.signal); saved++; }
      } catch (e) { if (dlAbort.signal.aborted) break; failed++; }
      done++; if (done % 5 === 0) tick();
    }
  };
  await Promise.all([0, 1, 2, 3].map(worker));
  tick();
  const aborted = dlAbort.signal.aborted; dlAbort = null;
  $('btnDlCancel').hidden = true; $('dlProgress').hidden = true; bar.style.width = '0';
  $('dlStatus').textContent = aborted ? '' : t('offline.done', { n: saved }) + (failed ? ` · ✕${failed}` : '');
  updateEstimate(); refreshCacheStats();
};

/* ---------------------------------------------------------------- settings UI */
$('setFlat').value = settings.flat; $('setUp').value = settings.up; $('setDown').value = settings.down; $('selProfile').value = settings.profile; $('setCacheViewed').checked = settings.cacheViewed;
$('setFlat').onchange = (e) => { settings.flat = Math.max(1, +e.target.value || 4); saveSettings(); renderStats(); };
$('setUp').onchange = (e) => { settings.up = Math.max(50, +e.target.value || 300); saveSettings(); renderStats(); };
$('setDown').onchange = (e) => { settings.down = Math.max(50, +e.target.value || 500); saveSettings(); renderStats(); };
$('selProfile').onchange = (e) => { settings.profile = e.target.value; saveSettings(); };
$('setCacheViewed').onchange = (e) => { settings.cacheViewed = e.target.checked; saveSettings(); };
$('selLang').onchange = (e) => { LANG = e.target.value; settings.lang = LANG; saveSettings(); applyI18n(); };
$('btnLayers').onclick = () => showPanel('panelLayers');
$('btnOffline').onclick = () => showPanel('panelOffline');
$('btnRoutes').onclick = () => showPanel('panelRoutes');
$('btnSettings').onclick = () => showPanel('panelSettings');
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePanel(); $('modalSave').hidden = true; } });

/* ------------------------------------------------------------------ network */
function netState() { $('netpill').hidden = navigator.onLine; }
window.addEventListener('online', () => { netState(); if (stats.n > 1 && !stats.hasEle) fillElevation().then(afterRouteChange); });
window.addEventListener('offline', netState);
netState();

/* ----------------------------------------------------------- service worker */
if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => { const nw = reg.installing; nw && nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) toast(t('sw.updated'), 5000); }); });
    }).catch(() => { /* not available here */ });
  });
}

applyI18n();
renderRoute(); renderStats(); drawProfile();
})();
