// ---------- Seed data (used only the very first time the app runs) ----------
const seedCollection = [
  { id: "c1", title: "Dune", originalTitle: "Dune", year: 2021, editor: "Warner Bros", support: "Blu-ray 4K", editionType: "Steelbook", languages: ["VF", "VOSTFR"], genre: "Science-fiction", price: 34.99, date: "2024-03-12", photo: null, poster: null, tmdbId: null, note: "Édition boîtier collector" },
  { id: "c2", title: "John Wick : Chapitre 4", originalTitle: "John Wick: Chapter 4", year: 2023, editor: "Lionsgate", support: "Blu-ray 4K", editionType: "Steelbook", languages: ["VF", "VOSTFR"], genre: "Action", price: 29.99, date: "2024-06-02", photo: null, poster: null, tmdbId: null, note: "" },
  { id: "c3", title: "Alien", originalTitle: "Alien", year: 1979, editor: "20th Century", support: "Blu-ray 4K", editionType: "Steelbook", languages: ["VF", "VOSTFR", "VO"], genre: "Horreur", price: 27.5, date: "2023-11-20", photo: null, poster: null, tmdbId: null, note: "Restauration 4K" },
  { id: "c4", title: "Blade Runner 2049", originalTitle: "Blade Runner 2049", year: 2017, editor: "Warner Bros", support: "Blu-ray 4K", editionType: "Classique", languages: ["VF", "VOSTFR"], genre: "Science-fiction", price: 24.99, date: "2024-01-08", photo: null, poster: null, tmdbId: null, note: "" },
  { id: "c5", title: "Oppenheimer", originalTitle: "Oppenheimer", year: 2023, editor: "Universal", support: "Blu-ray 4K", editionType: "Collector", languages: ["VF", "VOSTFR"], genre: "Drame", price: 32.0, date: "2024-04-15", photo: null, poster: null, tmdbId: null, note: "IMAX Enhanced" },
  { id: "c6", title: "Mad Max: Fury Road", originalTitle: "Mad Max: Fury Road", year: 2015, editor: "Warner Bros", support: "Blu-ray", editionType: "Classique", languages: ["VF", "VOSTFR"], genre: "Action", price: 19.99, date: "2023-09-30", photo: null, poster: null, tmdbId: null, note: "" },
];

const seedWishlist = [
  { id: "w1", title: "Dune : Deuxième Partie", originalTitle: "Dune: Part Two", year: 2024, editor: "Warner Bros", support: "Blu-ray 4K", editionType: "Steelbook", languages: ["VF", "VOSTFR"], priority: "Haute", steelbookStatus: "Oui", poster: null, tmdbId: null },
  { id: "w2", title: "The Batman", originalTitle: "The Batman", year: 2022, editor: "Warner Bros", support: "Blu-ray 4K", editionType: "Steelbook", languages: ["VF", "VOSTFR"], priority: "Moyenne", steelbookStatus: "Oui", poster: null, tmdbId: null },
  { id: "w3", title: "Le Parrain", originalTitle: "The Godfather", year: 1972, editor: "Paramount", support: "Blu-ray 4K", editionType: "Collector", languages: ["VF", "VOSTFR"], priority: "Haute", steelbookStatus: "En cours", poster: null, tmdbId: null },
];

const seedAlerts = [
  { id: "a1", kind: "sortie", title: "Interstellar — édition steelbook 10e anniversaire", source: "4k-ultra-hd.fr", date: "2026-09-18", detail: "Nouveau steelbook 4K UHD annoncé, sortie prévue le 18/09." },
  { id: "a2", kind: "solde", title: "Alien : -30% chez Steelbook Pro", source: "steelbookpro.fr", date: "2026-09-03", detail: "Le steelbook que vous possédez déjà baisse de prix ailleurs." },
  { id: "a3", kind: "solde", title: "Blade Runner 2049 en promotion", source: "steelbookpro.fr", date: "2026-09-05", detail: "-8€ sur l'édition 4K UHD + Blu-ray, stock limité." },
  { id: "a4", kind: "sortie", title: "Dune : Deuxième Partie — steelbook Zavvi", source: "4k-ultra-hd.fr", date: "2026-09-24", detail: "Ce film est dans votre liste d'envie. Précommande ouverte." },
  { id: "a5", kind: "sortie", title: "Le Parrain, trilogie — coffret steelbook", source: "4k-ultra-hd.fr", date: "2026-10-02", detail: "Ce film est dans votre liste d'envie." },
  { id: "a6", kind: "solde", title: "Oppenheimer steelbook à -22%", source: "dealabs.com", date: "2026-09-02", detail: "Bon plan repéré par la communauté Dealabs." },
  { id: "a7", kind: "solde", title: "The Batman en précommande à prix cassé", source: "dealabs.com", date: "2026-09-06", detail: "Ce film est dans votre liste d'envie — deal Dealabs." },
];

