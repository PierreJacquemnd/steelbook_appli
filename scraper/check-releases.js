/**
 * SteelVault — scraper de surveillance.
 *
 * Tourne CÔTÉ SERVEUR (jamais dans le navigateur : les sites cibles
 * bloqueraient une requête directe depuis le téléphone via CORS).
 * Exécuté périodiquement par un job planifié gratuit —
 * voir .github/workflows/steelbook-watch.yml.
 *
 * Sources couvertes :
 *  - steelbookpro.fr        → flux RSS (natif WordPress, le plus stable)
 *  - 4k-ultra-hd.fr         → page listant les steelbooks 4K (HTML)
 *  - dealabs.com            → RSS du groupe Blu-ray 4K, repli en HTML,
 *                              filtré sur le mot "steelbook"
 *
 * DEUX sorties, pour DEUX usages différents :
 *  1. Notification immédiate sur le téléphone via ntfy.sh (push, gratuit,
 *     sans backend). Nécessite l'app ntfy + NTFY_TOPIC (voir README).
 *  2. Un fichier public-data/alerts.json commité dans le dépôt : c'est ce
 *     fichier que l'onglet "Alertes" de l'appli va lire directement, pour
 *     que les vraies alertes s'affichent DANS SteelVault (pas dans une
 *     appli séparée).
 *
 * ⚠️ Limite importante : ce scraper alerte sur TOUTES les nouveautés
 * steelbook repérées, pas seulement celles de votre liste d'envie — votre
 * liste vit uniquement sur votre téléphone (IndexedDB) et n'est pas
 * accessible depuis ce script.
 *
 * ⚠️ Respectez les conditions d'utilisation des sites, limitez la
 * fréquence des requêtes, identifiez-vous avec un User-Agent honnête,
 * et attendez-vous à devoir ajuster les sélecteurs si un site change de
 * thème — c'est le principal entretien qu'un scraper demande dans le temps.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";

const NTFY_TOPIC = process.env.NTFY_TOPIC || ""; // défini en secret GitHub Actions
const USER_AGENT = "SteelVaultBot/1.0 (+usage personnel, projet perso non commercial)";
const STATE_DIR = new URL("./state/", import.meta.url);
const PUBLIC_DIR = new URL("../public-data/", import.meta.url);
const TODAY = new Date().toISOString().slice(0, 10);

async function loadSeen(name) {
  try {
    return JSON.parse(await readFile(new URL(`${name}.json`, STATE_DIR), "utf-8"));
  } catch {
    return [];
  }
}

async function saveSeen(name, list) {
  await mkdir(STATE_DIR, { recursive: true });
  await writeFile(new URL(`${name}.json`, STATE_DIR), JSON.stringify(list.slice(-800), null, 2));
}

async function notify(title, message, link) {
  console.log(`🔔 ${title} — ${message}`);
  if (!NTFY_TOPIC) return;
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: { Title: title, ...(link ? { Click: link } : {}), Tags: "cd,dvd" },
      body: message,
    });
  } catch (err) {
    console.error("Échec envoi ntfy:", err.message);
  }
}

function makeId(link) {
  return "a_" + Buffer.from(link).toString("base64url").slice(0, 16);
}

// ---------- Source 1 : steelbookpro.fr (RSS) ----------
async function checkSteelbookPro() {
  const seen = await loadSeen("steelbookpro");
  const res = await fetch("https://steelbookpro.fr/feed/", { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`steelbookpro.fr: HTTP ${res.status}`);
  const xml = await res.text();
  const feed = new XMLParser({ ignoreAttributes: false }).parse(xml);
  const items = feed?.rss?.channel?.item || [];

  const fresh = [];
  for (const item of items) {
    const link = item.link;
    if (!link || seen.includes(link)) continue;
    fresh.push({
      id: makeId(link), kind: "sortie", title: item.title,
      source: "steelbookpro.fr", date: TODAY, link,
      detail: (item.description || "").replace(/<[^>]+>/g, "").slice(0, 160).trim(),
    });
  }
  for (const f of fresh) await notify("Steelbook Pro — nouvel article", f.title, f.link);
  await saveSeen("steelbookpro", [...seen, ...fresh.map((f) => f.link)]);
  return fresh;
}

// ---------- Source 2 : 4k-ultra-hd.fr/steelbook-4k (HTML) ----------
async function check4kUltraHD() {
  const seen = await loadSeen("4k-ultra-hd");
  const res = await fetch("https://4k-ultra-hd.fr/steelbook-4k", { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`4k-ultra-hd.fr: HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const seenLinks = new Set();
  const fresh = [];

  $('a[href*="/film/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href || seenLinks.has(href)) return;
    seenLinks.add(href);

    const block = $(el).closest("li, article, div");
    const text = block.text().replace(/\s+/g, " ").trim();
    const title = $(el).text().trim() || $(el).find("img").attr("alt") || "";
    if (!title || seen.includes(href)) return;

    const priceMatch = text.match(/(\d+[,.]\d{2})\s?€/);
    const dateMatch = text.match(/Sortie\s*\(?([^:)]+)\)?\s*:/i);
    const detail = [dateMatch ? `Sortie : ${dateMatch[1].trim()}` : null, priceMatch ? `${priceMatch[1]} €` : null]
      .filter(Boolean).join(" · ") || "Nouvelle fiche détectée";

    fresh.push({ id: makeId(href), kind: "sortie", title, source: "4k-ultra-hd.fr", date: TODAY, link: href, detail });
  });

  for (const f of fresh) await notify("4K-Ultra-HD.fr — nouveau steelbook", `${f.title} — ${f.detail}`, f.link);
  await saveSeen("4k-ultra-hd", [...seen, ...fresh.map((f) => f.link)]);
  return fresh;
}

// ---------- Source 3 : Dealabs (RSS si dispo, sinon HTML) ----------
async function checkDealabs() {
  const seen = await loadSeen("dealabs");
  let fresh = [];

  try {
    const res = await fetch("https://www.dealabs.com/rss/groupe/blu-ray-4k", { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const feed = new XMLParser({ ignoreAttributes: false }).parse(xml);
    const items = feed?.rss?.channel?.item || [];
    for (const item of items) {
      const link = item.link;
      const title = item.title || "";
      if (!link || seen.includes(link)) continue;
      if (!/steelbook/i.test(title) && !/steelbook/i.test(item.description || "")) continue;
      fresh.push({
        id: makeId(link), kind: "solde", title, source: "dealabs.com", date: TODAY, link,
        detail: (item.description || "").replace(/<[^>]+>/g, "").slice(0, 160).trim() || "Bon plan repéré sur Dealabs",
      });
    }
  } catch (err) {
    console.warn("Dealabs RSS indisponible, tentative HTML:", err.message);
    const res = await fetch("https://www.dealabs.com/groupe/blu-ray-4k", { headers: { "User-Agent": USER_AGENT } });
    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      $('a[href*="/bons-plans/"]').each((_, el) => {
        const href = $(el).attr("href");
        const title = $(el).text().trim();
        if (!href || !title || seen.includes(href) || !/steelbook/i.test(title)) return;
        fresh.push({ id: makeId(href), kind: "solde", title, source: "dealabs.com", date: TODAY, link: href, detail: "Bon plan repéré sur Dealabs" });
      });
    }
  }

  for (const f of fresh) await notify("Dealabs — bon plan steelbook", f.title, f.link);
  await saveSeen("dealabs", [...seen, ...fresh.map((f) => f.link)]);
  return fresh;
}

// ---------- Fichier public lu par l'appli ----------
async function publishAlertsFeed(newItems) {
  await mkdir(PUBLIC_DIR, { recursive: true });
  const feedFile = new URL("alerts.json", PUBLIC_DIR);
  let existing = [];
  try {
    existing = JSON.parse(await readFile(feedFile, "utf-8"));
  } catch { /* premier run, fichier pas encore créé */ }

  const combined = [...newItems, ...existing]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 100);

  await writeFile(feedFile, JSON.stringify({ updatedAt: new Date().toISOString(), alerts: combined }, null, 2));
  console.log(`📄 public-data/alerts.json mis à jour (${combined.length} alertes, ${newItems.length} nouvelles)`);
}

async function main() {
  const results = await Promise.allSettled([checkSteelbookPro(), check4kUltraHD(), checkDealabs()]);

  const labels = ["steelbookpro.fr", "4k-ultra-hd.fr", "dealabs.com"];
  let allFresh = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(`✅ ${labels[i]} : ${r.value.length} nouveauté(s)`);
      allFresh = allFresh.concat(r.value);
    } else {
      console.error(`❌ ${labels[i]} :`, r.reason.message);
    }
  });

  await publishAlertsFeed(allFresh);

  if (results.every((r) => r.status === "rejected")) process.exit(1);
}

main();
