// Minimal IndexedDB wrapper — no external library needed.
// Real, persistent, on-device storage: survives closing the app,
// restarting the phone, and works fully offline.

const DB_NAME = "steelvault";
const DB_VERSION = 2;
const STORES = ["collection", "wishlist", "alerts", "dismissed", "meta"];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(storeName, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = fn(store);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
  });
}

const DB = {
  async getAll(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async put(storeName, item) {
    return withStore(storeName, "readwrite", (store) => store.put(item));
  },

  async putMany(storeName, items) {
    return withStore(storeName, "readwrite", (store) => {
      items.forEach((item) => store.put(item));
    });
  },

  async replaceAll(storeName, items) {
    return withStore(storeName, "readwrite", (store) => {
      store.clear();
      items.forEach((item) => store.put(item));
    });
  },

  async remove(storeName, id) {
    return withStore(storeName, "readwrite", (store) => store.delete(id));
  },

  async seedIfEmpty(storeName, seedItems) {
    const existing = await this.getAll(storeName);
    if (existing.length === 0 && seedItems.length > 0) {
      await this.putMany(storeName, seedItems);
      return seedItems;
    }
    return existing;
  },
};

window.DB = DB;
