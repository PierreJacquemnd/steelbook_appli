// TMDb (The Movie Database) — catalogue public de ~1 million de films.
// On ne stocke pas cette base localement (impossible sur un téléphone) :
// on interroge l'API en direct à chaque recherche, ce qui revient au même
// pour l'usage ("trouver n'importe quel film et l'ajouter à ma liste").
// Nécessite une connexion internet et une clé API gratuite (voir config.js).

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

function tmdbReady() {
  const key = window.CONFIG?.TMDB_API_KEY;
  return Boolean(key && key !== "COLLEZ_VOTRE_CLE_TMDB_ICI");
}

async function tmdbSearchMovies(query) {
  if (!tmdbReady()) throw new Error("no-api-key");
  if (!query || query.trim().length < 2) return [];
  const url = `${TMDB_BASE}/search/movie?api_key=${window.CONFIG.TMDB_API_KEY}` +
    `&language=${window.CONFIG.TMDB_LANGUAGE || "fr-FR"}` +
    `&query=${encodeURIComponent(query.trim())}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`tmdb-error-${res.status}`);
  const data = await res.json();
  return (data.results || []).map((m) => ({
    tmdbId: m.id,
    title: m.title,
    originalTitle: m.original_title,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    overview: m.overview,
    posterPath: m.poster_path ? TMDB_IMG + m.poster_path : null,
    popularity: m.popularity,
  })).sort((a, b) => b.popularity - a.popularity);
}

// Télécharge l'affiche et la convertit en base64 pour un vrai stockage
// hors-ligne dans IndexedDB (une URL distante ne fonctionnerait plus sans
// connexion). Usage personnel non commercial, conforme aux conditions TMDb.
async function tmdbFetchPosterAsBase64(posterUrl) {
  if (!posterUrl) return null;
  try {
    const res = await fetch(posterUrl);
    if (!res.ok) throw new Error("bad status");
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // Le téléchargement direct peut être bloqué (CORS). On garde quand même
    // l'URL TMDb : elle s'affiche très bien (comme dans les résultats de
    // recherche), simplement il faudra être en ligne pour la voir, au lieu
    // d'une vraie copie locale disponible hors-ligne.
    return posterUrl;
  }
}

window.TMDb = { ready: tmdbReady, search: tmdbSearchMovies, fetchPoster: tmdbFetchPosterAsBase64 };