const SUPPORTS = ["Tous", "DVD", "Blu-ray", "Blu-ray 4K"];
const EDITIONS = ["Tous", "Classique", "Collector", "Steelbook"];
const LANGUAGES = ["VF", "VOSTFR", "VO", "Anglais", "Autre"];
const GENRES = ["Tous", "Action", "Science-fiction", "Horreur", "Drame", "Animation", "Aventure", "Fantastique"];
const PRIORITIES = ["Toutes", "Haute", "Moyenne", "Basse"];
const STEELBOOK_STATUS = ["En cours", "Oui", "Non"];
const ALERT_KINDS = [
  { value: "Toutes", label: "Toutes" },
  { value: "sortie", label: "Sorties" },
  { value: "solde", label: "Bons plans" },
];

// ---------- App state ----------
const state = {
  tab: "collection",
  collection: [],
  wishlist: [],
  alerts: [],
  dismissedIds: new Set(),

  query: "",
  supportFilter: "Tous",
  editionFilter: "Tous",
  genreFilter: "Tous",
  showFilters: false,

  wishQuery: "",
  priorityFilter: "Toutes",
  showWishFilters: false,

  alertQuery: "",
  alertKindFilter: "Toutes",
};

const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const formatDate = (iso) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

// ---------- Init ----------
async function init() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  startClock();

  state.collection = await DB.seedIfEmpty("collection", seedCollection);
  state.wishlist = await DB.seedIfEmpty("wishlist", seedWishlist);
  state.dismissedIds = new Set((await DB.getAll("dismissed")).map((d) => d.id));

  const cachedAlerts = await DB.getAll("alerts");
  const base = cachedAlerts.length > 0 ? cachedAlerts : seedAlerts;
  state.alerts = base.filter((a) => !state.dismissedIds.has(a.id));
  state.alertsSource = cachedAlerts.length > 0 ? "cached" : "demo";

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => { state.tab = btn.dataset.tab; render(); });
  });
  document.getElementById("fab-add").addEventListener("click", onFabClick);
  document.getElementById("content").addEventListener("click", onContentClick);
  document.getElementById("content").addEventListener("input", onContentInput);

  render();
  refreshAlertsFeed();
}

async function refreshAlertsFeed() {
  const url = window.CONFIG?.ALERTS_FEED_URL;
  if (!url) return;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const alerts = Array.isArray(data.alerts) ? data.alerts : [];
    if (alerts.length === 0) return;
    await DB.replaceAll("alerts", alerts);
    state.alerts = alerts.filter((a) => !state.dismissedIds.has(a.id));
    state.alertsSource = "live";
    state.alertsUpdatedAt = data.updatedAt || null;
    if (state.tab === "alerts") render();
  } catch (err) {
    console.warn("Flux d'alertes indisponible :", err.message);
    if (state.tab === "alerts") render();
  }
}

function startClock() {
  const el = document.getElementById("clock");
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };
  tick();
  setInterval(tick, 30000);
}

function showSaved() {
  const el = document.getElementById("save-indicator");
  el.textContent = "✓ Sauvegardé";
  el.classList.add("saved");
  clearTimeout(showSaved._t);
  showSaved._t = setTimeout(() => { el.textContent = ""; el.classList.remove("saved"); }, 1500);
}

// ---------- Render dispatch ----------
function render() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === state.tab);
  });
  document.getElementById("fab-add").classList.toggle("hidden", state.tab === "alerts");
  const badge = document.getElementById("alerts-badge");
  if (state.alerts.length) { badge.textContent = state.alerts.length; badge.classList.add("show"); }
  else badge.classList.remove("show");

  const content = document.getElementById("content");
  if (state.tab === "collection") content.innerHTML = renderCollection();
  else if (state.tab === "wishlist") content.innerHTML = renderWishlist();
  else content.innerHTML = renderAlerts();
}

// ---------- Collection tab ----------
function filteredCollection() {
  return state.collection.filter((it) => {
    const q = it.title.toLowerCase().includes(state.query.toLowerCase());
    const s = state.supportFilter === "Tous" || it.support === state.supportFilter;
    const ed = state.editionFilter === "Tous" || it.editionType === state.editionFilter;
    const g = state.genreFilter === "Tous" || it.genre === state.genreFilter;
    return q && s && ed && g;
  });
}

function coverHTML(item, small) {
  const img = item.poster || item.photo;
  const inner = img
    ? `<img src="${img}" alt="" />`
    : `<div class="cover-empty">
         <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
         <span>${esc(item.title)}</span>
       </div>`;
  return `<div class="cover${small ? " small" : ""}">
      ${inner}
      <div class="cover-sheen"></div>
    </div>`;
}

function badgeSupport(support) {
  const cls = support === "Blu-ray 4K" ? "uhd" : support === "Blu-ray" ? "bd" : "dvd";
  return `<span class="badge-format ${cls}">${esc(support)}</span>`;
}

function badgeEdition(editionType) {
  if (!editionType || editionType === "Classique") return "";
  const cls = editionType === "Steelbook" ? "steelbook" : "collector";
  return `<span class="badge-edition ${cls}">${esc(editionType)}</span>`;
}

function badgeStatus(status) {
  if (!status) return "";
  const cls = status === "Oui" ? "yes" : status === "En cours" ? "pending" : "no";
  return `<span class="badge-status ${cls}">${status === "Oui" ? "✓ Steelbook" : status === "En cours" ? "⏳ En cours" : "Pas de steelbook"}</span>`;
}

function chipsHTML(name, options, current) {
  return options.map((opt) =>
    `<button class="chip ${opt === current ? "active" : ""}" data-chip="${name}" data-value="${esc(opt)}">${esc(opt)}</button>`
  ).join("");
}

function renderCollection() {
  const items = filteredCollection();
  return `
    <div style="display:flex;align-items:baseline;justify-content:space-between;">
      <h1 class="page-title display">Ma collection</h1>
      <span style="color:var(--text-dim);font-size:13px;">${state.collection.length} boîtiers</span>
    </div>
    <p class="page-sub">Vos éditions physiques, réunies en un seul endroit.</p>

    <div class="search-row">
      <div class="search-box">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input id="search-input" placeholder="Rechercher un film…" value="${esc(state.query)}" />
      </div>
      <button class="icon-btn ${state.showFilters ? "on" : ""}" id="toggle-filters">
        <svg class="icon" viewBox="0 0 24 24" width="17" height="17"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
      </button>
    </div>

    ${state.showFilters ? `
      <div class="filter-panel">
        <div class="filter-group">
          <div class="filter-label">Support</div>
          <div class="chip-row">${chipsHTML("support", SUPPORTS, state.supportFilter)}</div>
        </div>
        <div class="filter-group">
          <div class="filter-label">Type de boîtier</div>
          <div class="chip-row">${chipsHTML("edition", EDITIONS, state.editionFilter)}</div>
        </div>
        <div class="filter-group">
          <div class="filter-label">Genre</div>
          <div class="chip-row">${chipsHTML("genre", GENRES, state.genreFilter)}</div>
        </div>
      </div>` : ""}

    ${items.length === 0 ? emptyState(
      `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>`,
      "Aucun steelbook ici",
      "Ajustez vos filtres, ou ajoutez un nouveau titre à votre collection."
    ) : `
      <div class="grid">
        ${items.map((it) => `
          <div class="card" data-open="collection" data-id="${it.id}">
            ${coverHTML(it, false)}
            <div class="card-title">${esc(it.title)}</div>
            <div class="card-meta">
              <div style="display:flex;gap:4px;flex-wrap:wrap;">${badgeSupport(it.support)}${badgeEdition(it.editionType)}</div>
              <span style="font-size:12px;color:var(--text-dim);">${it.year || ""}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `}
  `;
}

// ---------- Wishlist tab ----------
function filteredWishlist() {
  return state.wishlist.filter((it) => {
    const q = it.title.toLowerCase().includes(state.wishQuery.toLowerCase());
    const p = state.priorityFilter === "Toutes" || it.priority === state.priorityFilter;
    return q && p;
  });
}

function renderWishlist() {
  const items = filteredWishlist();
  return `
    <div style="display:flex;align-items:baseline;justify-content:space-between;">
      <h1 class="page-title display">Liste d'envie</h1>
      <div style="display:flex;gap:10px;">
        <button class="text-link-btn" id="retranslate-titles">Traduire en FR</button>
        <button class="text-link-btn" id="import-letterboxd">Importer Letterboxd</button>
      </div>
    </div>
    <p class="page-sub">Recherchez n'importe quel titre via TMDb, ou importez votre watchlist.</p>

    <div class="search-row">
      <div class="search-box">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input id="wish-search-input" placeholder="Rechercher un film…" value="${esc(state.wishQuery)}" />
      </div>
      <button class="icon-btn ${state.showWishFilters ? "on" : ""}" id="toggle-wish-filters">
        <svg class="icon" viewBox="0 0 24 24" width="17" height="17"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
      </button>
    </div>

    ${state.showWishFilters ? `
      <div class="filter-panel">
        <div class="filter-group">
          <div class="filter-label">Priorité</div>
          <div class="chip-row">${chipsHTML("priority", PRIORITIES, state.priorityFilter)}</div>
        </div>
      </div>` : ""}

    ${items.length === 0 ? emptyState(
      `<path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1.2 5.5 3.5C14 6.2 15.5 5 17.5 5 21 5 23.5 8.5 21.5 12.5 19 16.65 12 21 12 21z"/>`,
      "Rien à afficher",
      "Ajustez vos filtres, ou ajoutez un film que vous rêvez de posséder."
    ) : items.map((it) => `
      <div class="row-card" data-open="wishlist" data-id="${it.id}">
        ${coverHTML(it, true)}
        <div style="flex:1;min-width:0;">
          <div class="card-title">${esc(it.title)}</div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:2px;">${esc(it.editor || "")} · ${it.year || ""}</div>
          <div style="display:flex;gap:4px;margin-top:6px;align-items:center;flex-wrap:wrap;">
            ${badgeSupport(it.support)}${badgeEdition(it.editionType)}
            <span class="priority ${it.priority === "Haute" ? "high" : "low"}">★ ${esc(it.priority)}</span>
          </div>
          <div style="margin-top:6px;">${badgeStatus(it.steelbookStatus)}</div>
        </div>
      </div>
    `).join("")}
  `;
}

// ---------- Alerts tab ----------
function filteredAlerts() {
  return state.alerts.filter((a) => {
    const q = a.title.toLowerCase().includes(state.alertQuery.toLowerCase());
    const k = state.alertKindFilter === "Toutes" || a.kind === state.alertKindFilter;
    return q && k;
  });
}

function renderAlerts() {
  const statusText = {
    demo: "Exemple — connectez le scraper pour de vraies alertes (voir README).",
    cached: "Dernières alertes connues (hors-ligne ou pas encore actualisées).",
    live: state.alertsUpdatedAt
      ? `À jour — dernière vérification ${formatDate(state.alertsUpdatedAt.slice(0, 10))}.`
      : "À jour.",
  }[state.alertsSource] || "";

  const items = filteredAlerts();

  return `
    <div style="display:flex;align-items:baseline;justify-content:space-between;">
      <h1 class="page-title display">Alertes</h1>
      <button class="icon-btn" id="refresh-alerts" title="Actualiser">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16"><path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6"/></svg>
      </button>
    </div>
    <p class="note-box" style="margin-top:4px;">${esc(statusText)}</p>

    <div class="search-row">
      <div class="search-box">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input id="alert-search-input" placeholder="Rechercher une alerte…" value="${esc(state.alertQuery)}" />
      </div>
    </div>
    <div class="chip-row" style="margin:10px 0 6px;">
      ${ALERT_KINDS.map((k) =>
        `<button class="chip ${state.alertKindFilter === k.value ? "active" : ""}" data-chip="alertkind" data-value="${k.value}">${k.label}</button>`
      ).join("")}
    </div>

    ${items.length === 0 ? emptyState(
      `<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>`,
      "Rien à afficher",
      state.alerts.length === 0
        ? "Revenez plus tard, ou vérifiez que le scraper a bien tourné au moins une fois."
        : "Aucune alerte ne correspond à votre recherche."
    ) : items.map((a) => `
      <div class="alert-card">
        <div class="alert-icon ${a.kind}">
          ${a.kind === "solde"
            ? `<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="15" r="1.5"/><path d="M19 5L5 19"/></svg>`
            : `<svg class="icon" viewBox="0 0 24 24"><path d="M12 2l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 13.6 6.9 17.2l1.9-5.8L4 7.8h6.1z"/></svg>`}
        </div>
        <div style="flex:1;min-width:0;">
          <div class="alert-title">${esc(a.title)}</div>
          <div class="alert-detail">${esc(a.detail)}</div>
          <div class="alert-meta">
            <span>${esc(a.source)}</span><span>· ${formatDate(a.date)}</span>
            ${a.link ? `<a href="${esc(a.link)}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;">Voir →</a>` : ""}
          </div>
        </div>
        <button class="dismiss-btn" data-dismiss="${a.id}" title="Marquer comme vu">
          <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `).join("")}
  `;
}

async function dismissAlert(id) {
  state.dismissedIds.add(id);
  state.alerts = state.alerts.filter((a) => a.id !== id);
  await DB.put("dismissed", { id });
  render();
}

function emptyState(iconPath, title, text) {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24">${iconPath}</svg>
      <div class="empty-title">${esc(title)}</div>
      <div class="empty-text">${esc(text)}</div>
    </div>`;
}

// ---------- Event delegation ----------
function onContentClick(e) {
  const chip = e.target.closest("[data-chip]");
  if (chip) {
    const map = { support: "supportFilter", edition: "editionFilter", genre: "genreFilter", priority: "priorityFilter", alertkind: "alertKindFilter" };
    state[map[chip.dataset.chip]] = chip.dataset.value;
    render();
    return;
  }

  if (e.target.closest("#toggle-filters")) { state.showFilters = !state.showFilters; render(); return; }
  if (e.target.closest("#toggle-wish-filters")) { state.showWishFilters = !state.showWishFilters; render(); return; }
  if (e.target.closest("#import-letterboxd")) { openLetterboxdImportModal(); return; }
  if (e.target.closest("#retranslate-titles")) { retranslateTitles(); return; }

  const dismissBtn = e.target.closest("[data-dismiss]");
  if (dismissBtn) { dismissAlert(dismissBtn.dataset.dismiss); return; }

  const refreshBtn = e.target.closest("#refresh-alerts");
  if (refreshBtn) {
    refreshBtn.querySelector("svg").style.animation = "spin 0.7s linear infinite";
    refreshAlertsFeed().finally(() => {
      const el = document.getElementById("refresh-alerts");
      if (el) el.querySelector("svg").style.animation = "";
    });
    return;
  }

  const card = e.target.closest("[data-open]");
  if (card) {
    const kind = card.dataset.open;
    const id = card.dataset.id;
    const item = (kind === "collection" ? state.collection : state.wishlist).find((x) => x.id === id);
    if (item) openDetailModal(item, kind);
  }
}

function onContentInput(e) {
  if (e.target.id === "search-input" || e.target.id === "wish-search-input" || e.target.id === "alert-search-input") {
    const caret = e.target.selectionStart;
    if (e.target.id === "search-input") state.query = e.target.value;
    else if (e.target.id === "wish-search-input") state.wishQuery = e.target.value;
    else state.alertQuery = e.target.value;
    render();
    const input = document.getElementById(e.target.id);
    input.focus();
    input.setSelectionRange(caret, caret);
  }
}

function onFabClick() {
  if (state.tab === "collection") openAddCollectionModal();
  else if (state.tab === "wishlist") openAddWishlistModal();
}

// ---------- Modals ----------
function closeModal() { document.getElementById("modal-root").innerHTML = ""; }

function modalShell(title, bodyHTML) {
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="overlay" id="overlay">
      <div class="modal">
        <div class="modal-header">
          <span class="display">${esc(title)}</span>
          <button class="close-btn" id="modal-close">
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
      </div>
    </div>`;
  document.getElementById("overlay").addEventListener("click", (e) => { if (e.target.id === "overlay") closeModal(); });
  document.getElementById("modal-close").addEventListener("click", closeModal);
}

// ---- Reusable TMDb search block ----
function tmdbSearchBlockHTML() {
  if (!window.TMDb.ready()) {
    return `<div class="tmdb-warning">
      Recherche TMDb indisponible : ajoutez votre clé API gratuite dans <code>config.js</code>
      pour rechercher n'importe quel film du catalogue (voir README).
    </div>`;
  }
  return `
    <div class="field">
      <div class="field-label">Chercher un film (base TMDb — tous les films existants)</div>
      <div class="search-box" style="margin-bottom:8px;">
        <svg class="icon" viewBox="0 0 24 24" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input id="tmdb-query" placeholder="ex. Dune, Alien, The Batman…" />
      </div>
      <div id="tmdb-results"></div>
    </div>`;
}

function wireTmdbSearch(onPick) {
  const input = document.getElementById("tmdb-query");
  if (!input) return;
  let timer = null;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const q = input.value.trim();
      const resultsEl = document.getElementById("tmdb-results");
      if (q.length < 2) { resultsEl.innerHTML = ""; return; }
      resultsEl.innerHTML = `<div class="tmdb-loading">Recherche…</div>`;
      try {
        const results = await window.TMDb.search(q);
        resultsEl.innerHTML = results.slice(0, 8).map((m, i) => `
          <div class="tmdb-result" data-idx="${i}">
            <div class="tmdb-poster">${m.posterPath ? `<img src="${m.posterPath}" alt="" />` : ""}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:600;">${esc(m.title)}</div>
              <div style="font-size:11.5px;color:var(--text-dim);">${m.year || "—"}</div>
            </div>
          </div>`).join("") || `<div class="tmdb-loading">Aucun résultat.</div>`;
        resultsEl.querySelectorAll(".tmdb-result").forEach((el) => {
          el.addEventListener("click", () => onPick(results[Number(el.dataset.idx)]));
        });
      } catch (err) {
        resultsEl.innerHTML = `<div class="tmdb-loading">Recherche indisponible (hors-ligne ou clé API invalide).</div>`;
      }
    }, 350);
  });
}

function languageCheckboxesHTML(prefix, selected) {
  return LANGUAGES.map((lang) => `
    <label class="lang-check">
      <input type="checkbox" name="${prefix}-lang" value="${lang}" ${selected.includes(lang) ? "checked" : ""} />
      <span>${lang}</span>
    </label>`).join("");
}

function getCheckedLanguages(prefix) {
  return Array.from(document.querySelectorAll(`input[name="${prefix}-lang"]:checked`)).map((el) => el.value);
}

function selectOptionsHTML(options, current) {
  return options.map((o) => `<option ${o === current ? "selected" : ""}>${o}</option>`).join("");
}

// ---- Add / Edit collection ----
function openAddCollectionModal(existing = null) {
  const isEdit = Boolean(existing);
  let picked = {
    poster: existing?.poster || null,
    tmdbId: existing?.tmdbId || null,
    originalTitle: existing?.originalTitle || "",
  };
  const personalPhotoInitial = existing?.photo || null;
  const previewImg = personalPhotoInitial || picked.poster;

  modalShell(isEdit ? "Modifier le titre" : "Nouveau titre", `
    ${tmdbSearchBlockHTML()}

    <button class="photo-picker" id="photo-picker" ${personalPhotoInitial ? 'data-photo="' + esc(personalPhotoInitial) + '"' : ""}>
      ${previewImg ? `<img src="${previewImg}" alt="" />` : `
        <svg viewBox="0 0 24 24"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
        <span>Ou ajoutez votre propre photo</span>`}
    </button>
    <input type="file" id="photo-input" accept="image/*" style="display:none" />

    <div class="field"><div class="field-label">Titre du film</div><input id="f-title" placeholder="ex. Dune" value="${esc(existing?.title || "")}" /></div>
    <div class="field-row">
      <div class="field"><div class="field-label">Année</div><input id="f-year" placeholder="2021" value="${existing?.year ?? ""}" /></div>
      <div class="field"><div class="field-label">Prix (€)</div><input id="f-price" placeholder="29.99" value="${existing?.price || ""}" /></div>
    </div>
    <div class="field"><div class="field-label">Éditeur / distributeur</div><input id="f-editor" placeholder="ex. Warner Bros" value="${esc(existing?.editor || "")}" /></div>
    <div class="field-row">
      <div class="field"><div class="field-label">Support</div>
        <select id="f-support">${selectOptionsHTML(SUPPORTS.filter((s) => s !== "Tous"), existing?.support)}</select>
      </div>
      <div class="field"><div class="field-label">Type de boîtier</div>
        <select id="f-edition">${selectOptionsHTML(EDITIONS.filter((e) => e !== "Tous"), existing?.editionType)}</select>
      </div>
    </div>
    <div class="field"><div class="field-label">Genre</div>
      <select id="f-genre">${selectOptionsHTML(GENRES.filter((g) => g !== "Tous"), existing?.genre)}</select>
    </div>
    <div class="field">
      <div class="field-label">Langues disponibles</div>
      <div class="lang-row">${languageCheckboxesHTML("add", existing?.languages || ["VF", "VOSTFR"])}</div>
    </div>
    <div class="field"><div class="field-label">Note (optionnel)</div><input id="f-note" placeholder="ex. Édition exclusive Fnac" value="${esc(existing?.note || "")}" /></div>

    <div class="btn-row"><button class="btn-primary" id="save-collection">${isEdit ? "Enregistrer les modifications" : "Ajouter à ma collection"}</button></div>
  `);

  wireTmdbSearch(async (movie) => {
    document.getElementById("f-title").value = movie.title;
    if (movie.year) document.getElementById("f-year").value = movie.year;
    picked.tmdbId = movie.tmdbId;
    picked.originalTitle = movie.originalTitle;
    if (movie.posterPath) {
      picked.poster = await window.TMDb.fetchPoster(movie.posterPath);
      document.getElementById("photo-picker").innerHTML = `<img src="${picked.poster}" alt="" />`;
      document.getElementById("photo-picker").removeAttribute("data-photo");
    }
    document.getElementById("tmdb-results").innerHTML = "";
    document.getElementById("tmdb-query").value = movie.title;
  });

  document.getElementById("photo-picker").addEventListener("click", () => document.getElementById("photo-input").click());
  document.getElementById("photo-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("photo-picker").innerHTML = `<img src="${reader.result}" alt="" />`;
      document.getElementById("photo-picker").dataset.photo = reader.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("save-collection").addEventListener("click", async () => {
    const title = document.getElementById("f-title").value.trim();
    if (!title) return;
    const personalPhoto = document.getElementById("photo-picker").dataset.photo || null;
    const item = {
      id: existing?.id || uid(),
      title,
      originalTitle: picked.originalTitle || title,
      year: Number(document.getElementById("f-year").value) || null,
      editor: document.getElementById("f-editor").value.trim(),
      support: document.getElementById("f-support").value,
      editionType: document.getElementById("f-edition").value,
      languages: getCheckedLanguages("add"),
      genre: document.getElementById("f-genre").value,
      price: Number(document.getElementById("f-price").value) || 0,
      date: existing?.date || new Date().toISOString().slice(0, 10),
      photo: personalPhoto,
      poster: personalPhoto ? null : picked.poster,
      tmdbId: picked.tmdbId,
      note: document.getElementById("f-note").value.trim(),
    };
    if (isEdit) {
      const idx = state.collection.findIndex((x) => x.id === existing.id);
      if (idx >= 0) state.collection[idx] = item;
    } else {
      state.collection.unshift(item);
    }
    await DB.put("collection", item);
    showSaved();
    closeModal();
    render();
  });
}

// ---- Add / Edit wishlist ----
function openAddWishlistModal(existing = null) {
  const isEdit = Boolean(existing);
  let picked = {
    poster: existing?.poster || null,
    tmdbId: existing?.tmdbId || null,
    originalTitle: existing?.originalTitle || "",
  };

  modalShell(isEdit ? "Modifier l'envie" : "Ajouter une envie", `
    ${tmdbSearchBlockHTML()}

    <div class="field"><div class="field-label">Titre du film</div><input id="w-title" placeholder="ex. The Batman" value="${esc(existing?.title || "")}" /></div>
    <div class="field-row">
      <div class="field"><div class="field-label">Année</div><input id="w-year" placeholder="2022" value="${existing?.year ?? ""}" /></div>
      <div class="field"><div class="field-label">Éditeur</div><input id="w-editor" placeholder="Warner Bros" value="${esc(existing?.editor || "")}" /></div>
    </div>
    <div class="field-row">
      <div class="field"><div class="field-label">Support souhaité</div>
        <select id="w-support">${selectOptionsHTML(SUPPORTS.filter((s) => s !== "Tous"), existing?.support)}</select>
      </div>
      <div class="field"><div class="field-label">Type de boîtier</div>
        <select id="w-edition">${selectOptionsHTML(EDITIONS.filter((e) => e !== "Tous"), existing?.editionType)}</select>
      </div>
    </div>
    <div class="field">
      <div class="field-label">Langues souhaitées</div>
      <div class="lang-row">${languageCheckboxesHTML("wish", existing?.languages || ["VF", "VOSTFR"])}</div>
    </div>
    <div class="field-row">
      <div class="field"><div class="field-label">Priorité</div>
        <select id="w-priority">${selectOptionsHTML(["Haute", "Moyenne", "Basse"], existing?.priority)}</select>
      </div>
      <div class="field"><div class="field-label">Steelbook sorti ?</div>
        <select id="w-status">${selectOptionsHTML(STEELBOOK_STATUS, existing?.steelbookStatus)}</select>
      </div>
    </div>
    <div class="btn-row"><button class="btn-primary" id="save-wishlist">${isEdit ? "Enregistrer les modifications" : "Ajouter à ma liste"}</button></div>
  `);

  wireTmdbSearch(async (movie) => {
    document.getElementById("w-title").value = movie.title;
    if (movie.year) document.getElementById("w-year").value = movie.year;
    picked.tmdbId = movie.tmdbId;
    picked.originalTitle = movie.originalTitle;
    if (movie.posterPath) picked.poster = await window.TMDb.fetchPoster(movie.posterPath);
    document.getElementById("tmdb-results").innerHTML = "";
    document.getElementById("tmdb-query").value = movie.title;
  });

  document.getElementById("save-wishlist").addEventListener("click", async () => {
    const title = document.getElementById("w-title").value.trim();
    if (!title) return;
    const item = {
      id: existing?.id || uid(),
      title,
      originalTitle: picked.originalTitle || title,
      year: Number(document.getElementById("w-year").value) || null,
      editor: document.getElementById("w-editor").value.trim(),
      support: document.getElementById("w-support").value,
      editionType: document.getElementById("w-edition").value,
      languages: getCheckedLanguages("wish"),
      priority: document.getElementById("w-priority").value,
      steelbookStatus: document.getElementById("w-status").value,
      poster: picked.poster,
      tmdbId: picked.tmdbId,
    };
    if (isEdit) {
      const idx = state.wishlist.findIndex((x) => x.id === existing.id);
      if (idx >= 0) state.wishlist[idx] = item;
    } else {
      state.wishlist.unshift(item);
    }
    await DB.put("wishlist", item);
    showSaved();
    closeModal();
    render();
  });
}

function openDetailModal(item, kind) {
  const langs = (item.languages || []).join(", ") || "—";
  const extra = kind === "collection"
    ? `${item.price > 0 ? `<div class="detail-row"><span class="label">Prix payé</span><span class="value">${item.price.toFixed(2)} €</span></div>` : ""}
       <div class="detail-row"><span class="label">Ajouté le</span><span class="value">${formatDate(item.date)}</span></div>
       <div class="detail-row"><span class="label">Langues</span><span class="value">${esc(langs)}</span></div>
       ${item.note ? `<div class="detail-row"><span class="label">Note</span><span class="value">${esc(item.note)}</span></div>` : ""}`
    : `<div class="detail-row"><span class="label">Priorité</span><span class="value">${esc(item.priority)}</span></div>
       <div class="detail-row"><span class="label">Steelbook sorti ?</span><span class="value">${esc(item.steelbookStatus || "—")}</span></div>
       <div class="detail-row"><span class="label">Langues souhaitées</span><span class="value">${esc(langs)}</span></div>`;

  modalShell(item.title, `
    ${coverHTML(item, false)}
    <div style="display:flex;gap:6px;margin:12px 0;flex-wrap:wrap;align-items:center;">
      ${badgeSupport(item.support)}${badgeEdition(item.editionType)}
      <span style="font-size:12px;color:var(--text-dim);">${esc(item.editor || "")} · ${item.year || ""}</span>
    </div>
    ${extra}
    <div class="btn-row">
      <button class="btn-primary" id="edit-btn">
        <svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        Modifier
      </button>
      ${kind === "wishlist" ? `<button class="icon-btn" id="move-btn" title="Déplacer vers ma collection">
          <svg class="icon" viewBox="0 0 24 24" width="17" height="17"><path d="M7 7h10M7 7l4-4M7 7l4 4M17 17H7M17 17l-4 4M17 17l-4-4"/></svg>
        </button>` : ""}
      <button class="btn-danger" id="delete-btn"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button>
    </div>
  `);

  document.getElementById("edit-btn").addEventListener("click", () => {
    closeModal();
    if (kind === "collection") openAddCollectionModal(item);
    else openAddWishlistModal(item);
  });

  if (kind === "wishlist") {
    document.getElementById("move-btn").addEventListener("click", async () => {
      state.wishlist = state.wishlist.filter((x) => x.id !== item.id);
      await DB.remove("wishlist", item.id);
      const moved = {
        id: uid(), title: item.title, originalTitle: item.originalTitle, year: item.year, editor: item.editor,
        support: item.support, editionType: item.editionType, languages: item.languages, genre: "—", price: 0,
        date: new Date().toISOString().slice(0, 10), photo: null, poster: item.poster, tmdbId: item.tmdbId,
        note: "Ajouté depuis la liste d'envie",
      };
      state.collection.unshift(moved);
      await DB.put("collection", moved);
      showSaved();
      closeModal();
      render();
    });
  }

  document.getElementById("delete-btn").addEventListener("click", async () => {
    if (kind === "collection") {
      state.collection = state.collection.filter((x) => x.id !== item.id);
      await DB.remove("collection", item.id);
    } else {
      state.wishlist = state.wishlist.filter((x) => x.id !== item.id);
      await DB.remove("wishlist", item.id);
    }
    showSaved();
    closeModal();
    render();
  });
}

// ---------- Import Letterboxd (CSV) ----------
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] || "").trim()])));
}

function openLetterboxdImportModal() {
  modalShell("Importer depuis Letterboxd", `
    <p style="font-size:12.5px;color:var(--text-dim);line-height:1.5;margin-bottom:14px;">
      Sur Letterboxd : Paramètres → Import &amp; Export → "Export Data". Vous obtenez un .zip
      contenant plusieurs .csv (watchlist.csv, diary.csv…). Choisissez-en un ci-dessous.
    </p>
    <input type="file" id="csv-input" accept=".csv" style="display:none" />
    <button class="photo-picker" id="csv-picker" style="height:80px;">
      <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
      <span>Choisir un fichier .csv</span>
    </button>
    <div id="import-progress"></div>
  `);

  document.getElementById("csv-picker").addEventListener("click", () => document.getElementById("csv-input").click());
  document.getElementById("csv-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text).filter((r) => r.name);
    if (rows.length === 0) {
      document.getElementById("import-progress").innerHTML = `<div class="tmdb-loading">Aucun film trouvé dans ce fichier.</div>`;
      return;
    }

    const existingTitles = new Set(
      [...state.wishlist, ...state.collection].map((it) => `${it.title.toLowerCase()}_${it.year || ""}`)
    );
    const progressEl = document.getElementById("import-progress");
    let added = 0, skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const title = r.name;
      const year = Number(r.year) || null;
      progressEl.innerHTML = `<div class="tmdb-loading">Import ${i + 1} / ${rows.length}… (${added} ajoutés)</div>`;

      const key = `${title.toLowerCase()}_${year || ""}`;
      if (existingTitles.has(key)) { skipped++; continue; }
      existingTitles.add(key);

      let poster = null, tmdbId = null, displayTitle = title, originalTitle = title;
      if (window.TMDb.ready()) {
        try {
          const results = await window.TMDb.search(title);
          const match = results.find((m) => m.year === year) || results[0];
          if (match) {
            tmdbId = match.tmdbId;
            displayTitle = match.title || title;       // titre en français si TMDb le connaît
            originalTitle = match.originalTitle || title;
            if (match.posterPath) poster = await window.TMDb.fetchPoster(match.posterPath);
          }
        } catch { /* on continue avec le titre du CSV si TMDb échoue */ }
      }

      const item = {
        id: uid(), title: displayTitle, originalTitle, year, editor: "",
        support: "Blu-ray 4K", editionType: "Classique", languages: ["VF", "VOSTFR"],
        priority: "Moyenne", steelbookStatus: "En cours", poster, tmdbId,
      };
      state.wishlist.unshift(item);
      await DB.put("wishlist", item);
      added++;
    }

    progressEl.innerHTML = `<div class="tmdb-loading">Terminé — ${added} film(s) ajouté(s), ${skipped} déjà présent(s).</div>`;
    showSaved();
    render();
  });
}

// ---------- Retraduire les titres existants en français via TMDb ----------
async function retranslateTitles() {
  if (!window.TMDb.ready()) {
    modalShell("Traduire en français", `<div class="tmdb-warning">
      Configurez votre clé TMDb dans <code>config.js</code> pour utiliser cette fonction.
    </div>`);
    return;
  }
  modalShell("Traduire en français", `<div id="retranslate-progress"><div class="tmdb-loading">Préparation…</div></div>`);
  const progressEl = document.getElementById("retranslate-progress");

  const allItems = [
    ...state.wishlist.map((it) => ({ it, store: "wishlist" })),
    ...state.collection.map((it) => ({ it, store: "collection" })),
  ];
  let updated = 0;

  for (let i = 0; i < allItems.length; i++) {
    const { it, store } = allItems[i];
    progressEl.innerHTML = `<div class="tmdb-loading">Vérification ${i + 1} / ${allItems.length}… (${updated} traduits)</div>`;
    try {
      const query = it.originalTitle || it.title;
      const results = await window.TMDb.search(query);
      const match = results.find((m) => m.year === it.year) || results[0];
      if (match && match.title && match.title !== it.title) {
        it.title = match.title;
        if (!it.originalTitle) it.originalTitle = match.originalTitle;
        if (!it.poster && !it.photo && match.posterPath) {
          it.poster = await window.TMDb.fetchPoster(match.posterPath);
        }
        await DB.put(store, it);
        updated++;
      }
    } catch { /* on ignore ce titre et on continue avec le suivant */ }
  }

  progressEl.innerHTML = `<div class="tmdb-loading">Terminé — ${updated} titre(s) mis à jour.</div>`;
  showSaved();
  render();
}

init();
